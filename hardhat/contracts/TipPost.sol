// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TipPost {
    struct Post {
        uint256 id;
        address creator;
        string imageUrl;
        string caption;
        uint256 likes;
        uint256 totalEarned;
        uint256 timestamp;
    }

    uint256 public postCount;
    uint256 public constant likeCost = 0.0001 ether;

    mapping(uint256 => Post) public posts;
    mapping(uint256 => mapping(address => bool)) public hasLiked;
    mapping(address => uint256) public totalEarnedByUser;

    event PostCreated(
        uint256 indexed postId,
        address indexed creator,
        string imageUrl,
        string caption,
        uint256 timestamp
    );

    event PostLiked(
        uint256 indexed postId,
        address indexed liker,
        address indexed creator,
        uint256 newLikeCount,
        uint256 tipAmount
    );

    function createPost(string calldata imageUrl, string calldata caption) external {
        require(bytes(imageUrl).length > 0, "TipPost: empty imageUrl");
        require(bytes(caption).length > 0, "TipPost: empty caption");

        postCount += 1;
        uint256 id = postCount;
        posts[id] = Post({
            id: id,
            creator: msg.sender,
            imageUrl: imageUrl,
            caption: caption,
            likes: 0,
            totalEarned: 0,
            timestamp: block.timestamp
        });

        emit PostCreated(id, msg.sender, imageUrl, caption, block.timestamp);
    }

    function likePost(uint256 postId) external payable {
        require(postId > 0 && postId <= postCount, "TipPost: invalid post");
        Post storage p = posts[postId];
        require(msg.sender != p.creator, "TipPost: cannot like own post");
        require(msg.value >= likeCost, "TipPost: insufficient ETH");
        require(!hasLiked[postId][msg.sender], "TipPost: already liked");

        hasLiked[postId][msg.sender] = true;
        p.likes += 1;
        p.totalEarned += likeCost;
        totalEarnedByUser[p.creator] += likeCost;

        (bool sent, ) = payable(p.creator).call{value: likeCost}("");
        require(sent, "TipPost: tip transfer failed");

        uint256 refund = msg.value - likeCost;
        if (refund > 0) {
            (bool refundOk, ) = payable(msg.sender).call{value: refund}("");
            require(refundOk, "TipPost: refund failed");
        }

        emit PostLiked(postId, msg.sender, p.creator, p.likes, likeCost);
    }

    function getAllPosts() external view returns (Post[] memory) {
        Post[] memory list = new Post[](postCount);
        for (uint256 i = 1; i <= postCount; ) {
            list[i - 1] = posts[i];
            unchecked {
                ++i;
            }
        }
        return list;
    }

    function checkLiked(uint256 postId, address user) external view returns (bool) {
        return hasLiked[postId][user];
    }
}
