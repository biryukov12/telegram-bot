process.env["NTBA_FIX_319"] = 1
const TelegramBot = require('node-telegram-bot-api')
const request = require('request')
const CryptoApis = require('cryptoapis.io')
const apiKey = '51b9fdc39b679d0d7031fc87c686c3c0e75246ee'
const TOKEN = '471621092:AAEZqXY7nBPgagsCwLQlnlIjM9ZXomQhr2k'
const caClient = new CryptoApis(apiKey)
const baseRUB = 'RUB'
const baseUSD = 'USD'
const baseBTC = 'BTC'
const bot = new TelegramBot(TOKEN, {
    polling: {
        interval: 300,
        autoStart: true,
        params: {
            timeout: 10
        }
    }
})


// /Menu
// /Start dialog
bot.onText(/\/start/, (msg) => {
    const chatID = msg.chat.id
    bot.sendSticker(msg.chat.id, msg.file_id ='CAADAgADoD0AAlOx9wNrJbrMA400lQI')
    bot.sendMessage(msg.chat.id, 'Чем могу помочь?', {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'Курс валют',
                        callback_data: 'curse'
                    },
                    {
                        text: 'Прогноз погоды',
                        callback_data: 'weather'
                    }]


            ]
        }
    })
    bot.sendMessage(msg.chat.id, '/help – для вызова справки.')
})
// /Value
bot.onText(/\/value/, (msg) => {
    const chatID = msg.chat.id
    bot.sendMessage(chatID, 'Выберите интересующую валюту:', {
        reply_markup:{
            inline_keyboard: [
                [
                    {
                        text:'$',
                        callback_data:'usd'
                    },

                    {
                        text:'€',
                        callback_data:'eur'
                    },

                    {
                        text:'₿',
                        callback_data:'btc'
                    }
                ]
            ]
        }
    })
})
// /Weather
bot.onText(/\/weather/, (msg) => {
    const chatID = msg.chat.id
    bot.sendMessage(chatID, 'Выберите город:', {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'Сафоново',
                        callback_data: 'saf'
                    },
                    {
                        text: 'Москва',
                        callback_data: 'msk'
                    },
                    {
                        text: 'Санкт-Петербург',
                        callback_data: 'spb'
                    }
                ],
                [{
                    text: 'Другой город',
                    callback_data: 'other'
                }]


            ]
        }
    })
})
// /Help
bot.onText(/\/help/, (msg) => {
    const chatID = msg.chat.id
    const htm = '• Для вызова главного меню отправьте <b>"m"</b>' + '\n• Прогноз погоды – <b>"w"</b>' + '\n• Курс валют – <b>"v"</b>' + '\n' +
        '\nЛучше подпишитесь на <a href="https://instagram.com/biryukov12">инстаграм</a> создателя '
    bot.sendMessage(chatID, htm,{
        parse_mode: 'HTML'
    })
})


// Inline keyboard

