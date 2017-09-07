/**
 * Created by way on 16/9/28.
 */

import cfg from '../config';
const $ = require('../lib/kdom');
//import {getView, get, post ,myalertp,mycheckuser,SetCookie,getCookieVal,GetCookie} from '../util/api';// myalertp 封装的 alert提示弹层
//myalertp('chalinkp','出错了，获取客服联系电话失败！')

import {getView, get, post ,myalertp,SetCookie,getCookieVal,GetCookie,userOnoffpp ,setTitle} from '../util/api';// myalertp 封装的 alert提示弹层

let _view = require('raw!./mychalinkp.html');

 var lint ='';


export default class {
      path = '/flightmb/mychalinkp$';
      hash = '/flightmb/mychalinkp';
      title = '联系人';
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
          lint =params.btype;
          //console.log(lint)


          // 页面返回
          $.qu('.chalinkp-tt1').onclick = function(){
                if(lint ==2){
                    $.router.go('#!/flightmb/book',{},false)
                }else if(lint ==3){
                    $.router.go('#!/flightmb/allmytickes',{},true)
                }

          }


           //新增加联系人
           $.qu('.chalinkp-addpger').onclick = function(){
                    // 1 为新加u
                 $.router.go('#!/flightmb/changelinkp',{type:1,linktype:lint},true)
           }
          //mycheckuser('chalinkp',function (){
          //    console.log('常用联系人验证登录通过')
          //    getmyContactdata();//  服务器 拉取数据
          //})

          userOnoffpp('c', getmyContactdata,'chalinkp','.lodincha','','报告小主，您登录超时，请前往登陆页面~~');
          //getmyContactdata();//  服务器 拉取数据
//



      }
}

// 获取常用联系人ajax
function getmyContactdata(){
    $.qu('.lodincha').style.display ='-webkit-box';

    var xhr = '';
    if(window.XMLHttpRequest){
        xhr = new XMLHttpRequest();
    }else{
        xhr =new ActiveXObject(' Microsoft . XMLHTTP')
    }
    //xhr.open('get','http://106.75.131.58:8015/icbc/xhService.ashx?act=GETCONTACTERS','false');
    xhr.open('get',flightUrl+'/icbc/xhService.ashx?act=GETCONTACTERS','false');
    xhr.send();
    xhr.onreadystatechange = function(){
        if( xhr.readyState == 4){
            // ajax 响内容解析完成，可以在客户端调用了
            if(xhr.status == 200){
                $.qu('.lodincha').style.display ='none';
                //  判断服务器返回的状态 200 表示 正常
                //console.log(xhr.responseText);
                var datac =xhr.responseText;
                var  datac1 = eval('('+datac+')');
                if(datac1.Status == 1) { // 1 表示 有数据
                    var pscData = datac1.Result.Contacters;
                    thecontactHtml(pscData);
                    //带数据返回 chalinkp-box
                    addtheLinkpe();// 点击 信息 带信息返回book 界面
                    theClickhtml();// 绑定删除 修改事件


                }else{
                    //没有数据
                    $.qu('.chalinkp-wrap').innerHTML = '';

                }


            }else{
                //alert('出错了，Err' +xhr.status);
                myalertp('chalinkp','获取常用联系人出错了，Err' +xhr.status)
            }
        }
    }
}


// 联系人 html格式整合
function thecontactHtml(data){
      var str ='';
      for(var i=0;i<data.length;i++){
          str +='<div class="chalinkp-box" contactid="'+data[i].ID+'"><p><span class="chalinkp-card">姓名</span></soan><span class="chalinkp-name">'+data[i].Name+'</span></p><p><span class="chalinkp-card">电话</span><span class="chalinkp-num">'+data[i].Phone+'</span></p><p><span class="chalinkp-ph">邮箱</span><span class="chalinkp-phnum">'+data[i].Email+'</span></p><span class="chalinkp-boxbtn1">删除</span><span class="chalinkp-boxbtn2" name ="'+data[i].Name+'" phone ="'+data[i].Phone+'" email ="'+data[i].Email+'" contid="'+data[i].ID+'" >修改</span></div>'
      }
    $.qu('.chalinkp-wrap').innerHTML =str;


}
//增加/更换联系人
function addtheLinkpe(){
    $.each($.qus('.chalinkp-box'),function(){
         this.onclick = function(){

              var odalin ={
                   linkname:$.lastChild($.firstChild(this)).innerHTML,
                   linknump:$.lastChild($.nextNode($.firstChild(this))).innerHTML,
                   id:this.getAttribute('contactid')

              }
              if (lint ==2) {
                  //  返回上一页
                  $.router.go('#!/flightmb/book',{pbtype:2,linkdata:odalin},true)
              }
         }

    })

}

