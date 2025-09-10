const { Router } = require('express');
const authenticateToken = require('../../middleware/auth.js');
const controller = require('../../controllers/HR/employeeController.js');

const router = Router();

// log everything that hits this router
router.use((req, _res, next) => {
  console.log(`[employees-router] ${req.method} ${req.originalUrl} -> path=${req.path}`);
  next();
});

router.get('/', authenticateToken, controller.index);
router.get('/:id', authenticateToken, controller.show);
router.post('/', authenticateToken, controller.create);
router.put('/:id', authenticateToken, controller.update);
router.delete('/:id', authenticateToken, controller.destroy);

module.exports = router;

const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize1 = new Sequelize('gj', 'sa', '@Gaja2024', {
  dialect: 'mssql'
});

const sequelize = new Sequelize('GJ_DATA', process.env.USER, process.env.PASSWORD, {
  host: process.env.HOST,
  dialect: 'mssql',
  dialectOptions: {
    options: {
      encrypt: false,
      trustServerCertificate: true
    }
  }
});

const employee = sequelize.define("EMPLOYEE1", {
  ID_EMP: {
    autoIncrement: true,
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true
  },
  
  NAME: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  
  ADDRESS: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  
  PHONE: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  
  EMAIL: {
    type: DataTypes.STRING(300),
    allowNull: true
  },
  
  COMMENT: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  
  CONTRACT_START: {
    type: DataTypes.DATE,
    allowNull: true
  },
  
  CONTRACT_END: {
    type: DataTypes.DATE,
    allowNull: true
  },
  
  TITLE: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  
  NATIONALITY: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  
  NUM_OF_CHILDREN: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  
  EMPLOYER_REF: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  
  BANK: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  
  INVESTMENT: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  
  FINANCE_NUM: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  
  TYPE_OF_RECRUITMENT: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  
  DEGREE: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  
  TYPE_OF_INSURANCE: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  
  NUM_OF_INSURANCE: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  
  ACCOUNT_NUMBER: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  
  DATE_OF_BIRTH: {
    type: DataTypes.DATE,
    allowNull: true
  },
  
  PICTURE: {
    type: DataTypes.BLOB('long'),
    allowNull: true
  },
  
  MARITAL_STATUS: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  
  PLACE_OF_BIRTH: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  
  NUM_CIN: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  
  ISSUING_AUTH: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  
  FAM_BOOK_NUM: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  
  FAM_BOOK_ISSUING_AUTH: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  
  PASSPORT_NUM: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  
  PASSPORT_ISSUING_AUTH: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  
  ANNUAL_LEAVE_BAL: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  
  GENDER: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  
  BLOOD_TYPE: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  
  DRIVER_LIC_NUM: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  
  NAME_ENGLISH: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  
  SCIENTIFIC_CERT: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  
  BASIC_SALARY: {
    type: DataTypes.DECIMAL(19, 4),
    allowNull: true
  },
  
  STATE: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  
  NUM_NATIONAL: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  
  IS_FOREINGHT: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  
  RENEWABLE_CONTRACT: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  
  FINGERPRINT_NEEDED: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  
  ATTACHED_NUMBER: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  
  JOB_AIM: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  
  JOB_DESCRIPTION: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  
  JO_RELATION: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  
  REQUEST_DEGREE: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  
  PREFERRED_LANG: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  
  COST_CENTER: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  
  MEDICAL_COMMENT: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  
  OUTFIT_NUM: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  
  FOOTWEAR_NUM: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  
  FOOD: {
    type: DataTypes.DECIMAL(19, 4),
    allowNull: true
  },
  
  FUEL: {
    type: DataTypes.DECIMAL(19, 4),
    allowNull: true
  },
  
  COMMUNICATION: {
    type: DataTypes.DECIMAL(19, 4),
    allowNull: true
  },
  
  // قيد 
  num_kid: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  
  T_START: {
    type: DataTypes.TIME,
    allowNull: true
  },
  
  T_END: {
    type: DataTypes.TIME,
    allowNull: true
  },
  
  GOLD_COMM: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  
  DIAMOND_COMM: {
    type: DataTypes.REAL,
    allowNull: true
  },
  
  FOOD_ALLOWANCE: {
    type: DataTypes.DECIMAL(19, 4),
    allowNull: true
  },
  
  GOLD_COMM_VALUE: {
    type: DataTypes.REAL,
    allowNull: true
  },
  
  PS: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  
  DIAMOND_COMM_TYPE: {
    type: DataTypes.STRING(50),
    allowNull: true
  }
}, 

{
  freezeTableName: true,
  timestamps: false,
});

module.exports = employee;

// controllers/HR/employeeController.js
const Sequelize = require("sequelize");
const { Op } = Sequelize;
const jwt = require("jsonwebtoken");
const Employee = require("../../models/hr/employee1");

// --- Middleware: verify JWT (matches Boxes controller style) ---
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Authorization header missing" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token missing" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid or expired token" });
    req.user = decoded;
    next();
  });
};

