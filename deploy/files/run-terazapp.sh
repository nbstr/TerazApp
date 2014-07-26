#!/bin/sh
exec node --nouse-idle-notification --max-old-space-size=8192 --trace-gc /root/projects/TerazApp/index.js 1> /root/projects/TerazApp/logs/access.log 2> /root/projects/TerazApp/logs/errors.log
