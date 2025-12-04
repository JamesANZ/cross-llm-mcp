#!/usr/bin/env node

/**
 * Generate a Cursor MCP install deeplink for cross-llm-mcp
 * 
 * Usage: node scripts/generate-cursor-install-link.js
 */

const config = {
  "cross-llm-mcp": {
    "command": "npx",
    "args": ["-y", "cross-llm-mcp"]
  }
};

// Convert to JSON string and Base64 encode
const configString = JSON.stringify(config);
const base64Config = Buffer.from(configString).toString('base64');

// Create the deeplink
const deeplink = `cursor://anysphere.cursor-deeplink/mcp/install?name=cross-llm-mcp&config=${base64Config}`;

console.log('\n🔗 Cursor MCP Install Link:\n');
console.log(deeplink);
console.log('\n📋 Configuration:\n');
console.log(JSON.stringify(config, null, 2));
console.log('\n💡 Note: You will need to add your API keys manually in Cursor settings after installation.\n');
console.log('   Required environment variables:');
console.log('   - OPENAI_API_KEY');
console.log('   - ANTHROPIC_API_KEY');
console.log('   - DEEPSEEK_API_KEY');
console.log('   - GEMINI_API_KEY');
console.log('   - XAI_API_KEY (optional)');
console.log('   - KIMI_API_KEY (optional)');
console.log('   - PERPLEXITY_API_KEY (optional)');
console.log('   - MISTRAL_API_KEY (optional)\n');

