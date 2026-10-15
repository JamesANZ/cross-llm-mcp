# One provider

User: Ask Claude whether this function should return early.

1. `call-claude` with their prompt. Do not call `call-all-llms`.
2. If the tool returns a missing `ANTHROPIC_API_KEY` error, stop and tell them to set that env var on the MCP server.
3. Otherwise return Claude's text and the model name the tool reported.
