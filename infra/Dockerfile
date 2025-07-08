# Build stage
FROM node:24-alpine AS build

WORKDIR /app

COPY smt-front/package.json smt-front/pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

COPY smt-front/ ./

RUN pnpm build

ARG API_URL=http://localhost:5000
ENV VITE_API_URL=$API_URL

FROM nginx:1.29-alpine

COPY infra/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

COPY infra/replace-backend-url.sh /usr/local/bin/replace-backend-url.sh
RUN chmod +x /usr/local/bin/replace-backend-url.sh

EXPOSE 80

ENTRYPOINT ["/usr/local/bin/replace-backend-url.sh"]

CMD ["nginx", "-g", "daemon off;"]
