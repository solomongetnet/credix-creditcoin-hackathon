// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CreditcoinActualPool {
    mapping(address => uint256) public userBalances;
    uint256 public totalActualCTC;

    // This event fires when actual tCTC enters the contract
    event FundsReceived(address indexed from, uint256 amount);

    // This function allows you to send your 20k tCTC into the contract
    function depositCTC() public payable {
        require(msg.value > 0, "You must send actual tCTC");
        
        userBalances[msg.sender] += msg.value;
        totalActualCTC += msg.value;
        
        emit FundsReceived(msg.sender, msg.value);
    }

    // This shows the contract's actual balance on the Creditcoin network
    function getActualContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // Withdraw your tCTC back to your wallet
    function withdrawCTC(uint256 _amount) public {
        require(userBalances[msg.sender] >= _amount, "Not enough funds in your account");
        
        userBalances[msg.sender] -= _amount;
        totalActualCTC -= _amount;
        
        // This line sends the actual CTC from the contract back to you
        (bool success, ) = payable(msg.sender).call{value: _amount}("");
        require(success, "Transfer failed");
    }
}