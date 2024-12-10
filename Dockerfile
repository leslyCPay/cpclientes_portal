# Usa la imagen base de Node.js para construir la aplicación
FROM node:20 AS build

# Establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia los archivos de configuración de dependencias
COPY package*.json ./

# Limpia el caché de npm e instala las dependencias
RUN npm cache clean --force && npm install

# Copia el resto del código de la aplicación
COPY . .

# Construye la aplicación para producción
RUN npx vite builda

# Usa una imagen base de servidor web ligero (Nginx) para servir la aplicación
FROM nginx:stable-alpine

# Copia los archivos generados por React (carpeta build) al directorio predeterminado de Nginx
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Copia los archivos fuente al contenedor (si deseas ver o hacer modificaciones)
COPY --from=build /usr/src/app /usr/src/app

# Copia los certificados SSL al contenedor
#COPY claimpay.net.crt /etc/nginx/ssl/claimpay.net.crt
#COPY claimpay.net.key /etc/nginx/ssl/claimpay.net.key

# Copia la configuración personalizada de Nginx (incluyendo la configuración SSL)
COPY nginx.conf /etc/nginx/nginx.conf

# Exponemos el puerto 443 para HTTPS y 80 para HTTP
EXPOSE 443 80

# Comando por defecto para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]     