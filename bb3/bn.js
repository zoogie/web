// Copyright 2007,2008  Segher Boessenkool  <segher@kernel.crashing.org>
// Licensed under the terms of the GNU GPL, version 2
// http://www.gnu.org/licenses/old-licenses/gpl-2.0.txt
// obtained from http://git.infradead.org/?p=users/segher/wii.git
// Modified for JS 2019

function memset(array,value,length,start) {
	var start = start || 0;
	if (array.length < length) {
		length=array.length;
	}
	array.fill(value,start,length);
}
function memcpy(target,source,length,start) {
	var start = start || 0;
	if (target.length < length) {
		length=target.length;
	}
	if (source.length < length) {
		length=source.length;
	}
	for (var i =0;i<length;i++) {
		target[i+start]=source[i];
	}
}
function bn_zero(d,n) {
	memset(d,0,n);
}
function bn_copy(d,a,n)
{
	memcpy(d, a, n);
}

function bn_compare(a,b,n)
{

	for (var i = 0; i < n; i++) {
		if (a[i] < b[i])
			return -1;
		if (a[i] > b[i])
			return 1;
	}

	return 0;
}

function bn_sub_modulus(a,N,n)
{
	var dig;
	var c;

	c = 0;
	for (var i = n - 1; i >= 0; i--) {
		dig = N[i] + c;
		c = (a[i] < dig)
		a[i] = (a[i] - dig) & 0xFF;
	}
}

function bn_add(d,a,b,N,n)
{
	var dig;
	var c;

	c = 0;
	for (var i = n - 1; i >= 0; i--) {
		dig = a[i] + b[i] + c;
		c = (dig >= 0x100);
		d[i] = (dig & 0xFF);
	}

	if (c) {
		bn_sub_modulus(d, N, n);
	}
	if (bn_compare(d, N, n) >= 0)
		bn_sub_modulus(d, N, n);
}

function bn_mul(d,a,b,N, n)
{
	var i;
	var mask;

	bn_zero(d, n);

	for (i = 0; i < n; i++)
		for (mask = 0x80; mask != 0; mask >>= 1) {
			bn_add(d, d, d, N, n);
			if ((a[i] & mask) != 0) {
				bn_add(d, d, b, N, n);
			}
		}
}

function bn_exp(d,a,N,n,e,en)
{
	
	var t= new Array(512);
	var i;
	var mask;

	bn_zero(d, n);
	d[n-1] = 1;
	for (i = 0; i < en; i++)
		for (mask = 0x80; mask != 0; mask >>= 1) {
			bn_mul(t, d, d, N, n);
			if ((e[i] & mask) != 0)
				bn_mul(d, t, a, N, n);
			else
				bn_copy(d, t, n);
		}
}

// only for prime N -- stupid but lazy, see if I care
function bn_inv(d,a,N,n)
{
	var t=new Array(512);
	var s=new Array(512);

	bn_copy(t, N, n);
	bn_zero(s, n);
	s[n-1] = 2;
	bn_sub_modulus(t, s, n);
	bn_exp(d, a, N, n, t, n);
}

function bn_shiftr(input,size,shiftn){ //this is to help convert sha1 ecdsa to sha256. this curve is limited to 233 bits so the 256 bit hash needs to be shifted right 23 bits. 
	var carry=0;
	var temp=0;
	for(var j=0;j<shiftn;j++){
		for(var i=0;i<size;i++){
			temp=input[i] &1;
			input[i]=input[i] >> 1 | carry<<7;
			carry=temp;
		}
		carry=0; temp=0;
	}
}