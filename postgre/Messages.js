const Pool = require('pg/lib').Pool;
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'test',
    password: 'admin',
    port: 3030,
});

const addMessage = (data, response) => {
    pool.query(`INSERT INTO message (time, receiver, sender, text, type) VALUES ('${data.time}', 'receiver', '${data.user}', '${data.text}', '${data.type}')`, (error, results) => {
        if (error) {
            // console.log(error);
            // response.json(error.name)
        } else {
            // response.json(results.rows)
        }
    })
};

const handleOnConnect = ws => {
    pool.query('SELECT * FROM message ORDER BY time', (error, results) => {
        if (error) {
            // console.log(error.name);
            response.json(error.name)
        } else {
            results.rows.forEach(message => {
                // console.log(message);
                ws.send(JSON.stringify(message));
            });
            // console.log(results.rows, 5);
            // // response.json(results.rows);
        }
    })

};

// const getMessage = (response) => {
//     pool.query('SELECT * FROM message ORDER BY time', (error, results) => {
//         if (error) {
//             // console.log(error.name);
//             response.json(error.name)
//         } else {
//             // console.log(results.rows, 5);
//             // response.json(results.rows);
//         }
//     })
// };

module.exports = {
    // getMessage,
    addMessage,
    handleOnConnect,
};