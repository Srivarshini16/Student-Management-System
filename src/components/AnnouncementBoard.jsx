import { useState, useEffect, useRef } from 'react';
import { getAnnouncements, saveMessage } from '../api';
import socket from '../socket';

export default function AnnouncementBoard({ currentUser, role }) {
    const [announcements, setAnnouncements] = useState([]);
    const [text, setText] = useState('');
    const bottomRef = useRef(null);

    useEffect(() => {
        loadAnnouncements();

        socket.on('receive_announcement', (data) => {
            setAnnouncements(prev => [...prev, data]);
        });

        return () => socket.off('receive_announcement');
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [announcements]);

    const loadAnnouncements = async () => {
        try {
            const res = await getAnnouncements();
            setAnnouncements(res.data);
        } catch (err) {
            console.error('Failed to load announcements');
        }
    };

    const sendAnnouncement = async () => {
        if (!text.trim()) return;

        const data = {
            fromEmail: currentUser.email,
            fromName: currentUser.name,
            fromPicture: currentUser.picture,
            message: text.trim()
        };

        socket.emit('announcement', data);
        await saveMessage({ ...data, toEmail: 'all', type: 'announcement' });
        setText('');
    };

    const formatTime = (ts) => {
        const d = new Date(ts);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (ts) => {
        return new Date(ts).toLocaleDateString([], {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    };

    return (
        <div style={styles.container}>

            {/* Header */}
            <div style={styles.header}>
                <div style={styles.headerLeft}>
                    <div style={styles.headerAvatar}>📢</div>
                    <div>
                        <div style={styles.headerName}>Announcements</div>
                        <div style={styles.headerSub}>Broadcast to all students</div>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div style={styles.messages}>
                {announcements.length === 0 && (
                    <div style={styles.noMsg}>No announcements yet</div>
                )}
                {announcements.map((ann, i) => (
                    <div key={i} style={styles.announcementBubble}>
                        <div style={styles.annHeader}>
                            <img
                                src={ann.fromPicture || ''}
                                alt=""
                                style={styles.annAvatar}
                                onError={(e) => e.target.style.display = 'none'}
                            />
                            <span style={styles.annName}>{ann.fromName}</span>
                            <span style={styles.annBadge}>👑 Admin</span>
                            <span style={styles.annTime}>{formatTime(ann.timestamp || ann.createdAt)}</span>
                        </div>
                        <div style={styles.annText}>{ann.message}</div>
                        <div style={styles.annDate}>{formatDate(ann.timestamp || ann.createdAt)}</div>
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            {/* Input — Admin Only */}
            {role === 'admin' && (
                <div style={styles.inputArea}>
                    <input
                        style={styles.input}
                        value={text}
                        onChange={e => setText(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && sendAnnouncement()}
                        placeholder="Type an announcement..."
                    />
                    <button style={styles.sendBtn} onClick={sendAnnouncement}>
                        Send 📢
                    </button>
                </div>
            )}

            {role !== 'admin' && (
                <div style={styles.readOnly}>
                    Only admins can post announcements
                </div>
            )}
        </div>
    );
}

const styles = {
    container: { display: 'flex', flexDirection: 'column', height: '100%' },
    header: {
        padding: '12px 16px', background: '#075E54',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
    },
    headerLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
    headerAvatar: {
        width: '40px', height: '40px', borderRadius: '50%',
        background: 'rgba(255,255,255,0.2)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', fontSize: '20px'
    },
    headerName: { color: 'white', fontWeight: 'bold', fontSize: '15px' },
    headerSub: { color: '#a8d5a2', fontSize: '12px' },
    messages: { flex: 1, overflowY: 'auto', padding: '16px', background: '#ECE5DD' },
    noMsg: { textAlign: 'center', color: '#888', padding: '40px', fontSize: '14px' },
    announcementBubble: {
        background: '#FFF9C4', border: '1px solid #F9A825',
        borderRadius: '8px', padding: '12px 16px',
        marginBottom: '12px', maxWidth: '80%', margin: '0 auto 12px'
    },
    annHeader: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' },
    annAvatar: { width: '24px', height: '24px', borderRadius: '50%' },
    annName: { fontWeight: 'bold', fontSize: '13px', color: '#333' },
    annBadge: {
        fontSize: '11px', background: '#F9A825',
        padding: '2px 6px', borderRadius: '4px', color: '#333'
    },
    annTime: { fontSize: '11px', color: '#888', marginLeft: 'auto' },
    annText: { fontSize: '14px', color: '#333', lineHeight: '1.5' },
    annDate: { fontSize: '11px', color: '#888', marginTop: '6px', textAlign: 'right' },
    inputArea: {
        padding: '12px 16px', background: '#f0f0f0',
        display: 'flex', gap: '8px', borderTop: '1px solid #ddd'
    },
    input: {
        flex: 1, padding: '10px 14px', borderRadius: '24px',
        border: '1px solid #ddd', fontSize: '14px', outline: 'none'
    },
    sendBtn: {
        padding: '10px 20px', background: '#075E54',
        color: 'white', border: 'none', borderRadius: '24px',
        cursor: 'pointer', fontSize: '14px', fontWeight: 'bold'
    },
    readOnly: {
        padding: '14px', textAlign: 'center',
        color: '#888', fontSize: '13px',
        background: '#f0f0f0', borderTop: '1px solid #ddd'
    }
};