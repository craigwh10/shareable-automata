import pako from 'pako';
import base64url from 'base64url';

const compression = {
  deflateString: (data: number[][]) => {
    const stringifiedData = JSON.stringify(data);
    const inputArray = new TextEncoder().encode(stringifiedData);

    const res = pako.deflate(inputArray);
    const buffer = Buffer.from(res);
    return base64url.encode(buffer);
  },
  inflateString: (string: string) => {
    const gzipped = base64url.toBuffer(string);

    const inflatedUint8Array = pako.inflate(gzipped);

    const inflatedString = new TextDecoder().decode(inflatedUint8Array);

    const inflatedData = JSON.parse(inflatedString) as number[][];

    return inflatedData;
  },
};

export { compression };