// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CrediX {
    struct Freelancer {
        uint256 totalLoans;
        uint256 repaidLoans;
        uint256 creditScore; // simulated score
        bool exists;
    }

    struct Loan {
        address freelancer;
        uint256 amount;
        bool repaid;
    }

    mapping(address => Freelancer) public freelancers;
    Loan[] public loans;

    // Event logs
    event LoanRequested(address indexed freelancer, uint256 amount, uint256 loanId);
    event LoanRepaid(address indexed freelancer, uint256 amount, uint256 newCreditScore);

    // Register a freelancer
    function registerFreelancer() external {
        require(!freelancers[msg.sender].exists, "Already registered");
        freelancers[msg.sender] = Freelancer(0, 0, 50, true); // start score at 50
    }

    // Request a loan
    function requestLoan(uint256 amount) external {
        require(freelancers[msg.sender].exists, "Register first");

        // Save loan
        loans.push(Loan(msg.sender, amount, false));
        freelancers[msg.sender].totalLoans += 1;

        emit LoanRequested(msg.sender, amount, loans.length - 1);
    }

    // Repay loan
    function repayLoan(uint256 loanId) external payable {
        Loan storage loan = loans[loanId];
        require(msg.sender == loan.freelancer, "Not your loan");
        require(!loan.repaid, "Already repaid");
        require(msg.value == loan.amount, "Repay full amount");

        // Mark as repaid
        loan.repaid = true;

        // Simulate credit score growth
        Freelancer storage f = freelancers[msg.sender];
        f.repaidLoans += 1;
        f.creditScore += 10; // simple +10 per repayment
        if (f.creditScore > 100) {
            f.creditScore = 100; // max score
        }

        emit LoanRepaid(msg.sender, loan.amount, f.creditScore);
    }

    // Get freelancer info
    function getFreelancer(address freelancerAddress) external view returns (Freelancer memory) {
        return freelancers[freelancerAddress];
    }

    // Total loans count
    function totalLoansCount() external view returns (uint256) {
        return loans.length;
    }
}