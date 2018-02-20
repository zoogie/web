var tmp;


$(document).ready(function() {
	// Imports
	Fman.makeInput("#impDEC", function(data) {
		mii = new Mii(new Uint8Array(data));
		//alert("NIY");
	});
	Fman.makeInput("#impENC", function(data) {
		tmp = new Uint8Array(data);
	});
	Fman.makeInput("#impQRC", function(data) {
		// Read QR Code
		qrcode.callback = function(data) {
			var uint = new Uint8Array(data.length);
			for(var i = 0, j = data.length; i < j; ++i){
				uint[i] = data.charCodeAt(i);
			}
			tmp = uint;
		};
		qrcode.decode(data);
	}, {reader: "readAsDataURL"});
	// Exports
	$("#expDEC").on("click", function() {
		mii.updateCRC();
		Fman.downloadArray(mii.raw, "input.mii");
	});
	$("#expENC").on("click", function() {
		Fman.downloadArray(tmp, "input.bin");
	});
	$("#expQRC").on("click", function() {
		var str = "";
		for(var i = 0, j = tmp.length; i < j; ++i){
			if (tmp[i] < 16) {
				str += "%0" + (tmp[i].toString(16));
			} else {
				str += "%" + (tmp[i].toString(16));
			}
		}
		$("#qroutput").attr("src", "qrgen.php?data=" + str);
	});
});