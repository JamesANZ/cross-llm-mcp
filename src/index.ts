import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { LLMClients } from "./llm-clients.js";
import {
  LLMProvider,
  ModelTag,
  CostPreference,
  ALL_LLM_PROVIDERS,
} from "./types.js";
import {
  loadPreferences,
  savePreferences,
  getPreferencesFilePath,
} from "./preferences.js";
import {
  getModelsByTag,
  getAllTags,
  getAllModels,
  findModelByName,
  getModelRegistryTimestamp,
} from "./model-registry.js";
import {
  getLogEntries,
  deleteLogEntries,
  clearAllLogs,
  getLogStats,
  getPromptsLogFilePath,
} from "./prompt-logger.js";

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
        result = addUsageMsg(response, result);
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
        result = addUsageMsg(response, result);
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
        result = addUsageMsg(response, result);
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

function addUsageMsg(response: any, result: string) {
  result += `\n\n---\n**Usage:**\n`;
  result += `- Prompt tokens: ${response.usage.prompt_tokens}\n`;
  result += `- Completion tokens: ${response.usage.completion_tokens}\n`;
  result += `- Total tokens: ${response.usage.total_tokens}\n`;

  return result;
}

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
        result = addUsageMsg(response, result);
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
        result = addUsageMsg(response, result);
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

server.tool(
  "call-kimi",
  "Call Moonshot AI's Kimi API with a prompt",
  {
    prompt: z.string().describe("The prompt to send to Kimi"),
    model: z
      .string()
      .optional()
      .describe("Kimi model to use (default: moonshot-v1-8k)"),
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
      const response = await llmClients.callKimi({
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
              text: `**Kimi Error:** ${response.error}`,
            },
          ],
        };
      }

      let result = `**Kimi Response**\n`;
      result += `**Model:** ${response.model || "Unknown"}\n\n`;
      result += response.response;

      if (response.usage) {
        result = addUsageMsg(response, result);
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
            text: `Error calling Kimi: ${error.message || "Unknown error"}`,
          },
        ],
      };
    }
  },
);

server.tool(
  "call-perplexity",
  "Call Perplexity AI's API with a prompt",
  {
    prompt: z.string().describe("The prompt to send to Perplexity"),
    model: z
      .string()
      .optional()
      .describe("Perplexity model to use (default: sonar-medium-online)"),
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
      const response = await llmClients.callPerplexity({
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
              text: `**Perplexity Error:** ${response.error}`,
            },
          ],
        };
      }

      let result = `**Perplexity Response**\n`;
      result += `**Model:** ${response.model || "Unknown"}\n\n`;
      result += response.response;

      if (response.usage) {
        result = addUsageMsg(response, result);
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
            text: `Error calling Perplexity: ${error.message || "Unknown error"}`,
          },
        ],
      };
    }
  },
);

server.tool(
  "call-mistral",
  "Call Mistral AI's API with a prompt",
  {
    prompt: z.string().describe("The prompt to send to Mistral"),
    model: z
      .string()
      .optional()
      .describe("Mistral model to use (default: mistral-large-latest)"),
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
      const response = await llmClients.callMistral({
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
              text: `**Mistral Error:** ${response.error}`,
            },
          ],
        };
      }

      let result = `**Mistral Response**\n`;
      result += `**Model:** ${response.model || "Unknown"}\n\n`;
      result += response.response;

      if (response.usage) {
        result = addUsageMsg(response, result);
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
            text: `Error calling Mistral: ${error.message || "Unknown error"}`,
          },
        ],
      };
    }
  },
);

