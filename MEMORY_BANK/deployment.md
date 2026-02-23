# Deployment & DevOps Rehberi

**Son Güncelleme:** 24 Şubat 2026

---

## 📋 Deployment Checklist

### ✅ Development Setup
- [x] Docker Compose (PostgreSQL + Redis)
- [x] Backend Dockerfile (NestJS)
- [x] Admin Dockerfile (Next.js) - **NEW**
- [x] Environment templates (.env.example)

### ⏳ CI/CD Pipeline
- [x] GitHub Actions: backend-tests.yml
- [x] GitHub Actions: admin-build.yml
- [ ] GitHub Actions: deploy-staging.yml (manual)
- [ ] GitHub Actions: deploy-production.yml

### ⏳ Production Setup
- [ ] PM2 configuration (pm2.config.js)
- [ ] NGINX configuration (reverse proxy)
- [ ] Systemd service files
- [ ] Environment validation script
- [ ] Database backup strategy
- [ ] Redis persistence (RDB/AOF)

---

## 🐳 Docker Containers

### Current Status

```
✅ backend/Dockerfile         - Multi-stage, Node 20 Alpine, 492 test CI
✅ admin/Dockerfile           - Multi-stage, Next.js, health check
✅ docker-compose.yml         - Dev environment (PostgreSQL + Redis)
❌ docker-compose.prod.yml    - Production compose (blueprint)
```

### Docker Images Built

```bash
# Backend
docker build -t kadirliapp-backend:1.0 ./backend

# Admin
docker build -t kadirliapp-admin:1.0 ./admin
```

### Running Containers

```bash
# Development (all services)
docker-compose up -d

# Production (use docker-compose.prod.yml)
docker-compose -f docker-compose.prod.yml up -d

# Logs
docker-compose logs -f backend
docker-compose logs -f admin
docker-compose logs -f postgres
docker-compose logs -f redis
```

---

## 🔄 CI/CD Pipeline Status

### Implemented ✅

#### 1. Backend Tests (.github/workflows/backend-tests.yml)
```yaml
Trigger: Push/PR to main, develop (backend/** changes)
Services: PostgreSQL 15 + Redis 7
Steps:
  1. Setup Node.js 20
  2. Install dependencies
  3. Create test .env
  4. Run ESLint (optional)
  5. Run 492 tests (Jest)
  6. Generate coverage report
  7. Upload to Codecov
```

**Runs on:** ubuntu-latest
**Duration:** ~5-10 minutes
**Passes:** 492/492 tests ✅

#### 2. Admin Build (.github/workflows/admin-build.yml)
```yaml
Trigger: Push/PR to main, develop (admin/** changes)
Steps:
  1. Setup Node.js 20
  2. Install dependencies
  3. Create .env.local
  4. Run ESLint (optional)
  5. Build Next.js (npm run build)
  6. Verify .next directory
  7. Upload artifact (.next)
  8. (On main branch) Build Docker image
```

**Runs on:** ubuntu-latest
**Duration:** ~3-5 minutes
**Artifacts:** Saved for 7 days

### To Be Implemented ⏳

#### 3. Deploy to Staging
```yaml
File: .github/workflows/deploy-staging.yml
Trigger: Manual workflow_dispatch
Environment: Staging (DigitalOcean / AWS / Heroku)
Steps:
  1. Pull backend tests
  2. Pull admin build artifact
  3. Push images to Docker registry
  4. Deploy to staging server
  5. Run smoke tests
  6. Notify on Slack
```

#### 4. Deploy to Production
```yaml
File: .github/workflows/deploy-production.yml
Trigger: Manual workflow_dispatch (requires approval)
Environment: Production
Steps:
  1. Tag release (v1.0.1)
  2. Build production images
  3. Push to registry
  4. Deploy with rolling updates
  5. Health checks
  6. Rollback if failed
  7. Notification
```

---

## 📊 Environment Management

### Development (.env)
```env
NODE_ENV=development
DATABASE_URL=postgresql://user:pass@localhost:5432/kadirliapp
REDIS_URL=redis://localhost:6379
JWT_SECRET=dev-secret
OTP_EXPIRATION_SECONDS=300
```

### Staging (.env.staging)
```env
NODE_ENV=staging
DATABASE_URL=postgresql://user:pass@staging-db:5432/kadirliapp
REDIS_URL=redis://staging-redis:6379
JWT_SECRET=staging-secret-***
CORS_ORIGIN=https://admin-staging.kadirliapp.com
```

### Production (.env.production)
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@prod-db:5432/kadirliapp
REDIS_URL=redis://prod-redis:6379
JWT_SECRET=***-securely-stored-***
CORS_ORIGIN=https://admin.kadirliapp.com
LOG_LEVEL=warn
```

**Important:** Production secrets stored in GitHub Secrets / Vault

---

## 🚀 Production Deployment Guide

### Prerequisites
- Docker & Docker Compose
- PM2 installed globally
- NGINX installed
- PostgreSQL 15 (external or containerized)
- Redis 7 (external or containerized)
- Domain + SSL certificate

### Step 1: Server Setup
```bash
# SSH to production server
ssh deploy@production.server

# Create app directory
sudo mkdir -p /var/www/kadirliapp
sudo chown deploy:deploy /var/www/kadirliapp

# Clone repository
cd /var/www/kadirliapp
git clone https://github.com/your-org/kadirliapp.git .

