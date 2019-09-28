const CryptoApis = require('cryptoapis.io')
const apiKey = '51b9fdc39b679d0d7031fc87c686c3c0e75246ee'
const caClient = new CryptoApis(apiKey)

caClient.BC.DOGE.getSelectedNetwork()

const baseAsset = 'BTC'
const quoteAsset = 'USD'
caClient.CMD.exchangeRates.getSpecificRate(baseAsset, quoteAsset).then(function(result) {
    console.log(result)
})
    .catch(function(err) {
        console.error(err)
    })

/*
caClient.BC.ETH.address.generateAddress()
    .then(function(result) {
        console.log(result)
    })
    .catch(function(err) {
        console.error(err)
    })

*/