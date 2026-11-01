// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ChallengeMe
 * @dev Decentralized challenge platform where users set personal challenges, 
 * deadlines, and record on-chain proof of completion.
 * Tagline: Set a challenge. Prove you did it.
 */
contract ChallengeMe {
    struct Challenge {
        uint256 id;
        string title;
        string description;
        address creator;
        uint256 deadline;
        uint256 createdAt;
        bool isCompleted;
        string proof;
        uint256 completedAt;
    }

    uint256 private _challengeIdCounter;
    Challenge[] private _challenges;

    // Events
    event ChallengeCreated(
        uint256 indexed id,
        address indexed creator,
        string title,
        uint256 deadline,
        uint256 createdAt
    );

    event ChallengeCompleted(
        uint256 indexed id,
        address indexed creator,
        string proof,
        uint256 completedAt
    );

    /**
     * @notice Create a new challenge.
     * @param title Title of the challenge (1 - 60 bytes).
     * @param description Short description (1 - 200 bytes).
     * @param deadline Unix timestamp for the challenge deadline (must be in the future).
     */
    function createChallenge(
        string calldata title,
        string calldata description,
        uint256 deadline
    ) external returns (uint256) {
        bytes memory titleBytes = bytes(title);
        require(titleBytes.length > 0, "Title cannot be empty");
        require(titleBytes.length <= 60, "Title exceeds 60 characters");

        bytes memory descBytes = bytes(description);
        require(descBytes.length > 0, "Description cannot be empty");
        require(descBytes.length <= 200, "Description exceeds 200 characters");

        require(deadline > block.timestamp, "Deadline must be in the future");

        uint256 newId = _challengeIdCounter++;

        Challenge memory newChallenge = Challenge({
            id: newId,
            title: title,
            description: description,
            creator: msg.sender,
            deadline: deadline,
            createdAt: block.timestamp,
            isCompleted: false,
            proof: "",
            completedAt: 0
        });

        _challenges.push(newChallenge);

        emit ChallengeCreated(newId, msg.sender, title, deadline, block.timestamp);

        return newId;
    }

    /**
     * @notice Mark your own challenge as completed and submit proof.
     * @param challengeId ID of the challenge to complete.
     * @param proof Short proof message or URL (1 - 150 bytes).
     */
    function completeChallenge(uint256 challengeId, string calldata proof) external {
        require(challengeId < _challenges.length, "Challenge does not exist");
        Challenge storage ch = _challenges[challengeId];

        require(msg.sender == ch.creator, "Only the creator can complete this challenge");
        require(!ch.isCompleted, "Challenge is already completed");

        bytes memory proofBytes = bytes(proof);
        require(proofBytes.length > 0, "Proof cannot be empty");
        require(proofBytes.length <= 150, "Proof exceeds 150 characters");

        ch.isCompleted = true;
        ch.proof = proof;
        ch.completedAt = block.timestamp;

        emit ChallengeCompleted(challengeId, msg.sender, proof, block.timestamp);
    }

    /**
     * @notice Retrieve all challenges.
     */
    function getAllChallenges() external view returns (Challenge[] memory) {
        return _challenges;
    }

    /**
     * @notice Retrieve challenges created by the calling address.
     */
    function getMyChallenges() external view returns (Challenge[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < _challenges.length; i++) {
            if (_challenges[i].creator == msg.sender) {
                count++;
            }
        }

        Challenge[] memory myChallenges = new Challenge[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < _challenges.length; i++) {
            if (_challenges[i].creator == msg.sender) {
                myChallenges[index] = _challenges[i];
                index++;
            }
        }

        return myChallenges;
    }

    /**
     * @notice Retrieve an individual challenge by ID.
     */
    function getChallenge(uint256 challengeId) external view returns (Challenge memory) {
        require(challengeId < _challenges.length, "Challenge does not exist");
        return _challenges[challengeId];
    }

    /**
     * @notice Return the total number of challenges created.
     */
    function totalChallenges() external view returns (uint256) {
        return _challenges.length;
    }
}

