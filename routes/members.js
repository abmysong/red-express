const router = global.express.Router();
const members = global.mocks.members;
const db = global.db;
const jwtAuth = require('../middlewares/jwtAuth.js');

router.post('/login/', function(request, response) {
  const sql = `
    select * from members
    where name = ? and age = ?;
  `;
  db.query(sql, [request.body.name, request.body.age], function(error, rows) {
    if (!error || db.error(request, response, error)) {
      console.log('Done items post', rows[0]);
      let member = rows[0];
      if (member) {
        // 전개구조 Babel, DB에서 받은 오브젝트는 토큰 생성이 불가하여 일반 오브젝트로 변경
        // 전개구조는 대괄호 또는 중괄호를 제거
        member = {...rows[0]};
        // member = {
        //   member_pk: rows[0].member_pk,
        //   name: rows[0].name,
        //   age: rows[0].age
        // };
        jwtAuth.tokenCreate(request, response, member);
      } else {
        response.status(403).send({
          message: 'Name or age is wrong!'
        });  
      }
    }
  });
});

router.get('/login/', jwtAuth.tokenCheck, function(request, response) {
  response.status(200).send({
    decoded: request.decoded
  });
});

router.post('/', function(request, response) {
  members.push(request.body);
  console.log('Done members post', members);
  response.status(200).send({
    result: 'Created'
  });
});

router.get('/', function(request, response) {
  console.log('Done members get', members);
  response.status(200).send({
    result: 'Read',
    members: members
  });
});

router.patch('/:index', function(request, response) {
  const index = Number(request.params.index);
  members[index] = request.body;
  console.log('Done members patch', members);
  response.status(200).send({
    result: 'Updated'
  });
});

router.delete('/:index', function(request, response) {
  const index = Number(request.params.index);
  members.splice(index, 1);
  console.log('Done members delete', members);
  response.status(200).send({
    result: 'Deleted'
  });
});

module.exports = router;
