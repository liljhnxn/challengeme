import { expect } from "chai";
import hre from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";

const { ethers } = hre;

describe("ChallengeMe Contract", function () {
  let challengeMe: any;
  let owner: any;
  let alice: any;
  let bob: any;

  beforeEach(async function () {
    [owner, alice, bob] = await ethers.getSigners();
    const ChallengeMeFactory = await ethers.getContractFactory("ChallengeMe");
    challengeMe = await ChallengeMeFactory.deploy();
    await challengeMe.waitForDeployment();
  });

  describe("createChallenge", function () {
    it("should create a challenge successfully", async function () {
      const futureDeadline = (await time.latest()) + 3600 * 24; // 24 hours from now
      const tx = await challengeMe
        .connect(alice)
        .createChallenge("100 Pushups Daily", "Complete 100 pushups every day for 30 days", futureDeadline);

      await expect(tx)
        .to.emit(challengeMe, "ChallengeCreated")
        .withArgs(0, alice.address, "100 Pushups Daily", futureDeadline, (val: any) => val > 0);

      const challenge = await challengeMe.getChallenge(0);
      expect(challenge.id).to.equal(0);
      expect(challenge.title).to.equal("100 Pushups Daily");
      expect(challenge.description).to.equal("Complete 100 pushups every day for 30 days");
      expect(challenge.creator).to.equal(alice.address);
      expect(challenge.deadline).to.equal(futureDeadline);
      expect(challenge.isCompleted).to.be.false;
      expect(challenge.proof).to.equal("");
    });

    it("should revert if title is empty", async function () {
      const futureDeadline = (await time.latest()) + 3600;
      await expect(
        challengeMe.connect(alice).createChallenge("", "Description", futureDeadline)
      ).to.be.revertedWith("Title cannot be empty");
    });

    it("should revert if title exceeds 60 characters", async function () {
      const futureDeadline = (await time.latest()) + 3600;
      const longTitle = "A".repeat(61);
      await expect(
        challengeMe.connect(alice).createChallenge(longTitle, "Description", futureDeadline)
      ).to.be.revertedWith("Title exceeds 60 characters");
    });

    it("should revert if description is empty", async function () {
      const futureDeadline = (await time.latest()) + 3600;
      await expect(
        challengeMe.connect(alice).createChallenge("Title", "", futureDeadline)
      ).to.be.revertedWith("Description cannot be empty");
    });

    it("should revert if description exceeds 200 characters", async function () {
      const futureDeadline = (await time.latest()) + 3600;
      const longDesc = "D".repeat(201);
      await expect(
        challengeMe.connect(alice).createChallenge("Title", longDesc, futureDeadline)
      ).to.be.revertedWith("Description exceeds 200 characters");
    });

    it("should revert if deadline is in the past", async function () {
      const pastDeadline = (await time.latest()) - 10;
      await expect(
        challengeMe.connect(alice).createChallenge("Title", "Description", pastDeadline)
      ).to.be.revertedWith("Deadline must be in the future");
    });
  });

  describe("completeChallenge", function () {
    let futureDeadline: number;

    beforeEach(async function () {
      futureDeadline = (await time.latest()) + 3600 * 48;
      await challengeMe
        .connect(alice)
        .createChallenge("Read 1 Book", "Finish reading The Pragmatic Programmer", futureDeadline);
    });

    it("should allow creator to complete challenge and record proof", async function () {
      const proofMsg = "https://goodreads.com/review/show/123456";
      const tx = await challengeMe.connect(alice).completeChallenge(0, proofMsg);

      await expect(tx)
        .to.emit(challengeMe, "ChallengeCompleted")
        .withArgs(0, alice.address, proofMsg, (val: any) => val > 0);

      const challenge = await challengeMe.getChallenge(0);
      expect(challenge.isCompleted).to.be.true;
      expect(challenge.proof).to.equal(proofMsg);
      expect(challenge.completedAt).to.be.gt(0);
    });

    it("should prevent non-creator from completing challenge", async function () {
      await expect(
        challengeMe.connect(bob).completeChallenge(0, "I did it for Alice")
      ).to.be.revertedWith("Only the creator can complete this challenge");
    });

    it("should prevent completing an already completed challenge", async function () {
      await challengeMe.connect(alice).completeChallenge(0, "Done first time");
      await expect(
        challengeMe.connect(alice).completeChallenge(0, "Done second time")
      ).to.be.revertedWith("Challenge is already completed");
    });

    it("should revert if proof is empty", async function () {
      await expect(
        challengeMe.connect(alice).completeChallenge(0, "")
      ).to.be.revertedWith("Proof cannot be empty");
    });

    it("should revert if proof exceeds 150 characters", async function () {
      const longProof = "P".repeat(151);
      await expect(
        challengeMe.connect(alice).completeChallenge(0, longProof)
      ).to.be.revertedWith("Proof exceeds 150 characters");
    });
  });

  describe("query functions", function () {
    beforeEach(async function () {
      const d1 = (await time.latest()) + 3600;
      const d2 = (await time.latest()) + 7200;
      await challengeMe.connect(alice).createChallenge("Alice Task 1", "Desc 1", d1);
      await challengeMe.connect(bob).createChallenge("Bob Task 1", "Desc 2", d2);
      await challengeMe.connect(alice).createChallenge("Alice Task 2", "Desc 3", d2);
    });

    it("getAllChallenges should return all 3 challenges", async function () {
      const all = await challengeMe.getAllChallenges();
      expect(all.length).to.equal(3);
      expect(all[0].title).to.equal("Alice Task 1");
      expect(all[1].title).to.equal("Bob Task 1");
      expect(all[2].title).to.equal("Alice Task 2");
    });

    it("getMyChallenges should return only challenges for msg.sender", async function () {
      const aliceChallenges = await challengeMe.connect(alice).getMyChallenges();
      expect(aliceChallenges.length).to.equal(2);
      expect(aliceChallenges[0].title).to.equal("Alice Task 1");
      expect(aliceChallenges[1].title).to.equal("Alice Task 2");

      const bobChallenges = await challengeMe.connect(bob).getMyChallenges();
      expect(bobChallenges.length).to.equal(1);
      expect(bobChallenges[0].title).to.equal("Bob Task 1");
    });

    it("totalChallenges should return correct count", async function () {
      expect(await challengeMe.totalChallenges()).to.equal(3);
    });
  });
});
