import Page from '../../../page';
import { getWorkspaceById } from '~/lib/actions/workspaces';
import { WorkspaceOnboardingModal } from '~/components/workspace/workspace-onboarding/WorkspaceOnboardingModal';

export default async function WorkspacePage({ params }: { params: { id: string } }) {
  const workspace = await getWorkspaceById(params.id);
  const showOnboarding = workspace ? !workspace.onboardingCompleted : true;

  return (
    <>
      <Page />
      {showOnboarding && <WorkspaceOnboardingModal workspaceId={params.id} />}
    </>
  );
}
