import React from "react"
import { F, Atom } from "@grammarly/focal"

export default ({ story = Atom.create("Lorem Ipsum") }) => (
  <div>
    <F.p>{story}</F.p>
  </div>
)