// Inline weather
// Choose city
bot.on('callback_query', query => {
    const chatID = query.message.chat.id
    if (`${query.data}` === 'weather') {
        bot.sendMessage(chatID, 'Выберите город:', {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Сафоново',
                            callback_data: 'saf'
                        },
                        {
                            text: 'Москва',
                            callback_data: 'msk'
                        },
                        {
                            text: 'Санкт-Петербург',
                            callback_data: 'spb'
                        },
                    ],
                    [{
                        text: 'Другой город',
                        callback_data: 'other'
                    }]
                ]
            }
        })
    }
})
// Перевод описания прогноза погоды
function weatherType(type) {
    switch (type) {
        case 'Rain':
            type = 'Дождь'
            break
        case 'Clouds':
            type = 'Облачно'
            break
        case 'Clear':
            type = 'Ясно'
            break
        case 'Sun' || 'Sunny':
            type = 'Солнечно'
            break
        case 'Fog':
            type = 'Туман'
            break
        case 'Wind':
            type = 'Ветер'
            break
        case 'Snow':
            type = 'Снег'
            break
    }
    return type
}
// Safonovo, Moscow, SPB
bot.on('callback_query', query => {
    const chatID = query.message.chat.id
    switch (`${query.data}`) {
        case 'saf':
            const urlSaf=`https://api.openweathermap.org/data/2.5/weather?id=499452&units=metric&appid=307bf290d83b2692ad950c49cd70a70e`
            request(urlSaf, function(error, response, body) {
                if (!error && response.statusCode === 200) {
                    const bodyJson = JSON.parse(body)
                    let weather_type = weatherType(`${bodyJson.weather[0].main}`)
                    const weather_temp = `Сафоново:<b> ${bodyJson.main.temp} °C, </b>` + `<b>${weather_type}</b>`
                    const weather_wind = `ветер:<b> ${bodyJson.wind.speed} м/с</b>`
                    const weather_humidity = `влажность:<b> ${bodyJson.main.humidity} %</b>`
                    bot.sendMessage(chatID, weather_temp + '\n' + weather_wind + '\n' + weather_humidity, {
                        parse_mode: 'HTML'
                    })
                }
            })
            break
        case 'msk':
            const cityMsk = 'Moscow'
            const urlMsk=`https://api.openweathermap.org/data/2.5/weather?q=${cityMsk}&units=metric&appid=307bf290d83b2692ad950c49cd70a70e`
            request(urlMsk, function(error, response, body) {
                if (!error && response.statusCode === 200) {
                    const bodyJson = JSON.parse(body)
                    let weather_type = weatherType(`${bodyJson.weather[0].main}`)
                    const weather_temp = `Москва:<b> ${bodyJson.main.temp} °C, </b>` + `<b>${weather_type}</b>`
                    const weather_wind = `ветер:<b> ${bodyJson.wind.speed} м/с</b>`
                    const weather_humidity = `влажность:<b> ${bodyJson.main.humidity} %</b>`
                    bot.sendMessage(chatID, weather_temp + '\n' + weather_wind + '\n' + weather_humidity, {
                        parse_mode: 'HTML'
                    })
                }
            })
            break
        case 'spb':
            const citySpb = 'Sankt-Peterburg'
            const urlSpb=`https://api.openweathermap.org/data/2.5/weather?q=${citySpb}&units=metric&appid=307bf290d83b2692ad950c49cd70a70e`
            request(urlSpb, function(error, response, body) {
                if (!error && response.statusCode === 200) {
                    const bodyJson = JSON.parse(body)
                    let weather_type = weatherType(`${bodyJson.weather[0].main}`)
                    const weather_temp = `Санкт-Петербург:<b> ${bodyJson.main.temp} °C, </b>` + `<b>${weather_type}</b>`
                    const weather_wind = `ветер:<b> ${bodyJson.wind.speed} м/с</b>`
                    const weather_humidity = `влажность:<b> ${bodyJson.main.humidity} %</b>`
                    bot.sendMessage(chatID, weather_temp + '\n' + weather_wind + '\n' + weather_humidity, {
                        parse_mode: 'HTML'
                    })
                }
            })
            break
    }
})
// Enter city
bot.on('callback_query', query => {
    const chatID = query.message.chat.id
    let flag1 = false
    if (`${query.data}` === ('other')) {
        bot.sendMessage(chatID, 'Введите название города.\nЕсли прогноз погоды не отобразится – введите название города на латинице.')
        flag1 = true
        bot.on('message', msg =>{
            // Translation from сyrillic
            let transliterate = (
                function () {
                    let
                        rus = "щ   ш  ч  ц  ю  я  ё  ж  ъ  ы  э  а б в г д е з и й к л м н о п р с т у ф х ь".split(/ +/g),
                        eng = "shh sh ch ts yu ya yo zh `` y' e` a b v g d e z i j k l m n o p r s t u f x ".split(/ +/g)

                    return function (text, engToRus) {
                        let x
                        for (x = 0; x < rus.length; x++) {
                            text = text.split(engToRus ? eng[x] : rus[x]).join(engToRus ? rus[x] : eng[x])
                            text = text.split(engToRus ? eng[x].toUpperCase() : rus[x].toUpperCase()).join(engToRus ? rus[x].toUpperCase() : eng[x].toUpperCase())
                        }
                        return text
                    }
                }
            )()
            // Weather for entered city
            const city = transliterate(msg.text)
            const url=`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=307bf290d83b2692ad950c49cd70a70e`
            request(url, function(error, response, body) {
                if (!error && response.statusCode === 200) {
                    const bodyJson = JSON.parse(body)
                    let weather_type = weatherType(`${bodyJson.weather[0].main}`)
                    const weather_temp = `${msg.text}:<b> ${bodyJson.main.temp} °C, </b>` + `<b>${weather_type}</b>`
                    const weather_wind = `ветер:<b> ${bodyJson.wind.speed} м/с</b>`
                    const weather_humidity = `влажность:<b> ${bodyJson.main.humidity} %</b>`
                    bot.sendMessage(chatID, weather_temp + '\n' + weather_wind + '\n' + weather_humidity, {
                        parse_mode: 'HTML'
                    })
                }
            })
        })
        flag1 = false
    }
    bot.answerCallbackQuery(query.id)
})

