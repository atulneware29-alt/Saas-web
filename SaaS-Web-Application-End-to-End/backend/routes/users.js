const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getTeamMembers,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');
const { updateUserValidation } = require('../validations/authValidation');

// Protect all routes
router.use(protect);

// Team members route (accessible to all authenticated users)
router.get('/team', getTeamMembers);

// Admin and Manager routes
router.get('/', authorize('admin', 'manager'), getUsers);
router.get('/:id', authorize('admin', 'manager'), getUser);

// Admin only routes
router.post('/', authorize('admin'), createUser);
router.put('/:id', authorize('admin', 'manager'), updateUserValidation, updateUser);
router.delete('/:id', authorize('admin'), deleteUser);

module.exports = router;
