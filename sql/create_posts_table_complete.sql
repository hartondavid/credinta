-- Create posts table with all fields including YouTube videos
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    keywords JSON DEFAULT '[]',
    post_type VARCHAR(100) NOT NULL, -- e.g., 'CONFERINTA', 'PODCAST', 'JOC SPORTIV', 'MUZICA'
    category VARCHAR(50) NOT NULL, -- 'project' or 'news'

    -- Project-specific fields
    project_type VARCHAR(50), -- 'past', 'current', 'future'
    event_type VARCHAR(50), -- 'single-day', 'multi-day'
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    duration VARCHAR(100),
    is_active BOOLEAN DEFAULT FALSE,
    cloudinary_ids JSON DEFAULT '[]', -- Array of Cloudinary public_ids (deprecated)
    cloudinary_images JSON DEFAULT '[]', -- Array of Cloudinary image URLs
    testimonial_videos JSON DEFAULT '[]', -- Array of video URLs or IDs
    youtube_videos JSON DEFAULT '[]', -- Array of YouTube video URLs

    -- Gallery fields
    gallery_flag BOOLEAN DEFAULT FALSE, -- Flag to indicate if post has gallery
    gallery_image_ids JSON DEFAULT '[]', -- Array of gallery image IDs

    -- News-specific fields
    url VARCHAR(500),
    read_button BOOLEAN DEFAULT FALSE,

    -- Metadata
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_published BOOLEAN DEFAULT TRUE,

    -- No unique constraints needed for these fields
);

-- Create indexes for better performance
CREATE INDEX idx_posts_category_post_type ON posts (category, post_type);
CREATE INDEX idx_posts_project_type ON posts (project_type);
CREATE INDEX idx_posts_created_at ON posts (created_at);
CREATE INDEX idx_posts_is_published ON posts (is_published);

-- Insert sample project post with YouTube videos
INSERT INTO posts (
    title, content, author, created_at, tags, post_type, category, project_type, event_type, is_active, youtube_videos
) VALUES 
(
    'Echilibrul dintre o minte sănătoasă si un corp sănătos',
    'Adresez mulțumiri sincere echipei Bibliotecii Județene Alexandru Odobescu din Călărași, doamnei manager Ionela Ichim și doamnei Simona Claciu pentru onoranta invitație din data de 23 iulie 2024. A fost o deosebită plăcere și un privilegiu să discut cu adolescenții despre importanța sportului în viața cotidiană.',
    'Lorem Ipsum',
    '2024-07-23 14:30:00',
    '["lorem", "videoCarousel2", "leftPhotoCarousel2"]',
    'CONFERINTA',
    'project',
    'past',
    'single-day',
    TRUE,
    '["https://www.youtube.com/watch?v=dQw4w9WgXcQ", "https://www.youtube.com/watch?v=9bZkp7q19f0"]'
);

-- Insert sample news post
INSERT INTO posts (
    title, content, author, created_at, tags, post_type, category, url, read_button
) VALUES 
(
    'Știre importantă despre dezvoltarea comunității',
    'Clubul Sportiv Călărași Warriors continuă să dezvolte activități pentru comunitate prin sport și educație.',
    'Redactor',
    '2024-07-24 10:00:00',
    '["știri", "comunitate", "sport"]',
    'STIRE',
    'news',
    'https://example.com/stire-importantă',
    TRUE
);

-- Verify the data
SELECT 
    id, 
    title, 
    post_type, 
    category, 
    project_type,
    youtube_videos,
    created_at 
FROM posts 
ORDER BY created_at DESC;
