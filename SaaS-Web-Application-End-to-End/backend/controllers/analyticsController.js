const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');
const ApiError = require('../utils/ApiError');

// @desc    Get dashboard overview statistics
// @route   GET /api/analytics/overview
// @access  Private
exports.getDashboardStats = async (req, res, next) => {
  try {
    let stats = {};

    // Get projects for the user based on role
    let projectQuery = {};
    if (req.user.role === 'user') {
      projectQuery = {
        $or: [{ owner: req.user._id }, { members: req.user._id }],
      };
    } else if (req.user.role === 'manager') {
      projectQuery = {
        $or: [{ owner: req.user._id }, { members: req.user._id }],
      };
    }

    const userProjects = await Project.find(projectQuery).select('_id');
    const projectIds = userProjects.map((p) => p._id);

    // Basic counts
    stats.totalProjects = projectIds.length;
    stats.activeProjects = await Project.countDocuments({
      _id: { $in: projectIds },
      status: 'active',
    });
    stats.completedProjects = await Project.countDocuments({
      _id: { $in: projectIds },
      status: 'completed',
    });

    // Task counts
    const taskQuery = { project: { $in: projectIds } };
    stats.totalTasks = await Task.countDocuments(taskQuery);
    stats.completedTasks = await Task.countDocuments({
      ...taskQuery,
      status: 'completed',
    });
    stats.inProgressTasks = await Task.countDocuments({
      ...taskQuery,
      status: 'in-progress',
    });
    stats.todoTasks = await Task.countDocuments({
      ...taskQuery,
      status: 'todo',
    });

    // Team members (if admin or manager)
    if (req.user.role === 'admin') {
      stats.totalUsers = await User.countDocuments({ isActive: true });
      stats.teamMembers = await User.countDocuments({ isActive: true, role: 'user' });
      stats.managers = await User.countDocuments({ isActive: true, role: 'manager' });
    } else if (req.user.role === 'manager') {
      stats.teamMembers = await User.countDocuments({ isActive: true });
    }

    // Calculate completion rate
    stats.completionRate = stats.totalTasks > 0
      ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
      : 0;

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get chart data for dashboard
// @route   GET /api/analytics/charts
// @access  Private
exports.getChartData = async (req, res, next) => {
  try {
    // Get projects for the user based on role
    let projectQuery = {};
    if (req.user.role === 'user') {
      projectQuery = {
        $or: [{ owner: req.user._id }, { members: req.user._id }],
      };
    } else if (req.user.role === 'manager') {
      projectQuery = {
        $or: [{ owner: req.user._id }, { members: req.user._id }],
      };
    }

    const userProjects = await Project.find(projectQuery).select('_id');
    const projectIds = userProjects.map((p) => p._id);

    // Project status distribution
    const projectStatusData = await Project.aggregate([
      { $match: { _id: { $in: projectIds } } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const projectStatusChart = projectStatusData.map((item) => ({
      name: item._id,
      value: item.count,
    }));

    // Task priority distribution
    const taskPriorityData = await Task.aggregate([
      { $match: { project: { $in: projectIds } } },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 },
        },
      },
    ]);

    const taskPriorityChart = taskPriorityData.map((item) => ({
      name: item._id,
      value: item.count,
    }));

    // Task status distribution
    const taskStatusData = await Task.aggregate([
      { $match: { project: { $in: projectIds } } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const taskStatusChart = taskStatusData.map((item) => ({
      name: item._id,
      value: item.count,
    }));

    // Last 7 days task completion trend
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      last7Days.push(date);
    }

    const completionTrend = await Task.aggregate([
      {
        $match: {
          project: { $in: projectIds },
          status: 'completed',
          updatedAt: { $gte: last7Days[0] },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const completionTrendChart = last7Days.map((date) => {
      const dateStr = date.toISOString().split('T')[0];
      const found = completionTrend.find((c) => c._id === dateStr);
      return {
        date: dateStr,
        completed: found ? found.count : 0,
      };
    });

    // Top performing team members (for admins/managers)
    let topMembers = [];
    if (req.user.role === 'admin' || req.user.role === 'manager') {
      const topMembersData = await Task.aggregate([
        { $match: { project: { $in: projectIds }, status: 'completed' } },
        {
          $group: {
            _id: '$assignedTo',
            completedTasks: { $sum: 1 },
          },
        },
        { $sort: { completedTasks: -1 } },
        { $limit: 5 },
      ]);

      const userIds = topMembersData
        .filter((t) => t._id)
        .map((t) => t._id);
      const users = await User.find({ _id: { $in: userIds } }).select('name');

      topMembers = topMembersData
        .filter((t) => t._id)
        .map((t) => {
          const user = users.find(
            (u) => u._id.toString() === t._id.toString()
          );
          return {
            name: user ? user.name : 'Unknown',
            completedTasks: t.completedTasks,
          };
        });
    }

    res.status(200).json({
      success: true,
      charts: {
        projectStatus: projectStatusChart,
        taskPriority: taskPriorityChart,
        taskStatus: taskStatusChart,
        completionTrend: completionTrendChart,
        topMembers,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recent activity
// @route   GET /api/analytics/activity
// @access  Private
exports.getRecentActivity = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    // Get projects for the user based on role
    let projectQuery = {};
    if (req.user.role === 'user') {
      projectQuery = {
        $or: [{ owner: req.user._id }, { members: req.user._id }],
      };
    } else if (req.user.role === 'manager') {
      projectQuery = {
        $or: [{ owner: req.user._id }, { members: req.user._id }],
      };
    }

    const userProjects = await Project.find(projectQuery).select('_id');
    const projectIds = userProjects.map((p) => p._id);

    // Get recent tasks
    const recentTasks = await Task.find({ project: { $in: projectIds } })
      .populate('project', 'name')
      .populate('assignedTo', 'name')
      .populate('createdBy', 'name')
      .sort({ updatedAt: -1 })
      .limit(limit);

    const activity = recentTasks.map((task) => ({
      type: 'task',
      action: task.status === 'completed' ? 'completed' : 'updated',
      item: {
        id: task._id,
        title: task.title,
        status: task.status,
      },
      project: task.project,
      user: task.assignedTo || task.createdBy,
      date: task.updatedAt,
    }));

    res.status(200).json({
      success: true,
      activity,
    });
  } catch (error) {
    next(error);
  }
};
