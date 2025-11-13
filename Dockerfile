# ---------- Etapa 1: Build ----------
FROM node:20-alpine AS build
WORKDIR /app

# Variables de entorno en tiempo de build (opcional)
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

COPY package*.json ./
COPY pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN pnpm run build

# ---------- Etapa 2: Nginx ----------
FROM nginx:1.27-alpine
# Copia artefactos estáticos
COPY --from=build /app/dist /usr/share/nginx/html

# Configurar SPA con fallback a index.html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia template de variables de entorno
COPY public/env.template.js /usr/share/nginx/html/env.js

# Instalar gettext para envsubst
RUN apk add --no-cache gettext

EXPOSE 80
CMD sh -c 'envsubst < /usr/share/nginx/html/env.js > /tmp/env.js && mv /tmp/env.js /usr/share/nginx/html/env.js && nginx -g "daemon off;"'
