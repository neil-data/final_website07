<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=32&pause=1000&color=00C9A7&center=true&vCenter=true&width=600&lines=🏥+MEDYRAX;Your+Digital+Clinician;Medical+Documents%2C+Decoded." alt="Medyrax" />
</p>
<p align="center">
  <strong>AI-powered medical document simplification for every Indian patient.</strong><br/>
  <em>Upload any prescription, lab report, or scan — get plain language back in seconds.</em>
</p>
<p align="center">
  <img src="https://img.shields.io/badge/IAR%20Udaan%20Hackathon-2026-dc2626?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Problem%20Statement-03%20Healthcare-0d9488?style=for-the-badge" />
  <img src="https://img.shields.io/badge/License-MIT-16a34a?style=for-the-badge" />
</p>
<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Groq-AI%20Engine-f97316?style=for-the-badge" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Firebase-Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" />
</p>
<p align="center">
  <a href="#-live-demo">🚀 Live Demo</a> ·
  <a href="#-api-endpoints">📖 API Docs</a> ·
  <a href="#%EF%B8%8F-setup--run">🛠 Setup</a> ·
  <a href="#-rag-architecture">🧠 Architecture</a>
</p>

---
 
## 🩺 The Problem
 
Picture this:
 
> **Ramu, 45, visits his doctor.** He walks out with a prescription reading:  
> `Tab Pantoprazole 40mg OD AC × 7 days` · `Tab Dolo 650mg BD × 5 days`
>
> He has **absolutely no idea** what any of this means.
 
This is the daily reality for hundreds of millions of Indian patients.
 
| The Gap | The Reality |
|---|---|
| 🔴 Medical jargon everywhere | Patients skip doses due to confusion |
| 🔴 No affordable simplification tools | Wrong self-treatment from guesswork |
| 🔴 Language barriers | Hindi speakers reading English prescriptions |
| 🔴 Fear of asking doctors | Critical follow-up steps ignored |
 
**Medyrax bridges this gap.** Upload any medical document → get back plain language that *anyone* can understand, in seconds, for free.
 
---
 
## ✨ What Medyrax Does
 
Upload a prescription, lab report, MRI, ECG, or discharge summary and receive:
 
<table>
<tr>
<td width="50%">
"📋 Plain-Language Diagnosis"  
Medical findings translated into everyday language
 
"💊 Medication Table"  
Name · Dose · Timing · Duration — all in one clean view
 
"⚠️ Side Effect Alerts"  
Know what to watch out for before it happens
 
</td>
<td width="50%">
"✅ Follow-Up Checklist"
Never miss a post-visit instruction again
 
"👨‍👩‍👧 One-Line Family Summary"  
Share your condition simply with loved ones
 
"🔍 Jargon Decoder"  
Original term ↔ Plain explanation, side by side
 
</td>
</tr>
</table>
> "Everything comes only from your document. Zero hallucination. Zero guesswork."
 
---
 
## 🧠 RAG Architecture
 
Medyrax is not a chatbot with a medical prompt. It is a full **Retrieval-Augmented Generation** pipeline where your document *is* the knowledge base.
 
```
╔══════════════════════════════════════════════════════════════╗
║                    YOUR UPLOADED DOCUMENT                    ║
║            Prescription / Lab Report / MRI / ECG            ║
╚══════════════════════════╦═══════════════════════════════════╝
                           │
                           ▼
              ┌────────────────────────┐
              │    Document Parser     │
              │  pdfjs-dist (PDF)      │
              │  Tesseract.js (Image)  │
              │  eng + hin OCR         │
              └───────────┬────────────┘
                          │  raw extracted text
                          ▼
              ┌────────────────────────┐
              │   /api/analyze         │
              │                        │
              │  llama-3.3-70b         │
              │  Temperature → 0.1     │  ← maximum faithfulness
              │  Grounded strictly     │
              │  to document only      │
              └───────────┬────────────┘
                          │  structured JSON
                          ▼
              ┌────────────────────────┐
              │  Result JSON becomes   │  ← This is the "R" in RAG
              │  the Knowledge Base    │
              └─────────┬──────────────┘
                        │
           ┌────────────┴────────────┐
           ▼                         ▼
  ┌─────────────────┐     ┌──────────────────────┐
  │  UI renders     │     │  /api/chat            │
  │  5 rich tabs    │     │                       │
  │  • Diagnosis    │     │  llama-3.1-8b-instant │
  │  • Medications  │     │  Temperature → 0.3    │
  │  • Alerts       │     │  Answers ONLY from    │
  │  • Follow-up    │     │  the JSON context     │
  │  • Jargon       │     │  Never external data  │
  └─────────────────┘     └──────────────────────┘
```
 
