# Deployment Guide

## GitHub Pages Deployment

### Prerequisites
- GitHub account
- Git installed on your computer
- Node.js 18+ installed

### Steps

1. **Prepare the project for static deployment**
   ```bash
   npm run build
   ```

2. **Create a GitHub repository**
   - Go to GitHub and create a new repository
   - Don't initialize with README (we'll push existing code)

3. **Initialize Git and push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git push -u origin main
   ```

4. **Enable GitHub Pages**
   - Go to your repository settings
   - Scroll to "Pages" section
   - Source: Deploy from a branch
   - Branch: main
   - Folder: /dist
   - Save

5. **Create GitHub Actions workflow**
   Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [ main ]
   
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         
         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '18'
             cache: 'npm'
         
         - name: Install dependencies
           run: npm install
         
         - name: Build project
           run: npm run build
         
         - name: Deploy to GitHub Pages
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

### Important Notes for GitHub Pages

- GitHub Pages serves static files only
- The backend server won't work on GitHub Pages
- You'll need to modify the project to work without a backend
- Consider using localStorage for data persistence
- Media files will need to be handled differently

## VS Code Setup

### Prerequisites
- VS Code installed
- Node.js 18+ installed

### Steps

1. **Clone/Download the project**
   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
   ```

2. **Open in VS Code**
   ```bash
   code .
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Install recommended VS Code extensions**
   - TypeScript and JavaScript Language Features
   - ES7+ React/Redux/React-Native snippets
   - Tailwind CSS IntelliSense
   - Auto Rename Tag
   - Prettier - Code formatter

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   - Application will be available at `http://localhost:5000`

### VS Code Configuration

Create `.vscode/settings.json`:
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

Create `.vscode/extensions.json`:
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag"
  ]
}
```

## Static Version (for GitHub Pages)

To make this work on GitHub Pages, you'll need to:

1. **Remove backend dependencies**
   - Convert to use localStorage instead of database
   - Remove Express server code
   - Use client-side only routing

2. **Update build configuration**
   - Modify `vite.config.ts` for static deployment
   - Update base URL for GitHub Pages

3. **Handle media files**
   - Store as base64 in localStorage
   - Or use external image hosting service

Would you like me to create a static version that works on GitHub Pages?