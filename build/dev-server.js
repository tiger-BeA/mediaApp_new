'use strict'
require('./check-versions')();
const Task = require('./task');
const MASTER = 1,
  VISITOR = -1,
  AGENT = 0;
const config = require('../config');

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

const opn = require('opn');
const path = require('path');
const express = require('express');
const webpack = require('webpack');
const proxyMiddleware = require('http-proxy-middleware');
const webpackConfig = require('./webpack.dev.conf');
const bodyParser = require('body-parser');

// default port where dev server listens for incoming traffic
const port = process.env.PORT || config.dev.port;
// automatically open browser, if not set will be false
const autoOpenBrowser = !!config.dev.autoOpenBrowser;
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
const proxyTable = config.dev.proxyTable;

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const str2addSet = function (res, item) {
  let set = new Set(res.split(',').filter(val => {
    return val;
  }));
  item && set.add(item);
  let list = Array.from(set);
  return list.join(',');
};
const str2delSet = function (res, item) {
  let set = new Set(res.split(',').filter(val => {
    return val;
  }));
  item && set.delete(item);
  let list = Array.from(set);
  return list.join(',');
};
const successRes = function (res) {
  return {
    code: 200,
    data: res,
    message: 'success'
  };
};
const warningRes = function (res, code) {
  return {
    code: code,
    data: [],
    message: res
  }
};
const errorRes = function (err) {
  return {
    code: 404,
    data: [],
    message: err
  }
};

let apiRoutes = express.Router();

/*********************************** city ***********************************/
// table: '',
// param: [],
// res: allCity
apiRoutes.get('/getCity', function (req, res) {
  res.json(successRes(require('../mock/mock.json')));
});

/*********************************** users **********************************/
// table: users
// param: phone
// res: []
apiRoutes.get('/insertUser', function (req1, res1) {
  try {
    let task = new Task();
    task.query('insert into users(phone) values(?)', [req1.query.phone], function (err, res) {
      if (!err) {
        task.query('CREATE USER ? IDENTIFIED BY ?;', [req1.query.phone, ''], function (err, res) {
          if (!err) {
            res1.json(successRes(res));
          } else {
            res1.json(warningRes(res, 302));
          }
        });
      } else {
        res1.json(warningRes(res, 303));
      }
    });
  }
  catch (err) {
    res1.json(errorRes(err));
  }
});

// table: users
// param: identity, company, city, qq, name, phone, granted
// res: []
apiRoutes.get('/updateUser', function (req1, res1) {
  try {
    let task = new Task(),
      identity = req1.query.identity,
      company = req1.query.company,
      city = req1.query.city,
      qq = req1.query.qq,
      name = req1.query.name,
      phone = req1.query.phone,
      grant = req1.query.granted;
    task.query('update users set identity = ?, company = ?, city = ?, qq = ?, name = ?, granted= ? where phone = ?', [identity, company, city, qq, name, grant, phone], function (err, res) {
      if (!err) {
        let _query = [`DROP USER ?@?;`,
          `CREATE USER ? IDENTIFIED BY ?;`,
          `GRANT SELECT, UPDATE ON mediainfo.users TO ?@?;`,
          `GRANT ${(grant == AGENT) ? 'SELECT' : 'ALL'} ON mediainfo.info TO ?@?;`];
        task = new Task({
          user: phone,
          password: ''
        });
        let queryFunction = function (index, err = false, res = []) {
          if (index == _4) {
            if (!err) {
              res1.json(successRes(res));
            } else {
              res1.json(warningRes(res, 302));
            }
          } else {
            let params = [phone, index == 1 ? '%' : ''];
            if (!err) {
              task.query(_query[index++], params, function (err, res) {
                queryFunction(index++, err, res);
              });
            } else {
              res1.json(warningRes(res, 302 + index));
            }
          }
        };
        queryFunction(0);

        // task.query(_query[0], [phone, '%'], function (err, res) {
        //   if (!err) {
        //     task.query(_query[1], [phone, ''], function (err, res) {
        //       if (!err) {
        //         task.query(_query[2], [phone, '%'], function (err, res) {
        //           if (!err) {
        //             task.query(_query[3], [phone, '%'], function (err, res) {
        //               if (!err) {
        //                 res1.json(successRes(res));
        //               } else {
        //                 res1.json(warningRes(res, 302));
        //               }
        //             })
        //           } else {
        //             res1.json(warningRes(res, 303));
        //           }
        //         })
        //       } else {
        //         res1.json(warningRes(res, 304));
        //       }
        //     });
        //   } else {
        //     res1.json(warningRes(res, 305));
        //   }
        // });
      } else {
        res1.json(warningRes(res, 306));
      }
    });
  }
  catch (err) {
    res1.json(errorRes(err));
  }
});

