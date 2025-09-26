# 🚀 Categorizare Automată a Postărilor de Proiecte

## 📋 Prezentare Generală

Sistemul de categorizare automată a postărilor de proiecte implementează o funcționalitate inteligentă care mută automat postările între paginile de proiecte bazat pe data de creare, eliminând necesitatea administrării manuale.

## 🎯 Funcționalități Cheie

### ✅ Categorizare Automată
- **Postări < 30 zile** → Pagina "Proiecte Viitoare"
- **Postări 30-89 zile** → Pagina "Proiecte în Curs"
- **Postări ≥ 90 zile** → Pagina "Proiecte Trecute"

### ✅ Mutare Automată
- Postările se mută automat între pagini pe măsură ce timpul trece
- Nu este nevoie de intervenție manuală
- Categorizarea se actualizează la fiecare încărcare a paginii

### ✅ Compatibilitate Înapoi
- Toate funcțiile existente continuă să funcționeze
- Array-urile statice sunt înlocuite cu funcții dinamice
- API-ul rămâne neschimbat pentru componentele existente

## 🏗️ Arhitectura Sistemului

### 1. Funcția Principală de Categorizare

```typescript
export const getProjectTypeByDate = (createdAt: string): 'past' | 'current' | 'future' => {
    const postDate = new Date(createdAt);
    const now = new Date();
    const daysSinceCreation = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceCreation >= 90) {
        return 'past';
    } else if (daysSinceCreation >= 30) {
        return 'current';
    } else {
        return 'future';
    }
};
```

### 2. Funcția de Categorizare Automată

```typescript
export const getAutoCategorizedPosts = () => {
    const allPosts = [
        // Toate postările într-un singur array
    ];
    
    // Categorizarea se face automat aici
    return allPosts.map(post => ({
        ...post,
        projectType: getProjectTypeByDate(post.createdAt)
    }));
};
```

### 3. Funcții Helper

```typescript
// Obține postările după tip (cu categorizare automată)
export const getAutoCategorizedPostsByType = (type: 'past' | 'current' | 'future'): ProjectPost[] => {
    return getAutoCategorizedPosts().filter(post => post.projectType === type);
};

// Adaugă o nouă postare (cu categorizare automată)
export const addNewProjectPost = (post: Omit<ProjectPost, 'projectType'>): ProjectPost => {
    const newPost: ProjectPost = {
        ...post,
        projectType: getProjectTypeByDate(post.createdAt)
    };
    return newPost;
};
```

## 📁 Structura Fișierelor

```
src/
├── data/
│   └── projectPosts.ts                    # ✅ MODIFICAT - Categorizare automată
├── components/
│   └── ProjectPostsDisplay.tsx            # ✅ Neschimbat
├── pages/
│   ├── past-projects.astro                # ✅ Neschimbat
│   ├── current-projects.astro             # ✅ Neschimbat
│   ├── future-projects.astro              # ✅ Neschimbat
│   └── demo-auto-categorization.astro     # 🆕 NOU - Pagină de demonstrație
└── utils/
    └── navigation.ts                      # ✅ MODIFICAT - Link către demo
```

## 🔧 Cum să Folosești

### 1. Adăugarea unei Postări Noi

```typescript
// În src/data/projectPosts.ts
export const getAutoCategorizedPosts = () => {
    const allPosts = [
        // Postările existente...
        
        // ADAUGA POSTAREA TA AICI
        {
            id: "my-new-post",
            title: "Titlul postării",
            content: "Conținutul postării...",
            author: "Autorul",
            createdAt: "2024-01-25T10:00:00Z", // IMPORTANT: Data de creare
            tags: ["tag1", "tag2"],
            projectType: "future" as const // Va fi suprascris automat
        }
    ];
    
    return allPosts.map(post => ({
        ...post,
        projectType: getProjectTypeByDate(post.createdAt)
    }));
};
```

### 2. Verificarea Categorizării

```typescript
import { getAutoCategorizedPostsByType } from '../data/projectPosts';

// Obține postările pentru fiecare tip
const futurePosts = getAutoCategorizedPostsByType('future');
const currentPosts = getAutoCategorizedPostsByType('current');
const pastPosts = getAutoCategorizedPostsByType('past');

console.log('Postări viitoare:', futurePosts.length);
console.log('Postări în curs:', currentPosts.length);
console.log('Postări trecute:', pastPosts.length);
```

### 3. Testarea Funcționalității

```bash
# Rulare script de test
node scripts/test-auto-categorization.js

# Accesare pagină de demonstrație
# Navighează la /demo-auto-categorization
```

## 🎨 Personalizare

### Modificarea Intervalelor de Timp

```typescript
export const getProjectTypeByDate = (createdAt: string): 'past' | 'current' | 'future' => {
    const postDate = new Date(createdAt);
    const now = new Date();
    const daysSinceCreation = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Modifică aceste valori pentru a schimba intervalele
    if (daysSinceCreation >= 120) {       // 120 zile → Past
        return 'past';
    } else if (daysSinceCreation >= 45) { // 45 zile → Current
        return 'current';
    } else {                              // < 45 zile → Future
        return 'future';
    }
};
```

