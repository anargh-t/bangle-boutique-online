-- Create a storage bucket for product images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for the images bucket
-- Allow public read access to images
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

-- Allow users to update their own uploads
CREATE POLICY "Users can update own uploads" ON storage.objects
FOR UPDATE USING (bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own uploads
CREATE POLICY "Users can delete own uploads" ON storage.objects
FOR DELETE USING (bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- For now, allow all operations for anonymous users (you can restrict this later)
-- This is useful for development and testing
CREATE POLICY "Allow all operations for anonymous users" ON storage.objects
FOR ALL USING (bucket_id = 'images')
WITH CHECK (bucket_id = 'images');


