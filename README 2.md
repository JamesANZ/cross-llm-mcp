# Cross-LLM MCP Server
[![Trust Score](https://archestra.ai/mcp-catalog/api/badge/quality/JamesANZ/cross-llm-mcp)](https://archestra.ai/mcp-catalog/jamesanz__cross-llm-mcp)

A Model Context Protocol (MCP) server that provides access to multiple Large Language Model (LLM) APIs including ChatGPT, Claude, and DeepSeek. This allows you to call different LLMs from within any MCP-compatible client and combine their responses.

## Features

This MCP server offers five specialized tools for interacting with different LLM providers:

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

### 🔄 Combined Tools

#### `call-all-llms`

Call all available LLM APIs (ChatGPT, Claude, DeepSeek) with the same prompt and get combined responses.

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

Summary:
- Successful responses: 3/3
- Total tokens used: 1250
```

#### `call-llm`

Call a specific LLM provider by name.

**Input:**

- `provider` (string): The LLM provider to call ("chatgpt", "claude", or "deepseek")
- `prompt` (string): The prompt to send to the LLM
- `model` (optional, string): Model to use (uses provider default if not specified)
- `temperature` (optional, number): Temperature for response randomness (0-2, default: 0.7)
- `max_tokens` (optional, number): Maximum tokens in response (default: 1000)

**Output:**

- Response from the specified LLM with model information and usage statistics

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

3. Set up environment variables:

```bash
cp env.example .env
```

4. Edit the `.env` file with your API keys:

```env
# OpenAI/ChatGPT API Key
OPENAI_API_KEY=your_openai_api_key_here

# Anthropic/Claude API Key
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# DeepSeek API Key
DEEPSEEK_API_KEY=your_deepseek_api_key_here

# Default models for each provider
DEFAULT_CHATGPT_MODEL=gpt-4
DEFAULT_CLAUDE_MODEL=claude-3-sonnet-20240229
DEFAULT_DEEPSEEK_MODEL=deepseek-chat
```

5. Build the project:

```bash
npm run build
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

## Usage

### Running the Server

Start the MCP server:

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

## API Endpoints

This MCP server uses the following API endpoints:

- **OpenAI**: `https://api.openai.com/v1/chat/completions`
- **Anthropic**: `https://api.anthropic.com/v1/messages`
- **DeepSeek**: `https://api.deepseek.com/v1/chat/completions`

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

## Configuration

### Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key
- `ANTHROPIC_API_KEY`: Your Anthropic API key
- `DEEPSEEK_API_KEY`: Your DeepSeek API key
- `DEFAULT_CHATGPT_MODEL`: Default ChatGPT model (default: gpt-4)
- `DEFAULT_CLAUDE_MODEL`: Default Claude model (default: claude-3-sonnet-20240229)
- `DEFAULT_DEEPSEEK_MODEL`: Default DeepSeek model (default: deepseek-chat)

### Supported Models

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

## Project Structure

```
cross-llm-mcp/
├── src/
│   ├── index.ts          # Main MCP server with all 5 tools
│   ├── types.ts          # TypeScript type definitions
│   └── llm-clients.ts    # LLM API client implementations
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
- `dotenv` - Environment variable management

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
