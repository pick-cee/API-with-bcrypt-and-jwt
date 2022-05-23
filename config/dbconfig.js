module.exports = {
    host: 'localhost',
    user: 'root',
    password: 'backpack',
    database: 'testdb3',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    }
}