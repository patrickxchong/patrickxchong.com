---
title: Run Grocy On Fly.io
excerpt: Host your own groceries & household management solution!
status: published
tags:
  - Tech
  - WebDev
author: patrick-chong
date: 2022-06-10T12:03:15.266Z
updatedAt: ""
image: /assets/images/uploads/grocy-fly.io.png
imageCardPosition: left-top
imageHero: true
imageHeroObjectFit: object-cover
---

I've been wanting to try using Grocy to manage some household inventory but couldn't find a server where I could host PHP for free but is also up to date enough to support SQLite version 3.90 ([see Github issue](https://github.com/grocy/grocy/issues/1209)). When researching the latest platforms that I could [deploy websites and APIs (for free)](/deploy-websites-and-apis-for-free/), I found out about [Fly](https://fly.io/), their generous free plan (no sleep + persistent storage) and their support for Docker containers. Decided to try running Grocy on Fly and it worked beautifully! Here's the process for anyone who would like to do the same.

1. Create an account on [Fly](https://fly.io/) and install Fly command line tool: https://fly.io/docs/getting-started/installing-flyctl/

2. Git clone Grocy Docker image (https://github.com/linuxserver/docker-grocy) and open terminal in cloned folder.

3. Run `flyctl launch` to generate a fly.toml file with the  `app_name` of your choice.

4. Update `internal_port` in fly.toml from 8080 to 80 because the Docker image is running grocy on port 80.
```toml
internal_port = 8080

to

internal_port = 80
```

5. Create a persistent volume on Fly.
```shell
flyctl volumes create <volume_name> --size <volume_size_in_gb> --region <region_code>

# Example:
# flyctl volumes create grocy_data --size 1 --region sin
```

6. Add `mount` configuration to fly.toml
{% raw %}
```toml
[mount]
source = "<volume_name>"
destination = "<destination_folder_name>"

Example:
[mount]
source = "grocy_data"
destination = "/grocy_dir"
```
{% endraw %}

7. Your final fly.toml file should look something like the following:
{% raw %}
```toml
app = "<app_name>"

kill_signal = "SIGINT"
kill_timeout = 5
processes = []

[env]

[experimental]
  allowed_public_ports = []
  auto_rollback = true

[[services]]
  http_checks = []
  internal_port = 80
  processes = ["app"]
  protocol = "tcp"
  script_checks = []

  [services.concurrency]
    hard_limit = 25
    soft_limit = 20
    type = "connections"

  [[services.ports]]
    handlers = ["http"]
    port = 80

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443

  [[services.tcp_checks]]
    grace_period = "1s"
    interval = "15s"
    restart_limit = 0
    timeout = "2s"

[mount]
source = "grocy_data"
destination = "/grocy_dir"
```
{% endraw %}

8. Run `flyctl deploy` to deploy your app.

9. After the build is completed, run `flyctl ssh console` to ssh into the application server. You'll see the grocy files in `/app/grocy` and that the persistent disk is mounted at `<destination_folder_name>` (/grocy_dir in my case). 

10. I tried making the persistent disk `/app` so that all the server files are always in the persistent disk, but Fly didn't seem to like that so I created a Git repo in `/grocy_dir/` and manually back up/restore the Grocy database/uploaded files between `/app/grocy/data/` and `/grocy_dir/` with shell scripts. The backup files are subsequently uploaded to the cloud via Git. The two scripts I used are shared beow and are meant to be run in the root directory.

```shell
# backup.sh
cd /app/grocy/data/ && cp -r `ls -A | egrep -v ".htaccess|.gitignore|viewcache|backups"` /grocy_dir/data
```

```shell
# restore.sh
cp -r /grocy_dir/data/* /app/grocy/data/;
chown -R abc /app/grocy/data/*; # required else Grocy can't read the files somehow
```

That's all! Thanks for reading and drop a comment below if you have any questions. :D 