/**
 * Created by way on 16/9/28.
 */

import cfg from '../config';
const $ = require('../lib/kdom');
import {getView, get, post ,myalertp,SetCookie,getCookieVal,GetCookie,mypost ,userOnoffpp ,setTitle,myget} from '../util/api';// myalertp 封装的 alert提示弹层
import { urlParam, session, getHash,getBaseUrl} from '../lib/kutil';

let _view = require('raw!./book.html');
var fcity = 'a';
var tcity ='';
var OT = 1;
var theID ='';
var theCarrier=''; //获取改签规则的数据
var bookdata1 = {};// 单程数据包
var bookdata2 = {};// 返程数据包
var Member = ''; //  product 传递过来的 用户登录信息
var ShipAddr=''; //快递地址

var onOFFs =true; // 单程 或去程 改签开关按钮 显示 或者不显示 退改签
var onOFFs1 =true; //  返程  改签开关按钮 显示 或者不显示 退改签
var onOFF =true; // 保险开关按钮 30的
var onOFFt =false;// 保险开关按钮 20的 深圳直营 会有2个选择保险按钮
var onOFFp =true;// 凭证开关
var onOFFr =true;// 差旅开关
var onOFFtr =true;// 因公因私开关 用于 删除乘机人后 差旅乘客默认 因公
var ShipFeeOnoff = '';// 快递费
var shipMoney = 10; //  收费用的时候为 15 这个价格可以改变
var insureType ='' ; // 单程 或者去程  保险类型 用于加载保险说明
var insureType1 ='' ; // 返程 保险类型 用于加载保险说明
var insureTypeb = '';
var cabinType = '';// 判断是否是直营
var onepiect1 ='';//  单程 或去程票面价格
var onepiect2 ='';//  返程程票面价格
var Fprice = '';// 单全价 儿童不能往返 除以2 已经四舍五入
//var Fpricey = '';// y仓位的一半
var DS = '';// 折扣
var DS1 = '';// 返程 或者儿童 折扣
var  ynum =0;  //  儿童个数
var  onum =0;  // 成人个数
var  odnum =0;  // 老年个数
var backFlight = false; //  是否 返航
var  checkPricedata ='';// 验价用的 航班信息
var mPriceObj = {};//价格校验，用于验价存储数据，值都为true则下我们的单子，否则下直营的单子（后天新加一个订单）

var nottripNum = []; //非差旅人员
var mIsNormalPassenger = true;//true散客，false差旅
var mPassengerIsValidated = true;//乘客验证是否通过
var UnitNo = '010135.00008006'; // 不知道是什么值  好像是 要接口拿
var theAddresdata ='';// 存放 收件凭证地址
var Tripdata = '';
var zyTable = ''; // 判断直营  区别 cabintype  这个直营是 有DsOnePrice综合判断的  产品页面做了判断的
var zyTablechange = 0; // 用于 传入 订单页面时候 显示 客服电话问题  在 差旅的情况下 最终判断是不是 直营
var zyCP = '';// 航空公司号 用于 保险类型区别 直营 非直营
var isY=true;// 判断是不是Y仓位以上  true 表示是Y舱位 及以下
var  isYca = '';// 儿童具体要的舱位编码
var isDis=false;// 是不是折扣舱位  默认不是折扣舱位   false 不是折扣舱位  true 是折扣舱位

var hbjinef = 0;//红包的价格 去程
var hashongbaof = 'false';// 选择的航班是否有红包 去程
var hbjinet = 0;//红包的价格 返程
var hashongbaot = 'false';// 选择的航班是否有红包 返程
var themoneycheck = 800;// 儿童价格大于等于这个后 有红包

//var DsOnePrice = '';// 直营参数
//var isTrip =  0;//表示没匹配   1//直营差旅  2//直营非差旅
var isTrippok = 3;//  0 表示 非匹配直营  1 匹配直营  2 非直营
var ZhPolicyId1 = 0;//  去程 或者单程 深圳航司 的 ZhPolicyId
var ZhPolicyId2 = 0;//  返程 深圳航司 的 ZhPolicyId
var  CHOtherParam1 ={};// 川航直营专用
var  CHOtherParam2 ={};// 川航直营专用

var thenophonechild = '';// 儿童没有电话的时候 默认填写这个

// 权限浮动价格问题
var fromlowflght = {}; //  存放单程或者 去程最浮动航班信息
var fromlowflghtprice =''; //  存放单程或者 去程浮动价价格

var tolowflght = {};  //返程浮动航班信息
var tolowflghtprice = {};  //返程浮动航班价格


// 权限最低价问题
var fromlowflghto = {}; //  存放单程或者 去程最浮动航班信息
var fromlowflghtpriceo =''; //  存放单程或者 去程浮动价价格

var tolowflghto = {};  //返程浮动航班信息
var tolowflghtpriceo = {};  //返程浮动航班价格
var tonowpriceo = {};  //返程目前价格

var isclearps = 1; // 是否清除乘机人

// 余票数量
var frestnum = 0;
var trestnum = 0;

var ddataar = [];// 根据乘机人做出的 差旅判断 数组

var pfjpricek = {};//仓位编码 prouduct传过来的

//  验票 返回数据保存
var urldataxh ='';
var  formnumber = '';//存放　去程实时验票数据　或者单程
//var  ishave = true; // 是否有差旅功能 默认有

var eisall = false;// 是否 让因公变色 且不能点击


export default class {
      path = '/flightmb/book$';
      hash = '/flightmb/book';
      title = '机票预订';
      constructor(opt) {
        opt = opt || {};
        this.path = opt.path || this.path;
        this.hash = opt.hash || this.hash;
        this.title = opt.title || this.title;
      }

      // 输出视图
      view(cb) {
        if (!_view) {
          // 静态资源浏览器有缓存,增加时标,强制刷新!
          getView(`${cfg.view.searchJoin}?t=${(+new Date())}`, '', (rs) => {
            _view = rs;
            cb(null, _view);
          });
        } else{
          cb(null, _view);
        }
      }

      // 在已经加载的视图上操作
      bind(dv, params) {
         console.log(params);
          isclearps =params.isclearps;



          if(params.pbtype ==1){  //  判断进入该页面的上一步操作 更改乘机人
              addPass(params.pdata); // 更改乘机人
              checkChailvPassenger();// 检查乘客 并计价  开始是没有这个的


          }else if(params.pbtype ==2){

               addLinkpe(params.linkdata); // 更改联系人
          }else if(params.pbtype ==40){  // 联系地址
              if(params.data ==''){
                 // console.log('发票地址直接返回');
                  //console.log(params.data);
                  $.qu('.proof-btnbox1').style.left ='0.1rem';
                  $.qu('.proof-btnbox').style.backgroundColor ='#ccc';
                  $.qu('.proof-box').style.display ='none';
                  onOFFp =true;
                  $.qu('.proof-boxt2n').innerHTML ='';
                  $.qu('.proof-boxt2p').innerHTML ='';
                  $.qu('.proof-boxt2c').innerHTML ='';
                  $.qu('.proof-boxt2t').innerHTML ='';

                  alloneMone();// 计算价格

              }else{
                  //console.log(params.data);
                  var id =params.data.psid;
                  var dataadr =params.data.data;

                  $.qu('.proof-btnbox1').style.left ='1.2rem';
                  $.qu('.proof-btnbox').style.backgroundColor ='#cc0000';
                  $.qu('.proof-box').style.display ='block';

                  onOFFp =false;

                  $.qu('.proof-boxt2n').innerHTML =dataadr.Name;
                  $.qu('.proof-boxt2p').innerHTML =dataadr.Phone;
                  $.qu('.proof-boxt2c').innerHTML =dataadr.Province+dataadr.City+dataadr.Town;
                  $.qu('.proof-boxt2t').innerHTML =dataadr.Addr;
                  theAddresdata =dataadr.Province+dataadr.City+dataadr.Town+dataadr.Addr+'('+dataadr.Name+'收)'+dataadr.Phone;

                  //checkChailvPassenger();//  检查乘客信息
                   alloneMone();// 计算价格
              }
          }else if(params.btype == 50){ // 差旅原因
              Tripdata =params.readata;
              //console.log(params.readata.TripType)
              if(params.readata != ''){
                  $.qu('.Tripb-box').style.display ='block';
                  $.qu('.Tripb-boxt2n').innerHTML = params.readata.TripType;
                  $.qu('.Tripb-boxt2p').innerHTML = params.readata.TripReason;
                  $.qu('.Tripb-boxt2c').innerHTML = params.readata.PriceReason;
                  $.qu('.Tripb-boxt2t').innerHTML = params.readata.TripNote;



                  $.qu('.Tripb-btnbox1').style.left ='1.2rem';
                  $.qu('.Tripb-btnbox').style.backgroundColor ='#cc0000';
                  $.qu('.Tripb-box').style.display ='block';
                  onOFFr =false;


              }else{
                  $.qu('.Tripb-btnbox1').style.left ='0.1rem';
                  $.qu('.Tripb-btnbox').style.backgroundColor ='#ccc';
                  $.qu('.Tripb-box').style.display ='none';
                  onOFFr =true;

              }



          }else if(params.pbtype ==3){ // 单或者双程页面进入
                bookdata1 =params.ptbdata1;// 去程航班 或者单程航班  thelowf
                bookdata2 =params.ptbdata2; // 返程航班

                pfjpricek =params.pfjprice;// 存储 Y仓位以上 基础仓位价格
              if(bookdata2){
                  // 往返
                  backFlight =true;// 往返 标记
              }else{
                  backFlight =false;// 往返 标记
              }

              var  time2 ='';
              if(bookdata2){
                  time2 = bookdata2.data1;
              }
              var  todetaildata={
                  city00:bookdata1.fplace,
                  city11:bookdata1.tplace,
                  time00:bookdata1.data1,
                  time11:time2,
                  cliktype:1,
                  backtype:1
              }

              if(backFlight){
                  urldataxh= {citydetail1:todetaildata.city00,citydetail2:todetaildata.city11,timedetail1:todetaildata.time11,timedetail2:todetaildata.time00,cliktype:1,backtype:1}
              }else{
                  urldataxh= {citydetail1:todetaildata.city00,citydetail2:todetaildata.city11,timedetail1:todetaildata.time00,timedetail2:todetaildata.time11,cliktype:1,backtype:1}
              }





             // var thecab =bookdata1.theCa;

               // 初始话 乘机人个数
               //ynum =0;  //  儿童个数
               //onum =0;  // 成人个数
               //odnum =0 // 老人个数
              // 浮动价格
              if(bookdata1.thelowf){
                  // 浮动价格
                  fromlowflght = bookdata1.thelowf; //  存放单程或者 去程最低价航班
                  fromlowflghtprice =fromlowflght.pice1;//  存放单程或者 去程最低价价格
                  //fromnowprice =bookdata1.pice1; // 当前价格

                  // 最低价
                  fromlowflghto = bookdata1.thelowfo; //  存放单程或者 去程最低价航班
                  fromlowflghtpriceo =fromlowflghto.pice1;//  存放单程或者 去程最低价价格
                  //fromnowpriceo =bookdata1.pice1; // 当前价格
                  // 存储当前选择的航班信息
                  var bookda1str = JSON.stringify(bookdata1);
                  // 存储 当前选择的 航班信息
                  localStorage.setItem('xhbookd1',bookda1str)
              }else{
                  // 没有低价航班信息 获取存储的
                  var bookd1 = JSON.parse( localStorage.getItem("xhbookd1"));
                  // 浮动价格
                  fromlowflght = bookd1.thelowf; //  存放单程或者 去程最低价航班
                  fromlowflghtprice =fromlowflght.pice1;//  存放单程或者 去程最低价价格
                  //fromnowprice =bookd1.pice1; // 当前价格
                  // 最低价
                  fromlowflghto = bookd1.thelowfo; //  存放单程或者 去程最低价航班
                  fromlowflghtpriceo =fromlowflghto.pice1;//  存放单程或者 去程最低价价格
                  //fromnowpriceo =bookd1.pice1; // 当前价格


              }
              if(bookdata2 && bookdata2.thelowf){ // 返程 航班信息
                  // 浮动价格
                  tolowflght = bookdata2.thelowf;  //返程最低价航班
                  tolowflghtprice = tolowflght.pice1;  //返程最低价航班
                  //tonowprice =bookdata2.pice1; //当前价格
                  //最低价
                  tolowflghto = bookdata2.thelowfo;  //返程最低价航班
                  tolowflghtpriceo = tolowflghto.pice1;  //返程最低价航班
                  //tonowpriceo =bookdata2.pice1; //当前价格
                  // 存储当前选择的航班信息 返程
                  var bookda2str = JSON.stringify(bookdata2);
                  // 存储 当前选择的 航班信息
                  localStorage.setItem('xhbookd2',bookda2str)

              }else{
                  // 没有低价航班信息 获取存储的
                  var bookd2 = JSON.parse( localStorage.getItem("xhbookd2"));
                  // 浮动价格
                  if(bookd2){ // 单程的时候  bookdata2 为空， bookd2为undefined
                      tolowflght = bookd2.thelowf;  //返程最低价航班
                      tolowflghtprice = tolowflght.pice1;  //返程最低价航班
                      //tonowprice =bookd2.pice1; //当前价格
                      //最低价
                      tolowflghto = bookd2.thelowfo;  //返程最低价航班
                      tolowflghtpriceo = tolowflghto.pice1;  //返程最低价航班
                      //tonowpriceo =bookd2.pice1; //当前价格
                  }


              }



              tonewbookhtml();//初始话页面

              var Flight=[];

                //if(bookdata1.Discount =='全价'){
                //    DS =1
                //}else{
                //    DS = bookdata1.Discount.replace('折','');
                //
                //}
                //console.log(DS);
              // 保险参数
              insureType =bookdata1.InsureType;
              cabinType =bookdata1.CabinType;//判断直营 可以以不用了
              zyTable  = bookdata1.zytypep;//  判断直营新方法
              zyCP  = bookdata1.theCarrier1;//  判断航空公司号  theCarrier1
              isTrippok = bookdata1.isTrippok ; // 航司 匹配标志 1表示 直营匹配 有差旅买

              var myzycp = '';// 存放 航司号 公司
              switch(zyCP)
              { // 还原航空公司号
                  case "ZH": myzycp ='深航直营';break;
                  case "CZ": myzycp ='南航直营';break;
                  case "3U": myzycp ='川航直营';break;
                  case "HU": myzycp ='海南直营';break;

              }

              ///////// 根据 直营 非直营  在没有 增加乘机人的时候 的 页面初始展示
              // 下面的 判断是  简单的页面展示  按钮 保险等
              if(zyTable ==1){ // 1 是直营

                  if( zyCP == 'ZH'){//深圳航空 直营
                      getsafeText(insureType); //加载 返程 保险弹层数据
                      $.qu('.buysafe').style.display = 'block';// 显示30保险 选择按钮
                      $.qu('.buysafet').style.display = 'block';//显示 深圳直营 20的按钮
                      $.qu('.mttdata-sp1e3').innerHTML ='成人票';
                      $.qu('.mttdata-sp3').style.display = 'inline-block';// 显示 保险 问号弹层

                  }else{// 直营 下 四川航空  南航 都没得保险  南航 差旅有保险 后面再改
                      $.qu('.mttdata-sp3').style.display = 'none';// 隐藏 问号弹层
                      $.qu('.buysafe').style.display = 'none';// 隐藏保险 选择按钮
                      $.qu('.buysafet').style.display = 'none';//隐藏 深圳直营 20的按钮
                      $.qu('.mttdata-sp1e3').innerHTML ='成人票(无保险)';

                  }
                  $.qu('.zycp').style.display = 'inline-block';// 直营航司 标签显示
                  $.qu('.zycp').innerHTML = myzycp;// 直营航司 标签显示
                  $.qu('.zycp').style.background = '#eee';

              }else{ // 非直营 正常添加 保险
                  // ajax 获取数据并加载 单程 或者 返程的 保险说明
                  getsafeText(insureType);
                  $.qu('.zycp').style.display = 'none';// 直营航司 标签隐藏
                  $.qu('.zycp').style.background = '#fff';
                  $.qu('.mttdata-sp1e3').innerHTML ='成人票';
                  $.qu('.mttdata-sp3').style.display = 'inline-block';// 显示 保险 问号弹层
                  $.qu('.buysafe').style.display = 'block';// 显示保险 选择按钮
                  $.qu('.buysafet').style.display = 'none';// 隐藏 深圳直营 20的按钮

              }
              // 会员信息
              Member =params.Member;
               if(bookdata2 ==''){ // 单程

                    // 单程儿童 半价问题
                   var  theCaarr =['P','F','A','J','C','D','Z','R','G','E'];// Y 仓位 以上的仓位 L  thecab
                   var  thecanum = bookdata1.theCa;// 仓位编码 Y P F
                   var  cabinlevel = bookdata1.cabinlevel;// 舱位判断 折扣 全价  经济
                   isY = cabinlevel.indexOf('经济') == -1 ?false:true; //  false 不是经济舱  true 是经济舱
                   var mekey = false;// false 表示 不是超级经济舱位

                   if(!isY){// 不是经济舱
                       // 再判断是不是折扣舱位
                        isDis = cabinlevel.indexOf('折扣') == -1 ? false:true;//  false 不是折扣舱位  true是折扣舱位
                        isYca =thecanum;
                   }else{// 是经济舱位

                        const mymoreca =['超级','明珠','高端','超值','舒适'];

                        for(var i=0; i<mymoreca.length;i++ ){
                               if(cabinlevel.indexOf(mymoreca[i]) != -1){
                                   mekey =true;// 是超级经济舱位
                                   break;
                               }
                        }

                        if(mekey){
                            isYca = thecanum;
                        }else{// 不是超级经济舱
                            isYca = 'Y';
                        }
                   }

                   console.log('基础仓位的价格')


                   if(bookdata1.discount =='全价'){
                       DS =1
                   }else{
                       DS =Number(bookdata1.discount.replace('折',''))
                   }

                   frestnum = bookdata1.cbcount;//  单程 余票数量
                   // 单程航班
                    $.qu('.myBook-flightbox2').style.display = 'none';
                    $.qu('.flightbox1-text').style.display = 'none';
                    bookPulldata1(bookdata1);
                    //bookPulldata2(bookdata1)


                    onepiect1 =bookdata1.pice1;// 当前仓位价格


                    if(isY ){ // 经济舱

                        // Y 基础舱位的 全价
                        if(mekey){//为超级经济舱
                            Fprice =(Number(onepiect1)/20).toFixed(0)*10 ;//超级经济舱位的全价舱位 为当前舱位价格的一半
                        }else{
                            Fprice = (Number(bookdata1.YPrice)/20).toFixed(0)*10;//  计算当前仓位的基础仓位  当前价格/ 折扣 除以2 四舍五入
                        }


                    }else{// 非经济舱位
                        if(isDis){ // 非经济舱 折扣舱
                            Fprice = onepiect1;//非经济舱位的折扣舱位 为当前舱位价格

                        }else{//非经济舱 全价舱
                            Fprice =(Number(onepiect1)/20).toFixed(0)*10 ;//非经济舱位的全价舱位 为当前舱位价格的一半
                        }

                    }

                    hbjinef = bookdata1.hbjine;//红包 价格  单程或者去程
                    hashongbaof = bookdata1.hashongbao;// 是否有红包 单程或者去程


                   ZhPolicyId1 =bookdata1.ZhPolicyId;// 单程 深航 匹配id
                   if( zyCP == '3U'){
                       if(zyTable ==1){
                           CHOtherParam1={
                               sequenceNumber:bookdata1.sequencenumber,
                               cabinDesc:bookdata1.cabindesc
                           }
                       }else{
                           CHOtherParam1='';
                       }
                   }else{
                       CHOtherParam1='';
                   }

               }else{

                   frestnum = bookdata1.cbcount;//  去程 余票数量
                   trestnum = bookdata2.cbcount;//  返程 余票数量



                    $.qu('.myBook-flightbox2').style.display = 'block';
                    $.qu('.flightbox1-text').style.display = 'block';

                     bookPulldata1(bookdata2); //填充 返程数据
                     bookPulldata2(bookdata1); //填充 去程 或者 单程数据
                     insureType1 =bookdata2.InsureType;

                   if(bookdata1.discount =='全价'){
                       DS =1
                   }else{
                       DS =Number(bookdata1.discount.replace('折',''))
                   }
                   if(bookdata2.discount =='全价'){
                       DS1 =1
                   }else{
                       DS1 =Number(bookdata2.discount.replace('折',''))
                   }



                    if(zyTable ==1){ // 1 是直营
                        if( zyCP == 'ZH'){//深圳航空 直营
                            getsafeText1(insureType1); //加载 返程 保险弹层数据
                            $.qu('.buysafe').style.display = 'block';// 显示30保险 选择按钮
                            $.qu('.buysafet').style.display = 'block';//显示 深圳直营 20的按钮
                            $.qu('.mttdata-sp1e3').innerHTML ='成人票';
                            $.qu('.mttdata1-sp1e3').innerHTML ='成人票';
                            $.qu('.mttdata-sp3').style.display = 'inline-block';// 显示 保险 问号弹层
                            $.qu('.mttdata1-sp3').style.display = 'inline-block';// 显示 保险 问号弹层

                        }else{// 直营 下 四川航空  南航 都没得保险  南航 差旅有保险 后面再改
                            $.qu('.mttdata-sp3').style.display = 'none';//隐藏 保险
                            $.qu('.mttdata1-sp3').style.display = 'none'; //隐藏 保险
                            $.qu('.buysafe').style.display = 'none';
                            $.qu('.buysafet').style.display = 'none';//隐藏 深圳直营 20的按钮
                            $.qu('.mttdata-sp1e3').innerHTML ='成人票(无保险)';
                            $.qu('.mttdata1-sp1e3').innerHTML ='成人票(无保险)';
                        }
                        $.qu('.zycp1').style.display = 'inline-block';// 直营航司 标签显示
                        $.qu('.zycp1').innerHTML = myzycp;// 直营航司 标签显示

                        $.qu('.zycp').style.display = 'inline-block';// 直营航司 标签显示
                        $.qu('.zycp').innerHTML = myzycp;// 直营航司 标签显示
                        $.qu('.zycp1').style.background = '#eee';
                        $.qu('.zycp').style.background = '#eee';
                        if( zyCP == '3U'){
                            CHOtherParam1={
                                sequenceNumber:bookdata1.sequencenumber,
                                cabinDesc:bookdata1.cabindesc
                            };
                            CHOtherParam2={
                                sequenceNumber:bookdata2.sequencenumber,
                                cabinDesc:bookdata2.cabindesc
                            }
                        }else{
                            CHOtherParam1='';
                            CHOtherParam2='';
                        }


                    }else{ // 非直营 正常添加 保险
                        getsafeText1(insureType1); //加载 返程 保险弹层数据
                        $.qu('.zycp').style.display = 'none';// 直营航司 标签隐藏
                        $.qu('.zycp1').style.display = 'none';// 直营航司 标签显示
                        $.qu('.zycp1').style.background = '#fff';
                        $.qu('.zycp').style.background = '#fff';
                        $.qu('.mttdata-sp3').style.display = 'inline-block';//隐藏 保险
                        $.qu('.mttdata1-sp3').style.display = 'inline-block'; //隐藏 保险
                        $.qu('.mttdata-sp1e3').innerHTML ='成人票';
                        $.qu('.mttdata1-sp1e3').innerHTML ='成人票';
                        $.qu('.buysafe').style.display = 'block';// 显示保险 选择按钮
                        $.qu('.buysafet').style.display = 'none';//隐藏 深圳直营 20的按钮

                        CHOtherParam1={};
                        CHOtherParam2={};
                    }


                    onepiect1 =bookdata1.pice1;// 返程的价格
                    onepiect2 =bookdata2.pice1; // 去程的价格

                    hbjinef = bookdata2.hbjine;//红包 价格  单程或者去程
                    hashongbaof = bookdata2.hashongbao;// 是否有红包 单程或者去程

                    hbjinet = bookdata1.hbjine;//红包 价格  返程
                    hashongbaot = bookdata1.hashongbao;// 是否有红包 返程


                   ZhPolicyId1 =bookdata1.ZhPolicyId;// 去程 深航 匹配id
                   ZhPolicyId2 =bookdata1.ZhPolicyId;// 返程 深航 匹配id



               }
              var data2 ={
                  a:bookdata1.RouteFromCode,
                  b:bookdata1.RouteToCode,
                  c:bookdata1.pcnum,
                  d:bookdata1.theCa,
                  e:bookdata1.data1,
                  h:bookdata1.pice1,
                  v:bookdata1.cbcount,
                  ct:bookdata1.CabinType
              };

              if(backFlight){

                  var data1 ={
                      a:bookdata2.RouteFromCode,
                      b:bookdata2.RouteToCode,
                      c:bookdata2.pcnum,
                      d:bookdata2.theCa,
                      e:bookdata2.data1,
                      h:bookdata2.pice1,
                      v:bookdata2.cbcount,
                      ct:bookdata2.CabinType
                  };
                   checkPricedata =[data1,data2]
              }else{
                  checkPricedata =[data2]
              }

              // 验票 函数 数据返回 实时验票
             getabinCount();
             checkPriceFun();// 验价

              //alloneMone(); // 总计价格


              checkChailvPassenger();// 检查差旅乘客数量

          }


          allmyClickbook(); //初始话点击事件
          //  选择因公因私 按钮
          getTripFn();




        // 重头戏  提交订单按钮  成人加儿童 和 往返 都提交2次订单
        $.qu('.allprice2').onclick = function(){

            // 产品页面 进入book 所带数据
            // $.router.go('#!/flightmb/book',{pbtype:3,ptbdata1:tobookdata1,ptbdata2:fitstData,Member:Member},true)
            //userOnoffpb('b',myBookFn,'myBook');


            //var  bookdatab ={
            //    pbtype:3,
            //    ptbdata1:bookdata1,
            //    ptbdata2:bookdata2,
            //    Member:''
            //};

            var  time2 ='';
            if(bookdata2){
                time2 = bookdata2.data1;
            }
            var  todetaildata={
                citydetail1:bookdata1.fplace,
                citydetail2:bookdata1.tplace,
                timedetail1:bookdata1.data1,
                timedetail2:time2,
                cliktype:1,
                backtype:1
            };
            var bookdata = JSON.stringify(todetaildata);
            //(bookdata);
            userOnoffpp('b',myBookFn,'myBook','.lodinb',bookdata,'抱歉，登录超时，为确保余票充足，请重新查询该航班~');


        };
          // 页面返回
         // checkChailvPassenger();// 检查差旅乘客数量
        $.qu('.myBook-tt1').onclick = function () {
              // 这个返回 走 我的订单界面
              $.router.go('#!/flightmb/detail',urldataxh,true)
        }
        //头部主页返回
          $.qu('.b_home').onclick =() =>$.router.go('#!/flightmb/join','',false);
        //  动态修改 头部电话
        pullHeadphoneB();


      }

}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  动态修改 头部电话
function pullHeadphoneB() {

    var telOB = $.qu('.b_phone');
    var zycpB = $.qu('.zycp').style.display == 'none' ?0:1;//  1为直营
    let cpnum = $.qu('.myBook-mtfsp3').innerHTML.substring(0,2);
    console.log(`直营标记=${zycpB}`)
    if(zycpB == 0){
        getCZphoneb('XHSV',telOB)
    }else{
        switch (cpnum) {
            case "ZH":getCZphoneb('ZH',telOB);break;
            case "CZ":getCZphoneb('CZ',telOB);break;
            case "3U":getCZphoneb('3U',telOB);break;
        }


    }

}

