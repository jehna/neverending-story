import React from "react"
import UrlLoader from "./UrlLoader"

interface StoryResult {
  story: string
}

export default () => (
  <div>
    <UrlLoader
      url="/data.json"
      onSuccess={({ story }: StoryResult) => <p>{story}</p>}
    />
  </div>
)
