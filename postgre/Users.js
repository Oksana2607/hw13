const Pool = require('pg/lib').Pool;
const uuidv1 = require('uuid/v1');
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'test',
    password: 'admin',
    port: 3030,
});

const createUser = (newUser, response) => {
    pool.query('SELECT COUNT(*) FROM users WHERE email = $1', [newUser.email], (error, results) => {
        if (error) {
            response.status(400).json(error.name)
        } else if (results.rows[0].count > 0) {
            response.status(404).json("Пользователь с такой почтой уже существует")
        } else {
            pool.query(`INSERT INTO users (id, name, email, password) VALUES ('${uuidv1()}', '${newUser.name}', '${newUser.email}', '${newUser.password}')`, (error, results) => {
                if (error) {
                    // console.log(error);
                    response.status(400).json(error.name)
                    // throw error
                } else if (results.rowCount === 0) {
                    response.status(404).json("Ошибка при регистрации")
                } else {
                    response.status(200).json("Пользователь создан")
                }
            })
        }
    })
};

const loginUser = (loginUser, response) => {

    pool.query('SELECT name FROM users WHERE email = $1 AND password = $2', [loginUser.email, loginUser.password], (error, results) => {
        if (error) {
            console.log(error.name);
            response.status(400).json(error.name)
            // throw error
        } else if (results.rowCount === 0) {
            response.status(404).json("Такого пользователя нет")
        } else {
            let User = {};
            User.name = results.rows[0].name;
            User.email = loginUser.email;
            pool.query(`UPDATE users SET status = true WHERE email = $1`, [loginUser.email], (error, results) => {
            });
            // response.status(200).json(results.rows[0].name)
            response.status(200).json(User)
        }
    })
};

const getAllUsers = (response) => {
    pool.query('SELECT name, email FROM users', (error, results) => {
        if (error) {
            // console.log(error.name);
            response.status(400).json(error.name)
        } else {
            // console.log(results.rows);
            response.status(200).json(results.rows)
        }
    })
};

module.exports = {
    loginUser,
    createUser,
    getAllUsers,
};