pragma solidity 0.4.24;
pragma experimental ABIEncoderV2;

import "./myERC20.sol";

contract MyEmojiExchange is myERC20 {
    struct Balance {
      // uint8 emojiIndex;
      uint8 emojiCount;
      uint256 emojiPrice;
    }

    string public name;
    string public symbol;
    uint8 public decimals;

    uint8 constant PRICEDEPTH = 64;
    // uint256 constant public COSTMULTIPLIER = 1000;
    address mainAccount;

    mapping(address => bool) private initialisedAccounts;
    mapping (address => mapping (uint8 => uint8)) emojiBalance;
    uint8[] emojiInventory = new uint8[](8);

    uint8 constant STARTING_VOL = 255;
    uint256 constant TOTAL_SUPPLY = 100000000;
    
    constructor(string _name, string _symbol, uint8 _decimals)
      myERC20()
      public 
    {
      name = _name;
      symbol = _symbol;
      decimals = _decimals;

      emojiInventory[0]=STARTING_VOL;
      emojiInventory[1]=STARTING_VOL;
      emojiInventory[2]=STARTING_VOL;
      emojiInventory[3]=STARTING_VOL;
      emojiInventory[4]=STARTING_VOL;
      emojiInventory[5]=STARTING_VOL;
      emojiInventory[6]=STARTING_VOL;
      emojiInventory[7]=STARTING_VOL;

      mainAccount = msg.sender;
      mint(msg.sender, TOTAL_SUPPLY); // * 10**decimals);
      increaseAllowance(msg.sender, TOTAL_SUPPLY);
    }

    // event BuyEmoji(address sender, uint8 index, uint256 fullPrice);
    // event SellEmoji(address sender, uint8 index, uint256 fullPrice);

    function initialDeposit(address to, uint256 amount) public payable returns (bool) {
      if (initialisedAccounts[to]) {
        return false;
      }
      
      transfer(to, amount);
      increaseMainAccountAllowance(to, TOTAL_SUPPLY);
      initialisedAccounts[to] = true;

      return true;
    }

    function mint(address to, uint256 amount) public returns (bool) {
      _mint(to, amount);
      return true;
    }

    function getEmojiPrice(uint8 index) public view returns (uint256){
      uint256 x = 0;
      for(uint8 depth=PRICEDEPTH;depth>0;depth--){
        bytes32 blockHash = blockhash(block.number-depth);
        uint8 thisBlockValue = uint8(blockHash[index*2]) << 8 | uint8(blockHash[index*2+1]);
        x=x+(uint256(thisBlockValue));
      }
      return uint256(x/PRICEDEPTH) + emojiInventory[index];
    }

    function buyEmoji(address buyer, uint8 index) public returns (bool){
      uint256 price = getEmojiPrice(index);

      require(balanceOf(buyer) > price, "buyEmoji: buyer's balance is too low");
      require(emojiInventory[index] >= 1, "buyEmoji: emojiInventory balance is 0");

      transferFrom(buyer, mainAccount, price);
      emojiInventory[index]--;
      emojiBalance[buyer][index]++;

      // emit BuyEmoji(buyer, index, fullPrice);
      return true;
    }

    function sellEmoji(address seller, uint8 index) public returns (bool){
      uint256 price = getEmojiPrice(index);

      require(emojiBalance[seller][index] > 0, "sellEmoji: emojiBalance of seller is 0");

      transferFrom(mainAccount, seller, price);
      emojiInventory[index]++;
      emojiBalance[seller][index]--;

      // emit SellEmoji(msg.sender, index, fullPrice);
      return true;
    }

    function emojiBalanceOf(address addr, uint8 index) external view returns (uint8) {
      return emojiBalance[addr][index];
    }

    function fullEmojiBalanceOf(address addr) external view returns (Balance[8]) {
      Balance[8] memory result;
      for (uint8 i = 0; i < 8; i++) {
        result[i].emojiCount = emojiBalance[addr][i];
        result[i].emojiPrice = getEmojiPrice(i);
      }
      return result;
    }
}