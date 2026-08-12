'use client';

import React from 'react';
import MacOSMenuBar from './navbar';

/**
 * Default Demo - Basic MacOS Menu Bar
 *
 * Clean demo showing just the menu bar component.
 */
export default function DefaultDemo() {
    return (
        <div>
            <div style={{
                position: 'relative',
                top: '0px',
                left: '0%',
                width: '100%',
                zIndex: 9999,
            }}>
                <MacOSMenuBar
                    onMenuAction={(action) => {
                        console.log('Menu action:', action);
                    }}
                />
            </div>
        </div>
    );
}