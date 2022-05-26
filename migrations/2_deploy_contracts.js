const MoonNft = artifacts.require("MoonNFT")

module.exports = async function (deployer) {

    const IPFS_IMAGE_METADATA_URI = `ipfs://${process.env.IPFS_IMAGE_METADATA_CID}/`

    await deployer.deploy(
        MoonNft,
        process.env.PROJECT_NAME,
        process.env.PROJECT_SYMBOL,
        process.env.MINT_COST,
        process.env.MAX_SUPPLY,
        IPFS_IMAGE_METADATA_URI,
    )
};