const hre = require("hardhat");
const { encryptDataField, decryptNodeResponse } = require("@swisstronik/utils");
const { ethers } = require("ethers");

const sendShieldedTransaction = async (signer, destination, data, value) => {
  const rpcLink = hre.network.config.url;
  const [encryptedData] = await encryptDataField(rpcLink, data);
  console.log("Sending shielded transaction to:", destination);
  console.log("Original data:", data);
  console.log("Encrypted data:", encryptedData);
  
  const txData = {
    from: signer.address,
    to: destination,
    data: encryptedData,
    value: value
  };
  
  console.log("Transaction data:", txData);
  
  // Send transaction without gas estimation
  return await signer.sendTransaction(txData);
};

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Using account:", deployer.address);

  const proxyAddress = process.env.PROXY_ADDRESS;
  if (!proxyAddress) {
    console.error("Please set the PROXY_ADDRESS environment variable.");
    process.exit(1);
  }

  console.log("Upgrading proxy at:", proxyAddress);

  // Deploy SwisstonikUpgradeableV2
  const SwisstonikUpgradeableV2 = await hre.ethers.getContractFactory("SwisstonikUpgradeableV2");
  const newImplementation = await SwisstonikUpgradeableV2.deploy();
  await newImplementation.waitForDeployment();
  console.log("SwisstonikUpgradeableV2 deployed to:", await newImplementation.getAddress());

  // Manually encode the upgradeTo function call
  const upgradeToSignature = "0x3659cfe6"; // Function selector for upgradeTo(address)
  const encodedAddress = ethers.AbiCoder.defaultAbiCoder().encode(['address'], [await newImplementation.getAddress()]).slice(2);
  const upgradeFunctionData = upgradeToSignature + encodedAddress;

  console.log("Upgrade function data:", upgradeFunctionData);

  console.log("Upgrading proxy...");
  
  try {
    // Send the shielded transaction to upgrade the proxy
    const upgradeTx = await sendShieldedTransaction(
      deployer,
      proxyAddress,
      upgradeFunctionData,
      0
    );

    console.log("Upgrade transaction sent. Waiting for confirmation...");
    const receipt = await upgradeTx.wait();
    console.log("Upgrade Transaction Hash:", upgradeTx.hash);
    console.log("Upgrade transaction confirmed in block:", receipt.blockNumber);

    console.log("Upgrade completed successfully.");
  } catch (error) {
    console.error("Error during upgrade:", error);
    if (error.data) {
      console.error("Error data:", error.data);
    }
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});