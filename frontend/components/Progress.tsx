import React, { useState } from 'react'
import styled from 'styled-components'
import { ROUND_TIME_MS } from '../../shared/app-state'

interface ProgressProps {
  time: number
}

const WIDTH = 120
const WEIGHT = 5
const r = WIDTH / 2 - WEIGHT * 2
const p = Math.PI * r * 2

const ProgressRing = styled.circle<ProgressProps>`
  stroke: #ccc;
  stroke-width: ${WEIGHT}px;
  fill: transparent;
  stroke-dasharray: ${p}px, ${p}px;
  animation: ${ROUND_TIME_MS}ms progress_bar_animate linear infinite;
  animation-delay: ${props => props.time - ROUND_TIME_MS}ms;
  transform-origin: ${WIDTH / 2}px;
  opacity: 0;

  @keyframes progress_bar_animate {
    0% {
      stroke-dashoffset: ${p}px;
      opacity: 1;
    }
    85% {
      stroke-dashoffset: 0;
      opacity: 1;
      transform: none;
      animation-timing-function: ease-out;
    }
    100% {
      opacity: 0;
      transform: scale(1.3);
    }
  }
`

const Wrapper = styled.svg`
  width: ${WIDTH}px;
  height: ${WIDTH}px;
  transform: rotate(-90deg);
  overflow: visible;
  margin auto;
  display: block;
`

export default ({ time }: ProgressProps) => {
  const [initialTime] = useState(time)
  return (
    <Wrapper>
      <ProgressRing
        time={initialTime}
        r={WIDTH / 2 - WEIGHT * 2}
        cx={WIDTH / 2}
        cy={WIDTH / 2}
      />
    </Wrapper>
  )
}
