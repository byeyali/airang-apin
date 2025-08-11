const db = require('./models');

db.sequelize.sync({ force: true }).then(() => {
  console.log('✅ PostgreSQL에 tb_member 테이블이 생성되었습니다.');
}).catch((err) => {
  console.error('❌ 테이블 생성 오류:', err);
});