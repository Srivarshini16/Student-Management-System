import { useState, useEffect, useRef } from 'react';
import { getConversation, saveMessage, uploadFile } from '../api';
import socket from '../socket';

export default function ChatWindow({ currentUser, selectedChat }) {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const [uploading, setUploading] = useState(false);
    const fileRef = useRef(null);
    const bottomRef = useRef(null);

    useEffect(() => {
        if (!selectedChat) return;
        loadConversation();

        const handleReceiveMessage = (data) => {
            const isRelevant =
                (data.fromEmail === selectedChat.email && data.toEmail === currentUser.email) ||
                (data.fromEmail === currentUser.email && data.toEmail === selectedChat.email);
            if (isRelevant) {
                setMessages(prev => [...prev, data]);
            }
        };

        socket.on('receive_message', handleReceiveMessage);

        return () => socket.off('receive_message', handleReceiveMessage);
    }, [selectedChat]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const loadConversation = async () => {
        try {
            const res = await getConversation(currentUser.email, selectedChat.email);
            setMessages(res.data);
        } catch (err) {
            console.error('Failed to load conversation');
        }
    };

    const sendMessage = async (fileUrl = null, fileName = null) => {
        if (!text.trim() && !fileUrl) return;

        const data = {
            fromEmail: currentUser.email,
            fromName: currentUser.name,
            fromPicture: currentUser.picture,
            toEmail: selectedChat.email,
            message: text.trim(),
            fileUrl,
            fileName,
            type: 'private'
        };

        socket.emit('private_message', data);
        await saveMessage(data);
        setText('');
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await uploadFile(formData);
            await sendMessage(res.data.fileUrl, res.data.fileName);
        } catch (err) {
            alert('File upload failed');
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    const formatTime = (ts) => {
        return new Date(ts).toLocaleTimeString([], {
            hour: '2-digit', minute: '2-digit'
        });
    };

    const isImage = (url) => {
        if (!url) return false;
        return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
    };

    if (!selectedChat) {
        return (
            <div style={styles.empty}>
                <div style={styles.emptyIcon}>💬</div>
                <div style={styles.emptyText}>Select a contact to start chatting</div>
                <div style={styles.emptySubText}>Your messages are private and secure</div>
            </div>
        );
    }

    return (
        <div style={styles.container}>

            {/* Header */}
            <div style={styles.header}>
                <div style={styles.headerLeft}>
                    {selectedChat.picture ? (
                        <img src={selectedChat.picture} alt="" style={styles.headerAvatar} />
                    ) : (
                        <div style={styles.headerAvatarText}>
                            {selectedChat.name?.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div>
                        <div style={styles.headerName}>{selectedChat.name}</div>
                        <div style={styles.headerSub}>
                            👑 Admin
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div style={styles.messages}>
                {messages.length === 0 && (
                    <div style={styles.noMsg}>
                        No messages yet. Say hello! 👋
                    </div>
                )}
                {messages.map((msg, i) => {
                    const isMine = msg.fromEmail === currentUser.email;
                    return (
                        <div key={i} style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start', marginBottom: '8px' }}>
                            {!isMine && (
                                <img
                                    src={msg.fromPicture}
                                    alt=""
                                    style={styles.msgAvatar}
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                            )}
                            <div style={isMine ? styles.myBubble : styles.theirBubble}>
                                {!isMine && (
                                    <div style={styles.senderName}>{msg.fromName}</div>
                                )}
                                {msg.message && (
                                    <div style={styles.msgText}>{msg.message}</div>
                                )}
                                {msg.fileUrl && isImage(msg.fileUrl) && (
                                    <img
                                        src={msg.fileUrl}
                                        alt={msg.fileName}
                                        style={styles.msgImage}
                                        onClick={() => window.open(msg.fileUrl, '_blank')}
                                    />
                                )}
                                {msg.fileUrl && !isImage(msg.fileUrl) && (
                                    <a href={msg.fileUrl} target="_blank" rel="noreferrer" style={styles.fileLink}>
                                        📎 {msg.fileName || 'Download File'}
                                    </a>
                                )}
                                <div style={styles.msgTime}>
                                    {formatTime(msg.timestamp || msg.createdAt)}
                                    {isMine && <span style={styles.tick}> ✓✓</span>}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>

            {/* Input Area */}
            <div style={styles.inputArea}>
                <input
                    type="file"
                    ref={fileRef}
                    style={{ display: 'none' }}
                    onChange={handleFileUpload}
                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                />
                <button
                    style={styles.attachBtn}
                    onClick={() => fileRef.current.click()}
                    disabled={uploading}
                    title="Attach file"
                >
                    {uploading ? '⏳' : '📎'}
                </button>
                <input
                    style={styles.input}
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                />
                <button
                    style={styles.sendBtn}
                    onClick={() => sendMessage()}
                    disabled={!text.trim() && !uploading}
                >
                    ➤
                </button>
            </div>
        </div>
    );
}

const styles = {
    container: { display: 'flex', flexDirection: 'column', height: '100%' },
    empty: {
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: '#ECE5DD', height: '100%'
    },
    emptyIcon: { fontSize: '60px', marginBottom: '16px' },
    emptyText: { fontSize: '18px', color: '#555', marginBottom: '8px' },
    emptySubText: { fontSize: '13px', color: '#888' },
    header: {
        padding: '12px 16px', background: '#075E54',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
    },
    headerLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
    headerAvatar: { width: '40px', height: '40px', borderRadius: '50%' },
    headerAvatarText: {
        width: '40px', height: '40px', borderRadius: '50%',
        background: 'rgba(255,255,255,0.2)', color: 'white',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '18px', fontWeight: 'bold'
    },
    headerName: { color: 'white', fontWeight: 'bold', fontSize: '15px' },
    headerSub: { color: '#a8d5a2', fontSize: '12px' },
    messages: {
        flex: 1, overflowY: 'auto', padding: '16px',
        background: '#ECE5DD', display: 'flex', flexDirection: 'column'
    },
    noMsg: { textAlign: 'center', color: '#888', padding: '40px', fontSize: '14px' },
    msgAvatar: {
        width: '28px', height: '28px', borderRadius: '50%',
        marginRight: '6px', alignSelf: 'flex-end', flexShrink: 0
    },
    myBubble: {
        background: '#DCF8C6', borderRadius: '8px 0px 8px 8px',
        padding: '8px 12px', maxWidth: '65%', boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
    },
    theirBubble: {
        background: 'white', borderRadius: '0px 8px 8px 8px',
        padding: '8px 12px', maxWidth: '65%', boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
    },
    senderName: { fontSize: '12px', color: '#075E54', fontWeight: 'bold', marginBottom: '4px' },
    msgText: { fontSize: '14px', color: '#333', lineHeight: '1.5', wordBreak: 'break-word' },
    msgImage: {
        maxWidth: '200px', borderRadius: '6px',
        marginTop: '4px', cursor: 'pointer', display: 'block'
    },
    fileLink: {
        display: 'block', marginTop: '4px', color: '#075E54',
        fontSize: '13px', textDecoration: 'none', fontWeight: 'bold'
    },
    msgTime: { fontSize: '11px', color: '#888', marginTop: '4px', textAlign: 'right' },
    tick: { color: '#4FC3F7' },
    inputArea: {
        padding: '12px 16px', background: '#f0f0f0',
        display: 'flex', gap: '8px', alignItems: 'center',
        borderTop: '1px solid #ddd'
    },
    attachBtn: {
        background: 'none', border: 'none', fontSize: '22px',
        cursor: 'pointer', padding: '4px', borderRadius: '50%'
    },
    input: {
        flex: 1, padding: '10px 14px', borderRadius: '24px',
        border: '1px solid #ddd', fontSize: '14px',
        outline: 'none', background: 'white'
    },
    sendBtn: {
        width: '42px', height: '42px', borderRadius: '50%',
        background: '#075E54', color: 'white', border: 'none',
        cursor: 'pointer', fontSize: '18px', display: 'flex',
        alignItems: 'center', justifyContent: 'center'
    }
};