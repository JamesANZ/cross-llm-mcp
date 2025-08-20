# Cross-LLM MCP Server Usage Examples

This document provides examples of how to use the Cross-LLM MCP Server with different MCP clients.

## Configuration

### 1. Set up your environment file

Copy the example environment file and add your API keys:

```bash
cp env.example .env
```

Edit `.env` with your actual API keys:

```env
# OpenAI/ChatGPT API Key
OPENAI_API_KEY=sk-your-openai-key-here

# Anthropic/Claude API Key
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key-here

# DeepSeek API Key
DEEPSEEK_API_KEY=sk-your-deepseek-key-here

# Default models (optional)
DEFAULT_CHATGPT_MODEL=gpt-4
DEFAULT_CLAUDE_MODEL=claude-3-sonnet-20240229
DEFAULT_DEEPSEEK_MODEL=deepseek-chat
```

### 2. Build the server

```bash
npm run build
```

## Usage with Different MCP Clients

### Claude Desktop

1. Open Claude Desktop
2. Go to Settings → Model Context Protocol
3. Add a new server with these settings:
   - **Name**: Cross-LLM
   - **Command**: `node`
   - **Arguments**: `[path-to-your-project]/build/index.js`
   - **Working Directory**: `[path-to-your-project]`

### Example Conversations

#### Single LLM Call

**User**: "Call ChatGPT to explain quantum computing"

**Claude**: I'll use the Cross-LLM MCP server to call ChatGPT for you.

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

#### Multi-LLM Comparison

**User**: "Get responses from all LLMs about the future of AI"

**Claude**: I'll call all available LLMs to get different perspectives.

```json
{
  "tool": "call-all-llms",
  "arguments": {
    "prompt": "What do you think the future of artificial intelligence will look like in the next 10 years?",
    "temperature": 0.8,
    "max_tokens": 800
  }
}
```

#### Specific Model Selection

**User**: "Ask Claude to write a poem about technology"

**Claude**: I'll call the Claude API specifically for this request.

```json
{
  "tool": "call-claude",
  "arguments": {
    "prompt": "Write a short poem about the impact of technology on modern life",
    "model": "claude-3-sonnet-20240229",
    "temperature": 0.9,
    "max_tokens": 300
  }
}
```

## Advanced Usage

### Custom Model Selection

You can specify different models for each provider:

```json
{
  "tool": "call-llm",
  "arguments": {
    "provider": "chatgpt",
    "prompt": "Explain machine learning algorithms",
    "model": "gpt-4-turbo",
    "temperature": 0.5,
    "max_tokens": 1000
  }
}
```

### Temperature Control

Adjust creativity vs consistency:

- **Low temperature (0.1-0.3)**: More focused, consistent responses
- **Medium temperature (0.4-0.7)**: Balanced creativity and consistency
- **High temperature (0.8-1.0)**: More creative, varied responses

### Token Management

Control response length:

- **Short responses**: 100-300 tokens
- **Medium responses**: 500-800 tokens
- **Long responses**: 1000+ tokens

## Error Handling

The server provides clear error messages for common issues:

### Missing API Key

```
**ChatGPT Error:** OpenAI API key not configured
```

### Network Issues

```
**Claude Error:** Claude API error: Network timeout
```

### Rate Limiting

```
**DeepSeek Error:** DeepSeek API error: Rate limit exceeded
```

## Best Practices

1. **Start with individual calls** to test each LLM before using `call-all-llms`
2. **Use appropriate temperature** for your use case
3. **Monitor token usage** to manage costs
4. **Handle errors gracefully** - one LLM failure shouldn't stop your workflow
5. **Compare responses** to understand different model strengths

## Troubleshooting

### Server won't start

- Check that all dependencies are installed: `npm install`
- Verify the build was successful: `npm run build`
- Ensure the `.env` file exists and has valid API keys

### API errors

- Verify your API keys are correct and active
- Check your API usage limits and billing status
- Ensure you're using supported model names

### No responses

- Check that at least one API key is configured
- Verify network connectivity
- Look for error messages in the response

## Integration Examples

### With Claude Desktop

The server integrates seamlessly with Claude Desktop, allowing you to:

- Call other LLMs while chatting with Claude
- Compare responses from different models
- Use specialized models for specific tasks

### With Other MCP Clients

Any MCP-compatible client can use this server to:

- Access multiple LLM providers
- Get diverse perspectives on topics
- Build more robust AI applications
