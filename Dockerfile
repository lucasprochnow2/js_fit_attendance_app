FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ARG DATABASE_URL

RUN npm run prisma-generate
RUN npm run db-migrate-prod
RUN npm run build

# Production Stage

FROM node:18-alpine AS production

WORKDIR /app

# Copy the built artifacts from the builder stage
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder app/prisma ./prisma

# Set the environment variables (if needed)
ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "server.js"]
