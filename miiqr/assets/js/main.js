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
	// Read QR Code
	qrcode.callback = function(data) {
		var uint = new Uint8Array(data.length);
		for(var i = 0, j = data.length; i < j; ++i){
			uint[i] = data.charCodeAt(i);
		}
		tmp = uint;
	};
	Fman.makeInput("#impQRC", function(data) {
		qrcode.decode(data);
	}, {reader: "readAsDataURL"});
	$("#impQRU").on("click", function() {
		try {
			qrcode.decode(new URL(prompt("Input QR code URL:")));
		} catch(e) {
		}
	});
	$(document).on("paste", function (e) {
		e.preventDefault();
		Array.from(e.originalEvent.clipboardData.files).forEach(function (item) {
			if (item && item.type.startsWith("image/")) {
				qrcode.decode(URL.createObjectURL(item));
			}
		});
	});
	$(document).on("dragover", function (e) {
		e.preventDefault();
	});
	$(document).on("drop", function (e) {
		e.preventDefault();
		Array.from(e.originalEvent.dataTransfer.items).forEach(function (item) {
			if (item) {
				if (item.type === "text/plain") {
					item.getAsString(function (text) {
						try {
							qrcode.decode(new URL(text));
						} catch(e) {
						}
					});
				} else if (item.type === "application/octet-stream") {
					var file = item.getAsFile();
					if (file.size == 112 && file.name.endsWith(".bin")) {
						var reader = new FileReader();
						reader.onload = function (e) {
							tmp = new Uint8Array(e.target.result);
						};
						reader.readAsArrayBuffer(file);
					} else if (file.name.endsWith(".mii")) {
						var reader = new FileReader();
						reader.onload = function (e) {
							mii = new Mii(new Uint8Array(data));
						};
						reader.readAsArrayBuffer(file);
					}
				} else if (item.type.startsWith("image/")) {
					var reader = new FileReader();
					reader.onload = function (e) {
						qrcode.decode(e.target.result);
					};
					reader.readAsDataURL(item.getAsFile());
				}
			}
		});
	});
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
