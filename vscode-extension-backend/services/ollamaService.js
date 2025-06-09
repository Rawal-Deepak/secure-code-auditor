const axios = require("axios");
const { exec } = require("child_process");
const { isOllamaRunning } = require("../utils/checkOllama");

async function ensureOllamaReady(modelName) {
  const isRunning = await isOllamaRunning();
  if (!isRunning) {
    console.log("Ollama not running. Starting it...");
    exec(`ollama run ${modelName}`);
    await new Promise((resolve) => setTimeout(resolve, 5000)); // wait for startup
  }
}

async function analyzeCode(model, code) {
  const prompt = `Analyze the following source code for security vulnerabilities. Return the output strictly in the following JSON format:\n\n[
  {
    "vulnerability_type": "string",
    "line_number": integer,
    "description": "string",
    "remediation": "string",
    "cve": "string (if applicable, else null)"
  }
]\n\nDo not include any explanations. Only return the JSON output.\n\nSource Code:\n"""\n${code}\n"""`;

  const response = await axios.post("http://localhost:5000/api/generate", {
    model,
    prompt,
    stream: false,
  });

  return JSON.parse(response.data.response);
}

module.exports = { ensureOllamaReady, analyzeCode };
