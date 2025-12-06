# Cross-LLM MCP Server

[![Trust Score](https://archestra.ai/mcp-catalog/api/badge/quality/JamesANZ/cross-llm-mcp)](https://archestra.ai/mcp-catalog/jamesanz__cross-llm-mcp)

A Model Context Protocol (MCP) server that provides access to multiple Large Language Model (LLM) APIs including ChatGPT, Claude, DeepSeek, Gemini, Grok, Kimi, Perplexity, and Mistral. This allows you to call different LLMs from within any MCP-compatible client and combine their responses.

## Features

This MCP server offers:

- **Eight specialized tools** for interacting with different LLM providers
- **User preference system** with tag-based model selection
- **Model tagging** to identify models by their strengths (coding, business, reasoning, etc.)
- **Cost preference settings** to favor flagship or cheaper models
- **Prompt logging system** to track all prompts and responses with history, statistics, and deletion

### 🤖 Individual LLM Tools

#### `call-chatgpt`

Call OpenAI's ChatGPT API with a prompt.

**Input:**

- `prompt` (string): The prompt to send to ChatGPT
- `model` (optional, string): ChatGPT model to use (default: gpt-4)
- `temperature` (optional, number): Temperature for response randomness (0-2, default: 0.7)
- `max_tokens` (optional, number): Maximum tokens in response (default: 1000)

**Output:**

- ChatGPT response with model information and token usage statistics

**Example:**

```
ChatGPT Response
Model: gpt-4

Here's a comprehensive explanation of quantum computing...

---
Usage:
- Prompt tokens: 15
- Completion tokens: 245
- Total tokens: 260
```

#### `call-claude`

Call Anthropic's Claude API with a prompt.

**Input:**

- `prompt` (string): The prompt to send to Claude
- `model` (optional, string): Claude model to use (default: claude-3-sonnet-20240229)
- `temperature` (optional, number): Temperature for response randomness (0-1, default: 0.7)
- `max_tokens` (optional, number): Maximum tokens in response (default: 1000)

**Output:**

- Claude response with model information and token usage statistics

#### `call-deepseek`

Call DeepSeek API with a prompt.

**Input:**

- `prompt` (string): The prompt to send to DeepSeek
- `model` (optional, string): DeepSeek model to use (default: deepseek-chat)
- `temperature` (optional, number): Temperature for response randomness (0-2, default: 0.7)
- `max_tokens` (optional, number): Maximum tokens in response (default: 1000)

**Output:**

- DeepSeek response with model information and token usage statistics

#### `call-gemini`

Call Google's Gemini API with a prompt.

**Input:**

- `prompt` (string): The prompt to send to Gemini
- `model` (optional, string): Gemini model to use (default: gemini-2.5-flash)
- `temperature` (optional, number): Temperature for response randomness (0-2, default: 0.7)
- `max_tokens` (optional, number): Maximum tokens in response (default: 1000)

**Output:**

- Gemini response with model information and token usage statistics

#### `call-grok`

Call xAI's Grok API with a prompt.

**Input:**

- `prompt` (string): The prompt to send to Grok
- `model` (optional, string): Grok model to use (default: grok-3)
- `temperature` (optional, number): Temperature for response randomness (0-2, default: 0.7)
- `max_tokens` (optional, number): Maximum tokens in response (default: 1000)

**Output:**

- Grok response with model information and token usage statistics

#### `call-kimi`

Call Moonshot AI's Kimi API with a prompt.

**Input:**

- `prompt` (string): The prompt to send to Kimi
- `model` (optional, string): Kimi model to use (default: moonshot-v1-8k)
- `temperature` (optional, number): Temperature for response randomness (0-2, default: 0.7)
- `max_tokens` (optional, number): Maximum tokens in response (default: 1000)

**Output:**

- Kimi response with model information and token usage statistics

#### `call-perplexity`

Call Perplexity AI's API with a prompt.

**Input:**

- `prompt` (string): The prompt to send to Perplexity
- `model` (optional, string): Perplexity model to use (default: sonar-pro)
- `temperature` (optional, number): Temperature for response randomness (0-2, default: 0.7)
- `max_tokens` (optional, number): Maximum tokens in response (default: 1000)

**Output:**

- Perplexity response with model information and token usage statistics

#### `call-mistral`

Call Mistral AI's API with a prompt.

**Input:**

- `prompt` (string): The prompt to send to Mistral
- `model` (optional, string): Mistral model to use (default: mistral-large-latest)
- `temperature` (optional, number): Temperature for response randomness (0-2, default: 0.7)
- `max_tokens` (optional, number): Maximum tokens in response (default: 1000)

**Output:**

- Mistral response with model information and token usage statistics

### 🔄 Combined Tools

#### `call-all-llms`

Call all available LLM APIs (ChatGPT, Claude, DeepSeek, Gemini, Grok, Kimi, Perplexity, Mistral) with the same prompt and get combined responses.

**Input:**

- `prompt` (string): The prompt to send to all LLMs
- `temperature` (optional, number): Temperature for response randomness (0-2, default: 0.7)
- `max_tokens` (optional, number): Maximum tokens in response (default: 1000)

**Output:**

- Combined responses from all LLMs with individual model information and usage statistics
- Summary of successful responses and total tokens used

**Example:**

```
Multi-LLM Response

Prompt: Explain quantum computing in simple terms

---

## CHATGPT

Model: gpt-4

Quantum computing is like having a super-powered computer...

---

## CLAUDE

Model: claude-3-sonnet-20240229

Quantum computing represents a fundamental shift...

---

## DEEPSEEK

Model: deepseek-chat

Quantum computing harnesses the principles of quantum mechanics...

---

## GEMINI

Model: gemini-2.5-flash

Quantum computing is a revolutionary approach to computation...

---

Summary:
- Successful responses: 4/4
- Total tokens used: 1650
```

#### `call-llm`

Call a specific LLM provider by name.

**Input:**

- `provider` (string): The LLM provider to call ("chatgpt", "claude", "deepseek", or "gemini")
- `prompt` (string): The prompt to send to the LLM
- `model` (optional, string): Model to use (uses provider default if not specified)
- `temperature` (optional, number): Temperature for response randomness (0-2, default: 0.7)
- `max_tokens` (optional, number): Maximum tokens in response (default: 1000)

**Output:**

- Response from the specified LLM with model information and usage statistics

### ⚙️ User Preferences & Model Tagging

The server includes a comprehensive user preference system that allows you to customize model selection based on question types and tags.

#### `get-user-preferences`

Get your current user preferences including default model, cost preference, and tag-based model preferences.

**Input:**

- No parameters required

**Output:**

- Current preferences including:
  - Default model setting
  - Cost preference (flagship vs cheaper)
  - Tag-based preferences (which model to use for each tag)
  - Available tags and model counts

**Example:**

```json
{
  "tool": "get-user-preferences",
  "arguments": {}
}
```

#### `set-user-preferences`

Set user preferences for default model, cost preference, and tag-based model selection.

**Input:**

- `defaultModel` (optional, string): Default model name (e.g., 'deepseek-r1', 'gpt-4o')
- `costPreference` (optional, "flagship" | "cheaper"): Cost preference setting
- `tagPreferences` (optional, object): Map tags to model names

**Output:**

- Confirmation of updated preferences with model details

**Example - Setting Tag-Based Preferences:**

```json
{
  "tool": "set-user-preferences",
  "arguments": {
    "tagPreferences": {
      "coding": "deepseek-r1",
      "general": "gpt-4o",
      "business": "claude-3.5-sonnet-20241022"
    }
  }
}
```

This allows you to automatically use DeepSeek R1 for coding questions, GPT-4o for general queries, and Claude 3.5 Sonnet for business-related tasks.

#### `get-models-by-tag`

Get all models that match a specific tag to help you choose the best model for your needs.

**Input:**

- `tag` (string): One of: "coding", "business", "reasoning", "math", "creative", "general"

**Output:**

- List of all models with the specified tag, grouped by provider, including:
  - Model name
  - Cost tier (flagship, standard, budget)
  - All tags for the model
  - Description

**Example:**

```json
{
  "tool": "get-models-by-tag",
  "arguments": {
    "tag": "coding"
  }
}
```

### Model Tags

Models are tagged based on their strengths and ideal use cases:

- **coding**: Models optimized for programming, code generation, and software development
  - Examples: `deepseek-r1`, `deepseek-coder`, `gpt-4o`, `claude-3.5-sonnet-20241022`

- **business**: Models suited for business writing, analysis, and professional communication
  - Examples: `claude-3-opus-20240229`, `gpt-4o`, `gemini-1.5-pro`

- **reasoning**: Models with advanced reasoning capabilities for complex problem-solving
  - Examples: `deepseek-r1`, `o1-preview`, `claude-3.5-sonnet-20241022`

- **math**: Models specialized for mathematical problem-solving
  - Examples: `deepseek-r1`, `o1-preview`, `o1-mini`

- **creative**: Models optimized for creative writing, storytelling, and artistic content
  - Examples: `gpt-4o`, `claude-3-opus-20240229`, `gemini-1.5-pro`

- **general**: Versatile models for general-purpose tasks
  - Examples: `gpt-4o-mini`, `claude-3-haiku-20240307`, `gemini-1.5-flash`

### Preference Storage

User preferences are stored in:

- **Unix/macOS**: `~/.cross-llm-mcp/preferences.json`
- **Windows**: `%APPDATA%/cross-llm-mcp/preferences.json`
- **Fallback**: Project directory `.cross-llm-mcp/preferences.json`

Preferences can also be set via environment variables:

- `CROSS_LLM_DEFAULT_MODEL`: Default model name
- `CROSS_LLM_COST_PREFERENCE`: "flagship" or "cheaper"

### 📝 Prompt Logging System

The server automatically logs all prompts sent to LLMs, including successful responses and errors. This allows you to track usage, review past interactions, and analyze token consumption.

#### Automatic Logging

Every LLM call is automatically logged with:
- Timestamp
- Provider and model used
- Prompt text
- Response text (or error message)
- Parameters (temperature, max_tokens)
- Token usage statistics
- Response time (duration in milliseconds)

Logs are stored in:
- **Unix/macOS**: `~/.cross-llm-mcp/prompts.json`
- **Windows**: `%APPDATA%/cross-llm-mcp/prompts.json`
- **Fallback**: Project directory `.cross-llm-mcp/prompts.json`

#### `get-prompt-history`

View your prompt history with optional filters.

**Input:**

- `provider` (optional, string): Filter by LLM provider
- `model` (optional, string): Filter by model name
- `startDate` (optional, string): Filter entries from this date (ISO format: YYYY-MM-DD)
- `endDate` (optional, string): Filter entries until this date (ISO format: YYYY-MM-DD)
- `searchText` (optional, string): Search for text in prompt content
- `limit` (optional, number): Maximum number of entries to return

**Output:**

- List of log entries matching the criteria, sorted by timestamp (newest first)

**Example:**

```json
{
  "tool": "get-prompt-history",
  "arguments": {
    "provider": "chatgpt",
    "limit": 10
  }
}
```

#### `get-prompt-stats`

Get statistics about your prompt logs.

**Input:**

- No parameters required

**Output:**

- Total number of entries
- Count by provider
- Count by model
- Total tokens used
- Date range (oldest and newest entries)
- Log file location

**Example:**

```json
{
  "tool": "get-prompt-stats",
  "arguments": {}
}
```

#### `delete-prompt-entries`

Delete prompt log entries matching specified criteria.

**Input:**

- `id` (optional, string): Delete entry with specific ID
- `provider` (optional, string): Delete entries from this provider
- `model` (optional, string): Delete entries for this model
- `startDate` (optional, string): Delete entries from this date (ISO format: YYYY-MM-DD)
- `endDate` (optional, string): Delete entries until this date (ISO format: YYYY-MM-DD)
- `olderThanDays` (optional, number): Delete entries older than this many days

**Output:**

- Number of entries deleted

**Examples:**

Delete entries older than 30 days:
```json
{
  "tool": "delete-prompt-entries",
  "arguments": {
    "olderThanDays": 30
  }
}
```

Delete all entries from a specific provider:
```json
{
  "tool": "delete-prompt-entries",
  "arguments": {
    "provider": "chatgpt"
  }
}
```

Delete a specific entry by ID:
```json
{
  "tool": "delete-prompt-entries",
  "arguments": {
    "id": "1764982478956-hi6spmg"
  }
}
```

#### `clear-prompt-history`

Clear all prompt log entries.

**Input:**

- No parameters required

**Output:**

- Number of entries cleared

**Example:**

```json
{
  "tool": "clear-prompt-history",
  "arguments": {}
}
```

### Example: Setting Up Tag-Based Preferences

Here's a complete example of setting up preferences for different question types:

```json
{
  "tool": "set-user-preferences",
  "arguments": {
    "defaultModel": "gpt-4o",
    "costPreference": "cheaper",
    "tagPreferences": {
      "coding": "deepseek-r1",
      "general": "gpt-4o",
      "business": "claude-3.5-sonnet-20241022",
      "reasoning": "deepseek-r1",
      "math": "deepseek-r1",
      "creative": "gpt-4o"
    }
  }
}
```

This configuration will:

- Use DeepSeek R1 for coding, reasoning, and math questions
- Use GPT-4o for general and creative queries
- Use Claude 3.5 Sonnet for business-related tasks
- Prefer cheaper models when multiple options are available

## Installation

1. Clone this repository:

```bash
git clone <repository-url>
cd cross-llm-mcp
```

2. Install dependencies:

```bash
npm install
```

3. Build the project:

```bash
npm run build
```

### Installing in Cursor

You can install this MCP server directly in Cursor using the one-click install link:

**🔗 [Install in Cursor](cursor://anysphere.cursor-deeplink/mcp/install?name=cross-llm-mcp&config=eyJjcm9zcy1sbG0tbWNwIjp7ImNvbW1hbmQiOiJucHgiLCJhcmdzIjpbIi15IiwiY3Jvc3MtbGxtLW1jcCJdfX0=)**

```
cursor://anysphere.cursor-deeplink/mcp/install?name=cross-llm-mcp&config=eyJjcm9zcy1sbG0tbWNwIjp7ImNvbW1hbmQiOiJucHgiLCJhcmdzIjpbIi15IiwiY3Jvc3MtbGxtLW1jcCJdfX0=
```

This will automatically configure the MCP server using `npx`. After installation, you'll need to add your API keys in Cursor settings (see below).

**Alternative: Manual Installation**

Or manually add it to your Cursor MCP settings:

1. Open Cursor Settings (⌘, on Mac or Ctrl+, on Windows/Linux)
2. Navigate to **Features** → **Model Context Protocol**
3. Click **Add Server** or **Edit Config**
4. Add the following configuration:

```json
{
  "cross-llm-mcp": {
    "command": "npx",
    "args": ["-y", "cross-llm-mcp"],
    "env": {
      "OPENAI_API_KEY": "your_openai_api_key_here",
      "ANTHROPIC_API_KEY": "your_anthropic_api_key_here",
      "DEEPSEEK_API_KEY": "your_deepseek_api_key_here",
      "GEMINI_API_KEY": "your_gemini_api_key_here",
      "XAI_API_KEY": "your_grok_api_key_here",
      "KIMI_API_KEY": "your_kimi_api_key_here",
      "PERPLEXITY_API_KEY": "your_perplexity_api_key_here",
      "MISTRAL_API_KEY": "your_mistral_api_key_here"
    }
  }
}
```

**After installation, add your API keys:**

1. In Cursor, go to Settings → Features → Model Context Protocol
2. Find `cross-llm-mcp` in your server list
3. Click to edit and add your API keys in the `env` section:

```json
{
  "env": {
    "OPENAI_API_KEY": "your_openai_api_key_here",
    "ANTHROPIC_API_KEY": "your_anthropic_api_key_here",
    "DEEPSEEK_API_KEY": "your_deepseek_api_key_here",
    "GEMINI_API_KEY": "your_gemini_api_key_here",
    "XAI_API_KEY": "your_grok_api_key_here",
    "KIMI_API_KEY": "your_kimi_api_key_here",
    "PERPLEXITY_API_KEY": "your_perplexity_api_key_here",
    "MISTRAL_API_KEY": "your_mistral_api_key_here"
  }
}
```

**Note:** If you've installed the package globally or locally, you can use:

```json
{
  "cross-llm-mcp": {
    "command": "node",
    "args": ["/path/to/cross-llm-mcp/build/index.js"],
    "cwd": "/path/to/cross-llm-mcp",
    "env": {
      "OPENAI_API_KEY": "your_openai_api_key_here",
      "ANTHROPIC_API_KEY": "your_anthropic_api_key_here",
      "DEEPSEEK_API_KEY": "your_deepseek_api_key_here",
      "GEMINI_API_KEY": "your_gemini_api_key_here",
      "XAI_API_KEY": "your_grok_api_key_here",
      "KIMI_API_KEY": "your_kimi_api_key_here",
      "PERPLEXITY_API_KEY": "your_perplexity_api_key_here",
      "MISTRAL_API_KEY": "your_mistral_api_key_here"
    }
  }
}
```

## Getting API Keys

### OpenAI/ChatGPT

1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign up or log in to your account
3. Create a new API key
4. Add it to your `.env` file as `OPENAI_API_KEY`

### Anthropic/Claude

1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in to your account
3. Create a new API key
4. Add it to your `.env` file as `ANTHROPIC_API_KEY`

### DeepSeek

1. Visit [DeepSeek Platform](https://platform.deepseek.com/)
2. Sign up or log in to your account
3. Create a new API key
4. Add it to your `.env` file as `DEEPSEEK_API_KEY`

### Google Gemini

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign up or log in to your Google account
3. Create a new API key
4. Add it to your Claude Desktop configuration as `GEMINI_API_KEY`

### xAI/Grok

1. Visit [xAI Platform](https://console.x.ai/)
2. Sign up or log in to your account
3. Create a new API key
4. Add it to your Claude Desktop configuration as `XAI_API_KEY`

### Moonshot AI/Kimi

1. Visit [Moonshot AI Platform](https://platform.moonshot.ai/docs/overview)
2. Sign up or log in to your account
3. Create a new API key
4. Add it to your Claude Desktop configuration as `KIMI_API_KEY`

### Perplexity AI

1. Visit the [Perplexity AI Platform](https://www.perplexity.ai/hub)
2. Sign up or log in to your account
3. Generate a new API key from the developer console
4. Add it to your Claude Desktop configuration as `PERPLEXITY_API_KEY`

### Mistral AI

1. Visit the [Mistral AI Console](https://console.mistral.ai/)
2. Sign up or log in to your account
3. Create a new API key
4. Add it to your Claude Desktop configuration as `MISTRAL_API_KEY`

## Usage

### Configuring Claude Desktop

Add the following configuration to your Claude Desktop MCP settings:

```json
{
  "cross-llm-mcp": {
    "command": "node",
    "args": ["/path/to/your/cross-llm-mcp/build/index.js"],
    "cwd": "/path/to/your/cross-llm-mcp",
    "env": {
      "OPENAI_API_KEY": "your_openai_api_key_here",
      "ANTHROPIC_API_KEY": "your_anthropic_api_key_here",
      "DEEPSEEK_API_KEY": "your_deepseek_api_key_here",
      "GEMINI_API_KEY": "your_gemini_api_key_here",
      "XAI_API_KEY": "your_grok_api_key_here",
      "KIMI_API_KEY": "your_kimi_api_key_here",
      "PERPLEXITY_API_KEY": "your_perplexity_api_key_here",
      "MISTRAL_API_KEY": "your_mistral_api_key_here"
    }
  }
}
```

**Replace the paths and API keys with your actual values:**

- Update the `args` path to point to your `build/index.js` file
- Update the `cwd` path to your project directory
- Add your actual API keys to the `env` section

### Running the Server

The server runs automatically when configured in Claude Desktop. You can also run it manually:

```bash
npm start
```

The server runs on stdio and can be connected to any MCP-compatible client.

### Example Queries

Here are some example queries you can make with this MCP server:

#### Call ChatGPT

```json
{
  "tool": "call-chatgpt",
  "arguments": {
    "prompt": "Explain quantum computing in simple terms",
    "temperature": 0.7,
    "max_tokens": 500
  }
}
```

#### Call Claude

```json
{
  "tool": "call-claude",
  "arguments": {
    "prompt": "What are the benefits of renewable energy?",
    "model": "claude-3-sonnet-20240229"
  }
}
```

#### Call All LLMs

```json
{
  "tool": "call-all-llms",
  "arguments": {
    "prompt": "Write a short poem about artificial intelligence",
    "temperature": 0.8
  }
}
```

#### Call Specific LLM

```json
{
  "tool": "call-llm",
  "arguments": {
    "provider": "deepseek",
    "prompt": "Explain machine learning algorithms",
    "max_tokens": 800
  }
}
```

#### Call Gemini

```json
{
  "tool": "call-gemini",
  "arguments": {
    "prompt": "Write a creative story about AI",
    "model": "gemini-2.5-flash",
    "temperature": 0.9
  }
}
```

#### Call Grok

```json
{
  "tool": "call-grok",
  "arguments": {
    "prompt": "Tell me a joke about programming",
    "model": "grok-3",
    "temperature": 0.8
  }
}
```

#### Call Kimi

```json
{
  "tool": "call-kimi",
  "arguments": {
    "prompt": "Summarise the plot of The Matrix in two sentences",
    "model": "moonshot-v1-8k",
    "temperature": 0.7
  }
}
```

#### Call Perplexity

```json
{
  "tool": "call-perplexity",
  "arguments": {
    "prompt": "Summarize the latest AI research highlights in two paragraphs",
    "model": "sonar-medium-online",
    "temperature": 0.6
  }
}
```

#### Call Mistral

```json
{
  "tool": "call-mistral",
  "arguments": {
    "prompt": "Draft a concise product update for stakeholders",
    "model": "mistral-large-latest",
    "temperature": 0.7
  }
}
```

#### Get Prompt History

```json
{
  "tool": "get-prompt-history",
  "arguments": {
    "provider": "chatgpt",
    "limit": 10
  }
}
```

#### Get Prompt Statistics

```json
{
  "tool": "get-prompt-stats",
  "arguments": {}
}
```

#### Delete Old Prompt Entries

```json
{
  "tool": "delete-prompt-entries",
  "arguments": {
    "olderThanDays": 30
  }
}
```

## Use Cases

### 1. **Multi-Perspective Analysis**

Use `call-all-llms` to get different perspectives on the same topic from multiple AI models.

### 2. **Model Comparison**

Compare responses from different LLMs to understand their strengths and weaknesses.

### 3. **Redundancy and Reliability**

If one LLM is unavailable, you can still get responses from other providers.

### 4. **Cost Optimization**

Choose the most cost-effective LLM for your specific use case.

### 5. **Quality Assurance**

Cross-reference responses from multiple models to validate information.

### 6. **Intelligent Model Selection**

Use tag-based preferences to automatically select the best model for each question type. For example, use DeepSeek R1 for coding questions and GPT-4o for general queries.

### 7. **Prompt History & Analytics**

Track all your LLM interactions with automatic logging. Review past prompts, analyze token usage, and manage your log history. Useful for debugging, cost tracking, and understanding usage patterns.

## Configuration

### Claude Desktop Setup

The recommended way to use this MCP server is through Claude Desktop with environment variables configured directly in the MCP settings:

```json
{
  "cross-llm-mcp": {
    "command": "node",
    "args": [
      "/Users/jamessangalli/Documents/projects/cross-llm-mcp/build/index.js"
    ],
    "cwd": "/Users/jamessangalli/Documents/projects/cross-llm-mcp",
    "env": {
      "OPENAI_API_KEY": "sk-proj-your-openai-key-here",
      "ANTHROPIC_API_KEY": "sk-ant-your-anthropic-key-here",
      "DEEPSEEK_API_KEY": "sk-your-deepseek-key-here",
      "GEMINI_API_KEY": "your-gemini-api-key-here"
    }
  }
}
```

### Environment Variables

The server reads the following environment variables:

- `OPENAI_API_KEY`: Your OpenAI API key
- `ANTHROPIC_API_KEY`: Your Anthropic API key
- `DEEPSEEK_API_KEY`: Your DeepSeek API key
- `GEMINI_API_KEY`: Your Google Gemini API key
- `XAI_API_KEY`: Your xAI Grok API key
- `KIMI_API_KEY`: Your Moonshot AI Kimi API key
- `PERPLEXITY_API_KEY`: Your Perplexity AI API key
- `MISTRAL_API_KEY`: Your Mistral AI API key
- `DEFAULT_CHATGPT_MODEL`: Default ChatGPT model (default: gpt-4)
- `DEFAULT_CLAUDE_MODEL`: Default Claude model (default: claude-3-sonnet-20240229)
- `DEFAULT_DEEPSEEK_MODEL`: Default DeepSeek model (default: deepseek-chat)
- `DEFAULT_GEMINI_MODEL`: Default Gemini model (default: gemini-2.5-flash)
- `DEFAULT_GROK_MODEL`: Default Grok model (default: grok-3)
- `DEFAULT_KIMI_MODEL`: Default Kimi model (default: moonshot-v1-8k)
- `DEFAULT_PERPLEXITY_MODEL`: Default Perplexity model (default: sonar-pro)
- `DEFAULT_MISTRAL_MODEL`: Default Mistral model (default: mistral-large-latest)
- `CROSS_LLM_DEFAULT_MODEL`: User's default model preference
- `CROSS_LLM_COST_PREFERENCE`: User's cost preference ("flagship" or "cheaper")

## API Endpoints

This MCP server uses the following API endpoints:

- **OpenAI**: `https://api.openai.com/v1/chat/completions`
- **Anthropic**: `https://api.anthropic.com/v1/messages`
- **DeepSeek**: `https://api.deepseek.com/v1/chat/completions`
- **Google Gemini**: `https://generativelanguage.googleapis.com/v1/models/{model}:generateContent`
- **xAI Grok**: `https://api.x.ai/v1/chat/completions`
- **Moonshot AI Kimi**: `https://api.moonshot.ai/v1/chat/completions`
- **Perplexity AI**: `https://api.perplexity.ai/chat/completions`
- **Mistral AI**: `https://api.mistral.ai/v1/chat/completions`

## Error Handling

The server includes comprehensive error handling with detailed messages:

### Missing API Key

```
**ChatGPT Error:** OpenAI API key not configured
```

### Invalid API Key

```
**Claude Error:** Claude API error: Invalid API key - please check your Anthropic API key
```

### Rate Limiting

```
**DeepSeek Error:** DeepSeek API error: Rate limit exceeded - please try again later
```

### Payment Issues

```
**ChatGPT Error:** ChatGPT API error: Payment required - please check your OpenAI billing
```

### Network Issues

```
**Claude Error:** Claude API error: Network timeout
```

### Supported Models

All models are tagged with their strengths (coding, business, reasoning, math, creative, general). Use the `get-models-by-tag` tool to find models optimized for specific use cases.

#### ChatGPT Models

- `gpt-4`
- `gpt-4-turbo`
- `gpt-3.5-turbo`
- And other OpenAI models

#### Claude Models

- `claude-3-sonnet-20240229`
- `claude-3-opus-20240229`
- `claude-3-haiku-20240307`
- And other Anthropic models

#### DeepSeek Models

- `deepseek-chat`
- `deepseek-coder`
- And other DeepSeek models

#### Gemini Models

- `gemini-2.5-flash` (default)
- `gemini-2.5-pro`
- `gemini-2.0-flash`
- `gemini-2.0-flash-001`
- And other Google Gemini models

#### Grok Models

- `grok-3` (default)
- And other xAI Grok models

#### Kimi Models

- `moonshot-v1-8k` (default)
- `moonshot-v1-32k`
- `moonshot-v1-128k`
- And other Moonshot AI Kimi models

#### Perplexity Models

- `sonar-pro` (default)
- `sonar-small-online`
- `sonar-medium`
- And other Perplexity models

#### Mistral Models

- `mistral-large-latest` (default)
- `mistral-small-latest`
- `mixtral-8x7b-32768`
- And other Mistral models

## Project Structure

```
cross-llm-mcp/
├── src/
│   ├── index.ts          # Main MCP server with all tools
│   ├── types.ts          # TypeScript type definitions
│   ├── llm-clients.ts    # LLM API client implementations
│   ├── model-registry.ts # Model registry with tags and metadata
│   └── preferences.ts    # User preferences management
├── build/                # Compiled JavaScript output
├── env.example           # Environment variables template
├── example-usage.md      # Detailed usage examples
├── package.json          # Project dependencies and scripts
└── README.md            # This file
```

## Dependencies

- `@modelcontextprotocol/sdk` - MCP SDK for server implementation
- `superagent` - HTTP client for API requests
- `zod` - Schema validation for tool parameters

## Development

### Building the Project

```bash
npm run build
```

### Adding New LLM Providers

To add a new LLM provider:

1. Add the provider type to `src/types.ts`
2. Implement the client in `src/llm-clients.ts`
3. Add the tool to `src/index.ts`
4. Update the `callAllLLMs` method to include the new provider

## Troubleshooting

### Common Issues

**Server won't start**

- Check that all dependencies are installed: `npm install`
- Verify the build was successful: `npm run build`
- Ensure the `.env` file exists and has valid API keys

**API errors**

- Verify your API keys are correct and active
- Check your API usage limits and billing status
- Ensure you're using supported model names

**No responses**

- Check that at least one API key is configured
- Verify network connectivity
- Look for error messages in the response

### Debug Mode

For debugging, you can run the server directly:

```bash
node build/index.js
```

## Donate

If you find this project useful, consider supporting it with Bitcoin:

**⚡ Lightning Network**

<img src="https://raw.githubusercontent.com/bitcoinwarrior1/CitySats/main/public/lightning.jpeg" alt="Lightning QR Code" width="120" />

<code>lnbc1pjhhsqepp5mjgwnvg0z53shm22hfe9us289lnaqkwv8rn2s0rtekg5vvj56xnqdqqcqzzsxqyz5vqsp5gu6vh9hyp94c7t3tkpqrp2r059t4vrw7ps78a4n0a2u52678c7yq9qyyssq7zcferywka50wcy75skjfrdrk930cuyx24rg55cwfuzxs49rc9c53mpz6zug5y2544pt8y9jflnq0ltlha26ed846jh0y7n4gm8jd3qqaautqa</code>

**₿ On-Chain**

<img src="https://raw.githubusercontent.com/bitcoinwarrior1/CitySats/main/public/onchain.jpg" alt="Bitcoin Address QR Code" width="120" />

<code>[bc1ptzvr93pn959xq4et6sqzpfnkk2args22ewv5u2th4ps7hshfaqrshe0xtp](https://mempool.space/address/bc1ptzvr93pn959xq4et6sqzpfnkk2args22ewv5u2th4ps7hshfaqrshe0xtp)</code>

**Ξ Ethereum / EVM Networks**

<img src="https://raw.githubusercontent.com/bitcoinwarrior1/CitySats/main/public/ethereum.jpg" alt="Ethereum Address QR Code" width="120" />

<code>[0x42ea529282DDE0AA87B42d9E83316eb23FE62c3f](https://etherscan.io/address/0x42ea529282DDE0AA87B42d9E83316eb23FE62c3f)</code>

_Donations from any EVM-compatible network (Ethereum, Polygon, Arbitrum, Optimism, BSC, Avalanche, etc.) will work perfectly! You can also send tokens like USDT, USDC, DAI, and other ERC-20 tokens to this address._

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you encounter any issues or have questions, please:

1. Check the troubleshooting section above
2. Review the error messages for specific guidance
3. Ensure your API keys are properly configured
4. Verify your network connectivity
