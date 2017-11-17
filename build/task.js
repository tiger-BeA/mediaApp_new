const mysql = require('../config/mysql');
let Task = function ({user = 'root', password = '1234'} = {}) {
  this.mysql = mysql;
  this.mysql.user = user;
  this.mysql.password = password;
};

Task.prototype.query = function (sql, params, callback) {
  // 获取mysql的onelib_pool连接池，以回调的方式处理（即获取成功后，执行下一步）
  this.mysql.onelib_pool.getConnection(function (err, connection) {
    if (err) {
      callback(true, err);
      return;
    }
    connection.query(sql, params, function (err, res) {
      if (err) {
        callback(true, err);
        return;
      }
      callback(false, res);
      connection.release();
    });
  });
};

module.exports = Task;
