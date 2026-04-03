FROM node:24-slim
RUN npm install -g pnpm
WORKDIR /app
COPY . .
RUN pnpm install

# Provide build-time variables to satisfy Vite
RUN PORT=3000 BASE_PATH=/ pnpm -r --filter "./artifacts/**" run build -- --no-typecheck

EXPOSE 3000
# Target the specific workspace name from your package.json
CMD ["pnpm", "--filter", "@workspace/api-server", "start"]
