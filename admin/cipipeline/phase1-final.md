## Changes made since second checkpoint
- JSDocs automatically generate documentation is pushed to a second repository that is hosted through GitHub pages. This allows for the documentation to be updated with every pull request, and accessed remotely.
- Codacy is able to analyze the quality of the code base correctly as well as the testing coverage of all files. This information can be accessed through the codacy website and the information is updated after every pull request and push to main.
- Unit tests and end-to-end tests have been created to cover many of the core project files through jest and jest+puppeteer.
- A coverage report from jest unit tests is now included.
- Various pipeline issues have been fixed, meaning that it more stable and less likely to terminate properly.
  - An example of an issue that was fixed was that some unit test did not terminate the express server properly, resulting in an indefinite runtime. This has been fixed by adding a timeout and force closing the server if it does not terminate properly in time.