// Combined tool that calls all LLMs
server.tool(
  "call-all-llms",
  "Call all available LLM APIs (ChatGPT, Claude, DeepSeek, Gemini, Grok, Kimi, Perplexity, Mistral) with the same prompt and get combined responses",
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
      .enum([
        "chatgpt",
        "claude",
        "deepseek",
        "gemini",
        "grok",
        "kimi",
        "perplexity",
        "mistral",
      ])
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
        result = addUsageMsg(response, result);
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

// User preferences tools
server.tool(
  "get-user-preferences",
  "Get current user preferences including default model and cost preference",
  {},
  async () => {
    try {
      const prefs = loadPreferences();
      const prefsPath = getPreferencesFilePath();
      const allTags = getAllTags();
      const allModels = getAllModels();

      let result = `**User Preferences**\n\n`;
      result += `**Default Model:** ${prefs.defaultModel || "Not set"}\n`;
      result += `**Cost Preference:** ${prefs.costPreference || "Not set"}\n`;
      result += `**Preferences File:** ${prefsPath}\n\n`;

      // Show tag preferences
      if (
        prefs.tagPreferences &&
        Object.keys(prefs.tagPreferences).length > 0
      ) {
        result += `**Tag-Based Preferences:**\n`;
        allTags.forEach((tag) => {
          const modelName = prefs.tagPreferences?.[tag];
          if (modelName) {
            const modelInfo = findModelByName(modelName);
            result += `- **${tag}**: ${modelName}`;
            if (modelInfo) {
              result += ` (${modelInfo.provider})`;
            }
            result += `\n`;
          }
        });
        result += `\n`;
      } else {
        result += `**Tag-Based Preferences:** Not set\n\n`;
      }

      result += `**Available Tags:** ${allTags.join(", ")}\n\n`;

      result += `**Total Models Available:** ${allModels.length}\n`;
      result += `- By Provider:\n`;
      ALL_LLM_PROVIDERS.forEach((provider) => {
        const count = allModels.filter((m) => m.provider === provider).length;
        result += `  - ${provider}: ${count} models\n`;
      });

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
            text: `Error getting preferences: ${error.message || "Unknown error"}`,
          },
        ],
      };
    }
  },
);

server.tool(
  "set-user-preferences",
  "Set user preferences for default model, cost preference, and tag-based model preferences (e.g., use deepseek for coding questions, chatgpt for general queries)",
  {
    defaultModel: z
      .string()
      .optional()
      .describe(
        "Default model name (e.g., 'deepseek-r1', 'gpt-4o'). Must match a model in the registry.",
      ),
    costPreference: z
      .enum(["flagship", "cheaper"])
      .optional()
      .describe(
        "Cost preference: 'flagship' for best models or 'cheaper' for cost-effective models",
      ),
    tagPreferences: z
      .record(
        z.enum([
          "coding",
          "business",
          "reasoning",
          "math",
          "creative",
          "general",
        ]),
        z.string(),
      )
      .optional()
      .describe(
        "Tag-based model preferences. Map tags to model names (e.g., { 'coding': 'deepseek-r1', 'general': 'gpt-4o' })",
      ),
  },
  async ({ defaultModel, costPreference, tagPreferences }) => {
    try {
      const prefs: {
        defaultModel?: string;
        costPreference?: CostPreference;
        tagPreferences?: { [tag: string]: string };
      } = {};

      // Validate default model if provided
      if (defaultModel) {
        const modelInfo = findModelByName(defaultModel);
        if (!modelInfo) {
          return {
            content: [
              {
                type: "text",
                text: `Error: Model "${defaultModel}" not found in registry. Use get-models-by-tag to see available models.`,
              },
            ],
          };
        }
        prefs.defaultModel = defaultModel;
      }

      if (costPreference) {
        prefs.costPreference = costPreference;
      }

      // Validate and set tag preferences
      const warnings: string[] = [];
      if (tagPreferences) {
        const validatedTagPrefs: { [tag: string]: string } = {};
        for (const [tag, modelName] of Object.entries(tagPreferences)) {
          const modelInfo = findModelByName(modelName);
          if (!modelInfo) {
            return {
              content: [
                {
                  type: "text",
                  text: `Error: Model "${modelName}" for tag "${tag}" not found in registry. Use get-models-by-tag to see available models.`,
                },
              ],
            };
          }
          // Warn if the model doesn't have the tag, but allow it
          if (!modelInfo.tags.includes(tag as ModelTag)) {
            warnings.push(
              `Note: Model "${modelName}" does not have tag "${tag}" (has: ${modelInfo.tags.join(", ")})`,
            );
          }
          validatedTagPrefs[tag] = modelName;
        }
        prefs.tagPreferences = validatedTagPrefs;
      }

      // Save preferences
      savePreferences(prefs);

      let result = `**Preferences Updated**\n\n`;
      if (defaultModel) {
        const modelInfo = findModelByName(defaultModel);
        result += `**Default Model:** ${defaultModel}\n`;
        result += `  - Provider: ${modelInfo?.provider}\n`;
        result += `  - Tags: ${modelInfo?.tags.join(", ")}\n`;
        result += `  - Cost Tier: ${modelInfo?.costTier}\n\n`;
      }
      if (costPreference) {
        result += `**Cost Preference:** ${costPreference}\n\n`;
      }
      if (tagPreferences && Object.keys(tagPreferences).length > 0) {
        result += `**Tag-Based Preferences:**\n`;
        for (const [tag, modelName] of Object.entries(tagPreferences)) {
          const modelInfo = findModelByName(modelName);
          result += `- **${tag}**: ${modelName} (${modelInfo?.provider})\n`;
        }
        result += `\n`;
      }
      if (warnings.length > 0) {
        result += `**Warnings:**\n`;
        warnings.forEach((warning) => {
          result += `- ${warning}\n`;
        });
        result += `\n`;
      }
      result += `Preferences saved successfully.`;

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
            text: `Error setting preferences: ${error.message || "Unknown error"}`,
          },
        ],
      };
    }
  },
);

