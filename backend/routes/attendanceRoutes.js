import express from 'express';
import {
  getAttendance,
  createAttendance,
  updateAttendance,
  deleteAttendance
} from '../controllers/attendanceController.js';

const router = express.Router();

router.route('/')
  .get(getAttendance)
  .post(createAttendance);

router.route('/:id')
  .put(updateAttendance)
  .delete(deleteAttendance);

export default router;
