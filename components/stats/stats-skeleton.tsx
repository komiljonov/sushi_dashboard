import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "../ui/Card";

export default function AdminPanelSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-40" />
        <div className="flex items-center gap-4">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-9 w-32" />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-12" />
              <Skeleton className="h-3 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 space-y-4">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-56 w-full rounded-xl" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-4">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-56 w-full rounded-xl" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4 space-y-4">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </CardContent>
      </Card>
    </div>
  );
}
