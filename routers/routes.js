const routes = {
  // 取得當前剩餘投票數與時間
  'get /thumbs': 'thumbs.find',
  // 推或噓文，id為文章id
  'put /thumbs': 'thumbs.update',

  // 取得使用者列表
  'get /user': 'user.find',
  // 取得單一使用者
  'get /user/:id': 'user.findOne',
  // 編輯
  'put /user': 'user.update',
  // 新增
  'post /user': 'user.add',
  // 刪除
  'delete /user/:id': 'user.delete',

  // 取得文章列表
  'get /article': 'article.find',
  // 取得單一文章
  'get /article/:id': 'article.findOne',
  // 編輯
  'put /article': 'article.update',
  // 新增
  'post /article': 'article.add',
  // 刪除
  'delete /article/:id': 'article.delete',

  // 取得評論(火苗)列表
  'get /flames': 'flames.find',
  // 取得單一文章的評論
  'get /flames/:id': 'flames.findOne',
  // 編輯
  'put /flames': 'flames.update',
  // 新增
  'post /flames': 'flames.add',
  // 刪除
  'delete /flames/:id': 'flames.delete',

  // 取得tag列表
  'get /tag': 'tag.find',
  // 取得單一tag
  // 'get /tag/:id': 'tag.findOne',
  // 編輯
  'put /tag': 'tag.update',
  // 新增
  'post /tag': 'tag.add',
  // 刪除
  'delete /tag/:id': 'tag.delete',

  // 寄出修改密碼的信
  'post /password': 'pw.sendEmail',
  // 修改密碼
  'put /password': 'pw.update',

  // 查詢影片是否有截圖
  'get /screenshot/:id': 'screenshot.find',
  // 上傳圖片
  'post /screenshot': 'screenshot.upload',
  // 圖片轉base64(測試用)
  'post /screenshot/encode': 'screenshot.encode',

  /**
   * AUTH/OAUTH快速登入,綁定第三方授權,新增/更新用戶資料資料
   * @param {string} type - facebook, google
   */
  'post /signin/:type': {
    controller: 'signin',
    action: 'signin',
    middleware: []
  }

  // /**
  //  * 解除綁定
  //  * @param {string} type - facebook, google, apple
  //  */
  // // 解除綁定
  // 'delete /signin/:type': {
  //   controller: 'auth',
  //   action: 'unsubscribe',
  //   middleware: ['verifyXtoken', 'requestTimeLimit-5']
  // }
}

export default routes
