const db = require('../helpers/database')
const { signToken } = require('../helpers/token')
const { validateEmail } = require('../validations/validateEmail')

async function getDetailInfo(id) {
    try {
        const data = await db.execute(
            `SELECT
            id, name, avatar, gender, birth_day, phone,
            email, permission, create_at, update_at
            FROM \`user\`
            WHERE \`id\` = '${id}'`
        )

        return {
            code: 200,
            data: data[0] ?? null
        }
    } catch (error) {
        throw error
    }
}

async function register(user) {
    try {
        const [username, email] = await db.queryMultiple([
            `SELECT username
            FROM \`user\`
            WHERE \`username\` = '${user.username}'`,
            `SELECT email
            FROM \`user\`
            WHERE \`email\` = '${user.email}'`
        ])

        if (username[0] != null || user.username == '' || user.username == null) {
            const msg = username[0] != null ? 'Tài khoản đã tồn tại!' : 'Tài khoản không được để trống!'
            var err = new Error(msg)
            err.statusCode = 401
            throw (err)
        }
        if (email[0] != null || !validateEmail(user.email)) {
            const msg = email[0] != null ? 'Email đã tồn tại!' : 'Email không hợp lệ!'
            var err = new Error(msg)
            err.statusCode = 401
            throw (err)
        }
        if (user.name == '' || user.name == null) {
            var err = new Error('Bạn cần có một cái tên!')
            err.statusCode = 401
            throw (err)
        }

        await db.execute(
            `INSERT INTO \`user\`(
                \`id\`, 
                \`name\`,
                \`avatar\`,
                \`email\`, 
                \`permission\`, 
                \`username\`, 
                \`password\`) 
            VALUES (
                uuid(), 
                '${user.name}',
                'resources/default-avatar.png',
                '${user.email}', 
                3,
                '${user.username}',
                '${user.password}');`
        )

        return {
            code: 200,
            message: 'Đăng ký tài khoản thành công!'
        }
    } catch (error) {
        throw (error)
    }
}

async function login(user) {
    try {
        const [rows] = await db.execute(
            `SELECT  
            id, name
            FROM \`user\` 
            WHERE \`username\` = '${user.username}'
            AND \`password\` = '${user.password}'`
        );

        if (rows == null) {
            const error = new Error('Thông tin tài khoản hoặc mật khẩu không chính xác!');
            error.statusCode = 401;
            throw error;
        }

        const id = rows.id;
        const token = await signToken(id);

        return {
            code: 200,
            data: {
                id: id,
                name: rows.name,
                token
            }
        };
    } catch (error) {
        throw error
    }
}

async function update(id, user) {
    try {
        if (user.name == null) {
            const error = new Error('Bạn cần có một cái tên!');
            error.statusCode = 401;
            throw error;
        }

        await db.execute(
            `UPDATE \`user\` 
            SET \`name\`='${user.name}', 
            \`avatar\`=${user.avatar == null ? "'resources/default-avatar.png'" : `'${user.avatar}'`},
            \`gender\`=${user.gender ?? null},
            \`birth_day\`=${user.birth_day == null ? null : `'${user.birth_day}'`},
            \`phone\`=${user.phone == null ? null : `'${user.phone}'`} 
            WHERE \`id\` = '${id}';`
        )

        return {
            code: 200,
            message: "Cập nhật thông tin thành công!"
        }
    } catch (error) {
        throw (error)
    }
}

async function deleteUser(id) {
    try {
        await db.execute(
            `DELETE FROM \`user\`
            WHERE \`id\` = '${id}'`
        )

        return {
            code: 200,
            message: "Đã xoá người dùng khỏi hệ thống!"
        }
    } catch (error) {
        throw(error)
    }
}

module.exports = {
    getDetailInfo,
    register,
    login,
    update,
    deleteUser
}