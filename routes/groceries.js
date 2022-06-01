const router = global.express.Router();
const groceries = global.mocks.groceries;

router.post('/', function(request, response) {
  // TODO: uuid가 없으면 push
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

router.get('/', function(request, response) {
  console.log('Done groceries get', groceries);
  response.status(200).send({
    result: 'Read',
    groceries: groceries
  });
});

router.patch('/:index', function(request, response) {
  const index = Number(request.params.index);
  groceries[index].expire = request.body.expire;
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
