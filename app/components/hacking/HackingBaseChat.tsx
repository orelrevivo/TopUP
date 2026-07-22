import React, { forwardRef } from 'react';

export const HackingBaseChat = forwardRef<HTMLDivElement, any>((props, ref) => {
  return (
    <div ref={ref} className="flex-1 flex flex-col items-center justify-center text-falbor-elements-textPrimary h-full">
      <div className="i-svg-spinners:90-ring-with-bg text-3xl animate-spin text-accent-500 mb-4" />
      <p>Loading hacking interface...</p>
    </div>
  );
});
HackingBaseChat.displayName = 'HackingBaseChat';
