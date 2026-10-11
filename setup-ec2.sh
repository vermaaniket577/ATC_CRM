#!/usr/bin/env bash
# ==============================================================================
# Apex Telecom CRM - 1-Click EC2 Full-Stack Deployment Script
# ==============================================================================
set -e

echo "================================================================="
echo "  APEX TELECOM CRM - 1-CLICK EC2 PRODUCTION DEPLOYMENT           "
echo "================================================================="

# 1. Update OS and Install Prerequisites
echo "[1/6] Installing Java 21, Maven, Node.js, and Nginx..."
sudo dnf update -y
sudo dnf install -y java-21-amazon-corretto-devel maven git nodejs nginx

# 2. Ask for RDS MySQL Details
echo ""
echo "-----------------------------------------------------------------"
read -rp "Enter your RDS MySQL Endpoint (e.g. telecom-crm-db.cxxxx.ap-south-1.rds.amazonaws.com): " RDS_HOST
read -s -rp "Enter your RDS Master Password: " RDS_PASS
echo ""
echo "-----------------------------------------------------------------"

DB_NAME="telecom_crm"
DB_USER="telecom_app"

# 3. Build React Frontend
echo ""
echo "[2/6] Building React Vite production bundle..."
cd frontend
npm install
npm run build
cd ..

# 4. Configure Nginx to serve React on Port 80 and proxy /api to Spring Boot
echo "[3/6] Configuring Nginx reverse proxy..."
CURRENT_DIR=$(pwd)
sudo tee /etc/nginx/conf.d/telecom-crm.conf > /dev/null <<EOF
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;

    root ${CURRENT_DIR}/frontend/dist;
    index index.html;

    # React Router SPA fallback
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Proxy API traffic to Spring Boot backend
    location /api/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Spring Boot Actuator health checks
    location /actuator/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host \$host;
    }
}
EOF

# Ensure Nginx can read the directory
sudo chmod 755 /home/ec2-user
sudo chmod -R 755 "${CURRENT_DIR}/frontend/dist"

# Test and restart Nginx
sudo nginx -t
sudo systemctl enable nginx
sudo systemctl restart nginx

# 5. Build Spring Boot Backend
echo "[4/6] Packaging Spring Boot production executable JAR..."
cd backend
mvn clean package -DskipTests
cd ..

JAR_PATH=$(find "${CURRENT_DIR}/backend/target" -name "*.jar" ! -name "*sources.jar" ! -name "*javadoc.jar" | head -n 1)

# 6. Configure Systemd Service for Spring Boot
echo "[5/6] Creating background systemd service for Java Backend..."
sudo tee /etc/systemd/system/telecom-crm.service > /dev/null <<EOF
[Unit]
Description=Apex Telecom CRM Backend Service
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=${CURRENT_DIR}/backend
Environment="SPRING_PROFILES_ACTIVE=mysql"
Environment="SPRING_DATASOURCE_URL=jdbc:mysql://${RDS_HOST}:3306/${DB_NAME}?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Kolkata"
Environment="SPRING_DATASOURCE_USERNAME=${DB_USER}"
Environment="SPRING_DATASOURCE_PASSWORD=${RDS_PASS}"
Environment="JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970"
ExecStart=/usr/bin/java -Xms256m -Xmx768m -XX:+UseG1GC -jar ${JAR_PATH}
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable telecom-crm
sudo systemctl restart telecom-crm

echo ""
echo "================================================================="
echo "✓ CONGRATULATIONS! APEX TELECOM CRM IS FULLY DEPLOYED!"
echo "  Frontend URL: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"
echo "  Backend API:  http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)/api/v1/auth/login"
echo "================================================================="
