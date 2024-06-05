import type {
  ChannelAuthenticateParameters,
  ChannelAuthenticateReturnType,
} from '@fc-auth/relay'
import type { Client } from '../../clients/createClient.js'
import { post } from '../../clients/transports/http.js'

export type AuthenticateParameters = ChannelAuthenticateParameters & {
  channelToken: string
  authKey: string
}

export type AuthenticateReturnType = ChannelAuthenticateReturnType

const path = 'channel/authenticate'

export const authenticate = async (
  client: Client,
  { channelToken, authKey, ...request }: AuthenticateParameters,
): Promise<AuthenticateReturnType> => {
  return post<
    Omit<AuthenticateParameters, 'channelToken' | 'authKey'>,
    AuthenticateReturnType
  >(client, path, request, {
    channelToken,
    headers: {
      'X-Farcaster-Auth-Relay-Key': authKey,
    },
  })
}
