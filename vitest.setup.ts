import {loadEnvConfig} from "@next/env";
import { expect } from 'vitest';
import matchers from '@testing-library/jest-dom/matchers';

loadEnvConfig(".");
expect.extend(matchers);

// vi.mock('module'); 
vi.mock("next/dist/client/router", () => require("next-router-mock"));
