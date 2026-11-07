const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const uploadDarkIcon = 'C:/Users/Abutahir Sk/.gemini/antigravity/brain/35287729-ec78-486d-a03a-58958bea66ac/.user_uploaded/media_1794055134385_b260b6c4.jpg';
const uploadLightIcon = 'C:/Users/Abutahir Sk/.gemini/antigravity/brain/35287729-ec78-486d-a03a-58958bea66ac/.user_uploaded/media_1794055153405_c6e806cf.jpg';
const uploadDarkLogo = 'C:/Users/Abutahir Sk/.gemini/antigravity/brain/35287729-ec78-486d-a03a-58958bea66ac/.user_uploaded/media_1794055178339_98633fe4.jpg';
const uploadLightLogo = 'C:/Users/Abutahir Sk/.gemini/antigravity/brain/35287729-ec78-486d-a03a-58958bea66ac/.user_uploaded/media_1794055189855_ee499e86.jpg';

const publicImagesDir = path.join(__dirname, '../public/images');
const appDir = path.join(__dirname, '../src/app');
const publicDir = path.join(__dirname, '../public');

if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
}

// 1. Process Horizontal Logos (Light & Dark)
async function generateLogos() {
  const crop = { left: 106, top: 166, width: 864, height: 206 };

  // --- Dark Logo ---
  const origDark = sharp(uploadDarkLogo);
  const croppedDark = await origDark.extract(crop).raw().toBuffer({ resolveWithObject: true });
  const { data: dData, info: dInfo } = croppedDark;
  const dOut = Buffer.alloc(dInfo.width * dInfo.height * 4);

  for (let i = 0; i < dInfo.width * dInfo.height; i++) {
    const r = dData[i * 3];
    const g = dData[i * 3 + 1];
    const b = dData[i * 3 + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;

    let alpha = 0;
    if (lum > 52) {
      alpha = Math.min(255, Math.round(((lum - 52) / 22) * 255));
    }

    if (alpha === 0) {
      dOut[i * 4] = 0;
      dOut[i * 4 + 1] = 0;
      dOut[i * 4 + 2] = 0;
      dOut[i * 4 + 3] = 0;
    } else {
      const a = alpha / 255;
      const fgR = Math.max(0, Math.min(255, Math.round((r - (1 - a) * 40) / a)));
      const fgG = Math.max(0, Math.min(255, Math.round((g - (1 - a) * 46) / a)));
      const fgB = Math.max(0, Math.min(255, Math.round((b - (1 - a) * 48) / a)));
      dOut[i * 4] = fgR;
      dOut[i * 4 + 1] = fgG;
      dOut[i * 4 + 2] = fgB;
      dOut[i * 4 + 3] = alpha;
    }
  }

  await sharp(dOut, { raw: { width: dInfo.width, height: dInfo.height, channels: 4 } })
    .png()
    .toFile(path.join(publicImagesDir, 'logo-dark.png'));
  console.log('✓ Saved logo-dark.png');

  // --- Light Logo ---
  const origLight = sharp(uploadLightLogo);
  const croppedLight = await origLight.extract(crop).raw().toBuffer({ resolveWithObject: true });
  const { data: lData, info: lInfo } = croppedLight;
  const lOut = Buffer.alloc(lInfo.width * lInfo.height * 4);

  for (let i = 0; i < lInfo.width * lInfo.height; i++) {
    const r = lData[i * 3];
    const g = lData[i * 3 + 1];
    const b = lData[i * 3 + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    const lumDist = 241 - lum;
    const chroma = (r - b);
    const signal = Math.max(lumDist, chroma * 1.5);

    let alpha = 0;
    if (signal > 14) {
      alpha = Math.min(255, Math.round(((signal - 14) / 22) * 255));
    }

    if (alpha === 0) {
      lOut[i * 4] = 0;
      lOut[i * 4 + 1] = 0;
      lOut[i * 4 + 2] = 0;
      lOut[i * 4 + 3] = 0;
    } else {
      const a = alpha / 255;
      const bgR = 242, bgG = 241, bgB = 237;
      const fgR = Math.max(0, Math.min(255, Math.round((r - (1 - a) * bgR) / a)));
      const fgG = Math.max(0, Math.min(255, Math.round((g - (1 - a) * bgG) / a)));
      const fgB = Math.max(0, Math.min(255, Math.round((b - (1 - a) * bgB) / a)));
      lOut[i * 4] = fgR;
      lOut[i * 4 + 1] = fgG;
      lOut[i * 4 + 2] = fgB;
      lOut[i * 4 + 3] = alpha;
    }
  }

  await sharp(lOut, { raw: { width: lInfo.width, height: lInfo.height, channels: 4 } })
    .png()
    .toFile(path.join(publicImagesDir, 'logo-light.png'));
  console.log('✓ Saved logo-light.png');
}

// 2. Process Icon Badges (Light & Dark with rounded mask)
async function generateIcons() {
  const size = 576;
  const crop = { left: 238, top: 92, width: size, height: size };
  const mask = Buffer.from(
    `<svg width="${size}" height="${size}">
      <rect x="2" y="2" width="${size - 4}" height="${size - 4}" rx="112" ry="112" fill="#ffffff" />
    </svg>`
  );

  // Dark Icon Badge
  const iconDarkBuf = await sharp(uploadDarkIcon)
    .extract(crop)
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer();

  await sharp(iconDarkBuf)
    .toFile(path.join(publicImagesDir, 'icon-dark.png'));
  console.log('✓ Saved icon-dark.png');

  // Light Icon Badge
  const iconLightBuf = await sharp(uploadLightIcon)
    .extract(crop)
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer();

  await sharp(iconLightBuf)
    .toFile(path.join(publicImagesDir, 'icon-light.png'));
  console.log('✓ Saved icon-light.png');

  // App Icon (512x512) for Next.js App Router (using light badge with crisp gold)
  await sharp(iconLightBuf)
    .resize(512, 512, { fit: 'contain' })
    .toFile(path.join(appDir, 'icon.png'));
  console.log('✓ Saved src/app/icon.png (512x512)');

  // Apple Touch Icon (180x180)
  await sharp(iconLightBuf)
    .resize(180, 180, { fit: 'contain' })
    .toFile(path.join(appDir, 'apple-icon.png'));
  console.log('✓ Saved src/app/apple-icon.png (180x180)');

  // Favicon (48x48 PNG saved as favicon.ico)
  // Sharp can output PNG or we can save 48x48 PNG and standard ICO
  const ico48 = await sharp(iconLightBuf)
    .resize(48, 48, { fit: 'contain' })
    .png()
    .toBuffer();

  // Create a genuine 48x48 .ico file with ICO header
  const icoHeader = Buffer.from([
    0, 0, // reserved
    1, 0, // type 1 = ICO
    1, 0, // 1 image
    48,   // width 48
    48,   // height 48
    0,    // color palette 0
    0,    // reserved
    1, 0, // color planes
    32, 0,// bits per pixel
    ...int32ToBytes(ico48.length),
    ...int32ToBytes(22) // offset
  ]);
  const icoFile = Buffer.concat([icoHeader, ico48]);
  fs.writeFileSync(path.join(appDir, 'favicon.ico'), icoFile);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoFile);
  console.log('✓ Saved src/app/favicon.ico and public/favicon.ico');
}

function int32ToBytes(num) {
  const b = Buffer.alloc(4);
  b.writeUInt32LE(num, 0);
  return [b[0], b[1], b[2], b[3]];
}

async function main() {
  await generateLogos();
  await generateIcons();
  console.log('All branding assets generated successfully!');
}

main().catch(console.error);

