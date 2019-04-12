import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 1em;
  font-size: 0.9em;
  flex-wrap: wrap;
  max-width: 100%;
`

const Action = styled.button`
  border: 0;
  background: none;
  display: flex;
  appearance: none;
  font-size: inherit;
  font-family: inherit;
  box-sizing: border-box;
  color: #777;
  padding: 0.9em 1.3em;
  position: relative;
  margin: 0 1em;
  cursor: pointer;
  transition: transform 0.1s;
  margin-bottom: 1em;
  flex: 1;
  text-align: center;
  justify-content: center;

  &:hover {
    transform: translateY(-2px);

    &:after {
      transform: translateY(10px) scale(1.01);
    }
  }

  &:active {
    transform: translateY(5px);

    &:after {
      transform: translateY(3px) scale(0.95);
    }
  }

  &:after {
    content: '';
    display: block;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    position: absolute;
    z-index: -2;
    background: #f4f4f4;
    filter: blur(6px);
    transform: translateY(8px);
    transition: transform 0.1s;
  }

  &:before {
    content: '';
    display: block;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    position: absolute;
    z-index: -1;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 0.3em;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.1);
  }
`

export default () => (
  <Wrapper>
    <Action>Vote for the next word</Action>
    <Action>Vote for removal of the latest word</Action>
    <Action>Vote for end of paragraph</Action>
  </Wrapper>
)
