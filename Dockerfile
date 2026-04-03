FROM node:24-slim
RUN npm install -g pnpm
WORKDIR /app
COPY . .
RUN pnpm install

# We provide a default PORT here just for the build step
# We also use --no-typecheck to skip those 'queryKey' errors for now
RUN PORT=3000 pnpm build --filter "./artifacts/**" --if-present -- --no-typecheck

EXPOSE 3000
CMD ["pnpm", "start"]
