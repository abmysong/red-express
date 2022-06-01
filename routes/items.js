const router = global.express.Router();
const items = global.mocks.items;
const groceries = global.mocks.groceries;

router.post('/', function(request, response) {
  items.push(request.body);
  console.log('Done items post', items);
  response.status(200).send({
    result: 'Created'
  });
});

router.get('/', function(request, response) {
  // TODO: items를 반복해서 groceries에 동일한 uuid가 있는지 확인 하고 있으면 checked = true 값을 넣는다.
  for (let index = 0; index < items.length; index++) {
    const item = items[index];
    console.log(item);
    const grocery = groceries.find(function(grocery) {
      return grocery.uuid === item.uuid;
    });
    if (grocery) {
      item.checked = true;
    } else {
      item.checked = false;
    }
  }
  console.log('Done items get', items);
  response.status(200).send({
    result: 'Read',
    items: items
  });
});

router.patch('/:index', function(request, response) {
  const index = Number(request.params.index);
  items[index].expire = request.body.expire;
  console.log('Done items patch', items);
  response.status(200).send({
    result: 'Updated'
  });
});

router.delete('/:index', function(request, response) {
  const index = Number(request.params.index);
  items.splice(index, 1);
  console.log('Done items delete', items);
  response.status(200).send({
    result: 'Deleted'
  });
});

module.exports = router;
