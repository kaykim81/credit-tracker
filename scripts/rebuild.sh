#!/bin/bash

docker compose down
docker rmi credit-tracker-app:latest
docker build --no-cache -t credit-tracker-app:latest https://github.com/kaykim81/credit-tracker.git#main && \
docker compose up -d
docker compose logs -f app
