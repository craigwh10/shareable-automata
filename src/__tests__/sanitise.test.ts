import { sanitize } from "../utils/compression";

describe.skip('sanitise test', () => {
    it('null edge case', () => {
        expect(sanitize(null as unknown as string)).toBe([])
    })
    it('undefined edge case', () => {
        expect(sanitize(undefined as unknown as string)).toBe([])
    })
    it('regular large array', () => {
        const regular = '[[3,3],[12,3],[2,9],[4,11],[5,12],[7,12],[9,12],[10,12],[12,10],[13,9],[11,12],[12,11],[6,12],[8,12],[3,10],[7,6],[8,6],[9,6],[9,7],[9,8],[8,8],[7,8],[1,1],[2,1],[3,1],[5,1],[4,1],[10,1],[11,1],[13,1],[12,1]]';
        expect(
            sanitize(regular)
        ).toBe(regular)
    })
    it('1x1 array', () => {
        const regular = '[[3,3]]';

        expect(
            sanitize(regular)
        ).toBe(regular)
    })

    it('1x2 array', () => {
        const regular = '[[3,3], [3,2]]';
        
        expect(
            sanitize(regular)
        ).toBe(regular)
    })
})