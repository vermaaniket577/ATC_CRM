#!/usr/bin/env bash
# ==============================================================================
# Apex Telecom CRM - Turnkey EC2 All-In-One Setup Script (Java + React + Nginx)
# ==============================================================================
set -e

echo "================================================================="
echo "   APEX TELECOM CRM - COMPLETE EC2 DEPLOYMENT SETUP              "
echo "================================================================="

# 1. Update OS and install Java 21, Maven, Node.js, Git, Nginx
echo "[1/6] Installing Java 21, Maven, Node.js, and Nginx..."
sudo dnf update -y
sudo dnf install -y java-21-amazon-corretto-devel maven git nodejs nginx

# 2. Build React Frontend
echo "[2/6] Building React Vite Frontend..."
cd frontend
npm ci
npm run build
cd ..

# 3. Configure Nginx to serve React frontend & reverse-proxy /api to Java
echo "[3/6] Deploying frontend static files to Nginx..."
sudo mkdir -p /var/www/html
sudo cp -r frontend/dist/* /var/www/html/

echo "[4/6] Configuring Nginx reverse proxy..."
sudo tee /etc/nginx/conf.d/telecom-crm.conf > /dev/null << 'EOF'
server {
    listen 80 default_server;
    server_name _;

    root /var/www/html;
    index index.html;

    # React Single Page Application (SPA) routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy all backend REST API requests to Spring Boot on port 8080
    location /api/ {
        proxy_pass http://127.0.0.1:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Proxy Spring Boot Actuator health checks
    location /actuator/ {
        proxy_pass http://127.0.0.1:8080/actuator/;
    }
}
EOF

# Test and start Nginx
sudo nginx -t
sudo systemctl enable nginx
sudo systemctl restart nginx

# 4. Build Java Spring Boot Backend
echo "[5/6] Building Spring Boot Backend executable JAR..."
cd backend
mvn clean package -DskipTests
cd ..

JAR_FILE=$(find backend/target -name "*.jar" ! -name "*sources.jar" ! -name "*javadoc.jar" | head -n 1)

# 5. Create Systemd Service for Spring Boot (Auto-restarts on reboot)
echo "[6/6] Creating Systemd background service for Java backend..."
sudo tee /etc/systemd/system/telecom-crm.service > /dev/null << EOF
[Unit]
Description=Apex Telecom CRM Enterprise Backend
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=$(pwd)/backend
Environment=SPRING_PROFILES_ACTIVE=dev
Environment=PORT=8080
ExecStart=/usr/bin/java -Xms256m -Xmx512m -XX:+UseG1GC -jar $(pwd)/${JAR_FILE}
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable telecom-crm
sudo systemctl restart telecom-crm

PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 || echo "your-ec2-ip")

echo ""
echo "================================================================="
echo "  ✓ FULL-STACK CRM DEPLOYMENT COMPLETE ON AWS EC2!"
echo "  Web Application URL: http://${PUBLIC_IP}"
echo "  Backend API Status:  http://${PUBLIC_IP}/actuator/health"
echo "================================================================="
