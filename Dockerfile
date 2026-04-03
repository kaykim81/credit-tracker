FROM node:24-slim
RUN npm install -g pnpm
WORKDIR /app
COPY . .
RUN pnpm install
RUN pnpm build --filter "./artifacts/**" --if-present -- --no-typecheck || pnpm -r run build
EXPOSE 3000
CMD ["pnpm", "start"]
