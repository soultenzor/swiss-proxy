const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy SwisstonikUpgradeable
  const SwisstonikUpgradeable = await hre.ethers.getContractFactory("SwisstonikUpgradeable");
  const swisstonikUpgradeable = await SwisstonikUpgradeable.deploy();
  await swisstonikUpgradeable.waitForDeployment();
  console.log("SwisstonikUpgradeable deployed to:", swisstonikUpgradeable.target);

  // Deploy TransparentUpgradeableProxy
  const TransparentUpgradeableProxy = await hre.ethers.getContractFactory("TransparentUpgradeableProxy");
  const proxy = await TransparentUpgradeableProxy.deploy(
    swisstonikUpgradeable.target, 
    deployer.address
  );
  await proxy.waitForDeployment();
  console.log("TransparentUpgradeableProxy deployed to:", proxy.target);

  console.log("Deployment completed. Please use the proxy address for interactions.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});