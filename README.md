# Together, We Choose

Monorepo housing. See `docs/prd.md` and `docs/architecture.md` for context.

## Quick Tool Knowledge

### Docker

- Build the image: `docker build -t together-we-choose-app .`
- Start locally: `docker run --rm -p 3000:3000 -v "$(pwd)/backend/storage/sqlite:/usr/src/app/storage/sqlite" -v "$(pwd)/backend/storage/images:/usr/src/app/storage/images" together-we-choose-app`
- Login into image: `docker run --rm -it --entrypoint sh together-we-choose-app`
- See logs of started container: `docker ps` -> `docker logs <container-id>` (option `-f` for streaming / follow)

### SQLite3

- create empty db: `sqlite3 file.db "VACUUM;"`
- use e.g. https://sqlitebrowser.org to debug your database.
- get db from server: `scp root@88.99.121.53:/var/lib/together-we-choose/storage/sqlite/app.db ./backend/backup.db`

### NGINX

- default location: */etc/nginx/sites-enabled*
- Enable nginx: `sudo systemctl enable --now nginx`
- Validate nginx config: `nginx -t`
- Reload nginx config: `systemctl reload nginx`
- SSL with https://certbot.eff.org/instructions?ws=nginx&os=snap

```
# minimal debug nginx config
server {
  listen 8080;
  listen [::]:8080;

	location / {
		proxy_pass http://localhost:3000;
		proxy_http_version 1.1;
  }
}
``` 
