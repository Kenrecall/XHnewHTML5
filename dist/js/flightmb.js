
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


/*!
 * nywx - nuoyadalu wechat version
 * @version v1.0.0
 * @link
 * @license MIT
 */
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _config = __webpack_require__(1);

	var _config2 = _interopRequireDefault(_config);

	var _krouter = __webpack_require__(2);

	var _krouter2 = _interopRequireDefault(_krouter);

	var _kutil = __webpack_require__(6);

	var _api = __webpack_require__(7);

	var _kajax = __webpack_require__(8);

	var ajax = _interopRequireWildcard(_kajax);

	var _join = __webpack_require__(9);

	var _join2 = _interopRequireDefault(_join);

	var _city = __webpack_require__(12);

	var _city2 = _interopRequireDefault(_city);

	var _adate = __webpack_require__(14);

	var _adate2 = _interopRequireDefault(_adate);

	var _detail = __webpack_require__(16);

	var _detail2 = _interopRequireDefault(_detail);

	var _picktime = __webpack_require__(18);

	var _picktime2 = _interopRequireDefault(_picktime);

	var _product = __webpack_require__(20);

	var _product2 = _interopRequireDefault(_product);

	var _allmytickes = __webpack_require__(22);

	var _allmytickes2 = _interopRequireDefault(_allmytickes);

	var _passenger = __webpack_require__(24);

	var _passenger2 = _interopRequireDefault(_passenger);

	var _changepassenger = __webpack_require__(26);

	var _changepassenger2 = _interopRequireDefault(_changepassenger);

	var _mychalinkp = __webpack_require__(28);

	var _mychalinkp2 = _interopRequireDefault(_mychalinkp);

	var _changelinkp = __webpack_require__(30);

	var _changelinkp2 = _interopRequireDefault(_changelinkp);

	var _book = __webpack_require__(32);

	var _book2 = _interopRequireDefault(_book);

	var _Order = __webpack_require__(34);

	var _Order2 = _interopRequireDefault(_Order);

	var _contactpeople = __webpack_require__(36);

	var _contactpeople2 = _interopRequireDefault(_contactpeople);

	var _changeadd = __webpack_require__(38);

	var _changeadd2 = _interopRequireDefault(_changeadd);

	var _Trip = __webpack_require__(40);

	var _Trip2 = _interopRequireDefault(_Trip);

	var _allmybook = __webpack_require__(42);

	var _allmybook2 = _interopRequireDefault(_allmybook);

	var _orderd = __webpack_require__(44);

	var _orderd2 = _interopRequireDefault(_orderd);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	//import {getView, get, post ,myalertp,prototype,core,Converter,BusinessTravelTool,Dept,MGOpt,MemberOpt,OrderSubmitOpt,RsaTool,mycheckuser,SetCookie,getCookieVal,GetCookie} from './util/api';// myalertp 封装的 alert提示弹层

	var router = new _krouter2.default({
	    container: '#dvContainer'
	});

	/// 获取 手机


	/**
	 * Created by way on 16/9/21.
	 */

	document.ready(function () {

	    //global.flightUrl = "http://106.75.131.58:8015"; //  机票的绝对地址
	    //global.flightUrlprice = "http://121.52.212.39:83"; //  查询航班最低价绝对地址 https://cos.uair.cn/mb/img/
	    //global.imgUrl = "https://cos.uair.cn/mb/"; //  腾讯地址图片


	    router.push(new _join2.default()).push(new _city2.default()).push(new _detail2.default()).push(new _picktime2.default()).push(new _product2.default()).push(new _allmytickes2.default()).push(new _passenger2.default()).push(new _changepassenger2.default()).push(new _mychalinkp2.default()).push(new _changelinkp2.default()).push(new _book2.default()).push(new _Order2.default()).push(new _contactpeople2.default()).push(new _changeadd2.default()).push(new _Trip2.default()).push(new _allmybook2.default()).push(new _orderd2.default()).push(new _adate2.default());

	    //获取地址穿参
	    console.log('传输地址');
	    var url = window.location.href;
	    // alert(url);

	    var bsurl = (0, _kutil.getBaseUrl)(window.location.href);
	    console.log(bsurl);
	    var myurlarr = bsurl.split('?');
	    var myurl = myurlarr[0];

	    console.log(myurl);
	    var xhurl = bsurl.slice(-1);

	    var xhurlC = (0, _kutil.urlParam)('entry_code');

	    //alert(xhurlC)//  初始的时候 未带  entry_code  会截取 aspx的最后一位 为x
	    // a  为 我的机票 登陆返回参数
	    // p 为产品页面返回参数
	    // 其他登陆超时的时候 会自动返回初始页面

	    // 剪掉 地址参数
	    //window.location.href =myurl;


	    //alert(window.navigator.userAgent)

	    var datap = localStorage.getItem("allbookdatastr");
	    console.log(datap);
	    var allbookdatastr = '';
	    if (datap) {
	        allbookdatastr = JSON.parse(datap); //取回students变量 把字符串转换成JSON对象
	    }

	    console.log(allbookdatastr);

	    // token 获取

	    var code = (0, _kutil.urlParam)('entry_tk'); // 获取 token
	    console.log('token测试');
	    console.log(code);

	    if (code) {
	        // 有token
	        (0, _api.SetCookie)('myxhtoken', code, 120); //  设置定时器 cookie 120分钟 值为1
	    } else {
	        code = (0, _api.GetCookie)('myxhtoken');
	    }

	    if (code) {
	        //  有token 说明 是容易联过来的
	        //alert('有token')
	        //alert(code)
	        GetUser(code, xhurl, allbookdatastr);
	    } else {
	        // 58测试 系统 需要登录页面
	        //alert('没有token');
	        //alert(xhurl);
	        gowayn(xhurl);
	    }

	    // 获取用户信息
	    function GetUser(token, xhurl, allbookdatastr) {
	        ajax.get('http://wx.nuoyadalu.com/user/api/relandwx?token=' + token, null, function (res) {
	            var data = JSON.parse(res);
	            if (data.rc != 200) return alert('暂时没有获取到用户的身份~！请退出后重试~！');
	            // const wxInfo = data.wxInfo;
	            // const wxMobile = data.wxInfo.mobile;
	            var thephonep = data.relInfoRes.mobile;
	            //alert('默认电话号码'+thephonep);
	            goway(xhurl, allbookdatastr, thephonep);
	        });
	    }

	    function goway(xhurl, allbookdatastr, thephonep) {
	        //alert('路由前号码'+thephonep)
	        // 初始路由

	        if (thephonep && !xhurlC) {
	            $.router.go('/flightmb/join', { linkp: 1, thephonep: thephonep }, true);
	        } else {
	            if (xhurl == 'a') {
	                // 我的机票登陆
	                $.router.go('/flightmb/allmytickes', {}, true);
	            } else if (xhurl == 'x' || xhurl == 's' || xhurl == 'c') {
	                // 直接进入aspx   x新打开jion  s 乘机人返回的
	                $.router.go('/flightmb/join', { linkp: 1 }, true);
	            } else if (xhurl == 'p' && allbookdatastr) {
	                //产品页面 登陆
	                $.router.go('/flightmb/book', allbookdatastr, true);
	                localStorage.setItem("allbookdatastr", ''); //  将 cookie清空
	            } else if (xhurl == 'b' && allbookdatastr) {
	                //  预定 需要登陆

	                $.router.go('/flightmb/detail', allbookdatastr, true);
	                localStorage.setItem("allbookdatastr", ''); //  将 cookie清空

	            } else if (xhurl == 't') {
	                //  差旅传数据
	                console.log('差旅航程数据填充');

	                //console.log(GetQueryString('splace'))//
	                $.router.go('/flightmb/join', { linkp: 5, joindata: GetQueryString(myurlarr[1]) }, true);
	            }
	            //else if(thephonep){ // 刷新卡的 解决  刷新了就要返回 首页的
	            //
	            //}
	        }
	    }
	    // 58测试 系统 需要登录页面
	    //gowayn();
	    function gowayn(xhurl) {

	        // 初始路由
	        if (xhurl == 'a') {
	            // 我的机票登陆
	            $.router.go('/flightmb/allmytickes', {}, true);
	        } else if (xhurl == 'x' || xhurl == 's' || xhurl == 'c') {
	            // 直接进入aspx   x新打开jion  s 乘机人返回的
	            $.router.go('/flightmb/join', { linkp: 1 }, true);
	        } else if (xhurl == 'p' && allbookdatastr) {
	            //产品页面 登陆
	            $.router.go('/flightmb/book', allbookdatastr, true);
	            localStorage.setItem("allbookdatastr", ''); //  将 cookie清空
	        } else if (xhurl == 'b' && allbookdatastr) {
	            //  预定 需要登陆

	            $.router.go('/flightmb/detail', allbookdatastr, true);
	            localStorage.setItem("allbookdatastr", ''); //  将 cookie清空

	        } else if (xhurl == 't') {
	            //  差旅传数据
	            console.log('差旅航程数据填充');

	            //console.log(GetQueryString('splace'))//
	            $.router.go('/flightmb/join', { linkp: 5, joindata: GetQueryString(myurlarr[1]) }, true);
	        } else {
	            // 兼容其他关键字
	            $.router.go('/flightmb/join', { linkp: 1 }, true);
	        }
	    }
	});

	//  默认 登陆函数
	function checklogin() {
	    var userid = '';
	    var loginId = '';
	}

	function creatScript(url) {
	    var script = document.createElement("script");
	    script.setAttribute("type", "text/javascript");
	    script.setAttribute("src", flightUrl + url);
	    var script1 = document.getElementsByTagName('body')[0];
	    script1.appendChild(script);
	}

	function creatScripth(url) {
	    var script = document.createElement("script");
	    script.setAttribute("type", "text/javascript");
	    script.setAttribute("src", flightUrl + url);
	    var script1 = document.getElementsByTagName('head')[0];
	    script1.appendChild(script);
	}

	function GetQueryString(durl) {
	    var myarr = durl.split('&');
	    var json = {
	        sphone: getd(myarr[0]),
	        sname: getd(myarr[1]),
	        timef: getd(myarr[2]),
	        etime: getd(myarr[3]),
	        ctyf: getd(myarr[4]),
	        ctyt: getd(myarr[5]),
	        timet: ''

	    };
	    console.log(json);

	    function getd(data) {
	        return decodeURI(data.split('=')[1]);
	    }

	    return json;
	}

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	/**
	 * Created by way on 16/9/19.
	 */

	exports.default = {
	  app: {
	    token: 'nuoya.token',
	    code: 'nuoya.code',
	    lastCode: 'nuoya.lastCode',
	    docker: 'nuoya.docker',
	    hotCount: 20, // 热门分享一次获取数量
	    imgWHR: 1.9, // 上传图片宽高比
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
	    couponPosterImg: 'http://nuoya-10038118.image.myqcloud.com/test1471935786508'
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
	    flightmbJoin: 'flightmb/join.html'
	  },
	  doc: {
	    host: 'http://nydl-10038118.cos.myqcloud.com/doc/',
	    mutual: 'mutual/'
	  }
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by way on 16/9/13.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * 基于 knife ui的 路由组件
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * 通过 hash实现页面切换导航,分离page到不同文件,实现动态加载,动画切换
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * 由于 pushState 不支持微信侧滑返回, 因此采用了最传统的 hash模式,兼容性最好。
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * 建议与传统 hash 区分开来, 请使用 #! 作为 路由 hash!!!
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _kanimat = __webpack_require__(3);

	var _kanimat2 = _interopRequireDefault(_kanimat);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var CFG = {
	  sectionGroupClass: 'page-group',
	  // 用来辅助切换时表示 page 是 visible 的,
	  // 之所以不用 curPageClass，是因为 page-current 已被赋予了「当前 page」这一含义而不仅仅是 display: block
	  // 并且，别的地方已经使用了，所以不方便做变更，故新增一个
	  visiblePageClass: 'page-visible'
	};

	var DIRECTION = {
	  leftToRight: 'from-left-to-right',
	  rightToLeft: 'from-right-to-left'
	};

	var EVENTS = {
	  pageLoadStart: 'pageLoadStart', // ajax 开始加载新页面前
	  pageLoadCancel: 'pageLoadCancel', // 取消前一个 ajax 加载动作后
	  pageLoadError: 'pageLoadError', // ajax 加载页面失败后
	  pageLoadComplete: 'pageLoadComplete', // ajax 加载页面完成后（不论成功与否）
	  pageAnimationStart: 'pageAnimationStart', // 动画切换 page 前
	  pageAnimationEnd: 'pageAnimationEnd', // 动画切换 page 结束后
	  beforePageRemove: 'beforePageRemove', // 移除旧 document 前（适用于非内联 page 切换）
	  pageRemoved: 'pageRemoved', // 移除旧 document 后（适用于非内联 page 切换）
	  // page 切换前，pageAnimationStart 前，beforePageSwitch后会做一些额外的处理才触发 pageAnimationStart
	  beforePageSwitch: 'beforePageSwitch',
	  pageInit: 'pageInitInternal' // 目前是定义为一个 page 加载完毕后（实际和 pageAnimationEnd 等同）
	};

	/**
	 * 获取 url 的 fragment（即 hash 中去掉 # 的剩余部分）
	 *
	 * 如果没有则返回字符串
	 * 如: http://example.com/path/?query=d#123 => 123
	 *
	 * @param {String} url url
	 * @returns {String}
	 */
	function getHash(url) {
	  if (!url) return '';

	  var pos = url.indexOf('#!');
	  if (pos !== -1) pos++;else pos = url.indexOf('#');

	  return pos !== -1 ? url.substring(pos + 1) : ''; // ??? '/'
	}

	// google 支持 #! 格式
	function setHash(url) {
	  var hash = url;
	  if (url[0] !== '!') hash = '!' + url;
	  location.hash = hash;
	}

	/**
	 * 修改微信 title
	 */
	function setTitle(val) {
	  if (document.title === val) return;

	  if (/MicroMessenger/i.test(navigator.userAgent)) {
	    setTimeout(function () {
	      // 利用iframe的onload事件刷新页面
	      document.title = val;

	      var fr = document.createElement('iframe');
	      // fr.style.visibility = 'hidden';
	      fr.style.display = 'none';
	      fr.src = 'img/favicon.ico';
	      fr.onload = function () {
	        setTimeout(function () {
	          document.body.removeChild(fr);
	        }, 0);
	      };
	      document.body.appendChild(fr);
	    }, 0);
	  } else document.title = val;
	}

	/**
	 * 获取一个 url 的基本部分，即不包括 hash
	 *
	 * @param {String} url url
	 * @returns {String}
	 */
	function getBaseUrl(url) {
	  var pos = url.indexOf('#');
	  return pos === -1 ? url.slice(0) : url.slice(0, pos);
	}

	/**
	 * a very simple router for the **demo** of [weui](https://github.com/weui/weui)
	 */

	var Router = function () {

	  /**
	   * constructor
	   * @param opts
	   */


	  // array of route config
	  function Router(opts) {
	    var _this = this;

	    _classCallCheck(this, Router);

	    this._opts = {
	      container: '#dvContainer',
	      splashTime: 1000,
	      className: 'page',
	      showClass: 'page-current'
	    };
	    this._index = 1;
	    this._$container = null;
	    this._routes = [];
	    this._splash = false;
	    this.start = this.go;

	    this.getCurrentSec = function () {
	      return _kanimat2.default.qu('.' + _this._opts.showClass);
	    };

	    // this._opts = Object.assign({}, this._opts, opts);
	    this._opts.container = opts.container || this._opts.container;
	    this._opts.splashTime = opts.splashTime || this._opts.splashTime;
	    this._opts.className = opts.className || this._opts.className;
	    this._opts.showClass = opts.showClass || this._opts.showClass;

	    this._$container = _kanimat2.default.qu(this._opts.container);
	    this.params = null;
	    // 方便全局访问
	    _kanimat2.default.router = this;

	    // splash 开机画面不需要 动画
	    this._splash = true;
	    this.lastHash = '';
	    this.hash = '';
	    this.nextHash = '';

	    // why not `history.pushState`? see https://github.com/weui/weui/issues/26, Router in wechat webview
	    // pushState 不支持 微信侧滑返回
	    // 不带 hash 到 hash,返回时, 不能触发该事件,因此一开始就要设置 hash,否则无法回到 首页!
	    // 监控url hash变化
	    window.addEventListener('hashchange', function (event) {
	      _this.lastHash = getHash(event.oldURL);
	      _this.hash = getHash(event.newURL);
	      // fix '/' repeat see https://github.com/progrape/router/issues/21
	      if (_this.lastHash === _this.hash) {
	        _this.nextHash = '';
	        return;
	      }

	      // const state = history.state || {};
	      // this.to(hash, state._index <= this._index);
	      _this.routeTo(_this.hash, _this.params, _this.refresh); //  , oldHash);
	      _this.refresh = false;
	      _this.params = null;
	      _this.nextHash = '';
	    }, false);
	  }

	  /**
	   * 导航并传递对象参数, 更改当前路由 为 指定 路由，hash 直接导航只能传字符参数,不能传对象参数
	   * @param url hash
	   * @param params 对象参数 {name: val}，不是字符串！
	   * @param refresh 是否刷新, true 则显示时 重新  bind
	   */


	  // start route config


	  // container element


	  // default option


	  _createClass(Router, [{
	    key: 'go',
	    value: function go(url, params, refresh) {
	      // this._go = false;
	      /*
	       const r = this.getRoute(url);
	       if (r) {
	       r.params = r.params || {};
	       $.assign(r.params, params);
	       // this._go = true;
	       r.refresh = refresh;
	       }
	       */
	      if (!url) url = '!/';

	      // 当前网页重新加载，不会触发 hash 事件！
	      if (getHash(location.href) === url) {
	        // `#${url}`;
	        this.nextHash = getHash(url);
	        this.hash = this.nextHash;
	        this.routeTo(url, params, refresh);
	      } else {
	        // 切换页面
	        this.params = params;
	        this.refresh = refresh;
	        this.nextHash = url;
	        setHash(url);
	      }
	    }
	  }, {
	    key: 'back',
	    value: function back() {
	      history.back();
	    }

	    /**
	     * route to the specify url, 内部访问
	     * @param {String} url
	     * @param {Object} 参数对象
	     * @returns {Router}
	     */

	  }, {
	    key: 'routeTo',
	    value: function routeTo(url, params, refresh) {
	      var _this2 = this;

	      var r = this.getRoute(url, params, refresh);
	      if (r) {
	        (function () {
	          // alert(`routeTo url:${r.url}`);

	          // 返回
	          var rs = _this2.lasts = _this2.lasts || [];
	          var back = false;
	          if (rs.length > 0 && rs[rs.length - 1].id === r.id) {
	            rs.pop();
	            back = true;
	          } else if (_this2.route) {
	            rs.push(_this2.route);
	          }

	          // 记录当前 route
	          _this2.route = r;

	          /*
	           // 卸载
	           const leave = (hasChildren) => {
	           // if have child already, then remove it
	           if (hasChildren) {
	           const child = this._$container.children[0];
	           if (isBack) {
	           child.classList.add(this._opts.leave);
	           }
	             if (this._opts.leaveTimeout > 0) {
	           setTimeout(() => {
	           child.parentNode.removeChild(child);
	           }, this._opts.leaveTimeout);
	           } else
	           child.parentNode.removeChild(child);
	           }
	           };
	           */

	          var enter = function enter(html) {
	            var dv = _kanimat2.default.id(r.id);
	            if (!dv) {
	              dv = document.createElement('div');
	              dv.id = r.id;
	              dv.innerHTML = html;

	              if (_this2._opts.className) _kanimat2.default.addClass(dv, '' + _this2._opts.className);

	              // 插在前面,否则会直接覆盖当前页,动画效果不好!
	              if (_kanimat2.default.hasChild(_this2._$container)) _this2._$container.insertBefore(dv, _this2._$container.children[0]);else _this2._$container.appendChild(dv);
	            }

	            /*
	             // add class name
	             if (r.className || r.showClass) {
	             $.removeClass($.qu(`.${r.showClass}`), r.showClass);
	             $.addClass(dv, `${r.className} ${r.showClass}`);
	             if (r.title)
	             setTitle(r.title);
	             }
	             */

	            /*
	             // add class
	             if (!isBack && this._opts.enter && hasChild) {
	             dv.classList.add(this._opts.enter);
	             }
	               if (this._opts.enterTimeout > 0) {
	             setTimeout(() => {
	             dv.classList.remove(this._opts.enter);
	             }, this._opts.enterTimeout);
	             } else
	             dv.classList.remove(this._opts.enter);
	             */

	            /*
	             if (location.hash !== `#${url}`)
	             location.hash = `#${url}`;
	             */

	            /*
	             try {
	             if (isBack)
	             this._index--;
	             else this._index++;
	               if (history.replaceState)
	             history.replaceState({_index: this._index}, '', location.href);
	             console.log(`history state:${history.state}`);
	             } catch (e) {
	             alert(`replaceState exp:${e.message}`);
	             }
	             */
	            // 动画方式切换页面，如果页面在 bind 中被切换，则不再切换！
	            // 应该判断 hash 是否已经改变，如已改变，则不切换
	            // if (this.route === r)


	            if (!r.loaded) {
	              r.loaded = true;

	              if (r.bind) r.bind(dv, r.params); // .call(dv);

	              // 对所有 link 绑定 ontouch，消除 300ms等待
	              _kanimat2.default.fastLink();
	            } else if ((r.search !== r.lastSearch || r.refresh) && r.bind) {
	              // 参数变化, 重新 bind!
	              r.bind(dv, r.params); // .call(dv);
	              // $.fastLink();
	            }

	            //alert(`hash:${this.hash} => ${this.nextHash}`);
	            if (!_this2.nextHash || _this2.nextHash === _this2.hash) {
	              _this2.switchToSec(r, back);
	            }
	          };

	          // const hasChild = $.hasChild(this._$container);
	          // pop current page
	          // leave(hasChild);

	          // callback
	          var onload = function onload(err) {
	            var html = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

	            if (err) throw err;
	            // push next page
	            enter(html);
	          };

	          // const res = r.render(callback);
	          if (!r.loaded && r.view) r.view(onload);else if (!r.view) throw new Error('route ' + r.id + ' hasn\'t view function!');else enter();

	          /*
	           // promise
	           if (res && typeof res.then === 'function') {
	           res.then((html) => {
	           callback(null, html);
	           }, callback);
	           } else if (r.render.length === 0)  // synchronous
	           callback(null, res);
	           // callback
	           else {
	             }
	           */
	        })();
	      } else {}
	        // 处理 / pgIndex
	        // alert('not found!');

	        /*
	         else
	         throw new Error(`path ${url} was not found`);
	         */

	      return this;
	    }

	    /**
	     * get route from routes filter by url
	     * @param {String} url
	     * @param {Object} params
	     * @returns {Object}
	     */

	  }, {
	    key: 'getRoute',
	    value: function getRoute(url, params, refresh) {
	      var _this3 = this;

	      var _loop = function _loop(i, len) {
	        var r = _this3._routes[i];
	        // let keys = [];
	        // /prod/:no => /prod/999
	        // let ms = /\/:([^\/]+?)/?$/i.exec(r.path);
	        var search = '';
	        var path = url;

	        var pos = url.indexOf('?');
	        if (pos >= 0) {
	          search = url.substr(pos + 1);
	          path = url.substr(0, pos);
	        }

	        var rx = new RegExp(r.path); // pathToRegexp(r.url, keys);
	        var ms = rx.exec(path);
	        if (ms) {
	          // go 已经处理过参数, 不再重复处理
	          // if (!this._go) {
	          r.params = {};
	          if (search) {
	            var ps = search.split('&');
	            ps.forEach(function (p) {
	              pos = p.indexOf('=');
	              if (pos > 0) r.params[p.substr(0, pos)] = p.substr(pos + 1);
	            });
	          }

	          if (params) _kanimat2.default.assign(r.params, params);
	          // } else this._go = false;

	          /*
	           r.params = {};
	           for (let j = 0, l = keys.length; j < l; j++) {
	           const key = keys[j];
	           const name = key.name;
	           r.params[name] = ms[j + 1];
	           }
	           */
	          // 记录当前 url
	          r.url = url;
	          r.lastSearch = r.search;
	          r.search = search;
	          r.refresh = refresh;
	          return {
	            v: r
	          };
	        }
	      };

	      for (var i = 0, len = this._routes.length; i < len; i++) {
	        var _ret2 = _loop(i, len);

	        if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
	      }
	      return null;
	    }

	    /**
	     * push route config into routes array
	     * @param {Object} route
	     * @returns {Router}
	     */

	  }, {
	    key: 'push',
	    value: function push(route) {
	      try {
	        if (!route) throw new Error('route is empty!');

	        var exist = this._routes.filter(function (r) {
	          return r.path === route.path;
	        })[0];
	        if (exist) throw new Error('route ' + route.path + ' is existed!');

	        if (!route.hash) throw new Error('route\'s hash is empty!');

	        if (!route.view) throw new Error('route\'s view is empty!');

	        route.id = 'pg' + route.hash.replace(/\//g, '-');
	        route.path = route.path || '*';
	        route.bind = route.bind || _kanimat2.default.noop;
	        route.router = this;
	        /*
	         const r = Object.assign({}, {
	         path: '*',
	         // view: $.noop,
	         bind: $.noop
	         }, route);
	         */
	        this._routes.push(route);

	        return this;
	      } catch (e) {
	        //alert(`router.push exp: ${e.message}`);
	      }
	    }

	    /**
	     * 从一个文档切换为显示另一个文档
	     *
	     * @param $from 目前显示的文档
	     * @param $to 待切换显示的新文档
	     * @param $visibleSection 新文档中展示的 section 元素
	     * @param direction 新文档切入方向
	     * @private
	     */
	    /*
	     animateDoc($from, $to, $visibleSection, direction) {
	     var sectionId = $visibleSection.attr('id');
	       var $visibleSectionInFrom = $from.find('.' + this._opts.showClass);
	     $visibleSectionInFrom.addClass(CFG.visiblePageClass).removeClass(this._opts.showClass);
	       $visibleSection.trigger(EVENTS.pageAnimationStart, [sectionId, $visibleSection]);
	       this._animateElement($from, $to, direction);
	       $from.animationEnd(function () {
	     $visibleSectionInFrom.removeClass(CFG.visiblePageClass);
	     // 移除 document 前后，发送 beforePageRemove 和 pageRemoved 事件
	     $(window).trigger(EVENTS.beforePageRemove, [$from]);
	     $from.remove();
	     $(window).trigger(EVENTS.pageRemoved);
	     });
	       $to.animationEnd(function () {
	     $visibleSection.trigger(EVENTS.pageAnimationEnd, [sectionId, $visibleSection]);
	     // 外层（init.js）中会绑定 pageInitInternal 事件，然后对页面进行初始化
	     $visibleSection.trigger(EVENTS.pageInit, [sectionId, $visibleSection]);
	     });
	     };
	     */

	    /**
	     * 把当前文档的展示 section 从一个 section 切换到另一个 section
	     *
	     * @param from
	     * @param to
	     * @param dir
	     * @private
	     */

	  }, {
	    key: 'animateSec',
	    value: function animateSec(from, to, dir) {
	      if (!from && !to) return;

	      if (from) {
	        (0, _kanimat2.default)(from).trigger(EVENTS.beforePageSwitch, [from.id, from]);
	        _kanimat2.default.removeClass(from, this._opts.showClass);
	      }

	      var $to = null;
	      if (to) {
	        $to = (0, _kanimat2.default)(to);
	        _kanimat2.default.addClass(to, this._opts.showClass);
	        $to.trigger(EVENTS.pageAnimationStart, [to.id, to]);
	      }

	      if (from && to && !this._splash) {
	        this.animateEle(from, to, dir);
	        $to.animationEnd(function () {
	          $to.trigger(EVENTS.pageAnimationEnd, [to.id, to]);
	          // 外层（init.js）中会绑定 pageInitInternal 事件，然后对页面进行初始化
	          $to.trigger(EVENTS.pageInit, [to.id, to]);
	        });
	      }

	      if (this._splash) this._splash = false;
	    }

	    /**
	     * 切换显示两个元素
	     *
	     * 切换是通过更新 class 来实现的，而具体的切换动画则是 class 关联的 css 来实现
	     *
	     * @param $from 当前显示的元素
	     * @param $to 待显示的元素
	     * @param dir 切换的方向
	     * @private
	     */

	  }, {
	    key: 'animateEle',
	    value: function animateEle(from, to, direction) {
	      // todo: 可考虑如果入参不指定，那么尝试读取 $to 的属性，再没有再使用默认的
	      // 考虑读取点击的链接上指定的方向
	      var dir = direction;
	      if (typeof dir === 'undefined') {
	        dir = DIRECTION.rightToLeft;
	      }

	      var animPageClasses = ['page-from-center-to-left', 'page-from-center-to-right', 'page-from-right-to-center', 'page-from-left-to-center'].join(' ');

	      var classForFrom = '';
	      var classForTo = '';
	      switch (dir) {
	        case DIRECTION.rightToLeft:
	          classForFrom = 'page-from-center-to-left';
	          classForTo = 'page-from-right-to-center';
	          break;
	        case DIRECTION.leftToRight:
	          classForFrom = 'page-from-center-to-right';
	          classForTo = 'page-from-left-to-center';
	          break;
	        default:
	          classForFrom = 'page-from-center-to-left';
	          classForTo = 'page-from-right-to-center';
	          break;
	      }

	      if (from) {
	        _kanimat2.default.removeClass(from, animPageClasses);
	        _kanimat2.default.addClass(from, classForFrom);
	      }

	      if (to) {
	        _kanimat2.default.removeClass(to, animPageClasses);
	        _kanimat2.default.addClass(to, classForTo);
	      }

	      from && (0, _kanimat2.default)(from).animationEnd(function () {
	        return _kanimat2.default.removeClass(from, animPageClasses);
	      }); // eslint-disable-line
	      to && (0, _kanimat2.default)(to).animationEnd(function () {
	        return _kanimat2.default.removeClass(to, animPageClasses);
	      }); // eslint-disable-line
	    }

	    /**
	     * 获取当前显示的第一个 section
	     *
	     * @returns {*}
	     * @private
	     */

	  }, {
	    key: 'switchToSec',


	    /**
	     * 切换显示当前文档另一个块
	     *
	     * 把新块从右边切入展示，同时会把新的块的记录用 history.pushState 来保存起来
	     *
	     * 如果已经是当前显示的块，那么不做任何处理；
	     * 如果没对应的块，那么忽略。
	     *
	     * @param {String} sectionId 待切换显示的块的 id
	     * @private
	     */
	    value: function switchToSec(r, back) {
	      var _this4 = this;

	      if (!r) return;

	      var curPage = this.getCurrentSec();
	      var newPage = _kanimat2.default.id(r.id);

	      // 如果已经是当前页，不做任何处理
	      if (curPage === newPage) return;
	      /*
	       if (r.className || r.showClass) {
	       $.removeClass($.qu(`.${r.showClass}`), r.showClass);
	       $.addClass(dv, `${r.className} ${r.showClass}`);
	       if (r.title)
	       setTitle(r.title);
	       }
	       */
	      if (this._splash) {
	        setTimeout(function () {
	          return _this4.animateSec(curPage, newPage, back ? DIRECTION.leftToRight : DIRECTION.rightToLeft);
	        }, this._opts.splashTime);
	      } else this.animateSec(curPage, newPage, back ? DIRECTION.leftToRight : DIRECTION.rightToLeft);

	      setTitle(this.route.title);
	      // this.pushNewState('#' + sectionId, sectionId);
	    }

	    /*
	     sameDoc(url, anotherUrl) {
	     return getBase(url) === getBase(anotherUrl);
	     }
	     */

	  }]);

	  return Router;
	}();

	exports.default = Router;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _kevent = __webpack_require__(4);

	var _kevent2 = _interopRequireDefault(_kevent);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/* jshint ignore:start */
	_kevent2.default.requestAnimationFrame = function (callback) {
	  if (window.requestAnimationFrame) return window.requestAnimationFrame(callback);else if (window.webkitRequestAnimationFrame) return window.webkitRequestAnimationFrame(callback);else if (window.mozRequestAnimationFrame) return window.mozRequestAnimationFrame(callback);else {
	    return window.setTimeout(callback, 1000 / 60);
	  }
	}; /**
	    * Created by way on 16/9/13.
	    */

	_kevent2.default.cancelAnimationFrame = function (id) {
	  if (window.cancelAnimationFrame) return window.cancelAnimationFrame(id);else if (window.webkitCancelAnimationFrame) return window.webkitCancelAnimationFrame(id);else if (window.mozCancelAnimationFrame) return window.mozCancelAnimationFrame(id);else {
	    return window.clearTimeout(id);
	  }
	};
	/* jshint ignore:end */

	// 动画处理
	_kevent2.default.cssEvent = function (events, callback) {
	  var dom = this; // jshint ignore:line

	  function fireCallBack(e) {
	    /*jshint validthis:true */
	    if (e.target !== this) return;
	    callback.call(this, e);
	    for (var i = 0; i < events.length; i++) {
	      dom.off(events[i], fireCallBack);
	    }
	  }

	  if (callback) {
	    for (var i = 0; i < events.length; i++) {
	      dom.on(events[i], fireCallBack);
	    }
	  }
	};

	// 动画事件
	//------------------------

	_kevent2.default.fn.animationEnd = function (callback) {
	  _kevent2.default.cssEvent.call(this, ['webkitAnimationEnd', 'animationend'], callback);
	  return this;
	};

	_kevent2.default.fn.transitionEnd = function (callback) {
	  _kevent2.default.cssEvent.call(this, ['webkitTransitionEnd', 'transitionend'], callback);
	  return this;
	};

	_kevent2.default.fn.transition = function (duration) {
	  var dur = duration;
	  if (typeof duration !== 'string') {
	    dur = duration + 'ms';
	  }
	  for (var i = 0; i < this.length; i++) {
	    var elStyle = this[i].style;
	    elStyle.webkitTransitionDuration = elStyle.MozTransitionDuration = elStyle.transitionDuration = dur;
	  }
	  return this;
	};

	_kevent2.default.fn.transform = function (transform) {
	  for (var i = 0; i < this.length; i++) {
	    var elStyle = this[i].style;
	    elStyle.webkitTransform = elStyle.MozTransform = elStyle.transform = transform;
	  }
	  return this;
	};

	exports.default = _kevent2.default;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**
	 * Created by way on 16/8/28.
	 * event trigger、define
	 * 使用伪dom方式实现 原生及自定义事件 响应与触发
	 * 每个事件只支持 一个响应, 添加响应自动卸载原来的事件
	 * 支持 匿名响应函数, 多次加载只有最后一个起作用
	 */

	var $ = __webpack_require__(5);

	// 一个包中所有引用共享该变量!
	var events = {};

	// 创建用户事件类
	if (!window.CustomEvent) {
	  window.CustomEvent = function (type, opts) {
	    var opt = opts || { bubbles: false, cancelable: false, detail: undefined };
	    var ev = document.createEvent('CustomEvent');
	    ev.initCustomEvent(type, opt.bubbles, opt.cancelable, opt.detail);
	    return ev;
	  };

	  window.CustomEvent.prototype = window.Event.prototype;
	}

	// 加在原型对象上, 所有对象实例均可调用

	$.on = function (event, fn) {
	  events[event] = events[name] || [];
	  events[event].push(fn);
	  return this;
	};

	/**
	 * 添加事件, 标准dom事件或自定义事件
	 * 只能加载一个处理函数, 覆盖式加载, 自动卸载之前的加载
	 * @param event 事件名称
	 * @param fn
	 * @param capture
	 * @returns {$}
	 */
	$.fn.on = function (event, fn) {
	  var capture = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

	  var evs = this.events = this.events || {};
	  var ev = evs[event] = evs[event] || {};
	  if (ev.fn) this[0].removeEventListener(event, ev.fn, capture || false);
	  ev.fn = fn;
	  ev.capture = capture;
	  this[0].addEventListener(event, ev.fn, capture);
	  return this;
	};

	// 触发一次
	$.fn.once = function (event, fn) {
	  var capture = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

	  var evs = this.events = this.events || {};
	  var ev = evs[event] = evs[event] || {};
	  ev.once = true;
	  /*
	   evs[ev].fn = () => {
	   // 卸载自己
	   this[0].removeEventListener(ev, arguments.callee, capture || false);
	   fn.apply(this, fn.arguments);
	   }
	     evs[ev].capture = capture;
	   this[0].addEventListener(ev, evs[ev].fn, capture);
	   */
	  return this.on(ev, fn, capture);
	};

	// 触发一次
	$.once = function (event, fn) {
	  fn._once = true;
	  $.on(event, fn);
	  return this;
	};

	/*
	$.once = function (el, ev, callback) {
	  el.addEventListener(ev, function () {
	    el.removeEventListener(ev, arguments.callee, false)
	    callback()
	  }, false)
	}
	*/

	/**
	 * 删除事件
	 * @param event
	 * @param handler 缺少删除该事件, 指定处理函数,则只删除指定处理函数
	 * @returns {off}
	 */
	$.fn.off = function (event) {
	  if (this.events && this.events[event]) {
	    this[0].removeEventListener(event, this.events[event].fn, this.events[event].capture || false);
	    delete this.events[event];
	  }
	  return this;
	};

	$.off = function (event) {
	  var fn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

	  if (fn) events[event].splice(events[event].indexOf(fn), 1);else delete events[event];

	  return this;
	};

	/**
	 * 通过 dom 触发 事件
	 * @param event
	 * @returns {$}
	 */
	$.fn.trigger = function (event) {
	  var ev = new CustomEvent(event, {
	    bubbles: true,
	    cancelable: true
	  });

	  // remove handlers added with 'once'
	  var evs = this.events = this.events || {};
	  if (evs[event] && evs[event].once) this.off(event);

	  this[0].dispatchEvent(ev);
	  return this;
	};

	/**
	 * 直接带参数触发自定义
	 * @param event
	 * @param args
	 * @returns {emit}
	 */
	$.fn.emit = function (event) {
	  var evs = this.events = this.events || {};
	  var ev = evs[event] = evs[event] || {};
	  // only fire handlers if they exist
	  if (ev.once) this.off(event);
	  // set 'this' context, pass args to handlers

	  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	    args[_key - 1] = arguments[_key];
	  }

	  ev.fn.apply(this, args);

	  return this;
	};

	$.emit = function (event) {
	  var _this = this;

	  for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
	    args[_key2 - 1] = arguments[_key2];
	  }

	  // cache the events, to avoid consequences of mutation
	  var cache = events[event] && events[event].slice();

	  // only fire handlers if they exist
	  if (cache) {
	    cache.forEach(function (fn) {
	      // remove handlers added with 'once'
	      if (fn._once) $.off(event, fn);
	      // set 'this' context, pass args to handlers
	      fn.apply(_this, args);
	    });
	  }

	  return this;
	};

	// export {on, off, once, emit, emit as trigger};
	exports.default = $;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	/**
	 * Created by way on 16/8/28.
	 * 静态 dom 常用操作, 通过 $ 静态属性、方法访问
	 */

	(function (global, factory) {
	  if (true) !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	    return factory(global);
	  }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else factory(global);
	})(typeof window !== "undefined" ? window : undefined, function (window) {
	  var Knife = function () {
	    // 函数内私有变量及函数
	    var $,
	        emptyArray = [],
	        classCache = {},
	        idCache = {},
	        readyRE = /complete|loaded|interactive/,
	        class2type = {},
	        toString = class2type.toString,
	        fragmentRE = /^\s*<(\w+|!)[^>]*>/,
	        knife = {},
	        propMap = {
	      'tabindex': 'tabIndex',
	      'readonly': 'readOnly',
	      'for': 'htmlFor',
	      'class': 'className',
	      'maxlength': 'maxLength',
	      'cellspacing': 'cellSpacing',
	      'cellpadding': 'cellPadding',
	      'rowspan': 'rowSpan',
	      'colspan': 'colSpan',
	      'usemap': 'useMap',
	      'frameborder': 'frameBorder',
	      'contenteditable': 'contentEditable'
	    };

	    function classRE(name) {
	      return name in classCache ? classCache[name] : classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)');
	    }

	    // 私有方法
	    function funcArg(ctx, arg, idx, payload) {
	      return $.isFunction(arg) ? arg.call(ctx, idx, payload) : arg;
	    }

	    function setAttribute(node, name, value) {
	      value == null ? node.removeAttribute(name) : node.setAttribute(name, value);
	    }

	    document.ready = function (callback) {
	      // need to check if document.body exists for IE as that browser reports
	      // document ready when it hasn't yet created the body element
	      if (readyRE.test(document.readyState) && document.body) callback();else document.addEventListener('DOMContentLoaded', function () {
	        document.removeEventListener('DOMContentLoaded', arguments.callee, false);
	        callback();
	      }, false);
	    };

	    // 构造函数
	    function K(dom, sel) {
	      this.selector = sel || '';
	      this[0] = this.dom = dom;
	      this.length = 1;
	      if (!dom) this.length = 0;
	    }

	    // `$.knife.K` swaps out the prototype of the given `dom` array
	    // of nodes with `$.fn` and thus supplying all the Knife functions
	    // to the array. This method can be overridden in plugins.
	    knife.K = function (dom, sel) {
	      return new K(dom, sel);
	    };

	    // `$.knife.isK` should return `true` if the given object is a Knife
	    // collection. This method can be overridden in plugins.
	    knife.isK = function (obj) {
	      return obj instanceof knife.K;
	    };

	    knife.id = function (x) {
	      return x in idCache ? idCache[x] : idCache[x] = knife.K(document.getElementById(x), x);
	    };

	    // knife 实现
	    knife.fragment = function (html, name, properties) {};
	    // `$.knife.init` is Knife's counterpart to jQuery's `$.fn.init` and
	    // takes a CSS selector and an optional context (and handles various
	    // special cases).
	    // This method can be overridden in plugins.
	    knife.init = function (sel, root) {
	      var dom = void 0;
	      // If nothing given, return an empty Zepto collection
	      if (!sel) return knife.K();
	      // Optimize for string selectors
	      if (typeof sel === 'string') {
	        if (sel[0] === '#') return knife.id(sel.substr(1));

	        if (sel[0] == '<' && fragmentRE.test(sel)) dom = knife.fragment(sel, RegExp.$1, root), sel = null;else dom = $.qu(sel, root);
	      } else if (knife.isK(sel)) return sel;
	      // Wrap DOM nodes.
	      else if ($.isObject(sel)) dom = sel, sel = null;

	      // create a new Knife collection from the nodes found
	      return knife.K(dom, sel);
	    };

	    // `$` will be the base `Knife` object. When calling this
	    // function just call `$.knife.init, which makes the implementation
	    // details of selecting nodes and creating Knife collections
	    // patchable in plugins.
	    // 实例化函数调用, $() 返回一个新的实例!
	    $ = function $(selector, context) {
	      return knife.init(selector, context);
	    };

	    $.K = K;
	    $.knife = knife;

	    // plugin compatibility
	    $.uuid = 0;
	    $.expr = {};
	    $.noop = function () {};
	    $.concat = emptyArray.concat;
	    $.filter = emptyArray.filter;
	    $.slice = emptyArray.slice;
	    // 静态属性,可直接调用
	    $.type = function (obj) {
	      return obj == null ? String(obj) : class2type[toString.call(obj)] || 'object';
	    };
	    $.isFunction = function (value) {
	      return $.type(value) == 'function';
	    };
	    $.isWindow = function (obj) {
	      return obj != null && obj == obj.window;
	    };
	    $.isDocument = function (obj) {
	      return obj != null && obj.nodeType == obj.DOCUMENT_NODE;
	    };
	    $.isObject = function (obj) {
	      return $.type(obj) == 'object';
	    };
	    $.isPlainObject = function (obj) {
	      return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype;
	    };
	    $.isArray = Array.isArray || function (object) {
	      return object instanceof Array;
	    };
	    $.isNumeric = function (val) {
	      var num = Number(val),
	          type = typeof val === 'undefined' ? 'undefined' : _typeof(val);
	      return val != null && type != 'boolean' && (type != 'string' || val.length) && !isNaN(num) && isFinite(num) || false;
	    };
	    $.trim = function (str) {
	      return str == null ? '' : String.prototype.trim.call(str);
	    };

	    /**
	     * Copy all but undefined properties from one or more to dst
	     * Object.assign 在安卓微信上无不支持
	     * @param dst
	     * @param srcs 支持单个对象 或 多个对象
	     * @param deep 深拷贝
	     */
	    $.assign = function (dst) {
	      if (!dst) return;
	      var srcs = $.slice.call(arguments, 1);
	      srcs && srcs.forEach(function (src) {
	        for (var key in src) {
	          if (src.hasOwnProperty(key) && src[key] !== undefined) dst[key] = src[key];
	        }
	      });
	    };

	    /*
	        $.extend = function (dst, src, deep) {
	          var frms = $.isArray(src) ? src : [src]
	          frms.forEach(frm => {
	            for (const key in frm) {
	              // if (!frm.hasOwnProperty(key)) {
	              if (deep && ($.isPlainObject(frm[key]) || $.isArray(frm[key]))) {
	                if ($.isPlainObject(frm[key]) && !$.isPlainObject(dst[key]))
	                  dst[key] = {}
	                if ($.isArray(frm[key]) && !$.isArray(dst[key]))
	                  dst[key] = []
	                $.assign(dst[key], frm[key], deep)
	              }
	              else if (frm[key] !== undefined) dst[key] = frm[key]
	              // }
	            }
	          })
	        }
	    */

	    /**
	     * 判断浏览器是否支持 sessionStorage，支持返回 true，否则返回 false
	     * @returns {Boolean}
	     */
	    function hasStorage() {
	      var mod = 'krouter.storage.ability';
	      try {
	        sessionStorage.setItem(mod, mod);
	        sessionStorage.removeItem(mod);
	        return true;
	      } catch (e) {
	        return false;
	      }
	    }

	    $.support = function () {
	      var support = {
	        touch: !!('ontouchstart' in window || window.DocumentTouch && document instanceof window.DocumentTouch),
	        storage: hasStorage()
	      };
	      return support;
	    }();

	    $.touchEvents = {
	      start: $.support.touch ? 'touchstart' : 'mousedown',
	      move: $.support.touch ? 'touchmove' : 'mousemove',
	      end: $.support.touch ? 'touchend' : 'mouseup'
	    };

	    $.likeArray = function (obj) {
	      var length = !!obj && 'length' in obj && obj.length,
	          type = $.type(obj);

	      return 'function' != type && !$.isWindow(obj) && ('array' == type || length === 0 || typeof length == 'number' && length > 0 && length - 1 in obj);
	    };
	    $.each = function (els, callback) {
	      var i, key;
	      if ($.likeArray(els)) {
	        for (i = 0; i < els.length; i++) {
	          if (callback.call(els[i], i, els[i]) === false) return els;
	        }
	      } else {
	        for (key in els) {
	          if (callback.call(els[key], key, els[key]) === false) return els;
	        }
	      }
	      return els;
	    };
	    // Populate the class2type map
	    $.each('Boolean Number String Function Array Date RegExp Object Error'.split(' '), function (i, name) {
	      class2type['[object ' + name + ']'] = name.toLowerCase();
	    });

	    $.id = function (x) {
	      return document.getElementById(x);
	      return x in idCache ? idCache[x] : idCache[x] = knife.K(document.getElementById(x), x);
	    };
	    $.qu = function (sel, root) {
	      if (root) return knife.isK(root) ? root[0].querySelector(sel) : root.querySelector(sel);
	      return document.querySelector(sel);
	    };
	    // 返回数组, 便于 forEach
	    $.qus = function (sel, root) {
	      var es = null;
	      if (root) es = knife.isK(root) ? root[0].querySelectorAll(sel) : root.querySelectorAll(sel);else es = document.querySelectorAll(sel);
	      if (es.length > 0) return Array.prototype.slice.call(es);else return [];
	    };
	    $.nms = function (name) {
	      return document.getElementsByName(name);
	    };
	    //找到obj下相应tag
	    $.tags = function (el, tag) {
	      el = el || document;
	      return el.getElementsByTagName(tag.toUpperCase());
	    };
	    $.dc = function (obj, tag, cls) {
	      var el = document.createElement(tag);
	      if (cls) el.className = cls;
	      if (obj) obj.appendChild(el);
	      return el;
	    };
	    $.html = function (el, html) {
	      if (html !== undefined) {
	        // var originHtml = el.innerHTML
	        // el.innerHTML = ''
	        // $(el).append(funcArg(el, html, 0, originHtml))
	        el.innerHTML = html;
	      } else return el ? el.innerHTML : null;
	    };
	    // 显示 属性
	    $.attr = function (el, name, value) {
	      var result;
	      if (!el) return '';
	      if (typeof name == 'string' && value === undefined) return el && el.nodeType == 1 && (result = el.getAttribute(name)) != null ? result : ''; // undefined)

	      if (el.nodeType !== 1) return false;
	      if (isObject(name)) for (key in name) {
	        setAttribute(el, key, name[key]);
	      } else setAttribute(el, name, funcArg(el, value, 0, el.getAttribute(name)));
	      return true;
	    };
	    // 显示 属性 及属性名称
	    $.attrn = function (el, name) {
	      if (!el) return '';

	      var rc = el.getAttribute(name);
	      if (rc == null) rc = '';
	      if (rc) rc = name + '=' + rc + ';';
	      return rc;
	    };
	    $.removeAttr = function (el, name) {
	      el.nodeType === 1 && name.split(' ').forEach(function (attribute) {
	        setAttribute(el, attribute);
	      });
	    };
	    $.removeNode = function (el) {
	      el.parentNode.removeChild(el);
	    };
	    $.prop = function (el, name, value) {
	      name = propMap[name] || name;
	      return value !== undefined ? (el[name] = funcArg(el, value, 0, el[name]), true) : el && el[name];
	    };
	    $.removeProp = function (el, name) {
	      name = propMap[name] || name;
	      delete el[name];
	    };
	    // access className property while respecting SVGAnimatedString
	    $.className = function (node, value) {
	      var cls = (node.className || '').trim(),
	          svg = cls && cls.baseVal !== undefined;

	      if (value === undefined) return svg ? cls.baseVal : cls;
	      svg ? cls.baseVal = value : node.className = value;
	    };
	    // 筛选class
	    $.hasClass = function (el, name) {
	      if (!el || !name) return false;
	      return classRE(name).test($.className(el));
	    };
	    $.addClass = function (el, name) {
	      if (!el || !name) return false;
	      var cs = [];
	      var cl = $.className(el),
	          newName = funcArg(el, name, 0, cl);
	      newName.split(/\s+/g).forEach(function (klass) {
	        if (!$.hasClass(el, klass)) cs.push(klass);
	      });
	      cs.length && $.className(el, cl + (cl ? ' ' : '') + cs.join(' '));
	      return true;
	    };
	    $.removeClass = function (el, name) {
	      if (name === undefined) return $.className(el, '');
	      var classList = $.className(el);
	      funcArg(el, name, 0, classList).split(/\s+/g).forEach(function (cls) {
	        classList = classList.replace(classRE(cls), ' ');
	      });
	      $.className(el, classList.trim());
	    };
	    $.toggleClass = function (el, name, when) {
	      if (!el || !name) return false;
	      var names = funcArg(el, name, 0, $.className(el));
	      names.split(/\s+/g).forEach(function (klass) {
	        (when === undefined ? !$.hasClass(el, klass) : when) ? $.addClass(el, klass) : $.removeClass(el, klass);
	      });
	    };
	    $.toggle = function (el) {
	      if (el.style.display === 'none') el.style.display = '';else el.style.display = 'none';
	    };
	    // 第一个子元素节点或非空文本节点 Object.prototype. ie 不支持
	    $.firstChild = function (el) {
	      var RC = null;
	      if (!el) return null;

	      try {
	        for (var i = 0; i < el.childNodes.length; i++) {
	          var nd = el.childNodes[i];

	          // alert(nd.nodeType + "/" + nd.nodeName + "/"
	          //	+ (nd.nodeValue ? escape(nd.nodeValue) : "null") );

	          if (nd.nodeType === 1 // 元素节点
	          // 有效文本节点，nodeName == "#text"
	          || nd.nodeType === 3 && nd.nodeValue && nd.nodeValue.trim()) {
	            RC = nd;
	            break;
	          }
	        }
	      } catch (e) {
	        alert('firstChild exp:' + e.message);
	      }
	      return RC;
	    };
	    // 下一个子元素节点或非空文本节点
	    $.nextNode = function (el) {
	      var RC = null;
	      if (!el) return null;

	      var nd = el.nextSibling;
	      while (nd) {
	        if (nd.nodeType === 1 // 元素节点
	        // 有效文本节点，nodeName == "#text"
	        || nd.nodeType === 3 && nd.nodeValue && nd.nodeValue.trim()) {
	          RC = nd;
	          break;
	        }
	        nd = nd.nextSibling;
	      }
	      return RC;
	    };
	    // 最后一个子元素节点或非空文本节点 Object.prototype. ie 不支持
	    $.lastChild = function (el) {
	      var RC = null;
	      if (!el) return null;

	      for (var i = el.childNodes.length - 1; i >= 0; i--) {
	        var nd = el.childNodes[i];

	        // alert(nd.nodeType + "/" + nd.nodeName + "/"
	        //	+ (nd.nodeValue ? escape(nd.nodeValue) : "null") );

	        if (nd.nodeType === 1 // 元素节点，元素节点没有 nodeValue
	        // 有效文本节点，nodeName == "#text"
	        || nd.nodeType === 3 && nd.nodeValue && nd.nodeValue.trim()) {
	          RC = nd;
	          break;
	        }
	      }
	      return RC;
	    };
	    // 元素子节点或非空文本节点数量
	    $.childCount = function (el) {
	      var RC = 0;

	      if (!el) return 0;

	      for (var i = 0; i < el.childNodes.length; i++) {
	        var nd = el.childNodes[i];

	        // alert(nd.nodeType + "/" + nd.nodeName + "/"
	        //	+ (nd.nodeValue ? escape(nd.nodeValue) : "null") );

	        if (nd.nodeType === 1 // 元素节点，元素节点没有 nodeValue
	        // 有效文本节点，nodeName === "#text"
	        || nd.nodeType === 3 && nd.nodeValue && nd.nodeValue.trim()) {
	          RC++;
	        }
	      }
	      return RC;
	    };
	    $.hasChild = function (el) {
	      if (!el) return false;
	      var child = el.children;
	      return child.length > 0;
	    };

	    // 得到obj的上级元素TagName
	    // ff parentNode 会返回 空 节点
	    // ff textNode节点 没有 tagName
	    $.upperTag = function (el, tagName) {
	      var RC = null;

	      var tn = tagName.toUpperCase();

	      var i = 0;
	      var nd = el;
	      while (nd) {
	        i++;
	        if (i >= 10) break;
	        if (nd.tagName && nd.tagName === tn) {
	          RC = nd;
	          break;
	        }
	        nd = nd.parentNode;
	      }
	      return RC;
	    };

	    // 得到obj的上级元素TagName
	    // ff parentNode 会返回 空 节点
	    // ff textNode节点 没有 tagName
	    /**
	     * 获取 指定 tagName的子元素
	     * @param el
	     * @param tagName
	     * @returns {*}
	     */
	    $.childTag = function (el, tag) {
	      var RC = null;

	      if (!el) return null;

	      try {
	        for (var i = 0; i < el.childNodes.length; i++) {
	          var nd = el.childNodes[i];

	          if (nd.tagName && nd.tagName === tag.toUpperCase()) {
	            RC = nd;
	            break;
	          }
	        }
	      } catch (e) {
	        alert('childTag exp:' + e.message);
	      }

	      return RC;
	    };
	    /**
	     * 光标放入尾部
	     * @param el
	     */
	    $.cursorEnd = function (el) {
	      el.focus();

	      if (typeof window.getSelection !== 'undefined' && typeof document.createRange !== 'undefined') {
	        var rg = document.createRange();
	        rg.selectNodeContents(el);
	        // 合并光标
	        rg.collapse(false);
	        var sel = window.getSelection();
	        sel.removeAllRanges();
	        sel.addRange(rg);
	      } else if (typeof document.body.createTextRangrge !== 'undefined') {
	        var _rg = document.body.createTextRange();
	        _rg.moveToElementText(el);
	        // 合并光标
	        _rg.collapse(false);
	        // textRange.moveStart('character', 3);
	        _rg.select();
	      }
	    };

	    /**
	     * 获取光标位置
	     * @param el
	     * @returns {number}
	     */
	    $.getCursorPos = function (el) {
	      var rs = 0;

	      if (!el) return 0;

	      // obj.focus();
	      if (el.selectionStart) {
	        // IE以外
	        rs = el.selectionStart;
	      } else {
	        // IE
	        var rg = null;
	        if (el.tagName.toLowerCase() === 'textarea') {
	          // TEXTAREA
	          rg = event.srcElement.createTextRange();
	          rg.moveToPoint(event.x, event.y);
	        } else {
	          // Text
	          rg = document.selection.createRange();
	        }
	        rg.moveStart('character', -event.srcElement.value.length);
	        // rg.setEndPoint("StartToStart", obj.createTextRange())
	        rs = rg.text.length;
	      }
	      return rs;
	    };

	    // 得到光标的位置
	    $.getCursorPosition = function (el) {
	      var qswh = '@#%#^&#*$';
	      // obj.focus();
	      var rng = document.selection.createRange();
	      rng.text = qswh;
	      var nPosition = el.value.indexOf(qswh);
	      rng.moveStart('character', -qswh.length);
	      rng.text = '';
	      return nPosition;
	    };

	    // 设置光标位置
	    $.setCursorPos = function (el, pos) {
	      var rg = el.createTextRange();
	      rg.collapse(true);
	      rg.moveStart('character', pos);
	      rg.select();
	    };

	    $.moveFirst = function () {
	      this.rowindex = 0;
	    };
	    $.fastLink = function () {
	      // a 标签加载 touchstart 事件,避免 300毫秒等待
	      try {
	        var links = $.qus('a');
	        links.forEach(function (link) {
	          if (link.href && link.hasAttribute('fastlink')) {
	            //!$.has(link, 'no-fast')) {
	            var touchStartY;
	            link.ontouchstart = function (e) {
	              touchStartY = e.changedTouches[0].clientY;
	              /*
	                            ev.preventDefault();
	                            if (!ev.touches.length)
	                              return;
	                            if ($.hasClass(link, 'back'))
	                              return history.back();
	                            location.href = link.href;
	              */
	            };
	            link.ontouchend = function (e) {
	              if (Math.abs(e.changedTouches[0].clientY - touchStartY) > 10) return;

	              e.preventDefault();
	              /*
	                            if (!e.touches.length)
	                              return;
	              */
	              if ($.hasClass(link, 'back')) return history.back();
	              location.href = link.href;
	            };
	          }
	        });
	      } catch (e) {
	        alert('fastLink exp: ' + e.message);
	      }
	    };

	    // Define methods that will be available on all
	    // Knife collections
	    // 原型, 在$()后可调用
	    $.fn = {
	      constructor: knife.K,
	      length: 0,

	      // Because a collection acts like an array
	      // copy over these useful array functions.
	      forEach: emptyArray.forEach,
	      reduce: emptyArray.reduce,
	      push: emptyArray.push,
	      sort: emptyArray.sort,
	      splice: emptyArray.splice,
	      indexOf: emptyArray.indexOf
	    };

	    $.K.prototype = $.knife.K.prototype = $.fn;

	    // 返回 $ 类,可以直接调用其静态属性和方法
	    return $;
	  }();

	  // If `$` is not yet defined, point it to `Knife`
	  window.Knife = Knife;
	  window.$ === undefined && (window.$ = Knife);
	  return Knife;
	});

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.trim = trim;
	exports.format = format;
	exports.urlParam = urlParam;
	exports.getHash = getHash;
	exports.hashParam = hashParam;
	exports.session = session;
	exports.getAbsUrl = getAbsUrl;
	exports.getBaseUrl = getBaseUrl;
	/**
	 * Created by way on 16/6/10.
	 */

	function trim(s) {
	  return s == null ? '' : String(s).replace(/(^\s*)|(\s*$)/g, '');
	}

	/**
	 * 格式化字符串，类似 node util中带的 format
	 * @type {Function}
	 */
	function format(f) {
	  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	    args[_key - 1] = arguments[_key];
	  }

	  var i = 0;
	  var len = args.length;
	  var str = String(f).replace(/%[sdj%]/g, function (x) {
	    if (x === '%%') return '%';
	    if (i >= len) return x;
	    switch (x) {
	      case '%s':
	        return String(args[i++]);
	      case '%d':
	        return Number(args[i++]);
	      case '%j':
	        return JSON.stringify(args[i++]);
	      default:
	        return x;
	    }
	  });

	  return str;
	}

	function urlParam(name) {
	  var rc = null;

	  var val = '&' + location.search.substr(1) + '&';
	  var rg = new RegExp('&' + name + '=([^&]*)&');
	  var rgs = rg.exec(val);
	  if (rgs) {
	    rc = rgs[1];
	    rc = decodeURIComponent(rc);
	    rc = trim(rc);
	  }

	  return rc;
	}

	/**
	 * 获取 url 的 fragment（即 hash 中去掉 # 的剩余部分）
	 *
	 * 如果没有则返回字符串
	 * 如: http://example.com/path/?query=d#123 => 123
	 *
	 * @param {String} url url
	 * @returns {String}
	 */
	function getHash(url) {
	  if (!url) return '';

	  var pos = url.indexOf('#!');
	  if (pos !== -1) pos++;else pos = url.indexOf('#');

	  return pos !== -1 ? url.substring(pos + 1) : ''; // ??? '/'
	}

	function hashParam(name) {
	  var rc = null;

	  var hash = getHash(location.hash);
	  if (!hash) return '';

	  var pos = hash.indexOf('?');
	  if (pos === -1) return '';

	  var val = '&' + hash.substr(pos + 1) + '&';
	  var rg = new RegExp('&' + name + '=([^&]*)&');
	  var rgs = rg.exec(val);
	  if (rgs) {
	    rc = rgs[1];
	    rc = decodeURIComponent(rc);
	    rc = trim(rc);
	  }

	  return rc;
	}

	function session(name, val) {
	  if (val !== undefined) sessionStorage.setItem(name, val);else {
	    return sessionStorage.getItem(name) || '';
	  }
	}

	// import pathToRegexp from 'path-to-regexp';

	/**
	 * 获取一个链接相对于当前页面的绝对地址形式
	 *
	 * 假设当前页面是 http://a.com/b/c
	 * 那么有以下情况:
	 * d => http://a.com/b/d
	 * /e => http://a.com/e
	 * #1 => http://a.com/b/c#1
	 * http://b.com/f => http://b.com/f
	 *
	 * @param {String} url url
	 * @returns {String}
	 */
	function getAbsUrl(url) {
	  var link = document.createElement('a');
	  link.setAttribute('href', url);
	  var abs = link.href;
	  link = null;
	  return abs;
	}

	/**
	 * 获取一个 url 的基本部分，即不包括 hash
	 *
	 * @param {String} url url
	 * @returns {String}
	 */
	function getBaseUrl(url) {
	  var pos = url.indexOf('#');
	  return pos === -1 ? url.slice(0) : url.slice(0, pos);
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /**
	                                                                                                                                                                                                                                                                               * Created by way on 16/9/19.
	                                                                                                                                                                                                                                                                               * 调用后台api接口
	                                                                                                                                                                                                                                                                               * 所有调用需要 token 身份, 如没有则自动获取, 并保存到 sessionStorage
	                                                                                                                                                                                                                                                                               */

	exports.token = token;
	exports.code = code;
	exports.lastCode = lastCode;
	exports.docker = docker;
	exports.host = host;
	exports.getToken = getToken;
	exports.getView = getView;
	exports.getDoc = getDoc;
	exports.postForm = postForm;
	exports.getWxSign = getWxSign;
	exports.myalertp = myalertp;
	exports.userOnoffpp = userOnoffpp;
	exports.GetCookie = GetCookie;
	exports.SetCookie = SetCookie;
	exports.getCookieVal = getCookieVal;
	exports.mypost = mypost;
	exports.myget = myget;
	exports.mypostn = mypostn;
	exports.setTitle = setTitle;

	var _kajax = __webpack_require__(8);

	var ajax = _interopRequireWildcard(_kajax);

	var _config = __webpack_require__(1);

	var _config2 = _interopRequireDefault(_config);

	var _kutil = __webpack_require__(6);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function token(val) {
	  if (val !== undefined) sessionStorage.setItem(_config2.default.app.token, val);else {
	    return _config2.default.dev.token ? _config2.default.dev.token : sessionStorage.getItem(_config2.default.app.token) || '';
	  }
	}

	function code(val) {
	  if (val !== undefined) sessionStorage.setItem(_config2.default.app.code, val);else {
	    return sessionStorage.getItem(_config2.default.app.code) || '';
	  }
	}

	function lastCode(val) {
	  if (val !== undefined) sessionStorage.setItem(_config2.default.app.lastCode, val);else {
	    return sessionStorage.getItem(_config2.default.app.lastCode) || '';
	  }
	}

	function docker(val) {
	  if (val !== undefined) sessionStorage.setItem(_config2.default.app.docker, val);else {
	    return sessionStorage.getItem(_config2.default.app.docker) || 'wx';
	  }
	}

	function host() {
	  return docker() === 'rel' ? _config2.default.rel.host : _config2.default.api.host;
	}

	/**
	 * 通过url中的code获得openid
	 * @param tx 存储 token的 input
	 * @param cb
	 */
	function getToken(cb) {
	  if (token()) cb(null, token());else {
	    if (!code()) code((0, _kutil.urlParam)('code')); // search.substring(search.indexOf('=') + 1, search.length);
	    // alert(`getToken code:${code}`);
	    /*
	     if (AUTH_URL && (!code || code === 'undefined') && failcnt < 3) {
	     failcnt++;
	     location.href = AUTH_URL;
	     }
	     */

	    if (code() && code() !== lastCode()) {
	      var url = docker() === 'rel' ? '' + _config2.default.rel.host + _config2.default.rel.token : '' + _config2.default.api.host + _config2.default.api.token;
	      // alert(`getToken url:${url} code:${code()}`);
	      ajax.get(url, 'code=' + code(), function (rs) {
	        // alert(`getToken code:${code()} rs:${rs}`);
	        lastCode(code());
	        if (rs) {
	          var r = JSON.parse(rs);
	          if (r.rc === 200) {
	            token(r.token);
	            cb(null, r.token);
	          } else cb(new Error('获取身份信息失败,请退出重新打开或联系客服!'), '');
	        }
	      });
	    } else {
	      // alert(`code:${code()} code===lastCode: ${code() === lastCode()}`);
	      cb(new Error('获取身份信息失败,请退出重新打开或联系客服!'), '');
	    }
	  }
	}

	/**
	 *
	 * @param url
	 * @param param
	 * @param cb
	 * @param tk  是否必须 token，否则错误返回
	 */
	/*
	export function get(url, param, cb, tk) {
	  if (token()) {
	    param = param ? `${param}&token=${token()}` : `token=${token()}`;
	    url = url.indexOf(host()) === -1 ? `${host()}${url}` : url;
	    // alert(`url:${url} para:${para} token:${token()}`);
	    ajax.get(url, param, cb);
	  } else {
	    if (/rel.nuoyadalu.com/.test(url))
	      docker('rel');

	    getToken((err, tok) => {
	      if (tk && err) {
	        cb('');
	        // alert(err.message);
	      } else {
	        param = param ? `${param}&token=${tok}` : `token=${tok}`;
	        url = url.indexOf(host()) === -1 ? `${host()}${url}` : url;
	        // alert(`get url:${url} para:${param}`);
	        ajax.get(url, param, cb);
	      }
	    });
	  }
	}
	*/

	function getView(url, param, cb) {
	  // alert(`url:${url} para:${para}`);
	  ajax.get(url.indexOf(_config2.default.view.host) === -1 ? '' + _config2.default.view.host + url : url, param, cb);
	}

	function getDoc(url, param, cb) {
	  // alert(`url:${url} para:${para}`);
	  ajax.get(url.indexOf(_config2.default.doc.host) === -1 ? '' + _config2.default.doc.host + url : url, param, cb);
	}

	/**
	 *
	 * @param url
	 * @param data
	 * @param cb
	 * @param tk  是否必须 token，否则错误返回
	 */
	/*
	export function post(url, data, cb, tk) {
	  if (token()) {
	    if ((typeof data) === 'object')
	      data.token = token();
	    else
	      data = data ? `${data}&token=${token()}` : `token=${token()}`;

	    url = url.indexOf(host()) === -1 ? `${host()}${url}` : url;
	    // alert(`url:${url} para:${data} token:${token()}`);
	    ajax.post(url, data, cb);
	  } else {
	    if (/rel.nuoyadalu.com/.test(url))
	      docker('rel');

	    getToken((err, tok) => {
	      if (tk && err) {
	        cb(err, '');
	        // alert(err.message);
	      } else {
	        if ((typeof data) === 'object')
	          data.token = tok;
	        else
	          data = data ? `${data}&token=${tok}` : `token=${tok}`;

	        url = url.indexOf(host()) === -1 ? `${host()}${url}` : url;
	        // alert(`post url:${url} para:${data}`);
	        ajax.post(url, data, cb);
	      }
	    });
	  }
	}
	*/

	function postForm(url, data, cb) {
	  if (token()) {
	    data.append('token', token());
	    ajax.postForm(url.indexOf(host()) === -1 ? '' + host() + url : url, data, cb);
	  } else {
	    if (/rel.nuoyadalu.com/.test(url)) docker('rel');
	    getToken(function (err, tk) {
	      data.append('token', tk);
	      ajax.postForm(url.indexOf(host()) === -1 ? '' + host() + url : url, data, cb);
	    });
	  }
	}

	/**
	 * 从服务器获取微信上传签名、时标
	 * @param type
	 * @returns {string}
	 */
	function getWxSign(cb) {
	  var href = 'url=' + location.href;
	  href = href.replace(/&/, '%26');
	  href = href.replace(/#[\s\S]*$/, '');
	  ajax.get('' + _config2.default.api.host + _config2.default.api.wxsign, href, function (rs) {
	    cb(JSON.parse(rs));
	  });
	}

	// alert 弹层 优化函数  //没有函数  就只是提示  有函数 则执行
	function myalertp(id, message, fn) {
	  //var str1 = '<div class="mianpger-boxbtn1lay"></div>';
	  if (!$.qu('.city-a-wrap')) {
	    var div = document.createElement("div");
	    var div_html = '<div class="city-a"><p class="city-a-boxp1">' + message + '</p><span class="city-a-boxsp1">确定</span></div>';
	    div.setAttribute("class", "city-a-wrap");
	    var fdiv = $.id(id);
	    fdiv.appendChild(div);

	    div.innerHTML = div_html;
	    $.qu('.city-a-boxsp1').onclick = function () {
	      $.id(id).removeChild($.qu('.city-a-wrap'));
	      fn && fn();
	    };
	  }
	}

	// 新的登陆方式
	//具体参数说明
	// num  路由跳转关键字 可以在 主js文件 看初始路由跳转
	// fn   判断已经登陆的成功的 回调函数
	// pageid  当前层的id 用于alert弹层
	// layercla  ajxa请求动画  对应的是当前页的 动画class
	// data  返回搜索页面 初始路由跳转的 参数
	//alertms 弹层 提示信息
	//isalert 是否需要弹出提示  1 表示不需要  空 则表示需要

	function userOnoffpp(num, fn, pageid, layercla, data, alertms, isalert) {
	  if (layercla) {
	    $.qu(layercla).style.display = '-webkit-box';
	  }

	  //var mycode = encodeURIComponent(String(num));


	  var myUrlad = (0, _kutil.getBaseUrl)(window.location.href);
	  var key = '';
	  if (myUrlad.indexOf('?') != -1) {
	    // 有问号 ？了
	    key = '&';
	  } else {
	    key = '?';
	  }
	  var mycoden = encodeURIComponent(key + 'entry_code=' + num);
	  //var myUrl =getBaseUrl( window.location.href)+key+'entry_code='+mycode;
	  var myUrl = (0, _kutil.getBaseUrl)(window.location.href) + mycoden;

	  var oData2 = '';
	  var xhr = new XMLHttpRequest();
	  var reqPath = flightUrl + '/icbc/xhService.ashx?act=checkLogin&returnUri=' + myUrl;
	  //var reqPath = flightUrl+'/icbc/xhService.ashx?act=checkLogin&returnUri=' + myUrl;
	  xhr.open('get', reqPath, 'false');
	  xhr.send();
	  xhr.onreadystatechange = function () {
	    if (xhr.readyState == 4) {
	      // ajax 响内容解析完成，可以在客户端调用了
	      if (xhr.status == 200) {
	        if (layercla) {
	          $.qu(layercla).style.display = 'none';
	        }

	        //  判断服务器返回的状态 200 表示 正常
	        oData2 = JSON.parse(xhr.responseText);
	        //oData2 =eval(xhr.responseText)
	        var sta = oData2.Status;
	        var url = oData2.Result;
	        //alert(url)
	        if (sta == 1) {
	          // 1表示已经登录了

	          var theuserdata = {
	            userName: url.MemberName,
	            userID: url.CardNo,
	            xhUnitId: url.UnitId,
	            xhPerms: url.Perms
	          };
	          //alert(`登陆返回perm${url.Perms}`)
	          //alert(`UnitId${url.UnitId}`)
	          document.cookie = "theUserdata=" + JSON.stringify(theuserdata);
	          fn();
	          //alert('已经登陆')
	          console.log('初次每次都要验证！');
	        } else {
	          //没有登录
	          //alert('没有登陆')
	          // document.cookie = "tkey=0";
	          document.cookie = "theUserdata=";
	          //document.cookie = "userName=";
	          //document.cookie = "userID=";
	          var ms = alertms ? alertms : '抱歉，登录超时，将重新登录，请稍后';
	          if (isalert) {
	            location.href = "/html5/" + url;
	          } else {
	            myalertp(pageid, ms, function () {
	              location.href = "/html5/" + url;
	            });
	          }

	          localStorage.setItem('allbookdatastr', data);
	        }
	      } else {
	        //alert('初次验证出错了，Err' + xhr.status);
	        myalertp(pageid, '验证用户登录出问题。');
	      }
	    }
	  };
	}

	//设置本地 定时器  使用了cookie的方法
	//取Cookie的值
	function GetCookie(name) {
	  var arg = name + "=";
	  var alen = arg.length;
	  var clen = document.cookie.length;
	  var i = 0;
	  while (i < clen) {
	    var j = i + alen;
	    if (document.cookie.substring(i, j) == arg) return getCookieVal(j);
	    i = document.cookie.indexOf(" ", i) + 1;
	    if (i == 0) break;
	  }
	  return null;
	}
	//写入到Cookie
	//name:cookie名称  value:cookie值
	//t :分钟数
	function SetCookie(name, value, t) {
	  var Days = 30;
	  var exp = new Date();
	  exp.setTime(exp.getTime() + 60000 * t); //过期时间 2分钟
	  document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
	}

	function getCookieVal(offset) {
	  var endstr = document.cookie.indexOf(";", offset);
	  if (endstr == -1) endstr = document.cookie.length;
	  return unescape(document.cookie.substring(offset, endstr));
	}

	//ajax 封装的方法  之后要优化 asyn 是否异步 如果空 则为true 否则为当前的 asyn
	function mypost(url, data, method, cb, asyn) {
	  var xhr = '';
	  if (window.XMLHttpRequest) {
	    xhr = new XMLHttpRequest();
	  } else {
	    xhr = new ActiveXObject(' Microsoft . XMLHTTP');
	  }

	  xhr.onreadystatechange = function () {
	    if (xhr.readyState === 4 && cb) {
	      if (xhr.status === 200) cb(null, xhr.responseText);else cb(new Error(xhr.status), xhr.responseText);
	    }
	  };

	  // 异步 post,回调通知

	  var isasyn = true;
	  if (asyn) {
	    isasyn = asyn;
	  }

	  xhr.open('POST', url, isasyn);
	  var param = data;
	  if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object') param = JSON.stringify(data);

	  xhr.setRequestHeader('Content-Type', 'text/plain; charset=utf-8');
	  if (method) {
	    xhr.setRequestHeader('X-AjaxPro-Method', method);
	  }
	  xhr.send(param);
	}

	//ajax 封装的方法  之后要优化
	function myget(url, data, asyn, cb) {
	  var xhr = '';
	  if (window.XMLHttpRequest) {
	    xhr = new XMLHttpRequest();
	  } else {
	    xhr = new ActiveXObject(' Microsoft . XMLHTTP');
	  }
	  //xhr.open('get','http://106.75.131.58:8015/icbc/xhService.ashx?act=GETSERVICEPHONE&Source=XHSV','false');
	  xhr.open('get', url + '?' + data, asyn);
	  xhr.send();
	  xhr.onreadystatechange = function () {
	    if (xhr.readyState === 4 && cb) {
	      if (xhr.status === 200) cb(null, xhr.responseText);else cb(new Error(xhr.status), xhr.responseText);
	    }
	  };
	}

	// 新的 post方法
	function mypostn(url, data, asyn, cb) {
	  var xhr = '';
	  if (window.XMLHttpRequest) {
	    xhr = new XMLHttpRequest();
	  } else {
	    xhr = new ActiveXObject(' Microsoft . XMLHTTP');
	  }

	  xhr.onreadystatechange = function () {
	    if (xhr.readyState === 4 && cb) {
	      if (xhr.status === 200) cb(null, xhr.responseText);else cb(new Error(xhr.status), xhr.responseText);
	    }
	  };

	  // 异步 post,回调通知

	  var isasyn = true;
	  if (asyn) {
	    isasyn = asyn;
	  }

	  xhr.open('POST', url, isasyn);
	  var param = data;
	  if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object') param = JSON.stringify(data);

	  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	  xhr.send(param);
	}

	//设置 titile
	function setTitle(val) {

	  //let  myurl = (window.location.href).split('/');
	  //let myurlkey = myurl[myurl.lentth-1];
	  //console.log(myurlkey)


	  setTimeout(function () {
	    // 利用iframe的onload事件刷新页面
	    document.title = val;

	    var fr = document.createElement('iframe');
	    // fr.style.visibility = 'hidden';
	    fr.style.display = 'none';
	    fr.src = 'img/back.bg.png';
	    fr.onload = function () {
	      setTimeout(function () {
	        document.body.removeChild(fr);
	      }, 0);
	    };
	    document.body.appendChild(fr);
	  }, 0);
	}

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	/**
	 * Created by way on 16/8/28.
	 * ajax get、post
	 */

	/**
	 创建xmlHttpRequest,返回xmlHttpRequest实例,根据不同的浏览器做兼容
	 */
	function getXhr() {
	  var rs = null;

	  if (window.XMLHttpRequest) rs = new XMLHttpRequest();else if (window.ActiveXObject) rs = new ActiveXObject('Microsoft.XMLHTTP');

	  return rs;
	}

	function objToParam(obj) {
	  var rs = '';

	  var arr = [];
	  for (var k in obj) {
	    if (obj.hasOwnProperty(k)) {
	      arr.push(k + '=' + obj[k]);
	    }
	    // rs += `${k}=${obj[k]}&`;
	  }
	  // 排序
	  rs = arr.sort().join('&');
	  // alert(rs);
	  return rs;
	}

	function post(url, data, cb) {
	  var xhr = getXhr();
	  xhr.onreadystatechange = function () {
	    if (xhr.readyState === 4 && cb) {
	      if (xhr.status === 200) cb(null, xhr.responseText);else cb(new Error(xhr.status), xhr.responseText);
	    }
	    /*
	        if ((xhr.readyState === 4) && (xhr.status === 200)) {
	          cb(xhr.responseText);
	        }
	    */
	  };

	  // 异步 post,回调通知
	  xhr.open('POST', url, true);
	  var param = data;
	  if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object') param = objToParam(data);

	  // 发送 FormData 数据, 会自动设置为 multipart/form-data
	  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	  // xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=AaB03x');
	  // alert(param);
	  xhr.send(param);
	}

	/**
	 * xmlHttpRequest POST 方法
	 * 发送 FormData 数据, 会自动设置为 multipart/form-data
	 * 其他数据,应该是 application/x-www-form-urlencoded
	 * @param url post的url地址
	 * @param data 要post的数据
	 * @param cb 回调
	 */
	function postForm(url, data, cb) {
	  var xhr = getXhr();
	  xhr.onreadystatechange = function () {
	    if (xhr.readyState === 4 && cb) {
	      if (xhr.status === 200) cb(null, xhr.responseText);else cb(new Error(xhr.status), xhr.responseText);
	    }
	  };

	  // 异步 post,回调通知
	  xhr.open('POST', url, true);
	  // 发送 FormData 数据, 会自动设置为 multipart/form-data
	  // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	  // xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=AaB03x');
	  xhr.send(data);
	}

	/**
	 * xmlHttpRequest GET 方法
	 * @param url get的URL地址
	 * @param data 要get的数据
	 * @param cb 回调
	 */
	function get(url, param, cb) {
	  var xhr = getXhr();
	  xhr.onreadystatechange = function () {
	    if (xhr.readyState === 4 && xhr.status === 200) {
	      if (cb) cb(xhr.responseText);
	    }
	  };

	  if (param) xhr.open('GET', url + '?' + param, true);else xhr.open('GET', url, false);
	  xhr.send(null);
	}

	exports.get = get;
	exports.post = post;
	exports.postForm = postForm;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by way on 16/9/28.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _config = __webpack_require__(1);

	var _config2 = _interopRequireDefault(_config);

	var _api = __webpack_require__(7);

	var _kutil = __webpack_require__(6);

	var _kswipe = __webpack_require__(10);

	var _kswipe2 = _interopRequireDefault(_kswipe);

	var _kajax = __webpack_require__(8);

	var ajax = _interopRequireWildcard(_kajax);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var $ = __webpack_require__(5); //myalertp 封装的 alert提示弹层

	//import { TouchSlide } from '../lib/kslide';

	var _view = __webpack_require__(11);
	var fcity = 'a';
	var tcity = '';
	var OT = 1;
	var phonenum = '';

	var theuser = 1;
	var timer = '';

	var _class = function () {
	    function _class(opt) {
	        _classCallCheck(this, _class);

	        this.path = '/flightmb/join$';
	        this.hash = '/flightmb/join';
	        this.title = '机票查询Title';

	        opt = opt || {};
	        this.path = opt.path || this.path;
	        this.hash = opt.hash || this.hash;
	        this.title = opt.title || this.title;
	    }

	    // 输出视图


	    _createClass(_class, [{
	        key: 'view',
	        value: function view(cb) {
	            if (!_view) {
	                // 静态资源浏览器有缓存,增加时标,强制刷新!
	                (0, _api.getView)(_config2.default.view.flightmbJoin + '?t=' + +new Date(), '', function (rs) {
	                    _view = rs;
	                    cb(null, _view);
	                });
	            } else {
	                cb(null, _view);
	            }
	        }

	        // 在已经加载的视图上操作

	    }, {
	        key: 'bind',
	        value: function bind(dv, params) {
	            console.log(params);

	            (0, _api.setTitle)('\u673A\u7968');

	            //// 轮播图
	            //let dataimg =['pic-1.jpg','pic-2.jpg','pic-3.jpg','pic-4.jpg'];
	            //pullimgLi(dataimg)
	            //function pullimgLi(data){
	            //    let str ='';
	            //    for(var i=0;i<data.length;i++){
	            //        str += `<li><a href="#"><img src="https://cos.uair.cn/mb/img/${data[i]}" alt=""/></a></li>`
	            //    }
	            //    $.qu('.bd_xhli').innerHTML =str;
	            //}
	            //
	            //TouchSlide({slideCell:"#focus", titCell:".hd ul", mainCell:".bd ul", effect:"left", autoPlay:true,autoPage:true})


	            // 加载轮播图片
	            var imgs = ['https://cos.uair.cn/mb/img/pic-1.jpg', 'https://cos.uair.cn/mb/img/pic-2.jpg', 'https://cos.uair.cn/mb/img/pic-3.jpg', 'https://cos.uair.cn/mb/img/pic-4.jpg'];
	            startSwipe(imgs, 1.9);
	            function startSwipe(imgs, WHR) {
	                // const imgs = ['img/meinv.jpg', 'img/lizhi.jpg', 'img/8.jpg'];
	                // const imgs = ['img/lizhi.jpg'];
	                //const imgs = [];
	                //const ls = qus('.weui_uploader_files > li');
	                //for (let i = 0; i < ls.length; i++) {
	                //    let url = ls[i].style.backgroundImage;
	                //    url = url.substring(4, url.length - 1);
	                //    // pc 上有 " , 需去掉!
	                //    if (url[0] === '"')
	                //        url = url.substring(1, url.length - 1);
	                //    if (url)
	                //        imgs.push(url);
	                //}

	                if (imgs && imgs.length > 0) {
	                    var _dv = $.qu('.swipe');
	                    window.swipe = new _kswipe2.default(_dv, {
	                        width: screen.width,
	                        //height: parseInt(screen.width,10) / WHR,
	                        height: window.screen.width / 320 * 120,
	                        imgs: imgs,
	                        auto: 5000,
	                        continuous: true
	                    });
	                }
	            }

	            var myurl = window.location.href.split('/');
	            var myurlkey = myurl[myurl.length - 1];
	            console.log(myurlkey);

	            var nowd = jiondateChange(Ntime());
	            $.qu('.input1').innerHTML = nowd; // 默认 填充 去程时间 只能放在前面
	            $.qu('.input1w').innerHTML = '(' + getWeekDaylong(nowd) + ')'; // 默认 填充 去程时间 只能放在前面

	            console.log(params);
	            if (params.linkp == 1) {

	                // 免账号登陆

	                if (params.thephonep) {
	                    var thephonep = params.thephonep;
	                    // 存在电话 说明是 容易联的 默认登陆
	                    //alert('路由后电话号码'+thephonep)
	                    (0, _api.mypostn)('http://ca.nuoya.io/leaveSp/api/credit', 'MobilePhone=' + thephonep, '', function (err, res) {
	                        console.log(err);
	                        //alert(res)
	                        if (err) {
	                            (0, _api.myalertp)('router0', '抱歉，获取登陆用户id出错,请重试！');
	                        } else {
	                            if (JSON.parse(res).rc == '202') {
	                                // myalertp('router0','抱歉，数据库暂无该账号信息')
	                            } else {
	                                var AgentID = JSON.parse(res).CreditData[0].CardNo.replace('MFW', '20');
	                                //var DisplayName = '';//存放 获取到的 用户昵称
	                                var DisplayName = JSON.parse(res).CreditData[0].MemberName;
	                                //alert(AgentID)
	                                // alert(DisplayName)
	                                if (!AgentID || !DisplayName) {
	                                    (0, _api.myalertp)('router0', '抱歉，账号信息有误');
	                                } else {
	                                    //pullLogin(AgentID,DisplayName)
	                                    //pullLogin(DisplayName)

	                                    // 4分钟 发送一次 登陆信息
	                                    //alert(DisplayName)
	                                    pullLogin(DisplayName);
	                                    var mytimer = setInterval(function () {
	                                        //alert(DisplayName)
	                                        pullLogin(DisplayName);
	                                    }, 240000);
	                                }
	                            }
	                        }
	                    });
	                } else {
	                    var thephonep = '';
	                }

	                // 郭彩霞测试
	                //pullLogin('201507120017583251','gcxia1')
	            } else {
	                allthedatatohtml(params.joindata);
	            }

	            $.qu('.tab-item2').onclick = function () {
	                //  跳转到我的机票  要检查是否登录

	                (0, _api.userOnoffpp)('a', function () {
	                    $.router.go('#!/flightmb/allmytickes', {}, true);
	                }, 'router0', '', '', '抱歉，您还未登陆，请前往登陆页面~~', 1); // 1表示 我的机票登陆

	            };
	            // 加载客服电话 html
	            //thexhPhone();

	            //  测试加入 所有电话
	            pullallmyphone();
	            $.qu('.tab-item3').onclick = function () {
	                //  联系客服
	                $.qu('.thephone').style.display = '-webkit-box';
	                //console.log(phonenum);
	                pullnumtohtml(phonenum);
	            };

	            ttbtn1.onclick = function () {
	                //单程选择
	                $.removeClass(ttbtn2, 'active');
	                $.addClass(this, 'active');
	                //$.qu('.tab-ul9').style.display = 'none';
	                $.qu('.tab-ul9').style.left = '0';

	                $.qu('.from_la').style.left = '4%';
	                $.qu('.from_la1').style.left = '3%';
	                //单程图标
	                // $.qu('.change').src = "https://cos.uair.cn/mb/img/right-go.png";
	                $.qu('.input2').innerHTML = '';
	                OT = 1;
	            };
	            ttbtn2.onclick = function () {
	                //往返选择
	                $.removeClass(ttbtn1, 'active');
	                $.addClass(this, 'active');
	                //$.qu('.tab-ul9').style.display = 'block';
	                $.qu('.tab-ul9').style.left = '50%';

	                $.qu('.from_la').style.left = '56%';
	                $.qu('.from_la1').style.left = '55%';
	                //返程图标
	                // $.qu('.change').src = "https://cos.uair.cn/mb/img/change.png";
	                $.qu('.input2').innerHTML = Ntime1();
	                $.qu('.input2w').innerHTML = '(' + getWeekDaylong(Ntime1()) + ')';
	                OT = 2;
	            };

	            city0.onclick = function () {
	                // 起始地点 选择
	                var onecity = allthedata(); // 获取页面数据 进入 地点选择页面 再返回 加载
	                $.router.go('#!/flightmb/city', { citytype: 0, joindata: onecity }, true);
	            };
	            city1.onclick = function () {
	                var onecity = allthedata(); // 获取页面数据 进入 地点选择页面 再返回 加载
	                $.router.go('#!/flightmb/city', { citytype: 1, joindata: onecity }, true);
	            };
	            // 地点切换
	            $.qu('.tab-ul4').onclick = function () {
	                var city0 = $.id('city0').innerHTML;
	                var city1 = $.id('city1').innerHTML;
	                $.qu(".tab-ul3").className = "tab-ul3 go-right";
	                $.qu(".tab-ul5").className = "tab-ul5 go-left";
	                this.children[0].className = "city-icon rotate";
	                setTimeout(function () {
	                    $.qu('.tab-ul4').children[0].className = "city-icon";
	                    $.id('city0').innerHTML = city1;
	                    $.id('city1').innerHTML = city0;
	                    $.qu(".tab-ul3").className = "tab-ul3";
	                    $.qu(".tab-ul5").className = "tab-ul5";
	                }, 500);
	            };

	            $.qu('.tab-ul8').onclick = function () {
	                var onecity = allthedata(); //获取页面数据 进入 地点选择页面 再返回 加载
	                // 0 为选择 去程时间
	                $.router.go('#!/flightmb/adate', { timetype: 0, joindata: onecity }, true);
	            };

	            $.qu('.tab-ul9').onclick = function () {
	                var ftime = $.qu('.input1').innerHTML;
	                //1 为选择 返程时间
	                var onecity = allthedata(); //获取页面数据 进入 地点选择页面 再返回 加载
	                $.router.go('#!/flightmb/adate', { timetype: 1, joindata: onecity }, true);
	            };
	            //  带数据  点击查询按钮
	            $.qu('.search-b').onclick = function () {
	                var city00 = $.id('city0').innerHTML;
	                var city11 = $.id('city1').innerHTML;

	                //存储 历史查询
	                var k = sessionStorage.length + 1;
	                var m = k + 1;
	                sessionStorage.setItem('city' + k, city00);
	                sessionStorage.setItem('city' + m, city11);
	                var time00 = $.qu('.input1').innerHTML;
	                var time11 = $.qu('.input2').innerHTML;
	                var num2 = time11;
	                if (num2 == '') {
	                    num2 = 0;
	                }

	                //console.log(jiondateChange(time00))
	                //console.log(jiondateChange(num2))
	                var t1 = jiondateChange(time00).replace(/\-/g, '');
	                if (num2 == 0) {
	                    //单程
	                    console.log('单程');
	                    //$.router.go('#!/flightmb/detail',{},true)
	                    $.router.go('#!/flightmb/detail', { citydetail1: city00, citydetail2: city11, timedetail1: time00, timedetail2: time11, cliktype: 1, backtype: 1 }, true);
	                    //$.router.go('/flightmb/join',{},true)
	                    //$.router.go('#!/flightmb/adate',{},true)
	                } else {
	                    // 往返
	                    var t2 = jiondateChange(num2).replace(/\-/g, '');
	                    if (t1 > t2) {
	                        //alert('出发日期不能大于返回日期~~！')
	                        (0, _api.myalertp)('router0', '出发日期不能大于返回日期~~！');
	                    } else {
	                        $.router.go('#!/flightmb/detail', { citydetail1: city00, citydetail2: city11, timedetail1: time00, timedetail2: time11, cliktype: 1, backtype: 1 }, true);
	                        console.log('往返');
	                    }
	                }
	            };
	        }
	    }]);

	    return _class;
	}();

	////  轮询登陆函数
	//function pullloinname(){
	//    setTimeout(function(){
	//        var n=1;
	//        var mytimer = setInterval(function(){
	//            console.log(n);
	//            n++;
	//            if(DisplayName){
	//                alert(DisplayName)
	//                pullLogin(DisplayName)
	//            }
	//        },8000)
	//    },2000)
	//}


	// 电话按顺序整合


	exports.default = _class;
	function pullnumtohtml(phonenum) {

	    var arrdata = phonenum.split(',');
	    console.log('获取的电话数据');
	    console.log(arrdata);
	    arrdata.length = 5;
	    var data = arrdata.sort(); //排序 按顺序后
	    var data1 = [];
	    for (var i = 0; i < data.length; i++) {
	        data1.push(data[i].split('|')[1]);
	    }
	    //console.log(data1)

	    var text = ['南航直营客服电话：', '深航直营客服电话：', '川航直营客服电话：', '非直营机票客服电话：', '投诉电话：'];

	    var str2 = ' <span class="thephone-sp">确定</span>';
	    //var

	    var str1 = '';
	    for (var i = 0; i < data1.length; i++) {
	        var phone = data1[i].replace(/-/g, '');
	        str1 += '<p><span>' + text[i] + '</span><a href="tel:' + phone + '">' + phone + '</a></p>';
	    }
	    var str3 = str1 + str2;
	    $.qu('.thephone-wrap').innerHTML = str3;
	    // 隐藏 电话页面
	    $.qu('.thephone-sp').onclick = function () {
	        $.qu('.thephone').style.display = 'none';
	    };
	}

	function getallphonenum(key, n) {

	    (0, _api.myget)(flightUrl + '/icbc/xhService.ashx', 'act=GETSERVICEPHONE&Source=' + key, true, function (err, res) {
	        if (err) {
	            (0, _api.myalertp)('router0', '出错了，获取客服联系电话失败！');
	        } else {
	            var oData3 = eval('(' + res + ')');
	            console.log(oData3);
	            var phonts = oData3.Result.Phone;
	            var phontn = oData3.Result.Source;
	            var dt = n + phontn + '|' + phonts;
	            getmyphone(dt);
	        }
	    });
	}
	// 回调函数 获取电话
	function getmyphone(data) {
	    phonenum += data + ',';
	}

	//  5个电话 综合 篇
	function pullallmyphone() {
	    getallphonenum('XHSV', 4);
	    getallphonenum('XHTS', 5);
	    getallphonenum('CZ', 1);
	    getallphonenum('ZH', 2);
	    getallphonenum('3U', 3);
	}

	// 获取页面 已经填入的数据
	function allthedata() {
	    var ctyf = $.id('city0').innerHTML;
	    var ctyt = $.id('city1').innerHTML;
	    var timef = $.qu('.input1').innerHTML;
	    var timet = $.qu('.input2').innerHTML;
	    var data = {
	        ctyf: ctyf,
	        ctyt: ctyt,
	        timef: timef,
	        timet: timet
	    };

	    return data;
	}
	//  重新填入 页面数据
	function allthedatatohtml(data) {
	    if (data) {
	        $.id('city0').innerHTML = data.ctyf;
	        $.id('city1').innerHTML = data.ctyt;
	        $.qu('.input1').innerHTML = jiondateChange(data.timef); //getWeekDaylong()
	        $.qu('.input1w').innerHTML = '(' + getWeekDaylong(jiondateChange(data.timef)) + ')';
	        $.qu('.input2').innerHTML = jiondateChange(data.timet);
	        $.qu('.input2w').innerHTML = '(' + getWeekDaylong(jiondateChange(data.timet)) + ')';
	    }
	}

	function Ntime() {
	    //默认 出发日期
	    var myTime = new Date();
	    var iYear = myTime.getFullYear();
	    var iMonth = myTime.getMonth() + 1;
	    var iDate = myTime.getDate();
	    var ssr = iYear + '-' + iMonth + '-' + iDate;

	    return ssr;
	}
	function Ntime1() {
	    //默认 到达日期

	    var data1 = jiondateChange($.qu('.input1').innerHTML);
	    function GetDateStrH(data1, h) {

	        var Y1 = data1.substring(0, 4);
	        var m1 = data1.substring(5, 7) - 1;
	        var d1 = data1.substring(8, 10);
	        // var  h1 = data1.substring(11, 13);
	        // var  M1 = data1.substring(14, 17);
	        var dd = new Date(Y1, m1, d1);
	        dd.setHours(dd.getHours() + h); //获取AddDayCount天后的日期
	        var y = dd.getFullYear();
	        var m = dd.getMonth() + 1; //获取当前月份的日期
	        var d = dd.getDate();

	        if ((m + "").length == 1) {
	            m = "0" + m;
	        }
	        if ((d + "").length == 1) {
	            d = "0" + d;
	        }

	        return y + "-" + m + "-" + d;
	    }
	    return GetDateStrH(data1, 24);
	}
	//重组时间
	function jiondateChange(date) {

	    //对date进行重新组装成yyyy-MM-dd的格式
	    //2014 - 8 - 7
	    try {
	        var tempDate1Arr = date.split("-");
	        date = tempDate1Arr[0] + "";
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
	    } catch (e) {}

	    return date;
	}

	//  根据时间 填写 星期几
	function getWeekDaylong(obj) {
	    var NewArray = new Array("周日", "周一", "周二", "周三", "周四", "周五", "周六");
	    var oArray = ["今天", "明天", "后天"];
	    var DateYear = parseInt(obj.split("-")[0]);
	    var DateMonth = parseInt(obj.split("-")[1]);
	    var DateDay = parseInt(obj.split("-")[2]);
	    var NewDate = new Date(DateYear, DateMonth - 1, DateDay);
	    var NewWeek = NewDate.getDay();
	    var nowDate = new Date();
	    var num = 1;
	    var currentDate = nowDate.getFullYear() + "-" + oneToTwo(nowDate.getMonth() + 1) + "-" + oneToTwo(nowDate.getDate());
	    var cha = removeType(obj) - removeType(currentDate);
	    return cha > 2 ? NewArray[NewWeek] : oArray[cha];
	    //一位数转成两位数
	    function oneToTwo(b) {
	        if (b < 10) {
	            return "0" + b;
	        } else {
	            return b;
	        }
	    }
	    //去掉横杠好比较大小
	    function removeType(e) {
	        return e.replace(/\-/g, "");
	    }
	}

	//function mylayer(id,fn){
	//    //var str1 = '<div class="mianpger-boxbtn1lay"></div>';
	//    var div = document.createElement("div");
	//    var div_html ='<div id="loginlay-w"><p class="text">2s后即将登陆，请稍后...</p><input type="text" class="loginname" value="kenrecall" ><span class="loginlay-sb">取消该账号登录</span></div>';
	//    div.setAttribute("id", "loginlay");
	//    var fdiv = $.id(id);
	//    fdiv.appendChild(div);
	//
	//
	//    div.innerHTML =div_html;
	//
	//
	//    var n=2;
	//    var ltimer = setInterval(function () {
	//        var  endtime = n+'s后即将登陆，请稍后...';
	//        $.qu('.text').innerHTML =endtime;
	//        n--;
	//        if(n==-1){
	//            clearInterval(ltimer);
	//            //alert('进入登陆页面')
	//
	//            fn()
	//
	//
	//        }
	//
	//    },1000)
	//    var onoff = false;
	//    $.qu('.loginlay-sb').onclick = function (){
	//        if(onoff){
	//            //alert('进入登陆页面')
	//
	//            fn()
	//            //$.id(id).removeChild($.id('loginlay'));
	//
	//        }else{
	//            clearInterval(ltimer);
	//            $.qu('.text').innerHTML ='请输入新账号';
	//            this.innerHTML = '点击登录';
	//            onoff = true;
	//        }
	//
	//    }
	//
	//
	//}

	function pullLogin(name) {
	    //pullLogin(id,name){
	    ///icbc/zyService.ashx?act=nameLogin&userNick=xx&OrderID=1  更新
	    // '/icbc/zyService.ashx','act=loginOrder&userId='+id+'&loginId='+name+'&OrderID=1', 旧版本

	    (0, _api.myget)('/icbc/zyService.ashx', 'act=nameLogin&userNick=' + name + '&OrderID=1', true, function (err, res) {
	        console.log(err);
	        console.log(res);
	        if (err) {
	            //myalertp('dvContainer','出错了，默认登陆失败')
	            console.log('默认登陆失败！');
	            (0, _api.myalertp)('router0', '抱歉，默认登陆失败,请重试！');
	        } else {
	            console.log('默认登陆成功！');
	            //alert('默认登陆成功')
	            console.log(res);
	            //$.id('router0').removeChild($.id('loginlay'));
	        }
	    });
	}

	//匿名函数
	function setRygTile() {
	    getHistory();
	    var flag = false;
	    setTimeout(function () {
	        flag = true;
	    }, 1000);
	    window.addEventListener('popstate', function (e) {
	        //监听到返回事件
	        if (flag) {
	            //自己想要做的事情
	        }
	        getHistory();
	    }, false);
	    function getHistory() {
	        var state = {
	            title: '测试5',
	            url: '' //可写返回事件的跳转路径
	        };
	        window.history.pushState(state, 'title', url);
	    }
	}

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = Swipe;
	/*
	 * Swipe 2.0
	 *
	 * Brad Birdsall
	 * Copyright 2013, MIT License
	 * walter modify for img swipe
	 * load first img, then load other img!
	 * 通过函数调用实现多实例!
	 */

	function Swipe(container, options) {
	  // utilities
	  var noop = function noop() {}; // simple no operation function

	  var offloadFn = function offloadFn(fn) {
	    setTimeout(fn || noop, 0);
	  }; // offload a functions execution

	  // check browser capabilities
	  var browser = {
	    addEventListener: !!window.addEventListener,
	    touch: 'ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch,
	    transitions: function (temp) {
	      var props = ['transformProperty', 'WebkitTransform', 'MozTransform', 'OTransform', 'msTransform'];
	      for (var i in props) {
	        if (temp.style[props[i]] !== undefined) return true;
	      }return false;
	    }(document.createElement('swipe'))
	  };

	  // quit if no root element
	  if (!container) return null;

	  var element = container.children[0];
	  var slides, slidePos, width;
	  options = options || {};

	  var index = parseInt(options.startSlide, 10) || 0;
	  var speed = options.speed || 300;

	  function newImg(src, cb) {
	    var img = document.createElement('img');
	    img.src = src;
	    if (img.complete) cb(img);else img.onload = function () {
	      return cb(img);
	    };
	  }

	  function addImg(dv, img, h) {
	    img.height = h;
	    img.width = h * img.naturalWidth / img.naturalHeight;
	    dv.appendChild(img);
	  }

	  /**
	   * walter add for dynamic create swipe img from img urls!
	   */
	  function init() {
	    var imgs = options.imgs || [];
	    var cnt = imgs.length;
	    // 清除原有图片!!!
	    element.innerHTML = '';
	    // static swipe!
	    if (!cnt) {
	      _setup();
	    } else {
	      (function () {
	        var w = options.width;
	        var h = options.height;
	        container.style.width = w + 'px';
	        container.style.height = h + 'px';

	        // 创建内容层
	        var dvs = [];
	        for (var i = 0; i < cnt; i++) {
	          var div = document.createElement('div');
	          dvs.push(div);
	          element.appendChild(div);
	        }

	        // load first img!
	        newImg(imgs[0], function (img) {
	          addImg(dvs[0], img, h);

	          if (imgs.length === 1) _setup();else {
	            var _loop = function _loop(_i) {
	              newImg(imgs[_i], function (img) {
	                addImg(dvs[_i], img, h);
	                container.style.visibility = 'visible';
	                // last img loaded, start swipe!
	                if (_i === imgs.length - 1) {
	                  _setup();
	                }
	              });
	            };

	            // load others img
	            for (var _i = 1; _i < imgs.length; _i++) {
	              _loop(_i);
	            }
	          }
	        });
	      })();
	    }
	  }

	  function _setup() {
	    // cache slides
	    slides = element.children;
	    // create an array to store current positions of each slide
	    slidePos = new Array(slides.length);

	    // determine width of each slide
	    // 获取不到
	    // width = container.getBoundingClientRect().width || container.offsetWidth;
	    width = parseInt(getComputedStyle(container).width); // container.style.width ||

	    element.style.width = slides.length * width + 'px';

	    // alert('dvImg width:' + element.style.width + ' swipe: ' + container.getBoundingClientRect().width + '/' + container.offsetWidth
	    //  + '/' + container.style.width + '/' + getComputedStyle(container).width);
	    // alert(slides.length + '/' + element.style.width);

	    // stack elements
	    var pos = slides.length;
	    while (pos--) {
	      var slide = slides[pos];
	      slide.style.width = width + 'px';
	      slide.setAttribute('data-index', pos);

	      if (browser.transitions) {
	        slide.style.left = pos * -width + 'px';
	        move(pos, index > pos ? -width : index < pos ? width : 0, 0);
	      }
	    }

	    if (!browser.transitions) {
	      element.style.left = index * -width + 'px';
	    }

	    container.style.visibility = 'visible';

	    // start auto slideshow if applicable
	    if (delay && slides && slides.length > 1) begin();
	  }

	  function _prev() {
	    if (index) _slide(index - 1);else if (options.continuous) _slide(slides.length - 1);
	  }

	  function _next() {
	    if (index < slides.length - 1) _slide(index + 1);else if (options.continuous) _slide(0);
	  }

	  function _slide(to, slideSpeed) {
	    // do nothing if already on requested slide
	    if (index == to) return;
	    if (browser.transitions) {
	      var diff = Math.abs(index - to) - 1;
	      var direction = Math.abs(index - to) / (index - to); // 1:right -1:left
	      while (diff--) {
	        move((to > index ? to : index) - diff - 1, width * direction, 0);
	      }move(index, width * direction, slideSpeed || speed);
	      move(to, 0, slideSpeed || speed);
	    } else {
	      animate(index * -width, to * -width, slideSpeed || speed);
	    }
	    index = to;
	    offloadFn(options.callback && options.callback(index, slides[index]));
	  }

	  function move(index, dist, speed) {
	    translate(index, dist, speed);
	    slidePos[index] = dist;
	  }

	  function translate(index, dist, speed) {
	    var slide = slides[index];
	    var style = slide && slide.style;
	    if (!style) return;
	    style.webkitTransitionDuration = style.MozTransitionDuration = style.msTransitionDuration = style.OTransitionDuration = style.transitionDuration = speed + 'ms';

	    style.webkitTransform = 'translate(' + dist + 'px,0)' + 'translateZ(0)';
	    style.msTransform = style.MozTransform = style.OTransform = 'translateX(' + dist + 'px)';
	  }

	  function animate(from, to, speed) {
	    // if not an animation, just reposition
	    if (!speed) {
	      element.style.left = to + 'px';
	      return;
	    }

	    var start = +new Date();
	    var timer = setInterval(function () {
	      var timeElap = +new Date() - start;
	      if (timeElap > speed) {
	        element.style.left = to + 'px';
	        if (delay) begin();
	        options.swiped && options.swiped.call(event, index, slides[index]);
	        clearInterval(timer);
	        return;
	      }
	      element.style.left = (to - from) * (Math.floor(timeElap / speed * 100) / 100) + from + 'px';
	    }, 4);
	  }

	  // setup auto slideshow
	  var delay = options.auto || 0;
	  var interval;

	  function begin() {
	    interval = setTimeout(_next, delay);
	  }

	  function stop() {
	    delay = 0;
	    clearTimeout(interval);
	  }

	  // setup initial vars
	  var _start = {};
	  var delta = {};
	  var isScrolling;

	  // setup event capturing
	  var events = {
	    handleEvent: function handleEvent(event) {
	      switch (event.type) {
	        case 'touchstart':
	          this.start(event);
	          break;
	        case 'touchmove':
	          this.move(event);
	          break;
	        case 'touchend':
	          offloadFn(this.end(event));
	          break;
	        case 'webkitTransitionEnd':
	        case 'msTransitionEnd':
	        case 'oTransitionEnd':
	        case 'otransitionend':
	        case 'transitionend':
	          offloadFn(this.transitionEnd(event));
	          break;
	        case 'resize':
	          offloadFn(_setup.call());
	          break;
	      }

	      if (options.stopPropagation) event.stopPropagation();
	    },
	    start: function start(event) {
	      var touches = event.touches[0];
	      // measure start values
	      _start = {
	        // get initial touch coords
	        x: touches.pageX,
	        y: touches.pageY,
	        // store time to determine touch duration
	        time: +new Date()
	      };

	      // used for testing first move event
	      isScrolling = undefined;
	      // reset delta and end measurements
	      delta = {};
	      // attach touchmove and touchend listeners
	      element.addEventListener('touchmove', this, false);
	      element.addEventListener('touchend', this, false);
	    },
	    move: function move(event) {
	      // ensure swiping with one touch and not pinching
	      if (event.touches.length > 1 || event.scale && event.scale !== 1) return;

	      if (options.disableScroll) event.preventDefault();

	      var touches = event.touches[0];

	      // measure change in x and y
	      delta = {
	        x: touches.pageX - _start.x,
	        y: touches.pageY - _start.y
	      };

	      // determine if scrolling test has run - one time test
	      if (typeof isScrolling == 'undefined') {
	        isScrolling = !!(isScrolling || Math.abs(delta.x) < Math.abs(delta.y));
	      }

	      // if user is not trying to scroll vertically
	      if (!isScrolling) {
	        // prevent native scrolling
	        event.preventDefault();

	        // stop slideshow
	        stop();

	        // increase resistance if first or last slide
	        delta.x = delta.x / (!index && delta.x > 0 // if first slide and sliding left
	        || index == slides.length - 1 // or if last slide and sliding right
	        && delta.x < 0 // and if sliding at all
	        ? Math.abs(delta.x) / width + 1 : // determine resistance level
	        1); // no resistance if false

	        // translate 1:1
	        translate(index - 1, delta.x + slidePos[index - 1], 0);
	        translate(index, delta.x + slidePos[index], 0);
	        translate(index + 1, delta.x + slidePos[index + 1], 0);
	      }
	    },
	    end: function end(event) {
	      // measure duration
	      var duration = +new Date() - _start.time;
	      // determine if slide attempt triggers next/prev slide
	      var isValidSlide = Number(duration) < 250 // if slide duration is less than 250ms
	      && Math.abs(delta.x) > 20 // and if slide amt is greater than 20px
	      || Math.abs(delta.x) > width / 2; // or if slide amt is greater than half the width

	      // determine if slide attempt is past start and end
	      var isPastBounds = !index && delta.x > 0 // if first slide and slide amt is greater than 0
	      || index == slides.length - 1 && delta.x < 0; // or if last slide and slide amt is less than 0

	      // determine direction of swipe (true:right, false:left)
	      var direction = delta.x < 0;

	      // if not scrolling vertically
	      if (!isScrolling) {
	        if (isValidSlide && !isPastBounds) {
	          if (direction) {
	            move(index - 1, -width, 0);
	            move(index, slidePos[index] - width, speed);
	            move(index + 1, slidePos[index + 1] - width, speed);
	            index += 1;
	          } else {
	            move(index + 1, width, 0);
	            move(index, slidePos[index] + width, speed);
	            move(index - 1, slidePos[index - 1] + width, speed);
	            index += -1;
	          }

	          options.callback && options.callback(index, slides[index]);
	        } else {
	          move(index - 1, -width, speed);
	          move(index, 0, speed);
	          move(index + 1, width, speed);
	        }
	      }

	      // kill touchmove and touchend event listeners until touchstart called again
	      element.removeEventListener('touchmove', events, false);
	      element.removeEventListener('touchend', events, false);
	    },
	    transitionEnd: function transitionEnd(event) {
	      if (parseInt(event.target.getAttribute('data-index'), 10) == index) {
	        if (delay) begin();
	        options.swiped && options.swiped.call(event, index, slides[index]);
	      }
	    }
	  };

	  // trigger setup
	  init();

	  // setup();

	  /*
	    // start auto slideshow if applicable
	    if (delay)
	      begin();
	  */
	  // add event listeners
	  if (browser.addEventListener) {
	    // set touchstart event on element
	    if (browser.touch) element.addEventListener('touchstart', events, false);
	    if (browser.transitions) {
	      element.addEventListener('webkitTransitionEnd', events, false);
	      element.addEventListener('msTransitionEnd', events, false);
	      element.addEventListener('oTransitionEnd', events, false);
	      element.addEventListener('otransitionend', events, false);
	      element.addEventListener('transitionend', events, false);
	    }

	    // set resize event on window
	    window.addEventListener('resize', events, false);
	  } else {
	    window.onresize = function () {
	      _setup();
	    }; // to play nice with old IE
	  }

	  // expose the Swipe API
	  return {
	    setup: function setup() {
	      _setup();
	    },
	    slide: function slide(to, speed) {
	      _slide(to, speed);
	    },
	    prev: function prev() {
	      // cancel slideshow
	      stop();
	      _prev();
	    },
	    next: function next() {
	      stop();
	      _next();
	    },
	    getPos: function getPos() {
	      // return current index position
	      return index;
	    },
	    kill: function kill() {
	      // cancel slideshow
	      stop();
	      // reset element
	      element.style.width = 'auto';
	      element.style.left = 0;
	      // reset slides
	      var pos = slides.length || 0;
	      while (pos--) {
	        var slide = slides[pos];
	        slide.style.width = '100%';
	        slide.style.left = 0;
	        if (browser.transitions) translate(pos, 0, 0);
	      }

	      // removed event listeners
	      if (browser.addEventListener) {
	        // remove current event listeners
	        element.removeEventListener('touchstart', events, false);
	        element.removeEventListener('webkitTransitionEnd', events, false);
	        element.removeEventListener('msTransitionEnd', events, false);
	        element.removeEventListener('oTransitionEnd', events, false);
	        element.removeEventListener('otransitionend', events, false);
	        element.removeEventListener('transitionend', events, false);
	        window.removeEventListener('resize', events, false);
	      } else {
	        window.onresize = null;
	      }
	    }
	  };
	}

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = "<!-- 页面内容 -->\r\n\r\n\r\n<div class=\"page-c\" id=\"router0\">\r\n    <div class=\"thephone\">\r\n        <div class=\"thephone-wrap\">\r\n            <!--<p><span>客服电话：</span><a href=\"tel:18580040217\">18580040217</a></p>-->\r\n            <!--<p><span>客服电话：</span><a href=\"tel:4000662188\">4000662188</a></p>-->\r\n            <!--<p><span>客服电话：</span><a href=\"tel:15184447593\">15184447593</a></p>-->\r\n            <!--<span class=\"thephone-sp1\">确定</span>-->\r\n        </div>\r\n\r\n    </div>\r\n    <div class=\"lodin-jo\">\r\n        <div id=\"caseBlanche-jo\">\r\n            <div id=\"rond-jo\">\r\n                <div id=\"test-jo\"></div>\r\n            </div>\r\n            <div id=\"load-jo\">\r\n\r\n                <p>验证登陆中...</p>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <nav class=\"bar bar-tab\">\r\n        <strong class=\"tab-item tab-item1 active \" >\r\n             <span class=\"tab-label1\">机票查询</span>\r\n        </strong>\r\n        <strong class=\"tab-item tab-item2 \" >\r\n             <span class=\"tab-label2\">我的机票</span>\r\n        </strong>\r\n        <strong class=\"tab-item tab-item3 \" >\r\n             <span class=\"tab-label3\">联系客服</span>\r\n        </strong>\r\n    </nav>\r\n    <div class=\"content\">\r\n        <!--<div id=\"focus\" class=\"focus\">-->\r\n\r\n            <!--<div class=\"bd\">-->\r\n                <!--<ul class=\"bd_xhli\">-->\r\n                <!--</ul>-->\r\n            <!--</div>-->\r\n            <!--<div class=\"hd\">-->\r\n                <!--<ul></ul>-->\r\n            <!--</div>-->\r\n        <!--</div>-->\r\n        <span class=\"join-t1\">\r\n           <img  src=\"https://cos.uair.cn/mb/img/head.bg.png\" alt=\"\">\r\n        </span>\r\n        <!-- 轮播图 -->\r\n        <div id='dvSwipe' class='swipe'>\r\n            <div id='dvSwipeImg' class='swipe-wrap'></div>\r\n        </div>\r\n        <div class=\"content-block content-bg\">\r\n                <div class=\"buttons-tab button-c\">\r\n                    <span  class=\"tab-link active button button-cs1\" id=\"ttbtn1\">单程</span>\r\n                    <div class=\"from_la\"></div>\r\n                    <div class=\"from_la1\"></div>\r\n                    <span class=\"tab-link button button-cs2\" id=\"ttbtn2\">往返</span>\r\n                    <div class=\"to_la\"></div>\r\n                </div>\r\n                <div class=\"content-block content-wrap\">\r\n                   <div class=\"tabs\">\r\n\r\n                     <div id=\"tab1\" class=\"tab\">\r\n                            <ul class=\"tab-ul \">\r\n                               <li class=\"tab-ul1\">出发地点</li>\r\n                               <li class=\"tab-ul2\">到达地点</li>\r\n                               <li class=\"tab-ul3\"><strong id=\"city0\" class=\"creat-firstcity\">重庆</strong></li>\r\n                               <li class=\"change-li tab-ul4\">\r\n                                  <div data-speed=\"城市交换\" class=\"city-icon\">\r\n                                    <span class=\"\" id=\"city\">\r\n                                      <svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" class=\"city-icon-circle\"><path d=\"M13.578 6.673c0-0.296 0.24-0.536 0.536-0.536l0.755-0.008c-0.793-3.104-3.608-5.399-6.96-5.399-3.372 0-6.198 2.323-6.971 5.455l-0.441-0.589c0.985-3.157 3.931-5.449 7.412-5.449 3.672 0 6.746 2.55 7.554 5.975l0.082 0.396c0.082 0.452 0.127 0.917 0.127 1.392 0 0.273-0.014 0.542-0.042 0.807l-2.053-2.046zM2.282 9.336c0 0.296-0.239 0.536-0.535 0.537l-0.755 0.008c0.797 3.103 3.615 5.394 6.967 5.39 3.372-0.004 6.195-2.331 6.964-5.465l0.442 0.588c-0.981 3.159-3.924 5.454-7.405 5.459-3.672 0.005-6.749-2.541-7.562-5.966l-0.083-0.396c-0.082-0.452-0.128-0.916-0.129-1.392-0-0.273 0.014-0.542 0.041-0.807l2.056 2.044z\"></path></svg> \r\n                                    </span>                                \r\n                                    <span class=\"city-icon-plane\">\r\n                                      <svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"37\" height=\"16\" viewBox=\"0 0 37 16\">\r\n                                        <path d=\"M34.345 3.527l-8.042 3.039-10.137-5.429c-1.204-0.544-1.241-0.644-2.088-0.325l-3.608 1.363c-1.119 0.418-0.588 0.805 1.128 2.667l5.078 5.36-12.764 4.822c1.271 0.194 8.993 0.784 10.75 0.121l21.065-7.958c1.011-0.381 1.52-1.51 1.139-2.52s-1.511-1.52-2.521-1.139zM10.231 11.831l-4.288-2.229c-1.27-0.676-1.763-0.674-3.662 0.044l-1.957 0.74 3.704 3.789 6.203-2.343z\"></path>\r\n                                      </svg>\r\n                                    </span>\r\n                                  </div> \r\n                               </li>\r\n                               <li class=\"tab-ul5\"><strong id=\"city1\" class=\"creat-firstcity1\">北京</strong></li>\r\n                               <li class=\"tab-ul6\">出发日期</li>\r\n                               <li class=\"tab-ul7\">返程日期</li>\r\n                               <li class=\"tab-ul8\"><span class=\"input1\"></span><span class=\"input1w\">周五</span></li>\r\n                               <li class=\"tab-ul9\"><span class=\"input2\"></span><span class=\"input2w\">周日</span></li>\r\n\r\n\r\n                            </ul>\r\n                     </div>\r\n\r\n                   </div>\r\n                </div>\r\n                <p class=\"search-p\"><span  class=\"search-b\">查询</span></p>\r\n                <p class=\"notice_p\">温馨提示：\r\n                    5月11日至17日期间，从昆明长水国际机场出发的旅客请注意，由于在此期间客流量将增大，机场安保升级，请出行旅客至少提前三小时到达机场办理登机手续。</p>\r\n\r\n        </div>\r\n    </div>\r\n</div>\r\n"

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by way on 16/9/28.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


	var _config = __webpack_require__(1);

	var _config2 = _interopRequireDefault(_config);

	var _api = __webpack_require__(7);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var $ = __webpack_require__(5);
	//myalertp 封装的 alert提示弹层
	//myalertp('router0','出错了，获取客服联系电话失败！')
	var _view = __webpack_require__(13);
	var dataType = '';
	var dataC = '';
	var joindata = ''; // 存放 带过来的数据


	var _class = function () {
	    function _class(opt) {
	        _classCallCheck(this, _class);

	        this.path = '/flightmb/city$';
	        this.hash = '/flightmb/city';
	        this.title = '城市选择';

	        opt = opt || {};
	        this.path = opt.path || this.path;
	        this.hash = opt.hash || this.hash;
	        this.title = opt.title || this.title;
	    }

	    // 输出视图


	    _createClass(_class, [{
	        key: 'view',
	        value: function view(cb) {
	            if (!_view) {
	                // 静态资源浏览器有缓存,增加时标,强制刷新!
	                (0, _api.getView)(_config2.default.view.lotteryOpen + '?t=' + +new Date(), '', function (rs) {
	                    _view = rs;
	                    cb(null, _view);
	                });
	            } else {
	                cb(null, _view);
	            }
	        }

	        // 在已经加载的视图上操作

	    }, {
	        key: 'bind',
	        value: function bind(dv, params) {
	            console.log(params);

	            dataType = params.citytype; //  0 或者 1  0为起始地点  1 为降落地点

	            joindata = params.joindata; // 打包 带过来的数据
	            //console.log(joindata)
	            // 获取本地存储数据 历史查询城市
	            var dataHisCity = gethisCity();
	            var dataHotCity = '';
	            $.html(pickCity, cityHtml(dataHisCity)); // 加载页面代码
	            if (dataHisCity.length == 0) {
	                $.id('divTop').style.display = 'none';
	                $.qu('.hc-ul2').style.display = 'none';
	            }

	            // 点击返回 可能带参数
	            $.qu('.wrap-ft-ba').onclick = function () {

	                $.router.go('#!/flightmb/join', '', false);
	                toTOP();
	            };

	            pullDom();
	        }
	    }]);

	    return _class;
	}();
	// 获取 本地存储的 历史查询城市


	exports.default = _class;
	function gethisCity() {
	    var ck = sessionStorage.length + 1;
	    var citys = [];
	    //console.log(sessionStorage)
	    for (var i = 1; i < ck; i++) {
	        var c = 'city' + i;
	        var city = sessionStorage.getItem(c);
	        citys.push(city);
	    }
	    for (var i = 0; i < citys.length; i++) {
	        for (var j = i + 1; j < citys.length; j++) {
	            if (citys[i] == citys[j]) {
	                citys.splice(j, 1);
	                j--;
	            }
	        }
	    }
	    return citys.reverse();
	}

	//页面相关操作
	function pullDom() {

	    var aLIbody = $.qus('.li-body');

	    for (var i = 0; i < aLIbody.length; i++) {
	        aLIbody[i].onclick = function () {
	            var tcity = this.innerHTML;
	            if (dataType == 0) {
	                //  0 就是 起始地点选择
	                if (tcity == joindata.ctyf) {
	                    // 再次选出发地点 和之前的出发地点一样
	                    //alert('选择的出发地点相同！')
	                    (0, _api.myalertp)('pickCity', '选择的出发地点相同');
	                } else {
	                    if (tcity == joindata.ctyt) {
	                        //alert('出发地点不能和到达地点相同！')
	                        (0, _api.myalertp)('pickCity', '出发地点不能和到达地点相同!');
	                    } else {
	                        joindata.ctyf = tcity;
	                        $.router.go('#!/flightmb/join', { citytype: dataType, joindata: joindata }, true);
	                    }
	                }
	            } else {
	                //  1就是 降落地点
	                if (tcity == joindata.ctyt) {
	                    // 再次选出发地点 和之前的出发地点一样
	                    //alert('选择的到达地点相同！')
	                    (0, _api.myalertp)('pickCity', '选择的到达地点相同!');
	                } else {
	                    if (tcity == joindata.ctyf) {
	                        //alert('出发地点不能和到达地点相同！')
	                        (0, _api.myalertp)('pickCity', '出发地点不能和到达地点相同!');
	                    } else {
	                        joindata.ctyt = tcity;
	                        $.router.go('#!/flightmb/join', { citytype: dataType, joindata: joindata }, true);
	                    }
	                }
	            }

	            toTOP();
	        };
	    }
	    var aHCli = $.qus('.hc-li');
	    for (var i = 0; i < aHCli.length; i++) {
	        aHCli[i].onclick = function () {
	            //$.html(pickCity, ''); //清空上一次加载的 html代码
	            var ccity = this.innerHTML;
	            if (dataType == 0) {
	                //  0 就是 起始地点选择
	                if (ccity == joindata.ctyf) {
	                    // 再次选出发地点 和之前的出发地点一样
	                    //alert('选择的出发地点相同！')
	                    (0, _api.myalertp)('pickCity', '选择的出发地点相同!');
	                } else {
	                    if (ccity == joindata.ctyt) {
	                        //alert('出发地点不能和到达地点相同！')
	                        (0, _api.myalertp)('pickCity', '出发地点不能和到达地点相同!');
	                    } else {
	                        joindata.ctyf = ccity;
	                        $.router.go('#!/flightmb/join', { citytype: dataType, joindata: joindata }, true);
	                    }
	                }
	            } else {
	                //  1就是 降落地点
	                if (ccity == joindata.ctyt) {
	                    // 再次选出发地点 和之前的出发地点一样
	                    //alert('选择的到达地点相同！')
	                    (0, _api.myalertp)('pickCity', '选择的到达地点相同!');
	                } else {
	                    if (ccity == joindata.ctyf) {
	                        //alert('出发地点不能和到达地点相同！')
	                        (0, _api.myalertp)('pickCity', '出发地点不能和到达地点相同!');
	                    } else {
	                        joindata.ctyt = ccity;
	                        $.router.go('#!/flightmb/join', { citytype: dataType, joindata: joindata }, true);
	                    }
	                }
	            }
	            toTOP();
	        };
	    }
	    var Amycode = $.qus('.myCOde-a');
	    for (var i = 0; i < Amycode.length; i++) {
	        Amycode[i].onclick = function () {
	            //var theTop =$.qu('.wrap-ft').getBoundingClientRect().top;
	            var myID2 = this.innerHTML;
	            //$.qu('.wrap-ft').style.paddingTop ='2.2rem';
	            $.id(myID2).scrollIntoView(true);
	            //$.qu('.wrap-ft').style.paddingTop ='4.4rem';

	        };
	    }
	    var odP = $.id('pickCity');
	    odP.onscroll = function () {
	        if (odP.scrollTop < 50) {
	            $.qu('.wrap-ft').style.paddingTop = '2.2rem';
	        }
	    };
	}

	function toTOP() {
	    var odP = $.id('pickCity');
	    if (odP.scrollTop != 0) {
	        odP.scrollTop = 0; // 返回顶部
	    }
	}

	// 页面布局函数
	function cityHtml(dataHisCity) {
	    // 此处可以传递相关数据进去

	    var dataHotCity = strToJson(getPopCity()).results;

	    var putData = '<ul class="data-ul">' + creatHmlt() + '</ul>';
	    var str0 = '';
	    var str1 = '';
	    for (var i = 0; i < dataHotCity.length; i++) {
	        str0 += '<li class="hc-li">' + dataHotCity[i].info + '</li>';
	    }

	    for (var i = 0; i < dataHisCity.length; i++) {
	        str1 += '<li class="hc-li">' + dataHisCity[i] + '</li>';
	    }

	    var dCityt1 = '<div class="div2 ">' + '<span class="sp1">热门城市</span>' + '<div class="div3"></div>' + '</div >' + '<ul class="hc-ul clear hc-ul1 ">';
	    var dCityt = '<div class="div2 " id="divTop">' + '<span class="sp1">历史查询</span>' + '<div class="div3"></div>' + '</div >' + '<ul class="hc-ul clear hc-ul2">';
	    var dCityb = '</ul>';

	    var ahotCity = dCityt1 + str0 + dCityb;
	    var ahisCity = dCityt + str1 + dCityb;

	    var popupHTMLt = '<div class="popup wrap-city">' + '<p class="wrap-ft-p1"><a href="#" class="close-popup wrap-ft-ba">关闭</a></p>' + '<div class="wrap-ft"><div class="wrap-ft-wrap"> ';
	    var popupHTMLb = '</div></div></div>';
	    // 侧边栏点击
	    var myCOde = '';
	    var mytagArray = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
	    for (var i = 0; i < mytagArray.length; i++) {
	        myCOde += '<a href="#" class="myCOde-a">' + mytagArray[i] + '</a>';
	    }
	    var myBar = '<div class="mybar clear">' + myCOde + '</div>';
	    // 整合好所有代码 装备加进 div层
	    var theinHtml = popupHTMLt + ahisCity + ahotCity + putData + popupHTMLb + myBar;

	    return theinHtml;
	}

	// 转换为json
	function strToJson(str) {
	    var json = new Function("return" + str)();
	    return json;
	}
	//为一个数组 数据来源
	//console.log(flightmbData)
	function pushData() {

	    var searchData = strToJson(getCityObj()).results;

	    var cityArray = new Array();
	    var myAlldata = new Array();
	    var mytagArray = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
	    for (var i = 0; i < mytagArray.length; i++) {
	        var tag = mytagArray[i];
	        var tagCityArray = new Array();

	        var allCitys = searchData;
	        for (var j = 0; j < allCitys.length; j++) {
	            if (allCitys[j].value.indexOf(tag) == 0) {
	                tagCityArray.push(allCitys[j].info);
	            }
	        }
	        cityArray.push(tagCityArray);
	    };

	    for (var i = 0; i < mytagArray.length; i++) {
	        myAlldata.push(mytagArray[i] + ',' + cityArray[i]);
	    }
	    return myAlldata;
	};
	//console.log(pushData()[0].split(',')[0])
	// 创建html
	function creatHmlt() {
	    var creatDatas = pushData(); //为一长度为26的数组
	    var createLis = new Array();
	    var sTrs = '';
	    for (var i = 0; i < creatDatas.length; i++) {
	        var creatData = creatDatas[i].split(',');
	        if (creatData[1] == '') {
	            //console.log(creatData[0])
	            var str = '<li id="' + creatData[0] + '" class="li-head li-head-dis">' + creatData[0] + '</li>';
	        } else {
	            var str = '<li id="' + creatData[0] + '" class="li-head">' + creatData[0] + '</li>';
	            for (var j = 1; j < creatData.length; j++) {

	                str += '<li class="li-body">' + creatData[j] + '</li>';
	            }
	        }

	        createLis.push(str);
	    }
	    //return createLis
	    //
	    for (var n = 0; n < createLis.length; n++) {
	        sTrs += createLis[n];
	    }

	    return sTrs;
	}

/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = "<div id=\"pickCity\">\r\n\r\n</div>\r\n"

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	/**
	 * Created by way on 16/9/28.
	 */


	var _config = __webpack_require__(1);

	var _config2 = _interopRequireDefault(_config);

	var _api = __webpack_require__(7);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var $ = __webpack_require__(5);
	//myalertp 封装的 alert提示弹层
	//myalertp('pickCity','出发地点不能和到达地点相同!')
	var _view = __webpack_require__(15);
	var TTitype = '';
	var Ftime = '';
	var joindata = ''; // 存放 带过来的数据


	var _class = function () {
	    function _class(opt) {
	        _classCallCheck(this, _class);

	        this.path = '/flightmb/adate$';
	        this.hash = '/flightmb/adate';
	        this.title = '时间选择';

	        opt = opt || {};
	        this.path = opt.path || this.path;
	        this.hash = opt.hash || this.hash;
	        this.title = opt.title || this.title;
	    }

	    // 输出视图


	    _createClass(_class, [{
	        key: 'view',
	        value: function view(cb) {
	            if (!_view) {
	                // 静态资源浏览器有缓存,增加时标,强制刷新!
	                (0, _api.getView)(_config2.default.view.lotteryOpen + '?t=' + +new Date(), '', function (rs) {
	                    _view = rs;
	                    cb(null, _view);
	                });
	            } else {
	                cb(null, _view);
	            }
	        }

	        // 在已经加载的视图上操作

	    }, {
	        key: 'bind',
	        value: function bind(dv, params) {

	            (0, _api.setTitle)('\u65F6\u95F4\u9009\u62E9');
	            console.log(params);
	            TTitype = params.timetype; //  0 或者1   0为去程 1  为返程
	            joindata = params.joindata; // 路由带过来的数据
	            if (TTitype == 1) {
	                Ftime = params.ftim;
	            }
	            var nowDate = new Date();
	            var nDt = new Date();

	            var backDate = nowDate;
	            backDate.setDate(backDate.getDate() + 7);
	            returnDate("date-m1", nDt.Format("yyyy"), nDt.Format("MM"), nDt.Format("dd"), 1);
	            var AdayNext = $.qus('.dayNext');
	            // console.log(AdayNext.length)
	            for (var i = 0; i < AdayNext.length; i++) {
	                var _that = AdayNext[i];
	                eClick(_that, joindata);
	            }
	            eClick($.qu(".dayNow"), joindata);
	            myAjaxGetLowpricepr(getCityCode(joindata.ctyf), getCityCode(joindata.ctyt));

	            // 返回按钮
	            $.id('dateBack').onclick = function () {
	                $.router.go('#!/flightmb/join', {}, false);
	            };
	        }
	    }]);

	    return _class;
	}();

	//根据城市取三字码


	exports.default = _class;
	function getCityCode(city) {
	    var citys = eval("(" + getCityObj() + ")").results;
	    for (var i = 0; i < citys.length; i++) {
	        if (citys[i].info.toUpperCase() == city.toUpperCase()) {
	            return citys[i].id;
	            //alert(citys[i].id);
	        }
	    }
	}

	function toTOP() {
	    var odP = $.id('date-m');
	    if (odP.scrollTop != 0) {
	        odP.scrollTop = 0; // 返回顶部
	    }
	}

	Date.prototype.Format = function (formatStr) {
	    var str = formatStr;
	    var Week = ['日', '一', '二', '三', '四', '五', '六'];

	    str = str.replace(/yyyy|YYYY/, this.getFullYear());
	    str = str.replace(/yy|YY/, this.getYear() % 100 > 9 ? (this.getYear() % 100).toString() : '0' + this.getYear() % 100);

	    str = str.replace(/MM/, this.getMonth() >= 9 ? (this.getMonth() + 1).toString() : '0' + (this.getMonth() + 1));
	    str = str.replace(/M/g, this.getMonth() + 1);

	    str = str.replace(/w|W/g, Week[this.getDay()]);

	    str = str.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : '0' + this.getDate());
	    str = str.replace(/d|D/g, this.getDate());

	    str = str.replace(/hh|HH/, this.getHours() > 9 ? this.getHours().toString() : '0' + this.getHours());
	    str = str.replace(/h|H/g, this.getHours());
	    str = str.replace(/mm/, this.getMinutes() > 9 ? this.getMinutes().toString() : '0' + this.getMinutes());
	    str = str.replace(/m/g, this.getMinutes());

	    str = str.replace(/ss|SS/, this.getSeconds() > 9 ? this.getSeconds().toString() : '0' + this.getSeconds());
	    str = str.replace(/s|S/g, this.getSeconds());

	    return str;
	};

	function eClick(obj, joindata) {
	    obj.onclick = function () {
	        // var selectDate = this.find("font").eq(0).html();
	        var selectDate = $.firstChild(this).innerHTML;
	        //console.log(selectDate)
	        if (selectDate === "今天") {
	            selectDate = new Date().getDate();
	        }
	        var dateCls = $.lastChild(this).innerHTML;
	        var hID = this.parentNode.parentNode.parentNode.id;
	        var dateString = $.nextNode($.firstChild($.firstChild($.id(hID)))).innerHTML;
	        //console.log(dateString)
	        var _date = new Date(dateString.replace(/-/g, "/"));
	        if (dateCls == undefined) {
	            dateCls = getWeek(_date.getDay());
	        }
	        if (selectDate != "") {
	            // $("#emTime").html(dateString);
	            // $("#headerID").hide();
	            // $("#calendarCover").remove();
	            // $("#emTime").next().html("&nbsp" + dateCls);
	            // $("body").scrollTop(0);
	            var Ttime = dateString + '-' + selectDate;
	            if (TTitype == 1) {
	                // 返程时间 选择
	                var t2 = adaeeChange(Ttime);
	                var t1 = adaeeChange(joindata.timef);
	                var myt1 = t1.replace(/\-/g, "");
	                var myt2 = t2.replace(/\-/g, "");
	                //console.log(myt1)
	                //console.log(myt2)
	                if (myt1 > myt2) {
	                    // alert('回程日期应该大于去程日期')
	                    (0, _api.myalertp)('date', '回程日期应该大于去程日期');
	                } else {
	                    //  点击 带时间 返回
	                    joindata.timet = Ttime;
	                    $.router.go('#!/flightmb/join', { timetype: TTitype, joindata: joindata }, true);
	                    toTOP();
	                }
	            } else {
	                //去程时间 选择
	                joindata.timef = Ttime;
	                $.router.go('#!/flightmb/join', { timetype: TTitype, joindata: joindata }, true);
	                toTOP();
	            }
	        }
	    };
	}
	function adaeeChange(date) {

	    //对date进行重新组装成yyyy-MM-dd的格式
	    //2014 - 8 - 7
	    try {
	        var tempDate1Arr = date.split("-");
	        date = tempDate1Arr[0] + "";
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
	    } catch (e) {}

	    return date;
	}

	//获取星期几
	function getWeek(num) {
	    switch (num) {
	        case 0:
	            return "周日";
	        case 1:
	            return "周一";
	        case 2:
	            return "周二";
	        case 3:
	            return "周三";
	        case 4:
	            return "周四";
	        case 5:
	            return "周五";
	        case 6:
	            return "周六";
	    }
	}

	//得到五个日历表的方法
	function returnDate(id, nYear, nMonth, nDay, num) {
	    var selectDate = "";
	    // if (num == 1) {
	    //     selectDate = $("#emTime").text();
	    // } else {
	    //     selectDate = $("#backTime").text();
	    // }
	    var year = nYear,
	        month = nMonth;

	    var size = 7;
	    // var calendarBox = "<div id='calendarBox'></div>"
	    // $("#calendarCover").append(calendarBox);
	    var html = '';
	    for (var i = 0; i < size; i++) {
	        html += calendar("calendar" + i, year, month, selectDate, false);
	        //$("#" + id).append(html);
	        month++;
	        if (month == 13) {
	            month = 1;
	            year++;
	        }
	    }
	    $.html($.id(id), html);
	    // $("#headerID").show();
	    // $("#headerID").find("h1").html("选择日期");
	}

	function calendar(id, yy, mm, selectDate, showBtn) {
	    //日历控件id:日历控件组id,yymm,开始的年份/月份,showBtn是否显示前一个月后一个月按钮
	    var year = parseInt(yy) < 1900 ? 1900 : parseInt(yy);
	    year = year > 2030 ? 2030 : year;
	    var month = parseInt(mm, 10) < 1 ? 1 : parseInt(mm, 10);
	    month = month > 12 ? 12 : month;
	    var calendarHTML = "<div class='calendar' id=" + id + " date=" + selectDate + ">" + "<div class='calendar_t'>";
	    if (showBtn) {
	        //显示按钮
	        calendarHTML += "<div class='calendar_t_prev' onclick='changeCalendar(this,-1);'><</div>" + "<div class='calendar_t_day'>" + year + "-" + month + "</div>" + "<div class='calendar_t_next'onclick='changeCalendar(this,1);'>></div>";
	    } else {
	        //无按钮
	        calendarHTML += "<div class='calendar_t_prev'></div>" + "<div class='calendar_t_day'>" + year + "-" + month + "</div>" + "<div class='calendar_t_next'></div>";
	    }
	    calendarHTML += "<div class='clear'></div>" + "</div>" + "<div class='calendar_c'>" + "<div class='calendar_c_week'>" + "<div class='calendar_c_week_day'>日</div>" + "<div class='calendar_c_week_day'>一</div>" + "<div class='calendar_c_week_day'>二</div>" + "<div class='calendar_c_week_day'>三</div>" + "<div class='calendar_c_week_day'>四</div>" + "<div class='calendar_c_week_day'>五</div>" + "<div class='calendar_c_week_day'>六</div>" + "<div class='clear'></div>" + "</div>" + "<div class='calendar_c_box'>";
	    calendarHTML += loadCalendar(year, month, selectDate);
	    calendarHTML += "</div>" + "</div>" + "</div>";
	    return calendarHTML;
	}

	function loadCalendar(year, month, selectDate) {
	    var rc = "";
	    var dateObj = new Date();
	    var nowYear = dateObj.getFullYear(); //年
	    var nowMonth = dateObj.getMonth() + 1; //月
	    var nowDate = dateObj.getDate(); //日
	    var nowDay = dateObj.getDay(); //周几
	    var months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	    year = year < 1900 ? 1900 : year;
	    year = year > 2030 ? 2030 : year;
	    month = month < 1 ? 1 : month;
	    month = month > 12 ? 12 : month;
	    months[1] = year % 4 == 0 ? 29 : 28; //闰年判断
	    dateObj.setFullYear(year, month - 1, 1);
	    var day1 = dateObj.getDay();
	    for (var i = 0; i < day1; i++) {
	        rc += "<div class='day dayEmpty dayWhite'><font class='thettn'></font><font class='thett thettn1'></font></div>";
	    }
	    var tomorrow = 0;
	    var afterTomorrow = 0;
	    var minPrice = "¥" + 750;
	    minPrice = "";
	    for (var i = 1; i <= months[month - 1]; i++) {
	        var dateString = year + "-" + month + "-" + i; //当前日历日期
	        {
	            //变成标准的日期格式如：2016-09-09
	            var tempDate1Arr = dateString.split("-");
	            dateString = tempDate1Arr[0] + "";
	            if (tempDate1Arr[1].length == 1) {
	                dateString += "-0" + tempDate1Arr[1];
	            } else {
	                dateString += "-" + tempDate1Arr[1];
	            }
	            if (tempDate1Arr[2].length == 1) {
	                dateString += "-0" + tempDate1Arr[2];
	            } else {
	                dateString += "-" + tempDate1Arr[2];
	            }
	        }

	        if (dateString == selectDate) {
	            if (year == nowYear && month == nowMonth && i == nowDate) {
	                tomorrow = i + 1;
	                rc += "<div class='day daySelect';' data=" + dateString + "><font class='thett'>今天</font><font class='thett1'>" + minPrice + "</font></div>";
	            } else {
	                if (i == tomorrow) {
	                    tomorrow = 0;
	                    afterTomorrow = i + 1;
	                    rc += "<div class='day daySelect';' data=" + dateString + "><font class='thett'>" + i + "</font><font class='thett1'>" + minPrice + "</font><font style='display: none;'>明天</font></div>";
	                } else {
	                    if (afterTomorrow == i) {
	                        afterTomorrow = 0;
	                        rc += "<div class='day daySelect';' data=" + dateString + "><font class='thett'>" + i + "</font> <fontclass='thett1'>" + minPrice + "</font><font style='display: none;'>后天</font></div>";
	                    } else {
	                        rc += "<div class='day daySelect';' data=" + dateString + "><font class='thett'>" + i + "</font> <font class='thett1'>" + minPrice + "</font></div>";
	                    }
	                }
	            }
	        } else {
	            if (year < nowYear) {
	                rc += "<div class='day dayPrev dayGrey' data=" + dateString + "><font class='thettn'>" + i + "</font><font class='thettn1'></font></div>";
	            } else if (year == nowYear) {
	                if (month < nowMonth) {
	                    rc += "<div class='day dayPrev dayGrey' data=" + dateString + "><font class='thettn'>" + i + "</font><font class='thettn1'></font></div>";
	                } else if (month == nowMonth) {
	                    if (i < nowDate) {
	                        rc += "<div class='day dayPrev dayGrey' data=" + dateString + "><font class='thettn'>" + i + "</font><font class='thettn1'></font></div>";
	                    } else if (i == nowDate) {
	                        tomorrow = i + 1;
	                        rc += "<div class='day dayNow';' data=" + dateString + "><font class='thett'>今天</font> <font class='thett1' >" + minPrice + "</font><font style='display: none;'>今天</font></div>";
	                    } else {
	                        if (i == tomorrow) {
	                            tomorrow = 0;
	                            afterTomorrow = i + 1;
	                            rc += "<div class='day dayNext';' data=" + dateString + "><font class='thett'>" + i + "</font> <font class='thett1' >" + minPrice + "</font><font style='display: none;'>明天</font></div>";
	                        } else {
	                            if (afterTomorrow == i) {
	                                afterTomorrow == 0;
	                                rc += "<div class='day dayNext';' data=" + dateString + "><font class='thett'>" + i + "</font> <font class='thett1' >" + minPrice + "</font><font style='display: none;'>后天</font></div>";
	                            } else {
	                                rc += "<div class='day dayNext';' data=" + dateString + "><font class='thett'>" + i + "</font> <font class='thett1'>" + minPrice + "</font></div>";
	                            }
	                        }
	                    }
	                } else {
	                    rc += "<div class='day dayNext';' data=" + dateString + "><font class='thett'>" + i + "</font> <font class='thett1' >" + minPrice + "</font></div>";
	                }
	            } else {
	                rc += "<div class='day dayNext';' data=" + dateString + "><font class='thett'>" + i + "</font> <font class='thett1'>" + minPrice + "</font></div>";
	            }
	        }
	    }
	    rc += "<div class='clear'></div>";
	    return rc;
	}
	// 显示按钮的时候调用
	function changeCalendar(element, meth) {
	    var calendarBox = $(element).parents(".calendar");
	    var date = calendarBox.find(".calendar_t_day").html();
	    var dateArray = date.split("-");
	    var year = parseInt(dateArray[0]);
	    var month = parseInt(dateArray[1]);
	    var selectDate = calendarBox.attr("date");
	    if (meth == -1) {
	        month--;
	        if (month == 0) {
	            month = 12;
	            year--;
	        }
	    } else if (meth == 1) {
	        month++;
	        if (month == 13) {
	            month = 1;
	            year++;
	        }
	    }
	    var calendarHTML = loadCalendar(year, month, selectDate);
	    calendarBox.find(".calendar_t_day").html(year + "-" + month);
	    calendarBox.find(".calendar_c_box").html(calendarHTML);
	}

	// 获取最低价
	function myAjaxGetLowpricepr(city1, city2) {
	    var oData2 = '';

	    var xhr = '';
	    if (window.XMLHttpRequest) {
	        xhr = new XMLHttpRequest();
	    } else {
	        xhr = new ActiveXObject(' Microsoft . XMLHTTP');
	    }
	    //xhr.open('get','http://121.52.212.39:83/CabinCountSearch/api/LowPriceController/Search.do?from='+city1+'&to='+city2+'&date='+date+'&day='+days,'false');
	    //xhr.open('get',flightUrlprice+'/CabinCountSearch/api/LowPriceController/Search.do?from='+city1+'&to='+city2+'&date='+date+'&day='+days,'true');//  异步加载 最低价
	    xhr.open('get', '/icbc/ajax.aspx?from=' + city1 + '&to=' + city2 + '&act=GetLowPrice', 'true'); //  异步加载 最低价
	    xhr.send();
	    xhr.onreadystatechange = function () {
	        if (xhr.readyState == 4) {
	            // ajax 响内容解析完成，可以在客户端调用了
	            //$.qu('.lodin-p').style.display = 'none';
	            if (xhr.status == 200) {
	                //  判断服务器返回的状态 200 表示 正常

	                oData2 = JSON.parse(xhr.responseText);
	                //console.log(oData2)
	                var pricearr = [];
	                for (var p in oData2) {
	                    // var dateDiv = p.replace(jsonData.from + "_" + jsonData.to + "_", "");
	                    //console.log(dateDiv) // 时间
	                    pricearr.push(oData2[p]); //价格

	                }
	                // console.log(pricearr)
	                var htmlp = $.qus('.thett1');
	                for (var i = 0; i < pricearr.length; i++) {
	                    if (pricearr[i] && pricearr[i] != 0) {
	                        htmlp[i].innerHTML = '￥' + pricearr[i];
	                    } else {
	                        htmlp[i].innerHTML = '￥--';
	                    }
	                }
	                for (var k = 0; k < htmlp.length; k++) {
	                    var noprice = htmlp[k];
	                    if (noprice.innerHTML == '') {
	                        noprice.style.display = 'none'; //
	                        var prenoode = $.firstChild(noprice.parentNode);
	                        prenoode.style.height = '40px';
	                        prenoode.style.lineHeight = '40px';
	                    }
	                }
	            } else {
	                //alert('出错了，价格查询异常！'); 超时也不管 试试
	                // myalertp('detail','出错了，价格查询异常！')
	            }
	        }
	    };
	}

/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = "<div id=\"date\">\r\n\t   <div id=\"date-t\">\r\n\t   \t  <a  id='dateBack' href=\"javascript:;\">关闭</a>\r\n\t   </div>\r\n\t   <div id=\"date-m\">\r\n\t   \t    <div id=\"date-m1\"></div>\r\n\t   </div>\r\n</div>\r\n"

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	/**
	 * Created by way on 16/9/28.
	 */


	var _config = __webpack_require__(1);

	var _config2 = _interopRequireDefault(_config);

	var _api = __webpack_require__(7);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var $ = __webpack_require__(5);
	// myalertp 封装的 alert提示弹层
	//myalertp('detail','出错了，获取客服联系电话失败！')

	var _view = __webpack_require__(17);
	var TTitype = '';
	// 虚拟数据
	var urlFrom = '';
	var urlTo = '';
	var urlTime = '';
	var urlTime1 = ''; //返程日期
	var date2 = ''; //返程日期
	var searchtype = ''; //判断往返
	var searchtypeg = {}; // 4.1 龚老师新加参数
	var backdata = {}; // 存放返程数据 地点以及切换
	var backtype = ''; // 判断显示 返
	var zhefromData = ''; // 存放第一查询的准备提交的数据
	var Member = ''; // 接受 产品页面 传递过来的 用户信息 name id
	var ftime1 = ''; // 返程是时候 存放 去程时间
	var pcnumdata = ''; //存放 去程航班编码 MU5181_N

	var _class = function () {
	    function _class(opt) {
	        _classCallCheck(this, _class);

	        this.path = '/flightmb/detail$';
	        this.hash = '/flightmb/detail';
	        this.title = '机票详情';

	        opt = opt || {};
	        this.path = opt.path || this.path;
	        this.hash = opt.hash || this.hash;
	        this.title = opt.title || this.title;
	    }

	    // 输出视图


	    _createClass(_class, [{
	        key: 'view',
	        value: function view(cb) {
	            if (!_view) {
	                // 静态资源浏览器有缓存,增加时标,强制刷新!
	                (0, _api.getView)(_config2.default.view.lotteryOpen + '?t=' + +new Date(), '', function (rs) {
	                    _view = rs;
	                    cb(null, _view);
	                });
	            } else {
	                cb(null, _view);
	            }
	        }

	        // 在已经加载的视图上操作

	    }, {
	        key: 'bind',
	        value: function bind(dv, params) {
	            console.log(params);

	            if (params.cliktype == 1) {
	                // console.log(params)
	                urlFrom = params.citydetail1;
	                urlTo = params.citydetail2;
	                urlTime = params.timedetail1;
	                urlTime1 = params.timedetail2;
	                backtype = '';
	                tobeforetable(); // 刷新 时间 价格 状态函数

	                // 清空 价格
	                $.id('detail-nowdata3').innerHTML = '';
	                $.id('detail-odldata').innerHTML = '';
	                $.id('detail-nexdata1').innerHTML = '';
	            } else if (params.cliktype == 2) {
	                // 日历插件 返回的
	                urlTime = params.stime;
	                urlTime1 = params.bt;
	                $.qu('.detail-tms1d2').style.display = 'block';
	                $.qu('.detail-tms1d1').style.lineHeight = '1.9rem';
	                $.qu('.detail-tms1d1').style.color = '#fff';
	                $.id('detail-tmbn1').style.color = '#fff';
	                //alert(urlTime1)

	            } else if (params.cliktype == 4) {
	                // 产品 返回详情页面 带数据返回
	                //去程 数据需要提交的数据
	                //console.log(params.searchbdata)
	                urlFrom = params.searchbdata.bcity1;
	                urlTo = params.searchbdata.bcity2;
	                urlTime = params.searchbdata.btime; // 返程时间
	                urlTime1 = '';
	                backtype = params.searchbdata.backtype;
	                zhefromData = params.ptbdata1; // 去程数据 打包
	                ftime1 = params.ptbdata1.data1; // 去程时间
	                pcnumdata = params.ptbdata1.pcnum + '_' + params.ptbdata1.theCa; // 去程时间
	                Member: params.Member;
	            } else if (params.cliktype == 3) {
	                // 直接返回 不带数据
	                urlTime = params.ptdata;
	            }

	            var reg = /[A-Za-z]{3}/;
	            var from = urlFrom;
	            var to = urlTo;
	            var date = urlTime;

	            date2 = urlTime1;
	            date = detailChange(date);
	            date2 = detailChange(date2);
	            //console.log(date2)

	            // from = from == null ? "北京" : from; //重庆CKG
	            // to = to == null ? "广州" : to; //广州
	            // date = date == null ? "2014-07-25" : date;

	            var id = 1; //默认为单程
	            if (date2 != '') {
	                // 有数据
	                id = 2;
	                $.qu('.detail-t2').style.display = 'block';
	                $.qu('.detail-t2').innerHTML = '去:';
	            } else {
	                //没有数据
	                id = 1;
	                $.qu('.detail-t2').style.display = 'none';
	                if (backtype == 2) {
	                    $.qu('.detail-t2').style.display = 'block';
	                    $.qu('.detail-t2').innerHTML = '返:';
	                }
	            }

	            // 标题  北京—— 上海
	            $.id('detailcity0').innerHTML = from;
	            $.id("detailcity1").innerHTML = to;
	            //头部加载数据
	            changeDateOfTop(date);
	            if (id == 1) {
	                //单程
	                searchtype = 1; //params.cliktype

	                //var searchTypenew =1; // 单程  或者 往返返程进入

	                if (params.cliktype == 4) {

	                    searchtypeg = {
	                        "backDate": date, // 返程日期
	                        "goFlight": pcnumdata,
	                        "goDate": detailChange(ftime1), // 去程日期 ftime1
	                        "searchType": 3,
	                        "adultCount": 1,
	                        "childCount": 1
	                    };
	                } else {

	                    searchtypeg = {
	                        "backDate": "",
	                        "goFlight": "",
	                        "goDate": date,
	                        "searchType": 1,
	                        "adultCount": 1,
	                        "childCount": 1
	                    };
	                }

	                backdata = {
	                    backtype: 1 // 判断是否要返回 继续预订机票
	                };
	            } else {
	                //往返  去程进入
	                searchtype = 2;

	                searchtypeg = {
	                    "backDate": date2,
	                    "goFlight": "",
	                    "goDate": date,
	                    "searchType": 2,
	                    "adultCount": 1,
	                    "childCount": 1
	                };

	                backdata = { // 返程数据包
	                    btime: date2,
	                    bcity1: to,
	                    bcity2: from,
	                    backtype: 2, // 控制是否 要往返
	                    searcht: 2,
	                    ftime: date

	                };
	            }
	            //  日历弹出
	            $.id('detail-tmmai').onclick = function () {
	                var cityf = $.id('detailcity0').innerHTML;
	                var cityt = $.id('detailcity1').innerHTML;
	                $.router.go('#!/flightmb/picktime', { backtime: urlTime1, searchtype: searchtype, cityf: cityf, cityt: cityt }, true);
	            };

	            myAjaxGetLowprice(getCityCode(from), getCityCode(to), date, searchtypeg); //加载航班

	            getLowPrict(date); //获取最低价

	            initialAction(); //绑定部分点击事件
	            //downpull(from,to,date,searchtype); // 下拉刷新 有问题   待优化


	            // 返回点击
	            $.qu('.detail-t1').onclick = function () {
	                $.router.go('#!/flightmb/join', '', false);
	            };
	            // 头部 主页返回
	            $.qu('.d_home').onclick = function () {
	                $.router.go('#!/flightmb/join', '', false);
	            };
	        }
	    }]);

	    return _class;
	}();

	//  筛查出 经停 共享航班显示问题


	exports.default = _class;
	function showyesNo() {
	    var jtcl = $.qus('.jtstop');
	    for (var i = 0; i < jtcl.length; i++) {
	        var jtdata = jtcl[i].getAttribute('jtdata');
	        if (jtdata == 0) {
	            jtcl[i].style.display = 'none';
	        }
	    }
	    var gxflight = $.qus('.shareno');
	    for (var i = 0; i < gxflight.length; i++) {
	        if (gxflight[i].innerHTML == '-') {
	            gxflight[i].parentNode.style.display = 'none';
	        }
	    }
	}

	// 下拉刷新 测试
	function downpull(from, to, date, searchtype) {

	    var scroll = $.id('detail-m1');
	    var outerScroller = $.id('detail-m');
	    var touchStart = 0;
	    var touchDis = 0;
	    outerScroller.addEventListener('touchstart', function (event) {
	        var touch = event.targetTouches[0];
	        // 把元素放在手指所在的位置
	        touchStart = touch.pageY;
	        //console.log(touchStart);
	    }, false);
	    outerScroller.addEventListener('touchmove', function (event) {
	        var touch = event.targetTouches[0];
	        //console.log(touch.pageY + 'px');
	        scroll.style.top = scroll.offsetTop + touch.pageY - touchStart + 'px';
	        //console.log(scroll.style.top);
	        touchStart = touch.pageY;
	        touchDis = touch.pageY - touchStart;
	    }, false);
	    outerScroller.addEventListener('touchend', function (event) {
	        touchStart = 0;
	        var top = scroll.offsetTop;
	        //console.log(top);
	        if (top > 120) {
	            scroll.innerHTML = '';
	            myAjaxGetLowprice(getCityCode(from), getCityCode(to), date, searchtypeg); //加载航班

	            getLowPrict(date); //获取最低价
	            tobeforetable(); // 刷新 时间 价格 状态函数
	        }
	        //  自动 减少上部空白
	        if (top > 0) {
	            var time = setInterval(function () {
	                scroll.style.top = scroll.offsetTop - 6 + 'px';
	                if (scroll.offsetTop <= 0) {
	                    clearInterval(time);
	                    scroll.style.top = 0;
	                }
	            }, 1);
	        }
	        if (top < -20) {
	            // 限制 上拉上限
	            var time1 = setInterval(function () {
	                scroll.style.top = scroll.offsetTop + 6 + 'px';
	                if (scroll.offsetTop >= 0) {
	                    clearInterval(time1);
	                    scroll.style.top = 0;
	                }
	            }, 1);
	        }
	    }, false);
	}
	//获取航班
	function myAjaxGetLowprice(fromcity, tocity, date, searchtypeg) {

	    $.qu('.lodin').style.display = '-webkit-box';
	    //getLowPrict(date); //获取最低价

	    var param = {
	        "act": "SearchFlightICBCJson",
	        "org_city": fromcity,
	        "dst_city": tocity,
	        "org_date": date, //date.substring(0, 10),
	        "xsltPath": "HTML5",
	        "search_type": searchtypeg.searchType //searchtype
	    };
	    var otherParamjson = JSON.stringify(searchtypeg);
	    //console.log(param)

	    var oData2 = '';
	    var xhr = '';
	    if (window.XMLHttpRequest) {
	        xhr = new XMLHttpRequest();
	    } else {
	        xhr = new ActiveXObject(' Microsoft . XMLHTTP');
	    }
	    //xhr.open('get','http://106.75.131.58:8015/icbc/ajax.aspx?isKyReq=1&jsoncallback=jQuery183011878398158009507_1481529281930&act='+param.act+'&org_city='+param.org_city+'&dst_city='+param.dst_city+'&org_date='+param.org_date+'&xsltPath=HTML5&search_type='+param.search_type+'&firstShowType=1&_=1481529832360','false');
	    xhr.open('get', flightUrl + '/icbc/ajax.aspx?isKyReq=1&jsoncallback=jQuery183011878398158009507_1481529281930&act=' + param.act + '&org_city=' + param.org_city + '&dst_city=' + param.dst_city + '&org_date=' + param.org_date + '&xsltPath=HTML5&search_type=' + param.search_type + '&otherParam=' + otherParamjson + '&firstShowType=1&_=1481529832360', 'false');

	    //console.log('isKyReq=1&jsoncallback=jQuery183011878398158009507_1481529281930&act='+param.act+'&org_city='+param.org_city+'&dst_city='+param.dst_city+'&org_date='+param.org_date+'&xsltPath=HTML5&search_type='+param.search_type+'&otherParam='+otherParamjson+'&firstShowType=1&_=1481529832360')

	    xhr.send();
	    xhr.onreadystatechange = function () {
	        if (xhr.readyState == 4) {
	            // ajax 响内容解析完成，可以在客户端调用了
	            if (xhr.status == 200) {
	                $.qu('.lodin').style.display = 'none';
	                //console.log(xhr.responseText)
	                //  判断服务器返回的状态 200 表示 正常
	                if (xhr.responseText != '') {
	                    oData2 = JSON.parse(xhr.responseText);
	                    var alldatas = oData2.Flights;
	                    //console.log(alldatas)


	                    var ty = 1;
	                    var n = 1;
	                    //console.log(alldatas[0]) ty 时间/ 价格   n 高低
	                    $.id('detail-m1').innerHTML = pullData(ty, n, alldatas);
	                    showyesNo(); // 经停 共享显示


	                    var theCp = removedata(getAllcp(alldatas));
	                    toproduct();
	                    // removedata(fCity(alldata))
	                    // removedata(toCity(alldata))
	                    pullCp(theCp); // 加载公司
	                    fCitydata(removedata(fCity(alldatas)), removedata(toCity(alldatas))); //加载起落机场
	                    picBox(); // 开启筛选功能

	                    thePrice(ty, n, alldatas); // 价格高低筛选
	                    theTime(ty, n, alldatas); // 时间筛选


	                    $.id('detail-fl1').onclick = function () {
	                        $.qu('.detail-fl1pick').style.top = '-7.6rem';
	                    };
	                    $.id('fl1pick-h1s1').onclick = function () {
	                        $.qu('.detail-fl1pick').style.top = '2.6rem';
	                    };
	                    $.id('fl1pick-h1s3').onclick = function () {
	                        $.id('detail-m1').innerHTML = ''; //清空所有页面内容 再加载
	                        $.qu('.detail-fl1pick').style.top = '2.6rem';

	                        //找出所有被选中的 元素
	                        var allSles = $.qus('.check_it');

	                        var sttime = [];
	                        var stcp = [];
	                        var sttype = [];
	                        var stairport = [];
	                        for (var i = 0; i < allSles.length; i++) {
	                            if ($.hasClass(allSles[i].parentNode.parentNode, 'pickbox-time')) {
	                                sttime.push($.firstChild(allSles[i].parentNode).innerHTML);
	                            }
	                            if ($.hasClass(allSles[i].parentNode.parentNode, 'pickbox-cp')) {
	                                stcp.push($.firstChild(allSles[i].parentNode).innerHTML);
	                            }
	                            if ($.hasClass(allSles[i].parentNode.parentNode, 'pickbox-type')) {
	                                sttype.push($.firstChild(allSles[i].parentNode).innerHTML);
	                            }
	                            if ($.hasClass(allSles[i].parentNode.parentNode, 'pickbox-airport')) {
	                                stairport.push($.firstChild(allSles[i].parentNode).innerHTML);
	                            }
	                        }
	                        var thedata = youData(sttime, stcp, sttype, stairport, alldatas);
	                        $.id('detail-m1').innerHTML = pullData(ty, n, thedata);
	                        showyesNo(); // 经停 共享显示
	                        thePrice(ty, n, thedata);
	                        theTime(ty, n, thedata);
	                        toproduct();
	                    };
	                } else {
	                    //alert('航班查询超时！')
	                    (0, _api.myalertp)('detail', '航班查询超时,请继续查询', function () {
	                        myAjaxGetLowprice(fromcity, tocity, date, searchtypeg);
	                    });
	                    //myAjaxGetLowprice(fromcity,tocity,date,searchtypeg)
	                }
	            } else {
	                //alert('出错了，航班查询超时，Err' +xhr.status);
	                (0, _api.myalertp)('detail', '出错了，航班查询超时，Err' + xhr.status);
	            }
	        }
	    };
	}

	function toproduct() {
	    // 进入 产品页面

	    var bottns = $.qus('.dedata-wrap');
	    for (var i = 0; i < bottns.length; i++) {
	        bottns[i].onclick = function () {
	            var theWen = $.id('detail-nowdata2').innerHTML;
	            var flight1data = JSON.parse(this.getAttribute('data1')); // 带 展示航班 返回 产品页面
	            var dataArr = {
	                prWen: theWen,
	                prDate: this.getAttribute('flightdate'),
	                arrtime: this.getAttribute('arrtime'),
	                FlyTime: this.getAttribute('FlyTime'),
	                fromairport: this.getAttribute('fromairport') + this.getAttribute('Terminal'), //Terminal
	                //进出站　互换    3.29测试 进出航站楼写返
	                toairport: this.getAttribute('toairport') + this.getAttribute('arrhall'), //arrhall
	                carrierabb: this.getAttribute('carrierabb'),
	                carrierabb1: this.getAttribute('carrierabb1'),
	                carrierabb2: this.getAttribute('carrierabb2'),
	                model: this.getAttribute('model'),
	                //RouteFrom:this.getAttribute('RouteFrom'),
	                RouteFrom: $.id('detailcity0').innerHTML, // 用 城市编码 获取城市名称可能会出错
	                RouteTo: $.id('detailcity1').innerHTML,
	                pulId: this.id,
	                theCarrier: this.getAttribute('Carrier'),
	                ZYtype: this.getAttribute('ZYtype'),
	                Discount: this.getAttribute('Discount'),
	                YPrice: this.getAttribute('YPrice'),
	                RouteFromCode: this.getAttribute('RouteFromCode'),
	                RouteToCode: this.getAttribute('RouteToCode'),
	                Lmodel: this.getAttribute('model') + this.getAttribute('Modelchar'),
	                Cabin: this.getAttribute('Cabin'),
	                Terminal: this.getAttribute('Terminal'),
	                JtStop: this.getAttribute('JtStop'),
	                flight1data: flight1data
	            };
	            //alert(this.getAttribute('Cabin'))


	            if (backtype == '') {
	                // 单程
	                $.router.go('#!/flightmb/product', { prData: dataArr, prot: 1, bdata: backdata }, true);
	            } else {
	                // 带着去程数据 进去产品页面
	                var fromcp = zhefromData.theCarrier1; // 去程 公司航司号
	                var tocp = dataArr.theCarrier; // 返程 去程 公司航司号
	                var preDate = zhefromData.thelowf.data1 + zhefromData.thelowf.ttime;
	                var nowDate = dataArr.prDate + dataArr.FlyTime;
	                if (removeMh(preDate) - removeMh(nowDate) > 0) {
	                    (0, _api.myalertp)("detail", "返程航班时间不能早于去程航班时间!请重新选择。");
	                    return false;
	                };
	                if (zhefromData.thelowf.data1 + zhefromData.thelowf.ttime) var fromedzytype = zhefromData.zytypep; //  获取去程 是否是直营
	                if (fromedzytype == 1) {
	                    // 去程 为直营 1
	                    if (tocp == fromcp) {
	                        // 航空公司号相同
	                        $.router.go('#!/flightmb/product', { prData: dataArr, prot: 3, bdata: zhefromData }, true);
	                    } else {
	                        switch (fromcp) {// 还原航空公司号
	                            case "ZH":
	                                fromcp = '深圳航空';break;
	                            case "CZ":
	                                fromcp = '南方航空';break;
	                            case "3U":
	                                fromcp = '四川航空';break;

	                        }
	                        //alert('请选择与去程同一航司直营航班，航司直营无法与其他航班混合下单。去程航司号为:'+fromcp)
	                        (0, _api.myalertp)('detail', '请选择与去程同一航司直营航班，航司直营无法与其他航班混合下单。去程航司号为:' + fromcp);
	                    }
	                } else {
	                    // 去程不是直营 就直接 到产品页面，再判断直营问题
	                    $.router.go('#!/flightmb/product', { prData: dataArr, prot: 3, bdata: zhefromData }, true);
	                }
	            }
	        };
	    }
	}

	// 绑定所有点击事件
	function initialAction() {
	    // 下一天
	    $.id('detail-tms2').onclick = function () {
	        var date = this.getAttribute('date');
	        var from = $.id('detailcity0').innerHTML;
	        var to = $.id('detailcity1').innerHTML;
	        $.qu('.detail-f-ulsp3').innerHTML = '价格';
	        $.qu('.detail-f-ulsp2').innerHTML = '从早到晚';

	        if (checkDateIsOK(date)) {
	            changeDateOfTop(date);

	            //search(searchtype, null);
	        }

	        myAjaxGetLowprice(getCityCode(from), getCityCode(to), date, searchtypeg); //加载航班
	        getLowPrict(date); //获取最低价

	    };
	    // 上一天
	    $.id('detail-tms1').onclick = function () {
	        var date = this.getAttribute('date');
	        var from = $.id('detailcity0').innerHTML;
	        var to = $.id('detailcity1').innerHTML;
	        $.qu('.detail-f-ulsp3').innerHTML = '价格';
	        $.qu('.detail-f-ulsp2').innerHTML = '从早到晚';
	        if (checkDateIsOK(date)) {
	            changeDateOfTop(date);
	            myAjaxGetLowprice(getCityCode(from), getCityCode(to), date, searchtypeg); //加载航班

	            getLowPrict(date); //获取最低价

	            //search(searchtype, null);
	        }
	    };
	}

	// 价格筛选函数
	function thePrice(ty, n, alldatas) {
	    var onOffprice = true;

	    $.id('detail-fl3').onclick = function () {
	        $.qu('.detail-f-ulo2').style.background = '#E4DCDC';
	        $.qu('.detail-f-ulo3').style.background = '#FCA40B';
	        $.qu('.detail-f-ulsp2').innerHTML = '时间';
	        if (onOffprice) {
	            n = 1;
	            ty = 2;
	            $.qu('.detail-f-ulsp3').innerHTML = '从低到高';
	            onOffprice = false;
	        } else {
	            n = 2;
	            ty = 2;
	            $.qu('.detail-f-ulsp3').innerHTML = '从高到低';
	            onOffprice = true;
	        }
	        $.id('detail-m1').innerHTML = pullData(ty, n, alldatas);
	        showyesNo(); // 经停 共享显示
	        toproduct();
	    };
	}
	// 时间筛选函数
	function theTime(ty, n, alldatas) {
	    var onOfftime = true;

	    $.id('detail-fl2').onclick = function () {
	        $.qu('.detail-f-ulo2').style.background = '#FCA40B';
	        $.qu('.detail-f-ulo3').style.background = '#E4DCDC';
	        $.qu('.detail-f-ulsp3').innerHTML = '价格';
	        if (onOfftime) {
	            n = 2;
	            ty = 1;
	            $.qu('.detail-f-ulsp2').innerHTML = '从晚到早';
	            onOfftime = false;
	        } else {
	            n = 1;
	            ty = 1;
	            $.qu('.detail-f-ulsp2').innerHTML = '从早到晚';
	            onOfftime = true;
	        }
	        $.id('detail-m1').innerHTML = pullData(ty, n, alldatas);
	        var strss = $.id('detail-m1').innerHTML;
	        showyesNo(); // 经停 共享显示
	        toproduct();
	    };
	}
	// 刷新 价格 时间 筛选标签
	function tobeforetable() {
	    $.qu('.detail-f-ulo2').style.background = '#E4DCDC';
	    $.qu('.detail-f-ulo3').style.background = '#FCA40B';
	    $.qu('.detail-f-ulsp2').innerHTML = '从早到晚';
	    $.qu('.detail-f-ulo2').style.background = '#FCA40B';
	    $.qu('.detail-f-ulo3').style.background = '#E4DCDC';
	    $.qu('.detail-f-ulsp3').innerHTML = '价格';
	}
	// 航空公司及降落地点动态加载
	// removedata(fCity(alldata))
	// removedata(toCity(alldata))
	function fCitydata(data1, data2) {
	    var st1 = '<li ><span class="cityfrom"><em>北京</em>起飞</span></li>';
	    var st2 = '<li class="pickbox-airport1"><span>不限</span><label class="check_it pickbox-airport11  "><input type="radio" value=" " name="airportFrom"></label></li>';
	    var st3 = '';
	    var st4 = '<li ><span class="cityto"><em>上海</em>降落</span></li>';
	    var st5 = '<li class="pickbox-airport2 "><span>不限</span><label class="check_it pickbox-airport22"><input type="radio" value=" " name="airportTo"></label></li>';
	    var st6 = '';
	    for (var i = 0; i < data1.length; i++) {
	        st3 += '<li class="pickbox-airport1"><span>' + data1[i] + '</span><label ><input type="radio" value=" " name="airportFrom"></label></li>';
	    }
	    for (var i = 0; i < data2.length; i++) {
	        st6 += '<li class="pickbox-airport2" ><span >' + data2[i] + '</span><label ><input type="radio" value=" " name="airportTo"></label></li>';
	    }
	    $.qu('.pickbox-airport').innerHTML = st1 + st2 + st3 + st4 + st5 + st6;
	}

	//根据条件筛选数据
	function youData(sttime, stcp, sttype, stairport, alldatas) {
	    var thelastdata = [];
	    var thelastdata1 = [];
	    var thelastdata2 = [];
	    var thelastdata3 = [];
	    if (sttime[0] != '不限') {
	        thelastdata = [];
	        var sttime1 = [];
	        sttime1.push(sttime[0].split('--', 2)[0]);
	        sttime1.push(sttime[sttime.length - 1].split('--', 2)[1]);
	        var t1 = strKo(sttime1[0]);
	        var t2 = strKo(sttime1[1]);

	        for (var j = 0; j < alldatas.length; j++) {
	            var ff1 = strKo(alldatas[j].FlyTime);

	            if (t1 <= ff1 && ff1 <= t2) {
	                thelastdata.push(alldatas[j]);
	            }
	        }
	        if (thelastdata.length == 0) {
	            return '';
	        }
	    } else {
	        thelastdata = alldatas;
	    }

	    if (stcp[0] != '不限') {
	        for (var i = 0; i < stcp.length; i++) {
	            for (var j = 0; j < alldatas.length; j++) {
	                if (stcp[i] == alldatas[j].CarrierAbb) {
	                    thelastdata1.push(alldatas[j]);
	                }
	            }
	        }
	        if (thelastdata1.length == 0) {
	            return '';
	        }
	    } else {
	        thelastdata1 = alldatas;
	    }

	    if (sttype[0] != '不限') {
	        for (var i = 0; i < sttype.length; i++) {
	            for (var j = 0; j < alldatas.length; j++) {
	                if (sttype[i] == alldatas[j].Model) {
	                    thelastdata2.push(alldatas[j]);
	                }
	            }
	        }
	        if (thelastdata2.length == 0) {
	            return '';
	        }
	    } else {
	        thelastdata2 = alldatas;
	    }
	    if (stairport[0] != '不限' && stairport[1] != '不限') {
	        var p1 = [];
	        var p2 = [];
	        for (var i = 0; i < alldatas.length; i++) {
	            if (stairport[0] == alldatas[i].FromAirport) {
	                p1.push(alldatas[i]);
	            }
	        };
	        for (var i = 0; i < p1.length; i++) {
	            if (stairport[1] == p1[i].ToAirport) {
	                p2.push(p1[i]);
	            }
	        }
	        thelastdata3 = p2;
	    } else if (stairport[0] != '不限' && stairport[1] == '不限') {
	        var p3 = [];
	        for (var i = 0; i < alldatas.length; i++) {
	            if (stairport[0] == alldatas[i].FromAirport) {
	                p3.push(alldatas[i]);
	            }
	        };
	        thelastdata3 = p3;
	    } else if (stairport[0] == '不限' && stairport[1] == '不限') {
	        thelastdata3 = alldatas;
	    } else if (stairport[0] == '不限' && stairport[1] != '不限') {
	        var p4 = [];
	        for (var i = 0; i < alldatas.length; i++) {
	            if (stairport[1] == alldatas[i].ToAirport) {
	                p4.push(alldatas[i]);
	            }
	        };
	        thelastdata3 = p4;
	    }

	    var d1 = [];
	    for (var i = 0; i < thelastdata.length; i++) {
	        for (var j = 0; j < thelastdata1.length; j++) {
	            if (thelastdata[i].CabinFlag == thelastdata1[j].CabinFlag) {
	                d1.push(thelastdata[i]);
	            }
	        }
	    }

	    var d2 = [];
	    for (var i = 0; i < thelastdata2.length; i++) {
	        for (var j = 0; j < thelastdata3.length; j++) {
	            if (thelastdata2[i].CabinFlag == thelastdata3[j].CabinFlag) {
	                d2.push(thelastdata2[i]);
	            }
	        }
	    }
	    var d3 = [];
	    for (var i = 0; i < d1.length; i++) {
	        for (var j = 0; j < d2.length; j++) {
	            if (d1[i].CabinFlag == d2[j].CabinFlag) {
	                d3.push(d1[i]);
	            }
	        }
	    }
	    // console.log(d3)

	    return d3;
	}

	function strKo(data) {

	    return Number(data.split(":").join(""));
	}

	// 绑定 筛选 功能
	function picBox() {

	    // 机场选择
	    var air2 = $.qus('.pickbox-airport2');
	    for (var i = 0; i < air2.length; i++) {
	        air2[i].onclick = function () {
	            if ($.hasClass($.lastChild(this), 'check_it')) {
	                $.removeClass($.lastChild(this), 'check_it');
	                $.addClass($.qu('.pickbox-airport22'), 'check_it');
	            } else {
	                $.each(air2, function () {
	                    $.removeClass($.lastChild(this), 'check_it');
	                });
	                $.addClass($.lastChild(this), 'check_it');
	            }
	            return false;
	        };
	    }
	    var air1 = $.qus('.pickbox-airport1');
	    for (var i = 0; i < air1.length; i++) {
	        air1[i].onclick = function () {
	            if ($.hasClass($.lastChild(this), 'check_it')) {
	                $.removeClass($.lastChild(this), 'check_it');
	                $.addClass($.qu('.pickbox-airport11'), 'check_it');
	            } else {
	                $.each(air1, function () {
	                    $.removeClass($.lastChild(this), 'check_it');
	                });
	                $.addClass($.lastChild(this), 'check_it');
	            }
	            return false;
	        };
	    }
	    // 筛选类型切换
	    var ptitles = $.qus('.pickbox-title1');
	    for (var i = 0; i < ptitles.length; i++) {
	        ptitles[i].onclick = function () {
	            $.each(ptitles, function () {
	                $.removeClass(this, 'title-active');
	            });
	            $.addClass(this, 'title-active');
	            if ($.hasClass($.qu('.pickbox-title11'), 'title-active')) {
	                $.each($.qus('.pickbox-mian'), function () {
	                    this.style.display = 'none';
	                });
	                $.qu('.pickbox-time').style.display = 'block';
	            } else if ($.hasClass($.qu('.pickbox-title12'), 'title-active')) {
	                $.each($.qus('.pickbox-mian'), function () {
	                    this.style.display = 'none';
	                });
	                $.qu('.pickbox-cp').style.display = 'block';
	            } else if ($.hasClass($.qu('.pickbox-title13'), 'title-active')) {
	                $.each($.qus('.pickbox-mian'), function () {
	                    this.style.display = 'none';
	                });
	                $.qu('.pickbox-type').style.display = 'block';
	            } else if ($.hasClass($.qu('.pickbox-title14'), 'title-active')) {
	                $.each($.qus('.pickbox-mian'), function () {
	                    this.style.display = 'none';
	                });
	                $.qu('.pickbox-airport').style.display = 'block';
	            }
	        };
	    }
	    // 时间选择
	    slectPick('.pickbox-time', '.pickbox-time1', '.pickbox-time2', 'check_it');
	    // 公司选择
	    slectPick('.pickbox-cp', '.pickbox-cp1', '.pickbox-cp2', 'check_it');
	    // 机型
	    slectPick('.pickbox-type', '.pickbox-type1', '.pickbox-type2', 'check_it');
	    function slectPick(class1, class11, class12, atr) {
	        // class1 为大类型的calss calsss11 为不限制的class  calsss12为 可选 的class
	        var aType = $.tags($.qu(class1), 'li');
	        for (var i = 1; i < aType.length; i++) {
	            aType[i].onclick = function () {
	                if ($.hasClass($.tags(this, 'label')[0], atr)) {
	                    $.removeClass($.tags(this, 'label')[0], atr);
	                    var aType1 = $.qus(class12);
	                    var k = 0;
	                    for (var i = 0; i < aType1.length; i++) {
	                        k += $.hasClass(aType1[i], atr);
	                    }
	                    if (k == 0) {
	                        $.addClass($.qu(class11), atr);
	                    }
	                } else {
	                    $.removeClass($.qu(class11), atr);
	                    $.addClass($.tags(this, 'label')[0], atr);
	                }
	                return false;
	            };
	        }
	        aType[0].onclick = function () {
	            var aType12 = $.qus(class12);
	            for (var i = 0; i < aType12.length; i++) {
	                $.removeClass(aType12[i], atr);
	            }
	            $.addClass($.qu(class11), atr);
	        };
	    }

	    $.id('fl1pick-h1s2').onclick = function () {
	        allreMaddClass();
	    };
	    // 初始化筛选

	}
	// 清空筛选
	function allreMaddClass() {
	    var kk = $.tags($.qu('.detail-pickbox'), 'label');

	    for (var i = 0; i < kk.length; i++) {
	        if ($.hasClass(kk[i], 'check_it')) {
	            $.removeClass(kk[i], 'check_it');
	        }
	    }

	    var alrr = ['.pickbox-time1', '.pickbox-cp1', '.pickbox-type1', '.pickbox-airport11', '.pickbox-airport22'];
	    for (var i = 0; i < alrr.length; i++) {
	        reMaddClass(alrr[i]);
	    }
	    function reMaddClass(latr) {
	        $.addClass($.qu(latr), 'check_it');
	    }
	}

	// 数据处理函数  所有航班加入页面
	function pullData(type, n, alldata) {

	    if (alldata != '') {
	        //判断筛选类型 时间 价格 type=1 时间， type=2 价格
	        if (type == 1) {
	            // 为时间类型 偶然的？
	            if (n == 1) {
	                //时间 早到晚
	                var alldata1 = alldata.sort(function (a, b) {
	                    return strKo(a.FlyTime) - strKo(b.FlyTime);
	                });
	            } else {
	                //时间 晚到早
	                var alldata1 = alldata.sort(function (a, b) {
	                    return strKo(b.FlyTime) - strKo(a.FlyTime);
	                });
	            }
	        } else if (type == 2) {
	            //  为价格类型
	            if (n == 1) {
	                //价格 低到高
	                var alldata1 = alldata.sort(function (a, b) {
	                    return a.Fare - b.Fare;
	                });
	            } else {
	                //价格   高到底 alldata1[i].Fare
	                var alldata1 = alldata.sort(function (a, b) {
	                    return b.Fare - a.Fare;
	                });
	            }
	        }

	        // console.log(alldata1)
	        var strs = '';
	        for (var i = 0; i < alldata1.length; i++) {
	            if (alldata1[i].Cabins.length == 0) {
	                strs = strs;
	            } else {
	                var fligth1 = JSON.stringify(alldata1[i].Cabins[0]);
	                strs += '<ul class="dedata-wrap" id="' + alldata1[i].CabinFlag + '" ArrTime="' + alldata1[i].ArrTime + '"  CabinLevel="' + alldata1[i].CabinLevel + '"  ArrHall="' + alldata1[i].ArrHall + '" ZYtype="' + alldata1[i].Cabins[0].CabinType + '"  Model="' + alldata1[i].Model + '"  CarrierAbb="' + alldata1[i].CarrierAbb + alldata1[i].Carrier + alldata1[i].FlightNo + '" CarrierAbb1="' + alldata1[i].CarrierAbb + '"  CarrierAbb2="' + alldata1[i].Carrier + alldata1[i].FlightNo + '"  FlightDate="' + alldata1[i].FlightDate + '"  Terminal="' + alldata1[i].Terminal + '"  ToAirport="' + alldata1[i].ToAirport + '" FlyTime="' + alldata1[i].FlyTime + '" FromAirport="' + alldata1[i].FromAirport + '" RouteFrom="' + alldata1[i].RouteFrom + '"  RouteTo="' + alldata1[i].RouteTo + '" Carrier="' + alldata1[i].Carrier + '" YPrice ="' + alldata1[i].YPrice + '" Discount="' + alldata1[i].Discount + '" RouteFromCode="' + alldata1[i].RouteFromCode + '" RouteToCode="' + alldata1[i].RouteToCode + '" ModelChar="' + alldata1[i].ModelChar + '" Cabin="' + alldata1[i].Cabin + '"  Terminal="' + alldata1[i].Terminal + '" JtStop="' + alldata1[i].JtStop + '" data1=' + fligth1 + '><li class="d-wrapl1" ><span class="d-wrapl1-sp1">' + alldata1[i].FlyTime + '</span><span class="d-wrapl1-sp2"><strong></strong></span><span class="d-wrapl1-sp3">' + alldata1[i].ArrTime + '</span><span class="d-wrapl1-sp4">￥<em class="d-wrapl1price">' + alldata1[i].Fare + '</em></span><span class="jtstop"   jtdata="' + alldata1[i].JtStop + '">经停</span></li><li class="d-wrapl2"><span class="d-wrapl2-sp1">' + alldata1[i].FromAirport + '</span><span class="d-wrapl2-sp2">' + alldata1[i].ToAirport + '</span></li><li class="d-wrapl3"><img class="DF-logo" src="https://cos.uair.cn/mb/img/' + alldata1[i].Carrier + '.png"/> <span class="d-wrapl3-sp1">' + alldata1[i].CarrierAbb + alldata1[i].Carrier + alldata1[i].FlightNo + '</span><span class="d-wrapl3-sp2">' + alldata1[i].Model + alldata1[i].ModelChar + '</span></li><li class="d-wrapl4">共享:实际乘坐<span class="shareno">' + alldata1[i].ShareNo + '</span></li></ul>';
	            }
	        }

	        return strs;
	    } else {
	        return '没有找到航班！';
	    }
	}

	// 获取所有的航空公司
	function getAllcp(alldata) {
	    var strcp = [];
	    for (var i = 0; i < alldata.length; i++) {
	        strcp.push(alldata[i].CarrierAbb);
	    }
	    return strcp;
	}
	//数组去重
	function removedata(ar) {
	    var a1 = new Date().getTime();
	    var m = [],
	        f;
	    for (var i = 0; i < ar.length; i++) {
	        f = true;
	        for (var j = 0; j < m.length; j++) {
	            if (ar[i] === m[j]) {
	                f = false;break;
	            }
	        };
	        if (f) m.push(ar[i]);
	    }

	    return m.sort(function (a, b) {
	        return a - b;
	    });
	}
	//加载筛选项 公司
	function pullCp(dataCp) {
	    var str1 = '<li ><span>不限</span><label class="check_it pickbox-cp1"><input type="radio" value=" "></label></li>';
	    var str2 = '';
	    for (var i = 0; i < dataCp.length; i++) {
	        str2 += '<li><span>' + dataCp[i] + '</span><label class="pickbox-cp2"><input type="checkbox" value=" "></label></li>';
	    }

	    $.qu('.pickbox-cp').innerHTML = str1 + str2;
	}
	//加载筛选项 起落机场
	function fCity(alldata) {
	    var strcp = [];
	    for (var i = 0; i < alldata.length; i++) {
	        strcp.push(alldata[i].FromAirport);
	    }
	    return strcp;
	}
	function toCity(alldata) {
	    var strcp = [];
	    for (var i = 0; i < alldata.length; i++) {
	        strcp.push(alldata[i].ToAirport);
	    }
	    return strcp;
	}

	// 时间格式组装
	function detailChange(date) {

	    //对date进行重新组装成yyyy-MM-dd的格式
	    //2014 - 8 - 7
	    try {
	        var tempDate1Arr = date.split("-");
	        date = tempDate1Arr[0] + "";
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
	    } catch (e) {}

	    return date;
	}

	//获取前一天或者后一天的时间
	function getPointedDate(d, dateCount, dataDirect) {
	    // d 2016-12-12
	    Date.prototype.Format = function (formatStr) {
	        var str = formatStr;
	        var Week = ['日', '一', '二', '三', '四', '五', '六'];

	        str = str.replace(/yyyy|YYYY/, this.getFullYear());
	        str = str.replace(/yy|YY/, this.getYear() % 100 > 9 ? (this.getYear() % 100).toString() : '0' + this.getYear() % 100);

	        str = str.replace(/MM/, this.getMonth() >= 9 ? (this.getMonth() + 1).toString() : '0' + (this.getMonth() + 1));
	        str = str.replace(/M/g, this.getMonth() + 1);

	        str = str.replace(/w|W/g, Week[this.getDay()]);

	        str = str.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : '0' + this.getDate());
	        str = str.replace(/d|D/g, this.getDate());

	        str = str.replace(/hh|HH/, this.getHours() > 9 ? this.getHours().toString() : '0' + this.getHours());
	        str = str.replace(/h|H/g, this.getHours());
	        str = str.replace(/mm/, this.getMinutes() > 9 ? this.getMinutes().toString() : '0' + this.getMinutes());
	        str = str.replace(/m/g, this.getMinutes());

	        str = str.replace(/ss|SS/, this.getSeconds() > 9 ? this.getSeconds().toString() : '0' + this.getSeconds());
	        str = str.replace(/s|S/g, this.getSeconds());

	        return str;
	    };

	    var dTime = new Date();

	    var dString = d.split("-");
	    dTime.setFullYear(dString[0], parseInt(dString[1] - 1), dString[2]);
	    if (dataDirect == "+") {
	        dTime.setDate(parseInt(dString[2]) + dateCount);
	    } else if (dataDirect == "-") {
	        dTime.setDate(parseInt(dString[2]) - dateCount);
	    }

	    return dTime.Format("yyyy-MM-dd");
	}

	//获取星期几
	function getWeek(num) {
	    switch (num) {
	        case 0:
	            return "周日";
	        case 1:
	            return "周一";
	        case 2:
	            return "周二";
	        case 3:
	            return "周三";
	        case 4:
	            return "周四";
	        case 5:
	            return "周五";
	        case 6:
	            return "周六";
	    }
	}
	//如果是往返，则需要判断是否日期超出范围
	function checkDateIsOK(nowDate) {
	    var time2 = urlTime1; //返回时间

	    if (nowDate < new Date().Format("yyyy-MM-dd")) {
	        //alert("历史机票不可查询");
	        (0, _api.myalertp)('detail', '历史航班不可查询！');
	        //改变样式
	        $.qu('.detail-tms1d2').style.display = 'none';
	        $.qu('.detail-tms1d1').style.lineHeight = '2.4rem';
	        $.qu('.detail-tms1d1').style.color = '#A6A5A5';
	        $.id('detail-tmbn1').style.color = '#A6A5A5';

	        return false;
	    } else {
	        $.qu('.detail-tms1d2').style.display = 'block';
	        $.qu('.detail-tms1d1').style.lineHeight = '1.9rem';
	        $.qu('.detail-tms1d1').style.color = '#fff';
	        $.id('detail-tmbn1').style.color = '#fff';
	    }
	    if (time2 != "") {
	        //返程的时候用到
	        nowDate = nowDate.replace(/-/g, ""); //现在要查询的时间
	        nowDate = parseInt(nowDate); //转换为数字类型
	        //还在选择去程
	        time2 = time2.replace(/-/g, "");
	        time2 = parseInt(time2);
	        if (time2 > nowDate) {
	            //alert(time2)
	            //alert(nowDate)
	            //alert("去程时间不能大于返程时间");
	            (0, _api.myalertp)('detail', '去程时间不能大于返程时间');

	            return false;
	        }
	    }
	    return true;
	}

	//通过现在查询的时间改变顶部的日期
	function changeDateOfTop(date) {
	    //date ='2016-12-12'

	    $.id('detail-m1').innerHTML = '';
	    var yesDay = getPointedDate(date, 1, "-");
	    var nextDay = getPointedDate(date, 1, "+");
	    //$.id('txTime2').setAttribute('data','39302')
	    $.id('detail-tms1').setAttribute('date', yesDay);
	    $.id('detail-tms2').setAttribute('date', nextDay);
	    $.id('detail-tmmai').setAttribute('date', date);
	    $.id('detail-nowdata1').innerHTML = date;
	    var _date = new Date(date);
	    $.id('detail-nowdata2').innerHTML = getWeek(_date.getDay());
	}
	// city1:PEK
	// city2:CKG
	// date:2016-12-12&
	// days :10
	// 获取最低价
	function getLowPrict(date1) {
	    //$.qu('.lodin-p').style.display = '-webkit-box';
	    var date = GetDateStrH(date1, -24);
	    //console.log(date)
	    var jsonData = {
	        from: getCityCode(urlFrom),
	        to: getCityCode(urlTo),
	        date: date
	    };
	    myAjaxGetLowpricepr(jsonData.from, jsonData.to);
	    function myAjaxGetLowpricepr(city1, city2) {

	        var oData2 = '';

	        var xhr = '';
	        if (window.XMLHttpRequest) {
	            xhr = new XMLHttpRequest();
	        } else {
	            xhr = new ActiveXObject(' Microsoft . XMLHTTP');
	        }
	        //xhr.open('get','http://121.52.212.39:83/CabinCountSearch/api/LowPriceController/Search.do?from='+city1+'&to='+city2+'&date='+date+'&day='+days,'false');
	        //xhr.open('get',flightUrlprice+'/CabinCountSearch/api/LowPriceController/Search.do?from='+city1+'&to='+city2+'&date='+date+'&day='+days,'true');//  异步加载 最低价
	        xhr.open('get', '/icbc/ajax.aspx?from=' + city1 + '&to=' + city2 + '&act=GetLowPrice', 'true'); //  异步加载 最低价
	        xhr.send();
	        xhr.onreadystatechange = function () {
	            if (xhr.readyState == 4) {
	                // ajax 响内容解析完成，可以在客户端调用了
	                //$.qu('.lodin-p').style.display = 'none';
	                if (xhr.status == 200) {
	                    //  判断服务器返回的状态 200 表示 正常

	                    oData2 = JSON.parse(xhr.responseText);
	                    //console.log(oData2)

	                    var yesDay = jsonData.date;
	                    var nowDate = getPointedDate(yesDay, 1, "+");
	                    var nextDay = getPointedDate(nowDate, 1, "+");
	                    for (var p in oData2) {
	                        var dateDiv = p.replace(jsonData.from + "_" + jsonData.to + "_", "");
	                        //console.log(dateDiv) // 时间
	                        //console.log(oData2[p]) //价格
	                        if (false) {} // 给日历中加价格
	                        // $("#calendarBox div[data=" + dateDiv + "]").find("font:eq(1)").html("￥" + result[p]);


	                        // //顶部三天价格
	                        if (dateDiv == nowDate) {
	                            $.id('detail-nowdata3').innerHTML = oData2[p];
	                        }
	                        if (dateDiv == yesDay) {
	                            $.id('detail-odldata').innerHTML = oData2[p];
	                        }
	                        if (dateDiv == nextDay) {
	                            $.id('detail-nexdata1').innerHTML = oData2[p];
	                        }
	                    }

	                    zerofn(); //出现 价格为0的时候 的处理
	                } else {
	                        //alert('出错了，价格查询异常！'); 超时也不管 试试
	                        // myalertp('detail','出错了，价格查询异常！')
	                    }
	            }
	        };
	    }
	}
	// 价格为0 处理函数
	function zerofn() {
	    var nextp = $.id('detail-nexdata1').innerHTML;
	    var todayp = $.id('detail-nowdata3').innerHTML;
	    var pre = $.id('detail-odldata').innerHTML;
	    if (nextp == 0) {
	        $.qu('.detail-tms2d1').style.height = '2.4rem';
	        $.qu('.detail-tms2d1').style.lineHeight = '2.4rem';
	        $.qu('.detail-tms2d2').style.display = 'none';
	        $.qu('.detail-tmbn2img2').style.marginTop = '0';
	    } else {
	        $.qu('.detail-tms2d1').style.height = '1.3rem';
	        $.qu('.detail-tms2d1').style.lineHeight = '1.9rem';
	        $.qu('.detail-tms2d2').style.display = 'inline-block';
	        $.qu('.detail-tmbn2img2').style.marginTop = '1rem';
	    }
	    if (pre == 0) {
	        $.qu('.detail-tms1d1').style.height = '2.4rem';
	        $.qu('.detail-tms1d1').style.lineHeight = '2.4rem';
	        $.qu('.detail-tms1d2').style.display = 'none';
	        $.qu('.detail-tmbn1img1').style.marginTop = '0';
	    } else {
	        $.qu('.detail-tms1d1').style.height = '1.3rem';
	        $.qu('.detail-tms1d1').style.lineHeight = '1.9rem';
	        $.qu('.detail-tms1d2').style.display = 'inline-block';
	        $.qu('.detail-tmbn1img1').style.marginTop = '1rem';
	    }
	    if (todayp == 0) {
	        $.qu('.detail-tmmais4').style.display = 'none';
	    } else {
	        $.qu('.detail-tmmais4').style.display = 'inline-block';
	    }
	}
	// 增加 N天或者减少 N 天 函数封装
	function GetDateStrH(date, h) {

	    var Y1 = date.substring(0, 4);
	    var m1 = date.substring(5, 7) - 1;
	    var d1 = date.substring(8, 10);
	    var dd = new Date(Y1, m1, d1);
	    dd.setHours(dd.getHours() + h); //获取AddDayCount天后的日期
	    var y = dd.getFullYear();
	    var m = dd.getMonth() + 1; //获取当前月份的日期
	    var d = dd.getDate();
	    if ((m + "").length == 1) {
	        m = "0" + m;
	    }
	    if ((d + "").length == 1) {
	        d = "0" + d;
	    }
	    return y + "-" + m + "-" + d;
	}
	//根据三字码取城市
	function getCityName(code) {
	    var citys = eval("(" + getCityObj() + ")").results;
	    for (var i = 0; i < citys.length; i++) {
	        if (citys[i].id.toUpperCase() == code.toUpperCase()) {
	            return citys[i].info;
	        }
	    }
	}

	//根据城市取三字码
	function getCityCode(city) {
	    var citys = eval("(" + getCityObj() + ")").results;
	    for (var i = 0; i < citys.length; i++) {
	        if (citys[i].info.toUpperCase() == city.toUpperCase()) {
	            return citys[i].id;
	            //alert(citys[i].id);
	        }
	    }
	}

	function toTOP() {
	    var odP = $.id('date-m');
	    if (odP.scrollTop != 0) {
	        odP.scrollTop = 0; // 返回顶部
	    }
	}

	//去除"\:" and "\-"
	function removeMh(date) {
	    return parseInt(date.replace(/\:|\-/g, ""));
	}

/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = "\r\n\r\n<div id=\"detail\">\r\n     <div class=\"lodin\">\r\n         <img class=\"xhlog\" src=\"https://cos.uair.cn/mb/img/xhlog.gif\" />\r\n     </div>\r\n\r\n     <!-- <div class=\"lodin-p\">\r\n          <div id=\"caseBlanche-p\">\r\n            <div id=\"rond-p\">\r\n              <div id=\"test-p\"></div>\r\n            </div>\r\n            <div id=\"load-p\">\r\n              <p>价格查询中...</p>\r\n            </div>\r\n          </div>\r\n     </div> -->\r\n     <div id=\"detail-t\">\r\n        <span class=\"detail-t1\">\r\n            <img  src=\"https://cos.uair.cn/mb/img/back.bg.png\" alt=\"\">\r\n        </span>\r\n        <div class=\"detailcity\">\r\n           <span class=\"detail-t2\"></span>\r\n           <span id=\"detailcity0\"></span>\r\n           <span id=\"detailcity2\">→</span>\r\n           <span id=\"detailcity1\"></span>\r\n        </div>\r\n\r\n         <a href=\"tel:4000662188\" class=\"d_phone\"></a>\r\n         <img src=\"https://cos.uair.cn/mb/img/h_home.png\" class=\"d_home\" alt=\"\"/>\r\n\r\n\r\n     </div>\r\n     <div id=\"detail-tm\">\r\n         <div id=\"detail-tms1\" >\r\n               <div id=\"detail-tmbn1\">\r\n                  <img class=\"detail-tmbn1img1\" src=\"https://cos.uair.cn/mb/img/back.bg.png\" alt=\"\">\r\n               </div>\r\n               <span class=\"detail-tms1d1\">前一天</span>\r\n               <span class=\"detail-tms1d2\">￥<em id=\"detail-odldata\"></em></span>\r\n         </div>\r\n         <div id=\"detail-tmmai\">\r\n               <span class=\"detail-tmmais1\">\r\n                      <img src=\"https://cos.uair.cn/mb/img/data.png\" alt=\"\">\r\n               </span>\r\n               <span class=\"detail-tmmais2\"><em id=\"detail-nowdata1\"></em></span>\r\n               <span class=\"detail-tmmais3\"><em id=\"detail-nowdata2\"></em></span>\r\n               <span class=\"detail-tmmais4\">￥<em id=\"detail-nowdata3\"></em></span>\r\n               <span class=\"detail-tmmais5\"></span>\r\n         </div>\r\n         <div id=\"detail-tms2\" >\r\n               <span class=\"detail-tms2d1\">后一天</span>\r\n               <span class=\"detail-tms2d2\">￥<em id=\"detail-nexdata1\"></em></span>\r\n               <div id=\"detail-tmbn2\">\r\n                    <img class=\"detail-tmbn2img2\" src=\"https://cos.uair.cn/mb/img/back1.bg.png\" alt=\"\">\r\n               </div>\r\n         </div>\r\n     </div>\r\n     <div id=\"detail-m\">\r\n         <div id=\"detail-m1\">\r\n\r\n         </div>\r\n     </div>\r\n     <div id=\"detail-f\">\r\n        <ul class=\"detail-f-ul\">\r\n          <li id=\"detail-fl1\">\r\n               <div class=\"detail-f-uld\">\r\n                   <img src=\"https://cos.uair.cn/mb/img/detail-f-bg1.png\" alt=\"\">\r\n               </div>\r\n\r\n              <span class=\"detail-f-ulsp detail-f-ulsp1\">筛选</span>\r\n              <div class=\"detail-f-ulo\"></div>\r\n\r\n          </li>\r\n          <li id=\"detail-fl2\">\r\n               <div class=\"detail-f-uld\">\r\n                   <img src=\"https://cos.uair.cn/mb/img/detail-f-bg2.png\" alt=\"\">\r\n               </div>\r\n\r\n              <span class=\"detail-f-ulsp detail-f-ulsp2\">从早到晚</span>\r\n               <div class=\"detail-f-ulo2\"></div>\r\n          </li>\r\n          <li id=\"detail-fl3\">\r\n                <div class=\"detail-f-uld\">\r\n                   <img src=\"https://cos.uair.cn/mb/img/detail-f-bg3.png\" alt=\"\">\r\n                </div>\r\n\r\n              <span class=\"detail-f-ulsp detail-f-ulsp3\">价格</span>\r\n               <div class=\"detail-f-ulo3\"></div>\r\n          </li>\r\n        </ul>\r\n        <div class=\"detail-fl1pick\">\r\n             <ul class=\"detail-fl1pick-h\">\r\n                 <li class=\"fl1pick-h1\"><span id=\"fl1pick-h1s1\" >取消</span></li>\r\n                 <li class=\"fl1pick-h1\"><span id=\"fl1pick-h1s2\" >清空筛选</span></li>\r\n                 <li class=\"fl1pick-h1\"><span id=\"fl1pick-h1s3\" >确定</span></li>\r\n             </ul>\r\n             <div class=\"detail-pickbox\">\r\n                  <ul class=\"pickbox-title\">\r\n                      <li class=\"title-active pickbox-title1 pickbox-title11\">起飞时间</li>\r\n                      <li class=\"pickbox-title1 pickbox-title12\">航空公司</li>\r\n                      <li class=\"pickbox-title1 pickbox-title13\">机型</li>\r\n                      <li class=\"pickbox-title1 pickbox-title14\">机场</li>\r\n                  </ul>\r\n                  <ul class=\"pickbox-mian pickbox-time\">\r\n                      <li >\r\n                          <span>不限</span>\r\n                         <label class=\"check_it pickbox-time1\"><input type=\"radio\" value=\" \"></label>\r\n                      </li>\r\n\r\n                      <li >\r\n                          <span>6:00--12:00</span>\r\n                         <label class=\"pickbox-time2\"><input type=\"checkbox\" value=\" \"></label>\r\n                      </li>\r\n                      <li >\r\n                          <span>12:00--18:00</span>\r\n                          <label class=\"pickbox-time2\" ><input type=\"checkbox\" value=\" \"></label>\r\n                      </li>\r\n                      <li >\r\n                          <span>18:00--24:00</span>\r\n                          <label class=\"pickbox-time2\" ><input type=\"checkbox\" value=\" \"></label>\r\n                      </li>\r\n                  </ul>\r\n                  <ul class=\"pickbox-mian pickbox-cp\">\r\n\r\n                  </ul>\r\n                  <ul class=\"pickbox-mian pickbox-type\">\r\n                     <li >\r\n                         <span>不限</span>\r\n                        <label class=\"check_it pickbox-type1\"><input type=\"radio\" value=\" \"></label>\r\n                     </li>\r\n                     <li>\r\n                         <span>小型机</span>\r\n                         <label class=\"pickbox-type2\"><input type=\"checkbox\" value=\" \"></label>\r\n                     </li>\r\n                     <li >\r\n                         <span>中型机</span>\r\n                         <label class=\" pickbox-type2\"  >\r\n                            <input type=\"checkbox\" value=\" \">\r\n                         </label>\r\n                     </li>\r\n                     <li >\r\n                         <span>大型机</span>\r\n                         <label class=\" pickbox-type2\"  >\r\n                            <input type=\"checkbox\" value=\" \">\r\n                         </label>\r\n                      </li>\r\n                  </ul>\r\n                  <ul class=\"pickbox-mian pickbox-airport\">\r\n\r\n                  </ul>\r\n             </div>\r\n        </div>\r\n     </div>\r\n</div>\r\n"

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	/**
	 * Created by way on 16/9/28.
	 */


	var _config = __webpack_require__(1);

	var _config2 = _interopRequireDefault(_config);

	var _api = __webpack_require__(7);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var $ = __webpack_require__(5);
	// myalertp 封装的 alert提示弹层
	//myalertp('datep','出错了，获取客服联系电话失败！')
	var _view = __webpack_require__(19);
	var TTitype = '';
	var pbackt = '';
	var pbackt1 = '';
	var searchtypep = ''; // 存放详情页面带过来的 单 往返 判断数据
	var nowDate = new Date();
	var nDt = new Date();

	var _class = function () {
	    function _class(opt) {
	        _classCallCheck(this, _class);

	        this.path = '/flightmb/picktime$';
	        this.hash = '/flightmb/picktime';
	        this.title = '时间选择';

	        opt = opt || {};
	        this.path = opt.path || this.path;
	        this.hash = opt.hash || this.hash;
	        this.title = opt.title || this.title;
	    }

	    // 输出视图


	    _createClass(_class, [{
	        key: 'view',
	        value: function view(cb) {
	            if (!_view) {
	                // 静态资源浏览器有缓存,增加时标,强制刷新!
	                (0, _api.getView)(_config2.default.view.lotteryOpen + '?t=' + +new Date(), '', function (rs) {
	                    _view = rs;
	                    cb(null, _view);
	                });
	            } else {
	                cb(null, _view);
	            }
	        }

	        // 在已经加载的视图上操作

	    }, {
	        key: 'bind',
	        value: function bind(dv, params) {

	            console.log(params);

	            pbackt = params.backtime;
	            searchtypep = params.searchtype;
	            if (pbackt != '') {
	                pbackt1 = picktimedateChange(pbackt);
	            };

	            var backDate = nowDate;
	            backDate.setDate(backDate.getDate() + 7);
	            returnDate("date-m1", nDt.Format("yyyy"), nDt.Format("MM"), nDt.Format("dd"), 1);
	            var AdayNext = $.qus('.dayNext');
	            // console.log(AdayNext.length)
	            for (var i = 0; i < AdayNext.length; i++) {
	                var _that = AdayNext[i];
	                eClick(_that);
	            }
	            eClick($.qu(".dayNow"));
	            myLowpricepick(getCityCode(params.cityf), getCityCode(params.cityt)); // 添加最低价格

	            // 返回按钮
	            $.id('dateBack').onclick = function () {
	                $.router.go('#!/flightmb/detail', {}, false);
	            };
	        }
	    }]);

	    return _class;
	}();

	//根据城市取三字码


	exports.default = _class;
	function getCityCode(city) {
	    var citys = eval("(" + getCityObj() + ")").results;
	    for (var i = 0; i < citys.length; i++) {
	        if (citys[i].info.toUpperCase() == city.toUpperCase()) {
	            return citys[i].id;
	            //alert(citys[i].id);
	        }
	    }
	}

	//重组时间
	function picktimedateChange(date) {

	    //对date进行重新组装成yyyy-MM-dd的格式
	    //2014 - 8 - 7
	    try {
	        var tempDate1Arr = date.split("-");
	        date = tempDate1Arr[0] + "";
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
	    } catch (e) {}

	    return date;
	}

	function toTOP() {
	    var odP = $.id('date-m');
	    if (odP.scrollTop != 0) {
	        odP.scrollTop = 0; // 返回顶部
	    }
	}

	Date.prototype.Format = function (formatStr) {
	    var str = formatStr;
	    var Week = ['日', '一', '二', '三', '四', '五', '六'];

	    str = str.replace(/yyyy|YYYY/, this.getFullYear());
	    str = str.replace(/yy|YY/, this.getYear() % 100 > 9 ? (this.getYear() % 100).toString() : '0' + this.getYear() % 100);

	    str = str.replace(/MM/, this.getMonth() >= 9 ? (this.getMonth() + 1).toString() : '0' + (this.getMonth() + 1));
	    str = str.replace(/M/g, this.getMonth() + 1);

	    str = str.replace(/w|W/g, Week[this.getDay()]);

	    str = str.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : '0' + this.getDate());
	    str = str.replace(/d|D/g, this.getDate());

	    str = str.replace(/hh|HH/, this.getHours() > 9 ? this.getHours().toString() : '0' + this.getHours());
	    str = str.replace(/h|H/g, this.getHours());
	    str = str.replace(/mm/, this.getMinutes() > 9 ? this.getMinutes().toString() : '0' + this.getMinutes());
	    str = str.replace(/m/g, this.getMinutes());

	    str = str.replace(/ss|SS/, this.getSeconds() > 9 ? this.getSeconds().toString() : '0' + this.getSeconds());
	    str = str.replace(/s|S/g, this.getSeconds());

	    return str;
	};

	function eClick(obj) {
	    obj.onclick = function () {
	        // var selectDate = this.find("font").eq(0).html();
	        var selectDate = $.firstChild(this).innerHTML;
	        //console.log(selectDate)
	        if (selectDate === "今天") {
	            selectDate = nDt.getDate();
	        }
	        var dateCls = $.lastChild(this).innerHTML;
	        var hID = this.parentNode.parentNode.parentNode.id;
	        var dateString = $.nextNode($.firstChild($.firstChild($.id(hID)))).innerHTML;
	        //console.log(dateString)
	        var _date = new Date(dateString.replace(/-/g, "/"));
	        if (dateCls == undefined) {
	            dateCls = getWeek(_date.getDay());
	        }
	        if (selectDate != "") {
	            // $("#emTime").html(dateString);
	            // $("#headerID").hide();
	            // $("#calendarCover").remove();
	            // $("#emTime").next().html("&nbsp" + dateCls);
	            // $("body").scrollTop(0);
	            var Ttime = dateString + '-' + selectDate;
	            var Tprice = dateCls;
	            //console.log(pbackt)
	            // console.log(picktimedateChange(Ttime))
	            if (pbackt == '') {
	                // 单程的时候
	                //  点击 带时间 返回
	                $.router.go('#!/flightmb/detail', { cliktype: 2, timetype: TTitype, stime: Ttime, sprice: Tprice, bt: pbackt }, true);
	                toTOP();
	            } else {
	                if (pbackt1 < picktimedateChange(Ttime)) {
	                    //alert('去程日期不能大于返程日期~')
	                    (0, _api.myalertp)('datep', '去程日期不能大于返程日期');
	                } else {
	                    $.router.go('#!/flightmb/detail', { cliktype: 2, timetype: TTitype, stime: Ttime, bt: pbackt, sprice: Tprice }, true);
	                    toTOP();
	                }
	            }
	        }
	    };
	}

	//获取星期几
	function getWeek(num) {
	    switch (num) {
	        case 0:
	            return "周日";
	        case 1:
	            return "周一";
	        case 2:
	            return "周二";
	        case 3:
	            return "周三";
	        case 4:
	            return "周四";
	        case 5:
	            return "周五";
	        case 6:
	            return "周六";
	    }
	}

	//得到五个日历表的方法
	function returnDate(id, nYear, nMonth, nDay, num) {
	    var selectDate = "";
	    // if (num == 1) {
	    //     selectDate = $("#emTime").text();
	    // } else {
	    //     selectDate = $("#backTime").text();
	    // }
	    var year = nYear,
	        month = nMonth;

	    var size = 7;
	    // var calendarBox = "<div id='calendarBox'></div>"
	    // $("#calendarCover").append(calendarBox);
	    var html = '';
	    for (var i = 0; i < size; i++) {
	        html += calendar("calendar" + i, year, month, selectDate, false);
	        //$("#" + id).append(html);
	        month++;
	        if (month == 13) {
	            month = 1;
	            year++;
	        }
	    }
	    $.html($.id(id), html);
	    // $("#headerID").show();
	    // $("#headerID").find("h1").html("选择日期");
	}

	function calendar(id, yy, mm, selectDate, showBtn) {
	    //日历控件id:日历控件组id,yymm,开始的年份/月份,showBtn是否显示前一个月后一个月按钮
	    var year = parseInt(yy) < 1900 ? 1900 : parseInt(yy);
	    year = year > 2030 ? 2030 : year;
	    var month = parseInt(mm, 10) < 1 ? 1 : parseInt(mm, 10);
	    month = month > 12 ? 12 : month;
	    var calendarHTML = "<div class='calendar' id=" + id + " date=" + selectDate + ">" + "<div class='calendar_t'>";
	    if (showBtn) {
	        //显示按钮
	        calendarHTML += "<div class='calendar_t_prev' onclick='changeCalendar(this,-1);'><</div>" + "<div class='calendar_t_day'>" + year + "-" + month + "</div>" + "<div class='calendar_t_next'onclick='changeCalendar(this,1);'>></div>";
	    } else {
	        //无按钮
	        calendarHTML += "<div class='calendar_t_prev'></div>" + "<div class='calendar_t_day'>" + year + "-" + month + "</div>" + "<div class='calendar_t_next'></div>";
	    }
	    calendarHTML += "<div class='clear'></div>" + "</div>" + "<div class='calendar_c'>" + "<div class='calendar_c_week'>" + "<div class='calendar_c_week_day'>日</div>" + "<div class='calendar_c_week_day'>一</div>" + "<div class='calendar_c_week_day'>二</div>" + "<div class='calendar_c_week_day'>三</div>" + "<div class='calendar_c_week_day'>四</div>" + "<div class='calendar_c_week_day'>五</div>" + "<div class='calendar_c_week_day'>六</div>" + "<div class='clear'></div>" + "</div>" + "<div class='calendar_c_box'>";
	    calendarHTML += loadCalendar(year, month, selectDate);
	    calendarHTML += "</div>" + "</div>" + "</div>";
	    return calendarHTML;
	}

	function loadCalendar(year, month, selectDate) {
	    var rc = "";
	    var dateObj = new Date();
	    var nowYear = dateObj.getFullYear(); //年
	    var nowMonth = dateObj.getMonth() + 1; //月
	    var nowDate = dateObj.getDate(); //日
	    var nowDay = dateObj.getDay(); //周几
	    var months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	    year = year < 1900 ? 1900 : year;
	    year = year > 2030 ? 2030 : year;
	    month = month < 1 ? 1 : month;
	    month = month > 12 ? 12 : month;
	    months[1] = year % 4 == 0 ? 29 : 28; //闰年判断
	    dateObj.setFullYear(year, month - 1, 1);
	    var day1 = dateObj.getDay();
	    for (var i = 0; i < day1; i++) {
	        rc += "<div class='day dayEmpty dayWhite'><font class='thettpn'></font><font class='thettpn thettp1n'></font></div>";
	    }
	    var tomorrow = 0;
	    var afterTomorrow = 0;
	    var minPrice = "￥" + 750;
	    minPrice = "";
	    for (var i = 1; i <= months[month - 1]; i++) {
	        var dateString = year + "-" + month + "-" + i; //当前日历日期
	        {
	            //变成标准的日期格式如：2016-09-09
	            var tempDate1Arr = dateString.split("-");
	            dateString = tempDate1Arr[0] + "";
	            if (tempDate1Arr[1].length == 1) {
	                dateString += "-0" + tempDate1Arr[1];
	            } else {
	                dateString += "-" + tempDate1Arr[1];
	            }
	            if (tempDate1Arr[2].length == 1) {
	                dateString += "-0" + tempDate1Arr[2];
	            } else {
	                dateString += "-" + tempDate1Arr[2];
	            }
	        }

	        if (dateString == selectDate) {
	            if (year == nowYear && month == nowMonth && i == nowDate) {
	                tomorrow = i + 1;
	                rc += "<div class='day daySelect';' data=" + dateString + "><font class='thettp'>今天</font><font class='thettp1'>" + minPrice + "</font><font style='display: none;'>今天</font></div>";
	            } else {
	                if (i == tomorrow) {
	                    tomorrow = 0;
	                    afterTomorrow = i + 1;
	                    rc += "<div class='day daySelect';' data=" + dateString + "><font class='thettp'>" + i + "</font><font class='thettp1'>" + minPrice + "</font><font style='display: none;'>明天</font></div>";
	                } else {
	                    if (afterTomorrow == i) {
	                        afterTomorrow = 0;
	                        rc += "<div class='day daySelect';' data=" + dateString + "><font class='thettp'>" + i + "</font><fontclass='thettp1'>" + minPrice + "</font><font style='display: none;'>后天</font></div>";
	                    } else {
	                        rc += "<div class='day daySelect';' data=" + dateString + "><font class='thettp'>" + i + "</font><font class='thettp1'>" + minPrice + "</font></div>";
	                    }
	                }
	            }
	        } else {
	            if (year < nowYear) {
	                rc += "<div class='day dayPrev dayGrey' data=" + dateString + "><font class='thettpn'>" + i + "</font><font class='thettp1n'></font></div>";
	            } else if (year == nowYear) {
	                if (month < nowMonth) {
	                    rc += "<div class='day dayPrev dayGrey' data=" + dateString + "><font class='thettpn'>" + i + "</font><font class='thettp1n'></font></div>";
	                } else if (month == nowMonth) {
	                    if (i < nowDate) {
	                        rc += "<div class='day dayPrev dayGrey' data=" + dateString + "><font class='thettpn'>" + i + "</font><font class='thettp1n'></font></div>";
	                    } else if (i == nowDate) {
	                        tomorrow = i + 1;
	                        rc += "<div class='day dayNow';' data=" + dateString + "><font class='thettp'>今天</font><font class='thettp1' >" + minPrice + "</font><font style='display: none;'>今天</font></div>";
	                    } else {
	                        if (i == tomorrow) {
	                            tomorrow = 0;
	                            afterTomorrow = i + 1;
	                            rc += "<div class='day dayNext';' data=" + dateString + "><font class='thettp'>" + i + "</font><font class='thettp1' >" + minPrice + "</font><font style='display: none;'>明天</font></div>";
	                        } else {
	                            if (afterTomorrow == i) {
	                                afterTomorrow == 0;
	                                rc += "<div class='day dayNext';' data=" + dateString + "><font class='thettp'>" + i + "</font><font class='thettp1' >" + minPrice + "</font><font style='display: none;'>后天</font></div>";
	                            } else {
	                                rc += "<div class='day dayNext';' data=" + dateString + "><font class='thettp'>" + i + "</font><font class='thettp1'>" + minPrice + "</font></div>";
	                            }
	                        }
	                    }
	                } else {
	                    rc += "<div class='day dayNext';' data=" + dateString + "><font class='thettp'>" + i + "</font><font class='thettp1' >" + minPrice + "</font></div>";
	                }
	            } else {
	                rc += "<div class='day dayNext';' data=" + dateString + "><font class='thettp'>" + i + "</font><font class='thettp1'>" + minPrice + "</font></div>";
	            }
	        }
	    }
	    rc += "<div class='clear'></div>";
	    return rc;
	}
	// 显示按钮的时候调用
	function changeCalendar(element, meth) {
	    var calendarBox = $(element).parents(".calendar");
	    var date = calendarBox.find(".calendar_t_day").html();
	    var dateArray = date.split("-");
	    var year = parseInt(dateArray[0]);
	    var month = parseInt(dateArray[1]);
	    var selectDate = calendarBox.attr("date");
	    if (meth == -1) {
	        month--;
	        if (month == 0) {
	            month = 12;
	            year--;
	        }
	    } else if (meth == 1) {
	        month++;
	        if (month == 13) {
	            month = 1;
	            year++;
	        }
	    }
	    var calendarHTML = loadCalendar(year, month, selectDate);
	    calendarBox.find(".calendar_t_day").html(year + "-" + month);
	    calendarBox.find(".calendar_c_box").html(calendarHTML);
	}

	// 获取最低价
	function myLowpricepick(city1, city2) {
	    var oData2 = '';

	    var xhr = '';
	    if (window.XMLHttpRequest) {
	        xhr = new XMLHttpRequest();
	    } else {
	        xhr = new ActiveXObject(' Microsoft . XMLHTTP');
	    }
	    //xhr.open('get','http://121.52.212.39:83/CabinCountSearch/api/LowPriceController/Search.do?from='+city1+'&to='+city2+'&date='+date+'&day='+days,'false');
	    //xhr.open('get',flightUrlprice+'/CabinCountSearch/api/LowPriceController/Search.do?from='+city1+'&to='+city2+'&date='+date+'&day='+days,'true');//  异步加载 最低价
	    xhr.open('get', '/icbc/ajax.aspx?from=' + city1 + '&to=' + city2 + '&act=GetLowPrice', 'true'); //  异步加载 最低价
	    xhr.send();
	    xhr.onreadystatechange = function () {
	        if (xhr.readyState == 4) {
	            // ajax 响内容解析完成，可以在客户端调用了
	            //$.qu('.lodin-p').style.display = 'none';
	            if (xhr.status == 200) {
	                //  判断服务器返回的状态 200 表示 正常

	                oData2 = JSON.parse(xhr.responseText);
	                //console.log(oData2)
	                var pricearr = [];
	                for (var p in oData2) {
	                    // var dateDiv = p.replace(jsonData.from + "_" + jsonData.to + "_", "");
	                    //console.log(dateDiv) // 时间
	                    pricearr.push(oData2[p]); //价格

	                }
	                // console.log(pricearr)
	                var htmlp = $.qus('.thettp1');
	                for (var i = 0; i < pricearr.length; i++) {
	                    if (pricearr[i] && pricearr[i] != 0) {
	                        htmlp[i].innerHTML = '￥' + pricearr[i];
	                    } else {
	                        htmlp[i].innerHTML = '￥--';
	                    }
	                }
	                for (var k = 0; k < htmlp.length; k++) {
	                    var noprice = htmlp[k];
	                    if (noprice.innerHTML == '') {
	                        noprice.style.display = 'none'; //
	                        var prenoode = $.firstChild(noprice.parentNode);
	                        prenoode.style.height = '40px';
	                        prenoode.style.lineHeight = '40px';
	                    }
	                }
	            } else {
	                //alert('出错了，价格查询异常！'); 超时也不管 试试
	                // myalertp('detail','出错了，价格查询异常！')
	            }
	        }
	    };
	}

/***/ },
/* 19 */
/***/ function(module, exports) {

	module.exports = "<div id=\"datep\">\r\n\t   <div id=\"date-t\">\r\n\t   \t  <a  id='dateBack' href=\"javascript:;\">关闭</a>\r\n\t   </div>\r\n\t   <div id=\"date-m\">\r\n\t   \t    <div id=\"date-m1\"></div>\r\n\t   </div>\r\n</div>\r\n"

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by way on 16/9/28.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _config = __webpack_require__(1);

	var _config2 = _interopRequireDefault(_config);

	var _api = __webpack_require__(7);

	var _kutil = __webpack_require__(6);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var $ = __webpack_require__(5); // myalertp 封装的 alert提示弹层

	var _view = __webpack_require__(21);

	var tcity = '';
	var OT = 1;
	var theID = '';
	var theCarrier = ''; //获取改签规则的数据
	var tobookdata1 = {}; // 单程数据→ book
	var tobookdata12 = {}; //防止被修改
	var backdatapro = ''; // 返程数据包
	var backprtyep = ''; // 判断是否要返程 在返程数据包里
	var myfromData = {}; //  去程需要调转的数据包 需要带回进行返程查找 最后在一起提交
	var fitstData = '';
	window.top.userName = '';
	window.top.userID = '';
	var timer = ''; // 定时器
	var Member = {};
	var flight1 = []; //存放 单程 或者去程 展示航班
	var flight2 = []; //存放 返程 展示航班

	var theCarrier = ''; // 航空公司号
	var DsOnePricep = ''; //匹配的 航司号


	var isTripp = 0; //表示没匹配   1//直营  0/非直营
	var thedatap = '';

	var thelowf = ''; // 存放 最低价数据
	var thelowfo = ''; // 存放 最低价格数据

	var pcnumdata = ''; //存放航班号


	var _class = function () {
	    function _class(opt) {
	        _classCallCheck(this, _class);

	        this.path = '/flightmb/product$';
	        this.hash = '/flightmb/product';
	        this.title = '产品详情';

	        opt = opt || {};
	        this.path = opt.path || this.path;
	        this.hash = opt.hash || this.hash;
	        this.title = opt.title || this.title;
	    }

	    // 输出视图


	    _createClass(_class, [{
	        key: 'view',
	        value: function view(cb) {
	            if (!_view) {
	                // 静态资源浏览器有缓存,增加时标,强制刷新!
	                (0, _api.getView)(_config2.default.view.searchJoin + '?t=' + +new Date(), '', function (rs) {
	                    _view = rs;
	                    cb(null, _view);
	                });
	            } else {
	                cb(null, _view);
	            }
	        }

	        // 在已经加载的视图上操作

	    }, {
	        key: 'bind',
	        value: function bind(dv, params) {

	            console.log(params);

	            var prt = params.prot;

	            if (prt == 1) {
	                var prAlldata = params.prData;
	                backdatapro = params.bdata;
	                backprtyep = backdatapro.backtype; //  单程为 1  往返 为2
	                //console.log(backprtyep);
	                theCarrier = prAlldata.theCarrier; // 获取航空公司号
	                pcnumdata = prAlldata.carrierabb2;
	                getDsOnePricepp(theCarrier, prAlldata); //  后台获取 要匹配的 航司号
	                thedatap = params.prData.prDate;
	            } else if (prt == 3) {
	                //console.log(params)
	                var prAlldata = params.prData;
	                fitstData = params.bdata;
	                backprtyep = 3; //  带往返数据 进入预定页面
	                theCarrier = prAlldata.theCarrier; // 获取航空公司号
	                Member: params.Member;
	                getDsOnePricepp(theCarrier, prAlldata);
	                thedatap = params.prData.prDate;
	            } else {}
	            // 什么都不做 2 就是预定界面返回的


	            // 页面返回
	            $.qu('.product-t1').onclick = function () {
	                $.router.go('#!/flightmb/detail', { cliktype: 3, ptdata: thedatap }, true);
	            };

	            // 头部 主页返回
	            $.qu('.p_home').onclick = function () {
	                $.router.go('#!/flightmb/join', '', false);
	            };

	            //  动态修改 头部电话
	            pullHeadphone(theCarrier);
	        }
	    }]);

	    return _class;
	}();

	//  动态修改 头部电话


	exports.default = _class;
	function pullHeadphone(cpnum) {

	    var telOB = $.qu('.p_phone');
	    if (cpnum == "CZ") {
	        getCZphone('CZ', telOB);
	    } else {
	        getCZphone('XHSV', telOB);
	    }
	}
	//页面填写数据
	function productPulldata(prAlldata) {

	    $.id('productcity0').innerHTML = prAlldata.RouteFrom;
	    $.id('productcity1').innerHTML = prAlldata.RouteTo;
	    $.id('ptime').innerHTML = prAlldata.prDate;
	    $.id('pwen').innerHTML = prAlldata.prWen; // 星期几
	    //起飞和降落的时间差
	    timetobf(prAlldata.FlyTime, prAlldata.arrtime);

	    $.qu('.phw-ml1sp1').innerHTML = prAlldata.FlyTime;
	    $.qu('.phw-ml1sp2').innerHTML = prAlldata.arrtime;
	    $.qu('.phw-ml3sp1').innerHTML = prAlldata.fromairport;
	    $.qu('.phw-ml31sp2').innerHTML = prAlldata.toairport;
	    $.id('pc').innerHTML = prAlldata.carrierabb;
	    $.id('plane').innerHTML = prAlldata.model; //bdata
	    if (prAlldata.JtStop == 0) {
	        $.qu('.theJT').style.display = 'none';
	    } else {
	        $.qu('.theJT').style.display = 'block';
	    }
	    flight1 = prAlldata.flight1data;

	    theCarrier = prAlldata.theCarrier; // 获取航空公司号

	    theID = prAlldata.pulId;

	    tobookdata1 = { // 单程 主要数据 不包含价格  原始数据  航班页面带过来的
	        data1: prAlldata.prDate,
	        pc: prAlldata.carrierabb1,
	        pcnum: prAlldata.carrierabb2,
	        ftime: prAlldata.FlyTime,
	        fplace: prAlldata.RouteFrom,
	        fport: prAlldata.fromairport,
	        ttime: prAlldata.arrtime,
	        tplace: prAlldata.RouteTo,
	        tport: prAlldata.toairport,
	        ZYtype: prAlldata.ZYtype,
	        theCarrier1: prAlldata.theCarrier,
	        //Discount:prAlldata.Discount,
	        YPrice: prAlldata.YPrice,
	        RouteFromCode: prAlldata.RouteFromCode,
	        RouteToCode: prAlldata.RouteToCode,
	        Lmodel: prAlldata.Lmodel,
	        Cabin1: prAlldata.Cabin,
	        Terminal: prAlldata.Terminal
	    };

	    tobookdata12 = deepCopy(tobookdata1); // 深拷贝 tobookdata1


	    myAjaxGetLowprice(theID, flight1, theCarrier);
	}

	//时间差函数
	function timetobf(datef, datet) {

	    var t11 = Number(datef.split(':')[0]) * 60 + Number(datef.split(':')[1]);
	    var t21 = Number(datet.split(':')[0]) * 60 + Number(datet.split(':')[1]);
	    var t12 = parseInt((t21 - t11) / 60);
	    var t22 = (t21 - t11) % 60;

	    if (t12 < 0) {
	        // 负数取余数
	        t12 += 23;
	        t22 += 60;
	    }
	    $.id('pH1').innerHTML = t12; //相差几小时
	    $.id('pH2').innerHTML = t22; //相差几分
	}

	// 获取 产品数据 ajax
	function myAjaxGetLowprice(theID, flight1, theCarrier) {
	    var param = {
	        "act": "SearchByCabinFlagJson",
	        "cabinFlag": theID
	    };
	    var oData2 = [];

	    var xhr = '';
	    if (window.XMLHttpRequest) {
	        xhr = new XMLHttpRequest();
	    } else {
	        xhr = new ActiveXObject(' Microsoft . XMLHTTP');
	    }
	    //xhr.open('get','http://106.75.131.58:8015/icbc/ajax.aspx?isKyReq=1&act='+param.act+'&cabinFlag='+param.cabinFlag,'false');
	    xhr.open('get', flightUrl + '/icbc/ajax.aspx?isKyReq=1&act=' + param.act + '&cabinFlag=' + param.cabinFlag, 'false');

	    xhr.send();
	    xhr.onreadystatechange = function () {
	        if (xhr.readyState == 4) {
	            // ajax 响内容解析完成，可以在客户端调用了
	            if (xhr.status == 200) {
	                //  判断服务器返回的状态 200 表示 正常
	                if (xhr.responseText != '') {
	                    var ldata = JSON.parse(xhr.responseText);
	                    //console.log(ldata.length)
	                    //console.log(ldata)
	                    ldata.unshift(flight1);
	                    oData2 = ldata;
	                } else {
	                    oData2.push(flight1);
	                }

	                //oData2 = xhr.responseText;
	                console.log(oData2);
	                $.qu('.pro-main-wrap').innerHTML = '';
	                proPulldatanew(oData2, theCarrier);
	                datashow(); // 更多航班按钮
	                getjiad(); //余票展示
	                ptoMybook(); //预定函数
	                // 退改详情
	                getChangeData();
	            } else {
	                // alert('出错了，获取产品出错！');
	                (0, _api.myalertp)('myproduct', '出错了，获取产品出错。');
	            }
	        }
	    };
	}
	//  获取最低价航班信息
	function getloapriceflight(data) {

	    var theolddatalow = data;
	    var theolddatalowo = deepCopy(data);

	    var allflig = $.qus('.promiandata-l3');
	    var thelowflight = ''; //浮动价格需要
	    var thelowflighto = ''; //最低价格需要
	    var theindex = 0; // 获取 最低价 索引
	    var thedisc = []; //  所有 经济舱 折扣 数组
	    var dataarr = []; // 折扣 数组对应的  舱位基础信息
	    var dataarrno = []; //不是经济舱 的 所有基础仓位的数组


	    for (var i = 0; i < allflig.length; i++) {
	        var zYt = allflig[i].getAttribute('zytypep');
	        var dis = allflig[i].getAttribute('discount');
	        var cabi = allflig[i].getAttribute('cabinlevel').indexOf('经济');

	        if (isTripp == 1) {
	            // 航司匹配 说明 为直营且能卖差旅的票 南航
	            if (zYt == 1) {
	                if (cabi != -1) {
	                    //选出经济舱位
	                    var thed = dis;
	                    if (thed == '全价') {
	                        thed = '10';
	                    } else {
	                        thed = dis.replace('折', '');
	                    }
	                    thedisc.push(Number(thed));
	                    dataarr.push(allflig[i]);
	                } else {
	                    dataarrno.push(allflig[i]);
	                }
	            }
	        } else {
	            if (zYt == 0) {
	                //  非直营 机票
	                if (cabi != -1) {
	                    //选出经济舱位
	                    var thed = dis;
	                    if (thed == '全价') {
	                        thed = '10';
	                    } else {
	                        thed = dis.replace('折', '');
	                    }
	                    thedisc.push(Number(thed));
	                    dataarr.push(allflig[i]);
	                } else {
	                    dataarrno.push(allflig[i]);
	                }
	            }
	        }
	    }
	    var flightdiscount = {
	        floatnum: 2,
	        min: 7,
	        max: 8
	    };
	    //var sthedisc = thedisc.sort() 不需要排序??
	    var len = thedisc.length; // 7折为界线  6.8为是否浮动界线
	    if (len != 0) {
	        if (len == 1) {
	            theindex = 0;
	        } else if (len >= 2) {
	            if (thedisc[0] >= flightdiscount.min) {
	                theindex = 0;
	            } else {
	                // 小于基础折扣

	                if (thedisc[1] <= thedisc[0] + flightdiscount.floatnum && thedisc[1] < flightdiscount.max) {
	                    // 6.3 /7.6

	                    theindex = 1;
	                } else {
	                    theindex = 0;
	                }
	            }
	        }
	        thelowflight = dataarr[theindex];
	    } else {
	        // 要 区分 直营 和非直营 深航的时候  只能选 非直营列表的 第一个
	        //没有经济舱位 的时候 最低价 为非直营列表的第一个(南航除外 没有经济舱位  就是 当前列表的第一个)  价格最低
	        thelowflight = dataarrno[0];
	    }

	    //console.log('打印最低价索引')
	    //console.log(theindex)
	    //console.log('打印最低价航班基础信息')
	    //console.log(thelowflight)

	    // 最低价航班数据打包

	    theolddatalow.pice1 = thelowflight.getAttribute('proprice'); // 添加价格
	    theolddatalow.theCa = thelowflight.getAttribute('seachprice'); // 添加查询价格 必备参数
	    theolddatalow.CabinType = thelowflight.getAttribute('cabinType'); // 判断是否是直营
	    theolddatalow.InsureType = thelowflight.getAttribute('insureType'); // 保险类型

	    theolddatalow.zytypep = thelowflight.getAttribute('zytypep'); // 判断是否是直营zytypep
	    theolddatalow.hbjine = thelowflight.getAttribute('hbjine'); // hbjine 红包价格
	    theolddatalow.hashongbao = thelowflight.getAttribute('hashongbao'); // 判断是否有红包 hashongbao
	    theolddatalow.isTrippok = thelowflight.getAttribute('isTrippok'); //  航司匹配与否
	    theolddatalow.ZhPolicyId = thelowflight.getAttribute('ZhPolicyId'); //
	    theolddatalow.cabindesc = thelowflight.getAttribute('cabindesc'); // 川航 字段1
	    theolddatalow.sequencenumber = thelowflight.getAttribute('sequencenumber'); // 川航 字段2
	    theolddatalow.cbcount = thelowflight.getAttribute('CbCount'); // 剩余票数量
	    theolddatalow.discount = thelowflight.getAttribute('Discount'); // 当前航班的折扣
	    theolddatalow.cabinlevel = thelowflight.getAttribute('cabinlevel'); // 舱位判断

	    if (dataarr.length != 0) {
	        // 有经济舱位
	        thelowflighto = dataarr[0];
	    } else {
	        // 没有经济舱位
	        thelowflighto = dataarrno[0];
	    }

	    theolddatalowo.pice1 = thelowflighto.getAttribute('proprice'); // 添加价格
	    theolddatalowo.theCa = thelowflighto.getAttribute('seachprice'); // 添加查询价格 必备参数
	    theolddatalowo.CabinType = thelowflighto.getAttribute('cabinType'); // 判断是否是直营
	    theolddatalowo.InsureType = thelowflighto.getAttribute('insureType'); // 保险类型

	    theolddatalowo.zytypep = thelowflighto.getAttribute('zytypep'); // 判断是否是直营zytypep
	    theolddatalowo.hbjine = thelowflighto.getAttribute('hbjine'); // hbjine 红包价格
	    theolddatalowo.hashongbao = thelowflighto.getAttribute('hashongbao'); // 判断是否有红包 hashongbao
	    theolddatalowo.isTrippok = thelowflighto.getAttribute('isTrippok'); //  航司匹配与否
	    theolddatalowo.ZhPolicyId = thelowflighto.getAttribute('ZhPolicyId'); //
	    theolddatalowo.cabindesc = thelowflighto.getAttribute('cabindesc'); // 川航 字段1
	    theolddatalowo.sequencenumber = thelowflighto.getAttribute('sequencenumber'); // 川航 字段2
	    theolddatalowo.cbcount = thelowflighto.getAttribute('CbCount'); // 剩余票数量
	    theolddatalowo.discount = thelowflighto.getAttribute('Discount'); // 当前航班的折扣
	    theolddatalowo.cabinlevel = thelowflighto.getAttribute('cabinlevel'); // 当前航班的折扣

	    thelowf = theolddatalow;
	    thelowfo = theolddatalowo;
	    //console.log(thelowf)
	}
	//对象 深拷贝
	function deepCopy(source) {
	    var result = {};
	    for (var key in source) {
	        result[key] = _typeof(source[key]) === 'object' ? deepCoyp(source[key]) : source[key];
	    }
	    return result;
	}

	//预订函数
	function ptoMybook() {

	    $.each($.qus('.promiandata-l3'), function () {

	        this.onclick = function () {
	            tobookdata1.pice1 = this.getAttribute('proprice'); // 添加价格
	            tobookdata1.theCa = this.getAttribute('seachprice'); // 添加查询价格 必备参数
	            tobookdata1.CabinType = this.getAttribute('cabinType'); // 判断是否是直营
	            tobookdata1.InsureType = this.getAttribute('insureType'); // 保险类型

	            tobookdata1.zytypep = this.getAttribute('zytypep'); // 判断是否是直营zytypep
	            tobookdata1.hbjine = this.getAttribute('hbjine'); // hbjine 红包价格
	            tobookdata1.hashongbao = this.getAttribute('hashongbao'); // 判断是否有红包 hashongbao
	            tobookdata1.isTrippok = this.getAttribute('isTrippok'); //  航司匹配与否
	            tobookdata1.ZhPolicyId = this.getAttribute('ZhPolicyId'); //
	            tobookdata1.cabindesc = this.getAttribute('cabindesc'); // 川航 字段1
	            tobookdata1.sequencenumber = this.getAttribute('sequencenumber'); // 川航 字段2
	            tobookdata1.cbcount = this.getAttribute('CbCount'); // 剩余票数量
	            tobookdata1.discount = this.getAttribute('Discount'); // 当前航班的 折扣
	            tobookdata1.cabinlevel = this.getAttribute('cabinlevel'); // 舱位判断


	            //console.log(tobookdata1);


	            var pfjprice = getbasep();
	            //SetCookie('xhtime',1,6);//  设置定时器 cookie 6分钟 值为1
	            if (backprtyep == 3) {
	                //// 带着往 返数据 进入 预定界面
	                //$.router.go('#!/flightmb/book',{pbtype:3,ptbdata1:tobookdata1,ptbdata2:fitstData,Member:Member},true)
	                // 判断直营 判断2次航班 必须都是是直营
	                var fromzytype = fitstData.zytypep;
	                var tozytype = tobookdata1.zytypep;
	                //console.log('去程直营'+fromzytype+',返程直营'+tozytype);
	                var alertms = '抱歉，您还未登陆，请前往登陆页面~~';
	                if (fromzytype == 1) {
	                    if (tozytype == 1) {
	                        // 带着往 返数据 进入 预定界面
	                        tobookdata1.thelowf = thelowf;
	                        tobookdata1.thelowfo = thelowfo;
	                        var allbookdata = { pbtype: 3, ptbdata1: tobookdata1, ptbdata2: fitstData, Member: Member, pfjprice: pfjprice, isclearps: 1 };
	                        var allbookdatastr = JSON.stringify(allbookdata);
	                        //console.log(allbookdatastr);

	                        (0, _api.userOnoffpp)('p', function () {
	                            $.router.go('#!/flightmb/book', { pbtype: 3, ptbdata1: tobookdata1, ptbdata2: fitstData, Member: Member, pfjprice: pfjprice, isclearps: 1 }, true);
	                        }, 'myproduct', '.lodinp', allbookdatastr, alertms, 1);
	                    } else {
	                        //alert('请选择与去程同一航司直营航班，航司直营无法与其他航班混合下单')
	                        (0, _api.myalertp)('myproduct', '请选择与去程同一航司直营航班，航司直营无法与其他航班混合下单。');
	                    }
	                } else {
	                    //fromzytype ==0
	                    if (tozytype == 0) {
	                        // 都不是直营
	                        tobookdata1.thelowf = thelowf;
	                        tobookdata1.thelowfo = thelowfo;
	                        var allbookdata = { pbtype: 3, ptbdata1: tobookdata1, ptbdata2: fitstData, Member: Member, pfjprice: pfjprice, isclearps: 1 };
	                        var allbookdatastr = JSON.stringify(allbookdata);
	                        //console.log(allbookdatastr)
	                        (0, _api.userOnoffpp)('p', function () {
	                            $.router.go('#!/flightmb/book', { pbtype: 3, ptbdata1: tobookdata1, ptbdata2: fitstData, Member: Member, pfjprice: pfjprice, isclearps: 1 }, true);
	                        }, 'myproduct', '.lodinp', allbookdatastr, alertms, 1);
	                    } else {
	                        //alert('请选择与去程同一航司直营航班，航司直营无法与其他航班混合下单')
	                        (0, _api.myalertp)('myproduct', '请选择与去程同一航司直营航班，航司直营无法与其他航班混合下单。');
	                    }
	                }
	            } else if (backprtyep == 1) {
	                //console.log(tobookdata1)

	                // backprtyep  值 为1 或者2  2为往返
	                tobookdata1.thelowf = thelowf;
	                tobookdata1.thelowfo = thelowfo;
	                var allbookdata = { pbtype: 3, ptbdata1: tobookdata1, ptbdata2: '', Member: Member, pfjprice: pfjprice, isclearps: 1 };
	                var allbookdatastr = JSON.stringify(allbookdata);
	                //console.log(allbookdatastr);
	                //console.log(allbookdatastr);
	                //userOnoffpp(num,fn,pageid,layercla,dataname,data)

	                (0, _api.userOnoffpp)('p', function () {
	                    // 单程 直接进入预定界面

	                    $.router.go('#!/flightmb/book', { pbtype: 3, ptbdata1: tobookdata1, ptbdata2: '', Member: Member, pfjprice: pfjprice, isclearps: 1 }, true);
	                }, 'myproduct', '.lodinp', allbookdatastr, alertms, 1);
	            } else if (backprtyep == 2) {
	                //
	                tobookdata1.thelowf = thelowf;
	                tobookdata1.thelowfo = thelowfo;
	                myfromData = tobookdata1; // 去程数据打包
	                $.router.go('#!/flightmb/detail', { cliktype: 4, ptbdata1: myfromData, searchbdata: backdatapro, thelowf: thelowf }, true);
	            }
	        };
	    });
	}
	///////////////
	//   获取 Y以上仓位  的基础仓位  F/P  J 的价格函数
	function getbasep() {
	    var allpr = $.qus('.promiandata-l3');
	    var P = '';
	    var F = '';
	    var G = '';
	    var J = '';
	    for (var i = 0; i < allpr.length; i++) {
	        var cab = $.attr(allpr[i], 'seachprice');
	        if (cab == 'P') {
	            P = $.attr(allpr[i], 'proprice');
	        } else if (cab == 'J') {
	            J = $.attr(allpr[i], 'proprice');
	        } else if (cab == 'F') {
	            F = $.attr(allpr[i], 'proprice');
	        } else if (cab == 'G') {
	            G = $.attr(allpr[i], 'proprice');
	        }
	    }

	    var json = {
	        P: P,
	        F: F,
	        G: G,
	        J: J
	    };
	    return json;
	}

	/////////////////////////////////////////////////////
	// 页面数据整合 更新

	// 页面数据格式整合
	function proPulldatanew(data, theCarrier) {
	    var zydata = [];
	    var xhdata = [];
	    for (var i = 0; i < data.length; i++) {
	        if (data[i].CabinType == 6 || isTripp == 1) {
	            //直营航班
	            zydata.push(data[i]);
	        } else {
	            //非直营航班
	            xhdata.push(data[i]);
	        }
	    }

	    //return str
	    //console.log('直营航班数据')
	    //console.log(zydata)
	    //console.log('非直营航班数据')
	    //console.log(xhdata)
	    var zylen = zydata.length;
	    var xhlen = xhdata.length;
	    var allhtml = '';
	    if (zylen == 0 && xhlen != 0) {
	        for (i = 0; i < xhlen; i++) {
	            allhtml += creathtmlxh(xhdata[i], 1);
	        }
	    } else if (zylen != 0 && xhlen == 0) {
	        for (i = 0; i < zylen; i++) {
	            allhtml += creathtmlzy(zydata[i], 2); // 2表示 全部为直营航班 1表示都有
	        }
	    } else if (zylen != 0 && xhlen != 0) {
	        allhtml = newhtmlfn(zydata, 2, theCarrier) + newhtmlfn(xhdata, 1, theCarrier);
	    } else {
	        allhtml = '暂时没有数据';
	    }
	    $.qu('.pro-main-wrap').innerHTML = allhtml;
	    $.each($.qus('.themore1'), function () {
	        if ($.attr(this, 'hashongbaoe') == 'false') {
	            this.style.display = 'none';
	        }
	    });

	    getloapriceflight(tobookdata12);
	}
	// 下拉 页面展示
	function datashow() {
	    var allpulldaxh = $.qus('.xhflight');
	    var allpulldazy = $.qus('.zyflight');
	    var btnproxh = $.qu('.fmoret'); //fmoretz
	    var btnprozy = $.qu('.fmoretz');
	    var onoffbtn = true;
	    var onoffbtnz = true; // 直营 更多航班按钮
	    if (btnproxh) {
	        btnproxh.onclick = function () {
	            //console.log('点击事件触发了')
	            if (onoffbtn) {
	                for (var i = 0; i < allpulldaxh.length; i++) {
	                    //allpulldaxh[i].style.display = 'block';
	                    $.removeClass(allpulldaxh[i], 'xhflight');
	                }
	                onoffbtn = false;
	            } else {
	                for (var _i = 0; _i < allpulldaxh.length; _i++) {
	                    //allpulldaxh[i].style.display = 'none';addClass
	                    //allpulldaxh[i].className('promiandata xhflight')
	                    $.addClass(allpulldaxh[_i], 'xhflight');
	                }
	                onoffbtn = true;
	            }
	        };
	    }
	    if (btnprozy) {
	        btnprozy.onclick = function () {
	            if (onoffbtnz) {

	                for (var i = 0; i < allpulldazy.length; i++) {
	                    allpulldazy[i].style.display = 'block';
	                }
	                onoffbtnz = false;
	            } else {
	                for (var i = 0; i < allpulldazy.length; i++) {
	                    allpulldazy[i].style.display = 'none';
	                }
	                onoffbtnz = true;
	            }
	        };
	    }
	}

	function newhtmlfn(data, type, theCarrier) {
	    // data  为直营 或者非直营数据   type 1/2  判断直营 非直营
	    var dlength = data.length;
	    var str = '';
	    var str1 = '';
	    var str2 = '';
	    // 川航直营 特殊参数
	    var cabinDesc = '';
	    var sequenceNumber = '';
	    if (type == 1) {
	        // 非直营
	        if (dlength != 0) {
	            if (dlength > 1) {
	                str1 = '<ul class="promiandata"><li class="promiandata-l1"><span class="prprice">￥<strong class="theprice">' + data[0].Fare + '</strong></span><span class="themore1" Hashongbaoe="' + data[0].Hashongbao + '" ><span class="lite">红包立减</span><em class="litep">￥</em><em class="themore">' + data[0].HBJinE + '</em></span></li><li class="promiandata-l2"><strong class="thecabin">' + data[0].CabinLevel + '</strong><span class="numticks"><em class="onlybn" style="display: none;">仅</em><em class="prnum">' + data[0].CbCount + '张</em><em class="prmove ">+</em></span><span class="thediscount">' + data[0].Discount + '</span></li><li class=" promiandata-l4" ><span class="promiandata-l3" proprice ="' + data[0].Fare + '" seachprice="' + data[0].Cabin + '" CabinType="' + data[0].CabinType + '" InsureType="' + data[0].InsureType + '"  zytypep =0  isTrippok=2   HBJinE="' + data[0].HBJinE + '" Hashongbao ="' + data[0].Hashongbao + '"  ZhPolicyId =1  cabinDesc =""  sequenceNumber =""  CbCount="' + data[0].CbCount + '"  discount="' + data[0].Discount + '" cabinLevel="' + data[0].CabinLevel + '" >预订</span></li><li class="promiandata-l5"><span class="changepage" data="' + data[0].Cabin + '" prPRice="' + data[0].Fare + '" CabinLevel="' + data[0].CabinLevel + '" >退改签规定</span><span class="xhcredit ">该航班支持授信月结</span><span class="fmoret"  >更多舱位<img class="fmore" src="https://cos.uair.cn/mb/img/botom.png" alt=""></span></li></ul>';
	                for (var i = 1; i < data.length; i++) {
	                    str2 += creathtmlxh(data[i], 2); //非直营航班
	                }
	                str = str1 + str2;
	                return str;
	            } else {
	                // 只有一条数据
	                str1 = '<ul class="promiandata"><li class="promiandata-l1"><span class="prprice">￥<strong class="theprice">' + data[0].Fare + '</strong></span><span class="themore1" Hashongbaoe="' + data[0].Hashongbao + '" ><span class="lite">红包立减</span><em class="litep">￥</em><em class="themore">' + data[0].HBJinE + '</em></span></li><li class="promiandata-l2"><strong class="thecabin">' + data[0].CabinLevel + '</strong><span class="numticks"><em class="onlybn" style="display: none;">仅</em><em class="prnum">' + data[0].CbCount + '张</em><em class="prmove ">+</em></span><span class="thediscount">' + data[0].Discount + '</span></li><li class=" promiandata-l4" ><span class="promiandata-l3" proprice ="' + data[0].Fare + '" seachprice="' + data[0].Cabin + '" CabinType="' + data[0].CabinType + '" InsureType="' + data[0].InsureType + '"  zytypep =0  isTrippok=2   HBJinE="' + data[0].HBJinE + '" Hashongbao ="' + data[0].Hashongbao + '"  ZhPolicyId =1  cabinDesc =""  sequenceNumber =""  CbCount="' + data[0].CbCount + '"  discount="' + data[0].Discount + '" cabinLevel="' + data[0].CabinLevel + '"  >预订</span></li><li class="promiandata-l5"><span class="changepage" data="' + data[0].Cabin + '" prPRice="' + data[0].Fare + '" CabinLevel="' + data[0].CabinLevel + '" >退改签规定</span><span class="xhcredit ">该航班支持授信月结</span></li></ul>';
	                str = str1;
	                return str;
	            }
	        } else {
	            //没得数据
	            str = '';
	            return str;
	        }
	    } else {
	        // 直营数据
	        var purl = '';
	        // var ptext ='';
	        var ptextp = '';
	        switch (theCarrier) {// 还原航空公司号
	            case "ZH":
	                purl = 'img/zy_ZH';
	                ptextp = '无差旅月结,无配送';
	                break;
	            case "CZ":
	                purl = 'img/zy_CZ';
	                ptextp = '差旅月结,无配送';
	                break;
	            case "3U":
	                purl = 'img/zy_3U';
	                ptextp = '无差旅月结,无保险,无配送';
	                break;
	            case "HU":
	                purl = 'img/zy_HU';
	                ptextp = '无差旅月结,无保险,无配送';
	                break;
	        }
	        if (dlength != 0) {
	            var isTrippok = 0;
	            if (isTripp == 1) {
	                // 航司匹配
	                isTrippok = 1;
	            } else {
	                // 航司不匹配
	                isTrippok = 0;
	            }
	            if (data[0].ZhPolicyId == null) {
	                data[0].ZhPolicyId = 1;
	            }

	            if (!data[0].ChOtherParam) {
	                cabinDesc = '';
	                sequenceNumber = '';
	            } else {
	                cabinDesc = data[0].ChOtherParam.cabinDesc;
	                sequenceNumber = data[0].ChOtherParam.sequenceNumber;
	            }

	            if (dlength > 1) {
	                str1 = '<ul class="promiandata"><li class="promiandata-l1"><span class="prprice">￥<strong class="theprice">' + data[0].Fare + '</strong></span><span class="themore1" Hashongbaoe=0 style=" color: #e61515;padding-left: 0.2rem;" >官方直营</span></li><li class="promiandata-l2"><strong class="thecabin">' + data[0].CabinLevel + '</strong><span class="numticks"><em class="onlybn" style="display: none;">仅</em><em class="prnum">' + data[0].CbCount + '张</em><em class="prmovez ">+</em></span><span class="thediscount">' + data[0].Discount + '</span></li><li class=" promiandata-l4" ><span class="promiandata-l3" proprice ="' + data[0].Fare + '" seachprice="' + data[0].Cabin + '" CabinType="' + data[0].CabinType + '" InsureType="' + data[0].InsureType + '" zytypep =1   isTrippok="' + isTrippok + '"  HBJinE="' + data[0].HBJinE + '" Hashongbao ="' + data[0].Hashongbao + '"  ZhPolicyId ="' + data[0].ZhPolicyId + '"  cabinDesc ="' + cabinDesc + '"  sequenceNumber ="' + sequenceNumber + '"  CbCount="' + data[0].CbCount + '"  discount="' + data[0].Discount + '" cabinLevel="' + data[0].CabinLevel + '"  >预订</span></li><li class="promiandata-l5"><span class="changepage" data="' + data[0].Cabin + '" prPRice="' + data[0].Fare + '" CabinLevel="' + data[0].CabinLevel + '" >退改签规定</span><span class="xhcredit ">' + ptextp + '</span><span class="fmoretz">更多舱位<img class="fmore" src="https://cos.uair.cn/mb/img/botom.png" alt=""></span></li></ul>';
	                for (var i = 1; i < data.length; i++) {
	                    str2 += creathtmlzy(data[i], 1); //直营 隐藏 航班
	                    // zhiy
	                }
	                str = str1 + str2;
	                return str;
	            } else {
	                // 只有一条数据
	                str1 = '<ul class="promiandata"><li class="promiandata-l1"><span class="prprice">￥<strong class="theprice">' + data[0].Fare + '</strong></span><span class="themore1" Hashongbaoe=0 style=" color: #e61515;padding-left: 0.2rem;" >官方直营</span></li><li class="promiandata-l2"><strong class="thecabin">' + data[0].CabinLevel + '</strong><span class="numticks"><em class="onlybn" style="display: none;">仅</em><em class="prnum">' + data[0].CbCount + '张</em><em class="prmovez ">+</em></span><span class="thediscount">' + data[0].Discount + '</span></li><li class=" promiandata-l4" ><span class="promiandata-l3" proprice ="' + data[0].Fare + '" seachprice="' + data[0].Cabin + '" CabinType="' + data[0].CabinType + '" InsureType="' + data[0].InsureType + '" zytypep =1   isTrippok="' + isTrippok + '"  HBJinE="' + data[0].HBJinE + '" Hashongbao ="' + data[0].Hashongbao + '"  ZhPolicyId ="' + data[0].ZhPolicyId + '"  cabinDesc ="' + cabinDesc + '"  sequenceNumber ="' + sequenceNumber + '" CbCount="' + data[0].CbCount + '"  discount="' + data[0].Discount + '"  cabinLevel="' + data[0].CabinLevel + '"  >预订</span></li><li class="promiandata-l5"><span class="changepage" data="' + data[0].Cabin + '" prPRice="' + data[0].Fare + '" CabinLevel="' + data[0].CabinLevel + '" >退改签规定</span><span class="xhcredit ">' + ptextp + '</span></span></li></ul>';
	                str = str1;
	                return str;
	            }
	        } else {
	            //没得数据
	            str = '';
	            return str;
	        }
	    }
	}
	//  非直营  航班 数据
	function creathtmlxh(datax, n) {
	    var xhtext = '';
	    var xhclass = '';
	    if (n == 2) {
	        xhtext = '该航班支持授信月结';
	        xhclass = '  xhflight';
	    } else {
	        xhtext = '';
	        xhclass = '';
	    }
	    var strr = '<ul class="promiandata' + xhclass + ' " ><li class="promiandata-l1"><span class="prprice">￥<strong class="theprice">' + datax.Fare + '</strong></span><span class="themore1" Hashongbaoe="' + datax.Hashongbao + '" ><span class="lite">红包立减</span><em class="litep">￥</em><em class="themore">' + datax.HBJinE + '</em></span></li><li class="promiandata-l2"><strong class="thecabin">' + datax.CabinLevel + '</strong><span class="numticks"><em class="onlybn" style="display: none;">仅</em><em class="prnum">' + datax.CbCount + '张</em><em class="prmove ">+</em></span><span class="thediscount">' + datax.Discount + '</span></li><li class=" promiandata-l4" ><span class="promiandata-l3" proprice ="' + datax.Fare + '" seachprice="' + datax.Cabin + '" CabinType="' + datax.CabinType + '" InsureType="' + datax.InsureType + '"  zytypep =0  isTrippok=2   HBJinE="' + datax.HBJinE + '" Hashongbao ="' + datax.Hashongbao + '"  ZhPolicyId =1  cabinDesc =""  sequenceNumber ="" CbCount="' + datax.CbCount + '"  discount="' + datax.Discount + '"             cabinLevel="' + datax.CabinLevel + '"  >预订</span></li><li class="promiandata-l5"><span class="changepage" data="' + datax.Cabin + '" prPRice="' + datax.Fare + '" CabinLevel="' + datax.CabinLevel + '" >退改签规定</span><span class="xhcredit ">' + xhtext + '</span></li></ul>';

	    return strr;
	}

	//  直营  航班 数据
	function creathtmlzy(dataz, n) {
	    var zyclass = '';
	    if (n == 1) {
	        // 直营和非直营都有
	        zyclass = '  zyflight';
	    } else {
	        zyclass = '';
	    }
	    var purl = '';
	    var ptextp = '';
	    switch (theCarrier) {// 还原航空公司号
	        case "ZH":
	            purl = 'img/zy_ZH';
	            ptextp = '无差旅月结,无配送';
	            break;
	        case "CZ":
	            purl = 'img/zy_CZ';
	            ptextp = '有差旅月结,无配送';
	            break;
	        case "3U":
	            purl = 'img/zy_3U';
	            ptextp = '无差旅月结,无保险,无配送';
	            break;
	        case "HU":
	            purl = 'img/zy_HU';
	            ptextp = '无差旅月结,无保险,无配送';
	            break;
	    }
	    var strzy = '';
	    var cabinDesc = '';
	    var sequenceNumber = '';
	    var isTrippok = 0;
	    if (isTripp == 1) {
	        // 航司匹配
	        isTrippok = 1;
	    } else {
	        // 航司不匹配
	        isTrippok = 0;
	    }
	    if (dataz.ZhPolicyId == null) {
	        dataz.ZhPolicyId = 1;
	    }

	    if (!dataz.ChOtherParam) {
	        cabinDesc = '';
	        sequenceNumber = '';
	    } else {
	        cabinDesc = dataz.ChOtherParam.cabinDesc;
	        sequenceNumber = dataz.ChOtherParam.sequenceNumber;
	    }
	    strzy = '<ul class="promiandata ' + zyclass + ' "><li class="promiandata-l1"><span class="prprice">￥<strong class="theprice">' + dataz.Fare + '</strong></span><span class="themore1" Hashongbaoe=0 style=" color: #e61515;padding-left: 0.2rem;" >官方直营</span></li><li class="promiandata-l2"><strong class="thecabin">' + dataz.CabinLevel + '</strong><span class="numticks"><em class="onlybn" style="display: none;">仅</em><em class="prnum">' + dataz.CbCount + '张</em><em class="prmovez  ">+</em></span><span class="thediscount">' + dataz.Discount + '</span></li><li class=" promiandata-l4" ><span class="promiandata-l3" proprice ="' + dataz.Fare + '" seachprice="' + dataz.Cabin + '" CabinType="' + dataz.CabinType + '" InsureType="' + dataz.InsureType + '" zytypep =1   isTrippok="' + isTrippok + '"  HBJinE="' + dataz.HBJinE + '" Hashongbao ="' + dataz.Hashongbao + '"  ZhPolicyId ="' + dataz.ZhPolicyId + '"  cabinDesc ="' + cabinDesc + '"  sequenceNumber ="' + sequenceNumber + '"  CbCount="' + dataz.CbCount + '" discount="' + dataz.Discount + '" cabinLevel="' + dataz.CabinLevel + '"  >预订</span></li><li class="promiandata-l5"><span class="changepage" data="' + dataz.Cabin + '" prPRice="' + dataz.Fare + '" CabinLevel="' + dataz.CabinLevel + '" >退改签规定</span><span class="xhcredit ">' + ptextp + '</span></li></ul>';

	    return strzy;
	}

	// 退改说明
	function getChangeData() {
	    var changes = $.qus('.changepage');
	    for (var i = 0; i < changes.length; i++) {

	        changes[i].onclick = function () {
	            var dt1 = this.getAttribute('data');
	            var dt2 = $.nextNode(this).innerHTML;
	            //$.qu('.numticks1').innerHTML =dt2;
	            $.qu('.changepagbox-price-sp3').innerHTML = this.getAttribute('cabinlevel');
	            $.qu('.x-price-sp11').innerHTML = this.getAttribute('prprice');

	            $.qu('.changepagbox').style.display = 'block';
	            myAjaxChange(theCarrier, dt1);
	        };
	    }
	    $.qu('.changepagbox-close').onclick = function () {
	        $.qu('.changepagbox').style.display = 'none';
	        // $.qu('.numticks1').innerHTML ='';

	    };
	}

	// 该退说明
	function myAjaxChange(carrier, seat) {

	    $.qu('.lodinp').style.display = '-webkit-box';
	    //console.log(carrier+seat)
	    var oData2 = '';
	    var xhr = '';
	    if (window.XMLHttpRequest) {
	        xhr = new XMLHttpRequest();
	    } else {
	        xhr = new ActiveXObject(' Microsoft . XMLHTTP');
	    }
	    //xhr.open('get','http://106.75.131.58:8015/icbc/ajax.aspx?isKyReq=1&act=getOtherKyData&ACTION=GetRefundDef&carrier='+carrier+'&seat='+seat+'&reqPath=utlsiteservice.aspx','false');
	    xhr.open('get', flightUrl + '/icbc/ajax.aspx?isKyReq=1&act=getOtherKyData&ACTION=GetRefundDef&carrier=' + carrier + '&seat=' + seat + '&reqPath=utlsiteservice.aspx', 'true');
	    xhr.send();
	    xhr.onreadystatechange = function () {
	        if (xhr.readyState == 4) {
	            // ajax 响内容解析完成，可以在客户端调用了
	            if (xhr.status == 200) {
	                //  判断服务器返回的状态 200 表示 正常
	                //  隐藏loading
	                $.qu('.lodinp').style.display = 'none';
	                if (xhr.responseText != '') {
	                    oData2 = eval(xhr.responseText);
	                    //console.log(oData2)
	                    $.qu('.changetex1').innerHTML = oData2[0].EndorseNotice;
	                    $.qu('.changetex2').innerHTML = oData2[0].UpNotice;
	                    $.qu('.changetex3').innerHTML = oData2[0].RefundNotice;
	                } else {
	                    $.qu('.changetex1').innerHTML = '退改签规则以航空公司最新规则为准';
	                    $.qu('.changetex2').innerHTML = '退改签规则以航空公司最新规则为准';
	                    $.qu('.changetex3').innerHTML = '退改签规则以航空公司最新规则为准';
	                }
	            } else {
	                //alert('出错了，获取退改签出错！');
	                (0, _api.myalertp)('myproduct', '出错了，获取退改签出错。');
	            }
	        }
	    };
	}
	//  判断 票张数
	function getjiad() {
	    var thenums = $.qus('.prnum');
	    //console.log(thenums.length)
	    for (var i = 0; i < thenums.length; i++) {
	        var oPrev = thenums[i].previousElementSibling || thenums[i].previousSibling;
	        var oPnex = thenums[i].nextElementSibling || thenums[i].nextSibling;
	        if (thenums[i].innerHTML == 'A张') {
	            thenums[i].innerHTML = '9张';

	            oPrev.style.display = 'none'; // 隐藏 仅
	            oPnex.style.display = 'inline-block'; // 显示 +

	        } else {
	            oPrev.style.display = 'inline-block'; // 显示 仅
	            oPnex.style.display = 'none'; // 隐藏 +
	        }
	    }
	}

	// 获取直营 标志 DsOnePrice
	function getDsOnePricepp(cp, data) {
	    var oData2 = '';
	    var xhr = '';
	    if (window.XMLHttpRequest) {
	        xhr = new XMLHttpRequest();
	    } else {
	        xhr = new ActiveXObject(' Microsoft . XMLHTTP');
	    }
	    //xhr.open('get','http://106.75.131.58:8015/icbc/xhService.ashx?act=GETDSONEPRICE','false');
	    xhr.open('get', flightUrl + '/icbc/xhService.ashx?act=GETDSONEPRICE', 'false'); // 非异步 阻塞
	    xhr.send();
	    xhr.onreadystatechange = function () {
	        if (xhr.readyState == 4) {
	            // ajax 响内容解析完成，可以在客户端调用了
	            if (xhr.status == 200) {
	                //$.qu('.lodin-pa').style.display ='none';
	                //  判断服务器返回的状态 200 表示 正常
	                var data1 = eval('(' + xhr.responseText + ')');
	                if (data1 != '') {
	                    oData2 = data1.DsOnePrice;
	                    // DsOnePriceBackp(oData2);
	                    var thecps = oData2.split(',');
	                    for (var i = 0; i < thecps.length; i++) {
	                        if (cp == thecps[i]) {
	                            isTripp = 1; //直营
	                            break;
	                        } else {
	                            isTripp = 0; //非直营
	                        }
	                    }
	                    productPulldata(data);
	                } else {
	                    //alert('获取直营参数失败！')
	                    (0, _api.myalertp)('myproduct', '获取直营参数失败。');
	                }
	            } else {
	                //alert('出错了，获取直营参数超时！');
	                (0, _api.myalertp)('myproduct', '获取直营参数失败。');
	            }
	        }
	    };
	}

	//// 新的登陆方式
	//function userOnoffpp(num,fn,pageid,layercla,data) {
	//
	//    $.qu(layercla).style.display = '-webkit-box';
	//
	//    var mycode = encodeURIComponent(String(num));
	//    document.cookie = "tkey=0";
	//    document.cookie = "userName=";
	//    document.cookie = "userID=";
	//
	//    var myUrl =getBaseUrl( window.location.href)+'?entry_code='+mycode;
	//
	//    var oData2 = '';
	//    var xhr = new XMLHttpRequest();
	//    var reqPath = flightUrl+'/icbc/xhService.ashx?act=checkLogin&returnUri=' + myUrl;
	//    //var reqPath = flightUrl+'/icbc/xhService.ashx?act=checkLogin&returnUri=' + myUrl;
	//    xhr.open('get', reqPath, 'false');
	//    xhr.send();
	//    xhr.onreadystatechange = function () {
	//        if (xhr.readyState == 4) {
	//            // ajax 响内容解析完成，可以在客户端调用了
	//            if (xhr.status == 200) {
	//                $.qu(layercla).style.display = 'none';
	//                //  判断服务器返回的状态 200 表示 正常
	//                oData2 = JSON.parse(xhr.responseText);
	//                //oData2 =eval(xhr.responseText)
	//                var sta = oData2.Status;
	//                var url = oData2.Result;
	//                //alert(url)
	//                if (sta == 1) {
	//                    // 1表示已经登录了
	//
	//                    document.cookie = "userName=" + url.MemberName;
	//                    document.cookie = "userID=" + url.CardNo;
	//                    fn();
	//                    //alert('已经登陆')
	//                    console.log('初次每次都要验证！');
	//                } else {
	//                    //没有登录
	//                    //
	//                    // document.cookie = "tkey=0";
	//                    document.cookie = "userName=";
	//                    document.cookie = "userID=";
	//                    location.href = "/html5/" + url;
	//                    //alert('跳转登陆界面');
	//                    localStorage.setItem('allbookdatastr',data)
	//                }
	//            } else {
	//                //alert('初次验证出错了，Err' + xhr.status);
	//                myalertp(pageid,'验证用户登录出问题。')
	//            }
	//        }
	//    };
	//}
	//顶部电话图标电话号码修改


	function getCZphone(key, el) {
	    (0, _api.myget)(flightUrl + '/icbc/xhService.ashx', 'act=GETSERVICEPHONE&Source=' + key, true, function (err, res) {
	        if (err) {
	            (0, _api.myalertp)('router0', '出错了，获取客服联系电话失败！');
	        } else {
	            var oData3 = eval('(' + res + ')');
	            var phonts = oData3.Result.Phone;
	            var phontn = oData3.Result.Source;
	            el.href = 'tel:' + phonts;
	        }
	    });
	}

/***/ },
/* 21 */
/***/ function(module, exports) {

	module.exports = "\r\n\r\n<div id=\"myproduct\">\r\n        <div class=\"lodinp\">\r\n              <!--<div id=\"caseBlanche\">-->\r\n                <!--<div id=\"rond\">-->\r\n                  <!--<div id=\"test\"></div>-->\r\n                <!--</div>-->\r\n                <!--<div id=\"load\">-->\r\n                  <!--<p>航班查询中...</p>-->\r\n                <!--</div>-->\r\n              <!--</div>-->\r\n             <img class=\"xhlog\" src=\"https://cos.uair.cn/mb/img/xhlog.gif\" />\r\n         </div>\r\n        <div id=\"product-t\">\r\n            <span class=\"product-t1\"><img src=\"https://cos.uair.cn/mb/img/back.bg.png\" alt=\"\"></span>\r\n            <div class=\"productcity\">\r\n               <span class=\"product-t2\">去:</span>\r\n              <span id=\"productcity0\"></span>\r\n              <span id=\"productcity2\">→</span>\r\n              <span id=\"productcity1\"></span>\r\n            </div>\r\n            <a href=\"\" class=\"p_phone\"></a>\r\n            <img src=\"https://cos.uair.cn/mb/img/h_home.png\" class=\"p_home\" alt=\"\"/>\r\n\r\n        </div>\r\n        <div class=\"product-h\">\r\n             <div class=\"product-hwrap\">\r\n                    <div class=\"phw-t\">\r\n                        <span class=\"phw-tsp1\" ><em id=\"ptime\" ></em> <em id=\"pwen\"></em> <em id=\"pH1\">1</em>H<em id=\"pH2\">26</em>m</span>\r\n\r\n                    </div>\r\n                    <ul class=\"phw-m\">\r\n                        <li class=\"phw-ml1\">\r\n                            <span class=\"phw-ml1sp1\"></span>\r\n                            <span class=\"phw-ml1sp2\"></span>\r\n                        </li >\r\n                        <li class=\"phw-ml2\"><span class=\"d-wrapl1-sp2 d-line\"><strong></strong></span></li>\r\n                        <li class=\"phw-ml3\">\r\n                            <span class=\"phw-ml3sp1\"></span>\r\n                            <span class=\"phw-ml31sp2\"></span>\r\n                        </li >\r\n                        <li class=\"phw-ml4\">\r\n                             <span class=\"phw-ml4sp1\"><em id=\"pc\"></em> | <em id=\"plane\"></em></span>\r\n                        </li>\r\n                        <li class=\"theJT\"><span>经停</span></li>\r\n                    </ul>\r\n             </div>\r\n        </div>\r\n        <div id=\"pro-main\">\r\n            <div class=\"pro-main-wrap\"></div>\r\n        </div>\r\n        <div class=\"changepagbox\" >\r\n            <div class=\"changepagbox-wrap\">\r\n                 <div class=\"changepagbox-t\">\r\n                    <strong >退改签规定</strong>\r\n                    <img class=\"changepagbox-close\" src=\"https://cos.uair.cn/mb/img/close.bg.png\" alt=\"\">\r\n                 </div>\r\n                 <ul class=\"changepagbox-text\">\r\n                    <li>\r\n                        <strong>签转规定:</strong>\r\n                        <span class=\"changetex1\">不允许</span>\r\n                    </li>\r\n                    <li>\r\n                         <strong>改期规定:</strong>\r\n                         <span class=\"changetex2\">起飞前（含）收取票面价10%的改期费；起飞后收取票面价20%的改期费；涉及升舱，则改签费和升舱费需同时收取</span>\r\n                    </li>\r\n                    <li>\r\n                         <strong>退票规定:</strong>\r\n                         <span class=\"changetex3\">起飞前（含）收取票面价20%的退票费；起飞后收取票面价30%的退票费</span>\r\n                    </li>\r\n                 </ul>\r\n                 <strong  class=\"changepagbox-p\">退改签规则以航空公司最新规则为准</strong>\r\n                 <div class=\"changepagbox-price\">\r\n\r\n                        <span class=\"changepagbox-price-sp1\"><em>￥</em><em class=\"x-price-sp11\">570</em></span>\r\n                        <!-- <span class=\"numticks numticks1\"></span> -->\r\n                        <span  class=\"changepagbox-price-sp3\">经济舱</span>\r\n                        <span  class=\"thebookBtton\">预订</span>\r\n                 </div>\r\n            </div>\r\n        </div>\r\n</div>\r\n"

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by way on 16/9/28.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _config = __webpack_require__(1);

	var _config2 = _interopRequireDefault(_config);

	var _api = __webpack_require__(7);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var $ = __webpack_require__(5);
	// myalertp 封装的 alert提示弹层
	//myalert('allmytickes','')
	var _view = __webpack_require__(23);

	var phonenum = ''; // 存放ajax获取的电话号码
	// var fcity = 'a';
	// var tcity ='';
	// var OT = 1;
	// var theID ='';
	// var theCarrier=''; //获取改签规则的数据


	var _class = function () {
	    function _class(opt) {
	        _classCallCheck(this, _class);

	        this.path = '/flightmb/allmytickes$';
	        this.hash = '/flightmb/allmytickes';
	        this.title = '我的机票';

	        opt = opt || {};
	        this.path = opt.path || this.path;
	        this.hash = opt.hash || this.hash;
	        this.title = opt.title || this.title;
	    }

	    // 输出视图


	    _createClass(_class, [{
	        key: 'view',
	        value: function view(cb) {
	            if (!_view) {
	                // 静态资源浏览器有缓存,增加时标,强制刷新!
	                (0, _api.getView)(_config2.default.view.searchJoin + '?t=' + +new Date(), '', function (rs) {
	                    _view = rs;
	                    cb(null, _view);
	                });
	            } else {
	                cb(null, _view);
	            }
	        }

	        // 在已经加载的视图上操作

	    }, {
	        key: 'bind',
	        value: function bind(dv, params) {

	            //setTitle(`我的机票`);

	            var myurl = window.location.href.split('/');
	            var myurlkey = myurl[myurl.length - 1];
	            console.log(myurlkey);

	            //alert(`${history.length}`)
	            //alert(`${history[0]}`)

	            $.qu('.tab-item1').onclick = function () {
	                $.router.go('#!/flightmb/join', {}, false);
	                $.qu('.thephone1').style.display = 'none';
	            };

	            //  测试加入 所有电话
	            pullallmyphone();
	            $.qu('.tab-item31').onclick = function () {
	                // 电话弹层

	                $.qu('.thephone1').style.display = '-webkit-box';
	                //console.log(phonenum);
	                pullnumtohtml(phonenum);
	            };

	            //  我的历史订单
	            $.qu('.allmytickes-m10').onclick = function () {
	                $.router.go('#!/flightmb/allmybook', { btype: 1 }, true);
	            };
	            $.qu('.allmytickes-m11').onclick = function () {
	                // 乘机人
	                $.router.go('#!/flightmb/passenger', { btype: 2 }, true);
	            };
	            $.qu('.allmytickes-m12').onclick = function () {
	                // 联系人
	                $.router.go('#!/flightmb/mychalinkp', { btype: 3 }, true);
	            };
	            $.qu('.allmytickes-m13').onclick = function () {
	                // 地址
	                $.router.go('#!/flightmb/contactpeople', { btype: 4 }, true);
	            };
	            //退出登录 ../icbc/logout.aspx?type=wap
	            $.qu('.allmytickes-sb').style.display = 'none';

	            $.qu('.allmytickes-sb').onclick = function () {
	                //location.href = 'http://106.75.131.58:8015/icbc/logout.aspx?type=wap';
	                document.cookie = "xhtime=0";
	                document.cookie = "tkey=0";
	                location.href = flightUrl + '/icbc/logout.aspx?type=wap';
	                //console.log(document.cookie)
	            };
	        }
	    }]);

	    return _class;
	}();

	// 电话按顺序整合


	exports.default = _class;
	function pullnumtohtml(phonenum) {

	    var arrdata = phonenum.split(',');
	    //console.log(arrdata);
	    arrdata.length = 5;
	    var data = arrdata.sort(); //排序 按顺序后
	    var data1 = [];
	    for (var i = 0; i < data.length; i++) {
	        data1.push(data[i].split('|')[1]);
	    }
	    //console.log(data1)

	    var text = ['南航直营客服电话：', '深航直营客服电话：', '川航直营客服电话：', '非直营机票客服电话：', '投诉电话：'];

	    var str2 = ' <span class="thephone-sp1">确定</span>';
	    //var

	    var str1 = '';
	    for (var i = 0; i < data1.length; i++) {
	        var phone = data1[i].replace(/-/g, '');
	        str1 += '<p><span>' + text[i] + '</span><a href="tel:' + phone + '">' + phone + '</a></p>';
	    }
	    var str3 = str1 + str2;
	    $.qu('.thephone-wrap1').innerHTML = str3;
	    // 隐藏 电话页面
	    $.qu('.thephone-sp1').onclick = function () {
	        $.qu('.thephone1').style.display = 'none';
	    };
	}

	function getallphonenum(key, n) {
	    var oData3 = '';
	    var xhr = '';
	    if (window.XMLHttpRequest) {
	        xhr = new XMLHttpRequest();
	    } else {
	        xhr = new ActiveXObject(' Microsoft . XMLHTTP');
	    }
	    //xhr.open('get','http://106.75.131.58:8015/icbc/xhService.ashx?act=GETSERVICEPHONE&Source=XHSV','false');
	    xhr.open('get', flightUrl + '/icbc/xhService.ashx?act=GETSERVICEPHONE&Source=' + key, 'false');

	    xhr.send();
	    xhr.onreadystatechange = function () {
	        if (xhr.readyState == 4) {
	            // ajax 响内容解析完成，可以在客户端调用了
	            if (xhr.status == 200) {
	                //  判断服务器返回的状态 200 表示 正常
	                oData3 = eval('(' + xhr.responseText + ')');
	                //console.log(oData3)
	                var phonts = oData3.Result.Phone;
	                var phontn = oData3.Result.Source;
	                var dt = n + phontn + '|' + phonts;
	                getmyphone(dt);
	            } else {
	                //alert('出错了，获取客服联系电话失败！');
	                (0, _api.myalertp)('router0', '出错了，获取客服联系电话失败！');
	            }
	        }
	    };
	}
	// 回调函数 获取电话
	function getmyphone(data) {
	    phonenum += data + ',';
	}

	//  5个电话 综合 篇
	function pullallmyphone() {
	    getallphonenum('XHSV', 4);
	    getallphonenum('XHTS', 5);
	    getallphonenum('CZ', 1);
	    getallphonenum('ZH', 2);
	    getallphonenum('3U', 3);
	}

/***/ },
/* 23 */
/***/ function(module, exports) {

	module.exports = "<div id=\"allmytickes\">\r\n      <div class=\"thephone1\">\r\n          <div class=\"thephone-wrap1\">\r\n              <!--<p><span>客服电话：</span><a href=\"tel:18325078979\">18325078979</a></p>-->\r\n              <!--<p><span>客服电话：</span><a href=\"tel:4000662188\">4000662188</a></p>-->\r\n              <!--<p><span>客服电话：</span><a href=\"tel:18325078979\">18325078979</a></p>-->\r\n              <!--<span class=\"thephone-sp11\">确定</span>-->\r\n          </div>\r\n\r\n      </div>\r\n      <div class=\"allmytickes-t\">\r\n          <span class=\"allmytickes-tt2\">我的机票</span>\r\n      </div>\r\n      <div class=\"allmytickes-m1 allmytickes-m10\"><span>机票订单</span><img src=\"https://cos.uair.cn/mb/img/right.png\" alt=\"\"></div>\r\n      <div class=\"allmytickes-m1 allmytickes-m11\"><span>常用乘机人</span><img src=\"https://cos.uair.cn/mb/img/right.png\" alt=\"\"></div>\r\n      <div class=\"allmytickes-m1 allmytickes-m12\"><span>常用联系人</span><img src=\"https://cos.uair.cn/mb/img/right.png\" alt=\"\"></div>\r\n      <div class=\"allmytickes-m1 allmytickes-m13\"><span>常用地址</span><img src=\"https://cos.uair.cn/mb/img/right.png\" alt=\"\"></div>\r\n\r\n      <span class=\"allmytickes-sb\">退出登录</span>\r\n      <nav class=\"bar bar-tab\">\r\n          <strong class=\"tab-item  tab-item1 \" >\r\n               <span class=\"tab-label1\">机票查询</span>\r\n          </strong>\r\n          <strong class=\"tab-item  tab-item2 active \" >\r\n               <span class=\"tab-label2\">我的机票</span>\r\n          </strong>\r\n          <strong class=\"tab-item tab-item31 \" >\r\n               <span class=\"tab-label3 \">联系客服</span>\r\n          </strong>\r\n      </nav>\r\n\r\n</div>\r\n"

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by way on 16/9/28.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _config = __webpack_require__(1);

	var _config2 = _interopRequireDefault(_config);

	var _api = __webpack_require__(7);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var $ = __webpack_require__(5);
	// myalertp 封装的 alert提示弹层
	//myalertp('passenger','出错了，获取客服联系电话失败！')
	//import {getView, get, post ,myalertp,prototype,core,Converter,BusinessTravelTool,Dept,MGOpt,MemberOpt,OrderSubmitOpt,RsaTool,mycheckuser,SetCookie,getCookieVal,GetCookie} from '../util/api';// myalertp 封装的 alert提示弹层
	var _view = __webpack_require__(25);

	var bte = 2;
	var backFlight = ''; // 存放 往返标记

	var flightPes = null;
	var alertms = ''; // 弹出层 提示语言

	var _class = function () {
	    function _class(opt) {
	        _classCallCheck(this, _class);

	        this.path = '/flightmb/passenger$';
	        this.hash = '/flightmb/passenger';
	        this.title = '常用乘机人';

	        opt = opt || {};
	        this.path = opt.path || this.path;
	        this.hash = opt.hash || this.hash;
	        this.title = opt.title || this.title;
	    }

	    // 输出视图


	    _createClass(_class, [{
	        key: 'view',
	        value: function view(cb) {
	            if (!_view) {
	                // 静态资源浏览器有缓存,增加时标,强制刷新!
	                (0, _api.getView)(_config2.default.view.searchJoin + '?t=' + +new Date(), '', function (rs) {
	                    _view = rs;
	                    cb(null, _view);
	                });
	            } else {
	                cb(null, _view);
	            }
	        }

	        // 在已经加载的视图上操作

	    }, {
	        key: 'bind',
	        value: function bind(dv, params) {
	            bte = params.btype;
	            console.log(bte);
	            // 清空搜索数据 的样式修改
	            deteledata();

	            if (bte == 1) {
	                //  预定页面进入的
	                alertms = '';
	                //  返回上一页
	                $.qu('.passenger-tt1').onclick = function () {
	                    $.router.go('#!/flightmb/book', {}, false);
	                };
	                backFlight = params.backFlight;
	            } else {
	                alertms = '抱歉，您的登陆超时，请重新登录~~';
	                $.qu('.passenger-tt1').onclick = function () {
	                    $.router.go('#!/flightmb/allmytickes', {}, false);
	                };
	            }
	            // 乘机人数据加载 需要验证登陆


	            (0, _api.userOnoffpp)('s', pullPassData, 'passenger', '.lodinpass', '', alertms);
	            //pullPassData();
	            //mycheckuser('passenger',function (){
	            //    console.log('乘机人登录验证通过')
	            //    pullPassData();
	            //})
	            // 初始点击事件
	            // 新增加乘机人
	            $.qu('.addpger').onclick = function () {

	                $.router.go('#!/flightmb/changepassenger', { btype: 11, linktype: bte }, true);
	            };
	        }
	    }]);

	    return _class;
	}();
	//清空输入数据


	exports.default = _class;
	function deteledata() {
	    $.qu('.searpger-bn').innerHTML = '清空';
	    $.qu('.searpger-te').value = '';
	    $.qu('.searpger-bn').style.width = '20%';
	    $.qu('.searpger-bn').style.background = '#9a8c8c';
	    $.qu('.searpger-te').style.width = '72%';
	}

	//  初始点击事件
	function theClick() {
	    //删除弹层
	    $.each($.qus('.mianpger-boxbtn1'), function () {
	        this.onclick = function (e) {
	            var that = this;
	            //弹层

	            $.qu('.mianpger-boxbtn1lay').style.display = '-webkit-box';
	            $.qu('.boxbtn1lay-boxsp1').onclick = function () {
	                // that.parentNode.style.display = 'none';
	                var theid = that.parentNode.getAttribute('psid');

	                var dataass = {
	                    id: theid
	                };
	                (0, _api.userOnoffpp)('s', function () {
	                    mypost('/ajaxpro/UairB2C.MGOpt,UairB2C.ashx', dataass, 'DelPassenger', function (err, res) {
	                        var bdata = eval('(' + res + ')');
	                        //console.log(bdata)
	                        if (bdata.value) {
	                            var json = JSON.parse(bdata.value);
	                            //console.log(json)
	                            if (json) {
	                                //重新加载  乘机人数据加载
	                                pullPassData();
	                            } else {
	                                //alert("删除乘机人失败");
	                                (0, _api.myalertp)('passenger', '删除乘机人失败');
	                            }
	                        } else {
	                            //alert("删除乘机人失败");
	                            (0, _api.myalertp)('passenger', '删除乘机人失败');
	                        }
	                    });
	                }, 'passenger', '.lodinpass', '', alertms);

	                $.qu('.mianpger-boxbtn1lay').style.display = 'none';
	            };
	            $.qu('.boxbtn1lay-boxsp2').onclick = function () {
	                $.qu('.mianpger-boxbtn1lay').style.display = 'none';
	            };

	            var e = e || window.e;
	            e.stopPropagation();
	        };
	    });
	    //修改乘机人
	    $.each($.qus('.mianpger-boxbtn2'), function () {
	        var _that = this;
	        _that.onclick = function (e) {
	            var passdata = {
	                name: _that.getAttribute('name'),
	                age: _that.getAttribute('age'),
	                card: _that.getAttribute('card'),
	                nb: _that.getAttribute('nb'),
	                ftype: _that.getAttribute('ftype'),
	                fnumber: _that.getAttribute('fnumber'),
	                birthday: _that.getAttribute('psbirthday')
	            };

	            $.router.go('#!/flightmb/changepassenger', { btype: 22, linktype: bte, pda: passdata }, true);
	            var e = e || window.e;
	            e.stopPropagation();
	        };
	    });
	    //筛选乘机人
	    // 先隐藏 筛选功能
	    //
	    //$.qu('.searpger-bn').onclick = function(){
	    //
	    //    var thename = $.qu('.searpger-te').value;
	    //    var allnames = $.qus('.mianpger-name') ;
	    //    if(thename !=''){
	    //        var  arrdata = [];
	    //        for(var i= 0;i<allnames.length;i++){
	    //            var nameall= allnames[i].innerHTML;
	    //            console.log(thename)
	    //            if(nameall.indexOf(thename) != -1){
	    //
	    //                arrdata.push(i)
	    //            }
	    //            allnames[i].parentNode.parentNode.style.display ='none';
	    //        }
	    //        console.log(arrdata)
	    //        if(arrdata.length !=0){
	    //            for(var j= 0;j<arrdata.length; j++){
	    //                allnames[arrdata[j]].parentNode.parentNode.style.display ='block';
	    //            }
	    //        }else{
	    //            myalertp('passenger','抱歉，未找到相应乘机人！')
	    //            for(var i= 0;i<allnames.length;i++){
	    //                allnames[i].parentNode.parentNode.style.display ='block';
	    //            }
	    //        }
	    //
	    //    }else{
	    //        //myalertp('passenger','请输入关键字：姓、姓名等！')
	    //
	    //        for(var i= 0;i<allnames.length;i++){
	    //            allnames[i].parentNode.parentNode.style.display ='block';
	    //        }
	    //    }
	    //};

	    var allnames = $.qus('.mianpger-name');
	    var allnameslen = $.qus('.mianpger-name').length;
	    $.qu('.searpger-bn').onclick = function () {
	        $.qu('.searpger-te').value = '';

	        for (var i = 0; i < allnameslen; i++) {
	            allnames[i].parentNode.parentNode.style.display = 'block';
	        }
	    };

	    $.qu('.searpger-te').onkeyup = function (e) {
	        var e = e || window.e;
	        //alert(e.keyCode);
	        var keynum = e.keyCode;
	        var thename = $.qu('.searpger-te').value;
	        if (keynum == 8 && !thename) {
	            //alert(`清空的搜索！`);

	            for (var i = 0; i < allnameslen; i++) {
	                allnames[i].parentNode.parentNode.style.display = 'block';
	            }
	        }
	    };

	    $.qu('.searpger-te').oninput = function () {
	        var thename = $.qu('.searpger-te').value;
	        if (thename) {

	            var arrdata = [];
	            for (var i = 0; i < allnameslen; i++) {
	                var nameall = allnames[i].innerHTML;
	                console.log(thename);
	                if (nameall.indexOf(thename) != -1) {

	                    arrdata.push(i);
	                }
	                // allnames[i].parentNode.parentNode.style.display ='none';
	            }
	            console.log(arrdata);
	            if (arrdata.length != 0) {

	                for (var i = 0; i < allnameslen; i++) {
	                    allnames[i].parentNode.parentNode.style.display = 'none';
	                }

	                for (var j = 0; j < arrdata.length; j++) {
	                    allnames[arrdata[j]].parentNode.parentNode.style.display = 'block';
	                }
	            }
	        }
	    };
	}

	//选择乘机人
	function addthePeople() {
	    var allbox = $.qus('.mianpger-box');

	    for (var i = 0; i < allbox.length; i++) {
	        allbox[i].onclick = function () {
	            var xhdata = JSON.parse(this.getAttribute('data'));
	            var odat = {
	                psid: this.getAttribute('psid'),
	                data: xhdata
	            };
	            if (odat.data.Age == '儿童') {
	                if (backFlight) {
	                    // 往返
	                    //alert('儿童不能选择往返航班！')
	                    (0, _api.myalertp)('passenger', '儿童不能选择往返航班');
	                } else {
	                    //alert(bte)
	                    if (bte == 1) {
	                        //  返回book页面
	                        //let idnolen = xhdata.IDNo ? xhdata.IDNo.length:0;
	                        //if( idnolen ==8 || idnolen ==18){
	                        //    $.router.go('#!/flightmb/book',{pbtype:1,pdata:odat},true)
	                        //}else{
	                        //    myalertp('passenger','儿童证件号码有误，请核实')
	                        //}

	                        $.router.go('#!/flightmb/book', { pbtype: 1, pdata: odat }, true);
	                    } else {
	                        // $.router.go('#!/flightmb/allmytickes',{},true)
	                    }
	                }
	            } else {
	                //成人 或者 老人
	                //alert(bte)
	                if (bte == 1) {
	                    var idnolen = xhdata.IDNo ? xhdata.IDNo.length : 0;
	                    var xhphone = xhdata.Phone;
	                    var idtype = xhdata.IDType;

	                    if (idtype == '身份证') {
	                        if (idnolen == 18) {
	                            // 成人而 且 为身份证 且 身份证号码长度为18
	                            $.router.go('#!/flightmb/book', { pbtype: 1, pdata: odat }, true);
	                        } else {
	                            (0, _api.myalertp)('passenger', '身份证号码有误,请核实');
	                        }
	                    } else {
	                        if (xhdata.IDNo) {
	                            $.router.go('#!/flightmb/book', { pbtype: 1, pdata: odat }, true);
	                        } else {
	                            (0, _api.myalertp)('passenger', '证件号码为空,请核实');
	                        }
	                    }

	                    //  返回上一页
	                    //$.router.go('#!/flightmb/book',{pbtype:1,pdata:odat},true)
	                } else {
	                        // $.router.go('#!/flightmb/allmytickes',{},true)
	                    }
	            }
	        };
	    }
	}

	// 乘机人数据加载
	function pullPassData() {
	    $.qu('.lodinpass').style.display = '-webkit-box';

	    // 以下 为旧接口 获取数据
	    var urlmy = flightUrl + "/ajaxpro/UairB2C.MGOpt,UairB2C.ashx";
	    var methodmy = "GetPassengers";

	    //var datamy = {
	    //  'xslpath':'icbc/xslt/book-passengers.xslt'
	    //}
	    var datamy = {
	        'xslpath': 'json'
	    };
	    var oTxt = null; // 返回的json数据
	    var oC = null;
	    var newOc = null;
	    var plan = null;

	    // var newData = null;
	    var arrList = [];
	    var newsss = null;
	    // myalertp('passenger','抱歉，以下弹出提示为测试安卓手机兼容问题，请不要慌张，下单购票都能正常使用！')
	    //alert('ajax数据请求')
	    mypostAjax(urlmy, datamy, methodmy, function (a, b) {
	        if (a == null) {
	            //成功

	            // alert('获取数据成功')
	            //alert(a)
	            // alert(b);
	            //alert( typeof b);
	            $.qu('.lodinpass').style.display = 'none';
	            // alert( typeof  b)

	            var dat1 = JSON.parse(b).value;
	            //alert( dat1);


	            //oTxt =JSON.parse(JSON.parse(b).value);

	            //for (var  attr in oTxt.Passengers) {
	            //    //alert(attr)
	            //    //if(k==1){
	            //    //    dato.plan =oTxt.Passengers[attr];
	            //    //    break;
	            //    //}
	            //    //k++;
	            //}

	            //alert(`乘机人数量${psg.length}`);
	            if (!dat1) {
	                $.qu('.pger-wrap').innerHTML = '没有常用乘机人，请重新添加！';
	            } else {
	                oTxt = JSON.parse(dat1);
	                var psg = oTxt.Passengers.Passenger;
	                var dato = {
	                    plan: ''
	                };

	                //for (var  attr in oTxt.Passengers) {
	                //    console.log(attr);
	                //    //if(k==1){
	                //    //    dato.plan =oTxt.Passengers[attr];
	                //    //    break;
	                //    //}
	                //    //k++;
	                //}

	                var k = 0;
	                for (var attr in oTxt.Passengers) {
	                    console.log(attr);
	                    if (k == 1) {
	                        dato.plan = oTxt.Passengers[attr];
	                        break;
	                    }
	                    k++;
	                }
	                var plandata = JSON.parse(dato.plan);
	                console.log(plandata);
	                if (plandata.length != 0) {
	                    // 有plan数据
	                    for (var i = 0; i < psg.length; i++) {
	                        psg[i].planda = [];
	                        for (var j = 0; j < plandata.length; j++) {
	                            if (psg[i].ID == plandata[j].PassengerID) {
	                                plandata[j].StartDate = plandata[j].StartDate.split(' ', 2)[0];
	                                plandata[j].EndDate = plandata[j].EndDate.split(' ', 2)[0];
	                                psg[i].planda.push(plandata[j]);
	                            }
	                        }
	                    }
	                } else {
	                    // 没有plan数据 pland为空
	                    for (var i = 0; i < psg.length; i++) {
	                        psg[i].planda = [];
	                    }
	                }
	                //for (var i = 0; i < psg.length; i++) {
	                //           psg[i].planda=[];
	                //}

	                arrList = psg;

	                //alert(arrList.length);
	                if (arrList.length > 10) {
	                    //  乘机人 大于 10 出现搜索框
	                    $.qu('.searpger').style.display = 'block';
	                    //$.qu('.searpger').style.top = '2.8rem';
	                    $.qu('.mianpger').style.top = '7.3rem';
	                } else {
	                    $.qu('.searpger').style.display = 'none';
	                    //$.qu('.searpger').style.top = '0';
	                    $.qu('.mianpger').style.top = '5.2rem';
	                }
	                console.log(arrList);
	                topasengerHtml(arrList); // 页面加载数据
	                //  搜索按钮点击
	                theClick();
	                // 带数据返回预定界面
	                addthePeople();
	            }
	        } else {
	            // alert('出错了，Err' +xhr.status);
	            (0, _api.myalertp)('passenger', '获取乘机人出错了，Err');
	        }
	    });
	}

	// 乘机人数据整合html
	function topasengerHtml(data) {
	    var str = '';
	    var psData = [];
	    //alert(`循环开始`);
	    if (!data.length) {
	        psData.push(data);
	    } else {
	        psData = data;
	    };

	    for (var i = 0; i < psData.length; i++) {
	        var theage = psData[i].Age ? psData[i].Age : '';
	        var theidno = psData[i].IDNo ? psData[i].IDNo : '';
	        var theidtype = psData[i].IDType ? psData[i].IDType : '';

	        var xhidnoshow1 = psData[i].IDNo ? psData[i].IDNo : '';
	        var xhidnoshow = '';
	        var xhtype = psData[i].IDType ? psData[i].IDType : '';
	        var psbirthday = psData[i].birthday ? psData[i].birthday.split(' ')[0] : '';
	        var birthday = '';
	        if (psbirthday) {
	            var myTime1 = psbirthday;
	            var myTime = new Date(myTime1);
	            birthday = myTime.getFullYear() + toTwo(myTime.getMonth() + 1) + toTwo(myTime.getDate());
	            psData[i].birthday = birthday;
	        }

	        if (xhidnoshow1 && xhtype == '护照' && xhidnoshow1.indexOf(':') != -1) {
	            xhidnoshow = xhidnoshow1.split(':')[0];
	            psData[i].birthday = birthday = psbirthday = xhidnoshow1.split(':')[1];
	        } else {
	            xhidnoshow = psData[i].IDNoShow ? psData[i].IDNoShow : '';
	        }

	        //  再次根据 身份证 或者出生日期 判断 成人 儿童 老人
	        if (theage == '儿童') {
	            if (theidtype == '身份证') {
	                if (theidno.length == 8) {
	                    // 说明为出生日期
	                    theage = isAge(theidno, 12) ? '儿童' : '成人';
	                } else if (theidno.length == 18) {
	                    // 说明 儿童为身份证
	                    theage = isAge(theidno, 12) ? '儿童' : '成人';
	                }
	            } else if (theidtype == '护照') {
	                // 不是身份证 还无法验证。。。
	                theage = isAge(birthday, 12) ? '儿童' : '成人';
	            }
	        } else {
	            if (theidtype == '身份证' && theidno.length == 18) {
	                var birthdaycard = theidno.substr(6, 8);
	                theage = isAge(birthdaycard, 65) ? '成人' : '老人';
	            } else if (theidtype == '护照') {
	                // 不是身份证 还无法验证。。。
	                theage = isAge(birthday, 12) ? '儿童' : '成人';
	                if (theage == '成人') {
	                    theage = isAge(birthday, 65) ? '成人' : '老人';
	                }
	            }
	        }
	        // 根据具体年龄 显示老人 或者儿童

	        psData[i].Age = theage;

	        //alert(`计算老人儿童通过`)
	        var data1 = psData[i];
	        if (!psData[i].rule) {
	            psData[i].rule = '0';
	        }

	        var data = JSON.stringify(data1);
	        //alert(`对象转换为字符串成功`)
	        //console.log(JSON.parse(data).age)
	        var phoneshow = psData[i].PhoneShow ? psData[i].PhoneShow : '';
	        var phonenum = psData[i].Phone ? psData[i].Phone : '';

	        var xhid = psData[i].ID ? psData[i].ID : '';
	        var xhname = psData[i].Name ? psData[i].Name : '';
	        var xhage = psData[i].Age ? '(' + theage + ')' : '';
	        var xhagel = psData[i].Age ? psData[i].Age : '';

	        str += '<div class="mianpger-box" ruletype="' + psData[i].rule + '"   psid="' + xhid + '"  data=' + data + '><p><span class="mianpger-name">' + xhname + xhage + '</span></p>' + '<p><span class="mianpger-card">' + xhtype + '</span><span class="mianpger-num">' + xhidnoshow + '</span></p>' + '<p><span class="mianpger-ph">手机号</span><span class="mianpger-phnum">' + phoneshow + '</span></p>' + '<span class="mianpger-boxbtn1">删除</span>' + '<span class="mianpger-boxbtn2" name="' + xhname + '" age ="' + xhagel + '" card="' + xhtype + '"  nb="' + xhidnoshow + '"  ftype ="' + xhid + '"  fnumber="' + phonenum + '" psbirthday="' + birthday + '" >修改</span></div>';
	        //alert(`部分数据尝试成功`)
	    }
	    //console.log(psData);
	    //alert(str);
	    $.qu('.pger-wrap').innerHTML = str;
	}

	function isAge(time, y) {
	    var myTime = new Date(); //数据类型为 对象
	    var n = myTime.getFullYear() + toTwo(myTime.getMonth() + 1) + toTwo(myTime.getDate());
	    //console.log(n)


	    //var n =New Data();
	    var bData = time;
	    var nData = new Date();
	    var bYear = parseInt(bData.substr(0, 4));
	    //console.log(bYear)
	    var nYear = nData.getFullYear();
	    var bMonth = parseInt(bData.substr(4, 2));
	    var nMonth = nData.getMonth();
	    var bDay = parseInt(bData.substr(6, 2));
	    var nDay = nData.getDate();
	    if (n != null && n != undefined) {
	        nYear = parseInt(n.substr(0, 4));
	        nMonth = parseInt(n.substr(4, 2));
	        nDay = parseInt(n.substr(6, 2));
	    }
	    var childType = false;
	    if (nYear - bYear > y) {
	        childType = false;
	    } else if (nYear - bYear == y) {
	        if (nMonth - bMonth > 0) {
	            childType = false;
	        } else if (nMonth - bMonth == 0) {
	            if (nDay - bDay >= 0) {
	                childType = false;
	            } else {
	                childType = true;
	            }
	        } else {
	            childType = true;
	        }
	    } else {
	        childType = true;
	    }
	    return childType;
	}

	function toTwo(n) {
	    //  转换为 带0的
	    return n < 10 ? '0' + n : '' + n;
	}

	//myajax

	function mypostAjax(url, data, method, cb) {
	    var xhr = '';
	    if (window.XMLHttpRequest) {
	        xhr = new XMLHttpRequest();
	    } else {
	        xhr = new ActiveXObject(' Microsoft . XMLHTTP');
	    }

	    xhr.onreadystatechange = function () {
	        if (xhr.readyState === 4 && cb) {
	            if (xhr.status === 200) cb(null, xhr.responseText);else cb(new Error(xhr.status), xhr.responseText);
	        }
	    };

	    // 异步 post,回调通知
	    xhr.open('POST', url, true);
	    var param = data;
	    if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object') param = JSON.stringify(data);

	    xhr.setRequestHeader('Content-Type', 'text/plain; charset=utf-8');
	    xhr.setRequestHeader('X-AjaxPro-Method', method);
	    xhr.send(param);
	}

	//身份证加"*"处理 分两种情况 成人 or 儿童

	function hideInfo(e) {
	    var d = e.length;
	    return d < 18 ? e : e.replace(/^(.{6})(?:\d+)(.{4})$/, "$1****$2");
	}

	//手机号加"*"处理
	function hideTel(e) {
	    return e.replace(/^(.{3})(?:\d+)(.{4})$/, "$1****$2");
	}

/***/ },
/* 25 */
/***/ function(module, exports) {

	module.exports = "\r\n\r\n<div id=\"passenger\">\r\n\r\n      <!--<div class=\"lodin-pa\">-->\r\n            <!--&lt;!&ndash;<div id=\"caseBlanche-pa\">&ndash;&gt;-->\r\n                <!--&lt;!&ndash;<div id=\"rond-pa\">&ndash;&gt;-->\r\n                    <!--&lt;!&ndash;<div id=\"test-pa\"></div>&ndash;&gt;-->\r\n                <!--&lt;!&ndash;</div>&ndash;&gt;-->\r\n                <!--&lt;!&ndash;<div id=\"load-pa\">&ndash;&gt;-->\r\n                    <!--&lt;!&ndash;<p>数据加载中...</p>&ndash;&gt;-->\r\n                <!--&lt;!&ndash;</div>&ndash;&gt;-->\r\n            <!--&lt;!&ndash;</div>&ndash;&gt;-->\r\n          <!-- -->\r\n      <!--</div>-->\r\n    <div class=\"lodinpass\">\r\n        <!--<div id=\"caseBlanche\">-->\r\n        <!--<div id=\"rond\">-->\r\n        <!--<div id=\"test\"></div>-->\r\n        <!--</div>-->\r\n        <!--<div id=\"load\">-->\r\n        <!--<p>航班查询中...</p>-->\r\n        <!--</div>-->\r\n        <!--</div>-->\r\n        <img class=\"xhlog\" src=\"https://cos.uair.cn/mb/img/xhlog.gif\" />\r\n    </div>\r\n      <div class=\"passenger-t\">\r\n          <span class=\"passenger-tt1\"><img src=\"https://cos.uair.cn/mb/img/back.bg.png\" alt=\"\"></span>\r\n          <span class=\"passenger-tt2\">常用乘机人</span>\r\n      </div>\r\n      <div class=\"searpger\">\r\n            <input class=\"searpger-te\" type=\"text\" placeholder=\"搜索乘机人\">\r\n            <span class=\"searpger-bn\">搜索</span>\r\n\r\n      </div>\r\n       <div class=\"addpger\">\r\n            + 新增加乘机人\r\n       </div>\r\n       <div class=\"mianpger-boxbtn1lay\">\r\n           <div class=\"mia-boxbtn1lay-box\">\r\n              <p class=\"boxbtn1lay-boxp1\">删除该乘机人信息？</p>\r\n              <span class=\"boxbtn1lay-boxsp1\">确定</span>\r\n              <span class=\"boxbtn1lay-boxsp2\">取消</span>\r\n           </div>\r\n       </div>\r\n       <div class=\"mianpger\">\r\n           <div class=\"pger-wrap\">\r\n\r\n           </div>\r\n\r\n       </div>\r\n</div>\r\n"

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by way on 16/9/28.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _config = __webpack_require__(1);

	var _config2 = _interopRequireDefault(_config);

	var _api = __webpack_require__(7);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var $ = __webpack_require__(5);
	// myalertp 封装的 alert提示弹层
	//myalertp('chpassenger','出错了，获取客服联系电话失败！')

	//import {getView, get, post ,myalertp,prototype,core,Converter,BusinessTravelTool,Dept,MGOpt,MemberOpt,OrderSubmitOpt,RsaTool,mycheckuser,SetCookie,getCookieVal,GetCookie} from '../util/api';// myalertp 封装的 alert提示弹层
	//myalertp('chpassenger','出错了，获取客服联系电话失败！')
	var _view = __webpack_require__(27);

	var mylinktype = '';
	var theindex = ''; // 存放 待修改的数据索引
	var changedata = ''; // 存放 待修改的 参数包
	var _people = ''; //存放 儿童  成人
	var mytype = ''; //  页面跳转 判断值

	var _class = function () {
	    function _class(opt) {
	        _classCallCheck(this, _class);

	        this.path = '/flightmb/changepassenger$';
	        this.hash = '/flightmb/changepassenger';
	        this.title = '乘机人';

	        opt = opt || {};
	        this.path = opt.path || this.path;
	        this.hash = opt.hash || this.hash;
	        this.title = opt.title || this.title;
	    }

	    // 输出视图


	    _createClass(_class, [{
	        key: 'view',
	        value: function view(cb) {
	            if (!_view) {
	                // 静态资源浏览器有缓存,增加时标,强制刷新!
	                (0, _api.getView)(_config2.default.view.searchJoin + '?t=' + +new Date(), '', function (rs) {
	                    _view = rs;
	                    cb(null, _view);
	                });
	            } else {
	                cb(null, _view);
	            }
	        }

	        // 在已经加载的视图上操作

	    }, {
	        key: 'bind',
	        value: function bind(dv, params) {
	            console.log(params);

	            mytype = params.btype; // 判断 是 修改 还是增加
	            mylinktype = params.linktype; // 是 由什么页面进入的 book 或者 tieckts
	            ////初始化页面  清空出身日期
	            //$.qu('.nbage').value ='';

	            if (mytype == 11) {
	                $.qu('.chpassenger-tt2').innerHTML = '新增加乘机人';
	                // 让成人筛选变红
	                adultcolor();
	                // 清空数据
	                $.qu('.chname').value = '';

	                $.qu('.nbT').value = '';
	                $.qu('.fnumberT').value = '';
	                $.qu('.chpassenger-agedata').style.display = 'none';
	                $.qu('.nbage').value = '';
	                $.qu('.chpassenger-myse1').style.display = 'none';
	                $.qu('.chpassenger-myse').style.display = 'block';
	                $.qu('.chpassenger-myse').selectedIndex = 0; // 设置它的选中 索引


	                // 确认增加

	                //$.qu('.chpassenger-sb').onclick = function(){
	                //    if(GetCookie('xhtime') ==1){
	                //        console.log('增加乘机人登录验证通过')
	                //        addpsFN();
	                //    }else{
	                //        mycheckuser('chpassenger',function (){
	                //            SetCookie('xhtime',1,6);//  设置定时器 cookie 6分钟 值为1
	                //            console.log('增加乘机人登录验证通过')
	                //            addpsFN();
	                //        })
	                //    }
	                //
	                //
	                //}
	                $.qu('.chpassenger-sb').onclick = function () {

	                    (0, _api.userOnoffpp)('c', addpsFN, 'chpassenger', '', '', '报告小主，您登录超时，请前往登陆页面~~');
	                    //addpsFN();
	                };
	            } else if (mytype == 22) {
	                $.qu('.chpassenger-tt2').innerHTML = '修改乘机人';
	                //console.log(params.pda);
	                thechangepa(params.pda); //  添加 要修改的数据
	                changedata = params.pda;
	                theindex = params.pda.ftype;
	                //确认修改

	                $.qu('.chpassenger-sb').onclick = function () {

	                    (0, _api.userOnoffpp)('c', theoldfn, 'chpassenger', '', '', '报告小主，您登录超时，请前往登陆页面~~');
	                    //theoldfn(changedata);
	                };
	            }

	            // 页面返回
	            $.qu('.chpassenger-tt1').onclick = function () {
	                $.router.go('#!/flightmb/passenger', { btype: mylinktype }, false);
	            };
	            $.qu('.chpassenger-o1').onclick = function () {
	                adultcolor();
	            };
	            $.qu('.chpassenger-o12').onclick = function () {
	                youngcolor();
	            };
	            // 护照时候 显示 出生日期
	            getagedata();
	        }
	    }]);

	    return _class;
	}();
	// 选择护照的时候  显示 出生日期


	exports.default = _class;
	function getagedata() {
	    $.qu('.chpassenger-myse').onchange = function () {
	        if (this.value == '护照') {
	            $.qu('.chpassenger-agedata').style.display = 'block';
	        } else {
	            $.qu('.chpassenger-agedata').style.display = 'none';
	            $.qu('.nbage').value = '';
	        }
	    };
	    $.qu('.chpassenger-myse1').onchange = function () {
	        if (this.value == '护照') {
	            $.qu('.chpassenger-agedata').style.display = 'block';
	        } else {
	            $.qu('.chpassenger-agedata').style.display = 'none';
	            $.qu('.nbage').value = '';
	        }
	    };
	}

	// 修改数据添加
	function thechangepa(data) {
	    var nametype = data.age;
	    if (nametype == '儿童') {
	        youngcolor();
	    } else {
	        adultcolor();
	    }
	    var pcard = data.card;
	    $.qu('.chname').value = data.name;
	    puttypeCard(nametype, pcard); // 根据 儿童 或者成年 填充 证件类型
	    $.qu('.nbT').value = data.nb;
	    $.qu('.fnumberT').value = data.fnumber;
	    $.qu('.nbage').value = data.birthday;
	}
	//  成年 图标该有的状态函数
	function adultcolor() {
	    $.qu('.chpassenger-o1').style.background = 'red';
	    $.qu('.chpassenger-o1').setAttribute('CO', 'red');
	    $.qu('.chpassenger-o12').setAttribute('CO', 'AC');
	    $.qu('.chpassenger-o12').style.background = '#ACA8A8';
	    $.qu('.chpassenger-myse').style.display = 'block';
	    $.qu('.chpassenger-myse1').style.display = 'none';

	    var theidtype = $.qu('.chpassenger-myse').value;

	    if (theidtype == '护照') {
	        $.qu('.chpassenger-agedata').style.display = 'block';
	    } else {
	        $.qu('.chpassenger-agedata').style.display = 'none';
	        $.qu('.nbage').value = '';
	    }
	}

	// 儿童 图标改有的状态函数
	function youngcolor() {
	    $.qu('.chpassenger-o1').style.background = '#ACA8A8';
	    $.qu('.chpassenger-o1').setAttribute('CO', 'red1');
	    $.qu('.chpassenger-o12').setAttribute('CO', 'AC');
	    $.qu('.chpassenger-o12').style.background = 'red';
	    $.qu('.chpassenger-myse').style.display = 'none';
	    $.qu('.chpassenger-myse1').style.display = 'block';

	    var theidtype1 = $.qu('.chpassenger-myse1').value;

	    if (theidtype1 == '护照') {
	        $.qu('.chpassenger-agedata').style.display = 'block';
	    } else {
	        $.qu('.chpassenger-agedata').style.display = 'none';
	        $.qu('.nbage').value = '';
	    }
	}

	// 确认修改 预处理函数
	//function theoldfn(changedata){}

	function theoldfn() {
	    //       ///////////////////////////////////////    确认键确认键确认键确认键

	    var id = changedata.ftype; //  乘机人id
	    var name = $.qu('.chname').value; //名称
	    var phone = $.qu('.fnumberT').value; //电话
	    var idtype = "";
	    if ($.qu('.chpassenger-myse1').style.display == "block") {
	        idtype = "身份证";
	        var people = '儿童'; // 成年 或者儿童
	        //console.log('儿童')
	    } else {
	        idtype = $.qu('.chpassenger-myse').value; //  是 身份证 还是 护照
	        var people = '成人'; // 成年 或者儿童
	    }

	    if (!Verify.verifyFlightName(name)) {
	        //alert("请填写正确的乘机人姓名，英文名字用‘/’分割");
	        (0, _api.myalertp)('chpassenger', '请填写正确的乘机人姓名，英文名字用‘/’分割');

	        //$("#card_type_data").html("身份证");
	        //$("#name").focus();
	        return false;
	    }

	    if (!getType(people)) {
	        // people  为成年 或者儿童
	        var msal = '';
	        if (people == '儿童') {
	            msal = '儿童出生日期为成人出生日期';
	        } else {
	            msal = '请填写正确的证件号码';
	        }

	        (0, _api.myalertp)('chpassenger', msal);
	        //$("#card_no").focus(); 焦点设置在 身份证号码上
	        return false;
	    }

	    var idno = $.qu('.nbT').value; // 证件号码
	    if (idno == "") {
	        //alert("证件号码不能为空");
	        (0, _api.myalertp)('chpassenger', '证件号码不能为空');
	        return false;
	    }
	    //var isUse = false;
	    //$("#passengerBoxCover li").each(function (i) {//检查证件是否重复
	    //    var data = $(this).attr("data");
	    //    data = eval("(" + data + ")");
	    //    var _id = $(this).attr("valueid");
	    //    if (idtype == data.idtype && idno == data.idno && data.age != "儿童" && id != _id && idno != "") {
	    //        isUse = true;
	    //    }
	    //});
	    //if (isUse) {
	    //    alert("对不起，该证件已经被使用！");
	    //    return false;
	    //}

	    //alert(phone);
	    //alert(phone);
	    if (!Verify.verifyMobile(phone) && phone != "") {
	        //alert("请填写正确的手机号码");
	        (0, _api.myalertp)('chpassenger', '请填写正确的手机号码');
	        //$("#card_type_data").html("身份证");
	        //$("#phone").focus();
	        return false;
	    } else if (phone == "" && people == '成人') {
	        (0, _api.myalertp)('chpassenger', '成人手机号码必填！');
	        return false;
	    }
	    //////////////////////////////////////////////////

	    //var idno =cardNum;

	    var theage = '';
	    if (idtype == "护照") {
	        //theage =$.qu('.nbage').value;
	        //var r=/^[\d]{4}[\d]{1,2}[\d]{1,2}$/;
	        //if(!r.test(theage)){
	        //    alert("请填写正确出生日期");
	        //    return false;
	        //}

	        var reg = /^[a-z,A-Z,0-9]+$/;
	        if (!reg.test(idno)) {
	            //alert("请填写正确护照号码");
	            (0, _api.myalertp)('chpassenger', '请填写正确护照号码');
	            return false;
	        }
	    }

	    var savepassenger = '{\"ID\":\"' + id + '\","Name":"' + name + '","Phone":"' + phone + '","IDNo":"' + idno + '","IDType":"' + idtype + '","AgeType":"' + people + '","Birthday":"' + theage + '"}';
	    //_load.open("请稍候...", "255,255,255,1");
	    //console.log(idtype)
	    //console.log(savepassenger)
	    //var member = UairB2C.MGOpt;
	    var aes = new ICBCAes();
	    aes.GetAesStr(savepassenger, function (encryptionSavepassenger, encryptionPwd) {
	        //member.SavePassenger(encryptionSavepassenger, encryptionPwd, function (res) {
	        //    //_load.close();
	        //    if (res.value) {
	        //        var json = JSON.parse(res.value);
	        //        if (json.ret == 1) {
	        //            //alert("修改乘机人成功");
	        //            //myalertp('chpassenger','修改乘机人成功')
	        //            $.router.go('#!/flightmb/passenger',{btype:mylinktype},true)
	        //        } else {
	        //            // alert("修改乘机人失败");
	        //            myalertp('chpassenger','修改乘机人失败')
	        //
	        //        }
	        //    }
	        //});
	        var dataass = {
	            json: encryptionSavepassenger,
	            encryptionAESPwd: encryptionPwd
	        };
	        mypost('/ajaxpro/UairB2C.MGOpt,UairB2C.ashx', dataass, 'SavePassenger', function (err, res) {
	            var bdata = eval('(' + res + ')');
	            if (bdata.value) {
	                var json = JSON.parse(bdata.value);
	                if (json.ret == 1) {
	                    //alert("修改乘机人成功");
	                    //myalertp('chpassenger','修改乘机人成功')
	                    $.router.go('#!/flightmb/passenger', { btype: mylinktype }, true);
	                } else {
	                    // alert("修改乘机人失败");
	                    (0, _api.myalertp)('chpassenger', '修改乘机人失败');
	                }
	            } else {
	                // alert("修改乘机人失败");
	                (0, _api.myalertp)('chpassenger', '修改乘机人失败');
	            }
	        });
	    });
	};

	//得到乘机人的年龄
	function getType(people) {
	    // people  儿童/ 成人
	    var rc = true;
	    var pidtype = '';
	    var pid = $.qu('.nbT').value; // 证件号码
	    if (people == '成人') {
	        var pidtype = $.qu('.chpassenger-myse').value; // 证件类型
	    } else {

	        var newcardtype = $.qu('.chpassenger-myse1').value;
	        if (newcardtype == '护照') {
	            pidtype = '护照';
	            pid = $.qu('.nbage').value; // 证件号码
	        } else {
	            pidtype = '身份证';
	        }
	    }

	    var pType = people; // 成年或者  儿童
	    if (pidtype == "身份证" || people != '成人' && pidtype == '护照') {
	        // 只验证身份证类型
	        var reg = /^(\d{4})(\d{1,2})(\d{1,2})$/;
	        if (pid.length > 8) {
	            if (!validateIdCard(pid)) {
	                rc = false;
	            }
	        } else {
	            if (!pid.match(reg)) {
	                rc = false;
	            }
	        }

	        if (pType == "儿童") {
	            var nData = new Date();
	            var bYear = 0;
	            var nYear = nData.getFullYear();
	            var bMonth = 0;
	            var nMonth = nData.getMonth();
	            var bDay = 0;
	            var nDay = nData.getDate();
	            pid.replace(reg, function ($0, $1, $2, $3) {
	                bYear = parseInt($1);
	                bMonth = parseInt($2);
	                bDay = parseInt($3);
	            });
	            var childType = false;
	            if (nYear - bYear > 12) {
	                childType = false;
	            } else if (nYear - bYear == 12) {
	                if (nMonth - bMonth > 0) {
	                    childType = false;
	                } else if (nMonth - bMonth == 0) {
	                    if (nDay - bDay >= 0) {
	                        childType = false;
	                    } else {
	                        childType = true;
	                    }
	                } else {
	                    childType = true;
	                }
	            } else {
	                childType = true;
	            }
	            if (!childType) {

	                adultcolor(); // 成年 图标切换
	                _people = "成人";
	                rc = false;
	            } else {
	                youngcolor(); // 儿童状态 图标切换
	                _people = "儿童";
	            }
	        } else {
	            // 成年 或者 数据不是 生日
	            if (validateIdCard(pid)) {
	                // 是身份证号码
	                var bData = pid.length == 18 ? pid.substr(6, 8) : pid.substr(6, 6);
	                var nData = new Date();
	                bData = bData.length == 8 ? bData : "19" + bData;
	                var bYear = parseInt(bData.substr(0, 4));
	                var nYear = nData.getFullYear();
	                var bMonth = parseInt(bData.substr(4, 2));
	                var nMonth = nData.getMonth();
	                var bDay = parseInt(bData.substr(6, 2));
	                var nDay = nData.getDate();
	                var childType = false;
	                if (nYear - bYear > 12) {
	                    childType = false;
	                } else if (nYear - bYear == 12) {
	                    if (nMonth - bMonth > 0) {
	                        childType = false;
	                    } else if (nMonth - bMonth == 0) {
	                        if (nDay - bDay >= 0) {
	                            childType = false;
	                        } else {
	                            childType = true;
	                        }
	                    } else {
	                        childType = true;
	                    }
	                } else {
	                    childType = true;
	                }
	                if (!childType) {
	                    //自动选择为成人
	                    adultcolor(); // 成年 图标切换
	                    _people = "成人";
	                } else {
	                    youngcolor(); // 儿童状态 图标切换
	                    _people = "儿童";
	                }
	            } else {
	                // 不是身份证
	                rc = false;
	            }
	        }
	        puttypeCard(_people);
	    }
	    return rc;
	}

	// 证件类型 填充
	function puttypeCard(pType, pcard) {
	    // 儿童   ，证件类型

	    if (pType == "成人") {
	        $.qu('.chpassenger-myse').style.display = 'block';
	        if (pcard) {
	            var Ocard = $.qu('.chpassenger-myse');
	            var thecops = Ocard.getElementsByTagName('option');
	            //console.log(thecops)
	            for (var i = 0; i < thecops.length; i++) {
	                if (pcard == thecops[i].innerHTML) {
	                    Ocard.selectedIndex = thecops[i].index;
	                    //ckey =thecops[i].value;
	                    break;
	                }
	            }
	            // 取消出生日期功能
	            if (pcard == '护照') {
	                $.qu('.chpassenger-agedata').style.display = 'block';
	            } else {
	                $.qu('.chpassenger-agedata').style.display = 'none';
	                $.qu('.nbage').value = '';
	            }
	        }

	        $.qu('.chpassenger-myse1').style.display = 'none';
	    } else {
	        $.qu('.chpassenger-myse').style.display = 'none';
	        $.qu('.chpassenger-myse1').style.display = 'block';
	    }
	}

	// 身份证严格认证
	function validateIdCard(idCard) {
	    var OK = true;
	    //15位和18位身份证号码的正则表达式
	    var regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;

	    //如果通过该验证，说明身份证格式正确，但准确性还需计算
	    if (regIdCard.test(idCard)) {
	        if (idCard.length == 18) {
	            var idCardWi = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2); //将前17位加权因子保存在数组里
	            var idCardY = new Array(1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2); //这是除以11后，可能产生的11位余数、验证码，也保存成数组
	            var idCardWiSum = 0; //用来保存前17位各自乖以加权因子后的总和
	            for (var i = 0; i < 17; i++) {
	                idCardWiSum += idCard.substring(i, i + 1) * idCardWi[i];
	            }

	            var idCardMod = idCardWiSum % 11; //计算出校验码所在数组的位置
	            var idCardLast = idCard.substring(17); //得到最后一位身份证号码

	            //如果等于2，则说明校验码是10，身份证号码最后一位应该是X
	            if (idCardMod == 2) {
	                if (idCardLast == "X" || idCardLast == "x") {} else {
	                    OK = false;
	                }
	            } else {
	                //用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
	                if (idCardLast == idCardY[idCardMod]) {} else {
	                    OK = false;
	                }
	            }
	        }
	    } else {
	        OK = false;
	    }
	    return OK;
	}

	// 增加乘机人 预处理函数
	function addpsFN() {
	    var countID = "0";

	    var adname = $.qu('.chname').value; // 名字
	    var cardNum = $.qu('.nbT').value; //  证件号码
	    var cardtype = ''; // 证件类型
	    var agetype = '';
	    if ($.qu('.chpassenger-myse').style.display == 'block') {
	        cardtype = $.qu('.chpassenger-myse').value;
	        agetype = '成人';
	    } else {
	        var newcardtype = $.qu('.chpassenger-myse1').value;
	        if (newcardtype == '护照') {
	            cardtype = '护照';
	        } else {
	            cardtype = '身份证';
	        }
	        agetype = '儿童';
	    }
	    var phoneNum = $.qu('.fnumberT').value; // 电话号码

	    if (!Verify.verifyFlightName(adname)) {
	        // alert("请填写正确的乘机人姓名，英文名字用‘/’分割");
	        (0, _api.myalertp)('chpassenger', '请填写正确的乘机人姓名，英文名字用‘/’分割');

	        //$("#card_type_data").html("身份证");
	        // $("#name").focus();
	        return false;
	    }

	    ///////////////////////////////////
	    if (cardNum == "") {
	        //alert("证件号不能为空!");
	        (0, _api.myalertp)('chpassenger', '请填写证件号码');

	        //$("#card_type_data").html("身份证");
	        return false;
	    }

	    if (!getType(agetype)) {
	        //alert("请填写正确身份证号码");

	        var msal = '';
	        if (agetype == '儿童') {
	            msal = '儿童出生日期为成人出生日期';
	        } else {
	            msal = '请填写正确的证件号码';
	        }
	        (0, _api.myalertp)('chpassenger', msal);

	        return false;
	    }

	    ///////////
	    var id = countID;

	    var idno = cardNum;

	    var birthday = '';
	    if (cardtype == "护照") {
	        birthday = $.qu('.nbage').value;
	        if (birthday) {
	            var checkb = checkbrithday(birthday);
	            if (!checkb) {

	                return false;
	            }
	        } else {
	            (0, _api.myalertp)('chpassenger', '请填写出生日期');
	            return false;
	        }

	        //var r=/^[\d]{4}[\d]{1,2}[\d]{1,2}$/;
	        //if(!r.test(theage)){
	        //    alert("请填写正确出生日期");
	        //    return false;
	        //}else{
	        var reg = /^[a-z,A-Z,0-9]+$/;
	        if (!reg.test(idno)) {
	            //alert("请填写正确护照号码");
	            (0, _api.myalertp)('chpassenger', '请填写正确护照号码');
	            return false;
	        }
	    }

	    if (!Verify.verifyMobile(phoneNum) && phoneNum != "") {
	        //alert("请填写正确的手机号码");
	        (0, _api.myalertp)('chpassenger', '请填写正确的手机号码');

	        return false;
	    } else if (phoneNum == "" && agetype == '成人') {
	        (0, _api.myalertp)('chpassenger', '成人手机号码必填！');
	        return false;
	    }
	    phoneNum = phoneNum ? phoneNum : ' ';
	    //if(cardtype == '护照'){
	    //    cardNum =cardNum+':'+birthday;
	    //}
	    var birthdaypull = '';
	    if (birthday) {
	        birthdaypull = birthday.substring(0, 4) + '-' + birthday.substring(4, 6) + '-' + birthday.substring(6, 8);
	    }
	    var savepassenger = '{\"ID\":\"' + id + '\","Name":"' + adname + '","Phone":"' + phoneNum + '","IDNo":"' + cardNum + '","IDType":"' + cardtype + '","AgeType":"' + agetype + '","Notes":"' + ('\u751F\u65E5:' + birthdaypull) + '"}';
	    console.log('空电话的时候，限儿童');
	    console.log(phoneNum);
	    console.log(savepassenger);
	    var aes = new ICBCAes();
	    //var member = UairB2C.MGOpt;
	    aes.GetAesStr(savepassenger, function (encryptionSavepassenger, encryptionPwd) {
	        //member.SavePassenger(encryptionSavepassenger, encryptionPwd, function (res) {
	        //    if (res.value) {
	        //        var json = JSON.parse(res.value);
	        //        if (json.ret == 1) {
	        //            //alert("增加乘机人成功");
	        //            //myalertp('chpassenger', '增加乘机人成功')
	        //            $.router.go('#!/flightmb/passenger', {btype: mylinktype}, true)
	        //        } else {
	        //            // alert("增加乘机人失败");
	        //            myalertp('chpassenger', '增加乘机人失败,请重试。')
	        //
	        //        }
	        //    }
	        //});


	        var dataass = {
	            json: encryptionSavepassenger,
	            encryptionAESPwd: encryptionPwd
	        };
	        mypost('/ajaxpro/UairB2C.MGOpt,UairB2C.ashx', dataass, 'SavePassenger', function (err, res) {
	            console.log(err);
	            console.log(res);
	            var bdata = eval('(' + res + ')');
	            if (bdata.value) {
	                var json = JSON.parse(bdata.value);
	                if (json.ret == 1) {
	                    //myalertp('chpassenger', '增加乘机人成功')
	                    $.router.go('#!/flightmb/passenger', { btype: mylinktype }, true);
	                } else {
	                    // alert("增加乘机人失败");
	                    (0, _api.myalertp)('chpassenger', '增加乘机人失败,请重试。');
	                }
	            } else {
	                // alert("增加乘机人失败");
	                (0, _api.myalertp)('chpassenger', '增加乘机人失败,请重试。');
	            }
	        });
	    });
	}
	// 判断填入的出身日期是否正常 value 为传入的出身日期
	function checkbrithday(value) {

	    //str="19811101";
	    var reg = /^(?:(?!0000)[0-9]{4}(?:(?:0[1-9]|1[0-2])(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$/;

	    var t1 = reg.test(value);
	    console.log(t1);
	    if (!t1) {
	        (0, _api.myalertp)('chpassenger', '出身日期有误，正确如：20140902');
	        return false;
	    } else {
	        var myt = new Date();
	        var myt1 = Number((myt.getFullYear() + '').substring(0, 4));
	        var myt2 = Number(value.substring(0, 4));
	        if (myt1 < myt2) {
	            (0, _api.myalertp)('chpassenger', '出身日期不能大于当前日期');
	            return false;
	        } else {
	            return true;
	        }
	    }
	}
	//  根据出生日期 判断是儿童 还成人 time '20120215'  y 12
	function isAgePs(time, y) {
	    var myTime = new Date(); //数据类型为 对象
	    var n = myTime.getFullYear() + toTwo(myTime.getMonth() + 1) + toTwo(myTime.getDate());
	    //console.log(n)


	    //var n =New Data();
	    var bData = time;
	    var nData = new Date();
	    var bYear = parseInt(bData.substr(0, 4));
	    //console.log(bYear)
	    var nYear = nData.getFullYear();
	    var bMonth = parseInt(bData.substr(4, 2));
	    var nMonth = nData.getMonth();
	    var bDay = parseInt(bData.substr(6, 2));
	    var nDay = nData.getDate();
	    if (n != null && n != undefined) {
	        nYear = parseInt(n.substr(0, 4));
	        nMonth = parseInt(n.substr(4, 2));
	        nDay = parseInt(n.substr(6, 2));
	    }
	    var childType = false;
	    if (nYear - bYear > y) {
	        childType = false;
	    } else if (nYear - bYear == y) {
	        if (nMonth - bMonth > 0) {
	            childType = false;
	        } else if (nMonth - bMonth == 0) {
	            if (nDay - bDay >= 0) {
	                childType = false;
	            } else {
	                childType = true;
	            }
	        } else {
	            childType = true;
	        }
	    } else {
	        childType = true;
	    }
	    return childType;
	}

	function toTwo(n) {
	    //  转换为 带0的
	    return n < 10 ? '0' + n : '' + n;
	}

	if (typeof Verify === "undefined") {
	    var Verify = {};
	}(function (a) {
	    a.toDateString = function (c) {
	        var d = c.getMonth() + 1,
	            b = c.getDate();if (d < 10) {
	            d = "0" + d;
	        }if (b < 10) {
	            b = "0" + b;
	        }return c.getFullYear() + "-" + d + "-" + b;
	    };a.verifyFlightName = function (c) {
	        var d = false;c = c.replace(/(^\s*)|(\s*$)/g, "");var b = /^[A-Za-z\/]+$/;if (b.test(c)) {
	            if (c.indexOf("/") > 0 && c.indexOf("/") < c.length - 1) {
	                d = true;
	            } else {
	                d = false;
	            }
	        } else {
	            b = /^[\u4e00-\u9fa5]+[A-Z,a-z]*[\u4e00-\u9fa5]*$/;if (b.test(c)) {
	                d = true;
	            } else {
	                d = false;
	            }
	        }return d;
	    };a.verifyName = function (b) {
	        var b = b.replace(/(^\s*)|(\s*$)/g, "");return b.length > 0;
	    };a.verifyEmail = function (b) {
	        return (/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(b)
	        );
	    };a.verifyTicketNo = function (c) {
	        var d = false;var b = c.length;if (b === 13) {
	            d = /^\d{13}$/.test(c);
	        }return d;
	    };a.verifyMobile = function (b) {
	        return (/^1\d{10}$/.test(b)
	        );
	    };a.verifyIdCard = function (t) {
	        var s = t.length,
	            b,
	            i,
	            w,
	            m,
	            d;if (s === 15) {
	            b = t.match(/^(?:\d{6})(\d{2})(\d{2})(\d{2})(?:\d{3})$/);if (!b) {
	                return false;
	            }i = parseInt("19" + b[1], 10);w = parseInt(b[2], 10);m = parseInt(b[3], 10);d = t.charAt(s - 1) % 2;
	        } else {
	            if (s === 18) {
	                var u = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
	                    y = "10X98765432";for (var v = 0, c = 0; v < 17; v++) {
	                    c += t.charAt(v) * u[v];
	                }if (y.charAt(c % 11) !== t.charAt(17).toUpperCase()) {
	                    return false;
	                }b = t.match(/^(?:\d{6})(\d{4})(\d{2})(\d{2})(?:\d{3})(?:[0-9]|X)$/i);if (!b) {
	                    return false;
	                }i = parseInt(b[1], 10);w = parseInt(b[2], 10);m = parseInt(b[3], 10);d = t.charAt(s - 2) % 2;
	            }
	        }var x = new Date(i, w - 1, m);if (i !== x.getFullYear() || w !== x.getMonth() + 1 || m !== x.getDate()) {
	            return false;
	        }return true;
	    };a.replaceIdCard = function (b) {
	        var c = a.verifyIdCard(b);if (!c) {
	            return b;
	        }if (b.length === 18) {
	            return b.replace(/^(\d{4})\d{11}(\d{2}[\da-z])$/i, "$1***********$2");
	        } else {
	            if (b.length === 15) {
	                return b.replace(/^(\d{4})\d{8}(\d{3})$/, "$1********$2");
	            }
	        }
	    };a.replaceMobile = function (b) {
	        return b.replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2");
	    };
	})(Verify);

/***/ },
/* 27 */
/***/ function(module, exports) {

	module.exports = "\r\n\r\n<div id=\"chpassenger\">\r\n      <div class=\"chpassenger-t\">\r\n          <span class=\"chpassenger-tt1\"><?xml version=\"1.0\" standalone=\"no\"?><!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\"><svg t=\"1492400593265\" class=\"icon\" style=\"\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"2999\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"22\" height=\"22\"><defs><style type=\"text/css\"></style></defs><path d=\"M277.617 540.706l406.92 406.919c16.897 16.9 44.296 16.9 61.194 0 16.901-16.899 16.9-44.296 0-61.194l-376.321-376.322 373.233-373.231c16.898-16.901 16.898-44.298 0-61.197-16.898-16.898-44.297-16.9-61.196 0l-400.476 400.477c-0.563 0.563-1.105 1.14-1.629 1.724-0.585 0.526-1.163 1.066-1.725 1.63-16.898 16.897-16.898 44.296 0 61.194z\" p-id=\"3000\" fill=\"#ffffff\"></path></svg></span>\r\n          <span class=\"chpassenger-tt2\">修改常用乘机人</span>\r\n      </div>\r\n      <ul class=\"chpassenger-main\">\r\n            <li class=\"chpassenger-mainl1\"><span>成人(12岁以上)</span><strong class=\"chpassenger-o1\" CO='red'><span class=\"chpassenger-o2\"></span></strong></li>\r\n            <li class=\"chpassenger-mainl1\"><span>儿童(2-12)</span><strong class=\"chpassenger-o12\" CO='AC'><span class=\"chpassenger-o22\"></span></strong></li>\r\n            <li><span class=\"chpassenger-main-sp\">姓名</span><input  type=\"text\" class=\"chname\" placeholder=\"输入姓名\"></li>\r\n            <li>\r\n            <span class=\"chpassenger-main-sp\">证件类型</span>\r\n            <select class=\"chpassenger-myse\">\r\n                <option value =\"身份证\">身份证</option>\r\n                <option value =\"护照\">护照</option>\r\n                <option value =\"军官证\">军官证</option>\r\n                <option value=\"回乡证\">回乡证</option>\r\n                <option value=\"台胞证\">台胞证</option>\r\n                <option value=\"港澳通行证\">港澳通行证</option>\r\n                <option value=\"警官证\">警官证</option>\r\n                <option value=\"士兵证\">士兵证</option>\r\n                <option value=\"其他\">其他</option>\r\n\r\n            </select>\r\n            <select class=\"chpassenger-myse1\">\r\n                <option value =\"身份证\">身份证/出生日期(20140918)</option>\r\n                <option value =\"护照\">护照</option>\r\n            </select>\r\n            </li>\r\n            <li class=\"chpassenger-agedata\"><span class=\"chpassenger-main-sp\">出生日期</span><input type=\"text\" class=\"nbage\" placeholder=\"输入出生日期\"></li>\r\n            <li><span class=\"chpassenger-main-sp\">证件号码</span><input type=\"text\" class=\"nbT\" placeholder=\"输入证件号码\"></li>\r\n            <li class=\"chpassenger-mainlla\"><span class=\"chpassenger-main-sp \">手机号码</span><input type=\"text\" class=\"fnumberT\" placeholder=\"输入手机号码\"></li>\r\n      </ul>\r\n      <span class=\"chpassenger-sb\">确认</span>\r\n\r\n</div>\r\n"

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by way on 16/9/28.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _config = __webpack_require__(1);

	var _config2 = _interopRequireDefault(_config);

	var _api = __webpack_require__(7);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var $ = __webpack_require__(5);
	//import {getView, get, post ,myalertp,mycheckuser,SetCookie,getCookieVal,GetCookie} from '../util/api';// myalertp 封装的 alert提示弹层
	//myalertp('chalinkp','出错了，获取客服联系电话失败！')

	// myalertp 封装的 alert提示弹层

	var _view = __webpack_require__(29);

	var lint = '';

	var _class = function () {
	    function _class(opt) {
	        _classCallCheck(this, _class);

	        this.path = '/flightmb/mychalinkp$';
	        this.hash = '/flightmb/mychalinkp';
	        this.title = '联系人';

	        opt = opt || {};
	        this.path = opt.path || this.path;
	        this.hash = opt.hash || this.hash;
	        this.title = opt.title || this.title;
	    }

	    // 输出视图


	    _createClass(_class, [{
	        key: 'view',
	        value: function view(cb) {
	            if (!_view) {
	                // 静态资源浏览器有缓存,增加时标,强制刷新!
	                (0, _api.getView)(_config2.default.view.searchJoin + '?t=' + +new Date(), '', function (rs) {
	                    _view = rs;
	                    cb(null, _view);
	                });
	            } else {
	                cb(null, _view);
	            }
	        }

	        // 在已经加载的视图上操作

	    }, {
	        key: 'bind',
	        value: function bind(dv, params) {
	            lint = params.btype;
	            //console.log(lint)


	            // 页面返回
	            $.qu('.chalinkp-tt1').onclick = function () {
	                if (lint == 2) {
	                    $.router.go('#!/flightmb/book', {}, false);
	                } else if (lint == 3) {
	                    $.router.go('#!/flightmb/allmytickes', {}, true);
	                }
	            };

	            //新增加联系人
	            $.qu('.chalinkp-addpger').onclick = function () {
	                // 1 为新加u
	                $.router.go('#!/flightmb/changelinkp', { type: 1, linktype: lint }, true);
	            };
	            //mycheckuser('chalinkp',function (){
	            //    console.log('常用联系人验证登录通过')
	            //    getmyContactdata();//  服务器 拉取数据
	            //})

	            (0, _api.userOnoffpp)('c', getmyContactdata, 'chalinkp', '.lodincha', '', '报告小主，您登录超时，请前往登陆页面~~');
	            //getmyContactdata();//  服务器 拉取数据
	            //

	        }
	    }]);

	    return _class;
	}();

	// 获取常用联系人ajax


	exports.default = _class;
	function getmyContactdata() {
	    $.qu('.lodincha').style.display = '-webkit-box';

	    var xhr = '';
	    if (window.XMLHttpRequest) {
	        xhr = new XMLHttpRequest();
	    } else {
	        xhr = new ActiveXObject(' Microsoft . XMLHTTP');
	    }
	    //xhr.open('get','http://106.75.131.58:8015/icbc/xhService.ashx?act=GETCONTACTERS','false');
	    xhr.open('get', flightUrl + '/icbc/xhService.ashx?act=GETCONTACTERS', 'false');
	    xhr.send();
	    xhr.onreadystatechange = function () {
	        if (xhr.readyState == 4) {
	            // ajax 响内容解析完成，可以在客户端调用了
	            if (xhr.status == 200) {
	                $.qu('.lodincha').style.display = 'none';
	                //  判断服务器返回的状态 200 表示 正常
	                //console.log(xhr.responseText);
	                var datac = xhr.responseText;
	                var datac1 = eval('(' + datac + ')');
	                if (datac1.Status == 1) {
	                    // 1 表示 有数据
	                    var pscData = datac1.Result.Contacters;
	                    thecontactHtml(pscData);
	                    //带数据返回 chalinkp-box
	                    addtheLinkpe(); // 点击 信息 带信息返回book 界面
	                    theClickhtml(); // 绑定删除 修改事件

	                } else {
	                    //没有数据
	                    $.qu('.chalinkp-wrap').innerHTML = '';
	                }
	            } else {
	                //alert('出错了，Err' +xhr.status);
	                (0, _api.myalertp)('chalinkp', '获取常用联系人出错了，Err' + xhr.status);
	            }
	        }
	    };
	}

	// 联系人 html格式整合
	function thecontactHtml(data) {
	    var str = '';
	    for (var i = 0; i < data.length; i++) {
	        str += '<div class="chalinkp-box" contactid="' + data[i].ID + '"><p><span class="chalinkp-card">姓名</span></soan><span class="chalinkp-name">' + data[i].Name + '</span></p><p><span class="chalinkp-card">电话</span><span class="chalinkp-num">' + data[i].Phone + '</span></p><p><span class="chalinkp-ph">邮箱</span><span class="chalinkp-phnum">' + data[i].Email + '</span></p><span class="chalinkp-boxbtn1">删除</span><span class="chalinkp-boxbtn2" name ="' + data[i].Name + '" phone ="' + data[i].Phone + '" email ="' + data[i].Email + '" contid="' + data[i].ID + '" >修改</span></div>';
	    }
	    $.qu('.chalinkp-wrap').innerHTML = str;
	}
	//增加/更换联系人
	function addtheLinkpe() {
	    $.each($.qus('.chalinkp-box'), function () {
	        this.onclick = function () {

	            var odalin = {
	                linkname: $.lastChild($.firstChild(this)).innerHTML,
	                linknump: $.lastChild($.nextNode($.firstChild(this))).innerHTML,
	                id: this.getAttribute('contactid')

	            };
	            if (lint == 2) {
	                //  返回上一页
	                $.router.go('#!/flightmb/book', { pbtype: 2, linkdata: odalin }, true);
	            }
	        };
	    });
	}

	// 删除  及 修改  点击事件绑定
	function theClickhtml() {
	    // 删除
	    $.each($.qus('.chalinkp-boxbtn1'), function () {
	        this.onclick = function (e) {
	            var that = this;
	            //弹层
	            $.qu('.chalinkp-chalinkpt').style.display = '-webkit-box';
	            $.qu('.chalinkpt-boxsp1').onclick = function () {
	                //that.parentNode.style.display = 'none';
	                var thepeopleid = that.parentNode.getAttribute('contactid');
	                // 删除 常用联系人
	                var dataass = {
	                    id: thepeopleid
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


	                (0, _api.userOnoffpp)('c', function () {

	                    mypost('/ajaxpro/UairB2C.MGOpt,UairB2C.ashx', dataass, 'DelContacter', function (err, res) {
	                        var bdata = eval('(' + res + ')');
	                        if (bdata.value) {
	                            var rs = eval("(" + bdata.value + ")");
	                            //console.log(rs)
	                            if (rs) {
	                                // 重新加载 常用联系人数据
	                                getmyContactdata();
	                            } else {
	                                //alert("删除联系人失败");
	                                (0, _api.myalertp)('chalinkp', '删除联系人失败');
	                            }
	                        } else {
	                            (0, _api.myalertp)('chalinkp', '删除联系人失败');
	                        }
	                    });
	                }, 'chalinkp', '.lodincha', '', '抱歉，您登录超时，请前往登陆页面~~');

	                $.qu('.chalinkp-chalinkpt').style.display = 'none';
	            };
	            $.qu('.chalinkpt-boxsp2').onclick = function () {
	                $.qu('.chalinkp-chalinkpt').style.display = 'none';
	            };
	            var e = e || window.e;
	            e.stopPropagation();
	        };
	    });
	    //修改
	    $.each($.qus('.chalinkp-boxbtn2'), function () {
	        this.onclick = function (e) {
	            var _that = this;
	            var contactdata = {
	                name: _that.getAttribute('name'),
	                phone: _that.getAttribute('phone'),
	                email: _that.getAttribute('email'),
	                contid: _that.getAttribute('contid')

	            };
	            $.router.go('#!/flightmb/changelinkp', { type: 4, linktype: lint, cdat: contactdata }, true);

	            var e = e || window.e;
	            e.stopPropagation();
	        };
	    });
	}

/***/ },
/* 29 */
/***/ function(module, exports) {

	module.exports = "\r\n\r\n\r\n<div id=\"chalinkp\">\r\n    <!--<div class=\"lodin-lin\">-->\r\n        <!--<div id=\"caseBlanche-lin\">-->\r\n            <!--<div id=\"rond-lin\">-->\r\n                <!--<div id=\"test-lin\"></div>-->\r\n            <!--</div>-->\r\n            <!--<div id=\"load-lin\">-->\r\n                <!--<p>数据加载中...</p>-->\r\n            <!--</div>-->\r\n        <!--</div>-->\r\n    <!--</div>-->\r\n    <div class=\"lodincha\">\r\n        <img class=\"xhlog\" src=\"https://cos.uair.cn/mb/img/xhlog.gif\" />\r\n    </div>\r\n     <div class=\"chalinkp-t\">\r\n        <span class=\"chalinkp-tt1\"><img src=\"https://cos.uair.cn/mb/img/back.bg.png\" alt=\"\"></span>\r\n        <span class=\"chalinkp-tt2\">常用联系人</span>\r\n     </div>\r\n     <div class=\"chalinkp-addpger\">\r\n            + 新增联系人\r\n     </div>\r\n     <div class=\"chalinkp-chalinkpt\">\r\n         <div class=\"mia-chalinkpt-box\">\r\n              <p class=\"chalinkpt-boxp1\">删除该联系人信息？</p>\r\n              <span class=\"chalinkpt-boxsp1\">确定</span>\r\n              <span class=\"chalinkpt-boxsp2\">取消</span>\r\n         </div>\r\n     </div>\r\n     <div class=\"chalinkp\">\r\n          <div class=\"chalinkp-wrap\">\r\n\r\n\r\n\r\n          </div>\r\n\r\n      </div>\r\n\r\n\r\n\r\n</div>\r\n"

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by way on 16/9/28.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _config = __webpack_require__(1);

	var _config2 = _interopRequireDefault(_config);

	var _api = __webpack_require__(7);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var $ = __webpack_require__(5);
	// myalertp 封装的 alert提示弹层
	//myalertp('changelinkp','出错了，获取客服联系电话失败！')
	var _view = __webpack_require__(31);
	var thelinkt = '';
	var contid = ''; // 修改联系人 对应的id

	var _class = function () {
	    function _class(opt) {
	        _classCallCheck(this, _class);

	        this.path = '/flightmb/changelinkp$';
	        this.hash = '/flightmb/changelinkp';
	        this.title = '增加或者修改联系人';

	        opt = opt || {};
	        this.path = opt.path || this.path;
	        this.hash = opt.hash || this.hash;
	        this.title = opt.title || this.title;
	    }

	    // 输出视图


	    _createClass(_class, [{
	        key: 'view',
	        value: function view(cb) {
	            if (!_view) {
	                // 静态资源浏览器有缓存,增加时标,强制刷新!
	                (0, _api.getView)(_config2.default.view.searchJoin + '?t=' + +new Date(), '', function (rs) {
	                    _view = rs;
	                    cb(null, _view);
	                });
	            } else {
	                cb(null, _view);
	            }
	        }

	        // 在已经加载的视图上操作

	    }, {
	        key: 'bind',
	        value: function bind(dv, params) {

	            var mytype = params.type; //  判断是 增加 还是修改
	            thelinkt = params.linktype; // 判断是  book 进入 还是 ticekts进入的
	            if (mytype == 1) {
	                //  1 为增加
	                $.qu('.changelinkp-tt2').innerHTML = '新增联系人';
	                $.qu('.changelinkp-mainin11').value = '';
	                $.qu('.changelinkp-mainin12').value = '';
	                $.qu('.changelinkp-mainin13').value = '';
	                // 确认按钮
	                //$.qu('.changelinkp-sb').onclick = function(){
	                //    //mycheckuser('changelinkp',function (){
	                //    //    console.log('增加联系人登录验证通过')
	                //    //    addcontactF(thelinkt);
	                //    //})
	                //    if(GetCookie('xhtime') ==1){
	                //        console.log('增加联系人登录验证通过')
	                //        addcontactF(thelinkt);
	                //    }else{
	                //        mycheckuser('changelinkp',function (){
	                //            SetCookie('xhtime',1,6);//  设置定时器 cookie 6分钟 值为1
	                //            console.log('增加联系人登录验证通过')
	                //            addcontactF(thelinkt);
	                //        })
	                //    }
	                //
	                //    //addcontactF(thelinkt)
	                //}
	                $.qu('.changelinkp-sb').onclick = function () {

	                    //addcontactF(thelinkt);
	                    (0, _api.userOnoffpp)('c', function () {
	                        addcontactF(thelinkt);
	                    }, 'changelinkp', '', '', '报告小主，您登录超时，请前往登陆页面~~');
	                };
	            } else if (mytype == 4) {
	                //4 为修改 会带数据过来
	                console.log(params);
	                $.qu('.changelinkp-tt2').innerHTML = '修改联系人';
	                var todata = params.cdat;
	                $.qu('.changelinkp-mainin11').value = todata.name;
	                $.qu('.changelinkp-mainin12').value = todata.phone;
	                $.qu('.changelinkp-mainin13').value = todata.email;
	                contid = todata.contid;
	                // 确认按钮
	                $.qu('.changelinkp-sb').onclick = function () {
	                    //changeContact(contid,thelinkt);

	                    (0, _api.userOnoffpp)('c', function () {
	                        changeContact(contid, thelinkt);
	                    }, 'changelinkp', '', '', '报告小主，您登录超时，请前往登陆页面~~');
	                };

	                //$.qu('.changelinkp-sb').onclick = function(){
	                //    if(GetCookie('xhtime') ==1){
	                //        console.log('修改联系人登录验证通过，未')
	                //        changeContact(contid,thelinkt);
	                //    }else{
	                //        mycheckuser('chpassenger',function (){
	                //            SetCookie('xhtime',1,6);//  设置定时器 cookie 6分钟 值为1
	                //            console.log('修改联系人登录验证通过')
	                //            changeContact(contid,thelinkt);
	                //        })
	                //    }
	                //    //mycheckuser('changelinkp',function (){
	                //    //
	                //    //    console.log('修改联系人登录验证通过')
	                //    //    changeContact(contid,thelinkt);
	                //    //})
	                //    //changeContact(contid,thelinkt);
	                //}

	            }

	            // 页面返回
	            $.qu('.changelinkp-tt1').onclick = function () {
	                $.router.go('#!/flightmb/mychalinkp', { btype: thelinkt }, false);
	            };
	            //  点击确认按钮（确认修改 / 确认添加）  带数据返回上一页 并向数据库提交数据

	        }
	    }]);

	    return _class;
	}();

	// 修改联系人 预处理函数


	exports.default = _class;
	function changeContact(contid, thelinkt) {

	    var name = $.qu('.changelinkp-mainin11').value;
	    var phone = $.qu('.changelinkp-mainin12').value;
	    var email = $.qu('.changelinkp-mainin13').value;
	    if (!Verify.verifyName(name)) {
	        //alert("请填写联系人姓名！");
	        (0, _api.myalertp)('changelinkp', '请填写联系人姓名');

	        //$("#name").focus();
	        return false;
	    }
	    if (!phone) {
	        (0, _api.myalertp)('changelinkp', '请填写联系人手机号码');
	        return false;
	    }
	    if (!Verify.verifyMobile(phone)) {
	        //alert("请填写正确手机号码！");
	        (0, _api.myalertp)('changelinkp', '请填写正确的联系人手机号码');

	        //$("#phone").focus();
	        return false;
	    }
	    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

	    if (email != "") {
	        if (!filter.test(email)) {
	            //alert('您的电子邮件格式不正确');
	            (0, _api.myalertp)('changelinkp', '您的电子邮件格式不正确');
	            // $("#email").focus();
	            return false;
	        }
	    }
	    var savecontacter = '{\"ID\":\"' + contid + '\","Name":"' + name + '","Phone":"' + phone + '","Email":"' + email + '"}';

	    var aes = new ICBCAes();
	    //var member = UairB2C.MGOpt;
	    aes.GetAesStr(savecontacter, function (encryptionSavecontacter, encryptionPwd) {
	        //member.SaveContacter(encryptionSavecontacter, encryptionPwd, function (res) {
	        //
	        //    if (res.value) {
	        //        var json = JSON.parse(res.value);
	        //        if (json.ret == 1) {
	        //            //alert("修改联系人成功！");
	        //            myalertp('changelinkp','修改联系人成功')
	        //            $.router.go('#!/flightmb/mychalinkp',{btype:thelinkt},true)
	        //
	        //        } else {
	        //            //alert("保存联系人失败！");
	        //            myalertp('changelinkp','保存联系人失败')
	        //
	        //        }
	        //    }
	        //});
	        var dataass = {
	            json: encryptionSavecontacter,
	            encryptionAESPwd: encryptionPwd
	        };

	        mypost('/ajaxpro/UairB2C.MGOpt,UairB2C.ashx', dataass, 'SaveContacter', function (err, res) {
	            console.log(err);
	            console.log(res);
	            var bdata = eval('(' + res + ')');
	            if (bdata.value) {
	                var json = JSON.parse(bdata.value);
	                if (json.ret == 1) {
	                    //alert("修改联系人成功！");
	                    //myalertp('changelinkp','修改联系人成功')
	                    $.router.go('#!/flightmb/mychalinkp', { btype: thelinkt }, true);
	                } else {
	                    //alert("保存联系人失败！");
	                    (0, _api.myalertp)('changelinkp', '保存联系人失败');
	                }
	            }
	        });
	    });
	}

	//  新增联系人 预处理函数
	function addcontactF(thelinkt) {

	    var countid = "0";
	    var name = $.qu('.changelinkp-mainin11').value;
	    var phone = $.qu('.changelinkp-mainin12').value;
	    var email = $.qu('.changelinkp-mainin13').value;
	    if (!Verify.verifyName(name)) {
	        //alert("请填写联系人姓名！");
	        (0, _api.myalertp)('changelinkp', '请填写联系人姓名');

	        //$("#name").focus();
	        return false;
	    }
	    if (!phone) {
	        (0, _api.myalertp)('changelinkp', '请填写联系人手机号码');
	        return false;
	    }
	    if (!Verify.verifyMobile(phone)) {
	        // alert("请填写正确手机号码！");
	        (0, _api.myalertp)('changelinkp', '请填写正确的联系人手机号码');

	        //$("#phone").focus();
	        return false;
	    }
	    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	    if (email != "") {
	        if (!filter.test(email)) {
	            //alert('您的电子邮件格式不正确');
	            (0, _api.myalertp)('changelinkp', '您的电子邮件格式不正确');

	            //$("#email").focus();
	            return false;
	        }
	    }
	    var savecontacter = '{\"ID\":\"' + countid + '\","Name":"' + name + '","Phone":"' + phone + '","Email":"' + email + '"}';
	    var aes = new ICBCAes();
	    //var member = UairB2C.MGOpt;
	    aes.GetAesStr(savecontacter, function (encryptionSavecontacter, encryptionPwd) {
	        //member.SaveContacter(encryptionSavecontacter, encryptionPwd, function (res) {
	        //    if (res.value) {
	        //        var json = JSON.parse(res.value);
	        //        if (json.ret == 1) {
	        //            //alert("添加联系人成功！");
	        //            myalertp('changelinkp','添加联系人成功')
	        //
	        //            $.router.go('#!/flightmb/mychalinkp',{btype:thelinkt},true)
	        //            //loadContacter();
	        //            //$("#addContacterBoxCover").remove();
	        //        } else {
	        //            //alert("添加联系人失败！");
	        //            myalertp('changelinkp','添加联系人失败')
	        //
	        //        }
	        //    }
	        //});
	        var dataass = {
	            json: encryptionSavecontacter,
	            encryptionAESPwd: encryptionPwd
	        };

	        mypost('/ajaxpro/UairB2C.MGOpt,UairB2C.ashx', dataass, 'SaveContacter', function (err, res) {
	            console.log(err);
	            console.log(res);
	            var bdata = eval('(' + res + ')');
	            if (bdata.value) {
	                var json = JSON.parse(bdata.value);
	                if (json.ret == 1) {
	                    //alert("添加联系人成功！");
	                    //myalertp('changelinkp','添加联系人成功')
	                    $.router.go('#!/flightmb/mychalinkp', { btype: thelinkt }, true);
	                } else {
	                    //alert("添加联系人失败！");
	                    (0, _api.myalertp)('changelinkp', '添加联系人失败');
	                }
	            } else {
	                (0, _api.myalertp)('changelinkp', '添加联系人失败');
	            }
	        });
	    });
	}

	//  检查数据格式函数
	if (typeof Verify === "undefined") {
	    var Verify = {};
	}(function (a) {
	    a.toDateString = function (c) {
	        var d = c.getMonth() + 1,
	            b = c.getDate();if (d < 10) {
	            d = "0" + d;
	        }if (b < 10) {
	            b = "0" + b;
	        }return c.getFullYear() + "-" + d + "-" + b;
	    };a.verifyFlightName = function (c) {
	        var d = false;c = c.replace(/(^\s*)|(\s*$)/g, "");var b = /^[A-Za-z\/]+$/;if (b.test(c)) {
	            if (c.indexOf("/") > 0 && c.indexOf("/") < c.length - 1) {
	                d = true;
	            } else {
	                d = false;
	            }
	        } else {
	            b = /^[\u4e00-\u9fa5]+[A-Z,a-z]*[\u4e00-\u9fa5]*$/;if (b.test(c)) {
	                d = true;
	            } else {
	                d = false;
	            }
	        }return d;
	    };a.verifyName = function (b) {
	        var b = b.replace(/(^\s*)|(\s*$)/g, "");return b.length > 0;
	    };a.verifyEmail = function (b) {
	        return (/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(b)
	        );
	    };a.verifyTicketNo = function (c) {
	        var d = false;var b = c.length;if (b === 13) {
	            d = /^\d{13}$/.test(c);
	        }return d;
	    };a.verifyMobile = function (b) {
	        return (/^1\d{10}$/.test(b)
	        );
	    };a.verifyIdCard = function (t) {
	        var s = t.length,
	            b,
	            i,
	            w,
	            m,
	            d;if (s === 15) {
	            b = t.match(/^(?:\d{6})(\d{2})(\d{2})(\d{2})(?:\d{3})$/);if (!b) {
	                return false;
	            }i = parseInt("19" + b[1], 10);w = parseInt(b[2], 10);m = parseInt(b[3], 10);d = t.charAt(s - 1) % 2;
	        } else {
	            if (s === 18) {
	                var u = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
	                    y = "10X98765432";for (var v = 0, c = 0; v < 17; v++) {
	                    c += t.charAt(v) * u[v];
	                }if (y.charAt(c % 11) !== t.charAt(17).toUpperCase()) {
	                    return false;
	                }b = t.match(/^(?:\d{6})(\d{4})(\d{2})(\d{2})(?:\d{3})(?:[0-9]|X)$/i);if (!b) {
	                    return false;
	                }i = parseInt(b[1], 10);w = parseInt(b[2], 10);m = parseInt(b[3], 10);d = t.charAt(s - 2) % 2;
	            }
	        }var x = new Date(i, w - 1, m);if (i !== x.getFullYear() || w !== x.getMonth() + 1 || m !== x.getDate()) {
	            return false;
	        }return true;
	    };a.replaceIdCard = function (b) {
	        var c = a.verifyIdCard(b);if (!c) {
	            return b;
	        }if (b.length === 18) {
	            return b.replace(/^(\d{4})\d{11}(\d{2}[\da-z])$/i, "$1***********$2");
	        } else {
	            if (b.length === 15) {
	                return b.replace(/^(\d{4})\d{8}(\d{3})$/, "$1********$2");
	            }
	        }
	    };a.replaceMobile = function (b) {
	        return b.replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2");
	    };
	})(Verify);

/***/ },
/* 31 */
/***/ function(module, exports) {

	module.exports = "\r\n\r\n\r\n<div id=\"changelinkp\">\r\n     <div class=\"changelinkp-t\">\r\n        <span class=\"changelinkp-tt1\"><img src=\"https://cos.uair.cn/mb/img/back.bg.png\" alt=\"\"></span>\r\n        <span class=\"changelinkp-tt2\">新增常用联系人</span>\r\n     </div>\r\n     <ul class=\"changelinkp-main\">\r\n        <li class=\"changelinkp-main1\" >\r\n          <div >姓名</div>\r\n          <input type=\"text\" placeholder=\"输入姓名\" class=\"changelinkp-mainin1 changelinkp-mainin11 \">\r\n        </li>\r\n        <li class=\"changelinkp-main1\" >\r\n          <div >电话</div>\r\n          <input type=\"text\" placeholder=\"输入电话\" class=\"changelinkp-mainin1 changelinkp-mainin12\">\r\n        </li>\r\n        <li class=\"changelinkp-main1 changelinkp-mainla\" >\r\n          <div >邮箱</div>\r\n          <input type=\"text\" placeholder=\"输入邮箱\" class=\"changelinkp-mainin1 changelinkp-mainin13\">\r\n        </li>\r\n\r\n     </ul>\r\n\r\n     <span class=\"changelinkp-sb\">确认</span>\r\n\r\n</div>\r\n"

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();/**
	 * Created by way on 16/9/28.
	 */var _config=__webpack_require__(1);var _config2=_interopRequireDefault(_config);var _api=__webpack_require__(7);var _kutil=__webpack_require__(6);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}var $=__webpack_require__(5);// myalertp 封装的 alert提示弹层
	var _view=__webpack_require__(33);var fcity='a';var tcity='';var OT=1;var theID='';var theCarrier='';//获取改签规则的数据
	var bookdata1={};// 单程数据包
	var bookdata2={};// 返程数据包
	var Member='';//  product 传递过来的 用户登录信息
	var ShipAddr='';//快递地址
	var onOFFs=true;// 单程 或去程 改签开关按钮 显示 或者不显示 退改签
	var onOFFs1=true;//  返程  改签开关按钮 显示 或者不显示 退改签
	var onOFF=true;// 保险开关按钮 30的
	var onOFFt=false;// 保险开关按钮 20的 深圳直营 会有2个选择保险按钮
	var onOFFp=true;// 凭证开关
	var onOFFr=true;// 差旅开关
	var onOFFtr=true;// 因公因私开关 用于 删除乘机人后 差旅乘客默认 因公
	var ShipFeeOnoff='';// 快递费
	var shipMoney=10;//  收费用的时候为 15 这个价格可以改变
	var insureType='';// 单程 或者去程  保险类型 用于加载保险说明
	var insureType1='';// 返程 保险类型 用于加载保险说明
	var insureTypeb='';var cabinType='';// 判断是否是直营
	var onepiect1='';//  单程 或去程票面价格
	var onepiect2='';//  返程程票面价格
	var Fprice='';// 单全价 儿童不能往返 除以2 已经四舍五入
	//var Fpricey = '';// y仓位的一半
	var DS='';// 折扣
	var DS1='';// 返程 或者儿童 折扣
	var ynum=0;//  儿童个数
	var onum=0;// 成人个数
	var odnum=0;// 老年个数
	var backFlight=false;//  是否 返航
	var checkPricedata='';// 验价用的 航班信息
	var mPriceObj={};//价格校验，用于验价存储数据，值都为true则下我们的单子，否则下直营的单子（后天新加一个订单）
	var nottripNum=[];//非差旅人员
	var mIsNormalPassenger=true;//true散客，false差旅
	var mPassengerIsValidated=true;//乘客验证是否通过
	var UnitNo='010135.00008006';// 不知道是什么值  好像是 要接口拿
	var theAddresdata='';// 存放 收件凭证地址
	var Tripdata='';var zyTable='';// 判断直营  区别 cabintype  这个直营是 有DsOnePrice综合判断的  产品页面做了判断的
	var zyTablechange=0;// 用于 传入 订单页面时候 显示 客服电话问题  在 差旅的情况下 最终判断是不是 直营
	var zyCP='';// 航空公司号 用于 保险类型区别 直营 非直营
	var isY=true;// 判断是不是Y仓位以上  true 表示是Y舱位 及以下
	var isYca='';// 儿童具体要的舱位编码
	var isDis=false;// 是不是折扣舱位  默认不是折扣舱位   false 不是折扣舱位  true 是折扣舱位
	var hbjinef=0;//红包的价格 去程
	var hashongbaof='false';// 选择的航班是否有红包 去程
	var hbjinet=0;//红包的价格 返程
	var hashongbaot='false';// 选择的航班是否有红包 返程
	var themoneycheck=800;// 儿童价格大于等于这个后 有红包
	//var DsOnePrice = '';// 直营参数
	//var isTrip =  0;//表示没匹配   1//直营差旅  2//直营非差旅
	var isTrippok=3;//  0 表示 非匹配直营  1 匹配直营  2 非直营
	var ZhPolicyId1=0;//  去程 或者单程 深圳航司 的 ZhPolicyId
	var ZhPolicyId2=0;//  返程 深圳航司 的 ZhPolicyId
	var CHOtherParam1={};// 川航直营专用
	var CHOtherParam2={};// 川航直营专用
	var thenophonechild='';// 儿童没有电话的时候 默认填写这个
	// 权限浮动价格问题
	var fromlowflght={};//  存放单程或者 去程最浮动航班信息
	var fromlowflghtprice='';//  存放单程或者 去程浮动价价格
	var tolowflght={};//返程浮动航班信息
	var tolowflghtprice={};//返程浮动航班价格
	// 权限最低价问题
	var fromlowflghto={};//  存放单程或者 去程最浮动航班信息
	var fromlowflghtpriceo='';//  存放单程或者 去程浮动价价格
	var tolowflghto={};//返程浮动航班信息
	var tolowflghtpriceo={};//返程浮动航班价格
	var tonowpriceo={};//返程目前价格
	var isclearps=1;// 是否清除乘机人
	// 余票数量
	var frestnum=0;var trestnum=0;var ddataar=[];// 根据乘机人做出的 差旅判断 数组
	var pfjpricek={};//仓位编码 prouduct传过来的
	//  验票 返回数据保存
	var urldataxh='';var formnumber='';//存放　去程实时验票数据　或者单程
	//var  ishave = true; // 是否有差旅功能 默认有
	var eisall=false;// 是否 让因公变色 且不能点击
	var _class=function(){function _class(opt){_classCallCheck(this,_class);this.path='/flightmb/book$';this.hash='/flightmb/book';this.title='机票预订';opt=opt||{};this.path=opt.path||this.path;this.hash=opt.hash||this.hash;this.title=opt.title||this.title;}// 输出视图
	_createClass(_class,[{key:'view',value:function view(cb){if(!_view){// 静态资源浏览器有缓存,增加时标,强制刷新!
	(0,_api.getView)(_config2.default.view.searchJoin+'?t='+ +new Date(),'',function(rs){_view=rs;cb(null,_view);});}else{cb(null,_view);}}// 在已经加载的视图上操作
	},{key:'bind',value:function bind(dv,params){console.log(params);isclearps=params.isclearps;if(params.pbtype==1){//  判断进入该页面的上一步操作 更改乘机人
	addPass(params.pdata);// 更改乘机人
	checkChailvPassenger();// 检查乘客 并计价  开始是没有这个的
	}else if(params.pbtype==2){addLinkpe(params.linkdata);// 更改联系人
	}else if(params.pbtype==40){// 联系地址
	if(params.data==''){// console.log('发票地址直接返回');
	//console.log(params.data);
	$.qu('.proof-btnbox1').style.left='0.1rem';$.qu('.proof-btnbox').style.backgroundColor='#ccc';$.qu('.proof-box').style.display='none';onOFFp=true;$.qu('.proof-boxt2n').innerHTML='';$.qu('.proof-boxt2p').innerHTML='';$.qu('.proof-boxt2c').innerHTML='';$.qu('.proof-boxt2t').innerHTML='';alloneMone();// 计算价格
	}else{//console.log(params.data);
	var id=params.data.psid;var dataadr=params.data.data;$.qu('.proof-btnbox1').style.left='1.2rem';$.qu('.proof-btnbox').style.backgroundColor='#cc0000';$.qu('.proof-box').style.display='block';onOFFp=false;$.qu('.proof-boxt2n').innerHTML=dataadr.Name;$.qu('.proof-boxt2p').innerHTML=dataadr.Phone;$.qu('.proof-boxt2c').innerHTML=dataadr.Province+dataadr.City+dataadr.Town;$.qu('.proof-boxt2t').innerHTML=dataadr.Addr;theAddresdata=dataadr.Province+dataadr.City+dataadr.Town+dataadr.Addr+'('+dataadr.Name+'收)'+dataadr.Phone;//checkChailvPassenger();//  检查乘客信息
	alloneMone();// 计算价格
	}}else if(params.btype==50){// 差旅原因
	Tripdata=params.readata;//console.log(params.readata.TripType)
	if(params.readata!=''){$.qu('.Tripb-box').style.display='block';$.qu('.Tripb-boxt2n').innerHTML=params.readata.TripType;$.qu('.Tripb-boxt2p').innerHTML=params.readata.TripReason;$.qu('.Tripb-boxt2c').innerHTML=params.readata.PriceReason;$.qu('.Tripb-boxt2t').innerHTML=params.readata.TripNote;$.qu('.Tripb-btnbox1').style.left='1.2rem';$.qu('.Tripb-btnbox').style.backgroundColor='#cc0000';$.qu('.Tripb-box').style.display='block';onOFFr=false;}else{$.qu('.Tripb-btnbox1').style.left='0.1rem';$.qu('.Tripb-btnbox').style.backgroundColor='#ccc';$.qu('.Tripb-box').style.display='none';onOFFr=true;}}else if(params.pbtype==3){// 单或者双程页面进入
	bookdata1=params.ptbdata1;// 去程航班 或者单程航班  thelowf
	bookdata2=params.ptbdata2;// 返程航班
	pfjpricek=params.pfjprice;// 存储 Y仓位以上 基础仓位价格
	if(bookdata2){// 往返
	backFlight=true;// 往返 标记
	}else{backFlight=false;// 往返 标记
	}var time2='';if(bookdata2){time2=bookdata2.data1;}var todetaildata={city00:bookdata1.fplace,city11:bookdata1.tplace,time00:bookdata1.data1,time11:time2,cliktype:1,backtype:1};if(backFlight){urldataxh={citydetail1:todetaildata.city00,citydetail2:todetaildata.city11,timedetail1:todetaildata.time11,timedetail2:todetaildata.time00,cliktype:1,backtype:1};}else{urldataxh={citydetail1:todetaildata.city00,citydetail2:todetaildata.city11,timedetail1:todetaildata.time00,timedetail2:todetaildata.time11,cliktype:1,backtype:1};}// var thecab =bookdata1.theCa;
	// 初始话 乘机人个数
	//ynum =0;  //  儿童个数
	//onum =0;  // 成人个数
	//odnum =0 // 老人个数
	// 浮动价格
	if(bookdata1.thelowf){// 浮动价格
	fromlowflght=bookdata1.thelowf;//  存放单程或者 去程最低价航班
	fromlowflghtprice=fromlowflght.pice1;//  存放单程或者 去程最低价价格
	//fromnowprice =bookdata1.pice1; // 当前价格
	// 最低价
	fromlowflghto=bookdata1.thelowfo;//  存放单程或者 去程最低价航班
	fromlowflghtpriceo=fromlowflghto.pice1;//  存放单程或者 去程最低价价格
	//fromnowpriceo =bookdata1.pice1; // 当前价格
	// 存储当前选择的航班信息
	var bookda1str=JSON.stringify(bookdata1);// 存储 当前选择的 航班信息
	localStorage.setItem('xhbookd1',bookda1str);}else{// 没有低价航班信息 获取存储的
	var bookd1=JSON.parse(localStorage.getItem("xhbookd1"));// 浮动价格
	fromlowflght=bookd1.thelowf;//  存放单程或者 去程最低价航班
	fromlowflghtprice=fromlowflght.pice1;//  存放单程或者 去程最低价价格
	//fromnowprice =bookd1.pice1; // 当前价格
	// 最低价
	fromlowflghto=bookd1.thelowfo;//  存放单程或者 去程最低价航班
	fromlowflghtpriceo=fromlowflghto.pice1;//  存放单程或者 去程最低价价格
	//fromnowpriceo =bookd1.pice1; // 当前价格
	}if(bookdata2&&bookdata2.thelowf){// 返程 航班信息
	// 浮动价格
	tolowflght=bookdata2.thelowf;//返程最低价航班
	tolowflghtprice=tolowflght.pice1;//返程最低价航班
	//tonowprice =bookdata2.pice1; //当前价格
	//最低价
	tolowflghto=bookdata2.thelowfo;//返程最低价航班
	tolowflghtpriceo=tolowflghto.pice1;//返程最低价航班
	//tonowpriceo =bookdata2.pice1; //当前价格
	// 存储当前选择的航班信息 返程
	var bookda2str=JSON.stringify(bookdata2);// 存储 当前选择的 航班信息
	localStorage.setItem('xhbookd2',bookda2str);}else{// 没有低价航班信息 获取存储的
	var bookd2=JSON.parse(localStorage.getItem("xhbookd2"));// 浮动价格
	if(bookd2){// 单程的时候  bookdata2 为空， bookd2为undefined
	tolowflght=bookd2.thelowf;//返程最低价航班
	tolowflghtprice=tolowflght.pice1;//返程最低价航班
	//tonowprice =bookd2.pice1; //当前价格
	//最低价
	tolowflghto=bookd2.thelowfo;//返程最低价航班
	tolowflghtpriceo=tolowflghto.pice1;//返程最低价航班
	//tonowpriceo =bookd2.pice1; //当前价格
	}}tonewbookhtml();//初始话页面
	var Flight=[];//if(bookdata1.Discount =='全价'){
	//    DS =1
	//}else{
	//    DS = bookdata1.Discount.replace('折','');
	//
	//}
	//console.log(DS);
	// 保险参数
	insureType=bookdata1.InsureType;cabinType=bookdata1.CabinType;//判断直营 可以以不用了
	zyTable=bookdata1.zytypep;//  判断直营新方法
	zyCP=bookdata1.theCarrier1;//  判断航空公司号  theCarrier1
	isTrippok=bookdata1.isTrippok;// 航司 匹配标志 1表示 直营匹配 有差旅买
	var myzycp='';// 存放 航司号 公司
	switch(zyCP){// 还原航空公司号
	case"ZH":myzycp='深航直营';break;case"CZ":myzycp='南航直营';break;case"3U":myzycp='川航直营';break;case"HU":myzycp='海南直营';break;}///////// 根据 直营 非直营  在没有 增加乘机人的时候 的 页面初始展示
	// 下面的 判断是  简单的页面展示  按钮 保险等
	if(zyTable==1){// 1 是直营
	if(zyCP=='ZH'){//深圳航空 直营
	getsafeText(insureType);//加载 返程 保险弹层数据
	$.qu('.buysafe').style.display='block';// 显示30保险 选择按钮
	$.qu('.buysafet').style.display='block';//显示 深圳直营 20的按钮
	$.qu('.mttdata-sp1e3').innerHTML='成人票';$.qu('.mttdata-sp3').style.display='inline-block';// 显示 保险 问号弹层
	}else{// 直营 下 四川航空  南航 都没得保险  南航 差旅有保险 后面再改
	$.qu('.mttdata-sp3').style.display='none';// 隐藏 问号弹层
	$.qu('.buysafe').style.display='none';// 隐藏保险 选择按钮
	$.qu('.buysafet').style.display='none';//隐藏 深圳直营 20的按钮
	$.qu('.mttdata-sp1e3').innerHTML='成人票(无保险)';}$.qu('.zycp').style.display='inline-block';// 直营航司 标签显示
	$.qu('.zycp').innerHTML=myzycp;// 直营航司 标签显示
	$.qu('.zycp').style.background='#eee';}else{// 非直营 正常添加 保险
	// ajax 获取数据并加载 单程 或者 返程的 保险说明
	getsafeText(insureType);$.qu('.zycp').style.display='none';// 直营航司 标签隐藏
	$.qu('.zycp').style.background='#fff';$.qu('.mttdata-sp1e3').innerHTML='成人票';$.qu('.mttdata-sp3').style.display='inline-block';// 显示 保险 问号弹层
	$.qu('.buysafe').style.display='block';// 显示保险 选择按钮
	$.qu('.buysafet').style.display='none';// 隐藏 深圳直营 20的按钮
	}// 会员信息
	Member=params.Member;if(bookdata2==''){// 单程
	// 单程儿童 半价问题
	var theCaarr=['P','F','A','J','C','D','Z','R','G','E'];// Y 仓位 以上的仓位 L  thecab
	var thecanum=bookdata1.theCa;// 仓位编码 Y P F
	var cabinlevel=bookdata1.cabinlevel;// 舱位判断 折扣 全价  经济
	isY=cabinlevel.indexOf('经济')==-1?false:true;//  false 不是经济舱  true 是经济舱
	var mekey=false;// false 表示 不是超级经济舱位
	if(!isY){// 不是经济舱
	// 再判断是不是折扣舱位
	isDis=cabinlevel.indexOf('折扣')==-1?false:true;//  false 不是折扣舱位  true是折扣舱位
	isYca=thecanum;}else{// 是经济舱位
	var mymoreca=['超级','明珠','高端','超值','舒适'];for(var i=0;i<mymoreca.length;i++){if(cabinlevel.indexOf(mymoreca[i])!=-1){mekey=true;// 是超级经济舱位
	break;}}if(mekey){isYca=thecanum;}else{// 不是超级经济舱
	isYca='Y';}}console.log('基础仓位的价格');if(bookdata1.discount=='全价'){DS=1;}else{DS=Number(bookdata1.discount.replace('折',''));}frestnum=bookdata1.cbcount;//  单程 余票数量
	// 单程航班
	$.qu('.myBook-flightbox2').style.display='none';$.qu('.flightbox1-text').style.display='none';bookPulldata1(bookdata1);//bookPulldata2(bookdata1)
	onepiect1=bookdata1.pice1;// 当前仓位价格
	if(isY){// 经济舱
	// Y 基础舱位的 全价
	if(mekey){//为超级经济舱
	Fprice=(Number(onepiect1)/20).toFixed(0)*10;//超级经济舱位的全价舱位 为当前舱位价格的一半
	}else{Fprice=(Number(bookdata1.YPrice)/20).toFixed(0)*10;//  计算当前仓位的基础仓位  当前价格/ 折扣 除以2 四舍五入
	}}else{// 非经济舱位
	if(isDis){// 非经济舱 折扣舱
	Fprice=onepiect1;//非经济舱位的折扣舱位 为当前舱位价格
	}else{//非经济舱 全价舱
	Fprice=(Number(onepiect1)/20).toFixed(0)*10;//非经济舱位的全价舱位 为当前舱位价格的一半
	}}hbjinef=bookdata1.hbjine;//红包 价格  单程或者去程
	hashongbaof=bookdata1.hashongbao;// 是否有红包 单程或者去程
	ZhPolicyId1=bookdata1.ZhPolicyId;// 单程 深航 匹配id
	if(zyCP=='3U'){if(zyTable==1){CHOtherParam1={sequenceNumber:bookdata1.sequencenumber,cabinDesc:bookdata1.cabindesc};}else{CHOtherParam1='';}}else{CHOtherParam1='';}}else{frestnum=bookdata1.cbcount;//  去程 余票数量
	trestnum=bookdata2.cbcount;//  返程 余票数量
	$.qu('.myBook-flightbox2').style.display='block';$.qu('.flightbox1-text').style.display='block';bookPulldata1(bookdata2);//填充 返程数据
	bookPulldata2(bookdata1);//填充 去程 或者 单程数据
	insureType1=bookdata2.InsureType;if(bookdata1.discount=='全价'){DS=1;}else{DS=Number(bookdata1.discount.replace('折',''));}if(bookdata2.discount=='全价'){DS1=1;}else{DS1=Number(bookdata2.discount.replace('折',''));}if(zyTable==1){// 1 是直营
	if(zyCP=='ZH'){//深圳航空 直营
	getsafeText1(insureType1);//加载 返程 保险弹层数据
	$.qu('.buysafe').style.display='block';// 显示30保险 选择按钮
	$.qu('.buysafet').style.display='block';//显示 深圳直营 20的按钮
	$.qu('.mttdata-sp1e3').innerHTML='成人票';$.qu('.mttdata1-sp1e3').innerHTML='成人票';$.qu('.mttdata-sp3').style.display='inline-block';// 显示 保险 问号弹层
	$.qu('.mttdata1-sp3').style.display='inline-block';// 显示 保险 问号弹层
	}else{// 直营 下 四川航空  南航 都没得保险  南航 差旅有保险 后面再改
	$.qu('.mttdata-sp3').style.display='none';//隐藏 保险
	$.qu('.mttdata1-sp3').style.display='none';//隐藏 保险
	$.qu('.buysafe').style.display='none';$.qu('.buysafet').style.display='none';//隐藏 深圳直营 20的按钮
	$.qu('.mttdata-sp1e3').innerHTML='成人票(无保险)';$.qu('.mttdata1-sp1e3').innerHTML='成人票(无保险)';}$.qu('.zycp1').style.display='inline-block';// 直营航司 标签显示
	$.qu('.zycp1').innerHTML=myzycp;// 直营航司 标签显示
	$.qu('.zycp').style.display='inline-block';// 直营航司 标签显示
	$.qu('.zycp').innerHTML=myzycp;// 直营航司 标签显示
	$.qu('.zycp1').style.background='#eee';$.qu('.zycp').style.background='#eee';if(zyCP=='3U'){CHOtherParam1={sequenceNumber:bookdata1.sequencenumber,cabinDesc:bookdata1.cabindesc};CHOtherParam2={sequenceNumber:bookdata2.sequencenumber,cabinDesc:bookdata2.cabindesc};}else{CHOtherParam1='';CHOtherParam2='';}}else{// 非直营 正常添加 保险
	getsafeText1(insureType1);//加载 返程 保险弹层数据
	$.qu('.zycp').style.display='none';// 直营航司 标签隐藏
	$.qu('.zycp1').style.display='none';// 直营航司 标签显示
	$.qu('.zycp1').style.background='#fff';$.qu('.zycp').style.background='#fff';$.qu('.mttdata-sp3').style.display='inline-block';//隐藏 保险
	$.qu('.mttdata1-sp3').style.display='inline-block';//隐藏 保险
	$.qu('.mttdata-sp1e3').innerHTML='成人票';$.qu('.mttdata1-sp1e3').innerHTML='成人票';$.qu('.buysafe').style.display='block';// 显示保险 选择按钮
	$.qu('.buysafet').style.display='none';//隐藏 深圳直营 20的按钮
	CHOtherParam1={};CHOtherParam2={};}onepiect1=bookdata1.pice1;// 返程的价格
	onepiect2=bookdata2.pice1;// 去程的价格
	hbjinef=bookdata2.hbjine;//红包 价格  单程或者去程
	hashongbaof=bookdata2.hashongbao;// 是否有红包 单程或者去程
	hbjinet=bookdata1.hbjine;//红包 价格  返程
	hashongbaot=bookdata1.hashongbao;// 是否有红包 返程
	ZhPolicyId1=bookdata1.ZhPolicyId;// 去程 深航 匹配id
	ZhPolicyId2=bookdata1.ZhPolicyId;// 返程 深航 匹配id
	}var data2={a:bookdata1.RouteFromCode,b:bookdata1.RouteToCode,c:bookdata1.pcnum,d:bookdata1.theCa,e:bookdata1.data1,h:bookdata1.pice1,v:bookdata1.cbcount,ct:bookdata1.CabinType};if(backFlight){var data1={a:bookdata2.RouteFromCode,b:bookdata2.RouteToCode,c:bookdata2.pcnum,d:bookdata2.theCa,e:bookdata2.data1,h:bookdata2.pice1,v:bookdata2.cbcount,ct:bookdata2.CabinType};checkPricedata=[data1,data2];}else{checkPricedata=[data2];}// 验票 函数 数据返回 实时验票
	getabinCount();checkPriceFun();// 验价
	//alloneMone(); // 总计价格
	checkChailvPassenger();// 检查差旅乘客数量
	}allmyClickbook();//初始话点击事件
	//  选择因公因私 按钮
	getTripFn();// 重头戏  提交订单按钮  成人加儿童 和 往返 都提交2次订单
	$.qu('.allprice2').onclick=function(){// 产品页面 进入book 所带数据
	// $.router.go('#!/flightmb/book',{pbtype:3,ptbdata1:tobookdata1,ptbdata2:fitstData,Member:Member},true)
	//userOnoffpb('b',myBookFn,'myBook');
	//var  bookdatab ={
	//    pbtype:3,
	//    ptbdata1:bookdata1,
	//    ptbdata2:bookdata2,
	//    Member:''
	//};
	var time2='';if(bookdata2){time2=bookdata2.data1;}var todetaildata={citydetail1:bookdata1.fplace,citydetail2:bookdata1.tplace,timedetail1:bookdata1.data1,timedetail2:time2,cliktype:1,backtype:1};var bookdata=JSON.stringify(todetaildata);//(bookdata);
	(0,_api.userOnoffpp)('b',myBookFn,'myBook','.lodinb',bookdata,'抱歉，登录超时，为确保余票充足，请重新查询该航班~');};// 页面返回
	// checkChailvPassenger();// 检查差旅乘客数量
	$.qu('.myBook-tt1').onclick=function(){// 这个返回 走 我的订单界面
	$.router.go('#!/flightmb/detail',urldataxh,true);};//头部主页返回
	$.qu('.b_home').onclick=function(){return $.router.go('#!/flightmb/join','',false);};//  动态修改 头部电话
	pullHeadphoneB();}}]);return _class;}();///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//  动态修改 头部电话
	exports.default=_class;function pullHeadphoneB(){var telOB=$.qu('.b_phone');var zycpB=$.qu('.zycp').style.display=='none'?0:1;//  1为直营
	var cpnum=$.qu('.myBook-mtfsp3').innerHTML.substring(0,2);console.log('\u76F4\u8425\u6807\u8BB0='+zycpB);if(zycpB==0){getCZphoneb('XHSV',telOB);}else{switch(cpnum){case"ZH":getCZphoneb('ZH',telOB);break;case"CZ":getCZphoneb('CZ',telOB);break;case"3U":getCZphoneb('3U',telOB);break;}}}function getCZphoneb(key,el){(0,_api.myget)(flightUrl+'/icbc/xhService.ashx','act=GETSERVICEPHONE&Source='+key,true,function(err,res){if(err){(0,_api.myalertp)('router0','出错了，获取客服联系电话失败！');}else{var oData3=eval('('+res+')');var phonts=oData3.Result.Phone;var phontn=oData3.Result.Source;el.href='tel:'+phonts;}});}// 检查余票数量 及  成绩人不能超过9人
	function checkpsnum(){var thepsnump=$.qus('.myBook-namel').length;// 乘机人数量
	//console.log('乘机人个数'+thepsnump)
	return thepsnump<=9;}function checktickesnum(){var thepsnum=$.qus('.myBook-namel').length;//frestnum = bookdata1.cbcount;//  去程 余票数量
	//trestnum = bookdata2.cbcount;//  返程 余票数量
	if(frestnum=='A'){frestnum=10;}if(trestnum=='A'){trestnum=10;}//console.log(frestnum)//  8
	//console.log(trestnum)//  0
	//console.log(thepsnum)//  1
	var fda=0;var tda=0;if(backFlight){// 往返
	if(frestnum<thepsnum){fda=0;}else{fda=1;}if(trestnum<thepsnum){tda=0;}else{tda=1;}}else{//单程
	//if( frestnum < thepsnum){
	//    fda =0
	//}else{
	//    fda =1
	//}
	fda=frestnum<thepsnum?0:1;}return[fda,tda];}function myAlertBox(b,fn,fns){// 弹出层   b为显示的提示数据   fn 为确定后执行函数  fns 为取消执行函数
	var a=document.getElementById("book-alert");a.style.display="-webkit-box";a.getElementsByClassName("book-alert-info")[0].innerHTML=b;var yesBtn=a.getElementsByClassName("book-alert-yes")[0];var noBtn=a.getElementsByClassName("book-alert-no")[0];yesBtn.onclick=function(){a.style.display="none";if(fn&&typeof fn=="function"){fn();}};noBtn.onclick=function(){a.style.display="none";if(fns&&typeof fns=="function"){fns();}};}//  预定函数
	function myBookFn(){//  存放单程或者 去程目前价格 不能根据 带入数据获取 应该 在页面中获取
	var fromnowpriceo=$.qu('.mttbookprice').innerHTML;var fromnowprice=fromnowpriceo;//  存放单程或者 去程目前价格
	var tonowprice=$.qu('.mttbookprice4').innerHTML;;//返程目前价格 mttbookprice4
	var tonowpriceo=tonowprice;//返程目前价格
	alloneMone();//  提示语 数组
	// 0.最低价 1.浮动次低价  2.没有经济舱位
	var alertText=['温馨提示：按贵公司规定，同航班需订最低价，改订最低价舱位，请点击“确定”，否则点击“取消”，重新选择航班！','温馨提示：按贵公司规定，同航班需订低价，改订低价舱位，请点击“确定”，否则点击“取消”，重新查询航班！','提示：非常抱歉，贵公司没有为您设定公务舱、头等舱级别，不能购买，请更换航班或联系贵公司差旅专员购买。'];// 返回搜索页面 的函数
	function gotodetile(){var time2='';if(bookdata2){time2=bookdata2.data1;}var todetaildata={city00:bookdata1.fplace,city11:bookdata1.tplace,time00:bookdata1.data1,time11:time2};$.router.go('#!/flightmb/detail',{citydetail1:todetaildata.city00,citydetail2:todetaildata.city11,timedetail1:todetaildata.time00,timedetail2:todetaildata.time11,cliktype:1,backtype:1},true);}addchildphone();// 默认添加 儿童为无电话 电话为 第一个成人的电话
	var theuserdata=JSON.parse((0,_api.GetCookie)('theUserdata'));//var thePerm = (JSON.parse(GetCookie('theUserdata'))).xhPerms;// 获取perm 信息
	console.log('cookie获取用户信息');console.log(theuserdata);Member={name:theuserdata.userName,No:theuserdata.userID};var nottripName="";//console.log(Member);
	console.log('非差旅名单');console.log(nottripNum);if(nottripNum.length>0){for(var i=0;i<nottripNum.length;i++){nottripName+=nottripNum[i]+",";}}if(nottripName.replace(/\|/g,"").length>0){nottripName=nottripName.substring(0,nottripName.length-1);}////  检查 因公 选项
	var isalert=false;var thebtnnum=$.qu('.ygLeft-box').getAttribute('choicetype');if(thebtnnum==1&&$.qu('.goReason').style.display=='block'){// 表示 选择的因公
	isalert=true;}if(!mPassengerIsValidated&&isalert){// 检查 乘客信息是否通过  如果  是因公的话 就弹出非差旅名单
	//alert("乘机人中有企业客户，请分别下单购买。");
	(0,_api.myalertp)('myBook','乘机人中有非企业客户(姓名:'+nottripName+')，请分别下单购买。');}else{if(!onOFFp){// 凭证开关
	//ShipFeeOnoff = shipMoney;
	// 邮费
	var isexp=$.qu('.y_exp').getAttribute('extype');ShipFeeOnoff=isexp==1?shipMoney:0;ShipAddr=theAddresdata;}else{ShipFeeOnoff=0;ShipAddr='';}//var Member ={name:'kenrecall1',No:'MFW1611210050159038'}; //会员信息
	var Contact=contactdata();//{name:'肖浩',phone:'1388004134'，id:990};// 联系人信息
	//console.log(Contact);
	var noty=onum+odnum;// 老人 和 成人
	var alluum=noty+ynum;//  老人 成人 儿童 所有数量
	if(backFlight){// 往返
	//console.log('儿童数:'+ynum)//儿童数量
	if(alluum==0){// 没有乘机人
	//alert('请选择乘机人！')
	(0,_api.myalertp)('myBook','请选择乘机人!');}else{if(!checkpsnum()){(0,_api.myalertp)('myBook','抱歉,单个订单乘机人不能超过9人。');return false;}var tnum=checktickesnum();if(tnum[0]==0){(0,_api.myalertp)('myBook','抱歉,去程余票数量小于乘机人数量，请分别下单或者更换航班。');return false;}if(tnum[1]==0){(0,_api.myalertp)('myBook','抱歉,返程余票数量小于乘机人数量，请分别下单或者更换航班。');return false;}if(Contact.name!=''&&Contact.phone!=''){if(ynum!=0){// 成人个数
	//alert('儿童不能订往返票！！')
	(0,_api.myalertp)('myBook','儿童不能订往返票！');}else{// 用户信息 Member
	var bookDataTF=[bookdata2,bookdata1];//console.log( '往返航班信息');
	//console.log( bookDataTF);
	var Passengers=[passengerAlldataone(onepiect2),passengerAlldataone(onepiect1)];//console.log( '往返乘客信息');
	//console.log( Passengers);
	var nullphname=thenonephone();if(nullphname.length!=0){(0,_api.myalertp)('myBook','\u4E58\u673A\u4EBA:'+nullphname.toString()+' \u7535\u8BDD\u4E3A\u7A7A');//乘机人电话为空
	return false;}if(getpassengerPhone()){(0,_api.myalertp)('myBook','抱歉,乘机人电话有重复,请核实');}else{// 往返
	var nump=ddataar;if(nump[0]>0){// 全部匹配 为差旅
	var thebtnnum=$.qu('.ygLeft-box').getAttribute('choicetype');if(thebtnnum==1&&$.qu('.goReason').style.display=='block'){// 都为因公
	if(nump[7]==1){//编码公司 是不是一样
	if(nump[3]==1){// 权限为 1 或者 3的时候  弹层及预订函数 提取公共部分
	var gotoBookbackf=function gotoBookbackf(text,data1,data2){myAlertBox(text,function(){//测试默认 重新刷数据
	$.router.go('#!/flightmb/book',{pbtype:3,ptbdata1:data1,ptbdata2:data2,Member:'',pfjprice:pfjpricek,isclearps:0},true);},gotodetile);};// 为1   则表示权限等级统一
	if(nump[4]==0){// 0权限 表示 任何都能订票 无限制
	pullAlldatatoBook(bookDataTF,ShipFeeOnoff,Passengers,Contact,ShipAddr,DS,Member,Tripdata);///////
	}else if(nump[4]==3){//3权限 表示 浮动价权限
	if(Number(fromnowprice)>Number(fromlowflghtprice)&&fromnowprice||Number(tonowprice)>Number(tolowflghtprice)&&tonowprice){// 没有选择最低价 须有最低价进来  不然 就是2次加载的
	gotoBookbackf(alertText[1],fromlowflght,tolowflght);}else{// 因公 已经选择了最低价
	pullAlldatatoBook(bookDataTF,ShipFeeOnoff,Passengers,Contact,ShipAddr,DS,Member,Tripdata);}}else if(nump[4]==1){//1权限 表示 只能最低价仓位
	if(Number(fromnowpriceo)>Number(fromlowflghtpriceo)&&fromnowpriceo||Number(tonowpriceo)>Number(tolowflghtpriceo)&&tonowpriceo){// 没有选择最低价 须有最低价进来  不然 就是2次加载的
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
	var fkey=fromlowflghto.cabinlevel.indexOf('经济')!=-1?true:false;var tkey=tolowflghto.cabinlevel.indexOf('经济')!=-1?true:false;if(fkey&&fkey){// 说明有经济舱位
	gotoBookbackf(alertText[0],fromlowflghto,tolowflghto);// 弹出 浮动次低价提示 并 预定
	}else{// 说明没有经济舱位
	//if(fkey && !tkey){ //准备分开提示 去程 返程
	//    myalertp('myBook',alertText[2])
	//}
	(0,_api.myalertp)('myBook',alertText[2],gotodetile);}}else{// 因公 当前航班已经选择了最低价
	pullAlldatatoBook(bookDataTF,ShipFeeOnoff,Passengers,Contact,ShipAddr,DS,Member,Tripdata);}}}else{//为0   则表示权限等级统一
	(0,_api.myalertp)('myBook','温馨提示：按贵公司规定，不同差旅政策的乘客不能一起下单');}}else{(0,_api.myalertp)('myBook','抱歉,乘客所属公司不同，不能同时下单！');return false;}}else{// 因私 不要判断 最低价
	pullAlldatatoBook(bookDataTF,ShipFeeOnoff,Passengers,Contact,ShipAddr,DS,Member,Tripdata);}}else{// 全部不匹配 都为非差旅
	pullAlldatatoBook(bookDataTF,ShipFeeOnoff,Passengers,Contact,ShipAddr,DS,Member,Tripdata);}//pullAlldatatoBook(bookDataTF,ShipFeeOnoff,Passengers,Contact,ShipAddr,DS,Member,Tripdata);
	}}}else{//alert('请选择正确的联系人信息！')
	(0,_api.myalertp)('myBook','请选择联系人信息！');}}}else{// 单程
	if(noty!=0){// 成人加老人 总个数
	// 用户信息 Member
	//console.log('单程儿童个数'+ynum)
	if(ynum>noty*2){(0,_api.myalertp)('myBook','抱歉，一个成人最多只能携带2名儿童');return false;}var np=checkpsnum();if(!np){(0,_api.myalertp)('myBook','抱歉,单个订单乘机人不能超过9人。');return false;}if(Contact.name!=''&&Contact.phone!=''){var Passenger=passengerAlldataone(onepiect1);// 乘客信息数据整合完毕
	//console.log(Passenger);
	var _nullphname=thenonephone();if(_nullphname.length!=0){(0,_api.myalertp)('myBook','\u4E58\u673A\u4EBA:'+_nullphname.toString()+' \u7535\u8BDD\u4E3A\u7A7A');//乘机人电话为空
	return false;}if(getpassengerPhone()){(0,_api.myalertp)('myBook','抱歉,乘机人电话有重复,请核实');}else{var tnum=checktickesnum();if(tnum[0]==0){(0,_api.myalertp)('myBook','抱歉,余票数量小于乘机人数量，请分别下单或者更换航班。');return false;}var nump=ddataar;//  参数意思 0.差旅人个数  1.非差旅个数 2.总人数 3.权限是否统一 4.权限具体代码 5.非差旅名单 6.部门编码 7.是否为同一编码公司
	if(nump[0]>0){// 全部匹配 为差旅 因为前已经判断了的
	var thebtnnum=$.qu('.ygLeft-box').getAttribute('choicetype');if(thebtnnum==1&&$.qu('.goReason').style.display=='block'){// 表示 选择的因公
	if(nump[7]==1){//编码公司 是不是一样
	if(nump[3]==1){var gotoBook=function gotoBook(text,data){myAlertBox(text,function(){//测试默认 重新刷数据
	$.router.go('#!/flightmb/book',{pbtype:3,ptbdata1:data,ptbdata2:'',Member:'',pfjprice:pfjpricek,isclearps:0},true);},gotodetile);};// 为1   则表示权限等级统一
	//   检查 差旅审批
	if(nump[4]==0){// 0权限 表示 任何都能订票 无限制
	pullAlldatatoBook(bookdata1,ShipFeeOnoff,Passenger,Contact,ShipAddr,DS,Member,Tripdata);}else if(nump[4]==3){//3 权限 表示 只能是浮动价格
	if(Number(fromnowprice)>Number(fromlowflghtprice)&&fromnowprice){// 没有选择最低价 须有最低价进来  不然 就是2次加载的
	if(fromlowflght.cabinlevel.indexOf('经济')!=-1){// 说明有经济舱位
	gotoBook(alertText[1],fromlowflght);// 弹出 浮动次低价提示 并 预定
	}else{// 说明没有经济舱位
	(0,_api.myalertp)('myBook',alertText[2],gotodetile);}//gotoBook(alertText[1],fromlowflght);// 弹出 浮动次低价提示 并 预定
	}else{// 因公 已经选择了最低价
	pullAlldatatoBook(bookdata1,ShipFeeOnoff,Passenger,Contact,ShipAddr,DS,Member,Tripdata);}}else if(nump[4]==1){//1 权限 表示 只能最低价仓位
	if(Number(fromnowpriceo)>Number(fromlowflghtpriceo)&&fromnowpriceo){// 没有选择最低价 须有最低价进来
	if(fromlowflghto.cabinlevel.indexOf('经济')!=-1){// 说明有经济舱位
	gotoBook(alertText[0],fromlowflghto);// 弹出 浮动次低价提示 并 预定
	}else{// 说明没有经济舱位
	(0,_api.myalertp)('myBook',alertText[2],gotodetile);}// gotoBook(alertText[0],fromlowflghto);// 弹出 最低价提示 并 预定
	}else{// 因公 已经选择了最低价
	pullAlldatatoBook(bookdata1,ShipFeeOnoff,Passenger,Contact,ShipAddr,DS,Member,Tripdata);}}}else{//为0   则表示权限等级统一
	(0,_api.myalertp)('myBook','温馨提示：按贵公司规定，不同差旅政策的乘客不能一起下单');}}else{(0,_api.myalertp)('myBook','抱歉,乘客所属公司不同，不能同时下单！');return false;}}else{// 因私 不要判断 最低价 或者 不是海南行
	pullAlldatatoBook(bookdata1,ShipFeeOnoff,Passenger,Contact,ShipAddr,DS,Member,Tripdata);}}else{// 全部不匹配 都为非差旅
	pullAlldatatoBook(bookdata1,ShipFeeOnoff,Passenger,Contact,ShipAddr,DS,Member,Tripdata);}// pullAlldatatoBook(bookdata1,ShipFeeOnoff,Passenger,Contact,ShipAddr,DS,Member,Tripdata);
	}}else{//alert('请选择正确的联系人信息！')
	(0,_api.myalertp)('myBook','请选择联系人信息！');}}else{if(ynum!=0){//alert('儿童不能单独订票！！')
	(0,_api.myalertp)('myBook','儿童不能单独订票！');}else{//alert('请选择乘机人！')
	(0,_api.myalertp)('myBook','请选择乘机人');}}};};}// 获取乘机人 电话号码 不能重复
	function getpassengerPhone(){var thephonenumber=[];$.each($.qus('.myBook-namel'),function(){var pdata=JSON.parse($.attr(this,'data'));if(pdata.Age!='儿童'){thephonenumber.push(pdata.Phone);if(pdata.Phone==''){return true;}}});var has={};for(var i in thephonenumber){if(has[thephonenumber[i]]){return true;}else{has[thephonenumber[i]]=true;}}return false;}//  判断电话是否为空
	function thenonephone(){var allps=$.qus('.myBook-namel');var nullphone=[];for(var i=0;i<allps.length;i++){var pdata=JSON.parse($.attr(allps[i],'data'));if(pdata.Age!='儿童'){if(!pdata.Phone){nullphone.push(pdata.Name);}}}return nullphone;}// 给儿童没有电话的 默认加上 第一个成人的电话
	function addchildphone(){var thefirstphonenum='';var allps=$.qus('.myBook-namel');for(var i=0;i<allps.length;i++){var pdata=JSON.parse($.attr(allps[i],'data'));if(pdata.Age!='儿童'){thefirstphonenum=pdata.Phone;break;}}thenophonechild=thefirstphonenum;}function ertong(){var listLis=$.qus(".myBook-namel");var str="儿童";if(listLis.length>0){for(var i=0;i<listLis.length;i++){// alert(listLis[i].children[1].children[0].innerHTML.indexOf(str));
	if(listLis[i].children[1].children[0].innerHTML.indexOf(str)>-1){listLis[i].children[2].children[0].innerHTML="出生日期";}}}}// 初始话页面函数
	function tonewbookhtml(){if(isclearps==1){//  需要清除 乘机人 和 联系人
	$.qu('.myBook-nameul').innerHTML='';// 清空乘机人buysafet
	$.qu('.linkman4').innerHTML='';$.qu('.linkman2').innerHTML='';}$.qu('.buysafet').style.display='none';// 隐藏20的保险
	$.qu('.Tripb').style.display='none';$.qu('.goReason').style.display='none';//因公因私
	$.qu('.Tripb-box').style.display='none';$.qu('.Tripb-btnbox1').style.left='0.1rem';$.qu('.Tripb-btnbox').style.backgroundColor='#ccc';$.qu('.Tripb-boxt2n').innerHTML='';$.qu('.Tripb-boxt2p').innerHTML='';$.qu('.Tripb-boxt2c').innerHTML='';$.qu('.Tripb-boxt2t').innerHTML='';$.qu('.zycp').style.display='none';$.qu('.zycp').style.background='#fff';onOFFr=true;$.qu('.allprice11').innerHTML=0;//初始化价格
	$.qu('.buysafe-price').innerHTML=30;//初始化保险价格
	//  还原页面初始话 儿童是隐藏的
	$.qu('.myBook-mttdatay').style.display='none';//发票按钮初始话
	$.qu('.proof-btnbox1').style.left='0.1rem';$.qu('.proof-btnbox').style.backgroundColor='#ccc';$.qu('.proof-box').style.display='none';onOFFp=true;// 清空发票内容
	$.qu('.proof-boxt2n').innerHTML='';$.qu('.proof-boxt2p').innerHTML='';$.qu('.proof-boxt2c').innerHTML='';$.qu('.proof-boxt2t').innerHTML='';}// 检查乘机人是不是有 差旅权限
	function checktheroule(data){console.log('整合后数据');console.log(data);var allthepas=data;var unitIDarr=[];// 存放不同分行的公司 id 区别 海南 和工行
	var roule_0=[];// 存放权限 为 0 的人数
	var roule_1=[];// 存放权限 为 1 的人数
	var roule_3=[];// 存放权限 为 3 的人数
	var roule_10=[];// 存放权限 为 10 的人数
	var roule_11=[];// 存放权限 为 11 的人数
	var roule_d=[];// 存放权限 除开 0 1 3 的乘客 未知权限
	var roule_n=[];// 存放授信状态为4  账号不关联的乘客
	var notripPeoples=[];//非差旅人员
	var noytripPeoples=[];//是差旅人员 但是会员账号不匹配
	//  存放 所有人 的差旅状态 是否为差旅  1为是 0 为否  只针对OweStatus 及Perm 第一次判断 后面还要做综合判断 初始判断因公因私
	var alltripps=[];/////
	var owsarr='2,4';// 2 和 4 为差旅
	var contarr='87,85,84,76';// 该账号 如果是 45   对应的公司id  虚拟 perm
	//var contarr = ''; // 该账号 如果不是 45          对应的公司id  虚拟
	for(var i=0;i<allthepas.length;i++){var owestatus=allthepas[i].OweStatus;// 白名单 状态 目前 有2 和 4 是正常的 差旅判断标致
	var unitId=allthepas[i].UnitId;// 用于 白名单状态为 4   要对应 会员账户的 关联公司unitId
	var roule=allthepas[i].rule;// 当前乘机人的 rule权限 为一个字符串 '0,3,7'
	var theroule=roule.split(',');// 当前乘机人的 rule权限 为一个字符串 '0,3,7'
	unitIDarr.push(unitId);// 所有乘机人 的 公司id  数组
	// alert(`2或者4判断owestatus=${owestatus}`)
	if(owsarr.indexOf(owestatus)!=-1){// 说明 是2 或者 4 为差旅用户
	if(theroule.indexOf('11')!=-1){// 权限为11
	roule_11.push(1);// 有 rule 为11 的时候 存为1
	}else{roule_11.push(0);// 没有 rule 为11 的时候 存为0
	}if(owestatus=='4'){//OweStatus 为4  说明 特殊账户才能给当前用户下单
	var thePerm=JSON.parse((0,_api.GetCookie)('theUserdata')).xhPerms;// 获取perm 信息
	//var thePerm = '';
	console.log('账户perm字符串');console.log(thePerm);if(thePerm){// perm不为空 说明该会员账户 是特殊的绑定账号
	var thePermarr=thePerm.split(',');if(thePermarr.indexOf(unitId)!=-1){// 有关联 关系
	//alert(1)
	alltripps.push(1);// 差旅用户 填入数组
	}else{// 为特殊账号 但是 和乘机人的公司 不匹配 没有关联关系
	alltripps.push(0);// 差旅用户 填入数组
	notripPeoples.push(allthepas[i].Name);//非差旅人名称
	noytripPeoples.push(allthepas[i].Name);// 账号不匹配人名
	//alert(2)
	}}else{// 为空 不为特殊账号 该乘机人就不是差旅用户
	noytripPeoples.push(allthepas[i].Name);// 账号不匹配人名
	notripPeoples.push(allthepas[i].Name);//非差旅人名称
	alltripps.push(0);// 差旅用户 填入数组
	}}else{alltripps.push(1);// 差旅用户 填入数组
	}}else{// 非差旅用户 把i传入 非差旅 数组
	alltripps.push(0);// 非差旅用户 填入数组
	notripPeoples.push(allthepas[i].Name);// 非差旅名称填入数组
	roule_11.push(0);// 没有 rule 为11 的时候 存为0
	}}console.log('初始差旅和非差旅数组');console.log(alltripps);//  差旅判断 模拟数据
	//var  pstdata =[
	//    ['2017-06-20','2017-06-28','重庆','北京、上海','培训',2],
	//    ['2017-06-20','2017-06-28','重庆','北京、上海','培训',1],
	//    ['2017-05-20','2017-05-28','重庆','北京、上海','培训',2]
	//];
	// roule_11  ;// 有权限为11 组成的数组  0 为 没有 1 为有 [0,0,1,0] 说明第4位乘机人 有差旅需要审批
	console.log('权限为11的数组');console.log(roule_11);// 航班信息 用于匹配 差旅
	var flightdata={d:bookdata1.data1,f:bookdata1.fplace,t:bookdata1.tplace};// 航班信息不匹配的直接变成非差旅了 还有未审批的也变成非差旅了
	// 循环 roule_11  数组   判断 是不是 都为11
	// 还需要存储 审批没通过的索引 或者他的名字
	var e_tarr=[];//  11权限 在判断 是否审批通过后整合的数据
	var no_trippass=[];// 存放 差旅信息审批没通过的人名
	var no_notrippass=[];// 存放 没有差旅审批的plan的人 plan 为空
	// 0 没得11  非0 就是有11
	var ne_psname=[];//  11权限 未审批通过的 人名称 只是 不为2的情况
	for(var _j=0;_j<roule_11.length;_j++){if(roule_11[_j]==1){// 是11  有差旅审批
	//  要对每个乘机人的 plan 进行循环  一个乘机人 可能有多个 差旅申请
	var thetripda=allthepas[_j].planda;console.log(thetripda);if(thetripda.length==0){// 有11 但是 没有差旅审批plan 即使 plan为空 没得数据 11数组中存为12
	e_tarr.push(12);no_notrippass.push(allthepas[_j].Name);}else{// 有plan 的乘机人人
	//  可能有多个请假 需要综合再判断
	var ise_tarr=false;// 是否通过2  默认不通过
	var isne_psname=false;// 是否是航班信息匹配但是 不是2
	var isno_trippass=false;//  航班信息不匹配 和 匹配但是 不是2 的合计人名
	for(var _i=0;_i<thetripda.length;_i++){console.log(datetoNumber(thetripda[_i].StartDate));console.log(datetoNumber(bookdata1.data1));console.log(datetoNumber(thetripda[_i].EndDate));//////
	if(datetoNumber(thetripda[_i].StartDate)<=datetoNumber(bookdata1.data1)&&datetoNumber(bookdata1.data1)<=datetoNumber(thetripda[_i].EndDate)&&thetripda[_i].From==bookdata1.fplace&&thetripda[_i].To.indexOf(bookdata1.tplace)!=-1){//选择的航班 满足 审批的条件 下一步需要判断 是否 审批通过
	if(thetripda[_i].Status==2){//e_tarr.push(1); // 有11  航班信息匹配 且通过
	//console.log('差旅时间和条件匹配')
	console.log('第一条匹配plan');ise_tarr=true;break;}else{//有11 航班信息匹配  但是审批状态不为2  则数组存放10 变为 因私
	ise_tarr=false;isne_psname=true;isno_trippass=true;console.log('第一条航班不匹配plan');//e_tarr.push(10);
	//ne_psname.push(allthepas[i].Name)
	//no_trippass.push(allthepas[i].Name)
	}}else{//有11  不满足 航班条件 就直接 返10  那就是因私了
	ise_tarr=false;isno_trippass=true;}}// 循环单个乘机人的所有请假审批后 得出 总的判断
	if(ise_tarr){e_tarr.push(1);// 有11  航班信息匹配 且通过
	console.log('差旅时间和条件匹配');}else{if(isne_psname){e_tarr.push(10);ne_psname.push(allthepas[_j].Name);no_trippass.push(allthepas[_j].Name);}else{e_tarr.push(10);no_trippass.push(allthepas[_j].Name);}}}//////////////////
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
	}else{//是0  没有差旅审批 没得11
	e_tarr.push(0);}}//////
	console.log('整合后11审批数据');console.log(e_tarr);//  整合 初始筛选的 因公因私  和  判断11 后的因公因私
	// 初始筛选的 因公因私  数组 alltripps [0,0,1]  0 为因私  1 为因公
	// 判断11后的 因公因私  数组 e_tarr    [0,1,1]  0 为因私  1 为因公
	console.log('整合后差旅及非差旅数组');console.log(alltripps);var ntripname=[];// 存放初次筛选 和 11筛选后非差旅的名字 所有综合后
	var yesroule=[];// 存放差旅人个数  所有综合后
	var noroule=[];//   存放非差旅个数  所有综合后
	for(var _i2=0;_i2<alltripps.length;_i2++){if(alltripps[_i2]==0){// 非差旅
	ntripname.push(allthepas[_i2].Name);noroule.push(0);}else{// 为1 就是差旅了
	yesroule.push(1);var ky=_i2;var roule=allthepas[ky].rule;// 当前乘机人的 rule权限 为一个字符串 '0,3,7'
	var theroule=roule.split(',');// 当前乘机人的 rule权限 为一个字符串 '0,3,7' 数组 indexOf
	if(theroule.indexOf('0')!=-1){// 权限为0
	roule_0.push(_i2);}else if(theroule.indexOf('1')!=-1){// 权限为1
	roule_1.push(_i2);}else if(theroule.indexOf('3')!=-1){// 权限为3
	roule_3.push(_i2);}else{// 没有 0 或者1  或者 3
	roule_d.push(_i2);}if(theroule.indexOf('10')!=-1){// 权限为10  无保险
	roule_10.push(_i2);}}}////////////////////
	//return{'差旅用户数组':yesroule,'非差旅用户数组':noroule,'权限为0':roule_0,'权限为1':roule_1,'权限为3':roule_3,'权限未知':roule_d,'账号不匹配':roule_n,'非差旅人名':notripPeoples,'不匹配人名':noytripPeoples};
	// 判断  权限是不是 都为0  或者都为1
	var allp=allthepas.length;// 已选择乘机人数量
	var r_0=roule_0.length;// 权限为0 的数量
	var r_1=roule_1.length;// 权限为1 的数量
	var r_3=roule_3.length;// 权限为1 的数量
	var r_10=roule_10.length;// 权限为10 的数量
	var r_d=roule_d.length;// 权限为d 的数量 未知权限
	var r_n=roule_n.length;// 账号不匹配的人 数量
	var isall=0;//  权限是否统一
	var isthenum=0;//权限具体等级
	if(allp==r_0||allp==r_1||allp==r_3||allp==r_d){// 说明权限是 统一的  未知权限当着 0 处理
	isall=1;if(r_10!=0){// 说明有 10的 乘机人
	if(allp!=r_10){isall=0;}}if(allp==r_0){isthenum=0;}else if(allp==r_1){isthenum=1;}else if(allp==r_3){isthenum=3;}else if(allp==r_d){//  非 0 或者1  3 的时候  权限等级 目前设置为0
	isthenum=0;}}else{isall=0;}var iscompany=0;//默认是 不同一公司
	var firstn='';var yesroulelen=yesroule.length;// 差旅人数
	var noroulelen=noroule.length;// 非差旅人数 包含账号不匹配乘机人
	if(yesroulelen==allp){// 差旅人数和 总人数一样 说明 全是差旅
	iscompany=1;// 如果都是差旅 就默认是一个公司 下面还要逐个判断
	firstn=unitIDarr[0];for(var j=0;j<unitIDarr.length;j++){if(firstn!=unitIDarr[j]){iscompany=0;break;}}}else{iscompany=0;}/////////////////////
	//var  eisall= e_tarr.indexOf(0) != -1?0:1 ;// 是否 所有乘机人 能一起购票  有一个没通11  就不能一起下单
	// var  eisall= false;// 因公灰色 判断标记  false 不要灰色  true 为灰色不能点击
	var no_yestrip=ne_psname.length;//ne_psname  差旅审批11 未通过的 人的数组  长度不为0 说明 有没有通过的 只是 不为2的情况
	var no_trippaslen=no_trippass.length;//no_trippass  差旅航班信息不匹配 和 审批未通过的 人的数组 人数总计
	var no_strip=ntripname.length;//ntripname  整合后 所有非差旅人名(因为 没通过审批或者 审批信息不匹配 还是 要出现灰色 不能直接变成散客)
	var no_notrippas=no_notrippass.length;//no_notrippass  有11 但是没有plan的乘机人  未请假的人的集合
	//var eisall = no_yestrip != 0 ? true: false;
	if(no_yestrip!=0||no_notrippas!=0){// 有未通过的11 或者 有没请假的
	eisall=true;}else{// 没有未通过11 的
	eisall=false;// 有散客的时候 也要 有灰色标记
	if(noroulelen!=0&&yesroulelen!=0){//  既有散客 也有差旅的时候
	eisall=true;}if(no_trippaslen!=0){// 有航班信息不匹配的 已经排除了 有审批未通过的
	eisall=true;}}if(eisall){// 有散客 /有未通过的11 / 有没请假的
	var str1='';// 审批为通过的人名
	var str2='';// 非差旅人名单
	var str3='';//不能选择月结,如需月结请分开下单,或者自行支付.'// 公共部分提示
	var str4='';//plan 为空的用户
	if(no_trippaslen!=0){str1=no_trippass.toString()+' 未通过出差审批,';// no_trippass 是 差旅审批未通过和航班信息不匹配的 人名数组
	if(no_strip!=0){// 有非差旅
	str2=ntripname.toString()+' 是非差旅用户,';}}else{// 没有 差旅审批没通过且 没有航班信息不匹配
	if(no_strip!=0){// 有非差旅
	str2=ntripname.toString()+' 是非差旅用户,';}}if(no_notrippas!=0){//  存在11 但是没有plan的 未请假的 乘机人
	str4=no_notrippass.toString()+' \u672A\u8BF7\u5047,';}if(str1&&str2||!str1&&str2){str3='不能选择月结,如需月结请分开下单;或者自行支付';}else if(str1&&!str2){if(str4){str3='不能选择月结,如需月结请分开下单;或者自行支付';}else{str3='不能选择月结,请自行支付';if(yesroulelen>no_trippaslen){//差旅人数  大于 未通过审批的人数  说明 有真真的差旅
	str3='不能选择月结,如需月结请分开下单;或者自行支付';}}}else if(!str1&&!str2){str3='不能选择月结,请自行支付';}$.qu('.no_trip').style.display='block';$.qu('.no_trip').innerHTML=str1+str2+str4+str3;}else{$.qu('.no_trip').style.display='none';}var issafe=1;// 1表示需要购买保险
	if(r_10!=0){issafe=0;}// 存放 11 差旅需要审批的 数组
	// 参数意思 0.差旅人个数  1.非差旅个数 2.总人数 3.权限是否统一(判断 0和1 ，3 的区别 ) 4.权限具体代码 5.非差旅人名单 6.具体公司编码 7.iscompany( 再判断 具体公司编码 是不是一样)  8.issafe(是否需要买保险 1是需要 0 是不需要)
	// 其中 5非差旅人名单 = 非差旅人名单 + 账号不匹配人名单(主次账号)
	//notripPeoples 初始筛选之后的 非差旅名单
	//ne_psname    11判断之后 仅为 审批没通过的 人员 (航班信息不匹配的直接变成非差旅了 还有未审批的也变成非差旅了)
	//ntripname // 存放初次筛选 和 11筛选后非差旅的名字  最终 非差旅名单
	//alert(`差旅人数${yesroulelen}`)
	//ddataar[3] 权限 是否统一 1为统一 0 为不统一
	//ddataar[4] 具体权限代码 只 为 0 1 3 不包含 10 的保险
	ddataar=[yesroulelen,noroulelen,allp,isall,isthenum,notripPeoples,firstn,iscompany,issafe];return[yesroulelen,noroulelen,allp,isall,isthenum,notripPeoples,firstn,iscompany,issafe];}//  选择因公因私 按钮
	function getTripFn(){//选择因公因私
	//var oygBtn = $.qu(".ygLeft-btn");
	//var oysBtn = $.qu(".ysRight-btn");
	$.qu(".ygLeft").onclick=function(){onOFFtr=true;// 这里需要判断 要不要发生事件 当为11 没通过的的时候
	if(!eisall){// 没有有11 未通过 或者没有散客
	changeygLeft();//proof-box   发票地址
	$.qu('.proof-box').style.display='none';if(!onOFFr){$.qu('.Tripb-box').style.display='block';}else{$.qu('.Tripb-box').style.display='none';}checkChailvPassenger();// 检查差旅乘客数量
	}};$.qu(".ysRight").onclick=function(){if(!eisall){// 没有有11 未通过 或者没有散客
	onOFFtr=false;}// 这里需要判断 要不要发生事件 当为11 没通过的的时候
	changeysRight();$.qu('.Tripb-box').style.display='none';if(!onOFFp){$.qu('.proof-box').style.display='block';}else{$.qu('.proof-box').style.display='none';}checkChailvPassenger();// 检查差旅乘客数量
	};}//  因私状态
	function changeysRight(){$.qu(".ygLeft-btn").style.boxShadow="0 0 0 0.2rem #ccc";$.qu(".ysRight-btn").style.boxShadow="0 0 0 0.2rem #cc0000";$.qu(".ygLeft-box").setAttribute("choiceType","0");$.qu(".ysRight-box").setAttribute("choiceType","1");}//  因公状态
	function changeygLeft(){//$.qu('.ygLeft').style.background='#f3eeee'; // 有11 未通过的时候 背景 因公变为灰色
	$.qu(".ygLeft-btn").style.boxShadow="0 0 0 0.2rem #cc0000";$.qu(".ygLeft-box").setAttribute("choiceType","1");$.qu(".ysRight-box").setAttribute("choiceType","0");$.qu(".ysRight-btn").style.boxShadow="0 0 0 0.2rem #ccc";}//将时间转换为 数字比较
	function datetoNumber(time){var timenew=detailChange(time.replace(/(\-)|(\/)/ig,'-'));return Number(timenew.replace(/\-/ig,""));}// 时间格式组装
	function detailChange(date){//对date进行重新组装成yyyy-MM-dd的格式
	//2014 - 8 - 7
	try{var tempDate1Arr=date.split("-");date=tempDate1Arr[0]+"";if(tempDate1Arr[1].length==1){date+="-0"+tempDate1Arr[1];}else{date+="-"+tempDate1Arr[1];}if(tempDate1Arr[2].length==1){date+="-0"+tempDate1Arr[2];}else{date+="-"+tempDate1Arr[2];}}catch(e){}return date;}// 郑旭东接口
	function getallphonenum(num){var xhr='';if(window.XMLHttpRequest){xhr=new XMLHttpRequest();}else{xhr=new ActiveXObject(' Microsoft . XMLHTTP');}xhr.open('post','http://ca.nuoya.io/leaveSp/api/userinfo','false');xhr.setRequestHeader('content-type','application/x-www-form-urlencoded');xhr.send('cardID='+num);xhr.onreadystatechange=function(){if(xhr.readyState==4){// ajax 响内容解析完成，可以在客户端调用了
	if(xhr.status==200){//  判断服务器返回的状态 200 表示 正常
	var oData3=eval('('+xhr.responseText+')');console.log(oData3);var rc=oData3.rc;if(rc==200){//var data =oData3.UserInfo
	redata(oData3.UserInfo);}else{alert('获取乘客差旅信息失败！');}}else{alert('出错了，'+xhr.status);//myalertp('router0','出错了，获取客服联系电话失败！')
	}}};}//  利用2个接口 整合数据 判断差旅
	function checkChailvPassenger(){//  获取 所有已经选择的乘机人的信息
	var allpsg=$.qus('.myBook-namel');var alld=[];//存放 所有乘机人的 数据
	for(var i=0;i<allpsg.length;i++){var dps=JSON.parse(allpsg[i].getAttribute("data"));alld.push(dps);}twodatapk(alld);// 讲页面的数据 传入函数
	}// 检查是否是差旅 ？
	function twodatapk(newdata){console.log('整合后所有数据');console.log(newdata);var thenum=checktheroule(newdata);console.log('\u5DEE\u65C5\u6574\u5408\u540E\u6570\u636E');console.log(thenum);//var theonoffarr = thenum[8];
	//ishave = true; // 是否有差旅功能 默认有
	//for (var i = 0; i < theonoffarr.length; i++) {
	//    var odat = theonoffarr[i];
	//    if(odat == 0){
	//        ishave = false;
	//        break
	//    }
	//
	//}
	var y=thenum[0];//差旅人个数
	var n=thenum[1];// 非差旅个数
	nottripNum=thenum[5];//非差旅人名单
	// 下面的代码不能变动
	var thebtnnum=$.qu('.ygLeft-box').getAttribute('choicetype');if(y>0){// 成立 则有差旅乘客
	//// false  表示是 所有乘客中 有差旅用户  但是 不确定是不是 全是 不能走 差旅通道
	//mIsNormalPassenger = false;
	$.qu('.ygLeft').style.background='';// 默认因公背景不需要颜色
	var lenRC=y;// 根据返回的差旅乘客数量 和总乘机人数量比 相同则都是差旅
	//console.log('差旅乘客数量'+ lenRC);
	var lenParam=y+n;if(lenRC==lenParam){// 全部匹配
	mIsNormalPassenger=false;// 全为差旅乘客
	mPassengerIsValidated=true;//  全是差旅的话 检查乘客通过 // 检查所有乘客信息通过
	if(zyTable==1){// 直营
	//zyTablechange =1;
	//$.qu('.Trip').style.display = 'none';//隐藏 差旅 填写按钮
	//
	//$.qu('.zycp').style.display  = 'block';//显示 直营标签
	//$.qu('.zycp1').style.display  = 'block';//显示 直营标签
	if(isTrippok==1){//1直营 匹配 成功 有30的保险
	zyTablechange=0;// 变成 非直营
	$.qu('.Tripb').style.display='block';//显示 差旅 填写按钮
	$.qu('.goReason').style.display='block';//显示 因公因私按钮
	if(eisall){// 有散客 或者 11为通过
	$.qu('.ygLeft').style.background='#f3eeee';// 有11 未通过的时候 背景 因公变为灰色
	changeysRight();//只能出现因私
	}else{if(thebtnnum==0&&$.qu('.goReason').style.display=='block'){if(onOFFtr){changeygLeft();// 变成因公状态
	}}}$.qu('.zycp').style.display='none';//取消 直营标签
	$.qu('.zycp1').style.display='none';//取消 直营标签
	$.qu('.zycp1').style.background='#fff';$.qu('.zycp').style.background='#fff';// 有带考虑  直营 且 匹配成功 就 为差旅了 有保险
	$.qu('.mttdata-sp3').style.display='inline-block';// 显示保险
	$.qu('.buysafe').style.display='block';// 显示保险 buysafe
	if(backFlight){// 往返
	$.qu('.mttdata1-sp3').style.display='inline-block';// 显示保险
	}var thebtnnumn=$.qu('.ygLeft-box').getAttribute('choicetype');if(thebtnnumn==1&&$.qu('.goReason').style.display=='block'){$.qu('.proof').style.display='none';$.qu('.proof-box').style.display='none';$.qu('.Tripb').style.display='block';if(!onOFFr){//  onOFFr 为 true  为关闭状态
	$.qu('.Tripb-box').style.display='block';}else{$.qu('.Tripb-box').style.display='none';}}else{$.qu('.proof').style.display='block';//$.qu('.proof-box').style.display ='block';//让发票显示 但是不能让 详情展现
	if(!onOFFp){//  onOFFr 为 true  为关闭状态
	$.qu('.proof-box').style.display='block';}else{$.qu('.proof-box').style.display='none';}$.qu('.Tripb').style.display='none';$.qu('.Tripb-box').style.display='none';}}else{zyTablechange=1;// 仍然为 直营
	$.qu('.Tripb').style.display='none';//隐藏 差旅 填写按钮
	$.qu('.goReason').style.display='none';//隐藏因公因私
	$.qu('.zycp').style.display='inline-block';//显示 直营标签
	$.qu('.zycp1').style.display='inline-block';//显示 直营标签
	$.qu('.zycp1').style.background='#eee';$.qu('.zycp').style.background='#eee';// 有带考虑  直营 且 匹配成功 就 为差旅了 有保险
	$.qu('.mttdata-sp3').style.display='none';// 隐藏保险
	// 可以用 $.qu('.buysafe').style.display  = 'none';// 显示保险 buysafe
	if(backFlight){// 往返
	$.qu('.mttdata1-sp3').style.display='none';// 显示保险
	}}}else{// 非直营 全是差旅乘客
	if(thenum[8]==0&&!eisall){// 权限统一 且都为 不能买保险
	// 默认保险
	if(onOFF){// 关闭保险
	// $.qu('.buysafe-btnbox1').style.left ='0.1rem';
	$.addClass($.qu('.buysafe-btnbox1'),'buysafe-btnbox1left');//this.style.backgroundColor ='#ccc';
	$.addClass($.qu('.buysafe-btnbox'),'buysafe-btnboxbcf');onOFF=false;}}else{// 选择保险
	//$.qu('.buysafe-btnbox1').style.left ='1.2rem';
	$.removeClass($.qu('.buysafe-btnbox1'),'buysafe-btnbox1left');//this.style.backgroundColor ='#f4734b';
	$.removeClass($.qu('.buysafe-btnbox'),'buysafe-btnboxbcf');onOFF=true;}zyTablechange=0;$.qu('.Tripb').style.display='block';//显示 差旅 填写按钮
	$.qu('.goReason').style.display='block';//显示 因公因私
	if(eisall){// 有散客 或者 11为通过
	$.qu('.ygLeft').style.background='#f3eeee';// 有11 未通过的时候 背景 因公变为灰色
	changeysRight();//只能出现因私
	}else{if(thebtnnum==0&&$.qu('.goReason').style.display=='block'){if(onOFFtr){changeygLeft();// 变成因公状态
	}}}$.qu('.zycp').style.display='none';//取消 直营标签
	$.qu('.zycp').style.background='#fff';if(backFlight){// 往返
	$.qu('.zycp1').style.display='none';//取消 直营标签
	$.qu('.zycp1').style.background='#fff';}var thebtnnumn=$.qu('.ygLeft-box').getAttribute('choicetype');if(thebtnnumn==1&&$.qu('.goReason').style.display=='block'){$.qu('.proof').style.display='none';$.qu('.proof-box').style.display='none';$.qu('.Tripb').style.display='block';if(!onOFFr){//  onOFFr 为 true  为关闭状态
	$.qu('.Tripb-box').style.display='block';}else{$.qu('.Tripb-box').style.display='none';}}else{$.qu('.proof').style.display='block';if(!onOFFp){//  onOFFr 为 true  为关闭状态
	$.qu('.proof-box').style.display='block';}else{$.qu('.proof-box').style.display='none';}$.qu('.Tripb').style.display='none';$.qu('.Tripb-box').style.display='none';}}}else{// 部分有 差旅乘客
	//////////
	if(zyTable==1){// 直营
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
	zyTablechange=1;// 变成直营
	$.qu('.Tripb').style.display='none';//隐藏差旅 填写按钮
	$.qu('.Tripb-box').style.display='none';$.qu('.goReason').style.display='block';//显示因公因私 // 南航的时候   差旅和散客 选择因私的时候 可以一起下单
	if(eisall){// 有散客 或者 11为通过
	$.qu('.ygLeft').style.background='#f3eeee';// 有11 未通过的时候 背景 因公变为灰色
	changeysRight();//只能出现因私
	}//alert(2034)
	$.qu('.zycp').style.display='inline-block';//显示 直营标签
	$.qu('.zycp').style.background='#eee';//  可以用 $.qu('.buysafe').style.display  = 'none';// 隐藏保险 buysafe
	if(backFlight){// 往返
	$.qu('.mttdata1-sp3').style.display='none';// 隐藏保险
	$.qu('.zycp1').style.display='none';//取消 直营标签
	$.qu('.zycp1').style.background='#fff';}}else{// 非直营 部分有差旅
	$.qu('.proof').style.display='block';// 不全是 差旅 就显示 发票地址
	zyTablechange=0;$.qu('.Tripb').style.display='none';//隐藏差旅 填写按钮
	$.qu('.Tripb-box').style.display='none';$.qu('.goReason').style.display='block';//显示因公因私
	if(eisall){// 有散客 或者 11为通过
	$.qu('.ygLeft').style.background='#f3eeee';// 有11 未通过的时候 背景 因公变为灰色
	changeysRight();//只能出现因私
	if(!onOFFp){//  onOFFr 为 true  为关闭状态
	$.qu('.proof-box').style.display='block';//alert('blcok')
	}else{$.qu('.proof-box').style.display='none';//alert('none')
	}}$.qu('.zycp').style.display='none';//非直营 肯定就不显示了
	$.qu('.zycp').style.background='#fff';if(backFlight){// 往返
	$.qu('.mttdata1-sp3').style.display='inline-block';// 显示保险
	$.qu('.zycp1').style.display='none';//取消 直营标签
	$.qu('.zycp1').style.background='#fff';}}mIsNormalPassenger=true;// 不全是差旅  则为 散客
	mPassengerIsValidated=false;//  不全是差旅的话 检查乘客不通过
	// zYChangePageView(0, 0);
	}}else{// 没有 差旅名单
	//$("#Trip").hide();
	$.qu('.Tripb').style.display='none';//隐藏 差旅 填写按钮
	$.qu('.Tripb-box').style.display='none';$.qu('.goReason').style.display='none';//隐藏 因公因私
	if(zyTable==1){// 直营 没有 差旅名单
	zyTablechange=1;if(isTrippok==1){//1直营 匹配 成功 有30的保险
	zyTablechange=1;// 变成 非直营
	$.qu('.zycp').style.display='inline-block';//取消 直营标签
	$.qu('.zycp1').style.display='inline-block';//取消 直营标签
	$.qu('.zycp1').style.background='#eee';$.qu('.zycp').style.background='#eee';// 有带考虑  直营 且 匹配成功 就 为差旅了 有保险
	$.qu('.mttdata-sp3').style.display='none';// 隐藏保险
	$.qu('.buysafe').style.display='none';// 显示保险 buysafe
	if(backFlight){// 往返
	$.qu('.mttdata1-sp3').style.display='none';// 显示保险
	}}zyTablechange=1;$.qu('.zycp').style.display='inline-block';//显示 直营标签
	$.qu('.zycp').style.background='#eee';if(backFlight){// 往返 直营 没有 差旅名单
	$.qu('.mttdata1-sp3').style.display='none';// 隐藏保险
	$.qu('.zycp1').style.display='inline-block';//显示 直营标签
	$.qu('.zycp1').style.background='#eee';}}else{//非直营 没有 差旅人
	$.qu('.proof').style.display='block';// 不全是 差旅 就显示 发票地址
	zyTablechange=0;$.qu('.zycp').style.display='none';//非直营 肯定就不显示了
	$.qu('.zycp').style.background='#fff';if(backFlight){// 往返
	//$.qu('.mttdata1-sp3').style.display  = 'none';// 隐藏保险
	$.qu('.zycp1').style.display='none';//隐藏 直营标签
	$.qu('.zycp1').style.background='#fff';}}mIsNormalPassenger=true;// 为散客
	mPassengerIsValidated=true;// 检查所有乘客信息通过
	}// 计价函数 位于 判断差旅乘客之后
	alloneMone();}//判断下哪家的单子
	function changeCabinTypeFun(carrier,cabinType){//南航 CZ  cbtype 3
	//判断一家报价start
	//      CZ
	var carrierOne=carrier;//ZH
	var makeZyOrder=false;//是否在后台下直营的单
	for(var price in mPriceObj){if(!mPriceObj[price]){makeZyOrder=true;break;}}if(mIsNormalPassenger){//是散客 还是 直营  真为 散客  假为差旅
	var isMatch=false;if(isTrippok==1){// 航司号 相同 直营差旅
	isMatch=true;}if(isMatch){cabinType=6;console.log("前台改为下直营的单");}else{console.log("走原来的散客逻辑");}}else{console.log("差旅逻辑");if(makeZyOrder){console.log("后台下直营的单");}else{console.log("后台下普通的单");}}//判断一家报价end
	return[cabinType,makeZyOrder];}//验价
	function checkPriceFun(flight){var jsonData={};if(flight){//console.log("返程验价");
	}else{//console.log("去程验价");
	var f=DecFlights();flight=f[0];}jsonData={"act":"checkPrice","from":flight.a,"to":flight.b,"flightNo":flight.c,"cabin":flight.d,"flightDate":flight.e};var nowPrice=flight.h;var oData2='';var xhr='';if(window.XMLHttpRequest){xhr=new XMLHttpRequest();}else{xhr=new ActiveXObject(' Microsoft . XMLHTTP');}var reqPath='/icbc/ajax.aspx';xhr.open('post',reqPath,'true');xhr.setRequestHeader('content-type','application/x-www-form-urlencoded;charset=utf-8');xhr.send("act=checkPrice&from="+flight.a+"&to="+flight.b+"&flightNo="+flight.c+"&cabin="+flight.d+"&flightDate="+flight.e);xhr.onreadystatechange=function(){if(xhr.readyState==4){// ajax 响内容解析完成，可以在客户端调用了
	if(xhr.status==200){//  判断服务器返回的状态 200 表示 正常
	oData2=xhr.responseText;var match=false;//价格是否匹配
	if(oData2==nowPrice){match=true;}else{match=false;}var key=jsonData.flightNo+"_"+jsonData.flightDate;mPriceObj[key]=match;//console.log(key + ":" + oData2 + "," + nowPrice);
	Object.size=function(obj){var size=0,key;for(key in obj){if(obj.hasOwnProperty(key))size++;}return size;};var len=Object.size(mPriceObj);var fltReturn=DecFlights();if(len<2&&fltReturn.length>1){checkPriceFun(fltReturn[1]);}else{console.log("验价完毕");}}else{//alert('验价出错了，Err' + xhr.status);
	(0,_api.myalertp)('myBook','验价出错了，Err'+xhr.status);}}};}// 获取航班信息的函数
	function DecFlights(){//console.log(checkPricedata);
	return checkPricedata;}//页面填写数据
	function bookPulldata1(bookdata1){//去程数据  单程数据数据
	myBookChange1(bookdata1.theCarrier1,bookdata1.theCa);//退改签
	$.qu('.myBook-mtfsp1').innerHTML=getLastFive(bookdata1.data1);//日期
	$.qu('.myBook-mtfsp111').innerHTML=isNextDay(bookdata1.ftime,bookdata1.ttime,bookdata1.data1);//日期
	$.qu('.myBook-mtfsp2').innerHTML=bookdata1.pc;//航空公司
	$.qu('.myBook-mtfsp3').innerHTML=bookdata1.pcnum;//航班编码
	$.qu('.myBook-mttsp1').innerHTML=bookdata1.ftime;//起飞时间
	$.qu('.myBook-startFP').innerHTML=bookdata1.fplace;//起飞地点
	$.qu('.myBook-endFP').innerHTML=bookdata1.tplace;//到达地点
	$.qu('.myBook-mttsp2').innerHTML=bookdata1.ttime;//降落时间
	$.qu('.myBook-mttsp11').innerHTML=bookdata1.fport;//起飞机场
	$.qu('.myBook-mttsp22').innerHTML=bookdata1.tport;//降落机场
	$.qu('.mttbookprice').innerHTML=bookdata1.pice1;//价格
	}function bookPulldata2(bookdata2){//返程程/
	myBookChange2(bookdata2.theCarrier1,bookdata2.theCa);//退改签
	$.qu('.myBook1-mtfsp1').innerHTML=getLastFive(bookdata2.data1);//日期
	$.qu('.myBook1-mtfsp111').innerHTML=isNextDay(bookdata2.ftime,bookdata2.ttime,bookdata2.data1);//日期
	$.qu('.myBook1-mtfsp2').innerHTML=bookdata2.pc;//公司
	$.qu('.myBook1-mtfsp3').innerHTML=bookdata2.pcnum;//航班编码
	$.qu('.myBook1-mttsp1').innerHTML=bookdata2.ftime;//起飞时间
	$.qu('.myBook1-startFP').innerHTML=bookdata2.fplace;//起飞地点
	$.qu('.myBook1-endFP').innerHTML=bookdata2.tplace;//降落地点
	$.qu('.myBook1-mttsp2').innerHTML=bookdata2.ttime;//降落时间
	$.qu('.myBook1-mttsp11').innerHTML=bookdata2.fport;//起飞机场
	$.qu('.myBook1-mttsp22').innerHTML=bookdata2.tport;//降落机场
	$.qu('.mttbookprice4').innerHTML=bookdata2.pice1;//价格
	}// 预定接口数据整合函数 数据量较大
	// bookdata1:航班信息  ShipFeeOnoff:凭证开关 是否收快递费
	// Passenger：乘客信息
	// Member: 会员信息 数组或者json
	// Contact: 联系人消息 数组或者json
	// ShipAddr: 收件人具体地址
	// 单程 成人
	function pullAlldatatoBook(bookdatas,ShipFeeOnoff,Passengertt,Contact,ShipAddr,DS,Member,Tripdata){$.qu('.lodinb').style.display='-webkit-box';if(backFlight){var bookdata=bookdatas[0];// alert(bookdata)
	console.log('去程数据？');var fdatedata=bookdata.data1;var tdatedata=bookdatas[1].data1;//console.log(bookdata)
	}else{var bookdata=bookdatas;}//var allData ={};
	var saferule1=$.qu('.looktext1-changetex3').innerHTML;//退票
	var saferule2=$.qu('.looktext1-changetex2').innerHTML;//改期
	var saferule3=$.qu('.looktext1-changetex1').innerHTML;//签转
	var therefundrule='退票： '+saferule1+'改期： '+saferule2+'签转：'+saferule3;var cptype=bookdata.CabinType;var cptype1=bookdata.theCarrier1;// 航司号
	var DirectSale="",source="wap";//  判断 是 下什么单
	var cabinType=bookdata.CabinType;var cabinTypeArr=changeCabinTypeFun(cptype1,cptype);cabinType=cabinTypeArr[0];if(cabinType==6){DirectSale=source=cptype1;}//console.log('source1:'+source);
	var price=Number(bookdata.YPrice);var fltsStr='["'+bookdata.RouteFromCode+'","'+bookdata.RouteToCode+'","'+bookdata.pcnum+'","'+bookdata.theCa+'","'+bookdata.data1+'","'+bookdata.ftime+'","'+bookdata.ttime+'","'+bookdata.pice1+'", "'+50+'", "'+0+'", '+price+','+DS+',0,"'+bookdata.Cabin1+'","'+bookdata.Lmodel+'", 0 ,1,"'+bookdata.Terminal+'", 0,3]';var goFlightdata=bookdata.pcnum+'_'+bookdata.theCa;var bookType=3;var priceFrom=0;var hongbao=0;var refundrule=therefundrule;var shipfee=ShipFeeOnoff;var psg_service_fee=0;var SupplyID=0;console.log('乘机人信息');console.log(Passengertt);if(backFlight){var passenger=Passengertt[0][0];//alert(passenger)
	console.log('去时乘客信息');console.log(passenger);}else{var passenger=Passengertt[0];}var cardNo=Member.No;var memberName=Member.name;var contact_id=Contact.contactid;var name=Contact.name;//  联系人名字
	var mobile=Contact.phone;// 联系人电话
	var email='';//联系人邮箱
	var shipType=shipfee==0?5:4;// 快递为 4  平邮为5
	var shipAddr=ShipAddr;//  收件人具体地址
	var shipReq='';// 固定值写死
	var UnitNo=UnitNo;//
	if(!Tripdata){var TripType='无';// 似乎 为固定值 无
	var TripReason='无';// 似乎 为固定值 无
	var PriceReason='无';// 似乎 为固定值 无
	var TripNote='';//  收件人信息里面的 备注？  似乎为固定值 为 空
	}else{var TripType=Tripdata.TripType;// 似乎 为固定值 无
	var TripReason=Tripdata.TripReason;// 似乎 为固定值 无
	var PriceReason=Tripdata.PriceReason;// 似乎 为固定值 无
	var TripNote=Tripdata.TripNote;//  收件人信息里面的 备注？  似乎为固定值 为 空
	}var appnt=[];// 安盛保险？
	var mynotes='';if(backFlight){// 往返
	mynotes='往返订单';}else{if(ynum>0){// 有儿童
	mynotes='成人儿童订单';}else{mynotes='';}}var ispersonal=0;var thebtnnump=$.qu('.ygLeft-box').getAttribute('choicetype');if($.qu('.goReason').style.display=='block'){ispersonal=thebtnnump==1?2:0;}var bkdata="{'Flight':['"+fltsStr+"'],'BookType':'"+bookType+"','CabinType':'"+cabinType+"','PriceType':'1','PriceFrom':'"+priceFrom+"','source':'"+source+"','HongBao':'"+hongbao+"','RefundRule':'"+refundrule+"','ShipFee':'"+shipfee+"','ServiceFee':'"+psg_service_fee+"','SupplyID':'"+SupplyID+"','Passenger':["+passenger+"],'CardNo':'"+cardNo+"','MemberName':'"+memberName+"','ContactID':'"+contact_id+"','ContactName':'"+name+"','ContactPhone':'"+mobile+"','Email':'"+email+"','ShipVia':"+shipType+",'ShipAddr':'"+shipAddr+"','ShipReq':'"+shipReq+"','Notes':'"+mynotes+"','Price':0,'Rate':0,'Payfee':0,'Insurance':0,'Addfee':0,'Total':0,'Remark':'','Restrictions':'不得签转','UnitNo':'','SubUnitNo':'"+UnitNo+"','TripType':'"+TripType+"','TripReason':'"+TripReason+"','PriceReason':'"+PriceReason+"','TripNote':'"+TripNote+"','Appnt':['"+appnt+"'],'PnrNo':'','PNR':'','Personal':'"+ispersonal+"' }";//console.log(bkdata)
	var bk="bk="+bkdata;//var insuretype  ="&insuretype="+bookdata.InsureType;
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
	if(zyTablechange==1){//直营 真直营
	if(onOFF&&$.qu('.buysafe').style.display=='block'){// 30的
	var insuretype="&insuretype="+bookdata.InsureType;}else{if(onOFFt&&$.qu('.buysafet').style.display=='block'){var insuretype="&insuretype=12";// 差旅的时候  选20的情况
	}else{var insuretype="&insuretype="+bookdata.InsureType;}}}else{// 非直营 可能有假的 非直营
	if(ynum>0){//有儿童
	var insuretype="&insuretype=3";}else{if(zyTable==1){//假的非直营 只可能为南航
	//var insuretype  ="&insuretype=13";
	var insuretype="&insuretype="+bookdata.InsureType;}else{//真非直营
	var insuretype="&insuretype="+bookdata.InsureType;}}}console.log('去程或者成人预定保险类型:'+insuretype);// var Dire = bookdata1.CabinType=="6"?bookdata1.theCarrier1:'';
	var DirectSale1="&DirectSale="+DirectSale;var DSPo=ZhPolicyId1==1?'':ZhPolicyId1;var DSPolicyID="&DSPolicyID="+DSPo;//
	var makeZyOrder="&makeZyOrder="+cabinTypeArr[1];//var urldata =bk+insuretype+DirectSale1+DSPolicyID+makeZyOrder+"&FromWhere=wap";
	var fdate='';// 去程日期
	var tdate='';// 返程日期
	var cpdata='';// 去程航班信息
	if(backFlight){fdate=fdatedata;tdate=tdatedata;cpdata=goFlightdata;}//var goDate      ="&goDate="+fdate;//
	//var backDate   ="&backDate ="+tdate;//
	//var goFlight  ="&goFlight ="+cpdata;
	var cacheParam1={backDate:fdate,goDate:tdate,goFlight:''};var cacheParam="&cacheParam ="+JSON.stringify(cacheParam1);if(zyCP=='3U'){// 川航 需要特殊字段
	//CHOtherParam1={};
	//CHOtherParam2={};
	if(zyTable==1){// 川航直营
	var CHOtherParam="&CHOtherParam="+JSON.stringify(CHOtherParam1);var urldata=bk+insuretype+DirectSale1+DSPolicyID+makeZyOrder+CHOtherParam+cacheParam+"&FromWhere=wap";}else{var CHOtherParam="&CHOtherParam=";var urldata=bk+insuretype+DirectSale1+DSPolicyID+makeZyOrder+CHOtherParam+cacheParam+"&FromWhere=wap";}}else{var CHOtherParam="&CHOtherParam=";var urldata=bk+insuretype+DirectSale1+DSPolicyID+makeZyOrder+CHOtherParam+cacheParam+"&FromWhere=wap";}console.log('往返订单去程提交数据或者儿童成人成人数据或者单程数据'+urldata);var oData2='';var xhr='';if(window.XMLHttpRequest){xhr=new XMLHttpRequest();}else{xhr=new ActiveXObject(' Microsoft . XMLHTTP');}//xhr.open('post', 'http://106.75.131.58:8015/icbc/OrderSumit.aspx', 'false');
	xhr.open('post',flightUrl+'/icbc/OrderSumit.aspx','false');xhr.setRequestHeader('content-type','application/x-www-form-urlencoded;charset=utf-8');xhr.send("isKyReq=1&url=&"+urldata);// console.log(isKyReq"=1&act=ORDERBOOK&url=''&reqPath='icbc/OrderSumit.aspx'&" + urldata)
	xhr.onreadystatechange=function(){if(xhr.readyState==4){$.qu('.lodinb').style.display='none';//$.id('loadorder-type').innerHTML ='航班预定中...';
	// ajax 响内容解析完成，可以在客户端调用了
	if(xhr.status==200){//  判断服务器返回的状态 200 表示 正常
	oData2=eval('('+xhr.responseText+')');var bnumber=oData2.OrderID;//根据订单编号判断 是否成功
	var bpric=oData2.Price;// 预定后返回的价格
	var pnrstatus=oData2.PnrStatus;//  订单 返回状态 只有 HK 才算是成功
	//var isbooked =oData2.PnrStatus.indexOf('HK')<0?false:true;
	console.log('成人或去程预定成功返回数据 ：');console.log(oData2);if(bnumber>0&&bpric>0){// 同时满足才能判断 预定成功
	if(pnrstatus.indexOf('HK')!=-1){if(backFlight){// 往返航班
	localStorage.setItem('oddOrderID',bnumber);pullAlldatatoBooky(bookdatas,ShipFeeOnoff,Passengertt,Contact,ShipAddr,DS,Member,Tripdata);}else{if(ynum>0){// 有儿童
	localStorage.setItem('oddOrderID',bnumber);pullAlldatatoBooky(bookdatas,ShipFeeOnoff,Passengertt,Contact,ShipAddr,DS,Member,Tripdata);}else{// 没有儿童的时候
	bookToorder(bookdata,bnumber);//  带数据 进入 订单页面
	}}}else{if(backFlight){// 往返航班
	(0,_api.myalertp)('myBook','去程预定失败，订单状态异常,(订单状态：'+pnrstatus+')');}else{if(ynum>0){// 有儿童
	(0,_api.myalertp)('myBook','成人预定失败，订单状态异常,(订单状态：'+pnrstatus+')');}else{// 没有儿童的时候
	(0,_api.myalertp)('myBook','预定失败，订单状态异常,(订单状态：'+pnrstatus+')');}}}}else{//alert('预定失败，请重试或者选择其他航班！')
	if(oData2.Info){(0,_api.myalertp)('myBook',oData2.Info);}else{var theca=bookdata.theCa;if(theca.length>1){(0,_api.myalertp)('myBook','预定失败，请重试或者选择其他航班！(当前舱位编码:'+theca+')');}else{(0,_api.myalertp)('myBook','预定失败，请重试或者选择其他航班！');}}console.log(oData2);}}else{//alert('出错了，数据请求失败！');
	(0,_api.myalertp)('myBook','出错了，数据请求失败！');}}};}// 只订儿童票 或者往返票
	function pullAlldatatoBooky(bookdatas,ShipFeeOnoff,Passenger,Contact,ShipAddr,DS,Member,Tripdata){//if(ynum !=0){
	//    $.id('loadorder-type').innerHTML ='儿童预定中...';
	//}else{
	//    $.id('loadorder-type').innerHTML ='返程预定中...';
	//}
	$.qu('.lodinb').style.display='-webkit-box';if(backFlight){var bookdatab=bookdatas[1];var tdatedata=bookdatab.data1;var fdatedata=bookdatas[0].data1;}else{var bookdatab=bookdatas;}//BookuserOnoff(3);// 验证用户 成功则存在本地
	var allData={};var saferule1=$.qu('.looktext1-changetex3').innerHTML;//退票
	var saferule2=$.qu('.looktext1-changetex2').innerHTML;//改期
	var saferule3=$.qu('.looktext1-changetex1').innerHTML;//签转
	var therefundrule='退票： '+saferule1+'改期： '+saferule2+'签转：'+saferule3;var cptype=bookdatab.CabinType;var cptype1=bookdatab.theCarrier1;var DirectSale="",source="wap";//  判断 是 下什么单
	var cabinType=bookdatab.CabinType;//
	var cabinTypeArr=changeCabinTypeFun(cptype1,cptype);//航空公司2字码   cb类型
	cabinType=cabinTypeArr[0];if(cabinType==6){DirectSale=source=cptype1;}console.log('source2:'+source);//if (zyCP == 'ZH' && zyTable == 1) {
	//    price = Number(bookdatab.YPrice);//Y仓价格
	//}else{
	//    price = Number(bookdatab.YPrice);//Y仓价格
	//    price1 = price
	//}
	var price=Number(bookdatab.YPrice);//Y仓价格
	// if(zyCP == 'ZH' && isY != -1)
	if(ynum!=0){//if (zyCP == 'ZH' && zyTable == 1 && isY != -1) {//深航直营  儿童价格 高于Y仓位的时候 为当前价格的一半
	//    var fltsStr = '["' + bookdatab.RouteFromCode + '","' + bookdatab.RouteToCode + '","' + bookdatab.pcnum + '","' + bookdatab.theCa + '","' + bookdatab.data1 + '","' + bookdatab.ftime + '","' + bookdatab.ttime + '","' + bookdatab.pice1 + '", "' + 50 + '", "' + 0 + '", '+price+','+DS+',0,"' +bookdatab.Cabin1 + '","' + bookdatab.Lmodel + '", 0 ,1,"' + bookdatab.Terminal + '", 0,3]';
	//}else{//  非深航 儿童 仓位为y 价格也应该为Y仓
	//
	//    var fltsStr = '["' + bookdatab.RouteFromCode + '","' + bookdatab.RouteToCode + '","' + bookdatab.pcnum + '","'+isYca+'","' + bookdatab.data1 + '","' + bookdatab.ftime + '","' + bookdatab.ttime + '","' + bookdatab.pice1 + '", "' + 50 + '", "' + 0 + '", '+price+','+DS+',0,"' +bookdatab.Cabin1 + '","' + bookdatab.Lmodel + '", 0 ,1,"' + bookdatab.Terminal + '", 0,3]';
	//}
	var fltsStr='["'+bookdatab.RouteFromCode+'","'+bookdatab.RouteToCode+'","'+bookdatab.pcnum+'","'+isYca+'","'+bookdatab.data1+'","'+bookdatab.ftime+'","'+bookdatab.ttime+'","'+bookdatab.pice1+'", "'+50+'", "'+0+'", '+price+','+DS+',0,"'+bookdatab.Cabin1+'","'+bookdatab.Lmodel+'", 0 ,1,"'+bookdatab.Terminal+'", 0,3]';}else{// 没有儿童
	var fltsStr='["'+bookdatab.RouteFromCode+'","'+bookdatab.RouteToCode+'","'+bookdatab.pcnum+'","'+bookdatab.theCa+'","'+bookdatab.data1+'","'+bookdatab.ftime+'","'+bookdatab.ttime+'","'+bookdatab.pice1+'", "'+50+'", "'+0+'", '+price+','+DS+',0,"'+bookdatab.Cabin1+'","'+bookdatab.Lmodel+'", 0 ,1,"'+bookdatab.Terminal+'", 0,3]';}var goFlightdata=bookdatab.pcnum+'_'+bookdatab.theCa;// 航班信息
	var bookType=3;var priceFrom=0;var hongbao=0;var refundrule=therefundrule;var shipfee=0;// 邮寄费用 往返 或者儿童时  邮寄费用 只收一次
	var psg_service_fee=0;var SupplyID=0;//var passenger  =Passenger[1];
	if(backFlight){var passenger=Passenger[1][0];}else{var passenger=Passenger[1];//儿童
	}var cardNo=Member.No;var memberName=Member.name;var contact_id=Contact.contactid;var name=Contact.name;//  联系人名字
	var mobile=Contact.phone;// 联系人电话
	var email='';//联系人邮箱
	var shipType=4;// 固定写死
	var shipAddr=ShipAddr;//  收件人具体地址
	var shipReq='';// 固定值写死
	var UnitNo=UnitNo;// 似乎为这个固定值
	if(!Tripdata){var TripType='无';// 似乎 为固定值 无
	var TripReason='无';// 似乎 为固定值 无
	var PriceReason='无';// 似乎 为固定值 无
	var TripNote='';//  收件人信息里面的 备注？  似乎为固定值 为 空
	}else{var TripType=Tripdata.TripType;// 似乎 为固定值 无
	var TripReason=Tripdata.TripReason;// 似乎 为固定值 无
	var PriceReason=Tripdata.PriceReason;// 似乎 为固定值 无
	var TripNote=Tripdata.TripNote;//  收件人信息里面的 备注？  似乎为固定值 为 空
	}var appnt=[];// 安盛保险？
	var thebeforeid=localStorage.getItem('oddOrderID');var mynotes='';if(backFlight){// 往返
	mynotes='往返订单,其去程订单是:'+thebeforeid;}else{if(ynum>0){// 有儿童
	mynotes='成人儿童订单,关联订单是:'+thebeforeid;}else{mynotes='';}}var ispersonal=0;var thebtnnump=$.qu('.ygLeft-box').getAttribute('choicetype');if($.qu('.goReason').style.display=='block'){ispersonal=thebtnnump==1?2:0;}var bkdata="{'Flight':['"+fltsStr+"'],'PriOrderID':'"+thebeforeid+"','BookType':'"+bookType+"','CabinType':'"+cabinType+"','PriceType':'1','PriceFrom':'"+priceFrom+"','source':'"+source+"','HongBao':'"+hongbao+"','RefundRule':'"+refundrule+"','ShipFee':'"+shipfee+"','ServiceFee':'"+psg_service_fee+"','SupplyID':'"+SupplyID+"','Passenger':["+passenger+"],'CardNo':'"+cardNo+"','MemberName':'"+memberName+"','ContactID':'"+contact_id+"','ContactName':'"+name+"','ContactPhone':'"+mobile+"','Email':'"+email+"','ShipVia':"+shipType+",'ShipAddr':'"+shipAddr+"','ShipReq':'"+shipReq+"','Notes':'"+mynotes+"','Price':0,'Rate':0,'Payfee':0,'Insurance':0,'Addfee':0,'Total':0,'Remark':'','Restrictions':'不得签转','UnitNo':'','SubUnitNo':'"+UnitNo+"','TripType':'"+TripType+"','TripReason':'"+TripReason+"','PriceReason':'"+PriceReason+"','TripNote':'"+TripNote+"','Appnt':['"+appnt+"'],'PnrNo':'','PNR':'','Personal':'"+ispersonal+"'}";//console.log(bkdata)
	var bk="bk="+bkdata;if(zyTablechange==1){//直营
	if(onOFF&&$.qu('.buysafe').style.display=='block'){var insuretype="&insuretype="+bookdatab.InsureType;}else{if(onOFFt&&$.qu('.buysafet').style.display=='block'){var insuretype="&insuretype=12";// 差旅的时候  选20的情况
	}else{var insuretype="&insuretype="+bookdatab.InsureType;}}}else{// 非直营 可能有假的非直营
	if(ynum>0){//有儿童
	var insuretype="&insuretype=3";}else{//无儿童
	if(zyTable==1){// 为全是 差旅用户 假直营 目前只可能为南航
	//var insuretype  ="&insuretype=13";// 差旅的时候  选20的情况
	var insuretype="&insuretype="+bookdatab.InsureType;}else{var insuretype="&insuretype="+bookdatab.InsureType;}}}console.log('返程或者儿童保险类型'+insuretype);//var Dire = bookdata1.CabinType=="6"?bookdata1.theCarrier1:'';
	var DirectSale1="&DirectSale="+DirectSale;//var DSPo  =bookdatab.theCarrier1=='ZH'?'ZH':''
	if(backFlight){var DSPo=ZhPolicyId2==1?'':ZhPolicyId1;}else{var DSPo=ZhPolicyId1==1?'':ZhPolicyId1;}var DSPolicyID="&DSPolicyID="+DSPo;var makeZyOrder="&makeZyOrder="+cabinTypeArr[1];//  龚老师特殊字段
	var fdate='';// 去程日期
	var tdate='';// 返程日期
	var cpdata='';// 去程航班信息
	if(backFlight){fdate=fdatedata;tdate=tdatedata;cpdata=goFlightdata;}//
	//var goDate  ="&goDate="+fdate;//
	//var backDate ="&backDate ="+tdate;//
	//var goFlight  ="&goFlight ="+cpdata;
	var cacheParam1={backDate:tdate,goDate:fdate,goFlight:cpdata};var cacheParam="&cacheParam ="+JSON.stringify(cacheParam1);//var urldata =bk+insuretype+DirectSale1+DSPolicyID+makeZyOrder+"&FromWhere=wap";
	if(zyCP=='3U'){// 川航 需要特殊字段
	if(backFlight){// 往返
	//var CHOtherParam = "&CHOtherParam="+ JSON.stringify(CHOtherParam2) ;
	if(zyTable==1){// 川航直营
	var CHOtherParam="&CHOtherParam="+JSON.stringify(CHOtherParam2);var urldata=bk+insuretype+DirectSale1+DSPolicyID+makeZyOrder+CHOtherParam+cacheParam+"&FromWhere=wap";}else{var CHOtherParam="&CHOtherParam=";var urldata=bk+insuretype+DirectSale1+DSPolicyID+makeZyOrder+CHOtherParam+cacheParam+"&FromWhere=wap";}}else{// 单程
	//var CHOtherParam = "&CHOtherParam="+ JSON.stringify(CHOtherParam1);
	//var urldata =bk+insuretype+DirectSale1+DSPolicyID+makeZyOrder+CHOtherParam+"&FromWhere=wap";
	if(zyTable==1){// 川航直营
	var CHOtherParam="&CHOtherParam="+JSON.stringify(CHOtherParam1);var urldata=bk+insuretype+DirectSale1+DSPolicyID+makeZyOrder+CHOtherParam+cacheParam+"&FromWhere=wap";}else{var CHOtherParam="&CHOtherParam=";var urldata=bk+insuretype+DirectSale1+DSPolicyID+makeZyOrder+CHOtherParam+cacheParam+"&FromWhere=wap";}}}else{var CHOtherParam="&CHOtherParam=";var urldata=bk+insuretype+DirectSale1+DSPolicyID+makeZyOrder+CHOtherParam+cacheParam+"&FromWhere=wap";}console.log('往返返程提交数据或者儿童成人儿童数据:'+urldata);var oData2='';var xhr='';if(window.XMLHttpRequest){xhr=new XMLHttpRequest();}else{xhr=new ActiveXObject(' Microsoft . XMLHTTP');}//xhr.open('post', 'http://106.75.131.58:8015/icbc/OrderSumit.aspx', 'false');
	xhr.open('post',flightUrl+'/icbc/OrderSumit.aspx','false');xhr.setRequestHeader('content-type','application/x-www-form-urlencoded;charset=utf-8');xhr.send("isKyReq=1&url=&"+urldata);// console.log(isKyReq"=1&act=ORDERBOOK&url=''&reqPath='icbc/OrderSumit.aspx'&" + urldata)
	xhr.onreadystatechange=function(){if(xhr.readyState==4){$.qu('.lodinb').style.display='none';//$.id('loadorder-type').innerHTML ='航班预定中...';
	// ajax 响内容解析完成，可以在客户端调用了
	if(xhr.status==200){//  判断服务器返回的状态 200 表示 正常
	console.log('儿童预定返回数据');console.log(xhr.responseText);oData2=eval('('+xhr.responseText+')');var bnumber=oData2.OrderID;//根据订单编号判断 是否成功
	var bpric=oData2.Price;// 预定后返回的价格
	var pnrstatus=oData2.PnrStatus;//  订单 返回状态 只有 HK 才算是成功
	//var isbooked =oData2.PnrStatus.indexOf('HK')<0?false:true;
	console.log('儿童或返程预定成功返回数据 ：');console.log(oData2);var bnumber1=localStorage.getItem('oddOrderID');if(bnumber>0&&bpric>0){if(pnrstatus.indexOf('HK')!=-1){bookToorder(bookdatas,bnumber1,bnumber);//  带数据 进入 订单页面
	localStorage.getItem('oddOrderID','');}else{if(backFlight){// 往返航班
	(0,_api.myalertp)('myBook','返程预定失败，订单状态异常,(订单状态：'+pnrstatus+')');}else{if(ynum>0){// 有儿童
	(0,_api.myalertp)('myBook','儿童预定失败，订单状态异常,(订单状态：'+pnrstatus+')');}else{// 没有儿童的时候
	(0,_api.myalertp)('myBook','预定失败，订单状态异常,(订单状态：'+pnrstatus+')');}}}}else{if(ynum!=0){// 说明是 儿童订单
	if(oData2.Info){(0,_api.myalertp)('myBook','儿童预定失败，'+oData2.Info);}else{(0,_api.myalertp)('myBook','儿童预定失败，请重试或者选择其他航班！');}////alert('儿童预定失败，请重试或者选择其他航班！')
	//myalertp('myBook','儿童预定失败，请重试或者选择其他航班！')
	}else{if(oData2.Info){(0,_api.myalertp)('myBook','返程预定失败，'+oData2.Info);}else{(0,_api.myalertp)('myBook','返程预定失败，请重试或者选择其他航班！');}//myalertp('myBook','返程预定失败，请重试或者选择其他航班！')
	}// 这要取消订单 取消前一次订单
	localStorage.getItem('oddOrderID','');console.log(oData2);}}else{//alert('出错了，数据请求失败！');
	(0,_api.myalertp)('myBook','出错了，预定数据请求失败！');}}};}//// 取消 订单  用于 儿童成人订单  成人预定成功
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
	function bookToorder(bookdata1,bnumber1,bnumber2){var bnumber='';if(bnumber2){bnumber=[bnumber1,bnumber2];}else{bnumber=[bnumber1];}// console.log(bookdata1);
	// 总价 及订单号 儿童票价
	var ypc=0;if(ynum!=0){ypc=$.qu('.mttbookpricey').innerHTML;}else{ypc=0;}var booktoorder={allprice:$.qu('.allprice11').innerHTML,OrderID:bnumber,yprice:ypc};// 成人 儿童 人数
	//var  ynum =0;  //  儿童个数
	//var  onum =0;  // 成人个数
	//var  odnum =0;  // 老年个数
	var peoplenum={ynum:ynum,onum:onum+odnum,safeprice:$.qu('.mttbookprice2').innerHTML,hongbaoprice:0};//  乘机人信息
	var allbootps=$.qus('.myBook-namel');if(allbootps.length==0){//alert('请选择乘机人！')
	(0,_api.myalertp)('myBook','请选择乘机人！');}else{var psdatas=[];for(var i=0;i<allbootps.length;i++){var allname=JSON.parse(allbootps[i].getAttribute("data"));var age=allname.Age;var name=allname.Name;var safenum='';if(onOFF&&$.qu('.buysafe').style.display=='block'){if(backFlight){safenum='2份';}else{safenum='1份';}}else{if(onOFFt&&$.qu('.buysafet').style.display=='block'){if(backFlight){safenum='2份';}else{safenum='1份';}}else{safenum='无';}}//if(zyTablechange ==1){
	//    safenum = '无';
	//}
	var psdata={age:age,name:name,card:allname.IDType,cardnum:allname.IDNo,phonenum:allname.Phone,safenum:safenum};psdatas.push(psdata);}//console.log(psdatas)
	}//改退签说明  往返的时候 有2种
	var safedata=[];var safedata0=$.qu('.looktext1-text').innerHTML;if(backFlight){// 是否 是往返航班
	var safedata1=$.qu('.looktext11-text').innerHTML;safedata=[safedata0,safedata1];}else{safedata=safedata0;}// 联系人信息
	var contactdata={name:$.qu('.linkman2').innerHTML,phonenum:$.qu('.linkman4').innerHTML};var onOFFsf=true;if($.qu('.buysafe').style.display=='block'){if(onOFF){onOFFsf=true;}else{if(onOFFt&&$.qu('.buysafet').style.display=='block'){onOFFsf=true;}else{onOFFsf=false;}}}else{onOFFsf=false;}if(thebtnnum==0&&$.qu('.goReason').style.display=='block'){// 都为因公
	console.log('进入改变直营电话显示问题');zyTablechange=1;isxh=2;}else{}var isxh=0;//  0为初始值 非白名单无授信 或者 白名单因私  跳转工商  1为 白名单 因公
	if($.qu('.goReason').style.display=='block'){// 说明全为白名单用户
	var thebtnnum=$.qu('.ygLeft-box').getAttribute('choicetype');if(thebtnnum==1){// 白名单 因公
	isxh=1;}else{zyTablechange=1;isxh=0;}}//console.log(zyTablechange);
	$.router.go('#!/flightmb/Order',{pbtype:10,booktoorder:booktoorder,linkdata:bookdata1,peoplenum:peoplenum,safedata:safedata,passengerdata:psdatas,contactdata:contactdata,ShipAddr:ShipAddr,backFlight:backFlight,havesafe:onOFFsf,zytype:zyTablechange,isxh:isxh},true);}// 联系人信息 数据打包函数
	function contactdata(){var cname=$.qu('.linkman2').innerHTML;var cphone=$.qu('.linkman4').innerHTML;var contactid=$.qu('.linkman-box').getAttribute('cid');return{name:cname,phone:cphone,contactid:contactid};}//  passenger 乘客信息 格式处理
	function passengerhtml(data){var name=data.name;var age=data.age;var card=data.card;var num=data.num;var phone=data.phone;//var ptype = onOFF==true?1:0 //  是否够买保险？ 1 为买 0为不买？？
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
	var ptype=1;// 乘客有无保险
	if(onOFF&&$.qu('.buysafe').style.display=='block'){ptype=1;}else{if(onOFFt&&$.qu('.buysafet').style.display=='block'){ptype=1;}else{ptype=0;}}var price=data.price;//  价格 成人  儿童
	var addfee=age=='成人'?50:0;return'[0,0,"'+name+'","'+age+'","'+card+'","'+num+'","",'+ptype+','+price+','+addfee+',0,"'+phone+'","","",0,0,0,0,0,0,0,"",0]';}// 乘客信息 筛选函数 打包函数 单程 或者 去程
	function passengerAlldataone(theprice){// 乘客信息 分 成人 儿童
	var allpassenger=$.qus('.myBook-namel');var allpassengerData=[];var allpassengerDatay=[];var allpassengerDataPull=[];// 成人打包好数据 形成一个新数组
	var allpassengerDataPully=[];// 儿童打包好数据 形成一个新数组
	for(var i=0;i<allpassenger.length;i++){//var nameall= allpassenger[i].getAttribute('data').;//('肖浩(成人)')
	var thedataobj=JSON.parse(allpassenger[i].getAttribute('data'));var theage1=thedataobj.Age;var age=theage1=='老人'?'成人':theage1;//  成人  儿童 将老人 换成成人
	var name=thedataobj.Name;// 肖浩
	var card=thedataobj.IDType;// 身份证
	var num=thedataobj.IDNo;//500233.....
	var phonenum=thedataobj.Phone;//if( zyCP == 'ZH' && zyTable ==1 && isY != -1 ){ // 深航直营
	//    var priceps = age=='儿童'?(Number(theprice)/20).toFixed(0)*10:theprice; // 儿童价格为当前全价的一半
	//}else{
	//    var priceps = age=='儿童'?Fprice:theprice; // 儿童价格为 Y仓位 的一半
	//}
	//if(  isY != -1 ){ // Y仓位以上的 都为 当前仓位的基础仓位的一半
	//    var priceps = age=='儿童'?Fpricey:theprice; // 儿童价格为当前全价的基础仓位的一半 四舍五入
	//}else{
	//    var priceps = age=='儿童'?Fprice:theprice; // Y仓位及以下   儿童价格为 Y仓位 的一半
	//}
	var priceps=age=='儿童'?Fprice:theprice;// Y仓位及以下   儿童价格为 Y仓位 的一半/儿童价格为当前全价的基础仓位的一半 四舍五入
	//console.log(age);
	//console.log(priceps);
	if(age!='儿童'){var passengerData={'name':name,'age':age,'card':card,'num':num,'phone':phonenum,'price':priceps};allpassengerData.push(passengerData);//console.log(allpassengerData);
	//alert('进入成人')
	}else{// 儿童
	//if(phonenum == ''){
	//
	//}
	if(phonenum==''){phonenum=thenophonechild;}var passengerData={'name':name,'age':age,'card':card,'num':num,'phone':phonenum,'price':priceps};allpassengerDatay.push(passengerData);}}//console.log(allpassengerData)
	//console.log(allpassengerDatay)
	for(var i=0;i<allpassengerData.length;i++){allpassengerDataPull.push("'"+passengerhtml(allpassengerData[i])+"'");}for(var i=0;i<allpassengerDatay.length;i++){allpassengerDataPully.push("'"+passengerhtml(allpassengerDatay[i])+"'");}return[allpassengerDataPull,allpassengerDataPully];}// 相关点击事件
	function allmyClickbook(){//保险份
	var safenum=$.qus('.myBook-namel').length;if(backFlight){$.qu('.buysafe-nums').innerHTML=safenum*2;$.qu('.buysafe-numst').innerHTML=safenum*2;}else{$.qu('.buysafe-nums').innerHTML=safenum;$.qu('.buysafe-numst').innerHTML=safenum;}//查看退改签 单程 或者 去程
	$.qu('.looktext-sp1').onclick=function(){if(onOFFs){$.qu('.looktext1-text').style.display='none';$.qu('.looktext-im1').src='https://cos.uair.cn/mb/img/botom.png';onOFFs=false;}else{$.qu('.looktext1-text').style.display='block';$.qu('.looktext-im1').src='https://cos.uair.cn/mb/img/top.png';onOFFs=true;}//alloneMone();
	};//查看退改签 返程
	$.qu('.looktext1-sp1').onclick=function(){if(onOFFs1){$.qu('.looktext11-text').style.display='none';$.qu('.looktext1-im1').src='https://cos.uair.cn/mb/img/botom.png';onOFFs1=false;}else{$.qu('.looktext11-text').style.display='block';$.qu('.looktext1-im1').src='https://cos.uair.cn/mb/img/top.png';onOFFs1=true;}//alloneMone();
	};// 开启保险弹层 成人 或者 去程
	$.qu('.safetexth').onclick=function(){$.qu('.thesafebox').style.display='-webkit-box';};// 开启保险弹层 儿童
	$.qu('.safetexthy').onclick=function(){$.qu('.thesafebox').style.display='-webkit-box';};// 开启保险弹层  返程
	$.qu('.safetexth1').onclick=function(){$.qu('.thesafebox1').style.display='-webkit-box';};//  保险按钮 30的
	$.qu('.buysafe-btnbox').onclick=function(){//ddataar[3] 权限 是否统一 1为统一 0 为不统一
	//ddataar[4] 具体权限代码
	if(ddataar[8]==0&&!eisall){//权限统一 且都为10
	// 不能点击 点击不做事情
	}else{if(onOFF){// 关闭保险
	// $.qu('.buysafe-btnbox1').style.left ='0.1rem';
	$.addClass($.qu('.buysafe-btnbox1'),'buysafe-btnbox1left');//this.style.backgroundColor ='#ccc';
	$.addClass(this,'buysafe-btnboxbcf');onOFF=false;}else{// 选择保险
	if(zyCP=='ZH'&&zyTable==1){//  直营 且 为深圳直营
	//getsafeText(insureType);// 去程 或者单程 加载保险数据
	//if(backFlight){// 有返程
	//    getsafeText1(insureType); //返程 加载保险数据
	//}
	if($.qu('.buysafet').style.display=='block'){if(onOFFt){//$.qu('.buysafe-btnbox1t').style.left ='0.1rem';
	$.removeClass($.qu('.buysafe-btnbox1t'),'buysafe-btnbox1tright');//$.qu('.buysafe-btnboxt').style.backgroundColor ='#ccc';
	$.removeClass($.qu('.buysafe-btnboxt'),'buysafe-btnboxtbcfb');onOFFt=false;}}}//$.qu('.buysafe-btnbox1').style.left ='1.2rem';
	$.removeClass($.qu('.buysafe-btnbox1'),'buysafe-btnbox1left');//this.style.backgroundColor ='#f4734b';
	$.removeClass(this,'buysafe-btnboxbcf');onOFF=true;}alloneMone();}//checkChailvPassenger(); 只有开关的话 就不用判断差旅
	};////  保险按钮 20的
	$.qu('.buysafe-btnboxt').onclick=function(){if(onOFFt){// 放弃20的保险
	//$.qu('.buysafe-btnbox1t').style.left ='0.1rem';
	$.removeClass($.qu('.buysafe-btnbox1t'),'buysafe-btnbox1tright');//this.style.backgroundColor ='#ccc';
	$.removeClass(this,'buysafe-btnboxtbcfb');onOFFt=false;}else{// 选择 20的保险
	if(zyCP=='ZH'&&zyTable==1){//  直营 且 为深圳直营
	getsafeText(12);// 去程 或者单程 加载保险数据
	if(backFlight){// 有返程
	getsafeText1(12);//返程 加载保险数据
	}}if(onOFF){// $.qu('.buysafe-btnbox1').style.left ='0.1rem';
	$.addClass($.qu('.buysafe-btnbox1'),'buysafe-btnbox1left');//$.qu('.buysafe-btnbox').style.backgroundColor ='#ccc';
	$.addClass($.qu('.buysafe-btnbox'),'buysafe-btnboxbcf');onOFF=false;}//$.qu('.buysafe-btnbox1t').style.left ='1.2rem';
	$.addClass($.qu('.buysafe-btnbox1t'),'buysafe-btnbox1tright');//this.style.backgroundColor ='#f4734b';
	$.addClass(this,'buysafe-btnboxtbcfb');onOFFt=true;}alloneMone();//累计总价
	};// 凭证按钮
	$.qu('.proof-btnbox').onclick=function(){if(onOFFp){//$.qu('.proof-btnbox1').style.left ='1.2rem';
	//this.style.backgroundColor ='#f4734b';
	// $.qu('.proof-box').style.display ='block';
	//onOFFp =false;
	//alert(1)
	// 跳转 联系地址
	$.router.go('#!/flightmb/contactpeople',{btype:40},true);}else{$.qu('.proof-btnbox1').style.left='0.1rem';this.style.backgroundColor='#ccc';$.qu('.proof-box').style.display='none';onOFFp=true;}alloneMone();};// 差旅开关按钮 onOFFr
	$.qu('.Tripb-btnbox').onclick=function(){if(onOFFr){//$.qu('.Tripb-btnbox1').style.left ='1.2rem';
	//this.style.backgroundColor ='#f4734b';
	//$.qu('.Tripb-box').style.display ='block';
	//onOFFr =false;
	//alert(1)
	// 跳转 联系地址
	$.router.go('#!/flightmb/Trip',{btype:50},true);}else{$.qu('.Tripb-btnbox1').style.left='0.1rem';this.style.backgroundColor='#ccc';$.qu('.Tripb-box').style.display='none';onOFFr=true;}// $.router.go('#!/flightmb/Trip',{btype:50},true)
	};//删除乘机人
	$.each($.qus('.bookdelete'),function(){this.onclick=function(){this.parentNode.parentNode.removeChild(this.parentNode);var safenum=$.qus('.myBook-namel').length;if(backFlight){$.qu('.buysafe-nums').innerHTML=safenum*2;$.qu('.buysafe-numst').innerHTML=safenum*2;}else{$.qu('.buysafe-nums').innerHTML=safenum;$.qu('.buysafe-numst').innerHTML=safenum;}checkChailvPassenger();//mycheckuser('myBook',function (){
	//    console.log('删除乘机人登录时验证通过了。')
	//    SetCookie('xhtime',1,6);//  设置定时器 cookie 6分钟 值为1
	//    checkChailvPassenger();
	//})
	//alloneMone();//计价
	};});// 添加乘机人 路由
	$.qu('.namepick2').onclick=function(){$.router.go('#!/flightmb/passenger',{btype:1,backFlight:backFlight},true);};// 添加联系人
	$.qu('.linkmanpick2').onclick=function(){$.router.go('#!/flightmb/mychalinkp',{btype:2},true);};// 选择平邮 或者 快递
	$.qu('.y_exp').onclick=function(){//$.firstChild(this)
	this.setAttribute("extype","1");$.qu('.y_exp-btn').style.boxShadow=' 0 0 0 0.2rem #cc0000';$.qu('.n_exp').setAttribute("extype","0");$.qu('.n_exp-btn').style.boxShadow=' 0 0 0 0.2rem #cccccc';alloneMone();};$.qu('.n_exp').onclick=function(){//$.firstChild(this)
	(0,_api.myalertp)('myBook','\u514D\u8D39\u5E73\u90AE\uFF0C\u884C\u7A0B\u5355\u5C5E\u4E8E\u53D1\u7968\uFF0C\u9057\u5931\u4E0D\u8865\uFF0C\u7EA610\u4E2A\u5DE5\u4F5C\u65E5\u5BC4\u5230');this.setAttribute("extype","1");$.qu('.n_exp-btn').style.boxShadow=' 0 0 0 0.2rem  #cc0000';$.qu('.y_exp').setAttribute("extype","0");$.qu('.y_exp-btn').style.boxShadow=' 0 0 0 0.2rem  #cccccc';alloneMone();};}//增加乘机人  |5.4新接口变动
	function addPass(data1){var data=data1.data;var datatojson=JSON.stringify(data);var pid=data1.psid;var theroule=data.rule;var deptId=data.DeptId;var str='<li class="myBook-namel" psid ="'+pid+'"   theroule ="'+theroule+'" deptId="'+deptId+'"  data='+datatojson+'  ><div class="bookdelete"><div class="bookdelete1"></div></div><p class="myBook-namelp1"><span class="namelp1sp1">'+data.Name+'('+data.Age+')'+'</span></p><p class="myBook-namelp1"><span class="namelp1sp3">'+data.IDType+'</span><span class="namelp1sp4">'+data.IDNo+'</span></p></li>';//var alp = $.qus('.namelp1sp4');
	var alppeple=$.qus('.myBook-namel');for(var i=0;i<alppeple.length;i++){var thepid=alppeple[i].getAttribute('psid');if(pid==thepid){$.qu('.myBook-nameul').removeChild(alppeple[i]);break;}}$.qu('.myBook-nameul').innerHTML+=str;//ertong(); // 将儿童的身份证 换为 出生日期 目前不用
	var aPs=$.qus('.myBook-namel');var safenum=aPs.length;// 根据人数 显示保险数量
	if(backFlight){$.qu('.buysafe-nums').innerHTML=safenum*2;$.qu('.buysafe-numst').innerHTML=safenum*2;}else{$.qu('.buysafe-nums').innerHTML=safenum;$.qu('.buysafe-numst').innerHTML=safenum;}//checkChailvPassenger();
	}//增加/更换联系人
	function addLinkpe(data){$.qu('.linkman-box').setAttribute('cid',data.id);var num=$.qu('.linkman4').innerHTML;$.qu('.linkman4').innerHTML=data.linknump;$.qu('.linkman2').innerHTML=data.linkname;}// 累计总价函数  删除 或者添加联系人 儿童显示 及
	function alloneMone(){var thebtnnum=$.qu('.ygLeft-box').getAttribute('choicetype');if(zyTablechange==1){//直营非差旅 真直营
	$.qu('.proof').style.display='none';$.qu('.proof-box').style.display='none';ShipFeeOnoff=0;}else{//$.qu('.proof').style.display = 'block';
	if(!onOFFp&&$.qu('.proof').style.display=='block'){var isexp=$.qu('.y_exp').getAttribute('extype');ShipFeeOnoff=isexp==1?shipMoney:0;}else{ShipFeeOnoff=0;}}var aPs=$.qus('.myBook-namel');var oarr=[];var yarr=[];var odarr=[];for(var j=0;j<aPs.length;j++){var theage2=JSON.parse(aPs[j].getAttribute('data')).Age;//console.log(theage2);
	if(theage2=='儿童'){//有老人或者儿童
	//ynum++; 儿童
	yarr.push(1);}else if(theage2=='老人'){//odnum++ 老人
	odarr.push(3);}else{//onum++ 成人
	oarr.push(2);}}onum=oarr.length;// 成人
	odnum=odarr.length;// 老人个数
	ynum=yarr.length;// 儿童个数
	if(ynum==0){var yc=$.qus('.ishidden');for(var i=0;i<yc.length;i++){yc[i].style.display='none';}}else{var yc=$.qus('.ishidden');for(var i=0;i<yc.length;i++){yc[i].style.display='block';}}//onOFF =true; // 保险开关按钮
	// onOFFt =false;// 保险开关按钮
	// 根据 直营  和非直营 显示 保险按钮
	if(zyTable==0){// 非直营
	$.qu('.zycp').style.display='none';//取消直营航班显示
	$.qu('.zycp1').style.display='none';//取消直营航班显示
	$.qu('.zycp1').style.background='#fff';$.qu('.zycp').style.background='#fff';//if( !mIsNormalPassenger && mPassengerIsValidated){ // 非直营 且都是 差旅乘客
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
	if(ynum!=0||odnum!=0){//非直营  有儿童或者老人 保险 都要是20
	if(ynum!=0){// 有儿童
	$.qu('.myBook-mttdatay').style.display='block';$.qu('.mttbookpricey').innerHTML=Fprice;}else{// 没有儿童 是是老人
	$.qu('.myBook-mttdatay').style.display='none';if(backFlight){// 往返的时候  显示保险 返程
	$.qu('.mttdata1-sp3').style.display='inline-block';}}$.qu('.buysafe-price').innerHTML='20';// 保险 按钮的价格
	$.qu('.mttbookprice2').innerHTML='20';$.qu('.mttbookprice2y').innerHTML='20';getsafeText(3);// 更换保险说明 只能选择20的保险
	if(backFlight){//返程  添加弹层效果 点击事件 修改 问号边上的价格
	getsafeText1(3);///
	}}else{// 没有儿童 或者老人 往返
	$.qu('.myBook-mttdatay').style.display='none';$.qu('.buysafe-price').innerHTML='30';$.qu('.mttbookprice2').innerHTML='30';getsafeText(insureType);//更换保险说明
	if(backFlight){//返程
	getsafeText1(insureType1);//更换保险说明 11
	$.qu('.mttdata1-sp3').style.display='inline-block';}}}else{// 直营 zyTable == 1
	if(zyTablechange==0){// 直营下的  匹配成功 全是差旅 zh 深圳直营 不可能出现  目前就只是南方直营
	if(thebtnnum==1&&$.qu('.goReason').style.display=='block'){$.qu('.Tripb').style.display='block';}else{$.qu('.Tripb').style.display='none';$.qu('.Tripb-box').style.display='none';}$.qu('.buysafe').style.display='block';// 显示保险 buysafe
	$.qu('.zycp').style.display='none';//隐藏直营航班显示
	$.qu('.zycp1').style.display='none';//隐藏直营航班显示
	$.qu('.zycp1').style.background='#fff';$.qu('.zycp').style.background='#fff';}else{//zyTablechange ==1  直营非差旅 真直营
	$.qu('.zycp').style.display='inline-block';//显示直营航班显示
	$.qu('.zycp1').style.display='inline-block';//显示直营航班显示
	$.qu('.zycp1').style.background='#eee';$.qu('.zycp').style.background='#eee';if(ynum!=0){//有儿童的时候  单程 直营  就没有往返航班 直营 非差旅
	$.qu('.myBook-mttdatay').style.display='block';//显示儿童票价信息
	//if(zyCP == 'ZH' && isY != -1){ // 深航直营儿童价格 为成人票的一半
	//    var yprice0 =(Number($.qu('.mttbookprice').innerHTML)/20).toFixed(0)*10;
	//    $.qu('.mttbookpricey').innerHTML =yprice0;
	//
	//}else{
	//    $.qu('.mttbookpricey').innerHTML =Fprice;
	//}
	$.qu('.mttbookpricey').innerHTML=Fprice;$.qu('.mttdata-sp3y').style.display='inline-block';// 显示儿童价的 保险弹层
	if(zyCP=='ZH'){//深圳直营 单程 有儿童  有保险
	$.qu('.mttdata-sp1e3').innerHTML='成人票';$.qu('.mttdata-sp1e3y').innerHTML='儿童票';$.qu('.mttdata-sp3').style.display='inline-block';//显示成年保险说明
	$.qu('.mttdata-sp3y').style.display='inline-block';//显示儿童保险说明
	$.qu('.buysafe').style.display='block';//显示保险选择按钮
	$.qu('.buysafet').style.display='block';//显示保险选择按钮
	}else{// 非深圳 有儿童 直营  也不是差旅 就没有保险
	$.qu('.mttdata-sp3').style.display='none';//隐藏成年保险说明
	$.qu('.mttdata-sp3y').style.display='none';//隐藏儿童保险说明
	$.qu('.buysafe').style.display='none';//隐藏保险选择按钮
	$.qu('.buysafet').style.display='none';//隐藏保险选择按钮
	$.qu('.mttdata-sp1e3').innerHTML='成人票(无保险)';$.qu('.mttdata-sp1e3y').innerHTML='儿童票(无保险)';}}else{// 直营  没有差旅  没有儿童
	$.qu('.myBook-mttdatay').style.display='none';//隐藏 儿童 票信息
	//if(backFlight){ // 往返
	//
	//}else{ //直营 没有差旅  没有儿童 单程
	//
	//}
	if(zyCP=='ZH'){//深圳直营  有保险
	$.qu('.mttdata-sp1e3').innerHTML='成人票';$.qu('.mttdata-sp3').style.display='inline-block';//显示成年保险说明
	$.qu('.buysafe').style.display='block';//显示保险选择按钮
	$.qu('.buysafet').style.display='block';//显示保险选择按钮
	}else{$.qu('.mttdata-sp3').style.display='none';//隐藏成年保险说明
	$.qu('.buysafe').style.display='none';//隐藏保险选择按钮
	$.qu('.buysafet').style.display='none';//隐藏保险选择按钮
	$.qu('.mttdata-sp1e3').innerHTML='成人票(无保险)';}//
	//$.qu('.mttdata-sp1e3').innerHTML = '成人票';// 更换票类型 成人
	//$.qu('.zycp').style.display = 'none';//取消直营航班显示
	//$.qu('.mttdata-sp3').style.display = 'inline-block';//显示保险 成人说明
	////$.qu('.mttdata-sp3y').style.display = 'inline-block'; //显示 儿童保险说明
	//$.qu('.buysafe-price').innerHTML = '30';
	//$.qu('.mttbookprice2').innerHTML = '30';
	//$.qu('.mttbookprice2y').innerHTML = '30';//填写保险价格
	//getsafeText(insureType) //更换保险说明
	}}}var tickeprice1=parseInt($.qu('.mttbookprice').innerHTML);// 票面价 mttbookprice
	var oilprice1=50;// 基建燃油
	var safe1=parseInt($.qu('.mttbookprice2').innerHTML);// 保险
	//    成人+老人    儿童   快递费用
	var honbaoone=0;//红包计价
	if(!backFlight){//单程
	//$.qu('.buysafe-price').innerHTML = '30'; // 保险开关显示的 保险值buysafe-pricet
	if(onOFF&&$.qu('.buysafe').style.display=='block'){if(ynum!=0){// 有儿童
	if(zyCP=='ZH'&&zyTable==1){safe1=30;$.qu('.mttbookprice2y').innerHTML='30';$.qu('.mttbookprice2').innerHTML='30';}else{safe1=20;$.qu('.mttbookprice2y').innerHTML='20';$.qu('.mttbookprice2').innerHTML='20';}}else{//没有儿童
	safe1=30;$.qu('.mttbookprice2y').innerHTML='30';$.qu('.mttbookprice2').innerHTML='30';}}else{safe1=0;if(onOFFt&&$.qu('.buysafet').style.display=='block'){safe1=20;$.qu('.mttbookprice2y').innerHTML='20';$.qu('.mttbookprice2').innerHTML='20';}}if(safe1==0){// 按钮行 显示 份数 无保险
	$.qu('.buysafe-nums').innerHTML=0;$.qu('.buysafe-numst').innerHTML=0;// 修改 保险显示 和 成年无保险 儿童无保险
	$.qu('.mttdata-sp3').style.display='none';//隐藏成年保险说明
	$.qu('.mttdata-sp3y').style.display='none';//隐藏儿童保险说明
	$.qu('.mttdata-sp1e3').innerHTML='成人票(无保险)';$.qu('.mttdata-sp1e3y').innerHTML='儿童票(无保险)';}else{// 有保险
	var safenum=$.qus('.myBook-namel').length;if(backFlight){$.qu('.buysafe-nums').innerHTML=safenum*2;$.qu('.buysafe-numst').innerHTML=safenum*2;}else{$.qu('.buysafe-nums').innerHTML=safenum;$.qu('.buysafe-numst').innerHTML=safenum;}if(ynum!=0){// 有儿童
	$.qu('.myBook-mttdatay').style.display='block';$.qu('.mttdata-sp3').style.display='inline-block';//显示成年保险说明
	$.qu('.mttdata-sp3y').style.display='inline-block';//显示儿童保险说明
	//$.qu('.buysafe').style.display = 'none'; //隐藏保险选择按钮
	//$.qu('.buysafet').style.display = 'none'; //隐藏保险选择按钮
	$.qu('.mttdata-sp1e3').innerHTML='成人票';$.qu('.mttdata-sp1e3y').innerHTML='儿童票';$.qu('.mttbookprice2').innerHTML=safe1;$.qu('.mttbookprice2y').innerHTML=safe1;}else{//没有儿童
	$.qu('.myBook-mttdatay').style.display='none';$.qu('.mttdata-sp3').style.display='inline-block';//显示成年保险说明
	$.qu('.mttdata-sp3y').style.display='none';//隐藏儿童保险说明
	$.qu('.mttdata-sp1e3').innerHTML='成人票';//
	//$.qu('.mttdata-sp1e3y').innerHTML ='儿童票';
	$.qu('.mttbookprice2').innerHTML=safe1;//$.qu('.mttbookprice2y').innerHTML = safe1;
	}}//
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
	var yhtml=$.qu('.mttbookpricey').innerHTML;var yprice=yhtml?yhtml:0;var chlidprice=parseInt(yprice);console.log(chlidprice);//console.log(typeof chlidprice)
	var allprice=(tickeprice1+oilprice1+safe1)*(onum+odnum)+ynum*(chlidprice+safe1)+ShipFeeOnoff;if(hashongbaof=='true'){if(ynum>0){// 有儿童
	// 直营都没有红包的 所以 深航 儿童半价的问题不存在
	if(Fprice<themoneycheck){// 小于 800 儿童没得红包
	honbaoone=Number(hbjinef)*(onum+odnum);}else{honbaoone=Number(hbjinef)*(onum+odnum+ynum);//大于 800 儿童有红包
	}}else{//没有儿童
	honbaoone=Number(hbjinef)*(onum+odnum);}}}else{// 往返
	var safe2=0;if(onOFF&&$.qu('.buysafe').style.display=='block'){safe2=60;$.qu('.mttbookprice2').innerHTML=30;$.qu('.mttbookprice24').innerHTML=30;}else{safe2=0;if(onOFFt&&$.qu('.buysafet').style.display=='block'){safe2=40;$.qu('.mttbookprice2').innerHTML=20;$.qu('.mttbookprice24').innerHTML=20;}}if(safe2==0){// 按钮行 显示 份数 无保险
	$.qu('.buysafe-nums').innerHTML=0;$.qu('.buysafe-numst').innerHTML=0;// 修改 保险显示 和 成年无保险 儿童无保险
	$.qu('.mttdata-sp3').style.display='none';//隐藏成年保险说明
	$.qu('.mttdata1-sp3').style.display='none';//隐藏成年保险说明
	$.qu('.mttdata-sp1e3').innerHTML='成人票(无保险)';$.qu('.mttdata1-sp1e3').innerHTML='成人票(无保险)';}else{// 有保险
	var safenum=$.qus('.myBook-namel').length;$.qu('.buysafe-nums').innerHTML=safenum*2;$.qu('.buysafe-numst').innerHTML=safenum*2;$.qu('.mttdata-sp3').style.display='inline-block';//隐藏成年保险说明
	$.qu('.mttdata1-sp3').style.display='inline-block';//隐藏成年保险说明
	$.qu('.mttdata-sp1e3').innerHTML='成人票';$.qu('.mttdata1-sp1e3').innerHTML='成人票';}$.qu('.buysafe-price').innerHTML='30';// 保险开关显示的 保险值buysafe-pricet
	$.qu('.buysafe-pricet').innerHTML='20';// 保险开关显示的 保险值buysafe-pricet
	var tickeprice2=parseInt($.qu('.mttbookprice4').innerHTML);// 票面价  返程mttbookprice
	var allprice=(tickeprice1+tickeprice2+oilprice1+oilprice1+safe2)*(onum+odnum)+ShipFeeOnoff;var fhonbaoone=0;//去程红包总价
	var thonbaoone=0;//返程红包总价
	if(hashongbaof=='true'){fhonbaoone=Number(hbjinef)*(onum+odnum);}else{fhonbaoone=0;}if(hashongbaot=='true'){thonbaoone=Number(hbjinet)*(onum+odnum);}else{thonbaoone=0;}honbaoone=fhonbaoone+thonbaoone;//合计 往返红包
	}var hongbaoprice=honbaoone;// 红包总价
	var allbeforeprice=allprice-hongbaoprice;//减掉红包后的价格
	if(honbaoone==0){$.qu('.hongbaotext').style.display='none';}else{$.qu('.hongbaotext').innerHTML='(总'+allprice+'-'+'红包'+hongbaoprice+')';// 括号红包数据
	$.qu('.hongbaotext').style.display='inline-block';}//$.qu('.allprice11').innerHTML =allprice;// 总价 添入 页面
	$.qu('.allprice11').innerHTML=allbeforeprice;// 总价 添入 页面
	}// 查询退改规则 单程 或者去程
	function myBookChange1(carrier,seat){//console.log(carrier+seat)
	var oData2='';var xhr='';if(window.XMLHttpRequest){xhr=new XMLHttpRequest();}else{xhr=new ActiveXObject(' Microsoft . XMLHTTP');}//xhr.open('get','http://106.75.131.58:8015/icbc/ajax.aspx?isKyReq=1&act=getOtherKyData&ACTION=GetRefundDef&carrier='+carrier+'&seat='+seat+'&reqPath=utlsiteservice.aspx','false');
	xhr.open('get',flightUrl+'/icbc/ajax.aspx?isKyReq=1&act=getOtherKyData&ACTION=GetRefundDef&carrier='+carrier+'&seat='+seat+'&reqPath=utlsiteservice.aspx','false');xhr.send();xhr.onreadystatechange=function(){if(xhr.readyState==4){// ajax 响内容解析完成，可以在客户端调用了
	if(xhr.status==200){//  判断服务器返回的状态 200 表示 正常
	//alert(  eval(xhr.responseText))
	//console.log( eval(xhr.responseText));
	// console.log('查看退改签！');
	if(xhr.responseText!=''){oData2=eval(xhr.responseText);$.qu('.looktext1-changetex1').innerHTML=oData2[0].EndorseNotice;$.qu('.looktext1-changetex2').innerHTML=oData2[0].UpNotice;$.qu('.looktext1-changetex3').innerHTML=oData2[0].RefundNotice;}else{$.qu('.looktext1-changetex1').innerHTML='退改签规则以航空公司最新规则为准';$.qu('.looktext1-changetex2').innerHTML='退改签规则以航空公司最新规则为准';$.qu('.looktext1-changetex3').innerHTML='退改签规则以航空公司最新规则为准';}// 加载儿童退改签
	myBookChange1y(carrier,isYca);}else{//alert('出错了，Err' +xhr.status);
	(0,_api.myalertp)('myBook','查询退改签出错了，Err'+xhr.status);}}};}// 查询退改规则 儿童
	function myBookChange1y(carrier,seat){//console.log(carrier+seat)
	var oData2='';var xhr='';if(window.XMLHttpRequest){xhr=new XMLHttpRequest();}else{xhr=new ActiveXObject(' Microsoft . XMLHTTP');}//xhr.open('get','http://106.75.131.58:8015/icbc/ajax.aspx?isKyReq=1&act=getOtherKyData&ACTION=GetRefundDef&carrier='+carrier+'&seat='+seat+'&reqPath=utlsiteservice.aspx','false');
	xhr.open('get',flightUrl+'/icbc/ajax.aspx?isKyReq=1&act=getOtherKyData&ACTION=GetRefundDef&carrier='+carrier+'&seat='+seat+'&reqPath=utlsiteservice.aspx','false');xhr.send();xhr.onreadystatechange=function(){if(xhr.readyState==4){// ajax 响内容解析完成，可以在客户端调用了
	if(xhr.status==200){//  判断服务器返回的状态 200 表示 正常
	//alert(  eval(xhr.responseText))
	//console.log( eval(xhr.responseText));
	//console.log('查看退改签！');
	if(xhr.responseText!=''){oData2=eval(xhr.responseText);$.qu('.looktext1-changetex1y').innerHTML=oData2[0].EndorseNotice;$.qu('.looktext1-changetex2y').innerHTML=oData2[0].UpNotice;$.qu('.looktext1-changetex3y').innerHTML=oData2[0].RefundNotice;}else{$.qu('.looktext1-changetex1y').innerHTML='退改签规则以航空公司最新规则为准';$.qu('.looktext1-changetex2y').innerHTML='退改签规则以航空公司最新规则为准';$.qu('.looktext1-changetex3y').innerHTML='退改签规则以航空公司最新规则为准';}}else{//alert('出错了，Err' +xhr.status);
	(0,_api.myalertp)('myBook','查询退改签出错了，Err'+xhr.status);}}};}// 查询退改规则 返程
	function myBookChange2(carrier,seat){//console.log(carrier+seat)
	var oData2='';var xhr='';if(window.XMLHttpRequest){xhr=new XMLHttpRequest();}else{xhr=new ActiveXObject(' Microsoft . XMLHTTP');}//xhr.open('get','http://106.75.131.58:8015/icbc/ajax.aspx?isKyReq=1&act=getOtherKyData&ACTION=GetRefundDef&carrier='+carrier+'&seat='+seat+'&reqPath=utlsiteservice.aspx','false');
	xhr.open('get',flightUrl+'/icbc/ajax.aspx?isKyReq=1&act=getOtherKyData&ACTION=GetRefundDef&carrier='+carrier+'&seat='+seat+'&reqPath=utlsiteservice.aspx','false');xhr.send();xhr.onreadystatechange=function(){if(xhr.readyState==4){// ajax 响内容解析完成，可以在客户端调用了
	if(xhr.status==200){//  判断服务器返回的状态 200 表示 正常
	if(xhr.responseText!=''){oData2=eval(xhr.responseText);$.qu('.looktext11-changetex1').innerHTML=oData2[0].EndorseNotice;$.qu('.looktext11-changetex2').innerHTML=oData2[0].UpNotice;$.qu('.looktext11-changetex3').innerHTML=oData2[0].RefundNotice;}else{$.qu('.looktext11-changetex1').innerHTML='退改签规则以航空公司最新规则为准';$.qu('.looktext11-changetex2').innerHTML='退改签规则以航空公司最新规则为准';$.qu('.looktext11-changetex3').innerHTML='退改签规则以航空公司最新规则为准';}}else{//alert('出错了，Err' +xhr.status);
	(0,_api.myalertp)('myBook','查询退改签出错了，Err'+xhr.status);}}};}// 保险说明函数 及数据加载  单程 或者 去程的时候
	function getsafeText(insureType){// 获取保险说明接口  只需要传递 保险类型 insureType 其他字段都是固定的
	function myinsuredata(insureType1){//console.log(carrier+seat)
	var oData2='';var xhr='';if(window.XMLHttpRequest){xhr=new XMLHttpRequest();}else{xhr=new ActiveXObject(' Microsoft . XMLHTTP');}//xhr.open('get','http://106.75.131.58:8015/icbc/ajax.aspx?isKyReq=1&act=GetInsure&insuretype='+insureType1,'true');
	xhr.open('get',flightUrl+'/icbc/ajax.aspx?isKyReq=1&act=GetInsure&insuretype='+insureType1,'true');xhr.send();xhr.onreadystatechange=function(){if(xhr.readyState==4){// ajax 响内容解析完成，可以在客户端调用了
	if(xhr.status==200){//  判断服务器返回的状态 200 表示 正常
	oData2=eval('('+xhr.responseText+')');//console.log(oData2)
	var ptext=oData2.Info;var safeprice=Number(oData2.Price);$.qu('.mttbookprice2').innerHTML=safeprice;//  改变保险价格
	var str='<p class="theword">'+ptext+'</p><a href="javascript:;" class="thesafebox-ok">我已知晓</a>';$.qu('.thesafebox-div').innerHTML=str;$.qu('.thesafebox-ok').onclick=function(){$.qu('.thesafebox').style.display='none';// 关闭弹层
	};}else{//alert('出错了，Err' +xhr.status);
	(0,_api.myalertp)('myBook','查询保险说明出错了，Err'+xhr.status);}}};}myinsuredata(insureType);}// 保险说明函数 及数据加载  返程
	function getsafeText1(insureType){// 获取保险说明接口  只需要传递 保险类型 insureType 其他字段都是固定的
	function myinsuredata1(insureType1){//console.log(carrier+seat)
	var oData2='';var xhr='';if(window.XMLHttpRequest){xhr=new XMLHttpRequest();}else{xhr=new ActiveXObject(' Microsoft . XMLHTTP');}//xhr.open('get','http://106.75.131.58:8015/icbc/ajax.aspx?isKyReq=1&act=GetInsure&insuretype='+insureType1,'true');
	xhr.open('get',flightUrl+'/icbc/ajax.aspx?isKyReq=1&act=GetInsure&insuretype='+insureType1,'true');xhr.send();xhr.onreadystatechange=function(){if(xhr.readyState==4){// ajax 响内容解析完成，可以在客户端调用了
	if(xhr.status==200){//  判断服务器返回的状态 200 表示 正常
	//console.log(xhr.responseText)
	if(xhr.responseText){oData2=eval('('+xhr.responseText+')');// console.log(oData2)
	var ptext1=oData2.Info;var safeprice1=Number(oData2.Price);$.qu('.mttbookprice24').innerHTML=safeprice1;//  改变保险价格
	var str='<p class="theword1">'+ptext1+'</p><a href="javascript:;" class="thesafebox1-ok">我已知晓</a>';$.qu('.thesafebox1-div').innerHTML=str;$.qu('.thesafebox1-ok').onclick=function(){$.qu('.thesafebox1').style.display='none';// 关闭弹层
	};}else{}}else{//alert('出错了，Err' +xhr.status);
	(0,_api.myalertp)('myBook','查询保险说明出错了，Err'+xhr.status);}}};}myinsuredata1(insureType);}//判断时间是否应该加一天
	function isNextDay(date1,date2,dateM){var str1=removeM(date1)-removeM(date2)>0?GetDateStrH(dateM,"24"):dateM;return getLastFive(str1);}//日期中去除年份
	function getLastFive(date){return date.substring(date.length-5,date.length);}//去除"\:"
	function removeM(date){return parseInt(date.replace(/\:/g,""));}//天数加一
	function GetDateStrH(data1,h){var Y1=data1.substring(0,4);var m1=data1.substring(5,7)-1;var d1=data1.substring(8,10);// var  h1 = data1.substring(11, 13);
	// var  M1 = data1.substring(14, 17);
	var dd=new Date(Y1,m1,d1);dd.setHours(dd.getHours()+h);//获取AddDayCount天后的日期
	var y=dd.getFullYear();var m=dd.getMonth()+1;//获取当前月份的日期
	var d=dd.getDate();if((m+"").length==1){m="0"+m;}if((d+"").length==1){d="0"+d;}return y+"-"+m+"-"+d;}//兼容获取样式
	function getMyStyle(obj,attr){if(obj.currentStyle){return obj.currentStyle[attr];}else{return window.getComputedStyle(obj,false)[attr];}}//身份证加"*"处理 分两种情况 成人 or 儿童生日加横岗
	function hideInfo(e){var d=e.length;return d<18?e.replace(/(.{4})(.{2})/,"$1-$2-"):e.replace(/^(.{6})(?:\d+)(.{4})$/,"$1****$2");}// 实时检查余票
	function getabinCount(){var fArr=DecFlights();console.log('验票初始数据');console.log(fArr.length);console.log(fArr);gettn(fArr,0);}function gettn(fArr,iSeq){var otherParam={"searchType":"1","goDate":fArr[0]["e"]};if(iSeq==0&&fArr.length>1){otherParam["searchType"]="2";otherParam["goFlight"]="";otherParam["backDate"]=fArr[1]["e"];}if(iSeq==1){// 往返
	otherParam["searchType"]="3";otherParam["goFlight"]=fArr[1]["c"]+"_"+fArr[1]["d"];otherParam["backDate"]=fArr[1]["e"];}var jsonData={act:"checkCabinCount",org_city:fArr[iSeq]["a"],dst_city:fArr[iSeq]["b"],org_date:fArr[iSeq]["e"],cabinCode:fArr[iSeq]["d"],priceType:fArr[iSeq]["ct"],cabinCount:fArr[iSeq]["v"],flightNo:fArr[iSeq]["c"],otherParam:JSON.stringify(otherParam),iSeq:iSeq};var urldata='act=checkCabinCount&org_city='+fArr[iSeq]["a"]+'&dst_city='+fArr[iSeq]["b"]+'&org_date='+fArr[iSeq]["e"]+'&cabinCode='+fArr[iSeq]["d"]+'&priceType='+fArr[iSeq]["ct"]+'&cabinCount='+fArr[iSeq]["v"]+'&flightNo='+fArr[iSeq]["c"]+'&otherParam='+JSON.stringify(otherParam)+'&iSeq='+iSeq;var isOK=true;//在舱位不足的情况下面是否需要停止下一步提示,true不停止，false停止
	var oData2='';var xhr='';if(window.XMLHttpRequest){xhr=new XMLHttpRequest();}else{xhr=new ActiveXObject(' Microsoft . XMLHTTP');}//xhr.open('post', 'http://106.75.131.58:8015/icbc/OrderSumit.aspx', 'false');
	xhr.open('post','/icbc/ajax.aspx','false');xhr.setRequestHeader('content-type','application/x-www-form-urlencoded;charset=utf-8');xhr.send(urldata);// console.log(isKyReq"=1&act=ORDERBOOK&url=''&reqPath='icbc/OrderSumit.aspx'&" + urldata)
	xhr.onreadystatechange=function(){if(xhr.readyState==4){// ajax 响内容解析完成，可以在客户端调用了
	if(xhr.status==200){//  判断服务器返回的状态 200 表示 正常
	console.log('验票数据返回');oData2=xhr.responseText;console.log(oData2);if(oData2==''){return false;}if(backFlight&&iSeq==0){if(oData2=='B'){(0,_api.myalertp)('myBook',"您预订的去程航班机票已售完，请重新查询预订",function(){$.router.go('#!/flightmb/detail',urldataxh,true);});}else{getgofligthn(fArr,oData2);}}else if(backFlight&&iSeq==1){if(oData2=='B'){(0,_api.myalertp)('myBook',"您预订的返程航班机票已售完，请重新查询预订",function(){$.router.go('#!/flightmb/detail',urldataxh,true);});}else{if(oData2=='A'&&formnumber!='A'){(0,_api.myalertp)('myBook',"去程航班舱位仅剩"+formnumber+"个座位,请尽快完成预订。");}else if(oData2!='A'&&formnumber!='A'){(0,_api.myalertp)('myBook',"去程航班舱位仅剩"+formnumber+"个座位,回程航班舱位仅剩"+oData2+"个座位，请尽快完成预订。");}else if(oData2!='A'&&formnumber=='A'){(0,_api.myalertp)('myBook',"回程航班舱位仅剩"+oData2+"个座位，请尽快完成预订。");}// myalertp('myBook',"去程航班舱位仅剩" + formnumber + "个座位,回程航班舱位仅剩" + oData2 + "个座位，请尽快完成预订。" )
	}}else if(!backFlight){//单程
	if(isNaN(oData2)){// 不是数字
	if(oData2=="A"){}else if(oData2=="B"){(0,_api.myalertp)('myBook',"您预订的航班机票已售完，请重新查询预订",function(){$.router.go('#!/flightmb/detail',urldataxh,true);});}}else{// 为数字
	(0,_api.myalertp)('myBook','该舱位仅剩'+oData2+'个座位，请尽快完成预订');}}////////////////////////////////////////////////////
	}else{//alert('出错了，Err' +xhr.status);
	(0,_api.myalertp)('myBook','实时查询余票数量出错了，Err'+xhr.status);}}};}// 回调 获取 去程票数量
	function getgofligthn(fArr,oData2){formnumber=oData2;gettn(fArr,1);}function getAjaxParam(name,allData){var reg=new RegExp("(^|&)"+name+"=([^&]*)(&|$)");//构造一个含有目标参数的正则表达式对象
	var r=allData.match(reg);//匹配目标参数
	if(r!=null)return unescape(r[2]);return null;//返回参数值
	}

/***/ },
/* 33 */
/***/ function(module, exports) {

	module.exports = "\r\n\r\n<div id=\"myBook\">\r\n        <div class=\"lodinb\">\r\n            <!--<div id=\"caseBlanche\">-->\r\n              <!--<div id=\"rond\">-->\r\n                <!--<div id=\"test\"></div>-->\r\n              <!--</div>-->\r\n              <!--<div id=\"load\">-->\r\n                <!--<p>航班查询中...</p>-->\r\n              <!--</div>-->\r\n            <!--</div>-->\r\n           <img class=\"xhlog\" src=\"https://cos.uair.cn/mb/img/xhlog.gif\" />\r\n       </div>\r\n        <div class=\"thesafebox\">\r\n                 <div class=\"thesafebox-div\">\r\n                 </div>\r\n        </div>\r\n        <div class=\"thesafebox1\">\r\n                 <div class=\"thesafebox1-div\">\r\n                 </div>\r\n         </div>\r\n        <div class=\"book-alert-bg\" id=\"book-alert\">\r\n            <div class=\"book-alert-box\">\r\n                <p class=\"book-alert-info\"></p>\r\n                <span class=\"book-alert-yes\">确定</span>\r\n                <span class=\"book-alert-no\">取消</span>\r\n            </div>\r\n        </div>\r\n\r\n        <div class=\"myBook-t\">\r\n              <span class=\"myBook-tt1\"><img src=\"https://cos.uair.cn/mb/img/back.bg.png\" alt=\"\"></span>\r\n              <span class=\"myBook-tt2\">填写订单</span>\r\n            <a href=\"\" class=\"b_phone\"></a>\r\n            <img src=\"https://cos.uair.cn/mb/img/h_home.png\" class=\"b_home\" alt=\"\"/>\r\n        </div>\r\n        <div class=\"myBook-m\">\r\n            <div class=\"myBook-mwrap\">\r\n                         <div class=\"myBook-flightbox1\">\r\n                          <div class=\"Order-fl-inf\">\r\n                                  <p class=\"allmybook-boxtm\">\r\n                <img class=\"flight-logo\" src=\"https://cos.uair.cn/mb/img/flight-logo.png\"><span class=\"allmybook-boxtm1  allmybookf myBook-startFP\">重庆</span><span class=\"d-wrapl1-right2 order-fl-right\"><strong></strong></span><span class=\"allmybook-boxtm5 allmybookt myBook-endFP\">北京</span>\r\n                <span class=\"Order-fl-style flightbox1-text\">去程</span>\r\n            </p>\r\n            <div class=\"Order-fl-box\">\r\n                <div class=\"Order-fl-l\"></div>\r\n                <div class=\"Order-fl-c\">\r\n                    <p class=\"Order-fl-from\">\r\n                        <span class=\"Order-fl-from-names myBook-mttsp11\">江北机场</span>\r\n                        <span class=\"Order-fl-from-ms myBook-mtfsp1\">12-9</span>\r\n                        <span class=\"Order-fl-from-ts myBook-mttsp1\">11:40</span>\r\n                    </p>\r\n                    <p class=\"Order-fl-from-info\">\r\n                        <img src=\"\" alt=\"\">\r\n                        <span class=\"myBook-mtfsp2\">中国国航空</span>\r\n                        <span class=\"myBook-mtfsp3\">DFASDF123</span>\r\n                        <span class=\"zycp\"></span>\r\n                    </p>\r\n                    <p class=\"Order-fl-to\">\r\n                        <span class=\"Order-fl-from-namee myBook-mttsp22\">江北机场</span>\r\n                        <span class=\"Order-fl-from-me myBook-mtfsp111\">12-09</span>\r\n                        <span class=\"Order-fl-from-te myBook-mttsp2\">11:40</span>\r\n                    </p>\r\n                </div>\r\n            </div>\r\n            </div>\r\n                                  <div class=\"myBook-mttext\">\r\n                                            <div class=\"myBook-mttdata\">\r\n                                                  <span class=\"mttdata-sp1\"><em class=\"mttdata-sp1e3\">成人票</em><em class=\"mttdata-sp1e1\">￥</em><em class=\"mttbookprice\"></em></span>\r\n                                                  <span class=\"mttdata-sp2\"><em class=\"mttdata-sp1e4\">基建/燃油</em><em class=\"mttdata-sp1e2\">￥</em><em class=\"mttbookprice1\">50</em></span>\r\n                                                  <span class=\"mttdata-sp3\"><em class=\"mttdata-sp1e5\">保险</em><em class=\"mttdata-sp1e2\">￥</em><em class=\"mttbookprice2\">30</em><a class=\"safetexth\" href=\"javascript:;\"><img class=\"safetext\" src=\"https://cos.uair.cn/mb/img/more.png\" alt=\"\"></a></span>\r\n\r\n                                            </div>\r\n                                            <div class=\"myBook-mttdatay\">\r\n                                                  <span class=\"mttdata-sp1y\"><em class=\"mttdata-sp1e3y\">儿童票</em><em class=\"mttdata-sp1e1y\">￥</em><em class=\"mttbookpricey\"></em></span>\r\n                                                  <span class=\"mttdata-sp2y\"><em class=\"mttdata-sp1e4y\">基建/燃油</em><em class=\"mttdata-sp1e2y\">￥</em><em class=\"mttbookprice1y\">0</em></span>\r\n                                                  <span class=\"mttdata-sp3y\"><em class=\"mttdata-sp1e5y\">保险</em><em class=\"mttdata-sp1e2y\">￥</em><em class=\"mttbookprice2y\">30</em><a class=\"safetexthy\" href=\"javascript:;\"><img class=\"safetexty\" src=\"https://cos.uair.cn/mb/img/more.png\" alt=\"\"></a></span>\r\n\r\n                                            </div>\r\n\r\n                                            <div class=\"looktext\">\r\n                                                  <span class=\"looktext-sp1\">查看退改签<img class=\"looktext-im1\" src=\"https://cos.uair.cn/mb/img/top.png\" alt=\"\"></span>\r\n                                                  <ul class=\"looktext1-text\">\r\n                                                     <li class=\"ishidden \">\r\n                                                      <strong class=\"spclore  \">成人退改签:</strong>\r\n\r\n                                                     </li>\r\n                                                     <li>\r\n                                                         <strong>签转规定:</strong>\r\n                                                         <span class=\"looktext1-changetex1\"></span>\r\n                                                     </li>\r\n                                                     <li>\r\n                                                          <strong>改期规定:</strong>\r\n                                                          <span class=\"looktext1-changetex2\"></span>\r\n                                                     </li>\r\n                                                     <li>\r\n                                                          <strong>退票规定:</strong>\r\n                                                          <span class=\"looktext1-changetex3\"></span>\r\n                                                     </li>\r\n                                                      <li class=\" ishidden\">\r\n                                                          <strong class=\"spclore  \">儿童退改签:</strong>\r\n\r\n                                                      </li>\r\n                                                      <li class=\"ishidden \">\r\n                                                          <strong>签转规定:</strong>\r\n                                                          <span class=\"looktext1-changetex1y\"></span>\r\n                                                      </li>\r\n                                                      <li class=\"ishidden \">\r\n                                                          <strong>改期规定:</strong>\r\n                                                          <span class=\"looktext1-changetex2y\"></span>\r\n                                                      </li>\r\n                                                      <li class=\"ishidden \">\r\n                                                          <strong>退票规定:</strong>\r\n                                                          <span class=\"looktext1-changetex3y\"></span>\r\n                                                      </li>\r\n\r\n                                                  </ul>\r\n                                            </div>\r\n\r\n                                  </div>\r\n                         </div>\r\n                         <div class=\"myBook-flightbox2\">\r\n\r\n                                  <div class=\"Order-fl-inf\">\r\n            <p class=\"allmybook-boxtm\">\r\n                <img class=\"flight-logo\" src=\"https://cos.uair.cn/mb/img/flight-logo.png\"><span class=\"allmybook-boxtm1  allmybookf myBook1-startFP\">重庆</span><span class=\"d-wrapl1-right2 order-fl-right\"><strong></strong></span><span class=\"allmybook-boxtm5 allmybookt myBook1-endFP\">北京</span>\r\n                <span class=\"Order-fl-style flightbox2-text\">返程</span>\r\n            </p>\r\n            <div class=\"Order-fl-box\">\r\n                <div class=\"Order-fl-l\"></div>\r\n                <div class=\"Order-fl-c\">\r\n                    <p class=\"Order-fl-from\">\r\n                        <span class=\"Order-fl-from-names myBook1-mttsp11\">江北机场</span>\r\n                        <span class=\"Order-fl-from-ms myBook1-mtfsp1\">12-9</span>\r\n                        <span class=\"Order-fl-from-ts myBook1-mttsp1\">11:40</span>\r\n                    </p>\r\n                    <p class=\"Order-fl-from-info\">\r\n                        <img src=\"\" alt=\"\">\r\n                        <span class=\"myBook1-mtfsp2\">中国国航空</span>\r\n                        <span class=\"myBook1-mtfsp3\">DFASDF123</span>\r\n                        <span class=\"zycp1\"></span>\r\n                    </p>\r\n                    <p class=\"Order-fl-to\">\r\n                        <span class=\"Order-fl-from-namee myBook1-mttsp22\">江北机场</span>\r\n                        <span class=\"Order-fl-from-me myBook1-mtfsp111\">12-09</span>\r\n                        <span class=\"Order-fl-from-te myBook1-mttsp2\">11:40</span>\r\n                    </p>\r\n                </div>\r\n            </div>\r\n            </div>\r\n                                  <div class=\"myBook1-mttext\">\r\n                                             <div class=\"myBook1-mttdata\">\r\n                                                  <span class=\"mttdata1-sp1\"><em class=\"mttdata1-sp1e3\">成人票</em><em class=\"mttdata1-sp1e1\">￥</em><em class=\"mttbookprice4\">760</em></span>\r\n                                                  <span class=\"mttdata1-sp2\"><em class=\"mttdata11-sp1e4\">基建/燃油</em><em class=\"mttdata1-sp1e2\">￥</em><em class=\"mttbookprice14\">50</em></span>\r\n                                                  <span class=\"mttdata1-sp3\"><em class=\"mttdata1-sp1e5\">保险</em><em class=\"mttdata1-sp1e2\">￥</em><em class=\"mttbookprice24\">30</em><a class=\"safetexth1\" href=\"javascript:;\"><img class=\"safetext1\" src=\"https://cos.uair.cn/mb/img/more.png\" alt=\"\"></a></span>\r\n\r\n                                            </div>\r\n                                            <div class=\"looktext1\">\r\n                                                  <span class=\"looktext1-sp1\">查看退改签<img class=\"looktext1-im1\" src=\"https://cos.uair.cn/mb/img/top.png\" alt=\"\"></span>\r\n                                                  <ul class=\"looktext11-text\">\r\n                                                     <li>\r\n                                                         <strong>签转规定:</strong>\r\n                                                         <span class=\"looktext11-changetex1\"></span>\r\n                                                     </li>\r\n                                                     <li>\r\n                                                          <strong>改期规定:</strong>\r\n                                                          <span class=\"looktext11-changetex2\"></span>\r\n                                                     </li>\r\n                                                     <li>\r\n                                                          <strong>退票规定:</strong>\r\n                                                          <span class=\"looktext11-changetex3\"></span>\r\n                                                     </li>\r\n                                                  </ul>\r\n                                            </div>\r\n                                   </div>\r\n                         </div>\r\n\r\n\r\n\t                     <div class=\"myBook-name\">\r\n\t\t                         <div class=\"myBook-namepick\">\r\n\t\t                              <strong class=\"namepick1\">乘机人信息</strong>\r\n\t\t                              <span class=\"namepick2\"><img src=\"https://cos.uair.cn/mb/img/plusp.png\" alt=\"\"></span>\r\n\t\t                         </div>\r\n\t\t                         <ul class=\"myBook-nameul\">\r\n\t\t                         </ul>\r\n\t\t                  </div>\r\n\r\n                <div class=\"goReason clear\">\r\n                    <div class=\"ygLeft\">\r\n                        <div class=\"ygLeft-box\" choiceType=\"1\">\r\n                            <div class=\"ygLeft-btn\"></div>\r\n                            <div>因公出行</div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"ysRight\">\r\n                        <div class=\"ysRight-box\" choiceType=\"0\">\r\n                            <div class=\"ysRight-btn\"></div>\r\n                            <div>因私出行</div>\r\n                        </div>\r\n                    </div>\r\n                    <p class=\"no_trip\">xxx未通过出差审批，不能选择月结，如需月结请分开下单，或者自行支付</p>\r\n                </div>\r\n\t                     <div class=\"myBook-linkman\">\r\n\t\t                         <div class=\"myBook-linkmanpick\">\r\n\t\t                              <strong class=\"linkmanpick1\">联系人信息</strong>\r\n\t\t                              <span class=\"linkmanpick2\"><img src=\"https://cos.uair.cn/mb/img/plusp.png\" alt=\"\"></span>\r\n\t\t                         </div>\r\n\t\t                         <div class=\"linkman-box\">\r\n\t\t                            <p>\r\n\t\t                                <span class=\"linkman1\">联系人</span>\r\n\t\t                                <span class=\"linkman2\"></span>\r\n\t\t                            </p>\r\n\t\t                            <p>\r\n\t\t                                <span class=\"linkman1\">手机</span>\r\n\t\t                                <span class=\"linkman4\"></span>\r\n\t\t                            </p>\r\n\t\t                         </div>\r\n\r\n\t\t                  </div>\r\n\t                     <div class=\"buysafe\">\r\n\t\t                        <span class=\"buysafesp1\">保险</span><span><em class=\"buysafeem1\">￥</em><span class=\"buysafe-price\">30</span><em>×</em><span class=\"buysafe-nums\"></span>份</span>\r\n\t\t                        <a href=\"javascript:;\" class=\"buysafe-btnbox\">\r\n\t\t                              <div class=\"buysafe-btnbox1\"></div>\r\n\t\t                        </a>\r\n                         </div>\r\n                         <div class=\"buysafet\">\r\n                             <span class=\"buysafesp1t\">保险</span><span><em class=\"buysafeem1t\">￥</em><span class=\"buysafe-pricet\">20</span><em>×</em><span class=\"buysafe-numst\">0</span>份</span>\r\n                             <a href=\"javascript:;\" class=\"buysafe-btnboxt\">\r\n                                 <div class=\"buysafe-btnbox1t\"></div>\r\n                             </a>\r\n                         </div>\r\n\r\n\r\n\t                     <div class=\"proof\">\r\n\t\t                           <span class=\"proof1\">报销凭证<span class=\"proof2\"></span></span>\r\n\t\t                           <div class=\"proof-btnbox\">\r\n\t\t                              <div class=\"proof-btnbox1\"></div>\r\n\t\t                           </div>\r\n                         </div>\r\n\t                     <ul class=\"proof-box clear\">\r\n                             <li class=\"proof-box1\" >\r\n                                 <div class=\"y_exp\"  extype=\"1\">\r\n                                         <div class=\"y_exp-btn\"></div>\r\n                                         <div>快递</div>\r\n                                 </div>\r\n                                 <div class=\"n_exp\" extype=\"0\">\r\n                                         <div class=\"n_exp-btn\"></div>\r\n                                         <div>平邮</div>\r\n                                 </div>\r\n                             </li>\r\n\t\t                      <li class=\"proof-box1\">\r\n                                     <span class=\"proof-boxt1\">收件人</span>\r\n                                     <span class=\"proof-boxt2 proof-boxt2n\"></span>\r\n                              </li>\r\n                              <li class=\"proof-box1\">\r\n                                 <span class=\"proof-boxt1\">联系电话</span>\r\n                                 <span class=\"proof-boxt2p proof-boxt2\"></span>\r\n                              </li>\r\n\t\t                      <li class=\"proof-box1\">\r\n                                       <span class=\"proof-boxt1\">所在地区</span>\r\n                                       <span class=\"proof-boxt2c proof-boxt2\"></span>\r\n                              </li>\r\n\t\t                      <li class=\"\">\r\n                                      <span class=\"proof-boxt1\">详细地址</span >\r\n                                      <span class=\"proof-boxt2t proof-boxt2\"></span>\r\n                              </li>\r\n\t                     </ul>\r\n\r\n                         <div class=\"Tripb\">\r\n                            <span class=\"Tripb1\">企业差旅<span class=\"Tripb2\"></span></span>\r\n                            <div class=\"Tripb-btnbox\">\r\n                                <div class=\"Tripb-btnbox1\"></div>\r\n                            </div>\r\n                         </div>\r\n                         <ul class=\"Tripb-box\">\r\n                            <li class=\"Tripb-box1\">\r\n                                <span class=\"Tripb-boxt1\">等级活动</span>\r\n                                <span class=\"Tripb-boxt2 Tripb-boxt2n\"></span>\r\n                            </li>\r\n                            <li class=\"Tripb-box1\">\r\n                                <span class=\"Tripb-boxt1\">事由</span>\r\n                                <span class=\"Tripb-boxt2p Tripb-boxt2\"></span>\r\n                            </li>\r\n                            <li class=\"Tripb-box1\">\r\n                                <span class=\"Tripb-boxt1\">选择原因</span>\r\n                                <span class=\"Tripb-boxt2c Tripb-boxt2\"></span>\r\n                            </li>\r\n                            <li class=\"Tripb-box1\">\r\n                                <span class=\"Tripb-boxt1\">备注</span >\r\n                                <span class=\"Tripb-boxt2t Tripb-boxt2\"></span>\r\n                            </li>\r\n                         </ul>\r\n\r\n            </div>\r\n        </div>\r\n        <div class=\"allprice\">\r\n            <span class=\"allprice1\"><em>应付</em><em class=\"footer-p-icon\">￥</em><span  class=\"allprice11\"></span><span class=\"hongbaotext\">(总11000-100红包)</span></span></span>\r\n            <span class=\"allprice2\">下一步</span>\r\n        </div>\r\n</div>\r\n"

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by way on 17/1/10.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _config = __webpack_require__(1);

	var _config2 = _interopRequireDefault(_config);

	var _api = __webpack_require__(7);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var $ = __webpack_require__(5);
	// myalertp 封装的 alert提示弹层
	var _view = __webpack_require__(35);
	var thelinkt = '';
	var contid = ''; // 修改联系人 对应的id
	var backFlight = false; // 是否是往返航班 false为单程 true为往返
	var havesafe = true;
	var zytypep = ''; // 直营判断  产品页面传过来的
	var theisTripbank = '';
	var isxh = '';

	var _class = function () {
	    function _class(opt) {
	        _classCallCheck(this, _class);

	        this.path = '/flightmb/Order$';
	        this.hash = '/flightmb/Order';
	        this.title = '订单详情';

	        opt = opt || {};
	        this.path = opt.path || this.path;
	        this.hash = opt.hash || this.hash;
	        this.title = opt.title || this.title;
	    }

	    // 输出视图


	    _createClass(_class, [{
	        key: 'view',
	        value: function view(cb) {
	            if (!_view) {
	                // 静态资源浏览器有缓存,增加时标,强制刷新!
	                (0, _api.getView)(_config2.default.view.searchJoin + '?t=' + +new Date(), '', function (rs) {
	                    _view = rs;
	                    cb(null, _view);
	                });
	            } else {
	                cb(null, _view);
	            }
	        }

	        // 在已经加载的视图上操作

	    }, {
	        key: 'bind',
	        value: function bind(dv, params) {
	            console.log(params);

	            isxh = params.isxh;
	            backFlight = params.backFlight; // 是否是 往返航班
	            //console.log( typeof backFlight )
	            havesafe = params.havesafe; // 是否购买保险


	            pushData(params, zytypep); // 页面填充数据


	            //gopaymoney(params.booktoorder.OrderID,1);//查询 授信权
	            // 限及账号
	            //  Oallprice2 支付跳转  console.log(pp.split(',')[0]) 支付 需要第一个订单号

	            $.qu('.Oallprice2').onclick = function () {
	                // 支付
	                //gopaymoney(params.booktoorder.OrderID,1);//查询 授信权
	                //userOnoffpp('b',myBookFn,'myBook','.lodinb',bookdata,'抱歉，登录超时，为确保余票充足，请重新查询该航班~');

	                (0, _api.userOnoffpp)('s', function () {

	                    var oidarr = params.booktoorder.OrderID;
	                    var oid = '';
	                    var oidr = '';
	                    if (oidarr.length > 1) {
	                        //混合订单
	                        oidr = oidarr[0] + ',' + oidarr[1];
	                        oid = oidarr[1];
	                    } else {
	                        oid = oidarr[0];
	                        oidr = oidarr[0];
	                    }

	                    if (isxh == 1) {
	                        gopaymoney(oidr, 1, oid); //查询 授信权
	                    } else {
	                        //goAndPay(oid)
	                        goAndPay(oidr);
	                    }
	                }, 'Order', '.lodin-O', '', '');
	            };

	            //页面加载完成，点击展开收起
	            $.qu(".Orderlooktext").onclick = function () {
	                showList($.qu(".Orderlooktext1-text"), $.qu(".getPeInfo"));
	            };
	            $.qu(".OpriceFlight").onclick = function () {
	                showList($.qu(".Othepriece"), $.qu(".getPeInfo1"));
	            };
	            $.qu(".Orderlooktext1").onclick = function () {
	                //showList($.qu(".Orderlooktext11-text"),$.qu(".getPsInfo"));

	                hideList($.qu(".Orderlooktext11-text"), $.qu(".getPsInfo"));
	            };
	            $.qu(".OpriceFlight1").onclick = function () {
	                showList($.qu(".Othepriece1"), $.qu(".getPriInfo"));
	            };
	            $.qu(".Orderpasenger").onclick = function () {
	                showList($.qu(".Opasengerdata"), $.qu(".getPsInfo1"));
	            };
	            $.qu(".Orderpacantact").onclick = function () {
	                showList($.qu(".Ocantactdata"), $.qu(".getPeInfo2"));
	            };
	            $.qu(".Orderlinkadd").onclick = function () {
	                showList($.qu(".Orderlinkadd-box"), $.qu(".getProInfo3"));
	            };
	            // 页面返回 就是前往 历史订单页面
	            $.qu('.Order-tt1').onclick = function () {
	                //进入页面隐藏展开列表，及图标向下
	                hideList($.qu(".Orderlooktext1-text"), $.qu(".getPeInfo"));
	                hideList($.qu(".Othepriece"), $.qu(".getPeInfo1"));
	                //hideList($.qu(".Orderlooktext11-text"),$.qu(".getPsInfo"));
	                showList($.qu(".Orderlooktext11-text"), $.qu(".getPsInfo"));
	                hideList($.qu(".Othepriece1"), $.qu(".getPriInfo"));
	                hideList($.qu(".Opasengerdata"), $.qu(".getPsInfo1"));
	                hideList($.qu(".Ocantactdata"), $.qu(".getPeInfo2"));
	                hideList($.qu(".Orderlinkadd-box"), $.qu(".getProInfo3"));

	                $.router.go('#!/flightmb/allmybook', { btype: 2 }, true);
	            };

	            //头部主页返回
	            $.qu('.o_home').onclick = function () {
	                return $.router.go('#!/flightmb/join', '', false);
	            };
	            //  动态修改 头部电话
	            pullHeadphoneO();
	        }
	    }]);

	    return _class;
	}();

	//  动态修改 头部电话


	exports.default = _class;
	function pullHeadphoneO() {

	    var telOB = $.qu('.o_phone');
	    var zycpB = $.qu('.Order-cpphone').style.display == 'none' ? 0 : 1; //  1为直营
	    var cpnum = $.qu('.Order-mtfsp3').innerHTML.substring(0, 2);
	    console.log('\u76F4\u8425\u6807\u8BB0=' + zycpB);
	    if (zycpB == 0) {
	        getCZphoneO('XHSV', telOB);
	    } else {
	        switch (cpnum) {
	            case "ZH":
	                getCZphoneO('ZH', telOB);break;
	            case "CZ":
	                getCZphoneO('CZ', telOB);break;
	            case "3U":
	                getCZphoneO('3U', telOB);break;
	        }
	    }
	}
	function getCZphoneO(key, el) {
	    (0, _api.myget)(flightUrl + '/icbc/xhService.ashx', 'act=GETSERVICEPHONE&Source=' + key, true, function (err, res) {
	        if (err) {
	            (0, _api.myalertp)('router0', '出错了，获取客服联系电话失败！');
	        } else {
	            var oData3 = eval('(' + res + ')');
	            var phonts = oData3.Result.Phone;
	            var phontn = oData3.Result.Source;
	            el.href = 'tel:' + phonts;
	        }
	    });
	}

	// 数据填充 函数
	function pushData(params, zytypep) {

	    if (!backFlight) {
	        // 单程

	        $.qu('.Oflght-data1').style.display = 'none';
	        $.qu('.Oflght-data2').style.display = 'none';
	        $.qu('.O-flght2').style.display = 'none';

	        fromflight(params.linkdata);
	    } else {
	        $.qu('.Oflght-data1').style.display = 'inline-block';
	        $.qu('.Oflght-data2').style.display = 'inline-block';
	        $.qu('.O-flght2').style.display = 'block';
	        fromflight(params.linkdata[0]);
	        toflight(params.linkdata[1]);
	    }
	    // 航班信息
	    function fromflight(data) {
	        //去程
	        $.qu('.Order-mtfsp1').innerHTML = getLastFive(data.data1); //时间
	        $.qu('.Order-mtfsp111').innerHTML = isNextDay(data.ftime, data.ttime, data.data1); //时间
	        $.qu('.Order-mtfsp2').innerHTML = data.pc; //航空公司
	        $.qu('.Order-mtfsp3').innerHTML = data.pcnum; //航班数字编码
	        $.qu('.Order-mttsp1').innerHTML = data.ftime; //起飞时间
	        $.qu('.Order-mttsp11').innerHTML = data.fplace; //起飞地点
	        $.qu(".Order-startFP").innerHTML = data.fplace; //起飞地点
	        $.qu('.Order-mttsp2').innerHTML = data.ttime; //到达时间
	        $.qu('.Order-mttsp22').innerHTML = data.tplace; //到达地点
	        $.qu('.Order-endFP').innerHTML = data.tplace; //到达地点
	    }
	    function toflight(data) {
	        //返程
	        $.qu('.Order1-mtfsp1').innerHTML = getLastFive(data.data1); //时间
	        $.qu('.Order1-mtfsp111').innerHTML = isNextDay(data.ftime, data.ttime, data.data1); //时间
	        $.qu('.Order1-mtfsp2').innerHTML = data.pc; //航空公司
	        $.qu('.Order1-mtfsp3').innerHTML = data.pcnum; //航班数字编码
	        $.qu('.Order1-mttsp1').innerHTML = data.ftime; //起飞时间
	        $.qu('.Order1-mttsp11').innerHTML = data.fplace; //起飞地点
	        $.qu('.Order1-startFP').innerHTML = data.fplace; //起飞地点
	        $.qu('.Order1-mttsp2').innerHTML = data.ttime; //到达时间
	        $.qu('.Order1-mttsp22').innerHTML = data.tplace; //到达地点
	        $.qu('.Order1-endFP').innerHTML = data.tplace; //到达地点
	    }

	    // 改退签说明 去 或者 单程儿童成人
	    ////////////////////////////////////////////////////////
	    if (!backFlight) {
	        //单程
	        $.qu('.Orderlooktext1-text').innerHTML = params.safedata; //退改签说明数据
	        $.qu('.Otoprice').innerHTML = params.linkdata.pice1; // 成人价格

	        $.qu('.thefee').innerHTML = params.peoplenum.hongbaoprice; // 返现，折扣？？
	        $.qu('.thefeey').innerHTML = params.peoplenum.hongbaoprice; // 返现，折扣？？
	        var Onums = $.qus('.cpeoplenum2'); // 给成人 加个数
	        for (var i = 0; i < Onums.length; i++) {
	            Onums[i].innerHTML = params.peoplenum.onum;
	        }
	        var Oynums = $.qus('.cpeoplenum2y'); // 给儿童加个数
	        if (params.peoplenum.ynum == 0) {
	            //没有儿童
	            $.qu('.Ocpeopley').style.display = 'none';
	        } else {
	            // 有儿童

	            for (var i = 0; i < Oynums.length; i++) {
	                Oynums[i].innerHTML = params.peoplenum.ynum;
	            }
	            $.qu('.Ocpeopley').style.display = 'block';
	            // $.qu('.Otopricey').innerHTML =params.linkdata.YPrice/2;//儿童价格 (Number(theprice)/20).toFixed(0)*10
	            $.qu('.Otopricey').innerHTML = params.booktoorder.yprice; //儿童价格 (Number(theprice)/20).toFixed(0)*10
	            $.qu('.thefee').innerHTML = params.peoplenum.hongbaoprice; // 返现，折扣？？
	        }
	        if (params.zytype == 1) {
	            // 为直营航班 保险数量 真直营 是没有保险的 差旅判断后
	            if (havesafe) {
	                // 有保险 深圳直营
	                $.qu('.Osafe').innerHTML = params.peoplenum.safeprice; // 保险  所有保险 都是一个价格 儿童/成人Osafey
	                $.qu('.Osafey').innerHTML = params.peoplenum.safeprice; // 保险  所有保险 都是一个价格 儿童/成人Osafey
	            } else {
	                //直营没得保险
	                $.qu('.Osafe').innerHTML = 0;
	                $.qu('.Osafey').innerHTML = 0;
	                $.qu('.oldtwo').innerHTML = 0;
	                $.qu('.youngone').innerHTML = 0;
	                $.qu('.oldone').innerHTML = 0;
	            }
	        } else {
	            //非直营
	            if (havesafe) {
	                // 有保险
	                $.qu('.Osafe').innerHTML = params.peoplenum.safeprice; // 保险  所有保险 都是一个价格 儿童/成人Osafey
	                $.qu('.Osafey').innerHTML = params.peoplenum.safeprice; // 保险  所有保险 都是一个价格 儿童
	            } else {
	                //直营没得保险
	                $.qu('.Osafe').innerHTML = 0;
	                $.qu('.Osafey').innerHTML = 0;
	                $.qu('.oldtwo').innerHTML = 0;
	                $.qu('.youngone').innerHTML = 0;
	                $.qu('.oldone').innerHTML = 0;
	            }
	        }
	    } else {
	        // 往返 或者
	        $.qu('.Ocpeopley').style.display = 'none'; //隐藏儿童  机票详情 块
	        $.qu('.Orderlooktext1-text').innerHTML = params.safedata[0]; //退改签说明数据 去程
	        $.qu('.Orderlooktext11-text').innerHTML = params.safedata[1]; //退改签说明数据 返程

	        $.qu('.Otoprice').innerHTML = params.linkdata[0].pice1; // 成人价格
	        $.qu('.Otoprice12').innerHTML = params.linkdata[1].pice1; // 成人价格


	        $.qu('.thefee').innerHTML = params.peoplenum.hongbaoprice; // 返现，折扣？？
	        $.qu('.thefee1').innerHTML = params.peoplenum.hongbaoprice; // 返现，折扣？？
	        var Onums = $.qus('.cpeoplenum2'); // 给成人 加个数
	        var Onums1 = $.qus('.cpeoplenum21'); // 给成人 加个数

	        for (var i = 0; i < Onums.length; i++) {
	            Onums[i].innerHTML = params.peoplenum.onum;
	        }
	        for (var i = 0; i < Onums1.length; i++) {
	            Onums1[i].innerHTML = params.peoplenum.onum;
	        }

	        if (params.zytype == 1) {
	            // 为直营航班
	            if (havesafe) {
	                // 直营有保险
	                $.qu('.Osafe').innerHTML = params.peoplenum.safeprice; // 保险  所有保险 都是一个价格 成人
	                $.qu('.Osafe1').innerHTML = params.peoplenum.safeprice; // 保险  所有保险 都是一个价格 成人
	            } else {
	                // 直营无保险
	                $.qu('.Osafe').innerHTML = 0;
	                $.qu('.Osafe1').innerHTML = 0;
	                $.qu('.oldtwo').innerHTML = 0; // 保险数量为0
	                // $.qu('.youngone').innerHTML = 0;
	                $.qu('.oldone').innerHTML = 0;
	            }
	        } else {
	            //非直营
	            if (havesafe) {
	                //非直营 有保险
	                $.qu('.Osafe').innerHTML = params.peoplenum.safeprice; // 保险  所有保险 都是一个价格 成人
	                $.qu('.Osafe1').innerHTML = params.peoplenum.safeprice; // 保险  所有保险 都是一个价格 成人
	            } else {
	                //非直营 无保险
	                $.qu('.Osafe').innerHTML = 0; // 保险  所有保险 都是一个价格 成人
	                $.qu('.Osafe1').innerHTML = 0; // 保险  所有保险 都是一个价格 成人
	                $.qu('.oldtwo').innerHTML = 0; // 保险数量为0
	                //$.qu('.youngone').innerHTML = 0;
	                $.qu('.oldone').innerHTML = 0;
	            }
	        }
	    }
	    // 页面填充 客户 电话   ajax  获取
	    if (backFlight) {
	        // 去程
	        if (params.linkdata[0].zytypep == 1 && isxh == 0) {
	            var thepc1 = params.linkdata[0].theCarrier1; //直营的时候 的航空公司号 params.linkdata[0]
	            var oData1 = '';

	            var xhr = '';
	            if (window.XMLHttpRequest) {
	                xhr = new XMLHttpRequest();
	            } else {
	                xhr = new ActiveXObject(' Microsoft . XMLHTTP');
	            }
	            //xhr.open('get','http://106.75.131.58:8015/icbc/xhService.ashx?act=GETSERVICEPHONE&Source='+thepc1,'false');
	            xhr.open('get', flightUrl + '/icbc/xhService.ashx?act=GETSERVICEPHONE&Source=' + thepc1, 'false');

	            xhr.send();
	            xhr.onreadystatechange = function () {
	                if (xhr.readyState == 4) {
	                    // ajax 响内容解析完成，可以在客户端调用了
	                    if (xhr.status == 200) {
	                        //  判断服务器返回的状态 200 表示 正常
	                        oData1 = eval('(' + xhr.responseText + ')');
	                        //console.log(oData1.Result.Phone);
	                        $.qu('.phoneone').setAttribute('href', 'tel:' + oData1.Result.Phone); // 订一趟航班的时候
	                        $.qu('.phoneone').innerHTML = oData1.Result.Phone;
	                    } else {
	                        //alert('出错了，获取直营联系电话失败！');
	                        (0, _api.myalertp)('Order', '出错了，获取直营联系电话失败！');
	                    }
	                }
	            };
	        } else {
	            $.qu('.Order-cpphone').style.display = 'none';
	        }
	        // 返程
	        if (params.linkdata[1].zytypep == 1 && isxh == 0) {
	            var thepc2 = params.linkdata[1].theCarrier1; //直营的时候 的航空公司号 params.linkdata[0]
	            var oData2 = '';
	            var xhr = '';
	            if (window.XMLHttpRequest) {
	                xhr = new XMLHttpRequest();
	            } else {
	                xhr = new ActiveXObject(' Microsoft . XMLHTTP');
	            }
	            //xhr.open('get','http://106.75.131.58:8015/icbc/xhService.ashx?act=GETSERVICEPHONE&Source='+thepc2,'false');
	            xhr.open('get', flightUrl + '/icbc/xhService.ashx?act=GETSERVICEPHONE&Source=' + thepc2, 'false');

	            xhr.send();
	            xhr.onreadystatechange = function () {
	                if (xhr.readyState == 4) {
	                    // ajax 响内容解析完成，可以在客户端调用了
	                    if (xhr.status == 200) {
	                        //  判断服务器返回的状态 200 表示 正常
	                        oData2 = eval('(' + xhr.responseText + ')');
	                        //console.log(oData2.Result.Phone);
	                        $.qu('.phonetwo').setAttribute('href', 'tel:' + oData2.Result.Phone); // 订一趟航班的时候
	                        $.qu('.phonetwo').innerHTML = oData2.Result.Phone;
	                    } else {
	                        //alert('出错了，获取直营联系电话失败！');
	                        (0, _api.myalertp)('Order', '出错了，获取直营联系电话失败！');
	                    }
	                }
	            };
	        } else {
	            $.qu('.Order1-cpphone').style.display = 'none';
	        }
	    } else {
	        // 单词航班
	        if (params.linkdata.zytypep == 1 && isxh == 0) {
	            var thepc = params.linkdata.theCarrier1; //直营的时候 的航空公司号
	            var oData3 = '';
	            var xhr = '';
	            if (window.XMLHttpRequest) {
	                xhr = new XMLHttpRequest();
	            } else {
	                xhr = new ActiveXObject(' Microsoft . XMLHTTP');
	            }
	            //xhr.open('get','http://106.75.131.58:8015/icbc/xhService.ashx?act=GETSERVICEPHONE&Source='+thepc,'false');
	            xhr.open('get', flightUrl + '/icbc/xhService.ashx?act=GETSERVICEPHONE&Source=' + thepc, 'false');
	            xhr.send();
	            xhr.onreadystatechange = function () {
	                if (xhr.readyState == 4) {
	                    // ajax 响内容解析完成，可以在客户端调用了
	                    if (xhr.status == 200) {
	                        //  判断服务器返回的状态 200 表示 正常
	                        oData3 = eval('(' + xhr.responseText + ')');
	                        //console.log(oData3.Result.Phone);
	                        $.qu('.phoneone').setAttribute('href', 'tel:' + oData3.Result.Phone); // 订一趟航班的时候
	                        $.qu('.phoneone').innerHTML = oData3.Result.Phone;
	                    } else {
	                        //alert('出错了，获取直营联系电话失败！');
	                        (0, _api.myalertp)('Order', '出错了，获取直营联系电话失败！');
	                    }
	                }
	            };
	        } else {
	            $.qu('.Order-cpphone').style.display = 'none';
	        }
	    }

	    // $.qu('.Otoprice').innerHTML =params.linkdata.pice1;// 成人价格
	    // $.qu('.Osafe').innerHTML =params.peoplenum.safeprice;// 保险  所有保险 都是一个价格 儿童/成人
	    //$.qu('.thefee').innerHTML =params.peoplenum.hongbaoprice;// 返现，折扣？？
	    //var Onums = $.qus('.cpeoplenum2'); // 给成人 加个数
	    //for(var i=0; i<Onums.length;i++){
	    //    Onums[i].innerHTML =params.peoplenum.onum;
	    //}
	    //var Oynums = $.qus('.cpeoplenum2y'); // 给儿童加个数
	    //if(params.peoplenum.ynum ==0){
	    //    $.qu('.Ocpeopley').style.display= 'none';
	    //}else{
	    //
	    //    for(var i=0; i<Oynums.length;i++){
	    //        Oynums[i].innerHTML =params.peoplenum.ynum;
	    //    }
	    //    $.qu('.Otopricey').innerHTML =params.linkdata.YPrice/2;// 成人价格
	    //    $.qu('.Osafe').innerHTML =params.peoplenum.safeprice;// 保险  所有保险 都是一个价格 儿童/成人thefee
	    //    $.qu('.thefee').innerHTML =params.peoplenum.hongbaoprice;// 返现，折扣？？
	    //}

	    //乘机人信息
	    var alltheData = params.passengerdata;
	    var str = '';
	    for (var i = 0; i < alltheData.length; i++) {
	        var pnum = plusXing(alltheData[i].cardnum, 5, 4);
	        var phonenum = alltheData[i].phonenum != '' ? plusXing(alltheData[i].phonenum, 3, 4) : '';
	        str += '<ul class="Opasengerdata-ul"><li class="Opasengerdata-li1"><sapn class="Opbg">' + (i + 1) + '</sapn> <img src="https://cos.uair.cn/mb/img/q_tip.png" alt=""></li><li><span class="Opasengerdata-sp1">乘客类型:</span><span class="Opasengerdata-ptype">' + alltheData[i].age + '</span></li><li><span class="Opasengerdata-sp1">姓名:</span><span class="Opasengerdata-pname">' + alltheData[i].name + '</span></li><li><span class="Opasengerdata-sp1">证件类型:</span><span class="Opasengerdata-pcard">' + alltheData[i].card + '</span></li><li><span class="Opasengerdata-sp1">证件号码:</span><span class="Opasengerdata-pnum">' + pnum + '</span></li><li><span class="Opasengerdata-sp1">手机号码:</span><span class="Opasengerdata-pphone">' + phonenum + '</span></li><li><span class="Opasengerdata-sp1">保险:</span><span class="Opasengerdata-psafe">' + alltheData[i].safenum + '</span></li> </ul>';
	    }
	    $.qu('.Opasengerdata').innerHTML = str;

	    //联系人信息

	    var cphone = plusXing(params.contactdata.phonenum, 3, 4);

	    $.qu('.Ocantactdata-cname').innerHTML = params.contactdata.name;
	    $.qu('.Ocantactdata-cphone').innerHTML = cphone;

	    // 配送地址
	    var adddata = params.ShipAddr;
	    if (adddata != '') {
	        $.qu('.isShipAddr').style.display = 'block';
	        $.qu('.shipfe1').innerHTML = 10; // 快递费用 10元
	        $.qu('.Orderlinkadd').style.display = 'block';
	        $.qu('.Orderlinkadd-box').style.display = 'block';
	        $.qu('.Orderlinkadd-boxp2').innerHTML = adddata;
	    } else {
	        $.qu('.isShipAddr').style.display = 'none';
	        $.qu('.Orderlinkadd').style.display = 'none';
	        $.qu('.Orderlinkadd-box').style.display = 'none';
	    }

	    //  订单总额 订单号码
	    $.qu('.Oallprice11').innerHTML = params.booktoorder.allprice;
	    var oarrb = params.booktoorder.OrderID;
	    var oarrball = '';
	    if (oarrb.length > 1) {
	        oarrball = oarrb[0] + ',' + oarrb[1];
	    } else {
	        oarrball = oarrb[0];
	    }
	    $.qu('.Order-Ordernum').innerHTML = oarrball;
	}
	//隐藏号码
	function plusXing(str, frontLen, endLen) {
	    var len = str.length - frontLen - endLen;
	    var xing = '';
	    for (var i = 0; i < len; i++) {
	        xing += '*';
	    }
	    return str.substring(0, frontLen) + xing + str.substring(str.length - endLen);
	}
	// 支付跳转函数
	function goAndPay(oid) {
	    //alert("支付");

	    var clientType = getClientType(); // 设备型号
	    //console.log(oid)
	    //console.log(clientType)
	    var href = flightUrl + "/HTML5/PayJump.aspx?OrderID=" + oid + "&ReturnUrl=&ToUrl=GoPay.aspx?&PayVia=5&clientType=" + clientType + "&PayBank=";
	    //load.open("跳转中...");
	    location.href = href;
	}

	//获取客户端设备类型
	function getClientType() {
	    var clientType = "PC";
	    if (/android/i.test(navigator.userAgent)) {
	        clientType = "android";
	    }
	    if (/ipad/i.test(navigator.userAgent)) {
	        clientType = "ipad";
	    }
	    if (/iphone/i.test(navigator.userAgent)) {
	        clientType = "iphone";
	    }
	    return clientType;
	}

	// 授信 支付接口
	function gopaymoney(theOid, type, oid) {
	    //console.log(theOid+'-'+type)
	    if (type == 2) {
	        // $.id('loadorder-type').innerHTML ='授信支付中...';
	        $.qu('.lodin-O').style.display = '-webkit-box';
	    } else {
	        // $.id('loadorder-type').innerHTML ='授信查询中...';
	        $.qu('.lodin-O').style.display = '-webkit-box';
	    }
	    var oData2 = '';
	    var xhr = '';
	    if (window.XMLHttpRequest) {
	        xhr = new XMLHttpRequest();
	    } else {
	        xhr = new ActiveXObject(' Microsoft . XMLHTTP');
	    }
	    //http://106.75.131.58:8015/icbc/xhService.ashx?act=UAIRCDTPAY&OrderID=474664&Type=1
	    //xhr.open('get','http://106.75.131.58:8015/icbc/xhService.ashx?act=GETSERVICEPHONE&Source='+thepc2,'false');
	    xhr.open('get', flightUrl + '/icbc/xhService.ashx?act=UAIRCDTPAY&OrderID=' + theOid + '&Type=' + type, 'true');
	    xhr.send();
	    xhr.onreadystatechange = function () {

	        $.qu('.lodin-O').style.display = 'none';

	        if (xhr.readyState == 4) {
	            // ajax 响内容解析完成，可以在客户端调用了
	            if (xhr.status == 200) {
	                //  判断服务器返回的状态 200 表示 正常

	                if (type == 1) {
	                    oData2 = eval('(' + xhr.responseText + ')');
	                    if (oData2.Status == 1 && oData2.Msg == '成功') {
	                        // 是 授信企业


	                        getbank(oData2.Result, theOid);
	                    } else {
	                        //alert('不是授信客户，将直接转往工商支付！')
	                        var mst = oData2.Msg;
	                        if (mst == '无授信账户!') {
	                            (0, _api.myalertp)('Order', '抱歉，该账户的差旅授信功能已关闭');
	                        } else {
	                            (0, _api.myalertp)('Order', '抱歉，该账户的差旅授信功能发生异常');
	                        }

	                        //goAndPay(oid);// 直接跳转到 工商银行
	                    }
	                } else if (type == 2) {
	                    oData2 = eval('(' + xhr.responseText + ')');

	                    if (oData2.Status == 1 && oData2.Msg == '成功') {
	                        // 支付成功！
	                        //alert('恭喜，支付成功！！')
	                        (0, _api.myalertp)('Order', '恭喜，支付成功！', function () {
	                            $.qu('.creditbox').style.display = 'none';
	                            $.router.go('#!/flightmb/allmybook', { btype: 1 }, true);
	                        });
	                    } else if (oData2.Status == 2) {
	                        //alert('对不起,该单位余额不足,不能支付。')
	                        (0, _api.myalertp)('Order', '对不起,' + oData2.Msg);
	                    }
	                }
	            } else {
	                //alert('支付异常，请重试！');
	                (0, _api.myalertp)('Order', '支付异常，请重试！');
	            }
	        }
	    };
	}
	//  回调 授信 账号 theisTripbank
	function getbank(backms, oid) {
	    theisTripbank = backms;
	    //myalertp('Order','已经进入弹层函数')
	    $.qu('.payownbtnc').innerHTML = backms;
	    $.qu('.creditbox').style.display = '-webkit-box';
	    $.qu('.credit-close').onclick = function () {
	        // 关闭弹层 取消支付
	        $.qu('.creditbox').style.display = 'none';
	        $.qu('.payownbtnc').innerHTML = '代扣账号';
	    };

	    $.qu('.payownbtnc').onclick = function () {

	        gopaymoney(oid, 2, ''); // 授信支付
	    };
	}

	//判断时间是否应该加一天
	function isNextDay(date1, date2, dateM) {
	    var str1 = removeM(date1) - removeM(date2) > 0 ? GetDateStrH(dateM, "24") : dateM;
	    return getLastFive(str1);
	}
	//从日期中去除年份
	function getLastFive(date) {
	    return date.substring(date.length - 5, date.length);
	}
	//去除"\:"
	function removeM(date) {
	    return parseInt(date.replace(/\:/g, ""));
	}

	//天数加一
	function GetDateStrH(data1, h) {

	    var Y1 = data1.substring(0, 4);
	    var m1 = data1.substring(5, 7) - 1;
	    var d1 = data1.substring(8, 10);
	    // var  h1 = data1.substring(11, 13);
	    // var  M1 = data1.substring(14, 17);
	    var dd = new Date(Y1, m1, d1);
	    dd.setHours(dd.getHours() + h); //获取AddDayCount天后的日期
	    var y = dd.getFullYear();
	    var m = dd.getMonth() + 1; //获取当前月份的日期
	    var d = dd.getDate();

	    if ((m + "").length == 1) {
	        m = "0" + m;
	    }
	    if ((d + "").length == 1) {
	        d = "0" + d;
	    }

	    return y + "-" + m + "-" + d;
	}

	function myAlertBox(b, fn, fns) {
	    // 弹出层   b为显示的提示数据   fn 为确定后执行函数  fns 为取消执行函数
	    var a = document.getElementById("book-alert");
	    a.style.display = "-webkit-box";
	    a.getElementsByClassName("book-alert-info")[0].innerHTML = b;
	    var yesBtn = a.getElementsByClassName("book-alert-yes")[0];
	    var noBtn = a.getElementsByClassName("book-alert-no")[0];
	    yesBtn.onclick = function () {
	        a.style.display = "none";
	        if (fn && typeof fn == "function") {
	            fn();
	        }
	    };
	    noBtn.onclick = function () {
	        a.style.display = "none";
	        if (fns && typeof fns == "function") {
	            fns();
	        }
	    };
	}

	//兼容获取样式
	function getMyStyle(obj, attr) {
	    if (obj.currentStyle) {
	        return obj.currentStyle[attr];
	    } else {
	        return window.getComputedStyle(obj, false)[attr];
	    }
	}
	//列表收起操作
	function showList(obj1, obj2) {
	    if (getMyStyle(obj1, "display") == "none" || getMyStyle(obj1, "display") == "") {
	        obj1.style.display = "block";
	        obj2.src = "https://cos.uair.cn/mb/img/top.png";
	    } else {
	        obj1.style.display = "none";
	        obj2.src = "https://cos.uair.cn/mb/img/botom.png";
	    }
	}
	//初始化
	function hideList(obj, obj1) {
	    obj.style.display = "none";
	    obj1.src = "https://cos.uair.cn/mb/img/botom.png";
	}

/***/ },
/* 35 */
/***/ function(module, exports) {

	module.exports = "\r\n<div id=\"Order\">\r\n        <div class=\"lodin-O\">\r\n              <!--<div id=\"caseBlanche\">-->\r\n                <!--<div id=\"rond\">-->\r\n                  <!--<div id=\"test\"></div>-->\r\n                <!--</div>-->\r\n                <!--<div id=\"load\">-->\r\n                  <!--<p>航班查询中...</p>-->\r\n                <!--</div>-->\r\n              <!--</div>-->\r\n             <img class=\"xhlog\" src=\"https://cos.uair.cn/mb/img/xhlog.gif\" />\r\n         </div>\r\n        <div class=\"Order-t\">\r\n              <span class=\"Order-tt1\"><img src=\"https://cos.uair.cn/mb/img/back.bg.png\" alt=\"\"></span>\r\n              <span class=\"Order-tt2\">填写订单</span>\r\n              <a href=\"\" class=\"o_phone\"></a>\r\n              <img src=\"https://cos.uair.cn/mb/img/h_home.png\" class=\"o_home\" alt=\"\"/>\r\n        </div>\r\n        <div class=\"lodin-og\">\r\n            <div id=\"caseBlanche-og\">\r\n                <div id=\"rond-og\">\r\n                    <div id=\"test-og\"></div>\r\n                </div>\r\n                <div id=\"load-og\">\r\n                    <p id=\"loadorder-type\" >授信支付中...</p>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div class=\"Order-m\">\r\n            <div class=\"Order-mwrap\">\r\n                <ul class=\"Order-h1\">\r\n                    <li class=\"Order-h1nomo\"><span class=\"Order-h1st\">订单状态:</span><span class=\"Order-h1state\">未付款</span></li>\r\n                    <li class=\"Order-h1mo\"><span class=\"Order-h1st\">预定结果：</span><span class=\"Order-h1state\">恭喜,预定成功！！</span></li>\r\n                    <li><span>订单已经提交成功！</span><span>订单号：<em class=\"Order-Ordernum\">58040154</em></span></li>\r\n                    <li>请在<strong>20分钟</strong>内完成支付！</li>\r\n\r\n                </ul>\r\n                <div class=\"O-flght1\">\r\n                    <div class=\"Order-fl-inf clear\">\r\n                        <p class=\"allmybook-boxtm\">\r\n                            <img class=\"flight-logo\" src=\"https://cos.uair.cn/mb/img/flight-logo.png\"><span class=\"allmybook-boxtm1  allmybookf Order-startFP\">重庆</span><span class=\"d-wrapl1-right2 order-fl-right\"><strong></strong></span><span class=\"allmybook-boxtm5 allmybookt Order-endFP\">北京</span>\r\n                            <span class=\"Order-fl-style Oflght-data1\">去程</span>\r\n                        </p>\r\n                        <div class=\"Order-fl-box\">\r\n                            <div class=\"Order-fl-l\"></div>\r\n                            <div class=\"Order-fl-c\">\r\n                                <p class=\"Order-fl-from\">\r\n                                    <span class=\"Order-fl-from-names Order-mttsp11\">江北机场</span>\r\n                                    <span class=\"Order-fl-from-ms Order-mtfsp1\">12-9</span>\r\n                                    <span class=\"Order-fl-from-ts Order-mttsp1\">11:40</span>\r\n                                </p>\r\n                                <p class=\"Order-fl-from-info\">\r\n                                    <img src=\"\" alt=\"\">\r\n                                    <span class=\"Order-mtfsp2\">中国国航空</span>\r\n                                    <span class=\"Order-mtfsp3\">DFASDF123</span>\r\n                                    <!-- <span class=\"zycp\"></span> -->\r\n                                </p>\r\n                                <p class=\"Order-fl-to\">\r\n                                    <span class=\"Order-fl-from-namee Order-mttsp22\">江北机场</span>\r\n                                    <span class=\"Order-fl-from-me Order-mtfsp111\">12-09</span>\r\n                                    <span class=\"Order-fl-from-te Order-mttsp2\">11:40</span>\r\n                                </p>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"Order-cpphone\">\r\n                            <span>官方直营</span>\r\n                            <span>如有疑问请致电</span>\r\n                            <a class=\"phoneone\" href=\"tel:95539\">95539</a>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"Orderlooktext\">\r\n                        <p class=\"orderdlooktext-pw\">\r\n                            <span class=\"left-title\">退改签规定</span><img class=\"getPeInfo\" src=\"https://cos.uair.cn/mb/img/top.png\" alt=\"\">\r\n                        </p>\r\n                        <ul class=\"Orderlooktext1-text\">\r\n\r\n                        </ul>\r\n                    </div>\r\n                    <div class=\"OpriceFlight\">\r\n                        <p class=\"orderdlooktext-pw\">\r\n                            <span class=\"left-title\">价格明细</span><img class=\"getPeInfo1\" src=\"https://cos.uair.cn/mb/img/botom.png\" alt=\"\">\r\n                        </p>\r\n                        <div class=\"Othepriece\">\r\n                            <ul class=\"Ocpeople\">\r\n                                <li class=\"Ocpeople-li\">\r\n                                    <span class=\"Ocpeople-sp1\">成人票</span>\r\n\r\n                                    <span class=\"Otoprice1\"><em class=\"Opsmall\">￥</em><em class=\"Otoprice\">910</em></span>\r\n                                    <div class=\"OPnum\"><span>×</span><span class=\"cpeoplenum2\">2</span></div>\r\n                                </li>\r\n                                <li class=\"Ocpeople-li\">\r\n                                    <span class=\"Ocpeople-sp1\">基建/燃油</span>\r\n                                    <span class=\"Ooil1O\"><em class=\"Opsmall\">￥</em><em class=\"OoilO\">50</em></span>\r\n                                    <div class=\"OPnum\"><span>×</span><span class=\"cpeoplenum2\">2</span></div>\r\n                                </li>\r\n                                <li class=\"Ocpeople-li\">\r\n                                    <span class=\"Ocpeople-sp1\">保险</span>\r\n                                    <span class=\"Ooil1O\"><em class=\"Opsmall\">￥</em><em class=\"Osafe\">30</em></span>\r\n                                    <div class=\"OPnum\"><span>×</span><span class=\"cpeoplenum2  oldone\">2</span></div>\r\n                                </li>\r\n                                <li class=\"Ocpeople1-li   isShipAddr\" >\r\n                                    <span class=\"Ocpeople1-sp1\">配送费</span>\r\n                                    <span class=\"Ooil1O1\"><em class=\"Opsmall\">￥</em><em class=\"shipfe1\">15</em></span>\r\n                                    <div class=\"OPnum1\"><span>×</span><span class=\"cpeoplenum21 shipnum \">1</span></div>\r\n                                </li>\r\n                                <li>\r\n                                    <span class=\"Ocpeople-sp1\">返现</span>\r\n                                    <span ><em class=\"zreofee\">￥</em><em class=\"Ozreofee\">-</em><em class=\"thefee\">0</em></span>\r\n                                </li>\r\n\r\n\r\n                            </ul>\r\n                            <ul class=\"Ocpeopley\">\r\n                                <li class=\"Ocpeopley-li\">\r\n                                    <span class=\"Ocpeopley-sp1\">儿童票</span>\r\n\r\n                                    <span class=\"Otoprice1y\"><em class=\"Opsmally\">￥</em><em class=\"Otopricey\">910</em></span>\r\n                                    <div class=\"OPnumy\"><span>×</span><span class=\"cpeoplenum2y\">2</span></div>\r\n                                </li>\r\n                                <li class=\"Ocpeopley-li\">\r\n                                    <span class=\"Ocpeopley-sp1\">基建/燃油</span>\r\n                                    <span class=\"Ooil1Oy\"><em class=\"Opsmally\">￥</em><em class=\"OoilOy\">0</em></span>\r\n                                    <div class=\"OPnumy\"><span>×</span><span class=\"cpeoplenum2y\">2</span></div>\r\n                                </li>\r\n                                <li class=\"Ocpeopley-li\">\r\n                                    <span class=\"Ocpeopley-sp1\">保险</span>\r\n                                    <span class=\"Ooil1Oy\"><em class=\"Opsmally\">￥</em><em class=\"Osafey\">20</em></span>\r\n                                    <div class=\"OPnumy\"><span>×</span><span class=\"cpeoplenum2y youngone\">2</span></div>\r\n                                </li>\r\n                                <li>\r\n                                    <span class=\"Ocpeopley-sp1\">返现</span>\r\n\r\n                                    <span ><em class=\"zreofeey\">￥</em><em class=\"Ozreofeey\">-</em><em class=\"thefeey\">0</em></span>\r\n                                </li>\r\n\r\n\r\n                            </ul>\r\n\r\n                        </div>\r\n                    </div>\r\n                    \r\n                    \r\n                    \r\n                </div>\r\n                <div class=\"O-flght2\">\r\n                    <div class=\"Order-fl-inf\">\r\n                        <p class=\"allmybook-boxtm\">\r\n                            <img class=\"flight-logo\" src=\"https://cos.uair.cn/mb/img/flight-logo.png\"><span class=\"allmybook-boxtm1  allmybookf Order1-startFP\">重庆</span><span class=\"d-wrapl1-right2 order-fl-right\"><strong></strong></span><span class=\"allmybook-boxtm5 allmybookt Order1-endFP\">北京</span>\r\n                            <span class=\"Order-fl-style Oflght-data2\">返程</span>\r\n                        </p>\r\n                        <div class=\"Order-fl-box\">\r\n                            <div class=\"Order-fl-l\"></div>\r\n                            <div class=\"Order-fl-c\">\r\n                                <p class=\"Order-fl-from\">\r\n                                    <span class=\"Order-fl-from-names Order1-mttsp11\">江北机场</span>\r\n                                    <span class=\"Order-fl-from-ms Order1-mtfsp1\">12-9</span>\r\n                                    <span class=\"Order-fl-from-ts Order1-mttsp1\">11:40</span>\r\n                                </p>\r\n                                <p class=\"Order-fl-from-info\">\r\n                                    <img src=\"\" alt=\"\">\r\n                                    <span class=\"Order1-mtfsp2\">中国国航空</span>\r\n                                    <span class=\"Order1-mtfsp3\">DFASDF123</span>\r\n                                    <!-- <span class=\"zycp\"></span> -->\r\n                                </p>\r\n                                <p class=\"Order-fl-to\">\r\n                                    <span class=\"Order-fl-from-namee Order1-mttsp22\">江北机场</span>\r\n                                    <span class=\"Order-fl-from-me Order1-mtfsp111\">12-09</span>\r\n                                    <span class=\"Order-fl-from-te Order1-mttsp2\">11:40</span>\r\n                                </p>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"Order1-cpphone\">\r\n                            <span>官方直营</span>\r\n                            <span>如有疑问请致电</span>\r\n                            <a class=\"phonetwo\" href=\"tel:95539\">95539</a>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"Orderlooktext1\">\r\n                        <p class=\"orderdlooktext-pw\">\r\n                            <span class=\"left-title\">退改签规定</span><img class=\"getPsInfo\" src=\"https://cos.uair.cn/mb/img/top.png\" alt=\"\">\r\n                        </p>\r\n                        <ul class=\"Orderlooktext11-text\">\r\n\r\n                        </ul>\r\n                    </div>\r\n                    <div class=\"OpriceFlight1\">\r\n                        <p class=\"orderdlooktext-pw\"><span class=\"left-title\">价格明细</span><img class=\"getPriInfo\" src=\"https://cos.uair.cn/mb/img/botom.png\" alt=\"\"></p>\r\n                        <div class=\"Othepriece1\">\r\n                            <ul class=\"Ocpeople1\">\r\n                                <li class=\"Ocpeople1-li\">\r\n                                    <span class=\"Ocpeople1-sp1\">成人票</span>\r\n\r\n                                    <span class=\"Otoprice11\"><em class=\"Opsmall1\">￥</em><em class=\"Otoprice12\">910</em></span>\r\n                                    <div class=\"OPnum1\"><span>×</span><span class=\"cpeoplenum21\">2</span></div>\r\n                                </li>\r\n                                <li class=\"Ocpeople1-li\">\r\n                                    <span class=\"Ocpeople1-sp1\">基建/燃油</span>\r\n                                    <span class=\"Ooil1O1\"><em class=\"Opsmall1\">￥</em><em class=\"OoilO1\">50</em></span>\r\n                                    <div class=\"OPnum1\"><span>×</span><span class=\"cpeoplenum21\">2</span></div>\r\n                                </li>\r\n                                <li class=\"Ocpeople1-li\">\r\n                                    <span class=\"Ocpeople1-sp1\">保险</span>\r\n                                    <span class=\"Ooil1O1\"><em class=\"Opsmall\">￥</em><em class=\"Osafe1\">30</em></span>\r\n                                    <div class=\"OPnum1\"><span>×</span><span class=\"cpeoplenum21 oldtwo\">2</span></div>\r\n                                </li>\r\n\r\n                                <li>\r\n                                    <span class=\"Ocpeople1-sp1\">返现</span>\r\n                                    <span ><em class=\"zreofee1\">￥</em><em class=\"Ozreofee1\">-</em><em class=\"thefee1\">0</em></span>\r\n                                </li>\r\n\r\n\r\n                            </ul>\r\n\r\n\r\n                        </div>\r\n                    </div>\r\n                    \r\n                    \r\n                    \r\n                </div>\r\n\r\n                <div class=\"Orderpasenger\">\r\n                    <p class=\"orderdlooktext-pw\">\r\n                        <span class=\"left-title\">乘机人信息</span><img class=\"getPsInfo1\" src=\"https://cos.uair.cn/mb/img/botom.png\" alt=\"\">\r\n                    </p>\r\n                    <div class=\"Opasengerdata\">\r\n\r\n                     </div>\r\n                </div>\r\n                \r\n                <div class=\"Orderpacantact\">\r\n                    <p class=\"orderdlooktext-pw\">\r\n                        <span class=\"left-title\">联系人信息</span><img class=\"getPeInfo2\" src=\"https://cos.uair.cn/mb/img/botom.png\" alt=\"\">\r\n                    </p>\r\n                    <div class=\"Ocantactdata\">\r\n                         <ul class=\"Ocantactdata-ul\">\r\n                               <li><span class=\"Ocantactdata-sp1\">姓名:</span><span class=\"Ocantactdata-cname\">肖浩</span></li>\r\n                                <li><span class=\"Ocantactdata-sp1\">手机号码:</span><span class=\"Ocantactdata-cphone\">185****1234</span></li>\r\n                         </ul>\r\n                    </div>\r\n                </div>\r\n                <div class=\"Orderlinkadd\">\r\n                   <p class=\"orderdlooktext-pw\">\r\n                        <span class=\"left-title\">行程单</span><img class=\"getProInfo3\" src=\"https://cos.uair.cn/mb/img/botom.png\" alt=\"\">\r\n                    </p>\r\n                    <div class=\"Orderlinkadd-box clear\">\r\n                         <p class=\"Orderlinkadd-boxp1\">配送地址:</p><p class=\"Orderlinkadd-boxp2\"></p>\r\n                    </div>\r\n                </div>\r\n                \r\n\r\n\r\n            </div>\r\n\r\n        </div>\r\n        <div class=\"Oallprice\">\r\n           <span class=\"Oallprice1\"><em>订单总额</em><em class=\"footer-p-icon\">￥</em><em></em><span  class=\"Oallprice11\">650</span></span>\r\n\r\n           <span class=\"Oallprice2\">去支付</span>\r\n        </div>\r\n        <div class=\"creditbox\">\r\n            <div class=\"credit-wrap\">\r\n                <div  class='payway'>\r\n                    <span >企业授信</span>\r\n                    <img src=\"https://cos.uair.cn/mb/img/close.bg.png\" alt=\"\" class=\"credit-close\">\r\n                </div>\r\n                <span class=\"payotext\">因公出行，请点击下列代扣账户进行支付！</span>\r\n                <div class=\"payownb-wrap\">\r\n                    <div class=\"payownbtnc\">输入企业账户</div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n\r\n</div>\r\n\r\n"

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by way on 16/9/28.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _config = __webpack_require__(1);

	var _config2 = _interopRequireDefault(_config);

	var _api = __webpack_require__(7);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var $ = __webpack_require__(5);
	// myalertp 封装的 alert提示弹层
	//myalertp('contactpeople','出错了，获取客服联系电话失败！')
	var _view = __webpack_require__(37);

	var bte = '';
	var backFlight = ''; // 存放 往返标记

	var _class = function () {
	    function _class(opt) {
	        _classCallCheck(this, _class);

	        this.path = '/flightmb/contactpeople$';
	        this.hash = '/flightmb/contactpeople';
	        this.title = '常用地址';

	        opt = opt || {};
	        this.path = opt.path || this.path;
	        this.hash = opt.hash || this.hash;
	        this.title = opt.title || this.title;
	    }

	    // 输出视图


	    _createClass(_class, [{
	        key: 'view',
	        value: function view(cb) {
	            if (!_view) {
	                // 静态资源浏览器有缓存,增加时标,强制刷新!
	                (0, _api.getView)(_config2.default.view.searchJoin + '?t=' + +new Date(), '', function (rs) {
	                    _view = rs;
	                    cb(null, _view);
	                });
	            } else {
	                cb(null, _view);
	            }
	        }

	        // 在已经加载的视图上操作

	    }, {
	        key: 'bind',
	        value: function bind(dv, params) {
	            bte = params.btype;
	            //console.log(bte)
	            //if (bte ==40) { // 40 为预定页面进入的
	            //    //  返回上一页 参照的 乘机人
	            //    $.qu('.contactpeople-tt1').onclick = function(){
	            //        $.router.go('#!/flightmb/book',{pbtype:40,data:''},false)
	            //
	            //    }
	            //    //backFlight =params.backFlight; 乘机人 区别儿童 往返
	            //}else{
	            //    $.qu('.contactpeople-tt1').onclick = function(){
	            //        $.router.go('#!/flightmb/allmytickes',{},false)
	            //    }
	            //}


	            $.qu('.contactpeople-tt1').onclick = function () {
	                if (bte == 40) {
	                    // 40 为预定页面进入的
	                    //  返回上一页 参照的 乘机人
	                    $.router.go('#!/flightmb/book', { pbtype: 40, data: '' }, false);
	                } else {
	                    $.router.go('#!/flightmb/allmytickes', {}, false);
	                }
	            };
	            // 模拟数据 填充 页面
	            //mycheckuser('contactpeople',function (){
	            //    console.log('常用地址验证登录通过')
	            //    pullContactData();//  服务器 拉取数据
	            //})


	            //if(GetCookie('xhtime') ==1){
	            //    console.log('常用地址验证登录通过')
	            //    pullContactData();//  服务器 拉取数据
	            //}else{
	            //    mycheckuser('contactpeople',function (){
	            //        SetCookie('xhtime',1,6);//  设置定时器 cookie 6分钟 值为1
	            //        console.log('常用地址验证登录通过')
	            //        pullContactData();//  服务器 拉取数据
	            //    })
	            //}

	            //pullContactData();
	            (0, _api.userOnoffpp)('c', pullContactData, 'contactpeople', '', '', '抱歉，您登录超时，请前往登陆页面~~');
	        }
	    }]);

	    return _class;
	}();

	//  点击相关函数


	exports.default = _class;
	function allclickF() {
	    // 删除联系地址
	    $.each($.qus('.contactpeople-boxbtn1'), function () {
	        this.onclick = function (e) {
	            var that = this;
	            //弹层
	            $.qu('.contactpeople-boxbtn1lay').style.display = '-webkit-box';
	            $.qu('.contactpeople-boxsp1').onclick = function () {
	                //that.parentNode.style.display = 'none';
	                var thecontactid = that.parentNode.getAttribute('valueid');
	                //console.log(thecontactid)
	                var dataass = {
	                    id: thecontactid
	                };
	                //if(GetCookie('xhtime') ==1){
	                //    console.log('删除常用地址失败登录验证通过，无')
	                //    //UairB2C.MGOpt.DelAddress(thecontactid, function (rs) {
	                //    //    if (rs.value) {
	                //    //        rs = eval("(" + rs.value + ")");
	                //    //        //console.log(rs)
	                //    //        if (rs.ret) {
	                //    //            // 模拟数据 填充 页面
	                //    //            pullContactData();
	                //    //
	                //    //        } else {
	                //    //            //alert("删除常用地址失败");
	                //    //            myalertp('contactpeople','删除常用地址失败,请重试')
	                //    //        }
	                //    //    }
	                //    //});
	                //
	                //
	                //
	                //    mypost('/ajaxpro/UairB2C.MGOpt,UairB2C.ashx', dataass, 'DelAddress', (err, res) => {
	                //        console.log(err)
	                //        console.log(res)
	                //        var bdata =eval('(' +res+ ')');
	                //        if (bdata.value) {
	                //            var rs = eval("(" + bdata.value + ")");
	                //            //console.log(rs)
	                //            if (rs.ret) {
	                //                // 模拟数据 填充 页面
	                //                pullContactData();
	                //            } else {
	                //                //alert("删除常用地址失败");
	                //                myalertp('contactpeople','删除常用地址失败,请重试')
	                //            }
	                //        }
	                //    });
	                //
	                //}else{
	                //    mycheckuser('contactpeople',function (){
	                //        SetCookie('xhtime',1,6);//  设置定时器 cookie 6分钟 值为1
	                //        console.log('删除乘机人登录验证通过')
	                //        mypost('/ajaxpro/UairB2C.MGOpt,UairB2C.ashx', dataass, 'DelAddress', (err, res) => {
	                //            console.log(err)
	                //            console.log(res)
	                //            var bdata =eval('(' +res+ ')');
	                //            if (bdata.value) {
	                //                var rs = eval("(" + bdata.value + ")");
	                //                //console.log(rs)
	                //                if (rs.ret) {
	                //                    // 模拟数据 填充 页面
	                //                    pullContactData();
	                //                } else {
	                //                    //alert("删除常用地址失败");
	                //                    myalertp('contactpeople','删除常用地址失败,请重试')
	                //                }
	                //            }
	                //        });
	                //    })
	                //}


	                (0, _api.userOnoffpp)('c', function () {
	                    mypost('/ajaxpro/UairB2C.MGOpt,UairB2C.ashx', dataass, 'DelAddress', function (err, res) {
	                        console.log(err);
	                        console.log(res);
	                        var bdata = eval('(' + res + ')');
	                        if (bdata.value) {
	                            var rs = eval("(" + bdata.value + ")");
	                            //console.log(rs)
	                            if (rs.ret) {
	                                // 模拟数据 填充 页面
	                                pullContactData();
	                            } else {
	                                //alert("删除常用地址失败");
	                                (0, _api.myalertp)('contactpeople', '删除常用地址失败,请重试');
	                            }
	                        }
	                    });
	                }, 'contactpeople', '', '', '报告小主，您登录超时，请前往登陆页面~~');

	                $.qu('.contactpeople-boxbtn1lay').style.display = 'none';
	            };
	            $.qu('.contactpeople-boxsp2').onclick = function () {
	                $.qu('.contactpeople-boxbtn1lay').style.display = 'none';
	            };
	            var e = e || window.e;
	            e.stopPropagation();
	        };
	    });
	    //修改地址
	    $.each($.qus('.contactpeople-boxbtn2'), function () {
	        this.onclick = function (e) {
	            var that = this;
	            var data = JSON.parse(this.parentNode.getAttribute('data'));
	            $.router.go('#!/flightmb/changeadd', { type: 2, linktype: bte, addrdata: data }, true);

	            var e = e || window.e;
	            e.stopPropagation();
	        };
	    });
	    //  增加联系地址
	    $.qu('.addcontactpeople').onclick = function () {
	        $.router.go('#!/flightmb/changeadd', { type: 1, linktype: bte }, true);
	    };
	}

	//选择地址  点击地址
	function theaddredatatobook() {
	    var alladdbox = $.qus('.contactpeople-box');
	    for (var i = 0; i < alladdbox.length; i++) {
	        alladdbox[i].onclick = function () {
	            var cdat = {
	                psid: this.getAttribute('valueid'),
	                data: JSON.parse(this.getAttribute('data'))
	            };
	            if (bte == 40) {
	                $.router.go('#!/flightmb/book', { pbtype: 40, data: cdat }, true);
	            }
	        };
	    }
	}

	//  联系地址 页面数据拉取

	function pullContactData() {
	    //$.qu('.lodin-pa').style.display ='-webkit-box';

	    var oData2 = '';
	    var conData = '';
	    var xhr = '';
	    if (window.XMLHttpRequest) {
	        xhr = new XMLHttpRequest();
	    } else {
	        xhr = new ActiveXObject(' Microsoft . XMLHTTP');
	    }
	    //xhr.open('get','http://106.75.131.58:8015/icbc/xhService.ashx?act=GETADDRESSES','false');
	    xhr.open('get', flightUrl + '/icbc/xhService.ashx?act=GETADDRESSES', 'false');
	    xhr.send();
	    xhr.onreadystatechange = function () {
	        if (xhr.readyState == 4) {
	            // ajax 响内容解析完成，可以在客户端调用了
	            if (xhr.status == 200) {
	                //$.qu('.lodin-pa').style.display ='none';
	                //  判断服务器返回的状态 200 表示 正常
	                var data = xhr.responseText;
	                var data1 = eval('(' + data + ')');
	                //console.log(typeof data1)
	                // console.log(data1)
	                if (data1.Status == 1) {
	                    // 1 表示 有数据
	                    conData = data1.Result.Addresses;

	                    // 页面填充数据
	                    topasengerHtml(conData);
	                    // 点击事件 必须放在 页面填充数据完成 之后
	                    allclickF();
	                    // 点击带数据 返回book页面
	                    theaddredatatobook();
	                } else {
	                    // 2 表示 没有填充数据
	                    $.qu('.contactpeople-wrap').innerHTML = '';
	                    //  增加联系地址
	                    $.qu('.addcontactpeople').onclick = function () {
	                        $.router.go('#!/flightmb/changeadd', { type: 1, linktype: bte }, false);
	                    };
	                }
	            } else {
	                //alert('出错了，Err' +xhr.status);
	                (0, _api.myalertp)('contactpeople', '获取常用地址出错了，Err' + xhr.status);
	            }
	        }
	    };
	}

	// 地址数据整合html
	function topasengerHtml(addressData) {

	    var str1 = '';
	    for (var i = 0; i < addressData.length; i++) {
	        var data = JSON.stringify(addressData[i]);
	        str1 += '<div class="contactpeople-box  clear" valueid="' + addressData[i].ID + '" data=' + data + ' ><ul class="contactpeople-box1"><li class="contactpeople-sp1">姓名</li><li class="contactpeople-sp1">电话</li><li class="contactpeople-sp1">地址</li></ul><ul class="contactpeople-box2 clear"><li class="contactpeople-name">' + addressData[i].Name + '</li><li class="contactpeople-phone">' + addressData[i].Phone + '</li><li class="contactpeople-addre">' + addressData[i].Province + addressData[i].City + addressData[i].Town + addressData[i].Addr + '</li></ul><span class="contactpeople-boxbtn1">删除</span><span class="contactpeople-boxbtn2" >修改</span></div>';
	    }
	    $.qu('.contactpeople-wrap').innerHTML = str1;
	}

/***/ },
/* 37 */
/***/ function(module, exports) {

	module.exports = "\r\n\r\n\r\n\r\n<div id=\"contactpeople\">\r\n\t  <div class=\"contactpeople-t\">\r\n\t  \t  <span class=\"contactpeople-tt1\"><img src=\"https://cos.uair.cn/mb/img/back.bg.png\" alt=\"\"></span>\r\n\t  \t  <span class=\"contactpeople-tt2\">常用地址</span>\r\n\t  </div>\r\n\r\n\t   <div class=\"addcontactpeople\">\r\n            + 新增常用地址\r\n\t   </div>\r\n\t   <div class=\"contactpeople-boxbtn1lay\">\r\n\t   \t   <div class=\"contactpeople-boxbtn1lay-box\">\r\n\t   \t   \t  <p class=\"contactpeople-boxp1\">删除该地址信息？</p>\r\n\t   \t   \t  <span class=\"contactpeople-boxsp1\">确定</span>\r\n\t   \t   \t  <span class=\"contactpeople-boxsp2\">取消</span>\r\n\t   \t   </div>\r\n\t   </div>\r\n\t   <div class=\"contactpeople \">\r\n\t       <div class=\"contactpeople-wrap \">\r\n\r\n\t       </div>\r\n\r\n\t   </div>\r\n\r\n</div>\r\n"

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by way on 16/9/28.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _config = __webpack_require__(1);

	var _config2 = _interopRequireDefault(_config);

	var _api = __webpack_require__(7);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var $ = __webpack_require__(5);
	// myalertp 封装的 alert提示弹层
	//changeadd myalertp('router0','出错了，获取客服联系电话失败！')
	var _view = __webpack_require__(39);

	var mytype = ''; // 判断 是 修改 还是增加
	var mylinktype = ''; // 是 由什么页面进入的 book 或者 tieckts
	var theaddata = ''; // 存放 传过来的 需要修改的 地址信息


	var _class = function () {
	    function _class(opt) {
	        _classCallCheck(this, _class);

	        this.path = '/flightmb/changeadd$';
	        this.hash = '/flightmb/changeadd';
	        this.title = '联系人';

	        opt = opt || {};
	        this.path = opt.path || this.path;
	        this.hash = opt.hash || this.hash;
	        this.title = opt.title || this.title;
	    }

	    // 输出视图


	    _createClass(_class, [{
	        key: 'view',
	        value: function view(cb) {
	            if (!_view) {
	                // 静态资源浏览器有缓存,增加时标,强制刷新!
	                (0, _api.getView)(_config2.default.view.searchJoin + '?t=' + +new Date(), '', function (rs) {
	                    _view = rs;
	                    cb(null, _view);
	                });
	            } else {
	                cb(null, _view);
	            }
	        }

	        // 在已经加载的视图上操作

	    }, {
	        key: 'bind',
	        value: function bind(dv, params) {

	            console.log(params);
	            mytype = params.type; // 判断 是 修改 还是增加
	            mylinktype = params.linktype; // 是 由什么页面进入的 book 或者 tieckts
	            if (mytype == 1) {
	                //  1 为增加  2为修改
	                $.qu('.changeadd-tt2').innerHTML = '新增常用地址';
	                $.id('addr_province').selectedIndex = 1;
	                $.qu('.adrssadrss').value = '';
	                $.qu('.adrssname').value = '';
	                $.qu('.adrssphone').value = '';
	                addAddressData(); // 加载 三级联动

	                //$.qu('.changeadd-sb').onclick = function(){
	                //    if(GetCookie('xhtime') ==1){
	                //        console.log('添加联系人验证登录通过，无')
	                //        totheAdddress(mylinktype,0);// 确认添加联系人
	                //    }else{
	                //        mycheckuser('changeadd',function (){
	                //            SetCookie('xhtime',1,6);//  设置定时器 cookie 6分钟 值为1
	                //            console.log('添加联系人验证登录通过')
	                //            totheAdddress(mylinktype,0);// 确认添加联系人
	                //        })
	                //    }
	                //}
	                $.qu('.changeadd-sb').onclick = function () {
	                    //totheAdddress(mylinktype,0);// 确认添加联系人

	                    (0, _api.userOnoffpp)('c', function () {
	                        totheAdddress(mylinktype, 0); // 确认添加联系人
	                    }, 'changeadd', '', '', '抱歉，您登录超时，请前往登陆页面~~');
	                };
	            } else {
	                //2 为修改 需要带数据过来
	                $.qu('.changeadd-tt2').innerHTML = '修改常用地址';
	                theaddata = params.addrdata;
	                addAddressData(); // 加载 三级联动
	                var province = theaddata.Province;
	                var city = theaddata.City;
	                var town = theaddata.Town;
	                // 根据 带过来的数据 填充页面
	                datatoSelect(province, city, town);
	                $.qu('.adrssadrss').value = theaddata.Addr;
	                $.qu('.adrssname').value = theaddata.Name;
	                $.qu('.adrssphone').value = theaddata.Phone;

	                //$.qu('.changeadd-sb').onclick = function(){
	                //    if(GetCookie('xhtime') ==1){
	                //        console.log('修改联系人验证登录通过，无')
	                //        totheAdddress(mylinktype,theaddata.ID);// 确认修改联系人
	                //    }else{
	                //        mycheckuser('changeadd',function (){
	                //            SetCookie('xhtime',1,6);//  设置定时器 cookie 6分钟 值为1
	                //            console.log('修改联系人验证登录通过')
	                //            totheAdddress(mylinktype,theaddata.ID);// 确认修改联系人
	                //        })
	                //    }
	                //}
	                $.qu('.changeadd-sb').onclick = function () {
	                    //totheAdddress(mylinktype,theaddata.ID);// 确认修改联系人

	                    (0, _api.userOnoffpp)('c', function () {
	                        totheAdddress(mylinktype, theaddata.ID); // 确认修改联系人
	                    }, 'changeadd', '', '', '抱歉，您登录超时，请前往登陆页面~~');
	                };
	            }

	            //  返回上一页 地址
	            $.qu('.changeadd-tt1').onclick = function () {
	                $.router.go('#!/flightmb/contactpeople', { btype: mylinktype }, true);
	            };
	        }
	    }]);

	    return _class;
	}();

	// 提交新增数据


	exports.default = _class;
	function totheAdddress(mylinktype, theid) {

	    var id = theid;
	    var province = theselectData('addr_province');
	    var city = theselectData('addr_city');
	    var town = theselectData('addr_town');
	    var address = $.qu(".adrssadrss").value;
	    var name = $.qu(".adrssname").value;
	    var phone = $.qu(".adrssphone").value;
	    var post = '';

	    if (!Verify.verifyName(name)) {
	        //alert("请填写收件人姓名");
	        (0, _api.myalertp)('changeadd', '请填写收件人姓名');
	        //$("#addr_name").focus();
	        return false;
	    }
	    var reg = /^\d{6}$/;
	    if (!phone) {
	        (0, _api.myalertp)('changeadd', '请填写手机号码');
	        return false;
	    }

	    if (!Verify.verifyMobile(phone)) {
	        //alert("请填写正确手机号码");
	        (0, _api.myalertp)('changeadd', '请填写正确手机号码');
	        //$("#addr_phone").focus();
	        return false;
	    }
	    if (province == "1" || province == 1 || province == undefined || province == null || province == "选择省") {
	        //alert("请选择省份");
	        (0, _api.myalertp)('changeadd', '请选择省份');
	        //$("#addr_province").focus();
	        return false;
	    }
	    if (city == "1" || city == 1 || city == undefined || city == null || city == "选择市") {
	        // alert("请选择城市");
	        (0, _api.myalertp)('changeadd', '请选择城市');
	        //$("#addr_city").focus();
	        return false;
	    }
	    if (!Verify.verifyName(address)) {
	        //alert("请填写街道地址");
	        (0, _api.myalertp)('changeadd', '请填写街道地址');

	        // $("#addr_address").focus();
	        return false;
	    }

	    if (town == "1" || town == '选择区') town = "";

	    var saveaddr = '{"ID":"' + id + '","Name":"' + name + '","Phone":"' + phone + '","Post":"' + post + '","Country":"中国","Province":"' + province + '","City":"' + city + '","Town":"' + town + '","Addr":"' + address + '"}';
	    var aes = new ICBCAes();
	    aes.GetAesStr(saveaddr, function (encryptionSaveaddr, encryptionPwd) {
	        //console.log( typeof encryptionSaveaddr )
	        //console.log( typeof encryptionPwd )
	        //member.SaveAddress(encryptionSaveaddr, encryptionPwd, function (res) {
	        //    if (res.value) {
	        //        var json = JSON.parse(res.value);
	        //        if (json.ret == 1) {
	        //            $.router.go('#!/flightmb/contactpeople',{btype:mylinktype},true);
	        //            //$("#addressBoxCover").show();
	        //            //loadAddressInfo(setActionCallback);
	        //            //$("#addAddressBoxCover").remove();
	        //        } else {
	        //            //alert("操作失败");
	        //            myalertp('changeadd','操作失败')
	        //
	        //        }
	        //    }
	        //});


	        var dataass = {
	            json: encryptionSaveaddr,
	            encryptionAESPwd: encryptionPwd
	        };
	        (0, _api.mypost)('/ajaxpro/UairB2C.MGOpt,UairB2C.ashx', dataass, 'SaveAddress', function (err, res) {
	            console.log(err);
	            console.log(res);
	            var bdata = eval('(' + res + ')');
	            if (bdata.value) {
	                var json = JSON.parse(bdata.value);
	                if (json.ret == 1) {
	                    $.router.go('#!/flightmb/contactpeople', { btype: mylinktype }, true);
	                } else {
	                    //alert("操作失败");
	                    (0, _api.myalertp)('changeadd', '操作失败');
	                }
	            }
	        });
	    });
	}

	//  修改时 根据 城市 填充相应数据
	function datatoSelect(province, city, town) {

	    var Oprovince = $.id('addr_province');
	    var pkey = '';
	    var theops = Oprovince.getElementsByTagName('option');
	    //console.log(theops)
	    for (var i = 0; i < theops.length; i++) {
	        if (province == theops[i].innerHTML) {
	            Oprovince.selectedIndex = theops[i].index;
	            pkey = theops[i].value;
	            break;
	        }
	    }
	    //  给城市选项 填充城市
	    for (var k in AreaData) {
	        var idx = AreaData[k][1];
	        if (idx == pkey) {
	            $.id("addr_city").innerHTML += "<option value=\"" + k + "\">" + AreaData[k][0] + "</option>";
	        }
	    }
	    // 显示城市
	    var Ocity = $.id('addr_city');
	    var ckey = '';
	    var thecops = Ocity.getElementsByTagName('option');
	    //console.log(thecops)
	    for (var i = 0; i < thecops.length; i++) {
	        if (city == thecops[i].innerHTML) {
	            Ocity.selectedIndex = thecops[i].index;
	            ckey = thecops[i].value;
	            break;
	        }
	    }
	    //  给乡镇选项 填充乡镇
	    for (var k in AreaData) {
	        var idx = AreaData[k][1];
	        if (idx == ckey) $.id("addr_town").innerHTML += "<option value=\"" + k + "\">" + AreaData[k][0] + "</option>";
	    }
	    // 显示区
	    if (town) {
	        var Otown = $.id('addr_town');
	        var tkey = '';
	        var thetops = Otown.getElementsByTagName('option');
	        //console.log(thetops)
	        for (var i = 0; i < thetops.length; i++) {
	            if (town == thetops[i].innerHTML) {
	                Otown.selectedIndex = thetops[i].index;
	                tkey = thetops[i].value;
	                break;
	            }
	        }
	    }
	}

	//  获取selec的选中值
	function theselectData(obj) {
	    var index = $.id(obj).selectedIndex;
	    var text1 = $.id(obj).options[index].text;
	    return text1;
	}

	//三级联动数据加载
	function addAddressData() {

	    //加载地区三级联动AreaData
	    var area = [["北京", "110000"], ["上海", "310000"], ["广东省", "440000"]];
	    for (var key in AreaData) {
	        var idx = AreaData[key][1];
	        if (idx == "1" && key != "110000" && key != "310000" && key != "440000") {
	            var _area = ["" + AreaData[key][0] + "", "" + key + ""];
	            area.push(_area);
	        }
	    }
	    //$("#addr_province").html("<option value=\"1\" selected=\"selected\">选择省</option>");
	    $.id('addr_province').innerHTML = "<option value=\"1\" selected=\"selected\">选择省</option>";
	    for (var key in area) {
	        var reg = /\d{1,}/;
	        if (reg.test(key)) $.id("addr_province").innerHTML += "<option value=\"" + area[key][1] + "\">" + area[key][0] + "</option>";
	    }
	    //省级联动市级
	    $.id("addr_city").innerHTML = "<option value=\"1\" selected=\"selected\">选择市</option>";
	    $.id("addr_town").innerHTML = "<option value=\"1\" selected=\"selected\">选择区</option>";
	    $.id("addr_province").onchange = function () {
	        //var key = $(this).val();
	        $.id("addr_city").innerHTML = "<option value=\"1\" selected=\"selected\">选择市</option>";
	        $.id("addr_town").innerHTML = "<option value=\"1\" selected=\"selected\">选择区</option>";
	        var key = this.value;

	        if (key == "1") return false;
	        for (var k in AreaData) {
	            var idx = AreaData[k][1];
	            if (idx == key) $.id("addr_city").innerHTML += "<option value=\"" + k + "\">" + AreaData[k][0] + "</option>";
	        }
	    };
	    //市级联动区级
	    $.id("addr_city").onchange = function () {
	        var key = this.value;
	        $.id("addr_town").innerHTML = "<option value=\"1\" selected=\"selected\">选择区</option>";
	        if (key == "1") return false;
	        for (var k in AreaData) {
	            var idx = AreaData[k][1];
	            if (idx == key) $.id("addr_town").innerHTML += "<option value=\"" + k + "\">" + AreaData[k][0] + "</option>";
	        }
	    };
	}

	if (typeof Verify === "undefined") {
	    var Verify = {};
	}(function (a) {
	    a.toDateString = function (c) {
	        var d = c.getMonth() + 1,
	            b = c.getDate();if (d < 10) {
	            d = "0" + d;
	        }if (b < 10) {
	            b = "0" + b;
	        }return c.getFullYear() + "-" + d + "-" + b;
	    };a.verifyFlightName = function (c) {
	        var d = false;c = c.replace(/(^\s*)|(\s*$)/g, "");var b = /^[A-Za-z\/]+$/;if (b.test(c)) {
	            if (c.indexOf("/") > 0 && c.indexOf("/") < c.length - 1) {
	                d = true;
	            } else {
	                d = false;
	            }
	        } else {
	            b = /^[\u4e00-\u9fa5]+[A-Z,a-z]*[\u4e00-\u9fa5]*$/;if (b.test(c)) {
	                d = true;
	            } else {
	                d = false;
	            }
	        }return d;
	    };a.verifyName = function (b) {
	        var b = b.replace(/(^\s*)|(\s*$)/g, "");return b.length > 0;
	    };a.verifyEmail = function (b) {
	        return (/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(b)
	        );
	    };a.verifyTicketNo = function (c) {
	        var d = false;var b = c.length;if (b === 13) {
	            d = /^\d{13}$/.test(c);
	        }return d;
	    };a.verifyMobile = function (b) {
	        return (/^1\d{10}$/.test(b)
	        );
	    };a.verifyIdCard = function (t) {
	        var s = t.length,
	            b,
	            i,
	            w,
	            m,
	            d;if (s === 15) {
	            b = t.match(/^(?:\d{6})(\d{2})(\d{2})(\d{2})(?:\d{3})$/);if (!b) {
	                return false;
	            }i = parseInt("19" + b[1], 10);w = parseInt(b[2], 10);m = parseInt(b[3], 10);d = t.charAt(s - 1) % 2;
	        } else {
	            if (s === 18) {
	                var u = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
	                    y = "10X98765432";for (var v = 0, c = 0; v < 17; v++) {
	                    c += t.charAt(v) * u[v];
	                }if (y.charAt(c % 11) !== t.charAt(17).toUpperCase()) {
	                    return false;
	                }b = t.match(/^(?:\d{6})(\d{4})(\d{2})(\d{2})(?:\d{3})(?:[0-9]|X)$/i);if (!b) {
	                    return false;
	                }i = parseInt(b[1], 10);w = parseInt(b[2], 10);m = parseInt(b[3], 10);d = t.charAt(s - 2) % 2;
	            }
	        }var x = new Date(i, w - 1, m);if (i !== x.getFullYear() || w !== x.getMonth() + 1 || m !== x.getDate()) {
	            return false;
	        }return true;
	    };a.replaceIdCard = function (b) {
	        var c = a.verifyIdCard(b);if (!c) {
	            return b;
	        }if (b.length === 18) {
	            return b.replace(/^(\d{4})\d{11}(\d{2}[\da-z])$/i, "$1***********$2");
	        } else {
	            if (b.length === 15) {
	                return b.replace(/^(\d{4})\d{8}(\d{3})$/, "$1********$2");
	            }
	        }
	    };a.replaceMobile = function (b) {
	        return b.replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2");
	    };
	})(Verify);

/***/ },
/* 39 */
/***/ function(module, exports) {

	module.exports = "\r\n\r\n\r\n<div id=\"changeadd\">\r\n\t  <div class=\"changeadd-t\">\r\n\t  \t  <span class=\"changeadd-tt1\"><img src=\"https://cos.uair.cn/mb/img/back.bg.png\" alt=\"\"></span>\r\n\t  \t  <span class=\"changeadd-tt2\">新增常用地址</span>\r\n\t  </div>\r\n\t  <ul class=\"changeadd-mian\">\r\n\r\n               <li><select id=\"addr_province\" ></select></li>\r\n               <li><select id=\"addr_city\" name=\"s_city\" ></select></li>\r\n               <li><select id=\"addr_town\" name=\"s_county\"></select></li>\r\n               <li><span>街道地址</span><input type=\"text\" class=\"adrssadrss\" placeholder=\"输入街道地址\"></li>\r\n\t\t\t   <li><span>姓名</span><input type=\"text\" class=\"adrssname\" placeholder=\"输入收货人姓名\"></li>\r\n\t\t\t   <li><span>手机号码</span><input type=\"text\" class=\"adrssphone\"  placeholder=\"输入手机号码\"></li>\r\n\t  </ul>\r\n\r\n\r\n\t  <span class=\"changeadd-sb\">确认</span>\r\n\r\n</div>\r\n"

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by way on 17/2/7.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _config = __webpack_require__(1);

	var _config2 = _interopRequireDefault(_config);

	var _api = __webpack_require__(7);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var $ = __webpack_require__(5);
	// myalertp 封装的 alert提示弹层
	//myalertp('Trip','出错了，获取客服联系电话失败！')
	var _view = __webpack_require__(41);

	var btype = '';
	var readata = '';

	var _class = function () {
	    function _class(opt) {
	        _classCallCheck(this, _class);

	        this.path = '/flightmb/Trip$';
	        this.hash = '/flightmb/Trip';
	        this.title = '订单详情';

	        opt = opt || {};
	        this.path = opt.path || this.path;
	        this.hash = opt.hash || this.hash;
	        this.title = opt.title || this.title;
	    }

	    // 输出视图


	    _createClass(_class, [{
	        key: 'view',
	        value: function view(cb) {
	            if (!_view) {
	                // 静态资源浏览器有缓存,增加时标,强制刷新!
	                (0, _api.getView)(_config2.default.view.searchJoin + '?t=' + +new Date(), '', function (rs) {
	                    _view = rs;
	                    cb(null, _view);
	                });
	            } else {
	                cb(null, _view);
	            }
	        }

	        // 在已经加载的视图上操作

	    }, {
	        key: 'bind',
	        value: function bind(dv, params) {
	            console.log(params);
	            btype = params.btype;
	            // 点击返回
	            $.qu('.Trip-tt1').onclick = function () {
	                $.router.go('#!/flightmb/book', { btype: btype, readata: '' }, false);
	            };
	            //  确认按钮
	            reasondata();
	        }
	    }]);

	    return _class;
	}();
	//  点击 带数据返回 book


	exports.default = _class;
	function reasondata() {
	    $.qu('.Trip-sb').onclick = function () {
	        readata = {
	            TripType: $.id('TripType').value,
	            TripReason: $.id('TripReason').value,
	            PriceReason: $.id('PriceReason').value,
	            TripNote: $.qu('.Trip-main1-in').value
	        };
	        $.router.go('#!/flightmb/book', { btype: btype, readata: readata }, true);
	    };
	}

/***/ },
/* 41 */
/***/ function(module, exports) {

	module.exports = "\r\n\r\n<div id=\"Trip\">\r\n      <div class=\"Trip-t\">\r\n          <span class=\"Trip-tt1\"><img src=\"https://cos.uair.cn/mb/img/back.bg.png\" alt=\"\"></span>\r\n          <span class=\"Trip-tt2\">企业差旅</span>\r\n      </div>\r\n      <ul class=\"Trip-main\">\r\n         <li class=\"Trip-main1\" >\r\n                <span class=\"Trip-main1-te\">等级类型</span>\r\n                <select name=\"\" id=\"TripType\" class=\"Trip-main1-se\">\r\n                      <option value=\"\">请选择</option>\r\n                      <option value=\"党团活动\">党团活动</option>\r\n                      <option value=\"公会活动\">公会活动</option>\r\n                      <option value=\"出差\">出差</option>\r\n                      <option value=\"培训\">培训</option>\r\n                </select>\r\n\r\n         </li>\r\n         <li class=\"Trip-main1\" >\r\n                <span class=\"Trip-main1-te\">事由</span>\r\n                <select name=\"\" id=\"TripReason\" class=\"Trip-main1-se\">\r\n                      <option value=\"\">请选择</option>\r\n                      <option value=\"出国\">出国</option>\r\n                      <option value=\"推广外派现场支持\">推广外派现场支持</option>\r\n                      <option value=\"干部交流\">干部交流</option>\r\n                      <option value=\"岗位体验\">岗位体验</option>\r\n                      <option value=\"授课\">授课</option>\r\n                      <option value=\"会议\">会议</option>\r\n                      <option value=\"其他\">其他</option>\r\n                </select>\r\n\r\n         </li>\r\n         <li class=\"Trip-main1 \" >\r\n                <span class=\"Trip-main1-te\">选择原因</span>\r\n                <select name=\"\" id=\"PriceReason\" class=\"Trip-main1-se\">\r\n                      <option value=\"\">请选择</option>\r\n                      <option value=\"陪同领导或客户\">陪同领导或客户</option>\r\n                      <option value=\"航空公司偏好\">航空公司偏好</option>\r\n                      <option value=\"改签或退票因素\">改签或退票因素</option>\r\n                      <option value=\"起飞和到达时间不合适\">起飞和到达时间不合适</option>\r\n                      <option value=\"得到特别授权\">得到特别授权</option>\r\n                      <option value=\"特殊级别出行不受限制\">特殊级别出行不受限制</option>\r\n                </select>\r\n\r\n         </li>\r\n         <li class=\"Trip-main1 Trip-mainla\" >\r\n                <span class=\"Trip-main1-te\">备注</span>\r\n\r\n                <input type=\"text\" placeholder=\"出差备注\" class=\"Trip-main1-in\">\r\n\r\n         </li>\r\n\r\n      </ul>\r\n      <span class=\"Trip-sb\">确认</span>\r\n\r\n\r\n</div>\r\n"

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	/**
	 * Created by way on 17/2/20.
	 */

	var _config = __webpack_require__(1);

	var _config2 = _interopRequireDefault(_config);

	var _api = __webpack_require__(7);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var $ = __webpack_require__(5);
	// myalertp 封装的 alert提示弹层
	var _view = __webpack_require__(43);
	// var fcity = 'a';
	// var tcity ='';
	// var OT = 1;
	// var theID ='';
	// var theCarrier=''; //获取改签规则的数据


	var _class = function () {
	    function _class(opt) {
	        _classCallCheck(this, _class);

	        this.path = '/flightmb/allmybook$';
	        this.hash = '/flightmb/allmybook';
	        this.title = '我的机票';

	        opt = opt || {};
	        this.path = opt.path || this.path;
	        this.hash = opt.hash || this.hash;
	        this.title = opt.title || this.title;
	    }

	    // 输出视图


	    _createClass(_class, [{
	        key: 'view',
	        value: function view(cb) {
	            if (!_view) {
	                // 静态资源浏览器有缓存,增加时标,强制刷新!
	                (0, _api.getView)(_config2.default.view.searchJoin + '?t=' + +new Date(), '', function (rs) {
	                    _view = rs;
	                    cb(null, _view);
	                });
	            } else {
	                cb(null, _view);
	            }
	        }

	        // 在已经加载的视图上操作

	    }, {
	        key: 'bind',
	        value: function bind(dv, params) {
	            //setTitle(`历史订单`);
	            //setRygTile();

	            var myurl = window.location.href.split('/');
	            var myurlkey = myurl[myurl.length - 1];
	            console.log(myurlkey);

	            //匿名函数
	            function setRygTile() {
	                getHistory();
	                var flag = false;
	                setTimeout(function () {
	                    flag = true;
	                }, 1000);
	                window.addEventListener('popstate', function (e) {
	                    //监听到返回事件
	                    if (flag) {
	                        //自己想要做的事情
	                    }
	                    getHistory();
	                }, false);
	                function getHistory() {
	                    var state = {
	                        title: '',
	                        url: '#' //可写返回事件的跳转路径
	                    };
	                    window.history.pushState(state, 'title', '#');
	                }
	            }

	            (0, _api.userOnoffpp)('s', function () {
	                getorderdata(GetDateStrH(getnowdate(), -720), getnowdate()); //  30天 24小时 后退 多少小时
	            }, 'allmybook', '.lodinab', '', '抱歉，登录超时，将重新登录!');

	            // 页面返回
	            $.qu('.allmybook-tt1').onclick = function () {
	                $.router.go('#!/flightmb/allmytickes', { prot: 1 }, false);
	            };

	            //mycheckuser('allmybook',function (){
	            //    console.log('历史订单验证登录通过')
	            //    getorderdata(GetDateStrH(getnowdate(),-168),getnowdate());
	            //})
	        }
	    }]);

	    return _class;
	}();

	// 获取当前时间


	exports.default = _class;
	function getnowdate() {
	    var myTime = new Date();
	    var iYear = myTime.getFullYear();
	    var iMonth = myTime.getMonth() + 1;
	    var iDate = myTime.getDate();

	    var str = iYear + '-' + toTwo(iMonth) + '-' + toTwo(iDate);
	    return str;
	}

	function toTwo(n) {
	    //  转换为 带0的
	    return n < 10 ? '0' + n : '' + n;
	}
	//  某个时间的 前后几个小时
	// function GetDateStrH(data1,h) {

	//     var  Y1 = data1.substring(0, 4);
	//     var  m1 = data1.substring(5, 7)-1;
	//     var  d1 = data1.substring(8, 10);
	//     // var  h1 = data1.substring(11, 13);
	//     // var  M1 = data1.substring(14, 17);
	//     var  dd = new Date(Y1,m1,d1)
	//     dd.setHours(dd.getHours() + h);//获取AddDayCount天后的日期
	//     var y = dd.getFullYear();
	//     var m = dd.getMonth() + 1;//获取当前月份的日期
	//     var d = dd.getDate();

	//     if ((m + "").length == 1) {
	//         m = "0" + m;
	//     }
	//     if ((d + "").length == 1) {
	//         d = "0" + d;
	//     }

	//     return  y + "-" + m + "-" + d

	// }


	// 获取历史订单

	function getorderdata(date1, date2) {
	    $.qu('.lodinab').style.display = '-webkit-box';
	    //$.id('loadorder-type').innerHTML ='加载数据中...';
	    var xhr = '';
	    if (window.XMLHttpRequest) {
	        xhr = new XMLHttpRequest();
	    } else {
	        xhr = new ActiveXObject(' Microsoft.XMLHTTP');
	    }
	    // xhr.open('get','http://106.75.131.58:8015/icbc/xhService.ashx?act=GETUSEDORDERS&ST='+date1+'&ET='+date2,'false');
	    // //xhr.open('get',flightUrl+'/icbc/xhService.ashx?act=GETDSONEPRICE','false');
	    // xhr.send();

	    xhr.open('post', flightUrl + '/icbc/xhService.ashx', 'false');
	    xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
	    xhr.send('act=GETUSEDORDERS&ST=' + date1 + '&ET=' + date2);
	    xhr.onreadystatechange = function () {
	        if (xhr.readyState == 4) {
	            // ajax 响内容解析完成，可以在客户端调用了
	            if (xhr.status == 200) {
	                $.qu('.lodinab').style.display = 'none';
	                //$.id('loadorder-type').innerHTML ='加载数据中...';
	                //  判断服务器返回的状态 200 表示 正常
	                var data1 = eval('(' + xhr.responseText + ')');
	                console.log(data1);
	                if (data1.Status == 1) {
	                    //  获取数据成功
	                    var mydata = data1.Result.Orders;
	                    toorderhtml(mydata);
	                } else {
	                    //alert('登陆状态超时或获取数据失败，请重试或者登陆！')
	                    (0, _api.myalertp)('allmybook', '登陆状态超时或获取数据失败，请重试或者登陆！');
	                }
	            } else {
	                //alert('出错了，Err' +xhr.status);
	                (0, _api.myalertp)('allmybook', '获取历史订单出错了，Err' + xhr.status);
	            }
	        }
	    };
	}

	// 根据数据  整合到页面
	function toorderhtml(data) {
	    var str = '';
	    for (var i = 0; i < data.length; i++) {
	        if (data[i].IsShow == 1) {

	            var isft = ''; // 判断 往返 儿童 成人
	            var n = data[i].Type; // 判断是否要写 成人儿童 往返
	            var twoordernum = '';
	            var order1 = ''; // 去程 或者 成年订单
	            var order2 = ''; // 返程 或者 儿童订单
	            var OrderID = '';
	            var looktype = 0; // 默认为 一个订单  非混合订单
	            if (n != '0') {
	                //不为0　　则为混合订单
	                if (n == '11' || n == '12') {
	                    isft = '(成人儿童)';
	                } else if (n == '22' || n == '21') {
	                    isft = '(往返)';
	                }
	                twoordernum = 'twoordernum'; // 特殊class
	                data[i].Order1[0].personal = data[i].personal;
	                data[i].Order2[0].personal = data[i].personal;
	                order1 = JSON.stringify(data[i].Order1);
	                order2 = JSON.stringify(data[i].Order2);
	                OrderID = data[i].Order2[0].OrderID + ',' + data[i].Order1[0].OrderID;
	                looktype = 1;
	            } else {
	                //　为０　　则不为混合订单
	                isft = '';
	                twoordernum = '';
	                order1 = '';
	                order2 = '';
	                OrderID = data[i].OrderID;
	                looktype = 0;
	            }

	            if (data[i].OrderStatus == "未付款" || data[i].OrderStatus == "") {
	                // 底部按钮
	                if (n != "0") {
	                    //混合订单
	                    var str1 = '<span class="allmybook-boxtblook boxtblook" looktype ="' + looktype + '" OrderID ="' + data[i].OrderID + '" ordertime ="' + data[i].OrderDate + ' ' + data[i].OrderTime + '" isdft="' + isDirect(data[i].FltNo, data[i].personal, data[i].CabinType) + '" personal="' + data[i].personal + '" >查看</span>' + '<span class="allmybook-boxtblook boxtbpay" OrderID ="' + OrderID + '" looktype ="' + looktype + '"  personal = "' + data[i].personal + '" >支付</span>' + '<span class="allmybook-boxtblook boxtbcansel"  OrderID = "' + OrderID + '" looktype ="' + looktype + '">取消订单</span>';
	                } else {
	                    //单程订单
	                    var str1 = '<span class="allmybook-boxtblook boxtblook" looktype ="' + looktype + '" OrderID ="' + data[i].OrderID + '" ordertime ="' + data[i].OrderDate + ' ' + data[i].OrderTime + '" isdft="' + isDirect(data[i].FltNo, data[i].personal, data[i].CabinType) + '" personal="' + data[i].personal + '" >查看</span>' + '<span class="allmybook-boxtblook boxtbpay" OrderID ="' + data[i].OrderID + '" looktype ="' + looktype + '"   personal = "' + data[i].personal + '">支付</span>' + '<span class="allmybook-boxtblook boxtbcansel"  OrderID = "' + OrderID + '" looktype ="' + looktype + '">取消订单</span>';
	                }
	            } else if (data[i].HasTickets == "1") {
	                //改期or 退票
	                //直营航班没有改期 只有退票
	                var str1 = '<span class="allmybook-boxtblook boxtblook" looktype ="' + looktype + '" OrderID ="' + data[i].OrderID + '" ordertime ="' + data[i].OrderDate + ' ' + data[i].OrderTime + '" isdft="' + isDirect(data[i].FltNo, data[i].personal, data[i].CabinType) + '" personal="' + data[i].personal + '" >查看</span>' + '<span class="allmybook-boxtblook boxtRefunds" OrderID ="' + data[i].OrderID + '" wStatus="1" ordertime ="' + data[i].OrderDate + ' ' + data[i].OrderTime + '" looktype ="' + looktype + '" isdft="' + isDirect(data[i].FltNo, data[i].personal, data[i].CabinType) + '">退票</span>' + '<span class="allmybook-boxtblook  boxtChange" OrderID ="' + data[i].OrderID + '" wStatus="2" ordertime ="' + data[i].OrderDate + ' ' + data[i].OrderTime + '" looktype ="' + looktype + '" isdft="' + isDirect(data[i].FltNo, data[i].personal, data[i].CabinType) + '" twoMa="' + getTwoMa(data[i].FltNo) + '">改期</span>';
	            } else {
	                if (looktype == 1) {
	                    var str1 = '<span class="allmybook-boxtblook boxtblook" OrderID ="' + data[i].OrderID + '" ordertime ="' + data[i].OrderDate + ' ' + data[i].OrderTime + '" looktype ="' + looktype + '" isdft="' + isDirect(data[i].FltNo, data[i].personal, data[i].CabinType) + '" personal="' + data[i].personal + '" >查看</span>';
	                } else {
	                    var str1 = '<span class="allmybook-boxtblook boxtblook" OrderID ="' + data[i].OrderID + '" ordertime ="' + data[i].OrderDate + ' ' + data[i].OrderTime + '" looktype ="' + looktype + '" isdft="' + isDirect(data[i].FltNo, data[i].personal, data[i].CabinType) + '" personal="' + data[i].personal + '" >查看</span>';
	                }
	            }
	            str += '<div class="allmybook-box ' + twoordernum + '"  order1=' + order1 + '  order2=' + order2 + '><p class="allmybook-boxtm"><img class="flight-logo" src="https://cos.uair.cn/mb/img/flight-logo.png"><span class="allmybook-boxtm1  allmybookf">' + data[i].From + '</span><span class="d-wrapl1-right2"><strong></strong></span><span class="allmybook-boxtm5 allmybookt">' + data[i].To + '</span><span class="flight-lines"><em class="allmybook-boxtem2">' + data[i].FltNo + '</em></span><span class="allmybook-boxtsp3 price-right"><em class="price-icon">￥</em><em class="allmybook-boxtem3">' + data[i].Price + '</em></span></p><div class="allmybook-boxt"><span class="allmybook-boxtsp1"><em class="flight-n">订单号:</em><em class="flight-NM">' + data[i].OrderID + '</em><em class="theage">' + isft + '</em></span><span class="allmybook-boxtsp2"><em class="allmybook-boxtem1">' + data[i].OrderStatus + '</em></span></div><div class="allmybook-boxtb"><span class="allmybook-boxtm3"><em class="allmybook-boxtm32">' + getLastFive(data[i].FltDate) + '</em><em class="allmybook-boxtm31">' + data[i].FltTime + '</em></span><span class="line-width">至</span><span class="allmybook-boxtm4"><em class="allmybook-boxtm42">' + isNextDay(data[i].FltTime, data[i].ArrTime, data[i].FltDate) + '</em><em class="allmybook-boxtm41">' + data[i].ArrTime + '</em></span></div><p class="last-btns">' + str1 + '</p></div>';
	        } else {// IsShow ==0

	        }
	    }
	    var str2 = '<div class="allmybook-more">点击查看一个月内的订单！';
	    $.qu('.allmybook-mainwrap').innerHTML = str + str2;
	    // 添加点击事件
	    // theookfn();
	    oneClickFn($.qus(".boxtblook"));
	    //退票点击
	    oneClickFn($.qus(".boxtRefunds"));
	    //改期点击
	    oneClickFn($.qus(".boxtChange"));
	    //
	    // 添加 混合订单 弹层
	    getblendorder();
	    // 取消订单
	    boxtbcansel();
	    // 支付
	    payallmybook();
	}

	function getTwoMa(obj) {
	    return obj.substring(0, 2);
	}
	// 点击 混合订单  往返   成人儿童 显示弹层
	function getblendorder() {
	    var twoordernums = $.qus('.twoordernum');
	    if (twoordernums.length != 0) {
	        for (var i = 0; i < twoordernums.length; i++) {
	            twoordernums[i].onclick = function () {
	                $.qu('.allmybook-boxlayer').style.display = '-webkit-box';
	                var border1 = JSON.parse(this.getAttribute('order1'))[0];
	                var border2 = JSON.parse(this.getAttribute('order2'))[0];
	                //  支付状态 会出现异常  第一个订单 支付状态不会改变
	                if (border2.OrderStatus == "未付款" || border2.OrderStatus == "") {

	                    border2.OrderStatus = border1.OrderStatus;
	                }
	                // 弹层 填入数据
	                $.qu('.allmybook-boxlayerr').innerHTML = tohtml(border2) + tohtml(border1);
	                // 添加点击事件 查看
	                twoClickFn($.qus(".boxtblook"));
	                //改期点击
	                twoClickFn($.qus(".boxtChange"));
	                //退票点击
	                twoClickFn($.qus(".boxtRefunds"));
	                // 取消弹层
	                $.qu('.allmybook-boxlayerr').onclick = function () {
	                    this.innerHTML = '';
	                    $.qu('.allmybook-boxlayer').style.display = 'none';
	                };
	                $.qu('.allmybook-boxlayer').onclick = function () {
	                    $.qu('.allmybook-boxlayerr').innerHTML = '';
	                    $.qu('.allmybook-boxlayer').style.display = 'none';
	                };
	            };
	        }
	    }
	}
	// 混合 弹层 数据 打包
	function tohtml(data) {
	    var str = '';
	    var isft = ''; // 判断 往返 儿童 成人
	    var n = data.Type; // 判断是否要写 成人儿童 往返
	    if (n == '11') {
	        isft = '(儿童)';
	    } else if (n == '22') {
	        isft = '(去程)';
	    } else if (n == '12') {
	        isft = '(成人)';
	    } else if (n == '21') {
	        isft = '(返程)';
	    }
	    var str1 = '';
	    var looktype = 0;
	    if (data.OrderStatus == "未付款" || data.OrderStatus == "") {
	        // 底部按钮
	        str1 = '<span class="allmybook-boxtblook boxtblook boxtblookh" looktype ="' + looktype + '" OrderID ="' + data.OrderID + '" ordertime ="' + data.OrderDate + ' ' + data.OrderTime + '" isdft="' + isDirect(data.FltNo, data.personal, data.CabinType) + '" personal="' + data.personal + '"  >查看</span>';
	    } else if (data.HasTickets == "1") {
	        //直营航班没有改期 只有退票
	        var str1 = '<span class="allmybook-boxtblook boxtblook" OrderID ="' + data.OrderID + '" looktype="' + looktype + '" ordertime ="' + data.OrderDate + ' ' + data.OrderTime + '" isdft="' + isDirect(data.FltNo, data.personal, data.CabinType) + '"  personal="' + data.personal + '" >查看</span>' + '<span class="allmybook-boxtblook boxtRefunds" OrderID ="' + data.OrderID + '" looktype="' + looktype + '" wStatus="1" ordertime ="' + data.OrderDate + ' ' + data.OrderTime + '" isdft="' + isDirect(data.FltNo, data.personal, data.CabinType) + '">退票</span>' + '<span class="allmybook-boxtblook  boxtChange" OrderID ="' + data.OrderID + '" looktype="' + looktype + '"  wStatus="2" ordertime ="' + data.OrderDate + ' ' + data.OrderTime + '" isdft="' + isDirect(data.FltNo, data.personal, data.CabinType) + '" twoMa="' + getTwoMa(data.FltNo) + '">改期</span>';
	    } else {
	        str1 = '<span class="allmybook-boxtblook boxtblook boxtblookh" OrderID ="' + data.OrderID + '" looktype="' + looktype + '" ordertime ="' + data.OrderDate + ' ' + data.OrderTime + '" isdft="' + isDirect(data.FltNo, data.personal, data.CabinType) + '" personal="' + data.personal + '" >查看</span>';
	    }
	    str = '<div class="allmybook-box"><p class="allmybook-boxtm"><img class="flight-logo" src="https://cos.uair.cn/mb/img/flight-logo.png"><span class="allmybook-boxtm1  allmybookf">' + data.From + '</span><span class="d-wrapl1-right2"><strong></strong></span><span class="allmybook-boxtm5 allmybookt">' + data.To + '</span><span class="flight-lines"><em class="allmybook-boxtem2">' + data.FltNo + '</em></span><span class="allmybook-boxtsp3"><em class="price-icon">￥</em><em class="allmybook-boxtem3">' + data.Price + '</em></span></p><div class="allmybook-boxt"><span class="allmybook-boxtsp1"><em class="flight-n">订单号:</em><em class="flight-NM">' + data.OrderID + '</em><em class="theage">' + isft + '</em></span><span class="allmybook-boxtsp2"><em class="allmybook-boxtem1">' + data.OrderStatus + '</em></span></div><div class="allmybook-boxtb"><span class="allmybook-boxtm3"><em class="allmybook-boxtm32">' + getLastFive(data.FltDate) + '</em><em class="allmybook-boxtm31">' + data.FltTime + '</em></span><span class="line-width">至</span><span class="allmybook-boxtm4"><em class="allmybook-boxtm42">' + isNextDay(data.FltTime, data.ArrTime, data.FltDate) + '</em><em class="allmybook-boxtm41">' + data.ArrTime + '</em></span></div><p class="last-btns">' + str1 + '</p></div>';

	    return str;
	}

	// 取消订单
	function boxtbcansel() {
	    var thecansele = $.qus('.boxtbcansel');
	    for (var i = 0; i < thecansele.length; i++) {
	        thecansele[i].onclick = function (e) {
	            // 阻止事件冒泡
	            var theid = this.getAttribute('orderid');
	            canseleajax(theid);
	            var e = e || window.e;
	            e.stopPropagation();
	        };
	    }
	}

	// 取消 ajax
	function canseleajax(theid) {
	    $.qu('.lodinab').style.display = '-webkit-box';
	    //$.id('loadorder-type').innerHTML ='订单取消中...';
	    var oData2 = '';
	    var xhr = '';
	    if (window.XMLHttpRequest) {
	        xhr = new XMLHttpRequest();
	    } else {
	        xhr = new ActiveXObject(' Microsoft.XMLHTTP');
	    }
	    // xhr.open('get','http://106.75.131.58:8015/icbc/xhService.ashx?act=GETUSEDORDERS&ST='+date1+'&ET='+date2,'false');
	    // //xhr.open('get',flightUrl+'/icbc/xhService.ashx?act=GETDSONEPRICE','false');
	    // xhr.send();

	    xhr.open('post', flightUrl + '/icbc/OrderResult.aspx', 'false');
	    xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
	    xhr.send('action=1&OrderID=' + theid);
	    xhr.onreadystatechange = function () {
	        if (xhr.readyState == 4) {
	            // ajax 响内容解析完成，可以在客户端调用了
	            if (xhr.status == 200) {
	                $.qu('.lodinab').style.display = 'none';
	                //$.id('loadorder-type').innerHTML ='加载数据中...';
	                //  判断服务器返回的状态 200 表示 正常
	                var data1 = eval('(' + xhr.responseText + ')');
	                //console.log(data1)
	                if (data1.Status == 1) {
	                    //  取消订单成功
	                    // 重新页面加载数据
	                    getorderdata(GetDateStrH(getnowdate(), -168), getnowdate());
	                } else {
	                    //alert('取消订单失败，请重试或者登陆！')
	                    (0, _api.myalertp)('allmybook', '取消订单失败，请重试或者登陆！');
	                }
	            } else {
	                //alert('出错了，Err' +xhr.status);
	                (0, _api.myalertp)('allmybook', '取消订单出错，Err' + xhr.status);
	            }
	        }
	    };
	}

	// 点击 查看 按钮 事件
	// function theookfnh(){
	//     var allbn = $.qus('.boxtblookh');
	//     for(let i=0; i<allbn.length;i++){
	//              var thetype =allbn[i].getAttribute('looktype');
	//              allbn[i].onclick = function (e){
	//                  if(thetype ==0) { // 直接 跳转到详情页面
	//                      var theorder = allbn[i].getAttribute('orderid');
	//                      $.router.go('#!/flightmb/orderd',{orderid:theorder},true);
	//                      console.log(theorder);
	//                  }
	//                  var e = e || window.e;
	//                  e.stopPropagation();
	//              }
	//     }
	// }
	//退票单程点击

	//退票返程点击
	//改期单程点击
	// function boxtChangeFn() {
	//     var changeBtn = $.qus(".boxtChange");
	//     for(let i = 0; i< changeBtn.length; i++) {
	//         changeBtn[i].onclick = function(e) {
	//             var theorder = this.getAttribute("orderid");
	//             $.router.go('#!/flightmb/orderd',{orderid:theorder},true);
	//             console.log(theorder);
	//             var e = e || window.e;
	//              e.stopPropagation();
	//         }
	//     }
	// }
	//单层点击封装
	function oneClickFn(obj) {
	    var changeBtn = obj;
	    for (var i = 0; i < changeBtn.length; i++) {
	        changeBtn[i].onclick = function () {
	            var thetype = this.getAttribute('looktype');
	            var theorder = this.getAttribute("orderid");
	            var wStatus = this.getAttribute("wStatus");
	            var orderTime = this.getAttribute("ordertime");
	            var isdft = this.getAttribute("isdft");
	            var getTwo = this.getAttribute("twoMa");
	            var personal = this.getAttribute("personal");
	            if (thetype == 0) {
	                if (wStatus == null) {
	                    var nStatus = null;
	                    $.router.go('#!/flightmb/orderd', { orderid: theorder, nStatus: wStatus, OrderTime: orderTime, isDft: isdft, Personal: personal }, true);
	                } else {
	                    if (wStatus == 2 && isdft == 1) {
	                        var arrInfo = getDtel(getTwo);
	                        (0, _api.myalertp)("allmybook", "改期服务请致电" + arrInfo[0] + "客服电话" + arrInfo[1] + ",改期服务敬请期待！");
	                        return false;
	                    }
	                    $.router.go('#!/flightmb/orderd', { orderid: theorder, nStatus: wStatus, OrderTime: orderTime, isDft: isdft, Personal: personal }, true);
	                }
	            }
	            // console.log(theorder);
	            // var e = e || window.e;
	            //  e.stopPropagation();
	        };
	    }
	}

	//直营电话。目前只有 南航CZ,深航ZH,川航3U
	function getDtel(obj) {
	    var arr = [];
	    switch (obj) {
	        case "3U":
	            arr.push("川航");
	            arr.push("95378");
	            break;
	        case "ZH":
	            arr.push("深航");
	            arr.push("400-777-4567");
	            break;
	        case "CZ":
	            arr.push("南航");
	            arr.push("95539");
	            break;
	        default:
	            arr.push("星合联盟");
	            arr.push("4000-662-188");
	    }
	    return arr;
	}
	//返程点击封装
	function twoClickFn(obj) {
	    var changeBtn = obj;
	    for (var i = 0; i < changeBtn.length; i++) {
	        changeBtn[i].onclick = function (e) {
	            var thetype = this.getAttribute("looktype");
	            if (thetype == 0) {
	                var theorder = this.getAttribute("orderid");
	                var wStatus = this.getAttribute("wStatus");
	                var orderTime = this.getAttribute("ordertime");
	                var isdft = this.getAttribute("isdft");
	                var getTwo = this.getAttribute("twoMa");
	                if (wStatus == null) {
	                    var nStatus = null;
	                    $.router.go('#!/flightmb/orderd', { orderid: theorder, nStatus: wStatus, OrderTime: orderTime, isDft: isdft }, true);
	                } else {
	                    if (wStatus == 2 && isdft == 1) {
	                        var arrInfo = getDtel(getTwo);
	                        (0, _api.myalertp)("allmybook", "改期服务请致电" + arrInfo[0] + "客服电话" + arrInfo[1] + ",改期服务敬请期待！");
	                        return false;
	                    }
	                    $.router.go('#!/flightmb/orderd', { orderid: theorder, nStatus: wStatus, OrderTime: orderTime, isDft: isdft }, true);
	                }
	                //console.log(theorder);
	            }
	            // var e = e || window.e;
	            // e.stopPropagation();
	        };
	    }
	}

	// //改期混合弹层点击
	// function boxtChangelayerFn() {
	//     var changeBtn = $.qus(".boxtChange");
	//     for(let i = 0; i< changeBtn.length; i++) {
	//         var thetype = changeBtn[i].getAttribute("looktype");
	//         changeBtn[i].onclick = function(e) {
	//             if(thetype == 0) {
	//                 var theorder = this.getAttribute("orderid");
	//                 $.router.go('#!/flightmb/orderd',{orderid:theorder},true);
	//                 console.log(theorder);
	//             }
	//             var e = e || window.e;
	//             e.stopPropagation();
	//         }
	//     }
	// }

	// 点击 查看 按钮 事件 列表页面
	// function theookfn(){
	//     var allbn = $.qus('.boxtblook');
	//     for(let i=0; i<allbn.length;i++){
	//         allbn[i].onclick = function (e){
	//             var theorder = allbn[i].getAttribute('orderid');
	//             $.router.go('#!/flightmb/orderd',{orderid:theorder},true);
	//             console.log(theorder)
	//             var e = e || window.e;
	//             e.stopPropagation();
	//         }
	//     }
	// }

	// 支付订单
	function payallmybook() {
	    var thecansele = $.qus('.boxtbpay');
	    for (var i = 0; i < thecansele.length; i++) {
	        thecansele[i].onclick = function (e) {
	            // 阻止事件冒泡
	            var theid = this.getAttribute('orderid');
	            var personal = this.getAttribute('personal');
	            if (personal == 2) {
	                // 授信且选择了公 直接弹出层 选择支付
	                gopaymoneya(theid, 1); // 支付
	            } else {
	                // goAndPaya(theid.split(',')[0]);// 不是因公就直接 走工商银行 只传一个订单号
	                goAndPaya(theid); // 不是因公就直接 走工商银行   传2个订单号
	            }
	            //canseleajax(theid);
	            //gopaymoneya(theid,1);// 支付
	            var e = e || window.e;
	            e.stopPropagation();
	        };
	    }
	}

	// 授信 支付接口
	function gopaymoneya(theOid, type) {
	    //console.log(theOid+'-'+type)
	    //if( type == 2){
	    //    $.id('loadorder-type').innerHTML ='授信支付中...';
	    //    $.qu('.lodin-ab').style.display ='-webkit-box';
	    //
	    //}else{
	    //    $.id('loadorder-type').innerHTML ='授信查询中...';
	    //    $.qu('.lodin-ab').style.display ='-webkit-box';
	    //
	    //}
	    $.qu('.lodinab').style.display = '-webkit-box';
	    var oData2 = '';
	    var xhr = '';
	    if (window.XMLHttpRequest) {
	        xhr = new XMLHttpRequest();
	    } else {
	        xhr = new ActiveXObject(' Microsoft . XMLHTTP');
	    }
	    //http://106.75.131.58:8015/icbc/xhService.ashx?act=UAIRCDTPAY&OrderID=474664&Type=1
	    //xhr.open('get','http://106.75.131.58:8015/icbc/xhService.ashx?act=GETSERVICEPHONE&Source='+thepc2,'false');
	    xhr.open('get', flightUrl + '/icbc/xhService.ashx?act=UAIRCDTPAY&OrderID=' + theOid + '&Type=' + type, 'true');
	    xhr.send();
	    xhr.onreadystatechange = function () {

	        $.qu('.lodinab').style.display = 'none';
	        //$.id('loadorder-type').innerHTML ='加载数据中...';

	        if (xhr.readyState == 4) {
	            // ajax 响内容解析完成，可以在客户端调用了
	            if (xhr.status == 200) {
	                //  判断服务器返回的状态 200 表示 正常
	                if (type == 1) {
	                    //授信权限 查询
	                    oData2 = eval('(' + xhr.responseText + ')');
	                    console.log(oData2);
	                    var oid = theOid.split(',')[0];
	                    if (oData2.Status == 1 && oData2.Msg == '成功') {
	                        // 是 授信企业
	                        getbanka(oData2.Result, oid, theOid);
	                    } else {
	                        var mst = oData2.Msg;
	                        if (mst = '无授信账户!') {
	                            (0, _api.myalertp)('allmybook', '抱歉，该账户的差旅授信功能已关闭');
	                        } else {
	                            (0, _api.myalertp)('allmybook', '抱歉，该账户的差旅授信功能发生异常');
	                        }
	                    }
	                } else if (type == 2) {
	                    //授信支付
	                    oData2 = eval('(' + xhr.responseText + ')');
	                    //console.log(oData2);
	                    if (oData2.Status == 1 && oData2.Msg == '成功') {
	                        // 支付成功！
	                        //alert('恭喜，支付成功！！')
	                        (0, _api.myalertp)('allmybook', '恭喜，支付成功！！');
	                        $.qu('.creditboxa').style.display = 'none';
	                        getorderdata(GetDateStrH(getnowdate(), -720), getnowdate());
	                    } else if (oData2.Status == 2) {
	                        //alert('对不起,该单位余额不足,不能支付。')
	                        (0, _api.myalertp)('allmybook', '对不起,' + oData2.Msg);
	                        //goAndPay(oid);// 直接跳转到 工商银行
	                    }
	                }
	            } else {
	                //alert('支付异常，请重试！');
	                (0, _api.myalertp)('allmybook', '支付异常，请重试！');
	            }
	        }
	    };
	}
	//  回调 授信 账号 theisTripbank
	function getbanka(backms, oid, theOid) {
	    //theisTripbank =backms;
	    $.qu('.creditboxa').style.display = '-webkit-box';
	    $.qu('.payownbtnca').innerHTML = backms;

	    $.qu('.credit-closea').onclick = function () {
	        // 关闭弹层 取消支付
	        $.qu('.creditboxa').style.display = 'none';
	        $.qu('.payownbtnca').innerHTML = '代扣账号';
	    };

	    $.qu('.payownbtnca').onclick = function () {
	        gopaymoneya(theOid, 2); // 授信支付
	    };
	}
	// 支付跳转函数
	function goAndPaya(oid) {
	    //alert("支付");

	    var clientType = getClientType(); // 设备型号
	    //console.log(oid)
	    //console.log(clientType)
	    var href = flightUrl + "/HTML5/PayJump.aspx?OrderID=" + oid + "&ReturnUrl=&ToUrl=GoPay.aspx?&PayVia=5&clientType=" + clientType + "&PayBank=";
	    //load.open("跳转中...");
	    location.href = href;
	}

	//获取客户端设备类型
	function getClientType() {
	    var clientType = "PC";
	    if (/android/i.test(navigator.userAgent)) {
	        clientType = "android";
	    }
	    if (/ipad/i.test(navigator.userAgent)) {
	        clientType = "ipad";
	    }
	    if (/iphone/i.test(navigator.userAgent)) {
	        clientType = "iphone";
	    }
	    return clientType;
	}

	//判断时间是否应该加一天
	function isNextDay(date1, date2, dateM) {
	    var str1 = removeM(date1) - removeM(date2) > 0 ? GetDateStrH(dateM, "24") : dateM;
	    return getLastFive(str1);
	}
	//日期中去除年份
	function getLastFive(date) {
	    return date.substring(date.length - 5, date.length);
	}
	//去除"\:"
	function removeM(date) {
	    return parseInt(date.replace(/\:/g, ""));
	}
	//天数加一
	function GetDateStrH(data1, h) {

	    var Y1 = data1.substring(0, 4);
	    var m1 = data1.substring(5, 7) - 1;
	    var d1 = data1.substring(8, 10);
	    // var  h1 = data1.substring(11, 13);
	    // var  M1 = data1.substring(14, 17);
	    var dd = new Date(Y1, m1, d1);
	    dd.setHours(dd.getHours() + h); //获取AddDayCount天后的日期
	    var y = dd.getFullYear();
	    var m = dd.getMonth() + 1; //获取当前月份的日期
	    var d = dd.getDate();

	    if ((m + "").length == 1) {
	        m = "0" + m;
	    }
	    if ((d + "").length == 1) {
	        d = "0" + d;
	    }

	    return y + "-" + m + "-" + d;
	}

	//检查是否是直营航班 切排除差旅用户 CA ZH
	function isDirect(str, per, type) {
	    //CZ南航 ZH深航
	    var arr = ["CZ", "ZH", "3U"];
	    if (type == 6) {
	        for (var i = 0, len = arr.length; i < len; i++) {
	            if (str.indexOf(arr[i]) != -1 && per != 2) {
	                return 1;
	            };
	        }
	    } else {
	        return 0;
	    }
	}

/***/ },
/* 43 */
/***/ function(module, exports) {

	module.exports = "\r\n<div id=\"allmybook\">\r\n\t  <div class=\"allmybook-t\">\r\n\t      <span class=\"allmybook-tt1\"><img src=\"https://cos.uair.cn/mb/img/back.bg.png\" alt=\"\"></span>\r\n\t  \t  <span class=\"allmybook-tt2\">我的订单</span>\r\n\t  </div>\r\n\t <!--<div class=\"lodin-ab\">-->\r\n\t\t<!--<div id=\"caseBlanche-ab\">-->\r\n\t\t\t<!--<div id=\"rond-ab\">-->\r\n\t\t\t\t<!--<div id=\"test-ab\"></div>-->\r\n\t\t\t<!--</div>-->\r\n\t\t\t<!--<div id=\"load-ab\">-->\r\n\t\t\t\t<!--<p id=\"loadorder-type\" >订单取消中...</p>-->\r\n\t\t\t<!--</div>-->\r\n\t\t<!--</div>-->\r\n\t <!--</div>-->\r\n\t<div class=\"lodinab\">\r\n\t\t<img class=\"xhlog\" src=\"https://cos.uair.cn/mb/img/xhlog.gif\" />\r\n\t</div>\r\n\t  <div class=\"allmybook-main\">\r\n\t  \t   <div class=\"allmybook-mainwrap\">\r\n\t  \t   </div>\r\n\t  </div>\r\n\t  <div class=\"allmybook-boxlayer\">\r\n\t\t  <div class=\"allmybook-boxlayerr\"></div>\r\n\r\n\t  </div>\r\n\t\t<div class=\"creditboxa\">\r\n\t\t\t<div class=\"credit-wrapa\">\r\n\t\t\t\t<div  class='paywaya'>\r\n\t\t\t\t\t<span >请选择支付方式</span>\r\n\t\t\t\t\t<img src=\"https://cos.uair.cn/mb/img/close.bg.png\" alt=\"\" class=\"credit-closea\">\r\n\t\t\t\t</div>\r\n\r\n\t\t\t\t<span class=\"payotexta\">企业客户，请点击下列代扣账户进行支付！</span>\r\n\t\t\t\t<div class=\"payownb-wrapa\">\r\n\t\t\t\t\t<div class=\"payownbtnca\">使用网上银行支付</div>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\r\n\r\n</div>\r\n"

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by way on 16/9/28.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _config = __webpack_require__(1);

	var _config2 = _interopRequireDefault(_config);

	var _api = __webpack_require__(7);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var $ = __webpack_require__(5);
	var kajax = __webpack_require__(8);
	// myalertp 封装的 alert提示弹层
	//myalertp('orderd','出错了，获取客服联系电话失败！')
	var _view = __webpack_require__(45);
	var fcity = 'a';
	var tcity = '';
	var OT = 1;

	var theuser = 1;
	var timer = '';

	var _class = function () {
	    function _class(opt) {
	        _classCallCheck(this, _class);

	        this.path = '/flightmb/orderd$';
	        this.hash = '/flightmb/orderd';
	        this.title = '订单详情';

	        opt = opt || {};
	        this.path = opt.path || this.path;
	        this.hash = opt.hash || this.hash;
	        this.title = opt.title || this.title;
	    }

	    // 杈撳嚭瑙嗗浘


	    _createClass(_class, [{
	        key: 'view',
	        value: function view(cb) {
	            if (!_view) {
	                // 闈欐�佽祫婧愭祻瑙堝櫒鏈夌紦瀛�,澧炲姞鏃舵爣,寮哄埗鍒锋柊!
	                (0, _api.getView)(_config2.default.view.flightmbJoin + '?t=' + +new Date(), '', function (rs) {
	                    _view = rs;
	                    cb(null, _view);
	                });
	            } else {
	                cb(null, _view);
	            }
	        }

	        // 鍦ㄥ凡缁忓姞杞界殑瑙嗗浘涓婃搷浣�

	    }, {
	        key: 'bind',
	        value: function bind(dv, params) {
	            //var thecpn = params.
	            console.log(params.OrderTime);
	            console.log(params);
	            lookorderdetail(params);

	            // 默认展开详情 每次进入页面都是默认展开
	            orderdInitfn();

	            //页面加载完成，点击展开收起
	            $.qu(".orderdlooktext").onclick = function () {
	                showList($.qu(".orderdlooktext1-text"), $.qu(".getPeInfo"));
	            };
	            $.qu(".OpriceFlight-d").onclick = function () {
	                showList($.qu(".Othepriece-d"), $.qu(".getPriInfo"));
	            };
	            $.qu(".orderdpasenger").onclick = function () {
	                showList($.qu(".Opasengerdata-d"), $.qu(".getPsInfo"));
	            };
	            $.qu(".orderdpacantact").onclick = function () {
	                showList($.qu(".Ocantactdata-d"), $.qu(".getlinkInfo"));
	            };
	            $.qu(".Orderdlinkadd").onclick = function () {
	                showList($.qu(".Orderdlinkadd-box"), $.qu(".getProInfo"));
	            };
	            $.qu(".contact_sv").onclick = function () {
	                showList($.qu(".orderd_nop"), $.qu(".contact_im"));
	            };

	            $.qu('.orderd-tt1').onclick = function () {
	                //进入页面隐藏展开列表，及图标向下
	                // hideList($.qu(".orderdlooktext1-text"), $.qu(".getPeInfo"));
	                hideList($.qu(".Othepriece-d"), $.qu(".getPriInfo"));
	                hideList($.qu(".Opasengerdata-d"), $.qu(".getPsInfo"));
	                hideList($.qu(".Ocantactdata-d"), $.qu(".getlinkInfo"));
	                hideList($.qu(".Orderdlinkadd-box"), $.qu(".getProInfo"));
	                hideList($.qu(".orderd_nop"), $.qu(".contact_im"));

	                // 返回 订单列表
	                $.router.go('#!/flightmb/allmybook', {}, true);
	            };
	        }
	    }]);

	    return _class;
	}();

	//  页面初始话 退改签 默认展开


	exports.default = _class;
	function orderdInitfn() {
	    $.qu(".orderdlooktext1-text").style.display = 'block';
	    $.qu(".getPeInfo").src = 'https://cos.uair.cn/mb/img/top.png';
	}

	// 改期or退票
	function nStatusFn(params, data, fdata) {
	    //获取数据
	    $.qu(".gaiqiReasonInfo").value = ""; //初始话

	    if (params.nStatus == 1) {
	        //退票1
	        pushInfo(params, data, fdata);
	        $.qu(".gaiqiInfo").style.display = "block";
	        $.qu(".gaiqiBtn").style.display = "block";
	        $.qu(".gaiqiBtn").innerHTML = "我要退票";
	        $.qu(".orderd-tt2").innerHTML = "退票申请";
	        $.qu(".gaiqiRefund").style.display = "block";
	        $.qu(".gaiqititle").innerHTML = "退票原因";
	        $.qu(".gaiqiPeopel").style.display = "block";
	        $.qu(".gaiqiReason").style.display = "block";
	        $.qu(".gaiqidirtip").style.display = "none";
	    } else if (params.nStatus == 2) {
	        //改期2
	        // $.qu(".gaiqiPeopel").style.display = "block";
	        pushInfo(params, data, fdata);
	        if (params.isDft == 1) {
	            $.qu(".gaiqiInfo").style.display = "block";
	            $.qu(".gaiqiBtn").style.display = "none";
	            $.qu(".orderd-tt2").innerHTML = "改期申请";
	            $.qu(".gaiqiRefund").style.display = "none";
	            $.qu(".gaiqiReason").style.display = "none";
	            $.qu(".gaiqiPeopel").style.display = "none";
	            $.qu(".gaiqidirtip").style.display = "block";
	        } else {
	            $.qu(".gaiqiInfo").style.display = "block";
	            $.qu(".gaiqiBtn").style.display = "block";
	            $.qu(".gaiqiBtn").innerHTML = "我要改期";
	            $.qu(".orderd-tt2").innerHTML = "改期申请";
	            $.qu(".gaiqiRefund").style.display = "none";
	            $.qu(".gaiqiPeopel").style.display = "block";
	            $.qu(".gaiqititle").innerHTML = "改期原因";
	            $.qu(".gaiqiReason").style.display = "block";
	            $.qu(".gaiqidirtip").style.display = "none";
	        }
	    } else {
	        $.qu(".gaiqiInfo").style.display = "none";
	        $.qu(".gaiqiBtn").style.display = "none";
	        $.qu(".gaiqiRefund").style.display = "none";
	        $.qu(".orderd-tt2").innerHTML = "订单详情";
	    }
	    changeImg();
	    refundImg();
	}
	//选择改期or退票的乘机人按钮切换
	function changeImg() {
	    var oLiBox = $.qus(".gaiqiBox");
	    for (var i = 0; i < oLiBox.length; i++) {
	        //设置为默认图片
	        //添加点击切换
	        oLiBox[i].onclick = function () {
	            var nimg = this.getElementsByTagName("img")[0];
	            var urlImg = "https://cos.uair.cn/mb/img/";
	            var tickno = this.getAttribute("tickno");
	            if (nimg.src == urlImg + "choice-black.png") {
	                nimg.src = urlImg + "choice-blue.png";
	                this.setAttribute("choiced", tickno);
	                $.addClass(this, "ghasChoiced");
	            } else {
	                nimg.src = urlImg + "choice-black.png";
	                this.setAttribute("choiced", "");
	                $.removeClass(this, "ghasChoiced");
	            }
	        };
	    }
	}

	//退票选择按钮切换
	function refundImg() {
	    var leftBtn = $.qu(".refund-self");
	    var rightBtn = $.qu(".refund-other");
	    var rUrl = "https://cos.uair.cn/mb/img/";
	    var leftImg = leftBtn.getElementsByTagName("img")[0];
	    var rightImg = rightBtn.getElementsByTagName("img")[0];
	    //初始化
	    leftBtn.setAttribute("choiced", "2");
	    rightBtn.setAttribute("choiced", "1");
	    leftImg.src = rUrl + "choice-blue.png";
	    rightImg.src = rUrl + "choice-black.png";
	    //点击
	    leftBtn.onclick = function () {
	        this.setAttribute("choiced", "2");
	        leftImg.src = rUrl + "choice-blue.png";
	        rightBtn.setAttribute("choiced", "1");
	        rightImg.src = rUrl + "choice-black.png";
	    };
	    rightBtn.onclick = function () {
	        this.setAttribute("choiced", "2");
	        rightImg.src = rUrl + "choice-blue.png";
	        leftBtn.setAttribute("choiced", "1");
	        leftImg.src = rUrl + "choice-black.png";
	    };
	}

	//退票or改期加载页面
	function pushInfo(params, data, fdata) {
	    var str = '';
	    var cuSer = ["400-066-2188", "95539", "400-777-4567", "95378"]; //CZ:1 南航客服,ZH:2 深圳直营 3U:3 川航直营,星合客服:0
	    var comp = ["18723059501"]; //投诉电话
	    //客服电话判断
	    var odir = $.qu(".dirflight");
	    var nFlight = fdata.Carrier;
	    if (nFlight == "CZ" && params.isDft == 1) {
	        $.qu(".kefuTel").innerHTML = cuSer[1];
	        $.qu(".cumTel").style.display = "none";
	        odir.innerHTML = "南航直营";
	        odir.style.display = "block";
	        $.qu(".kefuTel").href = "tel:" + cuSer[1];
	    } else if (nFlight == "ZH" && params.isDft == 1) {
	        $.qu(".kefuTel").innerHTML = cuSer[2];
	        $.qu(".cumTel").style.display = "none";
	        $.qu(".kefuTel").href = "tel:" + cuSer[2];
	        odir.innerHTML = "深航直营";
	        odir.style.display = "block";
	    } else if (nFlight == "3U" && params.isDft == 1) {
	        $.qu(".kefuTel").innerHTML = cuSer[3];
	        $.qu(".cumTel").style.display = "none";
	        odir.innerHTML = "川航直营";
	        odir.style.display = "block";
	        $.qu(".kefuTel").href = "tel:" + cuSer[3];
	    } else {
	        $.qu(".kefuTel").innerHTML = cuSer[0];
	        $.qu(".tousuTel").innerHTML = comp[0];
	        $.qu(".cumTel").style.display = "block";
	        $.qu(".kefuTel").href = "tel:" + cuSer[0];
	        $.qu(".tousuTel").href = "tel:" + comp[0];
	        odir.style.display = "none";
	    }
	    if (data.Index) {
	        str += '<li class="omyBook-namel gaiqiBox" choiced=""  tickno="' + data.TicketNo + '">';
	        str += '<div class="gaiqiImag">';
	        str += '<img src="https://cos.uair.cn/mb/img/choice-black.png" alt="">';
	        str += '</div>';
	        str += '<p class="omyBook-namelp1">';
	        str += '<span class="onamelp1sp1">' + data.Name + '</span><span class="refundstatus"><span>';
	        str += '</p>';
	        str += '<p class="omyBook-namelp1">';
	        str += '<span class="onamelp1sp3">' + data.IDType + '</span>';
	        str += '<span class="onamelp1sp4">' + data.IDNo + '</span>';
	        str += '</p>';
	        str += '</li>';
	    } else {
	        for (var i = 0; i < data.length; i++) {
	            str += '<li class="omyBook-namel gaiqiBox" choiced=""  tickno="' + data[i].TicketNo + '">';
	            str += '<div class="gaiqiImag">';
	            str += '<img src="https://cos.uair.cn/mb/img/choice-black.png" alt="">';
	            str += '</div>';
	            str += '<p class="omyBook-namelp1">';
	            str += '<span class="onamelp1sp1">' + data[i].Name + '</span><span class="refundstatus"><span>';
	            str += '</p>';
	            str += '<p class="omyBook-namelp1">';
	            str += '<span class="onamelp1sp3">' + data[i].IDType + '</span>';
	            str += '<span class="onamelp1sp4">' + data[i].IDNo + '</span>';
	            str += '</p>';
	            str += '</li>';
	        }
	    };
	    $.qu('.peopleList').innerHTML = str; // 动态加载退改乘机人信息;
	}
	//提交退票or改期申请
	function setPush(params, source) {
	    var oid = params.orderid;
	    var route = $.qu(".orderd-startFP").innerHTML + $.qu(".orderd-endFP").innerHTML;
	    var Source = source;
	    //退票改期调用同一个接口;
	    getRefund(oid);
	    //console.log(abs);
	    // getChangeinfo(oid);
	    getArrList(oid);
	    $.qu(".orderTime-t").innerHTML = params.OrderTime.substring(0, params.OrderTime.length - 3);
	    if (params.nStatus == 1) {
	        //退票申请
	        //显示退票选项\
	        $.qu(".gaiqiBtn").onclick = function () {
	            var ogLiss = $.qus(".ghasChoiced");
	            var reason = rspace($.qu(".gaiqiReasonInfo").value);
	            if (ogLiss.length < 1) {
	                (0, _api.myalertp)("Orderd", "请选择退票的乘机人！");
	                return false;
	            }
	            var type1 = $.qu(".refund-self").getAttribute("choiced");
	            var tickno = '';
	            for (var i = 0; i < ogLiss.length; i++) {
	                tickno += ogLiss[i].getAttribute("choiced") + "|";
	            }
	            // alert(tickno.replace(/\|/g,"").length);
	            if (reason == "") {
	                (0, _api.myalertp)("Orderd", "请输入退票原因！");
	            } else {
	                $.qu(".lodinabc").style.display = "-webkit-box";
	                tickno = tickno.substring(0, tickno.length - 1);
	                var act = "RefundTicket";
	                var getData1 = {
	                    act: act,
	                    oid: oid,
	                    route: route,
	                    type: type1,
	                    reason: reason,
	                    tickno: tickno,
	                    Source: Source
	                };
	                console.log(tickno);
	                // var getUrl = flightUrl + "/icbc/ajax.aspx";
	                // kajax.get(getUrl, getData, function (res) {
	                //     // res = res.replace(/\'/g, "\"");
	                //     // res = $.parseJSON(res);
	                //     console.log(res);
	                //     res = eval("(" + res + ")");
	                //     // if (res.data[0] && res.data[0].RC && res.data[0].RC == 0) {
	                //     //     $.qu(".lodinabc").style.display = "none";
	                //     //     alert("改期申请提交成功");
	                //     //     //返回订单页面
	                //     //     $.router.go('#!/flightmb/allmybook',{},true);
	                //     // } else {
	                //     //     alert("提交失败,请稍后重试");
	                //     // }
	                // });
	                var xhr = null;

	                if (window.XMLHttpRequest) {
	                    xhr = new XMLHttpRequest();
	                } else {
	                    xhr = new ActiveXObject('Microsoft.XMLHTTP');
	                }
	                xhr.onreadystatechange = function () {
	                    if (xhr.readyState === 4 && xhr.status === 200) {
	                        $.qu(".lodinabc").style.display = "none";
	                        var rdata = xhr.responseText;
	                        rdata = eval('(' + rdata + ')');
	                        if (rdata.data[0] && rdata.data[0].RC && rdata.data[0].RC == 0) {
	                            (0, _api.myalertp)("Orderd", "退票申请提交成功，实际退票费用以航空公司最终退票费用为准、退票款项到账时间依据航空公司规定，请您留意。", function () {
	                                $.router.go('#!/flightmb/allmybook', {}, true);
	                            });
	                        } else {
	                            alert("提交申请失败!请稍后重试" + rdata.errorMsg);
	                        }
	                    }
	                };
	                xhr.open('GET', flightUrl + "/icbc/ajax.aspx?act=RefundTicket&oid=" + getData1.oid + "&route=" + getData1.route + "&type=" + getData1.type + "&reason=" + getData1.reason + "&tickno=" + getData1.tickno + "&Source=" + getData1.Source, true);
	                xhr.send(null);
	            }
	        };
	    } else if (params.nStatus == 2) {
	        //改期申请
	        //隐藏退票选项\
	        $.qu(".gaiqiRefund").style.display = "none";
	        var type = 4;
	        $.qu(".gaiqiBtn").onclick = function () {
	            var ogLiss = $.qus(".ghasChoiced");
	            var reason = rspace($.qu(".gaiqiReasonInfo").value);
	            if (ogLiss.length < 1) {
	                (0, _api.myalertp)("Orderd", "请选择改期的乘机人！");
	                return false;
	            }
	            var type1 = $.qu(".refund-self").getAttribute("choiced");
	            var tickno = '';
	            for (var i = 0; i < ogLiss.length; i++) {
	                tickno += ogLiss[i].getAttribute("choiced") + "|";
	            }
	            if (reason == "") {
	                (0, _api.myalertp)("Orderd", "请输入改期原因！");
	            } else {
	                $.qu(".lodinabc").style.display = "-webkit-box";
	                tickno = tickno.substring(0, tickno.length - 1);
	                var act = "RefundTicket";
	                var getData = {
	                    act: act,
	                    oid: oid,
	                    route: route,
	                    type: type,
	                    reason: reason,
	                    tickno: tickno,
	                    Source: Source
	                };
	                //console.log(tickno);
	                // var getUrl = flightUrl + "/icbc/ajax.aspx";
	                // kajax.get(getUrl, getData, function (res) {
	                //     // res = res.replace(/\'/g, "\"");
	                //     // res = $.parseJSON(res);
	                //     console.log(res);
	                //     res = eval("(" + res + ")");
	                //     // if (res.data[0] && res.data[0].RC && res.data[0].RC == 0) {
	                //     //     $.qu(".lodinabc").style.display = "none";
	                //     //     alert("改期申请提交成功");
	                //     //     //返回订单页面
	                //     //     $.router.go('#!/flightmb/allmybook',{},true);
	                //     // } else {
	                //     //     alert("提交失败,请稍后重试");
	                //     // }
	                // });
	                var xhr = null;

	                if (window.XMLHttpRequest) {
	                    xhr = new XMLHttpRequest();
	                } else {
	                    xhr = new ActiveXObject('Microsoft.XMLHTTP');
	                }
	                xhr.onreadystatechange = function () {
	                    if (xhr.readyState === 4 && xhr.status === 200) {
	                        $.qu(".lodinabc").style.display = "none";
	                        var rdata = xhr.responseText;
	                        rdata = eval('(' + rdata + ')');
	                        if (rdata.data[0] && rdata.data[0].RC && rdata.data[0].RC == 0) {
	                            (0, _api.myalertp)("Orderd", "提交改期申请成功!", function () {
	                                $.router.go('#!/flightmb/allmybook', {}, true);
	                            });
	                        } else {
	                            alert("提交申请失败!请稍后重试" + rdata.errorMsg);
	                        }
	                    }
	                };
	                xhr.open('GET', flightUrl + "/icbc/ajax.aspx?act=RefundTicket&oid=" + getData.oid + "&route=" + getData.route + "&type=" + getData.type + "&reason=" + getData.reason + "&tickno=" + getData.tickno + "&Source=" + getData.Source, true);
	                xhr.send(null);
	            }
	        };
	    } else {
	        return;
	    }
	}

	function getArrList(oid) {
	    var arr = [];
	    var arr1 = getRefundinfo(oid);
	    var arr2 = getChangeinfo(oid);
	    arr = arr1.concat(arr2);
	    var str = "";
	    $.qu(".gaiqilist-ul").innerHTML = "";
	    if (arr.length > 0) {
	        arr.sort(function (a, b) {
	            var aa = new Date(a.time).getTime();
	            var bb = new Date(b.time).getTime();
	            return aa - bb;
	        });
	        for (var i = 0; i < arr.length; i++) {
	            str += '<li>\n                        <div class="gaiqitype">\n                        <p><span class="list-Type">\u59D3\u540D</span><span class="gaiqiTxt">' + arr[i].passengerName + '</span></p>\n                          <p><span class="list-Type">\u72B6\u6001</span><span class="gaiqiTxt">' + arr[i].desc + '</span></p>\n                          <p><span class="list-Type">\u65F6\u95F4</span><span class="gaiqiTxt">' + arr[i].time + '</span></p>\n                        ';
	            if (arr[i].notes) {
	                str += '<p><span class="list-Type noteTips">\u5907\u6CE8</span><span class="gaiqiTxt">' + arr[i].notes + '</span></p>';
	            }
	            str += '</div></li>';
	        }
	    } else {
	        str = "<li>暂无退改签历史信息哦！！</li>";
	    }
	    $.qu(".gaiqilist-ul").innerHTML = str;
	}

	function getRefundinfo(oid) {
	    //http://localhost:34472/icbc/refund.aspx?OrderID=477978&act=getRefundPassengerInfo
	    var arr = [];
	    var xhr = null;
	    if (window.XMLHttpRequest) {
	        xhr = new XMLHttpRequest();
	    } else {
	        xhr = new ActiveXObject('Microsoft.XMLHTTP');
	    }
	    xhr.onreadystatechange = function () {
	        if (xhr.readyState === 4 && xhr.status === 200) {
	            var rdata = xhr.responseText;
	            if (rdata) {
	                if (typeof rdata == "string") {
	                    rdata = JSON.parse(rdata);
	                }
	                arr = rdata;
	            }
	        }
	    };
	    xhr.open('POST', flightUrl + "/icbc/refund.aspx?act=getCancelStr&OrderID=" + oid, false);
	    xhr.send(null);
	    return arr;
	}
	function getChangeinfo(oid) {
	    //http://localhost:34472/icbc/refund.aspx?OrderID=477978&act=getRefundPassengerInfo
	    var arr = [];
	    var xhr = null;
	    if (window.XMLHttpRequest) {
	        xhr = new XMLHttpRequest();
	    } else {
	        xhr = new ActiveXObject('Microsoft.XMLHTTP');
	    }
	    xhr.onreadystatechange = function () {
	        if (xhr.readyState === 4 && xhr.status === 200) {
	            var rdata = xhr.responseText;
	            if (rdata) {
	                if (typeof rdata == "string") {
	                    rdata = JSON.parse(rdata);
	                }
	                for (var i = 0; i < rdata.length; i++) {
	                    if (!rdata[i].time) {
	                        rdata.splice(i, 1);
	                    }
	                    arr = rdata;
	                }
	            }
	        }
	    };
	    xhr.open('POST', flightUrl + "/icbc/refund.aspx?act=getRefundStr&OrderID=" + oid, false);
	    xhr.send(null);
	    return arr;
	}

	function getRefund(oid) {
	    //http://localhost:34472/icbc/refund.aspx?OrderID=477978&act=getRefundPassengerInfo
	    var xhr = null;
	    var arr2 = ["(申请)", "(已审核)", "(办理)", "(拒审)", "(核销)"];
	    var arr3 = [];
	    if (window.XMLHttpRequest) {
	        xhr = new XMLHttpRequest();
	    } else {
	        xhr = new ActiveXObject('Microsoft.XMLHTTP');
	    }
	    xhr.onreadystatechange = function () {
	        if (xhr.readyState === 4 && xhr.status === 200) {
	            var rdata = xhr.responseText;
	            rdata = eval('(' + rdata + ')');
	            console.log(rdata);
	            var arr = [];
	            var gaiLis = $.qus(".gaiqiBox");
	            if (!(rdata.Passengers.Passenger instanceof Array)) {
	                arr.push(rdata.Passengers.Passenger);
	            } else {
	                arr = rdata.Passengers.Passenger;
	            }
	            //&& parseInt(arr[i].CancelStr) != 4 拒审
	            for (var i = 0, len = arr.length; i < len; i++) {
	                if (parseInt(arr[i].CancelStr) > 0 && parseInt(arr[i].CancelStr) != 4) {
	                    arr3.push(i);
	                    for (var j = 0; j < gaiLis.length; j++) {
	                        if (arr[i].IDNo == gaiLis[j].getAttribute("tickno")) {
	                            gaiLis[j].onclick = null;
	                            gaiLis[j].getElementsByClassName("refundstatus")[0].innerHTML = arr2[parseInt(arr[i].CancelStr) - 1];
	                        };
	                    }
	                }
	            }
	            if (gaiLis.length == arr3.length) {
	                $.qu(".gaiqiBtn").style.display = "none";
	            }
	        }
	    };
	    xhr.open('POST', flightUrl + "/icbc/refund.aspx?OrderID=" + oid + "&act=getRefundPassengerInfo", false);
	    xhr.send(null);
	}
	//防止用户输入空格;
	function rspace(st) {
	    return st.replace(/\s/g, "");
	}
	// 查看详情订单  ajax请求
	function lookorderdetail(params) {
	    var nStatusnow = params.nStatus; //是否退票，改签.
	    var theorderid = params.orderid;
	    var oData = '';
	    var xhr = '';
	    if (window.XMLHttpRequest) {
	        xhr = new XMLHttpRequest();
	    } else {
	        xhr = new ActiveXObject(' Microsoft.XMLHTTP');
	    }
	    // xhr.open('get','http://106.75.131.58:8015/icbc/xhService.ashx?act=GETUSEDORDERS&ST='+date1+'&ET='+date2,'false');
	    // //xhr.open('get',flightUrl+'/icbc/xhService.ashx?act=GETDSONEPRICE','false');
	    // xhr.send();

	    xhr.open('post', flightUrl + '/icbc/xhService.ashx', true);
	    xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
	    xhr.send('act=GETORDERDETAIL&OrderID=' + theorderid);
	    xhr.onreadystatechange = function () {
	        if (xhr.readyState == 4) {
	            // ajax 响内容解析完成，可以在客户端调用了
	            if (xhr.status == 200) {
	                //$.qu('.lodin-pa').style.display ='none';
	                //  判断服务器返回的状态 200 表示 正常
	                oData = eval('(' + xhr.responseText + ')');
	                console.log(oData);
	                if (oData.Status == 1) {
	                    //  获取数据成功
	                    var mydata = oData.Result.Order;
	                    var data1 = mydata.FlightInfo[0];
	                    var data2 = mydata;
	                    var data3 = mydata.PayStr.Psgs.Psg;
	                    var data4 = mydata.PsgStr.Passengers.Passenger; //乘客信息
	                    var source = mydata.Source;
	                    var status_sv = mydata.Status;
	                    var cpn = data1.Carrier; // 航司号
	                    //  页面填充数据函数
	                    ondatapull(data1, data2, data3, data4);
	                    nStatusFn(params, data4, data1);
	                    setPush(params, source);
	                    var elm = $.qu('.od_phone');
	                    var zyid = params.isDft; // 直营标记 0 为非直营 1为直营
	                    var istirp = params.Personal; // 是否是月结支付  2 为月结支付
	                    if (zyid == '1') {
	                        // 直营机票
	                        getCZphoneod(cpn, elm);
	                    } else {
	                        getCZphoneod('XHSV', elm);
	                    }

	                    // 常见问题页面填充
	                    // 未付款
	                    var nosc1 = '<li><p>\u8BA2\u5355\u4E3A\u4EC0\u4E48\u5931\u6548:</p><p>\u8BA2\u5355\u7684\u6709\u6548\u652F\u4ED8\u65F6\u95F4\u4E3A20\u5206\u949F\uFF0C\u8D85\u8FC7\u6709\u6548\u65F6\u95F4\u8BA2\u5355\u81EA\u52A8\u53D6\u6D88</p></li>';
	                    var nosc2 = '<li><p>\u822A\u53F8\u76F4\u8425\u548C\u975E\u76F4\u8425\u533A\u522B:</p><p>\u822A\u53F8\u76F4\u8425:\u822A\u53F8\u76F4\u63A5\u5728\u878D\u8D2D\u5E73\u53F0\u4E0A\u51FA\u552E\u7684\u5BA2\u7968\uFF0C\u5305\u62EC\u51FA\u7968\u3001\u9000\u6539\u7B7E\u3001\u6253\u5370\u884C\u7A0B\u5355\u7B49\u5176\u4ED6\u552E\u540E\u95EE\u9898\u7531\u822A\u53F8\u76F4\u63A5\u5904\u7406;\u975E\u76F4\u8425:\u878De\u8D2D\u673A\u7968\u5546\u6237\u8D1F\u8D23\u8BA2\u5355\u7684\u6240\u6709\u552E\u540E\u95EE\u9898</p></li>';
	                    var nosc3 = '<li><p>\u5DEE\u65C5\u6708\u7ED3\u548C\u81EA\u5DF1\u7ED3\u7B97\u533A\u522B:</p><p>\u5DEE\u65C5\u6708\u7ED3:\u548C\u878De\u8D2D\u673A\u7968\u5546\u6237(\u661F\u5408\u8054\u76DF)\u7B7E\u8BA2\u4E86\u5DEE\u65C5\u534F\u8BAE\u7684\u5355\u4F4D\uFF0C\u5728\u652F\u4ED8\u8BA2\u5355\u7684\u65F6\u5019\u53EF\u4EE5\u9009\u62E9\u6388\u4FE1\u652F\u4ED8\uFF0C\u4E0D\u7528\u81EA\u5DF1\u57AB\u6B3E,\u6708\u5E95\u5355\u4F4D\u76F4\u63A5\u7ED3\u8D26;\u81EA\u5DF1\u7ED3\u7B97:\u81EA\u884C\u57AB\u6B3E\u51FA\u7968\uFF0C\u4E0D\u80FD\u5DEE\u65C5\u6708\u7ED3</p></li>';
	                    // 已经付款
	                    var yssc1 = '<li><p>\u8BA2\u5355\u5982\u4F55\u9000\u6539\u7B7E:</p><p>\u9000\u7968:\u5728\u8BA2\u5355\u91CC\u76F4\u63A5\u63D0\u4EA4\u9000\u7968\u7533\u8BF7\uFF0C\u822A\u53F8\u76F4\u63A5\u53D6\u6D88\u4F4D\u7F6E\uFF0C\u6CA1\u6709\u529E\u6CD5\u91CD\u65B0\u6062\u590D\u5EA7\u4F4D;\u6539\u671F:\u76F4\u63A5\u7528\u8BA2\u5355\u91CC\u6240\u7559\u7535\u8BDD\u81F4\u7535\u822A\u53F8\u64CD\u4F5C\u53D8\u66F4</p></li>';
	                    var yssc11 = '<li><p>\u8BA2\u5355\u5982\u4F55\u9000\u6539\u7B7E:</p><p>\u9000\u6539\u7B7E\u76F4\u63A5\u5728\u8BA2\u5355\u91CC\u9762\u63D0\u4EA4\u7533\u8BF7\uFF0C\u540E\u53F0\u6536\u5230\u7533\u8BF7\u540E\u4F1A\u76F4\u63A5\u7535\u8BDD\u8054\u7CFB\u7533\u8BF7\u4EBA\uFF0C\u786E\u5B9A\u597D\u9000\u6539\u7B7E\u4FE1\u606F\u540E\u518D\u64CD\u4F5C\u53D8\u66F4</p></li>';
	                    var yssc2 = '<li><p>\u884C\u7A0B\u5355\u600E\u4E48\u5BC4\u9001:</p><p> \u9884\u8BA2\u673A\u7968\u7684\u65F6\u5019\u5728\u8BA2\u5355\u91CC\u9009\u62E9\u201C\u9700\u8981\u62A5\u9500\u51ED\u8BC1\u201D\u5E76\u586B\u5199\u6536\u4EF6\u5730\u5740;\u5BC4\u9001\u65F6\u95F4:\u822A\u73ED\u8D77\u98DE\u540E3\u52305\u4E2A\u5DE5\u4F5C\u65E5</p></li>';
	                    var yssc3 = '<li><p>\u79EF\u5206\u662F\u5426\u53EF\u4EE5\u5151\u6362\u673A\u7968:</p><p>\u79EF\u5206\u4E0D\u53EF\u4EE5\u5151\u6362\u673A\u7968\uFF0C\u5177\u4F53\u60C5\u51B5\u53EF\u4EE5\u54A8\u8BE2\u878De\u8D2D\u5BA2\u670D\u70ED\u7EBF:<a href="tel:4009195588" class="reg_phone">4009195588</a></p></li>';

	                    var sv_text = $.qu('.orderd_nop');
	                    if (status_sv == "未付款") {

	                        if (istirp == 2) {
	                            // 月结用户
	                            sv_text.innerHTML = nosc1 + nosc3;
	                        } else {
	                            if (zyid == '1') {
	                                // 直营机票
	                                sv_text.innerHTML = nosc1 + nosc2;
	                            } else {
	                                sv_text.innerHTML = nosc1;
	                            }
	                        }
	                    } else {
	                        if (istirp == 2) {
	                            // 月结用户
	                            sv_text.innerHTML = yssc11 + nosc2 + nosc3 + yssc2 + yssc3;
	                        } else {
	                            if (zyid == '1') {
	                                // 直营机票
	                                sv_text.innerHTML = yssc1 + nosc2 + yssc2 + yssc3;
	                            } else {
	                                sv_text.innerHTML = yssc11 + nosc2 + yssc2 + yssc3;
	                            }
	                        }
	                    }
	                } else {

	                    (0, _api.myalertp)('orderd', '登陆状态超时或获取数据失败，请重试或者登陆！');
	                }
	            } else {
	                //alert('出错了，Err' +xhr.status);
	                (0, _api.myalertp)('orderd', '查看订单详情出错了，Err' + xhr.status);
	            }
	        }
	    };
	}

	// 头部电话 更换
	function getCZphoneod(key, el) {
	    (0, _api.myget)(flightUrl + '/icbc/xhService.ashx', 'act=GETSERVICEPHONE&Source=' + key, true, function (err, res) {
	        if (err) {
	            (0, _api.myalertp)('router0', '出错了，获取客服联系电话失败！');
	        } else {
	            var oData3 = eval('(' + res + ')');
	            var phonts = oData3.Result.Phone;
	            var phontn = oData3.Result.Source;
	            el.href = 'tel:' + phonts;
	        }
	    });
	}

	// 航班信息  改退签  联系人  填入函数
	function ondatapull(data1, data2, data3, data4) {
	    //  订单状态 及返现
	    $.qu('.orderd-h1state').innerHTML = data2.Status;
	    $.qu('.thefee-d').innerHTML = 0; // 返现
	    $.qu('.Odelivery-d').innerHTML = data2.shipStr; // 邮寄费
	    // 航班信息
	    $.qu('.orderd-mtfsp1').innerHTML = getLastFive(data1.FlightDate); // 日期
	    $.qu('.orderd-mtfsp2').innerHTML = data1.FromCarrier; // 航空公司号
	    $.qu('.orderd-mtfsp3').innerHTML = data1.FromNo; // 航班号
	    $.qu('.orderd-mtfsp4').innerHTML = data1.FromModel; // 机型
	    $.qu('.orderd-mttsp1').innerHTML = data1.FromTime; // 起飞时间
	    $.qu(".orderd-startFP").innerHTML = data1.From; //起飞城市
	    $.qu('.orderd-mttsp11').innerHTML = data1.FromPort; // 起飞机场
	    $.qu('.orderd-mttsp2').innerHTML = data1.ToTime; // 到达时间
	    $.qu(".orderd-endFP").innerHTML = data1.To; //到达城市
	    $.qu('.orderd-mttsp22').innerHTML = data1.ToPort; // 到达机场
	    $.qu(".orderd-mtfsp111").innerHTML = isNextDay(data1.FromTime, data1.ToTime, data1.FlightDate); // 日期

	    // 改退签规定
	    var changeText = data2.RefundStr.replace(/\%b/g, '').replace(/\b/g, '').replace('改期：', '.<br/>改期：').replace('签转：', '.<br/>签转：');
	    $.qu('.orderdlooktext1-text').innerHTML = changeText; // 退改说明

	    //联系人
	    $.qu('.Ocantactdata-d-cname').innerHTML = data2.ConName; // 联系人 姓名
	    $.qu('.Ocantactdata-d-cphone').innerHTML = data2.ConPhone; // 联系人电话

	    // 价格明细
	    if (data3.AgeType == '成人') {
	        $.qu('.Ocpeople-d-sp1').innerHTML = '成人票';
	        $.qu('.Otoprice-d').innerHTML = data1.FlightPrice;

	        $.qu('.cpeoplenum1-d').innerHTML = data3.Count;
	        $.qu('.cpeoplenum2-d').innerHTML = data3.Count;
	        $.qu('.OoilO-d').innerHTML = 50; // 没有基建 费用为 0

	        if (data3.InsuredQty == '1') {
	            // 有保险
	            $.qu('.cpeoplenum3-d').innerHTML = data3.Count;
	            $.qu('.Osafe-d').innerHTML = data2.InsureStr;
	        } else {
	            //没有保险
	            $.qu('.cpeoplenum3-d').innerHTML = 0;
	            $.qu('.Osafe-d').innerHTML = 0;
	        }
	    } else if (data3.AgeType == '儿童') {
	        $.qu('.Ocpeople-d-sp1').innerHTML = '儿童票';
	        $.qu('.Otoprice-d').innerHTML = data1.FlightPrice;
	        $.qu('.OoilO-d').innerHTML = 0; // 没有基建 费用为 0
	        $.qu('.cpeoplenum1-d').innerHTML = data3.Count; // 儿童票数量
	        $.qu('.cpeoplenum2-d').innerHTML = 0; // 基建 数量 0

	        if (data3.InsuredQty == '1') {
	            // 有保险
	            $.qu('.cpeoplenum3-d').innerHTML = data3.Count;
	            $.qu('.Osafe-d').innerHTML = data2.InsureStr;
	        } else {
	            //没有保险
	            $.qu('.cpeoplenum3-d').innerHTML = 0;
	            $.qu('.Osafe-d').innerHTML = 0;
	        }
	    }

	    //总价
	    $.qu('.Oallprice11-d').innerHTML = data2.TotalAmount;

	    //乘机人信息
	    var str = '';
	    //console.log(data4)
	    if (data4.Index) {
	        var safe = '';
	        if (data4.InsuredQty == '1') {
	            //有保险
	            safe = '1份';
	        } else {
	            safe = '无';
	        }

	        str += '<ul class="Opasengerdata-d-ul"><li class="Opasengerdata-d-li1"><sapn class="Opbg-d">' + data4.Index + '</sapn> <img src="https://cos.uair.cn/mb/img/q_tip.png" alt=""></li><li><span class="Opasengerdata-d-sp1">乘客类型</span><span class="Opasengerdata-d-ptype">' + data4.AgeType + '</span></li><li><span class="Opasengerdata-d-sp1">姓名</span><span class="Opasengerdata-d-pname">' + data4.Name + '</span></li><li><span class="Opasengerdata-d-sp1">证件类型</span><span class="Opasengerdata-d-pcard">' + data4.IDType + '</span></li><li><span class="Opasengerdata-d-sp1">证件号码</span><span class="Opasengerdata-d-pnum">' + data4.IDNo + '</span></li><li><span class="Opasengerdata-d-sp1">手机号码</span><span class="Opasengerdata-d-pphone">' + data4.Phone + '</span></li><li><span class="Opasengerdata-d-sp1">保险</span><span class="Opasengerdata-d-psafe">' + safe + '</span></li></ul>';
	    } else {

	        for (var i = 0; i < data4.length; i++) {
	            var safe = '';
	            if (data4[i].InsuredQty == '1') {
	                //有保险
	                safe = '1份';
	            } else {
	                safe = '无';
	            }

	            str += '<ul class="Opasengerdata-d-ul"><li class="Opasengerdata-d-li1"><sapn class="Opbg-d">' + data4[i].Index + '</sapn> <img src="https://cos.uair.cn/mb/img/q_tip.png" alt=""></li><li><span class="Opasengerdata-d-sp1">乘客类型</span><span class="Opasengerdata-d-ptype">' + data4[i].AgeType + '</span></li><li><span class="Opasengerdata-d-sp1">姓名</span><span class="Opasengerdata-d-pname">' + data4[i].Name + '</span></li><li><span class="Opasengerdata-d-sp1">证件类型</span><span class="Opasengerdata-d-pcard">' + data4[i].IDType + '</span></li><li><span class="Opasengerdata-d-sp1">证件号码</span><span class="Opasengerdata-d-pnum">' + data4[i].IDNo + '</span></li><li><span class="Opasengerdata-d-sp1">手机号码</span><span class="Opasengerdata-d-pphone">' + data4[i].Phone + '</span></li><li><span class="Opasengerdata-d-sp1">保险</span><span class="Opasengerdata-d-psafe">' + safe + '</span></li></ul>';
	        }
	    }

	    $.qu('.Opasengerdata-d').innerHTML = str; // 动态加载乘客信息

	    //快递地址
	    if (data2.shipStr != '') {
	        $.qu('.Orderdlinkadd').style.display = 'block';
	        // $.qu('.Orderdlinkadd-box').style.display = 'block';
	        $.qu('.Orderdlinkadd-boxp2').innerHTML = data2.ConAddress;
	        //配送费
	        $.qu(".orderd-dfee").style.display = "block";
	    } else {
	        $.qu('.Orderdlinkadd').style.display = 'none';
	        $.qu('.Orderdlinkadd-box').style.display = 'none';
	        $.qu('.Orderdlinkadd-boxp2').innerHTML = '';
	        $.qu(".orderd-dfee").style.display = "none";
	    }

	    //改签退定判断

	}

	//兼容获取样式
	function getMyStyle(obj, attr) {
	    if (obj.currentStyle) {
	        return obj.currentStyle[attr];
	    } else {
	        return window.getComputedStyle(obj, false)[attr];
	    }
	}
	//列表收起操作
	function showList(obj1, obj2) {
	    if (getMyStyle(obj1, "display") == "none" || getMyStyle(obj1, "display") == "") {
	        obj1.style.display = "block";
	        obj2.src = "https://cos.uair.cn/mb/img/top.png";
	    } else {
	        obj1.style.display = "none";
	        obj2.src = "https://cos.uair.cn/mb/img/botom.png";
	    }
	}
	//初始化
	function hideList(obj, obj1) {
	    obj.style.display = "none";
	    obj1.src = "https://cos.uair.cn/mb/img/botom.png";
	}

	//判断时间是否应该加一天
	function isNextDay(date1, date2, dateM) {
	    var str1 = removeM(date1) - removeM(date2) > 0 ? GetDateStrH(dateM, "24") : dateM;
	    return getLastFive(str1);
	}
	//日期中去除年份
	function getLastFive(date) {
	    return date.substring(date.length - 5, date.length);
	}
	//去除"\:"
	function removeM(date) {
	    return parseInt(date.replace(/\:/g, ""));
	}
	//天数加1
	function GetDateStrH(data1, h) {

	    var Y1 = data1.substring(0, 4);
	    var m1 = data1.substring(5, 7) - 1;
	    var d1 = data1.substring(8, 10);
	    // var  h1 = data1.substring(11, 13);
	    // var  M1 = data1.substring(14, 17);
	    var dd = new Date(Y1, m1, d1);
	    dd.setHours(dd.getHours() + h); //获取AddDayCount天后的日期
	    var y = dd.getFullYear();
	    var m = dd.getMonth() + 1; //获取当前月份的日期
	    var d = dd.getDate();

	    if ((m + "").length == 1) {
	        m = "0" + m;
	    }
	    if ((d + "").length == 1) {
	        d = "0" + d;
	    }

	    return y + "-" + m + "-" + d;
	}

	//身份证加"*"处理 分两种情况 成人 or 儿童

	function hideInfo(e) {
	    var d = e.length;
	    return d < 18 ? e : e.replace(/^(.{6})(?:\d+)(.{4})$/, "$1****$2");
	}

	//手机号加"*"处理
	function hideTel(e) {
	    return e.replace(/^(.{3})(?:\d+)(.{4})$/, "$1****$2");
	}

/***/ },
/* 45 */
/***/ function(module, exports) {

	module.exports = "\r\n<div id=\"Orderd\">\r\n\r\n    <div class=\"orderd-t\">\r\n          <span class=\"orderd-tt1\"><img src=\"https://cos.uair.cn/mb/img/back.bg.png\" alt=\"\"></span>\r\n          <span class=\"orderd-tt2\">订单详情</span>\r\n          <a href=\"\" class=\"od_phone\"></a>\r\n    </div>  \r\n    <div class=\"lodinabc\">\r\n        <img class=\"xhlog\" src=\"https://cos.uair.cn/mb/img/xhlog.gif\" />\r\n    </div>\r\n    <div class=\"orderd-m\">\r\n            <div class=\"orderd-mwrap\">\r\n            <div class=\"Order-fl-inf\">\r\n                <p class=\"allmybook-boxtm\">\r\n                    <img class=\"flight-logo\" src=\"https://cos.uair.cn/mb/img/flight-logo.png\"><span class=\"allmybook-boxtm1  allmybookf orderd-startFP\">重庆</span><span class=\"d-wrapl1-right2 order-fl-right\"><strong></strong></span><span class=\"allmybook-boxtm5 allmybookt orderd-endFP\">北京</span>\r\n                    <span class=\"Order-fl-style orderd-h1state\">adf</span>\r\n                </p>\r\n                <div class=\"Order-fl-box\">\r\n                    <div class=\"Order-fl-l\"></div>\r\n                    <div class=\"Order-fl-c\">\r\n                        <p class=\"Order-fl-from\">\r\n                            <span class=\"Order-fl-from-names orderd-mttsp11\">江北机场</span>\r\n                            <span class=\"Order-fl-from-ms orderd-mtfsp1\">12-9</span>\r\n                            <span class=\"Order-fl-from-ts orderd-mttsp1\">11:40</span>\r\n                        </p>\r\n                        <p class=\"Order-fl-from-info\">\r\n                            <img src=\"\" alt=\"\">\r\n                            <span class=\"orderd-mtfsp2\">中国国航空</span>\r\n                            <span class=\"orderd-mtfsp3\">DFASDF123</span>\r\n                            <span class=\"orderd-mtfsp4\">DFASDF123</span>\r\n                        </p>\r\n                        <p class=\"Order-fl-to\">\r\n                            <span class=\"Order-fl-from-namee orderd-mttsp22\">江北机场</span>\r\n                            <span class=\"Order-fl-from-me orderd-mtfsp111\">12-9</span>\r\n                            <span class=\"Order-fl-from-te orderd-mttsp2\">11:40</span>\r\n                        </p>\r\n                    </div>\r\n                </div>\r\n                <div class=\"orderTime-box\">\r\n                  <span class=\"\">订单时间</span>\r\n                  <span class=\"orderTime-t\">2017-03-06 12:23</span>\r\n                </div>\r\n                <div class=\"orderdlooktext\">\r\n                    <p class=\"orderdlooktext-pw\">\r\n                        <span class=\"left-title\">退改签规定</span><img class=\"getPeInfo\" src=\"https://cos.uair.cn/mb/img/top.png\" alt=\"\">\r\n                    </p>\r\n                    <ul class=\"orderdlooktext1-text\"></ul>\r\n                </div>\r\n                <div class=\"OpriceFlight-d\">\r\n                    <p class=\"orderdlooktext-pw\"><span class=\"left-title\">价格明细</span><img class=\"getPriInfo\" src=\"https://cos.uair.cn/mb/img/botom.png\" alt=\"\"></p>\r\n                    <div class=\"Othepriece-d\">\r\n                        <ul class=\"Ocpeople-d\">\r\n                            <li class=\"Ocpeople-d-li\">\r\n                                <span class=\"Ocpeople-d-sp1\">成年票</span>\r\n\r\n                                <span class=\"Otoprice1-d\"><em class=\"Opsmall-d\">￥</em><em class=\"Otoprice-d\">910</em></span>\r\n                                 <div class=\"OPnum-d\"><span>×</span><span class=\"cpeoplenum1-d\">2</span></div>\r\n                            </li>\r\n                            <li class=\"Ocpeople-d-li\">\r\n                                 <span class=\"Ocpeople-d-sp1\">基建/燃油</span>\r\n                                <span class=\"Ooil1O-d\"><em class=\"Opsmall\">￥</em><em class=\"OoilO-d\">50</em></span>\r\n                                <div class=\"OPnum-d\"><span>×</span><span class=\"cpeoplenum2-d\">2</span></div>\r\n                            </li>\r\n                            <li class=\"Ocpeople-d-li\">\r\n                                 <span class=\"Ocpeople-d-sp1\">保险</span>\r\n                                <span class=\"Ooil1O-d\"><em class=\"Opsmall-d\">￥</em><em class=\"Osafe-d\">30</em></span>\r\n                                <div class=\"OPnum-d\"><span>×</span><span class=\"cpeoplenum3-d\">2</span></div>\r\n                            </li>\r\n                            <li class=\"Ocpeople-d-li\">\r\n                                <span class=\"Ocpeople-d-sp1\">返现</span>\r\n                                <span ><em class=\"zreofee-d\">￥</em><em class=\"Ozreofee-d\">-</em><em class=\"thefee-d\">0</em></span>\r\n                            </li>\r\n                            <li class=\"Ocpeople-d-li orderd-dfee\">\r\n                                <span class=\"Ocpeople-d-sp1\">配送费</span>\r\n                                <span class=\"Ooil1O-d\"><em class=\"Opsmall-d\">￥</em><em class=\"Odelivery-d\">15</em></span>\r\n                            </li>\r\n                        </ul>                          \r\n                    </div>\r\n                </div>                  \r\n                <div class=\"orderdpasenger\">\r\n                    <p class=\"orderdlooktext-pw\">\r\n                        <span class=\"left-title\">乘机人信息</span><img class=\"getPsInfo\" src=\"https://cos.uair.cn/mb/img/botom.png\" alt=\"\">\r\n                    </p>\r\n                    <div class=\"Opasengerdata-d\"></div>\r\n                </div>                \r\n                <div class=\"orderdpacantact\">\r\n                    <p class=\"orderdlooktext-pw\">\r\n                        <span class=\"left-title\">联系人信息</span><img class=\"getlinkInfo\" src=\"https://cos.uair.cn/mb/img/botom.png\" alt=\"\">\r\n                    </p>\r\n                    <div class=\"Ocantactdata-d\">\r\n                         <ul class=\"Ocantactdata-d-ul\">\r\n                            <li><span class=\"Ocantactdata-d-sp1\">姓名</span><span class=\"Ocantactdata-d-cname\"></span></li>\r\n                            <li><span class=\"Ocantactdata-d-sp1\">手机号码</span><span class=\"Ocantactdata-d-cphone\"></span></li>\r\n                         </ul>\r\n                    </div>\r\n                </div>               \r\n                <div class=\"Orderdlinkadd\">\r\n                    <p class=\"orderdlooktext-pw\">\r\n                        <span class=\"left-title\">行程单</span><img class=\"getProInfo\" src=\"https://cos.uair.cn/mb/img/botom.png\" alt=\"\">\r\n                    </p>\r\n                    <div class=\"Orderdlinkadd-box clear\">\r\n                        <p class=\"Orderdlinkadd-boxp1\">配送地址</p><p class=\"Orderdlinkadd-boxp2\"></p>\r\n                    </div>\r\n                </div> \r\n\r\n                <!-- 改期or退票 start-->\r\n                <div class=\"gaiqiInfo\">\r\n                  <div class=\"gaiqiLists\">\r\n                    <p class=\"oldInfolist\">退改期历史信息</p>\r\n                    <ul class=\"gaiqilist-ul\">\r\n\r\n                    </ul>\r\n                  </div>\r\n                  <div class=\"gaiqiTips\">\r\n                    <p class=\"gaiqiSeller\"><img src=\"https://cos.uair.cn/mb/img/tip-icon.png\" alt=\"\">温馨提示</p>\r\n                    <p class=\"gaiqiTipInfo\">\r\n                        在提交前请务必先与卖家联系，退改签相关费用！\r\n                    </p>\r\n                    <p class=\"gaiqitipps\">\r\n                        <img src=\"https://cos.uair.cn/mb/img/call.png\" alt=\"\">\r\n                        <span>客服电话：<a href=\"\" class=\"kefuTel\"></a></span>\r\n                        <span class=\"dirflight\"></span>\r\n                    </p>\r\n                    <p class=\"gaiqitipps cumTel\">\r\n                        <img src=\"https://cos.uair.cn/mb/img/call.png\" alt=\"\">\r\n                        <span>投诉电话：<a href=\"\" class=\"tousuTel\"></a></span>\r\n                    </p>\r\n                  </div>\r\n                  <div class=\"gaiqiRefund\">\r\n                      <p class=\"refundTip\">\r\n                          请选择退票意愿                         \r\n                      </p>\r\n                      <div class=\"refundInfo\">\r\n                            <div class=\"refund-self\" choiced=\"2\">\r\n                                <div>\r\n                                    <img src=\"https://cos.uair.cn/mb/img/choice-blue.png\">\r\n                                    <span>自愿退票:</span>\r\n                                </div>\r\n                                旅客由于本人原因，在客票有效期内不能完成部分或全部航程，而要求办理退票手续，航空公司将收取退票手续费。\r\n                            </div>\r\n                            <div class=\"refund-other\" choiced=\"1\">\r\n                                <div>\r\n                                   <img src=\"https://cos.uair.cn/mb/img/choice-black.png\">\r\n                                   <span>非自愿退票:</span>\r\n                                </div>\r\n                                由于航空公司原因或其他不可抗力因素，不能正常承运旅客，旅客要求办理退票手续，航空公司免收退票手续费。\r\n                            </div>\r\n                      </div>\r\n                  </div>\r\n                  <div class=\"gaiqiPeopel\">\r\n                    <p class=\"gaiqipTips\">选择退改签乘机人</p>\r\n                    <div class=\"gaiqiBoxQu\">\r\n                      <ul class=\"myBook-nameull peopleList\">\r\n                       <!-- <li class=\"myBook-namel gaiqiBox\" choiced=\"\">\r\n                           <div class=\"gaiqiImag\">\r\n                             <img src=\"img/choice-black.png\" alt=\"\">\r\n                           </div>\r\n                           <p class=\"myBook-namelp1\">\r\n                             <span class=\"namelp1sp1\">艾艳青(成人)</span>\r\n                           </p>\r\n                           <p class=\"myBook-namelp1\">\r\n                             <span class=\"namelp1sp3\">身份证</span>\r\n                             <span class=\"namelp1sp4\">411322198708301035</span>\r\n                           </p>\r\n                       </li>\r\n                       <li class=\"myBook-namel gaiqiBox\" choiced=\"\">\r\n                           <div class=\"gaiqiImag\">\r\n                             <img src=\"img/choice-black.png\" alt=\"\">\r\n                           </div>\r\n                           <p class=\"myBook-namelp1\">\r\n                             <span class=\"namelp1sp1\">艾艳青(成人)</span>\r\n                           </p>\r\n                           <p class=\"myBook-namelp1\">\r\n                             <span class=\"namelp1sp3\">身份证</span>\r\n                             <span class=\"namelp1sp4\">411322198708301035</span>\r\n                           </p>\r\n                       </li> -->\r\n                     </ul>\r\n                    </div>\r\n                    <div class=\"gaiqiReason\">\r\n                        <p class=\"gaiqititle\"></p>\r\n                        <textarea  class=\"gaiqiReasonInfo\" name=\"\" id=\"\" cols=\"30\" rows=\"10\">\r\n                            \r\n                        </textarea>\r\n                    </div>\r\n                  </div>\r\n                  <div class=\"gaiqidirtip\">\r\n                      请直接联系航司进行相关操作\r\n                    </div>\r\n                </div>\r\n                <!-- 改期or退票 end-->\r\n                <div class=\"contact_sv\" >\r\n                    <p class=\"contact_svtext\">\r\n                        <span class=\"left-title\">常见问题</span><img class=\"contact_im\" src=\"https://cos.uair.cn/mb/img/botom.png\" alt=\"\">\r\n                    </p>\r\n                    <ul class=\"orderd_nop\"></ul>\r\n\r\n                </div>\r\n            </div>                                             \r\n        </div>\r\n    </div>\r\n    <div class=\"Oallprice-d\">\r\n       <span class=\"Oallprice1-d\"><em class=\"Oallprice1-d-total-w\">总额</em><em class=\"Oallprice1-d-m-icon\">￥</em><span  class=\"Oallprice11-d\"></span></span>\r\n       <button class=\"gaiqiBtn\"></button>\r\n    </div>      \r\n</div>\r\n"

/***/ }
/******/ ]);
