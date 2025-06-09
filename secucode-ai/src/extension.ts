import * as vscode from "vscode";
import { analyzeCode } from "./test/apiClient.test"; // Fixed import path

export function activate(context: vscode.ExtensionContext) {
  console.log('Extension "SecuCode-AI" is now active!');

  let statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left
  );
  context.subscriptions.push(statusBarItem);

  let disposable = vscode.commands.registerCommand(
    "secucode-ai.analyzeCode",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("Open a file first to analyze");
        return;
      }

      const code = editor.document.getText();
      if (!code.trim()) {
        vscode.window.showErrorMessage("The file is empty");
        return;
      }

      const lines = code.split(/\r?\n/);

      const fullTransformed = lines.map((line) => line + "\\n").join("");
      
      statusBarItem.text = `$(sync~spin) Analyzing...`;
      statusBarItem.show();

      try {
        const resultStr = await analyzeCode(fullTransformed);
        statusBarItem.text = `$(check) Analysis complete`;

        const vulnerabilities = JSON.parse(resultStr);

        const decorationType = vscode.window.createTextEditorDecorationType({
          backgroundColor: "rgba(255, 0, 0, 0.3)",
          isWholeLine: true,
        });

        const decorations: vscode.DecorationOptions[] = vulnerabilities
          .map((vuln: any) => {
            const line = vuln.line_number - 1;
            if (line < 0 || line >= editor.document.lineCount) {
              return null;
            }

            const hoverMessage = new vscode.MarkdownString(
              `**Vulnerability:** ${vuln.vulnerability_type}\n\n` +
                `**Description:** ${vuln.description}\n\n` +
                `**Remediation:** ${vuln.remediation}\n\n` +
                `**CVE:** ${vuln.cve ?? "N/A"}`
            );
            hoverMessage.isTrusted = true;

            return {
              range: editor.document.lineAt(line).range,
              hoverMessage,
            };
          })
          .filter(Boolean) as vscode.DecorationOptions[];

        editor.setDecorations(decorationType, decorations);

        const channel = vscode.window.createOutputChannel(
          "Vulnerability Analysis"
        );
        channel.show(true);
        channel.appendLine("Vulnerability Analysis Result:");
        channel.appendLine(JSON.stringify(vulnerabilities, null, 2));

        setTimeout(() => {
          statusBarItem.hide();
        }, 5000);
      } catch (err: any) {
        console.error("Analysis error:", err);
        statusBarItem.hide();
        vscode.window.showErrorMessage(`Analysis failed: ${err.message}`);
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {
  console.log('Extension "SecuCode-AI" is now deactivated!');
}
