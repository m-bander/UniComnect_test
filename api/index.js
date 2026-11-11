// The backend is compiled and checked by scripts/vercel-build.mjs before packaging.
module.exports = require("../backend/dist/src/index.js").app;
