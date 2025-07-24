-- Create break_times table for multiple break periods
CREATE TABLE IF NOT EXISTS break_times (
    id SERIAL PRIMARY KEY,
    attendance_record_id INTEGER REFERENCES attendance_records(id) ON DELETE CASCADE,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for better performance
CREATE INDEX idx_break_times_attendance_record_id ON break_times(attendance_record_id);

-- Migrate existing break times to new table
INSERT INTO break_times (attendance_record_id, start_time, end_time)
SELECT id, break_start_time, break_end_time
FROM attendance_records
WHERE break_start_time IS NOT NULL AND break_end_time IS NOT NULL;

-- Add comment to indicate deprecated columns (we'll keep them for backward compatibility)
COMMENT ON COLUMN attendance_records.break_start_time IS 'Deprecated: Use break_times table instead';
COMMENT ON COLUMN attendance_records.break_end_time IS 'Deprecated: Use break_times table instead';