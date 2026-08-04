import { BaseProvider, getOpenAILikeModel } from '~/lib/modules/llm/base-provider';
import type { ModelInfo } from '~/lib/modules/llm/types';
import type { IProviderSetting } from '~/types/model';
import type { LanguageModelV1 } from 'ai';

export default class QwenProvider extends BaseProvider {
  name = 'Qwen';
  getApiKeyLink = 'https://dashscope.console.aliyun.com/apiKey';

  config = {
    apiTokenKey: 'QWEN_API_KEY',
    baseUrlKey: 'QWEN_API_BASE_URL',
  };

  staticModels: ModelInfo[] = [
    {
      name: 'qwen3.7-flash',
      label: 'Qwen 3.7 Flash',
      provider: 'Qwen',
      maxTokenAllowed: 65536,
      maxCompletionTokens: 65536,
    },
  ];

  getModelInstance(options: {
    model: string;
    serverEnv: Env;
    apiKeys?: Record<string, string>;
    providerSettings?: Record<string, IProviderSetting>;
  }): LanguageModelV1 {
    const { model, serverEnv, apiKeys, providerSettings } = options;

    const { apiKey, baseUrl } = this.getProviderBaseUrlAndKey({
      apiKeys,
      providerSettings,
      serverEnv: serverEnv as any,
      defaultBaseUrlKey: 'QWEN_API_BASE_URL',
      defaultApiTokenKey: 'QWEN_API_KEY',
    });

    if (!apiKey) {
      throw new Error(`Missing API key for ${this.name} provider`);
    }

    const endpoint = baseUrl || 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1';

    return getOpenAILikeModel(endpoint, apiKey, model);
  }
}
