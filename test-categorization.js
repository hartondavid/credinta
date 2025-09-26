import { getAutoCategorizedPosts, getAutoCategorizedPostsByType } from './src/components/pages/projects/projectPosts.ts';

console.log('=== TEST CATEGORIZARE EVENIMENTE ===\n');

// Obținem toate postările cu tipul lor
const allPosts = getAutoCategorizedPosts();

console.log('Toate postările cu tipul lor:');
allPosts.forEach(post => {
    console.log(`- ${post.title}`);
    console.log(`  Tip: ${post.projectType}`);
    console.log(`  Created: ${post.createdAt}`);
    if (post.eventType === 'multi-day' && post.startDate && post.endDate) {
        console.log(`  Start: ${post.startDate}`);
        console.log(`  End: ${post.endDate}`);
    }
    console.log('');
});

// Verificăm postările curente
const currentPosts = getAutoCategorizedPostsByType('current');
console.log(`\n=== POSTĂRI CURENTE (${currentPosts.length}) ===`);
currentPosts.forEach(post => {
    console.log(`- ${post.title} (${post.projectType})`);
});

// Verificăm postările viitoare
const futurePosts = getAutoCategorizedPostsByType('future');
console.log(`\n=== POSTĂRI VIITOARE (${futurePosts.length}) ===`);
futurePosts.forEach(post => {
    console.log(`- ${post.title} (${post.projectType})`);
});

// Verificăm postările trecute
const pastPosts = getAutoCategorizedPostsByType('past');
console.log(`\n=== POSTĂRI TRECUTE (${pastPosts.length}) ===`);
pastPosts.forEach(post => {
    console.log(`- ${post.title} (${post.projectType})`);
});

console.log('\n=== DATA CURENTĂ ===');
const now = new Date();
console.log(`Data curentă: ${now.toISOString()}`);
console.log(`Data curentă (RO): ${now.toLocaleDateString('ro-RO')}`);
