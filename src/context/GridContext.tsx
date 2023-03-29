import { compression } from "@/utils/compression";
import { createContext, useContext, useEffect, useState } from "react";

type Grid = Array<Array<number>>;
interface GridState {
    state: Grid;
    playing: boolean;
    loading: boolean;
    togglePlaying: () => void | null
}
const GridContext = createContext<GridState>({
    state: [],
    playing: false,
    loading: false,
    togglePlaying: () => {},
})

export function GridContextProvider({ children }: { children: React.ReactNode }) {
    const [initialGrid, setInitialGrid] = useState<Array<Array<number>>>([]);
    const [loading, setLoading] = useState(true);
    const [playing, setIsPlaying] = useState(false);
    
    const togglePlaying = () => {
        setIsPlaying((prev) => !prev);
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URL(document.location.href).searchParams;
            const pattern = params.get("pattern");
            const withAutoplay = params.get("withAutoplay");
      
            if (!pattern) {
              document.querySelectorAll('[data-testid^="pixel-"]').forEach((node) => {
                node.setAttribute('class', 'automata-grid-element');
              })
              setIsPlaying(false);
              setInitialGrid([]);
              setLoading(false);
              return;
            }
      
            if (pattern) {
              const asJS = compression.inflateString(pattern)
              asJS.forEach((item: number[]) => {
                const pixel = document.querySelector(`[data-testid="pixel-x${item[0]}-y${[1]}"]`);
                if (pixel) {
                  pixel.setAttribute('class', 'automata-grid-element automata-grid-element-alive')
                }
              })
              setInitialGrid(asJS);
              setIsPlaying(Boolean(withAutoplay))
              setLoading(false);
            }
          
          }
    }, [])


  let handlersAndNode: any[][] = [];

  useEffect(() => {
    if (!loading) {
      document.querySelectorAll('[data-testid^="pixel-"]').forEach((node) => {
        const clickPixelHandler = () => {
            const fullTestId = node.attributes.item(0)?.value;
      
            const coordinates = fullTestId?.split('-') as string[];
            const xN = coordinates[1];
            const yN = coordinates[2];
            const coordArray = [Number(xN.replace('x', '')), Number(yN.replace('y', ''))];
      
            setInitialGrid((prevState) => {
                if (!prevState.find(hasCoordinate(coordArray))) {
                  node.setAttribute('class', 'automata-grid-element automata-grid-element-alive');
                  return [
                    ...prevState,
                    coordArray
                  ]
              }
      
              return prevState;
            }) // setInitialGrid
        }

        // necessary - can't use window, handlers have scope.
        // node is scope for clickPixel ref
        handlersAndNode.push([node, clickPixelHandler]);

        node.addEventListener('click', clickPixelHandler) // click
       }) // query
    }

    return () => {
      handlersAndNode.forEach((handler) => {
        handler[0].removeEventListener('click', handler[1]);
      })
    }
  }, [loading, playing])

  useEffect(() => {
    if (playing) {
      handlersAndNode.forEach((handler) => {
        handler[0].removeEventListener('click', handler[1]);
      })
    }
  }, [playing])

  const context = {
    state: initialGrid,
    playing: playing,
    loading: loading,
    togglePlaying
  }

  return <GridContext.Provider value={context}>{children}</GridContext.Provider>
}

export function useGrid() {
    const pageContext = useContext(GridContext)
    return pageContext
}

export function useShareGridLink () {
    const [sendWithAutoPlay, setSendWithAutoPlay] = useState(true);
    const { state } = useGrid();
    const [link, setLink] = useState('');

    useEffect(() => {
        // synchronise grid state with active link.
        setLink(`${window.location.protocol}//${window.location.host}?withAutoplay=${
            sendWithAutoPlay
          }&pattern=${
            compression.deflateString(state)
          }`)
    }, [state])

    return {link, setSendWithAutoPlay, sendWithAutoPlay};
}

const hasCoordinate = (coordArray: number[]) => (coord: number[]) => {
    const firstEqual = coord[0] === coordArray[0];
    const secondEqual = coord[1] === coordArray[1];
    return firstEqual && secondEqual;
};