# Frontend Deployment to Vercel

## Prerequisites
- Vercel account
- Backend deployed and URL available

## Deployment Steps

### 1. Install Vercel CLI (optional)
```bash
npm install -g vercel
```

### 2. Configure Environment Variables
In your Vercel dashboard, add the following environment variable:
- `VITE_API_URL` - Your backend API URL (e.g., `https://your-backend.vercel.app/api`)

### 3. Deploy via Vercel CLI
```bash
cd Frontend
vercel --prod
```

### 4. Deploy via Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Set the root directory to `Frontend`
5. Add environment variable `VITE_API_URL`
6. Click "Deploy"

## Important Notes

- The `VITE_API_URL` environment variable must point to your deployed backend
- Make sure CORS is configured on your backend to allow requests from your Vercel frontend URL
- The build command is automatically set to `npm run build`
- The output directory is `dist`

## Local Development

```bash
npm install
npm run dev
```

## Build Locally

```bash
npm run build
npm run preview
```
