const fs = require('fs')
const es = require('event-stream')

function parseInput(path) {
    let input: string[][] = [[]]
    let i = 0
    const stream = fs
        .createReadStream(path, { flags: 'r' })
        .pipe(es.split())
        .pipe(
            es.map(function (line: string, cb) {
                input[i] = [line[0], line[2]]
                i++
                cb(null, line)
            })
        )

    stream.on('end', () => {
        const firstResult = firstPart(input)
        const secondResult = secondPart(input)

        console.table({
            'First result': firstResult,
            'Second result': secondResult,
        })
    })
}

/**
 * A, X -> Rock
 * B, Y -> Paper
 * C, Z -> Scissors
 */

const winsOver = {
    X: 'C',
    Y: 'A',
    Z: 'B',
}

const losesAgainst = {
    X: 'B',
    Y: 'C',
    Z: 'A',
}

const drawsAgainst = {
    X: 'A',
    Y: 'B',
    Z: 'C',
}

const reasonScore = {
    X: 1,
    Y: 2,
    Z: 3,
}

const resultScore = {
    win: 6,
    draw: 3,
    lose: 0,
}

const shouldLose = (round) => round[1] === 'X'

const shouldWin = (round) => round[1] === 'Z'

const hasWon = (round) => {
    return round[0] === winsOver[round[1]]
}

const hasLost = (round) => {
    return round[0] === losesAgainst[round[1]]
}

function getKeyByValue(object: {}, value: string) {
    return Object.keys(object).find((key) => object[key] === value) || ''
}

const firstPart = (data) => {
    return data.reduce((prevRes, round) => {
        if (hasWon(round)) {
            return prevRes + resultScore.win + reasonScore[round[1]]
        }
        if (hasLost(round)) {
            return prevRes + resultScore.lose + reasonScore[round[1]]
        }
        return prevRes + resultScore.draw + reasonScore[round[1]]
    }, 0)
}

const secondPart = (data) => {
    return data.reduce((prevRes, round) => {
        if (shouldLose(round)) {
            return (
                prevRes +
                resultScore.lose +
                reasonScore[getKeyByValue(losesAgainst, round[0])]
            )
        }
        if (shouldWin(round)) {
            return (
                prevRes +
                resultScore.win +
                reasonScore[getKeyByValue(winsOver, round[0])]
            )
        }
        return (
            prevRes +
            resultScore.draw +
            reasonScore[getKeyByValue(drawsAgainst, round[0])]
        )
    }, 0)
}

console.time('time')
parseInput('./data.txt')
console.timeEnd('time')

export {}
