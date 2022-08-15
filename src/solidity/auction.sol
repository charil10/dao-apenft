// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";


interface IERC721 {
    function ownerOf(uint256 tokenId) external view returns (address owner);
    function setApprovalForAll(address operator, bool approved) external;

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;
}

contract LoveLovesAuction is Ownable, ERC721Holder {

    mapping(address => uint256) public biderBurns;
    address[] public biders;

    bool public isOpen = false;
    uint256 public totalBurned = 0;

    IERC721 loveLoves;

    address targetAddress = 0x000000000000000000000000000000000000dEaD;

    constructor(address nftAddress) {
        loveLoves = IERC721(nftAddress);
    }

    function bid(uint256[] calldata ids) public {
        require(isOpen, "not start");
        require(ids.length > 0, "need love");

        if(biderBurns[msg.sender] == 0) {
          biders.push(msg.sender);
        }

        biderBurns[msg.sender] += ids.length;
        totalBurned += ids.length;

        for (uint i=0; i< ids.length; i++) {
            loveLoves.transferFrom(
                msg.sender, targetAddress, ids[i]
            );
        }
    }

    function toggleOpen() public onlyOwner {
        isOpen = !isOpen;
    }

    function setTarget(address newTarget) public onlyOwner {
        targetAddress = newTarget;
    }

    function totalBider() public view returns (uint256) {
        return biders.length;
    }

    function getBurnInfo(uint index) public view returns(address bider, uint burns) {
        bider = biders[index];
        burns = biderBurns[bider];
    }

    struct BurnInfo {
      address bider;
      uint burns;
    }

    function page(uint256 pageIndex, uint256 pageSize) public view returns (BurnInfo[] memory burners) {
        uint256 start = pageIndex * pageSize;
        uint256 length = _min(pageSize, start > biders.length ? 0: biders.length - start);
        burners = new BurnInfo[](length);
        for (uint i = 0; i < length ; i++) {
            (address bider, uint burns) = getBurnInfo(start + i);
            burners[i] = BurnInfo(bider, burns);
        }
    }

    function _min(uint a, uint b) internal pure returns (uint) {
      return a >= b ? b : a;
    }
}