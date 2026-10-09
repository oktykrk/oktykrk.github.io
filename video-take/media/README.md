# Cadreur marketing photography

Created on 2026-10-08 using the built-in `image_gen.imagegen` tool, one generation call per image. No CLI image generation or stock imagery was used. Images were visually inspected for realistic anatomy, credible photographic composition and lack of text/logos/UI; final web assets were converted with `cwebp -q 86 -m 6` without cropping or compositing.

## creator-portrait.webp

- Dimensions: 1024 × 1536 (portrait, 2:3)
- Original: `${CODEX_HOME}/generated_images/01a11c20-50c9-7cd1-92f7-ed5a7d6a555b/exec-6f69fbd6-acdc-47be-b026-1eca58069323.png`
- Intended use: camera preview in the homepage phone demonstration and portrait editorial frame.
- Exact generation prompt:

```text
Use case: photorealistic-natural
Asset type: premium editorial photograph for the Cadreur script-to-camera recording app landing page, inside a phone mockup.
Primary request: vertical 2:3 portrait photograph of an adult woman creative in her late twenties with dark shoulder-length gently wavy hair, looking directly into the camera with an engaged warm expression, mouth naturally slightly open mid-sentence, as if telling a thoughtful personal story. Waist-up composition with hands naturally gesturing visible near lower frame. Simple off-white crew-neck tee.
Scene/backdrop: calm warm daylight home creative studio, softly blurred oak bookshelves with books and ceramics, a discreet lavender accent in the room.
Style/medium: authentic editorial lifestyle photograph on a full-frame 50 mm lens, f/2.8, beautiful natural skin with real pores, subtle film grain, imperfect natural hair, sophisticated restrained warm cinematic daylight from a side window. A believable candid moment, not a fashion pose.
Composition/framing: portrait orientation 2:3. Comfortable headroom above hair. Subject centered and fills most of frame; eyes in upper third; hands do not cover face; background softly out of focus. Image must look equally good cropped to a tall mobile camera preview.
Materials/textures: realistic cotton, wood, skin, subtle film photographic texture.
Constraints: no camera or phone visible; no text, letters, logos, watermark, graphic overlay, app UI, border, or frame. Do not make a glossy render or overprocessed beauty photograph. Natural anatomically correct hands.
```

## studio-wide.webp

- Dimensions: 1536 × 1024 (landscape, 3:2)
- Original: `${CODEX_HOME}/generated_images/01a11c20-50c9-7cd1-92f7-ed5a7d6a555b/exec-4adbc439-3248-4dd6-a99e-ae8eccafef1f.png`
- Intended use: editorial section explaining the script-to-camera recording use case.
- Exact generation prompt:

```text
Use case: photorealistic-natural
Asset type: premium candid editorial photography for Cadreur, a script-to-camera teleprompter recording app website.
Primary request: a warm, believable creative workspace photographed at a three-quarter side angle, with a vertically mounted smartphone on a simple compact tabletop tripod sharply in focus in the foreground, recording an adult creative woman seated just behind it. The woman is softly out of focus and talking naturally toward the phone, off-white clothing, shoulder-length dark hair. The phone should be seen from its rear and side so no screen or interface is visible.
Scene/backdrop: calm small home creative studio, warm oak table, linen textures and book shelving in the distance, small espresso cup and a closed plain notebook at the near edge, one subtle lavender accent.
Style/medium: authentic high-end editorial photograph, natural daylight, understated analog photo color grade, restrained warm neutrals. Real material texture and convincing optical shallow depth of field, not glossy computer generated product visualization.
Composition/framing: landscape 3:2 photograph; intimate close-up of the phone and tripod at left-center, seated creator in softer focus in the right-middle background. Eye-level or slightly below, visually composed and uncluttered. Entire tripod must be physically plausible and support the phone.
Lighting/mood: soft window daylight, luminous and peaceful, realistic contact shadows.
Constraints: no legible text, logos, watermarks, app UI, decorative graphics or borders. No unrealistic floating objects, no extra limbs, no enormous professional cinema equipment. Keep the phone unbranded.
```

The subjects are generated illustrative creators, not customer testimonials.

## creator-speaking.mp4

Generated on 2026-10-08 through the official HeyGen MCP
`create_video_from_image` tool, using `creator-portrait.webp` as the identity,
clothing, lighting, and room reference. This is a fictional illustrative creator,
not a customer testimonial or a recording made with Cadreur.

- HeyGen video: `037508e9fff12f769c70e1f3a43eb8eb`
- Project: <https://app.heygen.com/videos/037508e9fff12f769c70e1f3a43eb8eb>
- Source image asset: `9d6a0fd0963d4088a9a4f7fa017c6256`
- Voice: Cecily — Warm & Friendly (`41f17b4ebd334ac99a91c2aada5f86d7`),
  English, requested speed 0.9, medium expressiveness.
- Script: “You don't need to be perfect. You just need to be you. Let's start there.”
- Output: 720 × 1080, 25 fps, approximately 4.84 seconds, H.264/AAC MP4.
- The account's free plan rejected 1080p before generation; one video was then
  generated at 720p. The provider's watermark remains in the source video.
- Web optimization: x264 CRF 23, slow preset, yuv420p, AAC 96 kbps, fast-start
  header. Original framing and timing are preserved.
- Validation: sampled frames show changing mouth positions, blinking, and hand
  gestures; local Whisper transcription matches all three scripted sentences.
  The optimized file is 992,104 bytes. Desktop and mobile playback, sound,
  pause/resume, offscreen pause, and both interface languages were checked.

Motion prompt:

```text
The same fictional adult woman talks warmly and naturally straight to the camera. Preserve her identity, shoulder-length dark wavy hair, off-white crew-neck T-shirt, exact room and warm daylight. One continuous fixed-camera portrait shot, no cuts, no pan, no zoom. Convincing speech lip synchronization, natural blinking, subtle gentle head movements and restrained anatomically natural hand gestures. Calm encouraging delivery with a small friendly smile at the end. No on-screen text, captions, titles, logos, music or additional dialogue.
```

The landing page uses the local MP4, with `creator-speaking-poster.webp` as its
poster and loading/error fallback. This 720 × 1080 image is extracted from the
video’s first decoded frame with FFmpeg and encoded with `cwebp -q 90`. The
fallback uses the same crop as the video, without zoom or drift animation.
It does not depend on an expiring HeyGen URL.

The player starts loading with the page, starts muted, supports pause/resume, and pauses
offscreen or in a background tab. The sound button restarts the clip before
unmuting so visitors hear the full sentence. Reduced motion requires an explicit
play action. Both interface languages use the same English clip. Loading or
decoding failures restore the first-frame fallback and hide video-only controls.


## App assets

`cadreur-icon.svg` and `apple-touch-icon.png` come from the application's original
brand artwork. `screen-script.webp`, `screen-record.webp`, `screen-edit.webp`, and
`screen-captions.webp` are optimized versions of the actual app's English iPhone
screenshots (sections, teleprompter, editor, captions). Their `-tr` variants use
actual Turkish app screenshots. The example presenter within the app screenshots
is generated sample content. These are product illustrations, not testimonials.

`cadreur-social.jpg` is a browser capture of this site's hero, arranged at
1200 × 630 for social previews. It uses the same generated creator photograph.
