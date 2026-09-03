import sharp from "sharp";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const source = readFileSync(new URL("../public/avatar/avataridle-calm.gif", import.meta.url));
const metadata = await sharp(source, { limitInputPixels: false }).metadata();
const width = 240;
const height = 432;
const frames = [];
sharp.cache({ memory: 32 });
await sharp(source, { page: 0, pages: 1 })
  .extract({ left: 680, top: 0, width: 600, height: 1080 })
  .resize(width, height).webp({ quality: 88 })
  .toFile(fileURLToPath(new URL("../public/avatar/portrait-still.webp", import.meta.url)));
for (let page = 0; page < metadata.pages; page++) {
  frames.push(await sharp(source, { page, pages: 1 })
    .extract({ left: 680, top: 0, width: 600, height: 1080 })
    .resize(width, height).ensureAlpha().raw().toBuffer());
  if (page % 60 === 0) console.log(`Processed ${page + 1}/${metadata.pages} frames`);
}
await sharp(Buffer.concat(frames), {
  raw: { width, height: height * frames.length, channels: 4, pageHeight: height },
  limitInputPixels: false,
}).webp({ quality: 78, effort: 3, loop: 0, delay: metadata.delay })
  .toFile(fileURLToPath(new URL("../public/avatar/portrait-idle.webp", import.meta.url)));
console.log("Saved optimized avatar with original timing and transparency.");
