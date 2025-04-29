-- Add project role enum type
CREATE TYPE project_role AS ENUM ('OWNER', 'EMPLOYEE');

-- Update project_member table to use the new enum type
ALTER TABLE project_member 
    ALTER COLUMN role TYPE project_role USING role::project_role;

-- Update existing roles to match new enum values
UPDATE project_member 
    SET role = 'OWNER' 
    WHERE role = 'employer';

UPDATE project_member 
    SET role = 'EMPLOYEE' 
    WHERE role = 'employee'; 