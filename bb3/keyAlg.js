    
    function rol(val, r_bits, max_bits) {
        //val=bigToHexString(val);
        bitsize = max_bits / 8;
        bitmask=new Array(bitsize);
        bitmask.fill(0xFF);
        if (max_bits % 8 > 0)
            bitmask.push(parseInt('1'.repeat(max_bits % 8),2));
        //return (val << r_bits % max_bits) & (2 ** max_bits - 1) | ((val & (2 ** max_bits - 1)) >> (max_bits - (r_bits % max_bits)))
        var trimstart = val.length-bitmask.length;
        if (trimstart<0) {
            trimstart = 0;
        }
        var v1 = val.slice(trimstart);
        var v2 = v1;
        // trim to only desired array length based on bits.
        v1 = bigBitwise("and", bigShiftLeft(v1,(r_bits % max_bits)),bitmask);
        v2 = bigShiftRight(bigBitwise("and",v2,bitmask),(max_bits - (r_bits % max_bits)));
        return bigBitwise("or",v1,v2);   
    }
    function scrambleKey(x,y,c) {
        x = hexToBig(atob(x));
        c = hexToBig(atob(c));
        //console.log(x);
        //console.log(y);
        //console.log(c);
        return rol(bigAdd(bigBitwise("xor",rol(x, 2, 128), y), c), 87, 128)
    }