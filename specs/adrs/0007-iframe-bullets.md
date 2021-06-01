# IFrame Abstraction of Bullet Display

* Status: Accepted
* Deciders: Ryan Keegan, Ethan Reiter
* Date: 2021-05-26

Technical Story: Bullets are rather nontrivial, and implementing displaying them twice would be a lot of duplication. Thus, we have abstracted them into their own iframe that can be applied to any page we want bullet display on.

## Context and Problem Statement

We had to decide if moving into iframes was feasible, as the original code was not built with iframes in mind.

## Considered Options

* Duplicating the code for bullet display
* Moving into iframes

## Decision Outcome

Chosen option: Iframes, as interacting with them is fairly trivial.

### Positive Consequences 

* Duplication is reduced
* Maintaining and making changes to bullet display does not require editing code in more than one file
* Keeping the iframe self-contained makes styling far easier

### Negative Consequences 

* Iframes are another layer of complexity added on to journals
* Another structure to learn to interact with

<!-- markdownlint-disable-file MD013 -->