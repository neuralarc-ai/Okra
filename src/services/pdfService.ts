import { AnalysisResult } from "@/types/oracle";
import jsPDF from "jspdf";
import autoTable, { RowInput, UserOptions } from "jspdf-autotable";

interface AutoTableExtendedDoc extends jsPDF {
  lastAutoTable: {
    finalY: number;
  };
}

// Define table styles
const tableStyles: Partial<UserOptions> = {
  headStyles: {
fillColor: '#34d399', // emerald-300
    textColor: '#ffffff', // white
    fontSize: 10,
    fontStyle: 'bold' as const,
  },
  bodyStyles: {
    fontSize: 9,
  },
  alternateRowStyles: {
    fillColor: '#f8fafc' // slate-50
  },
};

const addNewPageIfNeeded = (doc: AutoTableExtendedDoc, currentY: number, requiredSpace: number): number => {
  const pageHeight = doc.internal.pageSize.getHeight();
  if (currentY + requiredSpace > pageHeight - 20) {
    doc.addPage();
    return 20;
  }
  return currentY;
};

export const generatePDF = async (result: AnalysisResult, prompt: string) => {
  const doc = new jsPDF() as AutoTableExtendedDoc;
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Title and Date
  doc.setFontSize(24);
  doc.setTextColor('#000000'); // black
  doc.text("Okra AI Analysis Report", pageWidth / 2, 20, { align: "center" });
  doc.setFontSize(10);
  doc.setTextColor('#808080'); // gray
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 30, { align: "center" });
  let currentY = 45;

 

  // ScoreCard: Validation Score, Category, Executive Summary, Key Metrics, Recommendations
  doc.setFontSize(16);
  doc.setTextColor('#000000');
  doc.text(`Validation Score: ${result.validationScore}/100`, 15, currentY);
  currentY += 10;
  doc.setFontSize(12);
  doc.text(`Category: ${result.scoreAnalysis.category}`, 15, currentY);
  currentY += 10;
  doc.setFontSize(12);
  doc.text("Executive Summary:", 15, currentY);
  doc.setFontSize(11);
  doc.setTextColor('#404040');
  const splitSummary = doc.splitTextToSize(result.scoreAnalysis.executiveSummary, pageWidth - 30);
  doc.text(splitSummary, 15, currentY + 7);
  currentY += splitSummary.length * 7 + 10;
  // Key Metrics
  doc.setFontSize(12);
  doc.setTextColor('#000000');
  doc.text("Key Metrics:", 15, currentY);
  currentY += 7;
  autoTable(doc, {
    startY: currentY,
    head: [["Market Size", "Growth Rate", "Target Audience", "Initial Investment"]],
    body: [[
      result.scoreAnalysis.keyMetrics.marketSize,
      result.scoreAnalysis.keyMetrics.growthRate,
      result.scoreAnalysis.keyMetrics.targetAudience,
      result.scoreAnalysis.keyMetrics.initialInvestment
    ]],
    ...tableStyles,
    margin: { left: 15, right: 15 },
  });
  currentY = doc.lastAutoTable.finalY + 10;
  // Recommendations
  doc.setFontSize(12);
  doc.setTextColor('#000000');
  doc.text("Key Recommendations:", 15, currentY);
  doc.setFontSize(11);
  doc.setTextColor('#404040');
  const recs = result.scoreAnalysis.recommendations.map((r, i) => `${i + 1}. ${r}`);
  doc.text(recs, 15, currentY + 7);
  currentY += recs.length * 7 + 15;

  // CompetitorsCard
  currentY = addNewPageIfNeeded(doc, currentY, 80);
  doc.setFontSize(14);
  doc.setTextColor('#000000');
  doc.text("Competitive Analysis", 15, currentY);
  const competitorData = result.competitors.map(comp => [
    comp.name,
    `${comp.strengthScore}/100`,
    comp.marketShare !== undefined ? `${comp.marketShare}%` : '',
    comp.primaryAdvantage || '',
    comp.description
  ]);
  autoTable(doc, {
    startY: currentY + 5,
    head: [["Competitor", "Strength", "Market Share", "Key Advantage", "Description"]],
    body: competitorData,
    ...tableStyles,
    margin: { left: 15, right: 15 },
    columnStyles: {
      0: { cellWidth: 35 },
      1: { cellWidth: 22 },
      2: { cellWidth: 22 },
      3: { cellWidth: 40 },
      4: { cellWidth: 'auto' }
    }
  });
  currentY = doc.lastAutoTable.finalY + 15;

  // PricingCard
  currentY = addNewPageIfNeeded(doc, currentY, 80);
  doc.setFontSize(14);
  doc.setTextColor('#000000');
  doc.text("Price Point Recommendations", 15, currentY);
  const pricingData = result.priceSuggestions.map(price => [
    price.type,
    price.value,
    price.description
  ]);
  autoTable(doc, {
    startY: currentY + 5,
    head: [["Tier", "Price", "Description"]],
    body: pricingData,
    ...tableStyles,
    margin: { left: 15, right: 15 }
  });
  currentY = doc.lastAutoTable.finalY + 15;

  // ForecastCard
  currentY = addNewPageIfNeeded(doc, currentY, 80);
  doc.setFontSize(14);
  doc.setTextColor('#000000');
  doc.text("Market Forecast", 15, currentY);
  const forecastData = [
    ["Best Case Revenue", `${result.forecasts.bestCase.revenue}`],
    ["Best Case Market Share", `${result.forecasts.bestCase.marketShare}`],
    ["Best Case Customers", `${result.forecasts.bestCase.customers}`],
    ["Worst Case Revenue", `${result.forecasts.worstCase.revenue}`],
    ["Worst Case Market Share", `${result.forecasts.worstCase.marketShare}`],
    ["Worst Case Customers", `${result.forecasts.worstCase.customers}`]
  ];
  autoTable(doc, {
    startY: currentY + 5,
    head: [["Metric", "Projection"]],
    body: forecastData,
    ...tableStyles,
    margin: { left: 15, right: 15 }
  });
  currentY = doc.lastAutoTable.finalY + 15;

  // TimelineCard
  currentY = addNewPageIfNeeded(doc, currentY, 80);
  doc.setFontSize(14);
  doc.setTextColor('#000000');
  doc.text("Project Timeline", 15, currentY);
  const timelineData = result.timeline.phases.map(phase => [
    phase.name,
    phase.duration,
    phase.risk,
    phase.milestone,
    phase.tasks.join(", ")
  ]);
  autoTable(doc, {
    startY: currentY + 5,
    head: [["Phase", "Duration", "Risk", "Milestone", "Tasks"]],
    body: timelineData,
    ...tableStyles,
    margin: { left: 15, right: 15 }
  });
  currentY = doc.lastAutoTable.finalY + 15;

  // GoToMarketCard
  currentY = addNewPageIfNeeded(doc, currentY, 80);
  doc.setFontSize(14);
  doc.setTextColor('#000000');
  doc.text("Go-to-Market Strategy", 15, currentY);
  // Strategy
  autoTable(doc, {
    startY: currentY + 5,
    head: [["Initiative", "Description", "Priority"]],
    body: result.goToMarket.strategy.map(s => [s.name, s.description, s.priority]),
    ...tableStyles,
    margin: { left: 15, right: 15 }
  });
  currentY = doc.lastAutoTable.finalY + 5;
  // Channels
  autoTable(doc, {
    startY: currentY,
    head: [["Channel", "Effectiveness", "Cost", "Time to ROI"]],
    body: result.goToMarket.channels.map(c => [c.name, `${c.effectiveness}%`, c.cost, c.timeToROI]),
    ...tableStyles,
    margin: { left: 15, right: 15 }
  });
  currentY = doc.lastAutoTable.finalY + 5;
  // KPIs
  autoTable(doc, {
    startY: currentY,
    head: [["KPI Metric", "Target", "Timeframe"]],
    body: result.goToMarket.kpis.map(k => [k.metric, k.target, k.timeframe]),
    ...tableStyles,
    margin: { left: 15, right: 15 }
  });
  currentY = doc.lastAutoTable.finalY + 15;

  // RevenueModelCard
  currentY = addNewPageIfNeeded(doc, currentY, 80);
  doc.setFontSize(14);
  doc.setTextColor('#000000');
  doc.text("Revenue Model", 15, currentY);
  autoTable(doc, {
    startY: currentY + 5,
    head: [["Stream Name", "Description", "% of Revenue", "Scalability", "Recurring Type"]],
    body: result.revenueModel.primaryStreams.map(s => [s.name, s.description, `${s.percentage}%`, s.scalability, s.recurringType]),
    ...tableStyles,
    margin: { left: 15, right: 15 }
  });
  currentY = doc.lastAutoTable.finalY + 5;
  // Metrics
  autoTable(doc, {
    startY: currentY,
    head: [["Metric", "Current", "Target", "Timeframe"]],
    body: result.revenueModel.metrics.map(m => [m.name, m.current, m.target, m.timeframe]),
    ...tableStyles,
    margin: { left: 15, right: 15 }
  });
  currentY = doc.lastAutoTable.finalY + 5;
  // Growth Strategy
  autoTable(doc, {
    startY: currentY,
    head: [["Phase", "Tactics", "Expected Impact", "Timeline"]],
    body: result.revenueModel.growthStrategy.map(g => [g.phase, g.tactics.join(", "), g.expectedImpact, g.timeline]),
    ...tableStyles,
    margin: { left: 15, right: 15 }
  });
  currentY = doc.lastAutoTable.finalY + 15;

  // FinancialPlanCard
  currentY = addNewPageIfNeeded(doc, currentY, 80);
  doc.setFontSize(14);
  doc.setTextColor('#000000');
  doc.text("Financial Plan", 15, currentY);
  // Startup Costs
  autoTable(doc, {
    startY: currentY + 5,
    head: [["Startup Cost Category", "Amount", "Description"]],
    body: result.financialPlan.startupCosts.map(c => [c.category, c.amount, c.description]),
    ...tableStyles,
    margin: { left: 15, right: 15 }
  });
  currentY = doc.lastAutoTable.finalY + 5;
  // Monthly Expenses
  autoTable(doc, {
    startY: currentY,
    head: [["Expense Category", "Amount", "Description"]],
    body: result.financialPlan.monthlyExpenses.map(e => [e.category, e.amount, e.description]),
    ...tableStyles,
    margin: { left: 15, right: 15 }
  });
  currentY = doc.lastAutoTable.finalY + 5;
  // Revenue Streams
  autoTable(doc, {
    startY: currentY,
    head: [["Source", "Projected Amount", "Timeframe", "Assumptions"]],
    body: result.financialPlan.revenueStreams.map(r => [r.source, r.projectedAmount, r.timeframe, r.assumptions.join(", ")]),
    ...tableStyles,
    margin: { left: 15, right: 15 }
  });
  currentY = doc.lastAutoTable.finalY + 5;
  // Break-even Analysis
  autoTable(doc, {
    startY: currentY,
    head: [["Time to Break-even", "Monthly Break-even Point", "Assumptions"]],
    body: [[
      result.financialPlan.breakEvenAnalysis.timeToBreakEven,
      result.financialPlan.breakEvenAnalysis.monthlyBreakEvenPoint,
      result.financialPlan.breakEvenAnalysis.assumptions.join(", ")
    ]],
    ...tableStyles,
    margin: { left: 15, right: 15 }
  });
  currentY = doc.lastAutoTable.finalY + 5;
  // Projected Profit Margin
  doc.setFontSize(12);
  doc.setTextColor('#000000');
  doc.text(`Projected Profit Margin: ${result.financialPlan.projectedProfitMargin}%`, 15, currentY);
  currentY += 15;

  // FundingRequirementsCard
  currentY = addNewPageIfNeeded(doc, currentY, 80);
  doc.setFontSize(14);
  doc.setTextColor('#000000');
  doc.text("Funding Requirements", 15, currentY);
  // Total Required
  doc.setFontSize(12);
  doc.text(`Total Funding Required: ${result.fundingRequirements.totalRequired}`, 15, currentY + 7);
  // Funding Stages
  autoTable(doc, {
    startY: currentY + 15,
    head: [["Stage", "Amount", "Timeline", "Purpose", "Milestones"]],
    body: result.fundingRequirements.fundingStages.map(f => [f.stage, f.amount, f.timeline, f.purpose, (f.milestones || []).join(", ")]),
    ...tableStyles,
    margin: { left: 15, right: 15 }
  });
  currentY = doc.lastAutoTable.finalY + 5;
  // Equity Dilution
  autoTable(doc, {
    startY: currentY,
    head: [["Stage", "% Dilution", "Valuation"]],
    body: result.fundingRequirements.equityDilution.map(e => [e.stage, `${e.percentage}%`, e.valuation]),
    ...tableStyles,
    margin: { left: 15, right: 15 }
  });
  currentY = doc.lastAutoTable.finalY + 5;
  // Funding Sources
  autoTable(doc, {
    startY: currentY,
    head: [["Type", "Likelihood", "Requirements", "Pros", "Cons"]],
    body: result.fundingRequirements.fundingSources.map(s => [s.type, `${s.likelihood}%`, (s.requirements || []).join(", "), (s.pros || []).join(", "), (s.cons || []).join(", ")]),
    ...tableStyles,
    margin: { left: 15, right: 15 }
  });
  currentY = doc.lastAutoTable.finalY + 5;
  // Use of Funds
  autoTable(doc, {
    startY: currentY,
    head: [["Category", "Amount", "Description", "Priority"]],
    body: result.fundingRequirements.useOfFunds.map(u => [u.category, u.amount, u.description, u.priority]),
    ...tableStyles,
    margin: { left: 15, right: 15 }
  });
  currentY = doc.lastAutoTable.finalY + 15;

  // MilestonesCard
  currentY = addNewPageIfNeeded(doc, currentY, 80);
  doc.setFontSize(14);
  doc.setTextColor('#000000');
  doc.text("Milestones", 15, currentY);
  // Quarters
  autoTable(doc, {
    startY: currentY + 5,
    head: [["Quarter", "Objectives", "Key Deliverables", "Budget"]],
    body: result.milestones.quarters.map(q => [q.quarter, q.objectives.map(o => o.title).join(", "), (q.keyDeliverables || []).join(", "), q.budget]),
    ...tableStyles,
    margin: { left: 15, right: 15 }
  });
  currentY = doc.lastAutoTable.finalY + 5;
  // Critical Milestones
  autoTable(doc, {
    startY: currentY,
    head: [["Name", "Date", "Importance", "Success Criteria"]],
    body: result.milestones.criticalMilestones.map(m => [m.name, m.date, m.importance, (m.successCriteria || []).join(", ")]),
    ...tableStyles,
    margin: { left: 15, right: 15 }
  });
  currentY = doc.lastAutoTable.finalY + 15;

  // ClientsCard
  currentY = addNewPageIfNeeded(doc, currentY, 80);
  doc.setFontSize(14);
  doc.setTextColor('#000000');
  doc.text("Target Audience Segments", 15, currentY);
  autoTable(doc, {
    startY: currentY + 5,
    head: [["Name", "Industry", "Use Case", "Type", "Demographics", "Needs", "Location", "Coverage", "Priority"]],
    body: result.clients.map(client => [
    client.name,
    client.industry,
      client.useCase,
      client.targetAudienceType || '',
      (client.targetAudienceDefinition.demographics.primary || []).join(", "),
      (client.targetAudienceDefinition.psychographics.needs || []).join(", "),
      client.targetAudienceDefinition.geographics.location,
      client.targetAudienceDefinition.geographics.coverage,
      client.segment?.priority || ''
    ]),
    ...tableStyles,
    margin: { left: 15, right: 15 }
  });
  currentY = doc.lastAutoTable.finalY + 15;

  // SourcesCard
  currentY = addNewPageIfNeeded(doc, currentY, 80);
  doc.setFontSize(14);
  doc.setTextColor('#000000');
  doc.text("Research Sources", 15, currentY);
  autoTable(doc, {
    startY: currentY + 5,
    head: [["Title", "Relevance"]],
    body: result.sources.map(s => [s.title, s.relevance]),
    ...tableStyles,
    margin: { left: 15, right: 15 }
  });
  currentY = doc.lastAutoTable.finalY + 15;
  
  // Footer
  currentY = addNewPageIfNeeded(doc, currentY, 20);
  doc.setFontSize(10);
  doc.setTextColor('#808080');
  doc.text("Generated by Okra AI - A thing by Neural Arc", pageWidth / 2, currentY, { align: "center" });
  
  // Save the PDF
  const filename = `Okra_Analysis_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
};
