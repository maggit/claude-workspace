# Skill: Release Plan

## Purpose

Create a structured release plan that documents what is shipping, how to deploy it safely, and how to communicate changes to users. The plan serves as an operational checklist for the release process.

## When to Use

- Preparing a software release for deployment
- Coordinating a launch across engineering, product, and marketing
- Documenting the rollout strategy for a significant feature or version

## Inputs

- **Release name/version**: Identifier for this release
- **Features and changes**: List of what is included
- **Target release date**: When this should ship (optional)
- **Audience**: Internal tool, B2B, B2C, open source, etc. (optional)
- **Risk level**: Low, medium, or high based on scope of changes (optional)

## Output Format

Produce a markdown document with the following sections:

### Header Block

```
# Release Plan: [Name / Version]
**Target date**: [Date]
**Release owner**: [Name or TBD]
**Risk level**: [Low / Medium / High]
**Status**: [Draft / In Review / Approved / Released]
```

### 1. Release Summary
2-3 sentences describing the release at a high level. What is the headline?

### 2. Features Included
Bulleted list of features and changes, grouped by category:
- **New features**: Entirely new capabilities
- **Improvements**: Enhancements to existing functionality
- **Bug fixes**: Issues resolved
- **Internal changes**: Refactors, dependency updates, tooling

### 3. Breaking Changes
List any changes that will break existing behavior, APIs, or integrations. For each:
- What changed
- Who is affected
- What they need to do

If there are no breaking changes, state that explicitly.

### 4. Migration Steps
Step-by-step instructions for users or operators to transition:
1. Pre-migration checklist (backups, notifications)
2. Migration procedure
3. Post-migration verification

### 5. Rollout Strategy
Define how the release will be deployed:
- **Rollout method**: Big bang, percentage rollout, feature flags, canary
- **Rollout phases**: Who gets it first and on what timeline
- **Success criteria**: What signals confirm the release is healthy
- **Monitoring**: What dashboards and alerts to watch

### 6. Rollback Plan
- Trigger conditions: What signals indicate a rollback is needed
- Rollback procedure: Step-by-step instructions
- Data considerations: Any data changes that complicate rollback
- Communication: Who to notify if a rollback occurs

### 7. Communication Plan
| Audience | Channel | Message | Timing |
|----------|---------|---------|--------|
| Internal team | Slack | Release notification | Day of |
| Users | Email / Changelog | What's new | Day of |
| Affected users | Direct outreach | Breaking change notice | 1 week before |

### 8. Pre-Release Checklist
- [ ] All features code-complete and merged
- [ ] QA sign-off obtained
- [ ] Staging environment validated
- [ ] Documentation updated
- [ ] Changelog written
- [ ] Rollback procedure tested
- [ ] Stakeholder approval received
- [ ] Monitoring and alerts configured

## Example

**Input**: "Plan the release for v2.4.0 which includes the new search feature, three bug fixes, and a database migration. Medium risk."

**Output**: A release plan documenting the search feature and bug fixes, noting the database migration as the primary risk factor, defining a phased rollout (internal first, then 10% of users, then full), rollback steps that account for the migration (reverse migration script prepared), communication plan targeting both internal teams and end users, and a pre-release checklist tailored to the database migration requirements.

## Guidelines

- Scale the plan to the risk level -- a low-risk patch needs less ceremony than a major version
- Always include a rollback plan, even for low-risk releases
- Be specific about migration steps -- vague instructions cause incidents
- Communication timing matters: notify about breaking changes well before the release
- The pre-release checklist should be treated as a gate, not a formality
- Include monitoring expectations so the team knows what "healthy" looks like post-release
