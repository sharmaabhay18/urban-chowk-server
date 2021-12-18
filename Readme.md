# Getting Started with Urban Chowk Server

> - App is hosted at [https://urban-chowk-server.herokuapp.com/]
> - Call `https://urban-chowk-server.herokuapp.com/ping` to check if app is alive.
## Note
 - Make sure redis is installed, up and running at port `6379` to run app locally.
 - We used `Mongo Atlas` so we don't need seed file to populate data.
 - Please clear Redis server when running locally to avoid any error/warning.
 - Producation App will take few seconds to load as the servers cold starts at [https://urban-chowk-server.herokuapp.com/]

## Running App Locally
1. Install [Redis](https://redis.io/topics/quickstart) and start the redis server.
1. Make sure you have `.env` file.
2. Run command `npm install` in root directory of project.
3. Run command `npm start` to start the application and is available at [http://localhost:8080].

## Running App Locally in Docker

1. Make sure you have `.env` file.
2. Make sure you have docker installed, up and running.
3. Run command `npm install` in root directory of project.
4. Run `docker-compose up --build` to build and run the app locally[http://localhost:8080] using docker.

## Depolying app on heroku using docker
> We created pipeline in heroku so whenever the app is merged to `master` git branch it will deploy the code automatically and will be available at [https://urban-chowk-server.herokuapp.com/]
- Checking logs for server use this command `heroku logs --tail --app urban-chowk-server`. Make sure you are logged in.



## Technolgoies used in back end application

- Redis for caching category and testimonial data.
- Firebase to check if user's access token is valid or not.
- Sendgrid and node mailer to send email to user's.
- MongoDB atlas for storing out data in cloud.
- Docker for containerization.
- Heroku for deploying our application.
