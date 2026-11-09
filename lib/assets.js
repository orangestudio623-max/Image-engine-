const { loadImage: napiLoadImage, GlobalFonts } = require("@napi-rs/canvas");
const path = require("path");

try {
  // Roboto (Regular & Bold)
  GlobalFonts.registerFromPath(
    path.join(process.cwd(), "node_modules/@fontsource/roboto/files/roboto-latin-400-normal.woff"), 
    "Roboto"
  );
  GlobalFonts.registerFromPath(
    path.join(process.cwd(), "node_modules/@fontsource/roboto/files/roboto-latin-700-normal.woff"), 
    "Roboto"
  );

  // Orbitron (Regular & Bold)
  GlobalFonts.registerFromPath(
    path.join(process.cwd(), "node_modules/@fontsource/orbitron/files/orbitron-latin-400-normal.woff"), 
    "Orbitron"
  );
  GlobalFonts.registerFromPath(
    path.join(process.cwd(), "node_modules/@fontsource/orbitron/files/orbitron-latin-700-normal.woff"), 
    "Orbitron"
  );

  // Poppins (Regular & Bold)
  GlobalFonts.registerFromPath(
    path.join(process.cwd(), "node_modules/@fontsource/poppins/files/poppins-latin-400-normal.woff"), 
    "Poppins"
  );
  GlobalFonts.registerFromPath(
    path.join(process.cwd(), "node_modules/@fontsource/poppins/files/poppins-latin-700-normal.woff"), 
    "Poppins"
  );

} catch (e) {
  console.error("Font loading failed:", e);
}

// SSRF-safe image loader
const ALLOWED_IMAGE_HOSTS = new Set([
  "effervescent-choux-462bd5.netlify.app" 
]);

function loadImage(url) {
  const parsed = new URL(url);
  if (parsed.protocol !== "https:") throw new Error("Only https: images allowed");
  if (!ALLOWED_IMAGE_HOSTS.has(parsed.host)) throw new Error("Image host not allowed");
  return napiLoadImage(parsed.href);
}

module.exports = { loadImage };
