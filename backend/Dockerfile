
FROM node:22-bookworm-slim

# Install Python, pip and FFmpeg
RUN apt-get update && \
    apt-get install -y python3 python3-pip ffmpeg && \
    rm -rf /var/lib/apt/lists/*

# Install yt-dlp with its recommended dependencies
RUN python3 -m pip install --break-system-packages --no-cache-dir -U "yt-dlp[default]"
RUN python3 -m yt_dlp --version && ffmpeg -version

# Backend working directory
WORKDIR /app

# Install Node dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy backend source code
COPY . .

ENV NODE_ENV=production

EXPOSE 5000

CMD ["node", "server.js"]
