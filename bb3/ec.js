// Copyright 2007,2008  Segher Boessenkool  <segher@kernel.crashing.org>
// Licensed under the terms of the GNU GPL, version 2
// http://www.gnu.org/licenses/old-licenses/gpl-2.0.txt
// obtained from http://git.infradead.org/?p=users/segher/wii.git

// order of the addition group of points
//static u8 ec_N[31] =
//	"\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00"
//	"\x13\xe9\x74\xe7\x2f\x8a\x69\x22\x03\x1d\x26\x03\xcf\xe0\xd7";
const ec_N = hexToBytes("01000000000000000000000000000013E974E72F8A6922031D2603CFE0D7");
// base point
//static u8 ec_G[61] =
//	"\x00\xfa\xc9\xdf\xcb\xac\x83\x13\xbb\x21\x39\xf1\xbb\x75\x5f"
//	"\xef\x65\xbc\x39\x1f\x8b\x36\xf8\xf8\xeb\x73\x71\xfd\x55\x8b"
//	"\x01\x00\x6a\x08\xa4\x19\x03\x35\x06\x78\xe5\x85\x28\xbe\xbf"
//	"\x8a\x0b\xef\xf8\x67\xa7\xca\x36\x71\x6f\x7e\x01\xf8\x10\x52";
const ec_G = hexToBytes("00FAC9DFCBAC8313BB2139F1BB755FEF65BC391F8B36F8F8EB7371FD558B01006A08A41903350678E58528BEBF8A0BEFF867A7CA36716F7E01F81052");


//static const u8 square[17] =
//	"\x00\x01\x04\x05\x10\x11\x14\x15\x40\x41\x44\x45\x50\x51\x54\x55";
const square = [0x00,0x01,0x04,0x05,0x10,0x11,0x14,0x15,0x40,0x41,0x44,0x45,0x50,0x51,0x54,0x55];


function elt_copy(d, a)
{
	memcpy(d, a, 30);
}

function elt_zero(d)
{
	memset(d, 0, 30);
}

function elt_is_zero(d)
{
	for (var i = 0; i < 30; i++)
		if (d[i] != 0)
			return 0;

	return 1;
}

function elt_add(d, a, b)
{
	for (var i = 0; i < 30; i++)
		d[i] = a[i] ^ b[i];
}

function elt_mul_x(d, a)
{
	var carry, x, y;
	carry = a[0] & 1;

	x = 0;
	for (var i = 0; i < 29; i++) {
		y = a[i + 1];
		d[i] = x ^ (y >> 7);
		x = ((y << 1)&0xFF);
	}
	d[29] = x ^ carry;

	d[20] ^= ((carry << 2)&0xFF);
}

function elt_mul(d, a, b)
{
	var i, n;
	var mask;

	elt_zero(d);

	i = 0;
	mask = 1;
	for (n = 0; n < 233; n++) {
		elt_mul_x(d, d);

		if ((a[i] & mask) != 0)
			elt_add(d, d, b);

		mask >>= 1;
		if (mask == 0) {
			mask = 0x80;
			i++;
		}
	}
}

function elt_square_to_wide(d, a)
{
	var i;

	for (i = 0; i < 30; i++) {
		d[2*i] = square[a[i] >> 4];
		d[2*i + 1] = square[a[i] & 15];
	}
}

function wide_reduce(d)
{
	var i;
	var x;

	for (i = 0; i < 30; i++) {
		x = d[i];

		d[i + 19] ^= x >> 7;
		d[i + 20] ^= ((x << 1)&0xFF);

		d[i + 29] ^= x >> 1;
		d[i + 30] ^= ((x << 7)&0xFF);
	}

	x = d[30] & ~1;

	d[49] ^= x >> 7;
	d[50] ^= ((x << 1)&0xFF);

	d[59] ^= x >> 1;

	d[30] &= 1;
}

function elt_square(d, a)
{
	var wide = new Array(60);

	elt_square_to_wide(wide, a);
	wide_reduce(wide);

	elt_copy(d, wide.slice(30));
}

function itoh_tsujii(d, a, b, j)
{
	var t=new Array(30);

	elt_copy(t, a);
	while (j--) {
		elt_square(d, t);
		elt_copy(t, d);
	}

	elt_mul(d, t, b);
}

function elt_inv(d, a)
{
	var t = new Array(30);
	var s = new Array(30);

	itoh_tsujii(t, a, a, 1);
	itoh_tsujii(s, t, a, 1);
	itoh_tsujii(t, s, s, 3);
	itoh_tsujii(s, t, a, 1);
	itoh_tsujii(t, s, s, 7);
	itoh_tsujii(s, t, t, 14);
	itoh_tsujii(t, s, a, 1);
	itoh_tsujii(s, t, t, 29);
	itoh_tsujii(t, s, s, 58);
	itoh_tsujii(s, t, t, 116);
	elt_square(d, s);
}

function point_is_zero(p)
{
	return elt_is_zero(p) && elt_is_zero(p.slice(30));
}