function getCZphoneb(key,el){
    myget(flightUrl+'/icbc/xhService.ashx','act=GETSERVICEPHONE&Source='+key,true, function (err,res) {
        if(err){
            myalertp('router0','出错了，获取客服联系电话失败！')
        }else{
            let oData3 = eval('('+res+')');
            let phonts =oData3.Result.Phone;
            let phontn =oData3.Result.Source;
            el.href=`tel:${phonts}`;

        }
    })
}


// 检查余票数量 及  成绩人不能超过9人
function  checkpsnum(){
    var thepsnump = $.qus('.myBook-namel').length;// 乘机人数量
    //console.log('乘机人个数'+thepsnump)
    return thepsnump <= 9;
}
function  checktickesnum(){
    var thepsnum = $.qus('.myBook-namel').length;
    //frestnum = bookdata1.cbcount;//  去程 余票数量
    //trestnum = bookdata2.cbcount;//  返程 余票数量
    if(frestnum =='A'){
        frestnum =10
    }
    if(trestnum =='A'){
        trestnum =10
    }

    //console.log(frestnum)//  8
    //console.log(trestnum)//  0
    //console.log(thepsnum)//  1

    var  fda = 0;
    var  tda = 0;

    if(backFlight){ // 往返
         if(frestnum<thepsnum  ){
             fda =0;
         }else{
             fda =1;
         }

         if( trestnum < thepsnum){
             tda =0
         }else{
             tda =1
         }
    }else{//单程
        //if( frestnum < thepsnum){
        //    fda =0
        //}else{
        //    fda =1
        //}
        fda = frestnum < thepsnum ? 0:1;


    }


    return [fda,tda]

}


function myAlertBox(b,fn,fns){ // 弹出层   b为显示的提示数据   fn 为确定后执行函数  fns 为取消执行函数
    var a = document.getElementById("book-alert");
    a.style.display = "-webkit-box";
    a.getElementsByClassName("book-alert-info")[0].innerHTML = b;
    var yesBtn = a.getElementsByClassName("book-alert-yes")[0];
    var noBtn = a.getElementsByClassName("book-alert-no")[0];
    yesBtn.onclick = function(){
        a.style.display = "none";
        if(fn && typeof fn == "function"){
            fn();
        }

    };
    noBtn.onclick = function() {
        a.style.display = "none";
        if(fns && typeof fns == "function"){
            fns();
        }
    };
}



//  预定函数
function myBookFn(){
    //  存放单程或者 去程目前价格 不能根据 带入数据获取 应该 在页面中获取
    var fromnowpriceo = $.qu('.mttbookprice').innerHTML;
    var fromnowprice =fromnowpriceo; //  存放单程或者 去程目前价格
    var tonowprice =$.qu('.mttbookprice4').innerHTML;;  //返程目前价格 mttbookprice4
    var tonowpriceo = tonowprice;  //返程目前价格


    alloneMone();
    //  提示语 数组
    // 0.最低价 1.浮动次低价  2.没有经济舱位
    var  alertText =[
        '温馨提示：按贵公司规定，同航班需订最低价，改订最低价舱位，请点击“确定”，否则点击“取消”，重新选择航班！',
        '温馨提示：按贵公司规定，同航班需订低价，改订低价舱位，请点击“确定”，否则点击“取消”，重新查询航班！',
        '提示：非常抱歉，贵公司没有为您设定公务舱、头等舱级别，不能购买，请更换航班或联系贵公司差旅专员购买。'
    ];

    // 返回搜索页面 的函数
    function gotodetile(){
        var  time2 ='';
        if(bookdata2){
            time2 = bookdata2.data1;
        }
        var  todetaildata={
            city00:bookdata1.fplace,
            city11:bookdata1.tplace,
            time00:bookdata1.data1,
            time11:time2
        };
        $.router.go('#!/flightmb/detail',{citydetail1:todetaildata.city00,citydetail2:todetaildata.city11,timedetail1:todetaildata.time00,timedetail2:todetaildata.time11,cliktype:1,backtype:1},true)
    }



    addchildphone();// 默认添加 儿童为无电话 电话为 第一个成人的电话
    var theuserdata = JSON.parse(GetCookie('theUserdata'));
    //var thePerm = (JSON.parse(GetCookie('theUserdata'))).xhPerms;// 获取perm 信息
    console.log('cookie获取用户信息')
    console.log(theuserdata)
    Member={
        name:theuserdata.userName,
        No:theuserdata.userID
    };
    var nottripName = "";
    //console.log(Member);
    console.log('非差旅名单');
    console.log(nottripNum);
    if(nottripNum.length > 0) {
        for(var i = 0; i< nottripNum.length; i++) {
          nottripName += nottripNum[i] + ",";
        }
    }
    if(nottripName.replace(/\|/g, "").length > 0) {
        nottripName = nottripName.substring(0, nottripName.length - 1);
    }
    ////  检查 因公 选项
    var  isalert = false;
    var thebtnnum =$.qu('.ygLeft-box').getAttribute('choicetype');
    if( thebtnnum == 1 && $.qu('.goReason').style.display =='block' ){ // 表示 选择的因公
        isalert = true;
    }

    if (!mPassengerIsValidated && isalert) { // 检查 乘客信息是否通过  如果  是因公的话 就弹出非差旅名单
        //alert("乘机人中有企业客户，请分别下单购买。");
        myalertp('myBook','乘机人中有非企业客户(姓名:'+nottripName+')，请分别下单购买。');

    }else{
        if(!onOFFp){// 凭证开关
            //ShipFeeOnoff = shipMoney;
            // 邮费
            let isexp = $.qu('.y_exp').getAttribute('extype');
            ShipFeeOnoff = isexp == 1 ? shipMoney : 0;
            ShipAddr = theAddresdata;
        }else{
            ShipFeeOnoff = 0;
            ShipAddr ='';
        }
        //var Member ={name:'kenrecall1',No:'MFW1611210050159038'}; //会员信息
        var Contact =contactdata()//{name:'肖浩',phone:'1388004134'，id:990};// 联系人信息
        //console.log(Contact);
        var noty =onum +odnum;// 老人 和 成人
        var alluum =noty+ynum;//  老人 成人 儿童 所有数量
        if(backFlight){ // 往返
            //console.log('儿童数:'+ynum)//儿童数量
            if(alluum ==0){// 没有乘机人
                //alert('请选择乘机人！')
                myalertp('myBook','请选择乘机人!')
            }else{
                if(!checkpsnum()){
                    myalertp('myBook','抱歉,单个订单乘机人不能超过9人。');
                    return false
                }
                var tnum =checktickesnum();
                if(tnum[0] == 0){
                    myalertp('myBook','抱歉,去程余票数量小于乘机人数量，请分别下单或者更换航班。');
                    return false
                }
                if(tnum[1] == 0){
                    myalertp('myBook','抱歉,返程余票数量小于乘机人数量，请分别下单或者更换航班。');
                    return false
                }


                if(Contact.name !='' && Contact.phone !=''){
                    if(ynum !=0){ // 成人个数
                        //alert('儿童不能订往返票！！')
                        myalertp('myBook','儿童不能订往返票！')
                    }else{

                        // 用户信息 Member
                        var bookDataTF =[bookdata2,bookdata1];
                        //console.log( '往返航班信息');
                        //console.log( bookDataTF);
                        var Passengers =[passengerAlldataone(onepiect2),passengerAlldataone(onepiect1)];
                        //console.log( '往返乘客信息');
                        //console.log( Passengers);

                        let nullphname =thenonephone();

                        if(nullphname.length != 0){

                            myalertp('myBook',`乘机人:${nullphname.toString()} 电话为空`);//乘机人电话为空
                            return false
                        }
                        if(getpassengerPhone()){
                            myalertp('myBook','抱歉,乘机人电话有重复,请核实')

                        }else{// 往返
                            var nump =ddataar;
                            if(nump[0]>0 ){// 全部匹配 为差旅
                                var thebtnnum =$.qu('.ygLeft-box').getAttribute('choicetype');
                                if( thebtnnum == 1  &&  $.qu('.goReason').style.display =='block'){// 都为因公

                                    if(nump[7] ==1 ) { //编码公司 是不是一样


                                            if(nump[3] ==1){// 为1   则表示权限等级统一
                                                if(nump[4] ==0){ // 0权限 表示 任何都能订票 无限制
                                                    pullAlldatatoBook(bookDataTF,ShipFeeOnoff,Passengers,Contact,ShipAddr,DS,Member,Tripdata);
                                                    ///////

                                                }else if(nump[4] ==3){//3权限 表示 浮动价权限

                                                    if( ( Number(fromnowprice) >  Number(fromlowflghtprice)   &&  fromnowprice ) || (  Number(tonowprice)> Number(tolowflghtprice)  &&  tonowprice )){// 没有选择最低价 须有最低价进来  不然 就是2次加载的

                                                        gotoBookbackf(alertText[1],fromlowflght,tolowflght)
                                                    }else{// 因公 已经选择了最低价
                                                        pullAlldatatoBook(bookDataTF,ShipFeeOnoff,Passengers,Contact,ShipAddr,DS,Member,Tripdata);
                                                    }

                                                }else if(nump[4] ==1){//1权限 表示 只能最低价仓位

                                                    if( ( Number(fromnowpriceo) >  Number(fromlowflghtpriceo)   &&  fromnowpriceo ) || (  Number(tonowpriceo)> Number(tolowflghtpriceo)  &&  tonowpriceo )){// 没有选择最低价 须有最低价进来  不然 就是2次加载的
                                                        //myAlertBox('温馨提示：按贵公司规定，同航班需订最低价，改订最低价舱位，请点击“确认”，否则点击“取消”，重新选择航班！',function(){
                                                        //    //测试默认 重新刷数据
                                                        //    $.router.go('#!/flightmb/book',{pbtype:3,ptbdata1:fromlowflghto,ptbdata2:tolowflghto,Member:'',pfjprice:pfjpricek,isclearps:0},true)
                                                        //},function(){
                                                        //    var  time2 ='';
                                                        //    if(bookdata2){
                                                        //        time2 = bookdata2.data1;
                                                        //    }
                                                        //    var  todetaildata={
                                                        //        city00:bookdata1.fplace,
                                                        //        city11:bookdata1.tplace,
                                                        //        time00:bookdata1.data1,
                                                        //        time11:time2
                                                        //    };
                                                        //    $.router.go('#!/flightmb/detail',{citydetail1:todetaildata.city00,citydetail2:todetaildata.city11,timedetail1:todetaildata.time00,timedetail2:todetaildata.time11,cliktype:1,backtype:1},true)
                                                        //});
                                                        var fkey= fromlowflghto.cabinlevel.indexOf('经济') !=-1 ? true:false;
                                                        var tkey= tolowflghto.cabinlevel.indexOf('经济') !=-1 ? true:false;


                                                        if(fkey && fkey){ // 说明有经济舱位
                                                            gotoBookbackf(alertText[0],fromlowflghto,tolowflghto);// 弹出 浮动次低价提示 并 预定
                                                        }else{// 说明没有经济舱位
                                                            //if(fkey && !tkey){ //准备分开提示 去程 返程
                                                            //    myalertp('myBook',alertText[2])
                                                            //}
                                                            myalertp('myBook',alertText[2],gotodetile)
                                                        }



                                                    }else{// 因公 当前航班已经选择了最低价
                                                        pullAlldatatoBook(bookDataTF,ShipFeeOnoff,Passengers,Contact,ShipAddr,DS,Member,Tripdata);
                                                    }
                                                }

                                                // 权限为 1 或者 3的时候  弹层及预订函数 提取公共部分
                                                function gotoBookbackf(text,data1,data2){
                                                    myAlertBox(text,function(){
                                                        //测试默认 重新刷数据
                                                        $.router.go('#!/flightmb/book',{pbtype:3,ptbdata1:data1,ptbdata2:data2,Member:'',pfjprice:pfjpricek,isclearps:0},true)
                                                    },gotodetile);
                                                }




                                            }else{ //为0   则表示权限等级统一
                                                myalertp('myBook','温馨提示：按贵公司规定，不同差旅政策的乘客不能一起下单')

                                            }




                                    }else{
                                        myalertp('myBook','抱歉,乘客所属公司不同，不能同时下单！');
                                        return false
                                    }

                                }else{ // 因私 不要判断 最低价
                                    pullAlldatatoBook(bookDataTF,ShipFeeOnoff,Passengers,Contact,ShipAddr,DS,Member,Tripdata);
                                }


                            }else{ // 全部不匹配 都为非差旅
                                pullAlldatatoBook(bookDataTF,ShipFeeOnoff,Passengers,Contact,ShipAddr,DS,Member,Tripdata);
                            }

                            //pullAlldatatoBook(bookDataTF,ShipFeeOnoff,Passengers,Contact,ShipAddr,DS,Member,Tripdata);
                        }

                    }
                }else{
                    //alert('请选择正确的联系人信息！')
                    myalertp('myBook','请选择联系人信息！')
                }

            }
        }else{// 单程
            if(noty !=0){ // 成人加老人 总个数
                // 用户信息 Member
                //console.log('单程儿童个数'+ynum)
                if( ynum> noty*2){
                    myalertp('myBook','抱歉，一个成人最多只能携带2名儿童')
                    return false

                }

                var np = checkpsnum();
                if(!np){
                    myalertp('myBook','抱歉,单个订单乘机人不能超过9人。');
                    return false
                }

                if(Contact.name !='' && Contact.phone !=''){
                    var Passenger =passengerAlldataone(onepiect1); // 乘客信息数据整合完毕
                    //console.log(Passenger);
                    let nullphname =thenonephone();

                    if(nullphname.length != 0){

                        myalertp('myBook',`乘机人:${nullphname.toString()} 电话为空`);//乘机人电话为空
                        return false
                    }
                    if(getpassengerPhone()){
                        myalertp('myBook','抱歉,乘机人电话有重复,请核实')
                    }else{

                        var tnum =checktickesnum();
                        if(tnum[0] == 0){
                            myalertp('myBook','抱歉,余票数量小于乘机人数量，请分别下单或者更换航班。');
                            return false
                        }


                        var nump =ddataar;//  参数意思 0.差旅人个数  1.非差旅个数 2.总人数 3.权限是否统一 4.权限具体代码 5.非差旅名单 6.部门编码 7.是否为同一编码公司
                        if(nump[0]>0 ){// 全部匹配 为差旅 因为前已经判断了的

                             var thebtnnum =$.qu('.ygLeft-box').getAttribute('choicetype');
                             if( thebtnnum == 1 && $.qu('.goReason').style.display =='block' ){ // 表示 选择的因公

                                 if(nump[7] ==1 ){ //编码公司 是不是一样
                                        if( nump[3] ==1 ){// 为1   则表示权限等级统一

                                            //   检查 差旅审批


                                            if(nump[4] ==0){ // 0权限 表示 任何都能订票 无限制

                                                pullAlldatatoBook(bookdata1,ShipFeeOnoff,Passenger,Contact,ShipAddr,DS,Member,Tripdata);
                                            }else if(nump[4] == 3 ){//3 权限 表示 只能是浮动价格
                                                if( Number( fromnowprice) > Number(fromlowflghtprice)  &&  fromnowprice){ // 没有选择最低价 须有最低价进来  不然 就是2次加载的



                                                     if(fromlowflght.cabinlevel.indexOf('经济') !=-1){ // 说明有经济舱位
                                                         gotoBook(alertText[1],fromlowflght);// 弹出 浮动次低价提示 并 预定
                                                     }else{// 说明没有经济舱位
                                                         myalertp('myBook',alertText[2],gotodetile)
                                                     }

                                                     //gotoBook(alertText[1],fromlowflght);// 弹出 浮动次低价提示 并 预定

                                                }else{// 因公 已经选择了最低价

                                                    pullAlldatatoBook(bookdata1,ShipFeeOnoff,Passenger,Contact,ShipAddr,DS,Member,Tripdata);
                                                }
                                            }else if(nump[4] == 1 ){//1 权限 表示 只能最低价仓位
                                                if( Number( fromnowpriceo) > Number(fromlowflghtpriceo)  &&  fromnowpriceo){// 没有选择最低价 须有最低价进来

                                                    if(fromlowflghto.cabinlevel.indexOf('经济') !=-1){ // 说明有经济舱位
                                                        gotoBook(alertText[0],fromlowflghto);// 弹出 浮动次低价提示 并 预定
                                                    }else{// 说明没有经济舱位
                                                        myalertp('myBook',alertText[2],gotodetile)
                                                    }

                                                   // gotoBook(alertText[0],fromlowflghto);// 弹出 最低价提示 并 预定
                                                }else{// 因公 已经选择了最低价
                                                    pullAlldatatoBook(bookdata1,ShipFeeOnoff,Passenger,Contact,ShipAddr,DS,Member,Tripdata);
                                                }
                                            }

                                            function gotoBook(text,data) {
                                                myAlertBox(text,function(){
                                                    //测试默认 重新刷数据
                                                    $.router.go('#!/flightmb/book',{pbtype:3,ptbdata1:data,ptbdata2:'',Member:'',pfjprice:pfjpricek,isclearps:0},true)
                                                },gotodetile);
                                            }







                                        }else{ //为0   则表示权限等级统一
                                            myalertp('myBook','温馨提示：按贵公司规定，不同差旅政策的乘客不能一起下单')
                                        }



                                 }else{
                                     myalertp('myBook','抱歉,乘客所属公司不同，不能同时下单！');
                                     return false
                                 }

                             }else{ // 因私 不要判断 最低价 或者 不是海南行
                                 pullAlldatatoBook(bookdata1,ShipFeeOnoff,Passenger,Contact,ShipAddr,DS,Member,Tripdata);
                             }

                        }else{ // 全部不匹配 都为非差旅
                            pullAlldatatoBook(bookdata1,ShipFeeOnoff,Passenger,Contact,ShipAddr,DS,Member,Tripdata);
                        }


                       // pullAlldatatoBook(bookdata1,ShipFeeOnoff,Passenger,Contact,ShipAddr,DS,Member,Tripdata);
                    }

                }else{
                    //alert('请选择正确的联系人信息！')
                    myalertp('myBook','请选择联系人信息！')
                }

            }else{
                if(ynum !=0){
                    //alert('儿童不能单独订票！！')
                    myalertp('myBook','儿童不能单独订票！')
                }else{
                    //alert('请选择乘机人！')
                    myalertp('myBook','请选择乘机人')
                }
            }
        };
    };





}
// 获取乘机人 电话号码 不能重复
function getpassengerPhone(){
     var thephonenumber =[];
     $.each($.qus('.myBook-namel'),function(){
         let pdata =JSON.parse($.attr(this,'data'));
         if(pdata.Age != '儿童' ){
             thephonenumber.push(pdata.Phone);
             if( pdata.Phone == ''){
                 return true
             }
         }
     });
     var has ={};
     for(var i in thephonenumber ){
         if(has[thephonenumber[i]]){
              return true
         }else{
             has[thephonenumber[i]] = true
         }
     }
    return  false
}