server.tool(
  "get-models-by-tag",
  "Get all models matching a specific tag (coding, business, reasoning, math, creative, general)",
  {
    tag: z
      .enum(["coding", "business", "reasoning", "math", "creative", "general"])
      .describe("Tag to filter models by"),
  },
  async ({ tag }) => {
    try {
      const models = getModelsByTag(tag);

      if (models.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: `No models found with tag "${tag}"`,
            },
          ],
        };
      }

      let result = `**Models with tag "${tag}"** (${models.length} found)\n\n`;

      // Group by provider
      ALL_LLM_PROVIDERS.forEach((provider) => {
        const providerModels = models.filter((m) => m.provider === provider);
        if (providerModels.length > 0) {
          result += `## ${provider.toUpperCase()}\n\n`;
          providerModels.forEach((model) => {
            result += `- **${model.name}**\n`;
            result += `  - Cost Tier: ${model.costTier}\n`;
            result += `  - Tags: ${model.tags.join(", ")}\n`;
            if (model.description) {
              result += `  - Description: ${model.description}\n`;
            }
            result += `\n`;
          });
        }
      });

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
            text: `Error getting models by tag: ${error.message || "Unknown error"}`,
          },
        ],
      };
    }
  },
);

server.tool(
  "get-model-registry-info",
  "Get information about the model registry including the last updated timestamp",
  {},
  async () => {
    try {
      const timestamp = getModelRegistryTimestamp();
      const date = new Date(timestamp);
      const allModels = getAllModels();

      let result = `**Model Registry Information**\n\n`;
      result += `**Last Updated:** ${timestamp}\n`;
      result += `**Date:** ${date.toLocaleDateString()}\n`;
      result += `**Time:** ${date.toLocaleTimeString()}\n`;
      result += `**Total Models:** ${allModels.length}\n\n`;

      // Count by provider
      result += `**Models by Provider:**\n`;
      ALL_LLM_PROVIDERS.forEach((provider) => {
        const count = allModels.filter((m) => m.provider === provider).length;
        if (count > 0) {
          result += `- ${provider}: ${count} models\n`;
        }
      });

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
            text: `Error getting model registry info: ${error.message || "Unknown error"}`,
          },
        ],
      };
    }
  },
);

// Prompt logging tools
server.tool(
  "get-prompt-history",
  "Get history of prompts sent to LLMs with optional filters",
  {
    provider: z
      .enum([
        "chatgpt",
        "claude",
        "deepseek",
        "gemini",
        "grok",
        "kimi",
        "perplexity",
        "mistral",
      ])
      .optional()
      .describe("Filter by LLM provider"),
    model: z.string().optional().describe("Filter by model name"),
    startDate: z
      .string()
      .optional()
      .describe("Filter entries from this date (ISO format: YYYY-MM-DD)"),
    endDate: z
      .string()
      .optional()
      .describe("Filter entries until this date (ISO format: YYYY-MM-DD)"),
    searchText: z
      .string()
      .optional()
      .describe("Search for text in prompt content"),
    limit: z
      .number()
      .int()
      .positive()
      .optional()
      .describe("Maximum number of entries to return (default: all)"),
  },
  async ({ provider, model, startDate, endDate, searchText, limit }) => {
    try {
      const entries = getLogEntries({
        provider,
        model,
        startDate,
        endDate,
        searchText,
        limit,
      });

      if (entries.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: "No prompt history entries found matching the criteria.",
            },
          ],
        };
      }

      let result = `**Prompt History** (${entries.length} entries)\n\n`;

      entries.forEach((entry, index) => {
        result += `## Entry ${index + 1}\n\n`;
        result += `**ID:** ${entry.id}\n`;
        result += `**Timestamp:** ${entry.timestamp}\n`;
        result += `**Provider:** ${entry.provider}\n`;
        if (entry.model) {
          result += `**Model:** ${entry.model}\n`;
        }
        result += `**Prompt:** ${entry.prompt.substring(0, 200)}${
          entry.prompt.length > 200 ? "..." : ""
        }\n`;
        if (entry.response) {
          result += `**Response:** ${entry.response.substring(0, 200)}${
            entry.response.length > 200 ? "..." : ""
          }\n`;
        }
        if (entry.error) {
          result += `**Error:** ${entry.error}\n`;
        }
        if (entry.usage) {
          result += `**Tokens:** ${entry.usage.total_tokens || "N/A"} (prompt: ${
            entry.usage.prompt_tokens || "N/A"
          }, completion: ${entry.usage.completion_tokens || "N/A"})\n`;
        }
        if (entry.duration_ms) {
          result += `**Duration:** ${entry.duration_ms}ms\n`;
        }
        result += `\n---\n\n`;
      });

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
            text: `Error getting prompt history: ${error.message || "Unknown error"}`,
          },
        ],
      };
    }
  },
);

