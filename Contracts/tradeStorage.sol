pragma solidity 0.5.11;
pragma experimental ABIEncoderV2;

contract TradeStorage {
    
    struct Proof {
        uint[2]  pi_a;
        uint[2][2]  pi_b;
        uint[2]  pi_c;
    }
    
    struct Signal {
        uint blockNumber;
        string hash;
    }
    
    struct PeriodProof {
        uint y;
        Proof proof;
    }
    
    address[] public traders;
    mapping(address => Signal[]) public signals;
    mapping(address => PeriodProof[]) public periodProofs;
    mapping(address => string) public emails;
    mapping(address => string[]) public balanceHashes;
    mapping(address => uint[]) public lastProofBlock;
    
    
    function newTrader(string calldata email) external {
        traders.push(msg.sender);
        emails[msg.sender] = email;
        balanceHashes[msg.sender].push("15908070228732390218204169968729456547298033751842088798219911969030545051409");
        lastProofBlock[msg.sender].push(block.number);
    }
    
    function addSignal(string calldata newSinal) external {
        Signal memory sig = Signal(block.number, newSinal);
        signals[msg.sender].push(sig);
    }
    
    function addPeriodProof(uint256 yield, Proof calldata proof, string calldata balanceHash, uint256 blockNumber) external {
        PeriodProof memory pr = PeriodProof(yield, proof);
        periodProofs[msg.sender].push(pr);
        balanceHashes[msg.sender].push(balanceHash);
        lastProofBlock[msg.sender].push(blockNumber);
    }
    
    function getTradeLen(address trader) external view returns(uint) {
        return signals[trader].length;
    }
    
    function getProofLen(address trader) external view returns(uint) {
        return periodProofs[trader].length;
    }
    
    function getTradersCount() external view returns(uint) {
        return traders.length;
    }
    
    function getBalnceHashesLen(address trader) external view returns(uint) {
        return balanceHashes[trader].length;
    }
    
}