
-- Production

```bash
$ sudo nginx -t  #Check nginx if is valid
$ systemctl status nginx
$ pm2 start ./network/ecosystem.config.js --env production
```

```bash
$ cd /var/www/artist-dashboard/source
$ nginx -c /etc/nginx/nginx.conf -t
$ systemctl reload nginx
$ systemctl status nginx
```

-- Development
