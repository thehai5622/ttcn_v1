const db = require('../helpers/database')
const getResultPackage = require('../helpers/result')

async function getListPackage() {
    try {
        const result = await db.execute(
            `SELECT *
            FROM \`package\``
        )

        return {
            code: 200,
            data: result
        }
    } catch (error) {
        throw (error)
    }
}

async function getListQuestion(packageId) {
    try {
        const result = await db.execute(
            `SELECT id, content
            FROM \`question\`
            WHERE \`package_id\`='${packageId}'`
        )

        for (let i = 0; i < result.length; i++) {
            let answer = await db.execute(
                `SELECT id, content, most, least
                FROM \`answer\`
                WHERE \`question_id\`='${result[i].id}'`
            )
            result[i].answer = answer
        }

        return {
            code: 200,
            data: result
        }
    } catch (error) {
        throw (error)
    }
}

async function getResult(packageId, listAnswerId) {
    try {
        let sql = []
        for (let i = 0; i <listAnswerId.length; i++) {
            sql.push(
                `SELECT * 
                FROM \`answer\` 
                WHERE \`id\`='${listAnswerId[i]}'`
            )
        }
        answer = await db.queryMultiple(sql)

        return {
            code: 200,
            package: packageId,
            data: await getResultPackage(packageId, answer)
        }
    } catch (error) {
        throw (error)
    }
}

module.exports = {
    getListPackage,
    getListQuestion,
    getResult
}