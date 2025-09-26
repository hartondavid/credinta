# Cloudinary Setup Guide pentru Calarasi Warriors

## 🚀 **Ce este Cloudinary?**

Cloudinary este o platformă cloud pentru gestionarea imaginilor, video și fișierelor media. Oferă:
- **25 GB gratuit** pentru început
- **Imagini private** și securizate
- **CDN rapid** pentru încărcare optimizată
- **Transformări automate** (redimensionare, optimizare)

## 📋 **Pași de configurare:**

### **1. Creează contul Cloudinary:**
1. Mergi la [cloudinary.com](https://cloudinary.com/)
2. Click "Sign Up For Free"
3. Completează formularul cu datele tale
4. Verifică email-ul de confirmare

### **2. Obține credențialele:**
După logare, mergi la **Dashboard** și notează:
- **Cloud Name** (ex: `abc123`)
- **API Key** (ex: `123456789012345`)
- **API Secret** (ex: `abcdefghijklmnop`)

### **3. Configurează Upload Preset:**
1. Mergi la **Settings** → **Upload**
2. Click **Add upload preset**
3. Nume: `calarasi-warriors`
4. **Signing Mode:** `Unsigned`
5. **Folder:** `calarasi-warriors`
6. Click **Save**

### **4. Actualizează configurația în cod:**

În `src/utils/cloudinary.ts`, înlocuiește:
```typescript
const CLOUDINARY_CONFIG = {
    cloudName: 'your-cloud-name',     // ← Înlocuiește cu Cloud Name-ul tău
    apiKey: 'your-api-key',           // ← Înlocuiește cu API Key-ul tău
    apiSecret: 'your-api-secret',     // ← Înlocuiește cu API Secret-ul tău
    uploadPreset: 'calarasi-warriors' // ← Înlocuiește cu upload preset-ul tău
};
```

În `src/data/projectPosts.ts`, înlocuiește:
```typescript
url: post.cloudinaryId 
    ? `https://res.cloudinary.com/YOUR-CLOUD-NAME/image/upload/w_800,h_600,c_fill,q_auto/${post.cloudinaryId}`
    : "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop"
```

## 📸 **Cum să încarci imagini:**

### **Opțiunea 1: Dashboard Cloudinary (Recomandat)**
1. Mergi la [Cloudinary Dashboard](https://cloudinary.com/console)
2. Click **Upload** → **Upload images**
3. Drag & drop imaginile
4. Copiază **Public ID** (ex: `calarasi-warriors/project-1`)

### **Opțiunea 2: Upload Widget (Pentru utilizatori)**
1. Folosește widget-ul de upload din aplicație
2. Imagini se încarcă automat
3. Primești Public ID-ul direct

## 🔧 **Utilizare în proiect:**

### **Adaugă imagine la un proiect:**
```typescript
{
    id: "current-post-1",
    title: "Programul de Antrenament",
    // ... alte câmpuri
    cloudinaryId: "calarasi-warriors/project-1" // ← Public ID-ul de la Cloudinary
}
```

### **URL-ul generat automat:**
```
https://res.cloudinary.com/YOUR-CLOUD-NAME/image/upload/w_800,h_600,c_fill,q_auto/calarasi-warriors/project-1
```

## 🎯 **Avantajele Cloudinary:**

- ✅ **Imagini private** - doar tu poți accesa
- ✅ **CDN rapid** - se încarcă foarte repede
- ✅ **Optimizare automată** - se redimensionează automat
- ✅ **25 GB gratuit** - suficient pentru multe imagini
- ✅ **Securitate avansată** - control total asupra accesului

## 🚨 **Important:**

- **Nu partaja credențialele** cu nimeni
- **Folosește folder-ul** `calarasi-warriors` pentru organizare
- **Public ID-ul** trebuie să fie exact ca în Cloudinary
- **Imaginile sunt private** - doar cu link-ul direct se pot accesa

## 📞 **Suport:**

Dacă ai probleme cu configurarea:
1. Verifică că ai copiat corect credențialele
2. Asigură-te că upload preset-ul este configurat corect
3. Verifică că Public ID-ul este exact ca în Cloudinary

---

**Cloudinary este perfect pentru proiectul tău cu imagini private!** 🎉
