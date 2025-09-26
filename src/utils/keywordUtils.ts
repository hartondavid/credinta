// Utility function for highlighting keywords in content
export function highlightKeywords(content: string, keywords: string[] = []): string {
    if (!keywords || keywords.length === 0) {
        return content;
    }

    // Create regex pattern for case-insensitive matching
    const keywordPattern = keywords
        .map(keyword => keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) // Escape special regex characters
        .join('|');

    const regex = new RegExp(`\\b(${keywordPattern})\\b`, 'gi');

    // Replace keywords with highlighted versions
    return content.replace(regex, (match) => {
        return `<span class="keyword-highlight bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100 px-1 rounded font-medium">${match}</span>`;
    });
}

// Function to split content into paragraphs with keyword highlighting
export function splitContentIntoParagraphsWithKeywords(content: string, keywords: string[] = []): string[] {
    // First highlight keywords
    const highlightedContent = highlightKeywords(content, keywords);

    // Then split into paragraphs
    const sentences = highlightedContent.split(/(?<=[.!?])\s+/);
    const paragraphs: string[] = [];
    let currentParagraph = '';

    for (const sentence of sentences) {
        if (currentParagraph.length + sentence.length > 200) {
            if (currentParagraph.trim()) {
                paragraphs.push(currentParagraph.trim());
            }
            currentParagraph = sentence;
        } else {
            currentParagraph += (currentParagraph ? ' ' : '') + sentence;
        }
    }

    if (currentParagraph.trim()) {
        paragraphs.push(currentParagraph.trim());
    }

    return paragraphs.length > 0 ? paragraphs : [highlightedContent];
}
