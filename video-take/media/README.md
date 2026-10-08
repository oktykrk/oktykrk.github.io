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


## App assets

`cadreur-icon.svg` and `apple-touch-icon.png` come from the application's original
brand artwork. `screen-script.webp`, `screen-record.webp`, `screen-edit.webp`, and
`screen-captions.webp` are optimized versions of the actual app's English iPhone
screenshots (sections, teleprompter, editor, captions). Their `-tr` variants use
actual Turkish app screenshots. The example presenter within the app screenshots
is generated sample content. These are product illustrations, not testimonials.

`cadreur-social.jpg` is a browser capture of this site's hero, arranged at
1200 × 630 for social previews. It uses the same generated creator photograph.
