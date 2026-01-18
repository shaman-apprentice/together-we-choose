# Playwright E2E Test Guidelines

## Project Structure

- **Frontend App**: `/frontend` - Angular application running on http://localhost:4200
- **E2E Tests**: `/e2e-tests/tests/` - All test files must end with `.e2e.ts`
- **Config**: `/e2e-tests/playwright.config.ts`

## Writing Tests Guidelines

- Don't use comments but descriptive test names and variable names.
- Keep best practices of testing-library in mind, especially "The more your tests resemble the way your software is used, the more confidence they can give you". Feel free to add accessability improvements to the frontend app for better test selectors.
