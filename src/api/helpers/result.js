async function getResultPackage(packageId, answer) {
    let result = {}
    let base = {
        most: {},
        least: {}
    }

    for (let i = 0; i < answer.length; i++) {
        const element = answer[i][0];
        if (base.most[`${element.most}`] == null) {
            base.most[`${element.most}`] = 1
        }
        if (base.least[`${element.least}`] == null) {
            base.least[`${element.least}`] = 1
        }
        base.most[`${element.most}`] += 1
        base.least[`${element.least}`] += 1
    }

    switch (packageId) {
        //DISC
        case "74c8329e-85e7-11ee-b0fc-089798d3":
            let baseDISC = {
                1: 'D',
                2: 'I',
                3: 'S',
                4: 'C'
            }
            let value = {
                most: {
                    1: 20,
                    2: 18,
                    3: 19,
                    4: 15,
                    5: 24
                },
                least: {
                    1: 21,
                    2: 19,
                    3: 19,
                    4: 16,
                    5: 21
                }
            }

            for (let i = 1; i <= 5; i++) {
                base.most[`${i}`] = `${(base.most[`${i}`]/value.most[`${i}`]*100).toFixed(2)}%`
                base.least[`${i}`] = `${(base.least[`${i}`]/value.least[`${i}`]*100).toFixed(2)}%`
                if (base.most[`${i}`] < base.least[`${i}`]) {
                    let temp = base.most[`${i}`]
                    base.most[`${i}`] = base.least[`${i}`]
                    base.least[`${i}`] = temp
                }
                if (i != 5 && base.most[`${i}`] >= '60%') {
                    result.content = `Bạn thuộc nhóm người ${baseDISC[i]}`
                }
            }
            break;
    
        default:
            var err = new Error('không thể xác định được gói câu hỏi!')
            err.statusCode = 404
            throw (err)
    }

    return {
        test: "16.4%" <= "16.32%",
        base,
        result
    }
}

module.exports = getResultPackage