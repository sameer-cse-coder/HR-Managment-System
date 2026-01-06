import Leave from '../models/Leave.js';
import Employee from '../models/Employee.js';

// @desc    Get all leaves
// @route   GET /api/leaves
// @access  Private (Admin, HR)
export const getLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate('employee', 'firstName lastName employeeId')
      .sort('-createdAt');

    res.json(leaves);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Create leave request
// @route   POST /api/leaves
// @access  Public
export const createLeave = async (req, res) => {
  try {
    const { employeeId, leaveType, startDate, endDate, reason } = req.body;

    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    const leave = await Leave.create({
      employee: employeeId,
      leaveType,
      startDate,
      endDate,
      reason
    });

    const populatedLeave = await Leave.findById(leave._id)
      .populate('employee', 'firstName lastName employeeId');

    res.status(201).json(populatedLeave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update leave status
// @route   PUT /api/leaves/:id
// @access  Private (Admin, HR)
export const updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    leave.status = status;
    if (status === 'approved' || status === 'rejected') {
      leave.approvedAt = Date.now();
    }

    const updatedLeave = await leave.save();

    const populatedLeave = await Leave.findById(updatedLeave._id)
      .populate('employee', 'firstName lastName employeeId')
      ;

    res.json(populatedLeave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete leave request
// @route   DELETE /api/leaves/:id
// @access  Private
export const deleteLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    await Leave.findByIdAndDelete(req.params.id);
    res.json({ message: 'Leave request deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
