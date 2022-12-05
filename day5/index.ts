const fs = require('fs')
const es = require('event-stream')

interface Procedure {
    move: number
    from: number
    to: number
}

interface Structure {
    data: string[][]
    procedures: Procedure[]
}

function parseInput(path) {
    let input: Structure = {
        data: [[]],
        procedures: [],
    }
    let i = 0
    let parseData = true
    const stream = fs
        .createReadStream(path, { flags: 'r' })
        .pipe(es.split())
        .pipe(
            es.map(function (line: string, cb) {
                if (line === '') {
                    parseData = false
                }
                if (parseData) {
                    const lineLetters = [
                        ...line
                            .replace(/    /g, '.')
                            .replace(/[^A-Za-z\.]/g, ''),
                    ]
                    lineLetters.forEach((letter, index) => {
                        if (letter !== '.') {
                            input.data[index] = input.data[index]
                                ? [...input.data[index], letter]
                                : [letter]
                        }
                    })
                } else if (line !== '') {
                    const lineNumbers = [
                        ...line
                            .replace(/[^0-9]/g, '.')
                            .split('.')
                            .filter((l) => l !== ''),
                    ]
                    input.procedures[i] = {
                        move: Number(lineNumbers[0]),
                        from: Number(lineNumbers[1]) - 1,
                        to: Number(lineNumbers[2]) - 1,
                    }
                    i++
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

const firstPart = (input: Structure) => {
    const res = [...input.data]
    input.procedures.forEach((procedure) => {
        res[procedure.to] = [
            ...res[procedure.from].slice(0, procedure.move).reverse(),
            ...res[procedure.to],
        ]
        res[procedure.from] = res[procedure.from].slice(procedure.move)
    })
    return res.map((t) => t[0]).join('')
}

const secondPart = (input: Structure) => {
    const res = [...input.data]
    input.procedures.forEach((procedure) => {
        res[procedure.to] = [
            ...res[procedure.from].slice(0, procedure.move),
            ...res[procedure.to],
        ]
        res[procedure.from] = res[procedure.from].slice(procedure.move)
    })
    return res.map((data) => data[0]).join('')
}

console.time('time')
parseInput('./data.txt')

export {}
