---
title: Battery Notifications in Linux
excerpt: Setup battery notifications to help extend battery life.
status: published
tags:
  - Tech
  - Linux
author: patrick-chong
date: 2021-10-03T02:31:10.530Z
updatedAt: ''
image: /assets/images/uploads/danilo-alvesd-w1p05f4gyng-unsplash.jpg
---

## Bash Script

Put this anywhere and make the script file executable with with `chmod +x`.

```bash
#!/bin/bash

# watch --interval=5

CAPACITY=$(cat /sys/class/power_supply/BAT0/capacity)
STATUS=$(cat /sys/class/power_supply/BAT0/status)

if [[ (${CAPACITY} > 80) && (${STATUS} == "Charging")]]
then
  /usr/bin/notify-send -u critical "Battery" "Disconnect Charger. Battery is above 80%"
elif [[ (${CAPACITY} < 20) && (${STATUS} == "Discharging")]]
then
  /usr/bin/notify-send -u critical "Connect Charger. Battery" "Battery is below 20%"
fi
```

## Crontab script

Schedule to run script every 2 minutes

```bash
# for notify-send to work
DISPLAY=:0.0
XAUTHORITY=/home/$LOGNAME/.Xauthority
DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/1000/bus

*/2 * * * * <location of script>
```

Guide: https://crontab.guru/#\*/2_\*\_\*\_\*\_\*

## Why keep laptop battery between 80-20 percent

Have to admit that I had a hard time finding reputable sources, but I guess it could be true if many sources are saying the same thing?

Example Sources:

- https://www.wired.co.uk/article/how-to-improve-battery-life-tips-myths-smartphones
- https://www.choice.com.au/electronics-and-technology/phones/mobile-phones/articles/how-to-care-for-phone-and-laptop-lithium-batteries
