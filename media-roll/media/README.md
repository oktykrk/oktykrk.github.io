# MediaRoll website media

All assets are local. No remote media services or tracking pixels are used.

- `icon.png`: resized copy of the actual app icon from
  `media-roll/Resources/MediaRoll-Icon.png` in the sibling app repository.
- `coast.webp`, `lake.webp`, and their thumbnails: optimized versions of the
  original ImageGen landscapes already commissioned for MediaRoll's marketing.
  Sources: the sibling app's `marketing/source/coast.png` and `lake.png`.
  Original prompts are recorded in that repository's `marketing/prompts.json`.
  These are generated sample images, not customer photos.
- `app-browse.webp`, `app-compare.webp`, `app-edit.webp`, `app-export.webp`:
  optimized production AppKit view renders from the sibling app's
  `build/marketing/native/en/`. They show the actual application with the
  original sample landscapes, without invented app controls.
- `coast-motion.mp4`: an eight-second, silent, 960×600 H.264 motion study
  generated from `coast.webp` with FFmpeg. It gently zooms into the still image;
  it is not captured coastal footage. It is used as sample content in the real video-player screenshot.

Recreate the motion sample from the website root:

```sh
ffmpeg -i media-roll/media/coast.webp \
  -vf "zoompan=z='1.04+0.035*sin(on/192*PI)':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=192:s=960x600:fps=24" \
  -t 8 -c:v libx264 -pix_fmt yuv420p -crf 25 -movflags +faststart -an \
  media-roll/media/coast-motion.mp4
```

`viewer-coast.webp` and `viewer-lake.webp` are production AppKit view renders
captured from the current sibling app source on 2026-10-14 at a logical window
size of 1100×740. They use the real MediaViewerController, folder sidebar, and
native toolbar, with three synthetic demo files. `viewer-video.webp` is a
native screenshot of the installed MediaRoll 1.0.2 (4) app playing the sample
MP4 (paused), because AppKit view caching cannot capture the AVPlayer layer.
The video screen shows the real app's auto-hidden toolbar state. Only resizing
and WebP encoding are applied; no controls are added, removed, or redrawn.

The hero is explicitly labeled as a walkthrough of actual app screenshots,
not a screen recording. Its website navigation sits outside the screenshots.
The homepage also uses these intact screenshots. Automatic transitions pause
outside the viewport or in a background tab. Reduced motion starts paused.

App Store ID: 6822382896. The app is awaiting review as of 2026-10-14, confirmed
by the developer. The page intentionally says “Coming to the Mac App Store”
and links its primary CTA to the working demo. Replace the availability block
with a verified App Store link when the app is released.

`finder-folder.webp` is a native Finder screenshot captured on 2026-10-14,
showing only the synthetic demo folder. The hero starts in this Finder capture,
adds a website cursor/double-click annotation, reveals the actual MediaRoll
window, then advances through its photo and video captures with arrow-key cues.
These annotations explain actions; they are not reconstructed app controls.
