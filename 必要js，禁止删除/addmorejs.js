//  02n-6.13

// 1 . ajaxpro 封装方法
function ICBCRsa() {
    //RSA
}
//得到公钥，返回加密的字符串encryption
ICBCRsa.prototype.getPublicKey = function (param, callback) {


      mypost( '/ajaxpro/UairB2C.b2c.RsaTool,UairB2C.ashx',{},'GetRsaEntity', function (err,rsaPub) {
            rsaPub = JSON.parse(rsaPub);
            var n_str = rsaPub.value.Modulus;//公钥
            var e_str = rsaPub.value.Exponent;//输入的字符串
            var n = pidCryptUtil.convertToHex(pidCryptUtil.decodeBase64(n_str));
            var e = pidCryptUtil.convertToHex(pidCryptUtil.decodeBase64(e_str));
            var rsa = new pidCrypt.RSA();
            rsa.setPublic(n, e, 16);
            //加密消息
            crypted = rsa.encrypt(param);
            var result = pidCryptUtil.encodeBase64(pidCryptUtil.convertFromHex(crypted));

            //返回结果
            callback(result);
     });


};

function mypost(url, data, method, cb) {
    var  xhr ='';
    if(window.XMLHttpRequest){
        xhr = new XMLHttpRequest();
    }else{
        xhr =new ActiveXObject(' Microsoft . XMLHTTP')
    }



    // 异步 post,回调通知
    xhr.open('post', url, 'true');
    var  param = data;
    if ((typeof data) === 'object')
        param = JSON.stringify(data);

    xhr.setRequestHeader('Content-Type', 'text/plain; charset=utf-8');
    xhr.setRequestHeader('X-AjaxPro-Method', method);
    xhr.send(param);

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && cb) {
            if (xhr.status === 200)
                cb(null, xhr.responseText);
            else
                cb(new Error(xhr.status), xhr.responseText);
        }
    };
}



function ICBCAes() {
    //AES
}
ICBCAes.prototype.GetAesStr = function (param, callback) {
    var aesPwd = "我的密码";
    aesPwd = Math.random().toString(36).substr(2, 16);
    if (aesPwd.length < 16) {
        //alert("不足16位，补齐之前：" + aesPwd);
        for (var i = aesPwd.length; i < 16; i++) {
            aesPwd = aesPwd + "0";
        }
        //alert("足16位，补齐之后：" + aesPwd);
    }
    var rsaICBC = new ICBCRsa();
    rsaICBC.getPublicKey(aesPwd, function (encryptionPwd) {
        var key = aesPwd;  //密钥
        var key2 = key;
        //先固定起
        var iv = "3gqv4fpz2i0ms4i0";
        var iv2 = iv;
        key = CryptoJS.enc.Utf8.parse(key);
        iv = CryptoJS.enc.Utf8.parse(iv);
        var options = {
            iv: iv,
            keySize: 128 / 8,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        };

        param = CryptoJS.enc.Utf8.parse(param);
        var addrAes = CryptoJS.AES.encrypt(param, key, options);//密文
        addrAes = encodeURIComponent(addrAes);

        callback(addrAes, encryptionPwd);
    });
}






/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

// 2 . rsa_all.js 相关方法
function pidCrypt(){
  function getRandomBytes(len){
/* for better randomness make sure you incorporate and initiate seedrandom.js
*  before using getRandomBytes() or any call of Math.random()
*/
    if(!len) len = 8;
    var bytes = new Array(len);
    var field = [];
    for(var i=0;i<256;i++) field[i] = i;
    for(i=0;i<bytes.length;i++)
      bytes[i] = field[Math.floor(Math.random()*field.length)];
    return bytes
  }

  this.setDefaults = function(){
     this.params.nBits = 256;
  //salt should always be a Hex String e.g. AD0E76FF6535AD...
     this.params.salt = byteArray2String(getRandomBytes(8)).convertToHex();
     this.params.blockSize = 16;
     this.params.UTF8 = true;
     this.params.A0_PAD = true;
  }

  this.debug = true;
  this.params = {};
  //setting default values for params
  this.params.dataIn = '';
  this.params.dataOut = '';
  this.params.decryptIn = '';
  this.params.decryptOut = '';
  this.params.encryptIn = '';
  this.params.encryptOut = '';
  //key should always be a Hex String e.g. AD0E76FF6535AD...
  this.params.key = '';
  //iv should always be a Hex String e.g. AD0E76FF6535AD...
  this.params.iv = '';
  this.params.clear = true;
  this.setDefaults();
  this.errors = '';
  this.warnings = '';
  this.infos = '';
  this.debugMsg = '';
  //set and get methods for base class
  this.setParams = function(pObj){
    if(!pObj) pObj = {};
    for(var p in pObj)
      this.params[p] = pObj[p];
  }
  this.getParams = function(){
    return this.params;
  }
  this.getParam = function(p){
    return this.params[p] || '';
  }
  this.clearParams = function(){
      this.params= {};
  }
  this.getNBits = function(){
    return this.params.nBits;
  }
  this.getOutput = function(){
    return this.params.dataOut;
  }
  this.setError = function(str){
    this.error = str;
  }
  this.appendError = function(str){
    this.errors += str;
    return '';
  }
  this.getErrors = function(){
    return this.errors;
  }
  this.isError = function(){
    if(this.errors.length>0)
      return true;
    return false
  }
  this.appendInfo = function(str){
    this.infos += str;
    return '';
  }
  this.getInfos = function()
  {
    return this.infos;
  }
  this.setDebug = function(flag){
    this.debug = flag;
  }
  this.appendDebug = function(str)
  {
    this.debugMsg += str;
    return '';
  }
  this.isDebug = function(){
    return this.debug;
  }
  this.getAllMessages = function(options){
    var defaults = {lf:'\n',
                    clr_mes: false,
                    verbose: 15//verbose level bits = 1111
        };
    if(!options) options = defaults;
    for(var d in defaults)
      if(typeof(options[d]) == 'undefined') options[d] = defaults[d];
    var mes = '';
    var tmp = '';
    for(var p in this.params){
      switch(p){
        case 'encryptOut':
          tmp = this.params[p].toString().toByteArray();
          tmp = tmp.join().fragment(64, options.lf)
          break;
        case 'key':
        case 'iv':
          tmp = this.params[p].formatHex(48);
          break;
        default:
          tmp = this.params[p].toString().fragment(64, options.lf);
      }
      mes += '<p><b>'+p+'</b>:<pre>' + tmp + '</pre></p>';
    }
    if(this.debug) mes += 'debug: ' + this.debug + options.lf;
    if(this.errors.length>0 && ((options.verbose & 1) == 1)) mes += 'Errors:' + options.lf + this.errors + options.lf;
    if(this.warnings.length>0 && ((options.verbose & 2) == 2)) mes += 'Warnings:' +options.lf + this.warnings + options.lf;
    if(this.infos.length>0 && ((options.verbose & 4) == 4)) mes += 'Infos:' +options.lf+ this.infos + options.lf;
    if(this.debug && ((options.verbose & 8) == 8)) mes += 'Debug messages:' +options.lf+ this.debugMsg + options.lf;
    if(options.clr_mes)
      this.errors = this.infos = this.warnings = this.debug = '';
    return mes;
  }
  this.getRandomBytes = function(len){
    return getRandomBytes(len);
  }
  //TODO warnings
}


//end pidcrypt.js


pidCryptUtil = {};
pidCryptUtil.encodeBase64 = function(str,utf8encode) {  // http://tools.ietf.org/html/rfc4648
  if(!str) str = "";
  var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  utf8encode =  (typeof utf8encode == 'undefined') ? false : utf8encode;
  var o1, o2, o3, bits, h1, h2, h3, h4, e=[], pad = '', c, plain, coded;

  plain = utf8encode ? pidCryptUtil.encodeUTF8(str) : str;

  c = plain.length % 3;  // pad string to length of multiple of 3
  if (c > 0) { while (c++ < 3) { pad += '='; plain += '\0'; } }
  // note: doing padding here saves us doing special-case packing for trailing 1 or 2 chars

  for (c=0; c<plain.length; c+=3) {  // pack three octets into four hexets
    o1 = plain.charCodeAt(c);
    o2 = plain.charCodeAt(c+1);
    o3 = plain.charCodeAt(c+2);

    bits = o1<<16 | o2<<8 | o3;

    h1 = bits>>18 & 0x3f;
    h2 = bits>>12 & 0x3f;
    h3 = bits>>6 & 0x3f;
    h4 = bits & 0x3f;

    // use hextets to index into b64 string
    e[c/3] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
  }
  coded = e.join('');  // join() is far faster than repeated string concatenation

  // replace 'A's from padded nulls with '='s
  coded = coded.slice(0, coded.length-pad.length) + pad;
  return coded;
}

/**
 * Decode string from Base64, as defined by RFC 4648 [http://tools.ietf.org/html/rfc4648]
 * As per RFC 4648, newlines are not catered for.
 *
 * @param utf8decode optional parameter, if set to true UTF-8 string is decoded
 *                   back into Unicode after conversion from base64
 * @return           decoded string
 */
pidCryptUtil.decodeBase64 = function(str,utf8decode) {
  if(!str) str = "";
  var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  utf8decode =  (typeof utf8decode == 'undefined') ? false : utf8decode;
  var o1, o2, o3, h1, h2, h3, h4, bits, d=[], plain, coded;

  coded = utf8decode ? pidCryptUtil.decodeUTF8(str) : str;

  for (var c=0; c<coded.length; c+=4) {  // unpack four hexets into three octets
    h1 = b64.indexOf(coded.charAt(c));
    h2 = b64.indexOf(coded.charAt(c+1));
    h3 = b64.indexOf(coded.charAt(c+2));
    h4 = b64.indexOf(coded.charAt(c+3));

    bits = h1<<18 | h2<<12 | h3<<6 | h4;

    o1 = bits>>>16 & 0xff;
    o2 = bits>>>8 & 0xff;
    o3 = bits & 0xff;

    d[c/4] = String.fromCharCode(o1, o2, o3);
    // check for padding
    if (h4 == 0x40) d[c/4] = String.fromCharCode(o1, o2);
    if (h3 == 0x40) d[c/4] = String.fromCharCode(o1);
  }
  plain = d.join('');  // join() is far faster than repeated string concatenation

  plain = utf8decode ? pidCryptUtil.decodeUTF8(plain) : plain

  return plain;
}

/**
 * Encode multi-byte Unicode string into utf-8 multiple single-byte characters
 * (BMP / basic multilingual plane only)
 *
 * Chars in range U+0080 - U+07FF are encoded in 2 chars, U+0800 - U+FFFF in 3 chars
 *
 * @return encoded string
 */
pidCryptUtil.encodeUTF8 = function(str) {
  if(!str) str = "";
  // use regular expressions & String.replace callback function for better efficiency
  // than procedural approaches
  str = str.replace(
      /[\u0080-\u07ff]/g,  // U+0080 - U+07FF => 2 bytes 110yyyyy, 10zzzzzz
      function(c) {
        var cc = c.charCodeAt(0);
        return String.fromCharCode(0xc0 | cc>>6, 0x80 | cc&0x3f); }
    );
  str = str.replace(
      /[\u0800-\uffff]/g,  // U+0800 - U+FFFF => 3 bytes 1110xxxx, 10yyyyyy, 10zzzzzz
      function(c) {
        var cc = c.charCodeAt(0);
        return String.fromCharCode(0xe0 | cc>>12, 0x80 | cc>>6&0x3F, 0x80 | cc&0x3f); }
    );
  return str;
}




/**
 * Decode utf-8 encoded string back into multi-byte Unicode characters
 *
 * @return decoded string
 */
