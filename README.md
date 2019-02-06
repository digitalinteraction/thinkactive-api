# Think Active Api

## Configure
Add your database and session key in the configuration files:
```text
app/config/db.js
.env
```

## Db Setup
To set up the database for this project use the [SequelizeJs CLI](https://github.com/sequelize/cli) and ensure you have entered your db credentials in the config/db.js (see db.example.js)

```bash
sequelize db:create
```

## Running
To run, use the docker-compose command to spin up the container and run the proejct

```bash
docker-compose up -d
```

## Sequelize CLI
Running sequelize CLI for generating models etc can be done using docker exec (already running docker container)

```bash
# Run the sequelize cli inside your container
docker-compose exec web npx sequelize model:generate \
  --name Organisation --attributes name:string, logo:string

# Or run locally (If you have packages installed on the host)
npx sequelize # ...
```

## Sequelize commands

```bash
# Run migrations
docker-compose exec web npx sequelize db:migrate
```

```bash
# Run seeds
docker-compose exec web npx sequelize db:seed:all
```

## Deployment

This project is deployed through [Docker](https://www.docker.com/what-docker). It uses a Continuous Integration to build a docker image when you push a [git tag](https://git-scm.com/book/en/v2/Git-Basics-Tagging) to the GitLab repository.

The project is versioned using NPM's semantic versioning through the `npm version` command.

```bash

# Deploying a version (commit your changes before this)
npm version # ... (minor | major | patch)
git push

# Migrating the live db
docker exec -it your_container_name npm run migrate
```
