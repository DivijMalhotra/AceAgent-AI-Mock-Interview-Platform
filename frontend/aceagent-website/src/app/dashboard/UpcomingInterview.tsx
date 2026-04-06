import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Video, Clock, Loader2 } from 'lucide-react';
import { startInterview } from '@/lib/api';

interface Props { dark: boolean; }

export default function UpcomingInterview({ dark }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const bg     = dark ? '#0c1032' : '#fff';
  const border = dark ? 'rgba(124,58,237,0.12)' : 'rgba(0,0,0,0.07)';
  const text   = dark ? '#f1f5f9' : '#0f172a';
  const sub    = dark ? '#64748b' : '#9ca3af';

  const handleJoin = async () => {
    setLoading(true);
    try {
      const response = await startInterview('System Design', 'hard');
      if (response.data?.session_id) {
        router.push(`/interview/${response.data.session_id}`);
      }
    } catch (err) {
      console.error('Failed to join:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      style={{
        borderRadius:  18,
        padding:       '20px 22px',
        background:    bg,
        border:        `1px solid ${border}`,
        boxShadow:     dark
          ? '0 2px 12px rgba(0,0,0,0.2)'
          : '0 2px 12px rgba(0,0,0,0.06)',
        display:       'flex',
        flexDirection: 'column',
        transition:    'background 0.3s',
      }}
    >
      <div
        style={{
          color:        text,
          fontSize:     15,
          fontWeight:   700,
          marginBottom: 20,
        }}
      >
        Upcoming Mock Interview
      </div>

      <div
        style={{
          background:   dark
            ? 'rgba(139,92,246,0.08)'
            : 'rgba(139,92,246,0.06)',
          border:       '1px solid rgba(139,92,246,0.2)',
          borderRadius: 14,
          padding:      16,
          marginBottom: 18,
        }}
      >
        <div
          style={{
            width:         36,
            height:        36,
            borderRadius:  '50%',
            background:    'linear-gradient(135deg,#8b5cf6,#7c3aed)',
            display:       'flex',
            alignItems:    'center',
            justifyContent:'center',
            marginBottom:  12,
            boxShadow:     '0 4px 12px rgba(139,92,246,0.35)',
          }}
        >
          <Video size={16} style={{ color: '#fff' }} />
        </div>

        <div
          style={{
            color:        text,
            fontSize:     15,
            fontWeight:   800,
            marginBottom: 6,
            lineHeight:   1.3,
          }}
        >
          System Design with AI-Bot Zeta
        </div>

        <div
          style={{
            display:    'flex',
            alignItems: 'center',
            gap:        6,
            color:      sub,
            fontSize:   12,
          }}
        >
          <Clock size={12} />
          Tomorrow, 10:00 am
        </div>
      </div>

      <motion.button
        whileHover={!loading ? { scale: 1.03, filter: 'brightness(1.08)' } : {}}
        whileTap={!loading ? { scale: 0.97 } : {}}
        onClick={handleJoin}
        disabled={loading}
        suppressHydrationWarning
        style={{
          width:          '100%',
          padding:        '13px 0',
          borderRadius:   12,
          border:         'none',
          background:     'linear-gradient(135deg,#8b5cf6,#7c3aed)',
          color:          '#fff',
          fontSize:       14,
          fontWeight:     700,
          cursor:         loading ? 'not-allowed' : 'pointer',
          fontFamily:     'inherit',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          gap:            8,
          boxShadow:      '0 4px 16px rgba(139,92,246,0.4)',
          opacity:        loading ? 0.8 : 1,
        }}
      >
        {loading ? (
          <Loader2 size={15} className="animate-spin" />
        ) : (
          <>
            <Video size={15} />
            Join Room
          </>
        )}
      </motion.button>
    </motion.div>
  );
}