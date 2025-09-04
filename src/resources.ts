/**
 * Resource handlers for Google Docs MCP Server
 * Handles document listing and retrieval resources
 */

import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ApiClients } from "./types.js";

/**
 * Register resource handlers with the MCP server
 */
export function registerResources(server: McpServer, clients: ApiClients): void {
  const { docsClient, driveClient } = clients;

  // Resource for listing documents
  server.resource(
    "list-docs",
    "googledocs://list",
    async (uri) => {
      try {
        const response = await driveClient.files.list({
          q: "mimeType='application/vnd.google-apps.document'",
          fields: "files(id, name, createdTime, modifiedTime)",
          pageSize: 50,
          supportsAllDrives: true,
          includeItemsFromAllDrives: true,
          corpora: 'allDrives',
        });

        const files = response.data.files || [];
        let content = "Google Docs in your Drive:\n\n";
        
        if (files.length === 0) {
          content += "No Google Docs found.";
        } else {
          files.forEach((file: any) => {
            content += `Title: ${file.name}\n`;
            content += `ID: ${file.id}\n`;
            content += `Created: ${file.createdTime}\n`;
            content += `Last Modified: ${file.modifiedTime}\n\n`;
          });
        }

        return {
          contents: [{
            uri: uri.href,
            text: content,
          }]
        };
      } catch (error) {
        console.error("Error listing documents:", error);
        return {
          contents: [{
            uri: uri.href,
            text: `Error listing documents: ${error}`,
          }]
        };
      }
    }
  );

  // Resource to get a specific document by ID
  server.resource(
    "get-doc",
    new ResourceTemplate("googledocs://{docId}", { list: undefined }),
    async (uri, { docId }) => {
      try {
        const doc = await docsClient.documents.get({
          documentId: docId as string,
        });
        
        // Extract the document content
        let content = `Document: ${doc.data.title}\n\n`;
        
        // Process the document content from the complex data structure
        const document = doc.data;
        if (document && document.body && document.body.content) {
          let textContent = "";
          
          // Loop through the document's structural elements
          document.body.content.forEach((element: any) => {
            if (element.paragraph) {
              element.paragraph.elements.forEach((paragraphElement: any) => {
                if (paragraphElement.textRun && paragraphElement.textRun.content) {
                  textContent += paragraphElement.textRun.content;
                }
              });
            }
          });
          
          content += textContent;
        }

        return {
          contents: [{
            uri: uri.href,
            text: content,
          }]
        };
      } catch (error) {
        console.error(`Error getting document ${docId}:`, error);
        return {
          contents: [{
            uri: uri.href,
            text: `Error getting document ${docId}: ${error}`,
          }]
        };
      }
    }
  );
}
