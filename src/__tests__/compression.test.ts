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
    test('returns empty array for errored cases', () => {
        const eg = 'LY7LFQAhCAMb4iAfP1uLz/7bWBy8TDSQ6N5d5pEdMmAkP6gNa8lKTs5DHMdYulTHSuEWoiVecptVaVCjIluVppb0Wn9kTMRJBHTpSasv0Wu81eGsrJXc+fkB';

        const inflated = compression.inflateString(eg);

        expect(inflated).toEqual(
            [[]]
        ) 
    })
    test('unpacks large case - should not error', () => {
        const eg = 'eJxFjssNwDAIQxfiEEObzyxR9l-jxEbqxU9YGLx3WBzbcMJtpT4GJF6DJ4awBLSiG9plMAL89s12jVMI7Q7r9DrPSQd10p_cuZrX2AYKq4yaVYf6qQaoz-d8XUEyCw';

        const inflated = compression.inflateString(eg);

        expect(inflated).toEqual(
            [[3,3],[12,3],[2,9],[4,11],[5,12],[7,12],[9,12],[10,12],[12,10],[13,9],[11,12],[12,11],[6,12],[8,12],[3,10],[7,6],[8,6],[9,6],[9,7],[9,8],[8,8],[7,8],[1,1],[2,1],[3,1],[5,1],[4,1],[10,1],[11,1],[13,1],[12,1]]
        )
        
    })
  });