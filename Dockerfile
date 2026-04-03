FROM node:24-slim
RUN npm install -g pnpm
WORKDIR /app
COPY . .
RUN pnpm install

# Provide a default PORT so Vite doesn't crash during build
# We filter for only the artifacts we need to speed things up
RUN PORT=3000 pnpm -r --filter "./artifacts/**" run build

EXPOSE 3000
CMD ["node", "artifacts/api-server/dist/index.cjs"]
