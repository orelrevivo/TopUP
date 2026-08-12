'use client';
import React, { useMemo } from 'react';
import { Card } from '~/components/ui/Card';
import { Button } from '~/components/ui/Button';
import { Badge } from '~/components/ui/Badge';
import type { DbUser } from './types';

interface AuthTabProps {
  users: DbUser[];
  onUserAction: (userId: string, action: string) => void;
}

function SignupChart({ users }: { users: DbUser[] }) {
  const chartData = useMemo(() => {
    const now = new Date();
    const months: Record<string, number> = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months[`${d.getFullYear()}-${d.getMonth()}`] = 0;
    }
    users.forEach((u) => {
      const d = new Date(u.created_at);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (key in months) months[key]++;
    });
    return Object.entries(months).map(([key, count]) => {
      const [, m] = key.split('-').map(Number);
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return { label: monthNames[m], count };
    });
  }, [users]);

  const max = Math.max(...chartData.map((d) => d.count), 1);

  if (!users.length) {
    return <p className="text-sm text-falbor-elements-textTertiary text-center py-4 italic">No user data yet.</p>;
  }

  return (
    <div className="space-y-2">
      {chartData.map((entry) => (
        <div key={entry.label} className="flex items-center gap-3">
          <span className="text-xs text-falbor-elements-textTertiary w-8 text-right">{entry.label}</span>
          <div className="flex-1 bg-falbor-elements-background-depth-2 rounded-full h-5 overflow-hidden">
            <div
              className="h-full bg-[#3ECF8E] rounded-full transition-all duration-500"
              style={{ width: `${(entry.count / max) * 100}%`, minWidth: entry.count > 0 ? '8px' : '0' }}
            />
          </div>
          <span className="text-xs font-semibold text-falbor-elements-textPrimary w-4">{entry.count}</span>
        </div>
      ))}
    </div>
  );
}

function isBanned(bannedUntil: string | null): boolean {
  return !!bannedUntil && new Date(bannedUntil) > new Date();
}

export function AuthTab({ users, onUserAction }: AuthTabProps) {
  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl font-semibold">Authentication</h1>
        <p className="text-sm text-falbor-elements-textSecondary mt-0.5">
          {users.length} registered user{users.length !== 1 ? 's' : ''} · updates every 5s
        </p>
      </div>

      <Card className="border-falbor-elements-borderColor">
        <div className="px-5 py-4 border-b border-falbor-elements-borderColor">
          <h2 className="font-semibold text-sm">User Signups</h2>
        </div>
        <div className="p-6">
          <SignupChart users={users} />
        </div>
      </Card>

      <Card className="border-falbor-elements-borderColor border-b-0 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-falbor-elements-background-depth-2 border-b border-falbor-elements-borderColor">
            <tr>
              {['Email', 'Confirmed', 'Joined', 'Last Sign In', 'Actions'].map((h) => (
                <th
                  key={h}
                  className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider text-falbor-elements-textSecondary${h === 'Actions' ? ' text-right' : ''}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-falbor-elements-borderColor hover:bg-falbor-elements-background-depth-2"
                >
                  <td className="px-5 py-3 font-medium">
                    <span>{u.email}</span>
                    {isBanned(u.banned_until) && (
                      <Badge variant="destructive" size="sm" className="ml-2">
                        Banned
                      </Badge>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    {u.email_confirmed_at ? (
                      <Badge variant="success" size="sm">
                        ✓ Confirmed
                      </Badge>
                    ) : (
                      <Badge variant="secondary" size="sm">
                        Pending
                      </Badge>
                    )}
                  </td>
                  <td className="px-5 py-3 text-falbor-elements-textSecondary text-xs">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3 text-falbor-elements-textSecondary text-xs">
                    {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {isBanned(u.banned_until) ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs text-green-500 border-green-500/20 hover:bg-green-500/10"
                          onClick={() => onUserAction(u.id, 'unban_user')}
                        >
                          Unban
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs text-orange-500 border-orange-500/20 hover:bg-orange-500/10"
                          onClick={() => onUserAction(u.id, 'ban_user')}
                        >
                          Ban
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs text-red-500 border-red-500/20 hover:bg-red-500/10"
                        onClick={() => onUserAction(u.id, 'delete_user')}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-falbor-elements-textTertiary italic">
                  No users registered yet. Users will appear here after they sign up on your app.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
