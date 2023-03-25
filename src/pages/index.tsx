import Head from 'next/head'
import { useEffect, useState } from 'react';
import { AutomataGrid, conwaysGameOfLifePreset } from 'cellular-automata-react'

import pako from 'pako';

export default function Home() {
  const [initialGrid, setInitialGrid] = useState<Array<Array<number>>>([]);
  const [loading, setLoading] = useState(true);
  const [playing, setIsPlaying] = useState(false);
  const [sendWithAutoPlay, setSendWithAutoPlay] = useState(true);

  const togglePlaying = () => {
    setIsPlaying((prev) => !prev);
  }

  const copyLink = (link: string) => {
    navigator.clipboard.writeText(link).then(() => {
      alert('link copied to clip board.')
    });
  }
  
  const deflateString = (data: number[][]) => {
    const stringifiedData = JSON.stringify(data);
    const inputArray = new TextEncoder().encode(stringifiedData);

    const res = pako.deflateRaw(inputArray);
    const buffer = Buffer.from(res);
    return buffer.toString('base64');
  }

  const inflateString = (string: string) => {
    const gzipped = atob(string);
    const decodedArrayBuffer = Uint8Array.from((gzipped), c => c.charCodeAt(0)).buffer;

    const inflatedUint8Array = pako.inflateRaw(decodedArrayBuffer);
    const inflatedString = new TextDecoder().decode(inflatedUint8Array);
  
    const inflatedData = JSON.parse(inflatedString) as number[][];
  
    return inflatedData;
  }

  const hasCoordinate = (coordArray: number[]) => (coord: number[]) => {
    const firstEqual = coord[0] === coordArray[0];
    const secondEqual = coord[1] === coordArray[1];
    return firstEqual && secondEqual;
  }

  const fullReset = () => {
    window.location.href =  window.location.href.split("?")[0];
  }

  const handleSendAutoPlay = () => {
    setSendWithAutoPlay((autoplay) => !autoplay);
  }

  const reset = () => {
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
        const asJS = inflateString(pattern)
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
            console.log(coordinates)
            const xN = coordinates[1];
            const yN = coordinates[2];
            const coordArray = [Number(xN.replace('x', '')), Number(yN.replace('y', ''))];
      
            console.log(coordArray);
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
          <div className='button-group'>
            <button onClick={togglePlaying} disabled={playing}>Play automata</button>
            <button onClick={fullReset}>Clear</button>
          </div>
          <p>Click on red box to set initial pixels.</p>
        </div>
        <div className='grid-container'>
          {playing && !loading && (
            <AutomataGrid
              key={'grid-that-runs'}
              pixelsActive={initialGrid as Array<[number, number]>}
              iterationTimeInMs={1000}
              rules={conwaysGameOfLifePreset}
              size={{
                xWidth: 16,
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
                xWidth: 16,
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
        {!loading && <div className='shareables'>
          <div className='button-group button-share'>
              <button onClick={handleSendAutoPlay} style={{
                backgroundColor: sendWithAutoPlay ? 'green' : 'red',
                border: 0
              }}>Share with autoplay</button>
              <button onClick={() => {
                copyLink(
                  `${window.location.protocol}//${window.location.host}?withAutoplay=${
                    sendWithAutoPlay
                  }&pattern=${
                    deflateString(initialGrid)
                  }`)
              }}>Copy share link</button>
          </div>
        </div>}
        {!loading && <div className='footer'>
          <a href="https://craigwh.it" target='_blank'>Made by craigwh.it</a>
          <a href="https://github.com/craigwh10/shareable-automata" target='_blank'>Repository</a>
          <a href="https://www.npmjs.com/package/cellular-automata-react" target='_blank'>NPM Package</a>
        </div>}
      </main>
    </>
  )
}
