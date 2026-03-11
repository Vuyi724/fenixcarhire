-- Insert sample cars into the cars table
INSERT INTO cars (brand, model, year, seats, transmission, fuel_type, daily_rate, license_plate, image_url) 
VALUES 
  ('Toyota', 'Camry', 2023, 5, 'Automatic', 'Petrol', 1500, 'MR001TY', 'https://images.unsplash.com/photo-1566023967268-de80828e8f65?w=500&h=400&fit=crop'),
  ('Honda', 'Civic', 2023, 5, 'Manual', 'Petrol', 1200, 'MR002HN', 'https://images.unsplash.com/photo-1627454813175-2c5a98ed5a69?w=500&h=400&fit=crop'),
  ('BMW', '3 Series', 2023, 5, 'Automatic', 'Diesel', 2500, 'MR003BM', 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=500&h=400&fit=crop'),
  ('Mazda', 'CX-5', 2023, 5, 'Automatic', 'Petrol', 1800, 'MR004MZ', 'https://images.unsplash.com/photo-1606606401543-617e01c15e52?w=500&h=400&fit=crop'),
  ('Hyundai', 'Accent', 2023, 5, 'Automatic', 'Petrol', 900, 'MR005HY', 'https://images.unsplash.com/photo-1567818735868-e71b99932e29?w=500&h=400&fit=crop'),
  ('Ford', 'Ranger', 2023, 5, 'Automatic', 'Diesel', 2000, 'MR006FD', 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=500&h=400&fit=crop'),
  ('Nissan', 'Qashqai', 2023, 5, 'Automatic', 'Petrol', 1400, 'MR007NS', 'https://images.unsplash.com/photo-1550258987-920d5d8e5b8c?w=500&h=400&fit=crop'),
  ('Mercedes', 'C-Class', 2023, 5, 'Automatic', 'Diesel', 3000, 'MR008MB', 'https://images.unsplash.com/photo-1514162545848-a24eaf1d6362?w=500&h=400&fit=crop')
ON CONFLICT DO NOTHING;
