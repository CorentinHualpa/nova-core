# Nova Core

Unified conversational AI agent backend for hotel reservations, payments, and updates.

Used by: Dale Voz (WhatsApp), phone agents, web chat, etc.

## Features

- **Language-aware**: Spanish, English, French prompts
- **Tool-calling**: Easily add new tools (reserve, pay, update, etc.)
- **Context-aware**: Per-hotel customization (guest info, hotel settings)
- **REST API**: Simple HTTP interface for all clients

## Stack

- Node.js + TypeScript
- Express.js
- OpenAI GPT-4 Turbo (chat engine)
- Extensible for Claude, Grok, etc.

## Quick Start

### Setup

```bash
npm install
cp .env.example .env
# Edit .env with your OPENAI_API_KEY
```

### Run

```bash
npm run dev
# Listening on http://localhost:3001
```

### Test

```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Quiero reservar una habitación"}
    ],
    "context": {
      "hotel_id": "cl_123",
      "language": "es"
    },
    "tools": ["reservar", "cobrar", "actualizar"]
  }'
```

## API

### `POST /api/chat`

**Request**:
```json
{
  "messages": [
    {"role": "user", "content": "..."},
    {"role": "assistant", "content": "..."}
  ],
  "context": {
    "hotel_id": "cl_XXX",
    "language": "es|en|fr",
    "guest_phone": "+51987654321",
    "guest_name": "Maria Garcia"
  },
  "tools": ["reservar", "cobrar", "actualizar"]
}
```

**Response**:
```json
{
  "text": "¿Confirmo la reservación para...",
  "actions": [
    {
      "type": "reservar",
      "payload": {
        "guest_name": "Maria Garcia",
        "check_in": "2026-07-05",
        "check_out": "2026-07-08",
        "nights": 3,
        "total_amount": 450
      }
    }
  ]
}
```

### `GET /health`

Health check endpoint.

## Tools

Built-in tools:
- **reservar**: Create reservation
- **cobrar**: Create payment link
- **actualizar**: Update booking

Add custom tools in `src/utils/prompts.ts` → `getToolDefinitions()`.

## Architecture

```
Client (Dale Voz, web chat, phone agent)
    ↓
Express server
    ↓
nova-core /api/chat endpoint
    ↓
OpenAI GPT-4 Turbo (+ tool-calling)
    ↓
Response + tool actions
    ↓
Client executes tools (booking, payment, etc.)
```

## Environment

- `PORT` (default 3001)
- `OPENAI_API_KEY` (required)
- `XAI_API_KEY` (for future Grok integration)
- `ANTHROPIC_API_KEY` (for future Claude integration)

## Deployment

Deploy to Railway, Vercel, AWS, etc. just like any Node.js app.

```bash
npm run build
npm start
```

## Future

- Streaming responses
- Voice input/output (WebRTC)
- Multi-turn memory (Redis caching)
- Custom LLM providers (Claude, Grok, local models)
- Prompt templates per hotel
- Analytics + usage tracking
