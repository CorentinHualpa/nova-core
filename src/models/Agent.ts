import { OpenAI } from 'openai';
import { config } from '../config.js';
import { getSystemPrompt, getToolDefinitions } from '../utils/prompts.js';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatContext {
  hotel_id: string;
  language: string;
  guest_phone?: string;
  guest_name?: string;
}

export interface ToolCall {
  type: string;
  payload?: any;
}

export interface ChatResponse {
  text: string;
  audio_url?: string;
  actions?: ToolCall[];
}

export class NovaAgent {
  private openai: OpenAI;
  private model = 'gpt-4-turbo';

  constructor() {
    this.openai = new OpenAI({
      apiKey: config.openai.apiKey,
    });
  }

  async chat(
    messages: Message[],
    context: ChatContext,
    tools: string[]
  ): Promise<ChatResponse> {
    // Build system prompt with context
    const systemPrompt = getSystemPrompt(context);

    // Get tool definitions
    const toolDefinitions = getToolDefinitions(tools);

    try {
      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          ...messages,
        ],
        tools: toolDefinitions,
        tool_choice: 'auto',
        temperature: 0.7,
        max_tokens: 1024,
      });

      const firstChoice = response.choices[0];

      // Parse response
      let text = '';
      const actions: ToolCall[] = [];

      if (firstChoice.message.content) {
        text = firstChoice.message.content;
      }

      // Handle tool calls
      if (firstChoice.message.tool_calls) {
        for (const toolCall of firstChoice.message.tool_calls) {
          const args = JSON.parse(toolCall.function.arguments);
          actions.push({
            type: toolCall.function.name,
            payload: args,
          });
        }
      }

      return {
        text,
        actions: actions.length > 0 ? actions : undefined,
      };
    } catch (error) {
      console.error('Error calling OpenAI:', error);
      throw error;
    }
  }

  // Generate audio response (future: ElevenLabs integration)
  async generateAudio(text: string, language: string): Promise<string> {
    // Placeholder
    return '';
  }
}
