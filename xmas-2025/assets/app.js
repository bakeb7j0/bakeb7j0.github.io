(function () {
  'use strict';

  // Configuration
  const CONFIG = {
    // How long the box GIF plays before showing photo (ms)
    boxDuration: 3700,
    // Fade transition duration (ms)
    fadeDuration: 500,
    // Asset paths
    boxGif: 'assets/box.gif',
  };

  // DOM elements
  const els = {
    app: document.getElementById('app'),
    loading: document.getElementById('loading'),
    error: document.getElementById('error'),
    errorText: document.querySelector('.error-text'),
    stage: document.getElementById('stage'),
    gifBox: document.getElementById('gif-box'),
    gifExplosion: document.getElementById('gif-explosion'),
    photo: document.getElementById('photo'),
  };

  // Get person ID from URL
  function getPersonId() {
    const params = new URLSearchParams(window.location.search);
    const person = params.get('person');
    if (!person) return null;
    // Sanitize: lowercase, only alphanumeric and dashes
    return person.toLowerCase().replace(/[^a-z0-9-]/g, '');
  }

  // Show error with message
  function showError(message) {
    els.loading.classList.add('hidden');
    els.stage.classList.add('hidden');
    els.errorText.textContent = message;
    els.error.classList.remove('hidden');

    // Tap anywhere to reload
    document.body.addEventListener('click', () => location.reload(), { once: true });
  }

  // Preload an image, returns promise
  function preloadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load: ${src}`));
      img.src = src;
    });
  }

  // Fetch manifest for person
  async function fetchManifest(personId) {
    const url = `people/${personId}/manifest.json`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Person "${personId}" not found`);
    }
    const data = await response.json();
    if (!data.photos || data.photos.length === 0) {
      throw new Error('No photos available');
    }
    return data;
  }

  // Pick random item from array
  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // Shuffle array (Fisher-Yates)
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Try to load at least one photo from the list
  async function loadOnePhoto(personId, photos) {
    const shuffled = shuffle(photos);
    for (const filename of shuffled) {
      const src = `people/${personId}/${filename}`;
      try {
        await preloadImage(src);
        return src;
      } catch {
        // Try next photo
      }
    }
    throw new Error('Could not load any photos');
  }

  // Run the animation sequence
  async function runAnimation(boxSrc, photoSrc) {
    // Hide loading, show stage
    els.loading.classList.add('hidden');
    els.stage.classList.remove('hidden');

    // Set up the box GIF (force restart by cache-busting)
    els.gifBox.src = boxSrc + '?t=' + Date.now();
    els.gifBox.classList.add('visible');

    // Wait for box animation duration
    await sleep(CONFIG.boxDuration);

    // Freeze and hide the box GIF
    freezeGif(els.gifBox);
    els.gifBox.classList.remove('visible');
    els.gifBox.src = '';

    // Fade in photo
    els.photo.src = photoSrc;
    els.photo.classList.add('visible');
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Freeze a GIF by replacing it with a static canvas snapshot
  function freezeGif(imgEl) {
    const canvas = document.createElement('canvas');
    canvas.width = imgEl.naturalWidth;
    canvas.height = imgEl.naturalHeight;
    canvas.getContext('2d').drawImage(imgEl, 0, 0);
    // Replace src with canvas data URL to stop animation
    imgEl.src = canvas.toDataURL();
  }

  // Main entry point
  async function main() {
    const personId = getPersonId();

    if (!personId) {
      showError('Missing person parameter. URL should be: ?person=name');
      return;
    }

    try {
      // Fetch manifest
      const manifest = await fetchManifest(personId);

      // Preload assets in parallel
      const [, photoSrc] = await Promise.all([
        preloadImage(CONFIG.boxGif),
        loadOnePhoto(personId, manifest.photos),
      ]);

      // Run the animation
      await runAnimation(CONFIG.boxGif, photoSrc);

    } catch (err) {
      showError(err.message || 'Something went wrong');
    }
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }
})();
