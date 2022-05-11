const router = global.express.Router();
const items = global.mocks.items;

router.post('/', function(request, response) {
  items.push(request.body);
  console.log('Done items post', items);
  response.status(200).send({
    result: 'Created'
  });
});

router.get('/', function(request, response) {
  console.log('Done items get', items);
  response.status(200).send({
    result: 'Read',
    items: items
  });
});

router.patch('/:index', function(request, response) {
  const index = Number(request.params.index);
  items[index] = request.body;
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
