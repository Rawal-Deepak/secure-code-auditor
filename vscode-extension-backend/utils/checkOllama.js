const axios = require("axios");

async function isModelRunning(modelName) {
  try {
    const res = await axios.get("http://localhost:11434/api/tags");
    const models = res.data.models || [];

    // Check if your model is in the running list
    return models.some((m) => m.name === modelName);
  } catch (err) {
    return false;
  }
}

module.exports = isModelRunning;
