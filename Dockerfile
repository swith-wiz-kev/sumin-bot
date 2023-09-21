FROM ghcr.io/puppeteer/puppeteer:21.2.1
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/sumin

COPY package*.json ./
RUN npm ci
COPY . .
CMD [ "node", "app.js" ]