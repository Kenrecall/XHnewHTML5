
/**
 * Created by way on 16/9/19.
 */

export default {
  app: {
    token: 'nuoya.token',
    code: 'nuoya.code',
    lastCode: 'nuoya.lastCode',
    docker: 'nuoya.docker',
    hotCount: 20, // 热门分享一次获取数量
    imgWHR: 1.9,   // 上传图片宽高比
    imgCompress: 0.3 // 图片压缩比
  },
  dev: {
/*
    token: 'eyJhbGciOiJIUzI1NiIsICJ0eXAiOiJKV1QifQ'
      + '.eyJwaWQiOiIwMjExMTYzMCJ9'
      + '.-VFtlNpkxn5DPu3kTR2ZsFhY6I3OHfpMikwD8EMMRvs'
*/
  },
  rel: {
    host: 'http://rel.nuoyadalu.com/',
    userInfo: 'user/api/getInfo',
    token: 'user/api/getToken',
    searchJoin: 'search/api/join',
    searchCity: 'search/api/city',
    searchGet: 'search/api/get',
    searchSet: 'search/api/set',
    couponGet: 'coupon/api/get',
    couponPoster: 'coupon/api/poster',
    couponPosterImg: 'http://nuoya-10038118.image.myqcloud.com/test1471935786508',
  },
  api: {
    wxhost: 'http://wx.nuoyadalu.com', //获取身份域名
    //userRelToken: '/user/api/relToken', //获取token
    userRelToken: '/user/api/relTokens', //获取  用code 获取 token
    userRelandwx: '/user/api/relandwx', // 获取用户信息



    host: 'http://wx.nuoyadalu.com/',
    book: 'prod/api/book',
    token: 'user/api/getToken',
    wxsign: 'wx/getSign',
    prodLoad: 'prod/api/load',
    prodList: 'prod/api/list',
    prodHead: 'prod/api/getHeadUrl',
    shipList: 'ship/api/list',
    topicLoad: 'topic/api/load',
    topicNewNo: 'topic/api/newTopicNo',
    topicSave: 'topic/api/save',
    articleLoad: 'topic/api/load',
    articleNewNo: 'article/api/newTopicNo',
    articleSave: 'article/api/save',
    couponGet: 'coupon/api/get',
    couponCheck: 'coupon/api/check',
    mutualCalssRepGet: 'mutual/api/getClassRep'
  },
  view: {
    host: 'http://nydl-10038118.cos.myqcloud.com/',
    hot: 'view/hot.html',
    book: 'view/book.html',
    flightmbJoin:'flightmb/join.html'
  },
  doc: {
    host: 'http://nydl-10038118.cos.myqcloud.com/doc/',
    mutual: 'mutual/'
  }
};
