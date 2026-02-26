FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate --schema=apps/api/src/prisma/schema.prisma
RUN npx nx build api --configuration=production

FROM node:20-alpine

WORKDIR /app
COPY --from=builder /app/dist/apps/api ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/src/prisma ./prisma

RUN mkdir -p /uploads

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy --schema=./prisma/schema.prisma && node main.js"]
