// scripts/vercel-build.mjs compiles the backend with its own strict TypeScript configuration.
// Package that verified JavaScript instead of recompiling Drizzle schemas with Vercel's defaults.
const { app } = require("../backend/dist/src/index.js");
export default app;