//  判断电话是否为空
function thenonephone(){
    var allps = $.qus('.myBook-namel');
    let nullphone =[];
    for(var i =0;i<allps.length;i++){
        let pdata =JSON.parse($.attr(allps[i],'data'));
        if(pdata.Age != '儿童' ){
            if(!pdata.Phone){
                nullphone.push(pdata.Name)
            }

        }
    }


    return nullphone
}


// 给儿童没有电话的 默认加上 第一个成人的电话
function addchildphone(){
    var  thefirstphonenum = '';
    var allps = $.qus('.myBook-namel');
    for(var i =0;i<allps.length;i++){
        let pdata =JSON.parse($.attr(allps[i],'data'));
        if(pdata.Age != '儿童' ){
            thefirstphonenum = pdata.Phone;
            break;
        }
    }

    thenophonechild =thefirstphonenum;


}

function ertong() {
  var listLis = $.qus(".myBook-namel");
  var str = "儿童";
  if(listLis.length > 0) {
    for(var i = 0; i< listLis.length; i++) {
      // alert(listLis[i].children[1].children[0].innerHTML.indexOf(str));
      if(listLis[i].children[1].children[0].innerHTML.indexOf(str) > -1) {
        listLis[i].children[2].children[0].innerHTML = "出生日期";
      }
    }
  }
}



// 初始话页面函数
function tonewbookhtml(){

    if(isclearps == 1){//  需要清除 乘机人 和 联系人
        $.qu('.myBook-nameul').innerHTML ='';// 清空乘机人buysafet
        $.qu('.linkman4').innerHTML='';
        $.qu('.linkman2').innerHTML ='';
    }



    $.qu('.buysafet').style.display ='none';// 隐藏20的保险

    $.qu('.Tripb').style.display = 'none';

    $.qu('.goReason').style.display = 'none';//因公因私
    $.qu('.Tripb-box').style.display = 'none';
    $.qu('.Tripb-btnbox1').style.left ='0.1rem';
    $.qu('.Tripb-btnbox').style.backgroundColor ='#ccc';
    $.qu('.Tripb-boxt2n').innerHTML = '';
    $.qu('.Tripb-boxt2p').innerHTML = '';
    $.qu('.Tripb-boxt2c').innerHTML = '';
    $.qu('.Tripb-boxt2t').innerHTML = '';
    $.qu('.zycp').style.display = 'none';
    $.qu('.zycp').style.background = '#fff';
    onOFFr =true;
    $.qu('.allprice11').innerHTML = 0;//初始化价格
    $.qu('.buysafe-price').innerHTML = 30;//初始化保险价格

    //  还原页面初始话 儿童是隐藏的
    $.qu('.myBook-mttdatay').style.display = 'none';
    //发票按钮初始话
    $.qu('.proof-btnbox1').style.left ='0.1rem';
    $.qu('.proof-btnbox').style.backgroundColor ='#ccc';
    $.qu('.proof-box').style.display ='none';
    onOFFp =true;
    // 清空发票内容
    $.qu('.proof-boxt2n').innerHTML ='';
    $.qu('.proof-boxt2p').innerHTML ='';
    $.qu('.proof-boxt2c').innerHTML ='';
    $.qu('.proof-boxt2t').innerHTML ='';





}





// 检查乘机人是不是有 差旅权限
function checktheroule(data){
   console.log('整合后数据')
   console.log(data)


    var allthepas = data;

    var unitIDarr = [];// 存放不同分行的公司 id 区别 海南 和工行


    var roule_0 = [];// 存放权限 为 0 的人数
    var roule_1 = [];// 存放权限 为 1 的人数
    var roule_3 = [];// 存放权限 为 3 的人数
    var roule_10 = [];// 存放权限 为 10 的人数
    var roule_11 = [];// 存放权限 为 11 的人数
    var roule_d = [];// 存放权限 除开 0 1 3 的乘客 未知权限
    var roule_n = [];// 存放授信状态为4  账号不关联的乘客

    var notripPeoples = []; //非差旅人员
    var noytripPeoples = []; //是差旅人员 但是会员账号不匹配



    //  存放 所有人 的差旅状态 是否为差旅  1为是 0 为否  只针对OweStatus 及Perm 第一次判断 后面还要做综合判断 初始判断因公因私
    var alltripps = [];

    /////
    var owsarr= '2,4';// 2 和 4 为差旅

    var contarr = '87,85,84,76'; // 该账号 如果是 45   对应的公司id  虚拟 perm
    //var contarr = ''; // 该账号 如果不是 45          对应的公司id  虚拟


    for(var i = 0; i< allthepas.length; i++) {
        var owestatus = allthepas[i].OweStatus; // 白名单 状态 目前 有2 和 4 是正常的 差旅判断标致
        var unitId = allthepas[i].UnitId; // 用于 白名单状态为 4   要对应 会员账户的 关联公司unitId
        var roule = allthepas[i].rule;// 当前乘机人的 rule权限 为一个字符串 '0,3,7'
        var theroule = roule.split(',');// 当前乘机人的 rule权限 为一个字符串 '0,3,7'
         unitIDarr.push(unitId);// 所有乘机人 的 公司id  数组
       // alert(`2或者4判断owestatus=${owestatus}`)

        if(owsarr.indexOf(owestatus) != -1 ){// 说明 是2 或者 4 为差旅用户


            if(theroule.indexOf('11') != -1) {// 权限为11
                roule_11.push(1);// 有 rule 为11 的时候 存为1
            }else{
                roule_11.push(0);// 没有 rule 为11 的时候 存为0
            }

            if(owestatus == '4') { //OweStatus 为4  说明 特殊账户才能给当前用户下单
                var thePerm = (JSON.parse(GetCookie('theUserdata'))).xhPerms;// 获取perm 信息
                //var thePerm = '';
                console.log('账户perm字符串');
                console.log(thePerm);
                if(thePerm){// perm不为空 说明该会员账户 是特殊的绑定账号
                    var  thePermarr = thePerm.split(',');
                    if(thePermarr.indexOf(unitId) != -1){ // 有关联 关系
                        //alert(1)
                        alltripps.push(1)// 差旅用户 填入数组
                    }else{ // 为特殊账号 但是 和乘机人的公司 不匹配 没有关联关系
                        alltripps.push(0)// 差旅用户 填入数组
                        notripPeoples.push(allthepas[i].Name); //非差旅人名称
                        noytripPeoples.push(allthepas[i].Name); // 账号不匹配人名
                        //alert(2)
                    }

                }else{ // 为空 不为特殊账号 该乘机人就不是差旅用户

                    noytripPeoples.push(allthepas[i].Name); // 账号不匹配人名
                    notripPeoples.push(allthepas[i].Name);  //非差旅人名称
                    alltripps.push(0)// 差旅用户 填入数组
                }

            }else{
                alltripps.push(1)// 差旅用户 填入数组
            }


        }else{// 非差旅用户 把i传入 非差旅 数组
            alltripps.push(0);// 非差旅用户 填入数组
            notripPeoples.push(allthepas[i].Name);// 非差旅名称填入数组
            roule_11.push(0);// 没有 rule 为11 的时候 存为0
        }

    }

    console.log('初始差旅和非差旅数组')
    console.log(alltripps)


    //  差旅判断 模拟数据
    //var  pstdata =[
    //    ['2017-06-20','2017-06-28','重庆','北京、上海','培训',2],
    //    ['2017-06-20','2017-06-28','重庆','北京、上海','培训',1],
    //    ['2017-05-20','2017-05-28','重庆','北京、上海','培训',2]
    //];


    // roule_11  ;// 有权限为11 组成的数组  0 为 没有 1 为有 [0,0,1,0] 说明第4位乘机人 有差旅需要审批
    console.log('权限为11的数组');
    console.log(roule_11);

    // 航班信息 用于匹配 差旅
    const flightdata ={
        d:bookdata1.data1,
        f:bookdata1.fplace,
        t:bookdata1.tplace
    };

    // 航班信息不匹配的直接变成非差旅了 还有未审批的也变成非差旅了
    // 循环 roule_11  数组   判断 是不是 都为11
    // 还需要存储 审批没通过的索引 或者他的名字
    var  e_tarr =[];//  11权限 在判断 是否审批通过后整合的数据
    var  no_trippass= [];// 存放 差旅信息审批没通过的人名
    var  no_notrippass= [];// 存放 没有差旅审批的plan的人 plan 为空
    // 0 没得11  非0 就是有11
    var  ne_psname =[];//  11权限 未审批通过的 人名称 只是 不为2的情况

    for (let j = 0; j < roule_11.length; j++) {
        if(roule_11[j] == 1){ // 是11  有差旅审批

            //  要对每个乘机人的 plan 进行循环  一个乘机人 可能有多个 差旅申请
            var thetripda= allthepas[j].planda;
            console.log(thetripda)

            if(thetripda.length == 0){ // 有11 但是 没有差旅审批plan 即使 plan为空 没得数据 11数组中存为12
                e_tarr.push(12);
                no_notrippass.push(allthepas[j].Name)
            }else{ // 有plan 的乘机人人
                //  可能有多个请假 需要综合再判断
                var ise_tarr = false;// 是否通过2  默认不通过
                var isne_psname = false;  // 是否是航班信息匹配但是 不是2
                var isno_trippass = false; //  航班信息不匹配 和 匹配但是 不是2 的合计人名

                for (let i = 0; i < thetripda.length; i++) {

                    console.log(datetoNumber(thetripda[i].StartDate));
                    console.log(datetoNumber(bookdata1.data1));
                    console.log(datetoNumber(thetripda[i].EndDate));



                    //////
                    if(datetoNumber(thetripda[i].StartDate) <= datetoNumber(bookdata1.data1) && datetoNumber(bookdata1.data1)<= datetoNumber(thetripda[i].EndDate) && thetripda[i].From == bookdata1.fplace && thetripda[i].To.indexOf(bookdata1.tplace) != -1 ){ //选择的航班 满足 审批的条件 下一步需要判断 是否 审批通过
                        if(thetripda[i].Status == 2){
                            //e_tarr.push(1); // 有11  航班信息匹配 且通过
                            //console.log('差旅时间和条件匹配')
                            console.log('第一条匹配plan');
                            ise_tarr = true;
                            break;

                        }else{ //有11 航班信息匹配  但是审批状态不为2  则数组存放10 变为 因私
                            ise_tarr = false;
                            isne_psname = true;
                            isno_trippass = true;
                            console.log('第一条航班不匹配plan')
                            //e_tarr.push(10);
                            //ne_psname.push(allthepas[i].Name)
                            //no_trippass.push(allthepas[i].Name)

                        }

                    }else{ //有11  不满足 航班条件 就直接 返10  那就是因私了
                        ise_tarr = false;
                        isno_trippass = true;
                    }

                }

                // 循环单个乘机人的所有请假审批后 得出 总的判断
                if(ise_tarr){
                    e_tarr.push(1); // 有11  航班信息匹配 且通过
                    console.log('差旅时间和条件匹配')
                }else{
                    if(isne_psname){
                        e_tarr.push(10);
                        ne_psname.push(allthepas[j].Name);
                        no_trippass.push(allthepas[j].Name);
                    }else{
                        e_tarr.push(10);
                        no_trippass.push(allthepas[j].Name);
                    }
                }





            }
            //////////////////
            // 一个乘机人 只有单条 plan时
            //
            //if(datetoNumber(pstdata[j][0]) <= datetoNumber(bookdata1.data1) && datetoNumber(bookdata1.data1)<= datetoNumber(pstdata[j][1]) && pstdata[j][2] == bookdata1.fplace && pstdata[j][3].indexOf(bookdata1.tplace) != -1 ){ //选择的航班 满足 审批的条件 下一步需要判断 是否 审批通过
            //    if(pstdata[j][5] == 2){
            //        e_tarr.push(1); // 有11  航班信息匹配 且通过
            //        console.log('差旅时间和条件匹配')
            //    }else{ //有11 航班信息匹配  但是审批状态不为2  则数组存放10 变为 因私
            //        e_tarr.push(10);
            //        ne_psname.push(allthepas[j].Name)
            //        no_trippass.push(allthepas[j].Name)
            //    }
            //
            //}else{ //有11  不满足 航班条件 就直接 返10  那就是因私了
            //
            //    e_tarr.push(10);
            //    no_trippass.push(allthepas[j].Name)
            //}
            //////

        }else{ //是0  没有差旅审批 没得11
            e_tarr.push(0);
        }

    }
    //////

    console.log('整合后11审批数据')
    console.log(e_tarr)
    //  整合 初始筛选的 因公因私  和  判断11 后的因公因私
    // 初始筛选的 因公因私  数组 alltripps [0,0,1]  0 为因私  1 为因公
    // 判断11后的 因公因私  数组 e_tarr    [0,1,1]  0 为因私  1 为因公

    console.log('整合后差旅及非差旅数组')
    console.log(alltripps)
    var ntripname=[];// 存放初次筛选 和 11筛选后非差旅的名字 所有综合后
    var yesroule = [];// 存放差旅人个数  所有综合后
    var noroule =[];//   存放非差旅个数  所有综合后

    for (let i = 0; i < alltripps.length; i++) {
        if(alltripps[i] == 0 ){ // 非差旅
            ntripname.push(allthepas[i].Name)
            noroule.push(0)
        }else{// 为1 就是差旅了

            yesroule.push(1);
            var ky =i;
            var roule = allthepas[ky].rule;// 当前乘机人的 rule权限 为一个字符串 '0,3,7'
            var theroule = roule.split(',');// 当前乘机人的 rule权限 为一个字符串 '0,3,7' 数组 indexOf

            if(theroule.indexOf('0') != -1){// 权限为0
                roule_0.push(i)

            }else if(theroule.indexOf('1') != -1){// 权限为1
                roule_1.push(i)

            }else if(theroule.indexOf('3') != -1){ // 权限为3
                roule_3.push(i)

            }else{// 没有 0 或者1  或者 3
                roule_d.push(i)
            }

            if(theroule.indexOf('10') != -1){ // 权限为10  无保险
                roule_10.push(i)

            }

        }
    }

////////////////////


    //return{'差旅用户数组':yesroule,'非差旅用户数组':noroule,'权限为0':roule_0,'权限为1':roule_1,'权限为3':roule_3,'权限未知':roule_d,'账号不匹配':roule_n,'非差旅人名':notripPeoples,'不匹配人名':noytripPeoples};


    // 判断  权限是不是 都为0  或者都为1
    var  allp =allthepas.length; // 已选择乘机人数量
    var r_0 = roule_0.length; // 权限为0 的数量
    var r_1 = roule_1.length;// 权限为1 的数量
    var r_3 = roule_3.length;// 权限为1 的数量
    var r_10 = roule_10.length;// 权限为10 的数量
    var r_d = roule_d.length;// 权限为d 的数量 未知权限
    var r_n = roule_n.length;// 账号不匹配的人 数量



    var isall = 0;//  权限是否统一
    var isthenum = 0; //权限具体等级

    if(allp == r_0 || allp == r_1 || allp == r_3 || allp == r_d  ){ // 说明权限是 统一的  未知权限当着 0 处理
        isall = 1;
        if( r_10 !=0){// 说明有 10的 乘机人
            if(allp != r_10){
                isall = 0;
            }
        }
        if(allp == r_0){
            isthenum=0;
        }else if(allp == r_1){
            isthenum=1
        }else if( allp == r_3 ){
            isthenum=3
        }else if(allp == r_d){//  非 0 或者1  3 的时候  权限等级 目前设置为0
            isthenum = 0;
        }
    }else{
        isall = 0;
    }


    var  iscompany = 0;//默认是 不同一公司
    var firstn = '';


    var yesroulelen =yesroule.length;// 差旅人数
    var noroulelen =noroule.length;// 非差旅人数 包含账号不匹配乘机人

    if(yesroulelen == allp ){// 差旅人数和 总人数一样 说明 全是差旅
        iscompany = 1;  // 如果都是差旅 就默认是一个公司 下面还要逐个判断
        firstn = unitIDarr[0];
        for (var j = 0; j < unitIDarr.length; j++) {

            if(firstn != unitIDarr[j]){
                iscompany = 0;
                break
            }
        }


    }else{
        iscompany = 0;
    }
/////////////////////


    //var  eisall= e_tarr.indexOf(0) != -1?0:1 ;// 是否 所有乘机人 能一起购票  有一个没通11  就不能一起下单
   // var  eisall= false;// 因公灰色 判断标记  false 不要灰色  true 为灰色不能点击

    var  no_yestrip = ne_psname.length; //ne_psname  差旅审批11 未通过的 人的数组  长度不为0 说明 有没有通过的 只是 不为2的情况
    var  no_trippaslen = no_trippass.length; //no_trippass  差旅航班信息不匹配 和 审批未通过的 人的数组 人数总计
    var  no_strip = ntripname.length; //ntripname  整合后 所有非差旅人名(因为 没通过审批或者 审批信息不匹配 还是 要出现灰色 不能直接变成散客)
    var  no_notrippas = no_notrippass.length; //no_notrippass  有11 但是没有plan的乘机人  未请假的人的集合
    //var eisall = no_yestrip != 0 ? true: false;
    if(no_yestrip != 0 || no_notrippas != 0){// 有未通过的11 或者 有没请假的
        eisall = true;
    }else{// 没有未通过11 的
        eisall = false;
        // 有散客的时候 也要 有灰色标记
        if(noroulelen!=0 && yesroulelen!=0){//  既有散客 也有差旅的时候
            eisall = true;
        }

        if(no_trippaslen !=0){// 有航班信息不匹配的 已经排除了 有审批未通过的
            eisall = true;
        }
    }





    if(eisall){ // 有散客 /有未通过的11 / 有没请假的
        var str1 ='';// 审批为通过的人名
        var str2 ='';// 非差旅人名单
        var str3 ='';//不能选择月结,如需月结请分开下单,或者自行支付.'// 公共部分提示
        var str4 ='';//plan 为空的用户
        if(no_trippaslen !=0){
            str1= no_trippass.toString()+' 未通过出差审批,';// no_trippass 是 差旅审批未通过和航班信息不匹配的 人名数组
            if(no_strip !=0){ // 有非差旅
                str2=ntripname.toString()+' 是非差旅用户,';
            }


        }else{// 没有 差旅审批没通过且 没有航班信息不匹配
            if(no_strip !=0){ // 有非差旅
                str2=ntripname.toString()+' 是非差旅用户,';
            }

        }
        if(no_notrippas !=0){//  存在11 但是没有plan的 未请假的 乘机人
            str4= `${no_notrippass.toString()} 未请假,`;
        }






        if((str1 && str2) || (!str1 && str2)){
            str3 ='不能选择月结,如需月结请分开下单;或者自行支付';
        }else if(str1 && !str2){
            if(str4){
                str3 ='不能选择月结,如需月结请分开下单;或者自行支付';
            }else{
                str3 ='不能选择月结,请自行支付';
                if(yesroulelen > no_trippaslen  ){//差旅人数  大于 未通过审批的人数  说明 有真真的差旅
                    str3 ='不能选择月结,如需月结请分开下单;或者自行支付';
                }
            }


        }else if(!str1 && !str2){
            str3 ='不能选择月结,请自行支付';
        }

        $.qu('.no_trip').style.display ='block';
        $.qu('.no_trip').innerHTML =str1+str2+str4+str3;

    }else{
        $.qu('.no_trip').style.display ='none';
    }

    var issafe=1;// 1表示需要购买保险
    if(r_10 !=0){
        issafe =0;
    }


    // 存放 11 差旅需要审批的 数组
    // 参数意思 0.差旅人个数  1.非差旅个数 2.总人数 3.权限是否统一(判断 0和1 ，3 的区别 ) 4.权限具体代码 5.非差旅人名单 6.具体公司编码 7.iscompany( 再判断 具体公司编码 是不是一样)  8.issafe(是否需要买保险 1是需要 0 是不需要)
    // 其中 5非差旅人名单 = 非差旅人名单 + 账号不匹配人名单(主次账号)
    //notripPeoples 初始筛选之后的 非差旅名单
    //ne_psname    11判断之后 仅为 审批没通过的 人员 (航班信息不匹配的直接变成非差旅了 还有未审批的也变成非差旅了)
    //ntripname // 存放初次筛选 和 11筛选后非差旅的名字  最终 非差旅名单
    //alert(`差旅人数${yesroulelen}`)

    //ddataar[3] 权限 是否统一 1为统一 0 为不统一
    //ddataar[4] 具体权限代码 只 为 0 1 3 不包含 10 的保险


    ddataar =[yesroulelen,noroulelen,allp,isall,isthenum,notripPeoples,firstn,iscompany,issafe];

    return   [yesroulelen,noroulelen,allp,isall,isthenum,notripPeoples,firstn,iscompany,issafe];

}

