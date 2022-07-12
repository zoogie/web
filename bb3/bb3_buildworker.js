

function addStatus(msg,color) {
    self.postMessage({cmd:"addStatus",val:{msg:msg,color:color}});
}

importScripts('iefix.js');
importScripts('aes.js');
importScripts('cmac.js');
importScripts('sha256.js');
importScripts('common.js');
importScripts('bignum.js');
importScripts('keyAlg.js');
importScripts('bn.js');
importScripts('ec.js');
importScripts('jszip.js');
importScripts('crc16.js');

const HashVal="TUhneFJrWTVSVGxCUVVNMVJrVXdOREE0TURJME5Ua3hSRU0xUkRVeU56WTRRUT09TUhoak5qWmxNak14TWpobU1qZzVNVE16WmpBMFkyUmlPRGMzWVRNM05EbG1NZz09TUhnMlJrSkNNREZHT0RjeVEwRkdPVU13TVRnek5FVkZRekEwTURZMVJVVTFNdz09TUhoQ05USTVNakl4UTBSRVFqVkVRalZCTVVKR01qWkZSa1l5TURReFJUZzNOUT09";
var keyy=[];
var dsiWareHeader=[];
var hashingTools=[];
var payload_size = 256;
var payload=new Array( //lenny
    0x60, 0x67, 0x14, 0x00, 0x60, 0xCB, 0x28, 0x00, 0x58, 0x16, 0x1A, 0x00, 0xEF, 0xBE, 0xAD, 0xDE,
    0x00, 0xBE, 0xAD, 0xDE, 0xEF, 0xBE, 0xAD, 0xDE, 0x60, 0x67, 0x14, 0x00, 0xE2, 0xFE, 0xFF, 0x0F,
    0x88, 0x37, 0x24, 0x00, 0xEF, 0xBE, 0xAD, 0xDE, 0x55, 0x46, 0x16, 0x00, 0x00, 0x90, 0x6A, 0x00,
    0xCC, 0xFE, 0xFF, 0x0F, 0x01, 0x00, 0x01, 0x00, 0x10, 0x79, 0x1C, 0x00, 0xEF, 0xBE, 0xAD, 0xDE,
    0xEF, 0xBE, 0xAD, 0xDE, 0xEF, 0xBE, 0xAD, 0xDE, 0xEF, 0xBE, 0xAD, 0xDE, 0xEF, 0xBE, 0xAD, 0xDE,
    0xE5, 0xC0, 0x22, 0x00, 0x00, 0x90, 0x6A, 0x00, 0x20, 0x90, 0x6A, 0x00, 0x00, 0xA0, 0x6A, 0x00,
    0x00, 0x02, 0x08, 0x00, 0x44, 0x31, 0x1C, 0x00, 0xEF, 0xBE, 0xAD, 0xDE, 0xEF, 0xBE, 0xAD, 0xDE,
    0xC8, 0xFE, 0xFF, 0x0F, 0x00, 0xA0, 0x6A, 0x00, 0xD4, 0xA1, 0x11, 0x00, 0xD4, 0xA1, 0x11, 0x00,
    0x40, 0x5B, 0x1D, 0x00, 0x59, 0x00, 0x53, 0x00, 0x3A, 0x00, 0x2F, 0x00, 0x62, 0x00, 0x62, 0x00,
    0x33, 0x00, 0x2E, 0x00, 0x62, 0x00, 0x69, 0x00, 0x6E, 0x00, 0x21, 0x00, 0xEF, 0xBE, 0xAD, 0xDE,
    0xEF, 0xBE, 0xAD, 0xDE, 0xEF, 0xBE, 0xAD, 0xDE, 0xEF, 0xBE, 0xAD, 0xDE, 0xEF, 0xBE, 0xAD, 0xDE,
    0xEF, 0xBE, 0xAD, 0xDE, 0xEF, 0xBE, 0xAD, 0xDE, 0xEF, 0xBE, 0xAD, 0xDE, 0xEF, 0xBE, 0xAD, 0xDE,
    0xEF, 0xBE, 0xAD, 0xDE, 0xEF, 0xBE, 0xAD, 0xDE, 0xEF, 0xBE, 0xAD, 0xDE, 0xEF, 0xBE, 0xAD, 0xDE,
    0x18, 0xFF, 0xFF, 0x0F, 0xEF, 0xBE, 0xAD, 0xDE, 0xEF, 0xBE, 0xAD, 0xDE, 0xEF, 0xBE, 0xAD, 0xDE,
    0x40, 0x5B, 0x1D, 0x00, 0x18, 0xFF, 0xFF, 0x0F, 0xEF, 0xBE, 0xAD, 0xDE, 0xE8, 0xFE, 0xFF, 0x0F,
    0x48, 0xFE, 0xFF, 0x0F, 0x44, 0xFF, 0xFF, 0x0F, 0xD4, 0xA1, 0x11, 0x00, 0xEF, 0xBE, 0xAD, 0xDE
);

