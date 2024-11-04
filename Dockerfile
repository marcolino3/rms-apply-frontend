# Next.js Dockerfile
FROM node:23-alpine
RUN addgroup app && adduser -S -G app app
WORKDIR /app
COPY package*.json .
RUN npm cache clean --force && npm install
COPY . .
RUN mkdir -p /app/.next/cache && chown -R app:app /app/.next
USER app
ENV API_URL=http://helloworld.com/api
EXPOSE 3000
CMD ["npm", "run", "dev"]

