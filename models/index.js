const { Sequelize } = require('sequelize');
const appDataSource = require('./data-source');
const placeDao = require('./placeDao');

// 환경 변수에서 데이터베이스 연결 정보를 가져옴
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./user')(sequelize);

module.exports = {
    db,
    appDataSource,
    placeDao
};
