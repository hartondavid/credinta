// Main data processing logic for the about us page
// This file contains all the business logic and data processing

import type { AboutUsPageData, Lesson, ProcessedSections } from './AboutUsTypes.ts';
import { heroVideos } from './AboutUsConstants.ts';
import {
    highlightKeywords,
    processFeaturesWithHighlighting,
} from "@/components/utils/KeywordHighlighting";

export function processAboutUsPageData(
    lessons: Lesson[],
    keywords: {
        featuresSectionSubTitleKeywords: string[];
        fifthSectionSubTitleKeywords: string[];
        fifthSectionSecondSubTitleKeywords: string[];
        fifthSectionThirdSubTitleKeywords: string[];
        thirdSectionSubTitleKeywords: string[];
        lessonsKeywords: string[];
    }
): AboutUsPageData {
    // Process all sections with keyword highlighting
    const sections: ProcessedSections = {
        featuresSectionSubTitle: highlightKeywords(
            "Baschetul este un sport \"de înălțime\", trebuie să te înalți pentru a arunca mingea la coș, simbolizând astfel efortul necesar pentru a-ți atinge scopurile în viață.",
            keywords.featuresSectionSubTitleKeywords,
        ),
        featuresSectionSecondSubTitle: highlightKeywords(
            "Acest proiect a fost conceput ca o combinație armonioasă între sport și educație. Am ales baschetul ca punct central, acesta fiind un sport care, dincolo de aspectul său competitiv, transmite și învățăminte esențiale despre colaborare, perseverență și depășirea obstacolelor. ",
            keywords.featuresSectionSubTitleKeywords,
        ),
        thirdSectionSubTitle: highlightKeywords(
            "Unii copii/tineri sau reîntors la școală, unii au scăpat de vicii, alții și-au revizuit comportamentul față de părinți, alții față de profesori, alții față de colegii lor...  Așa că am lansat acest proiect la nivel de comunitate, propunând și celorlalți antrenori să facem un parteneriat în care să facem o diferență benefică în rândul comunității noastre.",
            keywords.thirdSectionSubTitleKeywords,
        ),
        fifthSectionSubTitle: highlightKeywords(
            "Identitatea noastră se bazează pe credință, unitate și dorința de a fi lumină în orașul nostru. Suntem o biserică mică, dar cu o inimă mare, care privește cu încredere spre viitor și caută să crească în har, în adevăr și în dragoste.",
            keywords.fifthSectionSubTitleKeywords,
        ),
        fifthSectionSecondSubTitle: highlightKeywords(
            "Baptiștii sunt o ramură a creștinismului protestant, cunoscută pentru accentul pus pe botezul credinței (prin scufundare, doar pentru cei care își mărturisesc credința personală) și pe autoritatea supremă a Bibliei în viața credincioșilor și a bisericii.",
            keywords.fifthSectionSecondSubTitleKeywords,
        ),
        fifthSectionThirdSubTitle: highlightKeywords(
            "Noi credem în mântuirea prin har, prin credința în Isus Hristos, și promovăm autonomia bisericii locale, libertatea religioasă și separarea dintre biserică și stat.",
            keywords.fifthSectionThirdSubTitleKeywords,
        ),
    };

    // Process lessons with keyword highlighting
    const lessonsWithHighlighting = processFeaturesWithHighlighting(
        lessons,
        keywords.lessonsKeywords,
    );

    return {
        heroVideos,
        lessons: lessonsWithHighlighting,
        sections,
    };
} 