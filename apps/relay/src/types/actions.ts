import type { z } from 'zod'
import type { channelAuthenticateSchema } from '../schemas/channelAuthenticate.js'
import type { channelCreateSchema } from '../schemas/channelCreate.js'
import type { Channel, CompletedChannel, PendingChannel } from './channel.js'

export type ChannelCreateParameters = z.infer<typeof channelCreateSchema>
export type ChannelCreateReturnType = PendingChannel & { channelToken: string }

export type ChannelAuthenticateParameters = z.infer<
  typeof channelAuthenticateSchema
>
export type ChannelAuthenticateReturnType = CompletedChannel

export type ChannelGetReturnType = Channel
