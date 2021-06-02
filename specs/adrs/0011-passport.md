# Migrations only look back one day

* Status: Accepted
* Deciders: Ryan Keegan
* Date: 2021-05-10

Technical Story: We needed an authenticator for our REST API because all of our users were connecting to a centrialized server.

## Decision Drivers

* Needed to function with PouchDB
* Needed to function with Express
* Needed clean access to user info off of session (ideally wouldn't require another query to access user info)
* It should be trusted as we are relying on the solution for user security

## Considered Options

* Passport
* Doing our own thing with JWTs

## Decision Outcome

Chosen option: Passport as trying to use JWTs seemed like it would require a lot of additional work on our part which we didn't have the time nor bandwith for. Also we wanted to go with something extensively tested as it's far more likely to be way more secure than any solution we come up with.

### Positive Consequences 

* Extensive documentation which led to ease of setup
* Worked flawlessly with the routes we had written

<!-- markdownlint-disable-file MD013 -->