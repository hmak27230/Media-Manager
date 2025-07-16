# LCD Media Center 📺

A retro-style web application that simulates a vintage LCD media center with photo gallery, MP3 player, and interactive games. Built with React, TypeScript, and Express.

![LCD Media Center](https://img.shields.io/badge/Status-Active-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Express](https://img.shields.io/badge/Express.js-404D59?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white)

## ✨ Features

### 🎮 **Interactive Games**
- **Snake Game** - Classic snake with improved controls and collision detection
- **Pong Game** - AI opponent with responsive paddle movement
- **Tetris Game** - Full implementation with all 7 tetrominoes and line clearing
- **High Scores** - Persistent leaderboard system

### 🎵 **MP3 Player**
- Audio file upload and playback
- Clickable progress bar for seeking
- Playlist management
- Volume control with hardware panel integration
- Keyboard controls (Space, Arrow keys)

### 📷 **Photo Gallery**
- Image upload (JPG, PNG, BMP)
- Navigation controls
- Keyboard navigation (Arrow keys, Delete)
- Thumbnail view with full-size display

### 🖥️ **System Monitor**
- CPU usage simulation
- RAM monitoring
- Temperature readings
- System uptime display

### 🎛️ **Hardware Panel**
- LED status indicators
- Volume control with mouse wheel support
- Joystick simulation
- Real-time clock display

## 🎨 Design Features

- **Retro LCD Aesthetic** - Green text on dark background
- **Scan Line Effects** - Authentic CRT-style visual effects
- **Glitch Animations** - Flicker effects and LCD-style transitions
- **Hardware Simulation** - Realistic embedded system interface
- **Responsive Design** - Works on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/lcd-media-center.git
   cd lcd-media-center
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5000
   ```

## 🎯 Controls

### Navigation
- **Arrow Keys** - Navigate menus and games
- **WASD** - Alternative game controls
- **Space** - Play/pause in MP3 player
- **Enter** - Select menu items

### Games
- **Snake**: Arrow keys or WASD to move
- **Pong**: Up/Down arrows or W/S to move paddle
- **Tetris**: Arrow keys to move/rotate, Space to hard drop

### Media
- **Photo Gallery**: Left/Right arrows to browse, Delete to remove
- **MP3 Player**: Space to play/pause, arrows to seek/change tracks
- **Volume**: Mouse wheel on hardware panel

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **TanStack Query** - Server state management
- **Wouter** - Client-side routing

### Backend
- **Express.js** - Web framework
- **TypeScript** - Server-side types
- **PostgreSQL** - Database
- **Drizzle ORM** - Database toolkit
- **Multer** - File upload handling

### UI Components
- **Radix UI** - Accessible primitives
- **Shadcn/UI** - Component library
- **Lucide React** - Icons

## 📁 Project Structure

```
lcd-media-center/
├── client/               # Frontend React application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── hooks/        # Custom hooks
│   │   ├── lib/          # Utilities
│   │   └── pages/        # Page components
│   └── index.html
├── server/               # Backend Express server
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   └── storage.ts        # Storage interface
├── shared/               # Shared types and schemas
│   └── schema.ts
└── docs/                 # Documentation
```

## 🚀 Deployment

### Free Hosting Options

#### Railway (Recommended)
```bash
# Connect GitHub repository to Railway
# Automatic PostgreSQL provisioning
# Deploy on every push
```

#### Render
```bash
# Use render.yaml configuration
# Free PostgreSQL database included
# Automatic deployments
```

#### Vercel + Neon
```bash
# Vercel for application hosting
# Neon for PostgreSQL database
# Serverless deployment
```

See [FREE_HOSTING_GUIDE.md](FREE_HOSTING_GUIDE.md) for detailed deployment instructions.

## 🔧 Development

### Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run check      # TypeScript type checking
npm run db:push    # Push database schema
```

### Environment Variables

```env
DATABASE_URL=your_postgresql_connection_string
NODE_ENV=development
```

## 📊 Database Schema

### Media Files
- File storage with base64 encoding
- Metadata tracking (name, type, size, upload date)
- Type filtering (image/audio)

### Game Scores
- Player achievements
- High score tracking
- Game-specific leaderboards

## 🎨 Customization

### Themes
The LCD theme can be customized in `client/src/index.css`:
```css
:root {
  --accent: 120 100% 50%;      /* Green LCD color */
  --background: 0 0% 4%;       /* Dark background */
  --foreground: 120 100% 50%;  /* Text color */
}
```

### Adding Games
1. Create new game component in `client/src/components/`
2. Add game logic with canvas rendering
3. Register in `GameCenter` component
4. Add score tracking integration

## 🐛 Known Issues

- File upload size limited to prevent memory issues
- Audio playback depends on browser codec support
- Games may have slight performance variations on different devices

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by retro LCD gaming devices
- Built for embedded systems course assignment
- Design influenced by classic arcade aesthetics

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check the [deployment guide](FREE_HOSTING_GUIDE.md)
- Review the [documentation](DEPLOYMENT.md)

---

**Made with ❤️ for retro gaming enthusiasts**