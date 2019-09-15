const DAO = require('./dao');
const config = require('../../config');
const Pool = require('pg/lib').Pool;
const uuidv1 = require('uuid/v1');

function UsersDaoPostgresDB() {
//    this.connection = null;
//    this.model = null;
    this.pool = null;
}

UsersDaoPostgresDB.prototype = Object.create(DAO.prototype);
UsersDaoPostgresDB.prototype.constructor = UsersDaoPostgresDB;

UsersDaoPostgresDB.prototype.initialize = function () {
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

//    const url = `${config.settings.mongo.connectionString}/chatDB`;
//
//    mongoose.createConnection(url)
//        .then(connection => {
//            this.connection = connection;
//            this.model = connection.model('user', userSchema);
//        })
//        .catch((error) => {
//            console.log(error);
//        });
};

UsersDaoPostgresDB.prototype.create = async function (object) {
    let validate = await this.pool.query('SELECT COUNT(*) FROM users WHERE email = $1', [object.email]);
    if (validate.rows[0].count == 0){
        await this.pool.query(`INSERT INTO users (id, name, email, password) VALUES ('${uuidv1()}', '${object.name}', '${object.email}', '${object.password}')`);
    }
    throw new Error('invalid email');
};

UsersDaoPostgresDB.prototype.readUser = async function (email, password) {
    let result =  await this.pool.query('SELECT name FROM users WHERE email = $1 AND password = $2', [email, password]);
    if (result.rowCount > 0){
        return result.rows[0].name;
    }
    throw new Error('invalid user');

};


// UsersDaoPostgresDB.prototype.validate = async function (object) {
//     //if object empty  == valid else throw Error('user is not valid');
//     console.log(object, 4)
// };

module.exports = UsersDaoPostgresDB;