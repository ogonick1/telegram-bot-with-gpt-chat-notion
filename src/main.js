import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import config from "config";
import { chatGpt } from "./chatgpt.js";
import { create } from "./notion.js"
import { Loader } from "./loader.js"

const bot = new Telegraf(config.get('TELEGRAM_TOKEN'), {
  handlerTimeout: Infinity,
})

bot.command('start', ctx => {
  ctx.reply(
    'welcome to bot. Write key words to your story'
  )
})

bot.on(message('text'), async (ctx) => {
  try {
    const text = ctx.message.text
    if (!text.trim())ctx.reply('write text')

    const loader = new Loader(ctx)

    loader.show()

    const response = await chatGpt(text)

    if(!response) return ctx.reply(' error on api', response)

    const notionResponse = await create(text, response.content)

    loader.hide()

    ctx.reply(`your page: ${notionResponse.url}`)
  } catch (error) {
    console.log('error while processing text:', error.message)

  }

  //await chatGpt(ctx.message.text)
  //ctx.reply('test')
})

bot.launch()