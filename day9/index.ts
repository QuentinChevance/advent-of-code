const fs = require('fs')
const es = require('event-stream')

type Direction = 'R' | 'L' | 'U' | 'D'

function parseInput(path) {
    let input: [Direction, number][] = []
    let i = 0
    const stream = fs
        .createReadStream(path, { flags: 'r' })
        .pipe(es.split())
        .pipe(
            es.map(function (line: string, cb) {
                const [direction, steps] = line.split(' ')
                input[i++] = [direction as Direction, Number(steps)]
                cb(null, line)
            })
        )

    stream.on('end', () => {
        const firstResult = firstPart(input)
        const secondResult = secondPart(input)

        console.timeEnd('time')
        console.table({
            'First result': firstResult,
            'Second result': secondResult,
        })
    })
}

interface Position {
    x: number
    y: number
}

const s: Position = {
    x: 0,
    y: 0,
}
interface TailHeadPosition {
    H: Position
    T: Position
}

interface RopePosition {
    H: Position
    B: BodyPositions
}

type BodyPositions = [
    Position,
    Position,
    Position,
    Position,
    Position,
    Position,
    Position,
    Position,
    Position
]

const getNewTailPosition = ({ H, T }: TailHeadPosition) => {
    let newTailPosition: Position = { ...T }
    const xDiff = H.x - T.x
    const yDiff = H.y - T.y
    if (Math.abs(xDiff) === 2 && Math.abs(yDiff) === 1) {
        if (yDiff === 1) {
            newTailPosition.y++
        } else {
            newTailPosition.y--
        }
    }
    if (Math.abs(xDiff) === 1 && Math.abs(yDiff) === 2) {
        if (xDiff === 1) {
            newTailPosition.x++
        } else {
            newTailPosition.x--
        }
    }
    if (xDiff === 2) {
        newTailPosition.x++
    }
    if (yDiff === 2) {
        newTailPosition.y++
    }
    if (xDiff === -2) {
        newTailPosition.x--
    }
    if (yDiff === -2) {
        newTailPosition.y--
    }
    return newTailPosition
}

const getNewHeadPosition = (lastPos: Position, direction: Direction) => {
    let newHPosition = { ...lastPos }
    switch (direction) {
        case 'R':
            newHPosition = {
                ...lastPos,
                x: lastPos.x + 1,
            }
            break
        case 'L':
            newHPosition = {
                ...lastPos,
                x: lastPos.x - 1,
            }
            break
        case 'U':
            newHPosition = {
                ...lastPos,
                y: lastPos.y + 1,
            }
            break
        case 'D':
            newHPosition = {
                ...lastPos,
                y: lastPos.y - 1,
            }
            break

        default:
            break
    }
    return newHPosition
}

const firstPart = (input: [Direction, number][]) => {
    let positions: TailHeadPosition[] = [
        {
            H: s,
            T: s,
        },
    ]
    input.forEach(([direction, steps]) => {
        for (let i = 0; i < steps; i++) {
            const lastPos = positions[positions.length - 1]
            const newHPosition = getNewHeadPosition(lastPos.H, direction)
            positions.push({
                H: newHPosition,
                T: getNewTailPosition({ H: newHPosition, T: lastPos.T }),
            })
        }
    })
    const visitedPositions: Position[] = []
    positions.forEach((position) => {
        visitedPositions.some(
            (visitedPosition) =>
                visitedPosition.x === position.T.x &&
                visitedPosition.y === position.T.y
        ) || visitedPositions.push(position.T)
    })
    return visitedPositions.length
}

const secondPart = (input: [Direction, number][]) => {
    let positions: RopePosition[] = [
        {
            H: s,
            B: [s, s, s, s, s, s, s, s, s],
        },
    ]
    input.forEach(([direction, steps]) => {
        for (let i = 0; i < steps; i++) {
            const lastPos = positions[positions.length - 1]
            const newHPosition = getNewHeadPosition(lastPos.H, direction)
            const newPosB: BodyPositions = [...lastPos.B]
            for (let j = 0; j < lastPos.B.length; j++) {
                newPosB[j] = getNewTailPosition({
                    H: j === 0 ? newHPosition : newPosB[j - 1],
                    T: newPosB[j],
                })
            }
            positions.push({
                H: newHPosition,
                B: newPosB,
            })
        }
    })
    const visitedPositions: Position[] = []
    positions.forEach((position) => {
        const [tail] = position.B.slice(-1)
        visitedPositions.some(
            (visitedPosition) =>
                visitedPosition.x === tail.x && visitedPosition.y === tail.y
        ) || visitedPositions.push(tail)
    })
    return visitedPositions.length
}

console.time('time')
parseInput('./data.txt')

export {}
