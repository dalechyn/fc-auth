import type {
  AuthClientError,
  VerifySiweMessageParameters as client_VerifySiweMessageParameters,
  VerifySiweMessageReturnType as client_VerifySiweMessageReturnType,
} from '@fc-auth/core'
import type { Config } from '../types/config.js'

export type VerifySiweMessageParameters = client_VerifySiweMessageParameters

export type VerifySiweMessageReturnType = client_VerifySiweMessageReturnType
export type VerifySiweMessageErrorType = AuthClientError

export async function verifySiweMessage(
  config: Config,
  parameters: VerifySiweMessageParameters,
): Promise<VerifySiweMessageReturnType> {
  const { nonce, domain, message, signature } = parameters

  return await config.appClient.verifySiweMessage({
    nonce,
    domain,
    message,
    signature,
  })
}
