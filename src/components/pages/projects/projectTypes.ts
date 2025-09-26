// Types and interfaces for project posts
// This file contains all type definitions used by project posts

export interface ProjectPost {
    id: string;
    title: string;
    content: string;
    author: string;
    createdAt: string;
    tags: string[];
    keywords?: string[];       // Array de cuvinte cheie pentru evidențiere
    projectType: 'past' | 'ongoing' | 'future';
    // Câmpuri pentru evenimente multi-zile
    eventType?: 'single-day' | 'multi-day' | 'ongoing';
    startDate?: string;        // Data de început pentru evenimente
    endDate?: string;          // Data de sfârșit pentru evenimente
    duration?: string;         // Durata în zile/săptămâni
    isActive?: boolean;        // Dacă evenimentul este activ în prezent
    cloudinaryIds?: string[];  // Array cu Cloudinary public IDs pentru multiple imagini
    testimonialVideos?: {
        id: string;
        title: string;
        description: string;
        youtubeId: string;
    }[];
    postType?: string;
}

// Interfețe pentru a păstra layoutul original al paginilor
export interface MappedCurrentProject {
    id: string;
    title: string;
    plannedDate: string;
    description: string;
    paragraphs: string[];
    videos: Array<{
        id: string;
        title: string;
        description?: string;
        thumbnail?: string;
        youtubeId: string;
    }>;
    testimonialVideos?: Array<{
        id: string;
        title: string;
        description?: string;
        thumbnail?: string;
        youtubeId: string;
    }>;
    photos: Array<{
        url: string;
        alt: string;
        title?: string;
    }>;
    status: 'planning' | 'in-progress' | 'upcoming';
    postType: string;
}

export interface MappedFutureProject {
    id: string;
    title: string;
    plannedDate: string;
    description: string;
    paragraphs: string[];
    videos: Array<{
        id: string;
        title: string;
        description?: string;
        thumbnail?: string;
        youtubeId: string;
    }>;
    photos: Array<{
        url: string;
        alt: string;
        title?: string;
    }>;
    status: 'planning' | 'in-progress' | 'upcoming';
    postType: string;
}

export interface MappedPastProject {
    id: string;
    title: string;
    date: string;
    description: string;
    paragraphs: string[];
    videos: Array<{
        id: string;
        title: string;
        description?: string;
        thumbnail?: string;
        youtubeId: string;
    }>;
    leftPhotos: Array<{
        url: string;
        alt: string;
        title?: string;
    }>;
    rightPhotos: Array<{
        url: string;
        alt: string;
        title?: string;
    }>;
    postType: string;
}
