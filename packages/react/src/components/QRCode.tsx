'use client'

import { Cuer } from 'cuer'
import { FarcasterLogo } from './FarcasterLogo.js'

type Props = {
  logoUrl?: string
  logoMargin?: number
  logoSize?: number
  size?: number
  uri: string
}

export function QRCode({ logoSize = 50, size: sizeProp = 200, uri }: Props) {
  const padding = '20'
  const size = sizeProp - Number.parseInt(padding, 10) * 2

  return (
    <Cuer.Root value={uri} size={size}>
      <Cuer.Cells radius={0} inset={false} />
      <Cuer.Finder radius={0} />
      <Cuer.Arena>
        <FarcasterLogo fill="purple" height={logoSize} />
      </Cuer.Arena>
    </Cuer.Root>
  )
}
