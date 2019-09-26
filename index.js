process.env["NTBA_FIX_319"] = 1
const TelegramBot = require('node-telegram-bot-api')
const request = require('request')
const blockchain = require('blockchain.info')
const TOKEN = '471621092:AAEZqXY7nBPgagsCwLQlnlIjM9ZXomQhr2k'
const bot = new TelegramBot(TOKEN, {
    polling: {
        interval: 300,
        autoStart: true,
        params: {
            timeout: 10
        }
    }
})

// /Меню
bot.onText(/\/start/, (msg) => {
    const chatID = msg.chat.id
    bot.sendSticker(msg.chat.id, msg.file_id ='CAADAgADoD0AAlOx9wNrJbrMA400lQI')
    bot.sendMessage(msg.chat.id, 'Чем я могу вам помочь?', {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'Курс валют',
                        callback_data: 'curse'
                    },


                    {
                        text: 'Определиться с выбором',
                        callback_data: 'new'
                    }],
                [{
                    text: 'Прогноз погоды',
                    callback_data: 'weather'
                }]


            ]
        }
    })
    bot.sendMessage(msg.chat.id, '/help – для вызова справки.')
})
bot.onText(/\/value/, (msg) => {
    const chatID = msg.chat.id
    bot.sendMessage(chatID, 'Выберите интересующую вас валюту:', {
        reply_markup:{
            inline_keyboard: [
                [
                    {
                        text:'Доллар',
                        callback_data:'usd'
                    },

                    {
                        text:'Евро',
                        callback_data:'eur'
                    },

                    {
                        text:'Биткоин',
                        callback_data:'btc'
                    },
                    {
                        text:'Эфир',
                        callback_data:'eth'
                    }

                ]
            ]
        }
    })
})
bot.onText(/\/weather/, (msg) => {
    const chatID = msg.chat.id
    bot.sendMessage(chatID, 'Выберите город:', {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'Смоленск',
                        callback_data: 'sml'
                    },


                    {
                        text: 'Сафоново',
                        callback_data: 'saf'
                    },
                    {
                        text: 'Москва',
                        callback_data: 'msk'
                    }],
                [{
                    text: 'Другой город',
                    callback_data: 'other'
                }]


            ]
        }
    })
})
bot.onText(/\/help/, (msg) => {
    const chatID = msg.chat.id
    const htm = '• Для вызова главного меню отправьте <b>"m"</b>' + '\n• Прогноз погоды – <b>"w"</b>' + '\n• Курс валют – <b>"v"</b>'+ '\n• Магический шар – <b>"n"</b>' + '\n• Настоятельно не рекоммендую оскорблять бота.' + '\n' +
        '\nЛучше подпишитесь на <a href="https://instagram.com/biryukov12">инстаграм</a> создателя '
    bot.sendMessage(chatID, htm,{
        parse_mode: 'HTML'
    })
})


// Вызов меню по буквам
// m
bot.on('message', msg =>{
    const chatID = msg.chat.id
    if (msg.text.toLowerCase() === 'm') {
        bot.sendMessage(chatID, 'Чем я могу вам помочь?', {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Курс валют',
                            callback_data: 'curse'
                        },


                        {
                            text: 'Определиться с выбором',
                            callback_data: 'new'
                        }],
                    [{
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
                            text: 'Смоленск',
                            callback_data: 'sml'
                        },


                        {
                            text: 'Сафоново',
                            callback_data: 'saf'
                        },
                        {
                            text: 'Москва',
                            callback_data: 'msk'
                        }],
                    [{
                        text: 'Другой город',
                        callback_data: 'other'
                    }]


                ]
            }
        })

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
                            text:'Доллар',
                            callback_data:'usd'
                        },

                        {
                            text:'Евро',
                            callback_data:'eur'
                        },

                        {
                            text:'Биткоин',
                            callback_data:'btc'
                        },
                        {
                            text:'Эфир',
                            callback_data:'eth'
                        }

                    ]
                ]
            }
        })}
})


