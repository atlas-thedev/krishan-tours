#!/usr/bin/env bash
# Issues/renews the Let's Encrypt certificate once krishantours.com resolves to
# this server (works behind Cloudflare too), then points Nginx at it.
# Installed as a 15-minute cron job by the deploy; safe to run any time.
set -euo pipefail
DOMAIN=krishantours.com
LIVE=/etc/letsencrypt/live/$DOMAIN
mkdir -p /var/www/certbot
if [ ! -f "$LIVE/fullchain.pem" ]; then
  certbot certonly --webroot -w /var/www/certbot -d $DOMAIN -d www.$DOMAIN \
    --agree-tos -m iwantu226@gmail.com -n --quiet || exit 0
else
  certbot renew --quiet || true
fi
if [ "$(readlink -f /etc/nginx/ssl/$DOMAIN/fullchain.pem)" != "$(readlink -f $LIVE/fullchain.pem)" ]; then
  ln -sf $LIVE/fullchain.pem /etc/nginx/ssl/$DOMAIN/fullchain.pem
  ln -sf $LIVE/privkey.pem /etc/nginx/ssl/$DOMAIN/privkey.pem
fi
nginx -t -q && systemctl reload nginx
