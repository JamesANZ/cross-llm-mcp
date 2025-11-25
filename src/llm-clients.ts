import superagent from "superagent";
import {
  LLMProvider,
  LLMRequest,
  LLMResponse,
  ChatGPTRequest,
  ChatGPTResponse,
  ClaudeRequest,
  ClaudeResponse,
  DeepSeekRequest,
  DeepSeekResponse,
  GeminiRequest,
  GeminiResponse,
  GrokRequest,
  GrokResponse,
  KimiRequest,
  KimiResponse,
  PerplexityRequest,
  PerplexityResponse,
  MistralRequest,
  MistralResponse,
  ALL_LLM_PROVIDERS,
} from "./types.js";

export class LLMClients {
  private openaiApiKey: string;
  private anthropicApiKey: string;
  private deepseekApiKey: string;
  private geminiApiKey: string;
  private grokApiKey: string;
  private kimiApiKey: string;
  private perplexityApiKey: string;
  private mistralApiKey: string;

  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY || "";
    this.anthropicApiKey = process.env.ANTHROPIC_API_KEY || "";
    this.deepseekApiKey = process.env.DEEPSEEK_API_KEY || "";
    this.geminiApiKey = process.env.GEMINI_API_KEY || "";
    this.grokApiKey = process.env.XAI_API_KEY || "";
    this.kimiApiKey =
      process.env.KIMI_API_KEY || process.env.MOONSHOT_API_KEY || "";
    this.perplexityApiKey = process.env.PERPLEXITY_API_KEY || "";
    this.mistralApiKey = process.env.MISTRAL_API_KEY || "";
  }

  async callChatGPT(request: LLMRequest): Promise<LLMResponse> {
    if (!this.openaiApiKey) {
      return {
        provider: "chatgpt",
        response: "",
        error: "OpenAI API key not configured",
      };
    }

    try {
      const chatGPTRequest: ChatGPTRequest = {
        model: request.model || process.env.DEFAULT_CHATGPT_MODEL || "gpt-4",
        messages: [
          {
            role: "user",
            content: request.prompt,
          },
        ],
        temperature: request.temperature || 0.7,
        max_tokens: request.max_tokens || 1000,
      };

      const response = await superagent
        .post("https://api.openai.com/v1/chat/completions")
        .set("Authorization", `Bearer ${this.openaiApiKey}`)
        .set("Content-Type", "application/json")
        .send(chatGPTRequest);

      const chatGPTResponse: ChatGPTResponse = response.body;
      const content = chatGPTResponse.choices[0]?.message?.content || "";

      return {
        provider: "chatgpt",
        response: content,
        model: chatGPTResponse.model,
        usage: {
          prompt_tokens: chatGPTResponse.usage.prompt_tokens,
          completion_tokens: chatGPTResponse.usage.completion_tokens,
          total_tokens: chatGPTResponse.usage.total_tokens,
        },
      };
    } catch (error: any) {
      return {
        provider: "chatgpt",
        response: "",
        error: `ChatGPT API error: ${error}`,
      };
    }
  }

  async callClaude(request: LLMRequest): Promise<LLMResponse> {
    if (!this.anthropicApiKey) {
      return {
        provider: "claude",
        response: "",
        error: "Anthropic API key not configured",
      };
    }

    try {
      const claudeRequest: ClaudeRequest = {
        model:
          request.model ||
          process.env.DEFAULT_CLAUDE_MODEL ||
          "claude-3-sonnet-20240229",
        max_tokens: request.max_tokens || 1000,
        messages: [
          {
            role: "user",
            content: request.prompt,
          },
        ],
        temperature: request.temperature || 0.7,
      };

      const response = await superagent
        .post("https://api.anthropic.com/v1/messages")
        .set("x-api-key", this.anthropicApiKey)
        .set("Content-Type", "application/json")
        .set("anthropic-version", "2023-06-01")
        .send(claudeRequest);

      const claudeResponse: ClaudeResponse = response.body;
      const content = claudeResponse.content[0]?.text || "";

      return {
        provider: "claude",
        response: content,
        model: claudeResponse.model,
        usage: {
          prompt_tokens: claudeResponse.usage.input_tokens,
          completion_tokens: claudeResponse.usage.output_tokens,
          total_tokens:
            claudeResponse.usage.input_tokens +
            claudeResponse.usage.output_tokens,
        },
      };
    } catch (error: any) {
      return {
        provider: "claude",
        response: "",
        error: `Claude API error: ${error}`,
      };
    }
  }

  async callDeepSeek(request: LLMRequest): Promise<LLMResponse> {
    if (!this.deepseekApiKey) {
      return {
        provider: "deepseek",
        response: "",
        error: "DeepSeek API key not configured",
      };
    }

    try {
      const deepseekRequest: DeepSeekRequest = {
        model:
          request.model ||
          process.env.DEFAULT_DEEPSEEK_MODEL ||
          "deepseek-chat",
        messages: [
          {
            role: "user",
            content: request.prompt,
          },
        ],
        temperature: request.temperature || 0.7,
        max_tokens: request.max_tokens || 1000,
      };

      const response = await superagent
        .post("https://api.deepseek.com/v1/chat/completions")
        .set("Authorization", `Bearer ${this.deepseekApiKey}`)
        .set("Content-Type", "application/json")
        .send(deepseekRequest);

      const deepseekResponse: DeepSeekResponse = response.body;
      const content = deepseekResponse.choices[0]?.message?.content || "";

      return {
        provider: "deepseek",
        response: content,
        model: deepseekResponse.model,
        usage: {
          prompt_tokens: deepseekResponse.usage.prompt_tokens,
          completion_tokens: deepseekResponse.usage.completion_tokens,
          total_tokens: deepseekResponse.usage.total_tokens,
        },
      };
    } catch (error: any) {
      return {
        provider: "deepseek",
        response: "",
        error: `DeepSeek API error: ${error}`,
      };
    }
  }

  async callGemini(request: LLMRequest): Promise<LLMResponse> {
    if (!this.geminiApiKey) {
      return {
        provider: "gemini",
        response: "",
        error: "Gemini API key not configured",
      };
    }

    try {
      const geminiRequest: GeminiRequest = {
        contents: [
          {
            parts: [
              {
                text: request.prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: request.temperature || 0.7,
          maxOutputTokens: request.max_tokens || 1000,
        },
      };

      const model =
        request.model || process.env.DEFAULT_GEMINI_MODEL || "gemini-2.5-flash";
      const response = await superagent
        .post(
          `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${this.geminiApiKey}`,
        )
        .set("Content-Type", "application/json")
        .send(geminiRequest);

      const geminiResponse: GeminiResponse = response.body;
      const content =
        geminiResponse.candidates?.[0]?.content?.parts?.[0]?.text || "";

      return {
        provider: "gemini",
        response: content,
        model: model,
        usage: {
          prompt_tokens: geminiResponse.usageMetadata?.promptTokenCount || 0,
          completion_tokens:
            geminiResponse.usageMetadata?.candidatesTokenCount || 0,
          total_tokens: geminiResponse.usageMetadata?.totalTokenCount || 0,
        },
      };
    } catch (error: any) {
      return {
        provider: "gemini",
        response: "",
        error: `Gemini API error: ${error}`,
      };
    }
  }

  async callGrok(request: LLMRequest): Promise<LLMResponse> {
    if (!this.grokApiKey) {
      return {
        provider: "grok",
        response: "",
        error: "Grok API key not configured",
      };
    }

    try {
      const grokRequest: GrokRequest = {
        model: request.model || process.env.DEFAULT_GROK_MODEL || "grok-3",
        messages: [
          {
            role: "user",
            content: request.prompt,
          },
        ],
        temperature: request.temperature || 0.7,
        max_tokens: request.max_tokens || 1000,
      };

      const response = await superagent
        .post("https://api.x.ai/v1/chat/completions")
        .set("Authorization", `Bearer ${this.grokApiKey}`)
        .set("Content-Type", "application/json")
        .send(grokRequest);

      const grokResponse: GrokResponse = response.body;
      const content = grokResponse.choices[0]?.message?.content || "";

      return {
        provider: "grok",
        response: content,
        model: grokResponse.model,
        usage: {
          prompt_tokens: grokResponse.usage.prompt_tokens,
          completion_tokens: grokResponse.usage.completion_tokens,
          total_tokens: grokResponse.usage.total_tokens,
        },
      };
    } catch (error: any) {
      return {
        provider: "grok",
        response: "",
        error: `Grok API error: ${error}`,
      };
    }
  }

  async callKimi(request: LLMRequest): Promise<LLMResponse> {
    if (!this.kimiApiKey) {
      return {
        provider: "kimi",
        response: "",
        error: "Kimi API key not configured",
      };
    }

    try {
      const kimiRequest: KimiRequest = {
        model:
          request.model || process.env.DEFAULT_KIMI_MODEL || "moonshot-v1-8k",
        messages: [
          {
            role: "user",
            content: request.prompt,
          },
        ],
        temperature: request.temperature || 0.7,
        max_tokens: request.max_tokens || 1000,
      };

      const kimiBaseUrl =
        process.env.KIMI_API_BASE_URL ||
        process.env.MOONSHOT_API_BASE_URL ||
        "https://api.moonshot.ai/v1";

      const response = await superagent
        .post(`${kimiBaseUrl.replace(/\/$/, "")}/chat/completions`)
        .set("Authorization", `Bearer ${this.kimiApiKey}`)
        .set("Content-Type", "application/json")
        .send(kimiRequest);

      const kimiResponse: KimiResponse = response.body;
      const content = kimiResponse.choices[0]?.message?.content || "";

      return {
        provider: "kimi",
        response: content,
        model: kimiResponse.model,
        usage: {
          prompt_tokens: kimiResponse.usage.prompt_tokens,
          completion_tokens: kimiResponse.usage.completion_tokens,
          total_tokens: kimiResponse.usage.total_tokens,
        },
      };
    } catch (error: any) {
      let errorMessage = "Unknown error";

      if (error.response) {
        const status = error.response.status;
        const body = error.response.body;

        if (status === 401) {
          errorMessage = "Invalid API key - please check your Kimi API key";
        } else if (status === 429) {
          errorMessage = "Rate limit exceeded - please try again later";
        } else if (status === 402) {
          errorMessage = "Payment required - please check your Kimi billing";
        } else if (status === 400) {
          errorMessage = `Bad request: ${body?.error?.message || "Invalid request format"}`;
        } else {
          errorMessage = `HTTP ${status}: ${body?.error?.message || error.message}`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      return {
        provider: "kimi",
        response: "",
        error: `Kimi API error: ${errorMessage}`,
      };
    }
  }

  async callPerplexity(request: LLMRequest): Promise<LLMResponse> {
    if (!this.perplexityApiKey) {
      return {
        provider: "perplexity",
        response: "",
        error: "Perplexity API key not configured",
      };
    }

    try {
      const perplexityRequest: PerplexityRequest = {
        model:
          request.model || process.env.DEFAULT_PERPLEXITY_MODEL || "sonar-pro",
        messages: [
          {
            role: "user",
            content: request.prompt,
          },
        ],
        temperature: request.temperature ?? 0.7,
        max_tokens: request.max_tokens || 1000,
      };

      const response = await superagent
        .post("https://api.perplexity.ai/chat/completions")
        .set("Authorization", `Bearer ${this.perplexityApiKey}`)
        .set("Content-Type", "application/json")
        .send(perplexityRequest);

      const perplexityResponse: PerplexityResponse = response.body;
      const content = perplexityResponse.choices[0]?.message?.content || "";

      return {
        provider: "perplexity",
        response: content,
        model: perplexityResponse.model,
        usage: {
          prompt_tokens: perplexityResponse.usage.prompt_tokens,
          completion_tokens: perplexityResponse.usage.completion_tokens,
          total_tokens: perplexityResponse.usage.total_tokens,
        },
      };
    } catch (error: any) {
      let errorMessage = "Unknown error";

      if (error.response) {
        const status = error.response.status;
        const body = error.response.body;

        if (status === 401) {
          errorMessage =
            "Invalid API key - please check your Perplexity API key";
        } else if (status === 429) {
          errorMessage = "Rate limit exceeded - please try again later";
        } else if (status === 402) {
          errorMessage =
            "Payment required - please check your Perplexity billing";
        } else if (status === 400) {
          errorMessage = `Bad request: ${body?.error?.message || "Invalid request format"}`;
        } else {
          errorMessage = `HTTP ${status}: ${body?.error?.message || error.message}`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      return {
        provider: "perplexity",
        response: "",
        error: `Perplexity API error: ${errorMessage}`,
      };
    }
  }

  async callMistral(request: LLMRequest): Promise<LLMResponse> {
    if (!this.mistralApiKey) {
      return {
        provider: "mistral",
        response: "",
        error: "Mistral API key not configured",
      };
    }

    try {
      const mistralRequest: MistralRequest = {
        model:
          request.model ||
          process.env.DEFAULT_MISTRAL_MODEL ||
          "mistral-large-latest",
        messages: [
          {
            role: "user",
            content: request.prompt,
          },
        ],
        temperature: request.temperature ?? 0.7,
        max_tokens: request.max_tokens || 1000,
      };

      const response = await superagent
        .post("https://api.mistral.ai/v1/chat/completions")
        .set("Authorization", `Bearer ${this.mistralApiKey}`)
        .set("Content-Type", "application/json")
        .send(mistralRequest);

      const mistralResponse: MistralResponse = response.body;
      const content = mistralResponse.choices[0]?.message?.content || "";

      return {
        provider: "mistral",
        response: content,
        model: mistralResponse.model,
        usage: {
          prompt_tokens: mistralResponse.usage.prompt_tokens,
          completion_tokens: mistralResponse.usage.completion_tokens,
          total_tokens: mistralResponse.usage.total_tokens,
        },
      };
    } catch (error: any) {
      let errorMessage = "Unknown error";

      if (error.response) {
        const status = error.response.status;
        const body = error.response.body;

        if (status === 401) {
          errorMessage = "Invalid API key - please check your Mistral API key";
        } else if (status === 429) {
          errorMessage = "Rate limit exceeded - please try again later";
        } else if (status === 402) {
          errorMessage = "Payment required - please check your Mistral billing";
        } else if (status === 400) {
          errorMessage = `Bad request: ${body?.error?.message || "Invalid request format"}`;
        } else {
          errorMessage = `HTTP ${status}: ${body?.error?.message || error.message}`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      return {
        provider: "mistral",
        response: "",
        error: `Mistral API error: ${errorMessage}`,
      };
    }
  }

  async callLLM(
    provider: LLMProvider,
    request: LLMRequest,
  ): Promise<LLMResponse> {
    switch (provider) {
      case "chatgpt":
        return this.callChatGPT(request);
      case "claude":
        return this.callClaude(request);
      case "deepseek":
        return this.callDeepSeek(request);
      case "gemini":
        return this.callGemini(request);
      case "grok":
        return this.callGrok(request);
      case "kimi":
        return this.callKimi(request);
      case "perplexity":
        return this.callPerplexity(request);
      case "mistral":
        return this.callMistral(request);
      default:
        return {
          provider,
          response: "",
          error: `Unsupported provider: ${provider}`,
        };
    }
  }

  async callAllLLMs(request: LLMRequest): Promise<LLMResponse[]> {
    const promises = ALL_LLM_PROVIDERS.map((provider) =>
      this.callLLM(provider, request),
    );
    return Promise.all(promises);
  }
}
