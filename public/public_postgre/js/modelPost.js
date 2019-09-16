const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'test',
    password: 'admin',
    port: 3000,
});

const createUser = (newUser, response) => {
    pool.query('SELECT COUNT(*) FROM styles WHERE email = $1', [newUser.email], (error, results) => {
        if (error) {
            console.log(error);
            response.status(400).json(error.name)
            // throw error
        } else if (results.rows[0].count > 0) {
            console.log(results);
            response.status(404).json("Пользователь с такой почтой уже существует")
        } else {
            pool.query(`INSERT INTO users (name, email, password) VALUES ('${newUser.name}', '${newUser.email}', '${newUser.password}')`, (error, results) => {
                if (error) {
                    console.log(error);
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
    pool.query('SELECT name FROM styles WHERE email = $1 AND password = $2', [loginUser.email, loginUser.password], (error, results) => {
        if (error) {
            console.log(error.name);
            response.status(400).json(error.name)
            // throw error
        } else if (results.rowCount === 0) {
            response.status(404).json("Такого пользователя нет")
        } else {
            // console.log(results);
            response.status(200).json(results.rows[0].name)
        }
    })
};


module.exports = {
    loginUser,
    createUser,
};