# AI Design Workflow API Documentation

Complete REST API for the AI-Enhanced Design Workflow toolkit.

## Base URL

```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## Endpoints

### 1. Health Check

Check API availability and status.

**GET** `/api/health`

**Response:**
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0",
  "service": "ai-design-workflow-api"
}
```

---

### 2. Get All Phases

Retrieve all workflow phases with optional filtering.

**GET** `/api/phases`

**Query Parameters:**
- `search` (optional): Filter tools within phases by name or description
- `icon` (optional): Filter tools by icon type (`gemini` | `miro`)

**Example Requests:**
```bash
# Get all phases
curl http://localhost:3000/api/phases

# Search for tools containing "PRD"
curl http://localhost:3000/api/phases?search=PRD

# Filter by Gemini tools only
curl http://localhost:3000/api/phases?icon=gemini
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "number": 1,
      "title": "Discovery",
      "description": "Understand the problem & users",
      "sections": [
        {
          "title": "A. PRD Review",
          "tools": [...]
        }
      ]
    }
  ],
  "count": 5
}
```

---

### 3. Get Phase by ID

Retrieve a specific phase by its number.

**GET** `/api/phases/[id]`

**Path Parameters:**
- `id`: Phase number (1-5)

**Example Request:**
```bash
curl http://localhost:3000/api/phases/1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "number": 1,
    "title": "Discovery",
    "description": "Understand the problem & users",
    "sections": [...]
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "Phase not found"
}
```

---

### 4. Get All Tools

Retrieve all tools across all phases with context information.

**GET** `/api/tools`

**Query Parameters:**
- `search` (optional): Filter by tool name, description, phase, or section
- `icon` (optional): Filter by icon type (`gemini` | `miro`)
- `phase` (optional): Filter by phase number (1-5)

**Example Requests:**
```bash
# Get all tools
curl http://localhost:3000/api/tools

# Search for "validation" tools
curl http://localhost:3000/api/tools?search=validation

# Get all Miro tools
curl http://localhost:3000/api/tools?icon=miro

# Get tools from Discovery phase (phase 1)
curl http://localhost:3000/api/tools?phase=1

# Combined filters
curl http://localhost:3000/api/tools?phase=1&icon=gemini
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "name": "CF1 PRD review Gemini Gem",
      "icon": "gemini",
      "url": "https://gemini.google.com/...",
      "description": "The Gemini Gem functions as...",
      "phase": "Discovery",
      "phaseNumber": 1,
      "section": "A. PRD Review",
      "coreOutputFocus": [...],
      "instructions": [...]
    }
  ],
  "count": 15
}
```

---

### 5. Get Tool by Name

Retrieve a specific tool by its exact name.

**GET** `/api/tools/[name]`

**Path Parameters:**
- `name`: URL-encoded tool name

**Example Request:**
```bash
curl http://localhost:3000/api/tools/CF1%20PRD%20review%20Gemini%20Gem
```

**Response:**
```json
{
  "success": true,
  "data": {
    "name": "CF1 PRD review Gemini Gem",
    "icon": "gemini",
    "url": "https://gemini.google.com/...",
    "description": "The Gemini Gem functions as...",
    "phase": "Discovery",
    "phaseNumber": 1,
    "section": "A. PRD Review",
    "coreOutputFocus": [...],
    "instructions": [...]
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "Tool not found"
}
```

---

### 6. Get All Sections

Retrieve all sections across all phases.

**GET** `/api/sections`

**Query Parameters:**
- `phase` (optional): Filter by phase number (1-5)

**Example Requests:**
```bash
# Get all sections
curl http://localhost:3000/api/sections

# Get sections from Ideation phase (phase 3)
curl http://localhost:3000/api/sections?phase=3
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "title": "A. PRD Review",
      "phase": "Discovery",
      "phaseNumber": 1,
      "toolCount": 2
    }
  ],
  "count": 10
}
```

---

