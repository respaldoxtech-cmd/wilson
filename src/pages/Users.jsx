import React, { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import { User, Shield, Trash2, ShieldAlert, CheckCircle, Search, RefreshCw, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await userAPI.getUsers();
            setUsers(data);
            setError(null);
        } catch (err) {
            setError('Error al cargar usuarios');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleUpdateRole = async (id, newRole) => {
        try {
            await userAPI.updateRole(id, newRole);
            setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u));
        } catch (err) {
            alert('Error al actualizar rol');
        }
    };

    const handleDeleteUser = async (id) => {
        if (!confirm('¿Estás seguro de eliminar este usuario?')) return;
        try {
            await userAPI.deleteUser(id);
            setUsers(users.filter(u => u._id !== id));
        } catch (err) {
            alert('Error al eliminar usuario');
        }
    };

    const filteredUsers = users.filter(u =>
        u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ paddingBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Gestión de <span style={{ color: 'var(--brand-primary)' }}>Usuarios</span></h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Administra permisos y accesos de la plataforma</p>
                </div>
                <button
                    onClick={fetchUsers}
                    style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--glass-border)',
                        color: 'white',
                        padding: '0.75rem',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <RefreshCw size={18} />
                </button>
            </div>

            {/* Stats Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <div style={{ color: 'var(--brand-primary)', marginBottom: '0.5rem' }}><User size={24} /></div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{users.length}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Usuarios Totales</div>
                </div>
                <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <div style={{ color: '#fbbf24', marginBottom: '0.5rem' }}><Shield size={24} /></div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{users.filter(u => u.role === 'admin').length}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Administradores</div>
                </div>
                <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <div style={{ color: '#10b981', marginBottom: '0.5rem' }}><UserCheck size={24} /></div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{users.filter(u => u.role === 'user').length}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Clientes</div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="glass-card" style={{ padding: '1rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Search size={20} color="var(--text-secondary)" />
                <input
                    type="text"
                    placeholder="Buscar por nombre o email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        width: '100%',
                        outline: 'none',
                        fontSize: '1rem'
                    }}
                />
            </div>

            {/* Users Table */}
            <div className="glass-card" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                            <th style={{ padding: '1.25rem' }}>Usuario</th>
                            <th style={{ padding: '1.25rem' }}>Email</th>
                            <th style={{ padding: '1.25rem' }}>Rol</th>
                            <th style={{ padding: '1.25rem' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence mode="popLayout">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                        Cargando usuarios...
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                        No se encontraron usuarios.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map(user => (
                                    <motion.tr
                                        key={user._id}
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                                    >
                                        <td style={{ padding: '1.25rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div style={{
                                                    width: 36,
                                                    height: 36,
                                                    borderRadius: '50%',
                                                    background: user.role === 'admin' ? 'var(--brand-primary)' : 'rgba(255,255,255,0.1)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    {user.role === 'admin' ? <Shield size={18} color="white" /> : <User size={18} color="white" />}
                                                </div>
                                                <span style={{ fontWeight: 600 }}>{user.nombre}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.25rem', color: 'var(--text-secondary)' }}>{user.email}</td>
                                        <td style={{ padding: '1.25rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '20px',
                                                fontSize: '0.75rem',
                                                fontWeight: 700,
                                                background: user.role === 'admin' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255,255,255,0.1)',
                                                color: user.role === 'admin' ? 'var(--brand-primary)' : 'var(--text-secondary)',
                                                border: `1px solid ${user.role === 'admin' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.1)'}`
                                            }}>
                                                {user.role.toUpperCase()}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1.25rem' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    onClick={() => handleUpdateRole(user._id, user.role === 'admin' ? 'user' : 'admin')}
                                                    style={{
                                                        background: 'none',
                                                        border: '1px solid var(--glass-border)',
                                                        color: '#fbbf24',
                                                        padding: '0.5rem',
                                                        borderRadius: '8px',
                                                        cursor: 'pointer'
                                                    }}
                                                    title="Cambiar Rol"
                                                >
                                                    <ShieldAlert size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(user._id)}
                                                    style={{
                                                        background: 'none',
                                                        border: '1px solid var(--glass-border)',
                                                        color: 'var(--brand-primary)',
                                                        padding: '0.5rem',
                                                        borderRadius: '8px',
                                                        cursor: 'pointer'
                                                    }}
                                                    title="Eliminar"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Users;
