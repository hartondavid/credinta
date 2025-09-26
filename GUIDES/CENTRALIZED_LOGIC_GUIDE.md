# Ghid pentru Utilizarea Logicii Centralizate

Acest ghid explică cum să folosești noile fișiere de logică centralizată pentru știri și proiecte.

## 📁 Structura Fișierelor

```
src/utils/
├── newsLogic.ts          # Logica pentru știri
├── projectsLogic.ts      # Logica pentru proiecte
├── index.ts              # Export-uri centralizate
└── ...
```

## 🔧 Utilizare în API Routes

### Pentru Știri

```typescript
// src/pages/api/news.ts
import { newsLogic } from '@/utils/newsLogic';

export const GET: APIRoute = async ({ url }) => {
    const postType = url.searchParams.get('postType');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    
    const result = await newsLogic.getNews({
        postType,
        limit,
        offset
    });
    
    if (result.success) {
        return new Response(JSON.stringify(result.data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } else {
        return new Response(JSON.stringify({ error: result.error }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
```

### Pentru Proiecte

```typescript
// src/pages/api/projects.ts
import { projectsLogic } from '@/utils/projectsLogic';

export const GET: APIRoute = async ({ url }) => {
    const projectType = url.searchParams.get('projectType');
    const postType = url.searchParams.get('postType');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    
    const result = await projectsLogic.getProjects({
        projectType,
        postType,
        limit
    });
    
    if (result.success) {
        return new Response(JSON.stringify(result.data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } else {
        return new Response(JSON.stringify({ error: result.error }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
```

## 🎯 Funcționalități Disponibile

### NewsLogic

- `getNews(filters)` - Obține știri cu filtrare
- `getNewsById(id)` - Obține o știre specifică
- `createNews(data)` - Creează o știre nouă
- `updateNews(id, data)` - Actualizează o știre
- `deleteNews(id)` - Șterge o știre
- `searchNews(term, limit)` - Caută știri

### ProjectsLogic

- `getProjects(filters)` - Obține proiecte cu filtrare
- `getProjectById(id)` - Obține un proiect specific
- `createProject(data)` - Creează un proiect nou
- `updateProject(id, data)` - Actualizează un proiect
- `deleteProject(id)` - Șterge un proiect
- `searchProjects(term, limit)` - Caută proiecte
- `getProjectsByType(type, limit)` - Obține proiecte după tip
- `getActiveProjects(limit)` - Obține proiecte active
- `getProjectStats()` - Obține statistici despre proiecte

## 🔍 Filtre Disponibile

### NewsFilters
```typescript
interface NewsFilters {
    postType?: string;     // 'PODCAST', 'CONFERINTA', etc.
    limit?: number;        // Numărul de rezultate
    offset?: number;       // Offset pentru paginare
    search?: string;       // Căutare în titlu, conținut, autor
}
```

### ProjectFilters
```typescript
interface ProjectFilters {
    projectType?: string;  // 'past', 'current', 'future'
    postType?: string;     // 'CONFERINTA', 'JOC SPORTIV', etc.
    eventType?: string;    // 'single-day', 'multi-day', 'ongoing'
    isActive?: boolean;    // Proiecte active/inactive
    limit?: number;        // Numărul de rezultate
    offset?: number;       // Offset pentru paginare
    search?: string;       // Căutare în titlu, conținut, autor
}
```

## 📊 Exemple de Utilizare

### Obținerea Știrilor Recente
```typescript
const recentNews = await newsLogic.getNews({
    limit: 10,
    offset: 0
});
```

### Căutarea Proiectelor
```typescript
const searchResults = await projectsLogic.searchProjects('basketball', 5);
```

### Obținerea Proiectelor Active
```typescript
const activeProjects = await projectsLogic.getActiveProjects(20);
```

### Statistici Proiecte
```typescript
const stats = await projectsLogic.getProjectStats();
console.log(`Total proiecte: ${stats.data.total}`);
console.log(`Proiecte active: ${stats.data.active}`);
```

## ✅ Beneficii

1. **Cod Reutilizabil** - Logica este centralizată și poate fi folosită în multiple locuri
2. **Consistență** - Toate operațiunile folosesc aceeași logică de validare și parsare
3. **Mentenanță Ușoară** - Modificările se fac într-un singur loc
4. **Type Safety** - TypeScript interfaces pentru toate datele
5. **Error Handling** - Gestionarea erorilor este consistentă
6. **Performance** - Singleton pattern pentru conexiuni la baza de date

## 🚀 Următorii Pași

1. **Refactorizează API routes** să folosească noile clase de logică
2. **Adaugă teste unitare** pentru logica de business
3. **Implementează caching** pentru operațiunile frecvente
4. **Adaugă logging** pentru debugging și monitoring
