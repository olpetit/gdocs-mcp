/**
 * Tools index - exports all tool registration functions
 * Centralized module for registering all Google Docs MCP tools
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ApiClients } from "../types.js";

// Import all tool registration functions
import { registerBasicTools } from "./basic-tools.js";
import { registerFormattingTools } from "./formatting-tools.js";
import { registerContentTools } from "./content-tools.js";

/**
 * Register all tools with the MCP server
 * This function should be called during server initialization
 */
export function registerAllTools(server: McpServer, clients: ApiClients): void {
  console.error("Registering all Google Docs MCP tools...");
  
  // Register basic document manipulation tools
  registerBasicTools(server, clients);
  console.error("✓ Basic tools registered");
  
  // Register formatting tools
  registerFormattingTools(server, clients);
  console.error("✓ Formatting tools registered");
  
  
  // Register content manipulation tools
  registerContentTools(server, clients);
  console.error("✓ Content tools registered");
  
  console.error("All tools registered successfully!");
}

// Export individual tool registration functions for selective registration
export {
  registerBasicTools,
  registerFormattingTools,
  registerContentTools,
};
