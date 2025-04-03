'use client'

import { type UseMutationResult, useMutation } from '@tanstack/react-query'
import {
  type CreateChannelErrorType,
  type CreateChannelParameters,
  type CreateChannelReturnType,
  createChannel,
} from '../actions/createChannel.js'
import { useConfig } from './useConfig.js'

export type UseCreateChannelVariables = CreateChannelParameters

export type UseCreateChannelReturnType = UseMutationResult<
  CreateChannelReturnType,
  CreateChannelErrorType,
  UseCreateChannelVariables
>

export function useCreateChannel(): UseCreateChannelReturnType {
  const config = useConfig()

  return useMutation<
    CreateChannelReturnType,
    CreateChannelErrorType,
    UseCreateChannelVariables
  >({
    mutationFn: (variables) => createChannel(config, variables),
  })
}
