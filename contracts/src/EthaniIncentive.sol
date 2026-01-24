// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title EthaniIncentive
 * @notice Non-transferable participation points system for ETHANI
 * 
 * Tracks user participation and contribution:
 * - Points for farmers (selling food)
 * - Points for buyers (supporting system)
 * - Non-transferable (cannot trade points)
 * - Only admin can grant points
 * - Emit events for transparency
 */

contract EthaniIncentive {
    // ==================== TYPES ====================
    
    struct UserPoints {
        uint256 totalPoints;
        uint256 lastUpdated;
        bool isActive;
    }
    
    // ==================== STATE ====================
    
    address public admin;
    
    mapping(address => UserPoints) public users;
    address[] public allUsers;
    
    // ==================== EVENTS ====================
    
    event PointsGranted(
        address indexed user,
        uint256 points,
        string reason,
        uint256 timestamp
    );
    
    event PointsRevoked(
        address indexed user,
        uint256 points,
        string reason,
        uint256 timestamp
    );
    
    event UserRegistered(
        address indexed user,
        uint256 timestamp
    );
    
    event UserDeactivated(
        address indexed user,
        uint256 timestamp
    );
    
    event AdminChanged(address indexed oldAdmin, address indexed newAdmin);
    
    // ==================== MODIFIERS ====================
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this");
        _;
    }
    
    modifier userExists(address user) {
        require(users[user].isActive, "User does not exist or is inactive");
        _;
    }
    
    // ==================== CONSTRUCTOR ====================
    
    constructor() {
        admin = msg.sender;
    }
    
    // ==================== ADMIN FUNCTIONS ====================
    
    /**
     * @notice Register a new user in the points system
     * @param user User address to register
     */
    function registerUser(address user) external onlyAdmin {
        require(user != address(0), "Invalid user address");
        require(!users[user].isActive, "User already registered");
        
        users[user] = UserPoints({
            totalPoints: 0,
            lastUpdated: block.timestamp,
            isActive: true
        });
        
        allUsers.push(user);
        
        emit UserRegistered(user, block.timestamp);
    }
    
    /**
     * @notice Grant participation points to a user
     * @param user User address
     * @param points Number of points to grant
     * @param reason Reason for granting (e.g., "Farmer supply 100kg")
     */
    function grantPoints(
        address user,
        uint256 points,
        string calldata reason
    ) external onlyAdmin userExists(user) {
        require(points > 0, "Points must be positive");
        require(bytes(reason).length > 0, "Reason cannot be empty");
        
        users[user].totalPoints += points;
        users[user].lastUpdated = block.timestamp;
        
        emit PointsGranted(user, points, reason, block.timestamp);
    }
    
    /**
     * @notice Revoke points from a user (for fraud/violations)
     * @param user User address
     * @param points Number of points to revoke
     * @param reason Reason for revoking
     */
    function revokePoints(
        address user,
        uint256 points,
        string calldata reason
    ) external onlyAdmin userExists(user) {
        require(points > 0, "Points must be positive");
        require(points <= users[user].totalPoints, "Cannot revoke more than user has");
        require(bytes(reason).length > 0, "Reason cannot be empty");
        
        users[user].totalPoints -= points;
        users[user].lastUpdated = block.timestamp;
        
        emit PointsRevoked(user, points, reason, block.timestamp);
    }
    
    /**
     * @notice Deactivate a user account
     * @param user User address
     */
    function deactivateUser(address user) external onlyAdmin userExists(user) {
        users[user].isActive = false;
        users[user].lastUpdated = block.timestamp;
        
        emit UserDeactivated(user, block.timestamp);
    }
    
    /**
     * @notice Transfer admin rights
     * @param newAdmin New admin address
     */
    function changeAdmin(address newAdmin) external onlyAdmin {
        require(newAdmin != address(0), "Invalid admin address");
        require(newAdmin != admin, "Must be different from current admin");
        
        address oldAdmin = admin;
        admin = newAdmin;
        
        emit AdminChanged(oldAdmin, newAdmin);
    }
    
    // ==================== READ-ONLY FUNCTIONS ====================
    
    /**
     * @notice Get user points balance
     * @param user User address
     */
    function getPoints(address user)
        external
        view
        userExists(user)
        returns (uint256)
    {
        return users[user].totalPoints;
    }
    
    /**
     * @notice Get full user information
     * @param user User address
     */
    function getUserInfo(address user)
        external
        view
        userExists(user)
        returns (UserPoints memory)
    {
        return users[user];
    }
    
    /**
     * @notice Check if user is active
     * @param user User address
     */
    function isUserActive(address user) external view returns (bool) {
        return users[user].isActive;
    }
    
    /**
     * @notice Get total number of registered users
     */
    function getTotalUsers() external view returns (uint256) {
        return allUsers.length;
    }
    
    /**
     * @notice Get user address by index
     * @param index User list index
     */
    function getUserByIndex(uint256 index)
        external
        view
        returns (address)
    {
        require(index < allUsers.length, "Index out of bounds");
        return allUsers[index];
    }
    
    /**
     * @notice Get leaderboard (top users by points)
     * @param limit Maximum number of users to return
     */
    function getLeaderboard(uint256 limit)
        external
        view
        returns (address[] memory, uint256[] memory)
    {
        uint256 count = limit > allUsers.length ? allUsers.length : limit;
        address[] memory topUsers = new address[](count);
        uint256[] memory topPoints = new uint256[](count);
        
        // Simple approach: iterate and track top N
        for (uint256 i = 0; i < allUsers.length; i++) {
            address user = allUsers[i];
            uint256 points = users[user].totalPoints;
            
            // Find position in leaderboard
            for (uint256 j = 0; j < count; j++) {
                if (points > topPoints[j]) {
                    // Shift entries
                    for (uint256 k = count - 1; k > j; k--) {
                        topUsers[k] = topUsers[k - 1];
                        topPoints[k] = topPoints[k - 1];
                    }
                    topUsers[j] = user;
                    topPoints[j] = points;
                    break;
                }
            }
        }
        
        return (topUsers, topPoints);
    }
}
