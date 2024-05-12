const { DataSource } = require('typeorm');

const appDataSource = new DataSource({
  type: 'mysql',  // MySQL 데이터베이스 사용
  host: process.env.TYPEORM_HOST,  
  port: process.env.TYPEORM_PORT,  
  username: process.env.TYPEORM_USERNAME,  
  password: process.env.TYPEORM_PASSWORD,  
  database: process.env.TYPEORM_DATABASE,  
  entities: [],
  synchronize: true, 
  logging: process.env.TYPEORM_LOGGING === 'TRUE',  // 로깅 활성화 여부
});

module.exports = { appDataSource };