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
    try {
      const gzipped = base64url.toBuffer(string);

      const inflatedUint8Array = pako.inflate(gzipped);
  
      const inflatedString = new TextDecoder().decode(inflatedUint8Array);
  
      const inflatedData = JSON.parse(inflatedString) as number[][];
  
      return inflatedData;
    } catch (err) {
      return [[]];
    }
  },
};

/**
 * @deprecated
 */
export const sanitize = (data: string | null | undefined) => {
  if (typeof data !== 'string') {
    return [];
  }

  // regex shows whitelisted values, [ , ] digit
  if (!data.search(/^[,\[\]\d]+$/g)) {
    return [];
  }
  return data;
}

export { compression };