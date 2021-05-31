# Only deletion, no editing

* Status: Accepted
* Deciders: Ryan Keegan, Ethan Reiter
* Date: 2021-05-30

Technical Story: There is no neat way to include editing with the way our bullets are displayed.

## Context and Problem Statement

Deletion and editing of bullets is logical, but our interface is minimalist and adding a way to edit would be difficult. 

## Considered Options

* Neither deletion nor editing
* Only deletion
* Only editing

## Decision Outcome

Chosen option: Deletion only; if a user wishes to edit a bullet, they can simply remake it. Deleting a bullet fulfills all of the same roles editing does, with additional functionality. Editing is a halfway measure that is simply not worth the complexity it would require.

### Positive Consequences 

* Less buttons on screen to clutter the interface
* Simple workflow on a journal
* No refactor of the UI to accommodate editing

### Negative Consequences 

* Users would likely expect editing, regardless if the functionality is effectively duplicated in deletion

<!-- markdownlint-disable-file MD013 -->