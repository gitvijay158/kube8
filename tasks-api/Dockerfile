FROM node:14-alpine

WORKDIR /app



COPY package.json .

RUN npm install

COPY . .

RUN mkdir -p /app/tasks && \
    touch /app/tasks/tasks.txt && \
    chmod 666 /app/tasks/tasks.txt

EXPOSE 3001

CMD [ "node", "tasks-app.js" ]