const fs = require('fs')
const es = require('event-stream')

function parseInput(path) {
    let input: number[][] = [[]]
    let i = 0
    const stream = fs
        .createReadStream(path, { flags: 'r' })
        .pipe(es.split())
        .pipe(
            es.map(function (line: string, cb) {
                if (line == '') {
                    i++
                    input[i] = []
                } else {
                    input[i].push(parseInt(line))
                }
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

const firstPart = (data: number[][]) => {
    return Math.max(
        ...data.map((d) => {
            return d.reduce((prev, curr) => prev + curr, 0)
        })
    )
}

const secondPart = (data: number[][]) => {
    const addedValues = data.map((d) => {
        return d.reduce((prev, curr) => prev + curr, 0)
    })
    const sortedArr = addedValues.sort((a, b) => a - b)
    const maxedValues = sortedArr
        .slice(-3)
        .reduce((prev, curr) => prev + curr, 0)
    return maxedValues
}

console.time('time')
parseInput('./data.txt')

export {}