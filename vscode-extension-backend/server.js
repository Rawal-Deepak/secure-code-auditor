const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

const analyzeRoutes = require("./routes/analyze");

app.use(bodyParser.json());
app.use("/analyze", analyzeRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
