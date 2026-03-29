FROM node:20-alpine
RUN apk add --no-cache openssl
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

# We use shell form to execute these multiple commands on startup as requested by user
CMD sh -c "npx prisma migrate deploy && npx prisma db seed && node dist/app.js"
