-- Update admin password to 'password123'
-- This script updates the password hash for admin@recap.local
UPDATE users 
SET password = '$2b$10$/q1FbMbjOHauFFGiQv.PxeoDDMmhIHFgQ9HwmR6kUdM8.UGYE8yzq' 
WHERE email = 'admin@recap.local';

-- Verify the update
SELECT id, name, email, role, status FROM users WHERE email = 'admin@recap.local';

