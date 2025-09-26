// Types and interfaces for the index page
// This file contains all type definitions used by the index page

export interface HeroVideo {
    id: string;
    title: string;
    description: string;
    youtubeId: string;
    thumbnail: string;
}

export interface Testimonial {
    content: string;
    author: string;
    role: string;
    avatarSrc: string;
    avatarAlt: string;
}

export interface CoachData {
    content: string;
    secondContent?: string;
    thirdContent?: string;
    fourthContent?: string;
    fifthContent?: string;
    author: string;
    role: string;
    avatarSrc: string;
    avatarAlt: string;
    imageSrc: string;
    imageAlt: string;
}

export interface ProcessedSections {
    secondSubTitle: string;
    secondSectionSubTitle: string;
    secondSectionSecondSubTitle: string;
    featuresSectionSubTitle: string;
}

export interface ProcessedCoachSections {
    coacheContent: string;
    secondContentForCoache: string;
    thirdContentForCoache: string;
    fourthContentForCoache: string;
    fifthContentForCoache: string;
    contentForFourthCoache: string;
    secondContentForFourthCoache: string;
    thirdContentForFourthCoache: string;
    fourthContentForFourthCoache: string;
    contentForSecondCoache: string;
    secondContentForSecondCoache: string;
    contentForThirdCoache: string;
    secondContentForThirdCoache: string;
}

export interface IndexPageData {
    heroVideos: HeroVideo[];
    testimonials: Testimonial[];
    coaches: CoachData[];
    sections: ProcessedSections;
    featuresSections: any[];
} 