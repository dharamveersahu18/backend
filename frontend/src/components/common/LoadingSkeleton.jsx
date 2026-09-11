import React from "react";

export const VideoCardSkeleton = () => (
  <div className="flex flex-col gap-3 animate-pulse">
    <div className="aspect-video w-full rounded-2xl bg-zinc-800/60" />
    <div className="flex gap-3">
      <div className="w-10 h-10 rounded-full bg-zinc-800/80 shrink-0" />
      <div className="flex flex-col gap-2 w-full">
        <div className="h-4 bg-zinc-800/80 rounded w-5/6" />
        <div className="h-3 bg-zinc-800/60 rounded w-1/2" />
        <div className="h-3 bg-zinc-800/50 rounded w-1/3" />
      </div>
    </div>
  </div>
);

export const VideoGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
    {Array.from({ length: count }).map((_, i) => (
      <VideoCardSkeleton key={i} />
    ))}
  </div>
);

export const WatchPageSkeleton = () => (
  <div className="flex flex-col lg:flex-row gap-6 p-4 max-w-7xl mx-auto w-full animate-pulse">
    <div className="flex-1 flex flex-col gap-4">
      <div className="aspect-video w-full rounded-2xl bg-zinc-800/80" />
      <div className="h-6 bg-zinc-800 rounded w-3/4" />
      <div className="flex justify-between items-center py-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-zinc-800" />
          <div className="flex flex-col gap-2">
            <div className="h-4 bg-zinc-800 rounded w-32" />
            <div className="h-3 bg-zinc-800/60 rounded w-20" />
          </div>
        </div>
        <div className="h-10 bg-zinc-800 rounded-full w-28" />
      </div>
      <div className="h-24 bg-zinc-900 rounded-2xl" />
    </div>
    <div className="w-full lg:w-96 flex flex-col gap-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-3">
          <div className="w-40 aspect-video rounded-xl bg-zinc-800 shrink-0" />
          <div className="flex flex-col gap-2 w-full">
            <div className="h-3 bg-zinc-800 rounded w-4/5" />
            <div className="h-2.5 bg-zinc-800/60 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  </div>
);
