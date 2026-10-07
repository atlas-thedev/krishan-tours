#!/usr/bin/env bash
# One-shot setup for a fresh Ubuntu 22.04/24.04 VPS.
# Usage (as a sudo-capable user, from the project folder at /home/ubuntu/tours):
#   bash deploy/setup-vps.sh you@example.com
# Requires DNS for krishantours.com and www.krishantours.com to point at this server
# (if Cloudflare proxies the domain, set SSL mode to "Full (strict)").
set -euo pipefail
EMAIL="${1:?Pass an email for Let's Encrypt}"
APP_DIR="${APP_DIR:-/home/ubuntu/tours}"
DATA_DIR="${DATA_DIR:-/home/ubuntu/tours-data/inquiries}"
DOMAIN=krishantours.com

sudo apt-get update -y
sudo apt-get install -y curl git nginx certbot python3-certbot-nginx build-essential
if ! command -v node >/dev/null || [ "$(node -p 'process.versions.node.split(".")[0]')" -lt 22 ]; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi
sudo npm install -g pm2

mkdir -p "$DATA_DIR"
chmod 700 "$(dirname "$DATA_DIR")"
cd "$APP_DIR"
[ -f .env.production ] || { cp .env.example .env.production; echo "Edit $APP_DIR/.env.production (SMTP_PASS, ADMIN_PASSWORD_HASH, ADMIN_SESSION_SECRET) then re-run."; exit 1; }
chmod 600 .env.production

npm ci
npm run build

# TLS certificate (HTTP challenge) before installing the HTTPS Nginx config.
if [ ! -f /etc/letsencrypt/live/$DOMAIN/fullchain.pem ]; then
  sudo systemctl stop nginx || true
  sudo certbot certonly --standalone -d $DOMAIN -d www.$DOMAIN --agree-tos -m "$EMAIL" -n
fi
[ -f /etc/letsencrypt/options-ssl-nginx.conf ] || sudo curl -fsSL -o /etc/letsencrypt/options-ssl-nginx.conf https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf
[ -f /etc/letsencrypt/ssl-dhparams.pem ] || sudo openssl dhparam -out /etc/letsencrypt/ssl-dhparams.pem 2048
sudo cp deploy/nginx/$DOMAIN /etc/nginx/sites-available/$DOMAIN
sudo ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/$DOMAIN
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl enable --now nginx && sudo systemctl reload nginx

pm2 startOrReload ecosystem.config.cjs --update-env
pm2 save
sudo env PATH="$PATH" pm2 startup systemd -u "$USER" --hp "$HOME" >/dev/null
echo "Done: https://$DOMAIN"
