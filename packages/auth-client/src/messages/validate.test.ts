import { parseSiweMessage } from "./validate";
import { AuthClientError } from "../errors";

const siweParams = {
  domain: "example.com",
  address: "0x63C378DDC446DFf1d831B9B96F7d338FE6bd4231",
  uri: "https://example.com/login",
  version: "1",
  nonce: "12345678",
  issuedAt: "2023-10-01T00:00:00.000Z",
};

const authParams = {
  ...siweParams,
  statement: "Farcaster Auth",
  chainId: 10,
  resources: ["farcaster://fid/1234"],
};

describe("parseSiweMessage", () => {
  test("default parameters are valid", () => {
    expect(() => parseSiweMessage(authParams)).not.toThrow();
  });

  test("propagates SIWE message errors", () => {
    try {
      parseSiweMessage({
        ...authParams,
        address: "Invalid address",
      });
      expect(true).toBe(false);
    } catch (e) {
      expect(e).toBeInstanceOf(AuthClientError);
      if (!(e instanceof AuthClientError)) throw new Error("unexpected");

      expect(e.errCode).toEqual("bad_request.validation_failure");
      expect(e.message).toMatch("invalid address");
    }
  });

  test("message must contain 'Farcaster Auth'", () => {
    try {
      parseSiweMessage({
        ...authParams,
        statement: "Invalid statement",
      });
      expect(true).toBe(false);
    } catch (e) {
      expect(e).toBeInstanceOf(AuthClientError);
      if (!(e instanceof AuthClientError)) throw new Error("unexpected");

      expect(e).toEqual(new AuthClientError("bad_request.validation_failure", "Statement must be 'Farcaster Auth'"));
    }
  });

  test("statement allows 'Farcaster Connect'", () => {
    expect(() =>
      parseSiweMessage({
        ...authParams,
        statement: "Farcaster Connect",
      }),
    ).not.toThrow();
  });

  test("message must include chainId 10", () => {
    try {
      parseSiweMessage({
        ...authParams,
        chainId: 1,
      });
      expect(true).toBe(false);
    } catch (e) {
      expect(e).toBeInstanceOf(AuthClientError);
      if (!(e instanceof AuthClientError)) throw new Error("unexpected");

      expect(e).toEqual(new AuthClientError("bad_request.validation_failure", "Chain ID must be 10"));
    }
  });

  test("message must include FID resource", () => {
    try {
      parseSiweMessage({
        ...authParams,
        resources: [],
      });
      expect(true).toBe(false);
    } catch (e) {
      expect(e).toBeInstanceOf(AuthClientError);
      if (!(e instanceof AuthClientError)) throw new Error("unexpected");

      expect(e).toEqual(new AuthClientError("bad_request.validation_failure", "No fid resource provided"));
    }
  });

  test("message must only include one FID resource", () => {
    try {
      parseSiweMessage({
        ...authParams,
        resources: ["farcaster://fid/1", "farcaster://fid/2"],
      });
      expect(true).toBe(false);
    } catch (e) {
      expect(e).toBeInstanceOf(AuthClientError);
      if (!(e instanceof AuthClientError)) throw new Error("unexpected");

      expect(e).toEqual(new AuthClientError("bad_request.validation_failure", "Multiple fid resources provided"));
    }
  });
});
