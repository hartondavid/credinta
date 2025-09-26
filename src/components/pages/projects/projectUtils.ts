// Utility functions for project posts that change rarely
// This file contains all processing and mapping functions

import type { ProjectPost, MappedCurrentProject, MappedFutureProject, MappedPastProject } from './projectTypes';

// Function to highlight keywords in text with beautiful styling
export const highlightKeywords = (text: string, keywords: string[]): string => {
    if (!keywords || keywords.length === 0) {
        return text;
    }

    let highlightedText = text;

    keywords.forEach(keyword => {
        if (keyword.trim()) {
            const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
            highlightedText = highlightedText.replace(
                regex,
                `<span class="keyword-highlight text-indigo-600 dark:text-yellow-400 font-bold">${keyword}</span>`,
            );
        }
    });

    return highlightedText;
};

// Funcție pentru a determina tipul proiectului bazat pe data de creare
export const getProjectTypeByDate = (createdAt: string, startDate?: string, endDate?: string, eventType?: 'single-day' | 'multi-day' | 'ongoing'): 'past' | 'ongoing' | 'future' => {
    const now = new Date();
    const today = new Date();

    // Pentru evenimente multi-zile, folosim startDate și endDate
    if (eventType === 'multi-day' && startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Setăm ora la începutul zilei pentru startDate
        start.setHours(0, 0, 0, 0);
        // Setăm ora la sfârșitul zilei pentru endDate (23:59:59)
        end.setHours(23, 59, 59, 999);

        // Verificăm dacă startDate este din ziua curentă
        const isStartToday = start.getDate() === today.getDate() &&
            start.getMonth() === today.getMonth() &&
            start.getFullYear() === today.getFullYear();

        if (isStartToday) {
            return 'ongoing'; // Prima zi din interval este azi → "Proiecte în Curs"
        }

        if (now <= start && now <= end) {
            return 'future';
        } else if (now >= start && now <= end) {
            return 'ongoing';
        } else {
            return 'past';
        }
    }

    // Pentru evenimente ongoing, verificăm dacă sunt active
    if (eventType === 'ongoing' && startDate) {
        const start = new Date(startDate);
        const daysSinceStart = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

        if (daysSinceStart < 30) {
            return 'future';
        } else if (daysSinceStart < 90) {
            return 'ongoing';
        } else {
            return 'past';
        }
    }

    // Pentru evenimente single-day, folosim startDate dacă este disponibil, altfel createdAt
    const dateToCheck = startDate ? new Date(startDate) : new Date(createdAt);

    // Setăm ora la începutul zilei pentru comparație corectă
    dateToCheck.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    // Verificăm dacă data este din ziua curentă
    const isToday = dateToCheck.getTime() === today.getTime();

    if (isToday) {
        return 'ongoing'; // Postăm automat pe pagina "Proiecte în Curs"
    }

    if (dateToCheck < today) {
        return 'past';
    } else {
        return 'future';
    }
};

// Funcție pentru a obține postările cu tipul corect bazat pe data
export const getAutoCategorizedPosts = (allProjectPosts: ProjectPost[], projectPostKeywords: Record<string, string[]>) => {
    // Categorize posts automatically based on creation date and event type
    return allProjectPosts.map(post => {
        // Apply keyword highlighting to content using post-specific keywords
        const postKeywords = projectPostKeywords[post.id] || [];
        const highlightedContent = highlightKeywords(post.content, postKeywords);

        return {
            ...post,
            content: highlightedContent,
            projectType: getProjectTypeByDate(
                post.createdAt,
                post.startDate,
                post.endDate,
                post.eventType
            )
        };
    });
};

// Funcție pentru a obține postările cu tipul corect bazat pe data
export const getAutoCategorizedPostsByType = (allProjectPosts: ProjectPost[], projectPostKeywords: Record<string, string[]>, type: 'past' | 'ongoing' | 'future'): ProjectPost[] => {
    return getAutoCategorizedPosts(allProjectPosts, projectPostKeywords).filter(post => post.projectType === type);
};

// Funcție pentru a obține toate postările
export const getAllProjectPosts = (allProjectPosts: ProjectPost[], projectPostKeywords: Record<string, string[]>): ProjectPost[] => {
    return getAutoCategorizedPosts(allProjectPosts, projectPostKeywords);
};

