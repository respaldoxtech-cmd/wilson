import React, { useState, useEffect } from 'react';
import { Send, User, Search, Paperclip, MoreVertical, Phone, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { messageAPI } from '../services/api';

const Communication = () => {
    const [contacts, setContacts] = useState([]);
    const [activeContact, setActiveContact] = useState(null);
    const [messagesByContact, setMessagesByContact] = useState({});
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(true);
    const [showChatOnMobile, setShowChatOnMobile] = useState(false);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const response = await messageAPI.getAll();
            const allMessages = response.data;

            // Group messages by contactId
            const grouped = allMessages.reduce((acc, msg) => {
                const id = msg.contactId || 'desconocido';
                if (!acc[id]) acc[id] = [];
                acc[id].push(msg);
                return acc;
            }, {});

            // Create contacts list from grouped messages
            const contactsList = Object.keys(grouped).map(id => {
                const lastMsg = grouped[id][grouped[id].length - 1];
                return {
                    id,
                    name: `Cliente ${id.substring(0, 5)}`,
                    status: 'online',
                    lastMsg: lastMsg.content,
                    time: new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    avatar: `https://ui-avatars.com/api/?name=Cliente+${id.substring(0, 2)}&background=random`
                };
            });

            setContacts(contactsList);
            setMessagesByContact(grouped);
            if (contactsList.length > 0 && !activeContact) {
                setActiveContact(contactsList[0]);
            }
        } catch (err) {
            console.error('Error fetching messages:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (!inputValue.trim() || !activeContact) return;

        const newMsgData = {
            sender: 'admin',
            content: inputValue,
            contactId: activeContact.id
        };

        try {
            const response = await messageAPI.send(newMsgData);
            setMessagesByContact(prev => ({
                ...prev,
                [activeContact.id]: [...(prev[activeContact.id] || []), response.data]
            }));
            setInputValue('');
            // Actualizar último mensaje en la lista de contactos
            setContacts(prev => prev.map(c =>
                c.id === activeContact.id ? { ...c, lastMsg: inputValue, time: 'Ahora' } : c
            ));
        } catch (err) {
            console.error('Error sending message:', err);
        }
    };

    const handleContactSelect = (contact) => {
        setActiveContact(contact);
        setShowChatOnMobile(true);
    };

    if (loading) return <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Cargando comunicaciones...</div>;

    if (contacts.length === 0) return <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No hay mensajes nuevos.</div>;

    return (
        <div className="page-container" style={{ height: 'calc(100vh - var(--header-height))', display: 'flex', gap: '1.5rem', paddingBottom: '1rem', overflow: 'hidden', flexDirection: 'row' }}>
            {/* Sidebar - Contacts */}
            <motion.div
                className="glass-panel"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                style={{
                    width: '320px',
                    display: window.innerWidth < 768 && showChatOnMobile ? 'none' : 'flex',
                    flex: window.innerWidth < 768 && !showChatOnMobile ? 1 : '0 0 320px',
                    flexDirection: 'column',
                    padding: 0,
                    overflow: 'hidden'
                }}
            >
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                        <input
                            placeholder="Buscar..."
                            style={{ width: '100%', paddingLeft: '2.5rem', background: 'rgba(0,0,0,0.2)', border: 'none' }}
                        />
                    </div>
                </div>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {contacts.map(contact => (
                        <div
                            key={contact.id}
                            onClick={() => handleContactSelect(contact)}
                            style={{
                                padding: '1rem 1.5rem',
                                display: 'flex',
                                gap: '1rem',
                                cursor: 'pointer',
                                background: activeContact?.id === contact.id ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
                                borderLeft: activeContact?.id === contact.id ? '3px solid var(--brand-primary)' : '3px solid transparent',
                                transition: 'all 0.2s'
                            }}
                        >
                            <div style={{ position: 'relative' }}>
                                <img src={contact.avatar} alt={contact.name} style={{ width: 40, height: 40, borderRadius: '50%' }} />
                                {contact.status === 'online' && (
                                    <div style={{ position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, borderRadius: '50%', background: 'var(--accent-success)', border: '2px solid var(--bg-primary)' }} />
                                )}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{contact.name}</span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{contact.time}</span>
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {contact.lastMsg}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Main Chat Area */}
            {activeContact && (
                <motion.div
                    className="glass-panel"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                        flex: 1,
                        display: window.innerWidth < 768 && !showChatOnMobile ? 'none' : 'flex',
                        flexDirection: 'column',
                        padding: 0,
                        overflow: 'hidden'
                    }}
                >
                    {/* Chat Header */}
                    <div style={{ padding: '1rem 2rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            {window.innerWidth < 768 && (
                                <button onClick={() => setShowChatOnMobile(false)} style={{ background: 'none', border: 'none', color: 'white', padding: 0, marginRight: '0.5rem' }}>
                                    ←
                                </button>
                            )}
                            <img src={activeContact.avatar} alt={activeContact.name} style={{ width: 40, height: 40, borderRadius: '50%' }} />
                            <div>
                                <div style={{ fontWeight: 600 }}>{activeContact.name}</div>
                                <div style={{ fontSize: '0.75rem', color: activeContact.status === 'online' ? 'var(--accent-success)' : 'var(--text-secondary)' }}>
                                    {activeContact.status === 'online' ? 'En línea' : 'Desconectado'}
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)' }}>
                            <Phone size={20} style={{ cursor: 'pointer' }} />
                            <Video size={20} style={{ cursor: 'pointer' }} />
                            <MoreVertical size={20} style={{ cursor: 'pointer' }} />
                        </div>
                    </div>

                    {/* Messages */}
                    <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <AnimatePresence>
                            {messagesByContact[activeContact.id]?.map((msg) => (
                                <motion.div
                                    key={msg._id || msg.id}
                                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    style={{
                                        alignSelf: msg.sender === 'admin' ? 'flex-end' : 'flex-start',
                                        maxWidth: '70%'
                                    }}
                                >
                                    <div style={{
                                        padding: '0.75rem 1.25rem',
                                        borderRadius: '16px',
                                        background: msg.sender === 'admin' ? 'linear-gradient(135deg, var(--brand-primary), #b91c1c)' : 'var(--bg-tertiary)',
                                        color: msg.sender === 'admin' ? 'white' : 'var(--text-primary)',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                        borderBottomRightRadius: msg.sender === 'admin' ? '4px' : '16px',
                                        borderBottomLeftRadius: msg.sender === 'admin' ? '16px' : '4px'
                                    }}>
                                        {msg.content}
                                    </div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem', textAlign: msg.sender === 'admin' ? 'right' : 'left' }}>
                                        {new Date(msg.timestamp || msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Input Area */}
                    <div style={{ padding: '1.5rem', borderTop: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                <Paperclip size={20} />
                            </button>
                            <input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Escribe un mensaje..."
                                style={{ flex: 1, background: 'var(--bg-secondary)', border: 'none', padding: '1rem', borderRadius: 'var(--radius-md)' }}
                            />
                            <button
                                onClick={handleSendMessage}
                                className="btn-primary"
                                style={{ padding: '0.75rem', borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default Communication;
