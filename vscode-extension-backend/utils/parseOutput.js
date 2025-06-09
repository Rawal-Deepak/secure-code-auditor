function cleanModelOutput(output) {
  const startRemoved = output.replace(/```json\s*/, "");
  const endIndex = startRemoved.indexOf("```");
  if (endIndex !== -1) {
    return startRemoved.slice(0, endIndex).trim();
  }
  return startRemoved.trim();
}

module.exports = { cleanModelOutput };
