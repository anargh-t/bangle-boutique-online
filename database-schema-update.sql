-- Update RLS policies to allow public access for testing
-- Run this in your Supabase SQL Editor

-- Drop existing policies
DROP POLICY IF EXISTS "Allow authenticated users to manage products" ON products;
DROP POLICY IF EXISTS "Allow authenticated users to manage variations" ON variations;

-- Create new policies that allow public access for testing
CREATE POLICY "Allow public access to manage products" ON products
  FOR ALL USING (true);

CREATE POLICY "Allow public access to manage variations" ON variations
  FOR ALL USING (true);

-- Verify the policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename IN ('products', 'variations');

