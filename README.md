# 🏥 Medyrax — Your Digital Clinician

> **IAR Udaan Hackathon 2026 — Problem Statement 03**  
> AI-powered medical document simplification for every Indian patient.

---

## 🌟 What is Medyrax?

Medyrax turns complex medical documents into plain language that anyone can understand — in seconds.

Upload a prescription, lab report, MRI, ECG, or discharge summary. Get back:
- ✅ Plain-language diagnosis
- ✅ Medication table with timing
- ✅ Side effect alerts
- ✅ Follow-up checklist
- ✅ One-line family summary
- ✅ Medical jargon decoded

**Everything comes only from your document. Nothing is added from outside.**

---

## 🎯 The Problem We Solve

> *"Ramu gets a prescription. He sees 'Tab Pantoprazole 40mg OD AC'. He has no idea what this means."*

- 70% of Indian patients cannot understand their own prescriptions
- Medical jargon creates confusion, missed doses, and wrong self-treatment
- No affordable tool exists that explains documents in plain Hindi or English

---

## 🚀 Live Demo

```
Frontend  →  http://localhost:3000
Backend   →  http://localhost:5000
```

---

## 🧠 RAG Architecture

This is not just a chatbot. It is a full **Retrieval Augmented Generation** system.

```
┌─────────────────────────────────────────────────────┐
│                   UPLOADED DOCUMENT                  │
│              (Prescription / Lab / MRI)              │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
         ┌─────────────────────────┐
         │   PDF / Image Parser    │
         │  pdfjs-dist + Tesseract │
         └──────────┬──────────────┘
                    │ extracted text
                    ▼
         ┌─────────────────────────┐
         │    /api/analyze         │
         │  Groq llama-3.3-70b     │
         │  Temperature → 0.1      │
         │  Document only, no      │
         │  outside knowledge      │
         └──────────┬──────────────┘
                    │ structured JSON
                    ▼
         ┌─────────────────────────┐
         │   Result JSON becomes   │
         │   the Knowledge Base    │
         └──────────┬──────────────┘
                    │
          ┌─────────┴──────────┐
          ▼                    ▼
   UI renders              /api/chat
   5 sections          Groq llama-3.1-8b
                       Temperature → 0.3
                       Answers from JSON only
```

**R** → Retrieval: uploaded document is the knowledge base  
**A** → Augmented: result JSON injected as chat context  
**G** → Generation: Groq answers only from that context  

---

## 📋 Supported Document Types

| Document | Detected By |
|---|---|
| Prescription | "rx", "prescribed", "prescription" |
| Lab Report | "haemoglobin", "wbc", "glucose", "cbc" |
| MRI Report | "mri", "magnetic resonance" |
| CT Scan | "ct scan", "computed tomography" |
| X-Ray | "x-ray", "radiograph" |
| ECG | "ecg", "electrocardiogram" |
| Ultrasound | "ultrasound", "sonography" |
| Pathology | "biopsy", "histopathology" |
| Discharge Summary | "discharge", "admitted" |

---

## 🔒 Safety First

```
Temperature 0.1     →  maximum faithfulness, no hallucination
Exact copy rule     →  medicine name, dose, timing, days copied verbatim
Null for missing    →  never guesses a missing field
English JSON keys   →  Hindi values work correctly
Document grounded   →  chat never uses outside knowledge
```

---

## 📊 Transparency Panel

Every analysis shows:

| Metric | What It Means |
|---|---|
| Document Quality | good / low_quality / too_short |
| AI Confidence | high / medium / low |
| Fields Extracted | e.g. 6/7 (85%) |
| Medication Check | per medicine ✓ or ✗ for each field |

> *"We don't just claim accuracy — we show it."*

---

## 🛠 Tech Stack

