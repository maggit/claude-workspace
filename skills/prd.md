# Skill: Product Requirements Document (PRD)

## Purpose

Generate a structured Product Requirements Document that clearly defines what needs to be built, why it matters, and how success will be measured. The PRD serves as the source of truth aligning product, engineering, and design.

## When to Use

- Kicking off a new feature or product initiative
- Formalizing a rough idea into a concrete proposal
- Aligning stakeholders before engineering work begins

## Inputs

- **Product or feature name**: What is being built
- **Problem context**: Background on the user pain point or business need
- **Target audience**: Who this is for
- **Any existing constraints**: Technical limitations, timeline, budget (optional)

## Output Format

Produce a markdown document with the following sections:

### 1. Overview
A one-paragraph summary of the feature or product and its purpose.

### 2. Problem Statement
Describe the problem from the user's perspective. Include evidence or context that validates the problem exists. Be specific about who is affected and how.

### 3. User Stories
List 3-8 user stories in the format:
> As a [role], I want [capability] so that [benefit].

Prioritize each story as P0 (must-have), P1 (should-have), or P2 (nice-to-have).

### 4. Functional Requirements
Numbered list of specific behaviors the system must support. Each requirement should be testable and unambiguous.

### 5. Non-Functional Requirements
Cover relevant areas: performance targets, scalability, security, accessibility, compliance, and reliability expectations.

### 6. Success Metrics
Define 3-5 measurable outcomes that indicate the feature is working. Use the format: Metric | Target | Measurement Method.

### 7. Scope
Clearly state what is **in scope** and **out of scope** for this initiative. Call out deferred items explicitly.

### 8. Timeline Considerations
Note any deadlines, phasing suggestions, or dependencies that affect scheduling. If unknown, state that timeline is TBD and list factors that will influence it.

### 9. Open Questions
List unresolved questions that need stakeholder input before finalizing.

## Example

**Input**: "We need a way for users to export their dashboard data as PDF reports."

**Output**: A full PRD document covering the problem (users cannot share dashboard insights with stakeholders who lack platform access), user stories (export single dashboard, schedule recurring exports, customize report branding), functional requirements (PDF generation, template selection, email delivery), non-functional requirements (generation under 30 seconds, support for dashboards up to 50 widgets), success metrics (adoption rate, export completion rate, support ticket reduction), and clear scope boundaries (v1 excludes CSV export and API-based generation).

## Guidelines

- Write requirements that are specific and testable, not vague aspirations
- Separate what the system does from how it does it -- leave implementation to the eng spec
- Flag assumptions explicitly rather than embedding them silently
- Keep the document scannable: use bullets, tables, and short paragraphs
- Default to a single-phase scope unless the user requests phasing