// table: users
// param: phone
// res: *
apiRoutes.get('/getUser', function (req1, res1) {
  try {
    let task = new Task();
    task.query("select * from users where phone=?", [req1.query.phone], function (err, res) {
      if (!err) {
        res1.json(successRes(res));
      } else {
        res1.json(warningRes(res, 302));
      }
    });
  }
  catch (err) {
    res1.json(errorRes(err));
  }
});

// table: users
// param: []
// res: *
apiRoutes.get('/getAllUser', function (req1, res1) {
  try {
    let task = new Task();
    task.query('select * from users', [], function (err, res) {
      if (!err) {
        res1.json(successRes(res));
      } else {
        res1.json(warningRes(res, 302));
      }
    });
  } catch (err) {
    res1.json(errorRes(err));
  }
});

// table: users
// param: phone, item
// res: collectList
apiRoutes.get('/addCollect', function (req1, res1) {
  try {
    let task = new Task({
      user: req1.query.phone
    });
    task.query('select collectList from users where phone = ?', [req1.query.phone], function (err, res) {
      if (!err) {
        let collectList = '';
        res.forEach(val => {
          val.collectList && (collectList += val.collectList);
        });
        collectList = str2addSet(collectList, req1.query.item);
        task.query('update users set collectList = ? where phone = ?', [collectList, req1.query.phone], function (err, res) {
          if (!err) {
            res1.json(successRes(collectList));
          } else {
            res1.json(warningRes(res));
          }
        });
      } else {
        res1.json(warningRes(res));
      }
    });
  } catch (err) {
    res1.json(errorRes(err));
  }
});

// table: user
// param: phone, item
// res: collectList
apiRoutes.get('/delCollect', function (req1, res1) {
  try {
    let task = new Task();
    task.query('select collectList from users where phone = ?', [req1.query.phone], function (err, res) {
        if (!err) {
          let collectList = '';
          res.forEach(val => {
            val.collectList && (collectList += val.collectList);
          });
          collectList = str2delSet(collectList, req1.query.item);
          task.query('update users set collectList = ? where phone = ?', [collectList, req1.query.phone], function (err, res) {
            if (!err) {
              res1.json(successRes(collectList));
            } else {
              res1.json(warningRes(res, 302));
            }
          });
        } else {
          res1.json(warningRes(res, 303));
        }
      }
    );
  } catch (err) {
    res1.json(errorRes(err));
  }
});

// table: user
// param: phone
// res: collectList
apiRoutes.get('/getCollectList', function (req1, res1) {
  try {
    let task = new Task();
    task.query('select collectList from users where phone = ?', [req1.query.phone], function (err, res) {
        if (!err) {
          let collectList = '';
          res.forEach(val => {
            val.collectList && (collectList += val.collectList);
          });
          res1.json(successRes(collectList));
        }
        else {
          res1.json(warningRes(res, 302));
        }
      }
    );
  } catch (err) {
    res1.json(errorRes(err));
  }
});

// table: user
// param: phone
// res: reportList
apiRoutes.get('/getReportList', function (req1, res1) {
  try {
    let task = new Task();
    task.query('select reportList from users where phone = ?', [req1.query.phone], function (err, res) {
        if (!err) {
          let reportList = '';
          res.forEach(val => {
            val.reportList && (reportList += val.reportList);
          });
          res1.json(successRes(reportList));
        }
        else {
          res1.json(warningRes(res, 302));
        }
      }
    );
  } catch (err) {
    res1.json(errorRes(err));
  }
});

// table: users
// param: item, phone
// res: historyList
apiRoutes.get('/addHistory', function (req1, res1) {
  try {
    let task = new Task();

  } catch (err) {
    res1.json(errorRes(err));
  }
});
/************************************ info **************************************/
// table: info
// param: id
// res: *
apiRoutes.get('/getInfo', function (req1, res1) {
  try {
    let task = new Task();
    let idList = req1.query.id.split(','),
      len = idList.length;
    let sql = 'select * from info where id=?';

    for (let i = 1; i < len; i++) {
      idList[i] && (sql += ' or id=?')
    }

    task.query(sql, idList, function (err, res) {
      if (!err) {
        res1.json(successRes(res));
      } else {
        res1.json(warningRes(res, 302));
      }
    });
  } catch (err) {
    res1.json(errorRes(err));
  }
});

// table: info
// param: [],
// res: *
apiRoutes.get('/getAllInfo', function (req1, res1) {
  try {
    let task = new Task(),
      isPass = 1;
    task.query('select * from info where isPass = ?', [isPass], function (err, res) {
      if (!err) {
        res1.json(successRes(res));
      } else {
        res1.json(warningRes(res, 302));
      }
    });
  } catch (err) {
    res1.json(errorRes(err));
  }
});

