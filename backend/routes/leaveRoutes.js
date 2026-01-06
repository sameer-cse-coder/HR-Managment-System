import express from 'express';
import {
  getLeaves,
  createLeave,
  updateLeaveStatus,
  deleteLeave
} from '../controllers/leaveController.js';

const router = express.Router();

router.route('/')
  .get(getLeaves)
  .post(createLeave);

router.route('/:id')
  .put(updateLeaveStatus)
  .delete(deleteLeave);

export default router;
