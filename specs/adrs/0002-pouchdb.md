# Using PouchDB for database

* Status: Accepted
* Deciders: Backend Team
* Date: 05/06/2021 

## Context and Problem Statement

Storage of a database is tricky and there are a great deal of options, but we need the ease of potentially converting the database in a later sprint and pouchdb allows this to happen very easily.

## Decision Drivers 

* Sanat suggested the database
* Use is very simple
* Any database needs to seamlessly support remote or local database use
* The alternative is MongoDb, which is less simple (though likely more powerful as a result)

## Considered Options

* MongoDb
* PouchDb

## Decision Outcome

Chosen option: PouchDb, because of the ease of switching to remote and Sanat's suggestion to use it.

### Positive Consequences 

* Ease of switching to remote
* Document structure is simply JSON files
* Easy to understand and implement
* Built asynchronously, so potential conflicts can be resolved

### Negative Consequences <!-- optional -->

* No experience with pouchdb on the team
* Documents are the smallest structure, no table structure
* Revisions of all documents are kept up to a limit