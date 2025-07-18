-- Add attendance-related tables
CREATE TABLE IF NOT EXISTS attendance_records (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(id),
    date DATE NOT NULL,
    check_in_time TIME,
    check_out_time TIME,
    break_start_time TIME,
    break_end_time TIME,
    overtime_hours DECIMAL(4,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS work_schedules (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(id),
    date DATE NOT NULL,
    scheduled_start_time TIME,
    scheduled_end_time TIME,
    scheduled_break_start TIME,
    scheduled_break_end TIME,
    work_type VARCHAR(20) DEFAULT 'office',
    is_holiday BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS leave_requests (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    leave_type VARCHAR(20) NOT NULL,
    reason TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    approved_by INTEGER REFERENCES employees(id),
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for better performance
CREATE INDEX idx_attendance_records_employee_date ON attendance_records(employee_id, date);
CREATE INDEX idx_work_schedules_employee_date ON work_schedules(employee_id, date);
CREATE INDEX idx_leave_requests_employee_dates ON leave_requests(employee_id, start_date, end_date);

-- Add sample data
INSERT INTO work_schedules (employee_id, date, scheduled_start_time, scheduled_end_time, scheduled_break_start, scheduled_break_end) VALUES
(1, CURRENT_DATE, '09:00', '18:00', '12:00', '13:00'),
(1, CURRENT_DATE + INTERVAL '1 day', '09:00', '18:00', '12:00', '13:00'),
(2, CURRENT_DATE, '09:00', '17:30', '12:00', '13:00'),
(2, CURRENT_DATE + INTERVAL '1 day', '09:00', '17:30', '12:00', '13:00'),
(3, CURRENT_DATE, '09:30', '18:30', '12:00', '13:00'),
(3, CURRENT_DATE + INTERVAL '1 day', '09:30', '18:30', '12:00', '13:00');

INSERT INTO attendance_records (employee_id, date, check_in_time, check_out_time, break_start_time, break_end_time, status) VALUES
(1, CURRENT_DATE - INTERVAL '1 day', '09:05', '18:15', '12:00', '13:00', 'approved'),
(1, CURRENT_DATE - INTERVAL '2 days', '09:00', '18:00', '12:00', '13:00', 'approved'),
(2, CURRENT_DATE - INTERVAL '1 day', '09:10', '17:35', '12:00', '13:00', 'pending'),
(2, CURRENT_DATE - INTERVAL '2 days', '09:15', '17:30', '12:00', '13:00', 'approved'),
(3, CURRENT_DATE - INTERVAL '1 day', '09:30', '18:30', '12:00', '13:00', 'pending'),
(3, CURRENT_DATE - INTERVAL '2 days', '09:35', '18:25', '12:00', '13:00', 'approved');

INSERT INTO leave_requests (employee_id, start_date, end_date, leave_type, reason, status) VALUES
(1, CURRENT_DATE + INTERVAL '7 days', CURRENT_DATE + INTERVAL '7 days', 'paid', '個人的な用事', 'pending'),
(2, CURRENT_DATE + INTERVAL '14 days', CURRENT_DATE + INTERVAL '16 days', 'paid', '家族旅行', 'pending'),
(3, CURRENT_DATE + INTERVAL '21 days', CURRENT_DATE + INTERVAL '21 days', 'sick', '体調不良', 'approved');