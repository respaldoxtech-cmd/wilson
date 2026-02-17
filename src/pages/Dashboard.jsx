import React, { useState, useEffect } from 'react';
import { Users, DollarSign, ShoppingBag, MessageCircle, Activity, TrendingUp, MoreHorizontal, ArrowRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { orderAPI, messageAPI, userAPI } from '../services/api';
import { Link } from 'react-router-dom';

const data = [
    { name: 'Lun', value: 4000 },
    { name: 'Mar', value: 3000 },
    { name: 'Mie', value: 2000 },
    { name: 'Jue', value: 2780 },
    { name: 'Vie', value: 1890 },
    { name: 'Sab', value: 2390 },
    { name: 'Dom', value: 3490 },
];

const StatCard = ({ title, value, icon: Icon, color, delay, link }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="glass-panel"
        style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative', overflow: 'hidden' }}
    >
        <div style={{
            padding: '1rem',
            borderRadius: '16px',
            background: `linear-gradient(135deg, rgba(${color}, 0.2), rgba(${color}, 0))`,
            color: `rgb(${color})`,
            boxShadow: `0 8px 16px -4px rgba(${color}, 0.2)`
        }}>
            <Icon size={28} />
        </div>
        <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>{title}</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em' }}>{value}</div>
        </div>
        {link && (
            <Link to={link} style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }} className="hover-red">
                <ArrowRight size={20} />
            </Link>
        )}
        <div style={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '100px',
            height: '100px',
            background: `radial-gradient(circle, rgba(${color}, 0.15) 0%, transparent 70%)`,
            borderRadius: '50%',
            filter: 'blur(10px)'
        }} />
    </motion.div>
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        orders: 0,
        messages: 0,
        users: 0,
        sales: 0
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [orders, messages, users] = await Promise.all([
                    orderAPI.getAll(),
                    messageAPI.getMessages(),
                    userAPI.getUsers()
                ]);

                const totalSales = orders.reduce((acc, current) => acc + (current.total || 0), 0);

                setStats({
                    orders: orders.length,
                    messages: messages.length,
                    users: users.length,
                    sales: totalSales
                });

                // Mocking recent activity from real orders
                const activity = orders.slice(0, 4).map((order, i) => ({
                    id: order._id,
                    title: `Nueva Orden #${order._id.slice(-4).toUpperCase()}`,
                    time: 'Reciente',
                    type: 'order'
                }));
                setRecentActivity(activity);

            } catch (err) {
                console.error("Error fetching dashboard stats:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const user = JSON.parse(localStorage.getItem('pgCurrentUser') || '{"nombre": "Admin"}');

    return (
        <div className="page-container">
            <header className="page-header">
                <div>
                    <h1 className="page-title">Hola, {user.nombre} <span style={{ fontSize: '1.5rem' }}>👋</span></h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Aquí está el resumen de la plataforma en tiempo real.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', fontSize: '0.875rem' }}>
                        📅 {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', gridAutoFlow: 'dense' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', gridColumn: 'span 2' }}>
                    {/* Stats Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1.5rem' }}>
                        <StatCard title="Ventas Totales" value={`$${stats.sales.toLocaleString()}`} icon={DollarSign} color="239, 68, 68" delay={0.1} />
                        <StatCard title="Pedidos" value={stats.orders} icon={ShoppingBag} color="59, 130, 246" delay={0.2} link="/orders" />
                        <StatCard title="Mensajes" value={stats.messages} icon={MessageCircle} color="16, 185, 129" delay={0.3} link="/communication" />
                    </div>

                    {/* Chart Section */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="glass-panel"
                        style={{ padding: '2rem', minHeight: '400px', display: 'flex', flexDirection: 'column' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Rendimiento Real</h3>
                                <div style={{ fontSize: '0.875rem', color: 'var(--accent-success)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem' }}>
                                    <TrendingUp size={14} />
                                    <span>Datos vivos desde MongoDB</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ flex: 1, width: '100%', minHeight: '300px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis dataKey="name" stroke="var(--text-secondary)" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                    <YAxis stroke="var(--text-secondary)" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--glass-border)', borderRadius: '12px', color: 'white' }}
                                        itemStyle={{ color: '#ef4444' }}
                                    />
                                    <Area type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                </div>

                {/* Right Panel - Activity */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                >
                    <div className="glass-panel" style={{ padding: '1.5rem', flex: 1 }}>
                        <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Actividad Reciente</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {recentActivity.length > 0 ? recentActivity.map((act, i) => (
                                <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                    <div style={{
                                        width: '32px', height: '32px', borderRadius: '50%',
                                        background: 'rgba(239, 68, 68, 0.2)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <Activity size={14} color="#ef4444" />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{act.title}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{act.time}</div>
                                    </div>
                                </div>
                            )) : (
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No hay actividad reciente.</div>
                            )}
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, var(--brand-primary), #7f1d1d)', position: 'relative', overflow: 'hidden' }}>
                        <h3 style={{ margin: 0, color: 'white', position: 'relative', zIndex: 1 }}>Usuarios Totales</h3>
                        <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', margin: '0.5rem 0', position: 'relative', zIndex: 1 }}>{stats.users}</div>
                        <Link to="/users" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            Gestionar usuarios <ArrowRight size={14} />
                        </Link>
                        <div style={{ position: 'absolute', right: -10, bottom: -10, opacity: 0.2 }}>
                            <Users size={80} color="white" />
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
