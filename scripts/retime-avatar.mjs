import { readFileSync, writeFileSync } from "node:fs";

const source = new URL("../public/avatar/avataridleV2.gif", import.meta.url);
const output = new URL("../public/avatar/avataridle-calm.gif", import.meta.url);
const data = Buffer.from(readFileSync(source));
if (!/^GIF8[79]a$/.test(data.toString("ascii", 0, 6))) throw new Error("Invalid GIF");
let offset = 13;
if (data[10] & 0x80) offset += 3 * (2 ** ((data[10] & 7) + 1));
let frames = 0;
let timings = 0;
const skipBlocks = () => {
  while (offset < data.length) {
    const size = data[offset++];
    if (size === 0) return;
    offset += size;
  }
  throw new Error("Truncated GIF blocks");
};
while (offset < data.length && data[offset] !== 0x3b) {
  if (data[offset] === 0x21) {
    if (data[offset + 1] === 0xf9) {
      if (data[offset + 2] !== 4) throw new Error("Invalid frame control");
      // GIF frame delays are stored in hundredths of a second.
      data.writeUInt16LE(Math.max(4, data.readUInt16LE(offset + 4)), offset + 4);
      timings++;
    }
    offset += 2;
    skipBlocks();
  } else if (data[offset] === 0x2c) {
    const packed = data[offset + 9];
    offset += 10;
    if (packed & 0x80) offset += 3 * (2 ** ((packed & 7) + 1));
    offset++;
    skipBlocks();
    frames++;
  } else {
    throw new Error(`Unexpected GIF block at ${offset}`);
  }
}
if (data[offset] !== 0x3b || !frames || timings !== frames) throw new Error("Incomplete GIF");
writeFileSync(output, data);
console.log(`Retimed ${frames} frames to at most 25 FPS; original preserved.`);
