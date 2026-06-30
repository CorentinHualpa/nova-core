import express from 'express';
import { NovaAgent, Message, ChatContext, ChatResponse } from '../models/Agent.js';

export const chatRouter = express.Router();
const agent = new NovaAgent();

// POST /chat - main endpoint
chatRouter.post('/chat', async (req, res) => {
  try {
    const { messages, context, tools } = req.body;

    // Validate input
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages' });
    }

    if (!context || !context.hotel_id) {
      return res.status(400).json({ error: 'Missing context.hotel_id' });
    }

    if (!tools || !Array.isArray(tools)) {
      return res.status(400).json({ error: 'Invalid tools' });
    }

    // Call agent
    const response: ChatResponse = await agent.chat(
      messages as Message[],
      context as ChatContext,
      tools as string[]
    );

    res.json(response);
  } catch (error) {
    console.error('Error in /chat:', error);
    res.status(500).json({
      error: 'Error processing chat',
      message: (error as Error).message,
    });
  }
});

// POST /chat/stream (future: streaming responses)
chatRouter.post('/chat/stream', async (req, res) => {
  res.status(501).json({ error: 'Streaming not yet implemented' });
});

// Health check
chatRouter.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'nova-core' });
});