//  选择因公因私 按钮
function getTripFn(){
    //选择因公因私
    //var oygBtn = $.qu(".ygLeft-btn");
    //var oysBtn = $.qu(".ysRight-btn");
    $.qu(".ygLeft").onclick = function() {

        onOFFtr =true;

        // 这里需要判断 要不要发生事件 当为11 没通过的的时候
        if(!eisall){ // 没有有11 未通过 或者没有散客
            changeygLeft();

            //proof-box   发票地址
            $.qu('.proof-box').style.display = 'none';
            if(!onOFFr){
                $.qu('.Tripb-box').style.display = 'block';
            }else{
                $.qu('.Tripb-box').style.display = 'none';
            }
            checkChailvPassenger();// 检查差旅乘客数量
        }


    };
    $.qu(".ysRight").onclick = function() {

        if(!eisall){ // 没有有11 未通过 或者没有散客
            onOFFtr =false;
        }

        // 这里需要判断 要不要发生事件 当为11 没通过的的时候
        changeysRight();

        $.qu('.Tripb-box').style.display = 'none';
        if(!onOFFp){
            $.qu('.proof-box').style.display = 'block';
        }else{
            $.qu('.proof-box').style.display = 'none';
        }
        checkChailvPassenger();// 检查差旅乘客数量
    };

}
//  因私状态
function changeysRight(){

    $.qu(".ygLeft-btn").style.boxShadow = "0 0 0 0.2rem #ccc";
    $.qu(".ysRight-btn").style.boxShadow = "0 0 0 0.2rem #cc0000";
    $.qu(".ygLeft-box").setAttribute("choiceType","0");
    $.qu(".ysRight-box").setAttribute("choiceType","1");
}

//  因公状态
function changeygLeft(){
    //$.qu('.ygLeft').style.background='#f3eeee'; // 有11 未通过的时候 背景 因公变为灰色

    $.qu(".ygLeft-btn").style.boxShadow = "0 0 0 0.2rem #cc0000";
    $.qu(".ygLeft-box").setAttribute("choiceType","1");
    $.qu(".ysRight-box").setAttribute("choiceType","0");
    $.qu(".ysRight-btn").style.boxShadow = "0 0 0 0.2rem #ccc";
}


//将时间转换为 数字比较
function datetoNumber(time) {
       var timenew=  detailChange(time.replace(/(\-)|(\/)/ig,'-'));
    return Number(timenew.replace(/\-/ig, ""))
}
// 时间格式组装
function detailChange(date){

    //对date进行重新组装成yyyy-MM-dd的格式
    //2014 - 8 - 7
    try {
        var tempDate1Arr = date.split("-");
        date = tempDate1Arr[0] + ""
        if (tempDate1Arr[1].length == 1) {
            date += "-0" + tempDate1Arr[1];
        } else {
            date += "-" + tempDate1Arr[1];
        }
        if (tempDate1Arr[2].length == 1) {
            date += "-0" + tempDate1Arr[2];
        } else {
            date += "-" + tempDate1Arr[2];
        }
    } catch (e) {
    }


    return date
}


// 郑旭东接口
function getallphonenum(num){

    var xhr = '';
    if(window.XMLHttpRequest){
        xhr = new XMLHttpRequest();
    }else{
        xhr =new ActiveXObject(' Microsoft . XMLHTTP')
    }
    xhr.open('post','http://ca.nuoya.io/leaveSp/api/userinfo','false');
    xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded')
    xhr.send('cardID='+num);
    xhr.onreadystatechange = function(){
        if( xhr.readyState == 4){
            // ajax 响内容解析完成，可以在客户端调用了
            if(xhr.status == 200){
                //  判断服务器返回的状态 200 表示 正常
                var oData3 = eval('('+xhr.responseText+')');
                console.log(oData3);
                var rc =oData3.rc;
                if(rc ==  200){
                    //var data =oData3.UserInfo
                    redata(oData3.UserInfo);
                }else{
                    alert('获取乘客差旅信息失败！')
                }
            }else{

                alert('出错了，'+xhr.status);
                //myalertp('router0','出错了，获取客服联系电话失败！')
            }
        }
    }
}


//  利用2个接口 整合数据 判断差旅
function checkChailvPassenger(){

    //  获取 所有已经选择的乘机人的信息
    var allpsg= $.qus('.myBook-namel');
    var alld = [];//存放 所有乘机人的 数据
    for(var i=0; i<allpsg.length;i++){
        var dps =JSON.parse( allpsg[i].getAttribute("data"));
        alld.push(dps);
    }

    twodatapk(alld);// 讲页面的数据 传入函数
}

// 检查是否是差旅 ？
function twodatapk(newdata) {



    console.log('整合后所有数据');
    console.log(newdata);


    var thenum =checktheroule(newdata);
    console.log(`差旅整合后数据`)
    console.log(thenum)
    //var theonoffarr = thenum[8];
    //ishave = true; // 是否有差旅功能 默认有
    //for (var i = 0; i < theonoffarr.length; i++) {
    //    var odat = theonoffarr[i];
    //    if(odat == 0){
    //        ishave = false;
    //        break
    //    }
    //
    //}
    var y =thenum[0];//差旅人个数
    var n=thenum[1];// 非差旅个数

    nottripNum = thenum[5];//非差旅人名单




    // 下面的代码不能变动

    var thebtnnum =$.qu('.ygLeft-box').getAttribute('choicetype');

    if (y>0) {// 成立 则有差旅乘客
        //// false  表示是 所有乘客中 有差旅用户  但是 不确定是不是 全是 不能走 差旅通道
        //mIsNormalPassenger = false;


        $.qu('.ygLeft').style.background=''; // 默认因公背景不需要颜色

        var lenRC =y;// 根据返回的差旅乘客数量 和总乘机人数量比 相同则都是差旅
        //console.log('差旅乘客数量'+ lenRC);
        var lenParam =y+n;
        if (lenRC == lenParam  ) { // 全部匹配


            mIsNormalPassenger = false;// 全为差旅乘客
            mPassengerIsValidated = true;//  全是差旅的话 检查乘客通过 // 检查所有乘客信息通过


            if(zyTable ==1){// 直营
                //zyTablechange =1;
                //$.qu('.Trip').style.display = 'none';//隐藏 差旅 填写按钮
                //
                //$.qu('.zycp').style.display  = 'block';//显示 直营标签
                //$.qu('.zycp1').style.display  = 'block';//显示 直营标签


                if(isTrippok == 1 ){ //1直营 匹配 成功 有30的保险

                    zyTablechange= 0;// 变成 非直营
                    $.qu('.Tripb').style.display = 'block';//显示 差旅 填写按钮
                    $.qu('.goReason').style.display = 'block';//显示 因公因私按钮

                    if(eisall){// 有散客 或者 11为通过
                        $.qu('.ygLeft').style.background='#f3eeee'; // 有11 未通过的时候 背景 因公变为灰色
                        changeysRight();//只能出现因私
                    }else{
                        if(thebtnnum == 0 && $.qu('.goReason').style.display =='block'){
                            if(onOFFtr ){
                                changeygLeft();// 变成因公状态
                            }

                        }
                    }


                    $.qu('.zycp').style.display  = 'none';//取消 直营标签
                    $.qu('.zycp1').style.display  = 'none';//取消 直营标签
                    $.qu('.zycp1').style.background = '#fff';
                    $.qu('.zycp').style.background = '#fff';
                    // 有带考虑  直营 且 匹配成功 就 为差旅了 有保险
                    $.qu('.mttdata-sp3').style.display  = 'inline-block';// 显示保险
                    $.qu('.buysafe').style.display  = 'block';// 显示保险 buysafe

                    if(backFlight){ // 往返
                        $.qu('.mttdata1-sp3').style.display  = 'inline-block';// 显示保险

                    }
                    var thebtnnumn =$.qu('.ygLeft-box').getAttribute('choicetype');
                    if(thebtnnumn == 1 && $.qu('.goReason').style.display =='block' ){
                        $.qu('.proof').style.display = 'none';
                        $.qu('.proof-box').style.display ='none';
                        $.qu('.Tripb').style.display = 'block';
                        if(!onOFFr){//  onOFFr 为 true  为关闭状态
                            $.qu('.Tripb-box').style.display ='block';

                        }else{
                            $.qu('.Tripb-box').style.display ='none';

                        }
                    }else{
                        $.qu('.proof').style.display = 'block';
                        //$.qu('.proof-box').style.display ='block';//让发票显示 但是不能让 详情展现
                        if(!onOFFp){//  onOFFr 为 true  为关闭状态
                            $.qu('.proof-box').style.display ='block';

                        }else{
                            $.qu('.proof-box').style.display ='none';

                        }

                        $.qu('.Tripb').style.display = 'none';
                        $.qu('.Tripb-box').style.display ='none';
                    }



                }else {
                    zyTablechange= 1;// 仍然为 直营
                    $.qu('.Tripb').style.display = 'none';//隐藏 差旅 填写按钮
                    $.qu('.goReason').style.display = 'none';//隐藏因公因私
                    $.qu('.zycp').style.display  = 'inline-block';//显示 直营标签
                    $.qu('.zycp1').style.display  = 'inline-block';//显示 直营标签
                    $.qu('.zycp1').style.background = '#eee';
                    $.qu('.zycp').style.background = '#eee';
                    // 有带考虑  直营 且 匹配成功 就 为差旅了 有保险
                    $.qu('.mttdata-sp3').style.display  = 'none';// 隐藏保险
                    // 可以用 $.qu('.buysafe').style.display  = 'none';// 显示保险 buysafe

                    if(backFlight){ // 往返
                        $.qu('.mttdata1-sp3').style.display  = 'none';// 显示保险

                    }
                }
            }else{ // 非直营 全是差旅乘客

                if( thenum[8]==0 && !eisall){ // 权限统一 且都为 不能买保险
                    // 默认保险
                    if(onOFF){// 关闭保险
                        // $.qu('.buysafe-btnbox1').style.left ='0.1rem';
                        $.addClass($.qu('.buysafe-btnbox1'),'buysafe-btnbox1left');
                        //this.style.backgroundColor ='#ccc';
                        $.addClass($.qu('.buysafe-btnbox'),'buysafe-btnboxbcf');

                        onOFF =false;
                    }


                }else{// 选择保险



                    //$.qu('.buysafe-btnbox1').style.left ='1.2rem';
                    $.removeClass($.qu('.buysafe-btnbox1'),'buysafe-btnbox1left');
                    //this.style.backgroundColor ='#f4734b';
                    $.removeClass($.qu('.buysafe-btnbox'),'buysafe-btnboxbcf');
                    onOFF =true;
                }





                zyTablechange =0;
                $.qu('.Tripb').style.display = 'block';//显示 差旅 填写按钮
                $.qu('.goReason').style.display = 'block';//显示 因公因私

                if(eisall){// 有散客 或者 11为通过
                    $.qu('.ygLeft').style.background='#f3eeee'; // 有11 未通过的时候 背景 因公变为灰色
                    changeysRight();//只能出现因私
                }else{
                    if(thebtnnum == 0 && $.qu('.goReason').style.display =='block'){
                        if(onOFFtr ){
                            changeygLeft();// 变成因公状态
                        }

                    }
                }

                 $.qu('.zycp').style.display  = 'none';//取消 直营标签
                $.qu('.zycp').style.background = '#fff';

                if(backFlight){ // 往返

                    $.qu('.zycp1').style.display  = 'none';//取消 直营标签
                    $.qu('.zycp1').style.background = '#fff';

                }
                var thebtnnumn =$.qu('.ygLeft-box').getAttribute('choicetype');
                if(thebtnnumn == 1 && $.qu('.goReason').style.display =='block' ){
                    $.qu('.proof').style.display = 'none';
                    $.qu('.proof-box').style.display ='none';
                    $.qu('.Tripb').style.display = 'block';
                    if(!onOFFr){//  onOFFr 为 true  为关闭状态
                        $.qu('.Tripb-box').style.display ='block';

                    }else{
                        $.qu('.Tripb-box').style.display ='none';

                    }
                }else{
                    $.qu('.proof').style.display = 'block';
                    if(!onOFFp){//  onOFFr 为 true  为关闭状态
                        $.qu('.proof-box').style.display ='block';

                    }else{
                        $.qu('.proof-box').style.display ='none';

                    }
                    $.qu('.Tripb').style.display = 'none';
                    $.qu('.Tripb-box').style.display ='none';
                }
            }

        } else { // 部分有 差旅乘客

//////////

            if(zyTable == 1){// 直营
                //if( zyTablechange ==0 ) { // 直营下的非直营
                //    zyTablechange = 1;// 变成直营
                //    $.qu('.Tripb').style.display = 'none';//隐藏差旅 填写按钮
                //    $.qu('.Tripb-box').style.display = 'none';
                //    $.qu('.goReason').style.display = 'block';//显示因公因私 // 南航的时候   差旅和散客 选择因私的时候 可以一起下单
                //
                //    if (eisall) {// 有散客 或者 11为通过
                //        $.qu('.ygLeft').style.background = '#f3eeee'; // 有11 未通过的时候 背景 因公变为灰色
                //        changeysRight();//只能出现因私
                //    }
                //
                //    alert(2034)
                //
                //    $.qu('.zycp').style.display = 'inline-block';//显示 直营标签
                //    $.qu('.zycp').style.background = '#eee';
                //    //  可以用 $.qu('.buysafe').style.display  = 'none';// 隐藏保险 buysafe
                //    if (backFlight) { // 往返
                //        $.qu('.mttdata1-sp3').style.display = 'none';// 隐藏保险
                //        $.qu('.zycp1').style.display = 'none';//取消 直营标签
                //        $.qu('.zycp1').style.background = '#fff';
                //    }
                //
                //
                //}else{
                //    alert(2048)
                //    zyTablechange =1;
                //    $.qu('.Tripb').style.display = 'none';//隐藏差旅 填写按钮
                //    $.qu('.Tripb-box').style.display ='none';
                //    $.qu('.goReason').style.display = 'none';//隐藏因公因私
                //    $.qu('.zycp').style.display  = 'inline-block'; //显示 不全部是差旅的话 就买直营了钱了  直营标签
                //    $.qu('.zycp').style.background = '#eee';
                //    if(backFlight){ // 往返
                //        $.qu('.mttdata1-sp3').style.display  = 'none';// 隐藏保险
                //        $.qu('.zycp1').style.display  = 'none';//取消 直营标签
                //        $.qu('.zycp1').style.background = '#fff';
                //
                //    }
                //}

                zyTablechange = 1;// 变成直营
                $.qu('.Tripb').style.display = 'none';//隐藏差旅 填写按钮
                $.qu('.Tripb-box').style.display = 'none';
                $.qu('.goReason').style.display = 'block';//显示因公因私 // 南航的时候   差旅和散客 选择因私的时候 可以一起下单

                if (eisall) {// 有散客 或者 11为通过
                    $.qu('.ygLeft').style.background = '#f3eeee'; // 有11 未通过的时候 背景 因公变为灰色
                    changeysRight();//只能出现因私
                }

                //alert(2034)

                $.qu('.zycp').style.display = 'inline-block';//显示 直营标签
                $.qu('.zycp').style.background = '#eee';
                //  可以用 $.qu('.buysafe').style.display  = 'none';// 隐藏保险 buysafe
                if (backFlight) { // 往返
                    $.qu('.mttdata1-sp3').style.display = 'none';// 隐藏保险
                    $.qu('.zycp1').style.display = 'none';//取消 直营标签
                    $.qu('.zycp1').style.background = '#fff';
                }




            }else{ // 非直营 部分有差旅

                $.qu('.proof').style.display = 'block';// 不全是 差旅 就显示 发票地址



                zyTablechange =0;

                $.qu('.Tripb').style.display = 'none';//隐藏差旅 填写按钮
                $.qu('.Tripb-box').style.display ='none';
                $.qu('.goReason').style.display = 'block';//显示因公因私

                if(eisall){// 有散客 或者 11为通过
                    $.qu('.ygLeft').style.background='#f3eeee'; // 有11 未通过的时候 背景 因公变为灰色
                    changeysRight();//只能出现因私
                    if(!onOFFp){//  onOFFr 为 true  为关闭状态
                        $.qu('.proof-box').style.display ='block';
                        //alert('blcok')
                    }else{
                        $.qu('.proof-box').style.display ='none';
                        //alert('none')
                    }
                }



                $.qu('.zycp').style.display  = 'none'; //非直营 肯定就不显示了
                $.qu('.zycp').style.background = '#fff';

                if(backFlight){ // 往返
                    $.qu('.mttdata1-sp3').style.display  = 'inline-block';// 显示保险
                    $.qu('.zycp1').style.display  = 'none';//取消 直营标签
                    $.qu('.zycp1').style.background = '#fff';
                }
            }

            mIsNormalPassenger = true;// 不全是差旅  则为 散客
            mPassengerIsValidated = false; //  不全是差旅的话 检查乘客不通过
            // zYChangePageView(0, 0);
        }
    } else {// 没有 差旅名单

        //$("#Trip").hide();

        $.qu('.Tripb').style.display = 'none';//隐藏 差旅 填写按钮
        $.qu('.Tripb-box').style.display ='none';
        $.qu('.goReason').style.display = 'none';//隐藏 因公因私


        if(zyTable ==1){// 直营 没有 差旅名单
            zyTablechange =1;

            if( isTrippok == 1 ){ //1直营 匹配 成功 有30的保险

                zyTablechange= 1;// 变成 非直营

                $.qu('.zycp').style.display  = 'inline-block';//取消 直营标签
                $.qu('.zycp1').style.display  = 'inline-block';//取消 直营标签
                $.qu('.zycp1').style.background = '#eee';
                $.qu('.zycp').style.background = '#eee';
                // 有带考虑  直营 且 匹配成功 就 为差旅了 有保险
                $.qu('.mttdata-sp3').style.display  = 'none';// 隐藏保险
                $.qu('.buysafe').style.display  = 'none';// 显示保险 buysafe

                if(backFlight){ // 往返
                    $.qu('.mttdata1-sp3').style.display  = 'none';// 显示保险

                }
            }

            zyTablechange = 1;


            $.qu('.zycp').style.display  = 'inline-block';//显示 直营标签
            $.qu('.zycp').style.background = '#eee';

            if(backFlight){ // 往返 直营 没有 差旅名单
                $.qu('.mttdata1-sp3').style.display  = 'none';// 隐藏保险
                $.qu('.zycp1').style.display  = 'inline-block';//显示 直营标签
                $.qu('.zycp1').style.background = '#eee';
            }

        }else{   //非直营 没有 差旅人
            $.qu('.proof').style.display = 'block';// 不全是 差旅 就显示 发票地址

            zyTablechange = 0;

            $.qu('.zycp').style.display  = 'none'; //非直营 肯定就不显示了
            $.qu('.zycp').style.background = '#fff';
            if(backFlight){ // 往返
                //$.qu('.mttdata1-sp3').style.display  = 'none';// 隐藏保险
                $.qu('.zycp1').style.display  = 'none';//隐藏 直营标签
                $.qu('.zycp1').style.background = '#fff';
            }
        }


        mIsNormalPassenger = true; // 为散客
        mPassengerIsValidated = true; // 检查所有乘客信息通过

    }
    // 计价函数 位于 判断差旅乘客之后
    alloneMone();


}


//判断下哪家的单子
function changeCabinTypeFun(carrier, cabinType) {//南航 CZ  cbtype 3
    //判断一家报价start
     //      CZ
    var carrierOne = carrier;     //ZH
    var makeZyOrder = false;//是否在后台下直营的单
    for (var price in mPriceObj) {
        if (!mPriceObj[price]) {
            makeZyOrder = true;
            break;
        }
    }

    if (mIsNormalPassenger) {//是散客 还是 直营  真为 散客  假为差旅
        var isMatch = false;
        if(isTrippok ==1 ){ // 航司号 相同 直营差旅
            isMatch = true;
        }
        if (isMatch) {
            cabinType = 6;
            console.log("前台改为下直营的单");
        } else {
            console.log("走原来的散客逻辑");
        }
    } else {
        console.log("差旅逻辑");
        if (makeZyOrder) {
            console.log("后台下直营的单");
        } else {
            console.log("后台下普通的单");
        }
    }

    //判断一家报价end
    return [cabinType, makeZyOrder];
}


