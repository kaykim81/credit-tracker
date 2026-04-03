FROM node:24-slim
RUN npm install -g pnpm
WORKDIR /app

ENV PORT=3000
ENV BASE_PATH=/

COPY . .
RUN pnpm install

# Filter specifically for the server and the frontend UI
RUN PORT=3000 BASE_PATH=/ pnpm -r --filter "@workspace/api-server" --filter "@workspace/credit-tracker" run build -- --no-typecheck

EXPOSE 3000
CMD ["node", "artifacts/api-server/dist/index.cjs"]
