server {
    listen 80;
    listen [::]:80;
    server_name krishantours.com www.krishantours.com;

    # Let's Encrypt HTTP-01 challenges (see deploy/renew-cert.sh).
    location ^~ /.well-known/acme-challenge/ { root /var/www/certbot; default_type text/plain; }

    location / { return 301 https://krishantours.com$request_uri; }
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name www.krishantours.com;

    # Symlinks: self-signed until DNS points here, then Let's Encrypt (deploy/renew-cert.sh).
    ssl_certificate /etc/nginx/ssl/krishantours.com/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/krishantours.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;

    return 301 https://krishantours.com$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name krishantours.com;

    # Symlinks: self-signed until DNS points here, then Let's Encrypt (deploy/renew-cert.sh).
    ssl_certificate /etc/nginx/ssl/krishantours.com/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/krishantours.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;

    client_max_body_size 1M;

    # Trust the visitor address header only when the connection came from a
    # current Cloudflare network. Review against https://www.cloudflare.com/ips/.
    set_real_ip_from 103.21.244.0/22;
    set_real_ip_from 103.22.200.0/22;
    set_real_ip_from 103.31.4.0/22;
    set_real_ip_from 104.16.0.0/13;
    set_real_ip_from 104.24.0.0/14;
    set_real_ip_from 108.162.192.0/18;
    set_real_ip_from 131.0.72.0/22;
    set_real_ip_from 141.101.64.0/18;
    set_real_ip_from 162.158.0.0/15;
    set_real_ip_from 172.64.0.0/13;
    set_real_ip_from 173.245.48.0/20;
    set_real_ip_from 188.114.96.0/20;
    set_real_ip_from 190.93.240.0/20;
    set_real_ip_from 197.234.240.0/22;
    set_real_ip_from 198.41.128.0/17;
    set_real_ip_from 2400:cb00::/32;
    set_real_ip_from 2606:4700::/32;
    set_real_ip_from 2803:f800::/32;
    set_real_ip_from 2405:b500::/32;
    set_real_ip_from 2405:8100::/32;
    set_real_ip_from 2a06:98c0::/29;
    set_real_ip_from 2c0f:f248::/32;
    real_ip_header CF-Connecting-IP;
    real_ip_recursive on;

    location ^~ /.well-known/acme-challenge/ { root /var/www/certbot; default_type text/plain; }

    gzip on;
    gzip_types text/plain text/css application/javascript application/json image/svg+xml application/xml;

    location /_next/static/ {
        proxy_pass http://127.0.0.1:3417;
        proxy_set_header Host $host;
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location / {
        proxy_pass http://127.0.0.1:3417;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_connect_timeout 10s;
        proxy_read_timeout 60s;
    }

    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "DENY" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://www.google-analytics.com; media-src 'self'; connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com; font-src 'self' data:; frame-ancestors 'none'; base-uri 'self'; form-action 'self' https://sandbox.payhere.lk https://www.payhere.lk; upgrade-insecure-requests" always;
}
