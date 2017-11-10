const fs = require('fs');
const mysql = require('mysql'); // 引用mysql模块。注意要先安装mysql： npm install mysql
const config = require('./db');
const onelib_pool = mysql.createPool(config.onelib);
exports.onelib_pool = onelib_pool;
