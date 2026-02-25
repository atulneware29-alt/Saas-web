const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getProjectStats,
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');
const {
  createProjectValidation,
  updateProjectValidation,
} = require('../validations/projectValidation');

// Protect all routes
router.use(protect);

// Project stats route
router.get('/:id/stats', getProjectStats);

// CRUD routes
router.get('/', getProjects);
router.get('/:id', getProject);
router.post('/', authorize('admin', 'manager'), createProjectValidation, createProject);
router.put('/:id', authorize('admin', 'manager'), updateProjectValidation, updateProject);
router.delete('/:id', authorize('admin', 'manager'), deleteProject);

module.exports = router;
