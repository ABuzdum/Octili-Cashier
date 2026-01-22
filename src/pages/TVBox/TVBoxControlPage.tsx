/**
 * ============================================================================
 * TV BOX CONTROL PAGE - MANAGE TV DISPLAYS IN VENUE
 * ============================================================================
 *
 * Purpose: Control TV Box devices displaying games in the venue.
 * Allows cashiers/managers to manage what's shown on each TV.
 *
 * Features:
 * - List of all TV Boxes with status
 * - Select which game is displayed
 * - Control volume and mute
 * - Add promotional overlay (image/video)
 *
 * @author Octili Development Team
 * @version 1.0.0
 * @lastUpdated 2025-01-22
 */

import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Tv,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Moon,
  Gamepad2,
  Image,
  Video,
  X,
  Check,
  ChevronRight,
  Settings,
  Layers,
  Play,
  Pause,
} from 'lucide-react'
import { useLotteryGames } from '@/stores/gameStore'
import { MOCK_TV_BOXES, PROMO_MEDIA } from '@/data/tvbox-mock-data'
import type { TVBox, TVBoxStatus, OverlayType, OverlayPosition } from '@/types/tvbox.types'

/**
 * Status badge colors
 */
const STATUS_CONFIG: Record<TVBoxStatus, { color: string; bg: string; label: string }> = {
  online: { color: '#24BD68', bg: '#ecfdf5', label: 'Online' },
  offline: { color: '#ef4444', bg: '#fef2f2', label: 'Offline' },
  standby: { color: '#f59e0b', bg: '#fffbeb', label: 'Standby' },
}

/**
 * TV Box card in the list
 */
