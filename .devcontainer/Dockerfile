FROM mcr.microsoft.com/devcontainers/typescript-node:22

# Install pnpm
RUN npm install -g pnpm

# Block npm so we can only use pnpm
# RUN printf '#!/bin/sh\necho "‼️ Error: This project uses \"pnpm\", use that instead" >&2\nexit 1\n' > /usr/local/bin/npm && chmod +x /usr/local/bin/npm 