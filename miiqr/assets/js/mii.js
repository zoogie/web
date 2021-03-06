const MII_MALE = false;
const MII_FEMALE = true;
const MII_RED = 0;
const MII_ORANGE = 1;
const MII_YELLOW = 2;
const MII_LIME = 3;
const MII_GREEN = 4;
const MII_BLUE = 5;
const MII_CYAN = 6;
const MII_PINK = 7;
const MII_PURPLE = 8;
const MII_BROWN = 9;
const MII_WHITE = 10;
const MII_BLACK = 11;

var mii;

function Mii(data) {
	// Encrypted
	if (data.length == 0x70) {
		// TODO: AES-CCM implementation + ask for 0x31 key to decrypt.
		console.warn("NIY");
	}
	// Decrypted without CRC
	if (data.length == 0x5c) {
		var tmp = new Uint8Array(0x60);
		data.copyWithin(tmp, 0);
		data = tmp;
	}
	// Decrypted with CRC
	if (data.length != 0x60) {
		throw "Wrong size :'(";
	}
	this.data = {
		id: {
			isSpecial: false,
			creationDate: "2010-01-01 00:00:00"
		},
		sysID: {
			mac: [0x00, 0x00, 0x00, 0x00]
		},
		face: {
			shape: 0,
			color: 0,
			makeup: 0,
			wrinkles: 0
		},
		hair: {
			style: 0,
			color: 0,
			flipped: false
		},
		eyebrows: {
			style: 0,
			color: 0,
			height: 0,
			space: 0,
			rotation: 0,
			size: 0,
			thickness: 0
		},
		eyes: {
			style: 0,
			color: 0,
			height: 0,
			space: 0,
			rotation: 0,
			size: 0,
			wideness: 0
		},
		noze: {
			style: 0,
			height: 0,
			size: 0
		},
		mouth: {
			style: 0,
			color: 0,
			height: 0,
			size: 0,
			wideness: 0
		},
		accessories: {
			glasses: {
				style: 0,
				color: 0,
				height: 0,
				size: 0
			},
			mustache: {
				style: 0,
				color: 0,
				height: 0,
				size: 0
			},
			mole: {
				active: false,
				vertPos: 0,
				horizPos: 0,
				size: 0
			},
			beard: {
				style: 0,
				color: 0
			}
		},
		body: {
			height: 0,
			weight: 0
		},
		infos: {
			name: "Mii",
			gender: MII_MALE,
			sharing: false,
			color: MII_RED,
			copying: false,
			birthDay: 1,
			birthMonth: 1,
			creator: "editMii"
		},
		integrity: {
			crc: 0x0000
		}
	};
	this.raw = Uint8Array.from(data);
};

/**
 * Many thanks to wiibrew.org for that ! However it seems the 3DS does not check value.
 * But hey, in case it's one day updated to check it, that's done :p
 */
Mii.prototype.updateCRC = function() {
    var crc = 0x0000;
    for (var byteIndex = 0; byteIndex < 0x5e; byteIndex++) {
        for (var bitIndex = 7; bitIndex >= 0; bitIndex--) {
            crc = (((crc << 1) | ((this.raw[byteIndex] >> bitIndex) & 0x1)) ^ (((crc & 0x8000) != 0) ? 0x1021 : 0)); 
        }
    }
    for (var counter = 16; counter > 0; counter--) {
        crc = ((crc << 1) ^ (((crc & 0x8000) != 0) ? 0x1021 : 0));
    }
    crc &= 0xFFFF;
    // Writes CRC to the Mii raw datas
    this.data.integrity.crc = crc;
    this.raw[0x5e] = crc >> 8;
    this.raw[0x5f] = crc & 0xFF;
    return crc;
}

Mii.prototype.saveEncrypted = function() {
	var encrypted = new Uint8Array(0x70);
	// TODO: Encrypt the Mii with AES-CCM and 0x31 key.
	Fman.downloadArray(encrypted, "mii.bin");
}

var miiCorresp = {
	face: [
	    0x00,0x01,0x08,
	    0x02,0x03,0x09,
	    0x04,0x05,0x0a,
	    0x06,0x07,0x0b
	],
	hairs: [
	    [0x21,0x2f,0x28,
	    0x25,0x20,0x6b,
	    0x30,0x33,0x37,
	    0x46,0x2c,0x42],
	    [0x34,0x32,0x26,
	    0x31,0x2b,0x1f,
	    0x38,0x44,0x3e,
	    0x73,0x4c,0x77],
	    [0x40,0x51,0x74,
	    0x79,0x16,0x3a,
	    0x3c,0x57,0x7d,
	    0x75,0x49,0x4b],
	    [0x2a,0x59,0x39,
	    0x36,0x50,0x22,
	    0x17,0x56,0x58,
	    0x76,0x27,0x24],
	    [0x2d,0x43,0x3b,
	    0x41,0x29,0x1e,
	    0x0c,0x10,0x0a,
	    0x52,0x80,0x81],
	    [0x0e,0x5f,0x69,
	    0x64,0x06,0x14,
	    0x5d,0x66,0x1b,
	    0x04,0x11,0x6e]
	    [0x7b,0x08,0x6a,
	    0x48,0x03,0x15,
	    0x00,0x62,0x3f,
	    0x5a,0x0b,0x78],
	    [0x05,0x4a,0x6c,
	    0x5e,0x7c,0x19,
	    0x63,0x45,0x23,
	    0x0d,0x7a,0x71],
	    [0x35,0x18,0x55,
	    0x53,0x47,0x83,
	    0x60,0x65,0x1d,
	    0x07,0x0f,0x70],
	    [0x4f,0x01,0x6d,
	    0x7f,0x5b,0x1a,
	    0x3d,0x67,0x02,
	    0x4d,0x12,0x5c],
	    [0x54,0x09,0x13,
	    0x82,0x61,0x68,
	    0x2e,0x4e,0x1c,
	    0x72,0x7e,0x6f]
	],
	eyebrows: [
	    [0x06,0x00,0x0c,
	    0x01,0x09,0x13,
	    0x07,0x15,0x08,
	    0x11,0x05,0x04],
	    [0x0b,0x0a,0x02,
	    0x03,0x0e,0x14,
	    0x0f,0x0d,0x16,
	    0x12,0x10,0x17]
	],
	nose: [
	    [0x01,0x0a,0x02,
	    0x03,0x06,0x00,
	    0x05,0x04,0x08,
	    0x09,0x07,0x0B],
	    [0x0d,0x0e,0x0c,
	    0x11,0x10,0x0f]
	],
	mouth: [
	    [0x17,0x01,0x13,
	    0x15,0x16,0x05,
	    0x00,0x08,0x0a,
	    0x10,0x06,0x0d],
	    [0x07,0x09,0x02,
	    0x11,0x03,0x04,
	    0x0f,0x0b,0x14,
	    0x12,0x0e,0x0c],
	    [0x1b,0x1e,0x18,
	    0x19,0x1d,0x1c,
	    0x1a,0x23,0x1f,
	    0x22,0x21,0x20]
	]
};