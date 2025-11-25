export type LLMProvider =
  | "chatgpt"
  | "claude"
  | "deepseek"
  | "gemini"
  | "grok"
  | "kimi"
  | "perplexity"
  | "mistral";

// All available LLM providers in order
export const ALL_LLM_PROVIDERS: readonly LLMProvider[] = [
  "chatgpt",
  "claude",
  "deepseek",
  "gemini",
  "grok",
  "kimi",
  "perplexity",
  "mistral",
] as const;

export type LLMResponse = {
  provider: LLMProvider;
  response: string;
  model?: string;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
  error?: string;
};

export type LLMRequest = {
  prompt: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
};

export type ChatGPTMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type ChatGPTRequest = {
  model: string;
  messages: ChatGPTMessage[];
  temperature?: number;
  max_tokens?: number;
};

export type ChatGPTResponse = {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

export type ClaudeRequest = {
  model: string;
  max_tokens: number;
  messages: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
  temperature?: number;
};

export type ClaudeResponse = {
  id: string;
  type: string;
  role: string;
  content: Array<{
    type: string;
    text: string;
  }>;
  model: string;
  stop_reason: string;
  stop_sequence: string | null;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
};

export type DeepSeekRequest = {
  model: string;
  messages: Array<{
    role: "system" | "user" | "assistant";
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
};

export type DeepSeekResponse = {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

export type GeminiRequest = {
  contents: Array<{
    parts: Array<{
      text: string;
    }>;
  }>;
  generationConfig?: {
    temperature?: number;
    maxOutputTokens?: number;
  };
};

export type GeminiResponse = {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
    finishReason: string;
  }>;
  usageMetadata: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
};

export type GrokRequest = {
  model: string;
  messages: Array<{
    role: "system" | "user" | "assistant";
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
};

export type GrokResponse = {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

export type KimiRequest = {
  model: string;
  messages: Array<{
    role: "system" | "user" | "assistant";
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
};

export type KimiResponse = {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

export type PerplexityRequest = {
  model: string;
  messages: Array<{
    role: "system" | "user" | "assistant";
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
};

export type PerplexityResponse = {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

export type MistralRequest = {
  model: string;
  messages: Array<{
    role: "system" | "user" | "assistant";
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
};

export type MistralResponse = {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

// Model tagging and preferences types
export type ModelTag =
  | "coding"
  | "business"
  | "reasoning"
  | "math"
  | "creative"
  | "general";

export type CostPreference = "flagship" | "cheaper";

export type CostTier = "flagship" | "standard" | "budget";

export type ModelInfo = {
  name: string;
  provider: LLMProvider;
  tags: ModelTag[];
  costTier: CostTier;
  description?: string;
};

export type UserPreferences = {
  defaultModel?: string;
  costPreference?: CostPreference;
  tagPreferences?: {
    [tag in ModelTag]?: string; // Model name for this tag
  };
};
