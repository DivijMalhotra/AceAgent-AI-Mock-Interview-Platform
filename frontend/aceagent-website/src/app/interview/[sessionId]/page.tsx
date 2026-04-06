"use client";

import { useParams } from "next/navigation";
import LiveInterview from "@/components/interview/LiveInterview";
import Navbar from "@/components/layout/Navbar";

export default function InterviewPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;

  if (!sessionId) {
    return <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center">Loading session...</div>;
  }

  return (
    <main className="min-h-screen bg-[#050816]">
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-cyan-400 mb-4">
            Live AI Assessment
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Maintain eye contact, speak clearly, and focus on the technical depth of your responses.
            The AI is monitoring your cognitive load and communication metrics in real-time.
          </p>
        </div>
        
        <LiveInterview sessionId={sessionId} />
      </div>
    </main>
  );
}
