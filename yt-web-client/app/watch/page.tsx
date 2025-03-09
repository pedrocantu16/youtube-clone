'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation'

function WatchContent() {
  const videoPrefix = 'https://storage.googleapis.com/pantu16-yt-processed-videos/';
  const videoSrc = useSearchParams().get('v');

  return (
    <div>
      <h1>Watch Page</h1>
      {/* Render the video only if videoSrc exists */}
      {videoSrc && (
        <video controls src={videoPrefix + videoSrc} />
      )}
    </div>
  );
}

export default function Watch() {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <WatchContent />
      </Suspense>
    );
}
