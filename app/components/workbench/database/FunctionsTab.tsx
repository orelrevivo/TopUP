'use client';
import React from 'react';
import { Card } from '~/components/ui/Card';
import { Badge } from '~/components/ui/Badge';
import type { DbFunction } from './types';

interface FunctionsTabProps {
  functions: DbFunction[];
}

export function FunctionsTab({ functions }: FunctionsTabProps) {
  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl font-semibold">Database Functions</h1>
        <p className="text-sm text-falbor-elements-textSecondary mt-0.5">
          SQL functions defined in your database schemas
        </p>
      </div>

      <Card className="border-falbor-elements-borderColor overflow-hidden">
        {functions.length > 0 ? (
          <table className="w-full text-sm text-left">
            <thead className="bg-falbor-elements-background-depth-2 border-b border-falbor-elements-borderColor">
              <tr>
                {['Name', 'Schema', 'Type', 'Returns'].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-falbor-elements-textSecondary"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {functions.map((f, i) => (
                <tr
                  key={i}
                  className="border-b border-falbor-elements-borderColor hover:bg-falbor-elements-background-depth-2"
                >
                  <td className="px-5 py-3 font-mono text-[#3ECF8E]">{f.name}</td>
                  <td className="px-5 py-3 text-falbor-elements-textSecondary">
                    <Badge variant="secondary" size="sm">
                      {f.schema}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-falbor-elements-textSecondary">{f.type}</td>
                  <td className="px-5 py-3 font-mono text-xs text-falbor-elements-textTertiary">{f.return_type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="px-5 py-8 text-center text-sm text-falbor-elements-textTertiary italic">
            No custom functions defined yet.
          </p>
        )}
      </Card>
    </div>
  );
}
