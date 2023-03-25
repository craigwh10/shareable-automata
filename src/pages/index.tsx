import Head from 'next/head'
import { useEffect, useState } from 'react';
import { AutomataGrid, conwaysGameOfLifePreset } from 'cellular-automata-react'

export default function Home() {
  const [initialGrid, setInitialGrid] = useState<Array<Array<number>>>([]);
  const [loading, setLoading] = useState(true);
  const [playing, setIsPlaying] = useState(false);

  const togglePlaying = () => {
    setIsPlaying((prev) => !prev);
  }

  const copyLink = (link: string) => {
    navigator.clipboard.writeText(link).then(() => {
      alert('link copied to clip board.')
    });
  }

  const hasCoordinate = (coordArray: number[]) => (coord: number[]) => {
    const firstEqual = coord[0] === coordArray[0];
    const secondEqual = coord[1] === coordArray[1];
    return firstEqual && secondEqual;
  }

  const fullReset = () => {
    window.location.href =  window.location.href.split("?")[0];
  }

  const reset = () => {
    if (typeof window !== 'undefined') {
      const base64InitialState = window?.location?.search.split('?pattern=')[1];

      if (!base64InitialState) {
        document.querySelectorAll('[data-testid^="pixel-"]').forEach((node) => {
          node.setAttribute('class', 'automata-grid-element');
        })
        setIsPlaying(false);
        setInitialGrid([]);
        setLoading(false);
        return;
      }

      if (base64InitialState) {
        const asJS = JSON.parse(atob(base64InitialState));
        asJS.forEach((item: number[]) => {
          const pixel = document.querySelector(`[data-testid="pixel-x${item[0]}-y${[1]}"]`);
          if (pixel) {
            pixel.setAttribute('class', 'automata-grid-element automata-grid-element-alive')
          }
        })
        setInitialGrid(JSON.parse(atob(base64InitialState)));
        setLoading(false);
      }
    
    }
  }

  useEffect(() => {
    reset();
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
            const coordArray = [Number(xN[1]), Number(yN[1])];
      
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

  return (
    <>
      <Head>
        <title>Shareable Automata</title>
        <meta name="description" content="Share automata variants with each other" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className='main'>
        <div>
          <button onClick={togglePlaying} disabled={playing}>Play</button>
          <button onClick={fullReset}>Clear</button>
          <button onClick={() => {
            copyLink(`${window.location.protocol}//${window.location.host}?pattern=${btoa(JSON.stringify(initialGrid)).toString()}`)
          }}>Copy share link</button>
        </div>
        <div className='grid-container'>
          {playing && !loading && (
            <AutomataGrid
              key={'grid-that-runs'}
              pixelsActive={initialGrid as Array<[number, number]>}
              iterationTimeInMs={1000}
              rules={conwaysGameOfLifePreset}
              size={{
                xWidth: 10,
                yWidth: 10
              }}
              pixelStyles={{
                width: '30px',
                height: '30px',
                backgroundColor: 'inherit'
              } as any} 
            />
          )}

          {!playing && !loading && (
            <AutomataGrid
              key={'canvas-grid'}
              pixelsActive={initialGrid as Array<[number, number]>}
              iterationTimeInMs={10000000000}
              rules={conwaysGameOfLifePreset}
              size={{
                xWidth: 10,
                yWidth: 10
              }}
              pixelStyles={{
                width: '30px',
                height: '30px',
                backgroundColor: 'inherit'
              } as any} 
            />
          )}
        </div>
      </main>
    </>
  )
}
