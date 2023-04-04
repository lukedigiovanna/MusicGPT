// import { Configuration, OpenAIApi } from "openai";

console.log(process.env.REACT_APP_OPENAI_API_KEY);

export {}

// const config = new Configuration({
//     organization: "org-TmJDI1qNxxPsvv0sGniSnxDc",
//     apiKey: process.env.REACT_APP_OPENAI_API_KEY,
// })

// const openai = new OpenAIApi(config);

/**
 * Prompt engineering fun time!
 * 
 * 
 * 
 */

// async function test() {
//     // const response = await openai.listEngines();
//     const chat = await openai.createChatCompletion({
//         model: 'gpt-3.5-turbo',
//         messages: [
//             {role: 'user', content: 'Say this is a test!'}
//         ]
//     })

// }

// {
//     "id":"chatcmpl-71TUlb8ebyLy0x2IcDSMvWa2Ja1Nn",
//     "object":"chat.completion",
//     "created":1680586063,
//     "model":"gpt-3.5-turbo-0301",
//     "usage":{"prompt_tokens":14,"completion_tokens":5,"total_tokens":19},
//     "choices":[
//         {"message":{"role":"assistant","content":"This is a test!"},"finish_reason":"stop","index":0}]}



// export default () => {}