const truffleAssert = require('truffle-assertions');
import { assert, web3, artifacts } from "hardhat";

const Donations = artifacts.require("Donations");

const bn1e18 = web3.utils.toBN(1e18);

describe("Donations", () => {
  let accounts: string[];
  let owner: any;
  let payer: any;
  let donationAccount: any;
  let donationsInstance: any;

  const paymentAmount = bn1e18.muln(1);

  beforeEach(async function () {
    accounts = await web3.eth.getAccounts();
    owner = accounts[0];
    payer = accounts[1];
    donationAccount = accounts[2];
    donationsInstance = await Donations.new();
  });

  describe("transfering donations", function () {
    it("Should transfer donations successfully", async () => {
      const payerBalenceBefore = Number(await web3.eth.getBalance(payer));

      const result = await donationsInstance.transfer({ from: payer, value: paymentAmount });

      truffleAssert.eventEmitted(result, 'Transfer', (event: any) => {
        return event.sender.toLowerCase() === payer.toLowerCase() && event.amount.eq(paymentAmount)
      })

      const payerBalenceAfter = Number(await web3.eth.getBalance(payer));

      assert.notEqual(0, payerBalenceBefore - payerBalenceAfter);
    });

    it("Should not be able to transfer ether due to 0 eth sent", async () => {
      await truffleAssert.reverts(
        donationsInstance.transfer({ from: payer, value: 0 }),
        "Amount of ether can't be 0"
      );
    });
  });

  describe("withdrawing donations", function () {
    it("Should withdraw donations successfully", async () => {
      const payerBalenceBefore = Number(await web3.eth.getBalance(donationAccount));

      const result = await donationsInstance.withdraw(donationAccount, { from: owner, value: paymentAmount });

      truffleAssert.eventEmitted(result, 'Withdraw', (event: any) => {
        return event.reciever.toLowerCase() === donationAccount.toLowerCase() && event.amount.eq(paymentAmount)
      })

      const payerBalenceAfter = Number(await web3.eth.getBalance(payer));

      assert.notEqual(0, payerBalenceBefore - payerBalenceAfter);
    });

    it("Should not be able to withdraw ether due to 0 eth sent", async () => {
      await truffleAssert.reverts(
        donationsInstance.withdraw(donationAccount, { from: owner, value: 0 }), "Amount of ether can't be 0");
    });

    it("Should be able to withdraw only owner", async () => {
      await truffleAssert.reverts(
        donationsInstance.withdraw(donationAccount, { from: payer, value: paymentAmount }), "Only owner can withdraw donation");
    });
  });

  describe("Showing donated users", function () {
    it("Showing donated users successfully", async () => {
      await donationsInstance.transfer({ from: payer, value: paymentAmount });
      const donatedUsers = await donationsInstance.showDonatedUsers();
      assert.equal(donatedUsers, payer);
    });
  });

  describe("Getting total donation amount by address", function () {
    it("Getting total donation amount by address successfully", async () => {
      await donationsInstance.transfer({ from: payer, value: paymentAmount });
      const totalAmount = await donationsInstance.getTotalDonationAmountByAddress(payer);

      assert.equal(paymentAmount.toString(), totalAmount.toString());
    });
  });
  
});



