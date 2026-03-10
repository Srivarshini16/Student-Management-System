export default function ChatSidebar({
    currentUser, onlineUsers, contacts,
    selectedChat, onSelectChat, onSelectAnnouncement,
    announcementCount, role
}) {
    return (
        <div style={styles.sidebar}>

            {/* Header */}
            <div style={styles.sidebarHeader}>
                <span style={styles.sidebarTitle}>💬 Messages</span>
                <span style={styles.onlineCount}>{onlineUsers.length} online</span>
            </div>

            {/* Announcements */}
            <div
                style={{
                    ...styles.contactItem,
                    background: selectedChat === 'announcement' ? '#DCF8C6' : '#fff'
                }}
                onClick={() => onSelectAnnouncement()}
            >
                <div style={styles.avatar}>📢</div>
                <div style={styles.contactInfo}>
                    <div style={styles.contactName}>Announcements</div>
                    <div style={styles.lastMessage}>Group notices & alerts</div>
                </div>
                {announcementCount > 0 && (
                    <div style={styles.badge}>{announcementCount}</div>
                )}
            </div>

            <div style={styles.divider}>Online Now</div>

            {/* Online Users */}
            {onlineUsers
                .filter(u => u.email !== currentUser.email)
                .map(user => (
                    <div
                        key={user.email}
                        style={{
                            ...styles.contactItem,
                            background: selectedChat?.email === user.email ? '#DCF8C6' : '#fff'
                        }}
                        onClick={() => onSelectChat(user)}
                    >
                        <div style={styles.avatarWrapper}>
                            {user.picture
                                ? <img src={user.picture} alt="" style={styles.avatarImg} />
                                : <div style={{ ...styles.avatarImg, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '14px', borderRadius: '50%' }}>
                                    {(user.name || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                </div>
                            }
                            <span style={styles.onlineDot} />
                        </div>
                        <div style={styles.contactInfo}>
                            <div style={styles.contactName}>{user.name}</div>
                            <div style={styles.lastMessage}>
                                {user.role === 'admin' ? '👑 Admin' : '🎓 Student'}
                            </div>
                        </div>
                    </div>
                ))}

            {/* Previous Contacts (offline) */}
            {contacts
                .filter(c => !onlineUsers.find(u => u.email === c.email) && c.email !== currentUser.email)
                .map(contact => (
                    <div
                        key={contact.email}
                        style={{
                            ...styles.contactItem,
                            background: selectedChat?.email === contact.email ? '#DCF8C6' : '#fff'
                        }}
                        onClick={() => onSelectChat(contact)}
                    >
                        <div style={styles.avatar}>
                            {contact.name?.charAt(0).toUpperCase()}
                        </div>
                        <div style={styles.contactInfo}>
                            <div style={styles.contactName}>{contact.name}</div>
                            <div style={styles.lastMessage}>{contact.lastMessage || 'No messages yet'}</div>
                        </div>
                    </div>
                ))}

            {onlineUsers.filter(u => u.email !== currentUser.email).length === 0 &&
                contacts.length === 0 && (
                    <div style={styles.noContacts}>No users online yet</div>
                )}
        </div>
    );
}

const styles = {
    sidebar: {
        width: '280px', minWidth: '280px',
        background: '#f0f0f0', borderRight: '1px solid #ddd',
        display: 'flex', flexDirection: 'column',
        height: '100%', overflowY: 'auto'
    },
    sidebarHeader: {
        padding: '16px', background: '#075E54',
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center'
    },
    sidebarTitle: { color: 'white', fontWeight: 'bold', fontSize: '16px' },
    onlineCount: {
        color: '#a8d5a2', fontSize: '12px',
        background: 'rgba(255,255,255,0.1)',
        padding: '2px 8px', borderRadius: '10px'
    },
    divider: {
        padding: '6px 16px', fontSize: '11px',
        color: '#888', background: '#e8e8e8',
        fontWeight: 'bold', textTransform: 'uppercase'
    },
    contactItem: {
        display: 'flex', alignItems: 'center',
        padding: '12px 16px', cursor: 'pointer',
        borderBottom: '1px solid #e8e8e8', gap: '12px'
    },
    avatar: {
        width: '42px', height: '42px', borderRadius: '50%',
        background: '#075E54', color: 'white',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '18px', flexShrink: 0
    },
    avatarWrapper: { position: 'relative', flexShrink: 0 },
    avatarImg: { width: '42px', height: '42px', borderRadius: '50%' },
    onlineDot: {
        position: 'absolute', bottom: '2px', right: '2px',
        width: '10px', height: '10px', borderRadius: '50%',
        background: '#25D366', border: '2px solid white'
    },
    contactInfo: { flex: 1, overflow: 'hidden' },
    contactName: {
        fontSize: '14px', fontWeight: 'bold',
        color: '#333', whiteSpace: 'nowrap',
        overflow: 'hidden', textOverflow: 'ellipsis'
    },
    lastMessage: {
        fontSize: '12px', color: '#888',
        whiteSpace: 'nowrap', overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    badge: {
        background: '#25D366', color: 'white',
        borderRadius: '50%', width: '20px', height: '20px',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: '11px', fontWeight: 'bold'
    },
    noContacts: {
        padding: '20px', textAlign: 'center',
        color: '#888', fontSize: '13px'
    }
};