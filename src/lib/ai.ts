import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.GPT_API_KEY,
  baseURL: process.env.GPT_API_HOST || 'https://api.openai.com',
})

const systemPrompt = `你是一名专业的党建助手，专门帮助高校团支部和党支部处理党员发展和管理相关的问题。请用中文回答，回答要准确、简洁、实用。

以下是党建知识要点：
1. 党员发展流程：积极分子→发展对象→预备党员→正式党员
2. 思想汇报：积极分子每季度至少提交一次，发展对象和预备党员根据需要提交
3. 预备党员预备期：一年，到期应及时讨论转正
4. 发展对象考察期：一般不少于半年

请根据用户的问题提供专业指导和建议。`

export async function generateAIResponse(messages: { role: 'user' | 'assistant', content: string }[]) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    return response.choices[0]?.message?.content || '抱歉，我无法回答这个问题。'
  } catch (error) {
    console.error('AI API error:', error)
    return '抱歉，AI助手暂时无法使用，请稍后再试。'
  }
}

export async function streamAIResponse(messages: { role: 'user' | 'assistant', content: string }[]) {
  const stream = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages
    ],
    temperature: 0.7,
    max_tokens: 1000,
    stream: true,
  })

  return stream
}