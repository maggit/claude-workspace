---
  name: commit
  description: Generate a commit message and commit staged changes
  disable-model-invocation: true
  allowed-tools: Bash, Read
  ---

  # Commit Changes

  1. Run `git diff --cached` to see what's staged
  2. If nothing is staged, run `git status` and tell the user
  3. Generate a commit message using conventional commits format:
     - `<type>(<scope>): <subject>`
     - Types: feat, fix, docs, refactor, test, chore
     - Lowercase, imperative mood, no period
  4. Run `git commit -m "<message>"`

  If the user provided arguments ($ARGUMENTS), use them as guidance for the message.