function TVBoxCard({
  tvbox,
  onClick,
}: {
  tvbox: TVBox
  onClick: () => void
}) {
  const statusConfig = STATUS_CONFIG[tvbox.status]

  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        background: 'white',
        borderRadius: '16px',
        padding: '16px',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        textAlign: 'left',
        transition: 'all 0.2s ease',
      }}
    >
      {/* TV Icon with status indicator */}
      <div style={{ position: 'relative' }}>
        <div
          style={{
            width: '52px',
            height: '52px',
            background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Tv size={24} color="white" />
        </div>
        {/* Status dot */}
        <div
          style={{
            position: 'absolute',
            bottom: '-2px',
            right: '-2px',
            width: '16px',
            height: '16px',
            background: statusConfig.bg,
            borderRadius: '50%',
            border: '2px solid white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {tvbox.status === 'online' ? (
            <Wifi size={8} color={statusConfig.color} />
          ) : tvbox.status === 'offline' ? (
            <WifiOff size={8} color={statusConfig.color} />
          ) : (
            <Moon size={8} color={statusConfig.color} />
          )}
        </div>
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b' }}>
            {tvbox.name}
          </h3>
          <span
            style={{
              fontSize: '10px',
              fontWeight: 600,
              color: statusConfig.color,
              background: statusConfig.bg,
              padding: '2px 8px',
              borderRadius: '6px',
            }}
          >
            {statusConfig.label}
          </span>
        </div>
        <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '6px' }}>
          {tvbox.location}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {tvbox.currentGameName && (
            <span
              style={{
                fontSize: '12px',
                color: '#06b6d4',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Gamepad2 size={12} />
              {tvbox.currentGameName}
            </span>
          )}
          <span
            style={{
              fontSize: '12px',
              color: tvbox.isMuted ? '#94a3b8' : '#64748b',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            {tvbox.isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
            {tvbox.isMuted ? 'Muted' : `${tvbox.volume}%`}
          </span>
          {tvbox.overlay.isActive && (
            <span
              style={{
                fontSize: '12px',
                color: '#f59e0b',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Layers size={12} />
              Overlay
            </span>
          )}
        </div>
      </div>

      {/* Arrow */}
      <ChevronRight size={20} color="#94a3b8" />
    </button>
  )
}

/**
 * TV Box detail/edit modal
 */
function TVBoxDetailModal({
  tvbox,
  onClose,
  onUpdate,
}: {
  tvbox: TVBox
  onClose: () => void
  onUpdate: (updates: Partial<TVBox>) => void
}) {
  const games = useLotteryGames()
  const [volume, setVolume] = useState(tvbox.volume)
  const [isMuted, setIsMuted] = useState(tvbox.isMuted)
  const [selectedGameId, setSelectedGameId] = useState(tvbox.currentGameId)
  const [overlayActive, setOverlayActive] = useState(tvbox.overlay.isActive)
  const [overlayType, setOverlayType] = useState<OverlayType>(tvbox.overlay.type)
  const [overlayUrl, setOverlayUrl] = useState(tvbox.overlay.url)
  const [overlayPosition, setOverlayPosition] = useState<OverlayPosition>(tvbox.overlay.position)
  const [overlayOpacity, setOverlayOpacity] = useState(tvbox.overlay.opacity)
  const [activeTab, setActiveTab] = useState<'game' | 'sound' | 'overlay'>('game')

  const statusConfig = STATUS_CONFIG[tvbox.status]
  const selectedGame = games.find((g) => g.id === selectedGameId)

  const handleSave = useCallback(() => {
    onUpdate({
      currentGameId: selectedGameId,
      currentGameName: selectedGame?.name || null,
      volume,
      isMuted,
      overlay: {
        ...tvbox.overlay,
        type: overlayType,
        url: overlayUrl,
        position: overlayPosition,
        opacity: overlayOpacity,
        isActive: overlayActive,
      },
    })
    onClose()
  }, [
    selectedGameId,
    selectedGame,
    volume,
    isMuted,
    overlayType,
    overlayUrl,
    overlayPosition,
    overlayOpacity,
    overlayActive,
    tvbox.overlay,
    onUpdate,
    onClose,
  ])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '480px',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
            padding: '20px',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Tv size={24} color="white" />
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ color: 'white', fontSize: '18px', fontWeight: 700 }}>
                {tvbox.name}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>
                  {tvbox.location}
                </span>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 600,
                    color: 'white',
                    background: 'rgba(255,255,255,0.2)',
                    padding: '2px 8px',
                    borderRadius: '6px',
                  }}
                >
                  {statusConfig.label}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.2)',
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
              <X size={18} color="white" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid #e2e8f0',
            padding: '0 16px',
          }}
        >
          {[
            { id: 'game' as const, label: 'Game', icon: Gamepad2 },
            { id: 'sound' as const, label: 'Sound', icon: Volume2 },
            { id: 'overlay' as const, label: 'Overlay', icon: Layers },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '14px',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid #06b6d4' : '2px solid transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                color: activeTab === tab.id ? '#06b6d4' : '#64748b',
                fontWeight: activeTab === tab.id ? 600 : 500,
                fontSize: '14px',
                transition: 'all 0.2s ease',
              }}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '20px' }}>
          {/* Game Tab */}
          {activeTab === 'game' && (
            <div>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>
                Select which game to display on this TV
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {/* No Game option */}
                <button
                  onClick={() => setSelectedGameId(null)}
                  style={{
                    padding: '14px',
                    borderRadius: '12px',
                    border: !selectedGameId ? '2px solid #06b6d4' : '2px solid #e2e8f0',
                    background: !selectedGameId ? '#ecfeff' : 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    textAlign: 'left',
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      background: '#f1f5f9',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Tv size={20} color="#64748b" />
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>
                      Default Screen
                    </p>
                    <p style={{ fontSize: '12px', color: '#64748b' }}>
                      Show default promotional content
                    </p>
                  </div>
                  {!selectedGameId && <Check size={20} color="#06b6d4" style={{ marginLeft: 'auto' }} />}
                </button>

                {/* Game options */}
                {games.map((game) => (
                  <button
                    key={game.id}
                    onClick={() => setSelectedGameId(game.id)}
                    style={{
                      padding: '14px',
                      borderRadius: '12px',
                      border: selectedGameId === game.id ? '2px solid #06b6d4' : '2px solid #e2e8f0',
                      background: selectedGameId === game.id ? '#ecfeff' : 'white',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      textAlign: 'left',
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                      }}
                    >
                      {game.icon}
                    </div>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>
                        {game.name}
                      </p>
                      <p style={{ fontSize: '12px', color: '#64748b', textTransform: 'capitalize' }}>
                        {game.type}
                      </p>
                    </div>
                    {selectedGameId === game.id && (
                      <Check size={20} color="#06b6d4" style={{ marginLeft: 'auto' }} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sound Tab */}
          {activeTab === 'sound' && (
            <div>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
                Adjust volume settings for this TV
              </p>

              {/* Mute toggle */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  background: '#f8fafc',
                  borderRadius: '12px',
                  marginBottom: '20px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {isMuted ? (
                    <VolumeX size={24} color="#94a3b8" />
                  ) : (
                    <Volume2 size={24} color="#06b6d4" />
                  )}
                  <span style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b' }}>
                    {isMuted ? 'Sound Muted' : 'Sound On'}
                  </span>
                </div>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  style={{
                    width: '52px',
                    height: '28px',
                    borderRadius: '14px',
                    border: 'none',
                    background: isMuted ? '#e2e8f0' : '#06b6d4',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'background 0.2s ease',
                  }}
                >
                  <div
                    style={{
                      width: '22px',
                      height: '22px',
                      background: 'white',
                      borderRadius: '50%',
                      position: 'absolute',
                      top: '3px',
                      left: isMuted ? '3px' : '27px',
                      transition: 'left 0.2s ease',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }}
                  />
                </button>
              </div>

              {/* Volume slider */}
              <div style={{ opacity: isMuted ? 0.5 : 1, pointerEvents: isMuted ? 'none' : 'auto' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                  }}
                >
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#64748b' }}>
                    Volume
                  </span>
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: 700,
                      color: '#06b6d4',
                    }}
                  >
                    {volume}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    height: '8px',
                    borderRadius: '4px',
                    appearance: 'none',
                    background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${volume}%, #e2e8f0 ${volume}%, #e2e8f0 100%)`,
                    cursor: 'pointer',
                  }}
                />
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '8px',
                  }}
                >
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>0%</span>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>100%</span>
                </div>
              </div>
            </div>
          )}

          {/* Overlay Tab */}
          {activeTab === 'overlay' && (
            <div>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
                Add promotional content as an overlay
              </p>

              {/* Overlay toggle */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  background: '#f8fafc',
                  borderRadius: '12px',
                  marginBottom: '20px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Layers size={24} color={overlayActive ? '#f59e0b' : '#94a3b8'} />
                  <span style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b' }}>
                    {overlayActive ? 'Overlay Active' : 'Overlay Off'}
                  </span>
                </div>
                <button
                  onClick={() => setOverlayActive(!overlayActive)}
                  style={{
                    width: '52px',
                    height: '28px',
                    borderRadius: '14px',
                    border: 'none',
                    background: overlayActive ? '#f59e0b' : '#e2e8f0',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'background 0.2s ease',
                  }}
                >
                  <div
                    style={{
                      width: '22px',
                      height: '22px',
                      background: 'white',
                      borderRadius: '50%',
                      position: 'absolute',
                      top: '3px',
                      left: overlayActive ? '27px' : '3px',
                      transition: 'left 0.2s ease',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }}
                  />
                </button>
              </div>

              {overlayActive && (
                <>
                  {/* Media selection */}
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '10px' }}>
                    Select Media
                  </p>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '8px',
                      marginBottom: '20px',
                    }}
                  >
                    {PROMO_MEDIA.map((media) => (
                      <button
                        key={media.id}
                        onClick={() => {
                          setOverlayType(media.type)
                          setOverlayUrl(media.url)
                        }}
                        style={{
                          aspectRatio: '1',
                          borderRadius: '12px',
                          border: overlayUrl === media.url ? '2px solid #f59e0b' : '2px solid #e2e8f0',
                          background: '#f8fafc',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px',
                          padding: '8px',
                        }}
                      >
                        {media.type === 'image' ? (
                          <Image size={24} color={overlayUrl === media.url ? '#f59e0b' : '#64748b'} />
                        ) : (
                          <Video size={24} color={overlayUrl === media.url ? '#f59e0b' : '#64748b'} />
                        )}
                        <span
                          style={{
                            fontSize: '10px',
                            color: overlayUrl === media.url ? '#f59e0b' : '#64748b',
                            textAlign: 'center',
                          }}
                        >
                          {media.name}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Position */}
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '10px' }}>
                    Position
                  </p>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '8px',
                      marginBottom: '20px',
                    }}
                  >
                    {(['top-left', 'top-right', 'bottom-left', 'bottom-right'] as OverlayPosition[]).map(
                      (pos) => (
                        <button
                          key={pos}
                          onClick={() => setOverlayPosition(pos)}
                          style={{
                            padding: '12px',
                            borderRadius: '10px',
                            border: overlayPosition === pos ? '2px solid #f59e0b' : '2px solid #e2e8f0',
                            background: overlayPosition === pos ? '#fffbeb' : 'white',
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: 500,
                            color: overlayPosition === pos ? '#f59e0b' : '#64748b',
                            textTransform: 'capitalize',
                          }}
                        >
                          {pos.replace('-', ' ')}
                        </button>
                      )
                    )}
                  </div>

                  {/* Opacity */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '10px',
                    }}
                  >
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>
                      Opacity
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#f59e0b' }}>
                      {overlayOpacity}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={overlayOpacity}
                    onChange={(e) => setOverlayOpacity(parseInt(e.target.value))}
                    style={{
                      width: '100%',
                      height: '8px',
                      borderRadius: '4px',
                      appearance: 'none',
                      background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${overlayOpacity}%, #e2e8f0 ${overlayOpacity}%, #e2e8f0 100%)`,
                      cursor: 'pointer',
                    }}
                  />
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 20px',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            gap: '12px',
          }}
        >
          <button
            onClick={onClose}
            style={{
              flex: 1,
              height: '48px',
              borderRadius: '12px',
              border: '2px solid #e2e8f0',
              background: 'white',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              color: '#64748b',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={tvbox.status === 'offline'}
            style={{
              flex: 1,
              height: '48px',
              borderRadius: '12px',
              border: 'none',
              background:
                tvbox.status === 'offline'
                  ? '#e2e8f0'
                  : 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
              fontSize: '15px',
              fontWeight: 600,
              cursor: tvbox.status === 'offline' ? 'not-allowed' : 'pointer',
              color: tvbox.status === 'offline' ? '#94a3b8' : 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <Check size={18} />
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * TVBoxControlPage Component
 *
 * Main page for managing TV Box devices in the venue.
 */
export function TVBoxControlPage() {
  const navigate = useNavigate()
  const [tvboxes, setTvboxes] = useState<TVBox[]>(MOCK_TV_BOXES)
  const [selectedTVBox, setSelectedTVBox] = useState<TVBox | null>(null)

  const handleUpdate = useCallback(
    (updates: Partial<TVBox>) => {
      if (!selectedTVBox) return

      setTvboxes((prev) =>
        prev.map((tv) => (tv.id === selectedTVBox.id ? { ...tv, ...updates } : tv))
      )
    },
    [selectedTVBox]
  )

  const onlineCount = tvboxes.filter((tv) => tv.status === 'online').length
  const offlineCount = tvboxes.filter((tv) => tv.status === 'offline').length

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: 'absolute',
            width: '200px',
            height: '200px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%',
            top: '-100px',
            right: '-50px',
          }}
        />

        <button
          onClick={() => navigate('/menu')}
          style={{
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '44px',
            height: '44px',
            borderRadius: '14px',
            color: 'white',
            zIndex: 1,
          }}
        >
          <ArrowLeft size={22} />
        </button>

        <div style={{ zIndex: 1, flex: 1 }}>
          <h1
            style={{
              color: 'white',
              fontSize: '20px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <Tv size={24} />
            TV Box Control
          </h1>
          <p
            style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: '13px',
              marginTop: '2px',
            }}
          >
            Manage displays in your venue
          </p>
        </div>

        {/* Stats */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            zIndex: 1,
          }}
        >
          <div
            style={{
              background: 'rgba(255,255,255,0.2)',
              padding: '6px 12px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Wifi size={14} color="#4ade80" />
            <span style={{ color: 'white', fontSize: '13px', fontWeight: 600 }}>
              {onlineCount}
            </span>
          </div>
          <div
            style={{
              background: 'rgba(255,255,255,0.2)',
              padding: '6px 12px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <WifiOff size={14} color="#f87171" />
            <span style={{ color: 'white', fontSize: '13px', fontWeight: 600 }}>
              {offlineCount}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          padding: '20px',
          overflow: 'auto',
        }}
      >
        <div
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {tvboxes.map((tvbox) => (
            <TVBoxCard
              key={tvbox.id}
              tvbox={tvbox}
              onClick={() => setSelectedTVBox(tvbox)}
            />
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedTVBox && (
        <TVBoxDetailModal
          tvbox={selectedTVBox}
          onClose={() => setSelectedTVBox(null)}
          onUpdate={handleUpdate}
        />
      )}

      {/* Slider styles */}
      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        }
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        }
      `}</style>
    </div>
  )
}

export default TVBoxControlPage
