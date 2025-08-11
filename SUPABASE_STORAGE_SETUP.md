# Supabase Storage Setup

To enable image uploads in the admin panel, you need to set up Supabase Storage.

## Step 1: Create Storage Bucket

1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **Create a new bucket**
4. Set the bucket name to `images`
5. Make sure **Public bucket** is checked (this allows public read access to images)
6. Click **Create bucket**

## Step 2: Set Storage Policies

Run the following SQL in your Supabase SQL Editor:

```sql
-- Allow public read access to images
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'images');

-- Allow all operations for now (you can restrict this later)
CREATE POLICY "Allow all operations for anonymous users" ON storage.objects
FOR ALL USING (bucket_id = 'images')
WITH CHECK (bucket_id = 'images');
```

## Step 3: Test the Setup

1. Go to your admin page (`/admin`)
2. Try to create a new product with images
3. The images should upload to Supabase Storage and be accessible via public URLs

## How It Works

- Images are uploaded to the `images/products/` folder in your Supabase Storage
- Each image gets a unique filename based on timestamp and random string
- The public URL is stored in the database and used to display images
- Images are served directly from Supabase Storage

## Troubleshooting

If you get upload errors:
1. Check that the `images` bucket exists
2. Verify the storage policies are set correctly
3. Make sure your Supabase project has storage enabled
4. Check the browser console for specific error messages


