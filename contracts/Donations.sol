//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Donations {
    using SafeMath for uint256;

    address public owner;

    address[] public userAddresses;
    mapping(address => uint256) public donatedUsers;

    event Transfer(address sender, uint256 amount);
    event Withdraw(address reciever, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can withdraw donation");
        _;
    }

    function transfer() public payable {
        require(msg.value > 0, "Amount of ether can't be 0");
        payable(owner).transfer(msg.value);
        emit Transfer(msg.sender, msg.value);

        if (donatedUsers[msg.sender] == 0) {
            userAddresses.push(msg.sender);
        }

        donatedUsers[msg.sender] = donatedUsers[msg.sender].add(msg.value);
    }

    function withdraw(address _donationAddress)
        public
        payable
        onlyOwner
    {
        require(msg.value > 0, "Amount of ether can't be 0");
        payable(_donationAddress).transfer(msg.value);
        emit Withdraw(_donationAddress, msg.value);
    }

    function showDonatedUsers() external view returns (address[] memory) {
        return userAddresses;
    }

    function getTotalDonationAmountByAddress(address _donationAddress)
        external
        view
        returns (uint256)
    {
        return donatedUsers[_donationAddress];
    }
}
