## Changes made since first checkpoint
- Implemented Jest and Jest+Puppeteer frameworks for unit testing and e2e testing.\
  Following the steps in Lab 8, jest and jest+puppeteer have been added so that unit tests and end-to-end tests can be created.
- Fixed issues with the Codacy coverage report \
  Codacy now properly outputs the coverage report for code quality.
- Commit JSDoc documentation to the branch after created \
  The documentation for JSDoc used to be created, but was not added to the repository. It is now committed to the branch of the pull request once the job is run.
- Configured Jest to output coverage report to see how much of the codebase is covered. \
  Jest now outputs a coverage report that indicates which parts of the code are covered under a unit test. This information is visible in the terminal of the github action.
