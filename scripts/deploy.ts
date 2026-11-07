import hre from "hardhat";
import * as fs from "fs";
import * as path from "path";

const { ethers } = hre;

async function main() {
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  const chainId = Number(network.chainId);
  const tokenSymbol = chainId === 677 ? "BOT" : chainId === 968 ? "BOHR" : "ETH";

  console.log("====================================================");
  console.log(`Deploying ChallengeMe to: ${network.name} (Chain ID: ${chainId})`);
  console.log("Deployer account:", deployer ? deployer.address : "No signer configured");

  if (!deployer) {
    throw new Error("No deployer signer found. Please check PRIVATE_KEY in .env.local");
  }

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Account balance: ${ethers.formatEther(balance)} ${tokenSymbol}`);

  const feeData = await ethers.provider.getFeeData();
  const gasPrice = feeData.gasPrice || 20000000000n;
  console.log(`Current Network Gas Price: ${ethers.formatUnits(gasPrice, "gwei")} Gwei`);

  const ChallengeMe = await ethers.getContractFactory("ChallengeMe");
  
  // Estimate deployment gas accurately to avoid overspending
  const deployTx = await ChallengeMe.getDeployTransaction();
  const estimatedGas = await ethers.provider.estimateGas(deployTx);
  const estimatedCost = estimatedGas * gasPrice;
  console.log(`Estimated Deployment Gas Units: ${estimatedGas.toString()}`);
  console.log(`Estimated Deployment Cost: ${ethers.formatEther(estimatedCost)} ${tokenSymbol}`);

  if (balance < estimatedCost) {
    throw new Error(`Insufficient funds: Balance (${ethers.formatEther(balance)} ${tokenSymbol}) is less than estimated cost (${ethers.formatEther(estimatedCost)} ${tokenSymbol})`);
  }

  console.log("Broadcasting deployment transaction with optimal network gas...");
  // Pass exact optimal gasPrice to prevent overpaying
  const challengeMe = await ChallengeMe.deploy({
    gasPrice: gasPrice,
  });
  
  console.log("Waiting for confirmation on-chain...");
  await challengeMe.waitForDeployment();

  const contractAddress = await challengeMe.getAddress();
  const deploymentTx = challengeMe.deploymentTransaction();
  const receipt = deploymentTx ? await deploymentTx.wait() : null;
  const actualGasUsed = receipt ? receipt.gasUsed : estimatedGas;
  const actualCost = actualGasUsed * (receipt?.gasPrice || gasPrice);

  console.log("----------------------------------------------------");
  console.log("ChallengeMe successfully deployed to:", contractAddress);
  console.log(`Actual Gas Used: ${actualGasUsed.toString()}`);
  console.log(`Actual Deployment Cost: ${ethers.formatEther(actualCost)} ${tokenSymbol}`);
  console.log("====================================================");

  // Save deployment info
  const deploymentInfo = {
    address: contractAddress,
    network: network.name,
    chainId: chainId,
    tokenSymbol: tokenSymbol,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    txHash: deploymentTx?.hash || "",
    gasUsed: actualGasUsed.toString(),
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

  // Update .env.local
  const envPath = path.join(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    let envContent = fs.readFileSync(envPath, "utf-8");
    
    // Update address
    if (/NEXT_PUBLIC_CONTRACT_ADDRESS=.*/.test(envContent)) {
      envContent = envContent.replace(/NEXT_PUBLIC_CONTRACT_ADDRESS=.*/, `NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`);
    } else {
      envContent = `NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}\n` + envContent;
    }

    // Update chain ID
    if (/NEXT_PUBLIC_CHAIN_ID=.*/.test(envContent)) {
      envContent = envContent.replace(/NEXT_PUBLIC_CHAIN_ID=.*/, `NEXT_PUBLIC_CHAIN_ID=${chainId}`);
    } else {
      envContent += `\nNEXT_PUBLIC_CHAIN_ID=${chainId}`;
    }

    // Update RPC URL if deploying to mainnet
    if (chainId === 677) {
      if (/NEXT_PUBLIC_RPC_URL=.*/.test(envContent)) {
        envContent = envContent.replace(/NEXT_PUBLIC_RPC_URL=.*/, `NEXT_PUBLIC_RPC_URL=https://rpc.botchain.ai`);
      } else {
        envContent += `\nNEXT_PUBLIC_RPC_URL=https://rpc.botchain.ai`;
      }
    }

    fs.writeFileSync(envPath, envContent);
    console.log("Updated .env.local with deployed contract address and chain configuration");
  }
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
