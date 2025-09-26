// Data arrays for project posts - now reads from database
// This file contains functions to fetch data from the database

import type { ProjectPost } from './projectTypes';
import {
    getAutoCategorizedPostsByType as getAutoCategorizedPostsByTypeUtil,
    getAutoCategorizedPosts as getAutoCategorizedPostsUtil,
    getMappedCurrentProjects as getMappedCurrentProjectsUtil,
    getMappedFutureProjects as getMappedFutureProjectsUtil,
    getMappedPastProjects as getMappedPastProjectsUtil
} from './projectUtils';

// ========================================
// FUNCȚII PENTRU CITIREA DIN BAZA DE DATE
// ========================================

// Funcție pentru a citi postările din baza de date
export const fetchProjectPostsFromDB = async (projectType?: 'past' | 'ongoing' | 'future'): Promise<ProjectPost[]> => {
    try {
        const params = new URLSearchParams();
        if (projectType) {
            params.append('projectType', projectType);
        }

        const response = await fetch(`/api/projects?${params.toString()}`);
        const result = await response.json();

        if (result.success) {
            return result.posts;
        } else {
            console.error('Error fetching project posts:', result.error);
            return [];
        }
    } catch (error) {
        console.error('Error fetching project posts from database:', error);
        return [];
    }
};

// Funcție pentru a citi toate postările din baza de date
export const fetchAllProjectPostsFromDB = async (): Promise<ProjectPost[]> => {
    try {
        const response = await fetch('/api/projects');
        const result = await response.json();

        if (result.success) {
            return result.posts;
        } else {
            console.error('Error fetching all project posts:', result.error);
            return [];
        }
    } catch (error) {
        console.error('Error fetching all project posts from database:', error);
        return [];
    }
};

// Keywords pentru highlighting în postări - separate pe post
// MODIFICA KEYWORDS AICI ↓
export const projectPostKeywords: Record<string, string[]> = {
    "past-post-1": [
        "Bibliotecii Județene",
        "Alexandru Odobescu",
        "Călărași",
        "conferință",
        "sportului",
        "antrenorilor",
        "comunitate",
        "Mark Hull",
        "antrenor",
        "educator",
        "lider internațional",
        "lumea sportivă"
    ],
    "past-post-2": [
        "Bibliotecii Județene",
        "Alexandru Odobescu",
        "Călărași",
        "manager Ionela Ichim",
        "Simona Claciu",
        "invitație",
        "adolescenții",
        "importanța sportului",
        "viața cotidiană",
        "inițiativele",
        "proiectele remarcabile",
        "valori educative",
        "culturale",
        "tinerilor",
        "David Harton",
        "video"
    ],
    "past-post-3": [
        "Parcul Central",
        "Călărași",
        "Ziua Dunării",
        "eveniment sportiv",
        "echipă",
        "munca în echipă",
        "succesul personal",
        "succesul echipei",
        "John Maxwell",
        "talentul",
        "jocuri",
        "inteligența",
        "campionate",
        "colaborarea",
        "rezultate",
        "eforturi individuale",
        "comunitate puternică",
        "colaborare",
        "comunicare",
        "claritate",
        "dezvoltare continuă",
        "echipe de succes"
    ]
    // ADAUGA KEYWORDS PENTRU NOI PROIECTE AICI ↑
};

// ========================================
// FUNCȚII PENTRU ACCESAREA DATELOR (BACKWARD COMPATIBILITY)
// ========================================

