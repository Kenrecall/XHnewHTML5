//获取ua
String useragent =  action.getRequest().getHeader("User-Agent").toLowerCase();
//判断是融e购客户端，根据ua中的newemallversion来判定。
if(useragent.toLowerCase().indexOf("newemallversion") != -1){
 	  //获取融e购客户端版本号mobVersion，
    if (useragent.indexOf("mobileversion_") > -1) {
		  String[] split = useragent.split("mobileversion_");
		  mobVersion = split[1];
		  String[] split2 = mobVersion.split("_");
		  mobVersion = split2[0];
	  }
    //判断是安卓还是IOS客户端
    if (useragent.indexOf("icbcandroid") > -1) {
					mobSystem = "android";
				}else if(useragent.indexOf("icbciphone") > -1){
					mobSystem = "ios";
		}
		//此处在codedef中新增2个参数，融e购安卓支持新支付客户端版本号emall_android_paynew_version，值为1.2.3.8，融e购IOS支持新支付客户端版本号emall_IOS_paynew_version，值为值为1.2.3.9
    //判断当前融e购客户端版本号是否大于等于配置的融e购客户端版本号。
    if((mobSystem.equals('android')&&mobVersion>=emall_android_paynew_version)||(mobSystem.equals('ios')&&mobVersion>=emall_ios_paynew_version)){
         //此处新增一个融e购是否支持新支付的开关emall_newpay_switch，默认是关。
         if(开){
           //新支付流程，可将此处提取为公共方法
           //新支付地址，codedef里的PayPostUrl170421
           var b2cUrl = $('input[name=b2cUrl]').val();
           //后面的参数都是之前form表单例提交的
			     var interfaceName = $('input[name=interfaceName]').val();
			     var interfaceVersion = $('input[name=interfaceVersion]').val();
			     var tranData = $('input[name=tranData]').val();
			     var merSignMsg = $('input[name=merSignMsg]').val();
			     var merCert = $('input[name=merCert]').val();
			     var clientType = $('input[name=clientType]').val();
			     var eMall = $('input[name=eMall]').val();
			    //将参数组装到req这个变量里
        	var req = {
    			"b2cUrl" : b2cUrl,
    			"interfaceName" : interfaceName,
    			"interfaceVersion" : interfaceVersion,
    			"tranData" : tranData,
    			"merSignMsg" : merSignMsg,
    			"merCert" : merCert,
    			"clientType" : clientType,
    			"eMall" : eMall
			};
		   //这个方法之前有
		   ICBCUtilTools_ForC.callNative('Native', 'newPayParams',req,function(param){});
         }else{
           //旧支付流程
         }
    }
}//判断是融e联客户端，根据ua中的view_from_c或view_from_m来判定
//融e联：Mozilla/5.0(iphone; CPU iPhone OS 10_1_1 like Mac OS X) AppleWebKit/602.2.14 (KHTML,like Gecko)Mobile/14B100 view_from_c ICBCiphoneBSNew 2.2.6.1 fullversion:2.2.6.1
else if（useragent.toLowerCase().indexOf（'view_from_c'）||useragent.toLowerCase().indexOf（'view_from_m'））{
    //获取融e联客户端版本号mobVersion
    if (useragent.indexOf("fullversion:") > -1) {
		  String[] split = useragent.split("fullversion:");
		  //注意，融e联的ios客户端有多个fullversion：，所以要取最后一个，然后在根据空格分隔，取第一个。
		  //安卓的只有一个fullversion：这个方法也能满足。
		  mobVersion = split[split.length];
		  String[] split2 = mobVersion.split(" ");
		  mobVersion = split2[0];
	  }
    //判断是安卓还是IOS客户端
    if (useragent.indexOf("icbcandroid") > -1) {
					mobSystem = "android";
				}else if(useragent.indexOf("icbciphone") > -1){
					mobSystem = "ios";
		}
		//此处在codedef中新增2个参数，融e联安卓支持新支付客户端版本号mims_android_paynew_version，值为2.3.8。融e联IOS支持新支付客户端版本号mims_IOS_paynew_version，值为2.3.8。
    //判断当前融e联客户端版本号是否大于等于配置的融e联客户端版本号。
    if((mobSystem.equals('android')&&mobVersion>=mims_android_paynew_version)||(mobSystem.equals('ios')&&mobVersion>=mims_ios_paynew_version)){
         //此处新增一个融e购是否支持新支付的开关mims_newpay_switch，默认是关
         if(开){
           //新支付流程
           //新支付地址，codedef里的PayPostUrl170421
           var b2cUrl = $('input[name=b2cUrl]').val();
           //后面的参数都是之前form表单例提交的
			     var interfaceName = $('input[name=interfaceName]').val();
			     var interfaceVersion = $('input[name=interfaceVersion]').val();
			     var tranData = $('input[name=tranData]').val();
			     var merSignMsg = $('input[name=merSignMsg]').val();
			     var merCert = $('input[name=merCert]').val();
			     var clientType = $('input[name=clientType]').val();
			     var eMall = $('input[name=eMall]').val();
			    //将参数组装到req这个变量里
        	var req = {
    			"b2cUrl" : b2cUrl,
    			"interfaceName" : interfaceName,
    			"interfaceVersion" : interfaceVersion,
    			"tranData" : tranData,
    			"merSignMsg" : merSignMsg,
    			"merCert" : merCert,
    			"clientType" : clientType,
    			"eMall" : eMall
			};
		   //这个方法之前有
		   ICBCUtilTools_ForC.callNative('Native', 'newPayParams',req,function(param){});
         }else{
           //旧支付流程
         }
    }

}//微信渠道
else if（useragent.toLowerCase().indexOf（“micromessenger”））{
  //确保是旧流程，且trandata中有个backup1字段，最后一位的值是2。（这个是4月版本修改的，请确保现在还有这个逻辑）
}else{
  //旧流程
}
