import hre from "hardhat";
import * as fs from "fs";
import * as path from "path";

const { ethers } = hre;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("----------------------------------------------------");
  console.log("Deploying ChallengeMe contract with account:", deployer ? deployer.address : "No signer");

  if (deployer) {
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("Account balance:", ethers.formatEther(balance), "Native Tokens (BOHR)");
  }

  const ChallengeMe = await ethers.getContractFactory("ChallengeMe");
  const challengeMe = await ChallengeMe.deploy();
  await challengeMe.waitForDeployment();

  const contractAddress = await challengeMe.getAddress();
  console.log("ChallengeMe successfully deployed to:", contractAddress);
  console.log("----------------------------------------------------");

  // Save the deployed address to deployed-address.json
  const network = await ethers.provider.getNetwork();
  const deploymentInfo = {
    address: contractAddress,
    network: network.name,
    chainId: Number(network.chainId),
    deployer: deployer ? deployer.address : "",
    timestamp: new Date().toISOString(),
  };

  const outputDir = path.join(process.cwd(), "src", "contracts");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(outputDir, "deployed-address.json"),
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("Saved deployment info to src/contracts/deployed-address.json");

  // Update .env.local automatically
  const envPath = path.join(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    let envContent = fs.readFileSync(envPath, "utf-8");
    if (/NEXT_PUBLIC_CONTRACT_ADDRESS=.*/.test(envContent)) {
      envContent = envContent.replace(
        /NEXT_PUBLIC_CONTRACT_ADDRESS=.*/,
        `NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`
      );
    } else {
      envContent = `NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}\n` + envContent;
    }
    fs.writeFileSync(envPath, envContent);
    console.log("Updated NEXT_PUBLIC_CONTRACT_ADDRESS in .env.local");
  }
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
