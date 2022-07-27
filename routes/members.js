const router = global.express.Router();
const members = global.mocks.members;
const jwtAuth = require('../middlewares/jwtAuth.js');

router.post('/login/', function(request, response) {
  const member = members.find(function(member) {
    return member.name === request.body.name && member.age === Number(request.body.age);
  });
  if (member) {
    jwtAuth.tokenCreate(request, response, member);
  } else {
    response.status(403).send({
      message: 'Name or age is wrong!'
    });  
  }
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
