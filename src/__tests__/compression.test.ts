import { compression } from "../utils/compression";

describe('compression flow', () => {
    test('full flow - simple', () => {
        const data = [[1,1], [2,1], [3,4]];

        const base64 = compression.deflateString(data);

        const returnedData = compression.inflateString(base64);

        expect(returnedData).toEqual(data);
    })
    test('full flow - complex', () => {
        const data = [[1,1], [2,1], [3,4], [4,3], [0,0], [11,12], [44,32], [34,2], [0,1]];

        const base64 = compression.deflateString(data);

        const returnedData = compression.inflateString(base64);

        expect(returnedData).toEqual(data);
    })
    test('unpacks large case - should not error', () => {
        const eg = 'LY7LFQAhCAMb4iAfP1uLz/7bWBy8TDSQ6N5d5pEdMmAkP6gNa8lKTs5DHMdYulTHSuEWoiVecptVaVCjIluVppb0Wn9kTMRJBHTpSasv0Wu81eGsrJXc+fkB';

        const inflated = compression.inflateString(eg);

        expect(inflated).toEqual(
            [[5,7],[4,6],[4,4],[9,4],[10,6],[8,8],[7,6],[6,3],[8,2],[9,2],[13,3],[13,2],[14,1],[14,3],[14,7],[11,8],[12,6],[10,1],[6,0],[3,1],[1,1],[1,6],[1,7],[3,8],[4,8],[3,5],[2,4],[1,3],[2,2],[5,2],[7,1],[12,1],[11,3]]
        )
        
    })
    test('unpacks a base64', () => {
      const eg = 'Nc/LDcQgDEXRhtj4g52pBdF/G0PuI5tzJbCJslaM3GM52jU48WMMO+bVMTCxcGIfi8nGB39Xx8DkNplMtuTEwua2mWy2Xs2+lDKVVEJx5f2wuaIfsfziSiipTKWU1l7rld77Dw==';

      const inflated = compression.inflateString(eg);

      expect(inflated).toEqual(
        [
            [ 3, 4 ],  [ 2, 4 ],  [ 1, 4 ],  [ 1, 3 ],
            [ 2, 2 ],  [ 3, 1 ],  [ 4, 1 ],  [ 4, 2 ],
            [ 4, 3 ],  [ 4, 4 ],  [ 4, 6 ],  [ 4, 5 ],
            [ 4, 7 ],  [ 6, 1 ],  [ 7, 1 ],  [ 8, 1 ],
            [ 9, 1 ],  [ 9, 2 ],  [ 9, 3 ],  [ 9, 4 ],
            [ 8, 4 ],  [ 7, 4 ],  [ 6, 4 ],  [ 6, 5 ],
            [ 6, 6 ],  [ 6, 7 ],  [ 7, 7 ],  [ 8, 7 ],
            [ 9, 7 ],  [ 11, 7 ], [ 11, 6 ], [ 11, 5 ],
            [ 11, 4 ], [ 11, 3 ], [ 11, 2 ], [ 11, 1 ],
            [ 12, 1 ], [ 13, 1 ], [ 14, 1 ], [ 14, 2 ],
            [ 14, 3 ], [ 14, 4 ], [ 14, 5 ], [ 14, 6 ],
            [ 14, 7 ], [ 13, 7 ], [ 12, 7 ]
          ]
      );
    });
  });