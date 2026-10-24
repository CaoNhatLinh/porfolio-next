import { defineConfig, devices } from "@playwright/test";

const externalBaseURL = process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  use: { baseURL: externalBaseURL ?? "http://localhost:3101", trace: "retain-on-failure" },
  webServer: externalBaseURL ? undefined : { command: "npm run dev -- --port 3101", url: "http://localhost:3101", reuseExistingServer: true, timeout: 120_000 },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
