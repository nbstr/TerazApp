#!/bin/bash
cp /root/projects/TerazApp/deploy/files/run-terazapp.sh /etc/init/run-terazapp.sh
cp /root/projects/TerazApp/deploy/files/terazapp.conf /etc/init/terazapp.conf

# Logs
mkdir /root/projects/TerazApp/logs
sudo start terazapp
