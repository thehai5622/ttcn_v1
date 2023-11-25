const db = require('../helpers/database')

async function getListField(keyword) {
    try {
        const result = await db.execute(
            `SELECT *
            FROM \`field\`
            WHERE 
                \`field\`.\`name\` LIKE '%${keyword ?? ''}%' OR
                \`field\`.\`id\` LIKE '%${keyword ?? ''}%'
            ORDER BY \`field\`.\`name\` ASC`
        )

        for (let i = 0; i < result.length; i++) {
            let specialized = await db.execute(
                `SELECT id, type, name
                FROM \`specialized\`
                WHERE \`field_id\`='${result[i].id}'`
            )
            result[i].specialized = specialized
        }

        return {
            code: 200,
            data: result
        }
    } catch (error) {
        throw (error)
    }
}

async function createField(field) {
    try {
        if (field.name == null || field.name == '') {
            var err = new Error('Tên ngành không thể thiếu')
            err.statusCode = 400
            throw (err)
        }

        const [result] = await db.execute(
            `SELECT \`name\` 
            FROM \`field\`
            WHERE \`name\`='${field.name}'`
        )

        if (result != null) {
            var err = new Error('Ngành này đã có trong hệ thống')
            err.statusCode = 400
            throw (err)
        }

        await db.execute(
            `INSERT INTO \`field\`(\`id\`, \`name\`)
            VALUES(uuid(), '${field.name}')`
        )

        return {
            code: 200,
            message: "Thêm ngành thành công!"
        }
    } catch (error) {
        throw (error)
    }
}

async function updateField(fieldId, field) {
    try {
        await db.execute(
            `UPDATE \`field\`
            SET \`name\`='${field.name}'
            WHERE \`id\`='${fieldId}'`
        )

        return {
            code: 200,
            message: "Cập nhật thông tin ngành thành công!"
        }
    } catch (error) {
        throw (error)
    }
}

async function deleteField(fieldId) {
    try {
        await db.execute(
            `DELETE FROM \`field\` WHERE \`id\`='${fieldId}'`
        )

        return {
            code: 200,
            message: "Xoá bỏ ngành thành công!"
        }
    } catch (error) {
        throw (error)
    }
}

module.exports = {
    getListField,
    createField,
    updateField,
    deleteField
}