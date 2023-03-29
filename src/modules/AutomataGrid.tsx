import { conwaysGameOfLifePreset, AutomataGrid as Grid } from "cellular-automata-react"

interface AutomataGridProp {
    playing: boolean;
    initialGrid: Array<Array<number>>;
}

export const AutomataGrid = ({playing, initialGrid}: AutomataGridProp) => {
    if (playing) {
        return <Grid
          key={'grid-that-runs'}
          pixelsActive={initialGrid as Array<[number, number]>}
          iterationTimeInMs={1000}
          rules={conwaysGameOfLifePreset}
          size={{
            xWidth: 16,
            yWidth: 16
          }}
          pixelStyles={{
            width: '30px',
            height: '30px',
            backgroundColor: 'inherit'
          } as any} 
        />
    }
    if (!playing) {
        return <Grid
        key={'canvas-grid'}
        pixelsActive={initialGrid as Array<[number, number]>}
        iterationTimeInMs={10000000000}
        rules={conwaysGameOfLifePreset}
        size={{
          xWidth: 16,
          yWidth: 16
        }}
        pixelStyles={{
          width: '30px',
          height: '30px',
          backgroundColor: 'inherit'
        } as any} 
      />
    }
    return null;
}