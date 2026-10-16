# Model Context Protocol (MCP) Integration

## Purpose

Model Context Protocol (MCP) is a standard that lets AI clients discover and use capabilities exposed by external context servers, such as tools, resources, and prompts. In this project, MCP is an optional development-assistant integration; it is not part of the recipe application's runtime architecture.

## Current status

There is no project-configured MCP server in this repository. The recipe generator must continue to use its local recipe dataset and deterministic frontend matching logic. Its Express API is limited to account-related data; do not introduce an external recipe API or make the application depend on an MCP service.

## Adding a development integration

1. Identify the specific development task that needs MCP and the minimum tools or context required.
2. Select a trusted server and review its implementation, permissions, network access, and data handling.
3. Configure it in VS Code's `.vscode/mcp.json` or the appropriate user-level configuration. Keep credentials in an approved secret store or local environment, never in tracked files.
4. Document the server's purpose, exposed capabilities, required permissions, and any setup steps before sharing the configuration.
5. Verify that the application still builds and works without the MCP server; recipe data and matching must remain local.
6. Reassess access when the task is complete and remove integrations or permissions that are no longer needed.

Do not approve an MCP tool call that would expose secrets, upload private project data to an untrusted service, or exceed the task's intended scope.
