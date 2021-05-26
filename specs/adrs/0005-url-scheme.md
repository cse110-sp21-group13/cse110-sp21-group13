# URLs will contain a date timestamp of the day, month, and year

* Status: Accepted (Update to 0004-date-formatting)
* Deciders: Backend
* Date: 2021-05-23

## Context and Problem Statement

Linking to specific dailies in the calendar is impossible without URL parameters, and GET requests don't accept bodies. Therefore, URL parameters are a logical choice, but it needs to be determined exactly what URL parameters are necessary.


## Decision Drivers 

* GET requests use URL parameters, not request bodies
* Putting the date in the URL provides a logical way to link to specific dailies, and an easy way to switch between log dates
* Sending an empty request body causes major issues, which is solved by using url params
* Dailies and monthlies are identified by dates, not IDs, as IDs are impossible to retrieve anytime besides when they are created

## Considered Options

* Timestamps in request bodies
* URL parameters

## Decision Outcome

Chosen option: "URL parameters", because it works much more like GET requests are intended to.

### Positive Consequences <!-- optional -->

* Dailies can be switched easily by setting the URL param
* Creating a daily for a date is as easy as changing the URL parameter

### Negative Consequences <!-- optional -->

* URL must be set the same every time
  
