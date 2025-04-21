import type { NextApiRequest, NextApiResponse } from "next";

type HealthResponse = {
  status: string;
  timestamp: string;
  environment: string;
  service: string;
};

/**
 * Health check endpoint to verify API availability
 */
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<HealthResponse>
) {
  // Return a simple health check response
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    service: "colorcraft-api"
  });
} 