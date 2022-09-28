const { filter } = require('lodash');
const _ = require('lodash');
const moment = require('moment');
const jwtAuth = require('../middlewares/jwtAuth.js');
const router = global.express.Router();
const groceries = global.mocks.groceries;

router.post('/', jwtAuth.tokenCheck, function(request, response) {
  const sql = `
    insert into groceries (
      select item_pk as grocery_pk, member_pk, name, enter, expire from items
      where item_pk = ?
    );
  `;
  db.query(sql, [request.body.item_pk], function(error, rows) {
    if (!error || db.error(request, response, error)) {
      console.log('Done groceries post', rows);
      response.status(200).send({
        result: 'Created'
      });
    }
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

router.get('/count', jwtAuth.tokenCheck, function(request, response) {
  const filterGroceries = groceries.filter(function(grocery) {
    // 로그인 된 회원의 groceries 찾기
    // 유통기한이 지난 groceries 찾기
    return grocery.memberUuid === request.decoded.memberUuid
      && moment().format('YYYY-MM-DD') > grocery.expire;
  });
  console.log('Done groceries count get', filterGroceries.length);
  response.status(200).send({
    result: 'Counted',
    count: filterGroceries.length
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

router.delete('/:grocery_pk', function(request, response) {
  const grocery_pk = request.params.grocery_pk;
  const sql = `
    delete from groceries where grocery_pk = ?;
  `;
  db.query(sql, [grocery_pk], function(error, rows) {
    if (!error || db.error(request, response, error)) {
      console.log('Done groceries delete', rows);
      response.status(200).send({
        result: 'Deleted'
      });
    }
  });
});

module.exports = router;
