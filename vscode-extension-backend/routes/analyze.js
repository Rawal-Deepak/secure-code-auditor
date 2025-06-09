const express = require("express");
const router = express.Router();
const runOllamaModel = require("../utils/runOllama");
const { cleanModelOutput } = require("../utils/parseOutput");

router.post("/", async (req, res) => {
  const { code } = req.body;
  console.log(code);
  if (!code) return res.status(400).json({ error: "No code provided" });
  const prompt = `Analyze the following source code for security vulnerabilities. Return the output strictly in the following JSON format:

[
  {
    "vulnerability_type": "string",
    "line_number": integer,
    "description": "string",
    "remediation": "string",
    "cve": "string (if applicable, else null)"
  }
]

Do not include any explanations. Only return the JSON output.

Source Code:
"""
${code}
"""`;

  try {
    const output = await runOllamaModel("qwen2.5-coder:7b", prompt);
    console.log("OUTPUT: ", output);
    const cleanedOutput = cleanModelOutput(output);
    res.json({ data: cleanedOutput });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
