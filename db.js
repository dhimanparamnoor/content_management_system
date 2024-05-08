const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "23588636",
    host: "localhost",
    port: 5432,
    database: "rudimentary_cms",
})

module.exports = pool;