//验价
function checkPriceFun(flight) {
    var jsonData = {};
    if (flight) {
        //console.log("返程验价");
    } else {
        //console.log("去程验价");
        var f = DecFlights();
        flight = f[0];
    }
    jsonData = {
        "act": "checkPrice",
        "from": flight.a,
        "to": flight.b,
        "flightNo": flight.c,
        "cabin": flight.d,
        "flightDate": flight.e
    };
    var nowPrice = flight.h;

    var oData2 = '';
    var xhr = '';
    if(window.XMLHttpRequest){
        xhr = new XMLHttpRequest();
    }else{
        xhr =new ActiveXObject(' Microsoft . XMLHTTP')
    }
    var reqPath = '/icbc/ajax.aspx';
    xhr.open('post', reqPath, 'true');
    xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=utf-8');
    xhr.send("act=checkPrice&from="+flight.a+"&to="+flight.b+"&flightNo="+flight.c+"&cabin="+flight.d+"&flightDate="+flight.e);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            // ajax 响内容解析完成，可以在客户端调用了
            if (xhr.status == 200) {
                //  判断服务器返回的状态 200 表示 正常
                oData2 = xhr.responseText;
                var match = false;//价格是否匹配
                if (oData2 == nowPrice) {
                    match = true;
                } else {
                    match = false;
                }
                var key = jsonData.flightNo + "_" + jsonData.flightDate;
                mPriceObj[key] = match;
                //console.log(key + ":" + oData2 + "," + nowPrice);

                Object.size = function (obj) {
                    var size = 0, key;
                    for (key in obj) {
                        if (obj.hasOwnProperty(key)) size++;
                    }
                    return size;
                };
                var len = Object.size(mPriceObj);
                var fltReturn = DecFlights();
                if (len < 2 && fltReturn.length > 1) {
                    checkPriceFun(fltReturn[1]);
                } else {
                    console.log("验价完毕");
                }

            } else {
                //alert('验价出错了，Err' + xhr.status);
                myalertp('myBook','验价出错了，Err' + xhr.status)
            }
        }
    };

}
// 获取航班信息的函数
function DecFlights(){
    //console.log(checkPricedata);
    return  checkPricedata
}




//页面填写数据
function  bookPulldata1(bookdata1){ //去程数据  单程数据数据
    myBookChange1(bookdata1.theCarrier1,bookdata1.theCa); //退改签
    $.qu('.myBook-mtfsp1').innerHTML =getLastFive(bookdata1.data1); //日期
    $.qu('.myBook-mtfsp111').innerHTML =isNextDay(bookdata1.ftime,bookdata1.ttime,bookdata1.data1); //日期
    $.qu('.myBook-mtfsp2').innerHTML =bookdata1.pc; //航空公司
    $.qu('.myBook-mtfsp3').innerHTML =bookdata1.pcnum ;//航班编码
    $.qu('.myBook-mttsp1').innerHTML =bookdata1.ftime; //起飞时间
    $.qu('.myBook-startFP').innerHTML =bookdata1.fplace; //起飞地点
    $.qu('.myBook-endFP').innerHTML =bookdata1.tplace; //到达地点
    $.qu('.myBook-mttsp2').innerHTML =bookdata1.ttime; //降落时间
    $.qu('.myBook-mttsp11').innerHTML =bookdata1.fport; //起飞机场
    $.qu('.myBook-mttsp22').innerHTML =bookdata1.tport; //降落机场
    $.qu('.mttbookprice').innerHTML =bookdata1.pice1; //价格
}
function  bookPulldata2(bookdata2){ //返程程/
    myBookChange2(bookdata2.theCarrier1,bookdata2.theCa); //退改签
    $.qu('.myBook1-mtfsp1').innerHTML =getLastFive(bookdata2.data1); //日期
    $.qu('.myBook1-mtfsp111').innerHTML =isNextDay(bookdata2.ftime,bookdata2.ttime,bookdata2.data1); //日期

    $.qu('.myBook1-mtfsp2').innerHTML =bookdata2.pc; //公司
    $.qu('.myBook1-mtfsp3').innerHTML =bookdata2.pcnum ;//航班编码
    $.qu('.myBook1-mttsp1').innerHTML =bookdata2.ftime; //起飞时间
    $.qu('.myBook1-startFP').innerHTML =bookdata2.fplace; //起飞地点
    $.qu('.myBook1-endFP').innerHTML =bookdata2.tplace; //降落地点
    $.qu('.myBook1-mttsp2').innerHTML =bookdata2.ttime; //降落时间
    $.qu('.myBook1-mttsp11').innerHTML =bookdata2.fport; //起飞机场
    $.qu('.myBook1-mttsp22').innerHTML =bookdata2.tport; //降落机场
    $.qu('.mttbookprice4').innerHTML =bookdata2.pice1; //价格
}



 // 预定接口数据整合函数 数据量较大
 // bookdata1:航班信息  ShipFeeOnoff:凭证开关 是否收快递费
 // Passenger：乘客信息
 // Member: 会员信息 数组或者json
 // Contact: 联系人消息 数组或者json
 // ShipAddr: 收件人具体地址
// 单程 成人
function pullAlldatatoBook(bookdatas,ShipFeeOnoff,Passengertt,Contact,ShipAddr,DS,Member,Tripdata){

    $.qu('.lodinb').style.display ='-webkit-box';
    if(backFlight){
       var  bookdata=bookdatas[0];
       // alert(bookdata)
        console.log('去程数据？');

        var fdatedata =bookdata.data1;
        var tdatedata =bookdatas[1].data1;
        //console.log(bookdata)
    }else{
       var  bookdata =bookdatas;
    }

    //var allData ={};
    var saferule1 = $.qu('.looktext1-changetex3').innerHTML; //退票
    var saferule2 = $.qu('.looktext1-changetex2').innerHTML; //改期
    var saferule3 = $.qu('.looktext1-changetex1').innerHTML; //签转
    var therefundrule='退票： '+saferule1+ '改期： '+saferule2 +'签转：'+saferule3;
    var cptype = bookdata.CabinType;
    var cptype1 =bookdata.theCarrier1;// 航司号

    var DirectSale = "", source = "wap";
    //  判断 是 下什么单
    var cabinType =bookdata.CabinType;
    var cabinTypeArr = changeCabinTypeFun(cptype1, cptype);
    cabinType = cabinTypeArr[0];

    if (cabinType == 6) {
        DirectSale = source = cptype1;
    }
    //console.log('source1:'+source);
    var price = Number(bookdata.YPrice);
    var fltsStr = '["' + bookdata.RouteFromCode + '","' + bookdata.RouteToCode + '","' + bookdata.pcnum + '","' + bookdata.theCa + '","' + bookdata.data1 + '","' + bookdata.ftime + '","' + bookdata.ttime + '","' + bookdata.pice1 + '", "' + 50 + '", "' + 0 + '", '+price+','+DS+',0,"' + bookdata.Cabin1 + '","' + bookdata.Lmodel + '", 0 ,1,"' + bookdata.Terminal + '", 0,3]';

    var goFlightdata =bookdata.pcnum+'_'+bookdata.theCa;
    var bookType =3;

    var priceFrom =0;

    var hongbao =0;
    var refundrule =therefundrule;
    var  shipfee = ShipFeeOnoff;
    var psg_service_fee = 0;
    var  SupplyID =0;

    console.log('乘机人信息');
    console.log(Passengertt);
    if(backFlight){
        var passenger  =Passengertt[0][0];
        //alert(passenger)
        console.log('去时乘客信息');
        console.log(passenger)
    }else{
        var passenger  =Passengertt[0];
    }


    var cardNo = Member.No;
    var memberName = Member.name;
    var contact_id = Contact.contactid;
    var name = Contact.name;  //  联系人名字
    var mobile = Contact.phone; // 联系人电话
    var email = ''; //联系人邮箱
    var shipType = shipfee == 0 ?5 : 4; // 快递为 4  平邮为5
    var shipAddr = ShipAddr;//  收件人具体地址
    var shipReq  = ''; // 固定值写死
    var UnitNo =  UnitNo;//
    if(!Tripdata){
        var TripType =  '无';  // 似乎 为固定值 无
        var TripReason =  '无';  // 似乎 为固定值 无
        var PriceReason =  '无';  // 似乎 为固定值 无
        var TripNote = '';  //  收件人信息里面的 备注？  似乎为固定值 为 空
    }else{
        var TripType =  Tripdata.TripType;  // 似乎 为固定值 无
        var TripReason =  Tripdata.TripReason;  // 似乎 为固定值 无
        var PriceReason =  Tripdata.PriceReason;  // 似乎 为固定值 无
        var TripNote = Tripdata.TripNote;  //  收件人信息里面的 备注？  似乎为固定值 为 空
    }

    var appnt =[]; // 安盛保险？
    var mynotes = '';
     if(backFlight){ // 往返
         mynotes = '往返订单';
     }else{
         if(ynum >0){// 有儿童
             mynotes = '成人儿童订单';
         }else{
             mynotes = ''
         }
     }

    var ispersonal = 0;
    var thebtnnump =$.qu('.ygLeft-box').getAttribute('choicetype');
    if($.qu('.goReason').style.display == 'block'){
        ispersonal = thebtnnump == 1?2:0;
    }

    var bkdata = "{'Flight':['" + fltsStr + "'],'BookType':'" + bookType + "','CabinType':'" + cabinType + "','PriceType':'1','PriceFrom':'" + priceFrom + "','source':'" + source + "','HongBao':'" + hongbao + "','RefundRule':'" + refundrule + "','ShipFee':'" + shipfee + "','ServiceFee':'" + psg_service_fee + "','SupplyID':'" + SupplyID + "','Passenger':[" + passenger + "],'CardNo':'" + cardNo + "','MemberName':'" +memberName + "','ContactID':'" + contact_id + "','ContactName':'" + name + "','ContactPhone':'" + mobile + "','Email':'" + email + "','ShipVia':" + shipType + ",'ShipAddr':'" + shipAddr + "','ShipReq':'" + shipReq + "','Notes':'" + mynotes + "','Price':0,'Rate':0,'Payfee':0,'Insurance':0,'Addfee':0,'Total':0,'Remark':'','Restrictions':'不得签转','UnitNo':'','SubUnitNo':'" + UnitNo + "','TripType':'" + TripType + "','TripReason':'" + TripReason + "','PriceReason':'" + PriceReason + "','TripNote':'" + TripNote + "','Appnt':['" + appnt + "'],'PnrNo':'','PNR':'','Personal':'" + ispersonal + "' }";


    //console.log(bkdata)
    var bk ="bk="+bkdata;
    //var insuretype  ="&insuretype="+bookdata.InsureType;
    //if(ynum >0){//有儿童
    //     var insuretype  ="&insuretype=3";
    //}else{
    //    if($.qu('.mttdata-sp3').style.display == 'inline-block' && $.qu('.mttbookprice2').innerHTML == '20'){
    //        var insuretype  ="&insuretype=12";// 差旅的时候  选20的情况
    //    }else{
    //        var insuretype  ="&insuretype="+bookdata.InsureType;
    //    }
    //
    //}
    if(zyTablechange ==1){//直营 真直营
        if(onOFF && $.qu('.buysafe').style.display == 'block'){// 30的
            var insuretype  ="&insuretype="+bookdata.InsureType;
        }else{
            if(onOFFt && $.qu('.buysafet').style.display == 'block'){
                var insuretype  ="&insuretype=12";// 差旅的时候  选20的情况
            }else{
                var insuretype  ="&insuretype="+bookdata.InsureType;
            }
        }

    }else{// 非直营 可能有假的 非直营
        if(ynum >0){//有儿童
             var insuretype  ="&insuretype=3";

        }else{
            if(zyTable ==1){ //假的非直营 只可能为南航

                //var insuretype  ="&insuretype=13";
                var insuretype  ="&insuretype="+bookdata.InsureType;

            }else{ //真非直营
                var insuretype  ="&insuretype="+bookdata.InsureType;
            }
        }
    }

    console.log('去程或者成人预定保险类型:'+insuretype);
   // var Dire = bookdata1.CabinType=="6"?bookdata1.theCarrier1:'';
    var DirectSale1  ="&DirectSale="+DirectSale;
    var DSPo     =ZhPolicyId1 == 1?'':ZhPolicyId1;
    var DSPolicyID  ="&DSPolicyID="+DSPo;//
    var makeZyOrder ="&makeZyOrder="+cabinTypeArr[1];

    //var urldata =bk+insuretype+DirectSale1+DSPolicyID+makeZyOrder+"&FromWhere=wap";
    var fdate ='';// 去程日期
    var tdate ='';// 返程日期
    var cpdata =''; // 去程航班信息
    if(backFlight){
        fdate =fdatedata;
        tdate =tdatedata;
        cpdata =goFlightdata;
    }

    //var goDate      ="&goDate="+fdate;//
    //var backDate   ="&backDate ="+tdate;//
    //var goFlight  ="&goFlight ="+cpdata;
    var cacheParam1={
        backDate:fdate,
        goDate:tdate,
        goFlight:''
    }
    var cacheParam ="&cacheParam ="+JSON.stringify(cacheParam1);

    if(zyCP == '3U' ){// 川航 需要特殊字段
        //CHOtherParam1={};
        //CHOtherParam2={};
        if(zyTable == 1){// 川航直营
            var CHOtherParam = "&CHOtherParam="+ JSON.stringify(CHOtherParam1);
            var urldata =bk+insuretype+DirectSale1+DSPolicyID+makeZyOrder+CHOtherParam+cacheParam+"&FromWhere=wap";
        }else{
            var CHOtherParam = "&CHOtherParam=";
            var urldata =bk+insuretype+DirectSale1+DSPolicyID+makeZyOrder+CHOtherParam+cacheParam+"&FromWhere=wap";
        }

    }else{
        var CHOtherParam = "&CHOtherParam=";
        var urldata =bk+insuretype+DirectSale1+DSPolicyID+makeZyOrder+CHOtherParam+cacheParam+"&FromWhere=wap";
    }
    console.log('往返订单去程提交数据或者儿童成人成人数据或者单程数据'+ urldata);
    var  oData2 = '';
    var xhr = '';
    if(window.XMLHttpRequest){
        xhr = new XMLHttpRequest();
    }else{
        xhr =new ActiveXObject(' Microsoft . XMLHTTP')
    }
    //xhr.open('post', 'http://106.75.131.58:8015/icbc/OrderSumit.aspx', 'false');
    xhr.open('post', flightUrl+'/icbc/OrderSumit.aspx', 'false');
    xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=utf-8');
    xhr.send("isKyReq=1&url=&" + urldata);
    // console.log(isKyReq"=1&act=ORDERBOOK&url=''&reqPath='icbc/OrderSumit.aspx'&" + urldata)
    xhr.onreadystatechange = function(){
        if( xhr.readyState == 4){
            $.qu('.lodinb').style.display ='none';
            //$.id('loadorder-type').innerHTML ='航班预定中...';
            // ajax 响内容解析完成，可以在客户端调用了
            if(xhr.status == 200){

                //  判断服务器返回的状态 200 表示 正常
                oData2 = eval('(' + xhr.responseText + ')');
                var bnumber =oData2.OrderID; //根据订单编号判断 是否成功
                var bpric = oData2.Price;// 预定后返回的价格
                const  pnrstatus =oData2.PnrStatus;//  订单 返回状态 只有 HK 才算是成功
                //var isbooked =oData2.PnrStatus.indexOf('HK')<0?false:true;
                console.log('成人或去程预定成功返回数据 ：');
                console.log( oData2);

                if(bnumber>0 && bpric >0){// 同时满足才能判断 预定成功
                    if(pnrstatus.indexOf('HK') != -1){
                        if(backFlight){// 往返航班
                            localStorage.setItem('oddOrderID',bnumber);
                            pullAlldatatoBooky(bookdatas,ShipFeeOnoff,Passengertt,Contact,ShipAddr,DS,Member,Tripdata);
                        }else{
                            if(ynum>0){ // 有儿童
                                localStorage.setItem('oddOrderID',bnumber);
                                pullAlldatatoBooky(bookdatas,ShipFeeOnoff,Passengertt,Contact,ShipAddr,DS,Member,Tripdata);

                            }else{
                                // 没有儿童的时候
                                bookToorder(bookdata,bnumber);//  带数据 进入 订单页面
                            }
                        }

                    }else{
                        if(backFlight){// 往返航班
                            myalertp('myBook','去程预定失败，订单状态异常,(订单状态：'+pnrstatus+')');
                        }else{
                            if(ynum>0){ // 有儿童
                                myalertp('myBook','成人预定失败，订单状态异常,(订单状态：'+pnrstatus+')');
                            }else{
                                // 没有儿童的时候
                                myalertp('myBook','预定失败，订单状态异常,(订单状态：'+pnrstatus+')');
                            }
                        }
                    }
                }else{
                    //alert('预定失败，请重试或者选择其他航班！')
                    if(oData2.Info){
                        myalertp('myBook',oData2.Info)
                    }else{
                        const  theca = bookdata.theCa;
                        if(theca.length>1){
                            myalertp('myBook','预定失败，请重试或者选择其他航班！(当前舱位编码:'+theca+')')
                        }else{
                            myalertp('myBook','预定失败，请重试或者选择其他航班！')
                        }
                    }

                    console.log(oData2)
                }

            }else{
                //alert('出错了，数据请求失败！');
                myalertp('myBook','出错了，数据请求失败！')

            }
        }
    }

}


