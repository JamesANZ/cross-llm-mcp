# Cross-LLM

Sends a prompt to one LLM provider through the buyer's own API keys. Calling every provider is a separate, explicit request.

## Connect

```json
{
  "mcpServers": {
    "cross-llm-mcp": {
      "command": "npx",
      "args": ["-y", "cross-llm-mcp"],
      "env": {
        "OPENAI_API_KEY": "",
        "ANTHROPIC_API_KEY": "",
        "DEEPSEEK_API_KEY": "",
        "GEMINI_API_KEY": "",
        "XAI_API_KEY": "",
        "KIMI_API_KEY": "",
        "PERPLEXITY_API_KEY": "",
        "MISTRAL_API_KEY": "",
        "HF_TOKEN": ""
      }
    }
  }
}
```

Set only the providers the buyer wants. `HUGGINGFACE_API_KEY` is an alias for `HF_TOKEN`. A missing key makes that provider's tool return an error.

## Package this listing

```bash
cd agensi-skills
zip -r cross-llm.zip cross-llm -x "*.DS_Store"
```

Upload `cross-llm.zip` in the Agensi creator dashboard. This repository does not submit the listing.
