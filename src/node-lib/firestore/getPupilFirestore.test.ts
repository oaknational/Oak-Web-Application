import { Firestore } from "@google-cloud/firestore";
import { ExternalAccountClient } from "google-auth-library";

import { getPupilFirestore } from "./getPupilFirestore";

jest.mock("@vercel/functions/oidc");
jest.mock("@google-cloud/firestore");
jest.mock("google-auth-library");

let newFirestoreMock: jest.Mock;

describe("getPupilFirestore", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    newFirestoreMock = jest.fn();

    jest.mocked(Firestore).mockImplementation(() => {
      return newFirestoreMock();
    });
  });

  it("should use emulators when required emulator env vars are set", async () => {
    process.env.NEXT_PUBLIC_USE_FIRESTORE_EMULATOR = "true";
    process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST = "127.0.0.1:8089";

    getPupilFirestore();

    expect(ExternalAccountClient.fromJSON).not.toHaveBeenCalled();
    expect(Firestore).toHaveBeenCalledTimes(1);

    delete process.env.NEXT_PUBLIC_USE_FIRESTORE_EMULATOR;
    delete process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST;
  });

  it("should error when all required env vars are missing", async () => {
    delete process.env.GCP_PROJECT_ID;
    delete process.env.GCP_SERVICE_ACCOUNT_EMAIL;
    delete process.env.GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID;
    delete process.env.PUPIL_FIRESTORE_ID;
    delete process.env.NEXT_PUBLIC_USE_FIRESTORE_EMULATOR;
    delete process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST;

    await expect(async () => getPupilFirestore()).rejects.toThrowError();
  });

  it("should use GCP OIDC when emulator env vars are not set", async () => {
    process.env.GCP_PROJECT_ID = "test-project-id";
    process.env.GCP_SERVICE_ACCOUNT_EMAIL = "test-email";
    process.env.GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID =
      "test-identity-pool-id";
    process.env.PUPIL_FIRESTORE_ID = "test-firestore-db-id";

    getPupilFirestore();
    expect(ExternalAccountClient.fromJSON).toHaveBeenCalledTimes(1);
    expect(Firestore).toHaveBeenCalledTimes(1);

    delete process.env.GCP_PROJECT_ID;
    delete process.env.GCP_SERVICE_ACCOUNT_EMAIL;
    delete process.env.GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID;
    delete process.env.PUPIL_FIRESTORE_ID;
  });
});
