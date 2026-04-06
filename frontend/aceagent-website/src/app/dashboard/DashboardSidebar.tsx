'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useClerk } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  PlayCircle,
  Calendar,
  BarChart2,
  BookOpen,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Zap,
  FileBarChart,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface NavItemDef {
  Icon:   LucideIcon;
  label:  string;
  href:   string;
  badge?: string | null;
}

const MENU: NavItemDef[] = [
  { Icon: LayoutDashboard, label: 'Dashboard',           href: '/dashboard',                   badge: null  },
  { Icon: PlayCircle,      label: 'Practice Sessions',   href: '/dashboard/practice-sessions', badge: '12+' },
  { Icon: Calendar,        label: 'Calendar',            href: '/dashboard/calendar',           badge: null  },
  { Icon: BarChart2,       label: 'Performance Insights', href: '/dashboard/performance',       badge: null  },
  { Icon: FileBarChart,    label: 'Session Analysis',    href: '/dashboard/analysis',           badge: 'New' },
  { Icon: BookOpen,        label: 'Interview Library',   href: '/dashboard/library',            badge: null  },
];

const GENERAL: NavItemDef[] = [
  { Icon: Settings,   label: 'Settings', href: '/dashboard/settings' },
  { Icon: HelpCircle, label: 'Help',     href: '/dashboard/help' },
  { Icon: LogOut,     label: 'Logout',   href: '/' },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle:  () => void;
  dark:      boolean;
  isMobile?: boolean;
}

