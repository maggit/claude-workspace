---
name: landing-page-copy
description: "Write landing page copy. Use when the user says /landing-page-copy, asks to write landing page content, create conversion copy, or draft page copy for a product or service. Triggers: landing-page-copy, landing page, conversion copy, page copy, hero copy, sales page, marketing copy."
---

# Landing Page Copy

## Purpose

Write conversion-focused landing page copy that clearly communicates value, builds trust, and drives visitors toward a specific action. The output is ready-to-use copy organized by page section.

## When to Use

- Launching a new product, feature, or service
- Creating a campaign-specific landing page
- Rewriting an underperforming page to improve conversion
- Drafting copy for design mockups or wireframes

## Inputs

- **Product or service**: What is being offered
- **Target audience**: Who this page is for (demographics, pain points, goals)
- **Primary CTA**: The single most important action visitors should take
- **Key differentiators**: What makes this offering unique (optional)
- **Tone**: Professional, casual, bold, technical, etc. (optional, defaults to clear and confident)
- **Proof points**: Testimonials, stats, logos, case studies available (optional)

## Output Format

Produce a markdown document with copy for each page section:

### 1. Hero Section
- **Headline**: One sentence, 6-12 words. Communicate the core value or transformation. Lead with the benefit, not the feature.
- **Subheadline**: 1-2 sentences expanding on the headline. Add specificity or address a key objection.
- **Primary CTA button text**: 2-5 words. Action-oriented, specific to the offer.
- **Supporting text**: Optional one-liner near the CTA (e.g., "No credit card required").

### 2. Problem Section
2-3 short paragraphs or bullets articulating the pain the audience feels. Use the audience's own language. Make the reader feel understood before offering the solution.

### 3. Value Propositions
3-4 value propositions, each with:
- **Heading**: Benefit-driven, 4-8 words
- **Body**: 2-3 sentences explaining the value and how it is delivered
- **Optional icon/visual suggestion**: A brief note on what visual could accompany this

### 4. Features and Benefits
A section connecting features to outcomes. Format each as:
- **Feature name**: What it is (one phrase)
- **Benefit**: Why it matters to the user (one sentence)

Include 4-6 features. Lead with benefits, support with features.

### 5. Social Proof Section
Provide copy frameworks for:
- **Testimonial block**: A placeholder structure with guidance on what makes a strong testimonial (specific result, named person, relevant role)
- **Stats bar**: 3-4 metrics to highlight (e.g., "10,000+ teams", "99.9% uptime", "4.8/5 rating")
- **Logo bar**: Guidance on which customer logos to feature and a suggested label (e.g., "Trusted by teams at")

### 6. How It Works
3-4 numbered steps explaining the user's journey from signup to value. Keep each step to one sentence. Make the process feel simple.

### 7. Objection Handling
2-3 short blocks addressing common concerns or hesitations. Frame as reassurance, not defensiveness.

### 8. FAQ Section
5-7 frequently asked questions with concise answers. Cover:
- Pricing or cost concerns
- Getting started or setup
- Comparison to alternatives
- Security or data concerns
- Support availability

### 9. Final CTA Section
- **Headline**: Reinforce the core value or create urgency
- **Body**: 1-2 sentences summarizing why to act now
- **CTA button text**: Same as or variation of the primary CTA
- **Supporting text**: Risk reversal (guarantee, free trial, easy cancellation)

## Example

**Input**: "Landing page for a project management tool aimed at remote teams of 10-50 people. CTA is starting a free trial. Key differentiator is async-first design with built-in time zone awareness."

**Output**: Hero headline: "Project management built for teams that don't share a time zone." Subheadline addressing async collaboration pain. Value propositions around async updates, time zone-aware scheduling, and reduced meeting load. Features connecting async standups, smart notifications, and deadline adjustment to benefits. Social proof structure with suggested metrics. How it works in 3 steps (create workspace, invite team, run your first async standup). Objection handling for migration concerns, learning curve, and integration with existing tools. FAQ covering pricing, security, Jira comparison, and onboarding support. Final CTA reinforcing the free trial offer.

## Guidelines

- Write for scanners: most visitors will not read every word, so make headings and bold text carry the message
- One page, one goal -- every section should support the primary CTA
- Use concrete language over abstractions ("save 5 hours a week" beats "boost productivity")
- Avoid jargon unless the audience expects it
- Keep paragraphs short: 2-3 sentences maximum
- Social proof is most effective when it is specific and verifiable
- The FAQ section does real conversion work -- treat it as objection handling, not an afterthought
- Write multiple headline options when possible so stakeholders can test
