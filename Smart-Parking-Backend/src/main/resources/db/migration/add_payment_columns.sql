-- Database Migration Script for Payment Features
-- Adds new payment-related columns to the bookings table

ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'PENDING';
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_time TIMESTAMP NULL;

-- Add index for faster queries on payment status
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_bookings_user_status ON bookings(user_id, status);

-- Update status column to handle COMPLETED status
-- Already handled by Enum in Java, but ensure values are supported
-- Valid values: ACTIVE, COMPLETED, CANCELLED

-- Set payment_status to PAID for all existing COMPLETED bookings
UPDATE bookings SET payment_status = 'PAID' WHERE status = 'COMPLETED' AND payment_status IS NULL;

-- Set payment_status to PENDING for all ACTIVE bookings
UPDATE bookings SET payment_status = 'PENDING' WHERE status = 'ACTIVE' AND payment_status IS NULL;

-- Verify the updates
SELECT COUNT(*) as total_bookings, 
       SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) as completed,
       SUM(CASE WHEN payment_status = 'PAID' THEN 1 ELSE 0 END) as paid
FROM bookings;
