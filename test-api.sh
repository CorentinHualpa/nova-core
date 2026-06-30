#!/bin/bash

echo "Testing Nova Core API..."

# Health check
echo ""
echo "1. Health check:"
curl -s http://localhost:3001/health | jq '.'

# Test chat endpoint
echo ""
echo "2. Testing /api/chat:"
curl -s -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Hola, quiero reservar una habitación para 3 noches"}
    ],
    "context": {
      "hotel_id": "cl_test_123",
      "language": "es",
      "guest_name": "Maria Garcia",
      "guest_phone": "+51987654321"
    },
    "tools": ["reservar", "cobrar", "actualizar"]
  }' | jq '.'

echo ""
echo "✓ Nova Core API test complete"
