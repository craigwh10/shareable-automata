import Head from 'next/head'
import { useEffect, useState } from 'react';
import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";

import { AutomataGrid, conwaysGameOfLifePreset } from 'cellular-automata-react'

import { compression } from '../utils/compression';

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
  }

  useEffect(() => {
    reset();

    if (!process.env?.NEXT_PUBLIC_AN_APIKEY) {
      return;
    }

    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_AN_APIKEY,
      authDomain: "shareable-automata.firebaseapp.com",
      projectId: "shareable-automata",
      storageBucket: "shareable-automata.appspot.com",
      messagingSenderId: process.env.NEXT_PUBLIC_AN_MSID,
      appId: process.env.NEXT_PUBLIC_AN_APPID,
      measurementId: process.env.NEXT_PUBLIC_AN_MID
    };
  
  
    if (typeof window !== 'undefined') {
      const app = initializeApp(firebaseConfig);
      const analytics = getAnalytics(app);

      logEvent(analytics, 'entry')
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
              <button data-testid="copy-link-btn" onClick={() => {
                copyLink(
                  `${window.location.protocol}//${window.location.host}?withAutoplay=${
                    sendWithAutoPlay
                  }&pattern=${
                    compression.deflateString(initialGrid)
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
