import { ethers } from "hardhat";

async function main() {
  const TipPost = await ethers.getContractFactory("TipPost");
  const tipPost = await TipPost.deploy();
  await tipPost.waitForDeployment();
  const address = await tipPost.getAddress();
  console.log("TipPost deployed to:", address);
}

main()
  .then(() => {
    // Avoid intermittent Windows/libuv shutdown crashes after deploy (UV_HANDLE_CLOSING).
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
