-- Seed default drivers for testing availability
INSERT INTO driver (full_name, license_number, license_category, license_expiry, phone_number, email, emergency_contact, safety_score, status) VALUES
  ('John Silva', 'DL-12345678', 'CLASS_A', '2030-12-31', '555-0199', 'john.silva@transitops.local', 'Jane Silva: 555-0198', 95, 'AVAILABLE');
