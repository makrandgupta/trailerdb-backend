# trailer-db

Backend for TrailerDb. Frontend [here](http://github.com/makrandgupta/trailerdb-frontend)

## Starting and stopping

Running `npm start` will start the server using [forever](
https://github.com/nodejitsu/forever), and running `npm stop` will stop it.
`npm run-script list` will list the forever processes that are running.

## Testing

Running `npm test` will execute the tests in the `test` directory using mocha.
