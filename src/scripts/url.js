function URLError(){
    var errors = [];
    var warnings = [];
    this.addError = function(msg){
        errors.push(msg);
    };
    this.addWarning = function(msg){
        warnings.push(msg);
    };
    this.getErrors = function(){
        return errors;
    };
    this.getWarnings = function(){
        return warnings;
    };
    this.hasError = function(){
        return errors.length > 0;
    };
}
function URL(urlStr){
    var urlObj;
    var urlErr = new URLError();
    var parseHost = function(host, obj){
        var parsed;
        if(host){
            parsed = host.match(/(([^@:]+)(:([^@:]+))?@)?([^@:]+)(:(\d+))?/);
            if(parsed){
                obj.user = parsed[2];
                obj.password = parsed[4];
                obj.port = parsed[7] || '80';
                return parsed[5];
            }
        }
        obj.user = obj.password = obj.port = undefined;
        return host;
    };
    var parseQuery = function(query, obj){
        var qstrs = query && query.split ? query.split('&') : false;
        var toks;
        var addKeyValue = function(key, value){
            var parsedArr = key.match(/^(.+)\[\]$/);
            if(parsedArr){
                key = parsedArr[1];
            }
            if(obj['q.' + key] === undefined){ // existence is not defined
                if(parsedArr){
                    obj['q.' + key] = [value];
                }
                else{
                    obj['q.' + key] = value;
                }
            }
            else if(typeof obj['q.' + key] === 'object'){ // existence is an array
                if(parsedArr){
                    obj['q.' + key].push(value);
                }
                else{
                    // error: existence is an array but the new one is a value
                    urlErr.addError('Query key ' + key + ' is defined twice with different types.');
                    obj['q.' + key] = value;
                }
            }
            else{ // existence is a value
                if(parsedArr){ 
                    // error: existence is a value but the new one is an array
                    urlErr.addError('Query key ' + key + ' is defined twice with different types.');
                    obj['q.' + key] = [value];
                }
                else{
                    // warning: existence is a value, will be overwritten by the new value
                    urlErr.addWarning('Query key ' + key + ' is defined twice. The first one will be overwritten.');
                    obj['q.' + key] = value;
                }
            }
        };
        if(!qstrs) return undefined; 
        for(var i = 0; i < qstrs.length; i++){
            toks = qstrs[i].match(/([^=]+)=(.*)/);
            if(toks){
                addKeyValue(toks[1], toks[2]);
            }
            else if(qstrs[i]){
                addKeyValue(qstrs[i], '');
            }
        }
    };
    var parseUrl = function(){
        var parsed;
        var obj = {};
        urlObj = undefined;
        urlErr = new URLError();
        if(typeof urlStr !== 'string'){
            urlErr.addError('URL is not a string.');
            return;
        }
        parsed = urlStr.match(/^(.+)?:\/\/([^/?]+)(\/[^?#]*)?(\?([^?#]*))?(#(.*))?/);
        if(parsed === null){
            urlErr.addError('Invalid URL string.');
            return;
        }
        obj.scheme = parsed[1];
        obj.host = parseHost(parsed[2], obj);
        obj.path = parsed[3] || '/';
        obj.fragment = parsed[7];
        parseQuery(parsed[5], obj);
        urlObj = obj;
    };
    this.setUrlElement = function(key, val){
        var str;
        var qmatch;
        var queries = [];
        if(urlErr.hasError() || typeof urlObj !== 'object') return;
        urlObj[key] = val;
        str = urlObj.scheme;
        str += '://';
        if(urlObj.user){
            str += urlObj.user;
            if(urlObj.password){
                str += ':' + urlObj.password;
            }
            str += '@';
        }
        str += urlObj.host;
        if(urlObj.port !== '80'){
            str += ':' + urlObj.port;
        }
        str += urlObj.path;
        for(var key in urlObj){
            if(urlObj.hasOwnProperty(key)){
                qmatch = key.match(/^q\.(.+)$/);
                if(qmatch){
                    queries.push(qmatch[1] + '=' + encodeURIComponent(urlObj[key]));
                }
            }
        }
        if(queries.length > 0){
            str += '?' + queries.join('&');
        }
        if(urlObj.fragment){
            str += '#' + urlObj.fragment;
        }
        this.setUrl(str);
        parseUrl();
    };
    this.setUrl = function(u){
        console.log('set url', u);
        urlStr = u;
        parseUrl();
    };
    this.getUrl = function(){
        return urlStr;
    };
    this.getUrlObject = function(){
        return urlObj;
    };
    this.getErrorObj = function(){
        return urlErr;
    };
    parseUrl();
}

//var a = new URL('http://book:apple@www.chienwen.net:5566/search?p=pizza&addr=sunnyvale+ca#loc');
//console.log(a.getUrlObject());
//console.log('=================');

/*
if(process.argv[2]){
    a = new URL(process.argv[2]);
    console.log(a.getUrlObject());
    console.log(a.getErrorObj().getErrors());
    console.log(a.getErrorObj().getWarnings());
    console.log(a.getUrl());
    console.log('====================');
    a.setUrlElement('host', 'www.apple.com');
    console.log(a.getUrlObject());
    console.log(a.getErrorObj().getErrors());
    console.log(a.getErrorObj().getWarnings());
    console.log(a.getUrl());
}
//var a = new URL('http://book:apple@www.chienwen.net');
//var a = new URL('file:///Users/chienwen/Downloads/JS-Game/MyJSGame/MyJSGame/WebForm1.html');
*/
