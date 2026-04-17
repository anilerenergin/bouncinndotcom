import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import { writeFile } from 'node:fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const inputSvg = path.join(root, 'public', 'favicon.svg');
const outPng16 = path.join(root, 'public', 'favicon-16x16.png');
const outPng32 = path.join(root, 'public', 'favicon-32x32.png');
const outPng48 = path.join(root, 'public', 'favicon-48x48.png');
const outPng96 = path.join(root, 'public', 'favicon-96x96.png');
const outIco = path.join(root, 'public', 'favicon.ico');

async function main() {
  const base = sharp(inputSvg, { density: 256 });

  await base
    .clone()
    .resize(16, 16, { fit: 'cover' })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(outPng16);

  await base
    .clone()
    .resize(32, 32, { fit: 'cover' })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(outPng32);

  await base
    .clone()
    .resize(48, 48, { fit: 'cover' })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(outPng48);

  await base
    .clone()
    .resize(96, 96, { fit: 'cover' })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(outPng96);

  const icoBuf = await pngToIco([outPng16, outPng32, outPng48]);
  await writeFile(outIco, icoBuf);

  // eslint-disable-next-line no-console
  console.log(
    'Generated favicons:',
    path.relative(root, outPng16),
    path.relative(root, outPng32),
    path.relative(root, outPng48),
    path.relative(root, outPng96),
    path.relative(root, outIco),
  );
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

