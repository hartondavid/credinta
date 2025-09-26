# Ghid pentru Gestionarea Postărilor de Proiecte

Acest ghid explică cum să adaugi și să gestionezi postările de proiecte pe site-ul Calarasi Warriors.

## 🚀 Funcționalitate Nouă: Categorizare Automată

**IMPORTANT**: Site-ul implementează acum o funcționalitate de **categorizare automată** a postărilor bazată pe data de creare. Postările se mută automat între pagini fără intervenție manuală!

### 📅 Reguli de Mutare Automată

- **Postări < 30 zile** → Pagina "Proiecte Viitoare"
- **Postări 30-89 zile** → Pagina "Proiecte în Curs"  
- **Postări ≥ 90 zile** → Pagina "Proiecte Trecute"

### 🔄 Cum Funcționează

1. Când adaugi o nouă postare, specifici doar `createdAt`
2. Sistemul calculează automat câte zile au trecut de la creare
3. Postarea este automat categorizată și afișată pe pagina corectă
4. Pe măsură ce timpul trece, postarea se mută automat între pagini

## 📁 Structura Fișierelor

```
src/
├── data/
│   └── projectPosts.ts          # Datele postărilor (EDITEAZĂ AICI)
├── components/
│   └── ProjectPostsDisplay.tsx  # Componenta de afișare
└── pages/
    ├── past-projects.astro      # Proiecte trecute
    ├── current-projects.astro   # Proiecte în curs
    └── future-projects.astro    # Proiecte viitoare
```

## ✏️ Cum să Adaugi o Postare Nouă

### Pasul 1: Editează `src/data/projectPosts.ts`

Deschide fișierul și găsește funcția `getAutoCategorizedPosts()`:

```typescript
export const getAutoCategorizedPosts = () => {
    const allPosts = [
        // Postările existente...
        
        // ADAUGA POSTAREA TA AICI
        {
            id: "my-new-post",
            title: "Titlul postării tale",
            content: "Conținutul postării...",
            author: "Numele tău",
            createdAt: "2024-01-25T10:00:00Z", // Data de creare (IMPORTANT!)
            tags: ["tag1", "tag2"],
            projectType: "future" as const // Acest câmp va fi suprascris automat
        }
    ];
    
    // Categorizarea se face automat aici
    return allPosts.map(post => ({
        ...post,
        projectType: getProjectTypeByDate(post.createdAt)
    }));
};
```

### Pasul 2: Creează Postarea

Adaugă o nouă postare în array-ul `allPosts`:

```typescript
{
    id: "post-2024-01-25",
    title: "Nouă inițiativă de antrenament",
    content: "Am lansat o nouă inițiativă de antrenament pentru copiii din comunitate...",
    author: "Echipa Calarasi Warriors",
    createdAt: "2024-01-25T14:30:00Z",
    tags: ["antrenament", "comunitate", "copii"],
    projectType: "future" as const // Va fi suprascris automat
}
```

### Pasul 3: Salvează și Verifică

1. Salvează fișierul
2. Postarea va apărea automat pe pagina corectă
3. Nu este nevoie să modifici `projectType` - se setează automat!

## 🎯 Exemple de Utilizare

### Exemplu 1: Postare Nouă (Va apărea pe "Proiecte Viitoare")

```typescript
{
    id: "post-2024-01-26",
    title: "Planificare turneu de primăvară",
    content: "Începem planificarea turneului de primăvară...",
    author: "Alexandru Ionescu",
    createdAt: "2024-01-26T09:00:00Z", // < 30 zile → "Viitoare"
    tags: ["turneu", "planificare", "primăvară"],
    projectType: "future" as const
}
```

### Exemplu 2: Postare Recentă (Va apărea pe "Proiecte în Curs")

```typescript
{
    id: "post-2024-01-15",
    title: "Actualizare progres program",
    content: "Programul avansează conform planului...",
    author: "Maria Popescu",
    createdAt: "2024-01-15T10:00:00Z", // 30-89 zile → "În Curs"
    tags: ["progres", "program", "actualizare"],
    projectType: "future" as const
}
```

### Exemplu 3: Postare Vechi (Va apărea pe "Proiecte Trecute")

