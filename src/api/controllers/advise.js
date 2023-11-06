const db = require('../helpers/database')
const helper = require('../helpers/helper')
const { listPerPage } = require('../../config/config')
const { validateEmail } = require('../validations/validateEmail')
const { validatePhone } = require('../validations/validatePhone')

async function getAdvise(page) {
    try {
        const offset = helper.getOffset(page, listPerPage)

        const resutlt = await db.queryMultiple([
            `SELECT
                \`id\`,
                \`is_readed\`,
                \`name\`,
                \`phone\`,
                \`create_at\`
            FROM \`advise\`
            ORDER BY \`advise\`.\`create_at\` DESC
            LIMIT ${offset}, ${listPerPage}`,
            `SELECT count(*) AS total FROM \`advise\``
        ])

        return {
            code: 200,
            data: resutlt[0],
            meta: {
                page: page == null ? 1 : parseInt(page),
                total: resutlt[1][0].total
            }
        }
    } catch (error) {
        throw (error)
    }
}

async function getDetailAdvise(adviseId) {
    try {
        const resutl = await db.queryMultiple([
            `UPDATE \`advise\`
            SET \`is_readed\` = '1'
            WHERE \`advise\`.\`id\` = '${adviseId}'`,
            `SELECT *
            FROM \`advise\`
            WHERE \`advise\`.\`id\` = '${adviseId}'`
        ])

        return {
            code: 200,
            data: resutl[1][0]
        }
    } catch (error) {
        throw (error)
    }
}

async function createAdvise(advise) {
    try {
        if (!validatePhone(advise.phone)) {
            const error = new Error('Số điện thoại không đúng định dạng!');
            error.statusCode = 401;
            throw error;
        }
        if (advise.email && !validateEmail(advise.email)) {
            var error = new Error('Email không đúng định dạng!')
            error.statusCode = 401
            throw (error)
        }

        const result = await db.execute(
            `SELECT * FROM \`advise\` WHERE \`phone\`='${advise.phone}';`
        )

        if (result.length != 0) {
            var error = new Error('Sdt này đã được ghi nhận để tư vấn!')
            error.statusCode = 401
            throw (error)
        }

        await db.execute(
            `INSERT INTO \`advise\`(
                \`id\`,
                \`is_readed\`,
                \`name\`,
                \`phone\`,
                \`email\`,
                \`content\`
            )
            VALUES(
                uuid(),
                0,
                '${advise.name}',
                '${advise.phone}',
                ${advise.email == null ? null : `'${advise.email}'`},
                ${advise.content == null ? null : `'${advise.content}'`}
            )`
        )

        return {
            code: 200,
            message: "Đã gửi yêu cầu hỗ trợ tư vấn!"
        }
    } catch (error) {
        throw (error)
    }
}

module.exports = {
    getAdvise,
    getDetailAdvise,
    createAdvise
}