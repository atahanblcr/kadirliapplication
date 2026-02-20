# KadirliApp - Production Deployment Guide

**Version:** 1.0  
**Date:** 16 Şubat 2026  
**Target:** Production Environment

---

## 📋 Table of Contents

1. [Infrastructure Overview](#infrastructure-overview)
2. [Prerequisites](#prerequisites)
3. [Server Setup](#server-setup)
4. [Database Setup](#database-setup)
5. [Backend Deployment](#backend-deployment)
6. [Frontend Deployment](#frontend-deployment)
7. [Admin Panel Deployment](#admin-panel-deployment)
8. [CDN & Storage](#cdn--storage)
9. [SSL & Security](#ssl--security)
10. [Monitoring & Logging](#monitoring--logging)
11. [Backup Strategy](#backup-strategy)
12. [CI/CD Pipeline](#cicd-pipeline)
13. [Scaling Strategy](#scaling-strategy)
14. [Troubleshooting](#troubleshooting)

---

## Infrastructure Overview

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        PRODUCTION ENVIRONMENT                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐ │
│  │   Cloudflare │──────│  NGINX Proxy │──────│   Firewall   │ │
│  │   (CDN+WAF)  │      │  (Reverse)   │      │   (UFW)      │ │
│  └──────────────┘      └──────────────┘      └──────────────┘ │
│         │                      │                                │
│         │                      ├───────────────────┐            │
│         │                      ▼                   ▼            │
│         │              ┌──────────────┐    ┌──────────────┐   │
│         │              │   Backend    │    │ Admin Panel  │   │
│         │              │   (NestJS)   │    │  (Next.js)   │   │
│         │              │   Port 3000  │    │  Port 3001   │   │
│         │              └──────────────┘    └──────────────┘   │
│         │                      │                                │
│         │              ┌───────┴────────┐                      │
│         │              ▼                ▼                      │
│         │      ┌──────────────┐  ┌──────────────┐             │
│         │      │  PostgreSQL  │  │    Redis     │             │
│         │      │   Port 5432  │  │   Port 6379  │             │
│         │      └──────────────┘  └──────────────┘             │
│         │                                                       │
│         └──────────────────────────────────────────────┐       │
│                                                         ▼       │
│                                              ┌──────────────┐  │
│                                              │  CloudFlare  │  │
│                                              │   R2 (CDN)   │  │
│                                              │   Storage    │  │
│                                              └──────────────┘  │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   Monitoring │  │    Backup    │  │     Logs     │        │
│  │  (Prometheus)│  │  (Daily/S3)  │  │  (Loki/S3)   │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└─────────────────────────────────────────────────────────────────┘
```

### Stack Summary

| Component | Technology | Version |
|-----------|------------|---------|
| **Backend** | NestJS | 10.x |
| **Frontend** | Flutter Web | 3.x |
| **Admin** | Next.js | 14.x |
| **Database** | PostgreSQL | 15.x |
| **Cache** | Redis | 7.x |
| **Queue** | Bull (Redis) | 4.x |
| **Storage** | CloudFlare R2 | - |
| **CDN** | BunnyCDN | - |
| **Reverse Proxy** | NGINX | 1.24.x |
| **SSL** | Let's Encrypt | - |
| **Monitoring** | Prometheus + Grafana | - |
| **Logs** | Loki | - |

---

## Prerequisites

### Required Accounts

- [ ] **DigitalOcean** (or VPS provider)
- [ ] **CloudFlare** (CDN + DNS)
- [ ] **BunnyCDN** (Image CDN)
- [ ] **Domain** (kadirliapp.com)
- [ ] **Gmail** (SMTP for emails)
- [ ] **Firebase** (Push notifications)

### Domain Configuration

```
# DNS Records (CloudFlare)
A     @                  123.456.789.100  (Main server)
A     www                123.456.789.100
A     api                123.456.789.100
A     admin              123.456.789.100
CNAME cdn                b-cdn.net
TXT   @                  "v=spf1 include:_spf.google.com ~all"
```

---

## Server Setup

### 1. Create DigitalOcean Droplet

**Recommended Specs (40K users):**
```
CPU:    4 vCPUs
RAM:    8 GB
Disk:   160 GB SSD
OS:     Ubuntu 24.04 LTS
Price:  ~$48/month
```

**Create Droplet:**
```bash
# Via DigitalOcean CLI
doctl compute droplet create kadirliapp-prod \
  --size s-4vcpu-8gb \
  --image ubuntu-24-04-x64 \
  --region fra1 \
  --ssh-keys <your-ssh-key-id>
```

### 2. Initial Server Configuration

**Connect:**
```bash
ssh root@<server-ip>
```

**Update System:**
```bash
apt update && apt upgrade -y
apt install -y curl wget git ufw fail2ban
```

**Create Deploy User:**
```bash
# Create user
adduser deploy
usermod -aG sudo deploy

# Setup SSH
mkdir -p /home/deploy/.ssh
cp ~/.ssh/authorized_keys /home/deploy/.ssh/
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
chmod 600 /home/deploy/.ssh/authorized_keys
```

**Configure Firewall:**
```bash
# UFW rules
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow http
ufw allow https
ufw enable
```

**Configure Fail2Ban:**
```bash
# /etc/fail2ban/jail.local
cat > /etc/fail2ban/jail.local << EOF
[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 3600
EOF

systemctl restart fail2ban
```

---

## Database Setup

### 1. Install PostgreSQL 15

```bash
# Add PostgreSQL APT repository
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
echo "deb http://apt.postgresql.org/pub/repos/apt/ $(lsb_release -cs)-pgdg main" | sudo tee /etc/apt/sources.list.d/pgdg.list

# Install
apt update
apt install -y postgresql-15 postgresql-contrib-15

# Start service
systemctl start postgresql
systemctl enable postgresql
```

### 2. Configure PostgreSQL

**Create Database & User:**
```bash
sudo -u postgres psql << EOF
CREATE DATABASE kadirliapp;
CREATE USER kadirliapp_user WITH ENCRYPTED PASSWORD 'STRONG_PASSWORD_HERE';
GRANT ALL PRIVILEGES ON DATABASE kadirliapp TO kadirliapp_user;
ALTER DATABASE kadirliapp OWNER TO kadirliapp_user;

-- Enable extensions
\c kadirliapp
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
EOF
```

**Configure PostgreSQL Security:**
```bash
# /etc/postgresql/15/main/postgresql.conf
listen_addresses = 'localhost'
max_connections = 100
shared_buffers = 2GB
effective_cache_size = 6GB
work_mem = 16MB
maintenance_work_mem = 512MB

# /etc/postgresql/15/main/pg_hba.conf
local   all             all                                     peer
host    all             all             127.0.0.1/32            scram-sha-256
host    all             all             ::1/128                 scram-sha-256

# Restart
systemctl restart postgresql
```

### 3. Import Schema

```bash
# Upload schema
scp 01_DATABASE_SCHEMA_FULL.sql deploy@<server-ip>:~/

# Import
sudo -u postgres psql kadirliapp < 01_DATABASE_SCHEMA_FULL.sql
```

---

## Redis Setup

### 1. Install Redis

```bash
apt install -y redis-server

# Configure
# /etc/redis/redis.conf
bind 127.0.0.1
protected-mode yes
port 6379
maxmemory 1gb
maxmemory-policy allkeys-lru

# Restart
systemctl restart redis-server
systemctl enable redis-server
```

---

## Backend Deployment

### 1. Install Node.js

```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc

# Install Node 20 LTS
nvm install 20
nvm use 20
nvm alias default 20

# Install PM2
npm install -g pm2
```

### 2. Clone & Build Backend

```bash
# Clone repo
cd /home/deploy
git clone https://github.com/yourusername/kadirliapp-backend.git
cd kadirliapp-backend

# Install dependencies
npm ci --production

# Build
npm run build
```

### 3. Environment Variables

```bash
# /home/deploy/kadirliapp-backend/.env.production
cat > .env.production << EOF
NODE_ENV=production
PORT=3000

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=kadirliapp
DATABASE_USER=kadirliapp_user
DATABASE_PASSWORD=STRONG_PASSWORD_HERE
DATABASE_SSL=false

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=GENERATE_STRONG_SECRET_HERE
JWT_EXPIRES_IN=30d
REFRESH_TOKEN_EXPIRES_IN=90d

# CloudFlare R2
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=kadirliapp-uploads
R2_PUBLIC_URL=https://uploads.kadirliapp.com

# BunnyCDN
BUNNY_CDN_URL=https://cdn.kadirliapp.b-cdn.net
BUNNY_STORAGE_ZONE=kadirliapp
BUNNY_API_KEY=your_api_key

# Firebase FCM
FIREBASE_PROJECT_ID=kadirliapp
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@kadirliapp.iam.gserviceaccount.com

# SMTP (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@kadirliapp.com
SMTP_PASSWORD=your_app_password

# Admin Email
ADMIN_EMAIL=admin@kadirliapp.com

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100

# Cors
CORS_ORIGIN=https://kadirliapp.com,https://www.kadirliapp.com,https://admin.kadirliapp.com

# Sentry (Optional)
SENTRY_DSN=https://...@sentry.io/...
EOF

# Secure permissions
chmod 600 .env.production
```

### 4. PM2 Process Configuration

```bash
# ecosystem.config.js
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'kadirliapp-api',
    script: './dist/main.js',
    instances: 2,
    exec_mode: 'cluster',
    env_production: {
      NODE_ENV: 'production'
    },
    error_file: './logs/error.log',
    out_file: './logs/output.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '500M',
    watch: false,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
EOF
```

### 5. Start Backend

```bash
# Create logs directory
mkdir -p logs

# Start with PM2
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
pm2 startup systemd -u deploy --hp /home/deploy
# Copy and run the command PM2 outputs

# Check status
pm2 status
pm2 logs kadirliapp-api
```

---

## Admin Panel Deployment

### 1. Build Admin Panel

```bash
# Clone repo
cd /home/deploy
git clone https://github.com/yourusername/kadirliapp-admin.git
cd kadirliapp-admin

# Install dependencies
npm ci

# Environment
cat > .env.production << EOF
NEXT_PUBLIC_API_URL=https://api.kadirliapp.com
NEXT_PUBLIC_APP_URL=https://admin.kadirliapp.com
EOF

# Build
npm run build
```

### 2. PM2 Configuration

```bash
# ecosystem.config.js
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'kadirliapp-admin',
    script: 'node_modules/next/dist/bin/next',
    args: 'start -p 3001',
    instances: 1,
    exec_mode: 'fork',
    env_production: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: './logs/error.log',
    out_file: './logs/output.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
EOF

# Start
mkdir -p logs
pm2 start ecosystem.config.js --env production
pm2 save
```

---

## NGINX Setup

### 1. Install NGINX

```bash
apt install -y nginx
```

### 2. Configure NGINX

**API Configuration:**
```nginx
# /etc/nginx/sites-available/api.kadirliapp.com
server {
    listen 80;
    server_name api.kadirliapp.com;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req zone=api burst=20 nodelay;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Proxy to backend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # File upload size
    client_max_body_size 20M;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}
```

**Admin Panel Configuration:**
```nginx
# /etc/nginx/sites-available/admin.kadirliapp.com
server {
    listen 80;
    server_name admin.kadirliapp.com;

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';" always;

    # Proxy to Next.js
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files cache
    location /_next/static {
        proxy_pass http://localhost:3001;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    client_max_body_size 10M;
}
```

**Enable Sites:**
```bash
ln -s /etc/nginx/sites-available/api.kadirliapp.com /etc/nginx/sites-enabled/
ln -s /etc/nginx/sites-available/admin.kadirliapp.com /etc/nginx/sites-enabled/

# Test configuration
nginx -t

# Restart
systemctl restart nginx
systemctl enable nginx
```

---

## SSL/TLS (Let's Encrypt)

### 1. Install Certbot

```bash
apt install -y certbot python3-certbot-nginx
```

### 2. Obtain Certificates

```bash
# API
certbot --nginx -d api.kadirliapp.com --non-interactive --agree-tos -m admin@kadirliapp.com

# Admin
certbot --nginx -d admin.kadirliapp.com --non-interactive --agree-tos -m admin@kadirliapp.com

# Auto-renewal
systemctl enable certbot.timer
systemctl start certbot.timer
```

---

## CloudFlare R2 & BunnyCDN

### 1. CloudFlare R2 Setup

```bash
# Install AWS CLI (R2 is S3-compatible)
apt install -y awscli

# Configure
aws configure --profile r2
# Access Key: <R2_ACCESS_KEY>
# Secret Key: <R2_SECRET_KEY>
# Region: auto
# Output: json

# Create bucket
aws s3 mb s3://kadirliapp-uploads --endpoint-url https://<account-id>.r2.cloudflarestorage.com --profile r2

# Set CORS
aws s3api put-bucket-cors --bucket kadirliapp-uploads --endpoint-url https://<account-id>.r2.cloudflarestorage.com --profile r2 --cors-configuration file://cors.json

# cors.json
cat > cors.json << EOF
{
  "CORSRules": [{
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3000
  }]
}
EOF
```

### 2. BunnyCDN Setup

```bash
# Login to BunnyCDN dashboard
# Create Pull Zone: kadirliapp
# Origin URL: https://<account-id>.r2.cloudflarestorage.com/kadirliapp-uploads
# Enable: Origin Shield, Cache Expiration (1 year)
# Get CDN URL: kadirliapp.b-cdn.net
```

---

## Monitoring & Logging

### 1. Prometheus + Grafana

**Install Prometheus:**
```bash
# Download
cd /opt
wget https://github.com/prometheus/prometheus/releases/download/v2.45.0/prometheus-2.45.0.linux-amd64.tar.gz
tar xvfz prometheus-2.45.0.linux-amd64.tar.gz
mv prometheus-2.45.0.linux-amd64 prometheus

# Configure
cat > /opt/prometheus/prometheus.yml << EOF
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'node'
    static_configs:
      - targets: ['localhost:9100']
  
  - job_name: 'postgres'
    static_configs:
      - targets: ['localhost:9187']
  
  - job_name: 'redis'
    static_configs:
      - targets: ['localhost:9121']
  
  - job_name: 'nginx'
    static_configs:
      - targets: ['localhost:9113']
EOF

# Systemd service
cat > /etc/systemd/system/prometheus.service << EOF
[Unit]
Description=Prometheus
After=network.target

[Service]
User=deploy
ExecStart=/opt/prometheus/prometheus --config.file=/opt/prometheus/prometheus.yml
Restart=always

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl start prometheus
systemctl enable prometheus
```

**Install Grafana:**
```bash
apt install -y software-properties-common
add-apt-repository "deb https://packages.grafana.com/oss/deb stable main"
wget -q -O - https://packages.grafana.com/gpg.key | apt-key add -
apt update
apt install -y grafana

systemctl start grafana-server
systemctl enable grafana-server

# Access: http://<server-ip>:3000
# Default: admin / admin
```

### 2. Application Logging

**Winston Logger (Backend):**
```typescript
// logger.config.ts
import * as winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

**Log Rotation:**
```bash
# /etc/logrotate.d/kadirliapp
/home/deploy/kadirliapp-backend/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 deploy deploy
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}
```

---

## Backup Strategy

### 1. Database Backups

**Automated Backup Script:**
```bash
#!/bin/bash
# /home/deploy/scripts/backup-db.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/deploy/backups/postgres"
S3_BUCKET="kadirliapp-backups"

mkdir -p $BACKUP_DIR

# Backup
pg_dump -U kadirliapp_user kadirliapp | gzip > $BACKUP_DIR/kadirliapp_$DATE.sql.gz

# Upload to S3 (optional)
# aws s3 cp $BACKUP_DIR/kadirliapp_$DATE.sql.gz s3://$S3_BUCKET/postgres/

# Keep only last 7 days locally
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete

echo "Backup completed: kadirliapp_$DATE.sql.gz"
```

**Cron Job:**
```bash
crontab -e

# Daily backup at 3 AM
0 3 * * * /home/deploy/scripts/backup-db.sh >> /home/deploy/logs/backup.log 2>&1
```

### 2. File Backups

```bash
#!/bin/bash
# /home/deploy/scripts/backup-files.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/deploy/backups/files"

mkdir -p $BACKUP_DIR

# Backup uploads (if stored locally)
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz /path/to/uploads

# Keep only last 7 days
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
```

---

## CI/CD Pipeline (GitHub Actions)

### 1. GitHub Secrets

```
# Repository Settings > Secrets
SERVER_HOST=123.456.789.100
SERVER_USER=deploy
SERVER_SSH_KEY=<private-key-content>
```

### 2. Workflow Configuration

**.github/workflows/deploy.yml:**
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
        working-directory: ./backend
      
      - name: Build
        run: npm run build
        working-directory: ./backend
      
      - name: Deploy to Server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: |
            cd /home/deploy/kadirliapp-backend
            git pull origin main
            npm ci --production
            npm run build
            pm2 reload ecosystem.config.js --env production

  deploy-admin:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install & Build
        run: |
          npm ci
          npm run build
        working-directory: ./admin
      
      - name: Deploy to Server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: |
            cd /home/deploy/kadirliapp-admin
            git pull origin main
            npm ci
            npm run build
            pm2 reload kadirliapp-admin
```

---

## Scaling Strategy

### Vertical Scaling (Immediate)

**When to scale:**
- CPU > 80% for 24h
- RAM > 85% for 24h
- Database connections > 80

**How to scale:**
```bash
# DigitalOcean: Resize droplet
# 4 vCPU / 8GB → 8 vCPU / 16GB ($96/month)
doctl compute droplet-action resize <droplet-id> --size s-8vcpu-16gb
```

### Horizontal Scaling (Future)

**Load Balancer Setup:**
```
┌────────────────┐
│ Load Balancer  │
│  (DO/Nginx)    │
└────────┬───────┘
         │
    ┌────┴─────┬─────────┐
    │          │         │
┌───▼───┐  ┌───▼───┐ ┌───▼───┐
│App #1 │  │App #2 │ │App #3 │
└───────┘  └───────┘ └───────┘
    │          │         │
    └──────────┴─────────┘
               │
        ┌──────▼──────┐
        │  PostgreSQL │
        │   Primary   │
        └─────────────┘
```

---

## Troubleshooting

### Common Issues

**1. Backend Not Starting:**
```bash
# Check logs
pm2 logs kadirliapp-api

# Check port
netstat -tlnp | grep 3000

# Restart
pm2 restart kadirliapp-api
```

**2. Database Connection Error:**
```bash
# Check PostgreSQL
systemctl status postgresql

# Check connection
sudo -u postgres psql -c "SELECT 1"

# Check credentials in .env
```

**3. High Memory Usage:**
```bash
# Check processes
pm2 list
htop

# Restart app
pm2 reload all
```

**4. SSL Certificate Issues:**
```bash
# Renew manually
certbot renew

# Check expiry
certbot certificates
```

---

## Health Checks

**Automated Health Check Script:**
```bash
#!/bin/bash
# /home/deploy/scripts/health-check.sh

# Check API
if ! curl -f https://api.kadirliapp.com/health > /dev/null 2>&1; then
    echo "API is DOWN!" | mail -s "KadirliApp API Alert" admin@kadirliapp.com
    pm2 restart kadirliapp-api
fi

# Check Admin
if ! curl -f https://admin.kadirliapp.com > /dev/null 2>&1; then
    echo "Admin is DOWN!" | mail -s "KadirliApp Admin Alert" admin@kadirliapp.com
    pm2 restart kadirliapp-admin
fi

# Check Database
if ! sudo -u postgres psql -c "SELECT 1" kadirliapp > /dev/null 2>&1; then
    echo "Database is DOWN!" | mail -s "KadirliApp DB Alert" admin@kadirliapp.com
fi
```

**Cron:**
```bash
*/5 * * * * /home/deploy/scripts/health-check.sh
```

---

## Cost Estimate (Monthly)

| Service | Cost |
|---------|------|
| DigitalOcean Droplet (4 vCPU / 8GB) | $48 |
| CloudFlare R2 (Storage 10GB) | $0.15 |
| BunnyCDN (100GB traffic) | $1.00 |
| Domain (.com) | $1 |
| **Total** | **~$50/month** |

---

## Security Checklist

- [x] Firewall enabled (UFW)
- [x] Fail2Ban configured
- [x] SSH key-only authentication
- [x] PostgreSQL local-only access
- [x] Redis local-only access
- [x] SSL/TLS enabled (Let's Encrypt)
- [x] Security headers (NGINX)
- [x] Rate limiting enabled
- [x] Environment variables secured
- [x] Regular backups configured
- [x] Monitoring enabled

---

**DEPLOYMENT COMPLETE!** 🚀

Access Points:
- API: https://api.kadirliapp.com
- Admin: https://admin.kadirliapp.com
- Monitoring: http://<server-ip>:3000 (Grafana)
