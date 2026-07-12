-- Align default driver email with seeded user account
UPDATE driver SET email = 'driver@transitops.local' WHERE email = 'john.silva@transitops.local';
