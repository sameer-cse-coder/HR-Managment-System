import Employee from '../models/Employee.js';

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private (Admin, HR)
export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({ isActive: true })
      .populate('department', 'name')
      .populate('manager', 'firstName lastName');

    res.json(employees);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get single employee
// @route   GET /api/employees/:id
// @access  Private
export const getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate('department', 'name')
      .populate('manager', 'firstName lastName');

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Create employee
// @route   POST /api/employees
// @access  Private (Admin, HR)
export const createEmployee = async (req, res) => {
  try {
    const { email, firstName, lastName, employeeId, department, manager, position, phone } = req.body;

    // Check if employeeId exists
    const employeeExists = await Employee.findOne({ employeeId });
    if (employeeExists) {
      return res.status(400).json({ message: 'Employee ID already exists' });
    }

    const emailExists = await Employee.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Create employee
    const employee = await Employee.create({
      email,
      firstName,
      lastName,
      employeeId,
      department,
      manager,
      position,
      phone
    });

    const populatedEmployee = await Employee.findById(employee._id)
      .populate('department', 'name')
      .populate('manager', 'firstName lastName');

    res.status(201).json(populatedEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private (Admin, HR)
export const updateEmployee = async (req, res) => {
  try {
    const { email, firstName, lastName, department, manager, position, phone, isActive } = req.body;

    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    if (email && email !== employee.email) {
      const emailExists = await Employee.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      employee.email = email;
    }
    employee.firstName = firstName || employee.firstName;
    employee.lastName = lastName || employee.lastName;
    employee.department = department || employee.department;
    employee.manager = manager || employee.manager;
    employee.position = position || employee.position;
    employee.phone = phone || employee.phone;
    if (isActive !== undefined) employee.isActive = isActive;

    const updatedEmployee = await employee.save();

    const populatedEmployee = await Employee.findById(updatedEmployee._id)
      .populate('department', 'name')
      .populate('manager', 'firstName lastName');

    res.json(populatedEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private (Admin)
export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Soft delete
    employee.isActive = false;
    await employee.save();

    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
