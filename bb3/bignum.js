

function bighexToBytes(hex) {
    var bytes=[];
    if (hex.length >= 3) {
        if (hex.substr(0,2)=="0x") {
            hex = hex.substr(2);
        }
    }   
    if (hex.length % 2 == 1) {
            hex="0" + hex;
        }
        for (var bytes = [], c = 0; c < hex.length; c += 2)
           bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}
function hexToBig(hex) {
    return bighexToBytes(hex);
}
function bigtoHexString(byteArray) {
        return Array.prototype.map.call(byteArray, function(byte) {
            return ('0' + (byte & 0xFF).toString(16)).slice(-2);
        }).join('');
}


function bigShiftLeft(byteval,bits) {
    //var byteval = bighexToBytes(hexstring);
    var valbits = byteval.length * 8;
    var byteshift = Math.floor(bits/8);
    //delete full bytes from left for each byte shifted
    byteval = byteval.slice(byteshift);
    var addnext=0;
    for (var x=byteval.length-1;x>=0;x--) {
        var iword = byteval[x] << (bits % 8);
        byteval[x] = (iword & 0xFF)+addnext;
        addnext=iword >> 8;
    }
    //pad right for each full byte shifted
    for (var x=0;x<byteshift;x++) {
        byteval.push(0x00);
    }
    return byteval;
}
function bigCompare(byteval1,byteval2) {
    var byteval3 = [];
    for (;byteval1.length<byteval2.length;) {
        byteval1.push(0);
    }
    for (;byteval2.length<byteval1.length;) {
        byteval2.push(0);
    }
    for (var x=0;x<byteval1.length;x++ )
    {
        if (byteval1[x] < byteval2[x]) {
            return -1;
        }else if (byteval1[x] > byteval2[x]) {
            return 1;
        }
    }
    return 0;
}

function bigShiftRight(byteval,bits) {
    var byteshift = Math.floor(bits/8);

    var addnext=0;
    for (var x=0;x<byteval.length;x++) {
        var iword = (byteval[x] << 8);
        iword = iword >> (bits % 8);
        byteval[x] = (iword >> 8)+addnext;
        addnext = iword & 0xFF;
    }
    //delete full bytes from right for each byte shifted
    byteval=byteval.slice(0,byteval.length-byteshift);
    //pad left for each full byte shifted
    for (var x=0;x<byteshift;x++) {
        byteval.unshift(0x00);
    }
    return byteval;
}
function bigBitwise(op,byteval1,byteval2) {
    var byteval3 = [];
    for (;byteval1.length<byteval2.length;) {
        byteval1.push(0);
    }
    for (;byteval2.length<byteval1.length;) {
        byteval2.push(0);
    }
    for (var x=0;x<byteval1.length;x++){
        if (op=="and")
            byteval3.push(byteval1[x] & byteval2[x]);
        else if(op=="or") 
            byteval3.push(byteval1[x] | byteval2[x]);
        else if(op=="xor") 
            byteval3.push(byteval1[x] ^ byteval2[x]);
        else if(op=="mod") 
            byteval3.push(byteval1[x] % byteval2[x]);
        else   
            return "NaN";
    }
    return byteval3;
}
function bigAdd(byteval1,byteval2) {
    var byteval3 = [];
    for (;byteval1.length<byteval2.length;) {
        byteval1.push(0);
    }
    for (;byteval2.length<byteval1.length;) {
        byteval2.push(0);
    }
    var addnext=0;
    for (var x=byteval1.length-1;x>=0;x--) {
        var iword = byteval1[x] + byteval2[x]+addnext;
        addnext = (iword >> 8);
        byteval3.unshift(iword & 0xFF);
    }
    if (addnext>0) {
        byteval3.unshift(addnext);
    }
    return byteval3;
}

function bigSub(byteval1,byteval2) {
    var byteval3 = [];
    for (;byteval1.length<byteval2.length;) {
        byteval1.push(0);
    }
    for (;byteval2.length<byteval1.length;) {
        byteval2.push(0);
    }
    // can we subtract test
    var negative=1;
    for (var x=0;x<byteval1.length;x++) {
        if (byteval1[x] > byteval2[x]) {
            negative=0;
            break;
        }
    }
    if (negative == 1) {
        return "NaN";
    }
    var subnext=0;
    for (var x=0;x<byteval1.length;x++) {
        iword = byteval1[x]-subnext;
        if (iword < byteval2[x]) {
            iword += 0x100;
            subnext=1;
        }else{
            subnext=0;
        }
        byteval3.push(iword-byteval2[x]);
    }
    return byteval3;
}