/************************************ users & info ***************************/
// table: users, info
// param: {
//     info: id, href, name, place, type, size, flow, detail, livePic
//     users: phone, item
// }
// type: post
// res: ownerList
apiRoutes.post('/addInfo', function (req1, res1) {
  try {
    let infoParams = res.body.info,
      id = infoParams.id || '',
      href = infoParams.href || '',
      name = infoParams.name || '',
      place = infoParams.place || '',
      type = infoParams.type || '',
      size = infoParams.size || '',
      flow = infoParams.flow || '',
      detail = infoParams.detail || '',
      livePic = infoParams.livePic || '',
      status = null,
      isPass = 0;
    let usersParams = res.body.user,
      phone = usersParams.phone;
    let task = new Task({
      user: phone,
      password: ''
    });
    task.query('insert into info(id, href, name, place, type, size, flow, detail, livePic, status, isPass) values(?,?,?,?,?,?,?,?,?,?,?)', [id, href, name, place, type, size, flow, detail, livePic, status, isPass], function (err, res) {
      if (!err) {
        task = new Task({
          user: phone,
          password: ''
        });
        task.query('select ownerList from users where phone = ?', [req1.query.phone], function (err, res) {
          if (!err) {
            let ownerList = '';
            res.forEach(val => {
              val.ownerList && (ownerList += val.ownerList);
            });
            ownerList = str2addSet(ownerList, id);
            task.query('update users set ownerList = ? where phone = ?', [ownerList, phone], function (err, res) {
              if (!err) {
                res1.json(successRes(res));
              } else {
                res1.json(warningRes(res, 302));
              }
            });
          } else {
            res1.json(warningRes(res, 303));
          }
        });
      } else {
        res1.json(warningRes(res, 304));
      }
    });
  } catch (err) {
    res1.json(errorRes(err));
  }
});

// table: users, info
// param: {
//    user: phone, item,
//    info: item
// }
// type: post
// res:
apiRoutes.post('/addReport', function (req1, res1) {
  try {
    let phone = req1.body.phone || '',
      item = req1.body.item || '',
      status = req1.body.status || '';
    let task = new Task({
      user: phone,
      password: ''
    });
    task.query('select reportList from users where phone = ?', [phone], function (err, res) {
      if (!err) {
        let reportList = '';
        res.forEach(val => {
          val.reportList && (reportList += val.reportList);
        });
        reportList = str2addSet(reportList, item);
        task.query('update users set reportList = ? where phone = ?', [reportList, phone], function (err, res) {
          if (!err) {
            task.query('select status from info where id = ?', [item], function (err, res) {
              if (!err) {
                let statusList = '';
                res.forEach(val => {
                  val.status && (statusList += val.status);
                });
                statusList += (statusList ? ',' : '') + status;
                task.query('update info set status = ? where id = ?', [statusList, item], function (err, res) {
                  if (!err) {
                    res1.json(successRes(statusList));
                  } else {
                    res1.json(warningRes(res, 302));
                  }
                })
              } else {
                res1.json(warningRes(res, 303));
              }
            });
          } else {
            res1.json(warningRes(res));
          }
        });
      } else {
        res1.json(warningRes(res));
      }
    });
  } catch (err) {
    res1.json(errorRes(err));
  }
});
/*********************************** other *********************************/
// table: ?
// param: []
// res: *
apiRoutes.get('/queryAll/:ts', function (req1, res1) {
  try {
    let task = new Task();
    task.query('select * from ?', [res1.query.ts], function (err, res) {
      if (!err) {
        res1.json(successRes(res));
      } else {
        res1.json(warningRes(res, 302));
      }
    });
  } catch (err) {
    res1.json(errorRes(err));
  }
});

app.use('/ajax', apiRoutes);

const compiler = webpack(webpackConfig);

const devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
});

const hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: false,
  heartbeat: 2000
});
// force page reload when html-webpack-plugin template changes
// currently disabled until this is resolved:
// https://github.com/jantimon/html-webpack-plugin/issues/680
// compiler.plugin('compilation', function (compilation) {
//   compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
//     hotMiddleware.publish({ action: 'reload' })
//     cb()
//   })
// })

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware);

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  let options = proxyTable[context];
  if (typeof options === 'string') {
    options = {target: options}
  }
  app.use(proxyMiddleware(options.filter || context, options))
});

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')());

// serve webpack bundle output
app.use(devMiddleware);

// serve pure static assets
const staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory);
app.use(staticPath, express.static('./static'));

const uri = 'http://10.240.137.218:' + port;

let _resolve;
let _reject;
let readyPromise = new Promise((resolve, reject) => {
  _resolve = resolve;
  _reject = reject;
});

let server;
let portfinder = require('portfinder');
portfinder.basePort = port;

console.log('> Starting dev server...');
devMiddleware.waitUntilValid(() => {
  portfinder.getPort((err, port) => {
    if (err) {
      _reject(err)
    }
    process.env.PORT = port;
    let uri = 'http://10.240.137.218:' + port;
    console.log('> Listening at ' + uri + '\n');
    // when env is testing, don't need open it
    if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
      opn(uri)
    }
    server = app.listen(port);
    _resolve()
  })
});

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
};
