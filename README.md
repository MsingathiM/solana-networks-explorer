# 🌟 Solana Networks Explorer

A beautiful, modern Solana blockchain explorer built with React and Solana Web3.js. This project was **vibe coded** using Claude Code - built through iterative design conversations focusing on aesthetics and user experience rather than rigid specifications.

![Solana Explorer](https://img.shields.io/badge/Built%20with-Claude%20Code-green)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Solana](https://img.shields.io/badge/Solana-Web3.js-purple)

## 🎨 What is Vibe Coding?

This project exemplifies **vibe coding** - a development approach where:
- ✨ Design decisions are made based on aesthetic preferences and "vibes"
- 🔄 Implementation happens through conversational iteration
- 🌱 Features emerge organically through user feedback
- 💫 The focus is on feel and user experience over technical specifications

## 🚀 Features

### 🌐 Multi-Network Support
- **Mainnet**: Production Solana network
- **Testnet**: Testing environment
- **Devnet**: Development network
- Seamless network switching with live data

### 🔍 Comprehensive Search
- **Transaction Lookup**: Search by transaction signature (88 chars)
- **Account Exploration**: Explore accounts by address (32-44 chars)
- **Real-time Validation**: Instant feedback on input format
- **Quick Examples**: Pre-loaded program addresses for testing

### 📊 Live Network Stats
- **Current Epoch**: Real-time epoch information
- **Current Slot**: Live slot tracking
- **Slots per Epoch**: Network timing data
- **Network Health**: Connection status monitoring

### 📈 Recent Activity
- **Recent Transactions**: Live transaction feed
- **Interactive History**: Click to explore any transaction
- **Status Indicators**: Success/failure visual feedback
- **Auto-refresh**: Stay up-to-date with network activity

## 🎨 Design Philosophy

### Dark Grey Aesthetic
- **Professional Look**: Dark grey backgrounds with light borders
- **High Contrast**: White text for excellent readability
- **Consistent Styling**: Unified design language throughout

### Olive Green Accents
- **Interactive Elements**: All buttons use olive green (#84cc16)
- **Hover Effects**: Darker olive on interaction (#65a30d)
- **Brand Consistency**: Cohesive color scheme

### Tile-Based Layout
- **Separate Sections**: Each functionality in its own bordered tile
- **Clear Hierarchy**: Visual separation between different features
- **Responsive Design**: Works on all screen sizes

## ⚡ Tech Stack

- **Frontend**: React 18.2.0 + Vite
- **Styling**: Tailwind CSS with custom components
- **Icons**: Lucide React for beautiful icons
- **Backend**: Node.js + Express
- **Blockchain**: Solana Web3.js
- **Security**: Helmet, CORS, Rate limiting

## 🛠 Quick Start

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/MsingathiM/solana-networks-explorer.git
cd solana-networks-explorer

# Install all dependencies
npm run install:all

# Start development servers
npm run dev
```

### Scripts
```bash
# Development
npm run dev              # Start both client and server
npm run dev:client       # Client only (http://localhost:3000)
npm run dev:server       # Server only (http://localhost:5001)

# Production
npm run build           # Build client for production
npm start              # Start production server
```

## 📡 API Endpoints

### Network Information
```bash
GET /api/networks              # Available networks
GET /api/network-info?network=testnet  # Network stats
```

### Transaction & Account Lookup
```bash
GET /api/transaction/:signature?network=testnet
GET /api/account/:address?network=testnet
```

### Recent Activity
```bash
GET /api/recent-transactions?network=testnet&limit=10
```

### Health Check
```bash
GET /api/health               # Server health status
```

## 💭 Vibe Coding Process

This project was built through a collaborative conversation focusing on:

1. **Initial Vision**: "Make it beautiful with teal background"
2. **Iterative Refinement**: "Actually, dark grey looks better"
3. **Aesthetic Choices**: "Make buttons olive green with white text"
4. **User Experience**: "Add borders so sections are separate"
5. **Polish**: "Make text more visible"

Each change was implemented immediately with visual feedback, creating a natural development flow.

## ✨ What Makes This Special

- **Conversational Development**: Built through natural language iteration
- **Aesthetic-First Approach**: Design decisions based on visual appeal
- **Immediate Feedback**: Real-time implementation of design ideas
- **Organic Evolution**: Features emerged through usage and feedback

## 🤝 Contributing

This is a vibe coding project! Feel free to:
- Suggest aesthetic improvements
- Add features that "feel right"
- Improve the user experience
- Keep the conversational development spirit

## 📄 License

MIT License - Feel free to vibe with this code!

---

**✨ Vibe coded with [Claude Code](https://claude.ai/code) - Where ideas meet implementation through pure vibes 🎨**