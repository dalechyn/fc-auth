import type {
  AuthClientError,
  CreateChannelParameters as client_CreateChannelParameters,
  CreateChannelReturnType as client_CreateChannelReturnType,
} from '@fc-auth/core'
import type { Config } from '../types/config.js'
import type { Omit } from '../types/utils.js'

export type CreateChannelParameters = Omit<
  client_CreateChannelParameters,
  'nonce' | 'siweUri' | 'domain'
> & {
  siweUri?: string
  domain?: string
  nonce?: string | (() => Promise<string>)
}

export type CreateChannelReturnType = client_CreateChannelReturnType
export type CreateChannelErrorType = AuthClientError

export async function createChannel(
  config: Config,
  parameters: CreateChannelParameters,
): Promise<CreateChannelReturnType> {
  const {
    nonce,
    expirationTime,
    notBefore,
    requestId,
    siweUri = config.siweUri,
    domain = config.domain,
  } = parameters

  const nonceVal = typeof nonce === 'function' ? await nonce() : nonce
  return await config.appClient.createChannel({
    nonce: nonceVal,
    siweUri,
    domain,
    notBefore,
    expirationTime,
    requestId,
  })
}