// Funcție pentru a obține postările după tip
export const getProjectPostsByType = (allProjectPosts: ProjectPost[], projectPostKeywords: Record<string, string[]>, type: 'past' | 'ongoing' | 'future'): ProjectPost[] => {
    return getAutoCategorizedPostsByType(allProjectPosts, projectPostKeywords, type);
};

// Funcție pentru a obține postările după interval de date
export const getProjectPostsByDateRange = (allProjectPosts: ProjectPost[], projectPostKeywords: Record<string, string[]>, startDate: string, endDate: string): ProjectPost[] => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return getAllProjectPosts(allProjectPosts, projectPostKeywords).filter(post => {
        const postDate = new Date(post.createdAt);
        return postDate >= start && postDate <= end;
    });
};

// Funcție pentru a obține postările după tag
export const getProjectPostsByTag = (allProjectPosts: ProjectPost[], projectPostKeywords: Record<string, string[]>, tag: string): ProjectPost[] => {
    return getAllProjectPosts(allProjectPosts, projectPostKeywords).filter(post =>
        post.tags.some(postTag =>
            postTag.toLowerCase().includes(tag.toLowerCase())
        )
    );
};

// Funcție pentru a adăuga o nouă postare (va fi automat categorizată)
export const addNewProjectPost = (post: Omit<ProjectPost, 'projectType'>): ProjectPost => {
    const newPost: ProjectPost = {
        ...post,
        projectType: getProjectTypeByDate(post.createdAt)
    };

    // Note: In a real application, this would be saved to a database
    // For now, this function returns the categorized post
    return newPost;
};

// Funcție pentru a verifica și actualiza tipurile de proiecte (pentru debugging)
export const refreshProjectCategories = (): void => {
    // This function can be called to refresh categories if needed
    // In a real application, this might trigger a re-render or state update
    console.log('Project categories refreshed');
};

// Funcții utilitare pentru evenimente multi-zile
export const getEventStatus = (post: ProjectPost): string => {
    if (!post.eventType || post.eventType === 'single-day') {
        return 'Eveniment de o zi';
    }

    if (post.eventType === 'multi-day' && post.startDate && post.endDate) {
        const start = new Date(post.startDate);
        const end = new Date(post.endDate);
        const now = new Date();

        if (now < start) {
            return `Începe în ${Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))} zile`;
        } else if (now >= start && now <= end) {
            return `În desfășurare - se termină în ${Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))} zile`;
        } else {
            return 'Eveniment încheiat';
        }
    }

    return 'Status necunoscut';
};

export const getEventDuration = (post: ProjectPost): string => {
    if (post.duration) {
        return post.duration;
    }

    if (post.eventType === 'multi-day' && post.startDate && post.endDate) {
        const start = new Date(post.startDate);
        const end = new Date(post.endDate);
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        return `${days} zile`;
    }

    return 'Durata necunoscută';
};

// Funcție pentru împărțirea inteligentă a conținutului în paragrafe
function splitContentIntoParagraphs(content: string): string[] {
    if (!content || content.trim().length === 0) {
        return [];
    }

    // Împărțim pe puncte urmate de spațiu, dar păstrăm structura logică
    const sentences = content
        .split(/\.\s+/)
        .filter(sentence => sentence.trim().length > 0)
        .map(sentence => sentence.trim());

    // Grupăm propozițiile în paragrafe logice (2-3 propoziții per paragraf)
    const paragraphs: string[] = [];
    let currentParagraph = '';

    for (let i = 0; i < sentences.length; i++) {
        const sentence = sentences[i];

        // Adăugăm punctul la sfârșitul propoziției dacă nu există
        const formattedSentence = sentence.endsWith('.') ? sentence : sentence + '.';

        if (currentParagraph === '') {
            currentParagraph = formattedSentence;
        } else {
            currentParagraph += ' ' + formattedSentence;
        }

        // Creăm un paragraf nou după 2-3 propoziții sau la sfârșitul textului
        const shouldCreateParagraph =
            (i + 1) % 2 === 0 || // La fiecare 2 propoziții
            i === sentences.length - 1; // Sau la sfârșitul textului

        if (shouldCreateParagraph && currentParagraph.trim().length > 0) {
            paragraphs.push(currentParagraph.trim());
            currentParagraph = '';
        }
    }

    // Dacă rămâne conținut neprocesat, îl adăugăm ca ultimul paragraf
    if (currentParagraph.trim().length > 0) {
        paragraphs.push(currentParagraph.trim());
    }

    return paragraphs.length > 0 ? paragraphs : [content];
}

