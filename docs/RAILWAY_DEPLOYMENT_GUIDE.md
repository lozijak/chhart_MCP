# Railway Deployment Guide for Chhart MCP Server

Step-by-step guide to deploy the Chhart MCP server to Railway for remote access.

---

## Prerequisites

- Railway account (sign up at https://railway.app)
- Railway CLI installed (or use web interface)
- GitHub repository with the code (already done: https://github.com/lozijak/chhart_MCP)

---

## Deployment Steps

### Option 1: Deploy via Railway Web Interface (Recommended)

1. **Go to Railway Dashboard**
   - Visit https://railway.app/dashboard
   - Click "New Project"

2. **Deploy from GitHub**
   - Select "Deploy from GitHub repo"
   - Choose `lozijak/chhart_MCP`
   - Railway will auto-detect the Dockerfile

3. **Configure Environment Variables**
   - Click on your deployed service
   - Go to "Variables" tab
   - Add:
     ```
     PORT=3000
     NODE_ENV=production
     ```

4. **Generate Domain**
   - Go to "Settings" tab
   - Click "Generate Domain" under "Networking"
   - Copy the generated URL (e.g., `chhart-mcp-production.up.railway.app`)

5. **Wait for Deployment**
   - Railway will build and deploy automatically
   - Check "Deployments" tab for status
   - Should complete in 2-3 minutes

### Option 2: Deploy via Railway CLI

```bash
# Install Railway CLI (if not already installed)
npm i -g @railway/cli

# Login to Railway
railway login

# Initialize project
cd /Users/alwanalkautsar/chhart_MCP
railway init

# Link to your Railway project
railway link

# Deploy
railway up

# Generate domain
railway domain
```

---

## Verify Deployment

### 1. Check Health Endpoint

Once deployed, test the health endpoint:

```bash
curl https://your-app.railway.app/health
```

Expected response:
```json
{
  "status": "ok",
  "service": "chhart-mcp-server",
  "version": "1.0.0",
  "timestamp": "2026-01-13T08:16:35.000Z"
}
```

### 2. Test MCP Endpoint

The MCP endpoint should be available at:
```
https://your-app.railway.app/mcp
```

---

## Configure MCP Clients

### For Claude Desktop (Remote)

Update `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "chhart": {
      "url": "https://your-app.railway.app/mcp"
    }
  }
}
```

### For ChatGPT or Other Clients

Provide the SSE endpoint URL:
```
https://your-app.railway.app/mcp
```

---

## Monitoring & Logs

### View Logs

**Via Web Interface:**
1. Go to your Railway project
2. Click on the service
3. Click "Logs" tab

**Via CLI:**
```bash
railway logs
```

### Monitor Performance

Railway provides:
- CPU usage
- Memory usage
- Network traffic
- Request metrics

Access via the "Metrics" tab in your service dashboard.

---

## Troubleshooting

### Deployment Failed

**Check build logs:**
1. Go to "Deployments" tab
2. Click on the failed deployment
3. Review build logs for errors

**Common issues:**
- Missing dependencies: Run `npm install` locally first
- TypeScript errors: Run `npm run build` to check
- Port conflicts: Ensure `PORT` env var is set

### Server Not Responding

**Check if service is running:**
```bash
curl https://your-app.railway.app/health
```

**If 404 or timeout:**
- Check Railway logs for startup errors
- Verify Dockerfile is correct
- Ensure `PORT` env variable is set

### Connection Issues

**CORS errors:**
- The server already has CORS enabled
- Check browser console for specific errors

**406 Not Acceptable:**
- Ensure your client sends `Accept: application/json` and `Content-Type: application/json`.

---

## Cost Estimation

Railway pricing (as of 2026):
- **Free tier:** $5 credit/month
- **Pro plan:** $20/month

**Estimated usage for MCP server:**
- Very low traffic: ~$0-2/month (within free tier)
- Moderate traffic: ~$5-10/month

The MCP server is lightweight and should stay within free tier for personal use.

---

## Security Considerations

### Current Setup
- ✅ CORS enabled for all origins
- ✅ No authentication required
- ✅ HTTPS by default (Railway)

### Recommendations for Production

1. **Add Authentication** (if needed):
   ```typescript
   // Add API key validation
   app.use((req, res, next) => {
     const apiKey = req.headers['x-api-key'];
     if (apiKey !== process.env.API_KEY) {
       return res.status(401).json({ error: 'Unauthorized' });
     }
     next();
   });
   ```

2. **Rate Limiting**:
   ```bash
   npm install express-rate-limit
   ```

3. **Restrict CORS** (optional):
   ```typescript
   // Only allow specific origins
   res.header('Access-Control-Allow-Origin', 'https://chhart.app');
   ```

---

## Updating the Deployment

### Via GitHub (Automatic)

Railway auto-deploys on git push:

```bash
# Make changes
git add .
git commit -m "Update MCP server"
git push origin main

# Railway will automatically redeploy
```

### Via CLI (Manual)

```bash
railway up
```

---

## Next Steps

After deployment:

1. ✅ Test the health endpoint
2. ✅ Configure Claude Desktop with the MCP URL (/mcp)
3. ✅ Test creating a flowchart via Claude
4. ✅ Verify the generated URL works on chhart.app
5. 📊 Monitor usage and logs

---

## Support

**Railway Documentation:**
- https://docs.railway.app

**Railway Discord:**
- https://discord.gg/railway

**MCP Documentation:**
- https://modelcontextprotocol.io

---

Ready to deploy! 🚀
