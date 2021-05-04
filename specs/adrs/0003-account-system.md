# Data will be stored on user accounts in the cloud

* Status: Accepted
* Deciders: Backend
* Date: 2021-05-03

## Context and Problem Statement

Accessing a journal from anywhere can be rather important - life gets in the way, and sometimes you really need to note down that fun fact you just heard. What better way to do it than accessing your data from anywhere with a simple login? 


## Decision Drivers <!-- optional -->

* Users almost certainly wish to use the journal on more than one device
* Other authentification like Oauth and mobile phones are sometimes annoying to set up and often are effectively the same as a traditional account
* Requiring a login prevents anyone with access to a device from looking through your journal
* Should a user wish to delete all of their data for any reason, a unified account will make it trivial
* Local storage is easy but extremely limited in utility
* Ryan has experience with setting up account systems

## Considered Options

* Oauth
* Local Caching
* Account System

## Decision Outcome

Chosen option: "Account System", because it is very well known for users and Ryan has experience in setting them up.

### Positive Consequences <!-- optional -->

* Access from anywhere with an internet connection and a device
* Persistent data across devices
* More secure than allowing local caching and access by anyone on that device
* Personal experience with it on the team will allow for expediated implemention

### Negative Consequences <!-- optional -->

* Potential security concerns if not properly encrypted
* Server backend that must be hosted
* Extra complexity to the application
* Higher bus factor, as Ryan will certainly take the lead on it
  
