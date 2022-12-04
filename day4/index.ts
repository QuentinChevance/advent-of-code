const fs = require('fs')
const es = require('event-stream')

function parseInput(path) {
    let input: number[][][] = [] // [[[1,5],[2,3]],[[2,6][3,4]]]
    let i = 0
    const stream = fs
        .createReadStream(path, { flags: 'r' })
        .pipe(es.split())
        .pipe(
            es.map(function (line: string, cb) {
                const [firstHalf, secondHalf] = line.split(',')
                const [fH, fH2] = firstHalf.split('-')
                const [sH, sH2] = secondHalf.split('-')

                input[i++] = [
                    [Number(fH), Number(fH2)],
                    [Number(sH), Number(sH2)],
                ]
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

const firstPart = (data: number[][][]) => {
    return data.reduce((prev, d) => {
        const [minLeftSection, maxLeftSection] = d[0]
        const [minRightSection, maxRightSection] = d[1]
        if (
            (minLeftSection <= minRightSection &&
                maxLeftSection >= maxRightSection) ||
            (minRightSection <= minLeftSection &&
                maxRightSection >= maxLeftSection)
        ) {
            return ++prev
        }
        return prev
    }, 0)
}

const secondPart = (data: number[][][]) => {
    return data.reduce((prev, d) => {
        const [minLeftSection, maxLeftSection] = d[0]
        const [minRightSection, maxRightSection] = d[1]
        if (
            (minLeftSection <= minRightSection &&
                maxLeftSection >= minRightSection) ||
            (minRightSection <= minLeftSection &&
                maxRightSection >= minLeftSection)
        ) {
            return ++prev
        }
        return prev
    }, 0)
}

console.time('time')
parseInput('./data.txt')

export {}
