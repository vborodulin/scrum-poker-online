# Chpokify

The project management tool designed for agile teams

## Start project in local environment
Everything runs over plain HTTP on `http://localhost`, no SSL certificate is needed.

1. Create env file and fill `APP_SECRET` and `MONGO_ROOT_PASSWORD`:
   ```
   cp .env.example .env
   ```
2. Start backend (mongo, redis, migrations, server, nginx):
   ```
   yarn install
   yarn server:dev
   ```
3. Start frontend in another terminal:
   ```
   yarn client:dev
   ```
4. Open http://localhost (nginx proxies `/` to frontend on port 3000, `/api` and `/socket.io` to server).

If port 80 is busy, set `NGINX_PORT` in `.env` and add the port to `CLIENT_DOMAIN`, `BASE_API_CLIENT_URL`, `BASE_API_SSR_URL`.
If port 3000 is busy, set `CLIENT_PORT` in `.env`.

Emails are not sent while `SMTP_HOST` is empty. To send them, fill `SMTP_*` in `.env`.

## JIRA integrations
https://developer.atlassian.com/server/jira/platform/oauth/

### Generate an RSA public/private key pair
In terminal, run the following openssl commands. You can do this anywhere in your file system, but note that this is where the files will be created.

Generate a 1024-bit private key:

```
openssl genrsa -out jira_privatekey.pem 1024
```
Create an X509 certificate:

```
openssl req -newkey rsa:1024 -x509 -key jira_privatekey.pem -out jira_publickey.cer -days 365
```

Extract the private key (PKCS8 format) to the jira_privatekey.pcks8 file:

```
openssl pkcs8 -topk8 -nocrypt -in jira_privatekey.pem -out jira_privatekey.pcks8
```
Extract the public key from the certificate to the jira_publickey.pem file:
```
openssl x509 -pubkey -noout -in jira_publickey.cer  > jira_publickey.pem
```
