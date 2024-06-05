import type { Provider } from 'ethers'
import {
  type ChannelParameters,
  type ChannelReturnType,
  channel,
} from '../actions/app/channel.js'
import {
  type CreateChannelParameters,
  type CreateChannelReturnType,
  createChannel,
} from '../actions/app/createChannel.js'
import {
  type PollChannelTillCompletedParameters,
  type PollChannelTillCompletedReturnType,
  pollChannelTillCompleted,
} from '../actions/app/pollChannelTillCompleted.js'
import {
  type VerifySiweMessageParameters,
  type VerifySiweMessageReturnType,
  verifySiweMessage,
} from '../actions/app/verifySiweMessage.js'
import {
  type Client,
  type CreateClientParameters,
  createClient,
} from './createClient.js'

export interface AppClient extends Client {
  createChannel: (
    args: CreateChannelParameters,
  ) => Promise<CreateChannelReturnType>
  channel: (args: ChannelParameters) => Promise<ChannelReturnType>
  pollChannelTillCompleted: (
    args: PollChannelTillCompletedParameters,
  ) => Promise<PollChannelTillCompletedReturnType>
  verifySiweMessage: (
    args: VerifySiweMessageParameters,
  ) => Promise<VerifySiweMessageReturnType>
}

export const createAppClient = (
  config: CreateClientParameters,
  provider?: Provider,
): AppClient => {
  const client = createClient(config)
  return {
    ...client,
    createChannel: (args: CreateChannelParameters) =>
      createChannel(client, args),
    channel: (args: ChannelParameters) => channel(client, args),
    pollChannelTillCompleted: (args: PollChannelTillCompletedParameters) =>
      pollChannelTillCompleted(client, args),
    verifySiweMessage: (args: VerifySiweMessageParameters) =>
      verifySiweMessage(client, args, provider),
  }
}
