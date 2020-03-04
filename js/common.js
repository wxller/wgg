/**
 * author : wuxingliu
 * comment: 公共js类
 * @type {{}}
 */
var debug = true; //是否为测试
// 请求加载
var uiLoading = '';

var $cs = {};
$cs.isDebug = function(){
    return debug;
}
$cs.msgPos = function(){
    return 'top';//document.documentElement.clientWidth < 735 ? 'center':'top';
} 
//获得窗口高度属性
$cs.offset = function(el){
    if(!$cs.isElement(el)){
        console.warn('$api.offset Function need el param, el param must be DOM Element');
        return;
    }
    var sl = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
    var st = Math.max(document.documentElement.scrollTop, document.body.scrollTop);

    var rect = el.getBoundingClientRect();
    return {
        l: rect.left + sl,
        t: rect.top + st,
        w: el.offsetWidth,
        h: el.offsetHeight
    };
};
$cs.isElement = function(obj){
    return !!(obj && obj.nodeType == 1);
};

$cs.isObject = function (obj) {
    return Object.prototype.toString.call(obj) === "[object Object]";
}

// storage 操作方法
var uzStorage = function () {
    var ls = window.localStorage;
    // if (isAndroid) {
    //     ls = os.localStorage();
    // }
    return ls;
};
// 设置storage
$cs.setStorage = function (key, value) {
    if (arguments.length === 2) {
        var v = value;
        if (typeof v == 'object') {
            v = JSON.stringify(v);
            v = 'obj-' + v;
        } else {
            v = 'str-' + v;
        }
        var ls = uzStorage();
        if (ls) {
            ls.setItem(key, v);
        }
    }
};
// 获取storage
$cs.getStorage = function (key) {
    var ls = uzStorage();
    if (ls) {
        var v = ls.getItem(key);
        if (!v) {
            return;
        }
        if (v.indexOf('obj-') === 0) {
            v = v.slice(4);
            return JSON.parse(v);
        } else if (v.indexOf('str-') === 0) {
            return v.slice(4);
        }
    }
};
// 移除一个storage
$cs.rmStorage = function (key) {
    var ls = uzStorage();
    if (ls && key) {
        ls.removeItem(key);
    }
};
// 清楚全部storage
$cs.clearStorage = function () {
    var ls = uzStorage();
    if (ls) {
        ls.clear();
    }
};
/**
 * 设置路径
 * type:  image：图片路径 ajax:请求路径（默认）
 */
$cs.url = function(type){
    if(debug){
        if(type == 'image'){
            return 'http://5gg.ifc007.com'
        }else{
            return 'http://5gg.ifc007.com/api/'
        }
    }else{
        //正式
        if(type == 'image'){
            return ''
        }else {
            return '/api/'
        }
    }
}
$cs.toUrl = function(url){
    location.href = url
}
$cs.closeWin = function(url){
    if(url){
        location.replace(url)
    }else{
        history.back()
    }
}
/**
 * ajax 请求
 * url : 接口地址
 * data：参数
 * callback ： 回调函数
 * method ： 请求方式   默认：POST   GET
 *  */
$cs.ajax = function(url,data,callback,method){
    if(!method){
        method = 'POST'
    }

    var timeStamp = Math.round(new Date().getTime()/1000);
    var md = '357E300E93C610DE6E3EC58E1D719761';
    var sign = hex_md5(timeStamp + md).toUpperCase();
    data.t = timeStamp;
    data.sign = sign;
    if($cs.getStorage('token')){
        data.token = $cs.getStorage('token');
    }
    if($cs.getStorage('secret_token')){
        data.secret_token = $cs.getStorage('secret_token')
    }
    var lang = 'zh-cn'
    data.lang = lang;
    // console.log('参数:'+JSON.stringify(data))
    bui.ajax({
        url: $cs.url() + url,
        data: data,
        method:method
    }).done(function(res) {
        // console.log('接口:'+url +'---返回:'+JSON.stringify(res))
        if(typeof callback == 'function'){
            callback(res)
        }
        //  if(res.message =='401'){
        //      $cs.msg('token错误')
        //      $cs.rmStorage('token')
        //      setTimeout(() => {
        //          window.location.href = './login.html'
        //      }, 1000);
        //  }
        //  if(res.message =='402'){
        //      $cs.msg('您的账号已再其他地方登录')
        //      $cs.rmStorage('token')
        //      setTimeout(() => {
        //          window.location.href = './login.html'
        //      }, 1000);
        //  }
        // if(res.message =='404'){
        //     $cs.msg('您的账号长时间未登录,请重新登录')
        //     $cs.rmStorage('token')
        //     setTimeout(() => {
        //         window.location.href = './login.html'
        //     }, 1000);
        // }
        // if(res.message =='500'){
        //     $cs.msg('账号被冻结，请联系客服')
        //     $cs.rmStorage('token')
        //     setTimeout(() => {
        //         window.location.href = './login.html'
        //     }, 1000);
        // }

    }).fail(function (res) {
        console.log(JSON.stringify(res))
        console.log('接口:'+$cs.url() + url);
        if(typeof callback == 'function'){
            callback({'success':false,'message':'请求失败'})
        }

    })

}

