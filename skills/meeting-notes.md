# Skill: Meeting Notes

## Purpose

Structure raw meeting content into clear, actionable notes that participants and non-participants can quickly scan. Capture decisions, action items, and follow-ups so nothing falls through the cracks.

## When to Use

- Organizing notes during or after a meeting
- Processing a meeting transcript into a shareable format
- Creating a record of decisions for future reference

## Inputs

- **Meeting content**: Transcript, rough notes, or a description of what was discussed
- **Meeting metadata**: Title, date, attendees (optional but recommended)
- **Meeting type**: Standup, planning, retrospective, 1:1, stakeholder review, etc. (optional)

## Output Format

Produce a markdown document with the following structure:

### Header Block

```
# Meeting: [Title]
**Date**: [Date]
**Attendees**: [List of names/roles]
**Duration**: [Length if known]
**Meeting type**: [Type if known]
```

### 1. Agenda
Numbered list of topics that were planned or actually covered. Mark any skipped items.

### 2. Discussion Points
For each major topic discussed, create a subsection:

#### [Topic Name]
- Summary of the discussion (2-5 bullets)
- Key arguments or perspectives raised
- Any data or evidence referenced

### 3. Decisions
Numbered list of decisions made during the meeting:
1. **[Decision]** -- [Brief rationale]. Agreed by [who, if noted].

If no decisions were made, state: "No formal decisions were made in this meeting."

### 4. Action Items
Table format for clear ownership and tracking:

| # | Action Item | Owner | Due Date | Status |
|---|-------------|-------|----------|--------|
| 1 |             |       |          | Open   |

### 5. Follow-ups
- Topics deferred to future meetings
- Information someone agreed to look up or share
- Meetings or discussions that need to be scheduled

### 6. Parking Lot
Items raised but intentionally set aside for later. These prevent good ideas from being lost while keeping the current meeting focused.

## Example

**Input**: Rough notes from a sprint planning meeting: "talked about auth bugs -- maria will fix the token refresh issue by wednesday. discussed new search feature, agreed to use elasticsearch over solr. need to figure out timeline for search. jake mentioned concerns about test coverage. pushed mobile discussion to next week."

**Output**:
- Header: Sprint Planning, today's date, attendees mentioned
- Discussion Points: Auth bugs (token refresh identified as root cause), Search feature (Elasticsearch vs Solr debate), Test coverage concerns, Mobile (deferred)
- Decisions: Use Elasticsearch for search implementation
- Action Items: Maria to fix token refresh by Wednesday, team to determine search timeline
- Follow-ups: Mobile discussion next week, Jake to propose test coverage targets
- Parking Lot: Mobile app planning

## Guidelines

- Capture the substance of discussions, not a verbatim transcript
- Every action item must have an owner -- if none was assigned, flag it as "Owner: TBD"
- Keep discussion summaries neutral; do not editorialize
- When the input is a rough transcript, clean up language but preserve meaning
- Group related discussion points rather than listing them chronologically
- Distinguish between decisions (firm commitments) and sentiments (general agreement without a firm commitment)
- If attendees are not provided, infer from names mentioned and note that the list may be incomplete
