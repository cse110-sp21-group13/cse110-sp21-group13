# Migrations only look back one day

* Status: Accepted
* Deciders: Ryan Keegan, Ethan Reiter
* Date: 2021-05-30

Technical Story: Migration can occur on a wide range of cases, and a timeframe to migrate is required. Too long would take a long time to load, and too short might make missing a day a calamity.

## Considered Options

* Migrating a month back
* Migrating a day back
* Migrating a week back

## Decision Outcome

Chosen option: A single day is the most straightforward outcome and would limit the amount of time spent loading.
 It also encourages users to keep on using their journal daily; any tasks that have been uncompleted for two days are unlikely to be that high a priority.

### Positive Consequences 

* User engagement is encouraged
* Simplicity in frontend
* Migration can be thought of as more of a day to day continuation than a formality; if you have stopped using your journal for a week the relevance of any of the bullets is almost certainly very low


### Negative Consequences 

* Users who do not access their journals for a day would have their bullets unable to migrate to the most recent day, and would have to remake them

<!-- markdownlint-disable-file MD013 -->