$cs.toString = function(data){
    bui.alert(JSON.stringify(data))
}
$cs.alert = function(data){
    bui.alert(JSON.stringify(data))
}

$cs.msg = function(msg , position){
    var position = position || 'center'
    bui.hint({content:msg, position: position , effect:"fadeInDown",});
}
$cs.waiting = function(){
    $cs.msg('暂未开放敬请期待')
}
// 复制
$cs.copy = function (val){
    if (typeof api == 'undefined') {
        // 没有api对象时调用浏览器复制方法
        // 添加虚拟dom元素
        var fictitious_dom = document.createElement('textarea');
        fictitious_dom.style.opacity = '0';
        fictitious_dom.style.height = '0.1px';
        fictitious_dom.setAttribute('id','in_browser_fictitious_dom');
        fictitious_dom.innerHTML = val;
        document.body.appendChild(fictitious_dom);
        var in_browser_fictitious_dom1 = document.getElementById('in_browser_fictitious_dom');
        in_browser_fictitious_dom1.select();
        document.execCommand("Copy");
        // 移除虚拟dom元素
        $('body').remove('#in_browser_fictitious_dom');
        $cs.msg('复制成功');
        return ;
    }
    // 有api对象时复制
    var obj = api.require('clipBoard');
    obj.set({
        value: val
    }, function(ret, err){
        if(ret.status){
            $cs.msg('复制成功');
        }else{
            $cs.msg(err.msg);
        }
    });
}
$cs.format_url = function(url){
    if(url){
        var reg = /^https?:\/\/|^http?:\/\//i;
        if(!reg.test(url)){
            url =  $cs.url('image') +url
        }
    }
    return url;
}
// 时间转换 今天 昨天 刚刚
$cs.format_time = function(timestamp){
    // console.log('时间转化前:'+timestamp)
    var timestamp = (new Date(timestamp.replace(/-/g,'/'))).getTime()/1000;
    // console.log('时间转化hou:'+timestamp)
    function zeroize( num ) {
        return (String(num).length == 1 ? '0' : '') + num;
    }
    var curTimestamp = parseInt(new Date().getTime() / 1000); //当前时间戳
    var timestampDiff = curTimestamp - timestamp; // 参数时间戳与当前时间戳相差秒数
    var curDate = new Date( curTimestamp * 1000 ); // 当前时间日期对象
    var tmDate = new Date( timestamp * 1000 );  // 参数时间戳转换成的日期对象

    var Y = tmDate.getFullYear(), m = tmDate.getMonth() + 1, d = tmDate.getDate();
    var H = tmDate.getHours(), i = tmDate.getMinutes(), s = tmDate.getSeconds();

    if ( timestampDiff < 60 ) { // 一分钟以内
        return "刚刚";
    } else if( timestampDiff < 3600 ) { // 一小时前之内
        return Math.floor( timestampDiff / 60 ) + "分钟前";
    } else if ( curDate.getFullYear() == Y && curDate.getMonth()+1 == m && curDate.getDate() == d ) {
        return '今天' + zeroize(H) + ':' + zeroize(i);
    } else {
        var newDate = new Date( (curTimestamp - 86400) * 1000 ); // 参数中的时间戳加一天转换成的日期对象
        if ( newDate.getFullYear() == Y && newDate.getMonth()+1 == m && newDate.getDate() == d ) {
                return '昨天' + zeroize(H) + ':' + zeroize(i);
        } else if ( curDate.getFullYear() == Y ) {
                return  zeroize(m) + '月' + zeroize(d) + '日 '  + zeroize(H) + ':' + zeroize(i);
        } else {
                return  Y + '年' + zeroize(m) + '月' + zeroize(d) + '日 ' + zeroize(H) + ':' + zeroize(i);
        }
    }
}
// 获取页面参数
$cs.format_params = function(){
    var url = location.search; //获取url中"?"符后的字串 ('?modFlag=business&role=1')  
    var theRequest = new Object();  
    if ( url.indexOf( "?" ) != -1 ) {  
        var str = url.substr( 1 ); //substr()方法返回从参数值开始到结束的字符串；  
        var strs = str.split( "&" );  
        for ( var i = 0; i < strs.length; i++ ) {  
            theRequest[ strs[ i ].split( "=" )[ 0 ] ] = ( strs[ i ].split( "=" )[ 1 ] );  
        }  
        console.log( theRequest ); //此时的theRequest就是我们需要的参数； 
        return theRequest; 
    }
}
// 退出登录
$cs.on_logout = function(){
    $cs.rmStorage('token')
    window.location.href = './login.html'
}