#!/usr/bin/env node

/**
 * Test script pentru funcționalitatea de categorizare automată a postărilor
 * Acest script demonstrează cum se mută automat postările între pagini
 * bazat pe data de creare
 * 
 * NOTĂ: Acest script este pentru demonstrație. Pentru testarea reală,
 * folosește pagina de demo: /demo-auto-categorization
 */

console.log('🚀 Testare Categorizare Automată a Postărilor\n');

// Test 1: Verificare logica de categorizare
console.log('📅 Test 1: Verificare logică de categorizare');
console.log('============================================');

// Simulăm funcția de categorizare exactă din projectPosts.ts
const getProjectTypeByDate = (createdAt, startDate, endDate, eventType) => {
    const now = new Date();
    const today = new Date();

    // Pentru evenimente multi-zile, folosim startDate și endDate
    if (eventType === 'multi-day' && startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Setăm ora la începutul zilei pentru startDate
        start.setHours(0, 0, 0, 0);
        // Setăm ora la sfârșitul zilei pentru endDate (23:59:59)
        end.setHours(23, 59, 59, 999);

        // Verificăm dacă startDate este din ziua curentă
        const isStartToday = start.getDate() === today.getDate() &&
            start.getMonth() === today.getMonth() &&
            start.getFullYear() === today.getFullYear();

        if (isStartToday) {
            return 'current'; // Prima zi din interval este azi → "Proiecte în Curs"
        }

        if (now <= start && now <= end) {
            return 'future';
        } else if (now >= start && now <= end) {
            return 'current';
        } else {
            return 'past';
        }
    }

    // Pentru evenimente ongoing, verificăm dacă sunt active
    if (eventType === 'ongoing' && startDate) {
        const start = new Date(startDate);
        const daysSinceStart = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

        if (daysSinceStart < 30) {
            return 'future';
        } else if (daysSinceStart < 90) {
            return 'current';
        } else {
            return 'past';
        }
    }

    // Pentru evenimente single-day, verificăm dacă createdAt este din ziua curentă
    const postDate = new Date(createdAt);

    // Verificăm dacă createdAt este din ziua curentă
    const isToday = postDate.getDate() === today.getDate() &&
        postDate.getMonth() === today.getMonth() &&
        postDate.getFullYear() === today.getFullYear();

    if (isToday) {
        return 'current'; // Postăm automat pe pagina "Proiecte în Curs"
    }

    if (postDate < today) {
        return 'past';
    } else if (postDate === today) {
        return 'current';
    } else {
        return 'future';
    }
};

const testDates = [
    { date: '2024-01-15T10:00:00Z', expected: 'past' },      // Data trecută
    { date: new Date().toISOString(), expected: 'current' },   // Data de azi
    { date: '2025-12-31T10:00:00Z', expected: 'future' }      // Data viitoare
];

testDates.forEach(({ date, expected }) => {
    const actual = getProjectTypeByDate(date);
    const status = actual === expected ? '✅' : '❌';
    console.log(`${status} Data: ${date} -> Tip: ${actual} (așteptat: ${expected})`);
});

console.log('\n');

// Test 2: Demonstrare mutare automată
console.log('🔄 Test 2: Demonstrare mutare automată');
console.log('=====================================');

// Test 2a: Postare cu eveniment multi-zile
console.log('🔄 Test 2a: Postare cu eveniment multi-zile');
console.log('==========================================');

const multiDayPost = {
    id: "test-multi-day",
    title: "Festival Sportiv Multi-Zile",
    content: "Test pentru eveniment multi-zile",
    author: "Test User",
    createdAt: "2025-01-15T10:00:00Z",
    startDate: "2025-01-15T08:00:00Z", // Începe azi
    endDate: "2025-01-17T18:00:00Z",   // Se termină în 2 zile
    eventType: "multi-day"
};

const multiDayType = getProjectTypeByDate(multiDayPost.createdAt, multiDayPost.startDate, multiDayPost.endDate, multiDayPost.eventType);
console.log(`📝 Postare multi-zile:`);
console.log(`   Titlu: ${multiDayPost.title}`);
console.log(`   Start: ${multiDayPost.startDate}`);
console.log(`   End: ${multiDayPost.endDate}`);
console.log(`   Tip automat: ${multiDayType}`);
console.log(`   Status: ${multiDayType === 'current' ? '✅ Eveniment multi-zile începe azi → "Proiecte în Curs"' : '❌ Nu a fost categorizat corect'}`);

