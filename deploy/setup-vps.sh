#!/usr/bin/env bash
# Fresh Ubuntu VPS setup (used for the 32.236.15.55 deploy). Run from /home/ubuntu/tours
# after copying the code and .env.production there:  bash deploy/setup-vps.sh
set -euo pipefail
DOMAIN=krishantours.com
[ -f /swapfile ] || { sudo fallocate -l 2G /swapfile; sudo chmod 600 /swapfile; sudo mkswap /swapfile; sudo swapon /swapfile; echo "/swapfile none swap sw 0 0" | sudo tee -a /etc/fstab; }
sudo apt-get update -y && sudo apt-get install -y nginx build-essential python3 curl git certbot sqlite3
if ! command -v node >/dev/null; then
  V=$(curl -s https://nodejs.org/dist/latest-v22.x/ | grep -o "node-v22[0-9.]*-linux-x64.tar.xz" | head -1)
  curl -s "https://nodejs.org/dist/latest-v22.x/$V" | sudo tar -xJ -C /usr/local --strip-components=1
fi
command -v pm2 >/dev/null || sudo npm i -g pm2
mkdir -p ~/tours-data/inquiries ~/tours-data/backups && chmod 700 ~/tours-data
[ -f .env.production ] || { echo "Create .env.production first (see .env.example)"; exit 1; }
chmod 600 .env.production
bash deploy/update.sh --no-pull
# Nginx with a self-signed bootstrap cert; renew-cert.sh swaps in Let's Encrypt once DNS points here.
sudo mkdir -p /etc/nginx/ssl/$DOMAIN /var/www/certbot
cd /etc/nginx/ssl/$DOMAIN
[ -e fullchain.pem ] || { sudo openssl req -x509 -nodes -newkey rsa:2048 -days 365 -subj "/CN=$DOMAIN" -keyout selfsigned.key -out selfsigned.crt; sudo ln -sf selfsigned.crt fullchain.pem; sudo ln -sf selfsigned.key privkey.pem; }
cd - >/dev/null
sudo cp deploy/nginx/$DOMAIN /etc/nginx/sites-available/$DOMAIN
sudo ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/$DOMAIN
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl enable --now nginx && sudo systemctl reload nginx
sudo install -m 755 deploy/renew-cert.sh /usr/local/bin/krishantours-cert
echo "*/15 * * * * root /usr/local/bin/krishantours-cert >/var/log/krishantours-cert.log 2>&1" | sudo tee /etc/cron.d/krishantours-cert >/dev/null
sed "s#/usr/bin/node#$(command -v node)#" deploy/krishantours-backup.cron | sudo tee /etc/cron.d/krishantours-backup >/dev/null
sudo env PATH="$PATH" pm2 startup systemd -u "$USER" --hp "$HOME" >/dev/null
echo "Done. Point Cloudflare DNS for $DOMAIN at this server's IP."
