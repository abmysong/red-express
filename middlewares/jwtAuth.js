const jwt = require('jsonwebtoken');
const privateKey = 'privateKey@semin.com';
// privateKey를 바탕으로 JWT가 암호환된 토큰을 생성한다.

const tokenCreate = function(request, response, member) {
  jwt.sign(member, privateKey, {
    expiresIn: '1d',
    subject: 'login'
  }, function (error, token) {
    if (error) return response.status(403).json({
      message: error.message
    });
    response.status(200).send({
      token: token
    });
  });
}

const tokenCheck = function (request, response, next) {
  const token = request.headers['x-jwt-token'];
  if (!token) return response.status(403).json({
    message: 'You need to login first'
  });
  jwt.verify(token, privateKey, function (error, decoded) {
    if (error) return response.status(403).json({
      message: error.message
    });
    request.decoded = decoded;
    next();
  });
};

module.exports = {
  tokenCreate: tokenCreate,
  tokenCheck: tokenCheck
};