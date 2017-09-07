<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="FlightMb.aspx.cs" Inherits="UairB2C.HTML5.FlightMb.FlightMb" %>

<!DOCTYPE html>

<html lang="zh-cmn-Hans">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>机票查询</title>
    <meta name="viewport" content="initial-scale=1,maximum-scale=1" />
    <meta name="description" content="" />
    <meta name="author" content="" />
    <%--<link rel="shortcut icon" href="" />--%>
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black" />
    <meta name="format-detection" content="telephone=no" />

    <script type="">
        function addCssByLink(url) {
            var doc = document;
            var link = doc.createElement("link");
            link.setAttribute("rel", "stylesheet");
            link.setAttribute("type", "text/css");
            link.setAttribute("href", url);

            var heads = doc.getElementsByTagName("head");
            if (heads.length)
                heads[0].appendChild(link);
            else
                doc.documentElement.appendChild(link);
        }
        function addScript(script) {
            var script = document.createElement("script");
            script.setAttribute("type", "text/javascript");
            script.setAttribute("src", "JustWalking.js");
            var heads = document.getElementsByTagName("head");
            if (heads.length)
                heads[0].appendChild(script);
            else
                document.documentElement.appendChild(script);
        }
        var txyBaseUrl = "<%=TxyH5ServerUrl %>";
        var v = "<%=ReleaseVersion %>";
        addCssByLink(txyBaseUrl + "css/knife.css?v=" + v);
        addCssByLink(txyBaseUrl + "css/flightmb.css?v=" + v);
    </script>

</head>
<body runat="server">
    <div id="dvContainer" class="page-group"></div>
    <script type="text/javascript" src="/ajaxpro/prototype.ashx"></script>
    <script type="text/javascript" src="/ajaxpro/core.ashx"></script>
    <script type="text/javascript" src="/ajaxpro/converter.ashx"></script>
    <script type="text/javascript" src="/ajaxpro/UairB2C.BusinessTravelTool,UairB2C.ashx"></script>
    <script type="text/javascript" src="/ajaxpro/UairB2C.Dept,UairB2C.ashx"></script>
    <script type="text/javascript" src="/ajaxpro/UairB2C.MGOpt,UairB2C.ashx"></script>
    <script type="text/javascript" src="/ajaxpro/UairB2C.MemberOpt,UairB2C.ashx"></script>
    <script type="text/javascript" src="/ajaxpro/UairB2C.OrderSubmitOpt,UairB2C.ashx"></script>
    <script type="text/javascript" src="/ajaxpro/UairB2C.b2c.RsaTool,UairB2C.ashx"></script>

    <script type="text/javascript" src="/icbc/scripts/icbc.encryption.js"></script>
    <script type="text/javascript" src="/icbc/scripts/rsa_all.js"></script>
    <script type="text/javascript" src="/icbc/scripts/AreaData.js"></script>
    

    <script src="<%=TxyH5ServerUrl %>js/secret.nojq.js?t=<%=ReleaseVersion %>" charset="utf-8"></script>
    <script src="<%=TxyH5ServerUrl %>js/flightmb.js?t=<%=ReleaseVersion %>" charset="utf-8"></script>

</body>
</html>
