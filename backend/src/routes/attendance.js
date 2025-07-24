const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// GET attendance records for a specific employee
router.get('/records/:employeeId', authenticateToken, async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { startDate, endDate } = req.query;
    
    let query = `
      SELECT ar.*, e.name as employee_name 
      FROM attendance_records ar 
      JOIN employees e ON ar.employee_id = e.id 
      WHERE ar.employee_id = $1
    `;
    const params = [employeeId];
    
    if (startDate && endDate) {
      query += ' AND ar.date BETWEEN $2 AND $3';
      params.push(startDate, endDate);
    }
    
    query += ' ORDER BY ar.date DESC';
    
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET work schedule for a specific employee
router.get('/schedule/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { startDate, endDate } = req.query;
    
    let query = `
      SELECT ws.*, e.name as employee_name 
      FROM work_schedules ws 
      JOIN employees e ON ws.employee_id = e.id 
      WHERE ws.employee_id = $1
    `;
    const params = [employeeId];
    
    if (startDate && endDate) {
      query += ' AND ws.date BETWEEN $2 AND $3';
      params.push(startDate, endDate);
    }
    
    query += ' ORDER BY ws.date ASC';
    
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching work schedule:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST create attendance record
router.post('/records', async (req, res) => {
  try {
    const { 
      employee_id, 
      date, 
      check_in_time, 
      check_out_time, 
      break_start_time, 
      break_end_time, 
      overtime_hours, 
      notes 
    } = req.body;
    
    const result = await db.query(
      `INSERT INTO attendance_records 
       (employee_id, date, check_in_time, check_out_time, break_start_time, break_end_time, overtime_hours, notes) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [employee_id, date, check_in_time, check_out_time, break_start_time, break_end_time, overtime_hours, notes]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating attendance record:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update attendance record
router.put('/records/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      check_in_time, 
      check_out_time, 
      break_start_time, 
      break_end_time, 
      overtime_hours, 
      notes,
      status 
    } = req.body;
    
    const result = await db.query(
      `UPDATE attendance_records 
       SET check_in_time = $1, check_out_time = $2, break_start_time = $3, 
           break_end_time = $4, overtime_hours = $5, notes = $6, status = $7, updated_at = CURRENT_TIMESTAMP
       WHERE id = $8 
       RETURNING *`,
      [check_in_time, check_out_time, break_start_time, break_end_time, overtime_hours, notes, status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating attendance record:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET leave requests for a specific employee
router.get('/leave-requests/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params;
    const result = await db.query(
      `SELECT lr.*, e.name as employee_name, a.name as approver_name
       FROM leave_requests lr 
       JOIN employees e ON lr.employee_id = e.id 
       LEFT JOIN employees a ON lr.approved_by = a.id
       WHERE lr.employee_id = $1 
       ORDER BY lr.start_date DESC`,
      [employeeId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching leave requests:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST create leave request
router.post('/leave-requests', async (req, res) => {
  try {
    const { employee_id, start_date, end_date, leave_type, reason } = req.body;
    
    const result = await db.query(
      `INSERT INTO leave_requests (employee_id, start_date, end_date, leave_type, reason) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [employee_id, start_date, end_date, leave_type, reason]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating leave request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET attendance summary for dashboard
router.get('/summary/:employeeId', authenticateToken, async (req, res) => {
  try {
    const { employeeId } = req.params;
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    
    // Get current month attendance summary
    const attendanceResult = await db.query(
      `SELECT 
         COUNT(*) as total_days,
         COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_days,
         COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_days,
         SUM(overtime_hours) as total_overtime
       FROM attendance_records 
       WHERE employee_id = $1 
       AND EXTRACT(MONTH FROM date) = $2 
       AND EXTRACT(YEAR FROM date) = $3`,
      [employeeId, currentMonth, currentYear]
    );
    
    // Get pending leave requests
    const leaveResult = await db.query(
      `SELECT COUNT(*) as pending_leave_requests
       FROM leave_requests 
       WHERE employee_id = $1 AND status = 'pending'`,
      [employeeId]
    );
    
    res.json({
      attendance: attendanceResult.rows[0],
      leave: leaveResult.rows[0]
    });
  } catch (error) {
    console.error('Error fetching attendance summary:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;