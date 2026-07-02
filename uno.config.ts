import { globSync } from 'fast-glob';
import fs from 'node:fs/promises';
import { basename } from 'node:path';
import { defineConfig, presetIcons, presetUno, transformerDirectives } from 'unocss';

const iconPaths = globSync('./public/icons/*.svg');

const collectionName = 'falbor';

const customIconCollection = iconPaths.reduce(
  (acc, iconPath) => {
    const [iconName] = basename(iconPath).split('.');

    acc[collectionName] ??= {};
    acc[collectionName][iconName] = async () => fs.readFile(iconPath, 'utf8');

    return acc;
  },
  {} as Record<string, Record<string, () => Promise<string>>>,
);

const BASE_COLORS = {
  white: '#FFFFFF',
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0A0A0A',
  },
  accent: {
    50: '#FFF4ED',
    100: '#FEE6D6',
    200: '#FDC9B8',
    300: '#FB9A7A',
    400: '#F57A4A',
    500: '#E03602',
    600: '#C43206',
    700: '#B12B06',
    800: '#8C2206',
    900: '#701C05',
    950: '#3C0D02',
  },
  purple: {
    50: '#FFF4ED',
    100: '#FEE6D6',
    200: '#FDC9B8',
    300: '#FB9A7A',
    400: '#F57A4A',
    500: '#E03602',
    600: '#C43206',
    700: '#B12B06',
    800: '#8C2206',
    900: '#701C05',
    950: '#3C0D02',
  },
  green: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
    950: '#052E16',
  },
  orange: {
    50: '#FFFAEB',
    100: '#FEEFC7',
    200: '#FEDF89',
    300: '#FEC84B',
    400: '#FDB022',
    500: '#F79009',
    600: '#DC6803',
    700: '#B54708',
    800: '#93370D',
    900: '#792E0D',
  },
  red: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
    950: '#450A0A',
  },
};

const COLOR_PRIMITIVES = {
  ...BASE_COLORS,
  alpha: {
    white: generateAlphaPalette(BASE_COLORS.white),
    gray: generateAlphaPalette(BASE_COLORS.gray[900]),
    red: generateAlphaPalette(BASE_COLORS.red[500]),
    accent: generateAlphaPalette(BASE_COLORS.accent[500]),
  },
};

