// Main data processing logic for the index page
// This file contains all the business logic and data processing

import type { IndexPageData } from './IndexTypes.ts';
import { heroVideos, testimonials, createCoachesArray } from './IndexConstants.ts';
import {
    processAllSections,
    processCoachContents,
    processFeaturesWithHighlighting,
} from "@/components/utils/KeywordHighlighting";

export function processIndexPageData(
    features: any,
    keywords: {
        coacheKeywords: string[];
        secondContentForCoacheKeywords: string[];
        thirdContentForCoacheKeywords: string[];
        fourthContentForCoacheKeywords: string[];
        featuresKeywords: { [key: string]: string[] };
        secondSectionKeywords: string[];
        heroKeywords: string[];
        fifthContentForCoacheKeywords: string[];
        contentForFourthCoacheKeywords: string[];
        secondContentForFourthCoacheKeywords: string[];
        thirdContentForFourthCoacheKeywords: string[];
        fourthContentForFourthCoacheKeywords: string[];
        contentForSecondCoacheKeywords: string[];
        secondContentForSecondCoacheKeywords: string[];
        contentForThirdCoacheKeywords: string[];
        secondContentForThirdCoacheKeywords: string[];
    }
): IndexPageData {
    // Process all sections with keyword highlighting
    const sections = processAllSections({
        heroKeywords: keywords.heroKeywords,
        secondSectionKeywords: keywords.secondSectionKeywords,
    });

    // Process coach sections with keyword highlighting
    const coacheSections = processCoachContents({
        coacheKeywords: keywords.coacheKeywords,
        secondContentForCoacheKeywords: keywords.secondContentForCoacheKeywords,
        thirdContentForCoacheKeywords: keywords.thirdContentForCoacheKeywords,
        fourthContentForCoacheKeywords: keywords.fourthContentForCoacheKeywords,
        fifthContentForCoacheKeywords: keywords.fifthContentForCoacheKeywords,
        contentForFourthCoacheKeywords: keywords.contentForFourthCoacheKeywords,
        secondContentForFourthCoacheKeywords: keywords.secondContentForFourthCoacheKeywords,
        thirdContentForFourthCoacheKeywords: keywords.thirdContentForFourthCoacheKeywords,
        fourthContentForFourthCoacheKeywords: keywords.fourthContentForFourthCoacheKeywords,
        contentForSecondCoacheKeywords: keywords.contentForSecondCoacheKeywords,
        secondContentForSecondCoacheKeywords: keywords.secondContentForSecondCoacheKeywords,
        contentForThirdCoacheKeywords: keywords.contentForThirdCoacheKeywords,
        secondContentForThirdCoacheKeywords: keywords.secondContentForThirdCoacheKeywords,
    });

    // Process features with keyword highlighting
    const featuresSections = processFeaturesWithHighlighting(
        features,
        keywords.featuresKeywords,
    );

    // Create coaches array with processed content
    const coaches = createCoachesArray(coacheSections);

    return {
        heroVideos,
        testimonials,
        coaches,
        sections,
        featuresSections,
    };
} 