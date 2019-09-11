const {Client} = require('pg');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'test',
    password: 'admin',
    port: 3000,
});

// client.connect();
// client.query('INSERT INTO users (name, age)' +
//     ' VALUES' +
//     '(\'stef\', \'23\'),' +
//     '(\'alex\', \'25\')',
//     (err, res) => {
//         console.log(err, res);
//         client.end();
//     });

// client.connect();
// client.query('SELECT * FROM users;',
//     (err, res) => {
//         console.log(err, res.rows);
//         client.end();
//     });

exports.createUser = function (newUser) {
    client.connect();
    client.query('INSERT INTO users (name, email, password)' +
        ' VALUES' +
        `('${newUser.name}', '${newUser.email}', '${newUser.password}')`,
        (err, res) => {
            console.log(err, res);
            client.end();
        });
};

exports.loginUser = function (loginUser) {
    client.connect();
    client.query(`SELECT name FROM users
         WHERE
            email = $1
         AND
            password = $2`,[loginUser.email, loginUser.password],
        (err, res) => {
            // console.log(err, res);
            console.log(res.rows);
            // return (res.rows);
            client.end();
        });
};