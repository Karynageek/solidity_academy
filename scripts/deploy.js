import { ethers, run } from "hardhat";

async function main() {
  const Donations = await ethers.getContractFactory("Donations");
  const donations = await Donations.deploy(greeting);

  await donations.deployed();

  await new Promise(resolve => setTimeout(resolve, 60000)); 

  await run("verify:verify", {address: donations.address});

  console.log("Donations deployed and verified to:", donations.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
