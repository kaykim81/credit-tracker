FROM node:24-slim
RUN npm install -g pnpm
WORKDIR /app
COPY . .
RUN pnpm install

# Set these as ARGs and ENVs to ensure they exist at build AND run time
ARG PORT=3000
ARG BASE_PATH=/
ENV PORT=$PORT
ENV BASE_PATH=$BASE_PATH

RUN pnpm -r --filter "./artifacts/**" run build -- --no-typecheck

EXPOSE 3000
CMD ["node", "artifacts/api-server/dist/index.cjs"]
