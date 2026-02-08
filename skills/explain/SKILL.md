---
name: explain
description: "Explain code, architecture, or system behavior in detail. Use when the user says /explain, asks to explain a file, function, module, pattern, or wants to understand how something works in the codebase. Triggers: explain, what does this do, how does this work, walk me through, understand, clarify."
---

# Code Explainer

Explain code clearly at the right level of detail.

## Workflow

1. **Identify the target:**
   - Specific function, class, file, module, or architectural pattern.
   - If the user points at a file, read it fully before explaining.

2. **Determine the audience level:**
   - If not specified, default to an intermediate developer familiar with the language.
   - Adjust terminology and depth accordingly.

3. **Provide a layered explanation:**

### Layer 1: One-line summary
What does this code do in plain English?

### Layer 2: High-level overview
- Purpose and responsibility.
- Where it fits in the larger system (caller/callee relationships).
- Key inputs and outputs.

### Layer 3: Step-by-step walkthrough
- Walk through the logic sequentially.
- Explain non-obvious decisions and patterns used.
- Note any side effects.

### Layer 4: Details (on request)
- Edge cases handled.
- Performance characteristics (time/space complexity).
- Potential issues or technical debt.

4. **Add context:**
   - Show how other parts of the codebase use this code.
   - Reference related files or modules.
   - Mention relevant design patterns by name.

## Guidelines

- Use the code's own variable and function names in the explanation.
- If the code is poorly written or confusing, say so constructively with improvement suggestions.
- Use analogies for complex concepts when helpful.
- For long files, provide a table of contents / map before diving into details.
- Include a visual diagram (ASCII or Mermaid) for complex data flows or architectures.
- Don't just restate the code in English — explain the *why*, not just the *what*.
