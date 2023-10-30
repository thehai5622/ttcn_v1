const db = require('../helpers/database')
const helper = require('../helpers/helper')
const { listPerPage } = require('../../config/config')

async function getAdvise(page) {
    try {
        const resutl = await db.execute(
            `SELECT
                \`id\`,
                \`is_readed\`,
                \`name\`,
                \`phone\`,
                \`create_at\`
            FROM \`advise\`
            ORDER BY \`advise\`.\`create_at\` DESC`
        )

        return {
            code: 200,
            data: resutl
        }
    } catch (error) {
        throw (error)
    }
}

async function addAdvise(advise) {
    try {
        return {
            code: 200,
            message: advise
        }
    } catch (error) {
        throw (error)
    }
}

async function statusChange(adviseId) {
    try {
        return {
            code: 200,
            message: adviseId
        }
    } catch (error) {
        throw (error)
    }
}

module.exports = {
    getAdvise,
    addAdvise,
    statusChange
}