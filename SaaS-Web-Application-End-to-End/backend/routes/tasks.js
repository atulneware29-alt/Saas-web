const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTasksByProject,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const {
  createTaskValidation,
  updateTaskValidation,
} = require('../validations/taskValidation');

// Protect all routes
router.use(protect);

// Get tasks by project
router.get('/project/:projectId', getTasksByProject);

// CRUD routes
router.get('/', getTasks);
router.get('/:id', getTask);
router.post('/', createTaskValidation, createTask);
router.put('/:id', updateTaskValidation, updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
