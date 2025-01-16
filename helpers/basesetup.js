const {
    time,
    loadFixture,
    mine
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
// const { ethers } = require("hardhat");
// const { BigNumber } = ethers;
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { BigNumber } = require('ethers')

require('ethers')

async function blockMine(n) {
    await mine(n);
    return await ethers.provider.getBlockNumber();
}

async function attachERC20(tokenAdr) {
    const sideToken = await ethers.getContractFactory("SideToken_ERC20");
    const iSideToken = sideToken.attach(tokenAdr)
    return iSideToken
}

async function attachFEE(tokenAdr) {
    const sideToken = await ethers.getContractFactory("SideToken_FEE");
    const iSideToken = sideToken.attach(tokenAdr)
    return iSideToken
}

async function attachCLOG(tokenAdr) {
    const sideToken = await ethers.getContractFactory("SideToken_CLOG");
    const iSideToken = sideToken.attach(tokenAdr)
    return iSideToken
}

async function attachPair(tokenAdr) {
    const sideToken = await ethers.getContractFactory("UniswapV2Pair");
    const iSideToken = sideToken.attach(tokenAdr)
    return iSideToken
}

async function currentBlockTime() {
    const blockNumBefore = await ethers.provider.getBlockNumber();
    const blockBefore = await ethers.provider.getBlock(blockNumBefore);
    const timestampBefore = blockBefore.timestamp;
    return timestampBefore
}

async function increaseTime(toIncrease) {
    await time.increase(toIncrease)
}

async function constValues() {

    ////////////////////////////
    // Basic constant values
    ////////////////////////////

    const MIN_TOKEN = "10000000"

    const BUY_AMOUNT = "500000000"

    const ONET_TOKEN = "1000000000000000"
    const ONE_TOKEN = "1000000000000000000"
    const TWO_TOKEN = "2000000000000000000"
    const TEN_TOKEN = "10000000000000000000"
    const TWF_TOKEN = "25000000000000000000"
    const FIV_TOKEN = "50000000000000000000"
    const HUN_TOKEN = "100000000000000000000"
    const THUN_TOKEN = "200000000000000000000"
    const THA_TOKEN = "1000000000000000000000"
    const TWO_THA_TOKEN = "2000000000000000000000"
    const MIL_TOKEN = "1000000000000000000000000"
    const TMIL_TOKEN = "10000000000000000000000000"
    const BIL_TOKEN = "1000000000000000000000000000"

    const ONE_TOKEN6 = "1000000"
    const TWO_TOKEN6 = "2000000"
    const TEN_TOKEN6 = "10000000"
    const TWF_TOKEN6 = "20000000"
    const FIV_TOKEN6 = "50000000"
    const HUN_TOKEN6 = "100000000"
    const THU_TOKEN6 = "200000000"
    const THA_TOKEN6 = "1000000000"
    const MIL_TOKEN6 = "1000000000000"

    // const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
    const WETH = "0x4200000000000000000000000000000000000006";
    const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

    const TOTAL_SUPPLY = "42000000000000000000000000"
    const HALF_SUPPLY = "21000000000000000000000000"


    const [owner, user0, user1, user2] = await ethers.getSigners();

    const standardMetadata = {
        uri: "testUri",
        description: "testdescription",
        logo: "testLogo",
        website: "testWebsite",
        telegram: "testTelegram",
        twitter: "testTwitter",
        discord: "testDiscord"
    }

    return {
        owner, user0, user1, user2,
        BUY_AMOUNT,
        MIN_TOKEN, ONET_TOKEN, ONE_TOKEN, TWO_TOKEN, TEN_TOKEN, TWF_TOKEN, FIV_TOKEN, HUN_TOKEN, THUN_TOKEN, THA_TOKEN, TWO_THA_TOKEN, MIL_TOKEN, TMIL_TOKEN, BIL_TOKEN, WETH, ZERO_ADDRESS,
        ONE_TOKEN6, TWO_TOKEN6, TEN_TOKEN6, TWF_TOKEN6, FIV_TOKEN6, HUN_TOKEN6, THU_TOKEN6, THA_TOKEN6, MIL_TOKEN6, TOTAL_SUPPLY, HALF_SUPPLY,
        standardMetadata
    };
}

async function setupContracts(owner, metadata) {
    const block = await ethers.provider.getBlock('latest');
    const next_gas_price = Math.ceil(Number(block.baseFeePerGas) * 2);

    await network.provider.send("evm_setAutomine", [true]);

    ////////////////////////////
    // Basic contracts
    ////////////////////////////


    ////////////////////////////
    // Basic contracts
    ////////////////////////////

    const TokenFactory01 = await ethers.getContractFactory("TokenFactory01");
    const iTokenFactory01 = await TokenFactory01.deploy(owner.address, { maxFeePerGas: next_gas_price });
    const TokenFactory02 = await ethers.getContractFactory("TokenFactory02");
    const iTokenFactory02 = await TokenFactory02.deploy(owner.address, { maxFeePerGas: next_gas_price });
    const TokenFactory03 = await ethers.getContractFactory("TokenFactory03");
    const iTokenFactory03 = await TokenFactory03.deploy(owner.address, { maxFeePerGas: next_gas_price });

    const TestBundleSwap = await ethers.getContractFactory("Bundle");
    const iTestBundleSwap = await TestBundleSwap.deploy(); // {maxFeePerGas: next_gas_price});

    console.log("iTestBundleSwap owner", await iTestBundleSwap.owner())
    const LiqudityAdding = await ethers.getContractFactory("LiqudityAdding");
    const iLiqudityAdding = await LiqudityAdding.deploy(owner.address, { maxFeePerGas: next_gas_price });

    //address initialOwner_, string memory name_, string memory symbol_, address tokenFactory0_, address tokenFactory1_, address tokenFactory2_, address liquidityManager_, uint salt_, Metadata memory metadata_
    const MainToken = await ethers.getContractFactory("MainToken");
    const iMainToken = await MainToken.deploy(owner.address, "I LUV MEMES", "ILM", iTokenFactory01.target, iTokenFactory02.target, iTokenFactory03.target, iLiqudityAdding.target, 0, metadata, { maxFeePerGas: next_gas_price });

    const ETHLauncher = await ethers.getContractFactory("ETHLauncher");
    const iETHLauncher = await ETHLauncher.deploy(iMainToken.target, iTokenFactory01.target, iTokenFactory02.target, iTokenFactory03.target, { maxFeePerGas: next_gas_price });
    
    const StakingNFT = await ethers.getContractFactory("StakingNFT");
    const iStakingNFT = await StakingNFT.deploy(owner.address, "Staking ILM NFT", "sILM_NFT", iMainToken.target, { maxFeePerGas: next_gas_price });

    const StakedToken = await ethers.getContractFactory("StakedToken");

    const stakedTokenAdr = await iStakingNFT.iStakedToken()
    const iStakedToken = StakedToken.attach(stakedTokenAdr)

    const Swapper = await ethers.getContractFactory("Swapper");
    const iSwapper = await Swapper.deploy(iMainToken.target, { maxFeePerGas: next_gas_price });

    const LuvBomb = await ethers.getContractFactory("LuvBomb");
    const iLuvBomb = await LuvBomb.deploy(iMainToken.target, iStakingNFT.target, { maxFeePerGas: next_gas_price });

    const TestToken = await ethers.getContractFactory("TestToken")
    const iTestToken = await TestToken.deploy("asd", "asd", { maxFeePerGas: next_gas_price });

    // const LockedBondingCurve = await ethers.getContractFactory("LockedBondingCurve");
    // const iLockedBondingCurve = await LockedBondingCurve.deploy(iMainToken.target, iLiqudityAdding.target, iStakingNFT.target, iStakedToken.target, iTestToken.target, { maxFeePerGas: next_gas_price });

    await iMainToken.changeSwapper(iSwapper.target);


    // await iMainToken.changeUnlimitedAccount(iLockedBondingCurve.target, true)
    await iMainToken.changeUnlimitedAccount(iSwapper.target, true)


    await iTokenFactory01.setMainTokenAdr(iMainToken.target)
    await iTokenFactory02.setMainTokenAdr(iMainToken.target)
    await iTokenFactory03.setMainTokenAdr(iMainToken.target)

    const RevenueStaking = await ethers.getContractFactory("RevenueStaking");
    const iRevenueStaking0 = await RevenueStaking.deploy(
        iStakedToken.target,
        iStakedToken.target,
        iLiqudityAdding.target,
        owner.address, { maxFeePerGas: next_gas_price }
    );

    const iRevenueStaking1 = await RevenueStaking.deploy(
        iStakedToken.target,
        iStakedToken.target,
        iLiqudityAdding.target,
        owner.address, { maxFeePerGas: next_gas_price }
    );

    const iRevenueStaking2 = await RevenueStaking.deploy(
        iStakedToken.target,
        iMainToken.target,
        iLiqudityAdding.target,
        owner.address, { maxFeePerGas: next_gas_price }
    );

    // await iMainToken.changeFeeExcludedAccount(iRevenueStaking0.target, true)
    // await iMainToken.changeFeeExcludedAccount(iRevenueStaking1.target, true)
    // await iMainToken.changeFeeExcludedAccount(iRevenueStaking2.target, true)

    // await iMainToken.changeFeeExcludedAccount(iETHLauncher.target, true)
    // await iMainToken.changeUnlimitedAccount(iETHLauncher.target, true)

    await iMainToken.changeFeeExcludedAccountAndUnlimited(
        [
            iStakingNFT.target,
            iLiqudityAdding.target,
            iRevenueStaking0.target,
            iRevenueStaking1.target,
            iRevenueStaking2.target,
            iETHLauncher.target,
            iTestBundleSwap.target
        ],
        true
    )




    // console.log("LiqAdder", iLiqudityAdding.target)
    // console.log("LiqAdder - revenueStaker2", await iLiqudityAdding.revenueStaker2())
    // console.log("RevenueStaking2 - feeSourceAdr", await iRevenueStaking2.feeSourceAdr())

    await iLiqudityAdding.setTokenAndStaker(iMainToken.target, iStakingNFT.target)

    await iLiqudityAdding.setRevenueStaker(iRevenueStaking0.target, iRevenueStaking1.target, iRevenueStaking2.target, owner.address)

    // console.log("LiqAdder - revenueStaker2", await iLiqudityAdding.revenueStaker2())
    // console.log("RevenueStaking2 - feeSourceAdr", await iRevenueStaking2.feeSourceAdr())
    // await iLiqudityAdding.setLockedBondingCurve(iLockedBondingCurve.target)

    return {
        iTokenFactory01, iTokenFactory02, iTokenFactory03, iMainToken, iStakingNFT, iStakedToken,
        iLiqudityAdding, iTestBundleSwap, iTestToken,
        iRevenueStaking0, iRevenueStaking1, iRevenueStaking2,
        iSwapper, iLuvBomb, iETHLauncher
        // iLockedBondingCurve
    };
}

function setupV2(owner) {
    const ABI_V2 = [
        {
            "inputs": [{ "internalType": "address", "name": "_factory", "type": "address" }, { "internalType": "address", "name": "_WETH", "type": "address" }],
            "stateMutability": "nonpayable", "type": "constructor"
        },
        { "inputs": [], "name": "WETH", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, {
            "inputs": [{
                "internalType": "address", "name": "tokenA",
                "type": "address"
            }, { "internalType": "address", "name": "tokenB", "type": "address" }, { "internalType": "uint256", "name": "amountADesired", "type": "uint256" }, {
                "internalType": "uint256", "name": "amountBDesired",
                "type": "uint256"
            }, { "internalType": "uint256", "name": "amountAMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountBMin", "type": "uint256" }, {
                "internalType": "address", "name": "to", "type":
                    "address"
            }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "addLiquidity", "outputs": [{ "internalType": "uint256", "name": "amountA", "type": "uint256" },
            { "internalType": "uint256", "name": "amountB", "type": "uint256" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function"
        },
        {
            "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "amountTokenDesired", "type": "uint256" }, {
                "internalType": "uint256",
                "name": "amountTokenMin", "type": "uint256"
            }, { "internalType": "uint256", "name": "amountETHMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" },
            { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "addLiquidityETH", "outputs": [{ "internalType": "uint256", "name": "amountToken", "type": "uint256" },
            { "internalType": "uint256", "name": "amountETH", "type": "uint256" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }], "stateMutability": "payable", "type": "function"
        },
        { "inputs": [], "name": "factory", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, {
            "inputs": [{
                "internalType": "uint256",
                "name": "amountOut", "type": "uint256"
            }, { "internalType": "uint256", "name": "reserveIn", "type": "uint256" }, { "internalType": "uint256", "name": "reserveOut", "type": "uint256" }],
            "name": "getAmountIn", "outputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }], "stateMutability": "pure", "type": "function"
        },
        {
            "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "reserveIn", "type": "uint256" },
            { "internalType": "uint256", "name": "reserveOut", "type": "uint256" }], "name": "getAmountOut", "outputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }],
            "stateMutability": "pure", "type": "function"
        }, {
            "inputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }, {
                "internalType": "address[]", "name": "path",
                "type": "address[]"
            }], "name": "getAmountsIn", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "view", "type": "function"
        },
        {
            "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }], "name": "getAmountsOut",
            "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "view", "type": "function"
        }, {
            "inputs": [{
                "internalType": "uint256",
                "name": "amountA", "type": "uint256"
            }, { "internalType": "uint256", "name": "reserveA", "type": "uint256" }, { "internalType": "uint256", "name": "reserveB", "type": "uint256" }],
            "name": "quote", "outputs": [{ "internalType": "uint256", "name": "amountB", "type": "uint256" }], "stateMutability": "pure", "type": "function"
        },
        {
            "inputs": [{ "internalType": "address", "name": "tokenA", "type": "address" }, { "internalType": "address", "name": "tokenB", "type": "address" },
            { "internalType": "uint256", "name": "liquidity", "type": "uint256" }, { "internalType": "uint256", "name": "amountAMin", "type": "uint256" },
            { "internalType": "uint256", "name": "amountBMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" },
            { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "removeLiquidity", "outputs": [{ "internalType": "uint256", "name": "amountA", "type": "uint256" },
            { "internalType": "uint256", "name": "amountB", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function"
        },
        {
            "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" },
            { "internalType": "uint256", "name": "amountTokenMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountETHMin", "type": "uint256" },
            { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }],
            "name": "removeLiquidityETH", "outputs": [{ "internalType": "uint256", "name": "amountToken", "type": "uint256" }, {
                "internalType": "uint256", "name": "amountETH",
                "type": "uint256"
            }], "stateMutability": "nonpayable", "type": "function"
        }, {
            "inputs": [{ "internalType": "address", "name": "token", "type": "address" },
            { "internalType": "uint256", "name": "liquidity", "type": "uint256" }, { "internalType": "uint256", "name": "amountTokenMin", "type": "uint256" },
            { "internalType": "uint256", "name": "amountETHMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" },
            { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "removeLiquidityETHSupportingFeeOnTransferTokens",
            "outputs": [{ "internalType": "uint256", "name": "amountETH", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function"
        },
        {
            "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" },
            { "internalType": "uint256", "name": "amountTokenMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountETHMin", "type": "uint256" },
            { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }, { "internalType": "bool", "name": "approveMax", "type": "bool" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" },
            { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "removeLiquidityETHWithPermit", "outputs": [{ "internalType": "uint256", "name": "amountToken", "type": "uint256" }, { "internalType": "uint256", "name": "amountETH", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function"
        }, {
            "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, {
                "internalType": "uint256",
                "name": "liquidity", "type": "uint256"
            }, { "internalType": "uint256", "name": "amountTokenMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountETHMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }, { "internalType": "bool", "name": "approveMax", "type": "bool" }, {
                "internalType": "uint8",
                "name": "v", "type": "uint8"
            }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "removeLiquidityETHWithPermitSupportingFeeOnTransferTokens", "outputs": [{ "internalType": "uint256", "name": "amountETH", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function"
        }, {
            "inputs": [{
                "internalType": "address",
                "name": "tokenA", "type": "address"
            }, { "internalType": "address", "name": "tokenB", "type": "address" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }, { "internalType": "uint256", "name": "amountAMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountBMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }, { "internalType": "bool", "name": "approveMax", "type": "bool" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "removeLiquidityWithPermit", "outputs": [{ "internalType": "uint256", "name": "amountA", "type": "uint256" }, { "internalType": "uint256", "name": "amountB", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function"
        }, { "inputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapETHForExactTokens", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapExactETHForTokens", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "payable", "type": "function" }, {
            "inputs": [{ "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }],
            "name": "swapExactETHForTokensSupportingFeeOnTransferTokens", "outputs": [], "stateMutability": "payable", "type": "function"
        }, { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapExactTokensForETH", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapExactTokensForETHSupportingFeeOnTransferTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapExactTokensForTokens", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "nonpayable", "type": "function" }, {
            "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapExactTokensForTokensSupportingFeeOnTransferTokens", "outputs": [],
            "stateMutability": "nonpayable", "type": "function"
        }, { "inputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }, { "internalType": "uint256", "name": "amountInMax", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapTokensForExactETH", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "nonpayable", "type": "function" }, {
            "inputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }, { "internalType": "uint256", "name": "amountInMax", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" },
            { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapTokensForExactTokens", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "nonpayable", "type": "function"
        }, { "stateMutability": "payable", "type": "receive" }]

    const ABI_FACTORY = [{ "inputs": [{ "internalType": "address", "name": "_feeToSetter", "type": "address" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "token0", "type": "address" }, { "indexed": true, "internalType": "address", "name": "token1", "type": "address" }, { "indexed": false, "internalType": "address", "name": "pair", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "", "type": "uint256" }], "name": "PairCreated", "type": "event" }, { "constant": true, "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "allPairs", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "allPairsLength", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "tokenA", "type": "address" }, { "internalType": "address", "name": "tokenB", "type": "address" }], "name": "createPair", "outputs": [{ "internalType": "address", "name": "pair", "type": "address" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "feeTo", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "feeToSetter", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "address", "name": "", "type": "address" }], "name": "getPair", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "_feeTo", "type": "address" }], "name": "setFeeTo", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "_feeToSetter", "type": "address" }], "name": "setFeeToSetter", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }]
    // BASE: 0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24
    // BASE Aerodrome Router: 0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43
    // BASE Aerodrome Factor: 0x420DD381b31aEf6683db6B902084cB0FFECe40Da
    // ETH: 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D
    const SWAP_ROUTER_V2 = "0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24"
    const FACTORY_V2 = "0x8909Dc15e40173Ff4699343b6eB8132c65e18eC6"

    const iUniswapV2Router = new ethers.Contract(SWAP_ROUTER_V2, ABI_V2, owner);
    const iUniswapV2Factory = new ethers.Contract(FACTORY_V2, ABI_FACTORY, owner);

    return { iUniswapV2Router, iUniswapV2Factory }
}

function setupV3(owner) {
    const SWAP_ROUTER_V3 = "0x2626664c2603336E57B271c5C0b26F421741e481"

    const ABI_V3 = [
        {
            "inputs": [{ "internalType": "address", "name": "_factoryV2", "type": "address" },
            { "internalType": "address", "name": "factoryV3", "type": "address" },
            { "internalType": "address", "name": "_positionManager", "type": "address" },
            { "internalType": "address", "name": "_WETH9", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor"
        },
        { "inputs": [], "name": "WETH9", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
        { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }], "name": "approveMax", "outputs": [], "stateMutability": "payable", "type": "function" },
        { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }], "name": "approveMaxMinusOne", "outputs": [], "stateMutability": "payable", "type": "function" },
        { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }], "name": "approveZeroThenMax", "outputs": [], "stateMutability": "payable", "type": "function" },
        { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }], "name": "approveZeroThenMaxMinusOne", "outputs": [], "stateMutability": "payable", "type": "function" },
        {
            "inputs": [{ "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "callPositionManager", "outputs": [{ "internalType": "bytes", "name": "result", "type": "bytes" }],
            "stateMutability": "payable", "type": "function"
        }, {
            "inputs": [{ "internalType": "bytes[]", "name": "paths", "type": "bytes[]" }, { "internalType": "uint128[]", "name": "amounts", "type": "uint128[]" },
            { "internalType": "uint24", "name": "maximumTickDivergence", "type": "uint24" }, { "internalType": "uint32", "name": "secondsAgo", "type": "uint32" }], "name": "checkOracleSlippage",
            "outputs": [], "stateMutability": "view", "type": "function"
        }, {
            "inputs": [{ "internalType": "bytes", "name": "path", "type": "bytes" }, { "internalType": "uint24", "name": "maximumTickDivergence", "type": "uint24" },
            { "internalType": "uint32", "name": "secondsAgo", "type": "uint32" }], "name": "checkOracleSlippage", "outputs": [], "stateMutability": "view", "type": "function"
        },
        {
            "inputs": [{
                "components": [{ "internalType": "bytes", "name": "path", "type": "bytes" }, { "internalType": "address", "name": "recipient", "type": "address" },
                { "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "amountOutMinimum", "type": "uint256" }],
                "internalType": "struct IV3SwapRouter.ExactInputParams", "name": "params", "type": "tuple"
            }], "name": "exactInput", "outputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }],
            "stateMutability": "payable", "type": "function"
        }, {
            "inputs": [{
                "components": [{ "internalType": "address", "name": "tokenIn", "type": "address" }, { "internalType": "address", "name": "tokenOut", "type": "address" },
                { "internalType": "uint24", "name": "fee", "type": "uint24" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "amountOutMinimum", "type": "uint256" }, { "internalType": "uint160", "name": "sqrtPriceLimitX96", "type": "uint160" }], "internalType": "struct IV3SwapRouter.ExactInputSingleParams", "name": "params", "type": "tuple"
            }], "name": "exactInputSingle", "outputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }], "stateMutability": "payable", "type": "function"
        }, { "inputs": [{ "components": [{ "internalType": "bytes", "name": "path", "type": "bytes" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amountOut", "type": "uint256" }, { "internalType": "uint256", "name": "amountInMaximum", "type": "uint256" }], "internalType": "struct IV3SwapRouter.ExactOutputParams", "name": "params", "type": "tuple" }], "name": "exactOutput", "outputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "components": [{ "internalType": "address", "name": "tokenIn", "type": "address" }, { "internalType": "address", "name": "tokenOut", "type": "address" }, { "internalType": "uint24", "name": "fee", "type": "uint24" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amountOut", "type": "uint256" }, { "internalType": "uint256", "name": "amountInMaximum", "type": "uint256" }, { "internalType": "uint160", "name": "sqrtPriceLimitX96", "type": "uint160" }], "internalType": "struct IV3SwapRouter.ExactOutputSingleParams", "name": "params", "type": "tuple" }], "name": "exactOutputSingle", "outputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "factory", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "factoryV2", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "getApprovalType", "outputs": [{ "internalType": "enum IApproveAndCall.ApprovalType", "name": "", "type": "uint8" }], "stateMutability": "nonpayable", "type": "function" }, {
            "inputs": [{
                "components": [{ "internalType": "address", "name": "token0", "type": "address" }, { "internalType": "address", "name": "token1", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" },
                { "internalType": "uint256", "name": "amount0Min", "type": "uint256" }, { "internalType": "uint256", "name": "amount1Min", "type": "uint256" }], "internalType": "struct IApproveAndCall.IncreaseLiquidityParams", "name": "params", "type": "tuple"
            }], "name": "increaseLiquidity", "outputs": [{ "internalType": "bytes", "name": "result", "type": "bytes" }], "stateMutability": "payable", "type": "function"
        }, { "inputs": [{ "components": [{ "internalType": "address", "name": "token0", "type": "address" }, { "internalType": "address", "name": "token1", "type": "address" }, { "internalType": "uint24", "name": "fee", "type": "uint24" }, { "internalType": "int24", "name": "tickLower", "type": "int24" }, { "internalType": "int24", "name": "tickUpper", "type": "int24" }, { "internalType": "uint256", "name": "amount0Min", "type": "uint256" }, { "internalType": "uint256", "name": "amount1Min", "type": "uint256" }, { "internalType": "address", "name": "recipient", "type": "address" }], "internalType": "struct IApproveAndCall.MintParams", "name": "params", "type": "tuple" }], "name": "mint", "outputs": [{ "internalType": "bytes", "name": "result", "type": "bytes" }], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "previousBlockhash", "type": "bytes32" }, { "internalType": "bytes[]", "name": "data", "type": "bytes[]" }], "name": "multicall", "outputs": [{ "internalType": "bytes[]", "name": "", "type": "bytes[]" }], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "deadline", "type": "uint256" }, { "internalType": "bytes[]", "name": "data", "type": "bytes[]" }], "name": "multicall", "outputs": [{ "internalType": "bytes[]", "name": "", "type": "bytes[]" }], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "bytes[]", "name": "data", "type": "bytes[]" }], "name": "multicall", "outputs": [{ "internalType": "bytes[]", "name": "results", "type": "bytes[]" }], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "positionManager", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "pull", "outputs": [], "stateMutability": "payable", "type": "function" },
        { "inputs": [], "name": "refundETH", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "selfPermit", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "nonce", "type": "uint256" }, { "internalType": "uint256", "name": "expiry", "type": "uint256" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "selfPermitAllowed", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "nonce", "type": "uint256" }, { "internalType": "uint256", "name": "expiry", "type": "uint256" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "selfPermitAllowedIfNecessary", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "selfPermitIfNecessary", "outputs": [], "stateMutability": "payable", "type": "function" }, {
            "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }], "name": "swapExactTokensForTokens",
            "outputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }], "stateMutability": "payable", "type": "function"
        }, {
            "inputs": [{
                "internalType": "uint256", "name": "amountOut",
                "type": "uint256"
            }, { "internalType": "uint256", "name": "amountInMax", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }], "name": "swapTokensForExactTokens", "outputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }], "stateMutability": "payable", "type": "function"
        }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "amountMinimum", "type": "uint256" }, { "internalType": "address", "name": "recipient", "type": "address" }], "name": "sweepToken", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "amountMinimum", "type": "uint256" }], "name": "sweepToken", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "amountMinimum", "type": "uint256" }, { "internalType": "uint256", "name": "feeBips", "type": "uint256" }, { "internalType": "address", "name": "feeRecipient", "type": "address" }], "name": "sweepTokenWithFee", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "amountMinimum", "type": "uint256" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "feeBips", "type": "uint256" }, { "internalType": "address", "name": "feeRecipient", "type": "address" }], "name": "sweepTokenWithFee", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "int256", "name": "amount0Delta", "type": "int256" }, { "internalType": "int256", "name": "amount1Delta", "type": "int256" }, { "internalType": "bytes", "name": "_data", "type": "bytes" }], "name": "uniswapV3SwapCallback", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountMinimum", "type": "uint256" }, { "internalType": "address", "name": "recipient", "type": "address" }], "name": "unwrapWETH9", "outputs": [], "stateMutability": "payable", "type": "function" },
        { "inputs": [{ "internalType": "uint256", "name": "amountMinimum", "type": "uint256" }], "name": "unwrapWETH9", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountMinimum", "type": "uint256" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "feeBips", "type": "uint256" }, { "internalType": "address", "name": "feeRecipient", "type": "address" }], "name": "unwrapWETH9WithFee", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountMinimum", "type": "uint256" }, { "internalType": "uint256", "name": "feeBips", "type": "uint256" }, { "internalType": "address", "name": "feeRecipient", "type": "address" }], "name": "unwrapWETH9WithFee", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "wrapETH", "outputs": [], "stateMutability": "payable", "type": "function" }, { "stateMutability": "payable", "type": "receive" }]

    const iUniswapV3Router = new ethers.Contract(SWAP_ROUTER_V3, ABI_V3, owner);

    return { iUniswapV3Router }

}

async function liqForTestToken(user, iUniswapV2Router, iTestToken, ETH_AMOUNT, TOKEN_AMOUNT) {

    await iTestToken.connect(user).approve(iUniswapV2Router.target, TOKEN_AMOUNT)

    const bts = await currentBlockTime()

    await iUniswapV2Router.connect(user).addLiquidityETH(
        iTestToken.target,
        TOKEN_AMOUNT,
        0,
        0,
        user.address,
        bts + 20,
        { value: ETH_AMOUNT }
    );
}

async function baseSetup() {


    const {
        owner, user0, user1, user2,
        BUY_AMOUNT,
        MIN_TOKEN, ONET_TOKEN, ONE_TOKEN, TWO_TOKEN, TEN_TOKEN, TWF_TOKEN, FIV_TOKEN, HUN_TOKEN, THUN_TOKEN, THA_TOKEN, TWO_THA_TOKEN, MIL_TOKEN, TMIL_TOKEN, BIL_TOKEN, WETH, ZERO_ADDRESS,
        ONE_TOKEN6, TWO_TOKEN6, TEN_TOKEN6, TWF_TOKEN6, FIV_TOKEN6, HUN_TOKEN6, THU_TOKEN6, THA_TOKEN6, MIL_TOKEN6, TOTAL_SUPPLY, HALF_SUPPLY,
        standardMetadata
    } = await constValues()


    const { iTokenFactory01, iTokenFactory02, iTokenFactory03, iMainToken, iStakingNFT, iStakedToken,
        iLiqudityAdding, iTestBundleSwap, iTestToken,
        iRevenueStaking0, iRevenueStaking1, iRevenueStaking2,
        iSwapper, iLuvBomb, iETHLauncher
        // iLockedBondingCurve
     } = await setupContracts(owner, standardMetadata)

    const { iUniswapV3Router } = setupV3(owner)

    const { iUniswapV2Router, iUniswapV2Factory } = setupV2(owner)

    await iTestToken.transfer(user2.address, "2500000000000")
    await liqForTestToken(user2, iUniswapV2Router, iTestToken, THA_TOKEN, "2500000000000")

    const IWETH = await attachERC20(WETH)



    // if (withLiq) {
    //   await setupLiq(iFactory, iRouter, iCollateral, iPairToken1, iPairToken2, iCollector, owner, iWBNB)
    // }


    return {
        iTokenFactory01, iTokenFactory02, iTokenFactory03, iMainToken, iStakingNFT, iStakedToken,
        iLiqudityAdding, iTestBundleSwap, iTestToken, IWETH,
        iRevenueStaking0, iRevenueStaking1, iRevenueStaking2,
        iSwapper, iLuvBomb, iETHLauncher,
        iUniswapV2Router, iUniswapV2Factory, iUniswapV3Router,
        owner, user0, user1, user2,
        MIN_TOKEN, ONET_TOKEN, ONE_TOKEN, TWO_TOKEN, TEN_TOKEN, TWF_TOKEN, FIV_TOKEN, HUN_TOKEN, THUN_TOKEN, THA_TOKEN, TWO_THA_TOKEN, MIL_TOKEN, TMIL_TOKEN, BIL_TOKEN, WETH, ZERO_ADDRESS,
        ONE_TOKEN6, TWO_TOKEN6, TEN_TOKEN6, TWF_TOKEN6, FIV_TOKEN6, HUN_TOKEN6, THU_TOKEN6, THA_TOKEN6, MIL_TOKEN6, TOTAL_SUPPLY, HALF_SUPPLY,
        BUY_AMOUNT,
        standardMetadata
        // iLockedBondingCurve
    };
}

async function statLiq(owner, iMainToken, iLiqudityAdding, TEN_TOKEN) {

    const amount = "4200000000000000000000000" // 10% of the total supply
    const test = "10000000000000000000"

    console.log("1")
    await iMainToken.transfer(iLiqudityAdding.target, amount)

    console.log("2")
    await iLiqudityAdding.createStartLiq()
    
    console.log("3")
    const pool = await iLiqudityAdding.startPool();

    return pool
}

// async function statLiqForBD(WETH, owner, iMainToken, iLiqudityAdding, iUniswapV2Router, iTestToken, HALF_SUPPLY, TEN_TOKEN) {

//     const BUY_AMOUNT = "500000000"
//     const bts = await currentBlockTime()

//     await iTestToken.approve(iUniswapV2Router.target, "25000000000");
//     await iUniswapV2Router.addLiquidityETH(
//         iTestToken.target,
//         "25000000000",
//         0,
//         0,
//         owner.address,
//         bts + 200,
//         {value:TEN_TOKEN}
//     )
//     await iMainToken.transfer(iLiqudityAdding.target, HALF_SUPPLY)

//     const inAmount = ethers.toBigInt("2500000000") + await iLockedBondingCurve.roundOneTotalCollected()
//     const minAmountOut = await iUniswapV2Router.getAmountOut(
//         inAmount,
//         iTestToken.target,
//         WETH
//     )

//     await iTestToken.approve(iLockedBondingCurve.target, "2500000000")
//     await iLockedBondingCurve.createFirstLiqAndBuy("2500000000", minAmountOut)


//     const pool = await iLiqudityAdding.startPool();

//     return pool
// }

async function attachERC20(tokenAdr) {
    const sideToken = await ethers.getContractFactory("SideToken_ERC20");
    const iSideToken = sideToken.attach(tokenAdr)
    return iSideToken
}

async function attachPair(tokenAdr) {
    const sideToken = await ethers.getContractFactory("UniswapV2Pair");
    const iSideToken = sideToken.attach(tokenAdr)
    return iSideToken
}

module.exports = {
    baseSetup,
    blockMine,
    currentBlockTime,
    increaseTime,
    statLiq,
    setupV2,
    setupV3,
    attachPair,
    attachERC20,
    attachFEE,
    attachCLOG,
  };