const path = require("path");

module.exports = {
  entry: "./index.js", // Your main Express app file
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  target: "node", // Target Node.js environment
};
