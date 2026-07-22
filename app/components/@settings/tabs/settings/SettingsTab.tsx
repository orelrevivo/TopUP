'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { classNames } from '~/utils/classNames';
import { Switch } from '~/components/ui/Switch';
import type { UserProfile } from '~/components/@settings/core/types';
import { isMac } from '~/utils/os';
import { useTranslation } from '~/lib/i18n/useTranslation';
import { setLanguage } from '~/lib/stores/language';

// Helper to get modifier key symbols/text
const getModifierSymbol = (modifier: string): string => {
  switch (modifier) {
    case 'meta':
      return isMac ? '⌘' : 'Win';
    case 'alt':
      return isMac ? '⌥' : 'Alt';
    case 'shift':
      return '⇧';
    default:
      return modifier;
  }
};

export default function SettingsTab() {
  const { t, currentLanguage } = useTranslation();
  const [settings, setSettings] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('falbor_user_profile');
    return saved
      ? JSON.parse(saved)
      : {
        notifications: true,
        language: 'en',
      };
  });

  // Save settings automatically when they change
  useEffect(() => {
    try {
      // Get existing profile data
      const existingProfile = JSON.parse(localStorage.getItem('falbor_user_profile') || '{}');

      // Merge with new settings
      const updatedProfile = {
        ...existingProfile,
        notifications: settings.notifications,
        language: settings.language,
      };

      localStorage.setItem('falbor_user_profile', JSON.stringify(updatedProfile));
      toast.success('Settings updated');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to update settings');
    }
  }, [settings]);

  return (
    <div className="max-w-2xl mx-auto pb-12">
      {/* Language & Notifications */}
      <motion.div
        className="bg-white dark:bg-[#0A0A0A] rounded-lg shadow-sm dark:shadow-none p-4 space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="i-ph:palette-fill w-4 h-4 text-purple-500" />
          <span className="text-sm font-medium text-falbor-elements-textPrimary">{t('preferences')}</span>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="i-ph:translate-fill w-4 h-4 text-falbor-elements-textSecondary" />
            <label className="block text-sm text-falbor-elements-textSecondary">{t('language')}</label>
          </div>
          <select
            value={currentLanguage}
            onChange={(e) => {
              const newLang = e.target.value;
              setSettings((prev) => ({ ...prev, language: newLang }));
              setLanguage(newLang);
            }}
            className={classNames(
              'w-full px-3 py-2 rounded-lg text-sm',
              'bg-[#FAFAFA] dark:bg-[#0A0A0A]',
              'border border-[#E5E5E5] dark:border-[#1A1A1A]',
              'text-falbor-elements-textPrimary',
              'focus:outline-none focus:ring-2 focus:ring-purple-500/30',
              'transition-all duration-200',
            )}
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
            <option value="it">Italiano</option>
            <option value="pt">Português</option>
            <option value="ru">Русский</option>
            <option value="zh">中文</option>
            <option value="ja">日本語</option>
            <option value="ko">한국어</option>
          </select>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="i-ph:bell-fill w-4 h-4 text-falbor-elements-textSecondary" />
            <label className="block text-sm text-falbor-elements-textSecondary">{t('notifications')}</label>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-falbor-elements-textSecondary">
              {settings.notifications ? t('notifications_enabled') : t('notifications_disabled')}
            </span>
            <Switch
              checked={settings.notifications}
              onCheckedChange={(checked) => {
                // Update local state
                setSettings((prev) => ({ ...prev, notifications: checked }));

                // Update localStorage immediately
                const existingProfile = JSON.parse(localStorage.getItem('falbor_user_profile') || '{}');
                const updatedProfile = {
                  ...existingProfile,
                  notifications: checked,
                };
                localStorage.setItem('falbor_user_profile', JSON.stringify(updatedProfile));

                // Dispatch storage event for other components
                window.dispatchEvent(
                  new StorageEvent('storage', {
                    key: 'falbor_user_profile',
                    newValue: JSON.stringify(updatedProfile),
                  }),
                );

                toast.success(`Notifications ${checked ? 'enabled' : 'disabled'}`);
              }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
