# Etapa 1: Construcción (Builder)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
# Instalamos dependencias limpias
RUN npm ci 
COPY . .
# Construimos la aplicación Vite
RUN npm run build

# Etapa 2: Producción (Servidor Web)
FROM nginx:alpine
# Copiamos solo los archivos estáticos generados en la etapa anterior (capas limpias)
COPY --from=builder /app/dist /usr/share/nginx/html

# AQUI ESTA LA MAGIA: Reemplazamos la config de nginx por nuestro proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponemos el puerto estándar de HTTP
EXPOSE 80
# Comando por defecto para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]