// Funcții pentru a mapea ProjectPost la interfețele paginilor
export const mapToCurrentProject = (post: ProjectPost): MappedCurrentProject => {
    // Împărțim content-ul în paragrafe folosind funcția inteligentă și evidențiem cuvintele cheie
    const paragraphs = splitContentIntoParagraphs(post.content).map(paragraph =>
        highlightKeywords(paragraph, post.keywords || [])
    );

    // Generăm videoclipuri bazate pe tags
    const videos = post.tags.includes('videoCarousel') ? [
        {
            id: `video-${post.id}`,
            title: `${post.title} - Videoclip`,
            description: `Videoclip pentru ${post.title}`,
            youtubeId: "8Wf0M87QJUY" // Placeholder
        },
        {
            id: `video-${post.id}`,
            title: `${post.title} - Videoclip`,
            description: `Videoclip pentru ${post.title}`,
            youtubeId: "8Wf0M87QJUY" // Placeholder
        }
    ] : post.tags.includes('videoCarousel2') ? [
        {
            id: `video-${post.id}`,
            title: `${post.title} - Videoclip`,
            description: `Videoclip pentru ${post.title}`,
            youtubeId: "8Wf0M87QJUY" // Placeholder
        }
    ] : [];

    const testimonialVideos = post.tags.includes('testimonial') ? [
        {
            id: `video-${post.id}`,
            title: `${post.title} - Videoclip`,
            description: `Videoclip pentru ${post.title}`,
            youtubeId: "8Wf0M87QJUY" // Placeholder
        },
        {
            id: `video-${post.id}`,
            title: `${post.title} - Videoclip`,
            description: `Videoclip pentru ${post.title}`,
            youtubeId: "8Wf0M87QJUY" // Placeholder
        },
        {
            id: `video-${post.id}`,
            title: `${post.title} - Videoclip`,
            description: `Videoclip pentru ${post.title}`,
            youtubeId: "8Wf0M87QJUY" // Placeholder
        },
        {
            id: `video-${post.id}`,
            title: `${post.title} - Videoclip`,
            description: `Videoclip pentru ${post.title}`,
            youtubeId: "8Wf0M87QJUY" // Placeholder
        },
        {
            id: `video-${post.id}`,
            title: `${post.title} - Videoclip`,
            description: `Videoclip pentru ${post.title}`,
            youtubeId: "8Wf0M87QJUY" // Placeholder
        },
        {
            id: `video-${post.id}`,
            title: `${post.title} - Videoclip`,
            description: `Videoclip pentru ${post.title}`,
            youtubeId: "8Wf0M87QJUY" // Placeholder
        },
        {
            id: `video-${post.id}`,
            title: `${post.title} - Videoclip`,
            description: `Videoclip pentru ${post.title}`,
            youtubeId: "8Wf0M87QJUY" // Placeholder
        },
        {
            id: `video-${post.id}`,
            title: `${post.title} - Videoclip`,
            description: `Videoclip pentru ${post.title}`,
            youtubeId: "8Wf0M87QJUY" // Placeholder
        },
        {
            id: `video-${post.id}`,
            title: `${post.title} - Videoclip`,
            description: `Videoclip pentru ${post.title}`,
            youtubeId: "8Wf0M87QJUY" // Placeholder
        },
    ] : post.tags.includes('testimonial') ? [
        {
            id: `video-${post.id}`,
            title: `${post.title} - Videoclip`,
            description: `Videoclip pentru ${post.title}`,
            youtubeId: "8Wf0M87QJUY" // Placeholder
        }
    ] : [];

    // Generăm poze bazate pe tags și cloudinaryIds
    const photos = post.tags.includes('leftPhotoCarousel') ? [
        // Imagini din Cloudinary
        ...(post.cloudinaryIds?.map((cloudinaryId, index) => ({
            url: `https://res.cloudinary.com/drtkpapql/image/upload/q_auto/${cloudinaryId}`,
            alt: `${post.title} - Imagine ${index + 1}`,
            title: `${post.title} - Imagine ${index + 1}`
        })) || []),
        // Fallback la Unsplash dacă nu sunt imagini Cloudinary
        ...(post.cloudinaryIds?.length === 0 ? [{
            url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
            alt: post.title,
            title: post.title
        }] : [])
    ] : [];

    // Pentru evenimente multi-zile, afișăm intervalul de date
    let plannedDate: string;
    if (post.eventType === 'multi-day' && post.startDate && post.endDate) {
        const startDate = new Date(post.startDate);
        const endDate = new Date(post.endDate);
        plannedDate = `${startDate.toLocaleDateString('ro-RO')} - ${endDate.toLocaleDateString('ro-RO')}`;
    } else {
        plannedDate = (new Date(post.createdAt)).toLocaleDateString('ro-RO');
    }

    // Determinăm status-ul bazat pe data
    const now = new Date();
    const postDate = new Date(post.createdAt);
    const today = new Date();

    // Verificăm dacă createdAt este din ziua curentă
    const isToday = postDate.getDate() === today.getDate() &&
        postDate.getMonth() === today.getMonth() &&
        postDate.getFullYear() === today.getFullYear();

    let status: 'planning' | 'in-progress' | 'upcoming';
    if (isToday) {
        status = 'in-progress'; // Evenimente din ziua curentă sunt "în desfășurare"
    } else {
        const daysSinceCreation = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysSinceCreation < 30) {
            status = 'planning';
        } else if (daysSinceCreation < 60) {
            status = 'upcoming';
        } else {
            status = 'in-progress';
        }
    }

    return {
        id: post.id,
        title: post.title,
        plannedDate: plannedDate,
        description: post.content,
        paragraphs,
        videos,
        testimonialVideos,
        photos,
        status,
        postType: post.postType || ""
    };
};

