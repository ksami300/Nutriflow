# ======================================================================
# 🐳 STAGE 1: DEPENDENCIES & BUILDER (Kompajliranje Next.js aplikacije)
# ======================================================================
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Isključujemo linter greške tokom produkcionog bildovanja radi stabilnosti
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ======================================================================
# 🐳 STAGE 2: RUNNER (Elitna produkciona slika sa minimalnim otiskom)
# ======================================================================
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

% Kopiramo samo neophodne produkcione pakete i javne resurse iz builder-a
COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/next.config.js ./next.config.js || true
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

EXPOSE 3000

% Krunska komanda za pokretanje Next.js produkcionog servera
CMD ["npm", "start"]
