# API Quick Start Guide

Get started with the AI Design Workflow API in minutes.

## Installation

No installation required! The API is built into the Next.js application.

## Starting the API

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

The API will be available at `http://localhost:3000/api`

## First API Call

Test the API is working:

```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Common Use Cases

### 1. Get All Workflow Phases

```bash
curl http://localhost:3000/api/phases
```

### 2. Search for Specific Tools

```bash
curl "http://localhost:3000/api/search?q=gemini"
```

### 3. Get All Miro Tools

```bash
curl "http://localhost:3000/api/tools?icon=miro"
```

### 4. Get Statistics

```bash
curl http://localhost:3000/api/stats
```

### 5. Submit a New Tool

```bash
curl -X POST http://localhost:3000/api/submit \
  -H "Content-Type: application/json" \
  -d '{
    "toolName": "My Amazing Tool",
    "url": "https://example.com",
    "step": "Discovery",
    "substep": "A. PRD Review",
    "submitterEmail": "user@example.com"
  }'
```

## Using with TypeScript

Import the API types:

```typescript
import type { 
  ApiResponse, 
  ToolWithContext, 
  SearchResponse 
} from '@/types/api';

// Fetch tools with type safety
const fetchTools = async (): Promise<ApiResponse<ToolWithContext[]>> => {
  const response = await fetch('/api/tools');
  return response.json();
};

// Use the response
const { data: tools, success } = await fetchTools();
if (success && tools) {
  tools.forEach(tool => {
    console.log(`${tool.name} - ${tool.phase}`);
  });
}
```

## Using with React

```typescript
'use client';

import { useEffect, useState } from 'react';
import type { ToolWithContext } from '@/types/api';

export function ToolsList() {
  const [tools, setTools] = useState<ToolWithContext[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/tools')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTools(data.data);
        }
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <ul>
      {tools.map(tool => (
        <li key={tool.name}>
          {tool.name} - {tool.phase}
        </li>
      ))}
    </ul>
  );
}
```

## API Endpoints Summary

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/phases` | GET | Get all phases |
| `/api/phases/[id]` | GET | Get phase by ID |
| `/api/tools` | GET | Get all tools |
| `/api/tools/[name]` | GET | Get tool by name |
| `/api/sections` | GET | Get all sections |
| `/api/search` | GET | Universal search |
| `/api/stats` | GET | Get statistics |
| `/api/submit` | POST | Submit new tool |

## Query Parameters

### `/api/phases`
- `search` - Filter by text
- `icon` - Filter by icon type (gemini/miro)

### `/api/tools`
- `search` - Filter by text
- `icon` - Filter by icon type (gemini/miro)
- `phase` - Filter by phase number (1-5)

### `/api/sections`
- `phase` - Filter by phase number (1-5)

### `/api/search`
- `q` - Search query (required)

## Environment Variables

For email notifications (tool submissions):

```bash
# .env.local
RESEND_API_KEY=your_resend_api_key_here
```

## Next Steps

1. Read the full [API Documentation](./API_DOCUMENTATION.md)
2. Explore the TypeScript types in `types/api.ts`
3. Test endpoints with the provided examples
4. Build your integration!

## Testing with Postman

Import this collection to test all endpoints:

```json
{
  "info": {
    "name": "AI Design Workflow API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:3000/api/health",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["api", "health"]
        }
      }
    }
  ]
}
```

## Support

For detailed documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
