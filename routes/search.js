const router = global.express.Router();
const members = global.mocks.members;

router.get('/', function(request, response) {
  const q = request.query.q;
  const searchMembers = [];
  for (let index = 0; index < members.length; index++) {
    if (!q || members[index].name.indexOf(q) >= 0) {
      searchMembers.push(members[index]);
    }
  }
  console.log('Done search get', searchMembers);
  response.status(200).send({
    result: 'Searched',
    members: searchMembers
  });
});

module.exports = router;
