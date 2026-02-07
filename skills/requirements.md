# Skill: Requirements Gathering

## Purpose

Extract, organize, and formalize requirements from unstructured conversations, notes, or rough ideas. Produce a clean requirements document that can feed into PRDs, engineering specs, or project plans.

## When to Use

- Processing raw meeting notes or stakeholder interviews into structured requirements
- Consolidating scattered feedback into a single source of truth
- Validating completeness of requirements before starting design or engineering

## Inputs

- **Raw material**: Conversation transcript, meeting notes, brainstorm output, or rough feature description
- **Domain context**: What product or system this relates to (optional)
- **Existing requirements**: Any previously documented requirements to build on (optional)

## Output Format

Produce a markdown document with the following sections:

### 1. Summary
A 2-3 sentence overview of what the requirements cover and their scope.

### 2. Functional Requirements
Numbered list of what the system must do. Each requirement should:
- Start with "The system shall..." or "Users shall be able to..."
- Be specific enough to test
- Include a priority tag: `[P0]` `[P1]` `[P2]`

### 3. Non-Functional Requirements
Cover relevant quality attributes:
- **Performance**: Response times, throughput targets
- **Scalability**: Growth expectations
- **Reliability**: Uptime, recovery objectives
- **Security**: Access control, data protection
- **Usability**: Accessibility standards, device support
- **Compliance**: Regulatory or policy requirements

### 4. Constraints
List technical, business, or organizational constraints that limit solution options. Examples: must use existing database, must ship before Q3, budget cap of $X.

### 5. Assumptions
Explicitly state assumptions made while interpreting the raw input. Flag any that need stakeholder validation.

### 6. Dependencies
Identify external dependencies:
- Other teams or services
- Third-party APIs or tools
- Prerequisite work that must complete first

### 7. Acceptance Criteria
For each major functional requirement, define clear pass/fail criteria using the format:
- **Given** [context], **when** [action], **then** [expected result]

### 8. Gaps and Open Questions
List areas where the raw input was ambiguous, contradictory, or incomplete. Frame each as a question that needs an answer before requirements are final.

## Example

**Input**: A pasted Slack thread where a PM, designer, and engineer discuss adding team billing to a SaaS product.

**Output**: A structured requirements document extracting: functional requirements (team admin can add seats, billing rolls up to a single invoice, prorated charges for mid-cycle changes), non-functional requirements (PCI compliance, 99.9% uptime for billing operations), constraints (must integrate with Stripe, cannot change existing individual billing flow), assumptions (teams are capped at 500 seats based on PM's comment), dependencies (Stripe Connect API, identity service for role management), acceptance criteria for each requirement, and flagged gaps (no mention of how to handle downgrades or what happens to data when a team is deleted).

## Guidelines

- Preserve the intent of the original input even when restructuring
- Do not invent requirements -- if something is unclear, put it in Gaps
- Distinguish between what was explicitly stated and what was inferred
- Use consistent language and numbering for traceability
- When the input contains conflicting statements, flag the conflict rather than picking a side
