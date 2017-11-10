const mysql = require('../config/mysql');
let Task = function () {
}; // 预定义一个空的类，接下来只需要往里增加方法即可

Task.prototype.query = function (sql, params, callback) {  // 增加一个方法，名为query，传入参数为id和回调函数callback
  // let sql = "SELECT * FROM tasks WHERE id =?";  // sql查询语句，注意这里的“?”号，它会在query的时候被处理

  // 获取mysql的onelib_pool连接池，以回调的方式处理（即获取成功后，执行下一步）
    mysql.onelib_pool.getConnection(function (err, connection) {
      if (err) {
        callback(true, err);
        return;
      }
      // 获取成功后，执行query
      // 注意到这里有三个参数，第一个是sql语句，第二个是一个数组，第三个是回调函数
      // 需要着重说明的是第二个参数，它将依次替换sql里的“?”号
      // sql语句被替换后，会是这样的："SELECT * FROM tasks WHERE id = " + id
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