| Letter | What It Means in Medyrax |
|:---:|---|
| **R** | The uploaded document is **Retrieved** and parsed into text |
| **A** | Result JSON is **Augmented** as context for every chat query |
| **G** | Groq **Generates** answers grounded solely in that context |
 
---
 
## 📄 Supported Document Types
 
| Type | Trigger Keywords | Output |
|---|---|---|
| 💊 Prescription | `rx`, `prescribed`, `prescription` | Medication table + timing |
| 🧪 Lab Report | `haemoglobin`, `wbc`, `glucose`, `cbc` | Value analysis + flags |
| 🧲 MRI Report | `mri`, `magnetic resonance` | Finding simplification |
| 🔬 CT Scan | `ct scan`, `computed tomography` | Plain language findings |
| ☢️ X-Ray | `x-ray`, `radiograph` | Observation summary |
| ❤️ ECG | `ecg`, `electrocardiogram` | Rhythm + anomaly notes |
| 🔊 Ultrasound | `ultrasound`, `sonography` | Measurement context |
| 🔭 Pathology | `biopsy`, `histopathology` | Graded findings |
| 🏥 Discharge Summary | `discharge`, `admitted` | Recovery checklist |
 
---
 
## 🔒 Safety & Accuracy
 
Medyrax was built with a **zero-hallucination-first** philosophy.
 
```
🎯  Temperature 0.1    →  Maximum faithfulness, minimal creativity
📋  Exact copy rule    →  Medicine name, dose, timing copied verbatim
❌  Null for missing   →  Never invents a missing field
🌐  English JSON keys  →  Hindi values render correctly every time
🔗  Document grounded  →  Chat never pulls from outside knowledge
🔑  Server-side keys   →  API keys never touch the browser
```
 
---
 
## 📊 Transparency Panel
 
Every analysis comes with a live accuracy report. We don't just claim accuracy — we *prove* it.
 
```
┌──────────────────────────────────────────────────────┐
│  📊  Analysis Transparency                           │
├────────────────────┬─────────────────────────────────┤
│  Document Quality  │  ● good / ◐ low_quality / ○ short│
│  AI Confidence     │  ● high  / ◐ medium    / ○ low  │
│  Fields Extracted  │  6 / 7  (85%)  ████████░         │
├────────────────────┴─────────────────────────────────┤
│  Medication Check                                    │
│  Tab Pantoprazole  name ✓  dose ✓  timing ✓  days ✓ │
│  Tab Dolo          name ✓  dose ✓  timing ✓  days ✓ │
└──────────────────────────────────────────────────────┘
```
 
---
 
## 🛠 Tech Stack
 
```
┌─────────────────────────────────────────────────────────┐
│                        FRONTEND                         │
│  Next.js 15 · React · Tailwind CSS · TypeScript        │
│  pdfjs-dist (client-side PDF)                           │
│  Tesseract.js eng+hin (client-side OCR)                 │
├─────────────────────────────────────────────────────────┤
│                         BACKEND                         │
│  Express.js · Node.js                                   │
│  MongoDB Atlas (document history)                       │
│  Firebase Auth (Google Login)                           │
├─────────────────────────────────────────────────────────┤
│                        AI ENGINE                        │
│  Groq API                                               │
│  llama-3.3-70b-versatile  →  Document analysis (t=0.1) │
│  llama-3.1-8b-instant     →  RAG chat          (t=0.3) │
├─────────────────────────────────────────────────────────┤
│                      DEPLOYMENT                         │
│  Vercel (frontend) · Railway (backend)                  │
│  Total infrastructure cost → ₹0                        │
└─────────────────────────────────────────────────────────┘
```
 
---
 
## 📁 Project Structure
 
```
medyrax/
│
├── medbuddy-server/                  ← Express Backend
│   ├── routes/
│   │   ├── analyze.js                ← Core RAG pipeline
│   │   ├── chat.js                   ← Context-grounded chat
│   │   └── documents.js              ← History CRUD
│   ├── models/
│   │   ├── User.js
│   │   └── Document.js
│   ├── middleware/
│   │   └── authMiddleware.js         ← Firebase token verification
│   └── index.js
│
└── frontend/                         ← Next.js Frontend
    ├── app/
    │   └── page.tsx                  ← Main application
    ├── components/
    │   └── LandingPage.tsx
    ├── lib/
    │   ├── api.ts                    ← Backend connector
    │   └── firebase.ts
    └── utils/
        ├── pdfParser.ts              ← Client-side PDF extraction
        └── ocrParser.ts              ← Client-side image OCR
```
 
