const fs = require('fs');
const path = require('path');

fs.readFile(path.resolve(__dirname, './data/city.json'), { encoding: 'utf-8' }, (err, data) => {
  if (err) {
    console.error(err);
  } else {
    console.log('开始合并城市数据------', path.resolve(__dirname, './data/city.json'));
    let _result = [],
      _city = null;
    JSON.parse(data).forEach((item, i1) => {
      _city = {
        value: item.name,
        label: item.name,
      };
      item.children && item.children.forEach((val, i2) => {
        (!_city.children) && (_city.children = []);
        _city.children.push({
          value: val.name,
          label: val.name
        });
        val.children && val.children.forEach((v, i3) => {
          (!_city.children[i2].children) && (_city.children[i2].children = []);
          _city.children[i2].children.push({
            value: v.name,
            label: v.name
          });
        });
      });
      _result.push(_city);
    });
    fs.writeFile(path.resolve(__dirname, './mock.json'), JSON.stringify(_result, null, 4), { flag: 'w+', encoding: 'utf-8' }, (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log('合并成功------', path.resolve(__dirname, './mock.json'));
      }
    })
  }
})
