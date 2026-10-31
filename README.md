# Chpokify

The project management tool designed for agile teams

## Run locally

Everything runs over plain HTTP on `http://localhost`. You don't need an SSL certificate or a domain.

Everything runs in Docker Compose: MongoDB, Redis, a one-off migrations container, the API/socket server, the Next.js frontend (`next dev`), and nginx in front of it all. The server, frontend, and `packages/*` sources are mounted into the containers, so code changes reload automatically.

```
browser ──► nginx (localhost:80)
              ├─ /api, /socket.io ──► server container (:8083)
              └─ /                 ──► frontend container (next dev, :3000)
```

### Prerequisites

- Docker with Compose (Docker Desktop or OrbStack on macOS)
- Optional: Node.js and Yarn 1.x on the host, only for editor tooling (type-check, lint). The repo pins its own Yarn (`.yarn/releases/yarn-1.18.0.cjs`), so any global Yarn 1 works.

### 1. Configure the environment

```
cp .env.example .env
```

Set `MONGO_ROOT_PASSWORD` in `.env` to any password; Mongo is created with it on first run. `APP_SECRET` has a placeholder value that is fine locally. Leave the rest as is for a default local setup.

### 2. Start everything

```
yarn dev
```

This runs `docker-compose up --build` and stays in the foreground (without Yarn: `docker-compose up --build`). On the first run it builds the images, creates the database, and applies the migrations. The frontend is ready once its logs show `compiled client and server successfully`.

### 3. Open the app

Go to **http://localhost**. The frontend and API are only published through nginx.

Sign up with any email. You don't need to confirm it.

### Stop / reset

```
docker-compose down       # stop all containers
docker-compose down -v    # also wipe Mongo/Redis data
```

### Troubleshooting

- **Port 80 is busy.** Set `NGINX_PORT=8000` in `.env` and add the port to `CLIENT_DOMAIN` and `BASE_API_CLIENT_URL` (e.g. `http://localhost:8000`). Then restart `yarn dev`.
- **`502 Bad Gateway` on `/`.** The frontend is still compiling or has crashed. Check its logs with `docker logs -f chpokify-frontend`.
- **`502 Bad Gateway` on `/api`.** The server container is still starting or has crashed. Check its logs with `docker logs -f chpokify-server`.
- **Mongo authentication fails after changing `MONGO_ROOT_PASSWORD`.** The password is only applied when the data volume is first created. Run `docker-compose down -v` and start again.
- **Changed `.env`.** Restart `yarn dev`. Containers don't pick up changes on the fly.
- **Changed dependencies (`package.json`).** `node_modules` live in Docker volumes, which a rebuild doesn't refresh. Run `docker-compose down`, remove the stale volumes (`docker volume ls | grep node_modules`, then `docker volume rm <name>`), and start `yarn dev` again.
