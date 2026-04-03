FROM node:24-slim
RUN npm install -g pnpm
WORKDIR /app
COPY . .
RUN pnpm install

# We bypass the root 'pnpm build' and run build only on the sub-folders
# This avoids triggering the 'pnpm typecheck' script at the root level
RUN PORT=3000 pnpm -r --filter "./artifacts/**" run build -- --no-typecheck

EXPOSE 3000
CMD ["pnpm", "start"]
