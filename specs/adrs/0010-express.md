# Migrations only look back one day

* Status: Accepted
* Deciders: Ryan Keegan
* Date: 2021-05-04

Technical Story: We needed a backend for our web application. There are a ton of options ranging from Nginx to Koa. Ideally we would use something tried and true but also that was configured with JS to increase accessibility for the team who may not want to learn another language.

## Decision Drivers

* Needed something that used JS so there wouldn't be an additional learning curve for the backend team
* Ideally something that would enable the simple creation of a REST API (easy routing)
* There was healthy documentation for the back end framework available online

## Considered Options

* Apache
* Nginx
* Koa
* Express

## Decision Outcome

Chosen option: Node & Express made the most sense due to wanting to use JS in the backend. It has extensive documentation and support online compared to something like Koa. It also has an existing endpoint parser package for routing in the form of express-routes

### Positive Consequences 

* Backend didn't have to learn a new language
* Ease of routing
* Setup and debugging was easier due to a large user base and good documentation


### Negative Consequences 

* Stuck with a single thread in backend so we had to rely on JS's really awesome async crutch which caused some problems although that's more Node's fault than anything

<!-- markdownlint-disable-file MD013 -->