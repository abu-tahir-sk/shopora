const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const uploadDark = 'C:/Users/Abutahir Sk/.gemini/antigravity/brain/35287729-ec78-486d-a03a-58958bea66ac/.user_uploaded/media_1794048702096_f399ac2d.jpg';
const uploadLight = 'C:/Users/Abutahir Sk/.gemini/antigravity/brain/35287729-ec78-486d-a03a-58958bea66ac/.user_uploaded/media_1794048714250_88e5b878.jpg';

const outDir = path.join(__dirname, '../public/images');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Logo content bounds:
// left: 121, top: 181, right: 954, bottom: 357
// With 15px margin:
const crop = { left: 106, top: 166, width: 864, height: 206 };

async function processDark() {
  const orig = sharp(uploadDark);
  const cropped = await orig.extract(crop).raw().toBuffer({ resolveWithObject: true });
  
  const { data, info } = cropped;
  const out = Buffer.alloc(info.width * info.height * 4);
  
  for (let i = 0; i < info.width * info.height; i++) {
    const r = data[i * 3];
    const g = data[i * 3 + 1];
    const b = data[i * 3 + 2];
    
    // Luminance
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    
    // Background is dark ~44-48 lum
    let alpha = 0;
    if (lum > 52) {
      alpha = Math.min(255, Math.round(((lum - 52) / 22) * 255));
    }
    
    if (alpha === 0) {
      out[i * 4] = 0;
      out[i * 4 + 1] = 0;
      out[i * 4 + 2] = 0;
      out[i * 4 + 3] = 0;
    } else {
      const a = alpha / 255;
      const fgR = Math.max(0, Math.min(255, Math.round((r - (1 - a) * 40) / a)));
      const fgG = Math.max(0, Math.min(255, Math.round((g - (1 - a) * 46) / a)));
      const fgB = Math.max(0, Math.min(255, Math.round((b - (1 - a) * 48) / a)));
      
      out[i * 4] = fgR;
      out[i * 4 + 1] = fgG;
      out[i * 4 + 2] = fgB;
      out[i * 4 + 3] = alpha;
    }
  }
  
  await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toFile(path.join(outDir, 'logo-dark.png'));
  console.log('logo-dark.png saved');
}

async function processLight() {
  const orig = sharp(uploadLight);
  const cropped = await orig.extract(crop).raw().toBuffer({ resolveWithObject: true });
  
  const { data, info } = cropped;
  const out = Buffer.alloc(info.width * info.height * 4);
  
  for (let i = 0; i < info.width * info.height; i++) {
    const r = data[i * 3];
    const g = data[i * 3 + 1];
    const b = data[i * 3 + 2];
    
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    const lumDist = 241 - lum;
    const chroma = (r - b);
    
    const signal = Math.max(lumDist, chroma * 1.5);
    
    let alpha = 0;
    if (signal > 14) {
      alpha = Math.min(255, Math.round(((signal - 14) / 22) * 255));
    }
    
    if (alpha === 0) {
      out[i * 4] = 0;
      out[i * 4 + 1] = 0;
      out[i * 4 + 2] = 0;
      out[i * 4 + 3] = 0;
    } else {
      const a = alpha / 255;
      const bgR = 242, bgG = 241, bgB = 237;
      const fgR = Math.max(0, Math.min(255, Math.round((r - (1 - a) * bgR) / a)));
      const fgG = Math.max(0, Math.min(255, Math.round((g - (1 - a) * bgG) / a)));
      const fgB = Math.max(0, Math.min(255, Math.round((b - (1 - a) * bgB) / a)));
      
      out[i * 4] = fgR;
      out[i * 4 + 1] = fgG;
      out[i * 4 + 2] = fgB;
      out[i * 4 + 3] = alpha;
    }
  }
  
  await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toFile(path.join(outDir, 'logo-light.png'));
  console.log('logo-light.png saved');
}

async function run() {
  await processDark();
  await processLight();
}

run().catch(console.error);
