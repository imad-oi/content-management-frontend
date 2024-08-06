"use client";

import { useSession } from "./SessionProvider";
import { Button } from "./ui/button";

export function SessionSwitch() {
  const { session, switchSession } = useSession();

  return (
    <div className="mb-4" role="group">
      <div className="sr-only">Choose session type</div> 
      <Button
        onClick={() => switchSession("writer")}
        variant={session === "writer" ? "default" : "outline"}
        className="mr-2"
        aria-pressed={session === "writer"}
        aria-label="Switch to Writer session"
      >
        Writer
      </Button>
      <Button
        onClick={() => switchSession("publisher")}
        variant={session === "publisher" ? "default" : "outline"}
        aria-pressed={session === "publisher"}
        aria-label="Switch to Publisher session"
      >
        Publisher
      </Button>
    </div>
  );
}
