const mysql = require('mysql');
const config = {
  onelib: {
    connectionLimit: 10,
    host: 'localhost',   // MySQL所在服务器IP
    user: 'root',        // 用户名
    password: '1234',        // 密码
    database: 'mediainfo',   // 数据库名称
    port: 3306,          // 端口号
    dateStrings: true,   // 时间以字符串形式显示，否则会有类似这样的显示：Thu Apr 14 2016 00:00:00 GMT+0800 (中国标准时间) 17:20:12
  }
};
const onelib_pool = mysql.createPool(config.onelib);
exports.onelib_pool = onelib_pool;
