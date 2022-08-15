import { PropsWithChildren, useEffect, useMemo, useState } from 'react'
import  './index.css'

interface TagProps {
  time?: number
  startTime: number
  onFinish?: () => void
}

const Timer = (props: PropsWithChildren<TagProps>) => {
  const { time, startTime, onFinish, ...rest } = props
  const [progress, setProgress] = useState<number>(0)

  useEffect(() => {
    const set = () => {
      if (startTime) {
        const diff = Math.max(
          new Date(startTime).getTime() + (time || 0) + (20 * 1000) - Date.now(),
          0,
        )
        setProgress(diff / 1000)
        return diff
      } else {
        return 0
      }
    }
    set()
    const interval = setInterval(() => {
      if (startTime) {
        const diff = set()
        if (diff <= 0) {
          onFinish?.()
          clearInterval(interval)
        }
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [startTime])

  const config = useMemo(() => {
    const h = progress / 60 / 60;
    const m = progress / 60 ;
    return {
      h: Math.floor(h),
      m: Math.floor(m % 60),
      s: Math.floor(progress % 60)
    }
  }, [progress])

  return (
    <div className="ui-timer" {...rest}>
      <span className="timer-item f-dinpro">{`${config.h}`.padStart(2, '0')}</span>
      <span className="timer-divider">:</span>
      <span className="timer-item f-dinpro">{`${config.m}`.padStart(2, '0')}</span>
      <span className="timer-divider">:</span>
      <span className="timer-item f-dinpro">{`${config.s}`.padStart(2, '0')}</span>
    </div>
  )
}

export default Timer
