import { default as IndexRoute } from '../../page';

export default function ChatPage({ params }: { params: { id: string } }) {
  // In Next.js App Router, the id can be accessed from the params directly in the Page component.
  // We re-export the main Chat interface which handles reading from the URL/Store.
  return <IndexRoute />;
}
