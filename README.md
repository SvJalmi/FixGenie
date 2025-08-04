
# FixGenie 🚀
**Revolutionary AI-Powered Code Analysis & Mentorship Platform**
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

FixGenie is the world's most advanced AI-powered code analysis platform that revolutionizes how developers learn, debug, and optimize code. With intelligent error detection, personalized mentorship, comprehensive analytics, and support for 320+ programming languages, FixGenie represents the next generation of developer debugging tools.

---

## 🌟 Key Features

### 🧠 AI-Powered Personal Mentor
- **Advanced Logical Error Detection** (Infinite loops, unreachable code, operator mix-ups, array bounds, division by zero, scope issues)
- **Personalized Learning Paths** based on coding patterns and skill assessments
- **Real-time Code Optimization** for performance, readability & maintainability
- **Comprehensive Security Audits** with OWASP compliance and risk scoring
- **Context-Aware Smart Suggestions** for code completion, refactoring & architectural patterns
- **Natural Language to Code**: Generate production-ready code from plain English
- **Image-to-Code Generation**: Convert diagrams/mockups/handwritten notes into code

### 👥 Real-Time Collaborative Development
- Multi-user **Live Code Collaboration** with cursor tracking
- **Voice Annotations** directly on code lines
- Session management with participant controls
- **WebSocket-based Low-Latency Sync**

### 📊 Advanced Analytics & Progress Tracking
- Cyclomatic complexity, cognitive load, Halstead metrics, technical debt analysis
- **Gamified Skill Progression** (XP, levels, achievements)
- Personalized AI insights based on coding patterns
- **Visual Analytics Dashboard** with interactive charts & skill radar

### 🎯 Intelligent Code Generation Suite
- Smart Refactoring Engine with impact analysis
- Architectural Pattern Suggestions
- Automated Code Quality Optimization
- Context-Aware Suggestions across projects

---

## 🆕 Recent Updates (July 2025)
### ✅ Clean Code Button (AI-Integrated)
- `/api/clean-code` endpoint with GPT-4o for intelligent code optimization
- Multi-language support (320+ languages)
- Fallback system ensures basic cleaning even when AI is unavailable
- Automatic re-analysis post cleaning
- User-friendly interface with loading & success notifications

### ✅ User Profile System
- `/api/user/profile/:userId` endpoint with real statistics fetching
- Functional menu items: View Profile, Account Settings, Usage & Billing, Help & Support
- Interactive modals with rich content
- Working Logout with proper error handling

### ✅ UI Improvements
- Fixed visibility of AI Mentor and Dashboard headers (solid white text)
- Consistent theming for component headers

---

## 🏗️ System Architecture

### 🖥️ Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Library**: Radix UI with shadcn/ui
- **Styling**: Tailwind CSS (FixGenie Dark Theme)
- **State Management**: TanStack Query
- **Routing**: Wouter
- **Code Editor**: Monaco Editor with custom theming & error highlighting

### 🌐 Backend
- **Runtime**: Node.js with Express.js (TypeScript, ES Modules)
- **API**: RESTful API with JSON responses
- **Database**: PostgreSQL (Neon Serverless) + Drizzle ORM
- **Schema Migrations**: Drizzle Kit
- **Middleware**: Express for logging & error handling

---

## 🧩 Key Components
- **Code Analysis Engine**: OpenAI GPT-4o Integration
- **Error Detection**: Syntax, Logical, Runtime, Semantic with Severity Classification
- **Fix Suggestions**: Actionable improvements
- **Text-to-Speech**: Murf AI TTS with multiple voice options
- **Analytics Dashboard**: Interactive charts for code metrics & progress tracking
- **Monaco Editor**: Syntax highlighting & IntelliSense for 320+ languages

---

## 📚 Supported Languages
Supports **320+ programming languages** including:
- Core: C, C++, C#, Java, Python, JS, TypeScript, Go, Rust, Swift
- Scripting: PHP, Bash, PowerShell, R, Lua
- Markup/Data: HTML, XML, JSON, YAML
- Functional: Haskell, Scala, Erlang
- AI & ML: Mojo, Gen
- Blockchain: Solidity, Vyper
- Esoteric: Brainfuck, Piet, Shakespeare Lang, Chef
- Hardware: Verilog, VHDL, SystemVerilog
- DSL Creation, Security/Formal, Quantum Computing, Bioinformatics, and more...

---

## 🗂️ Project Structure
```

/frontend       → React 18 + Vite Frontend
/backend        → Node.js + Express API Backend
/database       → PostgreSQL (Neon Serverless)

````

---

## ⚙️ Development Setup

### Prerequisites
- Node.js v18+
- PostgreSQL Database (Neon Serverless recommended)
- OpenAI API Key
- Murf AI API Key

### Environment Variables
```bash
DATABASE_URL=your_postgresql_connection_string
OPENAI_API_KEY=your_openai_api_key
MURF_API_KEY=your_murf_api_key
````

### Local Development

```bash
# Clone Repo
git clone https://github.com/YourUsername/FixGenie.git
cd FixGenie

# Install Dependencies
npm install

# Start Development Server (Frontend + Backend)
npm run dev
```

---

## 🛠️ Build & Deployment

### Production Build

```bash
# Build Frontend
cd frontend
npm run build

# Bundle Backend
cd ../backend
npm run build

# Serve Both (API + Static)
npm start
```

---

## 📡 External Dependencies

* **OpenAI GPT-4o API** (Code Analysis & Suggestions)
* **Murf AI TTS** (Voice Explanations)
* **Neon PostgreSQL** (Serverless DB)
* **Replit Tools** (Optional Dev Environment)

---

## 📜 License

MIT License

---

## 🙌 Contributing

We welcome contributions! Please open issues or submit PRs for suggestions and improvements.