// 删除  及 修改  点击事件绑定
function theClickhtml(){
    // 删除
    $.each( $.qus('.chalinkp-boxbtn1'),function () {
        this.onclick = function (e) {
            var that = this;
            //弹层
            $.qu('.chalinkp-chalinkpt').style.display ='-webkit-box';
            $.qu('.chalinkpt-boxsp1').onclick = function(){
                //that.parentNode.style.display = 'none';
                var  thepeopleid = that.parentNode.getAttribute('contactid')
                // 删除 常用联系人
                var  dataass ={
                    id:thepeopleid
                };
                //if(GetCookie('xhtime') ==1){
                //    console.log('删除联系人登录验证通过，无')
                //    //UairB2C.MGOpt.DelContacter(thepeopleid, function (rs) {
                //    //    if (rs.value) {
                //    //        rs = eval("(" + rs.value + ")");
                //    //        if (rs) {
                //    //            //重新加载 常用联系人数据
                //    //            getmyContactdata();
                //    //
                //    //        } else {
                //    //            //alert("删除联系人失败");
                //    //            myalertp('chalinkp','删除联系人失败')
                //    //        }
                //    //    }
                //    //});
                //
                //    mypost('/ajaxpro/UairB2C.MGOpt,UairB2C.ashx', dataass, 'DelContacter', (err, res) => {
                //        var bdata =eval('(' +res+ ')');
                //        if (bdata.value) {
                //            var rs = eval("(" + bdata.value + ")");
                //            //console.log(rs)
                //            if (rs) {
                //                // 重新加载 常用联系人数据
                //                getmyContactdata();
                //            } else {
                //                //alert("删除联系人失败");
                //                myalertp('chalinkp','删除联系人失败')
                //            }
                //        }else{
                //            myalertp('chalinkp','删除联系人失败')
                //        }
                //    });
                //
                //
                //
                //}else{
                //    mycheckuser('chalinkp',function (){
                //        SetCookie('xhtime',1,6);//  设置定时器 cookie 6分钟 值为1
                //        console.log('删除联系人登录验证通过')
                //
                //        mypost('/ajaxpro/UairB2C.MGOpt,UairB2C.ashx', dataass, 'DelContacter', (err, res) => {
                //            var bdata =eval('('+res+')');
                //            if (bdata.value) {
                //                var rs = eval("(" + bdata.value + ")");
                //                //console.log(rs)
                //                if (rs) {
                //                    // 重新加载 常用联系人数据
                //                    getmyContactdata();
                //                } else {
                //                    //alert("删除联系人失败");
                //                    myalertp('chalinkp','删除联系人失败')
                //                }
                //            }else{
                //                myalertp('chalinkp','删除联系人失败')
                //            }
                //        });
                //    })
                //}



                userOnoffpp('c', function(){

                    mypost('/ajaxpro/UairB2C.MGOpt,UairB2C.ashx', dataass, 'DelContacter', (err, res) => {
                        var bdata =eval('(' +res+ ')');
                        if (bdata.value) {
                            var rs = eval("(" + bdata.value + ")");
                            //console.log(rs)
                            if (rs) {
                                // 重新加载 常用联系人数据
                                getmyContactdata();
                            } else {
                                //alert("删除联系人失败");
                                myalertp('chalinkp','删除联系人失败')
                            }
                        }else{
                            myalertp('chalinkp','删除联系人失败')
                        }
                    });


                },'chalinkp','.lodincha','','抱歉，您登录超时，请前往登陆页面~~');

                $.qu('.chalinkp-chalinkpt').style.display ='none';

            }
            $.qu('.chalinkpt-boxsp2').onclick = function(){
                $.qu('.chalinkp-chalinkpt').style.display ='none';
            }
            var e = e || window.e;
            e.stopPropagation();
        }
    })
    //修改
    $.each( $.qus('.chalinkp-boxbtn2'),function () {
        this.onclick = function (e) {
            var _that =this;
            var contactdata ={
                name : _that.getAttribute('name'),
                phone : _that.getAttribute('phone'),
                email : _that.getAttribute('email'),
                contid: _that.getAttribute('contid'),

            }
            $.router.go('#!/flightmb/changelinkp',{type:4,linktype:lint,cdat:contactdata},true)

            var e = e || window.e;
            e.stopPropagation();
        }

    })

}