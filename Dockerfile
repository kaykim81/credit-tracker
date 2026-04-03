FROM node:24-slim
RUN npm install -g pnpm
WORKDIR /app
COPY . .
RUN pnpm install

# We provide both PORT and BASE_PATH to satisfy the strict Vite config
RUN PORT=3000 BASE_PATH=/ pnpm -r --filter "./artifacts/**" run build -- --no-typecheck

EXPOSE 3000
# Tells pnpm to run the start script specifically for the credit-tracker app
CMD ["pnpm", "--filter", "@workspace/api-server", "start"]
