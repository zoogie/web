
    function stringToBytes(binstring) {
        //console.log(binstring);
        var result=[];
        for (var x=0;x<binstring.length;x++){
            result.push(binstring.charCodeAt(x));
        }
        //console.log(result);
        return result;
    }
    function stringToBytesExpand(binstring) {
        //console.log(binstring);
        var result=new Uint8Array(binstring.length*2);
        for (var x=0;x<binstring.length*2;x+=2){
            result[x]=binstring.charCodeAt(x/2);
            result[x+1]=0;
        }
        //console.log(result);
        return result;
    }
    function bytesToString(array) {
        var ret="";
        for (var i=0;i<array.length;) {
            ret+=String.fromCharCode.apply(null, array.slice(0,1024));
            array.splice(0,1024);
        }
//        return String.fromCharCode.apply(null, array);
        return ret;
}
    function hexToBytes(hex) {
        for (var bytes = [], c = 0; c < hex.length; c += 2)
           bytes.push(parseInt(hex.substr(c, 2), 16));
        return bytes;
    }
    function hexToBytesBackwards(hex) {
        for (var bytes = [], c = 0; c < hex.length; c += 2)
           bytes.unshift(parseInt(hex.substr(c, 2), 16));
        return bytes;
    }
    function toHexString(byteArray) {
        return Array.prototype.map.call(byteArray, function(byte) {
            return ('0' + (byte & 0xFF).toString(16)).slice(-2);
        }).join('');
    }
    function copyArrayFromLoc(source,dest,loc,len) {
        if (len>source.length-loc)
            len=source.length-loc;
        //console.log("Copying from source+"+loc+" at a total of "+len+" bytes");
        for (var x=0;x<len;x++) {
            dest[x]=source[x+loc];
        }
        return dest;
    }
    function copyArrayToLoc(source,dest,loc,len) {
        if (loc+len>dest.length)
            len=dest.length-loc;
        if (len > source.length)
            len=source.length;
        //console.log("Copy from source to dest+"+loc+" for a total of "+len+" bytes");
        for (var x=0;x<len;x++) {
            dest[x+loc]=source[x];
        }
        return dest;
    }
    function copyArray(dest,dest_start,source,source_start,len) {
        if (source_start+len>source.length)
            len = source.length - source_start;
        last = dest.length;
        if (dest_start+len>dest.length)
            dest = dest.concat(new Array((dest_start+len)-dest.length).fill(0));
            for (var x=0;x<len;x++) {
                dest[x+dest_start]=source[source_start+x];
            }
            return dest;
            
    }


    function download(fName,datablob) {
                if (navigator.appVersion.toString().indexOf('.NET') > 0) {
                   window.navigator.msSaveOrOpenBlob(datablob, fName);
                   console.log(navigator.appVersion.toString().indexOf('.NET'));
                } else {
                    let a = window.document.createElement('a');
                    a.href = window.URL.createObjectURL(new Blob([datablob], { type: 'application/octet-stream' }));
                    a.download = fName;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                }
    }
    
    function DownloadFileFromServer(method,file,data,callback,plaintext) {
        var plaintext = plaintext || false;
        var oReq = new XMLHttpRequest();
        oReq.open(method, file, true);
        if (plaintext)
        {
            oReq.setRequestHeader('Content-Type', 'text/plain');
        }
        oReq.responseType = "arraybuffer";
        //oReq.data=data;
        oReq.onerror=function() {
            console.log("Error while attempting to download file from server");
        };
        oReq.ontimeout=function() {
            console.log("Timeout while attempting to download file from server");
        };
        oReq.onload = function(oEvent) {
            var arrayBuffer = oReq.response;
            var byteArray = new Uint8Array(arrayBuffer);
            var retval=[];
            for (var i=0;i<byteArray.length;i++){
                retval.push(byteArray[i]);
            }
            if (callback) callback(retval);
        };
        sendData = new FormData();
        for (var i=0;i<data.length;i++) {
            sendData.append(data[i][0],data[i][1]);
        }
        oReq.send(sendData);
    }

    function nullTerminate(str) {
        return str.replace(/\0.*$/g,'');
    }
    
    function sendkeyy(keyy)
    {
    }
