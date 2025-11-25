/**
 * Core ASCII rendering utilities
 * Shared across all image and video ASCII implementations
 */

/**
 * Maps a brightness value to an ASCII character index
 * @param {number} brightness - Brightness value (0-255)
 * @param {string} charSet - ASCII character set string
 * @returns {number} Character index
 */
export function mapBrightnessToCharIndex(brightness, charSet) {
  return Math.floor(map(brightness, 0, 255, charSet.length - 1, 0));
}

/**
 * Gets ASCII character for a given brightness value
 * @param {number} brightness - Brightness value (0-255)
 * @param {string} charSet - ASCII character set string
 * @returns {string} ASCII character
 */
export function getAsciiChar(brightness, charSet) {
  const index = mapBrightnessToCharIndex(brightness, charSet);
  return charSet.charAt(index) || ' ';
}

/**
 * Calculates character position for grid rendering
 * @param {number} i - Column index
 * @param {number} j - Row index
 * @param {number} size - Character size
 * @returns {{x: number, y: number}} Position coordinates
 */
export function getCharPosition(i, j, size) {
  return {
    x: i * size + size / 2,
    y: j * size + size / 2
  };
}

/**
 * Sets up text rendering properties
 * @param {p5} p - p5.js instance
 * @param {number} size - Text size
 * @param {boolean} bold - Use bold text style
 */
export function setupTextRender(p, size, bold = false) {
  p.textSize(size);
  p.textAlign(p.CENTER, p.CENTER);
  if (bold) {
    p.textStyle(p.BOLD);
  }
}

/**
 * Renders an ASCII grid from a source (image or video)
 * @param {p5} p - p5.js instance
 * @param {p5.Image|p5.MediaElement} source - Image or video source
 * @param {number} w - Grid width
 * @param {number} h - Grid height
 * @param {number} size - Character size
 * @param {string} charSet - ASCII character set
 * @param {Object} options - Rendering options
 * @param {boolean} options.color - Use color
 * @param {boolean} options.bold - Use bold style
 * @param {Function} options.colorModifier - Optional color modification function
 */
export function renderAsciiGrid(p, source, w, h, size, charSet, options = {}) {
  const { color = false, bold = false, colorModifier = null } = options;

  // Load pixels if it's an image
  if (source.loadPixels) {
    source.loadPixels();
  }

  setupTextRender(p, size, bold);

  for (let i = 0; i < w; i++) {
    for (let j = 0; j < h; j++) {
      // Get pixel value
      const pixelVal = source.get(i, j);
      const bright = p.brightness(pixelVal);

      // Get ASCII character
      const char = getAsciiChar(bright, charSet);

      // Calculate position
      const { x, y } = getCharPosition(i, j, size);

      // Set color
      if (color) {
        let r = p.red(pixelVal);
        let g = p.green(pixelVal);
        let b = p.blue(pixelVal);

        // Apply color modifier if provided
        if (colorModifier) {
          const modified = colorModifier({ r, g, b, brightness: bright });
          r = modified.r;
          g = modified.g;
          b = modified.b;
        }

        p.fill(r, g, b);
      } else {
        p.fill(255); // White for monochrome
      }

      // Draw character
      p.text(char, x, y);
    }
  }
}

/**
 * Handles canvas resize for ASCII visualization
 * @param {p5} p - p5.js instance
 * @param {number} w - Original width
 * @param {number} h - Original height
 * @returns {{canvasWidth: number, canvasHeight: number, size: number}} New dimensions
 */
export function handleCanvasResize(p, w, h) {
  const canvasWidth = p.windowWidth;
  const canvasHeight = (canvasWidth * h) / w;

  p.resizeCanvas(canvasWidth, canvasHeight);

  const size = p.width / w;

  return { canvasWidth, canvasHeight, size };
}

/**
 * Creates initial canvas for ASCII visualization
 * @param {p5} p - p5.js instance
 * @param {number} w - Grid width
 * @param {number} h - Grid height
 * @returns {{canvasWidth: number, canvasHeight: number, size: number}} Canvas dimensions
 */
export function createAsciiCanvas(p, w, h) {
  const canvasWidth = p.windowWidth;
  const canvasHeight = (canvasWidth * h) / w;

  p.createCanvas(canvasWidth, canvasHeight);

  const size = p.width / w;

  return { canvasWidth, canvasHeight, size };
}

/**
 * Helper function for p5.js map (for standalone use)
 * @param {number} value - Value to map
 * @param {number} start1 - Source range start
 * @param {number} stop1 - Source range end
 * @param {number} start2 - Target range start
 * @param {number} stop2 - Target range end
 * @returns {number} Mapped value
 */
function map(value, start1, stop1, start2, stop2) {
  return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}
