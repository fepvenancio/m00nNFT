const MoonNft = artifacts.require("./MoonNFT")

require('chai')
    .use(require('chai-as-promised'))
    .should()

const EVM_REVERT = 'VM Exception while processing transaction: revert'

contract('MoonNFT', ([deployer, user]) => {

    const NAME = 'Moon NFT'
    const SYMBOL = 'M00N'
    const COST = 0
    const MAX_SUPPLY = 5

    // NOTE: If images are already uploaded to IPFS, you may choose to update the links, otherwise you can leave it be.
    const IPFS_IMAGE_METADATA_URI = 'ipfs://QmaDDcb7VAk3BkhTySs7Ak6vdR8vz4WUnZvuXJ62mQjdx2/'

    let moonNft

    describe('Deployment', () => {

        beforeEach(async () => {

            moonNft = await MoonNft.new(
                NAME,
                SYMBOL,
                COST,
                MAX_SUPPLY,
                IPFS_IMAGE_METADATA_URI,
            )
        })

        it('Returns the contract name', async () => {
            result = await moonNft.name()
            result.should.equal(NAME)
        })

        it('Returns the symbol', async () => {
            result = await moonNft.symbol()
            result.should.equal(SYMBOL)
        })

        it('Returns the cost to mint', async () => {
            result = await moonNft.cost()
            result.toString().should.equal(COST.toString())
        })

        it('Returns the max supply', async () => {
            result = await moonNft.maxSupply()
            result.toString().should.equal(MAX_SUPPLY.toString())
        })

        it('Returns the max mint amount', async () => {
            result = await moonNft.maxMintAmount()
            result.toString().should.equal('1')
        })
    })

    describe('Minting', async () => {
        describe('Success', async () => {

            let result

            beforeEach(async () => {
                moonNft = await MoonNft.new(
                    NAME,
                    SYMBOL,
                    COST,
                    MAX_SUPPLY,
                    IPFS_IMAGE_METADATA_URI,
                )

                result = await moonNft.mint(1, { from: user, value: web3.utils.toWei('0', 'ether') })
            })

            it('Returns the address of the minter', async () => {
                let event = result.logs[0].args
                event.to.should.equal(user)
            })

            it('Updates the total supply', async () => {
                result = await moonNft.totalSupply()
                result.toString().should.equal('1')
            })

            it('Returns IPFS URI', async () => {
                result = await moonNft.tokenURI(1)
                result.should.equal(`${IPFS_IMAGE_METADATA_URI}1.json`)
            })

            it('Returns how many a minter owns', async () => {
                result = await moonNft.balanceOf(user)
                result.toString().should.equal('1')
            })

            it('Returns the IDs of minted NFTs', async () => {
                result = await moonNft.balance(user)
                result.length.should.equal(1)
                //result[0].toString().should.equal('1')
            })
        })
    })

    describe('Updating Contract State', async () => {
        describe('Success', async () => {

            let result

            beforeEach(async () => {
                moonNft = await MoonNft.new(
                    NAME,
                    SYMBOL,
                    COST,
                    MAX_SUPPLY,
                    IPFS_IMAGE_METADATA_URI,
                )
            })

            it('Sets the max batch mint amount', async () => {
                let amount = 5 // Different from the default contract state
                await moonNft.setmaxMintAmount(5, { from: deployer })
                result = await moonNft.maxMintAmount()
                result.toString().should.equal(amount.toString())
            })

            it('Sets the base extension', async () => {
                let extension = '.example' // Different from the default contract state
                await moonNft.setBaseExtension('.example', { from: deployer })
                result = await moonNft.baseExtension()
                result.toString().should.equal(extension)
            })
        })
    })
})