### Adăugarea de Categorii Noi

```typescript
// 1. Modifică interface-ul
export interface ProjectPost {
    // ... câmpurile existente
    projectType: 'past' | 'current' | 'future' | 'urgent' | 'archived';
}

// 2. Modifică funcția de categorizare
export const getProjectTypeByDate = (createdAt: string): ProjectPost['projectType'] => {
    // ... logica de categorizare
    if (daysSinceCreation >= 90) return 'past';
    if (daysSinceCreation >= 30) return 'current';
    if (daysSinceCreation >= 7) return 'urgent';
    return 'future';
};
```

## 📊 Beneficii

### 🎯 Pentru Dezvoltatori
- **Cod mai curat**: O singură sursă de adevăr pentru postări
- **Mentenanță ușoară**: Nu mai trebuie să muti manual postările
- **Flexibilitate**: Ușor de personalizat intervalele de timp
- **Debugging**: Funcții helper pentru verificarea categorizării

### 🎯 Pentru Utilizatori
- **Actualizări automate**: Postările se mută singure între pagini
- **Organizare consistentă**: Categorizarea este bazată pe timp real
- **Experiență îmbunătățită**: Conținutul este întotdeauna la zi

### 🎯 Pentru Site
- **SEO îmbunătățit**: Conținutul este organizat cronologic
- **Performanță**: Categorizarea se face la runtime, nu la build
- **Scalabilitate**: Ușor de extins cu noi categorii

## 🧪 Testing și Debugging

### Script de Test

```bash
node scripts/test-auto-categorization.js
```

Acest script testează:
- Funcția de categorizare automată
- Mutarea postărilor între pagini
- Logica de calcul a zilelor
- Exemple practice de utilizare

### Pagină de Demonstrație

Accesează `/demo-auto-categorization` pentru:
- Vizualizarea în timp real a categorizării
- Statistici despre postări
- Exemple practice de mutare automată
- Explicații detaliate despre cum funcționează

### Verificare Manuală

1. **Modifică datele** în `projectPosts.ts`
2. **Verifică categorizarea** pe paginile de proiecte
3. **Testează mutarea** modificând `createdAt`
4. **Monitorizează console-ul** pentru log-uri

## ⚠️ Considerații Importante

### ✅ Ce Se Face Automat
- Categorizarea postărilor bazată pe data
- Mutarea între pagini pe măsură ce timpul trece
- Afișarea pe pagina corectă
- Actualizarea la fiecare încărcare

### ❌ Ce NU Se Face Automat
- Salvarea în baza de date (trebuie să editezi fișierul)
- Notificări când o postare se mută
- Backup-ul datelor
- Sincronizarea între medii (dev/prod)

### 🔄 Actualizări
- Postările se recategorizează la fiecare încărcare
- Nu este nevoie să rulezi scripturi speciale
- Modificările sunt vizibile imediat
- Categorizarea este bazată pe timpul curent

## 🚨 Troubleshooting

### Problema: Postarea nu apare pe pagina corectă
**Soluție**: Verifică că `createdAt` este în formatul corect (ISO 8601)

### Problema: Postarea nu se mută automat
**Soluție**: Asigură-te că folosești `getAutoCategorizedPosts()` în loc de array-urile statice

### Problema: Eroare de tip TypeScript
**Soluție**: Verifică că toate câmpurile obligatorii sunt prezente în postare

### Problema: Categorizarea nu se actualizează
**Soluție**: Verifică că nu ai cache-uri vechi și că folosești funcțiile corecte

## 📚 Resurse Suplimentare

- **Ghid complet**: `PROJECT_POSTS_GUIDE.md`
- **Script de test**: `scripts/test-auto-categorization.js`
- **Pagina de demo**: `/demo-auto-categorization`
- **Cod sursă**: `src/data/projectPosts.ts`

## 🎯 Următorii Pași

1. **Testează funcționalitatea** cu scriptul de test
2. **Explorează pagina de demo** pentru a înțelege cum funcționează
3. **Adaugă postări noi** în `projectPosts.ts`
4. **Verifică mutarea automată** modificând datele
5. **Personalizează intervalele** dacă este necesar
6. **Extinde cu categorii noi** dacă este cazul

## 🤝 Contribuții

Pentru a contribui la îmbunătățirea acestei funcționalități:

1. **Raportează bug-urile** cu exemple concrete
2. **Sugerează îmbunătățiri** cu cazuri de utilizare
3. **Contribuie cu cod** prin pull request-uri
4. **Îmbunătățește documentația** pentru alte persoane

---

✨ **Felicitări!** Ai implementat cu succes un sistem inteligent de categorizare automată a postărilor care se întreține singur și oferă o experiență superioară utilizatorilor!
