
    var const_Zero = new Array(16).fill(0);
    var const_Rb = [0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x87];
    var const_blockSize = 16;
    
    function generateSubkeys(key) {
      var l = aes(key, const_Zero);
    
      var subkey1 = bigShiftLeft(l,1);
      if (l[0] & 0x80) {
        subkey1 = bigBitwise("xor",subkey1, const_Rb);
      }
    
      var subkey2 = bigShiftLeft(subkey1);
      if (subkey1[0] & 0x80) {
        subkey2 = bigBitwise("xor",subkey2, const_Rb);
      }
    
      return { subkey1: subkey1, subkey2: subkey2 };
    };
    
    function aes(key, message) {
      var aesCbc = new aesjs.ModeOfOperation.cbc(key, const_Zero);
      var result=aesCbc.encrypt(message);
      return result;
    }
    
    function aesCmac(key, message) {
      var subkeys = generateSubkeys(key);
      var blockCount = Math.ceil(message.length / const_blockSize);
      var lastBlockCompleteFlag, lastBlock, lastBlockIndex;
    
      if (blockCount === 0) {
        blockCount = 1;
        lastBlockCompleteFlag = false
      } else {
        lastBlockCompleteFlag = (message.length % const_blockSize === 0);
      }
      lastBlockIndex = blockCount -1;
    
      if (lastBlockCompleteFlag) {
        lastBlock = bigBitwise("xor",getMessageBlock(message, lastBlockIndex), subkeys.subkey1);
      } else {
        lastBlock = bigBitwise("xor",getPaddedMessageBlock(message, lastBlockIndex), subkeys.subkey2);
      }
    
      var x = Array.from(const_Zero);
      var y;
    
      for (var index = 0; index < lastBlockIndex; index++) {
        y = bigBitwise("xor",x, getMessageBlock(message, index));
        x = aes(key, y);
      }
      y = bigBitwise("xor",lastBlock, x);
      return aes(key, y);
    };
    
    function getMessageBlock(message, blockIndex) {
      var block = new Array(const_blockSize);
      var start = blockIndex * const_blockSize;
      var end = start + const_blockSize;
    
      //message.copy(block, 0, start, end);
      block = copyArray(block,0,message,start,end);
      return block;
    }
    
    function getPaddedMessageBlock(message, blockIndex) {
      var block = new Array(const_blockSize);
      var start = blockIndex * const_blockSize;
      var end = message.length;
    
      block.fill(0);
      block=copyArray(block,0,message,start,end);
//      message.copy(block, 0, start, end);
      block[end - start] = 0x80;
    
      return block;
    }
    