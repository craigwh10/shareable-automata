import Head from 'next/head'
import { ReactElement, useContext, useEffect, useState } from 'react';

import { AutomataGrid } from '@/modules/AutomataGrid';
import { compression } from '../utils/compression';
import { useGrid, useShareGridLink } from '@/context/GridContext';

export default function Home() {
  const { togglePlaying, loading, playing, state } = useGrid()
  const { link, setSendWithAutoPlay, sendWithAutoPlay } = useShareGridLink();

  const fullReset = () => {
    window.location.href =  window.location.href.split("?")[0];
  }

  const handleSendAutoPlay = () => {
    setSendWithAutoPlay((autoplay) => !autoplay);
  }

  if (loading) {
    return <p>Loading</p>
  }

  return (
    <>
      <Head>
        <title>Shareable Automata</title>
        <meta name="description" content="Share automata variants with each other" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className='main'>
        <div style={{margin: 'auto'}}>
          <p>{playing ? 'Click clear to start over and make your own' : 'Click anywhere on box to make pixels alive.'}</p>
          <p>You can either play the simulation for yourself, or send it to someone else.</p>
        </div>
        <div className='grid-container'>
          <div className='grid-container__inner'>
            <AutomataGrid
              initialGrid={state}
              playing={playing}
            />
          </div>
          <div className="controls">
            <div className='button-group'>
              <button onClick={togglePlaying} disabled={playing || !state.length}>Play automata</button>
              <button onClick={fullReset} disabled={!state.length}>Start over</button>
            </div>
            <div className='shareables'>
              <div className='button-group button-share'>
                  <button onClick={handleSendAutoPlay} style={{
                    backgroundColor: sendWithAutoPlay ? 'green' : 'red',
                    border: 0,
                    width: 150,
                  }}>Autoplay ({sendWithAutoPlay ? 'ON' : 'OFF'})</button>
                  <input data-testid="copy-link-btn" readOnly value={link} />
              </div>
            </div>
          </div>
        </div>
        <div className='footer'>
          <a href="https://craigwh.it" target='_blank'>Made by craigwh.it</a>
          <a href="https://github.com/craigwh10/shareable-automata" target='_blank'>Repository</a>
          <a href="https://www.npmjs.com/package/cellular-automata-react" target='_blank'>NPM Package</a>
        </div>
        <div style={{margin: 'auto', color: 'white', paddingTop: '2em'}}>
          Examples:
          <ul>
            <li><a style={{color: 'aqua'}} href="https://shareable-automata.vercel.app/?withAutoplay=true&pattern=eJxFjssNwDAIQxfiEEObzyxR9l-jxEbqxU9YGLx3WBzbcMJtpT4GJF6DJ4awBLSiG9plMAL89s12jVMI7Q7r9DrPSQd10p_cuZrX2AYKq4yaVYf6qQaoz-d8XUEyCw">Smiley face</a></li>
            <li><a style={{color: 'aqua'}} href="https://en.wikipedia.org/wiki/Gun_(cellular_automaton)" target="_blank">"Glider gun"</a></li>
          </ul>
        </div>
      </main>
    </>
  )
}
