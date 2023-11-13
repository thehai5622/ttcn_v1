const db = require('../helpers/database')

async function getListSpecialized(keyword, type) {
    try {
        const result = await db.execute(
            `SELECT *
            FROM \`specialized\`
            WHERE 
                (\`specialized\`.\`name\` LIKE '%${keyword ?? ''}%' OR
                \`specialized\`.\`id\` LIKE '%${keyword ?? ''}%')
                ${type == null ? '' : `AND \`specialized\`.\`type\` = ${type}`}
            ORDER BY \`specialized\`.\`name\` ASC`
        )

        return {
            code: 200,
            data: result
        }
    } catch (error) {
        throw (error)
    }
}

async function createSpecialized(specialized) {
    try {
        if (specialized.field_id == null || specialized.field_id == '') {
            var err = new Error('Mã ngành không được để trống!')
            err.statusCode = 400
            throw (err)
        }

        if (specialized.type == null || specialized.type == '') {
            var err = new Error('Loại chuyên ngành đào tạo không được để trống!')
            err.statusCode = 400
            throw (err)
        }

        if (specialized.name == null || specialized.name == '') {
            var err = new Error('Tên chuyên ngành không được để trống!')
            err.statusCode = 400
            throw (err)
        }

        const [result] = await db.execute(
            `SELECT \`name\` 
            FROM \`specialized\`
            WHERE \`name\`='${specialized.name}'`
        )

        if (result != null) {
            var err = new Error('Chuyên ngành này đã có trong hệ thống!')
            err.statusCode = 400
            throw (err)
        }

        await db.execute(
            `INSERT INTO \`specialized\`(
                \`id\`,
                \`field_id\`,
                \`type\`,
                \`name\`,
                \`year_start\`,
                \`year_end\`
            )
            VALUES(
                uuid(), 
                '${specialized.field_id}',
                '${specialized.type}',
                '${specialized.name}',
                YEAR(CURDATE()),
                null
            )`
        )

        return {
            code: 200,
            message: "Thêm chuyên ngành thành công!"
        }
    } catch (error) {
        throw (error)
    }
}

async function updateSpecialized(specializedId, specialized) {
    try {
        await db.execute(
            `UPDATE \`specialized\`
            SET 
                \`field_id\`='${specialized.field_id}',
                \`type\`='${specialized.type}',
                \`name\`='${specialized.name}'
            WHERE \`id\`='${specializedId}'`
        )

        return {
            code: 200,
            message: "Cập nhật thông tin ngành thành công!"
        }
    } catch (error) {
        throw (error)
    }
}

async function deleteSpecialized(specializedId) {
    try {
        await db.execute(
            `DELETE FROM \`specialized\` WHERE \`id\`='${specializedId}'`
        )

        return {
            code: 200,
            message: "Xoá bỏ chuyên ngành thành công!"
        }
    } catch (error) {
        throw (error)
    }
}

module.exports = {
    getListSpecialized,
    createSpecialized,
    updateSpecialized,
    deleteSpecialized
}