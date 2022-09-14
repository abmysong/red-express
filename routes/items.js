const _ = require('lodash');
const jwtAuth = require('../middlewares/jwtAuth.js');
const router = global.express.Router();
const items = global.mocks.items;
const groceries = global.mocks.groceries;
const db = global.db;

router.post('/', jwtAuth.tokenCheck, function(request, response) {
  request.body.memberUuid = request.decoded.memberUuid;
  // items.push(request.body);
  const sql = `
    insert into items(member_pk, name, enter, expire)
    values (
      1,
      ?,
      date_format(now(), '%Y-%m-%d'),
      date_format(date_add(now(), interval + 2 week), '%Y-%m-%d')
    );
  `;
  db.query(sql, [request.body.name], function(error, rows) {
    if (!error || db.error(request, response, error)) {
      console.log('Done items post', rows);
      response.status(200).send({
        result: 'Created'
      });
    }
  });
});

router.get('/', jwtAuth.tokenCheck, function(request, response) {
  const filterItems = items.filter(function(item) {
    return item.memberUuid === request.decoded.memberUuid;
  });
  const orderItems = _.orderBy(filterItems, request.query.orderByKey, request.query.orderByType);

  // TODO: items를 반복해서 groceries에 동일한 uuid가 있는지 확인 하고 있으면 checked = true 값을 넣는다.
  for (let index = 0; index < orderItems.length; index++) {
    const item = orderItems[index];
    console.log(item);

    // groceries 데이터 확인
    const grocery = groceries.find(function(grocery) {
      return grocery.uuid === item.uuid;
    });
    if (grocery) {
      item.checked = true;
    } else {
      item.checked = false;
    }
  }
  console.log('Done items get', orderItems);
  response.status(200).send({
    result: 'Read',
    items: orderItems
  });
});

router.patch('/:uuid', function(request, response) {
  const uuid = request.params.uuid;
  const index = items.findIndex(function(item) {
    return item.uuid === uuid;
  });
  items[index].expire = request.body.expire;
  console.log('Done items patch', items);
  response.status(200).send({
    result: 'Updated'
  });
});

router.delete('/:uuid', function(request, response) {
  const uuid = request.params.uuid;
  const index = items.findIndex(function(item) {
    return item.uuid === uuid;
  });
  items.splice(index, 1);
  console.log('Done items delete', items);
  response.status(200).send({
    result: 'Deleted'
  });
});

module.exports = router;