// Inline клавиатура
// Inline Прогноз погоды
bot.on('callback_query', query => {
    const chatID = query.message.chat.id
    switch (`${query.data}`) {
        case 'weather':
            bot.sendMessage(chatID, 'Выберите город:', {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Смоленск',
                                callback_data: 'sml'
                            },


                            {
                                text: 'Сафоново',
                                callback_data: 'saf'
                            },
                            {
                                text: 'Москва',
                                callback_data: 'msk'
                            }],
                        [{
                            text: 'Другой город',
                            callback_data: 'other'
                        }]


                    ]
                }
            })
            break
    }
})
bot.on('callback_query', query => {
    const chatID = query.message.chat.id
    switch (`${query.data}`) {
        case 'sml':
            const citySml = 'Smolensk'
            const urlSml=`https://api.openweathermap.org/data/2.5/weather?q=${citySml}&units=metric&appid=307bf290d83b2692ad950c49cd70a70e`
            request(urlSml, function(error, response, body) {
                if (!error && response.statusCode === 200) {
                    const bodyJson = JSON.parse(body)
                    console.log(bodyJson)
                    const Weather = `Смоленск:<b> ${bodyJson.main.temp}°C</b>`
                    bot.sendMessage(chatID, Weather, {
                        parse_mode: 'HTML'
                    })
                }

            })
    break
        case 'saf':

            const urlSaf=`https://api.openweathermap.org/data/2.5/weather?id=499452&units=metric&appid=307bf290d83b2692ad950c49cd70a70e`
            request(urlSaf, function(error, response, body) {
                if (!error && response.statusCode === 200) {
                    const bodyJson = JSON.parse(body)
                    console.log(bodyJson)
                    const Weather = `Сафоново:<b> ${bodyJson.main.temp}°C</b>`
                    bot.sendMessage(chatID, Weather, {
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
                    console.log(bodyJson)
                    const Weather = `Москва:<b> ${bodyJson.main.temp}°C</b>`
                    bot.sendMessage(chatID, Weather, {
                        parse_mode: 'HTML'
                    })
                }

            })
    break
    }
})
bot.on('callback_query', query => {
    const chatID = query.message.chat.id
    var flag1 = false
    switch (`${query.data}`) {
        case ('other'):
        bot.sendMessage(chatID, 'Введите ваш город (если прогноз погоды не отобразится – введите название города на латинице):')
            flag1 = true
        bot.on('message', msg =>{

            // Транслит
            transliterate = (
                function() {
                    var
                        rus = "щ   ш  ч  ц  ю  я  ё  ж  ъ  ы  э  а б в г д е з и й к л м н о п р с т у ф х ь".split(/ +/g),
                        eng = "shh sh ch ts yu ya yo zh `` y' e` a b v g d e z i j k l m n o p r s t u f x ".split(/ +/g)
                    ;
                    return function(text, engToRus) {
                        var x;
                        for(x = 0; x < rus.length; x++) {
                            text = text.split(engToRus ? eng[x] : rus[x]).join(engToRus ? rus[x] : eng[x]);
                            text = text.split(engToRus ? eng[x].toUpperCase() : rus[x].toUpperCase()).join(engToRus ? rus[x].toUpperCase() : eng[x].toUpperCase());
                        }
                        return text;
                    }
                }
            )();

            const city = transliterate(msg.text)
            const url=`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=307bf290d83b2692ad950c49cd70a70e`
            request(url, function(error, response, body) {
                if (!error && response.statusCode === 200) {
                    const bodyJson = JSON.parse(body)
                    console.log(bodyJson)
                    const Weather = `${msg.text}:<b> ${bodyJson.main.temp}°C</b> \n• Для повторного использования отправьте – <b>"w" или название другого города.</b>`
                    bot.sendMessage(chatID, Weather, {
                        parse_mode: 'HTML'
                    })
                }

            })

        })
            flag1 = false
        break
    }
    bot.answerCallbackQuery({callback_query_id: query.id})
})
// Inline Курс валют
bot.on('callback_query', query => {
    const chatID = query.message.chat.id
    switch(    `${query.data}` ) {
        case 'curse':
            bot.sendMessage(chatID, 'Выберите интересующую вас валюту:', {
                reply_markup:{
                    inline_keyboard: [
                        [
                            {
                                text:'Доллар',
                                callback_data:'usd'
                            },

                            {
                                text:'Евро',
                                callback_data:'eur'
                            },

                            {
                                text:'Биткоин',
                                callback_data:'btc'
                            },
                            {
                                text:'Эфир',
                                callback_data:'eth'
                            }

                        ]
                    ]
                }
            })
            break
    }
    bot.answerCallbackQuery({callback_query_id: query.id})
})
bot.on('callback_query', query => {
    const symbol = 'RUB'
    const base = 'USD'
    const base2 = 'EUR'
    const url1=`https://wex.nz/api/3/ticker/btc_usd`
    const url2=`https://wex.nz/api/3/ticker/eth_usd`
    switch (`${query.data}`) {
        case ('usd'):
            request(`http://api.fixer.io/latest?symbols=${symbol}&base=${base}`, (error, response, body) => {
                if (error) throw new Error(error)
                if (response.statusCode === 200) {
                    const currencyData = JSON.parse(body)
                    const htmlU = `<b>1 $</b> – <b>${currencyData.rates[symbol]} RUB</b>`
                    bot.sendMessage(query.message.chat.id, htmlU, {
                        parse_mode: 'HTML'
                    })
                }
            })
        break

        case ('eur'):
                request(`http://api.fixer.io/latest?symbols=${symbol}&base=${base2}`, (error, response, body) => {
                    if (error) throw new Error(error)
                    if (response.statusCode === 200) {
                        const currencyData = JSON.parse(body)
                        const htmlU = `<b>1 €</b> – <b>${currencyData.rates[symbol]} RUB</b>`
                        bot.sendMessage(query.message.chat.id, htmlU, {
                            parse_mode: 'HTML'
                        })
                    }
                })
        break

        case ('btc'):
                request(url1, function (error, response, body) {
                    if (!error && response.statusCode === 200) {
                        const bodyJson = JSON.parse(body)
                        console.log(bodyJson)
                        const htmlB = `Покупка: <b>1 BTC</b> – <b>${bodyJson.btc_usd.buy} $</b>`
                        const htmlS = `\nПродажа: <b>1 BTC</b> – <b>${bodyJson.btc_usd.sell} $</b>`
                        bot.sendMessage(query.message.chat.id, htmlB + htmlS, {
                            parse_mode: 'HTML'
                        })
                    }
                })
        break

        case ('eth'):
                request(url2, function (error, response, body) {
                    if (!error && response.statusCode === 200) {
                        const bodyJson = JSON.parse(body)
                        console.log(bodyJson)
                        const htmlB = `Покупка: <b>1 ETH</b> – <b>${bodyJson.eth_usd.buy} $</b>`
                        const htmlS = `\nПродажа: <b>1 ETH</b> – <b>${bodyJson.eth_usd.sell} $</b>`
                        bot.sendMessage(query.message.chat.id, htmlB + htmlS, {
                            parse_mode: 'HTML'
                        })
                    }
                })
        break
    }
    bot.answerCallbackQuery({callback_query_id: query.id})
})


// Диалог
// Криптовалюта
bot.on('message', (msg) => {
    const { id } = msg.chat
    const url=`https://wex.nz/api/3/ticker/btc_usd`
    if(msg.text.toLowerCase() === 'курс биткоина' || msg.text.toLowerCase() === 'биток' || msg.text.toLowerCase() === 'биткоин'){
        request(url, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                const bodyJson = JSON.parse(body)
                console.log(bodyJson)
                const htmlB = `Покупка: <b>1 ₿</b> – <b>${bodyJson.btc_usd.buy} $</b>`
                const htmlS = `\nПродажа: <b>1 ₿</b> – <b>${bodyJson.btc_usd.sell} $</b>`
                bot.sendMessage(msg.chat.id, htmlB + htmlS, {
                    parse_mode: 'HTML'
                })
            }
        })
    }


})
bot.on('message', (msg) => {
    const { id } = msg.chat
    const url=`https://wex.nz/api/3/ticker/btc_usd`
    if(msg.text.toLowerCase() === 'как там биток?'){
        request(url, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                const bodyJson = JSON.parse(body)
                console.log(bodyJson)
                const Bitc = `${bodyJson.btc_usd.sell}`
                if (Bitc<7000) {
                    bot.sendMessage(msg.chat.id, 'Что-то не очень')
                }
                else {
                    bot.sendMessage(msg.chat.id, 'Пойдет')
                }
                const htmlB = `Покупка: <b>1 ₿</b> – <b>${bodyJson.btc_usd.buy} $</b>`
                const htmlS = `\nПродажа: <b>1 ₿</b> – <b>${bodyJson.btc_usd.sell} $</b>`
                bot.sendMessage(msg.chat.id, htmlB + htmlS, {
                    parse_mode: 'HTML'
                })
            }
        })
    }


})
bot.on('message', (msg) => {
    const { id } = msg.chat
    const url=`https://wex.nz/api/3/ticker/btc_usd`
    if(msg.text.toLowerCase() === 'купить биткоин?' || msg.text.toLowerCase() === 'купить битка?'){
        request(url, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                const bodyJson = JSON.parse(body)
                console.log(bodyJson)
                const Bitc = `${bodyJson.btc_usd.sell}`
                if (Bitc>7000) {
                    bot.sendMessage(msg.chat.id, 'Не стоит.')
                }
                else {
                    bot.sendMessage(msg.chat.id, 'Да.')
                }
            }
        })
    }


})
bot.on('message', (msg) => {
    const { id } = msg.chat
    const url=`https://wex.nz/api/3/ticker/eth_usd`
    if(msg.text.toLowerCase() === 'а эфир?' || msg.text.toLowerCase() ===  'купить эфир?'){
        request(url, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                const bodyJson = JSON.parse(body)
                console.log(bodyJson)
                const Ethr = `${bodyJson.eth_usd.sell}`
                if (Ethr>500) {
                    bot.sendMessage(msg.chat.id, 'Не стоит.')
                }
                else {
                    bot.sendMessage(msg.chat.id, 'Да.')
                }
            }
        })
    }

})
bot.on('message', (msg) => {
    const { id } = msg.chat
    const url=`https://wex.nz/api/3/ticker/eth_usd`
    if(msg.text.toLowerCase() === 'курс эфира' || msg.text.toLowerCase() === 'эфир'){
        request(url, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                const bodyJson = JSON.parse(body)
                console.log(bodyJson)
                const htmlS = `Продажа: <b>1 Эфир</b> – <b>${bodyJson.eth_usd.sell} $</b>`
                const htmlB = `\nПокупка: <b>1 Эфир</b> – <b>${bodyJson.eth_usd.buy} $</b>`
                bot.sendMessage(msg.chat.id, htmlS+htmlB, {
                    parse_mode: 'HTML'
                })
            }
        })
    }

})
bot.on('message', (msg) => {
    const { id } = msg.chat
    const url=`https://wex.nz/api/3/ticker/eth_usd`
    if(msg.text.toLowerCase() === 'как там эфир?'){
        request(url, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                const bodyJson = JSON.parse(body)
                console.log(bodyJson)
                const Ethr = `${bodyJson.eth_usd.sell}`
                if (Ethr<700) {
                    bot.sendMessage(msg.chat.id, 'Так себе')
                }
                else {
                    bot.sendMessage(msg.chat.id, 'Более менее')
                }
                if (Ethr>900) {
                    bot.sendMessage(msg.chat.id, 'Нормально')
                }
                const htmlS = `Продажа: <b>1 Эфир</b> – <b>${bodyJson.eth_usd.sell} $</b>`
                const htmlB = `\nПокупка: <b>1 Эфир</b> – <b>${bodyJson.eth_usd.buy} $</b>`
                bot.sendMessage(msg.chat.id, htmlS+htmlB, {
                    parse_mode: 'HTML'
                })
            }
        })
    }

})
bot.on('message', (msg) => {
    if(msg.text.toLowerCase() === 'почему?'){
        bot.sendSticker(msg.chat.id, msg.file_id ='CAADAQADAQADV5qZFrNwwCqygTKaAg')
    }
})


// Прочее
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
        bot.sendMessage(msg.chat.id, 'Чем я могу вам помочь?', {
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
