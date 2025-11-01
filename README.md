# 🧠 Adaptive Chatbot Platform

A responsive, adaptive chatbot platform that supports multiple operational modes — **Developer Assistant**, **Learning/Tutoring**, and **HR/IT** — each with its own look, feel, and personality.

## ✨ Features

### 🎨 Multi-Mode System
- **Developer Mode** 💻: Technical coding assistance with concise, logical responses
- **Learning Mode** 🎓: Interactive tutoring with encouraging, didactic approach
- **HR/IT Mode** 🧾: Professional HR and IT support with polished communication

### 🌈 Dynamic Theming
- **12 unique color themes** (4 per mode)
- Real-time theme switching and preview
- Gradient backgrounds with smooth animations
- Mode-specific color palettes
- User preferences persist across sessions

### 💬 Advanced Chat Interface
- Real-time message streaming
- Typewriter effect for AI responses
- Neural pulse animation during AI thinking
- Code syntax highlighting with Markdown support
- Message timestamps
- Smooth scroll animations

### 👤 Comprehensive Profile System
- **General Info Tab**: Profile picture, name, email, account details
- **Preferences Tab**: Theme customization, default mode, animation toggles
- **Integrations Tab**: GitHub and Slack integration (placeholder)
- Real-time theme preview
- XP progress ring for Learning mode

### 📚 Chat History Management
- Filter by mode, date range, and keywords
- Pin important conversations
- Rename chat threads
- Delete conversations
- Sort by recent or pinned status
- Auto-generated chat titles using AI

### 🎯 User Experience Enhancements
- Dynamic mode-based greetings
- Usage statistics tracking
- Responsive design (desktop, tablet, mobile)
- Smooth transitions and animations
- Loading states and error handling

## 🏗️ Architecture

### Backend (Node.js + Express + MongoDB)
```
backend/
├── models/
│   ├── User.js          # User schema with preferences & stats
│   ├── Chat.js          # Chat history with messages
│   └── Mode.js          # Mode configurations & themes
├── routes/
│   ├── users.js         # Auth & profile endpoints
│   ├── chats.js         # Chat CRUD & messaging
│   └── modes.js         # Mode configurations
├── services/
│   └── geminiService.js # Gemini AI integration
├── middleware/
│   └── auth.js          # JWT authentication
├── config/
│   └── seedModes.js     # Database seeding
└── server.js            # Express server setup
```

### Frontend (React + Vite + Tailwind CSS)
```
Frontend/src/
├── components/
│   ├── MainLayout.jsx   # Main 3-panel layout
│   ├── Sidebar.jsx      # Mode switcher & chat history
│   ├── ChatWindow.jsx   # Chat interface
│   ├── Profile.jsx      # Profile with tabs
│   └── AuthPage.jsx     # Login/Register
├── contexts/
│   ├── AuthContext.jsx  # Authentication state
│   ├── ThemeContext.jsx # Theme management
│   └── ChatContext.jsx  # Chat state & operations
├── App.jsx              # Main app component
├── main.jsx             # Entry point
└── index.css            # Global styles & animations
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Gemini API key from Google AI Studio

### Installation

1. **Clone the repository**
```bash
cd /home/sama/Chatbot1
```

2. **Set up Backend**
```bash
# Install backend dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and add your credentials:
# - MONGODB_URI (your MongoDB connection string)
# - GEMINI_API_KEY (your Gemini API key)
# - JWT_SECRET (any random secure string)
```

3. **Set up Frontend**
```bash
cd Frontend
npm install
```

### Running the Application

**Option 1: Run both servers separately**

Terminal 1 (Backend):
```bash
npm run dev
```

Terminal 2 (Frontend):
```bash
cd Frontend
npm run dev
```

**Option 2: Run both servers concurrently**
```bash
npm run dev:all
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

## 🎨 Theme Palette Reference

### Developer Mode Themes
1. **Cyber Blue**: Blue + Black gradient, neon cyan accents
2. **Matrix Green**: Neon green on deep black, hacker aesthetic
3. **Neon Purple**: Electric purple + charcoal, vibrant coding
4. **Onyx Gray**: Subtle dark mode, professional minimalism

### Learning Mode Themes
1. **Teal-Purple Blend**: Vibrant and inspiring mix
2. **Coral-Mint**: Soft and energetic pastels
3. **Indigo-Amber**: Academic feel with warm accents
4. **Soft Violet**: Minimal pastel, gentle learning

### HR/IT Mode Themes
1. **Navy-Gold**: Elegant corporate aesthetic
2. **Burgundy-Ivory**: Warm professional tones
3. **Charcoal-Silver**: Modern monochrome
4. **Midnight-Amber**: Subtle luxury with warmth

## 🔐 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/adaptive-chatbot
PORT=5000
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET=your_jwt_secret_key_here
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 📡 API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/preferences` - Get preferences
- `PUT /api/users/preferences` - Update preferences

### Chat Management
- `GET /api/chats` - Get all chats (with filters)
- `GET /api/chats/:id` - Get specific chat
- `POST /api/chats` - Create new chat
- `POST /api/chats/:id/message` - Send message
- `PUT /api/chats/:id` - Update chat (rename/pin)
- `DELETE /api/chats/:id` - Delete chat

### Modes
- `GET /api/modes` - Get all modes
- `GET /api/modes/:name` - Get specific mode

## 🎯 Key Features Implementation

### Theme System
The theme system uses CSS custom properties that are dynamically updated based on user preferences and current mode. Each mode has 3-4 predefined themes, and users can switch between them with real-time preview.

### AI Integration
Powered by Google's Gemini AI, each mode has a unique system prompt that shapes the AI's personality and response style. Conversation history is maintained for context-aware responses.

### Responsive Design
Built with Tailwind CSS and custom animations:
- Desktop: Full 3-panel layout
- Tablet: Collapsible sidebar
- Mobile: Slide-out menu with modal overlays

### Data Persistence
All user preferences, chat history, and mode configurations are stored in MongoDB, ensuring seamless experience across sessions.

## 🛠️ Technologies Used

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- Google Generative AI (Gemini)
- JWT for authentication
- bcryptjs for password hashing

**Frontend:**
- React 18
- Vite (build tool)
- Tailwind CSS
- Framer Motion (animations)
- React Router
- Axios
- React Markdown
- Lucide React (icons)
- date-fns (date formatting)

## 📱 Responsive Breakpoints

- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md, lg)
- **Desktop**: > 1024px (xl)

## 🎨 Custom Animations

- `fade-in`: Smooth entry animation
- `slide-in-left/right`: Sidebar transitions
- `neural-pulse`: AI thinking indicator
- `typewriter`: Message typing effect
- `gradient-shift`: Background animation
- `loading-dots`: Loading indicator

## 🔮 Future Enhancements

- [ ] Voice input/output
- [ ] Export chat to PDF/Markdown
- [ ] Code execution sandbox
- [ ] Learning mode XP system
- [ ] Daily summary dashboard
- [ ] Mobile apps (React Native)
- [ ] Multi-language support
- [ ] Screen reader optimization
- [ ] Dark/Light mode toggle
- [ ] Custom theme creator

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Development

To contribute or modify:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `sudo systemctl start mongod`
- Check connection string in `.env`

### Gemini API Errors
- Verify API key is valid
- Check API quota/limits
- Ensure proper internet connection

### Port Conflicts
- Change PORT in backend `.env`
- Update VITE_API_URL in frontend `.env`

## 📞 Support

For issues or questions:
- Check existing issues on GitHub
- Create a new issue with detailed description
- Include error logs and steps to reproduce

---

Built with ❤️ using React, Node.js, and Gemini AI
