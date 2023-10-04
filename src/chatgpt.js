import OpenAI from 'openai';
import config from 'config';

const CHATGPT_MODEL = 'gpt-3.5-turbo'

const ROLES ={
  ASSISTANT: 'assistant',
  SYSTEM: 'system',
  USER: 'user',
}

const openai = new OpenAI({
  apiKey: config.get('OPENAI_KEY'),
})

const getMessage = (m) => `
Напиши завдяки цим ключовим словам коротку емоційну історію: ${m}

Ці слова є описом ключових моментів дня.
Багато тексту не потрібно головне це емоції, правильна послідовність та врахування контексту.

`

export async function chatGpt(message = '') {
  const messages = [{
    role: ROLES.SYSTEM,
    content:
    'ти досвідчений копірайтер, який пише короткі емоційні статті для соц мереж.',
  },
  {role: ROLES.USER, content: getMessage(message) },
]
  try {
    const completion = await openai.chat.completions.create({
      messages,
      model: CHATGPT_MODEL,
    });
    return completion.choices[0].message
  } catch (error) {
    console.error(error.message)
  }
}