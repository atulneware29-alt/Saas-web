const Project = require('../models/Project');
const Task = require('../models/Task');
const ApiError = require('../utils/ApiError');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, priority, search } = req.query;

    const query = {};

    // Filter based on user role
    if (req.user.role === 'user') {
      // Users can only see projects they're members of or own
      query.$or = [
        { owner: req.user._id },
        { members: req.user._id },
      ];
    } else if (req.user.role === 'manager') {
      // Managers can see their own projects and projects they're members of
      query.$or = [
        { owner: req.user._id },
        { members: req.user._id },
      ];
    }

    // Additional filters
    if (status) {
      query.status = status;
    }
    if (priority) {
      query.priority = priority;
    }
    if (search) {
      query.$or = query.$or || [];
      query.$or.push(
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      );
    }

    const projects = await Project.find(query)
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Project.countDocuments(query);

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      projects,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
exports.getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar');

    if (!project) {
      return next(new ApiError(404, 'Project not found'));
    }

    // Check access based on role
    if (req.user.role === 'user') {
      const isMember = project.members.some(
        (m) => m._id.toString() === req.user._id.toString()
      );
      const isOwner = project.owner._id.toString() === req.user._id.toString();
      if (!isMember && !isOwner) {
        return next(new ApiError(403, 'Not authorized to access this project'));
      }
    }

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create project
// @route   POST /api/projects
// @access  Private (Admin, Manager)
exports.createProject = async (req, res, next) => {
  try {
    const { name, description, status, priority, members } = req.body;

    // Check if project name already exists
    const existingProject = await Project.findOne({ name });
    if (existingProject) {
      return next(new ApiError(400, 'Project name already exists'));
    }

    const project = await Project.create({
      name,
      description,
      status,
      priority,
      owner: req.user._id,
      members: members || [],
    });

    await project.populate('owner', 'name email avatar');
    await project.populate('members', 'name email avatar');

    res.status(201).json({
      success: true,
      project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return next(new ApiError(404, 'Project not found'));
    }

    // Check ownership
    const isOwner = project.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return next(new ApiError(403, 'Not authorized to update this project'));
    }

    // Check if name is being changed and if it's already taken
    if (req.body.name && req.body.name !== project.name) {
      const existingProject = await Project.findOne({ name: req.body.name });
      if (existingProject) {
        return next(new ApiError(400, 'Project name already exists'));
      }
    }

    const { name, description, status, priority, members } = req.body;

    project = await Project.findByIdAndUpdate(
      req.params.id,
      { name, description, status, priority, members },
      { new: true, runValidators: true }
    )
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar');

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Admin, Manager)
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return next(new ApiError(404, 'Project not found'));
    }

    // Check ownership
    const isOwner = project.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return next(new ApiError(403, 'Not authorized to delete this project'));
    }

    // Delete all tasks associated with the project
    await Task.deleteMany({ project: project._id });

    // Delete the project
    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get project statistics
// @route   GET /api/projects/:id/stats
// @access  Private
exports.getProjectStats = async (req, res, next) => {
  try {
    const projectId = req.params.id;

    const project = await Project.findById(projectId);

    if (!project) {
      return next(new ApiError(404, 'Project not found'));
    }

    // Get task counts by status
    const taskStats = await Task.aggregate([
      { $match: { project: project._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Get task counts by priority
    const priorityStats = await Task.aggregate([
      { $match: { project: project._id } },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 },
        },
      },
    ]);

    // Get total tasks
    const totalTasks = await Task.countDocuments({ project: projectId });

    // Get completed tasks
    const completedTasks = await Task.countDocuments({
      project: projectId,
      status: 'completed',
    });

    res.status(200).json({
      success: true,
      stats: {
        totalTasks,
        completedTasks,
        completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
        taskStats: taskStats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {}),
        priorityStats: priorityStats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {}),
      },
    });
  } catch (error) {
    next(error);
  }
};
