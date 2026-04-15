import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

async function deployFixture() {
  const TipPostFactory = await ethers.getContractFactory("TipPost");
  const tipPost = await TipPostFactory.deploy();
  await tipPost.waitForDeployment();
  return { tipPost };
}

describe("TipPost", () => {
  it("creates a post and emits PostCreated", async () => {
    const { tipPost } = await loadFixture(deployFixture);
    const [creator] = await ethers.getSigners();
    const imageUrl = "https://picsum.photos/600/400";
    const caption = "Hello chain";

    await expect(tipPost.connect(creator).createPost(imageUrl, caption))
      .to.emit(tipPost, "PostCreated")
      .withArgs(1n, creator.address, imageUrl, caption, (t: bigint) => t > 0n);

    const p = await tipPost.posts(1n);
    expect(p.id).to.equal(1n);
    expect(p.creator).to.equal(creator.address);
    expect(p.imageUrl).to.equal(imageUrl);
    expect(p.caption).to.equal(caption);
    expect(p.likes).to.equal(0n);
    expect(p.totalEarned).to.equal(0n);
  });

  it("likes a post and transfers likeCost to creator", async () => {
    const { tipPost } = await loadFixture(deployFixture);
    const [creator, liker] = await ethers.getSigners();
    const likeCost = await tipPost.likeCost();

    await tipPost.connect(creator).createPost("https://example.com/a.jpg", "post");

    await expect(
      tipPost.connect(liker).likePost(1n, { value: likeCost })
    ).to.changeEtherBalances([creator, liker], [likeCost, likeCost * -1n]);

    const p = await tipPost.posts(1n);
    expect(p.likes).to.equal(1n);
    expect(p.totalEarned).to.equal(likeCost);
    expect(await tipPost.hasLiked(1n, liker.address)).to.equal(true);
  });

  it("reverts on double like", async () => {
    const { tipPost } = await loadFixture(deployFixture);
    const [creator, liker] = await ethers.getSigners();
    const likeCost = await tipPost.likeCost();

    await tipPost.connect(creator).createPost("https://example.com/b.jpg", "x");
    await tipPost.connect(liker).likePost(1n, { value: likeCost });

    await expect(
      tipPost.connect(liker).likePost(1n, { value: likeCost })
    ).to.be.revertedWith("TipPost: already liked");
  });

  it("reverts on self-like", async () => {
    const { tipPost } = await loadFixture(deployFixture);
    const [creator] = await ethers.getSigners();
    const likeCost = await tipPost.likeCost();

    await tipPost.connect(creator).createPost("https://example.com/c.jpg", "y");

    await expect(
      tipPost.connect(creator).likePost(1n, { value: likeCost })
    ).to.be.revertedWith("TipPost: cannot like own post");
  });
});
