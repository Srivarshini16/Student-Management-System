import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getContacts } from '../api';
import socket from '../socket';
import ChatSidebar from '../components/ChatSidebar';
import ChatWindow from '../components/ChatWindow';
import AnnouncementBoard from '../components/AnnouncementBoard';
import NotificationBell from '../components/NotificationBell';

export default function ChatPage({ user, role, onLogout }) {
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [showAnnouncement, setShowAnnouncement] = useState(false);
    const [announcementCount, setAnnouncementCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        // Connect socket
        socket.connect();

        // Join with user info
        socket.emit('user_join', {
            email: user.email,
            name: user.name,
            picture: user.picture,
            role: role
        });

        // Listen for online users
        socket.on('online_users', (users) => {
            setOnlineUsers(users);
        });

        // Count new announcements
        socket.on('receive_announcement', (data) => {
            if (data.fromEmail !== user.email && !showAnnouncement) {
                setAnnouncementCount(prev => prev + 1);
            }
        });

        // Load previous contacts
        loadContacts();

        return () => {
            socket.off('online_users');
            socket.off('receive_announcement');
            socket.disconnect();
        };
    }, []);

    const loadContacts = async () => {
        try {
            const res = await getContacts(user.email);
            setContacts(res.data);
        } catch (err) {
            console.error('Failed to load contacts');
        }
    };

    const handleSelectChat = (contact) => {
        setSelectedChat(contact);
        setShowAnnouncement(false);
    };

    const handleSelectAnnouncement = () => {
        setShowAnnouncement(true);
        setSelectedChat(null);
        setAnnouncementCount(0);
    };

    return (
        <div style={styles.page}>

            {/* Top Navbar */}
            <div style={styles.navbar}>
                <div style={styles.navLeft}>
                    <button style={styles.backBtn} onClick={() => navigate('/')}>
                        ← Back
                    </button>
                    <span style={styles.navTitle}>💬 Student Portal Chat</span>
                </div>
                <div style={styles.navRight}>
                    <div style={styles.onlineIndicator}>
                        <span style={styles.onlineDot} />
                        {onlineUsers.length} online
                    </div>
                    <NotificationBell currentUser={user} role={role} />
                    {user.picture
                        ? <img src={user.picture} alt="" style={styles.navAvatar} />
                        : <div style={{ ...styles.navAvatar, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '13px', borderRadius: '50%' }}>
                            {(user.name || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                    }
                    <span style={styles.navName}>{user.name}</span>
                    <span style={role === 'admin' ? styles.adminBadge : styles.userBadge}>
                        {role === 'admin' ? '👑 Admin' : '🎓 Student'}
                    </span>
                    <button style={styles.logoutBtn} onClick={onLogout}>
                        Logout
                    </button>
                </div>
            </div>

            {/* Chat Layout */}
            <div style={styles.chatLayout}>

                {/* Sidebar */}
                <ChatSidebar
                    currentUser={user}
                    onlineUsers={onlineUsers}
                    contacts={contacts}
                    selectedChat={selectedChat}
                    onSelectChat={handleSelectChat}
                    onSelectAnnouncement={handleSelectAnnouncement}
                    announcementCount={announcementCount}
                    role={role}
                />

                {/* Main Chat Area */}
                <div style={styles.mainArea}>
                    {showAnnouncement ? (
                        <AnnouncementBoard currentUser={user} role={role} />
                    ) : (
                        <ChatWindow currentUser={user} selectedChat={selectedChat} />
                    )}
                </div>

            </div>
        </div>
    );
}

const styles = {
    page: {
        display: 'flex', flexDirection: 'column',
        height: '100vh', background: '#f0f0f0'
    },
    navbar: {
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', padding: '10px 20px',
        background: '#075E54', boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        flexShrink: 0
    },
    navLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
    backBtn: {
        padding: '6px 14px', background: 'rgba(255,255,255,0.15)',
        color: 'white', border: 'none', borderRadius: '6px',
        cursor: 'pointer', fontSize: '13px'
    },
    navTitle: { color: 'white', fontWeight: 'bold', fontSize: '16px' },
    navRight: { display: 'flex', alignItems: 'center', gap: '12px' },
    onlineIndicator: {
        display: 'flex', alignItems: 'center',
        gap: '6px', color: '#a8d5a2', fontSize: '13px'
    },
    onlineDot: {
        width: '8px', height: '8px', borderRadius: '50%',
        background: '#25D366', display: 'inline-block'
    },
    navAvatar: { width: '32px', height: '32px', borderRadius: '50%' },
    navName: { color: 'white', fontSize: '14px', fontWeight: 'bold' },
    adminBadge: {
        fontSize: '11px', background: '#FFA000',
        color: 'white', borderRadius: '4px',
        padding: '2px 8px'
    },
    userBadge: {
        fontSize: '11px', background: '#1976D2',
        color: 'white', borderRadius: '4px',
        padding: '2px 8px'
    },
    logoutBtn: {
        padding: '6px 14px', background: '#e53935',
        color: 'white', border: 'none', borderRadius: '6px',
        cursor: 'pointer', fontSize: '13px'
    },
    chatLayout: {
        display: 'flex', flex: 1,
        overflow: 'hidden'
    },
    mainArea: {
        flex: 1, display: 'flex',
        flexDirection: 'column', overflow: 'hidden'
    }
};