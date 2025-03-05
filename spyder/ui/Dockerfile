FROM node:18-alpine

WORKDIR /app
COPY . .

RUN npm install
# add 'RUN npm run build' when building for production

EXPOSE 3000

#change to ["npm", "start"] when building for production
CMD ["npm", "run", "dev"]