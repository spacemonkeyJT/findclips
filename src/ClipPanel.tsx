import React from 'react';
import { Clip } from './twitch';

export const ClipPanel = ({ clip }: { clip: Clip }) => {
  return <div className="clip">
    <a target="_blank" rel="noreferrer" href={clip.url} className="thumbnail">
      <img src={clip.thumbnail_url} alt="thumbnail" />
    </a>
    <div className="title">{clip.title}</div>
    <div className="creator">Clipped by {clip.creator_name}</div>
  </div>
}
