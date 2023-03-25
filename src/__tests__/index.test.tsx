import { render, fireEvent, waitFor, screen, cleanup} from '@testing-library/react';
import Home from '../pages/index';
import { compression } from '../utils/compression';
import React from 'react';

describe('flow', () => {
    Object.assign(navigator, {
        clipboard: {
          writeText: () => {},
        },
    });

    beforeEach(() => {
        jest.resetAllMocks();
        cleanup();

        jest.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
        jest.spyOn(window, 'alert').mockImplementation(() => {});
        render(<Home />);
    })

    it('should return copiable link when clicking 3 pixels and copy link button', async () => {
        const data = [[1,1], [2,1], [3,4]];

        const testIds = data.map((item) => {
            return `pixel-x${item[0]}-y${item[1]}`;
        })

        const pixelsToClick = testIds.map((testid) => {
            return screen.getByTestId(testid);
        });

        pixelsToClick.forEach((pixel) => {
            fireEvent.click(pixel);
        })

        const button = screen.getByTestId('copy-link-btn');

        fireEvent.click(button);

        await waitFor(() => {
            expect(navigator.clipboard.writeText).toHaveBeenCalledWith(link(data));
        })
    })

    it('previously errored case', async () => {
        const data = [[5,7],[4,6],[4,4],[9,4],[10,6],[8,8],[7,6],[6,3],[8,2],[9,2],[13,3],[13,2],[14,1],[14,3],[14,7],[11,8],[12,6],[10,1],[6,0],[3,1],[1,1],[1,6],[1,7],[3,8],[4,8],[3,5],[2,4],[1,3],[2,2],[5,2],[7,1],[12,1],[11,3]];

        const testIds = data.map((item) => {
            return `pixel-x${item[0]}-y${item[1]}`;
        })

        const pixelsToClick = testIds.map((testid) => {
            return screen.getByTestId(testid);
        });

        pixelsToClick.forEach((pixel) => {
            fireEvent.click(pixel);
        })

        const button = screen.getByTestId('copy-link-btn');

        fireEvent.click(button);

        await waitFor(() => {
            expect(navigator.clipboard.writeText).toHaveBeenCalledWith(link(data));
        })
    })

    it('should return copiable link when clicking many pixels and copy link button', async () => {
        const data = [
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
        ];

        const testIds = data.map((item) => {
            return `pixel-x${item[0]}-y${item[1]}`;
        })

        const pixelsToClick = testIds.map((testid) => {
            return screen.getByTestId(testid);
        });

        pixelsToClick.forEach((pixel) => {
            fireEvent.click(pixel);
        })

        const button = screen.getByTestId('copy-link-btn');

        fireEvent.click(button);

        await waitFor(() => {
            expect(navigator.clipboard.writeText).toHaveBeenCalledWith(link(data));
        })
    })
})

function link (data: number[][], withAutoplay: boolean = true) {
    const compressed = compression.deflateString(data);

    const linkToBe = `http://localhost?withAutoplay=${withAutoplay}&pattern=${compressed}`;

    return linkToBe;
}