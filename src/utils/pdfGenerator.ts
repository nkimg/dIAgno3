import { jsPDF } from 'jspdf';
import type { PatientInfo } from './storage';
import type { SyndromeScore } from './scoring';
import { SECTIONS } from '../data/sections';

function formatDate(dateStr?: string): string {
  if (!dateStr) return 'Não informada';
  try {
    const [year, month, day] = dateStr.split('-');
    if (year && month && day) {
      return `${day}/${month}/${year}`;
    }
    return new Date(dateStr).toLocaleDateString('pt-BR');
  } catch (e) {
    return dateStr || '';
  }
}

function getAge(birthDate?: string): string {
  if (!birthDate) return 'Não informada';
  try {
    const diff = Date.now() - new Date(birthDate).getTime();
    const age = Math.floor(diff / 31557600000);
    return `${age} anos`;
  } catch (e) {
    return '';
  }
}

class PDFWriter {
  doc: jsPDF;
  y: number;
  marginX = 15;
  contentWidth = 180;
  lineHeight = 4.5;
  pageCount = 1;

  constructor(doc: jsPDF, startY: number = 20) {
    this.doc = doc;
    this.y = startY;
  }

  ensureSpace(heightNeeded: number) {
    if (this.y + heightNeeded > 270) {
      this.doc.addPage();
      this.pageCount++;
      this.y = 25; // Default top margin for new pages
    }
  }

  writeSectionHeader(title: string) {
    this.ensureSpace(16);
    this.y += 4;
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(10);
    this.doc.setTextColor(62, 106, 225); // Electric Blue (#3E6AE1)
    this.doc.text(title, this.marginX, this.y);
    this.y += 2;
    this.doc.setDrawColor(238, 238, 238); // Cloud Gray (#EEEEEE)
    this.doc.setLineWidth(0.4);
    this.doc.line(this.marginX, this.y, this.marginX + this.contentWidth, this.y);
    this.y += 6;
  }

  drawPatientDetails(patient: PatientInfo, dateStr: string) {
    const age = getAge(patient.birthDate);
    const genderStr = patient.gender === 'female' ? 'Feminino' : 'Masculino';
    const birthDateStr = formatDate(patient.birthDate);
    const complaint = patient.chiefComplaint || 'Não informada';

    // Formatted multi-line complaint details
    const complaintLabel = "Queixa Principal: ";
    const complaintLines = this.doc.splitTextToSize(`${complaintLabel}${complaint}`, this.contentWidth - 12);
    const boxHeight = 20 + (complaintLines.length * 4.5);

    this.ensureSpace(boxHeight + 8);

    // Box background: clean light ash, minimal thin border, no rounded corner shadows
    this.doc.setFillColor(244, 244, 244); // Light Ash (#F4F4F4)
    this.doc.setDrawColor(238, 238, 238); // Cloud Gray (#EEEEEE)
    this.doc.setLineWidth(0.4);
    this.doc.roundedRect(this.marginX, this.y, this.contentWidth, boxHeight, 1, 1, 'FD');

    const paddingX = this.marginX + 6;
    let boxY = this.y + 6;

    // Line 1: Paciente e Data da Consulta
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(9);
    this.doc.setTextColor(23, 26, 32); // Carbon Dark (#171A20)
    this.doc.text("Paciente:", paddingX, boxY);
    this.doc.setFont("helvetica", "normal");
    this.doc.setTextColor(57, 60, 65); // Graphite (#393C41)
    this.doc.text(patient.name, paddingX + 16, boxY);

    this.doc.setFont("helvetica", "bold");
    this.doc.setTextColor(23, 26, 32);
    this.doc.text("Data da Consulta:", this.marginX + 110, boxY);
    this.doc.setFont("helvetica", "normal");
    this.doc.setTextColor(57, 60, 65);
    this.doc.text(dateStr, this.marginX + 140, boxY);

    boxY += 6;

    // Line 2: Gênero e Idade
    this.doc.setFont("helvetica", "bold");
    this.doc.setTextColor(23, 26, 32);
    this.doc.text("Gênero:", paddingX, boxY);
    this.doc.setFont("helvetica", "normal");
    this.doc.setTextColor(57, 60, 65);
    this.doc.text(genderStr, paddingX + 14, boxY);

    this.doc.setFont("helvetica", "bold");
    this.doc.setTextColor(23, 26, 32);
    this.doc.text("Idade:", paddingX + 50, boxY);
    this.doc.setFont("helvetica", "normal");
    this.doc.setTextColor(57, 60, 65);
    this.doc.text(`${age} (${birthDateStr})`, paddingX + 61, boxY);

    boxY += 6;

    // Line 3: Queixa Principal (multi-line)
    this.doc.setFont("helvetica", "bold");
    this.doc.setTextColor(23, 26, 32);
    this.doc.text("Queixa Principal:", paddingX, boxY);

    this.doc.setFont("helvetica", "normal");
    this.doc.setTextColor(57, 60, 65);

    const textLines = this.doc.splitTextToSize(complaint, this.contentWidth - 12 - 28);
    this.doc.text(textLines, paddingX + 28, boxY);

    this.y += boxHeight + 8;
  }

