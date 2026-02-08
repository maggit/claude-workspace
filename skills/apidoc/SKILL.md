---
name: apidoc
description: "Generate API documentation from code. Use when the user says /apidoc, asks to document an API, generate API docs, create endpoint documentation, or produce an OpenAPI/Swagger spec. Triggers: api doc, api documentation, endpoint docs, swagger, openapi, REST docs, API reference, document routes."
---

# API Documentation Generator

Generate comprehensive API documentation from code.

## Workflow

1. **Identify the API framework:**
   - Express, Fastify, Koa, Hono (Node.js)
   - Flask, FastAPI, Django REST Framework (Python)
   - Gin, Echo, Chi (Go)
   - Actix, Axum (Rust)
   - Spring Boot (Java)
   - Or a raw OpenAPI/Swagger spec.

2. **Discover endpoints:**
   - Scan route definitions, controllers, and handler files.
   - For each endpoint, extract: method, path, parameters, request body, response, middleware/guards.

3. **For each endpoint, document:**

```markdown
### <METHOD> <path>

<Brief description>

**Authentication:** <Required/Optional/None>

**Parameters:**
| Name | In | Type | Required | Description |
|------|-----|------|----------|-------------|
| id   | path | string | yes | Resource ID |

**Request Body:**
```json
{
  "field": "type — description"
}
```

**Responses:**
| Status | Description |
|--------|-------------|
| 200    | Success — returns <shape> |
| 400    | Validation error |
| 401    | Unauthorized |
| 404    | Not found |

**Example:**
```bash
curl -X GET https://api.example.com/resource/123 \
  -H "Authorization: Bearer <token>"
```
```

4. **Choose output format based on user preference:**
   - **Markdown** — readable docs for a README or docs site.
   - **OpenAPI 3.x YAML/JSON** — machine-readable spec for Swagger UI, Redoc, Postman.
   - **Both** — generate both formats.

5. **If generating OpenAPI spec:**
   - Include `info`, `servers`, `paths`, `components/schemas`.
   - Derive schemas from TypeScript types, Pydantic models, or Go structs.
   - Validate the spec with a linter if available.

## Guidelines

- Derive documentation from actual code, not guesses.
- Include realistic example values in request/response samples.
- Document error responses, not just happy paths.
- Group endpoints by resource or domain (e.g., Users, Products, Orders).
- Note rate limits, pagination, and versioning if present in the code.
- If auth middleware exists, document the auth mechanism.
- For GraphQL APIs, document queries, mutations, and subscriptions instead.
