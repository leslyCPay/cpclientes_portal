# Usa la imagen base de Node.js
FROM node:20

# Establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia los archivos de package.json y package-lock.json
COPY package*.json ./

# Limpia el caché de npm e instala las dependencias del proyecto
RUN npm cache clean --force && npm install

# Copia el resto de los archivos de la aplicación
COPY . .

# Expone el puerto en el que correrá la aplicación
EXPOSE 80


# Comando para iniciar la aplicación, asegurando que el host esté configurado para aceptar conexiones externas
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]