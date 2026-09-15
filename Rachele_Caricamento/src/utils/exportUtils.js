import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Esporta la lista clienti in formato Microsoft Excel (.xlsx)
 */
export function exportClientsToExcel(clients, filename = 'Rubrica_Clienti_Zero_Carta.xlsx') {
  if (!clients || clients.length === 0) {
    alert('Nessun cliente da esportare.');
    return;
  }

  const exportData = clients.map((c, index) => ({
    'N°': index + 1,
    'Cognome': c.cognome || '',
    'Nome': c.nome || '',
    'Cellulare / WhatsApp': c.cellulare || '',
    'Email': c.email || '',
    'Data Registrazione': c.createdAt ? new Date(c.createdAt).toLocaleDateString('it-IT', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    }) : 'N/D',
    'Ultimo Servizio / Note': c.lastService || 'Nessuna pratica specifica'
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);

  // Impostazione larghezza colonne ottimale
  worksheet['!cols'] = [
    { wch: 6 },
    { wch: 20 },
    { wch: 20 },
    { wch: 22 },
    { wch: 30 },
    { wch: 22 },
    { wch: 35 }
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Rubrica Clienti');

  XLSX.writeFile(workbook, filename);
}

/**
 * Esporta la lista clienti in un documento PDF professionale
 */
export function exportClientsToPDF(clients, filename = 'Rubrica_Clienti_Zero_Carta.pdf') {
  if (!clients || clients.length === 0) {
    alert('Nessun cliente da esportare.');
    return;
  }

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Intestazione
  doc.setFillColor(14, 116, 144); // Cyan/Teal elegante
  doc.rect(0, 0, 210, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('ZERO CARTA', 14, 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text('di Bossa Rachele - Patronato & CAF Online', 14, 21);

  const todayStr = new Date().toLocaleDateString('it-IT', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
  doc.setFontSize(9);
  doc.text(`Generato il: ${todayStr}`, 145, 14);
  doc.text(`Totale iscritti: ${clients.length}`, 145, 21);

  // Titolo della tabella
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('RUBRICA REGISTRO CLIENTI E CONTATTI', 14, 38);

  const tableRows = clients.map((c, index) => [
    index + 1,
    `${c.cognome || ''} ${c.nome || ''}`.trim(),
    c.cellulare || '-',
    c.email || '-',
    c.createdAt ? new Date(c.createdAt).toLocaleDateString('it-IT') : '-',
    c.lastService || 'Registrazione'
  ]);

  autoTable(doc, {
    startY: 44,
    head: [['#', 'Nominativo', 'Cellulare / Tel', 'Email', 'Data Reg.', 'Pratica']],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [14, 116, 144],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
      halign: 'left'
    },
    styles: {
      fontSize: 8.5,
      cellPadding: 3,
      textColor: [51, 65, 85],
      overflow: 'linebreak'
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 42 },
      2: { cellWidth: 32 },
      3: { cellWidth: 48 },
      4: { cellWidth: 22, halign: 'center' },
      5: { cellWidth: 36 }
    },
    didDrawPage: (data) => {
      // Piè di pagina con numerazione
      const str = `Pagina ${doc.internal.getNumberOfPages()}`;
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(
        str,
        data.settings.margin.left,
        doc.internal.pageSize.height - 10
      );
      doc.text(
        'Zero Carta di Bossa Rachele - Tel / WhatsApp: 338 2174844 - rachelebossazerocarta@gmail.it',
        70,
        doc.internal.pageSize.height - 10
      );
    }
  });

  doc.save(filename);
}
