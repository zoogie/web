//Fredtool functions
var buildWorker;
function checkMovable(file) {
    if (file.size!=320 && file.size!=288) {
            //alert("movable.sed is not the correct size. \nPlease ensure you are selecting the right file.");
            addStatus("Incorrect filesize for chosen movable.sed","text-danger");
            return false; 
        }
        return true;
}
function checkAltBanner(file) {
    return true;
}
function handleBWMessage(msg) {
    switch(msg.data.cmd) {
        case "addStatus":
            // [addStatus, [message,color]]
            addStatus(msg.data.val.msg,msg.data.val.color);
            break;
        case "download":
            download(msg.data.val.fname,msg.data.val.content);
            break;

    }
}
function buildDSiWare() {
    if (typeof(buildWorker) != "undefined") {
        buildWorker.terminate();
    }
    buildWorker = new Worker("bb3_buildworker.js"); //change please
    buildWorker.addEventListener('message', handleBWMessage);
    buildWorker.postMessage({cmd:"start",val:{keyy: hexToBig(document.getElementById('movablecontents').value).slice(0x110,0x120)}});

}
