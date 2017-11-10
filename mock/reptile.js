const async = require('async');
const superagent = require('superagent');
const express = require('express');
const cheerio = require('cheerio');
const URL = require('url');
const eventproxy = require('eventproxy');
const fs = require('fs');
const path = require('path');

const ROOT_PATH = 'http://www.domi1688.com/list.aspx?city=&town=&label=&category1=&status=&tags=&address=&mtype=date&condition=&newcount=40279';

let app = new express();
let ep = new eventproxy();
let resTopic = [];
let rRandomID = function () {
  return Math.floor(0x1000000 + Math.random() * 0x1000000).toString(16).slice(1).toUpperCase();
};
app.get('/:id', function (req, res, next) {
  superagent.get(`${ROOT_PATH}&page=${req.params.id}`)
    .end(function (err2, res2) {
      if (err2) {
        return console.log(err2, ': ', res2);
      }
      let $ = cheerio.load(res2.text);
      let items = [];

      // 获取链接数组
      $('.pic>a').each(function (index, ele) {
        let $element = $(ele);
        items.push(URL.resolve('http://www.domi1688.com/', $element.attr('href')));
      });

      // 控制并发数
      let curCount = 0;
      let fetchUrl = function (url, callback) {
        // 延迟抓取毫秒数
        let delay = parseInt((Math.random() * 300000000) % 2000, 10);
        curCount++;
        console.log('现在的并发数是', curCount, '，正在抓取的是', url, '，耗时' + delay + '毫秒');
        superagent.get(url).end(function (err3, res3) {
          if (err3) {
            return console.log(err3);
          }
          let $ = cheerio.load(res3.text);
          let _hd = $('#proArea');
          let topicContent = {
            id: rRandomID(),
            href: url,
            name: _hd.find("h2").eq(0).text().trim(),
            place: _hd.find(".infoDec dl dd").eq(2).text().trim(),
            type: _hd.find(".infoDec dl dd").eq(0).text().trim() + '-' + _hd.find(".infoDec dl dd").eq(1).text().trim(),
            size: _hd.find(".infoDec dl dd").eq(3).text().trim(),
            flow: $('.mtHd').eq(0).find(".c").eq(2).text().trim(),
            detail: $('.detailWrap').text().trim(),
            livePic: URL.resolve(url, $('#midimg').attr('src')),
            status: $('.mtHd').eq(0).find(".c").eq(6).text().trim()
          };
          // 这里为何不直接用res1.send(topicContent将其显示到网页上？只要调用一次res1.send()，结束后就会自动加上res1.end()，下一次res1.send()时又要发送一次header头部的请求，这是不允许的，暂时将其结果保存到数据中，留个坑
          resTopic.push(topicContent);
        });
        // 手动设置延迟
        setTimeout(function () {
          curCount--;
          callback(null, url + ' html content');
        }, delay);
      };

      // 用async控制异步抓取
      // mapLimit(arr, limit, iterator, [callback])
      // 异步回调
      async.mapLimit(items, 5, function (topicsUrl, callback) {
        // 访问链接
        fetchUrl(topicsUrl, callback);
      }, function (err4, res4) {
        res.send(resTopic);
        console.log('final:', res4);
        fs.appendFile(path.resolve(__dirname, './mediaInfo.json'), JSON.stringify(resTopic, null, 4), {
          flag: 'w+',
          encoding: 'utf-8'
        }, (err) => {
          if (err) {
            console.error(err);
          } else {
            console.log('媒体村媒体信息，爬虫完毕', path.resolve(__dirname, './/mediaInfo.json'));
          }
        });
      });
    });
});

app.listen(3032, function (req, res) {
  console.log('app is running at port 3032......');
});