  drawKPIs(totalSymptoms: number, filledSections: number, totalSections: number, hypothesesCount: number) {
    this.ensureSpace(18);

    const colW = this.contentWidth / 3;
    const startX = this.marginX;

    // KPI dividers - minimal clean vertical lines
    for (let i = 0; i < 3; i++) {
      const x = startX + (i * colW);
      if (i > 0) {
        this.doc.setDrawColor(238, 238, 238);
        this.doc.setLineWidth(0.3);
        this.doc.line(x, this.y, x, this.y + 12);
      }

      this.doc.setFont("helvetica", "bold");
      this.doc.setFontSize(12);
      this.doc.setTextColor(23, 26, 32); // Carbon Dark

      let val = "";
      let label = "";
      if (i === 0) {
        val = `${totalSymptoms}`;
        label = "Sintomas Marcados";
      } else if (i === 1) {
        val = `${filledSections} de ${totalSections}`;
        label = "Seções Preenchidas";
      } else {
        val = `${hypothesesCount}`;
        label = "Hipóteses Identificadas";
      }

      this.doc.text(val, x + 6, this.y + 4);
      this.doc.setFont("helvetica", "normal");
      this.doc.setFontSize(7.5);
      this.doc.setTextColor(92, 94, 98); // Pewter
      this.doc.text(label, x + 6, this.y + 9);
    }

    this.y += 18;
  }

  drawHypothesis(score: SyndromeScore, rank: number) {
    // Tesla discipline: Electric Blue highlight for top rank, Slate/Pewter grey for others
    const themeColor = rank === 0 ? [62, 106, 225] : [92, 94, 98];

    const titleText = `${rank + 1}ª Hipótese: ${score.name}`;
    const relevanceText = `${score.normalizedScore.toFixed(0)}% Relevância`;
    const detailsText = `Órgão: ${score.organ}  |  Natureza: ${score.nature}  |  Pontuação: ${score.rawScore.toFixed(1)} de ${score.maxPossible.toFixed(1)} pts`;
    const descLines = this.doc.splitTextToSize(score.description || '', this.contentWidth - 6);

    let blockHeight = 8 + 6 + (descLines.length * 4.2) + 6;

    const hasRoss = !!score.treatment.ross;
    const hasAuteroche = !!score.treatment.auteroche;
    const hasMaciocia = !!score.treatment.maciocia;
    const hasTreatment = hasRoss || hasAuteroche || hasMaciocia;

    let rossLines: string[] = [];
    let auterocheLines: string[] = [];
    let maciociaLines: string[] = [];

    if (hasTreatment) {
      blockHeight += 5; // Section heading height
      if (hasRoss) {
        rossLines = this.doc.splitTextToSize(score.treatment.ross || '', this.contentWidth - 25);
        blockHeight += (rossLines.length * 4) + 1.5;
      }
      if (hasAuteroche) {
        auterocheLines = this.doc.splitTextToSize(score.treatment.auteroche || '', this.contentWidth - 32);
        blockHeight += (auterocheLines.length * 4) + 1.5;
      }
      if (hasMaciocia) {
        maciociaLines = this.doc.splitTextToSize(score.treatment.maciocia || '', this.contentWidth - 30);
        blockHeight += (maciociaLines.length * 4) + 1.5;
      }
    } else {
      blockHeight += 6;
    }

    this.ensureSpace(blockHeight);

    // Left indicator line (solid theme accent)
    this.doc.setDrawColor(themeColor[0], themeColor[1], themeColor[2]);
    this.doc.setLineWidth(0.8);
    this.doc.line(this.marginX, this.y, this.marginX, this.y + blockHeight - 6);

    const contentX = this.marginX + 4;
    this.y += 4;

    // Title and Relevance
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(9.5);
    this.doc.setTextColor(23, 26, 32);
    this.doc.text(titleText, contentX, this.y);

    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(9);
    this.doc.setTextColor(themeColor[0], themeColor[1], themeColor[2]);
    this.doc.text(relevanceText, this.marginX + this.contentWidth, this.y, { align: "right" });

    this.y += 5.5;

    // Score & Organ Details
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(8.5);
    this.doc.setTextColor(92, 94, 98); // Pewter grey
    this.doc.text(detailsText, contentX, this.y);

    this.y += 5.5;

    // Descriptions
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(8.5);
    this.doc.setTextColor(57, 60, 65); // Graphite
    this.doc.text(descLines, contentX, this.y);
    this.y += (descLines.length * 4.2) + 3;

    // Suggested Acupoints
    if (hasTreatment) {
      this.doc.setFont("helvetica", "bold");
      this.doc.setFontSize(8);
      this.doc.setTextColor(23, 26, 32);
      this.doc.text("Sugestões de Acupontos:", contentX, this.y);
      this.y += 4;

      const treatIndentX = contentX + 3;
      this.doc.setFontSize(8);

      if (hasRoss) {
        this.doc.setFont("helvetica", "bold");
        this.doc.setTextColor(92, 94, 98);
        this.doc.text("Ross:", treatIndentX, this.y);
        this.doc.setFont("helvetica", "normal");
        this.doc.text(rossLines, treatIndentX + 10, this.y);
        this.y += (rossLines.length * 4) + 1.5;
      }

      if (hasAuteroche) {
        this.doc.setFont("helvetica", "bold");
        this.doc.setTextColor(92, 94, 98);
        this.doc.text("Auteroche:", treatIndentX, this.y);
        this.doc.setFont("helvetica", "normal");
        this.doc.text(auterocheLines, treatIndentX + 17, this.y);
        this.y += (auterocheLines.length * 4) + 1.5;
      }

      if (hasMaciocia) {
        this.doc.setFont("helvetica", "bold");
        this.doc.setTextColor(92, 94, 98);
        this.doc.text("Maciocia:", treatIndentX, this.y);
        this.doc.setFont("helvetica", "normal");
        this.doc.text(maciociaLines, treatIndentX + 15, this.y);
        this.y += (maciociaLines.length * 4) + 1.5;
      }
    } else {
      this.doc.setFont("helvetica", "italic");
      this.doc.setFontSize(8);
      this.doc.setTextColor(142, 142, 142); // Silver Fog
      this.doc.text("Nenhuma sugestão de tratamento cadastrada.", contentX, this.y);
      this.y += 5;
    }

    this.y += 2; // Bottom margin for the block
  }

