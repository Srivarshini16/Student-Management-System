import { useState, useEffect } from 'react';
import socket from '../socket';

export default function NotificationBell({ currentUser, role }) {
    const [notifications, setNotifications] = useState([]);
    const [open, setOpen] = useState(false);
    const [unread, setUnread] = useState(0);

    useEffect(() => {
        // Listen for incoming notifications
        socket.on('receive_notification', (data) => {
            setNotifications(prev => [data, ...prev]);
            setUnread(prev => prev + 1);
        });

        // Listen for announcements as notifications
        socket.on('receive_announcement', (data) => {
            if (data.fromEmail !== currentUser.email) {
                setNotifications(prev => [{
                    type: 'announcement',
                    message: `📢 ${data.fromName}: ${data.message}`,
                    timestamp: data.timestamp
                }, ...prev]);
                setUnread(prev => prev + 1);
            }
        });

        return () => {
            socket.off('receive_notification');
            socket.off('receive_announcement');
        };
    }, []);

    const handleOpen = () => {
        setOpen(!open);
        if (!open) setUnread(0);
    };

    const clearAll = () => {
        setNotifications([]);
        setUnread(0);
        setOpen(false);
    };

    const formatTime = (ts) => {
        return new Date(ts).toLocaleTimeString([], {
            hour: '2-digit', minute: '2-digit'
        });
    };

    const getIcon = (type) => {
        switch (type) {
            case 'attendance_alert': return '⚠️';
            case 'announcement': return '📢';
            default: return '🔔';
        }
    };

    const getColor = (type) => {
        switch (type) {
            case 'attendance_alert': return '#FFEBEE';
            case 'announcement': return '#FFF9C4';
            default: return '#E3F2FD';
        }
    };

    return (
        <div style={styles.wrapper}>

            {/* Bell Button */}
            <div style={styles.bellWrapper} onClick={handleOpen}>
                <span style={styles.bellIcon}>🔔</span>
                {unread > 0 && (
                    <span style={styles.badge}>{unread > 9 ? '9+' : unread}</span>
                )}
            </div>

            {/* Dropdown Panel */}
            {open && (
                <div style={styles.panel}>
                    <div style={styles.panelHeader}>
                        <span style={styles.panelTitle}>Notifications</span>
                        {notifications.length > 0 && (
                            <button style={styles.clearBtn} onClick={clearAll}>
                                Clear all
                            </button>
                        )}
                    </div>

                    <div style={styles.notifList}>
                        {notifications.length === 0 ? (
                            <div style={styles.empty}>
                                <div style={styles.emptyIcon}>🔕</div>
                                <div style={styles.emptyText}>No notifications yet</div>
                            </div>
                        ) : (
                            notifications.map((notif, i) => (
                                <div
                                    key={i}
                                    style={{
                                        ...styles.notifItem,
                                        background: getColor(notif.type)
                                    }}
                                >
                                    <div style={styles.notifLeft}>
                                        <span style={styles.notifIcon}>{getIcon(notif.type)}</span>
                                        <div style={styles.notifContent}>
                                            <div style={styles.notifMessage}>{notif.message}</div>
                                            {notif.percentage && (
                                                <div style={styles.notifProgress}>
                                                    <div style={styles.progressBar}>
                                                        <div style={{
                                                            ...styles.progressFill,
                                                            width: `${notif.percentage}%`,
                                                            background: notif.percentage < 75 ? '#e53935' : '#4CAF50'
                                                        }} />
                                                    </div>
                                                    <span style={styles.progressText}>
                                                        {notif.percentage}% attendance
                                                    </span>
                                                </div>
                                            )}
                                            <div style={styles.notifTime}>
                                                {formatTime(notif.timestamp)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Admin: Send attendance alert */}
                    {role === 'admin' && (
                        <div style={styles.adminSection}>
                            <div style={styles.adminNote}>
                                💡 Attendance alerts are sent automatically when you mark attendance below 75%
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

const styles = {
    wrapper: { position: 'relative' },
    bellWrapper: {
        position: 'relative', cursor: 'pointer',
        padding: '4px', borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
    },
    bellIcon: { fontSize: '22px' },
    badge: {
        position: 'absolute', top: '-4px', right: '-4px',
        background: '#e53935', color: 'white',
        borderRadius: '50%', width: '18px', height: '18px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '10px', fontWeight: 'bold', border: '2px solid white'
    },
    panel: {
        position: 'absolute', top: '36px', right: '0',
        width: '320px', background: 'white',
        borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        zIndex: 1000, overflow: 'hidden'
    },
    panelHeader: {
        padding: '14px 16px', background: '#075E54',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
    },
    panelTitle: { color: 'white', fontWeight: 'bold', fontSize: '15px' },
    clearBtn: {
        background: 'rgba(255,255,255,0.2)', color: 'white',
        border: 'none', padding: '4px 10px', borderRadius: '12px',
        cursor: 'pointer', fontSize: '12px'
    },
    notifList: { maxHeight: '360px', overflowY: 'auto' },
    empty: {
        padding: '40px 20px', textAlign: 'center'
    },
    emptyIcon: { fontSize: '36px', marginBottom: '8px' },
    emptyText: { color: '#888', fontSize: '13px' },
    notifItem: {
        padding: '12px 16px',
        borderBottom: '1px solid #f0f0f0'
    },
    notifLeft: { display: 'flex', gap: '10px', alignItems: 'flex-start' },
    notifIcon: { fontSize: '20px', flexShrink: 0, marginTop: '2px' },
    notifContent: { flex: 1 },
    notifMessage: {
        fontSize: '13px', color: '#333',
        lineHeight: '1.4', marginBottom: '4px'
    },
    notifProgress: { marginTop: '6px' },
    progressBar: {
        height: '6px', background: '#e0e0e0',
        borderRadius: '3px', overflow: 'hidden', marginBottom: '4px'
    },
    progressFill: {
        height: '100%', borderRadius: '3px',
        transition: 'width 0.3s ease'
    },
    progressText: { fontSize: '11px', color: '#666' },
    notifTime: { fontSize: '11px', color: '#888', marginTop: '4px' },
    adminSection: {
        padding: '12px 16px',
        borderTop: '1px solid #f0f0f0',
        background: '#f9f9f9'
    },
    adminNote: {
        fontSize: '12px', color: '#666',
        lineHeight: '1.4'
    }
};