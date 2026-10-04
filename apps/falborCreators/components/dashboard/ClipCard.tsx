"use client";

import React, { useState } from "react";
import { Badge, Button } from "@/components/ui";
import { Play, Check, X, Send, Sparkles, Eye, XCircle } from "lucide-react";

interface ClipCardProps {
  clip: {
    id: string;
    title: string;
    score: number;
    contentType: string;
    status: string;
    videoUrl?: string;
    description?: string;
  };
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onPublish?: (id: string) => void;
}

export function ClipCard({ clip, onApprove, onReject, onPublish }: ClipCardProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <>
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-all flex flex-col justify-between">
        <div
          onClick={() => setIsPreviewOpen(true)}
          className="relative aspect-[9/16] bg-zinc-950 flex items-center justify-center group overflow-hidden max-h-64 cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80 z-10"></div>
          <div className="w-10 h-10 rounded-full bg-indigo-600/80 group-hover:bg-indigo-600 flex items-center justify-center transition-all transform group-hover:scale-110 z-20 shadow-lg">
            <Play className="w-5 h-5 text-white fill-current ml-0.5" />
          </div>
          <div className="absolute top-2 left-2 z-20 flex gap-1">
            <Badge variant="neutral">{clip.contentType}</Badge>
            <Badge variant={clip.status === "published" ? "success" : "warning"}>{clip.status}</Badge>
          </div>
          <div className="absolute top-2 right-2 z-20 bg-indigo-600/90 text-white font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
            <Sparkles className="w-2.5 h-2.5" />
            {clip.score}/100
          </div>
        </div>

        <div className="p-3 space-y-2 flex-grow flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-semibold text-zinc-100 line-clamp-2">{clip.title}</h4>
            <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">{clip.description}</p>
          </div>

          <div className="flex items-center gap-1.5 pt-2 border-t border-zinc-800/60">
            <Button size="sm" variant="outline" className="text-[11px]" onClick={() => setIsPreviewOpen(true)}>
              <Eye className="w-3 h-3" /> Watch
            </Button>
            {clip.status === "generated" && (
              <>
                <Button size="sm" variant="primary" className="flex-1" onClick={() => onApprove?.(clip.id)}>
                  <Check className="w-3 h-3" /> Approve
                </Button>
                <Button size="sm" variant="danger" onClick={() => onReject?.(clip.id)}>
                  <X className="w-3 h-3" />
                </Button>
              </>
            )}
            {clip.status === "approved" && (
              <Button size="sm" variant="primary" className="flex-1" onClick={() => onPublish?.(clip.id)}>
                <Send className="w-3 h-3" /> Publish
              </Button>
            )}
            {clip.status === "published" && (
              <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 mx-auto py-1">
                <Check className="w-3 h-3" /> Published
              </span>
            )}
          </div>
        </div>
      </div>

      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-sm w-full p-4 relative flex flex-col items-center space-y-4 shadow-2xl">
            <button
              onClick={() => setIsPreviewOpen(false)}
              className="absolute top-3 right-3 text-zinc-400 hover:text-white transition-colors"
            >
              <XCircle className="w-6 h-6" />
            </button>

            <div className="text-center w-full">
              <h3 className="text-sm font-bold text-white line-clamp-1">{clip.title}</h3>
              <p className="text-xs text-zinc-400 mt-0.5">AI Score: {clip.score}/100 • 9:16 Vertical Video</p>
            </div>

            <div className="relative aspect-[9/16] w-full max-w-[240px] bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800 flex items-center justify-center">
              {clip.videoUrl ? (
                <video src={clip.videoUrl} controls autoPlay className="w-full h-full object-cover" />
              ) : (
                <div className="p-4 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center mx-auto">
                    <Play className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-semibold text-zinc-200">AI Clip Render Preview</p>
                  <p className="text-[11px] text-zinc-400">FFmpeg 9:16 vertical with burned-in captions ready for review.</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 w-full pt-2 border-t border-zinc-800">
              {clip.status === "generated" && (
                <>
                  <Button
                    variant="primary"
                    className="flex-1"
                    onClick={() => {
                      onApprove?.(clip.id);
                      setIsPreviewOpen(false);
                    }}
                  >
                    <Check className="w-4 h-4" /> Approve Clip
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      onReject?.(clip.id);
                      setIsPreviewOpen(false);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </>
              )}
              {clip.status === "approved" && (
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => {
                    onPublish?.(clip.id);
                    setIsPreviewOpen(false);
                  }}
                >
                  <Send className="w-4 h-4" /> Publish to YouTube Shorts
                </Button>
              )}
              {clip.status === "published" && (
                <span className="text-xs text-emerald-400 font-semibold mx-auto">Published to Channel</span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
