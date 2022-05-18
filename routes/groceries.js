const router = global.express.Router();
const groceries = global.mocks.groceries;

router.post('/', function(request, response) {
  groceries.push(request.body);
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

router.delete('/:index', function(request, response) {
  const index = Number(request.params.index);
  groceries.splice(index, 1);
  console.log('Done groceries delete', groceries);
  response.status(200).send({
    result: 'Deleted'
  });
});

module.exports = router;
