-- Insert project posts with YouTube videos
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
