# ===============================
# Stage 1 : Build React
# ===============================

FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build



# ===============================
# Stage 2 : Nginx
# ===============================

FROM nginx:alpine


# Supprimer la configuration nginx par défaut
RUN rm /etc/nginx/conf.d/default.conf


# Ajouter notre configuration nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf


# Copier le build React
COPY --from=build /app/build /usr/share/nginx/html


EXPOSE 80


CMD ["nginx", "-g", "daemon off;"]