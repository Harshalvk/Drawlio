"use client";

import { useRouter } from "next/navigation";
import { Button } from "@repo/ui/components/button";

export default function Home() {
  const router = useRouter();
  return (
    <div className="h-screen w-full flex flex-col max-w-5xl mx-auto items-center justify-center gap-5">
      <h2 className="text-8xl font-semibold tracking-tighter font-sans">
        Web app
      </h2>
      <Button
        onClick={() => {
          router.push("/canvas/123");
        }}
      >
        Canvas
      </Button>
    </div>
  );
}
