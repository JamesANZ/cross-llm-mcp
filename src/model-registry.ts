import {
  LLMProvider,
  ModelInfo,
  ModelTag,
  CostPreference,
  CostTier,
} from "./types.js";

// Model registry last updated timestamp
export const MODEL_REGISTRY_TIMESTAMP = new Date().toISOString();

// Comprehensive model registry with tags and metadata
export const MODEL_REGISTRY: ModelInfo[] = [
  // DeepSeek models
  {
    name: "deepseek-r1",
    provider: "deepseek",
    tags: ["coding", "reasoning", "math"],
    costTier: "flagship",
    description:
      "Flagship reasoning model, excels at coding, mathematics, and complex reasoning",
  },
  {
    name: "deepseek-r1-distill-qwen-1.5b",
    provider: "deepseek",
    tags: ["coding", "math"],
    costTier: "budget",
    description: "Lightweight distilled version for efficient coding tasks",
  },
  {
    name: "deepseek-r1-distill-qwen-7b",
    provider: "deepseek",
    tags: ["coding", "math"],
    costTier: "standard",
    description: "Balanced performance for coding and math tasks",
  },
  {
    name: "deepseek-r1-distill-qwen-14b",
    provider: "deepseek",
    tags: ["coding", "math", "reasoning"],
    costTier: "standard",
    description: "Enhanced reasoning and coding capabilities",
  },
  {
    name: "deepseek-r1-distill-qwen-32b",
    provider: "deepseek",
    tags: ["coding", "math", "reasoning"],
    costTier: "flagship",
    description:
      "High-performance distilled model for advanced coding and reasoning",
  },
  {
    name: "deepseek-r1-distill-llama-8b",
    provider: "deepseek",
    tags: ["coding", "business"],
    costTier: "standard",
    description: "Balanced model for coding and business applications",
  },
  {
    name: "deepseek-r1-distill-llama-70b",
    provider: "deepseek",
    tags: ["coding", "reasoning", "business"],
    costTier: "flagship",
    description:
      "Large distilled model for extensive coding and reasoning tasks",
  },
  {
    name: "deepseek-chat",
    provider: "deepseek",
    tags: ["general", "coding"],
    costTier: "standard",
    description: "General-purpose chat model with coding capabilities",
  },
  {
    name: "deepseek-coder",
    provider: "deepseek",
    tags: ["coding"],
    costTier: "standard",
    description: "Specialized coding model",
  },

  // OpenAI/ChatGPT models
  {
    name: "gpt-4o",
    provider: "chatgpt",
    tags: ["coding", "business", "creative", "reasoning"],
    costTier: "flagship",
    description: "Latest flagship model with multimodal capabilities",
  },
  {
    name: "gpt-4o-mini",
    provider: "chatgpt",
    tags: ["general", "coding"],
    costTier: "budget",
    description: "Cost-effective general-purpose model",
  },
  {
    name: "gpt-4-turbo",
    provider: "chatgpt",
    tags: ["coding", "business", "creative"],
    costTier: "flagship",
    description: "High-performance model for complex tasks",
  },
  {
    name: "gpt-4",
    provider: "chatgpt",
    tags: ["coding", "business", "creative", "reasoning"],
    costTier: "flagship",
    description: "Flagship GPT-4 model",
  },
  {
    name: "gpt-3.5-turbo",
    provider: "chatgpt",
    tags: ["general", "coding"],
    costTier: "budget",
    description: "Fast and cost-effective general-purpose model",
  },
  {
    name: "o1-preview",
    provider: "chatgpt",
    tags: ["reasoning", "math", "coding"],
    costTier: "flagship",
    description: "Advanced reasoning model for complex problem-solving",
  },
  {
    name: "o1-mini",
    provider: "chatgpt",
    tags: ["reasoning", "math"],
    costTier: "standard",
    description: "Efficient reasoning model",
  },

  // Anthropic/Claude models
  {
    name: "claude-3.5-sonnet-20241022",
    provider: "claude",
    tags: ["coding", "business", "reasoning", "creative"],
    costTier: "flagship",
    description: "Latest Claude model with enhanced capabilities",
  },
  {
    name: "claude-3-opus-20240229",
    provider: "claude",
    tags: ["business", "creative", "reasoning"],
    costTier: "flagship",
    description: "Most capable Claude model for complex tasks",
  },
  {
    name: "claude-3-sonnet-20240229",
    provider: "claude",
    tags: ["business", "coding", "general"],
    costTier: "standard",
    description: "Balanced performance model",
  },
  {
    name: "claude-3-haiku-20240307",
    provider: "claude",
    tags: ["general"],
    costTier: "budget",
    description: "Fast and cost-effective model",
  },

  // Google Gemini models
  {
    name: "gemini-2.0-flash-exp",
    provider: "gemini",
    tags: ["general", "creative"],
    costTier: "standard",
    description: "Experimental fast model",
  },
  {
    name: "gemini-1.5-pro",
    provider: "gemini",
    tags: ["business", "creative", "reasoning"],
    costTier: "flagship",
    description: "High-performance model for complex tasks",
  },
  {
    name: "gemini-1.5-flash",
    provider: "gemini",
    tags: ["general", "coding"],
    costTier: "budget",
    description: "Fast and efficient general-purpose model",
  },
  {
    name: "gemini-2.5-flash",
    provider: "gemini",
    tags: ["general", "coding"],
    costTier: "standard",
    description: "Latest fast model with improved capabilities",
  },
  {
    name: "gemini-pro",
    provider: "gemini",
    tags: ["general", "business"],
    costTier: "standard",
    description: "General-purpose model",
  },

  // Mistral models
  {
    name: "mistral-large-latest",
    provider: "mistral",
    tags: ["business", "coding", "reasoning"],
    costTier: "flagship",
    description: "Flagship Mistral model",
  },
  {
    name: "mistral-medium-latest",
    provider: "mistral",
    tags: ["business", "general"],
    costTier: "standard",
    description: "Balanced performance model",
  },
  {
    name: "mistral-small-latest",
    provider: "mistral",
    tags: ["general"],
    costTier: "budget",
    description: "Cost-effective model",
  },
  {
    name: "pixtral-large-latest",
    provider: "mistral",
    tags: ["creative", "general"],
    costTier: "flagship",
    description: "Multimodal model for creative tasks",
  },

  // Perplexity models
  {
    name: "sonar-pro",
    provider: "perplexity",
    tags: ["business", "reasoning"],
    costTier: "flagship",
    description: "Premium model with web search capabilities",
  },
  {
    name: "sonar-medium-online",
    provider: "perplexity",
    tags: ["general", "business"],
    costTier: "standard",
    description: "Balanced model with web search",
  },
  {
    name: "sonar-small-online",
    provider: "perplexity",
    tags: ["general"],
    costTier: "budget",
    description: "Cost-effective model with web search",
  },

  // xAI/Grok models
  {
    name: "grok-beta",
    provider: "grok",
    tags: ["general", "creative"],
    costTier: "standard",
    description: "Beta model with real-time information",
  },
  {
    name: "grok-2",
    provider: "grok",
    tags: ["general", "creative"],
    costTier: "standard",
    description: "Latest Grok model",
  },
  {
    name: "grok-3",
    provider: "grok",
    tags: ["general", "creative"],
    costTier: "flagship",
    description: "Flagship Grok model",
  },

  // Moonshot AI/Kimi models
  {
    name: "moonshot-v1-8k",
    provider: "kimi",
    tags: ["general", "coding"],
    costTier: "budget",
    description: "Cost-effective model with 8k context",
  },
  {
    name: "moonshot-v1-32k",
    provider: "kimi",
    tags: ["general", "coding", "business"],
    costTier: "standard",
    description: "Model with 32k context window",
  },
  {
    name: "moonshot-v1-128k",
    provider: "kimi",
    tags: ["general", "coding", "business"],
    costTier: "flagship",
    description: "Large context window model for extensive tasks",
  },
];

