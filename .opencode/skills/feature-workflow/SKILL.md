---
name: Feature Workflow
description: Workflow for implementing any new task or feature in this repository. Use when starting a new feature, fix, or improvement.
---

## Workflow

For every task or feature, follow this process:

1. **Create a branch** from the current base branch before making changes:
   - Name format: `feature/<task>`
   - Use a short, kebab-case task name, e.g. `feature/astronomy-events`.
   - Command: `git checkout -b feature/<task>`

2. **Implement the feature** in small, focused commits.
   - Keep changes scoped to the task.
   - Follow project conventions in `AGENTS.md`.

3. **Test the functionality** before considering the task done.
   - Add or update automated tests for the new behavior when applicable.
   - Run the project checks: `npm run lint`, `npm run test` (if configured), and `npm run build`.
   - Manually verify the main user flow affected by the feature, including mobile viewport behavior when UI changes.

4. **Report results** with:
   - Branch name
   - Files changed
   - Tests/checks run and outcome
   - Any remaining risks or follow-up work
