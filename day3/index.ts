const fs = require('fs')
const es = require('event-stream')

function parseInput(path) {
    let inputFirstPart: string[][][] = []
    let inputSecondPart: string[][][] = [[]]
    let iSecondPart = 0
    let i = 0
    const stream = fs
        .createReadStream(path, { flags: 'r' })
        .pipe(es.split())
        .pipe(
            es.map(function (line: string, cb) {
                inputFirstPart[i++] = [
                    [...line.slice(0, line.length / 2)],
                    [...line.slice(line.length / 2, line.length)],
                ]
                inputSecondPart[iSecondPart].push([...line])
                if (i % 3 === 0) {
                    inputSecondPart[++iSecondPart] = []
                }
                cb(null, line)
            })
        )

    stream.on('end', () => {
        const firstResult = firstPart(inputFirstPart)
        const secondResult = secondPart(inputSecondPart)

        console.table({
            'First result': firstResult,
            'Second result': secondResult,
        })
    })
}

const alphabet = [...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ']

const scoreOfLetter = (letter: string) =>
    alphabet.findIndex((char) => char === letter) + 1

const firstPart = (data: string[][][]) => {
    return data.reduce(
        (prev, compartment) =>
            prev +
            scoreOfLetter(
                compartment[0].filter(function (n) {
                    return compartment[1].indexOf(n) !== -1
                })[0]
            ),
        0
    )
}

const secondPart = (data: string[][][]) => {
    data.pop()
    return data.reduce(
        (prev, d) =>
            prev +
            scoreOfLetter(
                d.reduce((p, c) => p.filter((e) => c.includes(e)))[0]
            ),
        0
    )
}

console.time('time')
parseInput('./data.txt')
console.timeEnd('time')

export {}
