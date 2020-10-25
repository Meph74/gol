# Repository for Game of life
Based on a Game of life tutorial by Charlee Li, (https://www.freecodecamp.org/news/create-gameoflife-with-react-in-one-hour-8e686a410174/)

This repository is setup with Ruby on Rails using a Puma web server.

A postgres server must be setup even tho, strictly speaking, it is not needed for this project as is, but I imagined one addition that could be made would be to save a history of the game board as you run the game, then store that in the db.
The easiest way to set this up is to just create a docker container for the db, then link it when using the docker run command:
  * Download postgres container: docker pull postgres
  * Run postgres container: docker run -it --name postgres -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres

A Dockerfile is included with the intent of running this app inside a docker container:
  * Build the app container: docker build --no-cache -t bw .
  * Run the app container: docker run -it --name bw -p 80:3000 -v {local project path}/bw:/var/www/bw --link postgres:postgres bw
    * Replace the {local project path} with your local path for the repository
  * Connect to the shell inside the container: docker exec -it bw /bin/bash
    * Run: rails db:create
    * Run: rails db:migrate

The reason I am just using a Dockerfile here and not docker compose is because I am using docker with WSL2 and there is an issue with the docker compose command and linking other containers in that envrionment.

You should now be ready to run the app by just navigating to localhost in your browser. This renders the app/views/layouts/index.html which in turn renders the Gol.jsx react component in app/javascript/components. The Gol component contains the game logic.

Versions:
  * ruby 2.7.0p0
  * Rails 6.0.2.1

Gems:
  * react-rails 2.6.1
  * rspec-rails 4.0.1
  * pry 0.13.1

Improvements that comes to mind:
  * Move game logic from react component into rails controller
  * Add board cells history to db
  * Create tests for game logic after moved or rails
  * Create tests for db
  * Create game test
