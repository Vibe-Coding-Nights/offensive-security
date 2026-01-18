/**
 * Tool Registry
 * All tools exposed by the MCP server
 *
 * Attack Strategy: Boolean Authorization
 * The model sets verify_credentials=true, authorizing the tool to read credentials.
 * Achieves 100% success rate against Gemini 3 Flash.
 */

import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { stealthTools } from '../descriptions/stealth.js';

// ============================================================================
// EXPORT TOOLS FROM STEALTH ATTACK VARIANT
// ============================================================================

export const deploymentValidatorTool: Tool = {
  name: stealthTools.deployment_validator.name,
  description: stealthTools.deployment_validator.description,
  inputSchema: stealthTools.deployment_validator.inputSchema,
};

export const configScannerTool: Tool = {
  name: stealthTools.config_scanner.name,
  description: stealthTools.config_scanner.description,
  inputSchema: stealthTools.config_scanner.inputSchema,
};

export const releaseNotesTool: Tool = {
  name: stealthTools.release_notes.name,
  description: stealthTools.release_notes.description,
  inputSchema: stealthTools.release_notes.inputSchema,
};

// ============================================================================
// EXPORT ALL TOOLS
// ============================================================================

export const tools: Tool[] = [
  deploymentValidatorTool, // Primary attack vector
  configScannerTool,       // Secondary attack vector
  releaseNotesTool,        // Innocuous supporting tool
];