// 只订儿童票 或者往返票
function pullAlldatatoBooky(bookdatas,ShipFeeOnoff,Passenger,Contact,ShipAddr,DS,Member,Tripdata){

    //if(ynum !=0){
    //    $.id('loadorder-type').innerHTML ='儿童预定中...';
    //}else{
    //    $.id('loadorder-type').innerHTML ='返程预定中...';
    //}
    $.qu('.lodinb').style.display ='-webkit-box';

    if(backFlight){
       var  bookdatab=bookdatas[1]

        var tdatedata =bookdatab.data1;
        var fdatedata =bookdatas[0].data1;


    }else{
       var  bookdatab =bookdatas;
    }
    //BookuserOnoff(3);// 验证用户 成功则存在本地
    var allData ={　};
    var saferule1 = $.qu('.looktext1-changetex3').innerHTML; //退票
    var saferule2 = $.qu('.looktext1-changetex2').innerHTML; //改期
    var saferule3 = $.qu('.looktext1-changetex1').innerHTML; //签转
    var therefundrule='退票： '+saferule1+ '改期： '+saferule2 +'签转：'+saferule3;
    var cptype = bookdatab.CabinType;
    var cptype1 =bookdatab.theCarrier1;


    var DirectSale = "", source = "wap";
    //  判断 是 下什么单
    var cabinType =bookdatab.CabinType;//
    var cabinTypeArr = changeCabinTypeFun(cptype1, cptype); //航空公司2字码   cb类型
        cabinType = cabinTypeArr[0];

    if (cabinType == 6) {
        DirectSale = source = cptype1;
    }
    console.log('source2:'+source);


    //if (zyCP == 'ZH' && zyTable == 1) {
    //    price = Number(bookdatab.YPrice);//Y仓价格
    //}else{
    //    price = Number(bookdatab.YPrice);//Y仓价格
    //    price1 = price
    //}
    var price = Number(bookdatab.YPrice);//Y仓价格

   // if(zyCP == 'ZH' && isY != -1)


    if(ynum !=0){
        //if (zyCP == 'ZH' && zyTable == 1 && isY != -1) {//深航直营  儿童价格 高于Y仓位的时候 为当前价格的一半
        //    var fltsStr = '["' + bookdatab.RouteFromCode + '","' + bookdatab.RouteToCode + '","' + bookdatab.pcnum + '","' + bookdatab.theCa + '","' + bookdatab.data1 + '","' + bookdatab.ftime + '","' + bookdatab.ttime + '","' + bookdatab.pice1 + '", "' + 50 + '", "' + 0 + '", '+price+','+DS+',0,"' +bookdatab.Cabin1 + '","' + bookdatab.Lmodel + '", 0 ,1,"' + bookdatab.Terminal + '", 0,3]';
        //}else{//  非深航 儿童 仓位为y 价格也应该为Y仓
        //
        //    var fltsStr = '["' + bookdatab.RouteFromCode + '","' + bookdatab.RouteToCode + '","' + bookdatab.pcnum + '","'+isYca+'","' + bookdatab.data1 + '","' + bookdatab.ftime + '","' + bookdatab.ttime + '","' + bookdatab.pice1 + '", "' + 50 + '", "' + 0 + '", '+price+','+DS+',0,"' +bookdatab.Cabin1 + '","' + bookdatab.Lmodel + '", 0 ,1,"' + bookdatab.Terminal + '", 0,3]';
        //}

        var fltsStr = '["' + bookdatab.RouteFromCode + '","' + bookdatab.RouteToCode + '","' + bookdatab.pcnum + '","'+isYca+'","' + bookdatab.data1 + '","' + bookdatab.ftime + '","' + bookdatab.ttime + '","' + bookdatab.pice1 + '", "' + 50 + '", "' + 0 + '", '+price+','+DS+',0,"' +bookdatab.Cabin1 + '","' + bookdatab.Lmodel + '", 0 ,1,"' + bookdatab.Terminal + '", 0,3]';

    }else{ // 没有儿童
        var fltsStr = '["' + bookdatab.RouteFromCode + '","' + bookdatab.RouteToCode + '","' + bookdatab.pcnum + '","' + bookdatab.theCa + '","' + bookdatab.data1 + '","' + bookdatab.ftime + '","' + bookdatab.ttime + '","' + bookdatab.pice1 + '", "' + 50 + '", "' + 0 + '", '+price+','+DS+',0,"' +bookdatab.Cabin1 + '","' + bookdatab.Lmodel + '", 0 ,1,"' + bookdatab.Terminal + '", 0,3]';

    }

    var goFlightdata =bookdatab.pcnum+'_'+bookdatab.theCa;// 航班信息

    var bookType =3;

    var priceFrom =0;

    var hongbao =0;
    var refundrule =therefundrule;
    var  shipfee = 0;// 邮寄费用 往返 或者儿童时  邮寄费用 只收一次
    var psg_service_fee = 0;
    var  SupplyID =0;
    //var passenger  =Passenger[1];
    if(backFlight){
        var passenger  =Passenger[1][0];
    }else{
        var passenger  =Passenger[1];//儿童
    }
    var cardNo = Member.No;
    var memberName = Member.name;
    var contact_id =Contact.contactid;
    var name = Contact.name;  //  联系人名字
    var mobile = Contact.phone; // 联系人电话
    var email = ''; //联系人邮箱
    var shipType =  4; // 固定写死
    var shipAddr = ShipAddr;//  收件人具体地址
    var shipReq  = ''; // 固定值写死
    var UnitNo =  UnitNo;// 似乎为这个固定值
    if(!Tripdata){
        var TripType =  '无';  // 似乎 为固定值 无
        var TripReason =  '无';  // 似乎 为固定值 无
        var PriceReason =  '无';  // 似乎 为固定值 无
        var TripNote = '';  //  收件人信息里面的 备注？  似乎为固定值 为 空
    }else{
        var TripType =  Tripdata.TripType;  // 似乎 为固定值 无
        var TripReason =  Tripdata.TripReason;  // 似乎 为固定值 无
        var PriceReason =  Tripdata.PriceReason;  // 似乎 为固定值 无
        var TripNote = Tripdata.TripNote;  //  收件人信息里面的 备注？  似乎为固定值 为 空
    }
    var appnt =[]; // 安盛保险？
    var thebeforeid = localStorage.getItem('oddOrderID');
    var mynotes = '';
    if(backFlight){ // 往返
        mynotes = '往返订单,其去程订单是:'+thebeforeid;
    }else{
        if(ynum >0){// 有儿童
            mynotes = '成人儿童订单,关联订单是:'+thebeforeid;
        }else{
            mynotes = ''
        }
    }

    var ispersonal = 0;
    var thebtnnump =$.qu('.ygLeft-box').getAttribute('choicetype');
    if($.qu('.goReason').style.display == 'block'){
        ispersonal = thebtnnump == 1?2:0;
    }


    var bkdata = "{'Flight':['" + fltsStr + "'],'PriOrderID':'"+thebeforeid+"','BookType':'" + bookType + "','CabinType':'" + cabinType + "','PriceType':'1','PriceFrom':'" + priceFrom + "','source':'" + source + "','HongBao':'" + hongbao + "','RefundRule':'" + refundrule + "','ShipFee':'" + shipfee + "','ServiceFee':'" + psg_service_fee + "','SupplyID':'" + SupplyID + "','Passenger':[" + passenger + "],'CardNo':'" + cardNo + "','MemberName':'" +memberName + "','ContactID':'" + contact_id + "','ContactName':'" + name + "','ContactPhone':'" + mobile + "','Email':'" + email + "','ShipVia':" + shipType + ",'ShipAddr':'" + shipAddr + "','ShipReq':'" + shipReq + "','Notes':'" + mynotes + "','Price':0,'Rate':0,'Payfee':0,'Insurance':0,'Addfee':0,'Total':0,'Remark':'','Restrictions':'不得签转','UnitNo':'','SubUnitNo':'" + UnitNo + "','TripType':'" + TripType + "','TripReason':'" + TripReason + "','PriceReason':'" + PriceReason + "','TripNote':'" + TripNote + "','Appnt':['" + appnt + "'],'PnrNo':'','PNR':'','Personal':'" + ispersonal + "'}";

    //console.log(bkdata)
    var bk ="bk="+bkdata;


    if(zyTablechange ==1){//直营
        if(onOFF && $.qu('.buysafe').style.display == 'block'){
            var insuretype  ="&insuretype="+bookdatab.InsureType;
        }else{
            if(onOFFt && $.qu('.buysafet').style.display == 'block'){
                var insuretype  ="&insuretype=12";// 差旅的时候  选20的情况
            }else{
                var insuretype  ="&insuretype="+bookdatab.InsureType;
            }
        }

    }else{// 非直营 可能有假的非直营
        if(ynum >0){//有儿童
            var insuretype  ="&insuretype=3";
        }else{//无儿童
            if(zyTable ==1 ){// 为全是 差旅用户 假直营 目前只可能为南航

                //var insuretype  ="&insuretype=13";// 差旅的时候  选20的情况

                var insuretype  ="&insuretype="+bookdatab.InsureType;
            }else{
                var insuretype  ="&insuretype="+bookdatab.InsureType;
            }
        }
    }


    console.log('返程或者儿童保险类型'+insuretype);
    //var Dire = bookdata1.CabinType=="6"?bookdata1.theCarrier1:'';
    var DirectSale1  ="&DirectSale="+DirectSale;
    //var DSPo  =bookdatab.theCarrier1=='ZH'?'ZH':''
    if(backFlight){
        var DSPo     = ZhPolicyId2 == 1?'':ZhPolicyId1;
    }else{
        var DSPo     = ZhPolicyId1 == 1?'':ZhPolicyId1;
    }

    var DSPolicyID  ="&DSPolicyID="+DSPo;
    var makeZyOrder ="&makeZyOrder="+cabinTypeArr[1];


  //  龚老师特殊字段
    var fdate ='';// 去程日期
    var tdate ='';// 返程日期
    var cpdata =''; // 去程航班信息
    if(backFlight){
        fdate =fdatedata;
        tdate =tdatedata;
        cpdata =goFlightdata;
    }
    //
    //var goDate  ="&goDate="+fdate;//
    //var backDate ="&backDate ="+tdate;//
    //var goFlight  ="&goFlight ="+cpdata;

    var cacheParam1={
        backDate:tdate,
        goDate:fdate,
        goFlight:cpdata
    }
    var cacheParam ="&cacheParam ="+JSON.stringify(cacheParam1);


    //var urldata =bk+insuretype+DirectSale1+DSPolicyID+makeZyOrder+"&FromWhere=wap";
    if(zyCP == '3U' ){// 川航 需要特殊字段

        if(backFlight){// 往返
            //var CHOtherParam = "&CHOtherParam="+ JSON.stringify(CHOtherParam2) ;
            if(zyTable == 1){// 川航直营
                var CHOtherParam = "&CHOtherParam="+ JSON.stringify(CHOtherParam2);
                var urldata =bk+insuretype+DirectSale1+DSPolicyID+makeZyOrder+CHOtherParam+cacheParam+"&FromWhere=wap";
            }else{
                var CHOtherParam = "&CHOtherParam=";
                var urldata =bk+insuretype+DirectSale1+DSPolicyID+makeZyOrder+CHOtherParam+cacheParam+"&FromWhere=wap";
            }

        }else{// 单程
            //var CHOtherParam = "&CHOtherParam="+ JSON.stringify(CHOtherParam1);
            //var urldata =bk+insuretype+DirectSale1+DSPolicyID+makeZyOrder+CHOtherParam+"&FromWhere=wap";
            if(zyTable == 1){// 川航直营
                var CHOtherParam = "&CHOtherParam="+ JSON.stringify(CHOtherParam1);
                var urldata =bk+insuretype+DirectSale1+DSPolicyID+makeZyOrder+CHOtherParam+cacheParam+"&FromWhere=wap";
            }else{
                var CHOtherParam = "&CHOtherParam=";
                var urldata =bk+insuretype+DirectSale1+DSPolicyID+makeZyOrder+CHOtherParam+cacheParam+"&FromWhere=wap";
            }
        }
    }else{
        var CHOtherParam = "&CHOtherParam=";
        var urldata =bk+insuretype+DirectSale1+DSPolicyID+makeZyOrder+CHOtherParam+cacheParam+"&FromWhere=wap";
    }

    console.log('往返返程提交数据或者儿童成人儿童数据:'+ urldata);
    var  oData2 = '';
    var xhr = '';
    if(window.XMLHttpRequest){
        xhr = new XMLHttpRequest();
    }else{
        xhr =new ActiveXObject(' Microsoft . XMLHTTP')
    }
    //xhr.open('post', 'http://106.75.131.58:8015/icbc/OrderSumit.aspx', 'false');
    xhr.open('post', flightUrl+'/icbc/OrderSumit.aspx', 'false');
    xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=utf-8');
    xhr.send("isKyReq=1&url=&" + urldata);
    // console.log(isKyReq"=1&act=ORDERBOOK&url=''&reqPath='icbc/OrderSumit.aspx'&" + urldata)
    xhr.onreadystatechange = function(){
        if( xhr.readyState == 4){
            $.qu('.lodinb').style.display ='none';
            //$.id('loadorder-type').innerHTML ='航班预定中...';
            // ajax 响内容解析完成，可以在客户端调用了
            if(xhr.status == 200){

                //  判断服务器返回的状态 200 表示 正常
                console.log('儿童预定返回数据')
                console.log(xhr.responseText)
                oData2 = eval('(' + xhr.responseText + ')');
                var bnumber =oData2.OrderID; //根据订单编号判断 是否成功
                var bpric = oData2.Price;// 预定后返回的价格
                const  pnrstatus =oData2.PnrStatus;//  订单 返回状态 只有 HK 才算是成功
                //var isbooked =oData2.PnrStatus.indexOf('HK')<0?false:true;
                console.log('儿童或返程预定成功返回数据 ：');
                console.log(oData2);

                var bnumber1 =localStorage.getItem('oddOrderID');
                if(bnumber>0 && bpric>0){
                    if(pnrstatus.indexOf('HK') != -1){
                        bookToorder(bookdatas,bnumber1,bnumber);//  带数据 进入 订单页面
                        localStorage.getItem('oddOrderID','');
                    }else{
                        if(backFlight){// 往返航班
                            myalertp('myBook','返程预定失败，订单状态异常,(订单状态：'+pnrstatus+')');
                        }else{
                            if(ynum>0){ // 有儿童
                                myalertp('myBook','儿童预定失败，订单状态异常,(订单状态：'+pnrstatus+')');
                            }else{
                                // 没有儿童的时候
                                myalertp('myBook','预定失败，订单状态异常,(订单状态：'+pnrstatus+')');
                            }
                        }
                    }


                }else{
                    if(ynum != 0){// 说明是 儿童订单

                        if(oData2.Info){
                            myalertp('myBook','儿童预定失败，'+oData2.Info)
                        }else{
                            myalertp('myBook','儿童预定失败，请重试或者选择其他航班！')
                        }
                        ////alert('儿童预定失败，请重试或者选择其他航班！')
                        //myalertp('myBook','儿童预定失败，请重试或者选择其他航班！')
                    }else{

                        if(oData2.Info){
                            myalertp('myBook','返程预定失败，'+oData2.Info)
                        }else{
                            myalertp('myBook','返程预定失败，请重试或者选择其他航班！')
                        }
                        //myalertp('myBook','返程预定失败，请重试或者选择其他航班！')
                    }
                    // 这要取消订单 取消前一次订单

                    localStorage.getItem('oddOrderID','');
                    console.log(oData2)
                }

            }else{
                //alert('出错了，数据请求失败！');
                myalertp('myBook','出错了，预定数据请求失败！')

            }
        }
    }

}

//// 取消 订单  用于 儿童成人订单  成人预定成功
//function canseleajax(theid){
//    $.qu('.lodin-ab').style.display ='-webkit-box';
//    $.id('loadorder-type').innerHTML ='订单取消中...';
//    var oData2 = '';
//    var xhr = '';
//    if(window.XMLHttpRequest){
//        xhr = new XMLHttpRequest();
//    }else{
//        xhr =new ActiveXObject(' Microsoft.XMLHTTP')
//    }
//    // xhr.open('get','http://106.75.131.58:8015/icbc/xhService.ashx?act=GETUSEDORDERS&ST='+date1+'&ET='+date2,'false');
//    // //xhr.open('get',flightUrl+'/icbc/xhService.ashx?act=GETDSONEPRICE','false');
//    // xhr.send();
//
//    xhr.open('post',flightUrl+'/icbc/OrderResult.aspx','false');
//    xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
//    xhr.send('action=1&OrderID='+theid);
//    xhr.onreadystatechange = function(){
//        if( xhr.readyState == 4){
//            // ajax 响内容解析完成，可以在客户端调用了
//            if(xhr.status == 200){
//                //$.qu('.lodin-ab').style.display ='none';
//                //  判断服务器返回的状态 200 表示 正常
//                var  data1 = eval('('+xhr.responseText+')');
//                console.log(data1)
//                if(data1.Status ==1){//  取消订单成功
//                    // 重新页面加载数据
//
//                }else{
//                    alert('取消订单失败，请重试或者登陆！')
//                }
//            }else{
//                alert('出错了，Err' +xhr.status);
//            }
//        }
//    }
//}

//  带数据 进入 订单页面
function bookToorder(bookdata1,bnumber1,bnumber2){
    var bnumber = '';
    if(bnumber2){
        bnumber= [bnumber1,bnumber2]
    }else{
        bnumber= [bnumber1]
    }

   // console.log(bookdata1);
    // 总价 及订单号 儿童票价
    var ypc = 0;
    if( ynum != 0 ){
        ypc = $.qu('.mttbookpricey').innerHTML;
    }else{
        ypc = 0
    }
    var booktoorder={
        allprice: $.qu('.allprice11').innerHTML,
        OrderID:bnumber,
        yprice:ypc


    };
    // 成人 儿童 人数
    //var  ynum =0;  //  儿童个数
    //var  onum =0;  // 成人个数
    //var  odnum =0;  // 老年个数
    var  peoplenum ={
        ynum:ynum,
        onum:onum+odnum,
        safeprice: $.qu('.mttbookprice2').innerHTML,
        hongbaoprice:0

    };
    //  乘机人信息
    var allbootps =$.qus('.myBook-namel');
    if(allbootps.length ==0){
        //alert('请选择乘机人！')
        myalertp('myBook','请选择乘机人！')
    }else{
        var psdatas =[];
        for(var i=0;i<allbootps.length;i++){
            var allname =JSON.parse( allbootps[i].getAttribute("data"));
            var  age =allname.Age;
            var name = allname.Name;
            var safenum = '';
            if(onOFF && $.qu('.buysafe').style.display == 'block'){
                if(backFlight){
                    safenum = '2份'
                }else{
                    safenum = '1份'
                }

            }else{
                if(onOFFt && $.qu('.buysafet').style.display == 'block'){
                    if(backFlight){
                        safenum = '2份'
                    }else{
                        safenum = '1份'
                    }
                }else{
                    safenum = '无';
                }
            }
            //if(zyTablechange ==1){
            //    safenum = '无';
            //}
            var psdata={
                age:age,
                name:name,
                card:allname.IDType,
                cardnum:allname.IDNo,
                phonenum:allname.Phone,
                safenum: safenum
            };
            psdatas.push(psdata)
        }
        //console.log(psdatas)

    }
    //改退签说明  往返的时候 有2种
    var safedata =[];
    var safedata0 = $.qu('.looktext1-text').innerHTML;

    if(backFlight){ // 是否 是往返航班
        var safedata1 = $.qu('.looktext11-text').innerHTML;
        safedata=[safedata0,safedata1]
    }else{
        safedata =safedata0;
    }

    // 联系人信息
    var contactdata ={
        name: $.qu('.linkman2').innerHTML,
        phonenum:$.qu('.linkman4').innerHTML

    };
    var  onOFFsf= true;
    if($.qu('.buysafe').style.display == 'block'){
         if(onOFF){
             onOFFsf= true;
         }else{
             if( onOFFt && $.qu('.buysafet').style.display == 'block'){
                 onOFFsf= true;
             }else{
                 onOFFsf= false;
             }
         }

    }else{
        onOFFsf= false;
    }



    if( thebtnnum == 0  &&  $.qu('.goReason').style.display =='block') {// 都为因公
        console.log('进入改变直营电话显示问题');

        zyTablechange =1;
        isxh = 2;
    }else{

    }

    var isxh =0; //  0为初始值 非白名单无授信 或者 白名单因私  跳转工商  1为 白名单 因公
    if($.qu('.goReason').style.display =='block'){ // 说明全为白名单用户
        var thebtnnum =$.qu('.ygLeft-box').getAttribute('choicetype');
        if(thebtnnum ==1){// 白名单 因公
            isxh = 1;
        }else{
            zyTablechange =1;
            isxh = 0;
        }
    }


    //console.log(zyTablechange);
    $.router.go('#!/flightmb/Order',{pbtype:10,booktoorder:booktoorder,linkdata:bookdata1,peoplenum:peoplenum,safedata:safedata,passengerdata:psdatas,contactdata:contactdata,ShipAddr:ShipAddr,backFlight:backFlight,havesafe:onOFFsf,zytype:zyTablechange,isxh:isxh},true)

}

// 联系人信息 数据打包函数
function contactdata(){
    var cname =  $.qu('.linkman2').innerHTML;
    var cphone = $.qu('.linkman4').innerHTML;
    var contactid = $.qu('.linkman-box').getAttribute('cid');

    return {name:cname,phone:cphone,contactid:contactid}
}

//  passenger 乘客信息 格式处理
function passengerhtml(data){
    var name =data.name;
    var age =data.age;
    var card =data.card;
    var num =data.num;
    var phone =data.phone;
    //var ptype = onOFF==true?1:0 //  是否够买保险？ 1 为买 0为不买？？
    //var safenum = '';
    //if(onOFF){
    //    safenum = '1份'
    //}else{
    //    if(onOFFt && $.qu('.buysafe-btnboxt').style.display == 'block'){
    //        safenum = '1份'
    //    }else{
    //        safenum = '无';
    //    }
    //}
    //if(zyTablechange ==1){
    //    safenum = '无';
    //}
    var ptype = 1;// 乘客有无保险

    if(onOFF && $.qu('.buysafe').style.display == 'block'){
        ptype = 1;
    }else{
        if(onOFFt && $.qu('.buysafet').style.display == 'block'){
            ptype = 1;
        }else{
            ptype = 0;
        }
    }

    var price =data.price; //  价格 成人  儿童
    var addfee = age=='成人'?50:0;
    return '[0,0,"'+name+'","'+age+'","'+card+'","'+num+'","",'+ptype+','+price+','+addfee+',0,"'+phone+'","","",0,0,0,0,0,0,0,"",0]';
}

// 乘客信息 筛选函数 打包函数 单程 或者 去程
function passengerAlldataone(theprice){

    // 乘客信息 分 成人 儿童
    var allpassenger = $.qus('.myBook-namel');
    var  allpassengerData =[];
    var  allpassengerDatay =[];
    var  allpassengerDataPull =[];// 成人打包好数据 形成一个新数组
    var  allpassengerDataPully =[];// 儿童打包好数据 形成一个新数组
    for(var i=0;i<allpassenger.length;i++){
        //var nameall= allpassenger[i].getAttribute('data').;//('肖浩(成人)')
        var thedataobj = JSON.parse(allpassenger[i].getAttribute('data'));
        var theage1 =thedataobj.Age;
        var age = theage1=='老人'?'成人':theage1 ;//  成人  儿童 将老人 换成成人
        var name =thedataobj.Name; // 肖浩
        var card =thedataobj.IDType; // 身份证
        var num =thedataobj.IDNo; //500233.....
        var phonenum =thedataobj.Phone;
        //if( zyCP == 'ZH' && zyTable ==1 && isY != -1 ){ // 深航直营
        //    var priceps = age=='儿童'?(Number(theprice)/20).toFixed(0)*10:theprice; // 儿童价格为当前全价的一半
        //}else{
        //    var priceps = age=='儿童'?Fprice:theprice; // 儿童价格为 Y仓位 的一半
        //}
        //if(  isY != -1 ){ // Y仓位以上的 都为 当前仓位的基础仓位的一半
        //    var priceps = age=='儿童'?Fpricey:theprice; // 儿童价格为当前全价的基础仓位的一半 四舍五入
        //}else{
        //    var priceps = age=='儿童'?Fprice:theprice; // Y仓位及以下   儿童价格为 Y仓位 的一半
        //}

        var priceps = age=='儿童'?Fprice:theprice; // Y仓位及以下   儿童价格为 Y仓位 的一半/儿童价格为当前全价的基础仓位的一半 四舍五入
        //console.log(age);
        //console.log(priceps);
        if(age !='儿童' ){
            var passengerData={
                'name':name,
                'age':age,
                'card':card,
                'num':num,
                'phone':phonenum,
                'price':priceps
            };
            allpassengerData.push(passengerData);
            //console.log(allpassengerData);
            //alert('进入成人')
        }else{// 儿童
            //if(phonenum == ''){
            //
            //}
            if(phonenum == ''){
                phonenum= thenophonechild
            }
            var passengerData={
                'name':name,
                'age':age,
                'card':card,
                'num':num,
                'phone':phonenum,
                'price':priceps
            };
            allpassengerDatay.push(passengerData)
        }


    }
    //console.log(allpassengerData)
   //console.log(allpassengerDatay)
    for(var i=0; i<allpassengerData.length;i++){
        allpassengerDataPull.push("'"+ passengerhtml(allpassengerData[i])+"'")
    }
    for(var i=0; i<allpassengerDatay.length;i++){
        allpassengerDataPully.push("'"+ passengerhtml(allpassengerDatay[i])+"'")
    }

    return [allpassengerDataPull,allpassengerDataPully]
}



