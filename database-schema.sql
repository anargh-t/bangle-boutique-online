-- Bangle Boutique Database Schema
-- Run this in your Supabase SQL Editor

-- Create the products table
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  images TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the variations table
CREATE TABLE variations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  color TEXT NOT NULL,
  size TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_variations_product_id ON variations(product_id);
CREATE INDEX idx_variations_stock ON variations(stock);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE variations ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
-- Allow public read access to products
CREATE POLICY "Allow public read access to products" ON products
  FOR SELECT USING (true);

-- Allow public read access to variations
CREATE POLICY "Allow public read access to variations" ON variations
  FOR SELECT USING (true);

-- Allow authenticated users to insert/update/delete products
CREATE POLICY "Allow authenticated users to manage products" ON products
  FOR ALL USING (auth.role() = 'authenticated');

-- Allow authenticated users to manage variations
CREATE POLICY "Allow authenticated users to manage variations" ON variations
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert sample products with correct image paths
INSERT INTO products (id, name, description, category, featured, images) VALUES
('combo-lavender-wine', 'Lavender Wine Combo', 'Beautiful combination of lavender and wine colored bangles', 'combo', true, ARRAY['/BANGLES/COMBO/Lavender_Wine_Combo1.jpg']),
('elegant-green', 'Elegant Green Bangle', 'Elegant green bangle with kundan work', 'elegant', true, ARRAY['/BANGLES/ELEGANT_BANGLES/Elegant_Green.jpg']),
('pearl-pink', 'Pearl Pink Bangle', 'Delicate pink pearl bangle', 'pearl', false, ARRAY['/BANGLES/PEARL_BANGLE/Pearl_Bangle_Pink1.jpg']),
('raindrop-black', 'Raindrop Black Bangle', 'Elegant black raindrop design bangle', 'raindrop', true, ARRAY['/BANGLES/RAINDROP/Raindrop_Black1.jpg']),
('oreo-red', 'Oreo Red Bangle', 'Stunning red oreo style bangle', 'oreo', false, ARRAY['/BANGLES/OREO_BANGLES/Oreo_Red1.jpg']);

-- Insert sample variations
INSERT INTO variations (product_id, color, size, price, stock, active) VALUES
('combo-lavender-wine', 'Lavender & Wine', '2.4', 299.00, 15, true),
('combo-lavender-wine', 'Lavender & Wine', '2.6', 299.00, 12, true),
('elegant-green', 'Green', '2.4', 199.00, 20, true),
('elegant-green', 'Green', '2.6', 199.00, 18, true),
('pearl-pink', 'Pink', '2.4', 249.00, 10, true),
('pearl-pink', 'Pink', '2.6', 249.00, 8, true),
('raindrop-black', 'Black', '2.4', 179.00, 25, true),
('raindrop-black', 'Black', '2.6', 179.00, 22, true),
('oreo-red', 'Red', '2.4', 159.00, 30, true),
('oreo-red', 'Red', '2.6', 159.00, 28, true);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_variations_updated_at BEFORE UPDATE ON variations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
