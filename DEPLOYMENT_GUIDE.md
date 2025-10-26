clear
clear
# 🚀 DEPLOYMENT GUIDE - Mini Project Manager

## 📋 Deployment Checklist

### ✅ Pre-Deployment Verification
- [ ] Code is pushed to GitHub repository
- [ ] Backend builds successfully locally (`dotnet build`)
- [ ] Frontend builds successfully locally (`npm run build`)
- [ ] All features tested in local development
- [ ] Environment variables are configured
- [ ] Database migrations are ready

## 🌐 Production Deployment Instructions

### Step 1: Prepare Repository
```bash
# Ensure all changes are committed and pushed
git add .
git commit -m "Ready for production deployment"
git push origin main
```

### Step 2: Deploy Backend to Railway 🚂

1. **Go to Railway:**
   - Visit [Railway.app](https://railway.app)
   - Sign in with your GitHub account

2. **Create New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `Mini-Project-Manager` repository

3. **Configure Environment Variables:**
   - In Railway dashboard, go to your project
   - Click "Variables" tab
   - Add these variables **EXACTLY** as shown:
     ```
     ASPNETCORE_ENVIRONMENT=Production
     JWT_SECRET=kt0gEdcvnb1yTFWG9QCHS82Cb7EVSRzca9KSWE1MBh4=
     ```

4. **Deploy:**
   - Railway will automatically detect the Dockerfile
   - Build will start automatically
   - Monitor the build logs for any errors
   - Once deployed, note your Railway URL: `https://your-app-name.railway.app`

5. **Test Backend:**
   - Visit `https://your-app-name.railway.app/swagger`
   - Verify API documentation loads
   - Test the authentication endpoints

### Step 3: Deploy Frontend to Vercel ⚡

1. **Go to Vercel:**
   - Visit [Vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Import Project:**
   - Click "New Project"
   - Import your `Mini-Project-Manager` repository
   - Select the repository and click "Import"

3. **Configure Build Settings:**
   - Framework Preset: `Create React App`
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

4. **Set Environment Variables:**
   - In project settings, go to "Environment Variables"
   - Add:
     ```
     REACT_APP_API_URL=https://your-railway-app.railway.app/api
     ```
   
   **⚠️ Replace** `your-railway-app.railway.app` with your actual Railway URL!

5. **Deploy:**
   - Click "Deploy"
   - Monitor build process
   - Once deployed, note your Vercel URL: `https://your-project.vercel.app`

6. **Test Frontend:**
   - Visit your Vercel URL
   - Test user registration and login
   - Create a project and add tasks
   - Test the Smart Scheduler feature

### Step 4: Final Configuration

1. **Update CORS (if needed):**
   If you encounter CORS errors, update the backend's `Program.cs`:
   ```csharp
   policy.WithOrigins("https://your-vercel-app.vercel.app")
   ```

2. **Test Full Application:**
   - Register a new user account
   - Create a project
   - Add tasks with dependencies
   - Use the Smart Scheduler
   - Verify all features work end-to-end

## 🔧 Troubleshooting

### Railway Issues

**Problem:** "Script start.sh not found" or build fails
**Solution:** 
- Ensure `Dockerfile` is in root directory ✅
- Check Railway build logs for specific errors
- Verify environment variables are set correctly

**Problem:** Application crashes on startup
**Solution:**
- Check JWT_SECRET is at least 32 characters
- Verify Railway logs for specific error messages
- Ensure ASPNETCORE_ENVIRONMENT=Production

**Problem:** Database errors
**Solution:**
- SQLite database is created automatically
- Check Railway logs for migration errors
- Verify EF Core migrations are included in deployment

### Vercel Issues

**Problem:** Build fails
**Solution:**
- Check build logs in Vercel dashboard
- Verify `package.json` scripts are correct
- Ensure all dependencies are listed

**Problem:** API connection errors
**Solution:**
- Verify REACT_APP_API_URL points to correct Railway URL
- Check Railway backend is running and accessible
- Test API endpoints directly via browser/Postman

**Problem:** CORS errors
**Solution:**
- Update backend CORS policy to include Vercel URL
- Redeploy backend to Railway after CORS update

## 📊 Monitoring & Maintenance

### Railway Monitoring
- Monitor resource usage in Railway dashboard
- Check application logs for errors
- Set up deployment notifications

### Vercel Monitoring
- Monitor build status and deployment logs
- Check performance metrics
- Review function execution logs

### Auto-Deployment
Both platforms support automatic deployment:
- **Railway:** Auto-deploys when you push to `main` branch
- **Vercel:** Auto-deploys when you push to `main` branch

## 🎯 Assignment Submission URLs

After successful deployment, you'll have:

### Live Application URLs
- **Frontend (Vercel):** `https://your-project.vercel.app`
- **Backend API (Railway):** `https://your-app.railway.app`
- **API Documentation:** `https://your-app.railway.app/swagger`

### Repository
- **GitHub Repository:** `https://github.com/ayushr100/Mini-Project-Manager`

## 🆘 Getting Help

If you encounter issues:

1. **Check this guide first** - Most common issues are covered above
2. **Review build logs** - Both Railway and Vercel provide detailed logs
3. **Test locally first** - Ensure everything works locally before deploying
4. **Check environment variables** - Most deployment issues are configuration-related

## 🎉 Success!

Once deployed successfully, your Mini Project Manager will be:
- ✅ Live on professional hosting platforms
- ✅ Accessible via public URLs
- ✅ Ready for assignment submission
- ✅ Scalable and production-ready

Great job building and deploying a full-stack application! 🚀