import type { Config } from "jest";

const config: Config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$" : ["babel-jest", { presets: ["next/babel"] }],
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(motion|@motionone)/)",
  ],
  testMatch: ["**/__tests__/**/*.test.ts", "**/__tests__/**/*.test.jsx"],
  collectCoverageFrom: [
    "app/services/**/*.ts",
    "app/hooks/**/*.ts",
    "app/components/**/*.tsx",
    "!app/**/*.d.ts",
  ],
  coverageProvider: "v8",
};

export default config;
