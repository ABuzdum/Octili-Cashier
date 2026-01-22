/**
 * ============================================================================
 * MENU PAGE - OPERATIONAL HUB FOR CASHIERS & MANAGERS
 * ============================================================================
 *
 * Purpose: Central hub for all cashier operational needs
 * Comprehensive features for daily operations and support
 *
 * Features:
 * - SUPPORT: Big button to create support tickets
 * - QUICK CALLS: Hostess, Security, Manager
 * - TERMINAL: Display control, Printer status, Diagnostics
 * - SHIFT: Clock in/out, Breaks, My Sales
 * - CASH: Collection, Replenishment, Balance Top-up
 * - REPORTS & HISTORY
 * - SETTINGS
 *
 * @author Octili Development Team
 * @version 3.0.0
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  FileText,
  Wallet,
  PiggyBank,
  History,
  LogOut,
  User,
  Phone,
  ChevronRight,
  X,
  Check,
  Sparkles,
  Monitor,
  Headphones,
  Shield,
  UserCog,
  Tv,
  Printer,
  Wrench,
  Clock,
  Coffee,
  DollarSign,
  CreditCard,
  Settings,
  Globe,
  Volume2,
  AlertCircle,
  Send,
  CheckCircle2,
  Wifi,
  WifiOff,
  Gamepad2,
  CircleDollarSign,
  MessageSquare,
  Palette,
  Sun,
  Moon,
  Layers,
  Grid3X3,
  Sparkle,
  Box,
  Minus,
  Bold,
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useGameStore } from '@/stores/gameStore'
import { PaymentMethodSelector } from '@/components/shared/PaymentMethodSelector'
import type { PaymentMethod } from '@/types/game.types'
import {
  useThemeStore,
  COLOR_THEMES,
  VISUAL_STYLES,
  type ColorTheme,
  type VisualStyle,
} from '@/stores/themeStore'
import {
  useTerminalStore,
  OFFLINE_REASONS,
  type OfflineReason,
} from '@/stores/terminalStore'
import { openSecondDisplay } from '@/hooks/useBroadcastSync'
import { operatorInfo } from '@/data/games-mock-data'
import { BottomNavigation } from '@/components/layout/BottomNavigation'
import { PauseCircle } from 'lucide-react'

// Modal types for different operations
type ModalType =
  | 'none'
  | 'support'
  | 'hostess-request'
  | 'call-security'
  | 'call-manager'
  | 'display-control'
  | 'printer-status'
  | 'diagnostics'
  | 'shift-info'
  | 'collection'
  | 'replenishment'
  | 'topup-request'
  | 'history'
  | 'settings'
  | 'theme'
  | 'not-working'

// Support ticket categories
const SUPPORT_CATEGORIES = [
  { id: 'game', label: 'Game Not Working', icon: Gamepad2, color: '#667eea' },
  { id: 'printer', label: 'Printer Issue', icon: Printer, color: '#f59e0b' },
  { id: 'network', label: 'Network Problem', icon: WifiOff, color: '#ef4444' },
  { id: 'payment', label: 'Payment Issue', icon: CreditCard, color: '#24BD68' },
  { id: 'customer', label: 'Customer Complaint', icon: MessageSquare, color: '#8b5cf6' },
  { id: 'other', label: 'Other Issue', icon: AlertCircle, color: '#64748b' },
]

// Mock shift data
const SHIFT_DATA = {
  clockedIn: true,
  startTime: '08:00',
  currentTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
  hoursWorked: '4h 32m',
  onBreak: false,
  salesToday: 1250.00,
  ticketsSold: 47,
  commission: 37.50,
}

// Mock printer status
const PRINTER_STATUS = {
  connected: true,
  paperLevel: 65,
  lastPrint: '2 min ago',
  model: 'Thermal 80mm',
}

// Mock diagnostics
const DIAGNOSTICS = [
  { name: 'Network', status: 'ok', latency: '24ms' },
  { name: 'API Server', status: 'ok', latency: '156ms' },
  { name: 'Payment Gateway', status: 'ok', latency: '89ms' },
  { name: 'Game Server', status: 'ok', latency: '45ms' },
  { name: 'Print Server', status: 'warning', latency: '320ms' },
]

export function MenuPage() {
  const navigate = useNavigate()
  const { logout } = useAuthStore()
  const {
    pocketBalances,
    getTotalBalance,
    collectFromPocket,
    replenishPocket,
    ticketHistory,
  } = useGameStore()
  const balance = getTotalBalance()
  const {
    colorTheme,
    visualStyle,
    isDarkMode,
    setColorTheme,
    setVisualStyle,
    toggleDarkMode,
  } = useThemeStore()
  const { goOffline } = useTerminalStore()

  const [activeModal, setActiveModal] = useState<ModalType>('none')
  const [selectedOfflineReason, setSelectedOfflineReason] = useState<OfflineReason | null>(null)
  const [offlineNote, setOfflineNote] = useState('')
  const [amount, setAmount] = useState('')
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [supportCategory, setSupportCategory] = useState<string | null>(null)
  const [supportDescription, setSupportDescription] = useState('')
  const [supportPriority, setSupportPriority] = useState<'normal' | 'urgent'>('normal')
  const [ticketSubmitted, setTicketSubmitted] = useState(false)
  const [callConfirmed, setCallConfirmed] = useState(false)

  // Collection pocket selection state (null = 'all')
  const [selectedCollectionPocket, setSelectedCollectionPocket] = useState<PaymentMethod | 'all'>('all')

  // Hostess request form state
  const [hostessDate, setHostessDate] = useState('')
  const [hostessTime, setHostessTime] = useState('')
  const [hostessReason, setHostessReason] = useState('')
  const [hostessRequestSubmitted, setHostessRequestSubmitted] = useState(false)

  // Handle logout
  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  /**
   * Calculate max amount that can be collected from selected pocket
   */
  const getMaxCollectionAmount = (): number => {
    if (selectedCollectionPocket === 'all') {
      return balance
    }
    return pocketBalances[selectedCollectionPocket]
  }

  /**
   * Handle cash collection from selected pocket
   */
  const handleCashCollection = () => {
    const numAmount = parseFloat(amount)
    const maxAmount = getMaxCollectionAmount()
    if (numAmount > 0 && numAmount <= maxAmount) {
      collectFromPocket(selectedCollectionPocket, numAmount)
      setAmount('')
      setActiveModal('none')
      setSelectedCollectionPocket('all') // Reset to 'all' for next time
    }
  }

  /**
   * Handle cash replenishment to specific pocket (default: cash)
   */
  const handleCashReplenishment = () => {
    const numAmount = parseFloat(amount)
    if (numAmount > 0) {
      // Always replenish to cash pocket by default
      replenishPocket('cash', numAmount)
      setAmount('')
      setActiveModal('none')
    }
  }

  /**
   * Fill all money from selected pocket for collection
   */
  const handleAllMoney = () => {
    const maxAmount = getMaxCollectionAmount()
    setAmount(maxAmount.toFixed(2))
  }

  // Submit support ticket
  const handleSubmitTicket = () => {
    if (supportCategory && supportDescription) {
      setTicketSubmitted(true)
      setTimeout(() => {
        setTicketSubmitted(false)
        setSupportCategory(null)
        setSupportDescription('')
        setSupportPriority('normal')
        setActiveModal('none')
      }, 2000)
    }
  }

  // Handle call confirmation
  const handleCallConfirm = () => {
    setCallConfirmed(true)
    setTimeout(() => {
      setCallConfirmed(false)
      setActiveModal('none')
    }, 2000)
  }

  // Number pad button component
  const NumButton = ({ value, onClick, variant = 'default' }: {
    value: string;
    onClick: () => void;
    variant?: 'default' | 'confirm' | 'delete'
  }) => {
    const [isPressed, setIsPressed] = useState(false)
    const backgrounds = {
      default: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      confirm: 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)',
      delete: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    }
    return (
      <button
        onClick={onClick}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        style={{
          padding: '16px',
          fontSize: '20px',
          fontWeight: 700,
          background: backgrounds[variant],
          color: variant === 'default' ? '#334155' : 'white',
          border: 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          boxShadow: variant === 'default' ? '0 4px 12px rgba(0,0,0,0.08)' : '0 4px 12px rgba(0,0,0,0.2)',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isPressed ? 'scale(0.95)' : 'scale(1)',
        }}
      >
        {value}
      </button>
    )
  }

  // Menu item component
  const MenuItem = ({ icon: Icon, label, gradient, onClick, badge }: {
    icon: typeof FileText;
    label: string;
    gradient: string;
    onClick: () => void;
    badge?: string;
  }) => {
    const isHovered = hoveredItem === label
    return (
      <button
        onClick={onClick}
        onMouseEnter={() => setHoveredItem(label)}
        onMouseLeave={() => setHoveredItem(null)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          padding: '14px 16px',
          background: 'white',
          border: 'none',
          borderRadius: '14px',
          cursor: 'pointer',
          textAlign: 'left',
          boxShadow: isHovered
            ? '0 8px 24px rgba(0,0,0,0.1)'
            : '0 2px 8px rgba(0,0,0,0.04)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        }}
      >
        <div style={{
          width: '42px',
          height: '42px',
          background: gradient,
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}>
          <Icon size={20} color="white" />
        </div>
        <span style={{
          flex: 1,
          fontSize: '15px',
          fontWeight: 600,
          color: '#1e293b',
        }}>
          {label}
        </span>
        {badge && (
          <span style={{
            padding: '4px 10px',
            background: gradient,
            borderRadius: '8px',
            fontSize: '11px',
            fontWeight: 700,
            color: 'white',
          }}>
            {badge}
          </span>
        )}
        <ChevronRight size={18} color="#94a3b8" />
      </button>
    )
  }

  // Section header component
  const SectionHeader = ({ title }: { title: string }) => (
    <p style={{
      fontSize: '11px',
      fontWeight: 700,
      color: '#94a3b8',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      marginBottom: '8px',
      marginTop: '16px',
      paddingLeft: '4px',
    }}>
      {title}
    </p>
  )

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '50%',
          top: '-80px',
          right: '-60px',
        }} />

        <button
          onClick={() => navigate('/games')}
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            color: 'white',
            zIndex: 1,
          }}
        >
          <ArrowLeft size={20} />
        </button>

        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1,
        }}>
          <h1 style={{
            color: 'white',
            fontSize: '18px',
            fontWeight: 700,
          }}>
            Operator Menu
          </h1>
        </div>

        {/* Shift Status Badge */}
        <div style={{
          background: SHIFT_DATA.clockedIn ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
          padding: '6px 12px',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          zIndex: 1,
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            background: SHIFT_DATA.clockedIn ? '#24BD68' : '#ef4444',
            borderRadius: '50%',
          }} />
          <span style={{
            fontSize: '12px',
            fontWeight: 600,
            color: SHIFT_DATA.clockedIn ? '#24BD68' : '#ef4444',
          }}>
            {SHIFT_DATA.clockedIn ? 'On Duty' : 'Off Duty'}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        padding: '16px 20px',
        paddingBottom: '100px',
        overflow: 'auto',
      }}>
        {/* Top Action Buttons */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginBottom: '20px',
        }}>
          {/* Big Support Button */}
          <button
            onClick={() => setActiveModal('support')}
            style={{
              width: '100%',
              padding: '20px',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 8px 32px rgba(239, 68, 68, 0.4)',
            }}
          >
            <Headphones size={32} color="white" />
            <div style={{ textAlign: 'center' }}>
              <p style={{
                color: 'white',
                fontSize: '16px',
                fontWeight: 700,
              }}>
                Need Help?
              </p>
              <p style={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: '11px',
              }}>
                Create support ticket
              </p>
            </div>
          </button>

          {/* Not Working Button */}
          <button
            onClick={() => setActiveModal('not-working')}
            style={{
              width: '100%',
              padding: '20px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 8px 32px rgba(245, 158, 11, 0.4)',
            }}
          >
            <PauseCircle size={32} color="white" />
            <div style={{ textAlign: 'center' }}>
              <p style={{
                color: 'white',
                fontSize: '16px',
                fontWeight: 700,
              }}>
                Not Working
              </p>
              <p style={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: '11px',
              }}>
                Pause terminal
              </p>
            </div>
          </button>
        </div>

        {/* Operator Info Card */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '16px',
          marginBottom: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <User size={24} color="white" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '13px', color: '#64748b' }}>Operator</p>
              <p style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>
                {operatorInfo.id}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '13px', color: '#64748b' }}>Balance</p>
              <p style={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#24BD68',
              }}>
                {balance.toFixed(2)} BRL
              </p>
            </div>
          </div>
        </div>

        {/* Quick Calls Section */}
        <SectionHeader title="Quick Calls" />
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px',
          marginBottom: '8px',
        }}>
          <button
            onClick={() => setActiveModal('hostess-request')}
            style={{
              padding: '16px 12px',
              minHeight: '88px',
              background: 'white',
              border: 'none',
              borderRadius: '14px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <User size={22} color="white" />
            </div>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b' }}>Hostess</span>
          </button>

          <button
            onClick={() => setActiveModal('call-security')}
            style={{
              padding: '16px 12px',
              minHeight: '88px',
              background: 'white',
              border: 'none',
              borderRadius: '14px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Shield size={22} color="white" />
            </div>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b' }}>Security</span>
          </button>

          <button
            onClick={() => setActiveModal('call-manager')}
            style={{
              padding: '16px 12px',
              minHeight: '88px',
              background: 'white',
              border: 'none',
              borderRadius: '14px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <UserCog size={22} color="white" />
            </div>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b' }}>Manager</span>
          </button>
        </div>

        {/* Terminal Section */}
        <SectionHeader title="Terminal" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <MenuItem
            icon={Tv}
            label="TV Box Control"
            gradient="linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)"
            onClick={() => navigate('/tvbox-control')}
          />
          <MenuItem
            icon={Printer}
            label="Printer Status"
            gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
            onClick={() => setActiveModal('printer-status')}
            badge={PRINTER_STATUS.paperLevel < 30 ? 'Low Paper' : undefined}
          />
          <MenuItem
            icon={Wrench}
            label="Run Diagnostics"
            gradient="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
            onClick={() => setActiveModal('diagnostics')}
          />
        </div>

        {/* My Shift Section */}
        <SectionHeader title="My Shift" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <MenuItem
            icon={Clock}
            label="Shift Info"
            gradient="linear-gradient(135deg, #24BD68 0%, #00A77E 100%)"
            onClick={() => setActiveModal('shift-info')}
            badge={SHIFT_DATA.hoursWorked}
          />
          <MenuItem
            icon={DollarSign}
            label="My Sales Today"
            gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
            onClick={() => setActiveModal('shift-info')}
            badge={`${SHIFT_DATA.salesToday.toFixed(0)} BRL`}
          />
        </div>

        {/* Cash Management Section */}
        <SectionHeader title="Cash Management" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <MenuItem
            icon={Wallet}
            label="Cash Collection"
            gradient="linear-gradient(135deg, #ec4899 0%, #db2777 100%)"
            onClick={() => setActiveModal('collection')}
          />
          <MenuItem
            icon={PiggyBank}
            label="Cash Replenishment"
            gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
            onClick={() => setActiveModal('replenishment')}
          />
          <MenuItem
            icon={CircleDollarSign}
            label="Request Balance Top-up"
            gradient="linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)"
            onClick={() => setActiveModal('topup-request')}
          />
        </div>

        {/* Reports & History Section */}
        <SectionHeader title="Reports & History" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <MenuItem
            icon={FileText}
            label="Reports Menu"
            gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            onClick={() => navigate('/reports')}
          />
          <MenuItem
            icon={History}
            label="Transaction History"
            gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
            onClick={() => setActiveModal('history')}
          />
        </div>

        {/* Other Section */}
        <SectionHeader title="Other" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <MenuItem
            icon={Monitor}
            label="Open Second Display"
            gradient="linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)"
            onClick={() => openSecondDisplay()}
          />
          <MenuItem
            icon={Settings}
            label="Settings"
            gradient="linear-gradient(135deg, #64748b 0%, #475569 100%)"
            onClick={() => setActiveModal('settings')}
          />
          <MenuItem
            icon={LogOut}
            label="Exit / Logout"
            gradient="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
            onClick={handleLogout}
          />
        </div>

        {/* Urgent Call Button - Direct phone call using tel: protocol */}
        <a
          href={`tel:${operatorInfo.supportPhone.replace(/\s/g, '')}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginTop: '24px',
            padding: '16px 24px',
            minHeight: '56px',
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            borderRadius: '16px',
            textDecoration: 'none',
            boxShadow: '0 4px 16px rgba(220, 38, 38, 0.3)',
            transition: 'all 0.2s ease',
          }}
        >
          <Phone size={24} color="white" />
          <span style={{ fontSize: '16px', fontWeight: 700, color: 'white' }}>
            Urgent Call
          </span>
        </a>
      </div>

      {/* ============= MODALS ============= */}

      {/* Support Ticket Modal */}
      {activeModal === 'support' && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
        }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '24px',
            width: '100%',
            maxWidth: '400px',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}>
            {ticketSubmitted ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                }}>
                  <CheckCircle2 size={40} color="white" />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                  Ticket Submitted!
                </h3>
                <p style={{ color: '#64748b', fontSize: '14px' }}>
                  Our team will respond shortly.
                </p>
              </div>
            ) : (
              <>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Headphones size={22} color="white" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>
                        Support Request
                      </h3>
                      <p style={{ fontSize: '12px', color: '#64748b' }}>
                        What do you need help with?
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveModal('none')}
                    style={{
                      background: '#f1f5f9',
                      border: 'none',
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <X size={20} color="#64748b" />
                  </button>
                </div>

                {/* Category Selection */}
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#64748b', marginBottom: '10px' }}>
                    Select Issue Type
                  </p>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '10px',
                  }}>
                    {SUPPORT_CATEGORIES.map((cat) => {
                      const Icon = cat.icon
                      const isSelected = supportCategory === cat.id
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setSupportCategory(cat.id)}
                          style={{
                            padding: '14px',
                            background: isSelected ? cat.color : '#f8fafc',
                            border: isSelected ? 'none' : '2px solid #e2e8f0',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.2s',
                          }}
                        >
                          <Icon size={22} color={isSelected ? 'white' : cat.color} />
                          <span style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            color: isSelected ? 'white' : '#475569',
                            textAlign: 'center',
                          }}>
                            {cat.label}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Description */}
                <div style={{ marginBottom: '16px' }}>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#64748b', marginBottom: '8px' }}>
                    Describe the issue
                  </p>
                  <textarea
                    value={supportDescription}
                    onChange={(e) => setSupportDescription(e.target.value)}
                    placeholder="Please describe your issue in detail..."
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '14px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '14px',
                      resize: 'none',
                      outline: 'none',
                    }}
                  />
                </div>

                {/* Priority */}
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#64748b', marginBottom: '8px' }}>
                    Priority
                  </p>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => setSupportPriority('normal')}
                      style={{
                        flex: 1,
                        padding: '12px',
                        background: supportPriority === 'normal' ? '#3b82f6' : '#f1f5f9',
                        color: supportPriority === 'normal' ? 'white' : '#64748b',
                        border: 'none',
                        borderRadius: '10px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Normal
                    </button>
                    <button
                      onClick={() => setSupportPriority('urgent')}
                      style={{
                        flex: 1,
                        padding: '12px',
                        background: supportPriority === 'urgent' ? '#ef4444' : '#f1f5f9',
                        color: supportPriority === 'urgent' ? 'white' : '#64748b',
                        border: 'none',
                        borderRadius: '10px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Urgent
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmitTicket}
                  disabled={!supportCategory || !supportDescription}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: supportCategory && supportDescription
                      ? 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)'
                      : '#e2e8f0',
                    color: supportCategory && supportDescription ? 'white' : '#94a3b8',
                    border: 'none',
                    borderRadius: '14px',
                    fontWeight: 700,
                    fontSize: '16px',
                    cursor: supportCategory && supportDescription ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                  }}
                >
                  <Send size={20} />
                  Submit Ticket
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Hostess Request Modal */}
      {activeModal === 'hostess-request' && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
        }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '24px',
            width: '100%',
            maxWidth: '400px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}>
            {hostessRequestSubmitted ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                }}>
                  <CheckCircle2 size={40} color="white" />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b' }}>
                  Request Submitted!
                </h3>
                <p style={{ color: '#64748b', fontSize: '14px', marginTop: '8px' }}>
                  Hostess will be notified for {hostessDate} at {hostessTime}
                </p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '24px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                      borderRadius: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <User size={24} color="white" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>
                        Request Hostess
                      </h3>
                      <p style={{ fontSize: '12px', color: '#64748b' }}>
                        Schedule hostess visit
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setActiveModal('none')
                      setHostessDate('')
                      setHostessTime('')
                      setHostessReason('')
                    }}
                    style={{
                      background: '#f1f5f9',
                      border: 'none',
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <X size={20} color="#64748b" />
                  </button>
                </div>

                {/* Date Input */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#475569',
                    marginBottom: '8px',
                  }}>
                    Date
                  </label>
                  <input
                    type="date"
                    value={hostessDate}
                    onChange={(e) => setHostessDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '15px',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                  />
                </div>

                {/* Time Input */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#475569',
                    marginBottom: '8px',
                  }}>
                    Time
                  </label>
                  <input
                    type="time"
                    value={hostessTime}
                    onChange={(e) => setHostessTime(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '15px',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                  />
                </div>

                {/* Reason Input */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#475569',
                    marginBottom: '8px',
                  }}>
                    Reason
                  </label>
                  <textarea
                    value={hostessReason}
                    onChange={(e) => setHostessReason(e.target.value)}
                    placeholder="Why do you need hostess at this time?"
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '15px',
                      outline: 'none',
                      resize: 'none',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => {
                      setActiveModal('none')
                      setHostessDate('')
                      setHostessTime('')
                      setHostessReason('')
                    }}
                    style={{
                      flex: 1,
                      padding: '14px',
                      background: '#f1f5f9',
                      color: '#64748b',
                      border: 'none',
                      borderRadius: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (hostessDate && hostessTime && hostessReason.trim()) {
                        setHostessRequestSubmitted(true)
                        setTimeout(() => {
                          setActiveModal('none')
                          setHostessRequestSubmitted(false)
                          setHostessDate('')
                          setHostessTime('')
                          setHostessReason('')
                        }, 2000)
                      }
                    }}
                    disabled={!hostessDate || !hostessTime || !hostessReason.trim()}
                    style={{
                      flex: 1,
                      padding: '14px',
                      background: hostessDate && hostessTime && hostessReason.trim()
                        ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                        : '#e2e8f0',
                      color: hostessDate && hostessTime && hostessReason.trim() ? 'white' : '#94a3b8',
                      border: 'none',
                      borderRadius: '12px',
                      fontWeight: 700,
                      cursor: hostessDate && hostessTime && hostessReason.trim() ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                  >
                    <Send size={18} />
                    Submit
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Call Confirmation Modals (Security, Manager) */}
      {(activeModal === 'call-security' || activeModal === 'call-manager') && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
        }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '32px 24px',
            width: '100%',
            maxWidth: '340px',
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}>
            {callConfirmed ? (
              <>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                }}>
                  <CheckCircle2 size={40} color="white" />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b' }}>
                  {activeModal === 'call-security' && 'Security Notified!'}
                  {activeModal === 'call-manager' && 'Manager Notified!'}
                </h3>
                <p style={{ color: '#64748b', fontSize: '14px', marginTop: '8px' }}>
                  They will arrive shortly.
                </p>
              </>
            ) : (
              <>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: activeModal === 'call-security'
                    ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                    : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                }}>
                  {activeModal === 'call-security' && <Shield size={36} color="white" />}
                  {activeModal === 'call-manager' && <UserCog size={36} color="white" />}
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                  {activeModal === 'call-security' && 'Call Security?'}
                  {activeModal === 'call-manager' && 'Call Manager?'}
                </h3>
                <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
                  They will be notified immediately.
                </p>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => setActiveModal('none')}
                    style={{
                      flex: 1,
                      padding: '14px',
                      background: '#f1f5f9',
                      color: '#64748b',
                      border: 'none',
                      borderRadius: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCallConfirm}
                    style={{
                      flex: 1,
                      padding: '14px',
                      background: activeModal === 'call-security'
                        ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                        : 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Confirm
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Printer Status Modal */}
      {activeModal === 'printer-status' && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
        }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '24px',
            width: '100%',
            maxWidth: '360px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Printer size={22} color="white" />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>
                  Printer Status
                </h3>
              </div>
              <button
                onClick={() => setActiveModal('none')}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={20} color="#64748b" />
              </button>
            </div>

            {/* Status Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px',
                background: '#f8fafc',
                borderRadius: '12px',
              }}>
                <span style={{ fontSize: '14px', color: '#64748b' }}>Connection</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '10px',
                    height: '10px',
                    background: PRINTER_STATUS.connected ? '#24BD68' : '#ef4444',
                    borderRadius: '50%',
                  }} />
                  <span style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: PRINTER_STATUS.connected ? '#24BD68' : '#ef4444',
                  }}>
                    {PRINTER_STATUS.connected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
              </div>

              <div style={{
                padding: '14px',
                background: '#f8fafc',
                borderRadius: '12px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', color: '#64748b' }}>Paper Level</span>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: PRINTER_STATUS.paperLevel < 30 ? '#ef4444' : '#24BD68',
                  }}>
                    {PRINTER_STATUS.paperLevel}%
                  </span>
                </div>
                <div style={{
                  height: '8px',
                  background: '#e2e8f0',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    width: `${PRINTER_STATUS.paperLevel}%`,
                    height: '100%',
                    background: PRINTER_STATUS.paperLevel < 30
                      ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                      : 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)',
                    borderRadius: '4px',
                  }} />
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px',
                background: '#f8fafc',
                borderRadius: '12px',
              }}>
                <span style={{ fontSize: '14px', color: '#64748b' }}>Model</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>
                  {PRINTER_STATUS.model}
                </span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px',
                background: '#f8fafc',
                borderRadius: '12px',
              }}>
                <span style={{ fontSize: '14px', color: '#64748b' }}>Last Print</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>
                  {PRINTER_STATUS.lastPrint}
                </span>
              </div>
            </div>

            <button
              onClick={() => setActiveModal('none')}
              style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Test Print
            </button>
          </div>
        </div>
      )}

      {/* Diagnostics Modal */}
      {activeModal === 'diagnostics' && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
        }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '24px',
            width: '100%',
            maxWidth: '360px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Wrench size={22} color="white" />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>
                  System Diagnostics
                </h3>
              </div>
              <button
                onClick={() => setActiveModal('none')}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={20} color="#64748b" />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {DIAGNOSTICS.map((item) => (
                <div
                  key={item.name}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '14px',
                    background: '#f8fafc',
                    borderRadius: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {item.status === 'ok' ? (
                      <Wifi size={18} color="#24BD68" />
                    ) : (
                      <AlertCircle size={18} color="#f59e0b" />
                    )}
                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#1e293b' }}>
                      {item.name}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>{item.latency}</span>
                    <div style={{
                      padding: '4px 10px',
                      background: item.status === 'ok'
                        ? 'rgba(16, 185, 129, 0.1)'
                        : 'rgba(245, 158, 11, 0.1)',
                      borderRadius: '6px',
                    }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: item.status === 'ok' ? '#24BD68' : '#f59e0b',
                        textTransform: 'uppercase',
                      }}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveModal('none')}
              style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Run Full Diagnostics
            </button>
          </div>
        </div>
      )}

      {/* Shift Info Modal */}
      {activeModal === 'shift-info' && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
        }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '24px',
            width: '100%',
            maxWidth: '360px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  background: 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Clock size={22} color="white" />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>
                  My Shift
                </h3>
              </div>
              <button
                onClick={() => setActiveModal('none')}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={20} color="#64748b" />
              </button>
            </div>

            {/* Shift Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
              marginBottom: '20px',
            }}>
              <div style={{
                padding: '16px',
                background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                borderRadius: '14px',
                textAlign: 'center',
              }}>
                <p style={{ fontSize: '12px', color: '#00A77E', marginBottom: '4px' }}>Start Time</p>
                <p style={{ fontSize: '20px', fontWeight: 700, color: '#047857' }}>{SHIFT_DATA.startTime}</p>
              </div>
              <div style={{
                padding: '16px',
                background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                borderRadius: '14px',
                textAlign: 'center',
              }}>
                <p style={{ fontSize: '12px', color: '#2563eb', marginBottom: '4px' }}>Hours Worked</p>
                <p style={{ fontSize: '20px', fontWeight: 700, color: '#1d4ed8' }}>{SHIFT_DATA.hoursWorked}</p>
              </div>
              <div style={{
                padding: '16px',
                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                borderRadius: '14px',
                textAlign: 'center',
              }}>
                <p style={{ fontSize: '12px', color: '#d97706', marginBottom: '4px' }}>Tickets Sold</p>
                <p style={{ fontSize: '20px', fontWeight: 700, color: '#b45309' }}>{SHIFT_DATA.ticketsSold}</p>
              </div>
              <div style={{
                padding: '16px',
                background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
                borderRadius: '14px',
                textAlign: 'center',
              }}>
                <p style={{ fontSize: '12px', color: '#db2777', marginBottom: '4px' }}>Sales Today</p>
                <p style={{ fontSize: '20px', fontWeight: 700, color: '#be185d' }}>{SHIFT_DATA.salesToday.toFixed(0)}</p>
              </div>
            </div>

            {/* Commission */}
            <div style={{
              padding: '16px',
              background: '#f8fafc',
              borderRadius: '14px',
              marginBottom: '20px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: '#64748b' }}>My Commission Today</span>
                <span style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#24BD68',
                }}>
                  {SHIFT_DATA.commission.toFixed(2)} BRL
                </span>
              </div>
            </div>

            {/* Break Button */}
            <button
              style={{
                width: '100%',
                padding: '14px',
                background: SHIFT_DATA.onBreak
                  ? 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)'
                  : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <Coffee size={20} />
              {SHIFT_DATA.onBreak ? 'End Break' : 'Start Break'}
            </button>
          </div>
        </div>
      )}

      {/* Cash Collection Modal with Pocket Selection */}
      {activeModal === 'collection' && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
        }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '24px',
            width: '100%',
            maxWidth: '440px',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Wallet size={26} color="white" />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                    Cash Collection
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                    Select pocket to collect from
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveModal('none')
                  setAmount('')
                  setSelectedCollectionPocket('all')
                }}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  border: 'none',
                  background: '#f1f5f9',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#64748b',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Pocket Selection */}
            <div style={{ marginBottom: '20px' }}>
              <PaymentMethodSelector
                selected={selectedCollectionPocket === 'all' ? null : selectedCollectionPocket}
                onSelect={(method) => setSelectedCollectionPocket(method)}
                showBalances
                pocketBalances={pocketBalances}
                showAllOption
                onSelectAll={() => setSelectedCollectionPocket('all')}
                isAllSelected={selectedCollectionPocket === 'all'}
              />
            </div>

            {/* Amount Input */}
            <div style={{
              background: '#f8fafc',
              borderRadius: '14px',
              padding: '14px',
              marginBottom: '16px',
            }}>
              <input
                type="text"
                value={amount}
                readOnly
                placeholder="0.00"
                style={{
                  width: '100%',
                  padding: '8px',
                  fontSize: '26px',
                  fontWeight: 700,
                  border: 'none',
                  background: 'transparent',
                  textAlign: 'center',
                  color: '#1e293b',
                  outline: 'none',
                }}
              />
              <p style={{
                textAlign: 'center',
                fontSize: '12px',
                color: '#64748b',
              }}>
                Max: {getMaxCollectionAmount().toFixed(2)} BRL
                {selectedCollectionPocket !== 'all' && (
                  <span> from {selectedCollectionPocket.charAt(0).toUpperCase() + selectedCollectionPocket.slice(1)}</span>
                )}
              </p>
            </div>

            {/* Number Pad */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
              marginBottom: '16px',
            }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <NumButton
                  key={num}
                  value={String(num)}
                  onClick={() => setAmount(amount + num)}
                />
              ))}
              <NumButton
                value="✓"
                onClick={handleCashCollection}
                variant="confirm"
              />
              <NumButton
                value="0"
                onClick={() => setAmount(amount + '0')}
              />
              <NumButton
                value="⌫"
                onClick={() => setAmount(amount.slice(0, -1))}
                variant="delete"
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={handleAllMoney}
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <Sparkles size={18} />
                Collect All ({getMaxCollectionAmount().toFixed(2)} BRL)
              </button>
              <button
                onClick={() => {
                  setActiveModal('none')
                  setAmount('')
                  setSelectedCollectionPocket('all')
                }}
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  border: 'none',
                  background: '#f1f5f9',
                  color: '#64748b',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cash Replenishment/Top-up Modal */}
      {(activeModal === 'replenishment' || activeModal === 'topup-request') && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
        }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '24px',
            width: '100%',
            maxWidth: '360px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}>
            <div style={{
              textAlign: 'center',
              marginBottom: '20px',
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                background: activeModal === 'replenishment'
                  ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
                  : 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
              }}>
                {activeModal === 'replenishment' && <PiggyBank size={26} color="white" />}
                {activeModal === 'topup-request' && <CircleDollarSign size={26} color="white" />}
              </div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#1e293b',
              }}>
                {activeModal === 'replenishment' && 'Cash Replenishment'}
                {activeModal === 'topup-request' && 'Request Balance Top-up'}
              </h3>
            </div>

            {/* Amount Input */}
            <div style={{
              background: '#f8fafc',
              borderRadius: '14px',
              padding: '14px',
              marginBottom: '16px',
            }}>
              <input
                type="text"
                value={amount}
                readOnly
                placeholder="0.00"
                style={{
                  width: '100%',
                  padding: '8px',
                  fontSize: '26px',
                  fontWeight: 700,
                  border: 'none',
                  background: 'transparent',
                  textAlign: 'center',
                  color: '#1e293b',
                  outline: 'none',
                }}
              />
              <p style={{
                textAlign: 'center',
                fontSize: '12px',
                color: '#64748b',
              }}>
                Enter amount in BRL
              </p>
            </div>

            {/* Number Pad */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
              marginBottom: '16px',
            }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <NumButton
                  key={num}
                  value={String(num)}
                  onClick={() => setAmount(amount + num)}
                />
              ))}
              <NumButton
                value="✓"
                onClick={() => {
                  if (activeModal === 'replenishment') handleCashReplenishment()
                  else {
                    // Handle top-up request
                    setAmount('')
                    setActiveModal('none')
                  }
                }}
                variant="confirm"
              />
              <NumButton
                value="0"
                onClick={() => setAmount(amount + '0')}
              />
              <NumButton
                value="⌫"
                onClick={() => setAmount(amount.slice(0, -1))}
                variant="delete"
              />
            </div>

            {/* Cancel Button */}
            <button
              onClick={() => {
                setActiveModal('none')
                setAmount('')
              }}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                background: '#f1f5f9',
                color: '#64748b',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* History Modal */}
      {activeModal === 'history' && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
        }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '24px',
            width: '100%',
            maxWidth: '420px',
            maxHeight: '80vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <History size={20} color="white" />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>
                  Transaction History
                </h3>
              </div>
              <button
                onClick={() => setActiveModal('none')}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={20} color="#64748b" />
              </button>
            </div>

            <div style={{ flex: 1, overflow: 'auto' }}>
              {ticketHistory.length === 0 ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '40px',
                }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    background: '#f1f5f9',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                  }}>
                    <History size={28} color="#94a3b8" />
                  </div>
                  <p style={{ color: '#64748b', fontSize: '14px' }}>No history yet</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {ticketHistory.slice(0, 20).map((ticket) => (
                    <div
                      key={ticket.id}
                      style={{
                        padding: '14px',
                        background: '#f8fafc',
                        borderRadius: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>
                          {new Date(ticket.purchasedAt).toLocaleString()}
                        </span>
                        <span style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: ticket.status === 'won'
                            ? 'rgba(16, 185, 129, 0.1)'
                            : ticket.status === 'lost'
                            ? 'rgba(239, 68, 68, 0.1)'
                            : 'rgba(245, 158, 11, 0.1)',
                          color: ticket.status === 'won'
                            ? '#24BD68'
                            : ticket.status === 'lost'
                            ? '#ef4444'
                            : '#f59e0b',
                        }}>
                          {ticket.status.toUpperCase()}
                        </span>
                      </div>
                      <p style={{ fontWeight: 600, color: '#1e293b', fontSize: '14px', marginBottom: '2px' }}>
                        {ticket.bet.gameName}
                      </p>
                      <p style={{
                        fontSize: '14px',
                        fontWeight: 700,
                        color: '#24BD68',
                      }}>
                        +{ticket.bet.totalCost.toFixed(2)} BRL
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {activeModal === 'settings' && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
        }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '24px',
            width: '100%',
            maxWidth: '360px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Settings size={22} color="white" />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>
                  Settings
                </h3>
              </div>
              <button
                onClick={() => setActiveModal('none')}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={20} color="#64748b" />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Theme Settings - Primary */}
              <button
                onClick={() => setActiveModal('theme')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '16px',
                  background: COLOR_THEMES[colorTheme].gradient,
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <Palette size={20} color="white" />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, color: 'white', fontSize: '14px' }}>Theme & Appearance</p>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>
                    {COLOR_THEMES[colorTheme].name} • {VISUAL_STYLES[visualStyle].name}
                  </p>
                </div>
                <ChevronRight size={18} color="rgba(255,255,255,0.8)" />
              </button>

              <button style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '16px',
                background: '#f8fafc',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                textAlign: 'left',
              }}>
                <Globe size={20} color="#3b82f6" />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, color: '#1e293b', fontSize: '14px' }}>Language</p>
                  <p style={{ color: '#64748b', fontSize: '12px' }}>English</p>
                </div>
                <ChevronRight size={18} color="#94a3b8" />
              </button>

              <button style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '16px',
                background: '#f8fafc',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                textAlign: 'left',
              }}>
                <Volume2 size={20} color="#24BD68" />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, color: '#1e293b', fontSize: '14px' }}>Sound</p>
                  <p style={{ color: '#64748b', fontSize: '12px' }}>Enabled</p>
                </div>
                <ChevronRight size={18} color="#94a3b8" />
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '16px',
                  background: isDarkMode ? '#1e293b' : '#f8fafc',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                {isDarkMode ? <Moon size={20} color="#fbbf24" /> : <Sun size={20} color="#f59e0b" />}
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, color: isDarkMode ? 'white' : '#1e293b', fontSize: '14px' }}>
                    {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                  </p>
                  <p style={{ color: isDarkMode ? '#94a3b8' : '#64748b', fontSize: '12px' }}>
                    {isDarkMode ? 'Switch to light theme' : 'Switch to dark theme'}
                  </p>
                </div>
                <div style={{
                  width: '48px',
                  height: '26px',
                  background: isDarkMode ? '#3b82f6' : '#cbd5e1',
                  borderRadius: '13px',
                  position: 'relative',
                  transition: 'all 0.3s',
                }}>
                  <div style={{
                    width: '22px',
                    height: '22px',
                    background: 'white',
                    borderRadius: '50%',
                    position: 'absolute',
                    top: '2px',
                    left: isDarkMode ? '24px' : '2px',
                    transition: 'all 0.3s',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  }} />
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Theme Selector Modal */}
      {activeModal === 'theme' && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
        }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '24px',
            width: '100%',
            maxWidth: '420px',
            maxHeight: '85vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  background: COLOR_THEMES[colorTheme].gradient,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Palette size={22} color="white" />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>
                  Theme & Appearance
                </h3>
              </div>
              <button
                onClick={() => setActiveModal('settings')}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={20} color="#64748b" />
              </button>
            </div>

            {/* Color Theme Section */}
            <div style={{ marginBottom: '24px' }}>
              <p style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#94a3b8',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '12px',
              }}>
                Color Theme
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '10px',
              }}>
                {(Object.keys(COLOR_THEMES) as ColorTheme[]).map((theme) => {
                  const isSelected = colorTheme === theme
                  const themeData = COLOR_THEMES[theme]
                  return (
                    <button
                      key={theme}
                      onClick={() => setColorTheme(theme)}
                      style={{
                        padding: '14px 10px',
                        background: isSelected ? themeData.gradient : '#f8fafc',
                        border: isSelected ? 'none' : '2px solid #e2e8f0',
                        borderRadius: '14px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s',
                      }}
                    >
                      <div style={{
                        width: '32px',
                        height: '32px',
                        background: isSelected ? 'rgba(255,255,255,0.3)' : themeData.gradient,
                        borderRadius: '50%',
                        border: isSelected ? '2px solid rgba(255,255,255,0.5)' : 'none',
                      }} />
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        color: isSelected ? 'white' : '#475569',
                      }}>
                        {themeData.name}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Visual Style Section */}
            <div style={{ marginBottom: '24px' }}>
              <p style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#94a3b8',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '12px',
              }}>
                Visual Style
              </p>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}>
                {(Object.keys(VISUAL_STYLES) as VisualStyle[]).map((style) => {
                  const isSelected = visualStyle === style
                  const styleData = VISUAL_STYLES[style]
                  const icons: Record<VisualStyle, typeof Grid3X3> = {
                    bento: Grid3X3,
                    glass: Sparkle,
                    neumorphic: Box,
                    minimal: Minus,
                    bold: Bold,
                  }
                  const StyleIcon = icons[style]
                  return (
                    <button
                      key={style}
                      onClick={() => setVisualStyle(style)}
                      style={{
                        padding: '14px 16px',
                        background: isSelected ? COLOR_THEMES[colorTheme].colors[50] : '#f8fafc',
                        border: isSelected
                          ? `2px solid ${COLOR_THEMES[colorTheme].primary}`
                          : '2px solid transparent',
                        borderRadius: '14px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        textAlign: 'left',
                        transition: 'all 0.2s',
                      }}
                    >
                      <div style={{
                        width: '40px',
                        height: '40px',
                        background: isSelected
                          ? COLOR_THEMES[colorTheme].gradient
                          : '#e2e8f0',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <StyleIcon size={20} color={isSelected ? 'white' : '#64748b'} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{
                          fontWeight: 600,
                          color: isSelected ? COLOR_THEMES[colorTheme].colors[700] : '#1e293b',
                          fontSize: '14px',
                        }}>
                          {styleData.name}
                        </p>
                        <p style={{
                          color: '#64748b',
                          fontSize: '11px',
                        }}>
                          {styleData.description}
                        </p>
                      </div>
                      {isSelected && (
                        <div style={{
                          width: '24px',
                          height: '24px',
                          background: COLOR_THEMES[colorTheme].gradient,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <Check size={14} color="white" />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Preview Card */}
            <div style={{ marginBottom: '20px' }}>
              <p style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#94a3b8',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '12px',
              }}>
                Preview
              </p>
              <div style={{
                padding: '20px',
                background: isDarkMode ? '#1e293b' : VISUAL_STYLES[visualStyle].cardBackground,
                borderRadius: VISUAL_STYLES[visualStyle].borderRadius,
                boxShadow: VISUAL_STYLES[visualStyle].cardShadow,
                border: VISUAL_STYLES[visualStyle].cardBorder,
                backdropFilter: visualStyle === 'glass' ? VISUAL_STYLES[visualStyle].backdropBlur : undefined,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: COLOR_THEMES[colorTheme].gradient,
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Layers size={20} color="white" />
                  </div>
                  <div>
                    <p style={{
                      fontWeight: 600,
                      color: isDarkMode ? 'white' : '#1e293b',
                      fontSize: '14px',
                    }}>
                      Sample Card
                    </p>
                    <p style={{
                      color: isDarkMode ? '#94a3b8' : '#64748b',
                      fontSize: '12px',
                    }}>
                      This is how your UI will look
                    </p>
                  </div>
                </div>
                <button style={{
                  width: '100%',
                  padding: '12px',
                  background: COLOR_THEMES[colorTheme].gradient,
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}>
                  Sample Button
                </button>
              </div>
            </div>

            {/* Apply Button */}
            <button
              onClick={() => setActiveModal('settings')}
              style={{
                width: '100%',
                padding: '16px',
                background: COLOR_THEMES[colorTheme].gradient,
                color: 'white',
                border: 'none',
                borderRadius: '14px',
                fontWeight: 700,
                fontSize: '16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
              }}
            >
              <Check size={20} />
              Done
            </button>
          </div>
        </div>
      )}

      {/* Not Working Modal */}
      {activeModal === 'not-working' && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
        }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '24px',
            width: '100%',
            maxWidth: '420px',
            maxHeight: '85vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <PauseCircle size={24} color="white" />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>
                    Pause Terminal
                  </h3>
                  <p style={{ fontSize: '12px', color: '#64748b' }}>
                    Select a reason for pausing
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveModal('none')
                  setSelectedOfflineReason(null)
                  setOfflineNote('')
                }}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={20} color="#64748b" />
              </button>
            </div>

            {/* Reason Selection */}
            <div style={{ marginBottom: '20px' }}>
              <p style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#94a3b8',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '12px',
              }}>
                Select Reason
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '10px',
              }}>
                {(Object.keys(OFFLINE_REASONS) as OfflineReason[]).map((reason) => {
                  const isSelected = selectedOfflineReason === reason
                  const reasonData = OFFLINE_REASONS[reason]
                  return (
                    <button
                      key={reason}
                      onClick={() => setSelectedOfflineReason(reason)}
                      style={{
                        padding: '16px 12px',
                        background: isSelected ? reasonData.gradient : '#f8fafc',
                        border: isSelected ? 'none' : '2px solid #e2e8f0',
                        borderRadius: '14px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s',
                        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                        boxShadow: isSelected ? `0 8px 24px ${reasonData.color}40` : 'none',
                      }}
                    >
                      <span style={{ fontSize: '28px' }}>{reasonData.icon}</span>
                      <span style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: isSelected ? 'white' : '#475569',
                        textAlign: 'center',
                      }}>
                        {reasonData.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Custom Note (for 'other' reason or any) */}
            {selectedOfflineReason && (
              <div style={{ marginBottom: '20px' }}>
                <p style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#94a3b8',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '8px',
                }}>
                  Add Note (Optional)
                </p>
                <textarea
                  value={offlineNote}
                  onChange={(e) => setOfflineNote(e.target.value)}
                  placeholder="Add details about why you're pausing..."
                  style={{
                    width: '100%',
                    padding: '14px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '14px',
                    resize: 'none',
                    height: '80px',
                    fontFamily: 'inherit',
                  }}
                />
              </div>
            )}

            {/* Warning */}
            <div style={{
              background: '#fef3c7',
              borderRadius: '12px',
              padding: '14px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
            }}>
              <AlertCircle size={20} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#92400e', marginBottom: '4px' }}>
                  Terminal will be paused
                </p>
                <p style={{ fontSize: '12px', color: '#a16207' }}>
                  All transactions will be blocked until you resume. Your manager will be notified.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {
                  setActiveModal('none')
                  setSelectedOfflineReason(null)
                  setOfflineNote('')
                }}
                style={{
                  flex: 1,
                  padding: '16px',
                  borderRadius: '14px',
                  border: 'none',
                  background: '#f1f5f9',
                  color: '#64748b',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (selectedOfflineReason) {
                    goOffline(selectedOfflineReason, offlineNote)
                    setActiveModal('none')
                    setSelectedOfflineReason(null)
                    setOfflineNote('')
                  }
                }}
                disabled={!selectedOfflineReason}
                style={{
                  flex: 1,
                  padding: '16px',
                  borderRadius: '14px',
                  border: 'none',
                  background: selectedOfflineReason
                    ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                    : '#e2e8f0',
                  color: selectedOfflineReason ? 'white' : '#94a3b8',
                  fontSize: '16px',
                  fontWeight: 700,
                  cursor: selectedOfflineReason ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: selectedOfflineReason
                    ? '0 4px 16px rgba(245, 158, 11, 0.4)'
                    : 'none',
                }}
              >
                <PauseCircle size={20} />
                Pause Terminal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation - Always visible */}
      <BottomNavigation activeTab="games" />
    </div>
  )
}
