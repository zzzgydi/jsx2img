# Build
FROM node:20-slim AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# Runtime
FROM node:20-slim
WORKDIR /app
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-noto-cjk \
    fonts-wqy-zenhei \
    fonts-freefont-ttf \
    libxss1 \
    && rm -rf /var/lib/apt/lists/* \
    && npm install -g pnpm

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/lib ./lib

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install --prod --frozen-lockfile

EXPOSE 3000
CMD ["pnpm", "start"]
