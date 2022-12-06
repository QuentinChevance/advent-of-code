const fs = require('fs')
const es = require('event-stream')

function parseInput(path) {
    let input = ''
    const stream = fs
        .createReadStream(path, { flags: 'r' })
        .pipe(es.split())
        .pipe(
            es.map(function (line: string, cb) {
                input = line
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

const compute = (input: string, distinctCharacters: number) => {
    let data = [...input]
    let j = 0
    for (let i = 0; i < data.length; i++) {
        const set = new Set(
            [...Array(distinctCharacters).keys()].map((y) => data[y + i])
        )
        if (set.size === distinctCharacters) {
            j = i + distinctCharacters - 1
            break
        }
    }
    return j + 1
}

const firstPart = (input: string) => {
    return compute(input, 4)
}

const secondPart = (input: string) => {
    return compute(input, 14)
}

console.time('time')
parseInput('./data.txt')

export {}
