-- ========================================
-- SQL QUERIES FOR POSTS TABLE
-- ========================================

-- 1. CREATE POSTS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    tags JSON DEFAULT '[]',
    post_type VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    
    -- Câmpuri specifice pentru proiecte
    project_type VARCHAR(50),
    event_type VARCHAR(50),
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    duration VARCHAR(100),
    is_active BOOLEAN DEFAULT FALSE,
    cloudinary_ids JSON DEFAULT '[]',
    testimonial_videos JSON DEFAULT '[]',
    
    -- Câmpuri specifice pentru știri
    url VARCHAR(500),
    read_button BOOLEAN DEFAULT FALSE,
    
    -- Metadate
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_published BOOLEAN DEFAULT TRUE
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_category_post_type ON posts(category, post_type);
CREATE INDEX IF NOT EXISTS idx_posts_project_type ON posts(project_type);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at);
CREATE INDEX IF NOT EXISTS idx_posts_is_published ON posts(is_published);

-- ========================================
-- 2. POPULATE POSTS TABLE WITH EXISTING DATA
-- ========================================

-- Insert existing project posts
INSERT INTO posts (
    title, content, author, created_at, tags, post_type, category, project_type
) VALUES 
(
    'Echilibrul dintre o minte sănătoasă si un corp sănătos',
    'Adresez mulțumiri sincere echipei Bibliotecii Județene Alexandru Odobescu din Călărași, doamnei manager Ionela Ichim și doamnei Simona Claciu pentru onoranta invitație din data de 23 iulie 2024. A fost o deosebită plăcere și un privilegiu să discut cu adolescenții despre importanța sportului în viața cotidiană. Îmi exprim aprecierea pentru inițiativele și proiectele remarcabile desfășurate la Biblioteca Județeană Alexandru Odobescu din Călărași. Aceste eforturi sunt esențiale în cultivarea valorilor educative și culturale în rândul tinerilor noștri. De asemenea mulțumesc lui David Harton pentru video.',
    'Lorem Ipsum',
    '2024-07-23 14:30:00',
    '["lorem", "videoCarousel2", "leftPhotoCarousel2"]',
    'CONFERINTA',
    'project',
    'past'
),
(
    'Ziua Dunării',
    'Sâmbătă 29, Iunie, intre orele 8.30 -11.00 in Parcul Central Călărași, se va desfasura un eveniment sportiv cu ocazia zilei Dunarii intitulat Ziua Dunării. Munca în echipa este CHEIA! Succesul personal nu este suficient; succesul echipei este esențial. Un renumit speaker pe nume John Maxwell spune adesea că talentul câștigă jocuri, dar munca în echipă și inteligența câștigă campionate. Colaborarea echipei produce rezultate mai mari decât suma eforturilor individuale. O comunitate puternică va pune un accent puternic pe colaborare, comunicare, claritate și dezvoltare continuă pentru a construi echipe de succes.',
    'Lorem Ipsum',
    '2024-06-29 16:45:00',
    '["lorem", "videoCarousel3", "leftPhotoCarousel3"]',
    'JOC SPORTIV',
    'project',
    'past'
);

-- Insert existing news posts
INSERT INTO posts (
    title, content, author, created_at, tags, post_type, category, url, read_button
) VALUES 
(
    'Spune-mi despre Călărași – Sezonul 4, Ep. 4 - Iulian Vasile',
    'În acest episod al podcastului "Spune-mi despre Călărași", moderatoarea Georgiana Șerban l-a avut ca invitat pe Iulian Vasile, președintele Asociației "Alege să trăiești" și al Clubului Sportiv "Călărași Warriors". Discuția a acoperit mai multe subiecte legate de implicarea sa în comunitate, sport și viața personală. Iulian Vasile se definește prin credința sa în Dumnezeu, pe care a descoperit-o după Revoluție, aceasta fiind fundamentul viziunii sale holistice (trup, minte, suflet) asupra vieții. Motivat de dragostea pentru comunitate, el se ghidează după principiul " mai ferice este a da decât a primi ", implicându-se în proiecte de prevenție pentru tineri și antrenând gratuit viitori cadeți ai structurilor militare. A fondat clubul de baschet din dragoste pentru copii, unde promovează o filozofie de antrenament "tridimensional" (trup, minte, suflet), axată pe dezvoltarea caracterului, nu doar pe performanță.',
    'Lorem Ipsum',
    '2025-07-15 10:00:00',
    '["videoCarousel", "leftPhotoCarousel"]',
    'PODCAST',
    'news',
    NULL,
    FALSE
);

-- ========================================
-- 3. VERIFICATION QUERIES
-- ========================================

-- Check if table was created successfully
SELECT 
    table_name, 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'posts' 
ORDER BY ordinal_position;

-- Check if posts were inserted
SELECT 
    id,
    title,
    author,
    category,
    post_type,
    project_type,
    created_at
FROM posts 
ORDER BY created_at DESC;

-- ========================================
-- 4. USEFUL QUERIES
-- ========================================

-- Get all project posts
SELECT * FROM posts WHERE category = 'project' ORDER BY created_at DESC;

-- Get all news posts
SELECT * FROM posts WHERE category = 'news' ORDER BY created_at DESC;

-- Get posts by project type
SELECT * FROM posts WHERE category = 'project' AND project_type = 'past';

-- Get posts by post type
SELECT * FROM posts WHERE post_type = 'CONFERINTA';

-- Search posts by title or content
SELECT * FROM posts WHERE title ILIKE '%Călărași%' OR content ILIKE '%Călărași%';

-- ========================================
-- 5. CLEANUP QUERIES (if needed)
-- ========================================

-- Drop the table (use with caution!)
-- DROP TABLE IF EXISTS posts CASCADE;

-- Delete all posts (use with caution!)
-- DELETE FROM posts;
