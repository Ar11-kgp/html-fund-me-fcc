// in nodejs
// require()

// in front-end javascript you can't use require
// import
import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"
const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")

connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw
console.log(ethers)

async function connect() {
    console.log("javascript seekh rha hu vro")
    // we r gonna write functions here which will interact with our frontend
    // first thing we shud be doing us check to see if window.ethereum exists,
    // bcoz if it doesn't, we can't connect to the blockchain
    if (typeof window.ethereum !== "undefined") {
        console.log("I see a metamask")
        await window.ethereum.request({ method: "eth_requestAccounts" })
        connectButton.innerHTML = "Connected!"
        // we will connect our acc using eth_requestAccounts method
        // now our website can make API calls to our metamask acc
    } else {
        connectButton.innerHTML = "Please install metamask!"
    }
}

// getBlanace
async function getBalance() {
    if (typeof window.ethereum != "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
        // to make reading ethers formatted numbers much easier to read
    }
}

// fund function
async function fund() {
    // normally we will pass parameters directly to the funcs
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`Funding with ${ethAmount}...`)
    if (typeof window.ethereum !== "undefined") {
        // To send a transaction, we need:
        // provider / connection to the blockchain
        // signer / wallet / someone with some gas
        // contract that we r interacting with
        // ^ABI & Address
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        // Web3Provider is similar to JsonRpcProvider where insert an endpoint
        // it takes that http endpoint and automatically sticks it in ethers for us
        const signer = provider.getSigner()
        // this will return whichever wallet is connected from the provider(metamask)
        console.log(signer) // will return whicherver acc is connected to it
        const contract = new ethers.Contract(contractAddress, abi, signer)
        // to create our transaction:
        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            // listen for the tx to be mined
            await listenForTransactionMine(transactionResponse, provider)
            console.log("Done!")
            // await keyword says we r gonna stop until this func is completely done
        } catch (error) {
            console.log(error)
        }
    }
}

function listenForTransactionMine(transactionResponse, provider) {
    // using JS' async functionality to its massive advantage
    console.log(`Mining ${transactionResponse.hash}...`) // waiting for transaction to be mined
    //return new Promise()
    // listen for this tx to finish
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(
                `Completed with ${transactionReceipt.confirmations} confirmations`
            )
            // once this provider.once sees that there's a transaction hash, it will give as an input parameter to our listener func
            // the transactionReceipt
        }) // passing anonymous func, this will be our listener func
    })
    // if this promise works correctly, call resolve ()..for us its wen listner finishes listening
    // we will reject if there was some type of timeout
}
// listenForTransaction will finish before provider.once finishes, we don't actually wait for provider.once to finish
// we wait for our listener to finish listening, which is why we will use promises here

async function withdraw() {
    if (typeof window.ethereum != "undefined") {
        console.log("Withdrawing...")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        // this will return whichever wallet is connected from the provider(metamask)
        const contract = new ethers.Contract(contractAddress, abi, signer)

        try {
            const transactionResponse = await contract.withdraw()
            // listen for the tx to be mined
            await listenForTransactionMine(transactionResponse, provider)
            console.log("Done!")
            // await keyword says we r gonna stop until this func is completely done
        } catch (error) {
            console.log(error)
        }
    }
}