---
 
## ⚙️ Setup & Run
 
### Prerequisites
 
- Node.js 18+
- MongoDB Atlas account (free tier works)
- Firebase project with Google Auth enabled
- Groq API key (free tier works)
### 1 — Clone
 
```bash
git clone https://github.com/your-team/medyrax.git
cd medyrax
```
 
### 2 — Backend
 
```bash
cd medbuddy-server
npm install
```
 
Create `.env`:
```env
GROQ_API_KEY=your_groq_key_here
PORT=5000
MONGODB_URI=your_mongodb_connection_string
FIREBASE_PROJECT_ID=your_firebase_project_id
```
 
```bash
node index.js
# ✅ Server running at http://localhost:5000
```
 
### 3 — Frontend
 
```bash
cd ../frontend
npm install
```
 
Create `.env.local`:
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```
 
```bash
npm run dev
# ✅ App running at http://localhost:3000
```
 
---
 
## 🔌 API Endpoints
 
| Method | Endpoint | Description | Auth |
|---|---|---|:---:|
| `POST` | `/api/analyze` | Analyze document text via RAG | — |
| `POST` | `/api/chat` | Chat with document context | — |
| `POST` | `/api/documents` | Save analysis to history | 🔒 |
| `GET` | `/api/documents` | Fetch user's document history | 🔒 |
| `DELETE` | `/api/documents/:id` | Delete a document | 🔒 |
| `GET` | `/` | Health check | — |
 
---
 
## 🎭 Demo Walkthrough
 
```
1.  Open http://localhost:3000
2.  Sign in with Google
3.  Upload a prescription image or PDF
4.  Watch Tesseract.js extract the text live
5.  Hit Analyze — see AI simplify in plain language
6.  📋 Check Diagnosis tab
7.  💊 Check Schedule tab for medication timing
8.  ⚠️  Check Alerts tab for side effects
9.  ✅ Check Follow-Up tab for actionables
10. 🔍 Check Jargon tab for term explanations
11. 💬 Ask the chatbot: "What did the doctor prescribe?"
12. 🌐 Switch language to Hindi and re-analyze
```
 
---
 
## 📱 Sample Input / Output
 
**Input**
```
Patient: Ramu, Age 45
Diagnosis: Acute Gastritis
Rx:
  Tab Pantoprazole 40mg OD AC × 7 days
  Tab Dolo 650mg BD × 5 days
Avoid spicy food. Follow up after 1 week.
```
 
**Output JSON**
```json
{
  "diagnosis": "The patient has stomach inflammation (gastritis).",
  "medications": [
    {
      "name": "Tab Pantoprazole",
      "dose": "40mg",
      "timing": "Once daily, before meals",
      "days": "7"
    },
    {
      "name": "Tab Dolo",
      "dose": "650mg",
      "timing": "Twice daily",
      "days": "5"
    }
  ],
  "followUp": [
    "Visit doctor after 1 week",
    "Avoid spicy and oily food"
  ],
  "familySummary": "Ramu has stomach inflammation. He needs two medicines and should avoid spicy food for a week.",
  "documentType": "prescription",
  "confidence": "high",
  "coverage": {
    "found": 6,
    "total": 7,
    "percentage": 86
  }
}
```
 
---
 
## 🏆 Why Medyrax Wins
 
| # | Point | Detail |
|---|---|---|
| 1 | **True RAG** | Document *is* the knowledge base, not just the prompt input |
| 2 | **Anti-hallucination** | Temperature 0.1 for analysis — most faithful setting possible |
| 3 | **Dual AI agents** | 70B for precision analysis, 8B for fast conversational chat |
| 4 | **9 document types** | Prescription to pathology — broadest medical coverage |
| 5 | **Transparency panel** | Confidence + coverage shown visually, not just claimed |
| 6 | **Hindi support** | English JSON structure, Hindi content values — fully compatible |
| 7 | **Jargon panel** | Original medical term vs plain explanation, side by side |
| 8 | **Zero cost infra** | Groq free tier + MongoDB Atlas + Vercel + Railway = ₹0 |
| 9 | **API key safety** | Keys live server-side, never exposed to the browser |
| 10 | **Null honesty** | Missing field → returns `null`, never invents data |
 
---
 
## 👥 Team Medyrax
 
Built with ❤️ for **IAR Udaan Hackathon 2026** · Problem Statement 03 — AI for Healthcare
 
---
 
<div align="center">
*"Making medical documents understandable for every Indian patient."*
 
**Medyrax** — Because your health is too important to be lost in translation.
 
</div>
