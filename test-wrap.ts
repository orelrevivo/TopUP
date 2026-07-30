import { wrapLanguageModel, type LanguageModelV1Middleware, type LanguageModelV1Prompt } from 'ai';

const middleware: LanguageModelV1Middleware = {
  wrapStream: async ({ doStream, params }) => {
    console.log(params.prompt);
    return doStream();
  }
};
console.log(middleware);