// Fallback arrays pentru când baza de date nu este disponibilă
const fallbackProjectPosts: ProjectPost[] = [
    {
        id: "past-post-1",
        title: "Echilibrul dintre o minte sănătoasă si un corp sănătos",
        content: "Adresez mulțumiri sincere echipei Bibliotecii Județene Alexandru Odobescu din Călărași, doamnei manager Ionela Ichim și doamnei Simona Claciu pentru onoranta invitație din data de 23 iulie 2024. A fost o deosebită plăcere și un privilegiu să discut cu adolescenții despre importanța sportului în viața cotidiană. Îmi exprim aprecierea pentru inițiativele și proiectele remarcabile desfășurate la Biblioteca Județeană Alexandru Odobescu din Călărași. Aceste eforturi sunt esențiale în cultivarea valorilor educative și culturale în rândul tinerilor noștri. De asemenea mulțumesc lui David Harton pentru video.",
        author: "Lorem Ipsum",
        createdAt: "2024-07-23T14:30:00Z",
        tags: ["lorem", "videoCarousel2", "leftPhotoCarousel2", ""],
        postType: "CONFERINTA",
        projectType: "past"
    },
    {
        id: "past-post-2",
        title: "Ziua Dunării",
        content: "Sâmbătă 29, Iunie, intre orele 8.30 -11.00 in Parcul Central Călărași, se va desfasura un eveniment sportiv cu ocazia zilei Dunarii intitulat Ziua Dunării. Munca în echipa este CHEIA! Succesul personal nu este suficient; succesul echipei este esențial. Un renumit speaker pe nume John Maxwell spune adesea că talentul câștigă jocuri, dar munca în echipă și inteligența câștigă campionate. Colaborarea echipei produce rezultate mai mari decât suma eforturilor individuale. O comunitate puternică va pune un accent puternic pe colaborare, comunicare, claritate și dezvoltare continuă pentru a construi echipe de succes.",
        author: "Lorem Ipsum",
        createdAt: "2024-06-29T16:45:00Z",
        tags: ["lorem", "videoCarousel3", "leftPhotoCarousel3", ""],
        postType: "JOC SPORTIV",
        projectType: "past"
    }
];

// Arrays for backward compatibility - these now use the auto-categorization
export const pastProjectPosts: ProjectPost[] = getAutoCategorizedPostsByTypeUtil(fallbackProjectPosts, projectPostKeywords, 'past');
export const currentProjectPosts: ProjectPost[] = getAutoCategorizedPostsByTypeUtil(fallbackProjectPosts, projectPostKeywords, 'ongoing');
export const futureProjectPosts: ProjectPost[] = getAutoCategorizedPostsByTypeUtil(fallbackProjectPosts, projectPostKeywords, 'future');

// Funcție pentru a obține toate postările categorizate automat
export const getAutoCategorizedPosts = () => {
    return getAutoCategorizedPostsUtil(fallbackProjectPosts, projectPostKeywords);
};

// Funcție pentru a obține postările după tip
export const getAutoCategorizedPostsByType = (type: 'past' | 'ongoing' | 'future'): ProjectPost[] => {
    return getAutoCategorizedPostsByTypeUtil(fallbackProjectPosts, projectPostKeywords, type);
};

// Funcții pentru a obține datele mapeate pentru fiecare tip de proiect
export const getMappedCurrentProjects = () => {
    return getMappedCurrentProjectsUtil(fallbackProjectPosts, projectPostKeywords);
};

export const getMappedFutureProjects = () => {
    return getMappedFutureProjectsUtil(fallbackProjectPosts, projectPostKeywords);
};

export const getMappedPastProjects = () => {
    return getMappedPastProjectsUtil(fallbackProjectPosts, projectPostKeywords);
};

// Funcție pentru a obține toate postările
export const getAllProjectPosts = (): ProjectPost[] => {
    return getAutoCategorizedPostsByTypeUtil(fallbackProjectPosts, projectPostKeywords, 'past')
        .concat(getAutoCategorizedPostsByTypeUtil(fallbackProjectPosts, projectPostKeywords, 'ongoing'))
        .concat(getAutoCategorizedPostsByTypeUtil(fallbackProjectPosts, projectPostKeywords, 'future'));
};

// Funcție pentru a obține postările după tip
export const getProjectPostsByType = (type: 'past' | 'ongoing' | 'future'): ProjectPost[] => {
    return getAutoCategorizedPostsByTypeUtil(fallbackProjectPosts, projectPostKeywords, type);
};
