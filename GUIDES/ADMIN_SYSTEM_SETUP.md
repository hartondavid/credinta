# Admin System Setup Guide

Acest ghid vă va ajuta să configurați sistemul de administrare pentru site-ul Călărași Warriors.

## Pași de configurare

### 1. Instalarea dependențelor

```bash
npm install
```

### 2. Configurarea variabilelor de mediu

Adăugați următoarele variabile în fișierul `.env.local`:

```env
# Database
DATABASE_URL=your_database_connection_string

# JWT Secret pentru autentificare
JWT_SECRET=your-super-secret-jwt-key-here

# Node Environment
NODE_ENV=development
```

### 3. Rularea migrărilor

```bash
npm run migrate
```

### 4. Crearea utilizatorului admin implicit

```bash
npm run create-admin
```

Acest script va crea un utilizator admin cu următoarele credențiale:
- **Username**: `admin`
- **Password**: `admin123`

⚠️ **IMPORTANT**: Schimbați parola după prima conectare!

### 5. Pornirea aplicației

```bash
npm run dev
```

## Accesarea panoului admin

1. Navigați la `/admin/login`
2. Introduceți credențialele:
   - Username: `admin`
   - Password: `admin123`
3. După conectare, veți fi redirecționat către `/admin/dashboard`

## Funcționalități disponibile

### Panoul de administrare include:

1. **Toggle între tipuri de postări**:
   - Proiecte (past/current/future)
   - Știri

2. **Formular pentru proiecte**:
   - Titlu, conținut, autor
   - Tip proiect (trecut/curent/viitor)
   - Tip postare (conferință, joc sportiv, etc.)
   - Tip eveniment (o zi/mai multe zile/în desfășurare)
   - Tag-uri
   - Status activ

3. **Formular pentru știri**:
   - Titlu, conținut, autor
   - Tip postare (podcast, conferință, muzică, etc.)
   - URL extern (opțional)
   - Tag-uri
   - Buton "Citește mai mult"

## Securitate

- Autentificarea se face prin JWT tokens
- Token-urile expiră în 24 de ore
- Toate endpoint-urile API sunt protejate
- Parolele sunt hash-uite cu bcrypt

## Structura bazei de date

### Tabela `admins`:
- `id` (primary key)
- `username` (unique)
- `password_hash`
- `email` (unique)
- `full_name`
- `is_active`
- `created_at`
- `updated_at`

## API Endpoints

### Autentificare
- `POST /api/admin/login` - Conectare admin

### Gestionarea proiectelor
- `POST /api/admin/projects` - Adaugă proiect nou
- `PUT /api/admin/projects` - Actualizează proiect
- `DELETE /api/admin/projects` - Șterge proiect

### Gestionarea știrilor
- `POST /api/admin/news` - Adaugă știre nouă
- `PUT /api/admin/news` - Actualizează știre
- `DELETE /api/admin/news` - Șterge știre

## Dezvoltare viitoare

Pentru a integra complet sistemul cu datele existente, va trebui să:

1. Modificați endpoint-urile API să salveze în baza de date în loc să returneze doar success
2. Adăugați funcționalități de editare/ștergere a postărilor existente
3. Implementați upload-ul de imagini prin Cloudinary
4. Adăugați validări suplimentare pentru conținut

## Suport

Pentru probleme sau întrebări, contactați echipa de dezvoltare.