  drawSymptomsSection(checkedIds: Set<string>, gender: 'male' | 'female') {
    const filled = SECTIONS
      .filter(s => s.gender === 'all' || s.gender === gender)
      .map(section => {
        const visible = section.symptoms.filter(s => s.gender === 'all' || s.gender === gender);
        const checked = visible.filter(s => checkedIds.has(s.id));
        return { section, checked };
      })
      .filter(r => r.checked.length > 0);

    if (filled.length === 0) return;

    this.writeSectionHeader("2. Sintomas Marcados por Seção");

    filled.forEach(({ section, checked }) => {
      const symptomsString = checked.map(s => s.label).join(", ");

      const titleHeight = 5;
      const descLines = this.doc.splitTextToSize(symptomsString, this.contentWidth - 6);
      const descHeight = descLines.length * 4;
      const totalHeight = titleHeight + descHeight + 4;

      this.ensureSpace(totalHeight);

      // Section label
      this.doc.setFont("helvetica", "bold");
      this.doc.setFontSize(8.5);
      this.doc.setTextColor(57, 60, 65); // Graphite
      this.doc.text(section.title, this.marginX, this.y);
      this.y += 4;

      // Symptom list
      this.doc.setFont("helvetica", "normal");
      this.doc.setFontSize(8);
      this.doc.setTextColor(92, 94, 98); // Pewter grey
      this.doc.text(descLines, this.marginX + 3, this.y);
      this.y += descHeight + 3.5;
    });
  }

  drawAIOpinionSection(aiOpinion: string) {
    this.writeSectionHeader("3. Anexo: Opinião Clínica da IA (powered by Google Gemini)");

    const lines = aiOpinion.split('\n');
    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) {
        this.y += 3; // Empty paragraph space
        return;
      }

