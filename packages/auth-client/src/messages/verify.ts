import { ResultAsync, err, ok } from "neverthrow";
import { AuthClientAsyncResult, AuthClientResult, AuthClientError } from "../errors";

import { validate, parseResources } from "./validate";
import { FarcasterResourceParams } from "./build";
import { PublicClient } from "viem";

import { SiweMessage, createSiweMessage, parseSiweMessage } from "viem/siwe";

type Hex = `0x${string}`;
type SignInOpts = {
  getFid: (custody: Hex) => Promise<bigint>;
  client: PublicClient;
};
export type VerifyResponse = SiweMessage & FarcasterResourceParams;

// @NOTE: do we actually need this?
const voidVerifyFid = (_custody: Hex) => Promise.reject(new Error("Not implemented: Must provide an fid verifier"));

/**
 * Verify signature of a Sign In With Farcaster message. Returns an error if the
 * message is invalid or the signature is invalid.
 */
export const verify = async (
  nonce: string,
  domain: string,
  message: SiweMessage,
  signature: Hex,
  options: SignInOpts,
): AuthClientAsyncResult<VerifyResponse> => {
  const { getFid, client } = options;

  // Validation
  // It involves using viem's `validateSiweMessage`, although it is called internally
  // at `verifySiweMessage`.
  const validateMessageResult = validate(message)
    .andThen((message) => validateNonce(message, nonce))
    .andThen((message) => validateDomain(message, domain));
  if (validateMessageResult.isErr()) return err(validateMessageResult.error);

  // Verification
  const verifySiweMessageResult = await verifySiweMessage(
    createSiweMessage(validateMessageResult.value),
    signature,
    client,
  );

  if (verifySiweMessageResult.isErr()) return err(verifySiweMessageResult.error);
  if (!verifySiweMessageResult.value)
    return err(new AuthClientError("unauthorized", "Signature does not match address of the message."));

  // Merging resources
  const validatedMessageWithMergedResourcesResult = mergeResources(validateMessageResult.value);

  if (validatedMessageWithMergedResourcesResult.isErr()) {
    return err(validatedMessageWithMergedResourcesResult.error);
  }

  const fid = await verifyFidOwner(validatedMessageWithMergedResourcesResult.value, getFid);
  if (fid.isErr()) return err(fid.error);
  return ok(validatedMessageWithMergedResourcesResult.value);
};

const validateNonce = (message: SiweMessage, nonce: string): AuthClientResult<SiweMessage> => {
  if (message.nonce !== nonce) {
    return err(new AuthClientError("unauthorized", "Invalid nonce"));
  } else {
    return ok(message);
  }
};

const validateDomain = (message: SiweMessage, domain: string): AuthClientResult<SiweMessage> => {
  if (message.domain !== domain) {
    return err(new AuthClientError("unauthorized", "Invalid domain"));
  } else {
    return ok(message);
  }
};

const verifySiweMessage = async (
  message: string,
  signature: Hex,
  client: PublicClient,
): AuthClientAsyncResult<boolean> => {
  const parsed = parseSiweMessage(message);
  return ResultAsync.fromPromise(client.verifySiweMessage({ signature, message, ...parsed }), (e) => {
    return new AuthClientError("unauthorized", e as Error);
  });
};

const verifyFidOwner = async (
  message: SiweMessage & FarcasterResourceParams,
  fidVerifier: (custody: Hex) => Promise<bigint>,
): AuthClientAsyncResult<SiweMessage> => {
  const signer = message.address as Hex;
  return ResultAsync.fromPromise(fidVerifier(signer), (e) => {
    return new AuthClientError("unavailable", e as Error);
  }).andThen((fid) => {
    console.log("YOLO VERIFY FID OWNER CHECK", fid, BigInt(message.fid));
    if (fid !== BigInt(message.fid)) {
      return err(
        new AuthClientError("unauthorized", `Invalid resource: signer ${signer} does not own fid ${message.fid}.`),
      );
    }
    return ok(message);
  });
};

const mergeResources = (message: SiweMessage): AuthClientResult<SiweMessage & FarcasterResourceParams> => {
  return parseResources(message).andThen((resources) => {
    return ok({ ...resources, ...message });
  });
};
