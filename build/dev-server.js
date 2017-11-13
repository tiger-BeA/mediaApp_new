'use strict'
require('./check-versions')();
const Task = require('./task');
const sqlState = require('./sqlState');
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

let apiRoutes = express.Router();
apiRoutes.get('/db/citys', function (req, res) {
  res.json({
    code: 200,
    data: require('../mock/mock.json')
  });
});
apiRoutes.get('/db/mediaInfo', function (req, res1) {
  try {
    let task = new Task();
    task.query(sqlState.info.queryAll, [], function (err, res) {
      if (!err) {
        res1.json({
          code: 200,
          data: res,
          message: 'success'
        });
      } else {
        res1.json({
          code: 302,
          data: [],
          message: res
        });
      }
    });
  } catch (err) {
    res1.json({
      code: 404,
      data: [],
      message: err
    });
  }
});
apiRoutes.get('/info/:infoId', function (req1, res1) {
  try {
    let task = new Task();
    task.query("select * from info where id=?", [req1.params.infoId], function (err, res) {
      if (!err) {
        res1.json({
          code: 200,
          data: res,
          message: 'success'
        });
      } else {
        res1.json({
          code: 302,
          data: [],
          message: res
        });
      }
    });
  } catch (err) {
    res1.json({
      code: 404,
      data: [],
      message: err
    });
  }
});

apiRoutes.get('/ajax/user', function (req1, res1) {
  try {
    let task = new Task();
    task.query("select * from users where phone=?", [req1.query.phone], function (err, res) {
      if (!err) {
        res1.json({
          code: 200,
          data: res,
          message: 'success'
        });
      } else {
        res1.json({
          code: 302,
          data: [],
          message: res
        });
      }
    });
  }
  catch (err) {
    res1.json({
      code: 404,
      data: [],
      message: err
    });
  }
});
apiRoutes.get('/ajax/insertUser', function (req1, res1) {
  try {
    let task = new Task();
    task.query(sqlState.user.insert, [req1.query.phone], function (err, res2) {
      if (!err) {
        task.query('create user ?@? identified by ?', [req1.query.phone, '%', ''], function(err, res2) {
          if (!err) {
            res1.json({
              code: 200,
              data: res2,
              message: 'success'
            });
          }
        });
      } else {
        res1.json({
          code: 302,
          data: [],
          message: res2
        });
      }
    });
  }
  catch (err) {
    res1.json({
      code: 404,
      data: [],
      message: err
    });
  }
});
apiRoutes.get('/ajax/updateUser', function (req1, res1) {
  try {
    let task = new Task();
    let identity = req1.query.identity,
      company = req1.query.company,
      city = req1.query.city,
      qq = req1.query.qq,
      name = req1.query.name,
      phone = req1.query.phone,
      grant = req1.query.grant;
    let params = [identity, company, city, qq, name, grant, phone];
    task.query(sqlState.user.update, params, function (err, res) {
      if (!err) {
        res1.json({
          code: 200,
          data: res,
          message: 'success'
        });
      } else {
        res1.json({
          code: 302,
          data: [],
          message: res
        });
      }
    });
  }
  catch (err) {
    res1.json({
      code: 404,
      data: [],
      message: err
    });
  }
});
apiRoutes.get('/ajax/queryAllUsers', function (req1, res1) {
  try {
    let task = new Task();
    task.query(sqlState.user.queryAll, [], function (err, res) {
      if (!err) {
        res1.json({
          code: 200,
          data: res,
          message: 'success'
        });
      } else {
        res1.json({
          code: 302,
          data: [],
          message: res
        });
      }
    });
  } catch (err) {
    res1.json({
      code: 404,
      data: [],
      message: err
    });
  }
});
apiRoutes.get('/ajax/queryUsers', function (req1, res1) {
  try {
    let task = new Task();
    task.query('select * from users where phone = ?', [req1.query.phone], function (err, res) {
      if (!err) {
        res1.json({
          code: 200,
          data: res,
          message: 'success'
        });
      } else {
        res1.json({
          code: 302,
          data: [],
          message: res
        });
      }
    });
  } catch (err) {
    res1.json({
      code: 404,
      data: [],
      message: err
    });
  }
});