// 相关点击事件
function allmyClickbook(){

     //保险份
     var safenum =$.qus('.myBook-namel').length;

     if(backFlight){
         $.qu('.buysafe-nums').innerHTML = safenum*2;
         $.qu('.buysafe-numst').innerHTML = safenum*2;
     }else{
         $.qu('.buysafe-nums').innerHTML = safenum;
         $.qu('.buysafe-numst').innerHTML = safenum;
     }
    //查看退改签 单程 或者 去程
    $.qu('.looktext-sp1').onclick =function () {
        if(onOFFs){
            $.qu('.looktext1-text').style.display = 'none';
            $.qu('.looktext-im1').src= 'https://cos.uair.cn/mb/img/botom.png';
            onOFFs =false;
        }else{

            $.qu('.looktext1-text').style.display = 'block';
            $.qu('.looktext-im1').src= 'https://cos.uair.cn/mb/img/top.png';

            onOFFs =true;
        }
        //alloneMone();

    };



//查看退改签 返程
    $.qu('.looktext1-sp1').onclick =function () {
        if(onOFFs1){
            $.qu('.looktext11-text').style.display = 'none';
            $.qu('.looktext1-im1').src= 'https://cos.uair.cn/mb/img/botom.png';
            onOFFs1 =false;
        }else{

            $.qu('.looktext11-text').style.display = 'block';
            $.qu('.looktext1-im1').src= 'https://cos.uair.cn/mb/img/top.png';

            onOFFs1 =true;
        }
        //alloneMone();

    };




    // 开启保险弹层 成人 或者 去程
     $.qu('.safetexth').onclick = function(){
         $.qu('.thesafebox').style.display ='-webkit-box';
     };
     // 开启保险弹层 儿童
     $.qu('.safetexthy').onclick = function(){
        $.qu('.thesafebox').style.display ='-webkit-box';
     };
     // 开启保险弹层  返程
     $.qu('.safetexth1').onclick = function(){
        $.qu('.thesafebox1').style.display ='-webkit-box';
     };

    //  保险按钮 30的
     $.qu('.buysafe-btnbox').onclick = function(){
          //ddataar[3] 权限 是否统一 1为统一 0 为不统一
          //ddataar[4] 具体权限代码
          if( ddataar[8]==0 && !eisall){ //权限统一 且都为10
             // 不能点击 点击不做事情
          }else{

              if(onOFF){// 关闭保险
                  // $.qu('.buysafe-btnbox1').style.left ='0.1rem';
                  $.addClass($.qu('.buysafe-btnbox1'),'buysafe-btnbox1left');
                  //this.style.backgroundColor ='#ccc';
                  $.addClass(this,'buysafe-btnboxbcf');

                  onOFF =false;
              }else{// 选择保险
                  if(zyCP == 'ZH' && zyTable ==1){//  直营 且 为深圳直营
                      //getsafeText(insureType);// 去程 或者单程 加载保险数据
                      //if(backFlight){// 有返程
                      //    getsafeText1(insureType); //返程 加载保险数据
                      //}
                      if($.qu('.buysafet').style.display == 'block'){
                          if(onOFFt){
                              //$.qu('.buysafe-btnbox1t').style.left ='0.1rem';
                              $.removeClass($.qu('.buysafe-btnbox1t'),'buysafe-btnbox1tright');
                              //$.qu('.buysafe-btnboxt').style.backgroundColor ='#ccc';
                              $.removeClass($.qu('.buysafe-btnboxt'),'buysafe-btnboxtbcfb');
                              onOFFt =false;
                          }
                      }
                  }


                  //$.qu('.buysafe-btnbox1').style.left ='1.2rem';
                  $.removeClass($.qu('.buysafe-btnbox1'),'buysafe-btnbox1left');
                  //this.style.backgroundColor ='#f4734b';
                  $.removeClass(this,'buysafe-btnboxbcf');
                  onOFF =true;
              }
              alloneMone();
          }

         //checkChailvPassenger(); 只有开关的话 就不用判断差旅
     };
    ////  保险按钮 20的
    $.qu('.buysafe-btnboxt').onclick = function(){
        if(onOFFt){// 放弃20的保险
            //$.qu('.buysafe-btnbox1t').style.left ='0.1rem';
            $.removeClass($.qu('.buysafe-btnbox1t'),'buysafe-btnbox1tright');
            //this.style.backgroundColor ='#ccc';
            $.removeClass(this,'buysafe-btnboxtbcfb');
            onOFFt =false;
        }else{// 选择 20的保险
            if(zyCP == 'ZH' && zyTable ==1){//  直营 且 为深圳直营
                getsafeText(12);// 去程 或者单程 加载保险数据


                if(backFlight){// 有返程
                    getsafeText1(12); //返程 加载保险数据
                }
            }
            if (onOFF) {
                // $.qu('.buysafe-btnbox1').style.left ='0.1rem';
                $.addClass($.qu('.buysafe-btnbox1'),'buysafe-btnbox1left');
                //$.qu('.buysafe-btnbox').style.backgroundColor ='#ccc';
                $.addClass($.qu('.buysafe-btnbox'),'buysafe-btnboxbcf');

                onOFF =false;
            }
            //$.qu('.buysafe-btnbox1t').style.left ='1.2rem';
            $.addClass($.qu('.buysafe-btnbox1t'),'buysafe-btnbox1tright');
            //this.style.backgroundColor ='#f4734b';
            $.addClass(this,'buysafe-btnboxtbcfb');

            onOFFt =true;
        }
        alloneMone();//累计总价
    };

     // 凭证按钮
     $.qu('.proof-btnbox').onclick = function(){
          if(onOFFp){
              //$.qu('.proof-btnbox1').style.left ='1.2rem';
              //this.style.backgroundColor ='#f4734b';
              // $.qu('.proof-box').style.display ='block';
              //onOFFp =false;
              //alert(1)
              // 跳转 联系地址
              $.router.go('#!/flightmb/contactpeople',{btype:40},true)

          }else{
             $.qu('.proof-btnbox1').style.left ='0.1rem';
              this.style.backgroundColor ='#ccc';
             $.qu('.proof-box').style.display ='none';
             onOFFp =true;
          }

         alloneMone();
     };
     // 差旅开关按钮 onOFFr
     $.qu('.Tripb-btnbox').onclick = function(){
         if(onOFFr){
             //$.qu('.Tripb-btnbox1').style.left ='1.2rem';
             //this.style.backgroundColor ='#f4734b';
             //$.qu('.Tripb-box').style.display ='block';
             //onOFFr =false;
             //alert(1)
             // 跳转 联系地址
             $.router.go('#!/flightmb/Trip',{btype:50},true)

         }else{
             $.qu('.Tripb-btnbox1').style.left ='0.1rem';
             this.style.backgroundColor ='#ccc';
             $.qu('.Tripb-box').style.display ='none';
             onOFFr =true;
         }
        // $.router.go('#!/flightmb/Trip',{btype:50},true)


     };

     //删除乘机人
     $.each($.qus('.bookdelete'),function(){
          this.onclick = function (){
              this.parentNode.parentNode.removeChild(this.parentNode);
              var safenum =$.qus('.myBook-namel').length;

              if(backFlight){
                  $.qu('.buysafe-nums').innerHTML = safenum*2;
                  $.qu('.buysafe-numst').innerHTML = safenum*2;
              }else{
                  $.qu('.buysafe-nums').innerHTML = safenum;
                  $.qu('.buysafe-numst').innerHTML = safenum;
              }
              checkChailvPassenger();
              //mycheckuser('myBook',function (){
              //    console.log('删除乘机人登录时验证通过了。')
              //    SetCookie('xhtime',1,6);//  设置定时器 cookie 6分钟 值为1
              //    checkChailvPassenger();
              //})

              //alloneMone();//计价

          }
     });
    // 添加乘机人 路由
    $.qu('.namepick2').onclick = function(){
         $.router.go('#!/flightmb/passenger',{btype:1,backFlight:backFlight},true)
    };
    // 添加联系人
    $.qu('.linkmanpick2').onclick = function(){
         $.router.go('#!/flightmb/mychalinkp',{btype:2},true)
    }


    // 选择平邮 或者 快递
    $.qu('.y_exp').onclick =function() {
        //$.firstChild(this)

        this.setAttribute("extype","1");
        $.qu('.y_exp-btn').style.boxShadow=' 0 0 0 0.2rem #cc0000';


        $.qu('.n_exp').setAttribute("extype","0");
        $.qu('.n_exp-btn').style.boxShadow=' 0 0 0 0.2rem #cccccc';
        alloneMone();

    };
    $.qu('.n_exp').onclick = function() {
        //$.firstChild(this)

        myalertp('myBook',`免费平邮，行程单属于发票，遗失不补，约10个工作日寄到`);


        this.setAttribute("extype","1");
        $.qu('.n_exp-btn').style.boxShadow=' 0 0 0 0.2rem  #cc0000';

        $.qu('.y_exp').setAttribute("extype","0");
        $.qu('.y_exp-btn').style.boxShadow=' 0 0 0 0.2rem  #cccccc';
        alloneMone();
    };


}

//增加乘机人  |5.4新接口变动
function addPass(data1){
    var data = data1.data;
    var datatojson = JSON.stringify(data);
    var pid =data1.psid;
    var theroule =data.rule;
    var deptId =data.DeptId;
    var str ='<li class="myBook-namel" psid ="'+pid+'"   theroule ="'+theroule+'" deptId="'+deptId+'"  data='+datatojson+'  ><div class="bookdelete"><div class="bookdelete1"></div></div><p class="myBook-namelp1"><span class="namelp1sp1">'+data.Name+'('+data.Age+')'+'</span></p><p class="myBook-namelp1"><span class="namelp1sp3">'+data.IDType+'</span><span class="namelp1sp4">'+data.IDNo+'</span></p></li>';

    //var alp = $.qus('.namelp1sp4');
    var alppeple = $.qus('.myBook-namel');

    for(var i=0;i<alppeple.length;i++){
        var thepid = alppeple[i].getAttribute('psid');
         if(pid== thepid){
             $.qu('.myBook-nameul').removeChild(alppeple[i]);
             break;

         }
    }

    $.qu('.myBook-nameul').innerHTML+=str;

    //ertong(); // 将儿童的身份证 换为 出生日期 目前不用
    var aPs =$.qus('.myBook-namel');

    var safenum= aPs.length;// 根据人数 显示保险数量

    if(backFlight){
        $.qu('.buysafe-nums').innerHTML = safenum*2;
        $.qu('.buysafe-numst').innerHTML = safenum*2;
    }else{
        $.qu('.buysafe-nums').innerHTML = safenum;
        $.qu('.buysafe-numst').innerHTML = safenum;
    }
    //checkChailvPassenger();

}

//增加/更换联系人
function addLinkpe(data){
    $.qu('.linkman-box').setAttribute('cid',data.id);
    var num = $.qu('.linkman4').innerHTML;
    $.qu('.linkman4').innerHTML=data.linknump;
    $.qu('.linkman2').innerHTML =data.linkname;

}

// 累计总价函数  删除 或者添加联系人 儿童显示 及
function alloneMone(){

        var thebtnnum =$.qu('.ygLeft-box').getAttribute('choicetype');

        if(zyTablechange ==1 ){ //直营非差旅 真直营
            $.qu('.proof').style.display = 'none';
            $.qu('.proof-box').style.display ='none';
            ShipFeeOnoff =0
        }else{
            //$.qu('.proof').style.display = 'block';
            if(!onOFFp && $.qu('.proof').style.display == 'block'){

                let isexp = $.qu('.y_exp').getAttribute('extype');
                ShipFeeOnoff = isexp == 1 ? shipMoney : 0;

            }else{
                ShipFeeOnoff =0
            }
        }



       var aPs =$.qus('.myBook-namel');
       var oarr =[];
       var yarr =[];
       var odarr =[];
       for(var j=0;j<aPs.length;j++){
            var theage2 =JSON.parse(aPs[j].getAttribute('data')).Age;
           //console.log(theage2);
            if(theage2 =='儿童'){ //有老人或者儿童
                //ynum++; 儿童
                yarr.push(1)
            }else if( theage2 =='老人'){
                //odnum++ 老人
                odarr.push(3)
            } else{
                //onum++ 成人
                oarr.push(2)
            }
      }

     onum =oarr.length;// 成人
     odnum =odarr.length;// 老人个数
     ynum =yarr.length;// 儿童个数
      if(ynum ==0){
          var yc =$.qus('.ishidden');
          for(var i=0;i<yc.length;i++){
              yc[i].style.display = 'none';
          }
      }else{
          var yc =$.qus('.ishidden');
          for(var i=0;i<yc.length;i++){
              yc[i].style.display = 'block';
          }
      }


      //onOFF =true; // 保险开关按钮
      // onOFFt =false;// 保险开关按钮
    // 根据 直营  和非直营 显示 保险按钮
      if(zyTable == 0){// 非直营
          $.qu('.zycp').style.display = 'none';//取消直营航班显示
          $.qu('.zycp1').style.display = 'none';//取消直营航班显示
          $.qu('.zycp1').style.background = '#fff';
          $.qu('.zycp').style.background = '#fff';
          //if( !mIsNormalPassenger && mPassengerIsValidated){ // 非直营 且都是 差旅乘客
          //    if(thebtnnum == 1 && $.qu('.goReason').style.display =='block'){
          //        $.qu('.Tripb').style.display = 'block';
          //    }else{
          //        $.qu('.Tripb').style.display = 'none';
          //    }
          //    //$.qu('.Tripb').style.display = 'block';
          //    $.qu('.goReason').style.display = 'block';//隐藏 因公因私
          //}else{
          //    $.qu('.Tripb').style.display = 'none';
          //    $.qu('.goReason').style.display = 'none';//隐藏 因公因私
          //}


          if(ynum != 0 || odnum !=0){ //非直营  有儿童或者老人 保险 都要是20
              if(ynum != 0){ // 有儿童
                  $.qu('.myBook-mttdatay').style.display ='block';
                  $.qu('.mttbookpricey').innerHTML =Fprice;

              }else{ // 没有儿童 是是老人
                  $.qu('.myBook-mttdatay').style.display ='none';
                  if(backFlight){ // 往返的时候  显示保险 返程
                      $.qu('.mttdata1-sp3').style.display ='inline-block';
                  }

              }

              $.qu('.buysafe-price').innerHTML = '20';// 保险 按钮的价格
              $.qu('.mttbookprice2').innerHTML = '20';
              $.qu('.mttbookprice2y').innerHTML ='20';

              getsafeText(3); // 更换保险说明 只能选择20的保险
              if(backFlight){ //返程  添加弹层效果 点击事件 修改 问号边上的价格
                  getsafeText1(3);///
              }
          }else{// 没有儿童 或者老人 往返


              $.qu('.myBook-mttdatay').style.display ='none';
              $.qu('.buysafe-price').innerHTML = '30';
              $.qu('.mttbookprice2').innerHTML = '30';
              getsafeText(insureType); //更换保险说明
              if(backFlight){ //返程
                  getsafeText1(insureType1); //更换保险说明 11
                  $.qu('.mttdata1-sp3').style.display ='inline-block';
              }

          }
      }else{// 直营 zyTable == 1
          if(zyTablechange ==0){ // 直营下的  匹配成功 全是差旅 zh 深圳直营 不可能出现  目前就只是南方直营

              if(thebtnnum == 1 && $.qu('.goReason').style.display =='block'){
                  $.qu('.Tripb').style.display = 'block';
              }else{
                  $.qu('.Tripb').style.display = 'none';
                  $.qu('.Tripb-box').style.display ='none';

              }

              $.qu('.buysafe').style.display  = 'block';// 显示保险 buysafe
              $.qu('.zycp').style.display = 'none';//隐藏直营航班显示
              $.qu('.zycp1').style.display = 'none';//隐藏直营航班显示
              $.qu('.zycp1').style.background = '#fff';
              $.qu('.zycp').style.background = '#fff';



          }else{//zyTablechange ==1  直营非差旅 真直营


              $.qu('.zycp').style.display = 'inline-block';//显示直营航班显示
              $.qu('.zycp1').style.display = 'inline-block';//显示直营航班显示
              $.qu('.zycp1').style.background = '#eee';
              $.qu('.zycp').style.background = '#eee';
              if(ynum != 0){//有儿童的时候  单程 直营  就没有往返航班 直营 非差旅
                  $.qu('.myBook-mttdatay').style.display ='block';//显示儿童票价信息

                  //if(zyCP == 'ZH' && isY != -1){ // 深航直营儿童价格 为成人票的一半
                  //    var yprice0 =(Number($.qu('.mttbookprice').innerHTML)/20).toFixed(0)*10;
                  //    $.qu('.mttbookpricey').innerHTML =yprice0;
                  //
                  //}else{
                  //    $.qu('.mttbookpricey').innerHTML =Fprice;
                  //}

                  $.qu('.mttbookpricey').innerHTML =Fprice;
                  $.qu('.mttdata-sp3y').style.display = 'inline-block';// 显示儿童价的 保险弹层

                  if(zyCP == 'ZH'){//深圳直营 单程 有儿童  有保险
                      $.qu('.mttdata-sp1e3').innerHTML ='成人票';
                      $.qu('.mttdata-sp1e3y').innerHTML ='儿童票';
                      $.qu('.mttdata-sp3').style.display = 'inline-block'; //显示成年保险说明
                      $.qu('.mttdata-sp3y').style.display = 'inline-block'; //显示儿童保险说明
                      $.qu('.buysafe').style.display = 'block'; //显示保险选择按钮
                      $.qu('.buysafet').style.display = 'block'; //显示保险选择按钮
                  }else{ // 非深圳 有儿童 直营  也不是差旅 就没有保险
                      $.qu('.mttdata-sp3').style.display = 'none'; //隐藏成年保险说明
                      $.qu('.mttdata-sp3y').style.display = 'none'; //隐藏儿童保险说明
                      $.qu('.buysafe').style.display = 'none'; //隐藏保险选择按钮
                      $.qu('.buysafet').style.display = 'none'; //隐藏保险选择按钮
                      $.qu('.mttdata-sp1e3').innerHTML ='成人票(无保险)';
                      $.qu('.mttdata-sp1e3y').innerHTML ='儿童票(无保险)';
                  }


              }else {// 直营  没有差旅  没有儿童
                  $.qu('.myBook-mttdatay').style.display = 'none';//隐藏 儿童 票信息

                  //if(backFlight){ // 往返
                  //
                  //}else{ //直营 没有差旅  没有儿童 单程
                  //
                  //}

                  if(zyCP == 'ZH'){//深圳直营  有保险
                      $.qu('.mttdata-sp1e3').innerHTML ='成人票';
                      $.qu('.mttdata-sp3').style.display = 'inline-block'; //显示成年保险说明
                      $.qu('.buysafe').style.display = 'block'; //显示保险选择按钮
                      $.qu('.buysafet').style.display = 'block'; //显示保险选择按钮


                  }else{
                      $.qu('.mttdata-sp3').style.display = 'none'; //隐藏成年保险说明

                      $.qu('.buysafe').style.display = 'none'; //隐藏保险选择按钮
                      $.qu('.buysafet').style.display = 'none'; //隐藏保险选择按钮

                      $.qu('.mttdata-sp1e3').innerHTML ='成人票(无保险)';
                  }
                  //
                  //$.qu('.mttdata-sp1e3').innerHTML = '成人票';// 更换票类型 成人
                  //$.qu('.zycp').style.display = 'none';//取消直营航班显示
                  //$.qu('.mttdata-sp3').style.display = 'inline-block';//显示保险 成人说明
                  ////$.qu('.mttdata-sp3y').style.display = 'inline-block'; //显示 儿童保险说明
                  //$.qu('.buysafe-price').innerHTML = '30';
                  //$.qu('.mttbookprice2').innerHTML = '30';
                  //$.qu('.mttbookprice2y').innerHTML = '30';//填写保险价格
                  //getsafeText(insureType) //更换保险说明



              }
          }



      }



      var  tickeprice1 = parseInt($.qu('.mttbookprice').innerHTML); // 票面价 mttbookprice

      var  oilprice1 = 50; // 基建燃油
      var  safe1 = parseInt($.qu('.mttbookprice2').innerHTML);  // 保险

    //    成人+老人    儿童   快递费用
    var honbaoone = 0;//红包计价
    if(!backFlight){//单程
        //$.qu('.buysafe-price').innerHTML = '30'; // 保险开关显示的 保险值buysafe-pricet
        if( onOFF && $.qu('.buysafe').style.display == 'block'){
            if(ynum != 0){ // 有儿童

                if(zyCP == 'ZH' && zyTable == 1){
                    safe1 = 30;
                    $.qu('.mttbookprice2y').innerHTML = '30';
                    $.qu('.mttbookprice2').innerHTML = '30';
                }else{
                    safe1 = 20;
                    $.qu('.mttbookprice2y').innerHTML = '20';
                    $.qu('.mttbookprice2').innerHTML = '20';
                }

            }else{//没有儿童
                safe1 = 30;
                $.qu('.mttbookprice2y').innerHTML = '30';
                $.qu('.mttbookprice2').innerHTML = '30';
            }


        }else{
            safe1=0;
            if(onOFFt  && $.qu('.buysafet').style.display == 'block' ){
                safe1 =20;
                $.qu('.mttbookprice2y').innerHTML = '20';
                $.qu('.mttbookprice2').innerHTML = '20';
            }

        }


        if(safe1 == 0){// 按钮行 显示 份数 无保险
            $.qu('.buysafe-nums').innerHTML = 0;
            $.qu('.buysafe-numst').innerHTML = 0;
            // 修改 保险显示 和 成年无保险 儿童无保险
            $.qu('.mttdata-sp3').style.display = 'none'; //隐藏成年保险说明
            $.qu('.mttdata-sp3y').style.display = 'none'; //隐藏儿童保险说明
            $.qu('.mttdata-sp1e3').innerHTML ='成人票(无保险)';
            $.qu('.mttdata-sp1e3y').innerHTML ='儿童票(无保险)';
        }else{ // 有保险
            var safenum =$.qus('.myBook-namel').length;

            if(backFlight){
                $.qu('.buysafe-nums').innerHTML = safenum*2;
                $.qu('.buysafe-numst').innerHTML = safenum*2;
            }else{
                $.qu('.buysafe-nums').innerHTML = safenum;
                $.qu('.buysafe-numst').innerHTML = safenum;
            }

            if(ynum != 0){// 有儿童
                $.qu('.myBook-mttdatay').style.display = 'block';
                $.qu('.mttdata-sp3').style.display = 'inline-block'; //显示成年保险说明
                $.qu('.mttdata-sp3y').style.display = 'inline-block'; //显示儿童保险说明
                //$.qu('.buysafe').style.display = 'none'; //隐藏保险选择按钮
                //$.qu('.buysafet').style.display = 'none'; //隐藏保险选择按钮
                $.qu('.mttdata-sp1e3').innerHTML ='成人票';
                $.qu('.mttdata-sp1e3y').innerHTML ='儿童票';
                $.qu('.mttbookprice2').innerHTML = safe1;
                $.qu('.mttbookprice2y').innerHTML = safe1;


            }else{//没有儿童
                $.qu('.myBook-mttdatay').style.display = 'none';
                $.qu('.mttdata-sp3').style.display = 'inline-block'; //显示成年保险说明
                $.qu('.mttdata-sp3y').style.display = 'none'; //隐藏儿童保险说明
                $.qu('.mttdata-sp1e3').innerHTML ='成人票'; //
                //$.qu('.mttdata-sp1e3y').innerHTML ='儿童票';
                $.qu('.mttbookprice2').innerHTML = safe1;
                //$.qu('.mttbookprice2y').innerHTML = safe1;


            }
        }

        //
        //if(zyCP == 'ZH' && zyTable == 1 ){// 深航直营
        //
        //    if(isY != -1){
        //        var zhpirce = (Number(tickeprice1)/20).toFixed(0)*10;
        //    }else{
        //        var zhpirce = (Number(tickeprice1)/20).toFixed(0)*10;
        //    }
        //    var allprice =(tickeprice1+oilprice1+safe1)*(onum+odnum) + ynum*(zhpirce+safe1)+ShipFeeOnoff;
        //
        //}else{
        //    var allprice =(tickeprice1+oilprice1+safe1)*(onum+odnum) + ynum*(Fprice+safe1)+ShipFeeOnoff;
        //}

       //console.log('儿童页面展示价格：')
      // console.log($.qu('.mttbookpricey').innerHTML)
        var  yhtml =$.qu('.mttbookpricey').innerHTML;
        var yprice = yhtml?yhtml:0;
        var chlidprice = parseInt(yprice);
        console.log(chlidprice)
        //console.log(typeof chlidprice)


        var allprice =(tickeprice1+oilprice1+safe1)*(onum+odnum) + ynum*(chlidprice+safe1)+ShipFeeOnoff;



        if(hashongbaof =='true'){
            if(ynum>0){// 有儿童
                // 直营都没有红包的 所以 深航 儿童半价的问题不存在
                if(Fprice < themoneycheck){ // 小于 800 儿童没得红包
                    honbaoone =Number(hbjinef) *(onum+odnum);
                }else{
                    honbaoone = Number(hbjinef)*(onum+odnum+ynum); //大于 800 儿童有红包
                }

            }else{//没有儿童
                honbaoone = Number(hbjinef)*(onum+odnum);
            }
        }
    }else{// 往返

        var safe2 = 0;
        if( onOFF && $.qu('.buysafe').style.display == 'block'){
            safe2=60;
            $.qu('.mttbookprice2').innerHTML = 30;
            $.qu('.mttbookprice24').innerHTML = 30;
        }else{
            safe2=0;
            if(onOFFt  && $.qu('.buysafet').style.display == 'block' ){
                safe2 =40;
                $.qu('.mttbookprice2').innerHTML = 20;
                $.qu('.mttbookprice24').innerHTML = 20;
            }
        }



        if(safe2 == 0){// 按钮行 显示 份数 无保险
            $.qu('.buysafe-nums').innerHTML = 0;
            $.qu('.buysafe-numst').innerHTML = 0;
            // 修改 保险显示 和 成年无保险 儿童无保险
            $.qu('.mttdata-sp3').style.display = 'none'; //隐藏成年保险说明
            $.qu('.mttdata1-sp3').style.display = 'none'; //隐藏成年保险说明

            $.qu('.mttdata-sp1e3').innerHTML ='成人票(无保险)';
            $.qu('.mttdata1-sp1e3').innerHTML ='成人票(无保险)';

        }else { // 有保险
            var safenum = $.qus('.myBook-namel').length;
            $.qu('.buysafe-nums').innerHTML = safenum * 2;
            $.qu('.buysafe-numst').innerHTML = safenum * 2;
            $.qu('.mttdata-sp3').style.display = 'inline-block'; //隐藏成年保险说明
            $.qu('.mttdata1-sp3').style.display = 'inline-block'; //隐藏成年保险说明

            $.qu('.mttdata-sp1e3').innerHTML ='成人票';
            $.qu('.mttdata1-sp1e3').innerHTML ='成人票';

        }

        $.qu('.buysafe-price').innerHTML = '30'; // 保险开关显示的 保险值buysafe-pricet
        $.qu('.buysafe-pricet').innerHTML = '20'; // 保险开关显示的 保险值buysafe-pricet

        var  tickeprice2 = parseInt($.qu('.mttbookprice4').innerHTML); // 票面价  返程mttbookprice
        var allprice =(tickeprice1+tickeprice2+oilprice1+oilprice1+safe2)*(onum+odnum)+ShipFeeOnoff;

        var fhonbaoone =0;//去程红包总价
        var thonbaoone =0;//返程红包总价
        if(hashongbaof == 'true'){
            fhonbaoone = Number(hbjinef)*(onum+odnum)
        }else{
            fhonbaoone = 0;
        }
        if(hashongbaot == 'true'){
            thonbaoone = Number(hbjinet)*(onum+odnum)
        }else{
            thonbaoone = 0;
        }
        honbaoone =fhonbaoone + thonbaoone;//合计 往返红包

    }


      var hongbaoprice = honbaoone;// 红包总价
      var allbeforeprice =allprice - hongbaoprice;//减掉红包后的价格
      if(honbaoone ==0){
          $.qu('.hongbaotext').style.display = 'none';
      }else{
          $.qu('.hongbaotext').innerHTML ='(总'+allprice+'-'+'红包'+hongbaoprice+')';// 括号红包数据
          $.qu('.hongbaotext').style.display = 'inline-block';
      }

      //$.qu('.allprice11').innerHTML =allprice;// 总价 添入 页面
      $.qu('.allprice11').innerHTML =allbeforeprice;// 总价 添入 页面
}
// 查询退改规则 单程 或者去程
function myBookChange1(carrier,seat){
        //console.log(carrier+seat)
         var  oData2 = '';
        var xhr = '';
        if(window.XMLHttpRequest){
            xhr = new XMLHttpRequest();
        }else{
            xhr =new ActiveXObject(' Microsoft . XMLHTTP')
        }
         //xhr.open('get','http://106.75.131.58:8015/icbc/ajax.aspx?isKyReq=1&act=getOtherKyData&ACTION=GetRefundDef&carrier='+carrier+'&seat='+seat+'&reqPath=utlsiteservice.aspx','false');
         xhr.open('get',flightUrl+'/icbc/ajax.aspx?isKyReq=1&act=getOtherKyData&ACTION=GetRefundDef&carrier='+carrier+'&seat='+seat+'&reqPath=utlsiteservice.aspx','false');
         xhr.send();
         xhr.onreadystatechange = function(){
               if( xhr.readyState == 4){
                // ajax 响内容解析完成，可以在客户端调用了
                      if(xhr.status == 200){
                           //  判断服务器返回的状态 200 表示 正常
                          //alert(  eval(xhr.responseText))
                          //console.log( eval(xhr.responseText));
                         // console.log('查看退改签！');
                           if(xhr.responseText !=''){
                                 oData2 = eval(xhr.responseText);
                                 $.qu('.looktext1-changetex1').innerHTML =oData2[0].EndorseNotice;
                                 $.qu('.looktext1-changetex2').innerHTML =oData2[0].UpNotice;
                                 $.qu('.looktext1-changetex3').innerHTML =oData2[0].RefundNotice;
                           }else{
                                 $.qu('.looktext1-changetex1').innerHTML ='退改签规则以航空公司最新规则为准';
                                 $.qu('.looktext1-changetex2').innerHTML ='退改签规则以航空公司最新规则为准';
                                 $.qu('.looktext1-changetex3').innerHTML ='退改签规则以航空公司最新规则为准';
                           }
                           // 加载儿童退改签
                           myBookChange1y(carrier,isYca)

                      }else{
                            //alert('出错了，Err' +xhr.status);
                            myalertp('myBook','查询退改签出错了，Err' +xhr.status)
                      }
                }
        }
 }