export default defineConfig({
  safelist: [...Object.keys(customIconCollection[collectionName] || {}).map((x) => `i-falbor:${x}`)],
  shortcuts: {
    'falbor-ease-cubic-bezier': 'ease-[cubic-bezier(0.4,0,0.2,1)]',
    'transition-theme': 'transition-[background-color,border-color,color] duration-150 falbor-ease-cubic-bezier',
    kdb: 'bg-falbor-elements-code-background text-falbor-elements-code-text py-1 px-1.5 rounded-md',
    'max-w-chat': 'max-w-[var(--chat-max-width)]',
  },
  rules: [
    /**
     * This shorthand doesn't exist in Tailwind and we overwrite it to avoid
     * any conflicts with minified CSS classes.
     */
    ['b', {}],
  ],
  theme: {
    colors: {
      ...COLOR_PRIMITIVES,
      falbor: {
        elements: {
          borderColor: 'var(--falbor-elements-borderColor)',
          borderColorActive: 'var(--falbor-elements-borderColorActive)',
          background: {
            depth: {
              1: 'var(--falbor-elements-bg-depth-1)',
              2: 'var(--falbor-elements-bg-depth-2)',
              3: 'var(--falbor-elements-bg-depth-3)',
              4: 'var(--falbor-elements-bg-depth-4)',
            },
          },
          textPrimary: 'var(--falbor-elements-textPrimary)',
          textSecondary: 'var(--falbor-elements-textSecondary)',
          textTertiary: 'var(--falbor-elements-textTertiary)',
          code: {
            background: 'var(--falbor-elements-code-background)',
            text: 'var(--falbor-elements-code-text)',
          },
          button: {
            primary: {
              background: 'var(--falbor-elements-button-primary-background)',
              backgroundHover: 'var(--falbor-elements-button-primary-backgroundHover)',
              text: 'var(--falbor-elements-button-primary-text)',
            },
            secondary: {
              background: 'var(--falbor-elements-button-secondary-background)',
              backgroundHover: 'var(--falbor-elements-button-secondary-backgroundHover)',
              text: 'var(--falbor-elements-button-secondary-text)',
            },
            danger: {
              background: 'var(--falbor-elements-button-danger-background)',
              backgroundHover: 'var(--falbor-elements-button-danger-backgroundHover)',
              text: 'var(--falbor-elements-button-danger-text)',
            },
          },
          item: {
            contentDefault: 'var(--falbor-elements-item-contentDefault)',
            contentActive: 'var(--falbor-elements-item-contentActive)',
            contentAccent: 'var(--falbor-elements-item-contentAccent)',
            contentDanger: 'var(--falbor-elements-item-contentDanger)',
            backgroundDefault: 'var(--falbor-elements-item-backgroundDefault)',
            backgroundActive: 'var(--falbor-elements-item-backgroundActive)',
            backgroundAccent: 'var(--falbor-elements-item-backgroundAccent)',
            backgroundDanger: 'var(--falbor-elements-item-backgroundDanger)',
          },
          actions: {
            background: 'var(--falbor-elements-actions-background)',
            code: {
              background: 'var(--falbor-elements-actions-code-background)',
            },
          },
          artifacts: {
            background: 'var(--falbor-elements-artifacts-background)',
            backgroundHover: 'var(--falbor-elements-artifacts-backgroundHover)',
            borderColor: 'var(--falbor-elements-artifacts-borderColor)',
            inlineCode: {
              background: 'var(--falbor-elements-artifacts-inlineCode-background)',
              text: 'var(--falbor-elements-artifacts-inlineCode-text)',
            },
          },
          messages: {
            background: 'var(--falbor-elements-messages-background)',
            linkColor: 'var(--falbor-elements-messages-linkColor)',
            code: {
              background: 'var(--falbor-elements-messages-code-background)',
            },
            inlineCode: {
              background: 'var(--falbor-elements-messages-inlineCode-background)',
              text: 'var(--falbor-elements-messages-inlineCode-text)',
            },
          },
          icon: {
            success: 'var(--falbor-elements-icon-success)',
            error: 'var(--falbor-elements-icon-error)',
            primary: 'var(--falbor-elements-icon-primary)',
            secondary: 'var(--falbor-elements-icon-secondary)',
            tertiary: 'var(--falbor-elements-icon-tertiary)',
          },
          preview: {
            addressBar: {
              background: 'var(--falbor-elements-preview-addressBar-background)',
              backgroundHover: 'var(--falbor-elements-preview-addressBar-backgroundHover)',
              backgroundActive: 'var(--falbor-elements-preview-addressBar-backgroundActive)',
              text: 'var(--falbor-elements-preview-addressBar-text)',
              textActive: 'var(--falbor-elements-preview-addressBar-textActive)',
            },
          },
          terminals: {
            background: 'var(--falbor-elements-terminals-background)',
            buttonBackground: 'var(--falbor-elements-terminals-buttonBackground)',
          },
          dividerColor: 'var(--falbor-elements-dividerColor)',
          loader: {
            background: 'var(--falbor-elements-loader-background)',
            progress: 'var(--falbor-elements-loader-progress)',
          },
          prompt: {
            background: 'var(--falbor-elements-prompt-background)',
          },
          sidebar: {
            dropdownShadow: 'var(--falbor-elements-sidebar-dropdownShadow)',
            buttonBackgroundDefault: 'var(--falbor-elements-sidebar-buttonBackgroundDefault)',
            buttonBackgroundHover: 'var(--falbor-elements-sidebar-buttonBackgroundHover)',
            buttonText: 'var(--falbor-elements-sidebar-buttonText)',
          },
          cta: {
            background: 'var(--falbor-elements-cta-background)',
            text: 'var(--falbor-elements-cta-text)',
          },
        },
      },
    },
  },
  transformers: [transformerDirectives()],
  presets: [
    presetUno({
      dark: {
        light: '[data-theme="light"]',
        dark: '[data-theme="dark"]',
      },
    }),
    presetIcons({
      warn: true,
      collections: {
        ...customIconCollection,
      },
      unit: 'em',
    }),
  ],
});

/**
 * Generates an alpha palette for a given hex color.
 *
 * @param hex - The hex color code (without alpha) to generate the palette from.
 * @returns An object where keys are opacity percentages and values are hex colors with alpha.
 *
 * Example:
 *
 * ```
 * {
 *   '1': '#FFFFFF03',
 *   '2': '#FFFFFF05',
 *   '3': '#FFFFFF08',
 * }
 * ```
 */
function generateAlphaPalette(hex: string) {
  return [1, 2, 3, 4, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].reduce(
    (acc, opacity) => {
      const alpha = Math.round((opacity / 100) * 255)
        .toString(16)
        .padStart(2, '0');

      acc[opacity] = `${hex}${alpha}`;

      return acc;
    },
    {} as Record<number, string>,
  );
}
