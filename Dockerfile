FROM node:24-slim
RUN npm install -g pnpm
WORKDIR /app

# Set default envs so Vite/Node don't crash
ENV PORT=3000
ENV BASE_PATH=/
ENV NODE_ENV=production

COPY . .
RUN pnpm install

# Build everything
RUN pnpm -r run build

EXPOSE 3000
# Run the server directly
CMD ["node", "artifacts/api-server/dist/index.cjs"]
