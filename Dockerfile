FROM node:24-slim
RUN npm install -g pnpm
WORKDIR /app

# Set defaults
ENV PORT=3000
ENV BASE_PATH=/
ENV NODE_ENV=production

COPY . .
RUN pnpm install

# Build everything - focusing on the API server and the Frontend
RUN PORT=3000 BASE_PATH=/ pnpm -r --filter "@workspace/api-server" --filter "@workspace/credit-tracker" run build -- --no-typecheck

EXPOSE 3000

# Use a more robust way to start the server
CMD ["node", "artifacts/api-server/dist/index.cjs"]
