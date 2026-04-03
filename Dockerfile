FROM node:24-slim
RUN npm install -g pnpm
WORKDIR /app

# 1. Copy everything while preserving structure
COPY . .

# 2. Install and Build
RUN pnpm install
RUN PORT=3000 BASE_PATH=/ pnpm --filter "@workspace/api-server" run build -- --no-typecheck

EXPOSE 3000

# 3. Use the DIRECTORY path for the filter instead of the name
# This is often more reliable in Docker environments
# Run the compiled javascript directly with Node
CMD ["node", "artifacts/api-server/dist/index.cjs"]
