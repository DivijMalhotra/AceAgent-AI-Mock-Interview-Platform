'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Loader2 } from 'lucide-react';

interface Props {
  reportRef: React.RefObject<HTMLDivElement | null>;
  sessionId: string;
  dark: boolean;
}

export default function DownloadReport({ reportRef, sessionId, dark }: Props) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!reportRef.current) return;
    setLoading(true);

    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: dark ? '#050816' : '#f0f4f0',
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const scaledWidth = imgWidth * ratio;
      const scaledHeight = imgHeight * ratio;

      // If content is taller than one page, we need multi-page
      const totalPages = Math.ceil(scaledHeight / pdfHeight);

      for (let page = 0; page < totalPages; page++) {
        if (page > 0) pdf.addPage();
        pdf.addImage(
          imgData,
          'PNG',
          0,
          -(page * pdfHeight),
          scaledWidth,
          scaledHeight
        );
      }

      pdf.save(`AceAgent_Analysis_${sessionId.substring(0, 8)}.pdf`);
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.button
      whileHover={!loading ? { scale: 1.02 } : {}}
      whileTap={!loading ? { scale: 0.98 } : {}}
      onClick={handleDownload}
      disabled={loading}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        width: '100%',
        padding: '14px 0',
        borderRadius: 14,
        border: '1px solid rgba(139,92,246,0.3)',
        background: 'linear-gradient(135deg, #7c3aed, #6d28d9, #5b21b6)',
        boxShadow: '0 6px 24px rgba(124,58,237,0.35), inset 0 1px 0 rgba(255,255,255,0.1)',
        color: '#fff',
        fontSize: 14,
        fontWeight: 700,
        cursor: loading ? 'not-allowed' : 'pointer',
        fontFamily: 'inherit',
        opacity: loading ? 0.8 : 1,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {loading ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          <span>Generating PDF...</span>
        </>
      ) : (
        <>
          <Download size={16} />
          <span>Download Report (PDF)</span>
        </>
      )}
    </motion.button>
  );
}
