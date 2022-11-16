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
  const q = request.query.q;
  const sql = `
    select
      grocery_pk,
      member_pk,
      name,
      date_format(enter, '%Y-%m-%d') as enter,
      date_format(expire, '%Y-%m-%d') as expire
    from groceries
    where member_pk = ? and name like ?
    order by ${request.query.orderByKey} ${request.query.orderByType}
    ;
  `;
  db.query(sql, [request.decoded.member_pk, '%' + q + '%'], function(error, rows) {
    if (!error || db.error(request, response, error)) {
      console.log('Done groceries get', rows);
      response.status(200).send({
        result: 'Read',
        groceries: rows
      });
    }
  });
});

router.get('/count', jwtAuth.tokenCheck, function(request, response) {
  const sql = `
    select
      count(*) as count
    from groceries
    where member_pk = ? and expire < now()
    ;
  `;
  db.query(sql, [request.decoded.member_pk], function(error, rows) {
    if (!error || db.error(request, response, error)) {
      console.log('Done groceries count get', rows);
      response.status(200).send({
        result: 'Counted',
        count: rows[0].count
      });
    }
  });
});

router.patch('/:grocery_pk', function(request, response) {
  const grocery_pk = request.params.grocery_pk;
  const sql = `
    update groceries set name = ?, enter = ?, expire = ? where grocery_pk = ?;
  `;
  db.query(sql, [request.body.name, request.body.enter, request.body.expire, grocery_pk], function(error, rows) {
    if (!error || db.error(request, response, error)) {
      console.log('Done groceries patch', rows);
      response.status(200).send({
        result: 'Updated'
      });
    }
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
