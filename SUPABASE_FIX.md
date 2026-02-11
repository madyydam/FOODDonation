# Supabase Policy Error Fix

## Error You're Seeing
```
ERROR: 42710: policy "Users can view all users" for table "users" already exists
```

## Why This Happens
You're trying to create policies that already exist in your Supabase database.

## ✅ FIXED Solution

The updated `supabase_schema.sql` now:

1. **Drops existing policies first** using `DROP POLICY IF EXISTS`
2. **Then creates new policies**

## How to Apply

### Simply run the entire `supabase_schema.sql` file:

1. Open Supabase Dashboard → SQL Editor
2. Copy & paste **entire** `supabase_schema.sql`
3. Click **RUN**

The script will:
- Drop old policies (no error if they don't exist)
- Re-create all policies with correct INSERT permissions
- Your data will be safe (only policies are dropped/recreated)

### After Running

Test signup:
1. Go to `role_selection.html`
2. Select role → Fill form → Submit
3. Check Supabase Auth → Users ✅
4. Check Table Editor → users ✅
5. Should see new user created!

## No Need to Delete Tables Anymore

The old fix required deleting tables. This new version is **safe** - it only drops and recreates policies, not data.

🎉 **Problem Solved!**
