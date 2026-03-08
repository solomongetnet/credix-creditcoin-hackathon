// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract GFCPLoan {

    IERC20 public cCTC;
    address public admin;

    // Optional global default limit if a specific one is not set, or max cap
    uint256 public globalLoanLimit = 1000 * 10**18;
    
    // Track each user's credit limit based on their CrediX Score
    mapping(address => uint256) public userCreditLimits;

    constructor(address _cCTC) {
        require(_cCTC != address(0), "Invalid token address");
        cCTC = IERC20(_cCTC);
        admin = msg.sender;
    }

    struct Loan {
        uint256 id;
        address borrower;
        uint256 amount;
        uint256 timestamp;
        bool repaid;
    }

    uint256 public loanCounter;

    mapping(uint256 => Loan) public loans;
    mapping(address => uint256[]) public userLoans;

    event LoanRequested(address borrower, uint256 loanId, uint256 amount);
    event LoanRepaid(address borrower, uint256 loanId);
    event AdminWithdraw(address to, uint256 amount);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    // User requests a loan
    function requestLoan(uint256 amount) external {
        require(amount > 0, "Amount must be greater than zero");
        
        uint256 userLimit = userCreditLimits[msg.sender];
        require(userLimit > 0, "No credit limit set");
        require(amount <= userLimit, "Exceeds max loan limit for user");
        require(
            cCTC.balanceOf(address(this)) >= amount,
            "Contract has insufficient funds"
        );

        loanCounter++;

        loans[loanCounter] = Loan({
            id: loanCounter,
            borrower: msg.sender,
            amount: amount,
            timestamp: block.timestamp,
            repaid: false
        });

        userLoans[msg.sender].push(loanCounter);

        cCTC.transfer(msg.sender, amount);

        emit LoanRequested(msg.sender, loanCounter, amount);
    }

    // User repays a loan
    function repayLoan(uint256 loanId) external {
        Loan storage loan = loans[loanId];

        require(loan.borrower == msg.sender, "Not borrower");
        require(!loan.repaid, "Already repaid");

        cCTC.transferFrom(msg.sender, address(this), loan.amount);

        loan.repaid = true;

        emit LoanRepaid(msg.sender, loanId);
    }

    // Admin can withdraw tokens if needed
    function adminWithdraw(uint256 amount) external onlyAdmin {
        require(amount <= cCTC.balanceOf(address(this)), "Insufficient pool");
        cCTC.transfer(admin, amount);
        emit AdminWithdraw(admin, amount);
    }

    // Set user credit limit based on CrediX Score
    function setUserCreditLimit(address user, uint256 limit) external onlyAdmin {
        userCreditLimits[user] = limit;
    }

    // Check available cCTC in the pool
    function getAvailablePool() external view returns (uint256) {
        return cCTC.balanceOf(address(this));
    }

    // Get all loan IDs for a user
    function getUserLoans(address user) external view returns (uint256[] memory) {
        return userLoans[user];
    }
}