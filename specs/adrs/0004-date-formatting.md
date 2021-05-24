# Date Formatting

* Status: Accepted
* Deciders: Ryan Keegan
* Date: 2021-05-22

Technical Story: Deciding how to represent dates in the backend

## Context and Problem Statement

JSON date objects must be serialized to be sent into the database, and consistency is key when we select documents by date. Thus, we had to decide on a consistent formatting for all date objects.

## Considered Options

* Using the raw time, unformatted
* Truncating unnecessary date information to the level of detail required

## Decision Outcome

Chosen option: Truncation, as using the raw timestamp can get messy when it is specific to the millisecond.

### Positive Consequences 

* Truncation will allow for more readable date formatting
* Date storage will not include any unnecessary information

### Negative Consequences <!-- optional -->

* Timezones are tricky to deal with, as reserialization cannot account for timezones conveniently. 

<!-- markdownlint-disable-file MD013 -->