# ============================
# 1️⃣ BUILD STAGE
# ============================
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


# ============================
# 2️⃣ PRODUCTION STAGE
# ============================
FROM nginx:alpine

# Needed for envsubst
RUN apk add --no-cache gettext

# Copy template nginx config
COPY default.conf.template /etc/nginx/conf.d/default.conf.template

# Copy compiled frontend
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 8080

CMD ["/start.sh"]