```typescript
{
    id: "post-2023-10-15",
    title: "Finalizare proiect 2023",
    content: "Am finalizat cu succes proiectul din 2023...",
    author: "Echipa",
    createdAt: "2023-10-15T16:00:00Z", // ≥ 90 zile → "Trecute"
    tags: ["finalizare", "2023", "succes"],
    projectType: "future" as const
}
```

## 🔧 Funcții Utile

### `getProjectTypeByDate(createdAt)`
Returnează tipul proiectului bazat pe data de creare:
- `"future"` pentru postări < 30 zile
- `"current"` pentru postări 30-89 zile  
- `"past"` pentru postări ≥ 90 zile

### `addNewProjectPost(post)`
Funcție helper pentru a crea o nouă postare cu categorizare automată:

```typescript
import { addNewProjectPost } from '../data/projectPosts';

const newPost = addNewProjectPost({
    id: "unique-id",
    title: "Titlu",
    content: "Conținut",
    author: "Autor",
    createdAt: "2024-01-25T10:00:00Z",
    tags: ["tag1", "tag2"]
});

console.log(newPost.projectType); // Tipul va fi setat automat
```

## 📊 Verificare și Debugging

### Rulare Script de Test

```bash
node scripts/test-auto-categorization.js
```

Acest script testează:
- Funcția de categorizare automată
- Mutarea postărilor între pagini
- Logica de calcul a zilelor

### Verificare Manuală

1. Deschide una din paginile de proiecte
2. Verifică că postările sunt afișate corect
3. Modifică `createdAt` pentru a testa mutarea automată

## ⚠️ Important de Știut

### ✅ Ce Se Face Automat
- Categorizarea postărilor bazată pe data
- Mutarea între pagini pe măsură ce timpul trece
- Afișarea pe pagina corectă

### ❌ Ce NU Se Face Automat
- Salvarea în baza de date (trebuie să editezi fișierul)
- Notificări când o postare se mută
- Backup-ul datelor

### 🔄 Actualizări
- Postările se recategorizează la fiecare încărcare a paginii
- Nu este nevoie să rulezi scripturi speciale
- Modificările sunt vizibile imediat

## 🎨 Personalizare

### Modificarea Intervalelor de Timp

Pentru a schimba intervalele de mutare, editează funcția `getProjectTypeByDate`:

```typescript
export const getProjectTypeByDate = (createdAt: string): 'past' | 'current' | 'future' => {
    const postDate = new Date(createdAt);
    const now = new Date();
    const daysSinceCreation = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Modifică aceste valori pentru a schimba intervalele
    if (daysSinceCreation >= 90) {        // 90 zile → Past
        return 'past';
    } else if (daysSinceCreation >= 30) { // 30 zile → Current
        return 'current';
    } else {                              // < 30 zile → Future
        return 'future';
    }
};
```

### Adăugarea de Categorii Noi

Pentru a adăuga categorii noi (ex: "urgent", "planificat"), modifică:
1. Interface-ul `ProjectPost`
2. Funcția `getProjectTypeByDate`
3. Paginile de afișare

## 🚨 Troubleshooting

### Problema: Postarea nu apare pe pagina corectă
**Soluție**: Verifică că `createdAt` este în formatul corect (ISO 8601)

### Problema: Postarea nu se mută automat
**Soluție**: Asigură-te că folosești `getAutoCategorizedPosts()` în loc de array-urile statice

### Problema: Eroare de tip TypeScript
**Soluție**: Verifică că toate câmpurile obligatorii sunt prezente în postare

## 📚 Resurse Suplimentare

- **Fișier principal**: `src/data/projectPosts.ts`
- **Script de test**: `scripts/test-auto-categorization.js`
- **Componenta de afișare**: `src/components/ProjectPostsDisplay.tsx`
- **Documentația Astro**: [astro.build](https://astro.build)

## 🎯 Următorii Pași

1. **Testează funcționalitatea** cu scriptul de test
2. **Adaugă postări noi** în `projectPosts.ts`
3. **Verifică mutarea automată** modificând datele
4. **Personalizează intervalele** dacă este necesar

---

✨ **Felicitări!** Ai implementat cu succes un sistem de categorizare automată a postărilor care se întreține singur!
