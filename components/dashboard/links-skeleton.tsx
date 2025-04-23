"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function LinksSkeleton() {
  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-6 w-6" />
                <div>
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-6 w-12" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
