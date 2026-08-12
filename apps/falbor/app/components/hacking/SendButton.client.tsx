import { AnimatePresence, cubicBezier, motion } from 'framer-motion';

interface SendButtonProps {
    show: boolean;
    isStreaming?: boolean;
    disabled?: boolean;
    isLimited?: boolean;
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onImagesSelected?: (images: File[]) => void;
}

const customEasingFn = cubicBezier(0.4, 0, 0.2, 1);

export const SendButton = ({ show, isStreaming, disabled, isLimited, onClick }: SendButtonProps) => {
    return (
        <button
            title={isLimited ? "Limited Users" : undefined}
            className="absolute flex justify-center
             items-center bottom-[18px] right-[22px]
              p-1 bg-[#2792f5] hover:brightness-94 
              color-white rounded-md w-fit px-2 h-[34px]
               transition-theme disabled:opacity-50 
               disabled:cursor-not-allowed"
            disabled={disabled || isLimited}
            onClick={(event) => {
                event.preventDefault();

                if (!disabled && !isLimited) {
                    onClick?.(event);
                }
            }}
        >
            <div className="text-lg">
                {!isStreaming ? (
                    isLimited ? <div className="i-ph:prohibit"></div> : <div className="i-ph:arrow-right"></div>
                ) : (
                    <div className="i-ph:stop-circle-bold"></div>
                )}
            </div>
        </button>
    );
};