export default function DashboardSidebar({
  collapsed,
  onToggle,
  dark,
  isMobile,
}: SidebarProps) {
  const pathname = usePathname();
  const { signOut } = useClerk();

  const bg      = dark ? '#0c1032' : '#fff';
  const border  = dark ? 'rgba(124,58,237,0.12)' : 'rgba(0,0,0,0.07)';
  const textSub = dark ? '#475569' : '#9ca3af';
  const textNav = dark ? '#94a3b8' : '#6b7280';
  const accent  = '#8b5cf6';

  function NavItem({ Icon, label, href, badge }: NavItemDef) {
    const isActive = href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href);
    const isLogout = label === 'Logout';

    const content = (
      <motion.div
        whileHover={{ x: collapsed ? 0 : 3 }}
        onClick={async () => {
          if (isLogout) {
            await signOut({ redirectUrl: '/' });
          } else if (isMobile) {
            onToggle();
          }
        }}
        title={collapsed ? label : undefined}
        style={{
          display:        'flex',
          alignItems:     'center',
          gap:            12,
          padding:        collapsed ? '11px 0' : '11px 14px',
          borderRadius:   12,
          cursor:         'pointer',
          background:     isActive
            ? dark ? 'rgba(139,92,246,0.15)' : 'rgba(139,92,246,0.1)'
            : 'transparent',
          borderLeft:     isActive
            ? `3px solid ${accent}`
            : '3px solid transparent',
          marginBottom:   2,
          justifyContent: collapsed ? 'center' : 'flex-start',
          transition:     'all 0.2s',
        }}
        suppressHydrationWarning
      >
        <Icon
          size={18}
          style={{ color: isActive ? accent : textNav, flexShrink: 0 }}
        />

        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{   opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                color:      isActive
                  ? dark ? '#f1f5f9' : '#0f172a'
                  : textNav,
                fontSize:   13.5,
                fontWeight: isActive ? 700 : 500,
                whiteSpace: 'nowrap',
                overflow:   'hidden',
                flex:       1,
              }}
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>

        {!collapsed && badge && (
          <span style={{ background: accent, color: '#fff', fontSize: 10, fontWeight: 700, borderRadius: 99, padding: '2px 7px', flexShrink: 0 }}>
            {badge}
          </span>
        )}
      </motion.div>
    );

    if (isLogout) return content;

    return (
      <Link href={href} style={{ textDecoration: 'none' }}>
        {content}
      </Link>
    );
  }

  const sidebarWidth = collapsed ? (isMobile ? 0 : 68) : 220;

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobile && !collapsed && (
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           onClick={onToggle}
           style={{
             position: 'fixed',
             inset: 0,
             background: 'rgba(0,0,0,0.4)',
             backdropFilter: 'blur(4px)',
             zIndex: 90
           }}
        />
      )}

      <motion.div
        animate={{ 
          width: sidebarWidth,
          x: isMobile && collapsed ? -sidebarWidth : 0
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{
          height:        '100vh',
          background:    bg,
          borderRight:   `1px solid ${border}`,
          display:       'flex',
          flexDirection: 'column',
          overflow:      'hidden',
          flexShrink:    0,
          position:      isMobile ? 'fixed' : 'relative',
          left:          0,
          top:           0,
          zIndex:        100,
          transition:    'background 0.3s',
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding:        collapsed ? '20px 0' : '20px 18px',
            borderBottom:   `1px solid ${border}`,
            display:        'flex',
            alignItems:     'center',
            gap:            10,
            justifyContent: collapsed ? 'center' : 'flex-start',
            minHeight:      70,
            flexShrink:     0,
          }}
        >
          <div
            style={{
              width:         32,
              height:        32,
              borderRadius:  10,
              background:    'linear-gradient(135deg,#8b5cf6,#7c3aed)',
              display:       'flex',
              alignItems:    'center',
              justifyContent:'center',
              flexShrink:    0,
              boxShadow:     '0 4px 12px rgba(139,92,246,0.4)',
            }}
          >
            <Zap size={16} style={{ color: '#fff' }} />
          </div>

          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{   opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontWeight: 800,
                  fontSize:   15,
                  color:      dark ? '#f1f5f9' : '#0f172a',
                  whiteSpace: 'nowrap',
                }}
              >
                AceAgent
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Nav */}
        <div
          style={{
            flex:      1,
            padding:   collapsed ? '16px 8px' : '16px 12px',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{   opacity: 0 }}
                style={{
                  color:         textSub,
                  fontSize:      10,
                  fontWeight:    700,
                  letterSpacing: 1.5,
                  marginBottom:  8,
                  paddingLeft:   14,
                }}
              >
                MENU
              </motion.div>
            )}
          </AnimatePresence>

          {MENU.map((item) => (
            <NavItem key={item.label} {...item} />
          ))}

          <div style={{ height: 20 }} />

          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{   opacity: 0 }}
                style={{
                  color:         textSub,
                  fontSize:      10,
                  fontWeight:    700,
                  letterSpacing: 1.5,
                  marginBottom:  8,
                  paddingLeft:   14,
                }}
              >
                GENERAL
              </motion.div>
            )}
          </AnimatePresence>

          {GENERAL.map((item) => (
            <NavItem key={item.label} {...item} />
          ))}
        </div>

        {/* Download card */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{   opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              style={{
                margin:       '0 12px 16px',
                borderRadius: 16,
                padding:      '16px 14px',
                background:   'linear-gradient(135deg,#4c1d95,#7c3aed)',
                boxShadow:    '0 4px 20px rgba(139,92,246,0.3)',
                flexShrink:   0,
              }}
            >
              <div
                style={{
                  color:        '#fff',
                  fontSize:     13,
                  fontWeight:   700,
                  marginBottom: 4,
                }}
              >
                Try Mobile App
              </div>
              <div
                style={{
                  color:        'rgba(255,255,255,0.7)',
                  fontSize:     11,
                  marginBottom: 12,
                }}
              >
                Practice on the go, anytime.
              </div>
              <button
                suppressHydrationWarning
                style={{
                  width:        '100%',
                  padding:      '8px 0',
                  background:   '#fff',
                  color:        '#7c3aed',
                  border:       'none',
                  borderRadius: 99,
                  fontSize:     12,
                  fontWeight:   700,
                  cursor:       'pointer',
                  fontFamily:   'inherit',
                }}
              >
                Download
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapse button */}
        {!isMobile && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggle}
            suppressHydrationWarning
            style={{
              position:       'absolute',
              top:            22,
              right:          -14,
              width:          28,
              height:         28,
              borderRadius:   '50%',
              background:     dark ? '#151a3d' : '#fff',
              border:         `1.5px solid ${border}`,
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              cursor:         'pointer',
              zIndex:         20,
              boxShadow:      '0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            {collapsed
              ? <ChevronRight size={14} style={{ color: dark ? '#94a3b8' : '#6b7280' }} />
              : <ChevronLeft  size={14} style={{ color: dark ? '#94a3b8' : '#6b7280' }} />
            }
          </motion.button>
        )}
      </motion.div>
    </>
  );
}