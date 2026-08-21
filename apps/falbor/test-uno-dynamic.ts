import { defineConfig, presetIcons, presetUno } from 'unocss';
export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      warn: true,
      collections: {
        ph: () => import('@iconify-json/ph/icons.json', { with: { type: 'json' } }).then(i => i.default)
      }
    })
  ]
});
