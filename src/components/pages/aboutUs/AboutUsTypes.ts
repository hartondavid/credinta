// Types and interfaces for the about us page
// This file contains all type definitions used by the about us page

export interface HeroVideo {
    id: string;
    title: string;
    description: string;
    youtubeId: string;
    thumbnail: string;
}

export interface Lesson {
    id: string;
    title: string;
    content: string;
    icon?: string;
}

export interface ProcessedSections {
    featuresSectionSubTitle: string;
    featuresSectionSecondSubTitle: string;
    thirdSectionSubTitle: string;
    fifthSectionSubTitle: string;
    fifthSectionSecondSubTitle: string;
    fifthSectionThirdSubTitle: string;
}

export interface AboutUsPageData {
    heroVideos: HeroVideo[];
    lessons: Lesson[];
    sections: ProcessedSections;
}
