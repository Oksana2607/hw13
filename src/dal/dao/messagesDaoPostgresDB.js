const DAO = require('./dao');
const config = require('../../config');
const Pool = require('pg/lib').Pool;

function MessagesDaoPostgresDB() {
    this.pool = null;
}

MessagesDaoPostgresDB.prototype = Object.create(DAO.prototype);
MessagesDaoPostgresDB.prototype.constructor = MessagesDaoPostgresDB;

MessagesDaoPostgresDB.prototype.initialize = function () {
    if (this.pool) {
        return;
    }

    //try/catch for error connection
    this.pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'test',
        password: 'admin',
        port: 3030,
    });
};

// MessagesDaoPostgresDB.prototype.create = async function (object) {
//     let validate = await this.pool.query('SELECT COUNT(*) FROM users WHERE email = $1', [object.email]);
//     console.log(validate.rows[0].count);
//     if (validate.rows[0].count == 0){
//         await this.pool.query(`INSERT INTO users (id, name, email, password) VALUES ('${uuidv1()}', '${object.name}', '${object.email}', '${object.password}')`);
//     }else {
//         throw new Error('invalid email');
//     }
//
// };

MessagesDaoPostgresDB.prototype.readByReceiver = async function (ws) {
    let validate = await this.pool.query('SELECT * FROM message ORDER BY time');
    // console.log(validate.rows, 5);
    validate.rows.forEach(message => {
        // console.log(message);
        ws.send(JSON.stringify(message));
    });
};


MessagesDaoPostgresDB.prototype.create = async function (object) {
    // console.log(object, 4);
    await this.pool.query(`INSERT INTO message (time, receiver, sender, text, type) VALUES ('${object.time}', 'receiver', '${object.user}', '${object.text}', '${object.type}')`);
};

// const handleOnConnect = ws => {
//     pool.query('SELECT * FROM message ORDER BY time', (error, results) => {
//         if (error) {
//             // console.log(error.name);
//             response.json(error.name)
//         } else {
//             results.rows.forEach(message => {
//                 // console.log(message);
//                 ws.send(JSON.stringify(message));
//             });
//             // console.log(results.rows, 5);
//             // // response.json(results.rows);
//         }
//     })
//
// };

module.exports = MessagesDaoPostgresDB;