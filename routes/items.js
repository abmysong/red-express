const _ = require('lodash');
const jwtAuth = require('../middlewares/jwtAuth.js');
const router = global.express.Router();
const items = global.mocks.items;
const groceries = global.mocks.groceries;
const db = global.db;

router.post('/', jwtAuth.tokenCheck, function(request, response) {
  const sql = `
    insert into items(member_pk, name, enter, expire)
    values (
      ?,
      ?,
      date_format(now(), '%Y-%m-%d'),
      date_format(date_add(now(), interval + 2 week), '%Y-%m-%d')
    );
  `;
  db.query(sql, [request.decoded.member_pk, request.body.name], function(error, rows) {
    if (!error || db.error(request, response, error)) {
      console.log('Done items post', rows);
      response.status(200).send({
        result: 'Created'
      });
    }
  });
});

router.get('/', jwtAuth.tokenCheck, function(request, response) {
  const sql = `
    select
      item_pk,
      member_pk,
      name,
      date_format(enter, '%Y-%m-%d') as enter,
      date_format(expire, '%Y-%m-%d') as expire
      , (
        select grocery_pk from groceries g where g.grocery_pk = i.item_pk
      ) as grocery_pk
    from items i
    where member_pk = ?
    order by ${request.query.orderByKey} ${request.query.orderByType}
    ;
  `;
  db.query(sql, [request.decoded.member_pk], function(error, rows) {
    if (!error || db.error(request, response, error)) {
      console.log('Done items get', rows);
      response.status(200).send({
        result: 'Read',
        items: rows
      });
    }
  });
});

router.patch('/:item_pk', function(request, response) {
  const item_pk = request.params.item_pk;
  const sql = `
    update items set expire = ? where item_pk = ?;
  `;
  db.query(sql, [request.body.expire, item_pk], function(error, rows) {
    if (!error || db.error(request, response, error)) {
      console.log('Done items patch', rows);
      response.status(200).send({
        result: 'Updated'
      });
    }
  });
});

router.delete('/:item_pk', function(request, response) {
  const item_pk = request.params.item_pk;
  const sql = `
    delete from items where item_pk = ?;
  `;
  db.query(sql, [item_pk], function(error, rows) {
    if (!error || db.error(request, response, error)) {
      console.log('Done items delete', rows);
      response.status(200).send({
        result: 'Deleted'
      });
    }
  });
});

module.exports = router;
