"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Bot, Check, Loader, Search, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/icons";
import { getMarketResearchReport } from "@/app/actions";
import type { MarketReport } from "@/types";
import { ReportDashboard } from "@/components/report-dashboard";
import { useToast } from "@/hooks/use-toast";

type LoadingStep =
  | "IDLE"
  | "ORCHESTRATING"
  | "RESEARCHING"
  | "ANALYZING"
  | "GENERATING"
  | "STRATEGIZING"
  | "REPORTING"
  | "DONE";

const loadingSteps: {
  key: LoadingStep;
  label: string;
  duration: number;
}[] = [
  { key: "ORCHESTRATING", label: "Orchestrator: Decomposing user goal...", duration: 1500 },
  { key: "RESEARCHING", label: "Research Agent: Gathering market data...", duration: 2500 },
  { key: "ANALYZING", label: "Analytics Agent: Analyzing trends and sentiment...", duration: 3000 },
  { key: "GENERATING", label: "Content Agent: Generating creative assets...", duration: 2000 },
  { key: "STRATEGIZING", label: "Strategist Agent: Formulating launch plan...", duration: 2500 },
  { key: "REPORTING", label: "Report Agent: Compiling final report...", duration: 1500 },
];

export default function Home() {
  const [topic, setTopic] = useState("Wireless Headphones");
  const [loadingStep, setLoadingStep] = useState<LoadingStep>("IDLE");
  const [report, setReport] = useState<MarketReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError("Please enter a research topic.");
      return;
    }
    setError(null);
    setReport(null);
    
    try {
      // Use a recursive function to step through loading states
      const runStep = (index: number) => {
        if (index < loadingSteps.length) {
          setLoadingStep(loadingSteps[index].key);
          setTimeout(() => runStep(index + 1), loadingSteps[index].duration);
        }
      };
      
      runStep(0);
      
      const result = await getMarketResearchReport(topic);
      setReport(result);
      setLoadingStep("DONE");

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      console.error(errorMessage);
      setError(errorMessage);
      setLoadingStep("IDLE");
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Could not generate the report. Please try again.",
      });
    }
  };
  
  const currentStepIndex = loadingSteps.findIndex(s => s.key === loadingStep);
  const isLoading = loadingStep !== "IDLE" && loadingStep !== "DONE";

  return (
    <div className="min-h-screen w-full bg-grid-white/[0.05] relative flex flex-col items-center justify-center p-4 overflow-x-hidden">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      
      <main className="z-10 w-full max-w-7xl">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-2xl mx-auto"
            >
              <div className="bg-card/80 backdrop-blur-sm border rounded-xl p-8 shadow-2xl shadow-primary/10">
                <h2 className="text-2xl font-bold text-center mb-6">Agents at Work...</h2>
                <div className="space-y-4">
                  {loadingSteps.map((step, index) => (
                    <div key={step.key} className="flex items-center space-x-3 text-sm">
                      <div className="w-5 h-5 flex items-center justify-center">
                        {currentStepIndex > index ? (
                          <motion.div initial={{scale: 0}} animate={{scale: 1}}>
                            <Check className="w-5 h-5 text-primary" />
                          </motion.div>
                        ) : currentStepIndex === index ? (
                          <Loader className="w-5 h-5 animate-spin text-primary" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-muted" />
                        )}
                      </div>
                      <span className={`transition-colors ${currentStepIndex >= index ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : report ? (
            <motion.div
              key="report"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-full"
            >
              <ReportDashboard report={report} onReset={() => { setReport(null); setLoadingStep("IDLE"); }} topic={topic} />
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center flex flex-col items-center"
            >
              <div className="mb-4 flex items-center justify-center gap-2 text-2xl font-bold bg-gradient-to-br from-primary via-accent to-primary bg-clip-text text-transparent">
                <Logo className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 pb-2">
                Strategic Insights Engine
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                An autonomous multi-agent system for end-to-end market research. Decompose goals, gather data, synthesize insights, and generate reports automatically.
              </p>
              <form onSubmit={handleAnalysis} className="mt-10 w-full max-w-xl flex items-center gap-2">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    value={topic}
                    onChange={(e) => { setTopic(e.target.value); setError(null); }}
                    placeholder="e.g., 'Wireless Headphones' or 'Electric Scooters'"
                    className="w-full h-12 pl-10 text-base"
                    aria-label="Market research topic"
                  />
                </div>
                <Button type="submit" size="lg" className="h-12">
                  Start Analysis
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </form>
              {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-accent" />
                  <span>Multi-Agent System</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent" />
                  <span>Autonomous Workflow</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent" />
                  <span>Ethical Safeguards</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