export const mapToFutureProject = (post: ProjectPost): MappedFutureProject => {
    // Împărțim content-ul în paragrafe folosind funcția inteligentă și evidențiem cuvintele cheie
    const paragraphs = splitContentIntoParagraphs(post.content).map(paragraph =>
        highlightKeywords(paragraph, post.keywords || [])
    );

    const videos = post.tags.includes('videoCarousel') ? [
        {
            id: `video-${post.id}`,
            title: `${post.title} - Videoclip`,
            description: `Videoclip pentru ${post.title}`,
            youtubeId: "dQw4w9WgXcQ"
        }
    ] : [];

    const photos = post.tags.includes('leftPhotoCarousel') ? [
        // Imagini din Cloudinary
        ...(post.cloudinaryIds?.map((cloudinaryId, index) => ({
            url: `https://res.cloudinary.com/drtkpapql/image/upload/q_auto/${cloudinaryId}`,
            alt: `${post.title} - Imagine ${index + 1}`,
            title: `${post.title} - Imagine ${index + 1}`
        })) || []),
        // Fallback la Unsplash dacă nu sunt imagini Cloudinary
        ...(post.cloudinaryIds?.length === 0 ? [{
            url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
            alt: post.title,
            title: post.title
        }] : [])
    ] : [];

    // Pentru evenimente multi-zile, afișăm intervalul de date
    let plannedDate: string;
    if (post.eventType === 'multi-day' && post.startDate && post.endDate) {
        const startDate = new Date(post.startDate);
        const endDate = new Date(post.endDate);
        plannedDate = `${startDate.toLocaleDateString('ro-RO')} - ${endDate.toLocaleDateString('ro-RO')}`;
    } else {
        plannedDate = (new Date(post.createdAt)).toLocaleDateString('ro-RO');
    }

    return {
        id: post.id,
        title: post.title,
        plannedDate: plannedDate,
        description: post.content.substring(0, 200) + '...',
        paragraphs,
        videos,
        photos,
        status: 'planning',
        postType: post.postType || ""
    };
};