```
Frontend     Next.js 15 + React + Tailwind CSS
Backend      Express.js + Node.js
Database     MongoDB Atlas
Auth         Firebase (Google Login)
AI Engine    Groq API
Analyze      llama-3.3-70b-versatile  (temp 0.1)
Chat         llama-3.1-8b-instant     (temp 0.3)
PDF Parser   pdfjs-dist (client side)
OCR          Tesseract.js eng+hin (client side)
Deployment   Vercel (frontend) + Railway (backend)
```

---

## 📁 Project Structure

```
medbuddy-server/              ← Express Backend
├── routes/
│   ├── analyze.js            ← document analysis + RAG
│   ├── chat.js               ← RAG chat
│   └── documents.js          ← save/fetch history
├── models/
│   ├── User.js
│   └── Document.js
├── middleware/
│   └── authMiddleware.js     ← Firebase token verification
└── index.js

frontend/                     ← Next.js Frontend
├── app/
│   └── page.tsx              ← main app
├── components/
│   └── LandingPage.tsx
├── lib/
│   ├── api.ts                ← backend connection
│   └── firebase.ts
└── utils/
    ├── pdfParser.ts          ← PDF extraction
    └── ocrParser.ts          ← image OCR
```

---

## ⚙️ Setup & Run

### Backend
```bash
cd medbuddy-server
npm install
# Add .env file (see below)
node index.js
```

### Frontend
```bash
cd frontend
npm install
# Add .env.local file (see below)
npm run dev
```

### Environment Variables

**Backend `.env`**
```
GROQ_API_KEY=your_groq_key
PORT=5000
MONGODB_URI=your_mongodb_uri
FIREBASE_PROJECT_ID=your_project_id
```

**Frontend `.env.local`**
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

---

## 🔌 API Endpoints

```
POST /api/analyze          → analyze document text
POST /api/chat             → RAG chat with document
POST /api/documents        → save document (auth required)
GET  /api/documents        → fetch history (auth required)
DELETE /api/documents/:id  → delete document (auth required)
GET  /                     → health check
```

---

## 🎭 Demo Flow

1. Open `http://localhost:3000`
2. Login with Google
3. Upload a prescription image or PDF
4. Watch OCR extract the text
5. See AI analyze in plain language
6. Check Schedule tab for medication timing
7. Check Alerts tab for side effects
8. Ask chatbot: *"What medicines did the doctor prescribe?"*
9. Switch to Hindi and re-analyze

---

## 📱 Sample Input

```
Patient: Ramu, Age 45
Diagnosis: Acute Gastritis
Rx:
Tab Pantoprazole 40mg OD AC × 7 days
Tab Dolo 650mg BD × 5 days
Avoid spicy food. Follow up after 1 week.
```

### Output
```json
{
  "diagnosis": "The patient has stomach inflammation.",
  "medications": [
    { "name": "Tab Pantoprazole", "dose": "40mg", "timing": "once daily", "days": "7" },
    { "name": "Tab Dolo", "dose": "650mg", "timing": "twice daily", "days": "5" }
  ],
  "followUp": ["Follow up after 1 week", "Avoid spicy food"],
  "familySummary": "Ramu has stomach inflammation and needs to take medicine and avoid spicy food.",
  "documentType": "prescription",
  "confidence": "medium",
  "coverage": { "found": 5, "total": 7, "percentage": 71 }
}
```

---

## 🏆 Key Points for Judges

```
1. RAG is the core architecture — not just a chat feature
2. Temperature 0.1 prevents disqualification
3. Document is the knowledge base — not just input
4. Two Groq agents — one for analysis, one for chat
5. Transparency panel proves accuracy visually
6. Hindi support with English JSON keys
7. 9 document types — prescription to pathology
8. Total infrastructure cost — zero rupees
9. API key hidden server side — never exposed to browser
10. JargonPanel shows original vs simplified side by side
```

---

## 👥 Team

**Medyrax** — Built for IAR Udaan Hackathon 2026  
Problem Statement 03 — AI for Healthcare

---

*"Making medical documents understandable for every Indian patie