apiRoutes.get('/ajax/addCollectUser', function (req1, res1) {
  try {
    let task = new Task();
    task.query(sqlState.user.queryCollect, [req1.query.phone], function (err, res2) {
      if (!err) {
        let collectList = [];
        res2.forEach(val => {
          if (val.collectList) {
            collectList = collectList.concat(val.collectList.split(','));
          }
        });
        collectList.push(req1.query.item);
        task.query(sqlState.user.addCollect, [collectList.join(','), req1.query.phone], function (err, res3) {
          if (!err) {
            res1.json({
              code: 200,
              data: collectList,
              message: 'success'
            });
          } else {
            res1.json({
              code: 303,
              data: [],
              message: err
            });
          }
        });
      } else {
        res1.json({
          code: 302,
          data: [],
          message: err
        });
      }
    });
  } catch (err) {
    res1.json({
      code: 404,
      data: [],
      message: err
    });
  }
});
apiRoutes.get('/ajax/cancelCollectUser', function (req1, res1) {
  try {
    let task = new Task();
    task.query(sqlState.user.queryCollect, [req1.query.phone], function (err, res2) {
        if (!err) {
          let collectList = [];
          res2.forEach(val => {
            if (val.collectList) {
              collectList = [...collectList, ...(val.collectList.split(','))];
            }
          });
          let deleteTarget = (collectList && req1.query.item) ? collectList.findIndex(val => {
            return val == req1.query.item
          }) : -1;
          if (deleteTarget != -1) {
            collectList.splice(deleteTarget, 1);
          }
          task.query(sqlState.user.addCollect, [collectList.join(','), req1.query.phone], function (err, res3) {
            if (!err) {
              res1.json({
                code: 200,
                data: collectList,
                message: 'success'
              });
            } else {
              res1.json({
                code: 303,
                data: [],
                message: err
              });
            }
          });
        }
        else {
          res1.json({
            code: 302,
            data: [],
            message: err
          });
        }
      }
    );
  } catch (err) {
    res1.json({
      code: 404,
      data: [],
      message: err
    });
  }
});
apiRoutes.get('/ajax/queryCollectUser', function (req1, res1) {
  try {
    let task = new Task();
    task.query(sqlState.user.queryCollect, [req1.query.phone], function (err, res2) {
        if (!err) {
          let collectList = [];
          res2.forEach(val => {
            if (val.collectList) {
              collectList = [...collectList, ...(val.collectList.split(','))];
            }
          });
          res1.json({
            code: 200,
            data: collectList,
            message: 'success'
          });
        }
        else {
          res1.json({
            code: 302,
            data: [],
            message: err
          });
        }
      }
    );
  } catch (err) {
    res1.json({
      code: 404,
      data: [],
      message: err
    });
  }
});
apiRoutes.get('/ajax/queryAllInfo', function (req1, res1) {
  try {
    let task = new Task();
    task.query(sqlState.info.queryAll, [], function (err, res) {
      if (!err) {
        res1.json({
          code: 200,
          data: res,
          message: 'success'
        });
      } else {
        res1.json({
          code: 302,
          data: [],
          message: res
        });
      }
    });
  } catch (err) {
    res1.json({
      code: 404,
      data: [],
      message: err
    });
  }
});
apiRoutes.get('/ajax/queryAll/:ts', function (req1, res1) {
  try {
    let task = new Task();
    task.query(sqlState.profit.queryTs, [res1.query.ts], function (err, res) {
      if (!err) {
        res1.json({
          code: 200,
          data: res,
          message: 'success'
        });
      } else {
        res1.json({
          code: 302,
          data: [],
          message: res
        });
      }
    });
  } catch (err) {
    res1.json({
      code: 404,
      data: [],
      message: err
    });
  }
});

app.use('/api', apiRoutes);

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