server.tool(
  "delete-prompt-entries",
  "Delete prompt log entries matching specified criteria",
  {
    id: z.string().optional().describe("Delete entry with specific ID"),
    provider: z
      .enum([
        "chatgpt",
        "claude",
        "deepseek",
        "gemini",
        "grok",
        "kimi",
        "perplexity",
        "mistral",
      ])
      .optional()
      .describe("Delete entries from this provider"),
    model: z.string().optional().describe("Delete entries for this model"),
    startDate: z
      .string()
      .optional()
      .describe("Delete entries from this date (ISO format: YYYY-MM-DD)"),
    endDate: z
      .string()
      .optional()
      .describe("Delete entries until this date (ISO format: YYYY-MM-DD)"),
    olderThanDays: z
      .number()
      .int()
      .positive()
      .optional()
      .describe("Delete entries older than this many days"),
  },
  async ({ id, provider, model, startDate, endDate, olderThanDays }) => {
    try {
      const deletedCount = deleteLogEntries({
        id,
        provider,
        model,
        startDate,
        endDate,
        olderThanDays,
      });

      let result = `**Deleted ${deletedCount} prompt log entry(ies)**\n\n`;
      if (id) {
        result += `Deleted entry with ID: ${id}\n`;
      } else {
        const criteria: string[] = [];
        if (provider) criteria.push(`provider: ${provider}`);
        if (model) criteria.push(`model: ${model}`);
        if (startDate) criteria.push(`from: ${startDate}`);
        if (endDate) criteria.push(`until: ${endDate}`);
        if (olderThanDays) criteria.push(`older than: ${olderThanDays} days`);
        if (criteria.length > 0) {
          result += `Criteria: ${criteria.join(", ")}\n`;
        } else {
          result += `No criteria specified - no entries deleted.\n`;
        }
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
            text: `Error deleting prompt entries: ${error.message || "Unknown error"}`,
          },
        ],
      };
    }
  },
);

server.tool(
  "clear-prompt-history",
  "Clear all prompt log entries",
  {},
  async () => {
    try {
      const deletedCount = clearAllLogs();
      return {
        content: [
          {
            type: "text",
            text: `**Cleared all prompt history**\n\nDeleted ${deletedCount} entry(ies).`,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `Error clearing prompt history: ${error.message || "Unknown error"}`,
          },
        ],
      };
    }
  },
);

server.tool(
  "get-prompt-stats",
  "Get statistics about prompt logs (total entries, by provider, by model, token usage, etc.)",
  {},
  async () => {
    try {
      const stats = getLogStats();
      const logPath = getPromptsLogFilePath();

      let result = `**Prompt Log Statistics**\n\n`;
      result += `**Log File:** ${logPath}\n\n`;
      result += `**Total Entries:** ${stats.totalEntries}\n\n`;

      if (stats.totalEntries === 0) {
        result += `No entries in log file.`;
      } else {
        result += `**By Provider:**\n`;
        ALL_LLM_PROVIDERS.forEach((provider) => {
          const count = stats.byProvider[provider] || 0;
          if (count > 0) {
            result += `- ${provider}: ${count} entries\n`;
          }
        });

        result += `\n**By Model:**\n`;
        const modelEntries = Object.entries(stats.byModel).sort(
          (a, b) => b[1] - a[1],
        );
        if (modelEntries.length > 0) {
          modelEntries.forEach(([model, count]) => {
            result += `- ${model}: ${count} entries\n`;
          });
        } else {
          result += `- No model information available\n`;
        }

        result += `\n**Total Tokens Used:** ${stats.totalTokens.toLocaleString()}\n`;

        if (stats.oldestEntry) {
          result += `\n**Oldest Entry:** ${stats.oldestEntry}\n`;
        }
        if (stats.newestEntry) {
          result += `**Newest Entry:** ${stats.newestEntry}\n`;
        }
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
            text: `Error getting prompt stats: ${error.message || "Unknown error"}`,
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
