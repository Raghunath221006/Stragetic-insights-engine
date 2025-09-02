"use client"

import type { MarketReport, QualitativeData } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft, BarChart2, FileText, Lightbulb, MessageCircle, Mic, Smile, Frown, Meh, PenSquare } from "lucide-react";
import { Button } from "./ui/button";

interface ReportDashboardProps {
  report: MarketReport;
  topic: string;
  onReset: () => void;
}

const sentimentColors: { [key: string]: string } = {
  positive: "hsl(var(--chart-1))",
  negative: "hsl(var(--chart-2))",
  neutral: "hsl(var(--chart-5))",
};

const SentimentIcon = ({ sentiment }: { sentiment: string }) => {
  switch (sentiment.toLowerCase()) {
    case 'positive': return <Smile className="w-4 h-4 text-green-500" />;
    case 'negative': return <Frown className="w-4 h-4 text-red-500" />;
    default: return <Meh className="w-4 h-4 text-yellow-500" />;
  }
};

export function ReportDashboard({ report, topic, onReset }: ReportDashboardProps) {
  const sentimentCounts = report.qualitativeData.reduce((acc, item) => {
    const sentiment = item.analysis.sentiment.toLowerCase();
    acc[sentiment] = (acc[sentiment] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  const chartData = Object.keys(sentimentCounts).map(key => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    count: sentimentCounts[key],
    fill: sentimentColors[key],
  }));

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-12 animate-in fade-in-0 duration-500">
      <header className="flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={onReset} className="mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            New Analysis
          </Button>
          <h1 className="text-3xl font-bold">Market Research Report</h1>
          <p className="text-muted-foreground">Topic: <span className="font-semibold text-primary">{topic}</span></p>
        </div>
      </header>
      
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Executive Summary */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-6 h-6" />
              Executive Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/90 whitespace-pre-wrap">{report.executiveSummary}</p>
          </CardContent>
        </Card>

        {/* Key Insights */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-6 h-6" />
              Key Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {report.keyInsights.map((insight, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                  <span className="text-foreground/90">{insight}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Quantitative Analysis */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="w-6 h-6" />
              Quantitative Analysis
            </CardTitle>
            <CardDescription>Market overview of leading brands in the wireless headphones sector.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Brand</TableHead>
                  <TableHead className="text-right">Market Share</TableHead>
                  <TableHead className="text-right">Avg. Price</TableHead>
                  <TableHead className="text-right">Avg. Rating</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {report.quantitativeData.map((data) => (
                  <TableRow key={data.brand}>
                    <TableCell className="font-medium">{data.brand}</TableCell>
                    <TableCell className="text-right">{data.marketShare}%</TableCell>
                    <TableCell className="text-right">${data.price}</TableCell>
                    <TableCell className="text-right">{data.rating}/5</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Sentiment Analysis */}
        <Card className="lg:col-span-3">
          <CardHeader>
             <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-6 h-6" />
              Qualitative Sentiment Analysis
            </CardTitle>
            <CardDescription>Analysis of customer reviews and comments from public sources.</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <h4 className="font-semibold mb-4 text-center">Sentiment Distribution</h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
                  <Tooltip
                    cursor={{ fill: 'hsl(var(--muted) / 0.5)' }}
                    contentStyle={{
                      background: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 'var(--radius)',
                    }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="md:col-span-2 space-y-4 max-h-80 overflow-y-auto pr-3">
                {report.qualitativeData.map((data, index) => (
                    <div key={index} className="border p-4 rounded-md bg-background">
                       <p className="text-sm text-muted-foreground italic">"{data.review}"</p>
                       <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
                         <div className="flex items-center gap-2">
                            <SentimentIcon sentiment={data.analysis.sentiment} />
                            <span className="text-sm font-semibold capitalize">{data.analysis.sentiment}</span>
                         </div>
                         <div className="flex gap-1.5 flex-wrap">
                            {data.analysis.keyTopics.map(topic => (
                                <Badge key={topic} variant="secondary">{topic}</Badge>
                            ))}
                         </div>
                       </div>
                    </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Marketing Content */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <PenSquare className="w-6 h-6" />
                Generated Marketing Content
            </CardTitle>
            <CardDescription>Sample content generated by the Content Agent based on market insights.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {report.marketingContent.map((content, index) => (
                <div key={index} className="p-4 rounded-lg border bg-background text-center flex flex-col items-center justify-center">
                    <Mic className="w-8 h-8 text-accent mb-3" />
                    <p className="font-medium italic">"{content}"</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
