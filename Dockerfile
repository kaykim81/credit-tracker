FROM node:24-slim
RUN npm install -g pnpm
WORKDIR /app
COPY . .
RUN pnpm install

# Build EVERYTHING (Frontend + Backend)
RUN pnpm -r run build

EXPOSE 3000
# Run the compiled server
CMD ["node", "artifacts/api-server/dist/index.cjs"]
