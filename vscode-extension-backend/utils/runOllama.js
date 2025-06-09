const axios = require("axios");
const { spawn } = require("child_process");
const isModelRunning = require("./checkOllama");

async function runOllamaModel(modelName, prompt) {
  const isRunning = await isModelRunning(modelName);

  if (!isRunning) {
    console.log(`Model "${modelName}" is not running. Starting...`);

    const child = spawn("ollama", ["run", modelName], {
      detached: true,
      stdio: "ignore",
    });

    child.unref();

    // Give it time to load
    await new Promise((res) => setTimeout(res, 5000));
  }

  // Now send the prompt using the HTTP API
  try {
    const response = await axios.post("http://localhost:11434/api/generate", {
      model: modelName,
      prompt,
      stream: false,
    });

    return response.data.response;
  } catch (err) {
    throw new Error("Error from Ollama API: " + err.message);
  }
}

module.exports = runOllamaModel;
