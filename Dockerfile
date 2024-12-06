# Usa la imagen base de Node.js
FROM node:20

# Copiamos los archivos de la aplicación a la imagen
COPY . /var/www/html

# Copiar el archivo de configuración de Apache
COPY apache.conf /etc/apache2/sites-available/000-default.conf


# Cambiar los permisos de los archivos y directorios de Laravel
RUN chown -R www-data:www-data /var/www/html && \
    chmod -R 755 /var/www/html/storage

# Establecemos el directorio de trabajo
WORKDIR /var/www/html

# Copia los archivos de package.json y package-lock.json
COPY package*.json ./

# Limpia el caché de npm e instala las dependencias del proyecto
RUN npm cache clean --force && npm install

# Expone el puerto en el que correrá la aplicación
EXPOSE 80


# Comando para iniciar la aplicación, asegurando que el host esté configurado para aceptar conexiones externas
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]