import Attendance from '../models/Attendance.js';

// @desc    Get all attendance records
// @route   GET /api/attendance
// @access  Private (Admin, HR)
export const getAttendance = async (req, res) => {
  try {
    const { startDate, endDate, employeeId } = req.query;
    
    const query = {};
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (employeeId) {
      query.employee = employeeId;
    }

    const attendance = await Attendance.find(query)
      .populate('employee', 'firstName lastName employeeId')
      .sort('-date');

    res.json(attendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Create/Mark attendance
// @route   POST /api/attendance
// @access  Public
export const createAttendance = async (req, res) => {
  try {
    const { employee, date, checkIn, checkOut, status, notes } = req.body;

    const attendance = await Attendance.create({
      employee,
      date,
      checkIn,
      checkOut,
      status,
      notes
    });

    const populatedAttendance = await Attendance.findById(attendance._id)
      .populate('employee', 'firstName lastName employeeId');

    res.status(201).json(populatedAttendance);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Attendance already marked for this date' });
    }
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update attendance
// @route   PUT /api/attendance/:id
// @access  Private (Admin, HR)
export const updateAttendance = async (req, res) => {
  try {
    const { checkIn, checkOut, status, notes } = req.body;

    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    if (checkIn) attendance.checkIn = checkIn;
    if (checkOut) attendance.checkOut = checkOut;
    if (status) attendance.status = status;
    if (notes !== undefined) attendance.notes = notes;

    const updatedAttendance = await attendance.save();

    const populatedAttendance = await Attendance.findById(updatedAttendance._id)
      .populate('employee', 'firstName lastName employeeId');

    res.json(populatedAttendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete attendance record
// @route   DELETE /api/attendance/:id
// @access  Private (Admin)
export const deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    await Attendance.findByIdAndDelete(req.params.id);
    res.json({ message: 'Attendance record deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