// GET /employees - List all employees with filters
exports.index = [
  verifyToken,
  async (req, res) => {
    try {
      const where = {};
      const { state, cost_center, search } = req.query;

      if (state === "active") {
        where.STATE = true;
      } else if (state === "inactive") {
        where[Op.or] = [{ STATE: false }, { STATE: null }];
      }

      if (cost_center && cost_center !== "") {
        where.COST_CENTER = cost_center;
      }

      if (search && search.trim() !== "") {
        where[Op.or] = [
          { NAME: { [Op.like]: `%${search}%` } },
          { EMAIL: { [Op.like]: `%${search}%` } },
          { PHONE: { [Op.like]: `%${search}%` } },
          { EMPLOYER_REF: { [Op.like]: `%${search}%` } },
          { TITLE: { [Op.like]: `%${search}%` } },
        ];
      }

      const employees = await Employee.findAll({
        where,
        order: [["NAME", "ASC"]],
      });

      const result = employees.map((emp) => {
        const data = emp.get({ plain: true });
        data.PICTURE_URL = data.ID_EMP ? `/uploads/user-pic/${data.ID_EMP}/profile.jpg` : null;
        return data;
      });

      return res.status(200).json(result);
    } catch (err) {
      console.error("Employee index error:", err);
      return res.status(500).json({ message: "Error fetching employees" });
    }
  },
];

// GET /employees/:id - Get single employee
exports.show = [
  verifyToken,
  async (req, res) => {
    try {
      const employee = await Employee.findByPk(req.params.id);
      if (!employee) return res.status(404).json({ message: "Employee not found" });

      const result = employee.get({ plain: true });
      result.PICTURE_URL = result.ID_EMP ? `/uploads/user-pic/${result.ID_EMP}/profile.jpg` : null;

      return res.status(200).json(result);
    } catch (err) {
      console.error("Employee show error:", err);
      return res.status(500).json({ message: "Error fetching employee" });
    }
  },
];

// POST /employees - Create new employee
exports.create = [
  verifyToken,
  async (req, res) => {
    try {
      const body = req.body || {};
      if (!body.NAME || body.NAME.trim() === "") {
        return res.status(400).json({ message: "Name is required" });
      }

      const employeeData = {
        NAME: body.NAME.trim(),
        STATE: body.STATE !== undefined ? body.STATE : true,
        TITLE: body.TITLE || null,
        EMPLOYER_REF: body.EMPLOYER_REF || null,
        EMAIL: body.EMAIL || null,
        PHONE: body.PHONE || null,
        COST_CENTER: body.COST_CENTER || null,
        CONTRACT_START: body.CONTRACT_START || null,
        CONTRACT_END: body.CONTRACT_END || null,
        BASIC_SALARY: body.BASIC_SALARY || null,
        NATIONALITY: body.NATIONALITY || null,
        MARITAL_STATUS: body.MARITAL_STATUS || null,
        DEGREE: body.DEGREE || null,
        TYPE_OF_RECRUITMENT: body.TYPE_OF_RECRUITMENT || null,
        ADDRESS: body.ADDRESS || null,
        DATE_OF_BIRTH: body.DATE_OF_BIRTH || null,
        GENDER: body.GENDER || null,
        NUM_OF_CHILDREN: body.NUM_OF_CHILDREN || null,
        PLACE_OF_BIRTH: body.PLACE_OF_BIRTH || null,
        BLOOD_TYPE: body.BLOOD_TYPE || null,
        IS_FOREINGHT: body.IS_FOREINGHT || false,
        FINGERPRINT_NEEDED: body.FINGERPRINT_NEEDED || false,
      };

      const created = await Employee.create(employeeData); // no .then/.catch mixing
      const result = created.get({ plain: true });
      result.PICTURE_URL = result.ID_EMP ? `/uploads/user-pic/${result.ID_EMP}/profile.jpg` : null;

      return res.status(201).json(result);
    } catch (err) {
      console.error("Employee create error:", err);
      if (err.name === "SequelizeValidationError") {
        const errors = {};
        err.errors.forEach((e) => (errors[e.path] = e.message));
        return res.status(400).json({ message: "Validation error", errors });
      }
      return res.status(500).json({ message: "Error creating employee" });
    }
  },
];

// PUT /employees/:id - Update employee
exports.update = [
  verifyToken,
  async (req, res) => {
    try {
      const id = req.params.id;
      const body = { ...req.body };

      if (body.PICTURE_B64) {
        try {
          body.PICTURE = Buffer.from(body.PICTURE_B64, "base64");
        } catch {
          return res.status(400).json({ message: "Invalid base64 image data" });
        }
        delete body.PICTURE_B64;
      }

      Object.keys(body).forEach((k) => body[k] === undefined && delete body[k]);

      const [updateCount] = await Employee.update(body, { where: { ID_EMP: id } });
      if (updateCount === 0) return res.status(404).json({ message: "Employee not found" });

      const updated = await Employee.findByPk(id);
      const result = updated.get({ plain: true });
      result.PICTURE_URL = result.ID_EMP ? `/uploads/user-pic/${result.ID_EMP}/profile.jpg` : null;

      return res.status(200).json(result);
    } catch (err) {
      console.error("Employee update error:", err);
      return res.status(500).json({ message: "Error updating employee" });
    }
  },
];

// DELETE /employees/:id - Delete employee
exports.destroy = [
  verifyToken,
  async (req, res) => {
    try {
      const id = req.params.id;
      const deleteCount = await Employee.destroy({ where: { ID_EMP: id } });
      if (deleteCount === 0) return res.status(404).json({ message: "Employee not found" });

      return res.status(200).json({ message: "Employee deleted successfully" });
    } catch (err) {
      console.error("Employee destroy error:", err);
      return res.status(500).json({ message: "Error deleting employee" });
    }
  },
];

create an employee profile that shows all employee data to HR and their requests for vacations, information (Personal, work-related and all other info) and allow them to create a new employee profile, update it, delete and list all employees and sort them based on role, department/store (P0, P1, P2, P3, P4, P5 or P6). use this as inspo