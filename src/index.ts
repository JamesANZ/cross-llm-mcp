import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { LLMClients } from "./llm-clients.js";
import { LLMProvider } from "./types.js";

const server = new McpServer({
  name: "cross-llm-mcp",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

const llmClients = new LLMClients();

// Individual LLM tools
server.tool(
  "call-chatgpt",
  "Call OpenAI's ChatGPT API with a prompt",
  {
    prompt: z.string().describe("The prompt to send to ChatGPT"),
    model: z
      .string()
      .optional()
      .describe("ChatGPT model to use (default: gpt-4)"),
    temperature: z
      .number()
      .min(0)
      .max(2)
      .optional()
      .describe("Temperature for response randomness (0-2, default: 0.7)"),
    max_tokens: z
      .number()
      .int()
      .positive()
      .optional()
      .describe("Maximum tokens in response (default: 1000)"),
  },
  async ({ prompt, model, temperature, max_tokens }) => {
    try {
      const response = await llmClients.callChatGPT({
        prompt,
        model,
        temperature,
        max_tokens,
      });

      if (response.error) {
        return {
          content: [
            {
              type: "text",
              text: `**ChatGPT Error:** ${response.error}`,
            },
          ],
        };
      }

      let result = `**ChatGPT Response**\n`;
      result += `**Model:** ${response.model || "Unknown"}\n\n`;
      result += response.response;

      if (response.usage) {
        result += `\n\n---\n**Usage:**\n`;
        result += `- Prompt tokens: ${response.usage.prompt_tokens}\n`;
        result += `- Completion tokens: ${response.usage.completion_tokens}\n`;
        result += `- Total tokens: ${response.usage.total_tokens}\n`;
      }

      return {
        content: [
          {
            type: "text",
            text: result,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `Error calling ChatGPT: ${error.message || "Unknown error"}`,
          },
        ],
      };
    }
  },
);

server.tool(
  "call-claude",
  "Call Anthropic's Claude API with a prompt",
  {
    prompt: z.string().describe("The prompt to send to Claude"),
    model: z
      .string()
      .optional()
      .describe("Claude model to use (default: claude-3-sonnet-20240229)"),
    temperature: z
      .number()
      .min(0)
      .max(1)
      .optional()
      .describe("Temperature for response randomness (0-1, default: 0.7)"),
    max_tokens: z
      .number()
      .int()
      .positive()
      .optional()
      .describe("Maximum tokens in response (default: 1000)"),
  },
  async ({ prompt, model, temperature, max_tokens }) => {
    try {
      const response = await llmClients.callClaude({
        prompt,
        model,
        temperature,
        max_tokens,
      });

      if (response.error) {
        return {
          content: [
            {
              type: "text",
              text: `**Claude Error:** ${response.error}`,
            },
          ],
        };
      }

      let result = `**Claude Response**\n`;
      result += `**Model:** ${response.model || "Unknown"}\n\n`;
      result += response.response;

      if (response.usage) {
        result += `\n\n---\n**Usage:**\n`;
        result += `- Input tokens: ${response.usage.prompt_tokens}\n`;
        result += `- Output tokens: ${response.usage.completion_tokens}\n`;
        result += `- Total tokens: ${response.usage.total_tokens}\n`;
      }

      return {
        content: [
          {
            type: "text",
            text: result,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `Error calling Claude: ${error.message || "Unknown error"}`,
          },
        ],
      };
    }
  },
);

server.tool(
  "call-deepseek",
  "Call DeepSeek API with a prompt",
  {
    prompt: z.string().describe("The prompt to send to DeepSeek"),
    model: z
      .string()
      .optional()
      .describe("DeepSeek model to use (default: deepseek-chat)"),
    temperature: z
      .number()
      .min(0)
      .max(2)
      .optional()
      .describe("Temperature for response randomness (0-2, default: 0.7)"),
    max_tokens: z
      .number()
      .int()
      .positive()
      .optional()
      .describe("Maximum tokens in response (default: 1000)"),
  },
  async ({ prompt, model, temperature, max_tokens }) => {
    try {
      const response = await llmClients.callDeepSeek({
        prompt,
        model,
        temperature,
        max_tokens,
      });

      if (response.error) {
        return {
          content: [
            {
              type: "text",
              text: `**DeepSeek Error:** ${response.error}`,
            },
          ],
        };
      }

      let result = `**DeepSeek Response**\n`;
      result += `**Model:** ${response.model || "Unknown"}\n\n`;
      result += response.response;

      if (response.usage) {
        result += `\n\n---\n**Usage:**\n`;
        result += `- Prompt tokens: ${response.usage.prompt_tokens}\n`;
        result += `- Completion tokens: ${response.usage.completion_tokens}\n`;
        result += `- Total tokens: ${response.usage.total_tokens}\n`;
      }

      return {
        content: [
          {
            type: "text",
            text: result,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `Error calling DeepSeek: ${error.message || "Unknown error"}`,
          },
        ],
      };
    }
  },
);

server.tool(
  "call-gemini",
  "Call Google's Gemini API with a prompt",
  {
    prompt: z.string().describe("The prompt to send to Gemini"),
    model: z
      .string()
      .optional()
      .describe("Gemini model to use (default: gemini-1.5-flash)"),
    temperature: z
      .number()
      .min(0)
      .max(2)
      .optional()
      .describe("Temperature for response randomness (0-2, default: 0.7)"),
    max_tokens: z
      .number()
      .int()
      .positive()
      .optional()
      .describe("Maximum tokens in response (default: 1000)"),
  },
  async ({ prompt, model, temperature, max_tokens }) => {
    try {
      const response = await llmClients.callGemini({
        prompt,
        model,
        temperature,
        max_tokens,
      });

      if (response.error) {
        return {
          content: [
            {
              type: "text",
              text: `**Gemini Error:** ${response.error}`,
            },
          ],
        };
      }

      let result = `**Gemini Response**\n`;
      result += `**Model:** ${response.model || "Unknown"}\n\n`;
      result += response.response;

      if (response.usage) {
        result += `\n\n---\n**Usage:**\n`;
        result += `- Prompt tokens: ${response.usage.prompt_tokens}\n`;
        result += `- Completion tokens: ${response.usage.completion_tokens}\n`;
        result += `- Total tokens: ${response.usage.total_tokens}\n`;
      }

      return {
        content: [
          {
            type: "text",
            text: result,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `Error calling Gemini: ${error.message || "Unknown error"}`,
          },
        ],
      };
    }
  },
);

server.tool(
  "call-grok",
  "Call xAI's Grok API with a prompt",
  {
    prompt: z.string().describe("The prompt to send to Grok"),
    model: z
      .string()
      .optional()
      .describe("Grok model to use (default: grok-3)"),
    temperature: z
      .number()
      .min(0)
      .max(2)
      .optional()
      .describe("Temperature for response randomness (0-2, default: 0.7)"),
    max_tokens: z
      .number()
      .int()
      .positive()
      .optional()
      .describe("Maximum tokens in response (default: 1000)"),
  },
  async ({ prompt, model, temperature, max_tokens }) => {
    try {
      const response = await llmClients.callGrok({
        prompt,
        model,
        temperature,
        max_tokens,
      });

      if (response.error) {
        return {
          content: [
            {
              type: "text",
              text: `**Grok Error:** ${response.error}`,
            },
          ],
        };
      }

      let result = `**Grok Response**\n`;
      result += `**Model:** ${response.model || "Unknown"}\n\n`;
      result += response.response;

      if (response.usage) {
        result += `\n\n---\n**Usage:**\n`;
        result += `- Prompt tokens: ${response.usage.prompt_tokens}\n`;
        result += `- Completion tokens: ${response.usage.completion_tokens}\n`;
        result += `- Total tokens: ${response.usage.total_tokens}\n`;
      }

      return {
        content: [
          {
            type: "text",
            text: result,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `Error calling Grok: ${error.message || "Unknown error"}`,
          },
        ],
      };
    }
  },
);

// Combined tool that calls all LLMs
server.tool(
  "call-all-llms",
  "Call all available LLM APIs (ChatGPT, Claude, DeepSeek, Gemini, Grok) with the same prompt and get combined responses",
  {
    prompt: z.string().describe("The prompt to send to all LLMs"),
    temperature: z
      .number()
      .min(0)
      .max(2)
      .optional()
      .describe("Temperature for response randomness (0-2, default: 0.7)"),
    max_tokens: z
      .number()
      .int()
      .positive()
      .optional()
      .describe("Maximum tokens in response (default: 1000)"),
  },
  async ({ prompt, temperature, max_tokens }) => {
    try {
      const responses = await llmClients.callAllLLMs({
        prompt,
        temperature,
        max_tokens,
      });

      let result = `**Multi-LLM Response**\n\n`;
      result += `**Prompt:** ${prompt}\n\n`;
      result += `---\n\n`;

      let totalTokens = 0;
      let successfulResponses = 0;

      responses.forEach((response) => {
        result += `## ${response.provider.toUpperCase()}\n\n`;

        if (response.error) {
          result += `**Error:** ${response.error}\n\n`;
        } else {
          result += `**Model:** ${response.model || "Unknown"}\n\n`;
          result += response.response + "\n\n";
          successfulResponses++;

          if (response.usage) {
            totalTokens += response.usage.total_tokens || 0;
          }
        }

        result += `---\n\n`;
      });

      result += `**Summary:**\n`;
      result += `- Successful responses: ${successfulResponses}/${responses.length}\n`;
      if (totalTokens > 0) {
        result += `- Total tokens used: ${totalTokens}\n`;
      }

      return {
        content: [
          {
            type: "text",
            text: result,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `Error calling all LLMs: ${error.message || "Unknown error"}`,
          },
        ],
      };
    }
  },
);

// Tool to call a specific LLM by provider name
server.tool(
  "call-llm",
  "Call a specific LLM provider by name",
  {
    provider: z
      .enum(["chatgpt", "claude", "deepseek", "gemini", "grok"])
      .describe("The LLM provider to call"),
    prompt: z.string().describe("The prompt to send to the LLM"),
    model: z
      .string()
      .optional()
      .describe("Model to use (uses provider default if not specified)"),
    temperature: z
      .number()
      .min(0)
      .max(2)
      .optional()
      .describe("Temperature for response randomness (0-2, default: 0.7)"),
    max_tokens: z
      .number()
      .int()
      .positive()
      .optional()
      .describe("Maximum tokens in response (default: 1000)"),
  },
  async ({ provider, prompt, model, temperature, max_tokens }) => {
    try {
      const response = await llmClients.callLLM(provider as LLMProvider, {
        prompt,
        model,
        temperature,
        max_tokens,
      });

      if (response.error) {
        return {
          content: [
            {
              type: "text",
              text: `**${provider.toUpperCase()} Error:** ${response.error}`,
            },
          ],
        };
      }

      let result = `**${provider.toUpperCase()} Response**\n`;
      result += `**Model:** ${response.model || "Unknown"}\n\n`;
      result += response.response;

      if (response.usage) {
        result += `\n\n---\n**Usage:**\n`;
        result += `- Prompt tokens: ${response.usage.prompt_tokens}\n`;
        result += `- Completion tokens: ${response.usage.completion_tokens}\n`;
        result += `- Total tokens: ${response.usage.total_tokens}\n`;
      }

      return {
        content: [
          {
            type: "text",
            text: result,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `Error calling ${provider}: ${error.message || "Unknown error"}`,
          },
        ],
      };
    }
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Cross-LLM MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
