# Factorial App - Automated Testing

This repository contains the automated testing setup for the Factorial App using Playwright. Follow this guide to set up, run, and debug the tests effectively.

## Project Structure

```
project/
|-- e2e/                  # End-to-end tests directory
|-- playwright.config.js  # Playwright configuration file
|-- package.json          # Project dependencies and scripts
|-- node_modules/         # Installed Node.js modules
|-- Project_deliverables/ # Other project deliverables such as documents and videos.
```

## Prerequisites

Ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (version 16 or higher recommended)
- [Playwright](https://playwright.dev/) (installed as a dev dependency)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd factorialapp
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

## Configuration

The test configuration is defined in `playwright.config.js`. Key settings include:

- **Test Directory**: `./e2e` for end-to-end tests.
- **Retry Policy**: Tests retry once on failure when running in CI.
- **Trace**: Traces are captured on the first retry for debugging.
- **Projects**: Configured for Chromium and Firefox.

## Running Tests

To execute all tests:
```bash
npm test
```

To run tests for a specific browser:
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
```
## Running Tests in Docker

You can run the tests inside a Docker container to ensure consistency across environments. This is particularly useful for CI/CD pipelines or testing on machines without the necessary dependencies installed.

Build the Docker image:
```bash
docker build -t playwright-tests .
```
 Run the container:
```bash
docker run playwright-tests
```
The `Dockerfile` is configured to:

- Use the official Playwright image.

- Install dependencies from `package.json`.

- Install Chromium and Firefox for testing.

## Debugging Tests

1. Run tests in headed mode:
   ```bash
   npx playwright test --headed
   ```

2. Use the debug mode to step through your tests:
   ```bash
   npx playwright test --debug
   ```

3. Open the HTML report for detailed test results:
   ```bash
   npx playwright show-report
   ```

## Best Practices

- **Avoid Flaky Tests**: Ensure proper assertions and sufficient timeouts.
- **Organize Tests**: Group related tests into meaningful suites.
- **Use Locators**: Prefer locators for interacting with elements.

## Additional Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Writing Tests](https://playwright.dev/docs/writing-tests)