      // 1. Headers: #, ##, ###
      if (trimmed.startsWith('#') || trimmed.startsWith('##') || trimmed.startsWith('###')) {
        const headerText = trimmed.replace(/^#+\s+/, '');
        
        this.ensureSpace(10);
        this.doc.setFont("helvetica", "bold");
        this.doc.setFontSize(8.5);
        this.doc.setTextColor(23, 26, 32); // Carbon Dark
        this.doc.text(headerText, this.marginX, this.y);
        this.y += 5.5;
        return;
      }

      // 2. List items
      const isBullet = trimmed.startsWith('- ') || trimmed.startsWith('* ');
      const matchNumbered = trimmed.match(/^(\d+)\.\s(.*)/);

      let textToPrint = trimmed;
      let indentX = this.marginX;

      if (isBullet) {
        textToPrint = `• ${trimmed.substring(2)}`;
        indentX = this.marginX + 4;
      } else if (matchNumbered) {
        textToPrint = trimmed;
        indentX = this.marginX + 4;
      }

      // Clean inline bold markers (**bold** -> bold) for PDF printing
      const cleanText = textToPrint.replace(/\*\*/g, '');

      // Wrap text
      const maxTextWidth = this.contentWidth - (indentX - this.marginX);
      const wrappedLines = this.doc.splitTextToSize(cleanText, maxTextWidth);
      const blockHeight = wrappedLines.length * 4.2;

      this.ensureSpace(blockHeight + 2);
      this.doc.setFont("helvetica", "normal");
      this.doc.setFontSize(8);
      this.doc.setTextColor(57, 60, 65); // Graphite
      
      this.doc.text(wrappedLines, indentX, this.y);
      this.y += blockHeight + 1.5;
    });
  }
}

export function exportReportToPDF(
  patient: PatientInfo,
  scores: SyndromeScore[],
  checkedIds: Set<string>,
  aiOpinion?: string,
  attachAi?: boolean
) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const width = doc.internal.pageSize.getWidth();
  const dateStr = new Date().toLocaleDateString('pt-BR');

  const writer = new PDFWriter(doc, 22);

  // --- FIRST PAGE HEADER ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(62, 106, 225); // Electric Blue (#3E6AE1)
  doc.text("d I A g n o  3 . 0", 15, 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(92, 94, 98); // Pewter
  doc.text("Relatório de Avaliação Clínica em MTC", 15, 24.5);

  doc.text(dateStr, width - 15, 24.5, { align: "right" });

  doc.setDrawColor(238, 238, 238); // Cloud Gray
  doc.setLineWidth(0.4);
  doc.line(15, 27, width - 15, 27);

  writer.y = 33;

  // --- PATIENT DETAILS ---
  writer.drawPatientDetails(patient, dateStr);

  // --- SUMMARY / KPIs ---
  const gender = patient.gender || 'female';
  const totalSections = SECTIONS.filter(s => s.gender === 'all' || s.gender === gender).length;
  const filledSections = SECTIONS.filter(s => {
    if (s.gender !== 'all' && s.gender !== gender) return false;
    return s.symptoms.some(sym => checkedIds.has(sym.id));
  }).length;

  writer.drawKPIs(checkedIds.size, filledSections, totalSections, scores.length);

  // --- SECTION 1: HYPOTHESES ---
  writer.writeSectionHeader("1. Principais Hipóteses Diagnósticas (Top 5)");

  const top5 = scores.slice(0, 5);
  if (top5.length === 0) {
    writer.ensureSpace(12);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(142, 142, 142);
    doc.text("Nenhuma hipótese diagnóstica identificada.", 15, writer.y);
    writer.y += 10;
  } else {
    top5.forEach((score, index) => {
      writer.drawHypothesis(score, index);
    });
  }

  // --- SECTION 2: CHECKED SYMPTOMS ---
  writer.drawSymptomsSection(checkedIds, gender);

  // --- SECTION 3: AI CLINICAL OPINION (IF ATTACHED) ---
  if (attachAi && aiOpinion) {
    writer.drawAIOpinionSection(aiOpinion);
  }

  // --- SECOND PASS: PAGE HEADER AND FOOTER RUNNERS ---
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Running header (from page 2 onwards)
    if (i > 1) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(92, 94, 98);
      doc.text(`Relatório Clínico MTC · Paciente: ${patient.name}`, 15, 12);
      doc.text(dateStr, width - 15, 12, { align: "right" });

      doc.setDrawColor(238, 238, 238);
      doc.setLineWidth(0.2);
      doc.line(15, 14, width - 15, 14);
    }

    // Running footer line
    doc.setDrawColor(238, 238, 238);
    doc.setLineWidth(0.2);
    doc.line(15, 282, width - 15, 282);

    // Running footer text
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(92, 94, 98);
    doc.text("Aviso Importante: Este relatório é de caráter informativo para fins de estudo e apoio clínico. Não substitui o diagnóstico médico.", 15, 287);
    doc.text(`Página ${i} de ${totalPages}`, width - 15, 287, { align: "right" });
  }

  const patientNameClean = patient.name.replace(/\s+/g, '_') ?? 'paciente';
  const dateFile = new Date().toISOString().slice(0, 10);
  doc.save(`diagno3_${patientNameClean}_${dateFile}.pdf`);
}
