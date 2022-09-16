pragma solidity ^0.8.0;

// 0x5627D2937210041a8947931b155eFb384548D8f6

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Valve{

    struct elem{
        uint256 percent;
        address addr;
    }

    function distribute(address token, elem[] calldata elems, uint256 distributeAmount) external{
        require(IERC20(token).allowance(msg.sender, address(this)) > distributeAmount, "Token need allowance");
        for (uint index = 0; index < elems.length; index++){
            IERC20(token).transferFrom(msg.sender, elems[index].addr, distributeAmount / 100 * elems[index].percent);
        }
    }
}