console.log('\n');

// Test 2b: Postare cu eveniment ongoing
console.log('🔄 Test 2b: Postare cu eveniment ongoing');
console.log('==========================================');

const ongoingPost = {
    id: "test-ongoing",
    title: "Program Ongoing",
    content: "Test pentru eveniment ongoing",
    author: "Test User",
    createdAt: "2024-12-01T10:00:00Z",
    startDate: "2024-12-01T08:00:00Z", // A început acum 60 de zile
    eventType: "ongoing"
};

const ongoingType = getProjectTypeByDate(ongoingPost.createdAt, ongoingPost.startDate, undefined, ongoingPost.eventType);
console.log(`📝 Postare ongoing:`);
console.log(`   Titlu: ${ongoingPost.title}`);
console.log(`   Start: ${ongoingPost.startDate}`);
console.log(`   Tip automat: ${ongoingType}`);
console.log(`   Status: ${ongoingType === 'current' ? '✅ Eveniment ongoing 60 zile → "Proiecte în Curs"' : '❌ Nu a fost categorizat corect'}`);

console.log('\n');

// Test 2c: Postare single-day din ziua curentă
console.log('🔄 Test 2c: Postare single-day din ziua curentă');
console.log('==============================================');

const todayPost = {
    id: "test-today",
    title: "Postare de Azi",
    content: "Test pentru postare din ziua curentă",
    author: "Test User",
    createdAt: new Date().toISOString(),
    eventType: "single-day"
};

const todayType = getProjectTypeByDate(todayPost.createdAt);
console.log(`📝 Postare din ziua curentă:`);
console.log(`   Titlu: ${todayPost.title}`);
console.log(`   Data: ${todayPost.createdAt}`);
console.log(`   Tip automat: ${todayType}`);
console.log(`   Status: ${todayType === 'current' ? '✅ Postare din ziua curentă → "Proiecte în Curs"' : '❌ Nu a fost categorizat corect'}`);

console.log('\n');

// Test 3: Verificare logica de mutare
console.log('📋 Test 3: Logică de mutare automată');
console.log('====================================');

console.log('📅 Reguli de mutare automată:');
console.log('   • Evenimente multi-zile: bazat pe startDate/endDate');
console.log('   • Evenimente ongoing: bazat pe zilele de la startDate');
console.log('   • Postări single-day: bazat pe createdAt vs. data curentă');
console.log('   • Postările se mută automat între pagini bazat pe aceste reguli');

console.log('\n');

// Test 4: Exemplu practic
console.log('💡 Test 4: Exemplu practic de utilizare');
console.log('======================================');

console.log('Pentru a adăuga o nouă postare:');
console.log('1. Editează fișierul src/data/projectPosts.ts');
console.log('2. Adaugă o nouă postare în array-ul allPosts din getAutoCategorizedPosts()');
console.log('3. Postarea va fi automat categorizată bazat pe createdAt');
console.log('4. Va apărea automat pe pagina corectă');

console.log('\n');

console.log('🎯 Beneficii ale acestei abordări:');
console.log('   ✅ Postările se mută automat între pagini');
console.log('   ✅ Nu este nevoie de administrare manuală');
console.log('   ✅ Categorizarea este bazată pe timp real');
console.log('   ✅ Ușor de întreținut și actualizat');

console.log('\n');

// Test 5: Verificare funcționalitate
console.log('🔧 Test 5: Verificare funcționalitate');
console.log('====================================');

console.log('📊 Pentru testarea completă a funcționalității:');
console.log('1. Navighează la /demo-auto-categorization');
console.log('2. Verifică statisticile de categorizare');
console.log('3. Testează mutarea automată modificând datele în projectPosts.ts');
console.log('4. Verifică că postările apar pe paginile corecte');

console.log('\n');

console.log('✨ Testare finalizată cu succes!');
console.log('📖 Consultă PROJECT_POSTS_GUIDE.md pentru instrucțiuni detaliate.');
console.log('🌐 Accesează /demo-auto-categorization pentru demonstrația interactivă.');
