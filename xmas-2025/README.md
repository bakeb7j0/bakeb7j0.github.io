# Xmas 2025 NFC Gift Reveal

A fun Christmas project that replaces paper gift tags with NFC tags. Each tag opens a personalized URL that plays a gift-opening animation, then reveals a random photo of the recipient.

## Gift URLs

| Recipient | URL |
|-----------|-----|
| Jacoby | https://bakeb7j0.github.io/xmas-2025/gift.html?person=jacoby |
| Jason | https://bakeb7j0.github.io/xmas-2025/gift.html?person=jason |
| Jenna | https://bakeb7j0.github.io/xmas-2025/gift.html?person=jenna |
| Kat | https://bakeb7j0.github.io/xmas-2025/gift.html?person=kat |
| Lisa | https://bakeb7j0.github.io/xmas-2025/gift.html?person=lisa |
| Ricky | https://bakeb7j0.github.io/xmas-2025/gift.html?person=ricky |

---

## Overview

When a recipient taps an NFC tag on their phone:

1. The browser opens the personalized gift URL
2. A "Loading your gift..." message appears while assets preload
3. An animated GIF of a gift box opening plays (~3.7 seconds)
4. The animation freezes and fades out
5. A random photo of the recipient fades in

The experience is designed to be delightful, fast, and work reliably on mobile devices.

---

## Architecture

### Directory Structure

```
xmas-2025/
├── gift.html              # Main experience page
├── assets/
│   ├── app.js             # Animation logic and state management
│   ├── styles.css         # Responsive styling
│   └── box.gif            # Gift box opening animation
└── people/
    ├── jacoby/
    │   ├── manifest.json  # Photo list for this person
    │   └── *.jpeg         # Photos
    ├── jason/
    ├── jenna/
    ├── kat/
    ├── lisa/
    └── ricky/
```

### How It Works

#### URL Routing
- The `gift.html` page reads the `?person=` query parameter
- The person ID is sanitized (lowercase, alphanumeric only)
- Invalid or missing IDs show a friendly error message

#### Asset Discovery
Each person folder contains a `manifest.json`:

```json
{
  "personId": "jenna",
  "photos": [
    "jenna1.jpeg",
    "jenna2.jpeg",
    ...
  ]
}
```

The app fetches this manifest to discover available photos without hardcoding filenames.

#### Preloading Strategy
Before the animation starts, the app preloads:
- The gift box GIF
- One randomly selected photo from the manifest

This ensures smooth playback with no loading delays mid-animation.

#### Animation Sequence
1. **Show box GIF** - Plays for 3.7 seconds
2. **Freeze GIF** - Captures current frame to canvas, converts to static image
3. **Hide box** - Removes the GIF element
4. **Reveal photo** - Fades in the preloaded photo

The "freeze" technique prevents the GIF from looping by replacing it with a static snapshot of its final frame.

#### Error Handling
- Missing `?person=` parameter → shows helpful error
- Unknown person ID → shows "not found" error
- Failed photo load → tries other photos from manifest
- All failures → "Tap anywhere to retry" reloads the page

---

## Tech Stack

### Frontend
- **Vanilla JavaScript** (ES6+) - No frameworks, keeps bundle size minimal
- **CSS3** - Flexbox layout, CSS transitions for fades
- **HTML5** - Semantic markup, responsive viewport

### Hosting
- **GitHub Pages** - Static file hosting, free, auto-deploys from main branch
- No server-side code required

### Key Techniques
- **Canvas API** - Used to freeze GIF animation by capturing current frame
- **Fetch API** - Loads manifest.json files
- **Promise.all** - Parallel asset preloading
- **URLSearchParams** - Query parameter parsing
- **CSS Transitions** - Smooth opacity fades

### Browser Compatibility
- iOS Safari (modern)
- Android Chrome (modern)
- Desktop browsers (Chrome, Firefox, Safari, Edge)

---

## Adding a New Person

1. Create a folder: `people/<name>/`
2. Add photos (JPEG recommended)
3. Create `manifest.json`:
   ```json
   {
     "personId": "<name>",
     "photos": ["photo1.jpeg", "photo2.jpeg", ...]
   }
   ```
4. Commit and push to deploy

No code changes required.

---

## Configuration

Timing values are configured in `assets/app.js`:

```javascript
const CONFIG = {
  boxDuration: 3700,    // How long box GIF plays (ms)
  fadeDuration: 500,    // Fade transition duration (ms)
  boxGif: 'assets/box.gif',
};
```

---

## Local Development

Start a local server from the `xmas-2025` directory:

```bash
python3 -m http.server 8881
```

Then open: http://localhost:8881/gift.html?person=jenna

---

## NFC Tag Setup

1. Use an NFC tag writer app (e.g., NFC Tools)
2. Write a URL record with the person's gift URL
3. Attach tag to gift

When the recipient taps the tag with their phone, the browser opens automatically.
