# 媒体村运行介绍

> mediaApp_new

## 数据库搭建

在`mediaApp_new/otherImport!!!!!`的目录中有个sql文件，将其用mysql的可视化工具（如Navicat）导入到本地的数据库并打开连接，即搭建好数据库

其中info表是我从网上爬虫得来的数据

user表是自行登录/注册的结果

## 编译运行

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev
```

然后就可看到运行情况

可自行登录、注册

查看媒体列表、浏览历史、报备、地图等等