function point_double(r, p)
{   

	var s = new Array(30);
    var t= new Array(30);
    var px=p.slice(0,30);
    var py=p.slice(30,60);
    var rx=r.slice(0,30);
    var ry=r.slice(30,60);

	if (elt_is_zero(px)) {
        memset(r,0,60);
		return;
	}

	elt_inv(t, px); // t = 1/px
	elt_mul(s, py, t); // s = py/px
	elt_add(s, s, px); // s = py/px + px

	elt_square(t, px); // t = px*px

	elt_square(rx, s); // rx = s*s
	elt_add(rx, rx, s); // rx = s*s + s
	rx[29] ^= 1; // rx = s*s + s + 1

	elt_mul(ry, s, rx); // ry = s * rx
	elt_add(ry, ry, rx); // ry = s*rx + rx
	elt_add(ry, ry, t); // ry = s*rx + rx + px*px
    for (var i=0;i<30;i++) {
        r[i]=rx[i];
        r[i+30]=ry[i];
    }
}

function point_add(r, p, q)
{
	var s = new Array(30);
    var t= new Array(30);
    var u = new Array(30);
    var px=p.slice(0,30);
    var py=p.slice(30,60);
    var rx=r.slice(0,30);
    var ry=r.slice(30,60);
    var qx=q.slice(0,30);
    var qy=q.slice(30,60);

	if (point_is_zero(p)) {
		for (var i=0;i<30;i++) {
			r[i]=qx[i];
			r[i+30]=qy[i];
		}
		return;
	}

	if (point_is_zero(q)) {
		for (var i=0;i<30;i++) {
			r[i]=px[i];
			r[i+30]=py[i];
		}
		return;
	}

	elt_add(u, px, qx);

	if (elt_is_zero(u)) {
		elt_add(u, py, qy);
		if (elt_is_zero(u))
			point_double(r, p);
		else {
            memset(r,0,60);
		}

		return;
	}

	elt_inv(t, u);
	elt_add(u, py, qy);
	elt_mul(s, t, u);

	elt_square(t, s);
	elt_add(t, t, s);
	elt_add(t, t, qx);
	t[29] ^= 1;

	elt_mul(u, s, t);
	elt_add(s, u, py);
	elt_add(rx, t, px);
	elt_add(ry, s, rx);
	for (var i=0;i<30;i++) {
		r[i]=rx[i];
		r[i+30]=ry[i];
	}
}

function point_mul(d, a, b)	// a is bignum //r2 w2 Q
{
	var i;
	var mask;
    memset(d,0,d.length);

	for (i = 0; i < 30; i++)
		for (mask = 0x80; mask != 0; mask >>= 1) {
			//console.log(toHexString(d));
			point_double(d, d);
			if ((a[i] & mask) != 0) {
				point_add(d, d, b);
			}
		}
}


function generate_ecdsa(R, S, k, hash)
{
	var e=new Array(30);
	var kk=new Array(30);
	var m=new Array(30);
    var minv=new Array(30);
	var mG=new Array(60);
	//srand(time(0));

	elt_zero(e);
	bn_shiftr(hash, 32, 7);
	memcpy(e, hash, 30);
	
	memset(m, 0, 30);

	m[29]=1;

	point_mul(mG, m, ec_G);
	elt_copy(R, mG);
	if (bn_compare(R, ec_N, 30) >= 0)
		bn_sub_modulus(R, ec_N, 30);

	elt_copy(kk, k);
	if (bn_compare(kk, ec_N, 30) >= 0)
		bn_sub_modulus(kk, ec_N, 30);
	bn_mul(S, R, kk, ec_N, 30);
	bn_add(kk, S, e, ec_N, 30);
	bn_inv(minv, m, ec_N, 30);
	bn_mul(S, minv, kk, ec_N, 30);



	return 0;
}


function check_ecdsa(Q, R, S, hash)
{
	var Sinv=new Array(30);
	var e=new Array(30);
	var w1=new Array(30);
    var w2=new Array(30);
	var r1=new Array(60);
    var r2=new Array(60).fill(0);

	bn_inv(Sinv, S, ec_N, 30);
	elt_zero(e);
	bn_shiftr(hash, 32, 7);  //shift right 7 bits.
	memcpy(e, hash, 30);     //then shift 16 more bits right by cutting off the last two bytes of 32 byte sha256.
                             //this gets our bignum sha256 hash to fit in the 233 bit limit of this ecdsa curve.
	bn_mul(w1, e, Sinv, ec_N, 30);
	bn_mul(w2, R, Sinv, ec_N, 30);

	point_mul(r1, w1, ec_G);
	point_mul(r2, w2, Q);

	point_add(r1, r1, r2);

	if (bn_compare(r1, ec_N, 30) >= 0)
		bn_sub_modulus(r1, ec_N, 30);

	return (bn_compare(r1, R, 30) == 0);
}

function ec_priv_to_pub(k, Q)
{
	point_mul(Q, k, ec_G);
}
