// Utility functions for the index page
// This file contains helper functions and data processing logic

import type { CoachData } from './IndexTypes';

// Static data arrays
export const heroVideos = [
    {
        id: "1",
        title: "Calarasi Warriors - Training Session",
        description: "Watch our athletes in action during their training sessions",
        youtubeId: "dQw4w9WgXcQ", // Rick Astley - Never Gonna Give You Up (this will work)
        thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg", // Direct thumbnail URL
    },
    {
        id: "2",
        title: "Community Sports Event",
        description: "Highlights from our community sports events and activities",
        youtubeId: "9bZkp7q19f0", // PSY - GANGNAM STYLE (this will work)
        thumbnail: "https://img.youtube.com/vi/9bZkp7q19f0/hqdefault.jpg", // Direct thumbnail URL
    },
    {
        id: "3",
        title: "Athlete Development Program",
        description: "See how we develop young athletes through our programs",
        youtubeId: "jNQXAC9IVRw", // Me at the zoo (first YouTube video - this will work)
        thumbnail: "https://img.youtube.com/vi/jNQXAC9IVRw/hqdefault.jpg", // Direct thumbnail URL
    },
];

export const testimonials = [
    {
        content:
            "Pentru Gabi, baschetul este o adevărată pasiune și o parte importantă din viața lui.",
        secondContent: "Încă de la primele antrenamente la Călărași Warriors, a descoperit nu doar plăcerea jocului, ci și disciplina, spiritul de echipă și dorința de a-și depăși limitele.",
        thirdContent: "Un rol decisiv în această evoluție îl au antrenorii clubului, care știu să îmbine profesionalismul cu răbdarea și implicarea. Prin metodele lor de pregătire, prin atenția acordată fiecărui copil și prin atmosfera de încredere pe care o creează, reușesc să transmită mai mult decât simple tehnici sportive: transmit valori de viață – perseverență, respect, muncă în echipă și încredere în sine.",
        fourthContent: "Pentru copilul meu, fiecare antrenament este o oportunitate de a învăța și de a progresa, iar fiecare meci este o nouă provocare și o bucurie imensă. Aici a găsit nu doar un club sportiv, ci o adevărată familie, în care se simte sprijinit și motivat să devină cea mai bună versiune a sa, atât pe teren, cât și în afara lui.",
        fifthContent: "Suntem recunoscători clubului Călărași Warriors și antrenorilor dedicați pentru pasiunea, profesionalismul și devotamentul cu care formează nu doar sportivi, ci și caractere puternice.",
        author: "Anton Mădălina",
        role: "Părinte, profesor",
        avatarSrc: "https://res.cloudinary.com/drtkpapql/image/upload/w_40,h_40,c_fill,q_auto/Anton_Mădălina_fatv75",
        avatarAlt: "Lorem Ipsum",
    },


];

// Function to create coaches array with processed content
export const createCoachesArray = (coacheSections: any): CoachData[] => [
    {
        content: coacheSections.coacheContent,
        secondContent: coacheSections.secondContentForCoache,
        thirdContent: coacheSections.thirdContentForCoache,
        fourthContent: coacheSections.fourthContentForCoache,
        fifthContent: coacheSections.fifthContentForCoache,
        author: "Oana Catrinel Bogatu",
        role: "Antrenor",
        avatarSrc:
            "https://res.cloudinary.com/drtkpapql/image/upload/w_40,h_40,c_fill,q_auto/Oana_Bogatu_rg6c6m",
        avatarAlt: "Lorem Ipsum",
        imageSrc:
            "https://res.cloudinary.com/drtkpapql/image/upload/v1757451350/Oana_Bogatu_jzhgrp.gif",
        imageAlt: "Lorem Ipsum",
    },
    {
        content: coacheSections.contentForSecondCoache,
        secondContent: coacheSections.secondContentForSecondCoache,
        author: "Iulian Vasile",
        role: "Președinte, antrenor",
        avatarSrc:
            "https://res.cloudinary.com/drtkpapql/image/upload/w_40,h_40,c_fill,q_auto/Iulian_Vasile_u6hoee",
        avatarAlt: "Iulian Vasile avatar",
        imageSrc:
            "https://res.cloudinary.com/drtkpapql/image/upload/v1757451349/Iulian_Vasile_tbcuox.gif",
        imageAlt: "Iulian Vasile GIF presentation",
    },
    {
        content: coacheSections.contentForThirdCoache,
        secondContent: coacheSections.secondContentForThirdCoache,
        author: "Dan Cedric Prica",
        role: "Vicepreședinte, antrenor",
        avatarSrc:
            "https://res.cloudinary.com/drtkpapql/image/upload/w_40,h_40,c_fill,q_auto/Dan_Cedric_Prica_ivf2u3",
        avatarAlt: "Lorem Ipsum",
        imageSrc:
            "https://res.cloudinary.com/drtkpapql/image/upload/v1757451350/Dan_Cedric_Prica_eyldnz.gif",
        imageAlt: "Lorem Ipsum",
    },
    {
        content: coacheSections.contentForFourthCoache,
        secondContent: coacheSections.secondContentForFourthCoache,
        thirdContent: coacheSections.thirdContentForFourthCoache,
        fourthContent: coacheSections.fourthContentForFourthCoache,
        author: "Cristinel-Ionel Maxim",
        role: "Antrenor",
        avatarSrc:
            "https://res.cloudinary.com/drtkpapql/image/upload/w_40,h_40,c_fill,q_auto/Maxim_Cristinel_Ionel_swpo52",
        avatarAlt: "Lorem Ipsum",
        imageSrc:
            "https://res.cloudinary.com/drtkpapql/image/upload/v1757539346/Maxim_Cristinel_Ionel_df1vnn.gif",
        imageAlt: "Lorem Ipsum",
    },
];

export const sportiveSections = [
    {
        id: `video-1`,
        name: `Baschet`,
        imageSrc:
            "https://res.cloudinary.com/drtkpapql/image/upload/v1757425826/basketball_pp51z8.gif",
    },
    {
        id: `video-2`,
        name: `Baseball5`,
        imageSrc:
            "https://res.cloudinary.com/drtkpapql/image/upload/v1757424830/baseball5_ar5ofz.gif",
    },
    {
        id: `video-3`,
        name: `Fitness și Bodybuilding`,
        imageSrc:
            "https://res.cloudinary.com/drtkpapql/image/upload/v1757424826/fitness_clrdm3.gif",
    },
    {
        id: `video-4`,
        name: `Aerobic`,
        imageSrc:
            "https://res.cloudinary.com/drtkpapql/image/upload/v1757424826/aerobic_cswylr.gif",
    },


];