pidCryptUtil.decodeUTF8 = function(str) {
  if(!str) str = "";
  str = str.replace(
      /[\u00c0-\u00df][\u0080-\u00bf]/g,                 // 2-byte chars
      function(c) {  // (note parentheses for precence)
        var cc = (c.charCodeAt(0)&0x1f)<<6 | c.charCodeAt(1)&0x3f;
        return String.fromCharCode(cc); }
    );
  str = str.replace(
      /[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g,  // 3-byte chars
      function(c) {  // (note parentheses for precence)
        var cc = ((c.charCodeAt(0)&0x0f)<<12) | ((c.charCodeAt(1)&0x3f)<<6) | ( c.charCodeAt(2)&0x3f);
        return String.fromCharCode(cc); }
    );
  return str;
}



pidCryptUtil.convertToHex = function(str) {
  if(!str) str = "";
  var hs ='';
  var hv ='';
  for (var i=0; i<str.length; i++) {
    hv = str.charCodeAt(i).toString(16);
    hs += (hv.length == 1) ? '0'+hv : hv;
  }
  return hs;
}

/**
 * Converts a hex string into a string
 * returns the characters of a hex string to their char of charcode
 *
 * @return hex string e.g. "68656c6c6f20776f726c64" => "hello world"
 */
pidCryptUtil.convertFromHex = function(str){
  if(!str) str = "";
  var s = "";
  for(var i= 0;i<str.length;i+=2){
    s += String.fromCharCode(parseInt(str.substring(i,i+2),16));
  }
  return s
}

/**
 * strips off all linefeeds from a string
 * returns the the strong without line feeds
 *
 * @return string
 */
pidCryptUtil.stripLineFeeds = function(str){
  if(!str) str = "";
//  var re = RegExp(String.fromCharCode(13),'g');//\r
//  var re = RegExp(String.fromCharCode(10),'g');//\n
  var s = '';
  s = str.replace(/\n/g,'');
  s = s.replace(/\r/g,'');
  return s;
}

/**
 * Converts a string into an array of char code bytes
 * returns the characters of a hex string to their char of charcode
 *
 * @return hex string e.g. "68656c6c6f20776f726c64" => "hello world"
 */
 pidCryptUtil.toByteArray = function(str){
  if(!str) str = "";
  var ba = [];
  for(var i=0;i<str.length;i++)
     ba[i] = str.charCodeAt(i);

  return ba;
}


/**
 * Fragmentize a string into lines adding a line feed (lf) every length
 * characters
 *
 * @return string e.g. length=3 "abcdefghi" => "abc\ndef\nghi\n"
 */
pidCryptUtil.fragment = function(str,length,lf){
  if(!str) str = "";
  if(!length || length>=str.length) return str;
  if(!lf) lf = '\n'
  var tmp='';
  for(var i=0;i<str.length;i+=length)
    tmp += str.substr(i,length) + lf;
  return tmp;
}

/**
 * Formats a hex string in two lower case chars + : and lines of given length
 * characters
 *
 * @return string e.g. "68656C6C6F20" => "68:65:6c:6c:6f:20:\n"
*/
pidCryptUtil.formatHex = function(str,length){
  if(!str) str = "";
    if(!length) length = 45;
    var str_new='';
    var j = 0;
    var hex = str.toLowerCase();
    for(var i=0;i<hex.length;i+=2)
      str_new += hex.substr(i,2) +':';
    hex = this.fragment(str_new,length);

  return hex;
}


/*----------------------------------------------------------------------------*/
/* End of intance methods of the String object                                */
/*----------------------------------------------------------------------------*/

pidCryptUtil.byteArray2String = function(b){
//  var out ='';
  var s = '';
  for(var i=0;i<b.length;i++){
     s += String.fromCharCode(b[i]);
//     out += b[i]+':';
  }
//  alert(out);
  return s;
}

//end pidcrypt_util.js


function Stream(enc, pos) {
  if (enc instanceof Stream) {
    this.enc = enc.enc;
    this.pos = enc.pos;
  } else {
    this.enc = enc;
    this.pos = pos;
  }
}

//pidCrypt extensions start
//hex string
Stream.prototype.parseStringHex = function(start, end) {
  if(typeof(end) == 'undefined') end = this.enc.length;
  var s = "";
  for (var i = start; i < end; ++i) {
    var h = this.get(i);
    s += this.hexDigits.charAt(h >> 4) + this.hexDigits.charAt(h & 0xF);
  }
  return s;
}
//pidCrypt extensions end

Stream.prototype.get = function(pos) {
  if (pos == undefined)
      pos = this.pos++;
  if (pos >= this.enc.length)
      throw 'Requesting byte offset ' + pos + ' on a stream of length ' + this.enc.length;

  return this.enc[pos];
}
Stream.prototype.hexDigits = "0123456789ABCDEF";
Stream.prototype.hexDump = function(start, end) {
  var s = "";
  for (var i = start; i < end; ++i) {
    var h = this.get(i);
    s += this.hexDigits.charAt(h >> 4) + this.hexDigits.charAt(h & 0xF);
    if ((i & 0xF) == 0x7)
      s += ' ';
    s += ((i & 0xF) == 0xF) ? '\n' : ' ';
  }

  return s;
}
Stream.prototype.parseStringISO = function(start, end) {
  var s = "";
  for (var i = start; i < end; ++i)
      s += String.fromCharCode(this.get(i));

  return s;
}
Stream.prototype.parseStringUTF = function(start, end) {
  var s = "", c = 0;
  for (var i = start; i < end; ) {
      var c = this.get(i++);
      if (c < 128)
        s += String.fromCharCode(c);
    else
      if ((c > 191) && (c < 224))
        s += String.fromCharCode(((c & 0x1F) << 6) | (this.get(i++) & 0x3F));
      else
        s += String.fromCharCode(((c & 0x0F) << 12) | ((this.get(i++) & 0x3F) << 6) | (this.get(i++) & 0x3F));
    //TODO: this doesn't check properly 'end', some char could begin before and end after
  }
  return s;
}
Stream.prototype.reTime = /^((?:1[89]|2\d)?\d\d)(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([01]\d|2[0-3])(?:([0-5]\d)(?:([0-5]\d)(?:[.,](\d{1,3}))?)?)?(Z|[-+](?:[0]\d|1[0-2])([0-5]\d)?)?$/;
Stream.prototype.parseTime = function(start, end) {
  var s = this.parseStringISO(start, end);
  var m = this.reTime.exec(s);
  if (!m)
      return "Unrecognized time: " + s;
  s = m[1] + "-" + m[2] + "-" + m[3] + " " + m[4];
  if (m[5]) {
      s += ":" + m[5];
      if (m[6]) {
        s += ":" + m[6];
        if (m[7])
            s += "." + m[7];
      }
  }
  if (m[8]) {
      s += " UTC";
      if (m[8] != 'Z') {
        s += m[8];
        if (m[9])
            s += ":" + m[9];
      }
  }
  return s;
}
Stream.prototype.parseInteger = function(start, end) {
  if ((end - start) > 4)
      return undefined;
  //TODO support negative numbers
  var n = 0;
  for (var i = start; i < end; ++i)
      n = (n << 8) | this.get(i);

  return n;
}
Stream.prototype.parseOID = function(start, end) {
  var s, n = 0, bits = 0;
  for (var i = start; i < end; ++i) {
      var v = this.get(i);
      n = (n << 7) | (v & 0x7F);
      bits += 7;
      if (!(v & 0x80)) { // finished
        if (s == undefined)
            s = parseInt(n / 40) + "." + (n % 40);
        else
            s += "." + ((bits >= 31) ? "big" : n);
        n = bits = 0;
      }
      s += String.fromCharCode();
  }
  return s;
}

if(typeof(pidCrypt) != 'undefined')
{
  pidCrypt.ASN1 = function(stream, header, length, tag, sub) {
    this.stream = stream;
    this.header = header;
    this.length = length;
    this.tag = tag;
    this.sub = sub;
  }
  //pidCrypt extensions start
  //
  //gets the ASN data as tree of hex strings
  //@returns node: as javascript object tree with hex strings as values
  //e.g. RSA Public Key gives
  // {
  //   SEQUENCE:
  //              {
  //                  INTEGER: modulus,
  //                  INTEGER: public exponent
  //              }
  //}
  pidCrypt.ASN1.prototype.toHexTree = function() {
    var node = {};
    node.type = this.typeName();
    if(node.type != 'SEQUENCE')
      node.value = this.stream.parseStringHex(this.posContent(),this.posEnd());
    if (this.sub != null) {
      node.sub = [];
      for (var i = 0, max = this.sub.length; i < max; ++i)
        node.sub[i] = this.sub[i].toHexTree();
    }
    return node;
  }
  //pidCrypt extensions end

  pidCrypt.ASN1.prototype.typeName = function() {
    if (this.tag == undefined)
    return "unknown";
    var tagClass = this.tag >> 6;
    var tagConstructed = (this.tag >> 5) & 1;
    var tagNumber = this.tag & 0x1F;
    switch (tagClass) {
      case 0: // universal
        switch (tagNumber) {
          case 0x00: return "EOC";
          case 0x01: return "BOOLEAN";
          case 0x02: return "INTEGER";
          case 0x03: return "BIT_STRING";
          case 0x04: return "OCTET_STRING";
          case 0x05: return "NULL";
          case 0x06: return "OBJECT_IDENTIFIER";
          case 0x07: return "ObjectDescriptor";
          case 0x08: return "EXTERNAL";
          case 0x09: return "REAL";
          case 0x0A: return "ENUMERATED";
          case 0x0B: return "EMBEDDED_PDV";
          case 0x0C: return "UTF8String";
          case 0x10: return "SEQUENCE";
          case 0x11: return "SET";
          case 0x12: return "NumericString";
          case 0x13: return "PrintableString"; // ASCII subset
          case 0x14: return "TeletexString"; // aka T61String
          case 0x15: return "VideotexString";
          case 0x16: return "IA5String"; // ASCII
          case 0x17: return "UTCTime";
          case 0x18: return "GeneralizedTime";
          case 0x19: return "GraphicString";
          case 0x1A: return "VisibleString"; // ASCII subset
          case 0x1B: return "GeneralString";
          case 0x1C: return "UniversalString";
          case 0x1E: return "BMPString";
          default: return "Universal_" + tagNumber.toString(16);
        }
      case 1: return "Application_" + tagNumber.toString(16);
      case 2: return "[" + tagNumber + "]"; // Context
      case 3: return "Private_" + tagNumber.toString(16);
    }
  }
  pidCrypt.ASN1.prototype.content = function() {
    if (this.tag == undefined)
      return null;
    var tagClass = this.tag >> 6;
    if (tagClass != 0) // universal
      return null;
    var tagNumber = this.tag & 0x1F;
    var content = this.posContent();
    var len = Math.abs(this.length);
    switch (tagNumber) {
    case 0x01: // BOOLEAN
      return (this.stream.get(content) == 0) ? "false" : "true";
    case 0x02: // INTEGER
      return this.stream.parseInteger(content, content + len);
    //case 0x03: // BIT_STRING
    //case 0x04: // OCTET_STRING
    //case 0x05: // NULL
    case 0x06: // OBJECT_IDENTIFIER
      return this.stream.parseOID(content, content + len);
    //case 0x07: // ObjectDescriptor
    //case 0x08: // EXTERNAL
    //case 0x09: // REAL
    //case 0x0A: // ENUMERATED
    //case 0x0B: // EMBEDDED_PDV
    //case 0x10: // SEQUENCE
    //case 0x11: // SET
    case 0x0C: // UTF8String
      return this.stream.parseStringUTF(content, content + len);
    case 0x12: // NumericString
    case 0x13: // PrintableString
    case 0x14: // TeletexString
    case 0x15: // VideotexString
    case 0x16: // IA5String
    //case 0x19: // GraphicString
    case 0x1A: // VisibleString
    //case 0x1B: // GeneralString
    //case 0x1C: // UniversalString
    //case 0x1E: // BMPString
      return this.stream.parseStringISO(content, content + len);
    case 0x17: // UTCTime
    case 0x18: // GeneralizedTime
      return this.stream.parseTime(content, content + len);
    }
    return null;
  }
  pidCrypt.ASN1.prototype.toString = function() {
    return this.typeName() + "@" + this.stream.pos + "[header:" + this.header + ",length:" + this.length + ",sub:" + ((this.sub == null) ? 'null' : this.sub.length) + "]";
  }
  pidCrypt.ASN1.prototype.print = function(indent) {
    if (indent == undefined) indent = '';
      document.writeln(indent + this);
    if (this.sub != null) {
      indent += '  ';
    for (var i = 0, max = this.sub.length; i < max; ++i)
      this.sub[i].print(indent);
    }
  }
  pidCrypt.ASN1.prototype.toPrettyString = function(indent) {
    if (indent == undefined) indent = '';
    var s = indent + this.typeName() + " @" + this.stream.pos;
    if (this.length >= 0)
      s += "+";
    s += this.length;
    if (this.tag & 0x20)
      s += " (constructed)";
    else
      if (((this.tag == 0x03) || (this.tag == 0x04)) && (this.sub != null))
        s += " (encapsulates)";
    s += "\n";
    if (this.sub != null) {
      indent += '  ';
      for (var i = 0, max = this.sub.length; i < max; ++i)
        s += this.sub[i].toPrettyString(indent);
    }
    return s;
  }
  pidCrypt.ASN1.prototype.toDOM = function() {
    var node = document.createElement("div");
    node.className = "node";
    node.asn1 = this;
    var head = document.createElement("div");
    head.className = "head";
    var s = this.typeName();
    head.innerHTML = s;
    node.appendChild(head);
    this.head = head;
    var value = document.createElement("div");
    value.className = "value";
    s = "Offset: " + this.stream.pos + "<br/>";
    s += "Length: " + this.header + "+";
    if (this.length >= 0)
      s += this.length;
    else
      s += (-this.length) + " (undefined)";
    if (this.tag & 0x20)
      s += "<br/>(constructed)";
    else if (((this.tag == 0x03) || (this.tag == 0x04)) && (this.sub != null))
      s += "<br/>(encapsulates)";
    var content = this.content();
    if (content != null) {
      s += "<br/>Value:<br/><b>" + content + "</b>";
      if ((typeof(oids) == 'object') && (this.tag == 0x06)) {
        var oid = oids[content];
        if (oid) {
          if (oid.d) s += "<br/>" + oid.d;
          if (oid.c) s += "<br/>" + oid.c;
          if (oid.w) s += "<br/>(warning!)";
        }
      }
    }
    value.innerHTML = s;
    node.appendChild(value);
    var sub = document.createElement("div");
    sub.className = "sub";
    if (this.sub != null) {
      for (var i = 0, max = this.sub.length; i < max; ++i)
        sub.appendChild(this.sub[i].toDOM());
    }
    node.appendChild(sub);
    head.switchNode = node;
    head.onclick = function() {
      var node = this.switchNode;
      node.className = (node.className == "node collapsed") ? "node" : "node collapsed";
    };
    return node;
  }
  pidCrypt.ASN1.prototype.posStart = function() {
    return this.stream.pos;
  }
  pidCrypt.ASN1.prototype.posContent = function() {
    return this.stream.pos + this.header;
  }
  pidCrypt.ASN1.prototype.posEnd = function() {
    return this.stream.pos + this.header + Math.abs(this.length);
  }
  pidCrypt.ASN1.prototype.toHexDOM_sub = function(node, className, stream, start, end) {
    if (start >= end)
      return;
    var sub = document.createElement("span");
    sub.className = className;
    sub.appendChild(document.createTextNode(
    stream.hexDump(start, end)));
    node.appendChild(sub);
  }
  pidCrypt.ASN1.prototype.toHexDOM = function() {
    var node = document.createElement("span");
    node.className = 'hex';
    this.head.hexNode = node;
    this.head.onmouseover = function() { this.hexNode.className = 'hexCurrent'; }
    this.head.onmouseout  = function() { this.hexNode.className = 'hex'; }
    this.toHexDOM_sub(node, "tag", this.stream, this.posStart(), this.posStart() + 1);
    this.toHexDOM_sub(node, (this.length >= 0) ? "dlen" : "ulen", this.stream, this.posStart() + 1, this.posContent());
    if (this.sub == null)
      node.appendChild(document.createTextNode(
        this.stream.hexDump(this.posContent(), this.posEnd())));
    else if (this.sub.length > 0) {
    var first = this.sub[0];
    var last = this.sub[this.sub.length - 1];
    this.toHexDOM_sub(node, "intro", this.stream, this.posContent(), first.posStart());
    for (var i = 0, max = this.sub.length; i < max; ++i)
        node.appendChild(this.sub[i].toHexDOM());
    this.toHexDOM_sub(node, "outro", this.stream, last.posEnd(), this.posEnd());
    }
    return node;
  }

  /*
  pidCrypt.ASN1.prototype.getValue = function() {
      TODO
  }
  */
  pidCrypt.ASN1.decodeLength = function(stream) {
      var buf = stream.get();
      var len = buf & 0x7F;
      if (len == buf)
          return len;
      if (len > 3)
          throw "Length over 24 bits not supported at position " + (stream.pos - 1);
      if (len == 0)
      return -1; // undefined
      buf = 0;
      for (var i = 0; i < len; ++i)
          buf = (buf << 8) | stream.get();
      return buf;
  }
  pidCrypt.ASN1.hasContent = function(tag, len, stream) {
      if (tag & 0x20) // constructed
      return true;
      if ((tag < 0x03) || (tag > 0x04))
      return false;
      var p = new Stream(stream);
      if (tag == 0x03) p.get(); // BitString unused bits, must be in [0, 7]
      var subTag = p.get();
      if ((subTag >> 6) & 0x01) // not (universal or context)
      return false;
      try {
      var subLength = pidCrypt.ASN1.decodeLength(p);
      return ((p.pos - stream.pos) + subLength == len);
      } catch (exception) {
      return false;
      }
  }
  pidCrypt.ASN1.decode = function(stream) {
    if (!(stream instanceof Stream))
        stream = new Stream(stream, 0);
    var streamStart = new Stream(stream);
    var tag = stream.get();
    var len = pidCrypt.ASN1.decodeLength(stream);
    var header = stream.pos - streamStart.pos;
    var sub = null;
    if (pidCrypt.ASN1.hasContent(tag, len, stream)) {
    // it has content, so we decode it
    var start = stream.pos;
    if (tag == 0x03) stream.get(); // skip BitString unused bits, must be in [0, 7]
        sub = [];
    if (len >= 0) {
        // definite length
        var end = start + len;
        while (stream.pos < end)
        sub[sub.length] = pidCrypt.ASN1.decode(stream);
        if (stream.pos != end)
        throw "Content size is not correct for container starting at offset " + start;
    } else {
        // undefined length
        try {
        for (;;) {
            var s = pidCrypt.ASN1.decode(stream);
            if (s.tag == 0)
            break;
            sub[sub.length] = s;
        }
        len = start - stream.pos;
        } catch (e) {
        throw "Exception while decoding undefined length content: " + e;
        }
    }
    } else
        stream.pos += len; // skip content
    return new pidCrypt.ASN1(streamStart, header, len, tag, sub);
  }
  pidCrypt.ASN1.test = function() {
    var test = [
      { value: [0x27],                   expected: 0x27     },
      { value: [0x81, 0xC9],             expected: 0xC9     },
      { value: [0x83, 0xFE, 0xDC, 0xBA], expected: 0xFEDCBA },
    ];
    for (var i = 0, max = test.length; i < max; ++i) {
      var pos = 0;
      var stream = new Stream(test[i].value, 0);
      var res = pidCrypt.ASN1.decodeLength(stream);
      if (res != test[i].expected)
        document.write("In test[" + i + "] expected " + test[i].expected + " got " + res + "\n");
    }
  }
}

//end asn1.js


var dbits;

// JavaScript engine analysis
var canary = 0xdeadbeefcafe;
var j_lm = ((canary&0xffffff)==0xefcafe);

// (public) Constructor
function BigInteger(a,b,c) {

  if(a != null)
    if("number" == typeof a) this.fromNumber(a,b,c);
    else if(b == null && "string" != typeof a) this.fromString(a,256);
    else this.fromString(a,b);
}

// return new, unset BigInteger
function nbi() { return new BigInteger(null); }

// am: Compute w_j += (x*this_i), propagate carries,
// c is initial carry, returns final carry.
// c < 3*dvalue, x < 2*dvalue, this_i < dvalue
// We need to select the fastest one that works in this environment.

// am1: use a single mult and divide to get the high bits,
// max digit bits should be 26 because
// max internal value = 2*dvalue^2-2*dvalue (< 2^53)
function am1(i,x,w,j,c,n) {
  while(--n >= 0) {
    var v = x*this[i++]+w[j]+c;
    c = Math.floor(v/0x4000000);
    w[j++] = v&0x3ffffff;
  }
  return c;
}
// am2 avoids a big mult-and-extract completely.
// Max digit bits should be <= 30 because we do bitwise ops
// on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)
function am2(i,x,w,j,c,n) {
  var xl = x&0x7fff, xh = x>>15;
  while(--n >= 0) {
    var l = this[i]&0x7fff;
    var h = this[i++]>>15;
    var m = xh*l+h*xl;
    l = xl*l+((m&0x7fff)<<15)+w[j]+(c&0x3fffffff);
    c = (l>>>30)+(m>>>15)+xh*h+(c>>>30);
    w[j++] = l&0x3fffffff;
  }
  return c;
}
// Alternately, set max digit bits to 28 since some
// browsers slow down when dealing with 32-bit numbers.
function am3(i,x,w,j,c,n) {
  var xl = x&0x3fff, xh = x>>14;
  while(--n >= 0) {
    var l = this[i]&0x3fff;
    var h = this[i++]>>14;
    var m = xh*l+h*xl;
    l = xl*l+((m&0x3fff)<<14)+w[j]+c;
    c = (l>>28)+(m>>14)+xh*h;
    w[j++] = l&0xfffffff;
  }
  return c;
}
if(j_lm && (navigator.appName == "Microsoft Internet Explorer")) {
  BigInteger.prototype.am = am2;
  dbits = 30;
}
else if(j_lm && (navigator.appName != "Netscape")) {
  BigInteger.prototype.am = am1;
  dbits = 26;
}
else { // Mozilla/Netscape seems to prefer am3
  BigInteger.prototype.am = am3;
  dbits = 28;
}

BigInteger.prototype.DB = dbits;
BigInteger.prototype.DM = ((1<<dbits)-1);
BigInteger.prototype.DV = (1<<dbits);

var BI_FP = 52;
BigInteger.prototype.FV = Math.pow(2,BI_FP);
BigInteger.prototype.F1 = BI_FP-dbits;
BigInteger.prototype.F2 = 2*dbits-BI_FP;

// Digit conversions
var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
var BI_RC = new Array();
var rr,vv;
rr = "0".charCodeAt(0);
for(vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
rr = "a".charCodeAt(0);
for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
rr = "A".charCodeAt(0);
for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;

function int2char(n) { return BI_RM.charAt(n); }
function intAt(s,i) {
  var c = BI_RC[s.charCodeAt(i)];
  return (c==null)?-1:c;
}

// (protected) copy this to r
function bnpCopyTo(r) {
  for(var i = this.t-1; i >= 0; --i) r[i] = this[i];
  r.t = this.t;
  r.s = this.s;
}

// (protected) set from integer value x, -DV <= x < DV
function bnpFromInt(x) {
  this.t = 1;
  this.s = (x<0)?-1:0;
  if(x > 0) this[0] = x;
  else if(x < -1) this[0] = x+DV;
  else this.t = 0;
}

// return bigint initialized to value
function nbv(i) { var r = nbi(); r.fromInt(i); return r; }

// (protected) set from string and radix
function bnpFromString(s,b) {
  var k;
  if(b == 16) k = 4;
  else if(b == 8) k = 3;
  else if(b == 256) k = 8; // byte array
  else if(b == 2) k = 1;
  else if(b == 32) k = 5;
  else if(b == 4) k = 2;
  else { this.fromRadix(s,b); return; }
  this.t = 0;
  this.s = 0;
  var i = s.length, mi = false, sh = 0;
  while(--i >= 0) {
    var x = (k==8)?s[i]&0xff:intAt(s,i);
    if(x < 0) {
      if(s.charAt(i) == "-") mi = true;
      continue;
    }
    mi = false;
    if(sh == 0)
      this[this.t++] = x;
    else if(sh+k > this.DB) {
      this[this.t-1] |= (x&((1<<(this.DB-sh))-1))<<sh;
      this[this.t++] = (x>>(this.DB-sh));
    }
    else
      this[this.t-1] |= x<<sh;
    sh += k;
    if(sh >= this.DB) sh -= this.DB;
  }
  if(k == 8 && (s[0]&0x80) != 0) {
    this.s = -1;
    if(sh > 0) this[this.t-1] |= ((1<<(this.DB-sh))-1)<<sh;
  }
  this.clamp();
  if(mi) BigInteger.ZERO.subTo(this,this);
}

// (protected) clamp off excess high words
function bnpClamp() {
  var c = this.s&this.DM;
  while(this.t > 0 && this[this.t-1] == c) --this.t;
}

// (public) return string representation in given radix
function bnToString(b) {
  if(this.s < 0) return "-"+this.negate().toString(b);
  var k;
  if(b == 16) k = 4;
  else if(b == 8) k = 3;
  else if(b == 2) k = 1;
  else if(b == 32) k = 5;
  else if(b == 4) k = 2;
  else return this.toRadix(b);
  var km = (1<<k)-1, d, m = false, r = "", i = this.t;
  var p = this.DB-(i*this.DB)%k;
  if(i-- > 0) {
    if(p < this.DB && (d = this[i]>>p) > 0) { m = true; r = int2char(d); }
    while(i >= 0) {
      if(p < k) {
        d = (this[i]&((1<<p)-1))<<(k-p);
        d |= this[--i]>>(p+=this.DB-k);
      }
      else {
        d = (this[i]>>(p-=k))&km;
        if(p <= 0) { p += this.DB; --i; }
      }
      if(d > 0) m = true;
      if(m) r += int2char(d);
    }
  }
  return m?r:"0";
}

// (public) -this
function bnNegate() { var r = nbi(); BigInteger.ZERO.subTo(this,r); return r; }

// (public) |this|
function bnAbs() { return (this.s<0)?this.negate():this; }

// (public) return + if this > a, - if this < a, 0 if equal
function bnCompareTo(a) {
  var r = this.s-a.s;
  if(r != 0) return r;
  var i = this.t;
  r = i-a.t;
  if(r != 0) return r;
  while(--i >= 0) if((r=this[i]-a[i]) != 0) return r;
  return 0;
}

// returns bit length of the integer x
function nbits(x) {
  var r = 1, t;
  if((t=x>>>16) != 0) { x = t; r += 16; }
  if((t=x>>8) != 0) { x = t; r += 8; }
  if((t=x>>4) != 0) { x = t; r += 4; }
  if((t=x>>2) != 0) { x = t; r += 2; }
  if((t=x>>1) != 0) { x = t; r += 1; }
  return r;
}

// (public) return the number of bits in "this"
function bnBitLength() {
  if(this.t <= 0) return 0;
  return this.DB*(this.t-1)+nbits(this[this.t-1]^(this.s&this.DM));
}

// (protected) r = this << n*DB
function bnpDLShiftTo(n,r) {
  var i;
  for(i = this.t-1; i >= 0; --i) r[i+n] = this[i];
  for(i = n-1; i >= 0; --i) r[i] = 0;
  r.t = this.t+n;
  r.s = this.s;
}

// (protected) r = this >> n*DB
function bnpDRShiftTo(n,r) {
  for(var i = n; i < this.t; ++i) r[i-n] = this[i];
  r.t = Math.max(this.t-n,0);
  r.s = this.s;
}

// (protected) r = this << n
function bnpLShiftTo(n,r) {
  var bs = n%this.DB;
  var cbs = this.DB-bs;
  var bm = (1<<cbs)-1;
  var ds = Math.floor(n/this.DB), c = (this.s<<bs)&this.DM, i;
  for(i = this.t-1; i >= 0; --i) {
    r[i+ds+1] = (this[i]>>cbs)|c;
    c = (this[i]&bm)<<bs;
  }
  for(i = ds-1; i >= 0; --i) r[i] = 0;
  r[ds] = c;
  r.t = this.t+ds+1;
  r.s = this.s;
  r.clamp();
}

// (protected) r = this >> n
function bnpRShiftTo(n,r) {
  r.s = this.s;
  var ds = Math.floor(n/this.DB);
  if(ds >= this.t) { r.t = 0; return; }
  var bs = n%this.DB;
  var cbs = this.DB-bs;
  var bm = (1<<bs)-1;
  r[0] = this[ds]>>bs;
  for(var i = ds+1; i < this.t; ++i) {
    r[i-ds-1] |= (this[i]&bm)<<cbs;
    r[i-ds] = this[i]>>bs;
  }
  if(bs > 0) r[this.t-ds-1] |= (this.s&bm)<<cbs;
  r.t = this.t-ds;
  r.clamp();
}

// (protected) r = this - a
function bnpSubTo(a,r) {
  var i = 0, c = 0, m = Math.min(a.t,this.t);
  while(i < m) {
    c += this[i]-a[i];
    r[i++] = c&this.DM;
    c >>= this.DB;
  }
  if(a.t < this.t) {
    c -= a.s;
    while(i < this.t) {
      c += this[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    c += this.s;
  }
  else {
    c += this.s;
    while(i < a.t) {
      c -= a[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    c -= a.s;
  }
  r.s = (c<0)?-1:0;
  if(c < -1) r[i++] = this.DV+c;
  else if(c > 0) r[i++] = c;
  r.t = i;
  r.clamp();
}

// (protected) r = this * a, r != this,a (HAC 14.12)
// "this" should be the larger one if appropriate.
function bnpMultiplyTo(a,r) {
  var x = this.abs(), y = a.abs();
  var i = x.t;
  r.t = i+y.t;
  while(--i >= 0) r[i] = 0;
  for(i = 0; i < y.t; ++i) r[i+x.t] = x.am(0,y[i],r,i,0,x.t);
  r.s = 0;
  r.clamp();
  if(this.s != a.s) BigInteger.ZERO.subTo(r,r);
}

// (protected) r = this^2, r != this (HAC 14.16)
function bnpSquareTo(r) {
  var x = this.abs();
  var i = r.t = 2*x.t;
  while(--i >= 0) r[i] = 0;
  for(i = 0; i < x.t-1; ++i) {
    var c = x.am(i,x[i],r,2*i,0,1);
    if((r[i+x.t]+=x.am(i+1,2*x[i],r,2*i+1,c,x.t-i-1)) >= x.DV) {
      r[i+x.t] -= x.DV;
      r[i+x.t+1] = 1;
    }
  }
  if(r.t > 0) r[r.t-1] += x.am(i,x[i],r,2*i,0,1);
  r.s = 0;
  r.clamp();
}

// (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
// r != q, this != m.  q or r may be null.
function bnpDivRemTo(m,q,r) {
  var pm = m.abs();
  if(pm.t <= 0) return;
  var pt = this.abs();
  if(pt.t < pm.t) {
    if(q != null) q.fromInt(0);
    if(r != null) this.copyTo(r);
    return;
  }
  if(r == null) r = nbi();
  var y = nbi(), ts = this.s, ms = m.s;
  var nsh = this.DB-nbits(pm[pm.t-1]);  // normalize modulus
  if(nsh > 0) { pm.lShiftTo(nsh,y); pt.lShiftTo(nsh,r); }
  else { pm.copyTo(y); pt.copyTo(r); }
  var ys = y.t;
  var y0 = y[ys-1];
  if(y0 == 0) return;
  var yt = y0*(1<<this.F1)+((ys>1)?y[ys-2]>>this.F2:0);
  var d1 = this.FV/yt, d2 = (1<<this.F1)/yt, e = 1<<this.F2;
  var i = r.t, j = i-ys, t = (q==null)?nbi():q;
  y.dlShiftTo(j,t);
  if(r.compareTo(t) >= 0) {
    r[r.t++] = 1;
    r.subTo(t,r);
  }
  BigInteger.ONE.dlShiftTo(ys,t);
  t.subTo(y,y); // "negative" y so we can replace sub with am later
  while(y.t < ys) y[y.t++] = 0;
  while(--j >= 0) {
    // Estimate quotient digit
    var qd = (r[--i]==y0)?this.DM:Math.floor(r[i]*d1+(r[i-1]+e)*d2);
    if((r[i]+=y.am(0,qd,r,j,0,ys)) < qd) {  // Try it out
      y.dlShiftTo(j,t);
      r.subTo(t,r);
      while(r[i] < --qd) r.subTo(t,r);
    }
  }
  if(q != null) {
    r.drShiftTo(ys,q);
    if(ts != ms) BigInteger.ZERO.subTo(q,q);
  }
  r.t = ys;
  r.clamp();
  if(nsh > 0) r.rShiftTo(nsh,r);    // Denormalize remainder
  if(ts < 0) BigInteger.ZERO.subTo(r,r);
}

// (public) this mod a
function bnMod(a) {
  var r = nbi();
  this.abs().divRemTo(a,null,r);
  if(this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r,r);
  return r;
}

// Modular reduction using "classic" algorithm
function Classic(m) { this.m = m; }
function cConvert(x) {
  if(x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);
  else return x;
}
function cRevert(x) { return x; }
function cReduce(x) { x.divRemTo(this.m,null,x); }
function cMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }
function cSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

Classic.prototype.convert = cConvert;
Classic.prototype.revert = cRevert;
Classic.prototype.reduce = cReduce;
Classic.prototype.mulTo = cMulTo;
Classic.prototype.sqrTo = cSqrTo;

// (protected) return "-1/this % 2^DB"; useful for Mont. reduction
// justification:
//         xy == 1 (mod m)
//         xy =  1+km
//   xy(2-xy) = (1+km)(1-km)
// x[y(2-xy)] = 1-k^2m^2
// x[y(2-xy)] == 1 (mod m^2)
// if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
// should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
// JS multiply "overflows" differently from C/C++, so care is needed here.
function bnpInvDigit() {
  if(this.t < 1) return 0;
  var x = this[0];
  if((x&1) == 0) return 0;
  var y = x&3;      // y == 1/x mod 2^2
  y = (y*(2-(x&0xf)*y))&0xf;    // y == 1/x mod 2^4
  y = (y*(2-(x&0xff)*y))&0xff;  // y == 1/x mod 2^8
  y = (y*(2-(((x&0xffff)*y)&0xffff)))&0xffff;   // y == 1/x mod 2^16
  // last step - calculate inverse mod DV directly;
  // assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
  y = (y*(2-x*y%this.DV))%this.DV;      // y == 1/x mod 2^dbits
  // we really want the negative inverse, and -DV < y < DV
  return (y>0)?this.DV-y:-y;
}

// Montgomery reduction
function Montgomery(m) {
  this.m = m;
  this.mp = m.invDigit();
  this.mpl = this.mp&0x7fff;
  this.mph = this.mp>>15;
  this.um = (1<<(m.DB-15))-1;
  this.mt2 = 2*m.t;
}

// xR mod m
function montConvert(x) {
  var r = nbi();
  x.abs().dlShiftTo(this.m.t,r);
  r.divRemTo(this.m,null,r);
  if(x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r,r);
  return r;
}

// x/R mod m
function montRevert(x) {
  var r = nbi();
  x.copyTo(r);
  this.reduce(r);
  return r;
}

// x = x/R mod m (HAC 14.32)
function montReduce(x) {
  while(x.t <= this.mt2)    // pad x so am has enough room later
    x[x.t++] = 0;
  for(var i = 0; i < this.m.t; ++i) {
    // faster way of calculating u0 = x[i]*mp mod DV
    var j = x[i]&0x7fff;
    var u0 = (j*this.mpl+(((j*this.mph+(x[i]>>15)*this.mpl)&this.um)<<15))&x.DM;
    // use am to combine the multiply-shift-add into one call
    j = i+this.m.t;
    x[j] += this.m.am(0,u0,x,i,0,this.m.t);
    // propagate carry
    while(x[j] >= x.DV) { x[j] -= x.DV; x[++j]++; }
  }
  x.clamp();
  x.drShiftTo(this.m.t,x);
  if(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
}

// r = "x^2/R mod m"; x != r
function montSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

// r = "xy/R mod m"; x,y != r
function montMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }

Montgomery.prototype.convert = montConvert;
Montgomery.prototype.revert = montRevert;
Montgomery.prototype.reduce = montReduce;
Montgomery.prototype.mulTo = montMulTo;
Montgomery.prototype.sqrTo = montSqrTo;

// (protected) true iff this is even
function bnpIsEven() { return ((this.t>0)?(this[0]&1):this.s) == 0; }

// (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)
function bnpExp(e,z) {
  if(e > 0xffffffff || e < 1) return BigInteger.ONE;
  var r = nbi(), r2 = nbi(), g = z.convert(this), i = nbits(e)-1;
  g.copyTo(r);
  while(--i >= 0) {
    z.sqrTo(r,r2);
    if((e&(1<<i)) > 0) z.mulTo(r2,g,r);
    else { var t = r; r = r2; r2 = t; }
  }
  return z.revert(r);
}

// (public) this^e % m, 0 <= e < 2^32
function bnModPowInt(e,m) {
  var z;
  if(e < 256 || m.isEven()) z = new Classic(m); else z = new Montgomery(m);
  return this.exp(e,z);
}

// protected
BigInteger.prototype.copyTo = bnpCopyTo;
BigInteger.prototype.fromInt = bnpFromInt;
BigInteger.prototype.fromString = bnpFromString;
BigInteger.prototype.clamp = bnpClamp;
BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
BigInteger.prototype.drShiftTo = bnpDRShiftTo;
BigInteger.prototype.lShiftTo = bnpLShiftTo;
BigInteger.prototype.rShiftTo = bnpRShiftTo;
BigInteger.prototype.subTo = bnpSubTo;
BigInteger.prototype.multiplyTo = bnpMultiplyTo;
BigInteger.prototype.squareTo = bnpSquareTo;
BigInteger.prototype.divRemTo = bnpDivRemTo;
BigInteger.prototype.invDigit = bnpInvDigit;
BigInteger.prototype.isEven = bnpIsEven;
BigInteger.prototype.exp = bnpExp;

// public
BigInteger.prototype.toString = bnToString;
BigInteger.prototype.negate = bnNegate;
BigInteger.prototype.abs = bnAbs;
BigInteger.prototype.compareTo = bnCompareTo;
BigInteger.prototype.bitLength = bnBitLength;
BigInteger.prototype.mod = bnMod;
BigInteger.prototype.modPowInt = bnModPowInt;

// "constants"
BigInteger.ZERO = nbv(0);
BigInteger.ONE = nbv(1);


// Extended JavaScript BN functions, required for RSA private ops.

// (public)
function bnClone() { var r = nbi(); this.copyTo(r); return r; }

// (public) return value as integer
function bnIntValue() {
  if(this.s < 0) {
    if(this.t == 1) return this[0]-this.DV;
    else if(this.t == 0) return -1;
  }
  else if(this.t == 1) return this[0];
  else if(this.t == 0) return 0;
  // assumes 16 < DB < 32
  return ((this[1]&((1<<(32-this.DB))-1))<<this.DB)|this[0];
}

// (public) return value as byte
function bnByteValue() { return (this.t==0)?this.s:(this[0]<<24)>>24; }

// (public) return value as short (assumes DB>=16)
function bnShortValue() { return (this.t==0)?this.s:(this[0]<<16)>>16; }

// (protected) return x s.t. r^x < DV
function bnpChunkSize(r) { return Math.floor(Math.LN2*this.DB/Math.log(r)); }

// (public) 0 if this == 0, 1 if this > 0
function bnSigNum() {
  if(this.s < 0) return -1;
  else if(this.t <= 0 || (this.t == 1 && this[0] <= 0)) return 0;
  else return 1;
}

// (protected) convert to radix string
function bnpToRadix(b) {
  if(b == null) b = 10;
  if(this.signum() == 0 || b < 2 || b > 36) return "0";
  var cs = this.chunkSize(b);
  var a = Math.pow(b,cs);
  var d = nbv(a), y = nbi(), z = nbi(), r = "";
  this.divRemTo(d,y,z);
  while(y.signum() > 0) {
    r = (a+z.intValue()).toString(b).substr(1) + r;
    y.divRemTo(d,y,z);
  }
  return z.intValue().toString(b) + r;
}

// (protected) convert from radix string
function bnpFromRadix(s,b) {
  this.fromInt(0);
  if(b == null) b = 10;
  var cs = this.chunkSize(b);
  var d = Math.pow(b,cs), mi = false, j = 0, w = 0;
  for(var i = 0; i < s.length; ++i) {
    var x = intAt(s,i);
    if(x < 0) {
      if(s.charAt(i) == "-" && this.signum() == 0) mi = true;
      continue;
    }
    w = b*w+x;
    if(++j >= cs) {
      this.dMultiply(d);
      this.dAddOffset(w,0);
      j = 0;
      w = 0;
    }
  }
  if(j > 0) {
    this.dMultiply(Math.pow(b,j));
    this.dAddOffset(w,0);
  }
  if(mi) BigInteger.ZERO.subTo(this,this);
}

// (protected) alternate constructor
function bnpFromNumber(a,b,c) {
if("number" == typeof b) {
    // new BigInteger(int,int,RNG)
    if(a < 2) this.fromInt(1);
    else {
      this.fromNumber(a,c);
      if(!this.testBit(a-1))    // force MSB set
        this.bitwiseTo(BigInteger.ONE.shiftLeft(a-1),op_or,this);
      if(this.isEven()) this.dAddOffset(1,0); // force odd
      while(!this.isProbablePrime(b)) {
        this.dAddOffset(2,0);
        if(this.bitLength() > a) this.subTo(BigInteger.ONE.shiftLeft(a-1),this);
      }
    }
  }
  else {
    // new BigInteger(int,RNG)
    var x = new Array(), t = a&7;
    x.length = (a>>3)+1;
    b.nextBytes(x);
    if(t > 0) x[0] &= ((1<<t)-1); else x[0] = 0;
    this.fromString(x,256);
  }
}

// (public) convert to bigendian byte array
function bnToByteArray() {
  var i = this.t, r = new Array();
  r[0] = this.s;
  var p = this.DB-(i*this.DB)%8, d, k = 0;
  if(i-- > 0) {
    if(p < this.DB && (d = this[i]>>p) != (this.s&this.DM)>>p)
      r[k++] = d|(this.s<<(this.DB-p));
    while(i >= 0) {
      if(p < 8) {
        d = (this[i]&((1<<p)-1))<<(8-p);
        d |= this[--i]>>(p+=this.DB-8);
      }
      else {
        d = (this[i]>>(p-=8))&0xff;
        if(p <= 0) { p += this.DB; --i; }
      }
      if((d&0x80) != 0) d |= -256;
      if(k == 0 && (this.s&0x80) != (d&0x80)) ++k;
      if(k > 0 || d != this.s) r[k++] = d;
    }
  }
  return r;
}

function bnEquals(a) { return(this.compareTo(a)==0); }
function bnMin(a) { return(this.compareTo(a)<0)?this:a; }
function bnMax(a) { return(this.compareTo(a)>0)?this:a; }

// (protected) r = this op a (bitwise)
function bnpBitwiseTo(a,op,r) {
  var i, f, m = Math.min(a.t,this.t);
  for(i = 0; i < m; ++i) r[i] = op(this[i],a[i]);
  if(a.t < this.t) {
    f = a.s&this.DM;
    for(i = m; i < this.t; ++i) r[i] = op(this[i],f);
    r.t = this.t;
  }
  else {
    f = this.s&this.DM;
    for(i = m; i < a.t; ++i) r[i] = op(f,a[i]);
    r.t = a.t;
  }
  r.s = op(this.s,a.s);
  r.clamp();
}

// (public) this & a
function op_and(x,y) { return x&y; }
function bnAnd(a) { var r = nbi(); this.bitwiseTo(a,op_and,r); return r; }

// (public) this | a
function op_or(x,y) { return x|y; }
function bnOr(a) { var r = nbi(); this.bitwiseTo(a,op_or,r); return r; }

// (public) this ^ a
function op_xor(x,y) { return x^y; }
function bnXor(a) { var r = nbi(); this.bitwiseTo(a,op_xor,r); return r; }

// (public) this & ~a
function op_andnot(x,y) { return x&~y; }
function bnAndNot(a) { var r = nbi(); this.bitwiseTo(a,op_andnot,r); return r; }

// (public) ~this
function bnNot() {
  var r = nbi();
  for(var i = 0; i < this.t; ++i) r[i] = this.DM&~this[i];
  r.t = this.t;
  r.s = ~this.s;
  return r;
}

// (public) this << n
function bnShiftLeft(n) {
  var r = nbi();
  if(n < 0) this.rShiftTo(-n,r); else this.lShiftTo(n,r);
  return r;
}

// (public) this >> n
function bnShiftRight(n) {
  var r = nbi();
  if(n < 0) this.lShiftTo(-n,r); else this.rShiftTo(n,r);
  return r;
}

// return index of lowest 1-bit in x, x < 2^31
function lbit(x) {
  if(x == 0) return -1;
  var r = 0;
  if((x&0xffff) == 0) { x >>= 16; r += 16; }
  if((x&0xff) == 0) { x >>= 8; r += 8; }
  if((x&0xf) == 0) { x >>= 4; r += 4; }
  if((x&3) == 0) { x >>= 2; r += 2; }
  if((x&1) == 0) ++r;
  return r;
}

// (public) returns index of lowest 1-bit (or -1 if none)
function bnGetLowestSetBit() {
  for(var i = 0; i < this.t; ++i)
    if(this[i] != 0) return i*this.DB+lbit(this[i]);
  if(this.s < 0) return this.t*this.DB;
  return -1;
}

// return number of 1 bits in x
function cbit(x) {
  var r = 0;
  while(x != 0) { x &= x-1; ++r; }
  return r;
}

// (public) return number of set bits
function bnBitCount() {
  var r = 0, x = this.s&this.DM;
  for(var i = 0; i < this.t; ++i) r += cbit(this[i]^x);
  return r;
}

// (public) true iff nth bit is set
function bnTestBit(n) {
  var j = Math.floor(n/this.DB);
  if(j >= this.t) return(this.s!=0);
  return((this[j]&(1<<(n%this.DB)))!=0);
}

// (protected) this op (1<<n)
function bnpChangeBit(n,op) {
  var r = BigInteger.ONE.shiftLeft(n);
  this.bitwiseTo(r,op,r);
  return r;
}

// (public) this | (1<<n)
function bnSetBit(n) { return this.changeBit(n,op_or); }

// (public) this & ~(1<<n)
function bnClearBit(n) { return this.changeBit(n,op_andnot); }

// (public) this ^ (1<<n)
function bnFlipBit(n) { return this.changeBit(n,op_xor); }

// (protected) r = this + a
function bnpAddTo(a,r) {
  var i = 0, c = 0, m = Math.min(a.t,this.t);
  while(i < m) {
    c += this[i]+a[i];
    r[i++] = c&this.DM;
    c >>= this.DB;
  }
  if(a.t < this.t) {
    c += a.s;
    while(i < this.t) {
      c += this[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    c += this.s;
  }
  else {
    c += this.s;
    while(i < a.t) {
      c += a[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    c += a.s;
  }
  r.s = (c<0)?-1:0;
  if(c > 0) r[i++] = c;
  else if(c < -1) r[i++] = this.DV+c;
  r.t = i;
  r.clamp();
}

// (public) this + a
function bnAdd(a) { var r = nbi(); this.addTo(a,r); return r; }

// (public) this - a
function bnSubtract(a) { var r = nbi(); this.subTo(a,r); return r; }

// (public) this * a
function bnMultiply(a) { var r = nbi(); this.multiplyTo(a,r); return r; }

// (public) this / a
function bnDivide(a) { var r = nbi(); this.divRemTo(a,r,null); return r; }

// (public) this % a
function bnRemainder(a) { var r = nbi(); this.divRemTo(a,null,r); return r; }

// (public) [this/a,this%a]
function bnDivideAndRemainder(a) {
  var q = nbi(), r = nbi();
  this.divRemTo(a,q,r);
  return new Array(q,r);
}

// (protected) this *= n, this >= 0, 1 < n < DV
function bnpDMultiply(n) {
  this[this.t] = this.am(0,n-1,this,0,0,this.t);
  ++this.t;
  this.clamp();
}

// (protected) this += n << w words, this >= 0
function bnpDAddOffset(n,w) {
  while(this.t <= w) this[this.t++] = 0;
  this[w] += n;
  while(this[w] >= this.DV) {
    this[w] -= this.DV;
    if(++w >= this.t) this[this.t++] = 0;
    ++this[w];
  }
}

// A "null" reducer
function NullExp() {}
function nNop(x) { return x; }
function nMulTo(x,y,r) { x.multiplyTo(y,r); }
function nSqrTo(x,r) { x.squareTo(r); }

NullExp.prototype.convert = nNop;
NullExp.prototype.revert = nNop;
NullExp.prototype.mulTo = nMulTo;
NullExp.prototype.sqrTo = nSqrTo;

// (public) this^e
function bnPow(e) { return this.exp(e,new NullExp()); }

// (protected) r = lower n words of "this * a", a.t <= n
// "this" should be the larger one if appropriate.
function bnpMultiplyLowerTo(a,n,r) {
  var i = Math.min(this.t+a.t,n);
  r.s = 0; // assumes a,this >= 0
  r.t = i;
  while(i > 0) r[--i] = 0;
  var j;
  for(j = r.t-this.t; i < j; ++i) r[i+this.t] = this.am(0,a[i],r,i,0,this.t);
  for(j = Math.min(a.t,n); i < j; ++i) this.am(0,a[i],r,i,0,n-i);
  r.clamp();
}

// (protected) r = "this * a" without lower n words, n > 0
// "this" should be the larger one if appropriate.
function bnpMultiplyUpperTo(a,n,r) {
  --n;
  var i = r.t = this.t+a.t-n;
  r.s = 0; // assumes a,this >= 0
  while(--i >= 0) r[i] = 0;
  for(i = Math.max(n-this.t,0); i < a.t; ++i)
    r[this.t+i-n] = this.am(n-i,a[i],r,0,0,this.t+i-n);
  r.clamp();
  r.drShiftTo(1,r);
}

// Barrett modular reduction
function Barrett(m) {
  // setup Barrett
  this.r2 = nbi();
  this.q3 = nbi();
  BigInteger.ONE.dlShiftTo(2*m.t,this.r2);
  this.mu = this.r2.divide(m);
  this.m = m;
}

function barrettConvert(x) {
  if(x.s < 0 || x.t > 2*this.m.t) return x.mod(this.m);
  else if(x.compareTo(this.m) < 0) return x;
  else { var r = nbi(); x.copyTo(r); this.reduce(r); return r; }
}

function barrettRevert(x) { return x; }

// x = x mod m (HAC 14.42)
function barrettReduce(x) {
  x.drShiftTo(this.m.t-1,this.r2);
  if(x.t > this.m.t+1) { x.t = this.m.t+1; x.clamp(); }
  this.mu.multiplyUpperTo(this.r2,this.m.t+1,this.q3);
  this.m.multiplyLowerTo(this.q3,this.m.t+1,this.r2);
  while(x.compareTo(this.r2) < 0) x.dAddOffset(1,this.m.t+1);
  x.subTo(this.r2,x);
  while(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
}

// r = x^2 mod m; x != r
function barrettSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

// r = x*y mod m; x,y != r
function barrettMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }

Barrett.prototype.convert = barrettConvert;
Barrett.prototype.revert = barrettRevert;
Barrett.prototype.reduce = barrettReduce;
Barrett.prototype.mulTo = barrettMulTo;
Barrett.prototype.sqrTo = barrettSqrTo;

// (public) this^e % m (HAC 14.85)
function bnModPow(e,m) {
  var i = e.bitLength(), k, r = nbv(1), z;
  if(i <= 0) return r;
  else if(i < 18) k = 1;
  else if(i < 48) k = 3;
  else if(i < 144) k = 4;
  else if(i < 768) k = 5;
  else k = 6;
  if(i < 8)
    z = new Classic(m);
  else if(m.isEven())
    z = new Barrett(m);
  else
    z = new Montgomery(m);

  // precomputation
  var g = new Array(), n = 3, k1 = k-1, km = (1<<k)-1;
  g[1] = z.convert(this);
  if(k > 1) {
    var g2 = nbi();
    z.sqrTo(g[1],g2);
    while(n <= km) {
      g[n] = nbi();
      z.mulTo(g2,g[n-2],g[n]);
      n += 2;
    }
  }

  var j = e.t-1, w, is1 = true, r2 = nbi(), t;
  i = nbits(e[j])-1;
  while(j >= 0) {
    if(i >= k1) w = (e[j]>>(i-k1))&km;
    else {
      w = (e[j]&((1<<(i+1))-1))<<(k1-i);
      if(j > 0) w |= e[j-1]>>(this.DB+i-k1);
    }

    n = k;
    while((w&1) == 0) { w >>= 1; --n; }
    if((i -= n) < 0) { i += this.DB; --j; }
    if(is1) {   // ret == 1, don't bother squaring or multiplying it
      g[w].copyTo(r);
      is1 = false;
    }
    else {
      while(n > 1) { z.sqrTo(r,r2); z.sqrTo(r2,r); n -= 2; }
      if(n > 0) z.sqrTo(r,r2); else { t = r; r = r2; r2 = t; }
      z.mulTo(r2,g[w],r);
    }

    while(j >= 0 && (e[j]&(1<<i)) == 0) {
      z.sqrTo(r,r2); t = r; r = r2; r2 = t;
      if(--i < 0) { i = this.DB-1; --j; }
    }
  }
  return z.revert(r);
}

// (public) gcd(this,a) (HAC 14.54)
function bnGCD(a) {
  var x = (this.s<0)?this.negate():this.clone();
  var y = (a.s<0)?a.negate():a.clone();
  if(x.compareTo(y) < 0) { var t = x; x = y; y = t; }
  var i = x.getLowestSetBit(), g = y.getLowestSetBit();
  if(g < 0) return x;
  if(i < g) g = i;
  if(g > 0) {
    x.rShiftTo(g,x);
    y.rShiftTo(g,y);
  }
  while(x.signum() > 0) {
    if((i = x.getLowestSetBit()) > 0) x.rShiftTo(i,x);
    if((i = y.getLowestSetBit()) > 0) y.rShiftTo(i,y);
    if(x.compareTo(y) >= 0) {
      x.subTo(y,x);
      x.rShiftTo(1,x);
    }
    else {
      y.subTo(x,y);
      y.rShiftTo(1,y);
    }
  }
  if(g > 0) y.lShiftTo(g,y);
  return y;
}

// (protected) this % n, n < 2^26
function bnpModInt(n) {
  if(n <= 0) return 0;
  var d = this.DV%n, r = (this.s<0)?n-1:0;
  if(this.t > 0)
    if(d == 0) r = this[0]%n;
    else for(var i = this.t-1; i >= 0; --i) r = (d*r+this[i])%n;
  return r;
}

// (public) 1/this % m (HAC 14.61)
function bnModInverse(m) {
  var ac = m.isEven();
  if((this.isEven() && ac) || m.signum() == 0) return BigInteger.ZERO;
  var u = m.clone(), v = this.clone();
  var a = nbv(1), b = nbv(0), c = nbv(0), d = nbv(1);
  while(u.signum() != 0) {
    while(u.isEven()) {
      u.rShiftTo(1,u);
      if(ac) {
        if(!a.isEven() || !b.isEven()) { a.addTo(this,a); b.subTo(m,b); }
        a.rShiftTo(1,a);
      }
      else if(!b.isEven()) b.subTo(m,b);
      b.rShiftTo(1,b);
    }
    while(v.isEven()) {
      v.rShiftTo(1,v);
      if(ac) {
        if(!c.isEven() || !d.isEven()) { c.addTo(this,c); d.subTo(m,d); }
        c.rShiftTo(1,c);
      }
      else if(!d.isEven()) d.subTo(m,d);
      d.rShiftTo(1,d);
    }
    if(u.compareTo(v) >= 0) {
      u.subTo(v,u);
      if(ac) a.subTo(c,a);
      b.subTo(d,b);
    }
    else {
      v.subTo(u,v);
      if(ac) c.subTo(a,c);
      d.subTo(b,d);
    }
  }
  if(v.compareTo(BigInteger.ONE) != 0) return BigInteger.ZERO;
  if(d.compareTo(m) >= 0) return d.subtract(m);
  if(d.signum() < 0) d.addTo(m,d); else return d;
  if(d.signum() < 0) return d.add(m); else return d;
}

var lowprimes = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509];
var lplim = (1<<26)/lowprimes[lowprimes.length-1];

// (public) test primality with certainty >= 1-.5^t
function bnIsProbablePrime(t) {
  var i, x = this.abs();
  if(x.t == 1 && x[0] <= lowprimes[lowprimes.length-1]) {
    for(i = 0; i < lowprimes.length; ++i)
      if(x[0] == lowprimes[i]) return true;
    return false;
  }
  if(x.isEven()) return false;
  i = 1;
  while(i < lowprimes.length) {
    var m = lowprimes[i], j = i+1;
    while(j < lowprimes.length && m < lplim) m *= lowprimes[j++];
    m = x.modInt(m);
    while(i < j) if(m%lowprimes[i++] == 0) return false;
  }
  return x.millerRabin(t);
}

// (protected) true if probably prime (HAC 4.24, Miller-Rabin)
function bnpMillerRabin(t) {
  var n1 = this.subtract(BigInteger.ONE);
  var k = n1.getLowestSetBit();
  if(k <= 0) return false;
  var r = n1.shiftRight(k);
  t = (t+1)>>1;
  if(t > lowprimes.length) t = lowprimes.length;
  var a = nbi();
  for(var i = 0; i < t; ++i) {
    a.fromInt(lowprimes[i]);
    var y = a.modPow(r,this);
    if(y.compareTo(BigInteger.ONE) != 0 && y.compareTo(n1) != 0) {
      var j = 1;
      while(j++ < k && y.compareTo(n1) != 0) {
        y = y.modPowInt(2,this);
        if(y.compareTo(BigInteger.ONE) == 0) return false;
      }
      if(y.compareTo(n1) != 0) return false;
    }
  }
  return true;
}

// protected
BigInteger.prototype.chunkSize = bnpChunkSize;
BigInteger.prototype.toRadix = bnpToRadix;
BigInteger.prototype.fromRadix = bnpFromRadix;
BigInteger.prototype.fromNumber = bnpFromNumber;
BigInteger.prototype.bitwiseTo = bnpBitwiseTo;
BigInteger.prototype.changeBit = bnpChangeBit;
BigInteger.prototype.addTo = bnpAddTo;
BigInteger.prototype.dMultiply = bnpDMultiply;
BigInteger.prototype.dAddOffset = bnpDAddOffset;
BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo;
BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo;
BigInteger.prototype.modInt = bnpModInt;
BigInteger.prototype.millerRabin = bnpMillerRabin;

// public
BigInteger.prototype.clone = bnClone;
BigInteger.prototype.intValue = bnIntValue;
BigInteger.prototype.byteValue = bnByteValue;
BigInteger.prototype.shortValue = bnShortValue;
BigInteger.prototype.signum = bnSigNum;
BigInteger.prototype.toByteArray = bnToByteArray;
BigInteger.prototype.equals = bnEquals;
BigInteger.prototype.min = bnMin;
BigInteger.prototype.max = bnMax;
BigInteger.prototype.and = bnAnd;
BigInteger.prototype.or = bnOr;
BigInteger.prototype.xor = bnXor;
BigInteger.prototype.andNot = bnAndNot;
BigInteger.prototype.not = bnNot;
BigInteger.prototype.shiftLeft = bnShiftLeft;
BigInteger.prototype.shiftRight = bnShiftRight;
BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit;
BigInteger.prototype.bitCount = bnBitCount;
BigInteger.prototype.testBit = bnTestBit;
BigInteger.prototype.setBit = bnSetBit;
BigInteger.prototype.clearBit = bnClearBit;
BigInteger.prototype.flipBit = bnFlipBit;
BigInteger.prototype.add = bnAdd;
BigInteger.prototype.subtract = bnSubtract;
BigInteger.prototype.multiply = bnMultiply;
BigInteger.prototype.divide = bnDivide;
BigInteger.prototype.remainder = bnRemainder;
BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder;
BigInteger.prototype.modPow = bnModPow;
BigInteger.prototype.modInverse = bnModInverse;
BigInteger.prototype.pow = bnPow;
BigInteger.prototype.gcd = bnGCD;
BigInteger.prototype.isProbablePrime = bnIsProbablePrime;

// BigInteger interfaces not implemented in jsbn:

// BigInteger(int signum, byte[] magnitude)
// double doubleValue()
// float floatValue()
// int hashCode()
// long longValue()
// static BigInteger valueOf(long val)

//end jsbn.js


//  Author: Tom Wu
//  tjw@cs.Stanford.EDU
// Random number generator - requires a PRNG backend, e.g. prng4.js

// For best results, put code like
// <body onClick='rng_seed_time();' onKeyPress='rng_seed_time();'>
// in your main HTML document.

function SecureRandom() {
  this.rng_state;
  this.rng_pool;
  this.rng_pptr;


    // Mix in a 32-bit integer into the pool
    this.rng_seed_int = function(x) {
      this.rng_pool[this.rng_pptr++] ^= x & 255;
      this.rng_pool[this.rng_pptr++] ^= (x >> 8) & 255;
      this.rng_pool[this.rng_pptr++] ^= (x >> 16) & 255;
      this.rng_pool[this.rng_pptr++] ^= (x >> 24) & 255;
      if(this.rng_pptr >= rng_psize) this.rng_pptr -= rng_psize;
    }

    // Mix in the current time (w/milliseconds) into the pool
    this.rng_seed_time = function() {
      this.rng_seed_int(new Date().getTime());
    }

    // Initialize the pool with junk if needed.
    if(this.rng_pool == null) {
      this.rng_pool = new Array();
      this.rng_pptr = 0;
      var t;
      if(navigator.appName == "Netscape" && navigator.appVersion < "5" && window.crypto) {
        // Extract entropy (256 bits) from NS4 RNG if available
        var z = window.crypto.random(32);
        for(t = 0; t < z.length; ++t)
          this.rng_pool[this.rng_pptr++] = z.charCodeAt(t) & 255;
      }
      while(this.rng_pptr < rng_psize) {  // extract some randomness from Math.random()
        t = Math.floor(65536 * Math.random());
        this.rng_pool[this.rng_pptr++] = t >>> 8;
        this.rng_pool[this.rng_pptr++] = t & 255;
      }
      this.rng_pptr = 0;
      this.rng_seed_time();
      //this.rng_seed_int(window.screenX);
      //this.rng_seed_int(window.screenY);
    }

    this.rng_get_byte = function() {
      if(this.rng_state == null) {
       this.rng_seed_time();
        this.rng_state = prng_newstate();
        this.rng_state.init(this.rng_pool);
        for(this.rng_pptr = 0; this.rng_pptr < this.rng_pool.length; ++this.rng_pptr)
          this.rng_pool[this.rng_pptr] = 0;
        this.rng_pptr = 0;
        //this.rng_pool = null;
      }
      // TODO: allow reseeding after first request
      return this.rng_state.next();
    }

    //public function
    this.nextBytes = function(ba) {
      var i;
      for(i = 0; i < ba.length; ++i) ba[i] = this.rng_get_byte();
    }
}



//end rng.js


//  Author: Tom Wu
//  tjw@cs.Stanford.EDU
// prng4.js - uses Arcfour as a PRNG

function Arcfour() {
  this.i = 0;
  this.j = 0;
  this.S = new Array();
}

// Initialize arcfour context from key, an array of ints, each from [0..255]
function ARC4init(key) {
  var i, j, t;
  for(i = 0; i < 256; ++i)
    this.S[i] = i;
  j = 0;
  for(i = 0; i < 256; ++i) {
    j = (j + this.S[i] + key[i % key.length]) & 255;
    t = this.S[i];
    this.S[i] = this.S[j];
    this.S[j] = t;
  }
  this.i = 0;
  this.j = 0;
}

function ARC4next() {
  var t;
  this.i = (this.i + 1) & 255;
  this.j = (this.j + this.S[this.i]) & 255;
  t = this.S[this.i];
  this.S[this.i] = this.S[this.j];
  this.S[this.j] = t;
  return this.S[(t + this.S[this.i]) & 255];
}

Arcfour.prototype.init = ARC4init;
Arcfour.prototype.next = ARC4next;

// Plug in your RNG constructor here
function prng_newstate() {
  return new Arcfour();
}

// Pool size must be a multiple of 4 and greater than 32.
// An array of bytes the size of the pool will be passed to init()
var rng_psize = 256;

//end prng4.js

 /*----------------------------------------------------------------------------*/
 // Copyright (c) 2009 pidder <www.pidder.com>
 // Permission to use, copy, modify, and/or distribute this software for any
 // purpose with or without fee is hereby granted, provided that the above
 // copyright notice and this permission notice appear in all copies.
 //
 // THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 // WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 // MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 // ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 // WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 // ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 // OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
/*----------------------------------------------------------------------------*/
/**
*
*  PKCS#1 encryption-style padding (type 2) En- / Decryption for use in
*  pidCrypt Library. The pidCrypt RSA module is based on the implementation
*  by Tom Wu.
*  See http://www-cs-students.stanford.edu/~tjw/jsbn/ for details and for his
*  great job.
*
*  Depends on pidCrypt (pidcrypt.js, pidcrypt_util.js), BigInteger (jsbn.js),
*  random number generator (rng.js) and a PRNG backend (prng4.js) (the random
*  number scripts are only needed for key generation).
/*----------------------------------------------------------------------------*/
 /*
 * Copyright (c) 2003-2005  Tom Wu
 * All Rights Reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS-IS" AND WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS, IMPLIED OR OTHERWISE, INCLUDING WITHOUT LIMITATION, ANY
 * WARRANTY OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.
 *
 * IN NO EVENT SHALL TOM WU BE LIABLE FOR ANY SPECIAL, INCIDENTAL,
 * INDIRECT OR CONSEQUENTIAL DAMAGES OF ANY KIND, OR ANY DAMAGES WHATSOEVER
 * RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER OR NOT ADVISED OF
 * THE POSSIBILITY OF DAMAGE, AND ON ANY THEORY OF LIABILITY, ARISING OUT
 * OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 * In addition, the following condition applies:
 *
 * All redistributions must retain an intact copy of this copyright notice
 * and disclaimer.
 */
//Address all questions regarding this license to:
//  Tom Wu
//  tjw@cs.Stanford.EDU
/*----------------------------------------------------------------------------*/
if(typeof(pidCrypt) != 'undefined' &&
   typeof(BigInteger) != 'undefined' &&//must have for rsa
   typeof(SecureRandom) != 'undefined' &&//only needed for key generation
   typeof(Arcfour) != 'undefined'//only needed for key generation
)
{

//  Author: Tom Wu
//  tjw@cs.Stanford.EDU
    // convert a (hex) string to a bignum object
        function parseBigInt(str,r) {
          return new BigInteger(str,r);
        }

        function linebrk(s,n) {
          var ret = "";
          var i = 0;
          while(i + n < s.length) {
            ret += s.substring(i,i+n) + "\n";
            i += n;
          }
          return ret + s.substring(i,s.length);
        }

        function byte2Hex(b) {
          if(b < 0x10)
            return "0" + b.toString(16);
          else
            return b.toString(16);
        }

        // Undo PKCS#1 (type 2, random) padding and, if valid, return the plaintext
        function pkcs1unpad2(d,n) {
          var b = d.toByteArray();
          var i = 0;
          while(i < b.length && b[i] == 0) ++i;
          if(b.length-i != n-1 || b[i] != 2)
            return null;
          ++i;
          while(b[i] != 0)
            if(++i >= b.length) return null;
          var ret = "";
          while(++i < b.length)
            ret += String.fromCharCode(b[i]);
          return ret;
        }

    // PKCS#1 (type 2, random) pad input string s to n bytes, and return a bigint
        function pkcs1pad2(s,n) {
          if(n < s.length + 11) {
            alert("Message too long for RSA");
            return null;
          }
          var ba = new Array();
          var i = s.length - 1;
          while(i >= 0 && n > 0) {ba[--n] = s.charCodeAt(i--);};
          ba[--n] = 0;
          var rng = new SecureRandom();
          var x = new Array();
          while(n > 2) { // random non-zero pad
            x[0] = 0;
            while(x[0] == 0) rng.nextBytes(x);
            ba[--n] = x[0];
          }
          ba[--n] = 2;
          ba[--n] = 0;
          return new BigInteger(ba);
        }
    //RSA key constructor
    pidCrypt.RSA = function() {
      this.n = null;
      this.e = 0;
      this.d = null;
      this.p = null;
      this.q = null;
      this.dmp1 = null;
      this.dmq1 = null;
      this.coeff = null;

    }
    // protected
    // Perform raw private operation on "x": return x^d (mod n)
    pidCrypt.RSA.prototype.doPrivate = function(x) {
      if(this.p == null || this.q == null)
        return x.modPow(this.d, this.n);

      // TODO: re-calculate any missing CRT params
      var xp = x.mod(this.p).modPow(this.dmp1, this.p);
      var xq = x.mod(this.q).modPow(this.dmq1, this.q);

      while(xp.compareTo(xq) < 0)
        xp = xp.add(this.p);
      return xp.subtract(xq).multiply(this.coeff).mod(this.p).multiply(this.q).add(xq);
    }


    // Set the public key fields N and e from hex strings
    pidCrypt.RSA.prototype.setPublic = function(N,E,radix) {
      if (typeof(radix) == 'undefined') radix = 16;

      if(N != null && E != null && N.length > 0 && E.length > 0) {
        this.n = parseBigInt(N,radix);
        this.e = parseInt(E,radix);
      }
      else
        alert("Invalid RSA public key");

//       alert('N='+this.n+'\nE='+this.e);
//document.writeln('Schl¨¹ssellaenge = ' + this.n.toString().length +'<BR>');
    }

    // Perform raw public operation on "x": return x^e (mod n)
    pidCrypt.RSA.prototype.doPublic = function(x) {
      return x.modPowInt(this.e, this.n);
    }

    // Return the PKCS#1 RSA encryption of "text" as an even-length hex string
    pidCrypt.RSA.prototype.encryptRaw = function(text) {
      var m = pkcs1pad2(text,(this.n.bitLength()+7)>>3);
      if(m == null) return null;
      var c = this.doPublic(m);
      if(c == null) return null;
      var h = c.toString(16);
      if((h.length & 1) == 0) return h; else return "0" + h;
    }

    pidCrypt.RSA.prototype.encrypt = function(text) {
      //base64 coding for supporting 8bit chars
      text = pidCryptUtil.encodeBase64(text);
      return this.encryptRaw(text)
    }
    // Return the PKCS#1 RSA decryption of "ctext".
    // "ctext" is an even-length hex string and the output is a plain string.
    pidCrypt.RSA.prototype.decryptRaw = function(ctext) {
//     alert('N='+this.n+'\nE='+this.e+'\nD='+this.d+'\nP='+this.p+'\nQ='+this.q+'\nDP='+this.dmp1+'\nDQ='+this.dmq1+'\nC='+this.coeff);
      var c = parseBigInt(ctext, 16);
      var m = this.doPrivate(c);
      if(m == null) return null;
      return pkcs1unpad2(m, (this.n.bitLength()+7)>>3)
    }

    pidCrypt.RSA.prototype.decrypt = function(ctext) {
      var str = this.decryptRaw(ctext)
      //base64 coding for supporting 8bit chars
      str = (str) ? pidCryptUtil.decodeBase64(str) : "";
      return str;
    }

/*
    // Return the PKCS#1 RSA encryption of "text" as a Base64-encoded string
    pidCrypt.RSA.prototype.b64_encrypt = function(text) {
      var h = this.encrypt(text);
      if(h) return hex2b64(h); else return null;
    }
*/
    // Set the private key fields N, e, and d from hex strings
    pidCrypt.RSA.prototype.setPrivate = function(N,E,D,radix) {
      if (typeof(radix) == 'undefined') radix = 16;

      if(N != null && E != null && N.length > 0 && E.length > 0) {
        this.n = parseBigInt(N,radix);
        this.e = parseInt(E,radix);
        this.d = parseBigInt(D,radix);
      }
      else
        alert("Invalid RSA private key");
    }

    // Set the private key fields N, e, d and CRT params from hex strings
    pidCrypt.RSA.prototype.setPrivateEx = function(N,E,D,P,Q,DP,DQ,C,radix) {
        if (typeof(radix) == 'undefined') radix = 16;

        if(N != null && E != null && N.length > 0 && E.length > 0) {
        this.n = parseBigInt(N,radix);//modulus
        this.e = parseInt(E,radix);//publicExponent
        this.d = parseBigInt(D,radix);//privateExponent
        this.p = parseBigInt(P,radix);//prime1
        this.q = parseBigInt(Q,radix);//prime2
        this.dmp1 = parseBigInt(DP,radix);//exponent1
        this.dmq1 = parseBigInt(DQ,radix);//exponent2
        this.coeff = parseBigInt(C,radix);//coefficient
      }
      else
        alert("Invalid RSA private key");
//     alert('N='+this.n+'\nE='+this.e+'\nD='+this.d+'\nP='+this.p+'\nQ='+this.q+'\nDP='+this.dmp1+'\nDQ='+this.dmq1+'\nC='+this.coeff);

    }

    // Generate a new random private key B bits long, using public expt E
    pidCrypt.RSA.prototype.generate = function(B,E) {
      var rng = new SecureRandom();
      var qs = B>>1;
      this.e = parseInt(E,16);
      var ee = new BigInteger(E,16);
      for(;;) {
        for(;;) {
          this.p = new BigInteger(B-qs,1,rng);
          if(this.p.subtract(BigInteger.ONE).gcd(ee).compareTo(BigInteger.ONE) == 0 && this.p.isProbablePrime(10)) break;
        }
        for(;;) {
          this.q = new BigInteger(qs,1,rng);
          if(this.q.subtract(BigInteger.ONE).gcd(ee).compareTo(BigInteger.ONE) == 0 && this.q.isProbablePrime(10)) break;
        }
        if(this.p.compareTo(this.q) <= 0) {
          var t = this.p;
          this.p = this.q;
          this.q = t;
        }
        var p1 = this.p.subtract(BigInteger.ONE);
        var q1 = this.q.subtract(BigInteger.ONE);
        var phi = p1.multiply(q1);
        if(phi.gcd(ee).compareTo(BigInteger.ONE) == 0) {
          this.n = this.p.multiply(this.q);
          this.d = ee.modInverse(phi);
          this.dmp1 = this.d.mod(p1);
          this.dmq1 = this.d.mod(q1);
          this.coeff = this.q.modInverse(this.p);
          break;
        }
      }
    }


//pidCrypt extensions start
//
    pidCrypt.RSA.prototype.getASNData = function(tree) {
        var params = {};
        var data = [];
        var p=0;

        if(tree.value && tree.type == 'INTEGER')
          data[p++] = tree.value;
        if(tree.sub)
           for(var i=0;i<tree.sub.length;i++)
           data = data.concat(this.getASNData(tree.sub[i]));

      return data;
    }

//
//
//get parameters from ASN1 structure object created from pidCrypt.ASN1.toHexTree
//e.g. A RSA Public Key gives the ASN structure object:
// {
//   SEQUENCE:
//              {
//                  INTEGER: modulus,
//                  INTEGER: public exponent
//              }
//}
    pidCrypt.RSA.prototype.setKeyFromASN = function(key,asntree) {
       var keys = ['N','E','D','P','Q','DP','DQ','C'];
       var params = {};

       var asnData = this.getASNData(asntree);
       switch(key){
           case 'Public':
           case 'public':
                for(var i=0;i<asnData.length;i++)
                  params[keys[i]] = asnData[i].toLowerCase();
                this.setPublic(params.N,params.E,16);
            break;
           case 'Private':
           case 'private':
                for(var i=1;i<asnData.length;i++)
                  params[keys[i-1]] = asnData[i].toLowerCase();
                this.setPrivateEx(params.N,params.E,params.D,params.P,params.Q,params.DP,params.DQ,params.C,16);
//                  this.setPrivate(params.N,params.E,params.D);
            break;
        }

    }

/**
 * Init RSA Encryption with public key.
 * @param  asntree: ASN1 structure object created from pidCrypt.ASN1.toHexTree
*/
   pidCrypt.RSA.prototype.setPublicKeyFromASN = function(asntree) {
        this.setKeyFromASN('public',asntree);

    }

/**
 * Init RSA Encryption with private key.
 * @param  asntree: ASN1 structure object created from pidCrypt.ASN1.toHexTree
*/
    pidCrypt.RSA.prototype.setPrivateKeyFromASN = function(asntree) {
        this.setKeyFromASN('private',asntree);
    }
/**
 * gets the current paramters as object.
 * @return params: object with RSA parameters
*/
    pidCrypt.RSA.prototype.getParameters = function() {
      var params = {}
      if(this.n != null) params.n = this.n;
      params.e = this.e;
      if(this.d != null) params.d = this.d;
      if(this.p != null) params.p = this.p;
      if(this.q != null) params.q = this.q;
      if(this.dmp1 != null) params.dmp1 = this.dmp1;
      if(this.dmq1 != null) params.dmq1 = this.dmq1;
      if(this.coeff != null) params.c = this.coeff;

      return params;
    }


//pidCrypt extensions end


}

//end rsa.js

// 3 . 全局的城市选择 3级联动 相关方法
//
var AreaData = { "110000": ["北京", "1"], "110100": ["北京市", "110000"], "110101": ["东城区", "110100"], "110102": ["西城区", "110100"], "110103": ["崇文区", "110100"], "110104": ["宣武区", "110100"], "110105": ["朝阳区", "110100"], "110106": ["丰台区", "110100"], "110107": ["石景山区", "110100"], "110108": ["海淀区", "110100"], "110109": ["门头沟区", "110100"], "110111": ["房山区", "110100"], "110112": ["通州区", "110100"], "110113": ["顺义区", "110100"], "110114": ["昌平区", "110100"], "110115": ["大兴区", "110100"], "110116": ["怀柔区", "110100"], "110117": ["平谷区", "110100"], "110228": ["密云县", "110100"], "110229": ["延庆县", "110100"], "110230": ["其它区", "110100"], "120000": ["天津", "1"], "120100": ["天津市", "120000"], "120101": ["和平区", "120100"], "120102": ["河东区", "120100"], "120103": ["河西区", "120100"], "120104": ["南开区", "120100"], "120105": ["河北区", "120100"], "120106": ["红桥区", "120100"], "120107": ["塘沽区", "120100"], "120108": ["汉沽区", "120100"], "120109": ["大港区", "120100"], "120110": ["东丽区", "120100"], "120111": ["西青区", "120100"], "120112": ["津南区", "120100"], "120113": ["北辰区", "120100"], "120114": ["武清区", "120100"], "120115": ["宝坻区", "120100"], "120116": ["滨海新区", "120100"], "120221": ["宁河县", "120100"], "120223": ["静海县", "120100"], "120225": ["蓟县", "120100"], "120226": ["其它区", "120100"], "130000": ["河北省", "1"], "130100": ["石家庄市", "130000"], "130102": ["长安区", "130100"], "130103": ["桥东区", "130100"], "130104": ["桥西区", "130100"], "130105": ["新华区", "130100"], "130107": ["井陉矿区", "130100"], "130108": ["裕华区", "130100"], "130121": ["井陉县", "130100"], "130123": ["正定县", "130100"], "130124": ["栾城县", "130100"], "130125": ["行唐县", "130100"], "130126": ["灵寿县", "130100"], "130127": ["高邑县", "130100"], "130128": ["深泽县", "130100"], "130129": ["赞皇县", "130100"], "130130": ["无极县", "130100"], "130131": ["平山县", "130100"], "130132": ["元氏县", "130100"], "130133": ["赵县", "130100"], "130181": ["辛集市", "130100"], "130182": ["藁城市", "130100"], "130183": ["晋州市", "130100"], "130184": ["新乐市", "130100"], "130185": ["鹿泉市", "130100"], "130186": ["其它区", "130100"], "130200": ["唐山市", "130000"], "130202": ["路南区", "130200"], "130203": ["路北区", "130200"], "130204": ["古冶区", "130200"], "130205": ["开平区", "130200"], "130207": ["丰南区", "130200"], "130208": ["丰润区", "130200"], "130223": ["滦县", "130200"], "130224": ["滦南县", "130200"], "130225": ["乐亭县", "130200"], "130227": ["迁西县", "130200"], "130229": ["玉田县", "130200"], "130230": ["唐海县", "130200"], "130281": ["遵化市", "130200"], "130283": ["迁安市", "130200"], "130284": ["其它区", "130200"], "130300": ["秦皇岛市", "130000"], "130302": ["海港区", "130300"], "130303": ["山海关区", "130300"], "130304": ["北戴河区", "130300"], "130321": ["青龙满族自治县", "130300"], "130322": ["昌黎县", "130300"], "130323": ["抚宁县", "130300"], "130324": ["卢龙县", "130300"], "130398": ["其它区", "130300"], "130399": ["经济技术开发区", "130300"], "130400": ["邯郸市", "130000"], "130402": ["邯山区", "130400"], "130403": ["丛台区", "130400"], "130404": ["复兴区", "130400"], "130406": ["峰峰矿区", "130400"], "130421": ["邯郸县", "130400"], "130423": ["临漳县", "130400"], "130424": ["成安县", "130400"], "130425": ["大名县", "130400"], "130426": ["涉县", "130400"], "130427": ["磁县", "130400"], "130428": ["肥乡县", "130400"], "130429": ["永年县", "130400"], "130430": ["邱县", "130400"], "130431": ["鸡泽县", "130400"], "130432": ["广平县", "130400"], "130433": ["馆陶县", "130400"], "130434": ["魏县", "130400"], "130435": ["曲周县", "130400"], "130481": ["武安市", "130400"], "130482": ["其它区", "130400"], "130500": ["邢台市", "130000"], "130502": ["桥东区", "130500"], "130503": ["桥西区", "130500"], "130521": ["邢台县", "130500"], "130522": ["临城县", "130500"], "130523": ["内丘县", "130500"], "130524": ["柏乡县", "130500"], "130525": ["隆尧县", "130500"], "130526": ["任县", "130500"], "130527": ["南和县", "130500"], "130528": ["宁晋县", "130500"], "130529": ["巨鹿县", "130500"], "130530": ["新河县", "130500"], "130531": ["广宗县", "130500"], "130532": ["平乡县", "130500"], "130533": ["威县", "130500"], "130534": ["清河县", "130500"], "130535": ["临西县", "130500"], "130581": ["南宫市", "130500"], "130582": ["沙河市", "130500"], "130583": ["其它区", "130500"], "130600": ["保定市", "130000"], "130602": ["新市区", "130600"], "130603": ["北市区", "130600"], "130604": ["南市区", "130600"], "130621": ["满城县", "130600"], "130622": ["清苑县", "130600"], "130623": ["涞水县", "130600"], "130624": ["阜平县", "130600"], "130625": ["徐水县", "130600"], "130626": ["定兴县", "130600"], "130627": ["唐县", "130600"], "130628": ["高阳县", "130600"], "130629": ["容城县", "130600"], "130630": ["涞源县", "130600"], "130631": ["望都县", "130600"], "130632": ["安新县", "130600"], "130633": ["易县", "130600"], "130634": ["曲阳县", "130600"], "130635": ["蠡县", "130600"], "130636": ["顺平县", "130600"], "130637": ["博野县", "130600"], "130638": ["雄县", "130600"], "130681": ["涿州市", "130600"], "130682": ["定州市", "130600"], "130683": ["安国市", "130600"], "130684": ["高碑店市", "130600"], "130698": ["高开区", "130600"], "130699": ["其它区", "130600"], "130700": ["张家口市", "130000"], "130702": ["桥东区", "130700"], "130703": ["桥西区", "130700"], "130705": ["宣化区", "130700"], "130706": ["下花园区", "130700"], "130721": ["宣化县", "130700"], "130722": ["张北县", "130700"], "130723": ["康保县", "130700"], "130724": ["沽源县", "130700"], "130725": ["尚义县", "130700"], "130726": ["蔚县", "130700"], "130727": ["阳原县", "130700"], "130728": ["怀安县", "130700"], "130729": ["万全县", "130700"], "130730": ["怀来县", "130700"], "130731": ["涿鹿县", "130700"], "130732": ["赤城县", "130700"], "130733": ["崇礼县", "130700"], "130734": ["其它区", "130700"], "130800": ["承德市", "130000"], "130802": ["双桥区", "130800"], "130803": ["双滦区", "130800"], "130804": ["鹰手营子矿区", "130800"], "130821": ["承德县", "130800"], "130822": ["兴隆县", "130800"], "130823": ["平泉县", "130800"], "130824": ["滦平县", "130800"], "130825": ["隆化县", "130800"], "130826": ["丰宁满族自治县", "130800"], "130827": ["宽城满族自治县", "130800"], "130828": ["围场满族蒙古族自治县", "130800"], "130829": ["其它区", "130800"], "130900": ["沧州市", "130000"], "130902": ["新华区", "130900"], "130903": ["运河区", "130900"], "130921": ["沧县", "130900"], "130922": ["青县", "130900"], "130923": ["东光县", "130900"], "130924": ["海兴县", "130900"], "130925": ["盐山县", "130900"], "130926": ["肃宁县", "130900"], "130927": ["南皮县", "130900"], "130928": ["吴桥县", "130900"], "130929": ["献县", "130900"], "130930": ["孟村回族自治县", "130900"], "130981": ["泊头市", "130900"], "130982": ["任丘市", "130900"], "130983": ["黄骅市", "130900"], "130984": ["河间市", "130900"], "130985": ["其它区", "130900"], "131000": ["廊坊市", "130000"], "131002": ["安次区", "131000"], "131003": ["广阳区", "131000"], "131022": ["固安县", "131000"], "131023": ["永清县", "131000"], "131024": ["香河县", "131000"], "131025": ["大城县", "131000"], "131026": ["文安县", "131000"], "131028": ["大厂回族自治县", "131000"], "131051": ["开发区", "131000"], "131052": ["燕郊经济技术开发区", "131000"], "131081": ["霸州市", "131000"], "131082": ["三河市", "131000"], "131083": ["其它区", "131000"], "131100": ["衡水市", "130000"], "131102": ["桃城区", "131100"], "131121": ["枣强县", "131100"], "131122": ["武邑县", "131100"], "131123": ["武强县", "131100"], "131124": ["饶阳县", "131100"], "131125": ["安平县", "131100"], "131126": ["故城县", "131100"], "131127": ["景县", "131100"], "131128": ["阜城县", "131100"], "131181": ["冀州市", "131100"], "131182": ["深州市", "131100"], "131183": ["其它区", "131100"], "140000": ["山西省", "1"], "140100": ["太原市", "140000"], "140105": ["小店区", "140100"], "140106": ["迎泽区", "140100"], "140107": ["杏花岭区", "140100"], "140108": ["尖草坪区", "140100"], "140109": ["万柏林区", "140100"], "140110": ["晋源区", "140100"], "140121": ["清徐县", "140100"], "140122": ["阳曲县", "140100"], "140123": ["娄烦县", "140100"], "140181": ["古交市", "140100"], "140182": ["其它区", "140100"], "140200": ["大同市", "140000"], "140202": ["城区", "140200"], "140203": ["矿区", "140200"], "140211": ["南郊区", "140200"], "140212": ["新荣区", "140200"], "140221": ["阳高县", "140200"], "140222": ["天镇县", "140200"], "140223": ["广灵县", "140200"], "140224": ["灵丘县", "140200"], "140225": ["浑源县", "140200"], "140226": ["左云县", "140200"], "140227": ["大同县", "140200"], "140228": ["其它区", "140200"], "140300": ["阳泉市", "140000"], "140302": ["城区", "140300"], "140303": ["矿区", "140300"], "140311": ["郊区", "140300"], "140321": ["平定县", "140300"], "140322": ["盂县", "140300"], "140323": ["其它区", "140300"], "140400": ["长治市", "140000"], "140421": ["长治县", "140400"], "140423": ["襄垣县", "140400"], "140424": ["屯留县", "140400"], "140425": ["平顺县", "140400"], "140426": ["黎城县", "140400"], "140427": ["壶关县", "140400"], "140428": ["长子县", "140400"], "140429": ["武乡县", "140400"], "140430": ["沁县", "140400"], "140431": ["沁源县", "140400"], "140481": ["潞城市", "140400"], "140482": ["城区", "140400"], "140483": ["郊区", "140400"], "140484": ["高新区", "140400"], "140485": ["其它区", "140400"], "140500": ["晋城市", "140000"], "140502": ["城区", "140500"], "140521": ["沁水县", "140500"], "140522": ["阳城县", "140500"], "140524": ["陵川县", "140500"], "140525": ["泽州县", "140500"], "140581": ["高平市", "140500"], "140582": ["其它区", "140500"], "140600": ["朔州市", "140000"], "140602": ["朔城区", "140600"], "140603": ["平鲁区", "140600"], "140621": ["山阴县", "140600"], "140622": ["应县", "140600"], "140623": ["右玉县", "140600"], "140624": ["怀仁县", "140600"], "140625": ["其它区", "140600"], "140700": ["晋中市", "140000"], "140702": ["榆次区", "140700"], "140721": ["榆社县", "140700"], "140722": ["左权县", "140700"], "140723": ["和顺县", "140700"], "140724": ["昔阳县", "140700"], "140725": ["寿阳县", "140700"], "140726": ["太谷县", "140700"], "140727": ["祁县", "140700"], "140728": ["平遥县", "140700"], "140729": ["灵石县", "140700"], "140781": ["介休市", "140700"], "140782": ["其它区", "140700"], "140800": ["运城市", "140000"], "140802": ["盐湖区", "140800"], "140821": ["临猗县", "140800"], "140822": ["万荣县", "140800"], "140823": ["闻喜县", "140800"], "140824": ["稷山县", "140800"], "140825": ["新绛县", "140800"], "140826": ["绛县", "140800"], "140827": ["垣曲县", "140800"], "140828": ["夏县", "140800"], "140829": ["平陆县", "140800"], "140830": ["芮城县", "140800"], "140881": ["永济市", "140800"], "140882": ["河津市", "140800"], "140883": ["其它区", "140800"], "140900": ["忻州市", "140000"], "140902": ["忻府区", "140900"], "140921": ["定襄县", "140900"], "140922": ["五台县", "140900"], "140923": ["代县", "140900"], "140924": ["繁峙县", "140900"], "140925": ["宁武县", "140900"], "140926": ["静乐县", "140900"], "140927": ["神池县", "140900"], "140928": ["五寨县", "140900"], "140929": ["岢岚县", "140900"], "140930": ["河曲县", "140900"], "140931": ["保德县", "140900"], "140932": ["偏关县", "140900"], "140981": ["原平市", "140900"], "140982": ["其它区", "140900"], "141000": ["临汾市", "140000"], "141002": ["尧都区", "141000"], "141021": ["曲沃县", "141000"], "141022": ["翼城县", "141000"], "141023": ["襄汾县", "141000"], "141024": ["洪洞县", "141000"], "141025": ["古县", "141000"], "141026": ["安泽县", "141000"], "141027": ["浮山县", "141000"], "141028": ["吉县", "141000"], "141029": ["乡宁县", "141000"], "141030": ["大宁县", "141000"], "141031": ["隰县", "141000"], "141032": ["永和县", "141000"], "141033": ["蒲县", "141000"], "141034": ["汾西县", "141000"], "141081": ["侯马市", "141000"], "141082": ["霍州市", "141000"], "141083": ["其它区", "141000"], "141100": ["吕梁市", "140000"], "141102": ["离石区", "141100"], "141121": ["文水县", "141100"], "141122": ["交城县", "141100"], "141123": ["兴县", "141100"], "141124": ["临县", "141100"], "141125": ["柳林县", "141100"], "141126": ["石楼县", "141100"], "141127": ["岚县", "141100"], "141128": ["方山县", "141100"], "141129": ["中阳县", "141100"], "141130": ["交口县", "141100"], "141181": ["孝义市", "141100"], "141182": ["汾阳市", "141100"], "141183": ["其它区", "141100"], "150000": ["内蒙古自治区", "1"], "150100": ["呼和浩特市", "150000"], "150102": ["新城区", "150100"], "150103": ["回民区", "150100"], "150104": ["玉泉区", "150100"], "150105": ["赛罕区", "150100"], "150121": ["土默特左旗", "150100"], "150122": ["托克托县", "150100"], "150123": ["和林格尔县", "150100"], "150124": ["清水河县", "150100"], "150125": ["武川县", "150100"], "150126": ["其它区", "150100"], "150200": ["包头市", "150000"], "150202": ["东河区", "150200"], "150203": ["昆都仑区", "150200"], "150204": ["青山区", "150200"], "150205": ["石拐区", "150200"], "150206": ["白云矿区", "150200"], "150207": ["九原区", "150200"], "150221": ["土默特右旗", "150200"], "150222": ["固阳县", "150200"], "150223": ["达尔罕茂明安联合旗", "150200"], "150224": ["其它区", "150200"], "150300": ["乌海市", "150000"], "150302": ["海勃湾区", "150300"], "150303": ["海南区", "150300"], "150304": ["乌达区", "150300"], "150305": ["其它区", "150300"], "150400": ["赤峰市", "150000"], "150402": ["红山区", "150400"], "150403": ["元宝山区", "150400"], "150404": ["松山区", "150400"], "150421": ["阿鲁科尔沁旗", "150400"], "150422": ["巴林左旗", "150400"], "150423": ["巴林右旗", "150400"], "150424": ["林西县", "150400"], "150425": ["克什克腾旗", "150400"], "150426": ["翁牛特旗", "150400"], "150428": ["喀喇沁旗", "150400"], "150429": ["宁城县", "150400"], "150430": ["敖汉旗", "150400"], "150431": ["其它区", "150400"], "150500": ["通辽市", "150000"], "150502": ["科尔沁区", "150500"], "150521": ["科尔沁左翼中旗", "150500"], "150522": ["科尔沁左翼后旗", "150500"], "150523": ["开鲁县", "150500"], "150524": ["库伦旗", "150500"], "150525": ["奈曼旗", "150500"], "150526": ["扎鲁特旗", "150500"], "150581": ["霍林郭勒市", "150500"], "150582": ["其它区", "150500"], "150600": ["鄂尔多斯市", "150000"], "150602": ["东胜区", "150600"], "150621": ["达拉特旗", "150600"], "150622": ["准格尔旗", "150600"], "150623": ["鄂托克前旗", "150600"], "150624": ["鄂托克旗", "150600"], "150625": ["杭锦旗", "150600"], "150626": ["乌审旗", "150600"], "150627": ["伊金霍洛旗", "150600"], "150628": ["其它区", "150600"], "150700": ["呼伦贝尔市", "150000"], "150702": ["海拉尔区", "150700"], "150721": ["阿荣旗", "150700"], "150722": ["莫力达瓦达斡尔族自治旗", "150700"], "150723": ["鄂伦春自治旗", "150700"], "150724": ["鄂温克族自治旗", "150700"], "150725": ["陈巴尔虎旗", "150700"], "150726": ["新巴尔虎左旗", "150700"], "150727": ["新巴尔虎右旗", "150700"], "150781": ["满洲里市", "150700"], "150782": ["牙克石市", "150700"], "150783": ["扎兰屯市", "150700"], "150784": ["额尔古纳市", "150700"], "150785": ["根河市", "150700"], "150786": ["其它区", "150700"], "150800": ["巴彦淖尔市", "150000"], "150802": ["临河区", "150800"], "150821": ["五原县", "150800"], "150822": ["磴口县", "150800"], "150823": ["乌拉特前旗", "150800"], "150824": ["乌拉特中旗", "150800"], "150825": ["乌拉特后旗", "150800"], "150826": ["杭锦后旗", "150800"], "150827": ["其它区", "150800"], "150900": ["乌兰察布市", "150000"], "150902": ["集宁区", "150900"], "150921": ["卓资县", "150900"], "150922": ["化德县", "150900"], "150923": ["商都县", "150900"], "150924": ["兴和县", "150900"], "150925": ["凉城县", "150900"], "150926": ["察哈尔右翼前旗", "150900"], "150927": ["察哈尔右翼中旗", "150900"], "150928": ["察哈尔右翼后旗", "150900"], "150929": ["四子王旗", "150900"], "150981": ["丰镇市", "150900"], "150982": ["其它区", "150900"], "152200": ["兴安盟", "150000"], "152201": ["乌兰浩特市", "152200"], "152202": ["阿尔山市", "152200"], "152221": ["科尔沁右翼前旗", "152200"], "152222": ["科尔沁右翼中旗", "152200"], "152223": ["扎赉特旗", "152200"], "152224": ["突泉县", "152200"], "152225": ["其它区", "152200"], "152500": ["锡林郭勒盟", "150000"], "152501": ["二连浩特市", "152500"], "152502": ["锡林浩特市", "152500"], "152522": ["阿巴嘎旗", "152500"], "152523": ["苏尼特左旗", "152500"], "152524": ["苏尼特右旗", "152500"], "152525": ["东乌珠穆沁旗", "152500"], "152526": ["西乌珠穆沁旗", "152500"], "152527": ["太仆寺旗", "152500"], "152528": ["镶黄旗", "152500"], "152529": ["正镶白旗", "152500"], "152530": ["正蓝旗", "152500"], "152531": ["多伦县", "152500"], "152532": ["其它区", "152500"], "152900": ["阿拉善盟", "150000"], "152921": ["阿拉善左旗", "152900"], "152922": ["阿拉善右旗", "152900"], "152923": ["额济纳旗", "152900"], "152924": ["其它区", "152900"], "210000": ["辽宁省", "1"], "210100": ["沈阳市", "210000"], "210102": ["和平区", "210100"], "210103": ["沈河区", "210100"], "210104": ["大东区", "210100"], "210105": ["皇姑区", "210100"], "210106": ["铁西区", "210100"], "210111": ["苏家屯区", "210100"], "210112": ["东陵区", "210100"], "210113": ["新城子区", "210100"], "210114": ["于洪区", "210100"], "210122": ["辽中县", "210100"], "210123": ["康平县", "210100"], "210124": ["法库县", "210100"], "210181": ["新民市", "210100"], "210182": ["浑南新区", "210100"], "210183": ["张士开发区", "210100"], "210184": ["沈北新区", "210100"], "210185": ["其它区", "210100"], "210200": ["大连市", "210000"], "210202": ["中山区", "210200"], "210203": ["西岗区", "210200"], "210204": ["沙河口区", "210200"], "210211": ["甘井子区", "210200"], "210212": ["旅顺口区", "210200"], "210213": ["金州区", "210200"], "210224": ["长海县", "210200"], "210251": ["开发区", "210200"], "210281": ["瓦房店市", "210200"], "210282": ["普兰店市", "210200"], "210283": ["庄河市", "210200"], "210297": ["岭前区", "210200"], "210298": ["其它区", "210200"], "210300": ["鞍山市", "210000"], "210302": ["铁东区", "210300"], "210303": ["铁西区", "210300"], "210304": ["立山区", "210300"], "210311": ["千山区", "210300"], "210321": ["台安县", "210300"], "210323": ["岫岩满族自治县", "210300"], "210351": ["高新区", "210300"], "210381": ["海城市", "210300"], "210382": ["其它区", "210300"], "210400": ["抚顺市", "210000"], "210402": ["新抚区", "210400"], "210403": ["东洲区", "210400"], "210404": ["望花区", "210400"], "210411": ["顺城区", "210400"], "210421": ["抚顺县", "210400"], "210422": ["新宾满族自治县", "210400"], "210423": ["清原满族自治县", "210400"], "210424": ["其它区", "210400"], "210500": ["本溪市", "210000"], "210502": ["平山区", "210500"], "210503": ["溪湖区", "210500"], "210504": ["明山区", "210500"], "210505": ["南芬区", "210500"], "210521": ["本溪满族自治县", "210500"], "210522": ["桓仁满族自治县", "210500"], "210523": ["其它区", "210500"], "210600": ["丹东市", "210000"], "210602": ["元宝区", "210600"], "210603": ["振兴区", "210600"], "210604": ["振安区", "210600"], "210624": ["宽甸满族自治县", "210600"], "210681": ["东港市", "210600"], "210682": ["凤城市", "210600"], "210683": ["其它区", "210600"], "210700": ["锦州市", "210000"], "210702": ["古塔区", "210700"], "210703": ["凌河区", "210700"], "210711": ["太和区", "210700"], "210726": ["黑山县", "210700"], "210727": ["义县", "210700"], "210781": ["凌海市", "210700"], "210782": ["北镇市", "210700"], "210783": ["其它区", "210700"], "210800": ["营口市", "210000"], "210802": ["站前区", "210800"], "210803": ["西市区", "210800"], "210804": ["鲅鱼圈区", "210800"], "210811": ["老边区", "210800"], "210881": ["盖州市", "210800"], "210882": ["大石桥市", "210800"], "210883": ["其它区", "210800"], "210900": ["阜新市", "210000"], "210902": ["海州区", "210900"], "210903": ["新邱区", "210900"], "210904": ["太平区", "210900"], "210905": ["清河门区", "210900"], "210911": ["细河区", "210900"], "210921": ["阜新蒙古族自治县", "210900"], "210922": ["彰武县", "210900"], "210923": ["其它区", "210900"], "211000": ["辽阳市", "210000"], "211002": ["白塔区", "211000"], "211003": ["文圣区", "211000"], "211004": ["宏伟区", "211000"], "211005": ["弓长岭区", "211000"], "211011": ["太子河区", "211000"], "211021": ["辽阳县", "211000"], "211081": ["灯塔市", "211000"], "211082": ["其它区", "211000"], "211100": ["盘锦市", "210000"], "211102": ["双台子区", "211100"], "211103": ["兴隆台区", "211100"], "211121": ["大洼县", "211100"], "211122": ["盘山县", "211100"], "211123": ["其它区", "211100"], "211200": ["铁岭市", "210000"], "211202": ["银州区", "211200"], "211204": ["清河区", "211200"], "211221": ["铁岭县", "211200"], "211223": ["西丰县", "211200"], "211224": ["昌图县", "211200"], "211281": ["调兵山市", "211200"], "211282": ["开原市", "211200"], "211283": ["其它区", "211200"], "211300": ["朝阳市", "210000"], "211302": ["双塔区", "211300"], "211303": ["龙城区", "211300"], "211321": ["朝阳县", "211300"], "211322": ["建平县", "211300"], "211324": ["喀喇沁左翼蒙古族自治县", "211300"], "211381": ["北票市", "211300"], "211382": ["凌源市", "211300"], "211383": ["其它区", "211300"], "211400": ["葫芦岛市", "210000"], "211402": ["连山区", "211400"], "211403": ["龙港区", "211400"], "211404": ["南票区", "211400"], "211421": ["绥中县", "211400"], "211422": ["建昌县", "211400"], "211481": ["兴城市", "211400"], "211482": ["其它区", "211400"], "220000": ["吉林省", "1"], "220100": ["长春市", "220000"], "220102": ["南关区", "220100"], "220103": ["宽城区", "220100"], "220104": ["朝阳区", "220100"], "220105": ["二道区", "220100"], "220106": ["绿园区", "220100"], "220112": ["双阳区", "220100"], "220122": ["农安县", "220100"], "220181": ["九台市", "220100"], "220182": ["榆树市", "220100"], "220183": ["德惠市", "220100"], "220184": ["高新技术产业开发区", "220100"], "220185": ["汽车产业开发区", "220100"], "220186": ["经济技术开发区", "220100"], "220187": ["净月旅游开发区", "220100"], "220188": ["其它区", "220100"], "220200": ["吉林市", "220000"], "220202": ["昌邑区", "220200"], "220203": ["龙潭区", "220200"], "220204": ["船营区", "220200"], "220211": ["丰满区", "220200"], "220221": ["永吉县", "220200"], "220281": ["蛟河市", "220200"], "220282": ["桦甸市", "220200"], "220283": ["舒兰市", "220200"], "220284": ["磐石市", "220200"], "220285": ["其它区", "220200"], "220300": ["四平市", "220000"], "220302": ["铁西区", "220300"], "220303": ["铁东区", "220300"], "220322": ["梨树县", "220300"], "220323": ["伊通满族自治县", "220300"], "220381": ["公主岭市", "220300"], "220382": ["双辽市", "220300"], "220383": ["其它区", "220300"], "220400": ["辽源市", "220000"], "220402": ["龙山区", "220400"], "220403": ["西安区", "220400"], "220421": ["东丰县", "220400"], "220422": ["东辽县", "220400"], "220423": ["其它区", "220400"], "220500": ["通化市", "220000"], "220502": ["东昌区", "220500"], "220503": ["二道江区", "220500"], "220521": ["通化县", "220500"], "220523": ["辉南县", "220500"], "220524": ["柳河县", "220500"], "220581": ["梅河口市", "220500"], "220582": ["集安市", "220500"], "220583": ["其它区", "220500"], "220600": ["白山市", "220000"], "220602": ["八道江区", "220600"], "220621": ["抚松县", "220600"], "220622": ["靖宇县", "220600"], "220623": ["长白朝鲜族自治县", "220600"], "220625": ["江源县", "220600"], "220681": ["临江市", "220600"], "220682": ["其它区", "220600"], "220700": ["松原市", "220000"], "220702": ["宁江区", "220700"], "220721": ["前郭尔罗斯蒙古族自治县", "220700"], "220722": ["长岭县", "220700"], "220723": ["乾安县", "220700"], "220724": ["扶余县", "220700"], "220725": ["其它区", "220700"], "220800": ["白城市", "220000"], "220802": ["洮北区", "220800"], "220821": ["镇赉县", "220800"], "220822": ["通榆县", "220800"], "220881": ["洮南市", "220800"], "220882": ["大安市", "220800"], "220883": ["其它区", "220800"], "222400": ["延边朝鲜族自治州", "220000"], "222401": ["延吉市", "222400"], "222402": ["图们市", "222400"], "222403": ["敦化市", "222400"], "222404": ["珲春市", "222400"], "222405": ["龙井市", "222400"], "222406": ["和龙市", "222400"], "222424": ["汪清县", "222400"], "222426": ["安图县", "222400"], "222427": ["其它区", "222400"], "230000": ["黑龙江省", "1"], "230100": ["哈尔滨市", "230000"], "230102": ["道里区", "230100"], "230103": ["南岗区", "230100"], "230104": ["道外区", "230100"], "230106": ["香坊区", "230100"], "230107": ["动力区", "230100"], "230108": ["平房区", "230100"], "230109": ["松北区", "230100"], "230111": ["呼兰区", "230100"], "230123": ["依兰县", "230100"], "230124": ["方正县", "230100"], "230125": ["宾县", "230100"], "230126": ["巴彦县", "230100"], "230127": ["木兰县", "230100"], "230128": ["通河县", "230100"], "230129": ["延寿县", "230100"], "230181": ["阿城市", "230100"], "230182": ["双城市", "230100"], "230183": ["尚志市", "230100"], "230184": ["五常市", "230100"], "230185": ["阿城市", "230100"], "230186": ["其它区", "230100"], "230200": ["齐齐哈尔市", "230000"], "230202": ["龙沙区", "230200"], "230203": ["建华区", "230200"], "230204": ["铁锋区", "230200"], "230205": ["昂昂溪区", "230200"], "230206": ["富拉尔基区", "230200"], "230207": ["碾子山区", "230200"], "230208": ["梅里斯达斡尔族区", "230200"], "230221": ["龙江县", "230200"], "230223": ["依安县", "230200"], "230224": ["泰来县", "230200"], "230225": ["甘南县", "230200"], "230227": ["富裕县", "230200"], "230229": ["克山县", "230200"], "230230": ["克东县", "230200"], "230231": ["拜泉县", "230200"], "230281": ["讷河市", "230200"], "230282": ["其它区", "230200"], "230300": ["鸡西市", "230000"], "230302": ["鸡冠区", "230300"], "230303": ["恒山区", "230300"], "230304": ["滴道区", "230300"], "230305": ["梨树区", "230300"], "230306": ["城子河区", "230300"], "230307": ["麻山区", "230300"], "230321": ["鸡东县", "230300"], "230381": ["虎林市", "230300"], "230382": ["密山市", "230300"], "230383": ["其它区", "230300"], "230400": ["鹤岗市", "230000"], "230402": ["向阳区", "230400"], "230403": ["工农区", "230400"], "230404": ["南山区", "230400"], "230405": ["兴安区", "230400"], "230406": ["东山区", "230400"], "230407": ["兴山区", "230400"], "230421": ["萝北县", "230400"], "230422": ["绥滨县", "230400"], "230423": ["其它区", "230400"], "230500": ["双鸭山市", "230000"], "230502": ["尖山区", "230500"], "230503": ["岭东区", "230500"], "230505": ["四方台区", "230500"], "230506": ["宝山区", "230500"], "230521": ["集贤县", "230500"], "230522": ["友谊县", "230500"], "230523": ["宝清县", "230500"], "230524": ["饶河县", "230500"], "230525": ["其它区", "230500"], "230600": ["大庆市", "230000"], "230602": ["萨尔图区", "230600"], "230603": ["龙凤区", "230600"], "230604": ["让胡路区", "230600"], "230605": ["红岗区", "230600"], "230606": ["大同区", "230600"], "230621": ["肇州县", "230600"], "230622": ["肇源县", "230600"], "230623": ["林甸县", "230600"], "230624": ["杜尔伯特蒙古族自治县", "230600"], "230625": ["其它区", "230600"], "230700": ["伊春市", "230000"], "230702": ["伊春区", "230700"], "230703": ["南岔区", "230700"], "230704": ["友好区", "230700"], "230705": ["西林区", "230700"], "230706": ["翠峦区", "230700"], "230707": ["新青区", "230700"], "230708": ["美溪区", "230700"], "230709": ["金山屯区", "230700"], "230710": ["五营区", "230700"], "230711": ["乌马河区", "230700"], "230712": ["汤旺河区", "230700"], "230713": ["带岭区", "230700"], "230714": ["乌伊岭区", "230700"], "230715": ["红星区", "230700"], "230716": ["上甘岭区", "230700"], "230722": ["嘉荫县", "230700"], "230781": ["铁力市", "230700"], "230782": ["其它区", "230700"], "230800": ["佳木斯市", "230000"], "230802": ["永红区", "230800"], "230803": ["向阳区", "230800"], "230804": ["前进区", "230800"], "230805": ["东风区", "230800"], "230811": ["郊区", "230800"], "230822": ["桦南县", "230800"], "230826": ["桦川县", "230800"], "230828": ["汤原县", "230800"], "230833": ["抚远县", "230800"], "230881": ["同江市", "230800"], "230882": ["富锦市", "230800"], "230883": ["其它区", "230800"], "230900": ["七台河市", "230000"], "230902": ["新兴区", "230900"], "230903": ["桃山区", "230900"], "230904": ["茄子河区", "230900"], "230921": ["勃利县", "230900"], "230922": ["其它区", "230900"], "231000": ["牡丹江市", "230000"], "231002": ["东安区", "231000"], "231003": ["阳明区", "231000"], "231004": ["爱民区", "231000"], "231005": ["西安区", "231000"], "231024": ["东宁县", "231000"], "231025": ["林口县", "231000"], "231081": ["绥芬河市", "231000"], "231083": ["海林市", "231000"], "231084": ["宁安市", "231000"], "231085": ["穆棱市", "231000"], "231086": ["其它区", "231000"], "231100": ["黑河市", "230000"], "231102": ["爱辉区", "231100"], "231121": ["嫩江县", "231100"], "231123": ["逊克县", "231100"], "231124": ["孙吴县", "231100"], "231181": ["北安市", "231100"], "231182": ["五大连池市", "231100"], "231183": ["其它区", "231100"], "231200": ["绥化市", "230000"], "231202": ["北林区", "231200"], "231221": ["望奎县", "231200"], "231222": ["兰西县", "231200"], "231223": ["青冈县", "231200"], "231224": ["庆安县", "231200"], "231225": ["明水县", "231200"], "231226": ["绥棱县", "231200"], "231281": ["安达市", "231200"], "231282": ["肇东市", "231200"], "231283": ["海伦市", "231200"], "231284": ["其它区", "231200"], "232700": ["大兴安岭地区", "230000"], "232721": ["呼玛县", "232700"], "232722": ["塔河县", "232700"], "232723": ["漠河县", "232700"], "232724": ["加格达奇区", "232700"], "232725": ["其它区", "232700"], "310000": ["上海", "1"], "310100": ["上海市", "310000"], "310101": ["黄浦区", "310100"], "310103": ["卢湾区", "310100"], "310104": ["徐汇区", "310100"], "310105": ["长宁区", "310100"], "310106": ["静安区", "310100"], "310107": ["普陀区", "310100"], "310108": ["闸北区", "310100"], "310109": ["虹口区", "310100"], "310110": ["杨浦区", "310100"], "310112": ["闵行区", "310100"], "310113": ["宝山区", "310100"], "310114": ["嘉定区", "310100"], "310115": ["浦东新区", "310100"], "310116": ["金山区", "310100"], "310117": ["松江区", "310100"], "310118": ["青浦区", "310100"], "310119": ["南汇区", "310100"], "310120": ["奉贤区", "310100"], "310152": ["川沙区", "310100"], "310230": ["崇明县", "310100"], "310231": ["其它区", "310100"], "320000": ["江苏省", "1"], "320100": ["南京市", "320000"], "320102": ["玄武区", "320100"], "320103": ["白下区", "320100"], "320104": ["秦淮区", "320100"], "320105": ["建邺区", "320100"], "320106": ["鼓楼区", "320100"], "320107": ["下关区", "320100"], "320111": ["浦口区", "320100"], "320113": ["栖霞区", "320100"], "320114": ["雨花台区", "320100"], "320115": ["江宁区", "320100"], "320116": ["六合区", "320100"], "320124": ["溧水县", "320100"], "320125": ["高淳县", "320100"], "320126": ["其它区", "320100"], "320200": ["无锡市", "320000"], "320202": ["崇安区", "320200"], "320203": ["南长区", "320200"], "320204": ["北塘区", "320200"], "320205": ["锡山区", "320200"], "320206": ["惠山区", "320200"], "320211": ["滨湖区", "320200"], "320281": ["江阴市", "320200"], "320282": ["宜兴市", "320200"], "320296": ["新区", "320200"], "320297": ["其它区", "320200"], "320300": ["徐州市", "320000"], "320302": ["鼓楼区", "320300"], "320303": ["云龙区", "320300"], "320304": ["九里区", "320300"], "320305": ["贾汪区", "320300"], "320311": ["泉山区", "320300"], "320321": ["丰县", "320300"], "320322": ["沛县", "320300"], "320323": ["铜山县", "320300"], "320324": ["睢宁县", "320300"], "320381": ["新沂市", "320300"], "320382": ["邳州市", "320300"], "320383": ["其它区", "320300"], "320400": ["常州市", "320000"], "320402": ["天宁区", "320400"], "320404": ["钟楼区", "320400"], "320405": ["戚墅堰区", "320400"], "320411": ["新北区", "320400"], "320412": ["武进区", "320400"], "320481": ["溧阳市", "320400"], "320482": ["金坛市", "320400"], "320483": ["其它区", "320400"], "320500": ["苏州市", "320000"], "320502": ["沧浪区", "320500"], "320503": ["平江区", "320500"], "320504": ["金阊区", "320500"], "320505": ["虎丘区", "320500"], "320506": ["吴中区", "320500"], "320507": ["相城区", "320500"], "320581": ["常熟市", "320500"], "320582": ["张家港市", "320500"], "320583": ["昆山市", "320500"], "320584": ["吴江市", "320500"], "320585": ["太仓市", "320500"], "320594": ["新区", "320500"], "320595": ["园区", "320500"], "320596": ["其它区", "320500"], "320600": ["南通市", "320000"], "320602": ["崇川区", "320600"], "320611": ["港闸区", "320600"], "320612": ["通州区", "320600"], "320621": ["海安县", "320600"], "320623": ["如东县", "320600"], "320681": ["启东市", "320600"], "320682": ["如皋市", "320600"], "320683": ["通州市", "320600"], "320684": ["海门市", "320600"], "320693": ["开发区", "320600"], "320694": ["其它区", "320600"], "320700": ["连云港市", "320000"], "320703": ["连云区", "320700"], "320705": ["新浦区", "320700"], "320706": ["海州区", "320700"], "320721": ["赣榆县", "320700"], "320722": ["东海县", "320700"], "320723": ["灌云县", "320700"], "320724": ["灌南县", "320700"], "320725": ["其它区", "320700"], "320800": ["淮安市", "320000"], "320802": ["清河区", "320800"], "320803": ["楚州区", "320800"], "320804": ["淮阴区", "320800"], "320811": ["清浦区", "320800"], "320826": ["涟水县", "320800"], "320829": ["洪泽县", "320800"], "320830": ["盱眙县", "320800"], "320831": ["金湖县", "320800"], "320832": ["其它区", "320800"], "320900": ["盐城市", "320000"], "320902": ["亭湖区", "320900"], "320903": ["盐都区", "320900"], "320921": ["响水县", "320900"], "320922": ["滨海县", "320900"], "320923": ["阜宁县", "320900"], "320924": ["射阳县", "320900"], "320925": ["建湖县", "320900"], "320981": ["东台市", "320900"], "320982": ["大丰市", "320900"], "320983": ["其它区", "320900"], "321000": ["扬州市", "320000"], "321002": ["广陵区", "321000"], "321003": ["邗江区", "321000"], "321011": ["维扬区", "321000"], "321023": ["宝应县", "321000"], "321081": ["仪征市", "321000"], "321084": ["高邮市", "321000"], "321088": ["江都市", "321000"], "321092": ["经济开发区", "321000"], "321093": ["其它区", "321000"], "321100": ["镇江市", "320000"], "321102": ["京口区", "321100"], "321111": ["润州区", "321100"], "321112": ["丹徒区", "321100"], "321181": ["丹阳市", "321100"], "321182": ["扬中市", "321100"], "321183": ["句容市", "321100"], "321184": ["其它区", "321100"], "321200": ["泰州市", "320000"], "321202": ["海陵区", "321200"], "321203": ["高港区", "321200"], "321281": ["兴化市", "321200"], "321282": ["靖江市", "321200"], "321283": ["泰兴市", "321200"], "321284": ["姜堰市", "321200"], "321285": ["其它区", "321200"], "321300": ["宿迁市", "320000"], "321302": ["宿城区", "321300"], "321311": ["宿豫区", "321300"], "321322": ["沭阳县", "321300"], "321323": ["泗阳县", "321300"], "321324": ["泗洪县", "321300"], "321325": ["其它区", "321300"], "330000": ["浙江省", "1"], "330100": ["杭州市", "330000"], "330102": ["上城区", "330100"], "330103": ["下城区", "330100"], "330104": ["江干区", "330100"], "330105": ["拱墅区", "330100"], "330106": ["西湖区", "330100"], "330108": ["滨江区", "330100"], "330109": ["萧山区", "330100"], "330110": ["余杭区", "330100"], "330122": ["桐庐县", "330100"], "330127": ["淳安县", "330100"], "330182": ["建德市", "330100"], "330183": ["富阳市", "330100"], "330185": ["临安市", "330100"], "330186": ["其它区", "330100"], "330200": ["宁波市", "330000"], "330203": ["海曙区", "330200"], "330204": ["江东区", "330200"], "330205": ["江北区", "330200"], "330206": ["北仑区", "330200"], "330211": ["镇海区", "330200"], "330212": ["鄞州区", "330200"], "330225": ["象山县", "330200"], "330226": ["宁海县", "330200"], "330281": ["余姚市", "330200"], "330282": ["慈溪市", "330200"], "330283": ["奉化市", "330200"], "330284": ["其它区", "330200"], "330300": ["温州市", "330000"], "330302": ["鹿城区", "330300"], "330303": ["龙湾区", "330300"], "330304": ["瓯海区", "330300"], "330322": ["洞头县", "330300"], "330324": ["永嘉县", "330300"], "330326": ["平阳县", "330300"], "330327": ["苍南县", "330300"], "330328": ["文成县", "330300"], "330329": ["泰顺县", "330300"], "330381": ["瑞安市", "330300"], "330382": ["乐清市", "330300"], "330383": ["其它区", "330300"], "330400": ["嘉兴市", "330000"], "330402": ["南湖区", "330400"], "330411": ["秀洲区", "330400"], "330421": ["嘉善县", "330400"], "330424": ["海盐县", "330400"], "330481": ["海宁市", "330400"], "330482": ["平湖市", "330400"], "330483": ["桐乡市", "330400"], "330484": ["其它区", "330400"], "330500": ["湖州市", "330000"], "330502": ["吴兴区", "330500"], "330503": ["南浔区", "330500"], "330521": ["德清县", "330500"], "330522": ["长兴县", "330500"], "330523": ["安吉县", "330500"], "330524": ["其它区", "330500"], "330600": ["绍兴市", "330000"], "330602": ["越城区", "330600"], "330621": ["绍兴县", "330600"], "330624": ["新昌县", "330600"], "330681": ["诸暨市", "330600"], "330682": ["上虞市", "330600"], "330683": ["嵊州市", "330600"], "330684": ["其它区", "330600"], "330700": ["金华市", "330000"], "330702": ["婺城区", "330700"], "330703": ["金东区", "330700"], "330723": ["武义县", "330700"], "330726": ["浦江县", "330700"], "330727": ["磐安县", "330700"], "330781": ["兰溪市", "330700"], "330782": ["义乌市", "330700"], "330783": ["东阳市", "330700"], "330784": ["永康市", "330700"], "330785": ["其它区", "330700"], "330800": ["衢州市", "330000"], "330802": ["柯城区", "330800"], "330803": ["衢江区", "330800"], "330822": ["常山县", "330800"], "330824": ["开化县", "330800"], "330825": ["龙游县", "330800"], "330881": ["江山市", "330800"], "330882": ["其它区", "330800"], "330900": ["舟山市", "330000"], "330902": ["定海区", "330900"], "330903": ["普陀区", "330900"], "330921": ["岱山县", "330900"], "330922": ["嵊泗县", "330900"], "330923": ["其它区", "330900"], "331000": ["台州市", "330000"], "331002": ["椒江区", "331000"], "331003": ["黄岩区", "331000"], "331004": ["路桥区", "331000"], "331021": ["玉环县", "331000"], "331022": ["三门县", "331000"], "331023": ["天台县", "331000"], "331024": ["仙居县", "331000"], "331081": ["温岭市", "331000"], "331082": ["临海市", "331000"], "331083": ["其它区", "331000"], "331100": ["丽水市", "330000"], "331102": ["莲都区", "331100"], "331121": ["青田县", "331100"], "331122": ["缙云县", "331100"], "331123": ["遂昌县", "331100"], "331124": ["松阳县", "331100"], "331125": ["云和县", "331100"], "331126": ["庆元县", "331100"], "331127": ["景宁畲族自治县", "331100"], "331181": ["龙泉市", "331100"], "331182": ["其它区", "331100"], "340000": ["安徽省", "1"], "340100": ["合肥市", "340000"], "340102": ["瑶海区", "340100"], "340103": ["庐阳区", "340100"], "340104": ["蜀山区", "340100"], "340111": ["包河区", "340100"], "340121": ["长丰县", "340100"], "340122": ["肥东县", "340100"], "340123": ["肥西县", "340100"], "340151": ["高新区", "340100"], "340191": ["中区", "340100"], "340192": ["其它区", "340100"], "340200": ["芜湖市", "340000"], "340202": ["镜湖区", "340200"], "340203": ["弋江区", "340200"], "340207": ["鸠江区", "340200"], "340208": ["三山区", "340200"], "340221": ["芜湖县", "340200"], "340222": ["繁昌县", "340200"], "340223": ["南陵县", "340200"], "340224": ["其它区", "340200"], "340300": ["蚌埠市", "340000"], "340302": ["龙子湖区", "340300"], "340303": ["蚌山区", "340300"], "340304": ["禹会区", "340300"], "340311": ["淮上区", "340300"], "340321": ["怀远县", "340300"], "340322": ["五河县", "340300"], "340323": ["固镇县", "340300"], "340324": ["其它区", "340300"], "340400": ["淮南市", "340000"], "340402": ["大通区", "340400"], "340403": ["田家庵区", "340400"], "340404": ["谢家集区", "340400"], "340405": ["八公山区", "340400"], "340406": ["潘集区", "340400"], "340421": ["凤台县", "340400"], "340422": ["其它区", "340400"], "340500": ["马鞍山市", "340000"], "340502": ["金家庄区", "340500"], "340503": ["花山区", "340500"], "340504": ["雨山区", "340500"], "340521": ["当涂县", "340500"], "340522": ["其它区", "340500"], "340600": ["淮北市", "340000"], "340602": ["杜集区", "340600"], "340603": ["相山区", "340600"], "340604": ["烈山区", "340600"], "340621": ["濉溪县", "340600"], "340622": ["其它区", "340600"], "340700": ["铜陵市", "340000"], "340702": ["铜官山区", "340700"], "340703": ["狮子山区", "340700"], "340711": ["郊区", "340700"], "340721": ["铜陵县", "340700"], "340722": ["其它区", "340700"], "340800": ["安庆市", "340000"], "340802": ["迎江区", "340800"], "340803": ["大观区", "340800"], "340811": ["宜秀区", "340800"], "340822": ["怀宁县", "340800"], "340823": ["枞阳县", "340800"], "340824": ["潜山县", "340800"], "340825": ["太湖县", "340800"], "340826": ["宿松县", "340800"], "340827": ["望江县", "340800"], "340828": ["岳西县", "340800"], "340881": ["桐城市", "340800"], "340882": ["其它区", "340800"], "341000": ["黄山市", "340000"], "341002": ["屯溪区", "341000"], "341003": ["黄山区", "341000"], "341004": ["徽州区", "341000"], "341021": ["歙县", "341000"], "341022": ["休宁县", "341000"], "341023": ["黟县", "341000"], "341024": ["祁门县", "341000"], "341025": ["其它区", "341000"], "341100": ["滁州市", "340000"], "341102": ["琅琊区", "341100"], "341103": ["南谯区", "341100"], "341122": ["来安县", "341100"], "341124": ["全椒县", "341100"], "341125": ["定远县", "341100"], "341126": ["凤阳县", "341100"], "341181": ["天长市", "341100"], "341182": ["明光市", "341100"], "341183": ["其它区", "341100"], "341200": ["阜阳市", "340000"], "341202": ["颍州区", "341200"], "341203": ["颍东区", "341200"], "341204": ["颍泉区", "341200"], "341221": ["临泉县", "341200"], "341222": ["太和县", "341200"], "341225": ["阜南县", "341200"], "341226": ["颍上县", "341200"], "341282": ["界首市", "341200"], "341283": ["其它区", "341200"], "341300": ["宿州市", "340000"], "341302": ["埇桥区", "341300"], "341321": ["砀山县", "341300"], "341322": ["萧县", "341300"], "341323": ["灵璧县", "341300"], "341324": ["泗县", "341300"], "341325": ["其它区", "341300"], "341400": ["巢湖市", "340000"], "341402": ["居巢区", "341400"], "341421": ["庐江县", "341400"], "341422": ["无为县", "341400"], "341423": ["含山县", "341400"], "341424": ["和县", "341400"], "341425": ["其它区", "341400"], "341500": ["六安市", "340000"], "341502": ["金安区", "341500"], "341503": ["裕安区", "341500"], "341521": ["寿县", "341500"], "341522": ["霍邱县", "341500"], "341523": ["舒城县", "341500"], "341524": ["金寨县", "341500"], "341525": ["霍山县", "341500"], "341526": ["其它区", "341500"], "341600": ["亳州市", "340000"], "341602": ["谯城区", "341600"], "341621": ["涡阳县", "341600"], "341622": ["蒙城县", "341600"], "341623": ["利辛县", "341600"], "341624": ["其它区", "341600"], "341700": ["池州市", "340000"], "341702": ["贵池区", "341700"], "341721": ["东至县", "341700"], "341722": ["石台县", "341700"], "341723": ["青阳县", "341700"], "341724": ["其它区", "341700"], "341800": ["宣城市", "340000"], "341802": ["宣州区", "341800"], "341821": ["郎溪县", "341800"], "341822": ["广德县", "341800"], "341823": ["泾县", "341800"], "341824": ["绩溪县", "341800"], "341825": ["旌德县", "341800"], "341881": ["宁国市", "341800"], "341882": ["其它区", "341800"], "350000": ["福建省", "1"], "350100": ["福州市", "350000"], "350102": ["鼓楼区", "350100"], "350103": ["台江区", "350100"], "350104": ["仓山区", "350100"], "350105": ["马尾区", "350100"], "350111": ["晋安区", "350100"], "350121": ["闽侯县", "350100"], "350122": ["连江县", "350100"], "350123": ["罗源县", "350100"], "350124": ["闽清县", "350100"], "350125": ["永泰县", "350100"], "350128": ["平潭县", "350100"], "350181": ["福清市", "350100"], "350182": ["长乐市", "350100"], "350183": ["其它区", "350100"], "350200": ["厦门市", "350000"], "350203": ["思明区", "350200"], "350205": ["海沧区", "350200"], "350206": ["湖里区", "350200"], "350211": ["集美区", "350200"], "350212": ["同安区", "350200"], "350213": ["翔安区", "350200"], "350214": ["其它区", "350200"], "350300": ["莆田市", "350000"], "350302": ["城厢区", "350300"], "350303": ["涵江区", "350300"], "350304": ["荔城区", "350300"], "350305": ["秀屿区", "350300"], "350322": ["仙游县", "350300"], "350323": ["其它区", "350300"], "350400": ["三明市", "350000"], "350402": ["梅列区", "350400"], "350403": ["三元区", "350400"], "350421": ["明溪县", "350400"], "350423": ["清流县", "350400"], "350424": ["宁化县", "350400"], "350425": ["大田县", "350400"], "350426": ["尤溪县", "350400"], "350427": ["沙县", "350400"], "350428": ["将乐县", "350400"], "350429": ["泰宁县", "350400"], "350430": ["建宁县", "350400"], "350481": ["永安市", "350400"], "350482": ["其它区", "350400"], "350500": ["泉州市", "350000"], "350502": ["鲤城区", "350500"], "350503": ["丰泽区", "350500"], "350504": ["洛江区", "350500"], "350505": ["泉港区", "350500"], "350521": ["惠安县", "350500"], "350524": ["安溪县", "350500"], "350525": ["永春县", "350500"], "350526": ["德化县", "350500"], "350527": ["金门县", "350500"], "350581": ["石狮市", "350500"], "350582": ["晋江市", "350500"], "350583": ["南安市", "350500"], "350584": ["其它区", "350500"], "350600": ["漳州市", "350000"], "350602": ["芗城区", "350600"], "350603": ["龙文区", "350600"], "350622": ["云霄县", "350600"], "350623": ["漳浦县", "350600"], "350624": ["诏安县", "350600"], "350625": ["长泰县", "350600"], "350626": ["东山县", "350600"], "350627": ["南靖县", "350600"], "350628": ["平和县", "350600"], "350629": ["华安县", "350600"], "350681": ["龙海市", "350600"], "350682": ["其它区", "350600"], "350700": ["南平市", "350000"], "350702": ["延平区", "350700"], "350721": ["顺昌县", "350700"], "350722": ["浦城县", "350700"], "350723": ["光泽县", "350700"], "350724": ["松溪县", "350700"], "350725": ["政和县", "350700"], "350781": ["邵武市", "350700"], "350782": ["武夷山市", "350700"], "350783": ["建瓯市", "350700"], "350784": ["建阳市", "350700"], "350785": ["其它区", "350700"], "350800": ["龙岩市", "350000"], "350802": ["新罗区", "350800"], "350821": ["长汀县", "350800"], "350822": ["永定县", "350800"], "350823": ["上杭县", "350800"], "350824": ["武平县", "350800"], "350825": ["连城县", "350800"], "350881": ["漳平市", "350800"], "350882": ["其它区", "350800"], "350900": ["宁德市", "350000"], "350902": ["蕉城区", "350900"], "350921": ["霞浦县", "350900"], "350922": ["古田县", "350900"], "350923": ["屏南县", "350900"], "350924": ["寿宁县", "350900"], "350925": ["周宁县", "350900"], "350926": ["柘荣县", "350900"], "350981": ["福安市", "350900"], "350982": ["福鼎市", "350900"], "350983": ["其它区", "350900"], "360000": ["江西省", "1"], "360100": ["南昌市", "360000"], "360102": ["东湖区", "360100"], "360103": ["西湖区", "360100"], "360104": ["青云谱区", "360100"], "360105": ["湾里区", "360100"], "360111": ["青山湖区", "360100"], "360121": ["南昌县", "360100"], "360122": ["新建县", "360100"], "360123": ["安义县", "360100"], "360124": ["进贤县", "360100"], "360125": ["红谷滩新区", "360100"], "360126": ["经济技术开发区", "360100"], "360127": ["昌北区", "360100"], "360128": ["其它区", "360100"], "360200": ["景德镇市", "360000"], "360202": ["昌江区", "360200"], "360203": ["珠山区", "360200"], "360222": ["浮梁县", "360200"], "360281": ["乐平市", "360200"], "360282": ["其它区", "360200"], "360300": ["萍乡市", "360000"], "360302": ["安源区", "360300"], "360313": ["湘东区", "360300"], "360321": ["莲花县", "360300"], "360322": ["上栗县", "360300"], "360323": ["芦溪县", "360300"], "360324": ["其它区", "360300"], "360400": ["九江市", "360000"], "360402": ["庐山区", "360400"], "360403": ["浔阳区", "360400"], "360421": ["九江县", "360400"], "360423": ["武宁县", "360400"], "360424": ["修水县", "360400"], "360425": ["永修县", "360400"], "360426": ["德安县", "360400"], "360427": ["星子县", "360400"], "360428": ["都昌县", "360400"], "360429": ["湖口县", "360400"], "360430": ["彭泽县", "360400"], "360481": ["瑞昌市", "360400"], "360482": ["其它区", "360400"], "360500": ["新余市", "360000"], "360502": ["渝水区", "360500"], "360521": ["分宜县", "360500"], "360522": ["其它区", "360500"], "360600": ["鹰潭市", "360000"], "360602": ["月湖区", "360600"], "360622": ["余江县", "360600"], "360681": ["贵溪市", "360600"], "360682": ["其它区", "360600"], "360700": ["赣州市", "360000"], "360702": ["章贡区", "360700"], "360721": ["赣县", "360700"], "360722": ["信丰县", "360700"], "360723": ["大余县", "360700"], "360724": ["上犹县", "360700"], "360725": ["崇义县", "360700"], "360726": ["安远县", "360700"], "360727": ["龙南县", "360700"], "360728": ["定南县", "360700"], "360729": ["全南县", "360700"], "360730": ["宁都县", "360700"], "360731": ["于都县", "360700"], "360732": ["兴国县", "360700"], "360733": ["会昌县", "360700"], "360734": ["寻乌县", "360700"], "360735": ["石城县", "360700"], "360751": ["黄金区", "360700"], "360781": ["瑞金市", "360700"], "360782": ["南康市", "360700"], "360783": ["其它区", "360700"], "360800": ["吉安市", "360000"], "360802": ["吉州区", "360800"], "360803": ["青原区", "360800"], "360821": ["吉安县", "360800"], "360822": ["吉水县", "360800"], "360823": ["峡江县", "360800"], "360824": ["新干县", "360800"], "360825": ["永丰县", "360800"], "360826": ["泰和县", "360800"], "360827": ["遂川县", "360800"], "360828": ["万安县", "360800"], "360829": ["安福县", "360800"], "360830": ["永新县", "360800"], "360881": ["井冈山市", "360800"], "360882": ["其它区", "360800"], "360900": ["宜春市", "360000"], "360902": ["袁州区", "360900"], "360921": ["奉新县", "360900"], "360922": ["万载县", "360900"], "360923": ["上高县", "360900"], "360924": ["宜丰县", "360900"], "360925": ["靖安县", "360900"], "360926": ["铜鼓县", "360900"], "360981": ["丰城市", "360900"], "360982": ["樟树市", "360900"], "360983": ["高安市", "360900"], "360984": ["其它区", "360900"], "361000": ["抚州市", "360000"], "361002": ["临川区", "361000"], "361021": ["南城县", "361000"], "361022": ["黎川县", "361000"], "361023": ["南丰县", "361000"], "361024": ["崇仁县", "361000"], "361025": ["乐安县", "361000"], "361026": ["宜黄县", "361000"], "361027": ["金溪县", "361000"], "361028": ["资溪县", "361000"], "361029": ["东乡县", "361000"], "361030": ["广昌县", "361000"], "361031": ["其它区", "361000"], "361100": ["上饶市", "360000"], "361102": ["信州区", "361100"], "361121": ["上饶县", "361100"], "361122": ["广丰县", "361100"], "361123": ["玉山县", "361100"], "361124": ["铅山县", "361100"], "361125": ["横峰县", "361100"], "361126": ["弋阳县", "361100"], "361127": ["余干县", "361100"], "361128": ["鄱阳县", "361100"], "361129": ["万年县", "361100"], "361130": ["婺源县", "361100"], "361181": ["德兴市", "361100"], "361182": ["其它区", "361100"], "370000": ["山东省", "1"], "370100": ["济南市", "370000"], "370102": ["历下区", "370100"], "370103": ["市中区", "370100"], "370104": ["槐荫区", "370100"], "370105": ["天桥区", "370100"], "370112": ["历城区", "370100"], "370113": ["长清区", "370100"], "370124": ["平阴县", "370100"], "370125": ["济阳县", "370100"], "370126": ["商河县", "370100"], "370181": ["章丘市", "370100"], "370182": ["其它区", "370100"], "370200": ["青岛市", "370000"], "370202": ["市南区", "370200"], "370203": ["市北区", "370200"], "370205": ["四方区", "370200"], "370211": ["黄岛区", "370200"], "370212": ["崂山区", "370200"], "370213": ["李沧区", "370200"], "370214": ["城阳区", "370200"], "370251": ["开发区", "370200"], "370281": ["胶州市", "370200"], "370282": ["即墨市", "370200"], "370283": ["平度市", "370200"], "370284": ["胶南市", "370200"], "370285": ["莱西市", "370200"], "370286": ["其它区", "370200"], "370300": ["淄博市", "370000"], "370302": ["淄川区", "370300"], "370303": ["张店区", "370300"], "370304": ["博山区", "370300"], "370305": ["临淄区", "370300"], "370306": ["周村区", "370300"], "370321": ["桓台县", "370300"], "370322": ["高青县", "370300"], "370323": ["沂源县", "370300"], "370324": ["其它区", "370300"], "370400": ["枣庄市", "370000"], "370402": ["市中区", "370400"], "370403": ["薛城区", "370400"], "370404": ["峄城区", "370400"], "370405": ["台儿庄区", "370400"], "370406": ["山亭区", "370400"], "370481": ["滕州市", "370400"], "370482": ["其它区", "370400"], "370500": ["东营市", "370000"], "370502": ["东营区", "370500"], "370503": ["河口区", "370500"], "370521": ["垦利县", "370500"], "370522": ["利津县", "370500"], "370523": ["广饶县", "370500"], "370589": ["西城区", "370500"], "370590": ["东城区", "370500"], "370591": ["其它区", "370500"], "370600": ["烟台市", "370000"], "370602": ["芝罘区", "370600"], "370611": ["福山区", "370600"], "370612": ["牟平区", "370600"], "370613": ["莱山区", "370600"], "370634": ["长岛县", "370600"], "370681": ["龙口市", "370600"], "370682": ["莱阳市", "370600"], "370683": ["莱州市", "370600"], "370684": ["蓬莱市", "370600"], "370685": ["招远市", "370600"], "370686": ["栖霞市", "370600"], "370687": ["海阳市", "370600"], "370688": ["其它区", "370600"], "370700": ["潍坊市", "370000"], "370702": ["潍城区", "370700"], "370703": ["寒亭区", "370700"], "370704": ["坊子区", "370700"], "370705": ["奎文区", "370700"], "370724": ["临朐县", "370700"], "370725": ["昌乐县", "370700"], "370751": ["开发区", "370700"], "370781": ["青州市", "370700"], "370782": ["诸城市", "370700"], "370783": ["寿光市", "370700"], "370784": ["安丘市", "370700"], "370785": ["高密市", "370700"], "370786": ["昌邑市", "370700"], "370787": ["其它区", "370700"], "370800": ["济宁市", "370000"], "370802": ["市中区", "370800"], "370811": ["任城区", "370800"], "370826": ["微山县", "370800"], "370827": ["鱼台县", "370800"], "370828": ["金乡县", "370800"], "370829": ["嘉祥县", "370800"], "370830": ["汶上县", "370800"], "370831": ["泗水县", "370800"], "370832": ["梁山县", "370800"], "370881": ["曲阜市", "370800"], "370882": ["兖州市", "370800"], "370883": ["邹城市", "370800"], "370884": ["其它区", "370800"], "370900": ["泰安市", "370000"], "370902": ["泰山区", "370900"], "370903": ["岱岳区", "370900"], "370921": ["宁阳县", "370900"], "370923": ["东平县", "370900"], "370982": ["新泰市", "370900"], "370983": ["肥城市", "370900"], "370984": ["其它区", "370900"], "371000": ["威海市", "370000"], "371002": ["环翠区", "371000"], "371081": ["文登市", "371000"], "371082": ["荣成市", "371000"], "371083": ["乳山市", "371000"], "371084": ["其它区", "371000"], "371100": ["日照市", "370000"], "371102": ["东港区", "371100"], "371103": ["岚山区", "371100"], "371121": ["五莲县", "371100"], "371122": ["莒县", "371100"], "371123": ["其它区", "371100"], "371200": ["莱芜市", "370000"], "371202": ["莱城区", "371200"], "371203": ["钢城区", "371200"], "371204": ["其它区", "371200"], "371300": ["临沂市", "370000"], "371302": ["兰山区", "371300"], "371311": ["罗庄区", "371300"], "371312": ["河东区", "371300"], "371321": ["沂南县", "371300"], "371322": ["郯城县", "371300"], "371323": ["沂水县", "371300"], "371324": ["苍山县", "371300"], "371325": ["费县", "371300"], "371326": ["平邑县", "371300"], "371327": ["莒南县", "371300"], "371328": ["蒙阴县", "371300"], "371329": ["临沭县", "371300"], "371330": ["其它区", "371300"], "371400": ["德州市", "370000"], "371402": ["德城区", "371400"], "371421": ["陵县", "371400"], "371422": ["宁津县", "371400"], "371423": ["庆云县", "371400"], "371424": ["临邑县", "371400"], "371425": ["齐河县", "371400"], "371426": ["平原县", "371400"], "371427": ["夏津县", "371400"], "371428": ["武城县", "371400"], "371451": ["开发区", "371400"], "371481": ["乐陵市", "371400"], "371482": ["禹城市", "371400"], "371483": ["其它区", "371400"], "371500": ["聊城市", "370000"], "371502": ["东昌府区", "371500"], "371521": ["阳谷县", "371500"], "371522": ["莘县", "371500"], "371523": ["茌平县", "371500"], "371524": ["东阿县", "371500"], "371525": ["冠县", "371500"], "371526": ["高唐县", "371500"], "371581": ["临清市", "371500"], "371582": ["其它区", "371500"], "371600": ["滨州市", "370000"], "371602": ["滨城区", "371600"], "371621": ["惠民县", "371600"], "371622": ["阳信县", "371600"], "371623": ["无棣县", "371600"], "371624": ["沾化县", "371600"], "371625": ["博兴县", "371600"], "371626": ["邹平县", "371600"], "371627": ["其它区", "371600"], "371700": ["菏泽市", "370000"], "371702": ["牡丹区", "371700"], "371721": ["曹县", "371700"], "371722": ["单县", "371700"], "371723": ["成武县", "371700"], "371724": ["巨野县", "371700"], "371725": ["郓城县", "371700"], "371726": ["鄄城县", "371700"], "371727": ["定陶县", "371700"], "371728": ["东明县", "371700"], "371729": ["其它区", "371700"], "410000": ["河南省", "1"], "410100": ["郑州市", "410000"], "410102": ["中原区", "410100"], "410103": ["二七区", "410100"], "410104": ["管城回族区", "410100"], "410105": ["金水区", "410100"], "410106": ["上街区", "410100"], "410108": ["惠济区", "410100"], "410122": ["中牟县", "410100"], "410181": ["巩义市", "410100"], "410182": ["荥阳市", "410100"], "410183": ["新密市", "410100"], "410184": ["新郑市", "410100"], "410185": ["登封市", "410100"], "410186": ["郑东新区", "410100"], "410187": ["高新区", "410100"], "410188": ["其它区", "410100"], "410200": ["开封市", "410000"], "410202": ["龙亭区", "410200"], "410203": ["顺河回族区", "410200"], "410204": ["鼓楼区", "410200"], "410205": ["禹王台区", "410200"], "410211": ["金明区", "410200"], "410221": ["杞县", "410200"], "410222": ["通许县", "410200"], "410223": ["尉氏县", "410200"], "410224": ["开封县", "410200"], "410225": ["兰考县", "410200"], "410226": ["其它区", "410200"], "410300": ["洛阳市", "410000"], "410302": ["老城区", "410300"], "410303": ["西工区", "410300"], "410304": ["廛河回族区", "410300"], "410305": ["涧西区", "410300"], "410306": ["吉利区", "410300"], "410307": ["洛龙区", "410300"], "410322": ["孟津县", "410300"], "410323": ["新安县", "410300"], "410324": ["栾川县", "410300"], "410325": ["嵩县", "410300"], "410326": ["汝阳县", "410300"], "410327": ["宜阳县", "410300"], "410328": ["洛宁县", "410300"], "410329": ["伊川县", "410300"], "410381": ["偃师市", "410300"], "471004": ["高新区", "410300"], "471005": ["其它区", "410300"], "410400": ["平顶山市", "410000"], "410402": ["新华区", "410400"], "410403": ["卫东区", "410400"], "410404": ["石龙区", "410400"], "410411": ["湛河区", "410400"], "410421": ["宝丰县", "410400"], "410422": ["叶县", "410400"], "410423": ["鲁山县", "410400"], "410425": ["郏县", "410400"], "410481": ["舞钢市", "410400"], "410482": ["汝州市", "410400"], "410483": ["其它区", "410400"], "410500": ["安阳市", "410000"], "410502": ["文峰区", "410500"], "410503": ["北关区", "410500"], "410505": ["殷都区", "410500"], "410506": ["龙安区", "410500"], "410522": ["安阳县", "410500"], "410523": ["汤阴县", "410500"], "410526": ["滑县", "410500"], "410527": ["内黄县", "410500"], "410581": ["林州市", "410500"], "410582": ["其它区", "410500"], "410600": ["鹤壁市", "410000"], "410602": ["鹤山区", "410600"], "410603": ["山城区", "410600"], "410611": ["淇滨区", "410600"], "410621": ["浚县", "410600"], "410622": ["淇县", "410600"], "410623": ["其它区", "410600"], "410700": ["新乡市", "410000"], "410702": ["红旗区", "410700"], "410703": ["卫滨区", "410700"], "410704": ["凤泉区", "410700"], "410711": ["牧野区", "410700"], "410721": ["新乡县", "410700"], "410724": ["获嘉县", "410700"], "410725": ["原阳县", "410700"], "410726": ["延津县", "410700"], "410727": ["封丘县", "410700"], "410728": ["长垣县", "410700"], "410781": ["卫辉市", "410700"], "410782": ["辉县市", "410700"], "410783": ["其它区", "410700"], "410800": ["焦作市", "410000"], "410802": ["解放区", "410800"], "410803": ["中站区", "410800"], "410804": ["马村区", "410800"], "410811": ["山阳区", "410800"], "410821": ["修武县", "410800"], "410822": ["博爱县", "410800"], "410823": ["武陟县", "410800"], "410825": ["温县", "410800"], "410882": ["沁阳市", "410800"], "410883": ["孟州市", "410800"], "410884": ["其它区", "410800"], "410881": ["济源市", "410000"], "410900": ["濮阳市", "410000"], "410902": ["华龙区", "410900"], "410922": ["清丰县", "410900"], "410923": ["南乐县", "410900"], "410926": ["范县", "410900"], "410927": ["台前县", "410900"], "410928": ["濮阳县", "410900"], "410929": ["其它区", "410900"], "411000": ["许昌市", "410000"], "411002": ["魏都区", "411000"], "411023": ["许昌县", "411000"], "411024": ["鄢陵县", "411000"], "411025": ["襄城县", "411000"], "411081": ["禹州市", "411000"], "411082": ["长葛市", "411000"], "411083": ["其它区", "411000"], "411100": ["漯河市", "410000"], "411102": ["源汇区", "411100"], "411103": ["郾城区", "411100"], "411104": ["召陵区", "411100"], "411121": ["舞阳县", "411100"], "411122": ["临颍县", "411100"], "411123": ["其它区", "411100"], "411200": ["三门峡市", "410000"], "411202": ["湖滨区", "411200"], "411221": ["渑池县", "411200"], "411222": ["陕县", "411200"], "411224": ["卢氏县", "411200"], "411281": ["义马市", "411200"], "411282": ["灵宝市", "411200"], "411283": ["其它区", "411200"], "411300": ["南阳市", "410000"], "411302": ["宛城区", "411300"], "411303": ["卧龙区", "411300"], "411321": ["南召县", "411300"], "411322": ["方城县", "411300"], "411323": ["西峡县", "411300"], "411324": ["镇平县", "411300"], "411325": ["内乡县", "411300"], "411326": ["淅川县", "411300"], "411327": ["社旗县", "411300"], "411328": ["唐河县", "411300"], "411329": ["新野县", "411300"], "411330": ["桐柏县", "411300"], "411381": ["邓州市", "411300"], "411382": ["其它区", "411300"], "411400": ["商丘市", "410000"], "411402": ["梁园区", "411400"], "411403": ["睢阳区", "411400"], "411421": ["民权县", "411400"], "411422": ["睢县", "411400"], "411423": ["宁陵县", "411400"], "411424": ["柘城县", "411400"], "411425": ["虞城县", "411400"], "411426": ["夏邑县", "411400"], "411481": ["永城市", "411400"], "411482": ["其它区", "411400"], "411500": ["信阳市", "410000"], "411502": ["浉河区", "411500"], "411503": ["平桥区", "411500"], "411521": ["罗山县", "411500"], "411522": ["光山县", "411500"], "411523": ["新县", "411500"], "411524": ["商城县", "411500"], "411525": ["固始县", "411500"], "411526": ["潢川县", "411500"], "411527": ["淮滨县", "411500"], "411528": ["息县", "411500"], "411529": ["其它区", "411500"], "411600": ["周口市", "410000"], "411602": ["川汇区", "411600"], "411621": ["扶沟县", "411600"], "411622": ["西华县", "411600"], "411623": ["商水县", "411600"], "411624": ["沈丘县", "411600"], "411625": ["郸城县", "411600"], "411626": ["淮阳县", "411600"], "411627": ["太康县", "411600"], "411628": ["鹿邑县", "411600"], "411681": ["项城市", "411600"], "411682": ["其它区", "411600"], "411700": ["驻马店市", "410000"], "411702": ["驿城区", "411700"], "411721": ["西平县", "411700"], "411722": ["上蔡县", "411700"], "411723": ["平舆县", "411700"], "411724": ["正阳县", "411700"], "411725": ["确山县", "411700"], "411726": ["泌阳县", "411700"], "411727": ["汝南县", "411700"], "411728": ["遂平县", "411700"], "411729": ["新蔡县", "411700"], "411730": ["其它区", "411700"], "420000": ["湖北省", "1"], "420100": ["武汉市", "420000"], "420102": ["江岸区", "420100"], "420103": ["江汉区", "420100"], "420104": ["硚口区", "420100"], "420105": ["汉阳区", "420100"], "420106": ["武昌区", "420100"], "420107": ["青山区", "420100"], "420111": ["洪山区", "420100"], "420112": ["东西湖区", "420100"], "420113": ["汉南区", "420100"], "420114": ["蔡甸区", "420100"], "420115": ["江夏区", "420100"], "420116": ["黄陂区", "420100"], "420117": ["新洲区", "420100"], "420118": ["其它区", "420100"], "420200": ["黄石市", "420000"], "420202": ["黄石港区", "420200"], "420203": ["西塞山区", "420200"], "420204": ["下陆区", "420200"], "420205": ["铁山区", "420200"], "420222": ["阳新县", "420200"], "420281": ["大冶市", "420200"], "420282": ["其它区", "420200"], "420300": ["十堰市", "420000"], "420302": ["茅箭区", "420300"], "420303": ["张湾区", "420300"], "420321": ["郧县", "420300"], "420322": ["郧西县", "420300"], "420323": ["竹山县", "420300"], "420324": ["竹溪县", "420300"], "420325": ["房县", "420300"], "420381": ["丹江口市", "420300"], "420382": ["城区", "420300"], "420383": ["其它区", "420300"], "420500": ["宜昌市", "420000"], "420502": ["西陵区", "420500"], "420503": ["伍家岗区", "420500"], "420504": ["点军区", "420500"], "420505": ["猇亭区", "420500"], "420506": ["夷陵区", "420500"], "420525": ["远安县", "420500"], "420526": ["兴山县", "420500"], "420527": ["秭归县", "420500"], "420528": ["长阳土家族自治县", "420500"], "420529": ["五峰土家族自治县", "420500"], "420551": ["葛洲坝区", "420500"], "420552": ["开发区", "420500"], "420581": ["宜都市", "420500"], "420582": ["当阳市", "420500"], "420583": ["枝江市", "420500"], "420584": ["其它区", "420500"], "420600": ["襄阳市", "420000"], "420602": ["襄城区", "420600"], "420606": ["樊城区", "420600"], "420607": ["襄州区", "420600"], "420624": ["南漳县", "420600"], "420625": ["谷城县", "420600"], "420626": ["保康县", "420600"], "420682": ["老河口市", "420600"], "420683": ["枣阳市", "420600"], "420684": ["宜城市", "420600"], "420685": ["其它区", "420600"], "420700": ["鄂州市", "420000"], "420702": ["梁子湖区", "420700"], "420703": ["华容区", "420700"], "420704": ["鄂城区", "420700"], "420705": ["其它区", "420700"], "420800": ["荆门市", "420000"], "420802": ["东宝区", "420800"], "420804": ["掇刀区", "420800"], "420821": ["京山县", "420800"], "420822": ["沙洋县", "420800"], "420881": ["钟祥市", "420800"], "420882": ["其它区", "420800"], "420900": ["孝感市", "420000"], "420902": ["孝南区", "420900"], "420921": ["孝昌县", "420900"], "420922": ["大悟县", "420900"], "420923": ["云梦县", "420900"], "420981": ["应城市", "420900"], "420982": ["安陆市", "420900"], "420984": ["汉川市", "420900"], "420985": ["其它区", "420900"], "421000": ["荆州市", "420000"], "421002": ["沙市区", "421000"], "421003": ["荆州区", "421000"], "421022": ["公安县", "421000"], "421023": ["监利县", "421000"], "421024": ["江陵县", "421000"], "421081": ["石首市", "421000"], "421083": ["洪湖市", "421000"], "421087": ["松滋市", "421000"], "421088": ["其它区", "421000"], "421100": ["黄冈市", "420000"], "421102": ["黄州区", "421100"], "421121": ["团风县", "421100"], "421122": ["红安县", "421100"], "421123": ["罗田县", "421100"], "421124": ["英山县", "421100"], "421125": ["浠水县", "421100"], "421126": ["蕲春县", "421100"], "421127": ["黄梅县", "421100"], "421181": ["麻城市", "421100"], "421182": ["武穴市", "421100"], "421183": ["其它区", "421100"], "421200": ["咸宁市", "420000"], "421202": ["咸安区", "421200"], "421221": ["嘉鱼县", "421200"], "421222": ["通城县", "421200"], "421223": ["崇阳县", "421200"], "421224": ["通山县", "421200"], "421281": ["赤壁市", "421200"], "421282": ["温泉城区", "421200"], "421283": ["其它区", "421200"], "421300": ["随州市", "420000"], "421302": ["曾都区", "421300"], "421321": ["随县", "421300"], "421381": ["广水市", "421300"], "421382": ["其它区", "421300"], "422800": ["恩施土家族苗族自治州", "420000"], "422801": ["恩施市", "422800"], "422802": ["利川市", "422800"], "422822": ["建始县", "422800"], "422823": ["巴东县", "422800"], "422825": ["宣恩县", "422800"], "422826": ["咸丰县", "422800"], "422827": ["来凤县", "422800"], "422828": ["鹤峰县", "422800"], "422829": ["其它区", "422800"], "429004": ["仙桃市", "420000"], "429005": ["潜江市", "420000"], "429006": ["天门市", "420000"], "429021": ["神农架林区", "420000"], "430000": ["湖南省", "1"], "430100": ["长沙市", "430000"], "430102": ["芙蓉区", "430100"], "430103": ["天心区", "430100"], "430104": ["岳麓区", "430100"], "430105": ["开福区", "430100"], "430111": ["雨花区", "430100"], "430121": ["长沙县", "430100"], "430122": ["望城县", "430100"], "430124": ["宁乡县", "430100"], "430181": ["浏阳市", "430100"], "430182": ["其它区", "430100"], "430200": ["株洲市", "430000"], "430202": ["荷塘区", "430200"], "430203": ["芦淞区", "430200"], "430204": ["石峰区", "430200"], "430211": ["天元区", "430200"], "430221": ["株洲县", "430200"], "430223": ["攸县", "430200"], "430224": ["茶陵县", "430200"], "430225": ["炎陵县", "430200"], "430281": ["醴陵市", "430200"], "430282": ["其它区", "430200"], "430300": ["湘潭市", "430000"], "430302": ["雨湖区", "430300"], "430304": ["岳塘区", "430300"], "430321": ["湘潭县", "430300"], "430381": ["湘乡市", "430300"], "430382": ["韶山市", "430300"], "430383": ["其它区", "430300"], "430400": ["衡阳市", "430000"], "430405": ["珠晖区", "430400"], "430406": ["雁峰区", "430400"], "430407": ["石鼓区", "430400"], "430408": ["蒸湘区", "430400"], "430412": ["南岳区", "430400"], "430421": ["衡阳县", "430400"], "430422": ["衡南县", "430400"], "430423": ["衡山县", "430400"], "430424": ["衡东县", "430400"], "430426": ["祁东县", "430400"], "430481": ["耒阳市", "430400"], "430482": ["常宁市", "430400"], "430483": ["其它区", "430400"], "430500": ["邵阳市", "430000"], "430502": ["双清区", "430500"], "430503": ["大祥区", "430500"], "430511": ["北塔区", "430500"], "430521": ["邵东县", "430500"], "430522": ["新邵县", "430500"], "430523": ["邵阳县", "430500"], "430524": ["隆回县", "430500"], "430525": ["洞口县", "430500"], "430527": ["绥宁县", "430500"], "430528": ["新宁县", "430500"], "430529": ["城步苗族自治县", "430500"], "430581": ["武冈市", "430500"], "430582": ["其它区", "430500"], "430600": ["岳阳市", "430000"], "430602": ["岳阳楼区", "430600"], "430603": ["云溪区", "430600"], "430611": ["君山区", "430600"], "430621": ["岳阳县", "430600"], "430623": ["华容县", "430600"], "430624": ["湘阴县", "430600"], "430626": ["平江县", "430600"], "430681": ["汨罗市", "430600"], "430682": ["临湘市", "430600"], "430683": ["其它区", "430600"], "430700": ["常德市", "430000"], "430702": ["武陵区", "430700"], "430703": ["鼎城区", "430700"], "430721": ["安乡县", "430700"], "430722": ["汉寿县", "430700"], "430723": ["澧县", "430700"], "430724": ["临澧县", "430700"], "430725": ["桃源县", "430700"], "430726": ["石门县", "430700"], "430781": ["津市市", "430700"], "430782": ["其它区", "430700"], "430800": ["张家界市", "430000"], "430802": ["永定区", "430800"], "430811": ["武陵源区", "430800"], "430821": ["慈利县", "430800"], "430822": ["桑植县", "430800"], "430823": ["其它区", "430800"], "430900": ["益阳市", "430000"], "430902": ["资阳区", "430900"], "430903": ["赫山区", "430900"], "430921": ["南县", "430900"], "430922": ["桃江县", "430900"], "430923": ["安化县", "430900"], "430981": ["沅江市", "430900"], "430982": ["其它区", "430900"], "431000": ["郴州市", "430000"], "431002": ["北湖区", "431000"], "431003": ["苏仙区", "431000"], "431021": ["桂阳县", "431000"], "431022": ["宜章县", "431000"], "431023": ["永兴县", "431000"], "431024": ["嘉禾县", "431000"], "431025": ["临武县", "431000"], "431026": ["汝城县", "431000"], "431027": ["桂东县", "431000"], "431028": ["安仁县", "431000"], "431081": ["资兴市", "431000"], "431082": ["其它区", "431000"], "431100": ["永州市", "430000"], "431102": ["零陵区", "431100"], "431103": ["冷水滩区", "431100"], "431121": ["祁阳县", "431100"], "431122": ["东安县", "431100"], "431123": ["双牌县", "431100"], "431124": ["道县", "431100"], "431125": ["江永县", "431100"], "431126": ["宁远县", "431100"], "431127": ["蓝山县", "431100"], "431128": ["新田县", "431100"], "431129": ["江华瑶族自治县", "431100"], "431130": ["其它区", "431100"], "431200": ["怀化市", "430000"], "431202": ["鹤城区", "431200"], "431221": ["中方县", "431200"], "431222": ["沅陵县", "431200"], "431223": ["辰溪县", "431200"], "431224": ["溆浦县", "431200"], "431225": ["会同县", "431200"], "431226": ["麻阳苗族自治县", "431200"], "431227": ["新晃侗族自治县", "431200"], "431228": ["芷江侗族自治县", "431200"], "431229": ["靖州苗族侗族自治县", "431200"], "431230": ["通道侗族自治县", "431200"], "431281": ["洪江市", "431200"], "431282": ["其它区", "431200"], "431300": ["娄底市", "430000"], "431302": ["娄星区", "431300"], "431321": ["双峰县", "431300"], "431322": ["新化县", "431300"], "431381": ["冷水江市", "431300"], "431382": ["涟源市", "431300"], "431383": ["其它区", "431300"], "433100": ["湘西土家族苗族自治州", "430000"], "433101": ["吉首市", "433100"], "433122": ["泸溪县", "433100"], "433123": ["凤凰县", "433100"], "433124": ["花垣县", "433100"], "433125": ["保靖县", "433100"], "433126": ["古丈县", "433100"], "433127": ["永顺县", "433100"], "433130": ["龙山县", "433100"], "433131": ["其它区", "433100"], "440000": ["广东省", "1"], "440100": ["广州市", "440000"], "440103": ["荔湾区", "440100"], "440104": ["越秀区", "440100"], "440105": ["海珠区", "440100"], "440106": ["天河区", "440100"], "440111": ["白云区", "440100"], "440112": ["黄埔区", "440100"], "440113": ["番禺区", "440100"], "440114": ["花都区", "440100"], "440115": ["南沙区", "440100"], "440116": ["萝岗区", "440100"], "440183": ["增城市", "440100"], "440184": ["从化市", "440100"], "440188": ["东山区", "440100"], "440189": ["其它区", "440100"], "440200": ["韶关市", "440000"], "440203": ["武江区", "440200"], "440204": ["浈江区", "440200"], "440205": ["曲江区", "440200"], "440222": ["始兴县", "440200"], "440224": ["仁化县", "440200"], "440229": ["翁源县", "440200"], "440232": ["乳源瑶族自治县", "440200"], "440233": ["新丰县", "440200"], "440281": ["乐昌市", "440200"], "440282": ["南雄市", "440200"], "440283": ["其它区", "440200"], "440300": ["深圳市", "440000"], "440303": ["罗湖区", "440300"], "440304": ["福田区", "440300"], "440305": ["南山区", "440300"], "440306": ["宝安区", "440300"], "440307": ["龙岗区", "440300"], "440308": ["盐田区", "440300"], "440309": ["其它区", "440300"], "440400": ["珠海市", "440000"], "440402": ["香洲区", "440400"], "440403": ["斗门区", "440400"], "440404": ["金湾区", "440400"], "440486": ["金唐区", "440400"], "440487": ["南湾区", "440400"], "440488": ["其它区", "440400"], "440500": ["汕头市", "440000"], "440507": ["龙湖区", "440500"], "440511": ["金平区", "440500"], "440512": ["濠江区", "440500"], "440513": ["潮阳区", "440500"], "440514": ["潮南区", "440500"], "440515": ["澄海区", "440500"], "440523": ["南澳县", "440500"], "440524": ["其它区", "440500"], "440600": ["佛山市", "440000"], "440604": ["禅城区", "440600"], "440605": ["南海区", "440600"], "440606": ["顺德区", "440600"], "440607": ["三水区", "440600"], "440608": ["高明区", "440600"], "440609": ["其它区", "440600"], "440700": ["江门市", "440000"], "440703": ["蓬江区", "440700"], "440704": ["江海区", "440700"], "440705": ["新会区", "440700"], "440781": ["台山市", "440700"], "440783": ["开平市", "440700"], "440784": ["鹤山市", "440700"], "440785": ["恩平市", "440700"], "440786": ["其它区", "440700"], "440800": ["湛江市", "440000"], "440802": ["赤坎区", "440800"], "440803": ["霞山区", "440800"], "440804": ["坡头区", "440800"], "440811": ["麻章区", "440800"], "440823": ["遂溪县", "440800"], "440825": ["徐闻县", "440800"], "440881": ["廉江市", "440800"], "440882": ["雷州市", "440800"], "440883": ["吴川市", "440800"], "440884": ["其它区", "440800"], "440900": ["茂名市", "440000"], "440902": ["茂南区", "440900"], "440903": ["茂港区", "440900"], "440923": ["电白县", "440900"], "440981": ["高州市", "440900"], "440982": ["化州市", "440900"], "440983": ["信宜市", "440900"], "440984": ["其它区", "440900"], "441200": ["肇庆市", "440000"], "441202": ["端州区", "441200"], "441203": ["鼎湖区", "441200"], "441223": ["广宁县", "441200"], "441224": ["怀集县", "441200"], "441225": ["封开县", "441200"], "441226": ["德庆县", "441200"], "441283": ["高要市", "441200"], "441284": ["四会市", "441200"], "441285": ["其它区", "441200"], "441300": ["惠州市", "440000"], "441302": ["惠城区", "441300"], "441303": ["惠阳区", "441300"], "441322": ["博罗县", "441300"], "441323": ["惠东县", "441300"], "441324": ["龙门县", "441300"], "441325": ["其它区", "441300"], "441400": ["梅州市", "440000"], "441402": ["梅江区", "441400"], "441421": ["梅县", "441400"], "441422": ["大埔县", "441400"], "441423": ["丰顺县", "441400"], "441424": ["五华县", "441400"], "441426": ["平远县", "441400"], "441427": ["蕉岭县", "441400"], "441481": ["兴宁市", "441400"], "441482": ["其它区", "441400"], "441500": ["汕尾市", "440000"], "441502": ["城区", "441500"], "441521": ["海丰县", "441500"], "441523": ["陆河县", "441500"], "441581": ["陆丰市", "441500"], "441582": ["其它区", "441500"], "441600": ["河源市", "440000"], "441602": ["源城区", "441600"], "441621": ["紫金县", "441600"], "441622": ["龙川县", "441600"], "441623": ["连平县", "441600"], "441624": ["和平县", "441600"], "441625": ["东源县", "441600"], "441626": ["其它区", "441600"], "441700": ["阳江市", "440000"], "441702": ["江城区", "441700"], "441721": ["阳西县", "441700"], "441723": ["阳东县", "441700"], "441781": ["阳春市", "441700"], "441782": ["其它区", "441700"], "441800": ["清远市", "440000"], "441802": ["清城区", "441800"], "441821": ["佛冈县", "441800"], "441823": ["阳山县", "441800"], "441825": ["连山壮族瑶族自治县", "441800"], "441826": ["连南瑶族自治县", "441800"], "441827": ["清新县", "441800"], "441881": ["英德市", "441800"], "441882": ["连州市", "441800"], "441883": ["其它区", "441800"], "441900": ["东莞市", "440000"], "441956": ["东城区", "441900"], "441958": ["南城区", "441900"], "441959": ["莞城区", "441900"], "441977": ["万江区", "441900"], "442000": ["中山市", "440000"], "445100": ["潮州市", "440000"], "445102": ["湘桥区", "445100"], "445121": ["潮安县", "445100"], "445122": ["饶平县", "445100"], "445185": ["枫溪区", "445100"], "445186": ["其它区", "445100"], "445200": ["揭阳市", "440000"], "445202": ["榕城区", "445200"], "445221": ["揭东县", "445200"], "445222": ["揭西县", "445200"], "445224": ["惠来县", "445200"], "445281": ["普宁市", "445200"], "445284": ["东山区", "445200"], "445285": ["其它区", "445200"], "445300": ["云浮市", "440000"], "445302": ["云城区", "445300"], "445321": ["新兴县", "445300"], "445322": ["郁南县", "445300"], "445323": ["云安县", "445300"], "445381": ["罗定市", "445300"], "445382": ["其它区", "445300"], "450000": ["广西壮族自治区", "1"], "450100": ["南宁市", "450000"], "450102": ["兴宁区", "450100"], "450103": ["青秀区", "450100"], "450105": ["江南区", "450100"], "450107": ["西乡塘区", "450100"], "450108": ["良庆区", "450100"], "450109": ["邕宁区", "450100"], "450122": ["武鸣县", "450100"], "450123": ["隆安县", "450100"], "450124": ["马山县", "450100"], "450125": ["上林县", "450100"], "450126": ["宾阳县", "450100"], "450127": ["横县", "450100"], "450128": ["其它区", "450100"], "450200": ["柳州市", "450000"], "450202": ["城中区", "450200"], "450203": ["鱼峰区", "450200"], "450204": ["柳南区", "450200"], "450205": ["柳北区", "450200"], "450221": ["柳江县", "450200"], "450222": ["柳城县", "450200"], "450223": ["鹿寨县", "450200"], "450224": ["融安县", "450200"], "450225": ["融水苗族自治县", "450200"], "450226": ["三江侗族自治县", "450200"], "450227": ["其它区", "450200"], "450300": ["桂林市", "450000"], "450302": ["秀峰区", "450300"], "450303": ["叠彩区", "450300"], "450304": ["象山区", "450300"], "450305": ["七星区", "450300"], "450311": ["雁山区", "450300"], "450321": ["阳朔县", "450300"], "450322": ["临桂县", "450300"], "450323": ["灵川县", "450300"], "450324": ["全州县", "450300"], "450325": ["兴安县", "450300"], "450326": ["永福县", "450300"], "450327": ["灌阳县", "450300"], "450328": ["龙胜各族自治县", "450300"], "450329": ["资源县", "450300"], "450330": ["平乐县", "450300"], "450331": ["荔浦县", "450300"], "450332": ["恭城瑶族自治县", "450300"], "450333": ["其它区", "450300"], "450400": ["梧州市", "450000"], "450403": ["万秀区", "450400"], "450404": ["蝶山区", "450400"], "450405": ["长洲区", "450400"], "450421": ["苍梧县", "450400"], "450422": ["藤县", "450400"], "450423": ["蒙山县", "450400"], "450481": ["岑溪市", "450400"], "450482": ["其它区", "450400"], "450500": ["北海市", "450000"], "450502": ["海城区", "450500"], "450503": ["银海区", "450500"], "450512": ["铁山港区", "450500"], "450521": ["合浦县", "450500"], "450522": ["其它区", "450500"], "450600": ["防城港市", "450000"], "450602": ["港口区", "450600"], "450603": ["防城区", "450600"], "450621": ["上思县", "450600"], "450681": ["东兴市", "450600"], "450682": ["其它区", "450600"], "450700": ["钦州市", "450000"], "450702": ["钦南区", "450700"], "450703": ["钦北区", "450700"], "450721": ["灵山县", "450700"], "450722": ["浦北县", "450700"], "450723": ["其它区", "450700"], "450800": ["贵港市", "450000"], "450802": ["港北区", "450800"], "450803": ["港南区", "450800"], "450804": ["覃塘区", "450800"], "450821": ["平南县", "450800"], "450881": ["桂平市", "450800"], "450882": ["其它区", "450800"], "450900": ["玉林市", "450000"], "450902": ["玉州区", "450900"], "450921": ["容县", "450900"], "450922": ["陆川县", "450900"], "450923": ["博白县", "450900"], "450924": ["兴业县", "450900"], "450981": ["北流市", "450900"], "450982": ["其它区", "450900"], "451000": ["百色市", "450000"], "451002": ["右江区", "451000"], "451021": ["田阳县", "451000"], "451022": ["田东县", "451000"], "451023": ["平果县", "451000"], "451024": ["德保县", "451000"], "451025": ["靖西县", "451000"], "451026": ["那坡县", "451000"], "451027": ["凌云县", "451000"], "451028": ["乐业县", "451000"], "451029": ["田林县", "451000"], "451030": ["西林县", "451000"], "451031": ["隆林各族自治县", "451000"], "451032": ["其它区", "451000"], "451100": ["贺州市", "450000"], "451102": ["八步区", "451100"], "451121": ["昭平县", "451100"], "451122": ["钟山县", "451100"], "451123": ["富川瑶族自治县", "451100"], "451124": ["其它区", "451100"], "451200": ["河池市", "450000"], "451202": ["金城江区", "451200"], "451221": ["南丹县", "451200"], "451222": ["天峨县", "451200"], "451223": ["凤山县", "451200"], "451224": ["东兰县", "451200"], "451225": ["罗城仫佬族自治县", "451200"], "451226": ["环江毛南族自治县", "451200"], "451227": ["巴马瑶族自治县", "451200"], "451228": ["都安瑶族自治县", "451200"], "451229": ["大化瑶族自治县", "451200"], "451281": ["宜州市", "451200"], "451282": ["其它区", "451200"], "451300": ["来宾市", "450000"], "451302": ["兴宾区", "451300"], "451321": ["忻城县", "451300"], "451322": ["象州县", "451300"], "451323": ["武宣县", "451300"], "451324": ["金秀瑶族自治县", "451300"], "451381": ["合山市", "451300"], "451382": ["其它区", "451300"], "451400": ["崇左市", "450000"], "451402": ["江州区", "451400"], "451421": ["扶绥县", "451400"], "451422": ["宁明县", "451400"], "451423": ["龙州县", "451400"], "451424": ["大新县", "451400"], "451425": ["天等县", "451400"], "451481": ["凭祥市", "451400"], "451482": ["其它区", "451400"], "460000": ["海南省", "1"], "460100": ["海口市", "460000"], "460105": ["秀英区", "460100"], "460106": ["龙华区", "460100"], "460107": ["琼山区", "460100"], "460108": ["美兰区", "460100"], "460109": ["其它区", "460100"], "460200": ["三亚市", "460000"], "469001": ["五指山市", "460000"], "469002": ["琼海市", "460000"], "469003": ["儋州市", "460000"], "469005": ["文昌市", "460000"], "469006": ["万宁市", "460000"], "469007": ["东方市", "460000"], "469025": ["定安县", "460000"], "469026": ["屯昌县", "460000"], "469027": ["澄迈县", "460000"], "469028": ["临高县", "460000"], "469030": ["白沙黎族自治县", "460000"], "469031": ["昌江黎族自治县", "460000"], "469033": ["乐东黎族自治县", "460000"], "469034": ["陵水黎族自治县", "460000"], "469035": ["保亭黎族苗族自治县", "460000"], "469036": ["琼中黎族苗族自治县", "460000"], "469037": ["西沙群岛", "460000"], "469038": ["南沙群岛", "460000"], "469039": ["中沙群岛的岛礁及其海域", "460000"], "500000": ["重庆", "1"], "500100": ["重庆市", "500000"], "500101": ["万州区", "500100"], "500102": ["涪陵区", "500100"], "500103": ["渝中区", "500100"], "500104": ["大渡口区", "500100"], "500105": ["江北区", "500100"], "500106": ["沙坪坝区", "500100"], "500107": ["九龙坡区", "500100"], "500108": ["南岸区", "500100"], "500109": ["北碚区", "500100"], "500110": ["万盛区", "500100"], "500111": ["双桥区", "500100"], "500112": ["渝北区", "500100"], "500113": ["巴南区", "500100"], "500114": ["黔江区", "500100"], "500115": ["长寿区", "500100"], "500222": ["綦江县", "500100"], "500223": ["潼南县", "500100"], "500224": ["铜梁县", "500100"], "500225": ["大足县", "500100"], "500226": ["荣昌县", "500100"], "500227": ["璧山县", "500100"], "500228": ["梁平县", "500100"], "500229": ["城口县", "500100"], "500230": ["丰都县", "500100"], "500231": ["垫江县", "500100"], "500232": ["武隆县", "500100"], "500233": ["忠县", "500100"], "500234": ["开县", "500100"], "500235": ["云阳县", "500100"], "500236": ["奉节县", "500100"], "500237": ["巫山县", "500100"], "500238": ["巫溪县", "500100"], "500240": ["石柱土家族自治县", "500100"], "500241": ["秀山土家族苗族自治县", "500100"], "500242": ["酉阳土家族苗族自治县", "500100"], "500243": ["彭水苗族土家族自治县", "500100"], "500381": ["江津区", "500100"], "500382": ["合川区", "500100"], "500383": ["永川区", "500100"], "500384": ["南川区", "500100"], "500385": ["其它区", "500100"], "510000": ["四川省", "1"], "510100": ["成都市", "510000"], "510104": ["锦江区", "510100"], "510105": ["青羊区", "510100"], "510106": ["金牛区", "510100"], "510107": ["武侯区", "510100"], "510108": ["成华区", "510100"], "510112": ["龙泉驿区", "510100"], "510113": ["青白江区", "510100"], "510114": ["新都区", "510100"], "510115": ["温江区", "510100"], "510121": ["金堂县", "510100"], "510122": ["双流县", "510100"], "510124": ["郫县", "510100"], "510129": ["大邑县", "510100"], "510131": ["蒲江县", "510100"], "510132": ["新津县", "510100"], "510181": ["都江堰市", "510100"], "510182": ["彭州市", "510100"], "510183": ["邛崃市", "510100"], "510184": ["崇州市", "510100"], "510185": ["其它区", "510100"], "510300": ["自贡市", "510000"], "510302": ["自流井区", "510300"], "510303": ["贡井区", "510300"], "510304": ["大安区", "510300"], "510311": ["沿滩区", "510300"], "510321": ["荣县", "510300"], "510322": ["富顺县", "510300"], "510323": ["其它区", "510300"], "510400": ["攀枝花市", "510000"], "510402": ["东区", "510400"], "510403": ["西区", "510400"], "510411": ["仁和区", "510400"], "510421": ["米易县", "510400"], "510422": ["盐边县", "510400"], "510423": ["其它区", "510400"], "510500": ["泸州市", "510000"], "510502": ["江阳区", "510500"], "510503": ["纳溪区", "510500"], "510504": ["龙马潭区", "510500"], "510521": ["泸县", "510500"], "510522": ["合江县", "510500"], "510524": ["叙永县", "510500"], "510525": ["古蔺县", "510500"], "510526": ["其它区", "510500"], "510600": ["德阳市", "510000"], "510603": ["旌阳区", "510600"], "510623": ["中江县", "510600"], "510626": ["罗江县", "510600"], "510681": ["广汉市", "510600"], "510682": ["什邡市", "510600"], "510683": ["绵竹市", "510600"], "510684": ["其它区", "510600"], "510700": ["绵阳市", "510000"], "510703": ["涪城区", "510700"], "510704": ["游仙区", "510700"], "510722": ["三台县", "510700"], "510723": ["盐亭县", "510700"], "510724": ["安县", "510700"], "510725": ["梓潼县", "510700"], "510726": ["北川羌族自治县", "510700"], "510727": ["平武县", "510700"], "510751": ["高新区", "510700"], "510781": ["江油市", "510700"], "510782": ["其它区", "510700"], "510800": ["广元市", "510000"], "510802": ["利州区", "510800"], "510811": ["元坝区", "510800"], "510812": ["朝天区", "510800"], "510821": ["旺苍县", "510800"], "510822": ["青川县", "510800"], "510823": ["剑阁县", "510800"], "510824": ["苍溪县", "510800"], "510825": ["其它区", "510800"], "510900": ["遂宁市", "510000"], "510903": ["船山区", "510900"], "510904": ["安居区", "510900"], "510921": ["蓬溪县", "510900"], "510922": ["射洪县", "510900"], "510923": ["大英县", "510900"], "510924": ["其它区", "510900"], "511000": ["内江市", "510000"], "511002": ["市中区", "511000"], "511011": ["东兴区", "511000"], "511024": ["威远县", "511000"], "511025": ["资中县", "511000"], "511028": ["隆昌县", "511000"], "511029": ["其它区", "511000"], "511100": ["乐山市", "510000"], "511102": ["市中区", "511100"], "511111": ["沙湾区", "511100"], "511112": ["五通桥区", "511100"], "511113": ["金口河区", "511100"], "511123": ["犍为县", "511100"], "511124": ["井研县", "511100"], "511126": ["夹江县", "511100"], "511129": ["沐川县", "511100"], "511132": ["峨边彝族自治县", "511100"], "511133": ["马边彝族自治县", "511100"], "511181": ["峨眉山市", "511100"], "511182": ["其它区", "511100"], "511300": ["南充市", "510000"], "511302": ["顺庆区", "511300"], "511303": ["高坪区", "511300"], "511304": ["嘉陵区", "511300"], "511321": ["南部县", "511300"], "511322": ["营山县", "511300"], "511323": ["蓬安县", "511300"], "511324": ["仪陇县", "511300"], "511325": ["西充县", "511300"], "511381": ["阆中市", "511300"], "511382": ["其它区", "511300"], "511400": ["眉山市", "510000"], "511402": ["东坡区", "511400"], "511421": ["仁寿县", "511400"], "511422": ["彭山县", "511400"], "511423": ["洪雅县", "511400"], "511424": ["丹棱县", "511400"], "511425": ["青神县", "511400"], "511426": ["其它区", "511400"], "511500": ["宜宾市", "510000"], "511502": ["翠屏区", "511500"], "511521": ["宜宾县", "511500"], "511522": ["南溪县", "511500"], "511523": ["江安县", "511500"], "511524": ["长宁县", "511500"], "511525": ["高县", "511500"], "511526": ["珙县", "511500"], "511527": ["筠连县", "511500"], "511528": ["兴文县", "511500"], "511529": ["屏山县", "511500"], "511530": ["其它区", "511500"], "511600": ["广安市", "510000"], "511602": ["广安区", "511600"], "511621": ["岳池县", "511600"], "511622": ["武胜县", "511600"], "511623": ["邻水县", "511600"], "511681": ["华蓥市", "511600"], "511682": ["市辖区", "511600"], "511683": ["其它区", "511600"], "511700": ["达州市", "510000"], "511702": ["通川区", "511700"], "511721": ["达县", "511700"], "511722": ["宣汉县", "511700"], "511723": ["开江县", "511700"], "511724": ["大竹县", "511700"], "511725": ["渠县", "511700"], "511781": ["万源市", "511700"], "511782": ["其它区", "511700"], "511800": ["雅安市", "510000"], "511802": ["雨城区", "511800"], "511821": ["名山县", "511800"], "511822": ["荥经县", "511800"], "511823": ["汉源县", "511800"], "511824": ["石棉县", "511800"], "511825": ["天全县", "511800"], "511826": ["芦山县", "511800"], "511827": ["宝兴县", "511800"], "511828": ["其它区", "511800"], "511900": ["巴中市", "510000"], "511902": ["巴州区", "511900"], "511921": ["通江县", "511900"], "511922": ["南江县", "511900"], "511923": ["平昌县", "511900"], "511924": ["其它区", "511900"], "512000": ["资阳市", "510000"], "512002": ["雁江区", "512000"], "512021": ["安岳县", "512000"], "512022": ["乐至县", "512000"], "512081": ["简阳市", "512000"], "512082": ["其它区", "512000"], "513200": ["阿坝藏族羌族自治州", "510000"], "513221": ["汶川县", "513200"], "513222": ["理县", "513200"], "513223": ["茂县", "513200"], "513224": ["松潘县", "513200"], "513225": ["九寨沟县", "513200"], "513226": ["金川县", "513200"], "513227": ["小金县", "513200"], "513228": ["黑水县", "513200"], "513229": ["马尔康县", "513200"], "513230": ["壤塘县", "513200"], "513231": ["阿坝县", "513200"], "513232": ["若尔盖县", "513200"], "513233": ["红原县", "513200"], "513234": ["其它区", "513200"], "513300": ["甘孜藏族自治州", "510000"], "513321": ["康定县", "513300"], "513322": ["泸定县", "513300"], "513323": ["丹巴县", "513300"], "513324": ["九龙县", "513300"], "513325": ["雅江县", "513300"], "513326": ["道孚县", "513300"], "513327": ["炉霍县", "513300"], "513328": ["甘孜县", "513300"], "513329": ["新龙县", "513300"], "513330": ["德格县", "513300"], "513331": ["白玉县", "513300"], "513332": ["石渠县", "513300"], "513333": ["色达县", "513300"], "513334": ["理塘县", "513300"], "513335": ["巴塘县", "513300"], "513336": ["乡城县", "513300"], "513337": ["稻城县", "513300"], "513338": ["得荣县", "513300"], "513339": ["其它区", "513300"], "513400": ["凉山彝族自治州", "510000"], "513401": ["西昌市", "513400"], "513422": ["木里藏族自治县", "513400"], "513423": ["盐源县", "513400"], "513424": ["德昌县", "513400"], "513425": ["会理县", "513400"], "513426": ["会东县", "513400"], "513427": ["宁南县", "513400"], "513428": ["普格县", "513400"], "513429": ["布拖县", "513400"], "513430": ["金阳县", "513400"], "513431": ["昭觉县", "513400"], "513432": ["喜德县", "513400"], "513433": ["冕宁县", "513400"], "513434": ["越西县", "513400"], "513435": ["甘洛县", "513400"], "513436": ["美姑县", "513400"], "513437": ["雷波县", "513400"], "513438": ["其它区", "513400"], "520000": ["贵州省", "1"], "520100": ["贵阳市", "520000"], "520102": ["南明区", "520100"], "520103": ["云岩区", "520100"], "520111": ["花溪区", "520100"], "520112": ["乌当区", "520100"], "520113": ["白云区", "520100"], "520114": ["小河区", "520100"], "520121": ["开阳县", "520100"], "520122": ["息烽县", "520100"], "520123": ["修文县", "520100"], "520151": ["金阳开发区", "520100"], "520181": ["清镇市", "520100"], "520182": ["其它区", "520100"], "520200": ["六盘水市", "520000"], "520201": ["钟山区", "520200"], "520203": ["六枝特区", "520200"], "520221": ["水城县", "520200"], "520222": ["盘县", "520200"], "520223": ["其它区", "520200"], "520300": ["遵义市", "520000"], "520302": ["红花岗区", "520300"], "520303": ["汇川区", "520300"], "520321": ["遵义县", "520300"], "520322": ["桐梓县", "520300"], "520323": ["绥阳县", "520300"], "520324": ["正安县", "520300"], "520325": ["道真仡佬族苗族自治县", "520300"], "520326": ["务川仡佬族苗族自治县", "520300"], "520327": ["凤冈县", "520300"], "520328": ["湄潭县", "520300"], "520329": ["余庆县", "520300"], "520330": ["习水县", "520300"], "520381": ["赤水市", "520300"], "520382": ["仁怀市", "520300"], "520383": ["其它区", "520300"], "520400": ["安顺市", "520000"], "520402": ["西秀区", "520400"], "520421": ["平坝县", "520400"], "520422": ["普定县", "520400"], "520423": ["镇宁布依族苗族自治县", "520400"], "520424": ["关岭布依族苗族自治县", "520400"], "520425": ["紫云苗族布依族自治县", "520400"], "520426": ["其它区", "520400"], "522200": ["铜仁地区", "520000"], "522201": ["铜仁市", "522200"], "522222": ["江口县", "522200"], "522223": ["玉屏侗族自治县", "522200"], "522224": ["石阡县", "522200"], "522225": ["思南县", "522200"], "522226": ["印江土家族苗族自治县", "522200"], "522227": ["德江县", "522200"], "522228": ["沿河土家族自治县", "522200"], "522229": ["松桃苗族自治县", "522200"], "522230": ["万山特区", "522200"], "522231": ["其它区", "522200"], "522300": ["黔西南布依族苗族自治州", "520000"], "522301": ["兴义市", "522300"], "522322": ["兴仁县", "522300"], "522323": ["普安县", "522300"], "522324": ["晴隆县", "522300"], "522325": ["贞丰县", "522300"], "522326": ["望谟县", "522300"], "522327": ["册亨县", "522300"], "522328": ["安龙县", "522300"], "522329": ["其它区", "522300"], "522400": ["毕节地区", "520000"], "522401": ["毕节市", "522400"], "522422": ["大方县", "522400"], "522423": ["黔西县", "522400"], "522424": ["金沙县", "522400"], "522425": ["织金县", "522400"], "522426": ["纳雍县", "522400"], "522427": ["威宁彝族回族苗族自治县", "522400"], "522428": ["赫章县", "522400"], "522429": ["其它区", "522400"], "522600": ["黔东南苗族侗族自治州", "520000"], "522601": ["凯里市", "522600"], "522622": ["黄平县", "522600"], "522623": ["施秉县", "522600"], "522624": ["三穗县", "522600"], "522625": ["镇远县", "522600"], "522626": ["岑巩县", "522600"], "522627": ["天柱县", "522600"], "522628": ["锦屏县", "522600"], "522629": ["剑河县", "522600"], "522630": ["台江县", "522600"], "522631": ["黎平县", "522600"], "522632": ["榕江县", "522600"], "522633": ["从江县", "522600"], "522634": ["雷山县", "522600"], "522635": ["麻江县", "522600"], "522636": ["丹寨县", "522600"], "522637": ["其它区", "522600"], "522700": ["黔南布依族苗族自治州", "520000"], "522701": ["都匀市", "522700"], "522702": ["福泉市", "522700"], "522722": ["荔波县", "522700"], "522723": ["贵定县", "522700"], "522725": ["瓮安县", "522700"], "522726": ["独山县", "522700"], "522727": ["平塘县", "522700"], "522728": ["罗甸县", "522700"], "522729": ["长顺县", "522700"], "522730": ["龙里县", "522700"], "522731": ["惠水县", "522700"], "522732": ["三都水族自治县", "522700"], "522733": ["其它区", "522700"], "530000": ["云南省", "1"], "530100": ["昆明市", "530000"], "530102": ["五华区", "530100"], "530103": ["盘龙区", "530100"], "530111": ["官渡区", "530100"], "530112": ["西山区", "530100"], "530113": ["东川区", "530100"], "530121": ["呈贡县", "530100"], "530122": ["晋宁县", "530100"], "530124": ["富民县", "530100"], "530125": ["宜良县", "530100"], "530126": ["石林彝族自治县", "530100"], "530127": ["嵩明县", "530100"], "530128": ["禄劝彝族苗族自治县", "530100"], "530129": ["寻甸回族彝族自治县", "530100"], "530181": ["安宁市", "530100"], "530182": ["其它区", "530100"], "530300": ["曲靖市", "530000"], "530302": ["麒麟区", "530300"], "530321": ["马龙县", "530300"], "530322": ["陆良县", "530300"], "530323": ["师宗县", "530300"], "530324": ["罗平县", "530300"], "530325": ["富源县", "530300"], "530326": ["会泽县", "530300"], "530328": ["沾益县", "530300"], "530381": ["宣威市", "530300"], "530382": ["其它区", "530300"], "530400": ["玉溪市", "530000"], "530402": ["红塔区", "530400"], "530421": ["江川县", "530400"], "530422": ["澄江县", "530400"], "530423": ["通海县", "530400"], "530424": ["华宁县", "530400"], "530425": ["易门县", "530400"], "530426": ["峨山彝族自治县", "530400"], "530427": ["新平彝族傣族自治县", "530400"], "530428": ["元江哈尼族彝族傣族自治县", "530400"], "530429": ["其它区", "530400"], "530500": ["保山市", "530000"], "530502": ["隆阳区", "530500"], "530521": ["施甸县", "530500"], "530522": ["腾冲县", "530500"], "530523": ["龙陵县", "530500"], "530524": ["昌宁县", "530500"], "530525": ["其它区", "530500"], "530600": ["昭通市", "530000"], "530602": ["昭阳区", "530600"], "530621": ["鲁甸县", "530600"], "530622": ["巧家县", "530600"], "530623": ["盐津县", "530600"], "530624": ["大关县", "530600"], "530625": ["永善县", "530600"], "530626": ["绥江县", "530600"], "530627": ["镇雄县", "530600"], "530628": ["彝良县", "530600"], "530629": ["威信县", "530600"], "530630": ["水富县", "530600"], "530631": ["其它区", "530600"], "530700": ["丽江市", "530000"], "530702": ["古城区", "530700"], "530721": ["玉龙纳西族自治县", "530700"], "530722": ["永胜县", "530700"], "530723": ["华坪县", "530700"], "530724": ["宁蒗彝族自治县", "530700"], "530725": ["其它区", "530700"], "530800": ["普洱市", "530000"], "530802": ["思茅区", "530800"], "530821": ["宁洱哈尼族彝族自治县", "530800"], "530822": ["墨江哈尼族自治县", "530800"], "530823": ["景东彝族自治县", "530800"], "530824": ["景谷傣族彝族自治县", "530800"], "530825": ["镇沅彝族哈尼族拉祜族自治县", "530800"], "530826": ["江城哈尼族彝族自治县", "530800"], "530827": ["孟连傣族拉祜族佤族自治县", "530800"], "530828": ["澜沧拉祜族自治县", "530800"], "530829": ["西盟佤族自治县", "530800"], "530830": ["其它区", "530800"], "530900": ["临沧市", "530000"], "530902": ["临翔区", "530900"], "530921": ["凤庆县", "530900"], "530922": ["云县", "530900"], "530923": ["永德县", "530900"], "530924": ["镇康县", "530900"], "530925": ["双江拉祜族佤族布朗族傣族自治县", "530900"], "530926": ["耿马傣族佤族自治县", "530900"], "530927": ["沧源佤族自治县", "530900"], "530928": ["其它区", "530900"], "532300": ["楚雄彝族自治州", "530000"], "532301": ["楚雄市", "532300"], "532322": ["双柏县", "532300"], "532323": ["牟定县", "532300"], "532324": ["南华县", "532300"], "532325": ["姚安县", "532300"], "532326": ["大姚县", "532300"], "532327": ["永仁县", "532300"], "532328": ["元谋县", "532300"], "532329": ["武定县", "532300"], "532331": ["禄丰县", "532300"], "532332": ["其它区", "532300"], "532500": ["红河哈尼族彝族自治州", "530000"], "532501": ["个旧市", "532500"], "532502": ["开远市", "532500"], "532522": ["蒙自县", "532500"], "532523": ["屏边苗族自治县", "532500"], "532524": ["建水县", "532500"], "532525": ["石屏县", "532500"], "532526": ["弥勒县", "532500"], "532527": ["泸西县", "532500"], "532528": ["元阳县", "532500"], "532529": ["红河县", "532500"], "532530": ["金平苗族瑶族傣族自治县", "532500"], "532531": ["绿春县", "532500"], "532532": ["河口瑶族自治县", "532500"], "532533": ["其它区", "532500"], "532600": ["文山壮族苗族自治州", "530000"], "532621": ["文山县", "532600"], "532622": ["砚山县", "532600"], "532623": ["西畴县", "532600"], "532624": ["麻栗坡县", "532600"], "532625": ["马关县", "532600"], "532626": ["丘北县", "532600"], "532627": ["广南县", "532600"], "532628": ["富宁县", "532600"], "532629": ["其它区", "532600"], "532800": ["西双版纳傣族自治州", "530000"], "532801": ["景洪市", "532800"], "532822": ["勐海县", "532800"], "532823": ["勐腊县", "532800"], "532824": ["其它区", "532800"], "532900": ["大理白族自治州", "530000"], "532901": ["大理市", "532900"], "532922": ["漾濞彝族自治县", "532900"], "532923": ["祥云县", "532900"], "532924": ["宾川县", "532900"], "532925": ["弥渡县", "532900"], "532926": ["南涧彝族自治县", "532900"], "532927": ["巍山彝族回族自治县", "532900"], "532928": ["永平县", "532900"], "532929": ["云龙县", "532900"], "532930": ["洱源县", "532900"], "532931": ["剑川县", "532900"], "532932": ["鹤庆县", "532900"], "532933": ["其它区", "532900"], "533100": ["德宏傣族景颇族自治州", "530000"], "533102": ["瑞丽市", "533100"], "533103": ["潞西市", "533100"], "533122": ["梁河县", "533100"], "533123": ["盈江县", "533100"], "533124": ["陇川县", "533100"], "533125": ["其它区", "533100"], "533300": ["怒江傈僳族自治州", "530000"], "533321": ["泸水县", "533300"], "533323": ["福贡县", "533300"], "533324": ["贡山独龙族怒族自治县", "533300"], "533325": ["兰坪白族普米族自治县", "533300"], "533326": ["其它区", "533300"], "533400": ["迪庆藏族自治州", "530000"], "533421": ["香格里拉县", "533400"], "533422": ["德钦县", "533400"], "533423": ["维西傈僳族自治县", "533400"], "533424": ["其它区", "533400"], "540000": ["西藏自治区", "1"], "540100": ["拉萨市", "540000"], "540102": ["城关区", "540100"], "540121": ["林周县", "540100"], "540122": ["当雄县", "540100"], "540123": ["尼木县", "540100"], "540124": ["曲水县", "540100"], "540125": ["堆龙德庆县", "540100"], "540126": ["达孜县", "540100"], "540127": ["墨竹工卡县", "540100"], "540128": ["其它区", "540100"], "542100": ["昌都地区", "540000"], "542121": ["昌都县", "542100"], "542122": ["江达县", "542100"], "542123": ["贡觉县", "542100"], "542124": ["类乌齐县", "542100"], "542125": ["丁青县", "542100"], "542126": ["察雅县", "542100"], "542127": ["八宿县", "542100"], "542128": ["左贡县", "542100"], "542129": ["芒康县", "542100"], "542132": ["洛隆县", "542100"], "542133": ["边坝县", "542100"], "542134": ["其它区", "542100"], "542200": ["山南地区", "540000"], "542221": ["乃东县", "542200"], "542222": ["扎囊县", "542200"], "542223": ["贡嘎县", "542200"], "542224": ["桑日县", "542200"], "542225": ["琼结县", "542200"], "542226": ["曲松县", "542200"], "542227": ["措美县", "542200"], "542228": ["洛扎县", "542200"], "542229": ["加查县", "542200"], "542231": ["隆子县", "542200"], "542232": ["错那县", "542200"], "542233": ["浪卡子县", "542200"], "542234": ["其它区", "542200"], "542300": ["日喀则地区", "540000"], "542301": ["日喀则市", "542300"], "542322": ["南木林县", "542300"], "542323": ["江孜县", "542300"], "542324": ["定日县", "542300"], "542325": ["萨迦县", "542300"], "542326": ["拉孜县", "542300"], "542327": ["昂仁县", "542300"], "542328": ["谢通门县", "542300"], "542329": ["白朗县", "542300"], "542330": ["仁布县", "542300"], "542331": ["康马县", "542300"], "542332": ["定结县", "542300"], "542333": ["仲巴县", "542300"], "542334": ["亚东县", "542300"], "542335": ["吉隆县", "542300"], "542336": ["聂拉木县", "542300"], "542337": ["萨嘎县", "542300"], "542338": ["岗巴县", "542300"], "542339": ["其它区", "542300"], "542400": ["那曲地区", "540000"], "542421": ["那曲县", "542400"], "542422": ["嘉黎县", "542400"], "542423": ["比如县", "542400"], "542424": ["聂荣县", "542400"], "542425": ["安多县", "542400"], "542426": ["申扎县", "542400"], "542427": ["索县", "542400"], "542428": ["班戈县", "542400"], "542429": ["巴青县", "542400"], "542430": ["尼玛县", "542400"], "542431": ["其它区", "542400"], "542500": ["阿里地区", "540000"], "542521": ["普兰县", "542500"], "542522": ["札达县", "542500"], "542523": ["噶尔县", "542500"], "542524": ["日土县", "542500"], "542525": ["革吉县", "542500"], "542526": ["改则县", "542500"], "542527": ["措勤县", "542500"], "542528": ["其它区", "542500"], "542600": ["林芝地区", "540000"], "542621": ["林芝县", "542600"], "542622": ["工布江达县", "542600"], "542623": ["米林县", "542600"], "542624": ["墨脱县", "542600"], "542625": ["波密县", "542600"], "542626": ["察隅县", "542600"], "542627": ["朗县", "542600"], "542628": ["其它区", "542600"], "610000": ["陕西省", "1"], "610100": ["西安市", "610000"], "610102": ["新城区", "610100"], "610103": ["碑林区", "610100"], "610104": ["莲湖区", "610100"], "610111": ["灞桥区", "610100"], "610112": ["未央区", "610100"], "610113": ["雁塔区", "610100"], "610114": ["阎良区", "610100"], "610115": ["临潼区", "610100"], "610116": ["长安区", "610100"], "610122": ["蓝田县", "610100"], "610124": ["周至县", "610100"], "610125": ["户县", "610100"], "610126": ["高陵县", "610100"], "610127": ["其它区", "610100"], "610200": ["铜川市", "610000"], "610202": ["王益区", "610200"], "610203": ["印台区", "610200"], "610204": ["耀州区", "610200"], "610222": ["宜君县", "610200"], "610223": ["其它区", "610200"], "610300": ["宝鸡市", "610000"], "610302": ["渭滨区", "610300"], "610303": ["金台区", "610300"], "610304": ["陈仓区", "610300"], "610322": ["凤翔县", "610300"], "610323": ["岐山县", "610300"], "610324": ["扶风县", "610300"], "610326": ["眉县", "610300"], "610327": ["陇县", "610300"], "610328": ["千阳县", "610300"], "610329": ["麟游县", "610300"], "610330": ["凤县", "610300"], "610331": ["太白县", "610300"], "610332": ["其它区", "610300"], "610400": ["咸阳市", "610000"], "610402": ["秦都区", "610400"], "610403": ["杨凌区", "610400"], "610404": ["渭城区", "610400"], "610422": ["三原县", "610400"], "610423": ["泾阳县", "610400"], "610424": ["乾县", "610400"], "610425": ["礼泉县", "610400"], "610426": ["永寿县", "610400"], "610427": ["彬县", "610400"], "610428": ["长武县", "610400"], "610429": ["旬邑县", "610400"], "610430": ["淳化县", "610400"], "610431": ["武功县", "610400"], "610481": ["兴平市", "610400"], "610482": ["其它区", "610400"], "610500": ["渭南市", "610000"], "610502": ["临渭区", "610500"], "610521": ["华县", "610500"], "610522": ["潼关县", "610500"], "610523": ["大荔县", "610500"], "610524": ["合阳县", "610500"], "610525": ["澄城县", "610500"], "610526": ["蒲城县", "610500"], "610527": ["白水县", "610500"], "610528": ["富平县", "610500"], "610581": ["韩城市", "610500"], "610582": ["华阴市", "610500"], "610583": ["其它区", "610500"], "610600": ["延安市", "610000"], "610602": ["宝塔区", "610600"], "610621": ["延长县", "610600"], "610622": ["延川县", "610600"], "610623": ["子长县", "610600"], "610624": ["安塞县", "610600"], "610625": ["志丹县", "610600"], "610626": ["吴起县", "610600"], "610627": ["甘泉县", "610600"], "610628": ["富县", "610600"], "610629": ["洛川县", "610600"], "610630": ["宜川县", "610600"], "610631": ["黄龙县", "610600"], "610632": ["黄陵县", "610600"], "610633": ["其它区", "610600"], "610700": ["汉中市", "610000"], "610702": ["汉台区", "610700"], "610721": ["南郑县", "610700"], "610722": ["城固县", "610700"], "610723": ["洋县", "610700"], "610724": ["西乡县", "610700"], "610725": ["勉县", "610700"], "610726": ["宁强县", "610700"], "610727": ["略阳县", "610700"], "610728": ["镇巴县", "610700"], "610729": ["留坝县", "610700"], "610730": ["佛坪县", "610700"], "610731": ["其它区", "610700"], "610800": ["榆林市", "610000"], "610802": ["榆阳区", "610800"], "610821": ["神木县", "610800"], "610822": ["府谷县", "610800"], "610823": ["横山县", "610800"], "610824": ["靖边县", "610800"], "610825": ["定边县", "610800"], "610826": ["绥德县", "610800"], "610827": ["米脂县", "610800"], "610828": ["佳县", "610800"], "610829": ["吴堡县", "610800"], "610830": ["清涧县", "610800"], "610831": ["子洲县", "610800"], "610832": ["其它区", "610800"], "610900": ["安康市", "610000"], "610902": ["汉滨区", "610900"], "610921": ["汉阴县", "610900"], "610922": ["石泉县", "610900"], "610923": ["宁陕县", "610900"], "610924": ["紫阳县", "610900"], "610925": ["岚皋县", "610900"], "610926": ["平利县", "610900"], "610927": ["镇坪县", "610900"], "610928": ["旬阳县", "610900"], "610929": ["白河县", "610900"], "610930": ["其它区", "610900"], "611000": ["商洛市", "610000"], "611002": ["商州区", "611000"], "611021": ["洛南县", "611000"], "611022": ["丹凤县", "611000"], "611023": ["商南县", "611000"], "611024": ["山阳县", "611000"], "611025": ["镇安县", "611000"], "611026": ["柞水县", "611000"], "611027": ["其它区", "611000"], "620000": ["甘肃省", "1"], "620100": ["兰州市", "620000"], "620102": ["城关区", "620100"], "620103": ["七里河区", "620100"], "620104": ["西固区", "620100"], "620105": ["安宁区", "620100"], "620111": ["红古区", "620100"], "620121": ["永登县", "620100"], "620122": ["皋兰县", "620100"], "620123": ["榆中县", "620100"], "620124": ["其它区", "620100"], "620200": ["嘉峪关市", "620000"], "620256": ["雄关区", "620200"], "620257": ["长城区", "620200"], "620258": ["镜铁区", "620200"], "620300": ["金昌市", "620000"], "620302": ["金川区", "620300"], "620321": ["永昌县", "620300"], "620322": ["其它区", "620300"], "620400": ["白银市", "620000"], "620402": ["白银区", "620400"], "620403": ["平川区", "620400"], "620421": ["靖远县", "620400"], "620422": ["会宁县", "620400"], "620423": ["景泰县", "620400"], "620424": ["其它区", "620400"], "620500": ["天水市", "620000"], "620502": ["秦州区", "620500"], "620503": ["麦积区", "620500"], "620521": ["清水县", "620500"], "620522": ["秦安县", "620500"], "620523": ["甘谷县", "620500"], "620524": ["武山县", "620500"], "620525": ["张家川回族自治县", "620500"], "620526": ["其它区", "620500"], "620600": ["武威市", "620000"], "620602": ["凉州区", "620600"], "620621": ["民勤县", "620600"], "620622": ["古浪县", "620600"], "620623": ["天祝藏族自治县", "620600"], "620624": ["其它区", "620600"], "620700": ["张掖市", "620000"], "620702": ["甘州区", "620700"], "620721": ["肃南裕固族自治县", "620700"], "620722": ["民乐县", "620700"], "620723": ["临泽县", "620700"], "620724": ["高台县", "620700"], "620725": ["山丹县", "620700"], "620726": ["其它区", "620700"], "620800": ["平凉市", "620000"], "620802": ["崆峒区", "620800"], "620821": ["泾川县", "620800"], "620822": ["灵台县", "620800"], "620823": ["崇信县", "620800"], "620824": ["华亭县", "620800"], "620825": ["庄浪县", "620800"], "620826": ["静宁县", "620800"], "620827": ["其它区", "620800"], "620900": ["酒泉市", "620000"], "620902": ["肃州区", "620900"], "620921": ["金塔县", "620900"], "620922": ["安西县", "620900"], "620923": ["肃北蒙古族自治县", "620900"], "620924": ["阿克塞哈萨克族自治县", "620900"], "620981": ["玉门市", "620900"], "620982": ["敦煌市", "620900"], "620983": ["其它区", "620900"], "621000": ["庆阳市", "620000"], "621002": ["西峰区", "621000"], "621021": ["庆城县", "621000"], "621022": ["环县", "621000"], "621023": ["华池县", "621000"], "621024": ["合水县", "621000"], "621025": ["正宁县", "621000"], "621026": ["宁县", "621000"], "621027": ["镇原县", "621000"], "621028": ["其它区", "621000"], "621100": ["定西市", "620000"], "621102": ["安定区", "621100"], "621121": ["通渭县", "621100"], "621122": ["陇西县", "621100"], "621123": ["渭源县", "621100"], "621124": ["临洮县", "621100"], "621125": ["漳县", "621100"], "621126": ["岷县", "621100"], "621127": ["其它区", "621100"], "621200": ["陇南市", "620000"], "621202": ["武都区", "621200"], "621221": ["成县", "621200"], "621222": ["文县", "621200"], "621223": ["宕昌县", "621200"], "621224": ["康县", "621200"], "621225": ["西和县", "621200"], "621226": ["礼县", "621200"], "621227": ["徽县", "621200"], "621228": ["两当县", "621200"], "621229": ["其它区", "621200"], "622900": ["临夏回族自治州", "620000"], "622901": ["临夏市", "622900"], "622921": ["临夏县", "622900"], "622922": ["康乐县", "622900"], "622923": ["永靖县", "622900"], "622924": ["广河县", "622900"], "622925": ["和政县", "622900"], "622926": ["东乡族自治县", "622900"], "622927": ["积石山保安族东乡族撒拉族自治县", "622900"], "622928": ["其它区", "622900"], "623000": ["甘南藏族自治州", "620000"], "623001": ["合作市", "623000"], "623021": ["临潭县", "623000"], "623022": ["卓尼县", "623000"], "623023": ["舟曲县", "623000"], "623024": ["迭部县", "623000"], "623025": ["玛曲县", "623000"], "623026": ["碌曲县", "623000"], "623027": ["夏河县", "623000"], "623028": ["其它区", "623000"], "630000": ["青海省", "1"], "630100": ["西宁市", "630000"], "630102": ["城东区", "630100"], "630103": ["城中区", "630100"], "630104": ["城西区", "630100"], "630105": ["城北区", "630100"], "630121": ["大通回族土族自治县", "630100"], "630122": ["湟中县", "630100"], "630123": ["湟源县", "630100"], "630124": ["其它区", "630100"], "632100": ["海东地区", "630000"], "632121": ["平安县", "632100"], "632122": ["民和回族土族自治县", "632100"], "632123": ["乐都县", "632100"], "632126": ["互助土族自治县", "632100"], "632127": ["化隆回族自治县", "632100"], "632128": ["循化撒拉族自治县", "632100"], "632129": ["其它区", "632100"], "632200": ["海北藏族自治州", "630000"], "632221": ["门源回族自治县", "632200"], "632222": ["祁连县", "632200"], "632223": ["海晏县", "632200"], "632224": ["刚察县", "632200"], "632225": ["其它区", "632200"], "632300": ["黄南藏族自治州", "630000"], "632321": ["同仁县", "632300"], "632322": ["尖扎县", "632300"], "632323": ["泽库县", "632300"], "632324": ["河南蒙古族自治县", "632300"], "632325": ["其它区", "632300"], "632500": ["海南藏族自治州", "630000"], "632521": ["共和县", "632500"], "632522": ["同德县", "632500"], "632523": ["贵德县", "632500"], "632524": ["兴海县", "632500"], "632525": ["贵南县", "632500"], "632526": ["其它区", "632500"], "632600": ["果洛藏族自治州", "630000"], "632621": ["玛沁县", "632600"], "632622": ["班玛县", "632600"], "632623": ["甘德县", "632600"], "632624": ["达日县", "632600"], "632625": ["久治县", "632600"], "632626": ["玛多县", "632600"], "632627": ["其它区", "632600"], "632700": ["玉树藏族自治州", "630000"], "632721": ["玉树县", "632700"], "632722": ["杂多县", "632700"], "632723": ["称多县", "632700"], "632724": ["治多县", "632700"], "632725": ["囊谦县", "632700"], "632726": ["曲麻莱县", "632700"], "632727": ["其它区", "632700"], "632800": ["海西蒙古族藏族自治州", "630000"], "632801": ["格尔木市", "632800"], "632802": ["德令哈市", "632800"], "632821": ["乌兰县", "632800"], "632822": ["都兰县", "632800"], "632823": ["天峻县", "632800"], "632824": ["其它区", "632800"], "640000": ["宁夏回族自治区", "1"], "640100": ["银川市", "640000"], "640104": ["兴庆区", "640100"], "640105": ["西夏区", "640100"], "640106": ["金凤区", "640100"], "640121": ["永宁县", "640100"], "640122": ["贺兰县", "640100"], "640181": ["灵武市", "640100"], "640182": ["其它区", "640100"], "640200": ["石嘴山市", "640000"], "640202": ["大武口区", "640200"], "640205": ["惠农区", "640200"], "640221": ["平罗县", "640200"], "640222": ["其它区", "640200"], "640300": ["吴忠市", "640000"], "640302": ["利通区", "640300"], "640303": ["红寺堡区", "640300"], "640323": ["盐池县", "640300"], "640324": ["同心县", "640300"], "640381": ["青铜峡市", "640300"], "640382": ["其它区", "640300"], "640400": ["固原市", "640000"], "640402": ["原州区", "640400"], "640422": ["西吉县", "640400"], "640423": ["隆德县", "640400"], "640424": ["泾源县", "640400"], "640425": ["彭阳县", "640400"], "640426": ["其它区", "640400"], "640500": ["中卫市", "640000"], "640502": ["沙坡头区", "640500"], "640521": ["中宁县", "640500"], "640522": ["海原县", "640500"], "640523": ["其它区", "640500"], "650000": ["新疆维吾尔自治区", "1"], "650100": ["乌鲁木齐市", "650000"], "650102": ["天山区", "650100"], "650103": ["沙依巴克区", "650100"], "650104": ["新市区", "650100"], "650105": ["水磨沟区", "650100"], "650106": ["头屯河区", "650100"], "650107": ["达坂城区", "650100"], "650108": ["东山区", "650100"], "650109": ["米东区", "650100"], "650121": ["乌鲁木齐县", "650100"], "650122": ["其它区", "650100"], "650200": ["克拉玛依市", "650000"], "650202": ["独山子区", "650200"], "650203": ["克拉玛依区", "650200"], "650204": ["白碱滩区", "650200"], "650205": ["乌尔禾区", "650200"], "650206": ["其它区", "650200"], "652100": ["吐鲁番地区", "650000"], "652101": ["吐鲁番市", "652100"], "652122": ["鄯善县", "652100"], "652123": ["托克逊县", "652100"], "652124": ["其它区", "652100"], "652200": ["哈密地区", "650000"], "652201": ["哈密市", "652200"], "652222": ["巴里坤哈萨克自治县", "652200"], "652223": ["伊吾县", "652200"], "652224": ["其它区", "652200"], "652300": ["昌吉回族自治州", "650000"], "652301": ["昌吉市", "652300"], "652302": ["阜康市", "652300"], "652303": ["米泉市", "652300"], "652323": ["呼图壁县", "652300"], "652324": ["玛纳斯县", "652300"], "652325": ["奇台县", "652300"], "652327": ["吉木萨尔县", "652300"], "652328": ["木垒哈萨克自治县", "652300"], "652329": ["其它区", "652300"], "652700": ["博尔塔拉蒙古自治州", "650000"], "652701": ["博乐市", "652700"], "652722": ["精河县", "652700"], "652723": ["温泉县", "652700"], "652724": ["其它区", "652700"], "652800": ["巴音郭楞蒙古自治州", "650000"], "652801": ["库尔勒市", "652800"], "652822": ["轮台县", "652800"], "652823": ["尉犁县", "652800"], "652824": ["若羌县", "652800"], "652825": ["且末县", "652800"], "652826": ["焉耆回族自治县", "652800"], "652827": ["和静县", "652800"], "652828": ["和硕县", "652800"], "652829": ["博湖县", "652800"], "652830": ["其它区", "652800"], "652900": ["阿克苏地区", "650000"], "652901": ["阿克苏市", "652900"], "652922": ["温宿县", "652900"], "652923": ["库车县", "652900"], "652924": ["沙雅县", "652900"], "652925": ["新和县", "652900"], "652926": ["拜城县", "652900"], "652927": ["乌什县", "652900"], "652928": ["阿瓦提县", "652900"], "652929": ["柯坪县", "652900"], "652930": ["其它区", "652900"], "653000": ["克孜勒苏柯尔克孜自治州", "650000"], "653001": ["阿图什市", "653000"], "653022": ["阿克陶县", "653000"], "653023": ["阿合奇县", "653000"], "653024": ["乌恰县", "653000"], "653025": ["其它区", "653000"], "653100": ["喀什地区", "650000"], "653101": ["喀什市", "653100"], "653121": ["疏附县", "653100"], "653122": ["疏勒县", "653100"], "653123": ["英吉沙县", "653100"], "653124": ["泽普县", "653100"], "653125": ["莎车县", "653100"], "653126": ["叶城县", "653100"], "653127": ["麦盖提县", "653100"], "653128": ["岳普湖县", "653100"], "653129": ["伽师县", "653100"], "653130": ["巴楚县", "653100"], "653131": ["塔什库尔干塔吉克自治县", "653100"], "653132": ["其它区", "653100"], "653200": ["和田地区", "650000"], "653201": ["和田市", "653200"], "653221": ["和田县", "653200"], "653222": ["墨玉县", "653200"], "653223": ["皮山县", "653200"], "653224": ["洛浦县", "653200"], "653225": ["策勒县", "653200"], "653226": ["于田县", "653200"], "653227": ["民丰县", "653200"], "653228": ["其它区", "653200"], "654000": ["伊犁哈萨克自治州", "650000"], "654002": ["伊宁市", "654000"], "654003": ["奎屯市", "654000"], "654021": ["伊宁县", "654000"], "654022": ["察布查尔锡伯自治县", "654000"], "654023": ["霍城县", "654000"], "654024": ["巩留县", "654000"], "654025": ["新源县", "654000"], "654026": ["昭苏县", "654000"], "654027": ["特克斯县", "654000"], "654028": ["尼勒克县", "654000"], "654029": ["其它区", "654000"], "654200": ["塔城地区", "650000"], "654201": ["塔城市", "654200"], "654202": ["乌苏市", "654200"], "654221": ["额敏县", "654200"], "654223": ["沙湾县", "654200"], "654224": ["托里县", "654200"], "654225": ["裕民县", "654200"], "654226": ["和布克赛尔蒙古自治县", "654200"], "654227": ["其它区", "654200"], "654300": ["阿勒泰地区", "650000"], "654301": ["阿勒泰市", "654300"], "654321": ["布尔津县", "654300"], "654322": ["富蕴县", "654300"], "654323": ["福海县", "654300"], "654324": ["哈巴河县", "654300"], "654325": ["青河县", "654300"], "654326": ["吉木乃县", "654300"], "654327": ["其它区", "654300"], "659001": ["石河子市", "650000"], "659002": ["阿拉尔市", "650000"], "659003": ["图木舒克市", "650000"], "659004": ["五家渠市", "650000"], "710000": ["台湾省", "1"], "710100": ["台北市", "710000"], "710101": ["中正区", "710100"], "710102": ["大同区", "710100"], "710103": ["中山区", "710100"], "710104": ["松山区", "710100"], "710105": ["大安区", "710100"], "710106": ["万华区", "710100"], "710107": ["信义区", "710100"], "710108": ["士林区", "710100"], "710109": ["北投区", "710100"], "710110": ["内湖区", "710100"], "710111": ["南港区", "710100"], "710112": ["文山区", "710100"], "710113": ["其它区", "710100"], "710200": ["高雄市", "710000"], "710201": ["新兴区", "710200"], "710202": ["前金区", "710200"], "710203": ["芩雅区", "710200"], "710204": ["盐埕区", "710200"], "710205": ["鼓山区", "710200"], "710206": ["旗津区", "710200"], "710207": ["前镇区", "710200"], "710208": ["三民区", "710200"], "710209": ["左营区", "710200"], "710210": ["楠梓区", "710200"], "710211": ["小港区", "710200"], "710212": ["其它区", "710200"], "710300": ["台南市", "710000"], "710301": ["中西区", "710300"], "710302": ["东区", "710300"], "710303": ["南区", "710300"], "710304": ["北区", "710300"], "710305": ["安平区", "710300"], "710306": ["安南区", "710300"], "710307": ["其它区", "710300"], "710400": ["台中市", "710000"], "710401": ["中区", "710400"], "710402": ["东区", "710400"], "710403": ["南区", "710400"], "710404": ["西区", "710400"], "710405": ["北区", "710400"], "710406": ["北屯区", "710400"], "710407": ["西屯区", "710400"], "710408": ["南屯区", "710400"], "710409": ["其它区", "710400"], "710500": ["金门县", "710000"], "710600": ["南投县", "710000"], "710700": ["基隆市", "710000"], "710701": ["仁爱区", "710700"], "710702": ["信义区", "710700"], "710703": ["中正区", "710700"], "710704": ["中山区", "710700"], "710705": ["安乐区", "710700"], "710706": ["暖暖区", "710700"], "710707": ["七堵区", "710700"], "710708": ["其它区", "710700"], "710800": ["新竹市", "710000"], "710801": ["东区", "710800"], "710802": ["北区", "710800"], "710803": ["香山区", "710800"], "710804": ["其它区", "710800"], "710900": ["嘉义市", "710000"], "710901": ["东区", "710900"], "710902": ["西区", "710900"], "710903": ["其它区", "710900"], "711100": ["新北市", "710000"], "711200": ["宜兰县", "710000"], "711300": ["新竹县", "710000"], "711400": ["桃园县", "710000"], "711500": ["苗栗县", "710000"], "711700": ["彰化县", "710000"], "711900": ["嘉义县", "710000"], "712100": ["云林县", "710000"], "712400": ["屏东县", "710000"], "712500": ["台东县", "710000"], "712600": ["花莲县", "710000"], "712700": ["澎湖县", "710000"], "810000": ["香港特别行政区", "1"], "810100": ["香港岛", "810000"], "810101": ["中西区", "810100"], "810102": ["湾仔", "810100"], "810103": ["东区", "810100"], "810104": ["南区", "810100"], "810200": ["九龙", "810000"], "810201": ["九龙城区", "810200"], "810202": ["油尖旺区", "810200"], "810203": ["深水埗区", "810200"], "810204": ["黄大仙区", "810200"], "810205": ["观塘区", "810200"], "810300": ["新界", "810000"], "810301": ["北区", "810300"], "810302": ["大埔区", "810300"], "810303": ["沙田区", "810300"], "810304": ["西贡区", "810300"], "810305": ["元朗区", "810300"], "810306": ["屯门区", "810300"], "810307": ["荃湾区", "810300"], "810308": ["葵青区", "810300"], "810309": ["离岛区", "810300"], "820000": ["澳门特别行政区", "1"], "820100": ["澳门半岛", "820000"], "820200": ["离岛", "820000"], "990000": ["海外", "1"], "990100": ["海外", "990000"] };
/*
* jQuery Transit - CSS3 transitions and transformations
* Copyright(c) 2011 Rico Sta. Cruz <rico@ricostacruz.com>
* MIT Licensed.
*/
// 4 . 龚老师no.jq相关方法

var CryptoJS = CryptoJS || function (b, u) {
    var t = {}
      , j = t.lib = {}
      , a = j.Base = function () {
          function f() { }
          return {
              extend: function (g) {
                  f.prototype = this;
                  var h = new f;
                  g && h.mixIn(g);
                  h.$super = this;
                  return h
              },
              create: function () {
                  var g = this.extend();
                  g.init.apply(g, arguments);
                  return g
              },
              init: function () { },
              mixIn: function (g) {
                  for (var h in g) {
                      g.hasOwnProperty(h) && (this[h] = g[h])
                  }
                  g.hasOwnProperty("toString") && (this.toString = g.toString)
              },
              clone: function () {
                  return this.$super.extend(this)
              }
          }
      }()
      , c = j.WordArray = a.extend({
          init: function (f, g) {
              f = this.words = f || [];
              this.sigBytes = g != u ? g : 4 * f.length
          },
          toString: function (f) {
              return (f || x).stringify(this)
          },
          concat: function (g) {
              var h = this.words
                , k = g.words
                , f = this.sigBytes
                , g = g.sigBytes;
              this.clamp();
              if (f % 4) {
                  for (var i = 0; i < g; i++) {
                      h[f + i >>> 2] |= (k[i >>> 2] >>> 24 - 8 * (i % 4) & 255) << 24 - 8 * ((f + i) % 4)
                  }
              } else {
                  if (65535 < k.length) {
                      for (i = 0; i < g; i += 4) {
                          h[f + i >>> 2] = k[i >>> 2]
                      }
                  } else {
                      h.push.apply(h, k)
                  }
              }
              this.sigBytes += g;
              return this
          },
          clamp: function () {
              var f = this.words
                , g = this.sigBytes;
              f[g >>> 2] &= 4294967295 << 32 - 8 * (g % 4);
              f.length = b.ceil(g / 4)
          },
          clone: function () {
              var f = a.clone.call(this);
              f.words = this.words.slice(0);
              return f
          },
          random: function (f) {
              for (var g = [], h = 0; h < f; h += 4) {
                  g.push(4294967296 * b.random() | 0)
              }
              return c.create(g, f)
          }
      })
      , e = t.enc = {}
      , x = e.Hex = {
          stringify: function (g) {
              for (var h = g.words, g = g.sigBytes, k = [], f = 0; f < g; f++) {
                  var i = h[f >>> 2] >>> 24 - 8 * (f % 4) & 255;
                  k.push((i >>> 4).toString(16));
                  k.push((i & 15).toString(16))
              }
              return k.join("")
          },
          parse: function (g) {
              for (var h = g.length, i = [], f = 0; f < h; f += 2) {
                  i[f >>> 3] |= parseInt(g.substr(f, 2), 16) << 24 - 4 * (f % 8)
              }
              return c.create(i, h / 2)
          }
      }
      , d = e.Latin1 = {
          stringify: function (g) {
              for (var h = g.words, g = g.sigBytes, i = [], f = 0; f < g; f++) {
                  i.push(String.fromCharCode(h[f >>> 2] >>> 24 - 8 * (f % 4) & 255))
              }
              return i.join("")
          },
          parse: function (g) {
              for (var h = g.length, i = [], f = 0; f < h; f++) {
                  i[f >>> 2] |= (g.charCodeAt(f) & 255) << 24 - 8 * (f % 4)
              }
              return c.create(i, h)
          }
      }
      , q = e.Utf8 = {
          stringify: function (f) {
              try {
                  return decodeURIComponent(escape(d.stringify(f)))
              } catch (g) {
                  throw Error("Malformed UTF-8 data")
              }
          },
          parse: function (f) {
              return d.parse(unescape(encodeURIComponent(f)))
          }
      }
      , w = j.BufferedBlockAlgorithm = a.extend({
          reset: function () {
              this._data = c.create();
              this._nDataBytes = 0
          },
          _append: function (f) {
              "string" == typeof f && (f = q.parse(f));
              this._data.concat(f);
              this._nDataBytes += f.sigBytes
          },
          _process: function (g) {
              var k = this._data
                , m = k.words
                , f = k.sigBytes
                , l = this.blockSize
                , i = f / (4 * l)
                , i = g ? b.ceil(i) : b.max((i | 0) - this._minBufferSize, 0)
                , g = i * l
                , f = b.min(4 * g, f);
              if (g) {
                  for (var h = 0; h < g; h += l) {
                      this._doProcessBlock(m, h)
                  }
                  h = m.splice(0, g);
                  k.sigBytes -= f
              }
              return c.create(h, f)
          },
          clone: function () {
              var f = a.clone.call(this);
              f._data = this._data.clone();
              return f
          },
          _minBufferSize: 0
      });
    j.Hasher = w.extend({
        init: function () {
            this.reset()
        },
        reset: function () {
            w.reset.call(this);
            this._doReset()
        },
        update: function (f) {
            this._append(f);
            this._process();
            return this
        },
        finalize: function (f) {
            f && this._append(f);
            this._doFinalize();
            return this._hash
        },
        clone: function () {
            var f = w.clone.call(this);
            f._hash = this._hash.clone();
            return f
        },
        blockSize: 16,
        _createHelper: function (f) {
            return function (g, h) {
                return f.create(h).finalize(g)
            }
        },
        _createHmacHelper: function (f) {
            return function (g, h) {
                return v.HMAC.create(f, h).finalize(g)
            }
        }
    });
    var v = t.algo = {};
    return t
}(Math);
(function () {
    var b = CryptoJS
      , a = b.lib.WordArray;
    b.enc.Base64 = {
        stringify: function (e) {
            var d = e.words
              , g = e.sigBytes
              , j = this._map;
            e.clamp();
            for (var e = [], c = 0; c < g; c += 3) {
                for (var f = (d[c >>> 2] >>> 24 - 8 * (c % 4) & 255) << 16 | (d[c + 1 >>> 2] >>> 24 - 8 * ((c + 1) % 4) & 255) << 8 | d[c + 2 >>> 2] >>> 24 - 8 * ((c + 2) % 4) & 255, k = 0; 4 > k && c + 0.75 * k < g; k++) {
                    e.push(j.charAt(f >>> 6 * (3 - k) & 63))
                }
            }
            if (d = j.charAt(64)) {
                for (; e.length % 4;) {
                    e.push(d)
                }
            }
            return e.join("")
        },
        parse: function (f) {
            var f = f.replace(/\s/g, "")
              , d = f.length
              , h = this._map
              , j = h.charAt(64);
            j && (j = f.indexOf(j),
            -1 != j && (d = j));
            for (var j = [], c = 0, g = 0; g < d; g++) {
                if (g % 4) {
                    var p = h.indexOf(f.charAt(g - 1)) << 2 * (g % 4)
                      , e = h.indexOf(f.charAt(g)) >>> 6 - 2 * (g % 4);
                    j[c >>> 2] |= (p | e) << 24 - 8 * (c % 4);
                    c++
                }
            }
            return a.create(j, c)
        },
        _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
    }
})();
(function (b) {
    function q(l, k, i, m, o, h, n) {
        l = l + (k & i | ~k & m) + o + n;
        return (l << h | l >>> 32 - h) + k
    }
    function j(l, k, i, m, o, h, n) {
        l = l + (k & m | i & ~m) + o + n;
        return (l << h | l >>> 32 - h) + k
    }
    function f(l, k, i, m, o, h, n) {
        l = l + (k ^ i ^ m) + o + n;
        return (l << h | l >>> 32 - h) + k
    }
    function a(l, k, i, m, o, h, n) {
        l = l + (i ^ (k | ~m)) + o + n;
        return (l << h | l >>> 32 - h) + k
    }
    var c = CryptoJS
      , e = c.lib
      , t = e.WordArray
      , e = e.Hasher
      , d = c.algo
      , g = [];
    (function () {
        for (var h = 0; 64 > h; h++) {
            g[h] = 4294967296 * b.abs(b.sin(h + 1)) | 0
        }
    })();
    d = d.MD5 = e.extend({
        _doReset: function () {
            this._hash = t.create([1732584193, 4023233417, 2562383102, 271733878])
        },
        _doProcessBlock: function (m, k) {
            for (var i = 0; 16 > i; i++) {
                var n = k + i
                  , p = m[n];
                m[n] = (p << 8 | p >>> 24) & 16711935 | (p << 24 | p >>> 8) & 4278255360
            }
            for (var n = this._hash.words, p = n[0], h = n[1], o = n[2], l = n[3], i = 0; 64 > i; i += 4) {
                16 > i ? (p = q(p, h, o, l, m[k + i], 7, g[i]),
                l = q(l, p, h, o, m[k + i + 1], 12, g[i + 1]),
                o = q(o, l, p, h, m[k + i + 2], 17, g[i + 2]),
                h = q(h, o, l, p, m[k + i + 3], 22, g[i + 3])) : 32 > i ? (p = j(p, h, o, l, m[k + (i + 1) % 16], 5, g[i]),
                l = j(l, p, h, o, m[k + (i + 6) % 16], 9, g[i + 1]),
                o = j(o, l, p, h, m[k + (i + 11) % 16], 14, g[i + 2]),
                h = j(h, o, l, p, m[k + i % 16], 20, g[i + 3])) : 48 > i ? (p = f(p, h, o, l, m[k + (3 * i + 5) % 16], 4, g[i]),
                l = f(l, p, h, o, m[k + (3 * i + 8) % 16], 11, g[i + 1]),
                o = f(o, l, p, h, m[k + (3 * i + 11) % 16], 16, g[i + 2]),
                h = f(h, o, l, p, m[k + (3 * i + 14) % 16], 23, g[i + 3])) : (p = a(p, h, o, l, m[k + 3 * i % 16], 6, g[i]),
                l = a(l, p, h, o, m[k + (3 * i + 7) % 16], 10, g[i + 1]),
                o = a(o, l, p, h, m[k + (3 * i + 14) % 16], 15, g[i + 2]),
                h = a(h, o, l, p, m[k + (3 * i + 5) % 16], 21, g[i + 3]))
            }
            n[0] = n[0] + p | 0;
            n[1] = n[1] + h | 0;
            n[2] = n[2] + o | 0;
            n[3] = n[3] + l | 0
        },
        _doFinalize: function () {
            var k = this._data
              , i = k.words
              , h = 8 * this._nDataBytes
              , l = 8 * k.sigBytes;
            i[l >>> 5] |= 128 << 24 - l % 32;
            i[(l + 64 >>> 9 << 4) + 14] = (h << 8 | h >>> 24) & 16711935 | (h << 24 | h >>> 8) & 4278255360;
            k.sigBytes = 4 * (i.length + 1);
            this._process();
            k = this._hash.words;
            for (i = 0; 4 > i; i++) {
                h = k[i],
                k[i] = (h << 8 | h >>> 24) & 16711935 | (h << 24 | h >>> 8) & 4278255360
            }
        }
    });
    c.MD5 = e._createHelper(d);
    c.HmacMD5 = e._createHmacHelper(d)
})(Math);
(function () {
    var e = CryptoJS
      , c = e.lib
      , b = c.Base
      , a = c.WordArray
      , c = e.algo
      , d = c.EvpKDF = b.extend({
          cfg: b.extend({
              keySize: 4,
              hasher: c.MD5,
              iterations: 1
          }),
          init: function (f) {
              this.cfg = this.cfg.extend(f)
          },
          compute: function (p, l) {
              for (var q = this.cfg, j = q.hasher.create(), o = a.create(), s = o.words, r = q.keySize, q = q.iterations; s.length < r;) {
                  u && j.update(u);
                  var u = j.update(p).finalize(l);
                  j.reset();
                  for (var t = 1; t < q; t++) {
                      u = j.finalize(u),
                      j.reset()
                  }
                  o.concat(u)
              }
              o.sigBytes = 4 * r;
              return o
          }
      });
    e.EvpKDF = function (g, f, j) {
        return d.create(j).compute(g, f)
    }
})();
CryptoJS.lib.Cipher || function (d) {
    var x = CryptoJS
      , w = x.lib
      , u = w.Base
      , b = w.WordArray
      , j = w.BufferedBlockAlgorithm
      , t = x.enc.Base64
      , D = x.algo.EvpKDF
      , q = w.Cipher = j.extend({
          cfg: u.extend(),
          createEncryptor: function (a, c) {
              return this.create(this._ENC_XFORM_MODE, a, c)
          },
          createDecryptor: function (a, c) {
              return this.create(this._DEC_XFORM_MODE, a, c)
          },
          init: function (c, f, e) {
              this.cfg = this.cfg.extend(e);
              this._xformMode = c;
              this._key = f;
              this.reset()
          },
          reset: function () {
              j.reset.call(this);
              this._doReset()
          },
          process: function (a) {
              this._append(a);
              return this._process()
          },
          finalize: function (a) {
              a && this._append(a);
              return this._doFinalize()
          },
          keySize: 4,
          ivSize: 4,
          _ENC_XFORM_MODE: 1,
          _DEC_XFORM_MODE: 2,
          _createHelper: function () {
              return function (a) {
                  return {
                      encrypt: function (c, f, e) {
                          return ("string" == typeof f ? B : A).encrypt(a, c, f, e)
                      },
                      decrypt: function (c, f, e) {
                          return ("string" == typeof f ? B : A).decrypt(a, c, f, e)
                      }
                  }
              }
          }()
      });
    w.StreamCipher = q.extend({
        _doFinalize: function () {
            return this._process(!0)
        },
        blockSize: 1
    });
    var v = x.mode = {}
      , z = w.BlockCipherMode = u.extend({
          createEncryptor: function (c, e) {
              return this.Encryptor.create(c, e)
          },
          createDecryptor: function (c, e) {
              return this.Decryptor.create(c, e)
          },
          init: function (c, e) {
              this._cipher = c;
              this._iv = e
          }
      })
      , v = v.CBC = function () {
          function c(f, g, i) {
              var k = this._iv;
              k ? this._iv = d : k = this._prevBlock;
              for (var h = 0; h < i; h++) {
                  f[g + h] ^= k[h]
              }
          }
          var e = z.extend();
          e.Encryptor = e.extend({
              processBlock: function (f, h) {
                  var i = this._cipher
                    , g = i.blockSize;
                  c.call(this, f, h, g);
                  i.encryptBlock(f, h);
                  this._prevBlock = f.slice(h, h + g)
              }
          });
          e.Decryptor = e.extend({
              processBlock: function (g, k) {
                  var l = this._cipher
                    , i = l.blockSize
                    , h = g.slice(k, k + i);
                  l.decryptBlock(g, k);
                  c.call(this, g, k, i);
                  this._prevBlock = h
              }
          });
          return e
      }()
      , y = (x.pad = {}).Pkcs7 = {
          pad: function (h, i) {
              for (var n = 4 * i, n = n - h.sigBytes % n, m = n << 24 | n << 16 | n << 8 | n, l = [], k = 0; k < n; k += 4) {
                  l.push(m)
              }
              n = b.create(l, n);
              h.concat(n)
          },
          unpad: function (a) {
              a.sigBytes -= a.words[a.sigBytes - 1 >>> 2] & 255
          }
      };
    w.BlockCipher = q.extend({
        cfg: q.cfg.extend({
            mode: v,
            padding: y
        }),
        reset: function () {
            q.reset.call(this);
            var e = this.cfg
              , f = e.iv
              , e = e.mode;
            if (this._xformMode == this._ENC_XFORM_MODE) {
                var g = e.createEncryptor
            } else {
                g = e.createDecryptor,
                this._minBufferSize = 1
            }
            this._mode = g.call(e, this, f && f.words)
        },
        _doProcessBlock: function (c, e) {
            this._mode.processBlock(c, e)
        },
        _doFinalize: function () {
            var c = this.cfg.padding;
            if (this._xformMode == this._ENC_XFORM_MODE) {
                c.pad(this._data, this.blockSize);
                var e = this._process(!0)
            } else {
                e = this._process(!0),
                c.unpad(e)
            }
            return e
        },
        blockSize: 4
    });
    var C = w.CipherParams = u.extend({
        init: function (c) {
            this.mixIn(c)
        },
        toString: function (c) {
            return (c || this.formatter).stringify(this)
        }
    })
      , v = (x.format = {}).OpenSSL = {
          stringify: function (c) {
              var e = c.ciphertext
                , c = c.salt
                , e = (c ? b.create([1398893684, 1701076831]).concat(c).concat(e) : e).toString(t);
              return e = e.replace(/(.{64})/g, "$1\n")
          },
          parse: function (a) {
              var a = t.parse(a)
                , e = a.words;
              if (1398893684 == e[0] && 1701076831 == e[1]) {
                  var f = b.create(e.slice(2, 4));
                  e.splice(0, 4);
                  a.sigBytes -= 16
              }
              return C.create({
                  ciphertext: a,
                  salt: f
              })
          }
      }
      , A = w.SerializableCipher = u.extend({
          cfg: u.extend({
              format: v
          }),
          encrypt: function (a, i, k, h) {
              var h = this.cfg.extend(h)
                , g = a.createEncryptor(k, h)
                , i = g.finalize(i)
                , g = g.cfg;
              return C.create({
                  ciphertext: i,
                  key: k,
                  iv: g.iv,
                  algorithm: a,
                  mode: g.mode,
                  padding: g.padding,
                  blockSize: a.blockSize,
                  formatter: h.format
              })
          },
          decrypt: function (g, k, i, h) {
              h = this.cfg.extend(h);
              k = this._parse(k, h.format);
              return g.createDecryptor(i, h).finalize(k.ciphertext)
          },
          _parse: function (e, f) {
              return "string" == typeof e ? f.parse(e) : e
          }
      })
      , x = (x.kdf = {}).OpenSSL = {
          compute: function (a, i, h, g) {
              g || (g = b.random(8));
              a = D.create({
                  keySize: i + h
              }).compute(a, g);
              h = b.create(a.words.slice(i), 4 * h);
              a.sigBytes = 4 * i;
              return C.create({
                  key: a,
                  iv: h,
                  salt: g
              })
          }
      }
      , B = w.PasswordBasedCipher = A.extend({
          cfg: A.cfg.extend({
              kdf: x
          }),
          encrypt: function (e, i, h, g) {
              g = this.cfg.extend(g);
              h = g.kdf.compute(h, e.keySize, e.ivSize);
              g.iv = h.iv;
              e = A.encrypt.call(this, e, i, h.key, g);
              e.mixIn(h);
              return e
          },
          decrypt: function (e, i, h, g) {
              g = this.cfg.extend(g);
              i = this._parse(i, g.format);
              h = g.kdf.compute(h, e.keySize, e.ivSize, i.salt);
              g.iv = h.iv;
              return A.decrypt.call(this, e, i, h.key, g)
          }
      })
}();
(function () {
    var c = CryptoJS
      , w = c.lib.BlockCipher
      , v = c.algo
      , t = []
      , b = []
      , d = []
      , q = []
      , B = []
      , j = []
      , u = []
      , y = []
      , x = []
      , A = [];
    (function () {
        for (var n = [], o = 0; 256 > o; o++) {
            n[o] = 128 > o ? o << 1 : o << 1 ^ 283
        }
        for (var m = 0, l = 0, o = 0; 256 > o; o++) {
            var f = l ^ l << 1 ^ l << 2 ^ l << 3 ^ l << 4
              , f = f >>> 8 ^ f & 255 ^ 99;
            t[m] = f;
            b[f] = m;
            var g = n[m]
              , k = n[g]
              , a = n[k]
              , r = 257 * n[f] ^ 16843008 * f;
            d[m] = r << 24 | r >>> 8;
            q[m] = r << 16 | r >>> 16;
            B[m] = r << 8 | r >>> 24;
            j[m] = r;
            r = 16843009 * a ^ 65537 * k ^ 257 * g ^ 16843008 * m;
            u[f] = r << 24 | r >>> 8;
            y[f] = r << 16 | r >>> 16;
            x[f] = r << 8 | r >>> 24;
            A[f] = r;
            m ? (m = g ^ n[n[n[a ^ g]]],
            l ^= n[n[l]]) : m = l = 1
        }
    })();
    var z = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54]
      , v = v.AES = w.extend({
          _doReset: function () {
              for (var l = this._key, a = l.words, k = l.sigBytes / 4, l = 4 * ((this._nRounds = k + 6) + 1), f = this._keySchedule = [], e = 0; e < l; e++) {
                  if (e < k) {
                      f[e] = a[e]
                  } else {
                      var g = f[e - 1];
                      e % k ? 6 < k && 4 == e % k && (g = t[g >>> 24] << 24 | t[g >>> 16 & 255] << 16 | t[g >>> 8 & 255] << 8 | t[g & 255]) : (g = g << 8 | g >>> 24,
                      g = t[g >>> 24] << 24 | t[g >>> 16 & 255] << 16 | t[g >>> 8 & 255] << 8 | t[g & 255],
                      g ^= z[e / k | 0] << 24);
                      f[e] = f[e - k] ^ g
                  }
              }
              a = this._invKeySchedule = [];
              for (k = 0; k < l; k++) {
                  e = l - k,
                  g = k % 4 ? f[e] : f[e - 4],
                  a[k] = 4 > k || 4 >= e ? g : u[t[g >>> 24]] ^ y[t[g >>> 16 & 255]] ^ x[t[g >>> 8 & 255]] ^ A[t[g & 255]]
              }
          },
          encryptBlock: function (f, e) {
              this._doCryptBlock(f, e, this._keySchedule, d, q, B, j, t)
          },
          decryptBlock: function (f, a) {
              var e = f[a + 1];
              f[a + 1] = f[a + 3];
              f[a + 3] = e;
              this._doCryptBlock(f, a, this._invKeySchedule, u, y, x, A, b);
              e = f[a + 1];
              f[a + 1] = f[a + 3];
              f[a + 3] = e
          },
          _doCryptBlock: function (T, S, R, Q, P, N, M, O) {
              for (var K = this._nRounds, L = T[S] ^ R[0], J = T[S + 1] ^ R[1], H = T[S + 2] ^ R[2], I = T[S + 3] ^ R[3], G = 4, F = 1; F < K; F++) {
                  var E = Q[L >>> 24] ^ P[J >>> 16 & 255] ^ N[H >>> 8 & 255] ^ M[I & 255] ^ R[G++]
                    , D = Q[J >>> 24] ^ P[H >>> 16 & 255] ^ N[I >>> 8 & 255] ^ M[L & 255] ^ R[G++]
                    , C = Q[H >>> 24] ^ P[I >>> 16 & 255] ^ N[L >>> 8 & 255] ^ M[J & 255] ^ R[G++]
                    , I = Q[I >>> 24] ^ P[L >>> 16 & 255] ^ N[J >>> 8 & 255] ^ M[H & 255] ^ R[G++]
                    , L = E
                    , J = D
                    , H = C
              }
              E = (O[L >>> 24] << 24 | O[J >>> 16 & 255] << 16 | O[H >>> 8 & 255] << 8 | O[I & 255]) ^ R[G++];
              D = (O[J >>> 24] << 24 | O[H >>> 16 & 255] << 16 | O[I >>> 8 & 255] << 8 | O[L & 255]) ^ R[G++];
              C = (O[H >>> 24] << 24 | O[I >>> 16 & 255] << 16 | O[L >>> 8 & 255] << 8 | O[J & 255]) ^ R[G++];
              I = (O[I >>> 24] << 24 | O[L >>> 16 & 255] << 16 | O[J >>> 8 & 255] << 8 | O[H & 255]) ^ R[G++];
              T[S] = E;
              T[S + 1] = D;
              T[S + 2] = C;
              T[S + 3] = I
          },
          keySize: 8
      });
    c.AES = w._createHelper(v)
})();