// Inline exchange rates
bot.on('callback_query', query => {
    const chatID = query.message.chat.id
    if (`${query.data}` === 'curse') {
        bot.sendMessage(chatID, 'Выберите интересующую вас валюту:', {
            reply_markup:{
                inline_keyboard: [
                    [
                        {
                            text:'$',
                            callback_data:'usd'
                        },

                        {
                            text:'€',
                            callback_data:'eur'
                        },

                        {
                            text:'₿',
                            callback_data:'btc'
                        }
                    ]
                ]
            }
        })
    }
    bot.answerCallbackQuery(query.id)
})
bot.on('callback_query', query => {
    switch (`${query.data}`) {
        case ('usd'):
            request(`http://data.fixer.io/api/latest?access_key=8b320d256840f490fb582205f1c3e279&format=1&symbols=${baseUSD},${baseRUB}`, (error, response, body) => {
                if (error) throw new Error(error)
                if (response.statusCode === 200) {
                    const currencyData = JSON.parse(body)
                    const USDtoRUB = Number.parseFloat(`${currencyData.rates[baseRUB]}`)/Number.parseFloat(`${currencyData.rates[baseUSD]}`)
                    bot.sendMessage(query.message.chat.id, `<b>1 $</b> = <b>` + USDtoRUB.toFixed(2) + ` RUB</b>`, {
                        parse_mode: 'HTML'
                    })
                }
            })
        break

        case ('eur'):
            request(`http://data.fixer.io/api/latest?access_key=8b320d256840f490fb582205f1c3e279&format=1&symbols=${baseRUB}`, (error, response, body) => {
                if (error) throw new Error(error)
                if (response.statusCode === 200) {
                    const currencyData = JSON.parse(body)
                    const EURtoRUB = Number.parseFloat(`${currencyData.rates[baseRUB]}`)
                    bot.sendMessage(query.message.chat.id, `<b>1 €</b> = <b>` + EURtoRUB.toFixed(2) + ` RUB</b>`, {
                        parse_mode: 'HTML'
                    })
                }
            })
        break

        case ('btc'):
            caClient.CMD.exchangeRates.getSpecificRate(baseBTC, baseUSD).then(function(result) {
                bot.sendMessage(query.message.chat.id, `<b>1 ₿</b> = <b>` + (result.payload.medianPrice).toFixed(2) + ` $</b>`, {
                    parse_mode: 'HTML'
                })
            })
                .catch(function(err) {
                    console.error(err)
                })
        break
    }
    bot.answerCallbackQuery(query.id)
})

// Menu by letter
// m
bot.on('message', msg =>{
    const chatID = msg.chat.id
    if (msg.text.toLowerCase() === 'm') {
        bot.sendMessage(chatID, 'Чем могу помочь?', {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Курс валют',
                            callback_data: 'curse'
                        },
                        {
                            text: 'Прогноз погоды',
                            callback_data: 'weather'
                        }]
                ]
            }
        })
    }
})
// w
bot.on('message', msg => {
    const chatID = msg.chat.id
    if (msg.text.toLowerCase() === 'w') {
        bot.sendMessage(chatID, 'Выберите город:', {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Сафоново',
                            callback_data: 'saf'
                        },
                        {
                            text: 'Москва',
                            callback_data: 'msk'
                        },
                        {
                            text: 'Санкт-Петербург',
                            callback_data: 'spb'
                        }
                    ],
                    [{
                        text: 'Другой город',
                        callback_data: 'other'
                    }]
                ]
            }
        })
    }
})

// d
bot.on('message', (msg) => {
    const chatID = msg.chat.id
    const url = './1.xlsx'
    if(msg.text.toLowerCase() === 'd') {
        bot.sendDocument(chatID, url)
        bot.sendMessage(chatID, 'bull shit')
    }
})

// v
bot.on('message', (msg) => {
    const chatID = msg.chat.id
    if(msg.text.toLowerCase() === 'v') {
        bot.sendMessage(chatID, 'Выберите интересующую вас валюту:', {
            reply_markup:{
                inline_keyboard: [
                    [
                        {
                            text:'$',
                            callback_data:'usd'
                        },

                        {
                            text:'€',
                            callback_data:'eur'
                        },

                        {
                            text:'₿',
                            callback_data:'btc'
                        }
                    ]
                ]
            }
        })}
})


// Other
// "Спасибо"
bot.on('message', (msg) => {
    const { id } = msg.chat
    if(msg.text.toLowerCase() === 'спасибо' || msg.text.toLowerCase() === 'благодарю'){
        bot.sendSticker(msg.chat.id, 'CAADAgADsQUAAmMr4glZ9U6i3_vkggI')
    }
})
//"Привет"
bot.on('message', (msg) => {
    const { id } = msg.chat
    if(msg.text.toLowerCase() === 'привет'){
        bot.sendSticker(msg.chat.id, msg.file_id ='CAADAgADoD0AAlOx9wNrJbrMA400lQI')
        bot.sendMessage(msg.chat.id, 'Чем могу помочь?', {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Курс валют',
                            callback_data: 'curse'
                        },
                    {
                        text: 'Прогноз погоды',
                        callback_data: 'weather'
                    }]


                ]
            }
        })
    }
})

// ConsoleLog
bot.on('message', (msg) => {
    console.log(msg)
})
