# Edits of bullet content after addition is not allowed, only crossing out

* Status: Accepted 
* Deciders: Entire Team
* Date: 2021-05-03


## Context and Problem Statement

What would the creator of bullet journaling think of a journal that can wipe entries away completely, leaving not a trace of their existence? Preposterous, he might claim. Physical journals, written in pen, establish permanence and stability within the journal itself, allowing at most crossing out of irrelevant entries.

## Decision Drivers 

* Editing the bullets afterwards allows users to retroactively change their mind on notes that should be spontaneous
* Our application aims to emulate paper within reason, and editing something away entirely seems to go against the core of a journal
* Users would assume a digital application would allow editing of entry content
* Knowledge that anything a user puts into a journal is permanent will make them thing critically about what they wish to log
* Editing is another, admittedly trivial, feature to implement

## Considered Options

* Allow unrestricted editing
* Prevent all editing entirely
* Put a grace period on edits that expires after a certain amount of time
* Allow only crossing out of irrelevant entries

## Decision Outcome

Chosen option: "Allow only crossing out of irrelevant entries", because users who use our application will want a strict, true to bujo approach, while still being able to retain some agency in what is crossed out or not.

### Positive Consequences

* Conforms to our philosophy of following the original Bullet Journal ideas
* Simplifies the backend slightly
* Users will consider every entry they put into the journal with care
* Journals will retain an indelible record of what you have done every day

### Negative Consequences 

* Users will expect editing to exist in a digital application
* Typos will simply have to be lived with, or crossed out and rewritten
