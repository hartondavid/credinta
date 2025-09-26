// Componentă pentru highlighting-ul cuvintelor cheie
// Dedicată paginii index.astro

// Funcția principală pentru highlighting
export const highlightKeywords = (text: string, keywords: string[]) => {
    let highlightedText = text;
    keywords.forEach((keyword) => {
        // Check if keyword contains spaces (multi-word expression)
        if (keyword.includes(" ")) {
            // For multi-word expressions, use simple string replacement
            const regex = new RegExp(
                keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
                "gi",
            );
            highlightedText = highlightedText.replace(
                regex,
                `<span class="inline font-bold text-[#305c76] transition-all duration-300 hover:scale-105 dark:text-[#74becc]">${keyword}</span>`,
            );
        } else {
            // For single words, use word boundary
            const regex = new RegExp(`\\b${keyword}\\b`, "gi");
            highlightedText = highlightedText.replace(
                regex,
                `<span class="inline font-bold text-[#305c76] transition-all duration-300 hover:scale-105 dark:text-[#74becc]">${keyword}</span>`,
            );
        }
    });
    return highlightedText;
};

// Funcție pentru procesarea features cu highlighting
export const processFeaturesWithHighlighting = (features: any[], keywords: string[]) => {
    return features.map((feature) => ({
        ...feature,
        content: highlightKeywords(feature.content, keywords),
    }));
};

// Funcție pentru procesarea conținutului antrenorilor
export const processCoachContent = (content: string, keywords: string[]) => {
    return highlightKeywords(content, keywords);
};

// Funcție pentru procesarea tuturor secțiunilor cu highlighting
export const processAllSections = (keywords: any) => {
    return {
        secondSubTitle: highlightKeywords(
            'Suntem o biserică de familie, alcătuită din oameni inimoși, uniți prin dorința de a fi aproape unii de alții și de a arăta dragostea lui Dumnezeu în mod concret.',
            keywords.heroKeywords,
        ),
        secondSectionSecondSubTitle: highlightKeywords(
            "Ne dorim să fim un loc în care fiecare persoană să găsească sprijin spiritual, prietenie și încurajare pentru viața de zi cu zi.",
            keywords.secondSectionKeywords,
        ),
        secondSectionSubTitle: highlightKeywords(
            "Ne distingem prin faptul că nu privim sportul doar ca pe o competiție, ci ca pe un mijloc de a construi caractere puternice, de a inspira schimbări pozitive și de a crea o comunitate în care fiecare individ să se simtă valoros și susținut.",
            [
                "sportul",
                "competiție",
                "mijloc",
                "caractere puternice",
                "schimbări pozitive",
                "comunitate",
                "individ",
                "valoros",
                "susținut",
            ],
        ),
        featuresSectionSubTitle: highlightKeywords(
            "Pentru noi, biserica nu este doar o clădire sau un program de duminică, ci o comunitate vie, implicată în proiecte și inițiative care întăresc legăturile dintre oameni și aduc impact social în comunitate. Prin tot ceea ce facem, vrem să fim o mărturie a credinței și a speranței.",
            [
                "biserica",
                "implicată",
                "părinții",
                "proiecte",
                "inițiative",
                "caracterul",
                "impact social",
                "mărturie",
                "credința",
                "speranța",
                "comunitate",
            ],
        ),
    };
};

// Funcție pentru procesarea conținutului antrenorilor
export const processCoachContents = (keywords: any) => {
    return {
        coacheContent: highlightKeywords(
            "Pentru mine, sportul nu înseamnă doar mișcare. Este timpul meu cu mine însămi, este locul unde îmi găsesc liniștea si echilibrul.",
            keywords.coacheKeywords,
        ),
        secondContentForCoache: highlightKeywords(
            "Sportul îmi dă energie, încredere și curaj. Mișcarea, așa cum îmi place să spun, este stare de bine.",
            keywords.secondContentForCoacheKeywords,
        ),
        thirdContentForCoache: highlightKeywords(
            "Iubesc copiii și de fiecare dată când fac ceva pentru ei, sufletul meu se umple de bucurie.",
            keywords.thirdContentForCoacheKeywords,
        ),
        fourthContentForCoache: highlightKeywords(
            "Cel mai mult îmi doresc să îi inspir să creadă în ei, să își descopere forța interioară și să înțeleagă că, prin perseverență și încredere, pot reuși orice.",
            keywords.fourthContentForCoacheKeywords,
        ),
        fifthContentForCoache: highlightKeywords(
            "Limita este infinitul!",
            keywords.fifthContentForCoacheKeywords,
        ),
        contentForFourthCoache: highlightKeywords(
            "Sunt absolvent al Liceului de Educație Fizică și Sport si fost sportiv de performanță.",
            keywords.contentForFourthCoacheKeywords,
        ),
        secondContentForFourthCoache: highlightKeywords(
            "Sportul a făcut mereu parte din viața mea și mi-a oferit nu doar sănătate ci și disciplină, încredere și bucuria muncii în echipă!",
            keywords.secondContentForFourthCoacheKeywords,
        ),
        thirdContentForFourthCoache: highlightKeywords(
            "Lucrul cu copii prin sport este pentru mine mai mult decât o alegere - este o chemare!",
            keywords.thirdContentForFourthCoacheKeywords,
        ),
        fourthContentForFourthCoache: highlightKeywords(
            "Îmi doresc să le ofer lor ceea ce mie mi-a oferit sportul: curaj, încredere și sentimentul că pot reuși oricât de greu ar părea un drum!",
            keywords.fourthContentForFourthCoacheKeywords,
        ),
        contentForSecondCoache: highlightKeywords(
            "Motivul pentru care mă implic în această activitate este dublu: pe de o parte, simt o datorie morală ca om credincios față de Dumnezeu, iar pe de altă parte, îmi iubesc comunitatea",
            keywords.contentForSecondCoacheKeywords,
        ),
        secondContentForSecondCoache: highlightKeywords(
            "Prin urmare, mă dedic să creez oportunități pentru toți cei pasionați de sport în orașul nostru și să promovez un mediu sănătos și incluziv pentru toți cei implicați: antrenori, sportivi și membrii comunității. ",
            keywords.secondContentForSecondCoacheKeywords,
        ),
        contentForThirdCoache: highlightKeywords(
            "Încă din adolescență sportul mă completează ca personalitate (alături de credință și educație).",
            keywords.contentForThirdCoacheKeywords,
        ),
        secondContentForThirdCoache: highlightKeywords(
            `În plus, în ultimii 5 ani, mi-a adus privilegiul de a descoperi copii ambițioși, muncitori, dornici să învețe și să...lupte pentru a se depăși pe ei și abia apoi pe "adversarul" din teren.`,
            keywords.secondContentForThirdCoacheKeywords,
        ),
    };
};





