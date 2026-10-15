---
name: cross-llm
description: Calls one named LLM provider through the connected cross-LLM MCP server, using the buyer's API keys. Use when the user asks to send a prompt to ChatGPT, Claude, DeepSeek, Gemini, Grok, Kimi, Perplexity, Mistral, or Hugging Face. Call every provider only when they ask for all of them.
---

# One provider, unless they ask for all

The cross-LLM MCP server must already be connected. If `call-llm` is missing, stop and give the user the install block in README.md. Do not invent a model response.

## Workflow

1. Call the provider the user named: `call-chatgpt`, `call-claude`, `call-deepseek`, `call-gemini`, `call-grok`, `call-kimi`, `call-perplexity`, `call-mistral`, or `call-huggingface`. If they name a provider but not a tool, call `call-llm` with that provider.
2. Call `get-models-by-tag` when they ask which model fits coding, business, reasoning, math, creative, or general. Call `get-user-preferences` before `set-user-preferences`. Change preferences only when they ask.
3. Call `call-all-llms` only when they explicitly ask for every provider. That spends one request per configured key.
4. For a long call, use `submit-llm-request-async`, then `get-async-job-result`. Use `list-async-jobs` and `cancel-async-job` when they ask about jobs.
5. Use `get-prompt-history` and `get-prompt-stats` when they ask what was sent. Call `delete-prompt-entries` or `clear-prompt-history` only when they explicitly ask to delete logs.

## Output

- Provider and model
- The response text
- The tool that produced it
- A missing-key error quoted from the tool, when the buyer has not set that provider

## Boundaries

Keys belong to the buyer. Do not ask them to paste a key into the chat. Do not call a provider they did not name, and do not delete history as a cleanup step.
