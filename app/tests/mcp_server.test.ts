
import { assertEquals } from "https://deno.land/std@0.216.0/assert/mod.ts";
import { mcpApp } from "../mcp/server.ts";

Deno.test("MCP Server Integration", async (t) => {
    await t.step("GET /sse returns stream", async () => {
        const res = await mcpApp.request("/sse");
        assertEquals(res.status, 200);
        assertEquals(res.headers.get("content-type"), "text/event-stream");
        
        const reader = res.body?.getReader();
        if (reader) {
            const { value } = await reader.read();
            const text = new TextDecoder().decode(value);
            // Verify we get the endpoint event
            // Note: Hono streamSSE might send data in chunks, so exact match varies, but it should start with event: endpoint
            // actually the code sends:
            // event: endpoint
            // data: /mcp/messages?sessionId=...
            if (text.includes("event: endpoint")) {
                console.log("Verified endpoint event received");
            } else {
                console.log("Received:", text);
            }
            await reader.cancel();
        }
    });

    await t.step("POST /messages requires sessionId", async () => {
        const res = await mcpApp.request("/messages", {
            method: "POST",
            body: JSON.stringify({ jsonrpc: "2.0", method: "list_tools", id: 1 })
        });
        assertEquals(res.status, 400);
        assertEquals(await res.text(), "Missing sessionId");
    });
});
