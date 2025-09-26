# 🗓️ Ghid pentru Evenimente Multi-Zile

Acest ghid explică cum să gestionezi evenimente care se desfășoară în mai multe zile în sistemul de categorizare automată a proiectelor.

## 📋 Tipuri de Evenimente

### 1. **Evenimente Single-Day** (O zi)
- **Câmpuri necesare:** `createdAt`
- **Categorizare:** Bazată pe data de creare
- **Exemplu:** Competiții, ateliere de o zi

```typescript
{
    id: "single-event-1",
    title: "Atelier de Fotbal",
    content: "Atelier de o zi pentru tineri...",
    author: "Antrenor",
    createdAt: "2025-08-15T09:00:00Z",
    tags: ["atelier", "fotbal"],
    projectType: "future" as const,
    eventType: "single-day" as const
}
```

### 2. **Evenimente Multi-Zile** (Mai multe zile)
- **Câmpuri necesare:** `startDate`, `endDate`, `duration`
- **Categorizare:** Bazată pe perioada de desfășurare
- **Exemplu:** Campionate, festivaluri, cursuri

```typescript
{
    id: "multi-day-event-1",
    title: "Campionatul Local de Fotbal",
    content: "Campionat de 6 zile...",
    author: "Organizator",
    createdAt: "2025-08-10T08:00:00Z",
    tags: ["campionat", "fotbal"],
    projectType: "future" as const,
    eventType: "multi-day" as const,
    startDate: "2025-09-01T08:00:00Z",
    endDate: "2025-09-06T18:00:00Z",
    duration: "6 zile",
    isActive: false
}
```

### 3. **Evenimente Ongoing** (În desfășurare)
- **Câmpuri necesare:** `startDate`, `duration`
- **Categorizare:** Bazată pe data de început
- **Exemplu:** Programe de antrenament, cursuri continue

```typescript
{
    id: "ongoing-event-1",
    title: "Programul de Antrenament",
    content: "Program continuu de antrenament...",
    author: "Antrenor",
    createdAt: "2025-07-01T08:00:00Z",
    tags: ["antrenament", "program"],
    projectType: "current" as const,
    eventType: "ongoing" as const,
    startDate: "2025-06-01T08:00:00Z",
    duration: "3 luni",
    isActive: true
}
```

## 🔄 Categorizarea Automată

### **Evenimente Multi-Zile:**
- **`startDate` în viitor** → `future`
- **`startDate` în trecut + `endDate` în viitor** → `current`
- **`endDate` în trecut** → `past`

### **Evenimente Ongoing:**
- **`startDate` în viitor** → `future`
- **`startDate` în trecut + < 30 zile** → `future`
- **`startDate` în trecut + 30-89 zile** → `current`
- **`startDate` în trecut + ≥ 90 zile** → `past`

### **Evenimente Single-Day:**
- **`createdAt` în viitor** → `future`
- **`createdAt` în trecut + < 30 zile** → `future`
- **`createdAt` în trecut + 30-89 zile** → `current`
- **`createdAt` în trecut + ≥ 90 zile** → `past`

## 🛠️ Implementare

### **1. Adaugă câmpurile în interfața ProjectPost:**

```typescript
export interface ProjectPost {
    id: string;
    title: string;
    content: string;
    author: string;
    createdAt: string;
    tags: string[];
    projectType: 'past' | 'current' | 'future';
    
    // Câmpuri pentru evenimente multi-zile
    eventType?: 'single-day' | 'multi-day' | 'ongoing';
    startDate?: string;        // Data de început
    endDate?: string;          // Data de sfârșit
    duration?: string;         // Durata în zile/săptămâni
    isActive?: boolean;        // Dacă este activ
}
```

### **2. Folosește funcțiile utilitare:**

```typescript
import { getEventStatus, getEventDuration } from "../data/projectPosts";

// Obține statusul evenimentului
const status = getEventStatus(post);
// "Începe în 5 zile" / "În desfășurare - se termină în 3 zile" / "Eveniment încheiat"

// Obține durata evenimentului
const duration = getEventDuration(post);
// "6 zile" / "3 luni"
```

## 📅 Exemple de Utilizare

### **Campionat de 5 zile:**
```typescript
{
    id: "campionat-2025",
    title: "Campionatul de Primăvară",
    content: "Campionat de fotbal pentru juniori...",
    author: "Organizator",
    createdAt: "2025-02-01T10:00:00Z",
    tags: ["campionat", "juniori"],
    eventType: "multi-day" as const,
    startDate: "2025-03-15T08:00:00Z",
    endDate: "2025-03-19T18:00:00Z",
    duration: "5 zile",
    isActive: false
}
```

### **Curs de 2 săptămâni:**
```typescript
{
    id: "curs-sportiv",
    title: "Curs Intensiv de Antrenament",
    content: "Curs de 2 săptămâni pentru antrenori...",
    author: "Instructor",
    createdAt: "2025-01-15T09:00:00Z",
    tags: ["curs", "antrenori"],
    eventType: "multi-day" as const,
    startDate: "2025-04-01T09:00:00Z",
    endDate: "2025-04-14T17:00:00Z",
    duration: "2 săptămâni",
    isActive: false
}
```

### **Program continuu:**
```typescript
{
    id: "program-antrenament",
    title: "Programul de Antrenament Continuu",
    content: "Program de antrenament pentru toată sezonul...",
    author: "Antrenor Principal",
    createdAt: "2025-08-01T08:00:00Z",
    tags: ["antrenament", "sezon"],
    eventType: "ongoing" as const,
    startDate: "2025-09-01T08:00:00Z",
    duration: "8 luni",
    isActive: true
}
```

## 🎯 Beneficii

✅ **Categorizare automată** bazată pe perioada reală de desfășurare
✅ **Flexibilitate** pentru diferite tipuri de evenimente
✅ **Status în timp real** pentru evenimente active
✅ **Gestionare simplă** prin câmpuri opționale
✅ **Compatibilitate** cu sistemul existent

## 🔍 Testare

Pentru a testa evenimentele multi-zile:

1. **Accesează** `/demo-auto-categorization`
2. **Verifică** secțiunea "Evenimente Multi-Zile"
3. **Modifică** datele în `projectPosts.ts`
4. **Observă** mutarea automată între categorii

## 📚 Resurse Suplimentare

- [Ghidul Principal pentru Postări](PROJECT_POSTS_GUIDE.md)
- [Demo Categorizare Automată](/demo-auto-categorization)
- [Codul Sursă](src/data/projectPosts.ts)

---

**💡 Sfat:** Pentru evenimente complexe, folosește `eventType: "multi-day"` cu `startDate` și `endDate` pentru o categorizare precisă!
