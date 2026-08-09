# Java MCP Debugger

<!-- Shipped with the VSIX and shown on the marketplace. Clone, build, code map: see DEVELOPMENT.md in this repo. -->

**Java MCP Debugger** is a VS Code extension that exposes Java debugging as [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) tools so coding agents can work with **live runtime state**, not only static sources and traces.

Today's agents often investigate bugs through static analysis: source, logs, and stack dumps. That helps, but inference about execution flow is fragile because the model cannot reliably see what actually happened at runtime: real variable values, object mutations, thread interactions, branching paths, or framework/runtime internals. Complex issues still push developers back to the debugger to step execution, inspect state, verify hypotheses and then return to the agent with findings.

This extension closes that loop. It lets an agent drive an ordinary Java debug session (the same adapters and workflows you already use in the editor):

- attach to a JVM over JDWP  
- set and manage breakpoints  
- continue, pause, step in/out/over  
- read stack traces and variables  
- evaluate expressions in the paused context  

Implementation-wise, it reuses VS Code debugger APIs together with the Java debug adapter not a reinvented JVM debugger so capability stays aligned with the ecosystem you rely on today.

---

## Prerequisites

- **Java debugging in the editor**: e.g. *Debugger for Java* or *Extension Pack for Java*  
- **Target process**: JVM started with JDWP enabled (often `5005`; use any free port)  
- **Agent / chat** with MCP enabled and pointed at this extension’s HTTP MCP endpoint  

---

## Connect MCP

The extension listens for MCP **Streamable HTTP** at **`/mcp`** on port **`18990`** by default (`mcpJavaDebugger.port`). Some builds auto-register the server; otherwise add config in your workspace.

### Cursor

Create or edit `.cursor/mcp.json` at the workspace root:

```json
{
  "mcpServers": {
    "java-debugger": {
      "url": "http://127.0.0.1:18990/mcp"
    }
  }
}
```

Reload the window and confirm the **java-debugger** server appears in your MCP list.

### VS Code

If your build supports MCP via workspace JSON, create `.vscode/mcp.json`:

```json
{
  "servers": {
    "java-debugger": {
      "type": "http",
      "url": "http://127.0.0.1:18990/mcp"
    }
  }
}
```

Other VS Code MCP layouts may vary; wherever HTTP servers are declared, point them at **`http://127.0.0.1:18990/mcp`** (or your customized port).

Check the Output channel **“Java MCP Debugger”** for confirmation that the server is listening.

---

## Using it with your agent

1. Start your app with JDWP (see your build’s docs or JDK `-agentlib:jdwp=...`).  
2. Open the workspace that contains your Java sources.  
3. In Agent mode, ask the agent to debug your application in order to fix any issue and it will attach a debugger to your host/port, set breakpoints, and drive execution in order to investigate it and find the fix.

---

## Author

**Mazen Aissa**

For questions, bug reports, or anything else related to this extension:

- **Email:** [mazen.aissa@outlook.com](mailto:mazen.aissa@outlook.com)
- **LinkedIn:** [linkedin.com/in/mazen-aissa](https://www.linkedin.com/in/mazen-aissa)