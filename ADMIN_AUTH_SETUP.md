# Admin Authentication Setup Guide

## Overview

This guide will help you set up secure authentication for the admin panel using Supabase Auth. The system includes:

- ✅ Login page with email/password authentication
- ✅ Protected admin routes
- ✅ User session management
- ✅ Admin role verification
- ✅ Secure logout functionality

## Prerequisites

- Supabase project set up and configured
- Environment variables configured in `.env` file
- Database tables created from `database-schema.sql`

## Step 1: Enable Supabase Authentication

1. **Go to your Supabase Dashboard**
   - Navigate to [supabase.com](https://supabase.com) and sign in
   - Select your project

2. **Enable Email Authentication**
   - Go to **Authentication** → **Providers**
   - Ensure **Email** provider is enabled
   - Configure any additional settings as needed

3. **Configure Email Templates (Optional)**
   - Go to **Authentication** → **Email Templates**
   - Customize the confirmation and reset password emails
   - Set your business name and branding

## Step 2: Create Admin User

### Option A: Using Supabase Dashboard

1. **Go to Authentication → Users**
2. **Click "Add User"**
3. **Fill in the details:**
   - Email: `admin@bangleboutique.com` (or your preferred admin email)
   - Password: Choose a strong password
   - Email Confirm: Check this to automatically confirm the email
4. **Click "Create User"**

### Option B: Using SQL Commands

Run this in your Supabase SQL Editor:

```sql
-- Create admin user (replace with your desired email and password)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@bangleboutique.com',
  crypt('your_secure_password_here', gen_salt('bf')),
  now(),
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- Set user metadata to mark as admin
UPDATE auth.users 
SET raw_user_meta_data = '{"role": "admin", "name": "Administrator"}'
WHERE email = 'admin@bangleboutique.com';
```

## Step 3: Configure Admin Access

### Update AuthContext (if needed)

The default admin check looks for these emails:
- `admin@bangleboutique.com`
- `admin@example.com`
- Users with `role: "admin"` in metadata

To customize, edit `src/context/AuthContext.tsx`:

```typescript
// Check if user is admin (customize this logic)
const isAdmin = user?.email === 'your-admin-email@domain.com' || 
                user?.user_metadata?.role === 'admin';
```

## Step 4: Test the Authentication

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to `/login`:**
   - You should see the login form
   - Enter your admin credentials

3. **Test admin access:**
   - After login, you should be redirected to `/admin`
   - The admin panel should be fully functional
   - You should see your email in the header

4. **Test logout:**
   - Click the logout button
   - You should be redirected to the home page

## Step 5: Security Considerations

### Environment Variables
Ensure your `.env` file has:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### Row Level Security (RLS)
The database schema includes RLS policies. For production, consider:
- Restricting admin access to specific IP addresses
- Adding rate limiting for login attempts
- Implementing 2FA for admin accounts

### Password Policy
- Use strong passwords (12+ characters)
- Consider implementing password requirements
- Regular password rotation

## Troubleshooting

### Common Issues

1. **"Invalid login credentials"**
   - Verify email and password are correct
   - Check if user exists in Supabase Auth
   - Ensure email is confirmed

2. **"User not found"**
   - Check if user was created successfully
   - Verify email spelling
   - Check Supabase Auth → Users

3. **"Access denied"**
   - Verify user has admin role
   - Check `isAdmin` logic in AuthContext
   - Ensure user metadata is set correctly

4. **"Database connection failed"**
   - Check environment variables
   - Verify Supabase project is active
   - Check network connectivity

### Debug Steps

1. **Check browser console** for error messages
2. **Verify Supabase connection** in dashboard
3. **Check user status** in Authentication → Users
4. **Test database queries** in SQL Editor
5. **Verify environment variables** are loaded

## Advanced Configuration

### Custom Admin Roles

To implement more granular role-based access:

```typescript
// In AuthContext.tsx
const getUserRole = () => {
  return user?.user_metadata?.role || 'user';
};

const hasPermission = (permission: string) => {
  const role = getUserRole();
  const permissions = {
    admin: ['read', 'write', 'delete', 'manage_users'],
    manager: ['read', 'write'],
    viewer: ['read']
  };
  return permissions[role]?.includes(permission) || false;
};
```

### Session Persistence

Sessions are automatically persisted. To customize:

```typescript
// In AuthContext.tsx
const { data: { session }, error } = await supabase.auth.getSession();
// Session includes user info and expires automatically
```

### Password Reset

To enable password reset functionality:

```typescript
const resetPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  return { error };
};
```

## Production Deployment

1. **Update environment variables** in your hosting platform
2. **Configure custom domain** in Supabase
3. **Set up email provider** for production emails
4. **Enable SSL** for secure connections
5. **Monitor authentication logs** in Supabase dashboard

## Support

If you encounter issues:
1. Check the [Supabase Auth documentation](https://supabase.com/docs/guides/auth)
2. Review authentication logs in Supabase dashboard
3. Test with the provided sample admin account
4. Verify all environment variables are set correctly

## Next Steps

After setting up authentication:
1. **Test all admin functionality** (create, edit, delete products)
2. **Set up additional admin users** if needed
3. **Configure email notifications** for admin actions
4. **Implement audit logging** for security
5. **Set up backup and recovery** procedures

