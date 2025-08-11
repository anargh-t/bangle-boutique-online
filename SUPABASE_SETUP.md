# Supabase Setup Guide for Bangle Boutique

This guide will help you set up Supabase as your backend database for the Bangle Boutique e-commerce site.

## Prerequisites

- A Supabase account (free at [supabase.com](https://supabase.com))
- Node.js and npm installed
- Basic knowledge of SQL

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `bangle-boutique`
   - Database Password: Choose a strong password
   - Region: Select closest to your users
5. Click "Create new project"
6. Wait for the project to be created (this may take a few minutes)

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to Settings → API
2. Copy the following values:
   - Project URL
   - Anon (public) key

## Step 3: Set Environment Variables

1. Create a `.env` file in your project root (if it doesn't exist)
2. Add the following variables:

```env
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

Replace `YOUR_SUPABASE_URL` and `YOUR_SUPABASE_ANON_KEY` with the values from Step 2.

## Step 4: Create Database Tables

In your Supabase dashboard, go to SQL Editor and run the following SQL commands:

### Create the products table:

```sql
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
```

### Create the variations table:

```sql
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
```

### Create indexes for better performance:

```sql
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_variations_product_id ON variations(product_id);
CREATE INDEX idx_variations_stock ON variations(stock);
```

### Enable Row Level Security (RLS):

```sql
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE variations ENABLE ROW LEVEL SECURITY;
```

### Create policies for public read access:

```sql
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
```

## Step 5: Insert Sample Data

You can insert some sample products to test the system:

```sql
-- Insert sample products
INSERT INTO products (id, name, description, category, featured, images) VALUES
('combo-lavender-wine', 'Lavender Wine Combo', 'Beautiful combination of lavender and wine colored bangles', 'combo', true, ARRAY['/BANGLES/COMBO/Lavender_Wine_Combo1.jpg']),
('elegant-green', 'Elegant Green Bangle', 'Elegant green bangle with kundan work', 'elegant', true, ARRAY['/BANGLES/ELEGANT_BANGLES/Elegant_Green.jpg']),
('pearl-pink', 'Pearl Pink Bangle', 'Delicate pink pearl bangle', 'pearl', false, ARRAY['/BANGLES/PEARL_BANGLE/Pearl_Bangle_Pink1.jpg']);

-- Insert sample variations
INSERT INTO variations (product_id, color, size, price, stock) VALUES
('combo-lavender-wine', 'Lavender', '2.5', 299.00, 10),
('combo-lavender-wine', 'Wine', '2.5', 299.00, 8),
('elegant-green', 'Green', '2.5', 399.00, 15),
('elegant-green', 'Green', '2.75', 399.00, 12),
('pearl-pink', 'Pink', '2.5', 199.00, 20),
('pearl-pink', 'Pink', '2.75', 199.00, 18);
```

## Step 6: Test Your Setup

1. Start your development server: `npm run dev`
2. Navigate to `/admin` in your browser
3. Try to create, edit, or delete a product
4. Check that the catalog page loads products from the database

## Step 7: Deploy to Production

### For Vercel:
1. Add your environment variables in Vercel dashboard
2. Deploy your project

### For other platforms:
1. Ensure your environment variables are set in your hosting platform
2. Deploy your project

## Troubleshooting

### Common Issues:

1. **"Invalid API key" error**: Check that your environment variables are correct
2. **"Table doesn't exist" error**: Make sure you've run the SQL commands to create tables
3. **"Permission denied" error**: Check your RLS policies
4. **CORS errors**: Ensure your Supabase project allows your domain

### Debug Tips:

1. Check the browser console for error messages
2. Use Supabase dashboard to inspect your data
3. Test your API calls in the Supabase dashboard
4. Check that your environment variables are loaded correctly

## Security Considerations

1. **Row Level Security**: RLS is enabled by default - only authenticated users can modify data
2. **API Keys**: Never expose your service role key in the frontend
3. **Input Validation**: Always validate user input before sending to the database
4. **Rate Limiting**: Consider implementing rate limiting for your API endpoints

## Next Steps

1. **Authentication**: Add user authentication for admin access
2. **Image Upload**: Implement image upload to Supabase storage
3. **Real-time Updates**: Use Supabase real-time subscriptions for live inventory updates
4. **Analytics**: Add product analytics and sales tracking
5. **Backup**: Set up automated database backups

## Support

If you encounter issues:
1. Check the [Supabase documentation](https://supabase.com/docs)
2. Visit the [Supabase community](https://github.com/supabase/supabase/discussions)
3. Check your project logs in the Supabase dashboard

