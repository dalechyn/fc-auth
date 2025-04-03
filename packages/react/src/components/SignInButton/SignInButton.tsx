'use client'

import {
  AuthClientError,
  type PollChannelTillCompletedReturnType,
} from '@fc-auth/core'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { CreateChannelParameters } from '../../actions/createChannel.js'
import type { SignInParameters } from '../../actions/signIn.js'
import { useCreateChannel } from '../../hooks/useCreateChannel.js'
import useSignIn from '../../hooks/useSignIn.js'
import type { Omit } from '../../types/utils.js'
import { type MaybePromise, isMobile } from '../../utils.js'
import { ActionButton } from '../ActionButton/index.js'
import { ProfileButton } from '../ProfileButton/index.js'
import { QRCodeDialog } from '../QRCodeDialog/index.js'

type SignInButtonProps = Omit<
  NonNullable<CreateChannelParameters>,
  'siweUri' | 'domain'
> &
  Omit<SignInParameters, 'channelToken'> & {
    onSignIn?: (
      signInData: PollChannelTillCompletedReturnType & {
        isAuthenticated: boolean
      },
    ) => MaybePromise<unknown>
    onSignOut?: () => MaybePromise<unknown>
    onSignInError?: (error: unknown) => MaybePromise<unknown>
    hideSignOut?: boolean
  }

export function SignInButton({
  hideSignOut,
  onSignOut,
  onSignInError,
  onSignIn,
  nonce,
  notBefore,
  expirationTime,
  requestId,
  redirectUrl,
  timeout,
  interval,
}: SignInButtonProps) {
  const signInArgs = useMemo(
    () => ({
      nonce,
      notBefore,
      expirationTime,
      requestId,
      redirectUrl,
      timeout,
      interval,
    }),
    [
      nonce,
      notBefore,
      expirationTime,
      requestId,
      redirectUrl,
      timeout,
      interval,
    ],
  )
  const {
    status: signInStatus,
    data: signInData,
    error: signInError,
    signIn,
    signOut,
    reset,
  } = useSignIn()

  const createChannel = useCreateChannel()

  useEffect(() => {
    if (signInStatus === 'success') onSignIn?.(signInData)
    if (signInStatus === 'error') {
      // if it's a polling error due to the timeout, we recreate the channel
      if (
        signInError instanceof AuthClientError &&
        signInError.errCode === 'unavailable' &&
        signInError.message.startsWith('Polling timed out after')
      ) {
        ;(async () => {
          const recreateChannelData =
            await createChannel.mutateAsync(signInArgs)
          if (recreateChannelData?.channelToken) {
            reset()
            signIn({
              channelToken: recreateChannelData.channelToken,
              timeout: signInArgs.timeout,
              interval: signInArgs.interval,
            })
          }
        })()
        return
      }
      onSignInError?.(signInError)
    }
  }, [
    createChannel,
    signInStatus,
    onSignIn,
    signInData,
    signInError,
    onSignInError,
    reset,
    signIn,
    signInArgs,
  ])

  const handleSignOut = useCallback(async () => {
    setShowDialog(false)
    signOut()
    await createChannel.mutateAsync(signInArgs)
    onSignOut?.()
  }, [signOut, signInArgs, createChannel, onSignOut])

  const [showDialog, setShowDialog] = useState(false)

  const onClick = useCallback(async () => {
    if (signInStatus === 'error') {
      signOut()
    }
    setShowDialog(true)

    const createChannelData = await createChannel.mutateAsync(signInArgs)
    signIn({ ...signInArgs, channelToken: createChannelData.channelToken })
    if (isMobile()) {
      window.location.href = createChannelData.url
    }
  }, [signInStatus, signIn, createChannel, signInArgs, signOut])

  return (
    <div className="fc-authkit-signin-button">
      {signInStatus === 'success' && signInData.isAuthenticated ? (
        <ProfileButton
          userData={signInData}
          signOut={handleSignOut}
          hideSignOut={!!hideSignOut}
        />
      ) : (
        <>
          <ActionButton
            onClick={onClick}
            disabled={createChannel.status === 'pending'}
            label={createChannel.status === 'pending' ? 'Loading' : 'Sign in'}
          />
          {createChannel.status === 'success' ? (
            <QRCodeDialog
              variant="success"
              open={showDialog && !isMobile()}
              onClose={() => setShowDialog(false)}
              url={createChannel.data.url}
            />
          ) : createChannel.status === 'error' ? (
            <QRCodeDialog
              variant="error"
              open={showDialog && !isMobile()}
              onClose={() => setShowDialog(false)}
              error={createChannel.error}
            />
          ) : null}
        </>
      )}
    </div>
  )
}
