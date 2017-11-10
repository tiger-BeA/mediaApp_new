module.exports = {
  user: {
    insert: 'insert into users(phone) values(?);',
    update: 'update users set identity = ?, company = ?, city = ?, qq = ?, name = ?, granted= ? where phone = ?;',
    query: 'select ? from users ;',
    queryAll: 'select * from users;',
    queryCollect: 'select collectList from users where phone = ?;',
    addCollect: 'update users set collectList = ? where phone = ?;'
  },
  info: {
    insert: 'insert into info(href, name, place, type, size, flow, detail, livePic, status, adCard, planCard) values(?,?,?,?,?,?,?,?,?,?,?);',
    queryAll: 'select * from info;',
  },
  profit: {
    queryTs: 'select * from ?;'
  }
};
//INSERT INTO info(id, place,type,size,timeSlot,rateCard,flow,detail,owner,livePic,geograPic,adCard,planCard,companyList) VALUES('SV7832', NULL, NULL, NULL, NULL, NULL, NULL,NULL, NULL, NULL,NULL, NULL, NULL, NULL);
