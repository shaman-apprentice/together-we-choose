---
mode: 'agent'
description: 'Sketch out architectural guidelines and tool choices for the product'
tools: ['search','codebase']
model: GPT-5
---

# Architectural guidelines and tools to use

You are a senior software architect. Your task is to sketch out architectural guidelines and tools to use for implementing the product defined in the provided [product requirement document](../../docs/prd.md).

Based on team skills and available open source software, we have the following in mind:

- Use a mono GitHub repo with VSCode workspaces for a frontend workspace, backend workspace and a shared package for shared code and DTOs to transfer data between frontend and backend. The shared module will be consumed as local npm file dependency.
- Use latest Angular for the web application.
- Use Angular Material for design, which comes with predefined rose light and dark theme as desired.
- Utilize Angular's i18n for multi language support.
- Use single NestJS instance for the backend.
- Use TypeORM for connecting the backend with the database.
- Use SQlite for minimal overhead persistence data. Migrating to more advanced tooling like PostgreSQL later on should be easy through our TypeORM abstraction.
- For storing user uploaded images, we plan to simply utilize a persistent mounted volume.
- We want a lightweight event based tracking of user data for product evaluation. Make sure, that it is cookie-less and aligns with German laws. A good article as starting point is https://www.dr-datenschutz.de/cookieless-tracking-ohne-einwilligung-und-google-analytics/ - Implementing it ourself is probably the easiest solution.
- For ease of running everywhere and easily setting up test environments, we want to dockerize our software.
- We plan to run the final product in Hetzner cloud, as this is a cheap German cloud provider.
- Our testing concept is very simple. We only want to run E2E tests for our core user flows. As this is going to be a small product and we don't have a lot of logic, this should be fine. As E2E testing tool we want to use Playwright.

Critically assess the proposed stack against PRD requirements. Only suggest alternatives solution, when you think proposed stack is not viable. A minimal evaluation is fine, as we have a very small scope and want to stay minimalistic for a faster time to market. Create an initial minimalistic architecture document.

## Deliverables

- Create an architecture.md file.
- Document the chosen tech stack. 
- If suited, provide an architecture diagram in ASCII.

## Specific Guidance & Constraints

- Remember the goals of our [product requirement document](../../docs/prd.md) and don't overengineer.
- Think thoroughly and be precise.
- Avoid generic fluff. Avoid marketing language.
- If something is uncertain, flag it under Open Questions instead of guessing.
- If something is missing, point that out in a separate section.

## Out of scope

- For initial product evaluation and launch, we skip backups. The assumption is, that we can easily add it later as we dockerize our setup.
- Concrete data model and endpoints will be defined iteratively as we implement the features.