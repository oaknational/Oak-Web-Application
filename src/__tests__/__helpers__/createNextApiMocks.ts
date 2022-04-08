import { Request, Response } from "express";
import { NextApiRequest, NextApiResponse } from "next";
import { createMocks } from "node-mocks-http";

export const createNextApiMocks = (...args: Parameters<typeof createMocks>) =>
  createMocks<NextApiRequest & Request, NextApiResponse & Response>(...args);
