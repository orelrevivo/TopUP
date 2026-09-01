import { validateGitHubPermissions } from '@/actions/github';
import { getGlobalSettings } from '@/actions/settings';
import SettingsClient from '@/components/SettingsClient';

export default async function SettingsPage() {
  const status = await validateGitHubPermissions();
  const settings = await getGlobalSettings();

  return <SettingsClient initialStatus={status} initialSettings={settings} />;
}
