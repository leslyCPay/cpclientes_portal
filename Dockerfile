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
RUN npm run build

# Usa una imagen base de servidor web ligero (Nginx) para servir la aplicación
FROM nginx:stable-alpine

# Copia los archivos generados por React (carpeta build) al directorio predeterminado de Nginx
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Exponemos el puerto 80 para HTTP
EXPOSE 80

# Comando por defecto para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]