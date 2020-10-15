const TelegramBot = require('node-telegram-bot-api')
const moment = require('moment')
const request = require('request')
const fetch = require("node-fetch");
const baseRUB = 'RUB'
const baseUSD = 'USD'
const puppeteer = require('puppeteer')

const bot = new TelegramBot(process.env.TOKEN, {
    polling: {
        interval: 300,
        autoStart: true,
        params: {
            timeout: 10
        }
    }
})

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var monthNames = ["Jan", "Feb", "Mar",
    "Apr", "May", "Jun", "Jul", "Aug", "Sep",
    "Oct", "Nov", "Dec"];
var mm = monthNames[today.getMonth()];
var yyyy = today.getFullYear();
console.log(new Date().getDate())
today = dd + ' ' + mm + ' ' + yyyy;

async function schedule_url() {

    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']})
    const page = await browser.newPage()
    await page.setViewport({ width: 600, height: 800 })
    await page.goto('https://www.mirea.ru/schedule')
    const url_for_download = await page.evaluate((sel) => {
        return document.querySelector(sel).getAttribute('href')
    }, '#toggle-hl_2_2-hl_3_3 > div:nth-child(6) > a')
    await browser.close()
    console.log(url_for_download)

    return url_for_download
}


// /Menu
// /Start dialog
bot.onText(/\/start/, (msg) => {
    const chatID = msg.chat.id
    bot.sendSticker(chatID, msg.file_id ='CAADAgADoD0AAlOx9wNrJbrMA400lQI')
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
    if (`${query.data}` === ('other')) {
        bot.sendMessage(chatID, 'Введите название города.\n' +
            'Если прогноз погоды не отобразится – введите название города на латинице.')
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
    }
    bot.answerCallbackQuery(query.id)
})

// i
bot.on('message', msg => {
    const chatID = msg.chat.id
    if (msg.text.toLowerCase() === 'i') {
        bot.sendMessage(chatID, 'Проверка каждые 24 часа')
        var second_intarval = setInterval(() => {
            schedule_url()
                .then(r => {
                    fetch(encodeURI(r))
                        .then(response => {
                            var last_modified = response.headers.get('last-modified').substr(5, 11)
                            var last_modified_full = response.headers.get('last-modified')
                            if (last_modified !== today) {
                                bot.sendMessage(chatID,'Расписание не изменилось, последнее обновление: ' +
                                    '\n' + last_modified_full + '\n' + 'Сегодня: ' + today, {
                                    reply_markup: {
                                        inline_keyboard: [
                                            [
                                                {
                                                    text: 'Отменить планирование',
                                                    callback_data: 'clearInterval'
                                                }
                                            ]
                                        ]
                                    }
                                })
                            }
                            else {
                                bot.sendMessage(chatID,'Расписание изменилось, время обновления ' +
                                    '\n' + last_modified_full + '\n' + 'Сегодня: ' + today)
                                bot.sendMessage(chatID,'Расписание: ')
                                schedule_url()
                                    .then(r => {
                                        const file = request(encodeURI(r))
                                        const fileOptions = {
                                            filename: 'Маг. 2 курс ИТ.xlsx',
                                            contentType: 'application/octet-stream'
                                        }
                                        bot.sendDocument(chatID, file, {caption: ''+'Расписание занятий \n'+ '\n' +
                                                'Сейчас ' + (moment().week() - moment('2020-09-01').week() + 1) + ' неделя'}, fileOptions)
                                            .then(() => {
                                                bot.sendMessage(chatID,'Отменить планирование?', {
                                                    reply_markup: {
                                                        inline_keyboard: [
                                                            [
                                                                {
                                                                    text: 'Отменить планирование',
                                                                    callback_data: 'clearInterval'
                                                                }
                                                            ]
                                                        ]
                                                    }
                                                })
                                            })
                                    })
                            }
                        })

                })
        }, 86400000)

    }

    bot.on('callback_query', query => {
        const chatID = query.message.chat.id
        if (`${query.data}` === 'clearInterval') {
            bot.sendMessage(chatID, 'Планирование отменено.')
            clearInterval(second_intarval)
        }
        bot.answerCallbackQuery(query.id)
    })

})


// Menu by letter
// m – main menu
bot.on('message', msg => {
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
// w – weather
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
// v – value
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
                        }
                    ]
                ]
            }
        })}
})

// s – check date and download schedule
bot.on('message', (msg) => {
    if(msg.text.toLowerCase() === 's') {
        const chatID = msg.chat.id
        bot.sendMessage(chatID, 'Уже проверяю...')
        schedule_url()
            .then(r => {
                fetch(encodeURI(r))
                    .then(response => {
                        var last_modified = response.headers.get('last-modified').substr(5, 11)
                        var last_modified_full = response.headers.get('last-modified')
                        if (last_modified !== today) {
                            bot.sendMessage(chatID,'Расписание не изменилось, последнее обновление: ' +
                                '\n' + last_modified_full + '\n' + 'Сегодня: ' + today)

                            console.log('Расписание не изменилось, последнее обновление: ' + last_modified_full)
                            console.log('Сегодня: ' + today)
                        }
                        else {
                            bot.sendMessage(chatID,'Расписание изменилось, время обновления ' +
                                '\n' + last_modified_full + '\n' + 'Сегодня: ' + today)
                            bot.sendMessage(chatID,'Расписание: ')

                            console.log('Расписание изменилось, время обновления ' + last_modified_full)
                            console.log('Сегодня: ' + today)
                            schedule_url()
                                .then(r => {
                                    const file = request(encodeURI(r))
                                    const fileOptions = {
                                        filename: 'Маг. 2 курс ИТ.xlsx',
                                        contentType: 'application/octet-stream'
                                    }
                                    bot.sendDocument(chatID, file, {caption: ''+'Расписание занятий \n'+ '\n' +
                                            'Сейчас ' + (moment().week() - moment('2020-09-01').week() + 1) + ' неделя'}, fileOptions)
                                })
                        }
                    })

            })
    }
})

// d — download schedule
bot.on('message', (msg) => {
    if(msg.text.toLowerCase() === 'd') {
        const chatID = msg.chat.id
        bot.sendMessage(chatID, 'Уже скачиваю...')
        schedule_url()
            .then(r => {
                const file = request(encodeURI(r))
                const fileOptions = {
                    filename: 'Маг. 2 курс ИТ.xlsx',
                    contentType: 'application/octet-stream'
                }
                bot.sendDocument(chatID, file, {caption: ''+'Расписание занятий \n'+ '\n' +
                        'Сейчас ' + (moment().week() - moment('2020-09-01').week() + 1) + ' неделя'}, fileOptions)
            })
    }
})

// n – number of week
bot.on('message', (msg) => {
    const chatID = msg.chat.id
    if (msg.text.toLowerCase() === 'n') {
        bot.sendMessage(chatID, 'Сейчас ' + (moment().week() - moment('2020-09-01').week() + 1) + ' неделя')
    }
})


// Other
// "Спасибо"
bot.on('message', (msg) => {
    const chatID = msg.chat.id
    if(msg.text.toLowerCase() === 'спасибо' || msg.text.toLowerCase() === 'благодарю'){
        bot.sendSticker(chatID, 'CAADAgADsQUAAmMr4glZ9U6i3_vkggI')
    }
})
//"Привет"
bot.on('message', (msg) => {
    const chatID = msg.chat.id
    if(msg.text.toLowerCase() === 'привет'){
        bot.sendSticker(chatID, msg.file_id ='CAADAgADoD0AAlOx9wNrJbrMA400lQI')
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

// ConsoleLog
bot.on('message', (msg) => {
    console.log(msg)
})
