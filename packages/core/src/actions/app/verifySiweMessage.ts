import type { Provider } from 'ethers'
import type { Client } from '../../clients/createClient.js'
import type { Omit } from '../../types/utils.js'
import {
  type VerifySiweMessageWithVerifierParameters,
  type VerifySiweMessageWithVerifierReturnType,
  verifySiweMessageWithVerifier as util_verifySiweMessage,
} from '../../utils/verifySiweMessageWithVerifier.js'

export type VerifySiweMessageParameters = Omit<
  VerifySiweMessageWithVerifierParameters,
  'verifier'
>

export type VerifySiweMessageReturnType =
  VerifySiweMessageWithVerifierReturnType

export const verifySiweMessage = (
  client: Client,
  { nonce, domain, message, signature }: VerifySiweMessageParameters,
  provider?: Provider,
): Promise<VerifySiweMessageReturnType> => {
  return util_verifySiweMessage({
    nonce,
    domain,
    message,
    signature,
    verifier: {
      getFid: client.ethereum.getFid,
      provider: provider,
    },
  })
}
