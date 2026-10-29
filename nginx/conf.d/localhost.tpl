upstream frontend_host {
    server ${DEV_IP_ADDR}:${CLIENT_PORT};
}

upstream backend_host {
    server server:${SERVER_PORT};
}

server {
    listen 80;
    server_name localhost;

    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $http_host;
    proxy_set_header X-NginX-Proxy false;

    location /api {
        proxy_pass http://backend_host;
    }

    location /_next/webpack-hmr {
        proxy_pass http://frontend_host/_next/webpack-hmr;

        proxy_redirect off;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    location /socket.io {
        proxy_pass http://server:8083/socket.io/;
        proxy_redirect off;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        proxy_pass http://frontend_host;
    }
}