self.onmessage = function (msg) {
    switch (msg.data.cmd) {
        case 'start':
                keyy=msg.data.val.keyy;
                dsiWareBanner=msg.data.val.dsiWareBanner;
                //console.log("https://bruteforcemovable.com/vault?keyY=KEYYHEX");
                //console.log("keyy:" + toHexString(keyy));
                sendkeyy(keyy);
                BuildDSiWare();
            break;
        default:
            throw 'no command on incoming message to Worker';
    }
}

function generateSection(output, data, keyy) {
        var kCmac = scrambleKey(atob(HashVal.substr(192,64)),keyy,atob(HashVal.substr(0,64)));
        var knorm = scrambleKey(atob(HashVal.substr(128,64)),keyy,atob(HashVal.substr(0,64)));
        var iv = new Array(0x10);
        iv.fill(0);
        //encryptAES(data, data.length, knorm, allzero, dsiware_pointer);
        var aesCbc = new aesjs.ModeOfOperation.cbc(knorm, iv);
        var encData=aesCbc.encrypt(data);
        var section_hash = new Array(0x20);
        section_hash.fill(0);
        var section_cmac = new Array(0x20);
        section_cmac.fill(0);
        section_hash=sha256.array(data)
        var cmac=aesCmac(kCmac,section_hash);
//        var message=CryptoJS.enc.Hex.parse(section_hash);
//        var key1 = CryptoJS.enc.Hex.parse(toHexString(kCmac));
//        var mac = CryptoJS.CMAC(key1, message);
//        cmac=hexToBig(mac.toString());
        for (var i=0;i<encData.length;i++) {
            output[i]=encData[i];
        }
        for (var i=0;i<cmac.length;i++) {
            output[i+encData.length]=cmac[i];
        }
        output.fill(0,encData.length+cmac.length,0x10);
}
function isdone(content) {
    addStatus("Movable data integrated");
}
function BuildDSiWare() {
    addStatus("Building DSiWare hacks.","text-muted")
    if (keyy.length < 16) {
        addStatus("Build clicked when files were not loaded","text-warning");
        return;
    }
    var zip = new JSZip();

    // HAX
        
    addStatus("Generating BannerBomb3 Exporter dsiware","text-info");
        var header = new Array(0xF0).fill(0);
        var banner = new Array(0x4000).fill(0);
        if (typeof(dsiWareBanner) == "undefined") {
            banner = hexToBig("0103").reverse().concat(Array(0x23E).fill(0x77))
            for (var i=0;i<8;i++)
            {
                banner = banner.concat(payload);
            }
            
            banner=banner.concat(Array(0x4000-0x1240).fill(0x77)).concat(Array(0x4000-0x3800).fill(0));
        }else{
            banner=dsiWareBanner;
        }
            header = hexToBig("0400000054444633").reverse().concat(Array(0x20).fill(0x42)).concat(Array(0x10).fill(0x99)).concat(hexToBig("F00D43D5").reverse()).concat(Array(0xB4).fill(0));
        
        var newcrc=[];
        newcrc=newcrc.concat(crc16(banner.slice(0x20,0x840)));
        newcrc=newcrc.concat(crc16(banner.slice(0x20,0x940)));
        newcrc=newcrc.concat(crc16(banner.slice(0x20,0xA40)));
        newcrc=newcrc.concat(crc16(banner.slice(0x1240,0x23C0)));
        for (var i=0;i<0x08;i++) {
            banner[i+2]=newcrc[i];
        }

        //	memset(&Header.sha256_ivs[0], 0x42, 0x20);
	//memset(&Header.aes_zeroblock[0], 0x99, 0x10);
	//Header.tidlow=Tidlow;         //0x484E4441 0xF00D43D5

        var headerSection = new Array(0xF0+0x20);
        headerSection.fill(0);
        var bannerSection = new Array(banner.length+0x20);
        bannerSection.fill(0);
        generateSection(bannerSection,banner,keyy);
        generateSection(headerSection,header,keyy);
        var footerSection = new Array(0x4E0+0x20).fill(0);
        var footer = new Array(0x4E0).fill(0);
        generateSection(footerSection,footer,keyy);
        //placeSection((dsiware + 0x4630), tmd, tmd_size, normalKey, normalKey_CMAC);
        //placeSection((dsiware + 0x5190), injection, injection_size, normalKey, normalKey_CMAC);
        addStatus("BannerBomb3 Exporter dsiware generated.","text-success");
        DownloadDSiWare= Uint8Array.from(bannerSection.concat(headerSection).concat(footerSection));
        zip.file("F00D43D5.bin",DownloadDSiWare);
//        download("42383841.bin",DownloadDSiWare);
//        console.log("file size: " + (DownloadDSiWare.length));

    
    addStatus("Zipping and Downloading exploit.","text-success");
    zip.generateAsync({type:"blob"}).then(function(content) {
    // see FileSaver.js
    self.postMessage({cmd:"download",val:{fname:"BannerBomb3.zip",content:content}});
    self.close();
    //        download("fredtool.zip",content);
});
}
