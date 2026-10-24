type Dimensions = { width?: number; height?: number };

export function readImageDimensions(buffer: Buffer): Dimensions {
  if (buffer.length >= 24 && buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  if (buffer.length >= 30 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP" && buffer.toString("ascii", 12, 16) === "VP8X") return { width: 1 + buffer.readUIntLE(24, 3), height: 1 + buffer.readUIntLE(27, 3) };
  if (buffer.length >= 4 && buffer[0] === 0xff && buffer[1] === 0xd8) return readJpegDimensions(buffer);
  return {};
}

function readJpegDimensions(buffer: Buffer): Dimensions {
  let offset = 2;
  let segments = 0;
  while (offset + 9 < buffer.length && segments < 512) {
    if (buffer[offset] !== 0xff) { offset += 1; continue; }
    const marker = buffer[offset + 1];
    const length = buffer.readUInt16BE(offset + 2);
    if (!length || offset + 2 + length > buffer.length) return {};
    const isFrame = (marker >= 0xc0 && marker <= 0xc3) || (marker >= 0xc5 && marker <= 0xc7) || (marker >= 0xc9 && marker <= 0xcb) || (marker >= 0xcd && marker <= 0xcf);
    if (isFrame) return { width: buffer.readUInt16BE(offset + 7), height: buffer.readUInt16BE(offset + 5) };
    offset += 2 + length;
    segments += 1;
  }
  return {};
}