# Create .env files (with secure secrets)
cp backend/.env.example backend/.env.production
cp admin/.env.example admin/.env.production
```

### Step 2: Database Setup
```bash
# If using external PostgreSQL:
psql -h prod-db.server -U admin -d postgres
CREATE DATABASE kadirliapp;
CREATE USER kadirliapp_user WITH PASSWORD '***strong-password***';
GRANT ALL PRIVILEGES ON DATABASE kadirliapp TO kadirliapp_user;

# If using Docker:
docker-compose -f docker-compose.prod.yml up -d postgres redis
```

### Step 3: Migrations & Seeding
```bash
cd backend

# Run migrations
npm run typeorm migration:run

# Optional: Seed initial data
npm run seed
```

### Step 4: Build Docker Images
```bash
# Backend
docker build -t kadirliapp-backend:1.0 ./backend
docker tag kadirliapp-backend:1.0 your-registry/kadirliapp-backend:1.0
docker push your-registry/kadirliapp-backend:1.0

# Admin
docker build -t kadirliapp-admin:1.0 ./admin
docker tag kadirliapp-admin:1.0 your-registry/kadirliapp-admin:1.0
docker push your-registry/kadirliapp-admin:1.0
```

### Step 5: Run with Docker Compose
```bash
# Use production compose file
docker-compose -f docker-compose.prod.yml up -d

# Verify services
docker-compose ps
curl http://localhost:3000/health
curl http://localhost:3001/health
```

### Step 6: NGINX Reverse Proxy
```nginx
# /etc/nginx/sites-available/kadirliapp
upstream backend {
    server localhost:3000;
}

upstream admin {
    server localhost:3001;
}

server {
    listen 443 ssl http2;
    server_name api.kadirliapp.com;

    ssl_certificate /etc/letsencrypt/live/api.kadirliapp.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.kadirliapp.com/privkey.pem;

    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 443 ssl http2;
    server_name admin.kadirliapp.com;

    ssl_certificate /etc/letsencrypt/live/admin.kadirliapp.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/admin.kadirliapp.com/privkey.pem;

    location / {
        proxy_pass http://admin;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name api.kadirliapp.com admin.kadirliapp.com;
    return 301 https://$server_name$request_uri;
}
```

### Step 7: SSL Certificate (Let's Encrypt)
```bash
sudo certbot certonly --standalone \
  -d api.kadirliapp.com \
  -d admin.kadirliapp.com

sudo systemctl reload nginx
```

### Step 8: Monitoring & Logging
```bash
# View logs
docker-compose logs -f

# Monitor containers
docker stats

# Health checks
curl http://api.kadirliapp.com/health
curl http://admin.kadirliapp.com/health
```

---

## 📈 Performance Optimization

### Database
```sql
-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_ads_status_expires ON ads(status, expires_at);
CREATE INDEX idx_deaths_funeral_date ON death_notices(funeral_date);

-- Enable connection pooling in TypeORM
```

### Redis
```yaml
# docker-compose.prod.yml
redis:
  command: redis-server --appendonly yes
  volumes:
    - redis-data:/data
```

### Caching Strategy
- JWT tokens: Short TTL (1 hour)
- OTP: Very short TTL (5 minutes)
- User profiles: Cache 30 minutes
- Ads list: Cache 5 minutes (invalidate on new ad)

---

## 🔒 Security Checklist

- [x] HTTPS/SSL (Let's Encrypt)
- [x] Rate limiting (Throttler)
- [x] CORS restricted
- [x] Environment variables (no secrets in code)
- [x] JWT signing (HS256/RS256)
- [x] Input validation (class-validator)
- [x] SQL injection prevention (TypeORM)
- [x] XSS prevention (Next.js built-in)
- [ ] WAF (Web Application Firewall)
- [ ] DDoS protection (Cloudflare)
- [ ] Database encryption at rest
- [ ] Regular backups (automated)
- [ ] Incident response plan

---

## 📊 Monitoring & Alerts

### Services to Monitor
```
- Backend API response time (target: <200ms)
- Admin Panel load time (target: <3s)
- Database query performance
- Redis memory usage
- Disk space
- CPU/Memory utilization
- Error rates
```

### Recommended Tools
- **Monitoring:** Prometheus + Grafana
- **Logging:** ELK Stack (Elasticsearch, Logstash, Kibana)
- **APM:** New Relic / Datadog
- **Uptime:** StatusCake / Pingdom
- **Alerts:** PagerDuty / OpsGenie

---

## 🔄 CI/CD Workflow Summary

```
Code Push (GitHub)
    ↓
GitHub Actions triggered
    ├─ Backend Tests (492 tests, 85% coverage) ✅
    ├─ Admin Build (Next.js build) ✅
    └─ Artifacts saved
        ↓
    All Passed? → Manual Deploy to Staging ⏳
    ↓
    Staging Health Checks
    ↓
    Manual Deploy to Production
    ↓
    Production Verification
```

---

## 📞 Deployment Support

**Contact:** devops@kadirliapp.com
**On-call:** PagerDuty integration
**Rollback:** Git revert + Docker redeploy (5 min recovery)

---

## 📝 Recent Changes (24 Feb 2026)

- ✅ admin/Dockerfile created (multi-stage, health check)
- ✅ GitHub Actions: backend-tests.yml (PostgreSQL + Redis services)
- ✅ GitHub Actions: admin-build.yml (artifact upload)
- ⏳ PM2 config (coming soon)
- ⏳ NGINX config (coming soon)
- ⏳ Seeder script (coming soon)
