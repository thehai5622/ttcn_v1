const db = require('../helpers/database')
const helper = require('../helpers/helper')
const { listPerPage } = require('../../config/config')

async function getNews(page, keyword) {
    try {
        const offset = helper.getOffset(page, listPerPage)

        const result = await db.queryMultiple([
            `SELECT 
                \`news\`.\`id\`,
                \`news\`.\`title\`,
                \`news\`.\`description\`,
                \`news\`.\`image\`,
                \`user\`.name AS author
            FROM \`news\`
            LEFT JOIN \`user\` ON \`news\`.\`user_id\` = \`user\`.\`id\`
            WHERE 
                \`news\`.\`id\` LIKE '%${keyword ?? ''}%' OR
                \`news\`.\`title\` LIKE '%${keyword ?? ''}%' OR
                \`news\`.\`description\` LIKE '%${keyword ?? ''}%' OR
                \`news\`.\`content\` LIKE '%${keyword ?? ''}%'
            ORDER BY \`news\`.\`create_at\` DESC
            LIMIT ${offset}, ${listPerPage}`,
            `SELECT count(*) AS total FROM news`
        ])

        return {
            code: 200,
            data: result[0],
            meta: {
                page: page == null ? 1 : parseInt(page),
                total: result[1][0].total
            }
        }
    } catch (error) {
        throw (error)
    }
}

async function getDetailNews(id) {
    try {
        const [data] = await db.execute(
            `SELECT \`news\`.*, \`user\`.\`name\` AS author
            FROM \`news\`
            LEFT JOIN \`user\` ON \`news\`.\`user_id\` = \`user\`.\`id\`
            WHERE \`news\`.\`id\` = '${id}'`
        )

        return {
            code: 200,
            data: data ?? null
        }
    } catch (error) {
        throw (error)
    }
}

async function createNews(userId, news) {
    try {
        if (news.title == null || news.title == '') {
            var err = new Error('Tiêu đề là bắt buộc')
            err.statusCode = 400
            throw (err)
        }

        if (news.content == null || news.content == '') {
            var err = new Error('Không thể thiếu nội dung')
            err.statusCode = 400
            throw (err)
        }

        const resutl = await db.execute(
            `INSERT INTO \`news\`(
                \`id\`, 
                \`user_id\`, 
                \`title\`, 
                \`description\`, 
                \`image\`, 
                \`content\`
            ) VALUES (
                uuid(),
                '${userId}',
                '${news.title}',
                ${news.description == null ? null : `'${news.description}'`},
                ${news.image == null ? "'resources/default-news.png'" : `'${news.image}'`},
                '${news.content}')`
        )

        return {
            code: 200,
            message: "Thêm tin tức thành công!"
        }
    } catch (error) {
        throw (error)
    }
}

async function updateNews(userId, newsId, news) {
    try {
        if (news.title == null || news.title == '') {
            var err = new Error('Tiêu đề là bắt buộc')
            err.statusCode = 400
            throw (err)
        }

        if (news.content == null || news.content == '') {
            var err = new Error('Không thể thiếu nội dung')
            err.statusCode = 400
            throw (err)
        }

        const result = await db.execute(
            `SELECT \`user_id\` FROM \`news\` WHERE \`id\` = '${newsId}'`
        )
        if (result[0].user_id != userId) {
            var err = new Error('Chỉ tác giả mới có thể cập nhật tin tức này')
            err.statusCode = 401
            throw (err)
        }

        await db.execute(
            `UPDATE \`news\` 
            SET 
                \`title\`='${news.title}',
                \`description\`=${news.description == null ? null : `'${news.description}'`},
                \`image\`=${news.image == null ? "'resources/default-news.png'" : `'${news.image}'`},
                \`content\`='${news.content}' 
            WHERE \`id\` = '${newsId}';`
        )

        return {
            code: 200,
            message: "Cập nhật tin tức thành công!"
        }
    } catch (error) {
        throw (error)
    }
}

async function deleteNews(userId, newsId) {
    try {
        const [result] = await db.execute(
            `SELECT permission
            FROM \`user\`
            WHERE \`id\` = '${userId}'`
        )

        const [news] = await db.execute(
            `SELECT *
            FROM \`news\`
            WHERE \`id\` = '${newsId}'`
        )

        if (result.permission === 1 || news.user_id == userId) {
            await db.execute(
                `DELETE FROM \`news\` WHERE \`id\` = '${newsId}'`
            )

            return {
                code: 200,
                message: "Đã xoá tin tức!"
            }
        } else {
            var err = new Error('Bạn không có quyền xoá tin tức này')
            err.statusCode = 401
            throw (err)
        }
    } catch (error) {
        throw (error)
    }
}

module.exports = {
    getNews,
    getDetailNews,
    createNews,
    updateNews,
    deleteNews
}