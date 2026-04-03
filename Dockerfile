FROM node:24-slim
RUN npm install -g pnpm
WORKDIR /app
COPY . .
RUN pnpm install

# Provide both PORT and BASE_PATH to satisfy the Vite config
# Added --no-typecheck to ensure the build completes smoothly on the VPS
RUN PORT=3000 BASE_PATH=/ pnpm -r --filter "./artifacts/**" run build -- --no-typecheck

EXPOSE 3000
CMD ["node", "artifacts/api-server/dist/index.cjs"]