// Helper functions
export function getModelsByTag(tag: ModelTag): ModelInfo[] {
  return MODEL_REGISTRY.filter((model) => model.tags.includes(tag));
}

export function getModelInfo(
  provider: LLMProvider,
  modelName: string,
): ModelInfo | undefined {
  return MODEL_REGISTRY.find(
    (model) => model.provider === provider && model.name === modelName,
  );
}

export function getModelsByProvider(provider: LLMProvider): ModelInfo[] {
  return MODEL_REGISTRY.filter((model) => model.provider === provider);
}

export function findModelByName(modelName: string): ModelInfo | undefined {
  return MODEL_REGISTRY.find((model) => model.name === modelName);
}

export function selectModelByPreference(
  provider: LLMProvider,
  tag?: ModelTag,
  costPreference?: CostPreference,
): string | undefined {
  let candidates = getModelsByProvider(provider);

  // Filter by tag if provided
  if (tag) {
    candidates = candidates.filter((model) => model.tags.includes(tag));
  }

  if (candidates.length === 0) {
    return undefined;
  }

  // If only one candidate, return it
  if (candidates.length === 1) {
    return candidates[0].name;
  }

  // Apply cost preference
  if (costPreference === "flagship") {
    // Prefer flagship, then standard, then budget
    const flagship = candidates.filter((m) => m.costTier === "flagship");
    if (flagship.length > 0) {
      candidates = flagship;
    } else {
      const standard = candidates.filter((m) => m.costTier === "standard");
      if (standard.length > 0) {
        candidates = standard;
      }
    }
  } else if (costPreference === "cheaper") {
    // Prefer budget, then standard, then flagship
    const budget = candidates.filter((m) => m.costTier === "budget");
    if (budget.length > 0) {
      candidates = budget;
    } else {
      const standard = candidates.filter((m) => m.costTier === "standard");
      if (standard.length > 0) {
        candidates = standard;
      }
    }
  }

  // If multiple candidates remain, pick randomly (or first one)
  // Per plan: "let the LLM client decide, otherwise just pick a random one of the best match"
  const randomIndex = Math.floor(Math.random() * candidates.length);
  return candidates[randomIndex].name;
}

export function getAllTags(): ModelTag[] {
  return ["coding", "business", "reasoning", "math", "creative", "general"];
}

export function getAllModels(): ModelInfo[] {
  return MODEL_REGISTRY;
}

// Get the model registry timestamp
export function getModelRegistryTimestamp(): string {
  return MODEL_REGISTRY_TIMESTAMP;
}
