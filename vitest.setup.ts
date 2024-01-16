import {loadEnvConfig} from "@next/env";
import { vi, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

loadEnvConfig(".");

// vi.mock('module'); 
vi.mock("@/node-lib/curriculum-api")
vi.mock("@/node-lib/curriculum-api-2023")
vi.mock("next/dist/client/router", () => require("next-router-mock"));
vi.mock("next/router", () => require("next-router-mock"));

afterEach(() => {
  cleanup();
});