# Dartmouth Music Database

Dartmouth 2020 Spring COSC 61 Team project.

The client was created with [create-react-app](https://github.com/facebook/create-react-app) and the server was based on [api.js](https://www.cs.dartmouth.edu/~tjp/cs61/api/api.js) by Professor Pierson.

## Installing Dependencies
The repository is structured as three separate packages. That is a top-level package, a separate client package and a server package. Thus initially installing dependencies is a 3 step process that runs "install" for each of the packages.
```
npm install
npm install --prefix client
npm install --prefix server
```

## Running the application
The combined application, client and server, can be run with `npm start` in the top-level directory. `npm start` launches the client application on http://localhost:3000 and the backend server on http://localhost:3001.
