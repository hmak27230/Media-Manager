# Free Full-Stack Hosting Guide

## Best Free Hosting Options with Backend Support

### 1. **Vercel** (Recommended for Node.js apps)
- **Frontend**: Unlimited static sites
- **Backend**: Serverless functions (Node.js)
- **Database**: Can integrate with free PostgreSQL from Neon or Supabase
- **Deployment**: Git-based, automatic deployments

**Setup Steps:**
1. Sign up at https://vercel.com
2. Connect your GitHub repository
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push

**Configuration needed:**
```json
// vercel.json
{
  "builds": [
    {
      "src": "server/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/client/dist/$1"
    }
  ]
}
```

### 2. **Railway** (Excellent for full-stack apps)
- **Features**: PostgreSQL database included
- **Runtime**: Full Node.js support
- **Free tier**: 512MB RAM, $5/month credit
- **Deployment**: Git-based

**Setup Steps:**
1. Sign up at https://railway.app
2. Connect GitHub repository
3. Railway auto-detects and deploys
4. Database automatically provisioned

### 3. **Render** (Great PostgreSQL integration)
- **Features**: Free PostgreSQL database
- **Runtime**: Full Node.js support
- **Free tier**: 512MB RAM, sleeps after 15min inactivity
- **Deployment**: Git-based

**Setup Steps:**
1. Sign up at https://render.com
2. Create new Web Service from GitHub
3. Add PostgreSQL database (free tier)
4. Set environment variables

### 4. **Heroku** (Classic choice)
- **Features**: Full application hosting
- **Database**: Free PostgreSQL add-on
- **Free tier**: 512MB RAM, sleeps after 30min
- **Deployment**: Git-based

**Setup Steps:**
1. Sign up at https://heroku.com
2. Install Heroku CLI
3. Create new app: `heroku create your-app-name`
4. Add PostgreSQL: `heroku addons:create heroku-postgresql:hobby-dev`
5. Deploy: `git push heroku main`

### 5. **Supabase** (Backend-as-a-Service)
- **Features**: PostgreSQL database + Auth + Storage
- **Frontend**: Can host static sites
- **API**: Auto-generated REST/GraphQL APIs
- **Free tier**: 50MB database, 1GB bandwidth

### 6. **PlanetScale + Netlify**
- **Database**: PlanetScale (MySQL, serverless)
- **Frontend**: Netlify (static hosting)
- **Backend**: Netlify Functions or Vercel Functions
- **Free tier**: 1GB database, 100GB bandwidth

## Quick Setup for Your Media Center

### Option A: Railway (Easiest for beginners)

1. **Prepare your code:**
```bash
# Add to package.json
"scripts": {
  "start": "npm run build && node dist/index.js",
  "railway:build": "npm run build"
}
```

2. **Create railway.json:**
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start"
  }
}
```

3. **Deploy:**
   - Connect GitHub to Railway
   - Select your repository
   - Railway handles the rest

### Option B: Vercel + Neon Database

1. **Sign up for Neon PostgreSQL:**
   - Go to https://neon.tech
   - Create free database
   - Get connection string

2. **Configure Vercel:**
   - Add DATABASE_URL environment variable
   - Deploy through Vercel dashboard

3. **Update your code for serverless:**
```typescript
// Add to server/index.ts
export default async function handler(req: Request) {
  // Your existing Express app logic
}
```

### Option C: Render (Best balance)

1. **Create render.yaml:**
```yaml
services:
  - type: web
    name: media-center
    env: node
    buildCommand: npm run build
    startCommand: npm start
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: media-center-db
          property: connectionString

databases:
  - name: media-center-db
    databaseName: media_center
    user: admin
```

2. **Deploy:**
   - Connect GitHub to Render
   - Use the render.yaml for configuration

## Database Options

### Free PostgreSQL Providers:
1. **Neon** - 512MB, serverless PostgreSQL
2. **Supabase** - 500MB, includes auth/storage
3. **PlanetScale** - 1GB, serverless MySQL
4. **Railway** - 512MB, included with app hosting
5. **Render** - 256MB, integrated with web services

## File Storage Solutions

Since your app handles media files, consider:

1. **Cloudinary** - Free tier: 25GB storage, 25GB bandwidth
2. **Supabase Storage** - Free tier: 1GB storage
3. **AWS S3** - Free tier: 5GB storage (12 months)
4. **Base64 in database** - Current approach, works for small files

## Recommended Setup

**For beginners:** Railway
- Simplest setup
- Includes database
- Good free tier
- Automatic scaling

**For production:** Vercel + Neon
- Better performance
- Separate concerns
- Excellent developer experience

**For learning:** Render
- Good documentation
- Clear pricing
- Includes database

## Migration Steps

1. **Choose your platform** (Railway recommended)
2. **Set up database** (PostgreSQL connection string)
3. **Update environment variables**
4. **Deploy through Git integration**
5. **Test all features**

Would you like me to help you set up deployment for any specific platform?