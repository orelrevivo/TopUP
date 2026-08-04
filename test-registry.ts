import * as providers from './app/lib/modules/llm/registry';
import { BaseProvider } from './app/lib/modules/llm/base-provider';

for (const exportedItem of Object.values(providers)) {
  console.log('Provider:', exportedItem.name, 'is function:', typeof exportedItem === 'function', 'instanceof BaseProvider:', exportedItem.prototype instanceof BaseProvider);
}
