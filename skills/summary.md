# Skill: Summary / Recap

## Purpose

Produce a concise, well-structured summary of a document, conversation, work session, or any body of content. Capture what matters without burying the reader in details.

## When to Use

- Summarizing a long document or thread for stakeholders
- Recapping a work session or sprint
- Creating an executive summary from detailed material
- Distilling a conversation into its essential outcomes

## Inputs

- **Source material**: The document, transcript, conversation, or notes to summarize
- **Audience**: Who will read this summary (e.g., executives, engineers, full team) (optional)
- **Focus area**: Any specific aspect to emphasize (optional)
- **Length preference**: Brief (1 paragraph), standard (half page), or detailed (full page) (optional, defaults to standard)

## Output Format

Produce a markdown document with the following sections:

### 1. TL;DR
2-3 sentences capturing the absolute essence. A reader who only reads this should understand the core message.

### 2. Key Points
Bulleted list of the 3-7 most important facts, findings, or themes. Each point should be one concise sentence. Order by importance, not chronology.

### 3. Decisions Made
List any decisions that were reached, along with brief rationale. If no decisions were made, note that explicitly. Format:
- **Decision**: What was decided
- **Rationale**: Why (one sentence)

### 4. Action Items
List concrete next steps with owners (if known) and deadlines (if stated):
- [ ] Action item description -- **Owner** (by Date)

If no action items exist, state "No action items identified."

### 5. Open Questions
List unresolved questions or topics that need further discussion. These are loose threads the reader should be aware of.

### 6. Context and Detail
Optional section for readers who want more depth. Include relevant background, nuances, or supporting details that did not fit in the sections above. Keep this section to 1-3 short paragraphs.

## Example

**Input**: A 45-minute product team meeting transcript discussing the Q2 roadmap.

**Output**:
- TL;DR: The team aligned on three Q2 priorities (search improvements, onboarding redesign, API v2) and deferred the mobile app to Q3 due to resource constraints.
- Key Points: search is the top revenue driver, onboarding drop-off is at 40%, API v2 has two enterprise customers waiting, mobile deferred but design work can start
- Decisions: Committed to search as the #1 priority; chose incremental API migration over big-bang rewrite
- Action Items: PM to draft search PRD by Friday, engineering lead to scope API v2 migration, design to start mobile exploration
- Open Questions: Hiring timeline for the second frontend engineer, whether to build or buy the search indexing layer

## Guidelines

- Lead with the most important information -- do not bury the headline
- Be faithful to the source material; do not add opinions or inferences
- Use the audience context to calibrate the level of technical detail
- Keep bullet points to one sentence each; elaborate only in the Context section
- If the source material is contradictory, note the contradiction rather than resolving it
- Attribute action items to specific people when that information is available
- Distinguish between decisions (settled) and open questions (unsettled)