// 查询退改规则 儿童
function myBookChange1y(carrier,seat){
    //console.log(carrier+seat)
    var  oData2 = '';
    var xhr = '';
    if(window.XMLHttpRequest){
        xhr = new XMLHttpRequest();
    }else{
        xhr =new ActiveXObject(' Microsoft . XMLHTTP')
    }
    //xhr.open('get','http://106.75.131.58:8015/icbc/ajax.aspx?isKyReq=1&act=getOtherKyData&ACTION=GetRefundDef&carrier='+carrier+'&seat='+seat+'&reqPath=utlsiteservice.aspx','false');
    xhr.open('get',flightUrl+'/icbc/ajax.aspx?isKyReq=1&act=getOtherKyData&ACTION=GetRefundDef&carrier='+carrier+'&seat='+seat+'&reqPath=utlsiteservice.aspx','false');
    xhr.send();
    xhr.onreadystatechange = function(){
        if( xhr.readyState == 4){
            // ajax 响内容解析完成，可以在客户端调用了
            if(xhr.status == 200){
                //  判断服务器返回的状态 200 表示 正常
                //alert(  eval(xhr.responseText))
                //console.log( eval(xhr.responseText));
                //console.log('查看退改签！');
                if(xhr.responseText !=''){
                    oData2 = eval(xhr.responseText);
                    $.qu('.looktext1-changetex1y').innerHTML =oData2[0].EndorseNotice;
                    $.qu('.looktext1-changetex2y').innerHTML =oData2[0].UpNotice;
                    $.qu('.looktext1-changetex3y').innerHTML =oData2[0].RefundNotice;
                }else{
                    $.qu('.looktext1-changetex1y').innerHTML ='退改签规则以航空公司最新规则为准';
                    $.qu('.looktext1-changetex2y').innerHTML ='退改签规则以航空公司最新规则为准';
                    $.qu('.looktext1-changetex3y').innerHTML ='退改签规则以航空公司最新规则为准';
                }

            }else{
                //alert('出错了，Err' +xhr.status);
                myalertp('myBook','查询退改签出错了，Err' +xhr.status)
            }
        }
    }
}


// 查询退改规则 返程
function myBookChange2(carrier,seat){
    //console.log(carrier+seat)
    var  oData2 = '';
    var xhr = '';
    if(window.XMLHttpRequest){
        xhr = new XMLHttpRequest();
    }else{
        xhr =new ActiveXObject(' Microsoft . XMLHTTP')
    }
    //xhr.open('get','http://106.75.131.58:8015/icbc/ajax.aspx?isKyReq=1&act=getOtherKyData&ACTION=GetRefundDef&carrier='+carrier+'&seat='+seat+'&reqPath=utlsiteservice.aspx','false');
    xhr.open('get',flightUrl+'/icbc/ajax.aspx?isKyReq=1&act=getOtherKyData&ACTION=GetRefundDef&carrier='+carrier+'&seat='+seat+'&reqPath=utlsiteservice.aspx','false');
    xhr.send();
    xhr.onreadystatechange = function(){
        if( xhr.readyState == 4){
            // ajax 响内容解析完成，可以在客户端调用了
            if(xhr.status == 200){
                //  判断服务器返回的状态 200 表示 正常
                if(xhr.responseText !=''){
                    oData2 = eval(xhr.responseText);
                    $.qu('.looktext11-changetex1').innerHTML =oData2[0].EndorseNotice;
                    $.qu('.looktext11-changetex2').innerHTML =oData2[0].UpNotice;
                    $.qu('.looktext11-changetex3').innerHTML =oData2[0].RefundNotice;
                }else{
                    $.qu('.looktext11-changetex1').innerHTML ='退改签规则以航空公司最新规则为准';
                    $.qu('.looktext11-changetex2').innerHTML ='退改签规则以航空公司最新规则为准';
                    $.qu('.looktext11-changetex3').innerHTML ='退改签规则以航空公司最新规则为准';
                }

            }else{
                //alert('出错了，Err' +xhr.status);
                myalertp('myBook','查询退改签出错了，Err' +xhr.status)
            }
        }
    }
}




// 保险说明函数 及数据加载  单程 或者 去程的时候
function getsafeText(insureType){
    // 获取保险说明接口  只需要传递 保险类型 insureType 其他字段都是固定的
    function myinsuredata(insureType1){
        //console.log(carrier+seat)
        var  oData2 = '';
        var xhr = '';
        if(window.XMLHttpRequest){
            xhr = new XMLHttpRequest();
        }else{
            xhr =new ActiveXObject(' Microsoft . XMLHTTP')
        }
        //xhr.open('get','http://106.75.131.58:8015/icbc/ajax.aspx?isKyReq=1&act=GetInsure&insuretype='+insureType1,'true');
        xhr.open('get',flightUrl+'/icbc/ajax.aspx?isKyReq=1&act=GetInsure&insuretype='+insureType1,'true');
        xhr.send();
        xhr.onreadystatechange = function(){
            if( xhr.readyState == 4){
                // ajax 响内容解析完成，可以在客户端调用了
                if(xhr.status == 200){
                    //  判断服务器返回的状态 200 表示 正常
                    oData2 = eval('(' + xhr.responseText + ')');
                    //console.log(oData2)
                    var ptext =oData2.Info;
                    var safeprice =Number( oData2.Price);
                    $.qu('.mttbookprice2').innerHTML =safeprice;//  改变保险价格

                    var str ='<p class="theword">'+ptext+'</p><a href="javascript:;" class="thesafebox-ok">我已知晓</a>';
                    $.qu('.thesafebox-div').innerHTML =str;
                    $.qu('.thesafebox-ok').onclick = function(){
                        $.qu('.thesafebox').style.display ='none';// 关闭弹层
                    }


                }else{
                    //alert('出错了，Err' +xhr.status);
                    myalertp('myBook','查询保险说明出错了，Err' +xhr.status)
                }
            }
        }
    }
    myinsuredata(insureType)
}

// 保险说明函数 及数据加载  返程
function getsafeText1(insureType){
    // 获取保险说明接口  只需要传递 保险类型 insureType 其他字段都是固定的
    function myinsuredata1(insureType1){
        //console.log(carrier+seat)
        var  oData2 = '';
        var xhr = '';
        if(window.XMLHttpRequest){
            xhr = new XMLHttpRequest();
        }else{
            xhr =new ActiveXObject(' Microsoft . XMLHTTP')
        }
        //xhr.open('get','http://106.75.131.58:8015/icbc/ajax.aspx?isKyReq=1&act=GetInsure&insuretype='+insureType1,'true');
        xhr.open('get',flightUrl+'/icbc/ajax.aspx?isKyReq=1&act=GetInsure&insuretype='+insureType1,'true');
        xhr.send();
        xhr.onreadystatechange = function(){
            if( xhr.readyState == 4){
                // ajax 响内容解析完成，可以在客户端调用了
                if(xhr.status == 200){
                    //  判断服务器返回的状态 200 表示 正常
                    //console.log(xhr.responseText)

                    if(xhr.responseText){
                        oData2 = eval('(' + xhr.responseText + ')');
                       // console.log(oData2)
                        var ptext1 =oData2.Info;
                        var safeprice1 =Number( oData2.Price);
                        $.qu('.mttbookprice24').innerHTML =safeprice1;//  改变保险价格

                        var str ='<p class="theword1">'+ptext1+'</p><a href="javascript:;" class="thesafebox1-ok">我已知晓</a>';
                        $.qu('.thesafebox1-div').innerHTML =str;
                        $.qu('.thesafebox1-ok').onclick = function(){
                            $.qu('.thesafebox1').style.display ='none';// 关闭弹层
                        }
                    }else{
                    }
                }else{
                    //alert('出错了，Err' +xhr.status);
                    myalertp('myBook','查询保险说明出错了，Err' +xhr.status)
                }
            }
        }
    }
    myinsuredata1(insureType)
}


//判断时间是否应该加一天
function isNextDay(date1,date2,dateM) {
    let str1 = removeM(date1) - removeM(date2) >0?GetDateStrH(dateM,"24"):dateM;
    return getLastFive(str1);
}
//日期中去除年份
function getLastFive(date) {
    return date.substring(date.length-5,date.length);
}
//去除"\:"
function removeM(date) {
    return parseInt(date.replace(/\:/g,""));
}
//天数加一
function GetDateStrH(data1,h) {

    var  Y1 = data1.substring(0, 4);
    var  m1 = data1.substring(5, 7)-1;
    var  d1 = data1.substring(8, 10);
    // var  h1 = data1.substring(11, 13);
    // var  M1 = data1.substring(14, 17);
    var  dd = new Date(Y1,m1,d1);
    dd.setHours(dd.getHours() + h);//获取AddDayCount天后的日期
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1;//获取当前月份的日期
    var d = dd.getDate();

    if ((m + "").length == 1) {
        m = "0" + m;
    }
    if ((d + "").length == 1) {
        d = "0" + d;
    }

    return y + "-" + m + "-" + d

}


//兼容获取样式
function getMyStyle(obj, attr)
{
    if(obj.currentStyle)
    {
        return obj.currentStyle[attr];
    }
    else
    {
        return  window.getComputedStyle(obj,false)[attr];
    }
}

//身份证加"*"处理 分两种情况 成人 or 儿童生日加横岗

function hideInfo(e) {
    var d = e.length;
    return d<18?e.replace(/(.{4})(.{2})/, "$1-$2-"):e.replace(/^(.{6})(?:\d+)(.{4})$/,"$1****$2");
}


// 实时检查余票
function getabinCount() {


    var fArr = DecFlights();

    console.log('验票初始数据')
    console.log(fArr.length)
    console.log(fArr)

    gettn(fArr,0)

}

function gettn(fArr,iSeq) {



    var otherParam = {
        "searchType": "1",
        "goDate": fArr[0]["e"]
    };

    if (iSeq == 0 && fArr.length > 1) {
        otherParam["searchType"] = "2";
        otherParam["goFlight"] = "";
        otherParam["backDate"] = fArr[1]["e"];
    }
    if (iSeq == 1) { // 往返
        otherParam["searchType"] = "3";
        otherParam["goFlight"] = fArr[1]["c"] + "_" + fArr[1]["d"];
        otherParam["backDate"] = fArr[1]["e"];
    }
    var jsonData = {
        act: "checkCabinCount",
        org_city: fArr[iSeq]["a"],
        dst_city: fArr[iSeq]["b"],
        org_date: fArr[iSeq]["e"],
        cabinCode: fArr[iSeq]["d"],
        priceType: fArr[iSeq]["ct"],
        cabinCount: fArr[iSeq]["v"],
        flightNo: fArr[iSeq]["c"],
        otherParam: JSON.stringify(otherParam),
        iSeq: iSeq
    };

    var  urldata = 'act=checkCabinCount&org_city='+fArr[iSeq]["a"]+'&dst_city='+fArr[iSeq]["b"]+'&org_date='+fArr[iSeq]["e"]+'&cabinCode='+fArr[iSeq]["d"]+'&priceType='+fArr[iSeq]["ct"]+'&cabinCount='+fArr[iSeq]["v"]+'&flightNo='+fArr[iSeq]["c"]+'&otherParam='+JSON.stringify(otherParam)+'&iSeq='+iSeq;


    var isOK = true;//在舱位不足的情况下面是否需要停止下一步提示,true不停止，false停止



    var  oData2 = '';
    var xhr = '';
    if(window.XMLHttpRequest){
        xhr = new XMLHttpRequest();
    }else{
        xhr =new ActiveXObject(' Microsoft . XMLHTTP')
    }
    //xhr.open('post', 'http://106.75.131.58:8015/icbc/OrderSumit.aspx', 'false');
    xhr.open('post', '/icbc/ajax.aspx', 'false');
    xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=utf-8');
    xhr.send(urldata);
    // console.log(isKyReq"=1&act=ORDERBOOK&url=''&reqPath='icbc/OrderSumit.aspx'&" + urldata)
    xhr.onreadystatechange = function(){
        if( xhr.readyState == 4){
            // ajax 响内容解析完成，可以在客户端调用了
            if(xhr.status == 200){
                //  判断服务器返回的状态 200 表示 正常
                console.log('验票数据返回')
                oData2 = xhr.responseText;
                console.log(oData2);


                if(oData2 == ''){
                    return  false
                }
                if(backFlight && iSeq ==0){
                    if(oData2 == 'B'){
                        myalertp('myBook',"您预订的去程航班机票已售完，请重新查询预订",function(){
                            $.router.go('#!/flightmb/detail',urldataxh,true)
                        })
                    }else{
                        getgofligthn(fArr,oData2);
                    }

                }else if(backFlight && iSeq ==1 ){
                    if(oData2 == 'B'){
                        myalertp('myBook',"您预订的返程航班机票已售完，请重新查询预订",function(){
                            $.router.go('#!/flightmb/detail',urldataxh,true);
                        })
                    }else{
                        if(oData2 == 'A' && formnumber != 'A'){
                            myalertp('myBook',"去程航班舱位仅剩" + formnumber + "个座位,请尽快完成预订。" )
                        }else if(oData2 != 'A' && formnumber != 'A'){
                            myalertp('myBook',"去程航班舱位仅剩" + formnumber + "个座位,回程航班舱位仅剩" + oData2 + "个座位，请尽快完成预订。" )
                        }else if(oData2 != 'A' && formnumber == 'A'){
                            myalertp('myBook',"回程航班舱位仅剩" + oData2 + "个座位，请尽快完成预订。" )
                        }

                       // myalertp('myBook',"去程航班舱位仅剩" + formnumber + "个座位,回程航班舱位仅剩" + oData2 + "个座位，请尽快完成预订。" )
                    }

                }else if(!backFlight){ //单程
                    if (isNaN(oData2)) {// 不是数字
                        if (oData2 == "A") {

                        }else if(oData2 == "B"){
                            myalertp('myBook',"您预订的航班机票已售完，请重新查询预订",function(){
                                $.router.go('#!/flightmb/detail',urldataxh,true)
                            })
                        }
                    }else{ // 为数字

                        myalertp('myBook', '该舱位仅剩' + oData2 + '个座位，请尽快完成预订')
                    }

                }

                ////////////////////////////////////////////////////

            }else{
                //alert('出错了，Err' +xhr.status);
                myalertp('myBook','实时查询余票数量出错了，Err' +xhr.status)
            }
        }

    }

}
// 回调 获取 去程票数量
function getgofligthn(fArr,oData2){
    formnumber = oData2;
    gettn(fArr,1)

}



function getAjaxParam(name,allData) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = allData.match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}





