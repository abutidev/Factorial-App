FROM mcr.microsoft.com/playwright:v1.41.0-jammy

WORKDIR /e2e

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm exec playwright install chromium firefox

CMD ["npm" , "exec", "playwright", "test"]