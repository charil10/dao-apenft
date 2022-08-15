import {PropsWithChildren, useContext, useEffect, useRef, useState} from 'react'
import classnames from 'classnames'
import './index.css'

type Props = PropsWithChildren<{
 className?: string
 size?: 'L' | 'M' | 'S' | 'XS'
 danger?: boolean
 outlined?: boolean
 disabled?: boolean
 onClick?: () => void
}>

function Button(props: Props) {
  const {className, size, children, danger, outlined, ...rest} = props

  return (
    <button className={classnames(
      'ui-button',
      `ui-button-size-${size || 'M'}`,
      {['ui-button-danger']:danger},
      {['ui-button-outlined']:outlined},
      className)}
            {...rest}>
      {children}
    </button>
  )
}

export default Button
