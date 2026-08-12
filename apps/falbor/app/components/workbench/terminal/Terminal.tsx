'use client';
import type { FitAddon } from '@xterm/addon-fit';
import type { Terminal as XTerm } from '@xterm/xterm';
import { forwardRef, memo, useEffect, useImperativeHandle, useRef } from 'react';
import type { Theme } from '~/lib/stores/theme';
import { createScopedLogger } from '~/utils/logger';
import { getTerminalTheme } from './theme';

const logger = createScopedLogger('Terminal');

export interface TerminalRef {
  reloadStyles: () => void;
  getTerminal: () => XTerm | undefined;
}

export interface TerminalProps {
  className?: string;
  theme: Theme;
  readonly?: boolean;
  id: string;
  onTerminalReady?: (terminal: XTerm) => void;
  onTerminalResize?: (cols: number, rows: number) => void;
}

export const Terminal = memo(
  forwardRef<TerminalRef, TerminalProps>(
    ({ className, theme, readonly, id, onTerminalReady, onTerminalResize }, ref) => {
      const terminalElementRef = useRef<HTMLDivElement>(null);
      const terminalRef = useRef<XTerm>();
      const fitAddonRef = useRef<FitAddon>();
      const resizeObserverRef = useRef<ResizeObserver>();

      useEffect(() => {
        const element = terminalElementRef.current!;

        let terminal: XTerm | undefined;
        let resizeObserver: ResizeObserver | undefined;
        let disposed = false;

        // xterm and its addons reference browser-only globals (e.g. `self`) at
        // module load time, so we import them lazily on the client to avoid
        // breaking server-side rendering.
        (async () => {
          const [{ Terminal: XTermCtor }, { FitAddon }, { WebLinksAddon }] = await Promise.all([
            import('@xterm/xterm'),
            import('@xterm/addon-fit'),
            import('@xterm/addon-web-links'),
          ]);

          if (disposed) {
            return;
          }

          const fitAddon = new FitAddon();
          const webLinksAddon = new WebLinksAddon();
          fitAddonRef.current = fitAddon;

          terminal = new XTermCtor({
            cursorBlink: true,
            convertEol: true,
            disableStdin: readonly,
            theme: getTerminalTheme(readonly ? { cursor: '#00000000' } : {}),
            fontSize: 12,
            fontFamily: 'Menlo, courier-new, courier, monospace',
            allowProposedApi: true,
            scrollback: 1000,

            // Enable better clipboard handling
            rightClickSelectsWord: true,
          });

          terminalRef.current = terminal;

          // Error handling for addon loading
          try {
            terminal.loadAddon(fitAddon);
            terminal.loadAddon(webLinksAddon);
            terminal.open(element);
          } catch (error) {
            logger.error(`Failed to initialize terminal [${id}]:`, error);

            // Attempt recovery
            setTimeout(() => {
              try {
                terminal?.open(element);
                fitAddon.fit();
              } catch (retryError) {
                logger.error(`Terminal recovery failed [${id}]:`, retryError);
              }
            }, 100);
          }

          resizeObserver = new ResizeObserver((entries) => {
            // Debounce resize events
            if (entries.length > 0 && terminal) {
              try {
                fitAddon.fit();
                onTerminalResize?.(terminal.cols, terminal.rows);
              } catch (error) {
                logger.error(`Resize error [${id}]:`, error);
              }
            }
          });

          resizeObserverRef.current = resizeObserver;
          resizeObserver.observe(element);

          logger.debug(`Attach [${id}]`);

          onTerminalReady?.(terminal);
        })();

        return () => {
          disposed = true;

          try {
            resizeObserver?.disconnect();
            terminal?.dispose();
          } catch (error) {
            logger.error(`Cleanup error [${id}]:`, error);
          }
        };
      }, []);

      useEffect(() => {
        const terminal = terminalRef.current;

        if (!terminal) {
          return;
        }

        // we render a transparent cursor in case the terminal is readonly
        terminal.options.theme = getTerminalTheme(readonly ? { cursor: '#00000000' } : {});

        terminal.options.disableStdin = readonly;
      }, [theme, readonly]);

      useImperativeHandle(ref, () => {
        return {
          reloadStyles: () => {
            const terminal = terminalRef.current;

            if (terminal) {
              terminal.options.theme = getTerminalTheme(readonly ? { cursor: '#00000000' } : {});
            }
          },
          getTerminal: () => {
            return terminalRef.current;
          },
        };
      }, [readonly]);

      return <div className={className} ref={terminalElementRef} />;
    },
  ),
);