export const mapToPastProject = (post: ProjectPost): MappedPastProject => {
    // Împărțim content-ul în paragrafe folosind funcția inteligentă și evidențiem cuvintele cheie
    const paragraphs = splitContentIntoParagraphs(post.content).map(paragraph =>
        highlightKeywords(paragraph, post.keywords || [])
    );

    const videos = post.tags.includes('videoCarousel') ? [
        {
            id: `video-${post.id}`,
            title: `${post.title} - Videoclip`,
            description: `Videoclip pentru ${post.title}`,
            youtubeId: "_pmgTyUEPnY"
        },

    ] : post.tags.includes('videoCarousel2') ? [
        {
            id: `video-${post.id}`,
            title: `${post.title} - Videoclip`,
            description: `Videoclip pentru ${post.title}`,
            youtubeId: "r1CcbmKlm8s" // Placeholder
        }
    ] : post.tags.includes('videoCarousel3') ? [
        {
            id: `video-${post.id}`,
            title: `${post.title} - Videoclip`,
            description: `Videoclip pentru ${post.title}`,
            youtubeId: "FAS225dAE9I" // Placeholder
        }
    ] : [];

    const leftPhotos = post.tags.includes('leftPhotoCarousel') ? [
        // Imagini din Cloudinary
        ...(post.cloudinaryIds?.map((cloudinaryId, index) => ({
            url: `https://res.cloudinary.com/drtkpapql/image/upload/q_auto/${cloudinaryId}`,
            alt: `${post.title} - Imagine ${index + 1}`,
            title: `${post.title} - Imagine ${index + 1}`
        })) || []),

    ] : post.tags.includes('leftPhotoCarousel2') ? [
        // Imagini din Cloudinary
        ...(post.cloudinaryIds?.map((cloudinaryId, index) => ({
            url: `https://res.cloudinary.com/drtkpapql/image/upload/q_auto/${cloudinaryId}`,
            alt: `${post.title} - Imagine ${index + 1}`,
            title: `${post.title} - Imagine ${index + 1}`
        })) || [])
    ] : [];

    const rightPhotos = post.tags.includes('rightPhotoCarousel') ? [
        // Imagini din Cloudinary
        ...(post.cloudinaryIds?.map((cloudinaryId, index) => ({
            url: `https://res.cloudinary.com/drtkpapql/image/upload/q_auto/${cloudinaryId}`,
            alt: `${post.title} - Imagine ${index + 1}`,
            title: `${post.title} - Imagine ${index + 1}`
        })) || []),

    ] : post.tags.includes('rightPhotoCarousel2') ? [
        // Imagini din Cloudinary
        ...(post.cloudinaryIds?.map((cloudinaryId, index) => ({
            url: `https://res.cloudinary.com/drtkpapql/image/upload/q_auto/${cloudinaryId}`,
            alt: `${post.title} - Imagine ${index + 1}`,
            title: `${post.title} - Imagine ${index + 1}`
        })) || [])
    ] : [];

    // Pentru evenimente multi-zile, afișăm intervalul de date
    let displayDate: string;
    if (post.eventType === 'multi-day' && post.startDate && post.endDate) {
        const startDate = new Date(post.startDate);
        const endDate = new Date(post.endDate);
        displayDate = `${startDate.toLocaleDateString('ro-RO')} - ${endDate.toLocaleDateString('ro-RO')}`;
    } else {
        displayDate = (new Date(post.createdAt)).toLocaleDateString('ro-RO');
    }

    return {
        id: post.id,
        title: post.title,
        date: displayDate,
        description: post.content,
        paragraphs,
        videos,
        leftPhotos,
        rightPhotos,
        postType: post.postType || ""
    };
};

// Funcții pentru a obține datele mapeate pentru fiecare tip de proiect
export const getMappedCurrentProjects = (allProjectPosts: ProjectPost[], projectPostKeywords: Record<string, string[]>): MappedCurrentProject[] => {
    return getAutoCategorizedPostsByType(allProjectPosts, projectPostKeywords, 'ongoing').map(mapToCurrentProject)
        .sort((a, b) => new Date(b.plannedDate).getTime() - new Date(a.plannedDate).getTime())
};

export const getMappedFutureProjects = (allProjectPosts: ProjectPost[], projectPostKeywords: Record<string, string[]>): MappedFutureProject[] => {
    return getAutoCategorizedPostsByType(allProjectPosts, projectPostKeywords, 'future').map(mapToFutureProject)
        .sort((a, b) => new Date(b.plannedDate).getTime() - new Date(a.plannedDate).getTime())
};

export const getMappedPastProjects = (allProjectPosts: ProjectPost[], projectPostKeywords: Record<string, string[]>): MappedPastProject[] => {
    return getAutoCategorizedPostsByType(allProjectPosts, projectPostKeywords, 'past').map(mapToPastProject)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
};
