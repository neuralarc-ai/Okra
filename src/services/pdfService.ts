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
    fillColor: [37, 99, 235],
    textColor: 255,
    fontSize: 10,
    fontStyle: 'bold' as const,
  },
  bodyStyles: { 
    fontSize: 9,
  },
  alternateRowStyles: { 
    fillColor: [248, 250, 252]
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
  // Create a new PDF document
  const doc = new jsPDF() as AutoTableExtendedDoc;
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Add title
  doc.setFontSize(24);
  doc.setTextColor(0, 0, 0);
  doc.text("Okra AI Analysis Report", pageWidth / 2, 20, { align: "center" });
  
  // Add date
  doc.setFontSize(10);
  doc.setTextColor(128, 128, 128);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 30, { align: "center" });
  
  let currentY = 45;

  // Add prompt section
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("Analysis Prompt:", 15, currentY);
  doc.setFontSize(11);
  doc.setTextColor(64, 64, 64);
  const splitPrompt = doc.splitTextToSize(prompt, pageWidth - 30);
  doc.text(splitPrompt, 15, currentY + 7);
  
  currentY += splitPrompt.length * 7 + 15;
  
  // Add validation score
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text(`Validation Score: ${result.validationScore}/100`, 15, currentY);
  
  currentY += 15;
  
  // Add summary
  doc.setFontSize(14);
  doc.text("Executive Summary:", 15, currentY);
  doc.setFontSize(11);
  doc.setTextColor(64, 64, 64);
  
  const splitSummary = doc.splitTextToSize(result.summary, pageWidth - 30);
  currentY += 7;
  doc.text(splitSummary, 15, currentY);
  
  currentY += splitSummary.length * 7 + 15;
  
  // Add score analysis section if available
  if (result.scoreAnalysis) {
    currentY = addNewPageIfNeeded(doc, currentY, 80);
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Score Analysis", 15, currentY);
    
    const analysisData: RowInput[] = [
      ['Category', result.scoreAnalysis.category],
      ['Market Potential', `${result.scoreAnalysis.marketPotential.score}% - ${result.scoreAnalysis.marketPotential.status}`],
      ['Competition', result.scoreAnalysis.competition.level],
      ['Market Size', `${result.scoreAnalysis.marketSize.status} (${result.scoreAnalysis.marketSize.trend})`],
      ['Timing', result.scoreAnalysis.timing.status]
    ];
    
    autoTable(doc, {
      startY: currentY + 5,
      head: [['Metric', 'Value']],
      body: analysisData,
      ...tableStyles,
      margin: { left: 15, right: 15 },
    });
    
    currentY = doc.lastAutoTable.finalY + 15;
  }
  
  // Add competitors table
  currentY = addNewPageIfNeeded(doc, currentY, 100);
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("Competitive Analysis", 15, currentY);
  
  const competitorData = result.competitors.map(comp => [
    comp.name,
    `${comp.strengthScore}/100`,
    comp.description
  ]);
  
  autoTable(doc, {
    startY: currentY + 5,
    head: [['Competitor', 'Strength', 'Description']],
    body: competitorData,
    ...tableStyles,
    margin: { left: 15, right: 15 },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: 30 },
      2: { cellWidth: 'auto' }
    }
  });
  
  currentY = doc.lastAutoTable.finalY + 15;
  
  // Add pricing table
  currentY = addNewPageIfNeeded(doc, currentY, 80);
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("Price Point Recommendations", 15, currentY);
  
  const pricingData = result.priceSuggestions.map(price => [
    price.type,
    price.value,
    price.description
  ]);
  
  autoTable(doc, {
    startY: currentY + 5,
    head: [['Tier', 'Price', 'Description']],
    body: pricingData,
    ...tableStyles,
    margin: { left: 15, right: 15 }
  });
  
  currentY = doc.lastAutoTable.finalY + 15;
  
  // Add forecast table
  currentY = addNewPageIfNeeded(doc, currentY, 100);
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("Market Forecast", 15, currentY);
  
  const forecastData = [
    ['Best Case Revenue', `${result.forecasts.bestCase.revenue}`],
    ['Best Case Market Share', `${result.forecasts.bestCase.marketShare}`],
    ['Best Case Customers', `${result.forecasts.bestCase.customers}`],
    ['Worst Case Revenue', `${result.forecasts.worstCase.revenue}`],
    ['Worst Case Market Share', `${result.forecasts.worstCase.marketShare}`],
    ['Worst Case Customers', `${result.forecasts.worstCase.customers}`]
  ];
  
  autoTable(doc, {
    startY: currentY + 5,
    head: [['Metric', 'Projection']],
    body: forecastData,
    ...tableStyles,
    margin: { left: 15, right: 15 }
  });
  
  currentY = doc.lastAutoTable.finalY + 15;
  
  // Add target audience table
  currentY = addNewPageIfNeeded(doc, currentY, 80);
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("Target Audience", 15, currentY);
  
  const clientData = result.clients.map(client => [
    client.name,
    client.industry,
    client.useCase
  ]);
  
  autoTable(doc, {
    startY: currentY + 5,
    head: [['Name', 'Industry', 'Use Case']],
    body: clientData,
    ...tableStyles,
    margin: { left: 15, right: 15 }
  });
  
  // Add recommendations if available
  if (result.scoreAnalysis?.recommendations?.length) {
    currentY = doc.lastAutoTable.finalY + 15;
    currentY = addNewPageIfNeeded(doc, currentY, 80);
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Key Recommendations", 15, currentY);
    
    const recommendationsData = result.scoreAnalysis.recommendations.map(rec => [rec]);
    
    autoTable(doc, {
      startY: currentY + 5,
      body: recommendationsData,
      ...tableStyles,
      theme: 'plain',
      margin: { left: 15, right: 15 },
      styles: { cellPadding: 2 }
    });
    
    currentY = doc.lastAutoTable.finalY + 15;
  }
  
  // Footer
  currentY = addNewPageIfNeeded(doc, currentY, 20);
  doc.setFontSize(10);
  doc.setTextColor(128, 128, 128);
  doc.text("Generated by Okra AI - Startup Analysis Engine", pageWidth / 2, currentY, { align: "center" });
  
  // Save the PDF
  const filename = `Okra_Analysis_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
};
