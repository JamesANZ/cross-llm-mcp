# 🤖 Cross-LLM MCP Server

> **Access multiple LLM APIs from one place.** Call ChatGPT, Claude, DeepSeek, Gemini, Grok, Kimi, Perplexity, and Mistral with intelligent model selection, preferences, and prompt logging.

An [MCP (Model Context Protocol)](https://modelcontextprotocol.io) server that provides unified access to multiple Large Language Model APIs for AI coding environments like Cursor and Claude Desktop.

[![Trust Score](https://archestra.ai/mcp-catalog/api/badge/quality/JamesANZ/cross-llm-mcp)](https://archestra.ai/mcp-catalog/jamesanz__cross-llm-mcp)

## Why Use Cross-LLM MCP?

- 🌐 **8 LLM Providers** – ChatGPT, Claude, DeepSeek, Gemini, Grok, Kimi, Perplexity, Mistral
- 🎯 **Smart Model Selection** – Tag-based preferences (coding, business, reasoning, math, creative, general)
- 📊 **Prompt Logging** – Track all prompts with history, statistics, and analytics
- 💰 **Cost Optimization** – Choose flagship or cheaper models based on preference
- ⚡ **Easy Setup** – One-click install in Cursor or simple manual setup
- 🔄 **Call All LLMs** – Get responses from all providers simultaneously

## Quick Start

Ready to access multiple LLMs? Install in seconds:

**Install in Cursor (Recommended):**

[🔗 Install in Cursor](cursor://anysphere.cursor-deeplink/mcp/install?name=cross-llm-mcp&config=eyJjcm9zcy1sbG0tbWNwIjp7ImNvbW1hbmQiOiJucHgiLCJhcmdzIjpbIi15IiwiY3Jvc3MtbGxtLW1jcCJdfX0=)

**Or install manually:**

```bash
npm install -g cross-llm-mcp
# Or from source:
git clone https://github.com/JamesANZ/cross-llm-mcp.git
cd cross-llm-mcp && npm install && npm run build
```

## Features

### 🤖 Individual LLM Tools

- **`call-chatgpt`** – OpenAI's ChatGPT API
- **`call-claude`** – Anthropic's Claude API
- **`call-deepseek`** – DeepSeek API
- **`call-gemini`** – Google's Gemini API
- **`call-grok`** – xAI's Grok API
- **`call-kimi`** – Moonshot AI's Kimi API
- **`call-perplexity`** – Perplexity AI API
- **`call-mistral`** – Mistral AI API

### 🔄 Combined Tools

- **`call-all-llms`** – Call all LLMs with the same prompt
- **`call-llm`** – Call a specific provider by name

### ⚙️ Preferences & Model Selection

- **`get-user-preferences`** – Get current preferences
- **`set-user-preferences`** – Set default model, cost preference, and tag-based preferences
- **`get-models-by-tag`** – Find models by tag (coding, business, reasoning, math, creative, general)

### 📝 Prompt Logging

- **`get-prompt-history`** – View prompt history with filters
- **`get-prompt-stats`** – Get statistics about prompt logs
- **`delete-prompt-entries`** – Delete log entries by criteria
- **`clear-prompt-history`** – Clear all prompt logs

## Installation

### Cursor (One-Click)

Click the install link above or use:

```
cursor://anysphere.cursor-deeplink/mcp/install?name=cross-llm-mcp&config=eyJjcm9zcy1sbG0tbWNwIjp7ImNvbW1hbmQiOiJucHgiLCJhcmdzIjpbIi15IiwiY3Jvc3MtbGxtLW1jcCJdfX0=
```

After installation, add your API keys in Cursor settings (see Configuration below).

### Manual Installation

**Requirements:** Node.js 18+ and npm

```bash
# Clone and build
git clone https://github.com/JamesANZ/cross-llm-mcp.git
cd cross-llm-mcp
npm install
npm run build
```

### Claude Desktop

Add to `claude_desktop_config.json`:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "cross-llm-mcp": {
      "command": "node",
      "args": ["/absolute/path/to/cross-llm-mcp/build/index.js"],
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
}
```

Restart Claude Desktop after configuration.

## Configuration

### API Keys

Set environment variables for the LLM providers you want to use:

```bash
export OPENAI_API_KEY="your_openai_api_key"
export ANTHROPIC_API_KEY="your_anthropic_api_key"
export DEEPSEEK_API_KEY="your_deepseek_api_key"
export GEMINI_API_KEY="your_gemini_api_key"
export XAI_API_KEY="your_grok_api_key"
export KIMI_API_KEY="your_kimi_api_key"
export PERPLEXITY_API_KEY="your_perplexity_api_key"
export MISTRAL_API_KEY="your_mistral_api_key"
```

### Getting API Keys

- **OpenAI**: [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- **Anthropic**: [https://console.anthropic.com/](https://console.anthropic.com/)
- **DeepSeek**: [https://platform.deepseek.com/](https://platform.deepseek.com/)
- **Google Gemini**: [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
- **xAI Grok**: [https://console.x.ai/](https://console.x.ai/)
- **Moonshot AI**: [https://platform.moonshot.ai/](https://platform.moonshot.ai/)
- **Perplexity**: [https://www.perplexity.ai/hub](https://www.perplexity.ai/hub)
- **Mistral**: [https://console.mistral.ai/](https://console.mistral.ai/)

## Usage Examples

### Call ChatGPT

Get a response from OpenAI:

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

### Call All LLMs

Get responses from all providers:

```json
{
  "tool": "call-all-llms",
  "arguments": {
    "prompt": "Write a short poem about AI",
    "temperature": 0.8
  }
}
```

### Set Tag-Based Preferences

Automatically use the best model for each task type:

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

### Get Prompt History

View your prompt logs:

```json
{
  "tool": "get-prompt-history",
  "arguments": {
    "provider": "chatgpt",
    "limit": 10
  }
}
```

## Model Tags

Models are tagged by their strengths:

- **coding**: `deepseek-r1`, `deepseek-coder`, `gpt-4o`, `claude-3.5-sonnet-20241022`
- **business**: `claude-3-opus-20240229`, `gpt-4o`, `gemini-1.5-pro`
- **reasoning**: `deepseek-r1`, `o1-preview`, `claude-3.5-sonnet-20241022`
- **math**: `deepseek-r1`, `o1-preview`, `o1-mini`
- **creative**: `gpt-4o`, `claude-3-opus-20240229`, `gemini-1.5-pro`
- **general**: `gpt-4o-mini`, `claude-3-haiku-20240307`, `gemini-1.5-flash`

## Use Cases

- **Multi-Perspective Analysis** – Get different perspectives from multiple LLMs
- **Model Comparison** – Compare responses to understand strengths and weaknesses
- **Cost Optimization** – Choose the most cost-effective model for each task
- **Quality Assurance** – Cross-reference responses from multiple models
- **Intelligent Selection** – Automatically use the best model for coding, business, reasoning, etc.
- **Prompt Analytics** – Track usage, costs, and patterns with automatic logging

## Technical Details

**Built with:** Node.js, TypeScript, MCP SDK  
**Dependencies:** `@modelcontextprotocol/sdk`, `superagent`, `zod`  
**Platforms:** macOS, Windows, Linux

**Preference Storage:**

- Unix/macOS: `~/.cross-llm-mcp/preferences.json`
- Windows: `%APPDATA%/cross-llm-mcp/preferences.json`

**Prompt Log Storage:**

- Unix/macOS: `~/.cross-llm-mcp/prompts.json`
- Windows: `%APPDATA%/cross-llm-mcp/prompts.json`

## Contributing

⭐ **If this project helps you, please star it on GitHub!** ⭐

Contributions welcome! Please open an issue or submit a pull request.

## License

MIT License – see [LICENSE.md](LICENSE.md) for details.

## Support

If you find this project useful, consider supporting it:

**⚡ Lightning Network**

```
lnbc1pjhhsqepp5mjgwnvg0z53shm22hfe9us289lnaqkwv8rn2s0rtekg5vvj56xnqdqqcqzzsxqyz5vqsp5gu6vh9hyp94c7t3tkpqrp2r059t4vrw7ps78a4n0a2u52678c7yq9qyyssq7zcferywka50wcy75skjfrdrk930cuyx24rg55cwfuzxs49rc9c53mpz6zug5y2544pt8y9jflnq0ltlha26ed846jh0y7n4gm8jd3qqaautqa
```

**₿ Bitcoin**: [bc1ptzvr93pn959xq4et6sqzpfnkk2args22ewv5u2th4ps7hshfaqrshe0xtp](https://mempool.space/address/bc1ptzvr93pn959xq4et6sqzpfnkk2args22ewv5u2th4ps7hshfaqrshe0xtp)

**Ξ Ethereum/EVM**: [0x42ea529282DDE0AA87B42d9E83316eb23FE62c3f](https://etherscan.io/address/0x42ea529282DDE0AA87B42d9E83316eb23FE62c3f)
