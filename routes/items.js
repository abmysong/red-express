const router = global.express.Router();
const items = global.mocks.items;
const groceries = global.mocks.groceries;
const _ = require('lodash');

router.post('/', function(request, response) {
  items.push(request.body);
  console.log('Done items post', items);
  response.status(200).send({
    result: 'Created'
  });
});

router.get('/', function(request, response) {
  const orderItems = _.orderBy(items, request.query.orderByKey, request.query.orderByType);

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
