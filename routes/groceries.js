const { filter } = require('lodash');
const _ = require('lodash');
const jwtAuth = require('../middlewares/jwtAuth.js');
const router = global.express.Router();
const groceries = global.mocks.groceries;

router.post('/', jwtAuth.tokenCheck, function(request, response) {
  request.body.memberUuid = request.decoded.memberUuid;
  const grocery = groceries.find(function(grocery) {
    return grocery.uuid === request.body.uuid;
  });

  if (!grocery) {
    // create
    groceries.push(request.body);
  }
  // 1줄로 표현
  // !grocery && groceries.push(request.body);

  console.log('Done groceries post', groceries);
  response.status(200).send({
    result: 'Created'
  });
});

router.get('/', jwtAuth.tokenCheck, function(request, response) {
  const filterGroceries = groceries.filter(function(grocery) {
    return grocery.memberUuid === request.decoded.memberUuid;
  });
  const orderGroceries = _.orderBy(filterGroceries, request.query.orderByKey, request.query.orderByType);

  const q = request.query.q;
  let searchGroceries = [];
  for (let i = 0; i < orderGroceries.length; i++) {
    const grocery = orderGroceries[i];
    if (grocery.name.indexOf(q) >= 0) {
      searchGroceries.push(grocery);
    }
  }
  // lodash orderBy 사용
  searchGroceries = _.orderBy(searchGroceries, request.query.orderByKey, request.query.orderByType);

  console.log('Done groceries get', searchGroceries);
  response.status(200).send({
    result: 'Read',
    groceries: searchGroceries
  });
});

router.patch('/:uuid', function(request, response) {
  const uuid = request.params.uuid;
  const grocery = groceries.find(function(grocery) {
    return grocery.uuid === uuid;
  });
  grocery.name = request.body.name;
  grocery.enter = request.body.enter;
  grocery.expire = request.body.expire;
  console.log('Done groceries patch', groceries);
  response.status(200).send({
    result: 'Updated'
  });
});

router.delete('/:uuid', function(request, response) {
  const uuid = request.params.uuid;
  const index = groceries.findIndex(function(grocery) {
    return grocery.uuid === uuid;
  });
  groceries.splice(index, 1);
  console.log('Done groceries delete', groceries);
  response.status(200).send({
    result: 'Deleted'
  });
});

module.exports = router;
