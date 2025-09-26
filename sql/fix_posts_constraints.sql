-- Remove problematic unique constraints from posts table
-- This script fixes the duplicate key constraint error

-- Drop the problematic unique constraints
ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_category_post_type_idx;
ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_project_type_idx;
ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_created_at_idx;
ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_is_published_idx;

-- Create proper indexes instead of unique constraints
CREATE INDEX idx_posts_category_post_type ON posts (category, post_type);
CREATE INDEX idx_posts_project_type ON posts (project_type);
CREATE INDEX idx_posts_created_at ON posts (created_at);
CREATE INDEX idx_posts_is_published ON posts (is_published);

-- Verify the changes
SELECT 
    constraint_name, 
    constraint_type 
FROM information_schema.table_constraints 
WHERE table_name = 'posts' AND constraint_type = 'UNIQUE';

-- Show indexes
SELECT 
    indexname, 
    indexdef 
FROM pg_indexes 
WHERE tablename = 'posts';
