# Date Formatting

* Status: Accepted
* Deciders: Ryan Keegan
* Date: 2021-05-23

Technical Story: Deciding how to represent dates in the backend

## Context and Problem Statement

JSON date objects must be serialized to be sent into the database, and consistency is key when we select documents by date. Thus, we had to decide on a consistent formatting for all date objects.

## Considered Options

* Using the raw time, unformatted
* Truncating unnecessary date information to the level of detail required
* Using a custom date format created by calling getMonth, getDate, and getYear with offsets (ie 2021-5-23)

## Decision Outcome

Chosen option: Custom date format, as it can be reconstructed into a date object if necessary and can be easily split into month/year and day components for the purposes of database querying.

### Positive Consequences 

* Dates will be consistently handled and consistently set
* Dates can be reconstructed from the chosen date scheme if necessary for manipulation (for example, adding a day is trivial)
* It is very readable 

### Negative Consequences <!-- optional -->

* Some additonal manipulation is required to split the date into components for database querying, as storing it as two variables would take some work off the frontend

<!-- markdownlint-disable-file MD013 -->