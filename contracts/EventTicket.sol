// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title EventTicket
/// @notice ERC-20 token representing a single event ticket.
///         1 ETK = 1 ticket. decimals() is overridden to 0.
///         Tickets are purchased with SETH and burned on redemption.
contract EventTicket is ERC20, Ownable, ReentrancyGuard {

    uint256 public immutable ticketPrice;
    uint256 public immutable maxSupply;

    event TicketPurchased(address indexed buyer);
    event TicketRedeemed(address indexed holder);

    error IncorrectPayment(uint256 sent, uint256 required);
    error AlreadyOwnsTicket();
    error SoldOut();
    error NoTicketToRedeem();
    error WithdrawFailed();
    error TicketsAreNonTransferable();
    error NothingToWithdraw();
    error InvalidConfiguration();

    /// @notice Deploy the EventTicket contract.
    /// @param _maxSupply     Total number of tickets available for sale.
    /// @param _ticketPriceWei Price per ticket in wei; stored immutably.
    /// @param initialOwner   Address that receives Ownable ownership.
    constructor(
        uint256 _maxSupply,
        uint256 _ticketPriceWei,
        address initialOwner
    ) ERC20("EventTicket", "ETK") Ownable(initialOwner) {
        if (_maxSupply == 0) revert InvalidConfiguration();
        maxSupply = _maxSupply;
        ticketPrice = _ticketPriceWei;
    }

    /// @notice Override to 0 so that 1 ETK = 1 ticket with no decimal places.
    function decimals() public pure override returns (uint8) {
        return 0;
    }

    /// @notice Purchase one ticket by sending exactly ticketPrice SETH.
    function buyTicket() external payable nonReentrant {
        if (msg.value != ticketPrice) revert IncorrectPayment(msg.value, ticketPrice);
        if (balanceOf(msg.sender) > 0) revert AlreadyOwnsTicket();
        if (totalSupply() >= maxSupply) revert SoldOut();

        _mint(msg.sender, 1);
        emit TicketPurchased(msg.sender);
    }

    /// @notice Burn the caller's ticket to mark venue entry.
    function redeemTicket() external {
        if (balanceOf(msg.sender) == 0) revert NoTicketToRedeem();
        _burn(msg.sender, 1);
        emit TicketRedeemed(msg.sender);
    }

    /// @notice Returns the number of tickets not yet sold.
    function remainingTickets() external view returns (uint256) {
        return maxSupply - totalSupply();
    }

    /// @notice Withdraw all collected SETH to the contract owner.
    function withdrawFunds() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        if (balance == 0) revert NothingToWithdraw();
        (bool success, ) = owner().call{value: balance}("");
        if (!success) revert WithdrawFailed();
    }

    /// @notice Tickets are non-transferable. Only minting and burning are permitted.
    function _update(address from, address to, uint256 value) internal override {
        bool isMint = from == address(0);
        bool isBurn = to == address(0);
        if (!isMint && !isBurn) revert TicketsAreNonTransferable();
        super._update(from, to, value);
    }
}