### 7. Search

Universal search across phases, sections, and tools.

**GET** `/api/search`

**Query Parameters:**
- `q` (required): Search query string

**Example Request:**
```bash
curl http://localhost:3000/api/search?q=workflow
```

**Response:**
```json
{
  "success": true,
  "query": "workflow",
  "results": {
    "phases": [
      {
        "number": 1,
        "title": "Discovery",
        "description": "Understand the problem & users",
        "type": "phase"
      }
    ],
    "tools": [
      {
        "name": "CF1 workflow validation",
        "description": "The Gemini Gem functions as...",
        "icon": "gemini",
        "url": "https://gemini.google.com/...",
        "phase": "Ideation",
        "phaseNumber": 3,
        "section": "A. Concept Generation",
        "type": "tool"
      }
    ],
    "sections": []
  },
  "totalResults": 2
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Search query is required"
}
```

---

### 8. Get Statistics

Retrieve statistics about the workflow toolkit.

**GET** `/api/stats`

**Example Request:**
```bash
curl http://localhost:3000/api/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalPhases": 5,
    "totalSections": 10,
    "totalTools": 15,
    "toolsByIcon": {
      "gemini": 8,
      "miro": 7
    },
    "toolsByPhase": {
      "Discovery": 2,
      "Define": 3,
      "Ideation": 4,
      "Test": 3,
      "Implement": 3
    },
    "averageToolsPerPhase": "3.00"
  }
}
```

---

### 9. Submit Tool

Submit a new tool for consideration.

**POST** `/api/submit`

**Request Body:**
```json
{
  "toolName": "New Design Tool",
  "description": "Optional description",
  "url": "https://example.com/tool",
  "step": "Discovery",
  "substep": "A. PRD Review",
  "instruction": "Optional usage instructions",
  "submitterEmail": "user@example.com"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/submit \
  -H "Content-Type: application/json" \
  -d '{
    "toolName": "New Design Tool",
    "url": "https://example.com",
    "step": "Discovery",
    "substep": "A. PRD Review",
    "submitterEmail": "user@example.com"
  }'
```

**Response (200):**
```json
{
  "success": true,
  "message": "Submission received! Thank you for contributing."
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Missing required fields"
}
```

---

## Error Responses

All endpoints follow a consistent error response format:

```json
{
  "success": false,
  "error": "Error message description"
}
```

### HTTP Status Codes

- `200` - Success
- `400` - Bad Request (invalid parameters)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

---

## CORS

The API supports CORS for cross-origin requests. Preflight requests (OPTIONS) are handled automatically.

---

## Rate Limiting

Currently, there are no rate limits. Consider implementing rate limiting for production use.

---

## Examples with JavaScript/TypeScript

### Fetch All Phases
```typescript
const response = await fetch('http://localhost:3000/api/phases');
const data = await response.json();
console.log(data.data); // Array of phases
```

### Search for Tools
```typescript
const query = 'gemini';
const response = await fetch(`http://localhost:3000/api/search?q=${encodeURIComponent(query)}`);
const data = await response.json();
console.log(data.results.tools);
```

### Submit a New Tool
```typescript
const submission = {
  toolName: 'My New Tool',
  url: 'https://example.com',
  step: 'Discovery',
  substep: 'A. PRD Review',
  submitterEmail: 'user@example.com'
};

const response = await fetch('http://localhost:3000/api/submit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(submission)
});

const result = await response.json();
console.log(result.message);
```

---

## Webhook Integration (Future)

For the `/api/submit` endpoint, email notifications are sent via Resend. Configure the `RESEND_API_KEY` environment variable to enable email notifications.

---

## Best Practices

1. Always check the `success` field in responses
2. Handle error responses appropriately
3. Use URL encoding for query parameters with special characters
4. Cache responses when appropriate to reduce API calls
5. Implement retry logic for failed requests

---

## Support

For issues or questions, contact: thi@cloudflare.com
