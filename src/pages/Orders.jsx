import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, Eye } from 'lucide-react';
import { orderAPI } from '../services/api';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await orderAPI.getAll();
            setOrders(response.data);
        } catch (err) {
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <header className="page-header">
                <h1 className="page-title">Órdenes de Compra</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Valida pagos y gestiona pedidos.</p>
            </header>

            <div className="glass-panel">
                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando órdenes...</div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--glass-border)' }}>
                            <tr>
                                <th style={{ padding: '1rem' }}>Orden ID</th>
                                <th style={{ padding: '1rem' }}>Cliente</th>
                                <th style={{ padding: '1rem' }}>Fecha</th>
                                <th style={{ padding: '1rem' }}>Total</th>
                                <th style={{ padding: '1rem' }}>Estado</th>
                                <th style={{ padding: '1rem', textAlign: 'right' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                    <td style={{ padding: '1rem', fontWeight: 600 }}>#{order._id.substring(0, 8)}</td>
                                    <td style={{ padding: '1rem' }}>{order.customer}</td>
                                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{new Date(order.date).toLocaleDateString()}</td>
                                    <td style={{ padding: '1rem' }}>${order.total.toFixed(2)}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '999px',
                                            fontSize: '0.75rem',
                                            background: order.status === 'Pagado' || order.status === 'Enviado' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                                            color: order.status === 'Pagado' || order.status === 'Enviado' ? 'var(--accent-success)' : 'var(--accent-warning)',
                                            fontWeight: 600
                                        }}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        {order.status === 'Pendiente' && (
                                            <button className="btn-primary" style={{ fontSize: '0.75rem', marginRight: '0.5rem', padding: '0.25rem 0.75rem' }}>
                                                Validar Pago
                                            </button>
                                        )}
                                        <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No hay órdenes registradas.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Orders;
