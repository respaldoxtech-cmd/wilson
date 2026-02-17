import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Upload, Box, Shirt } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { productAPI } from '../services/api';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [generating3D, setGenerating3D] = useState(false);

    // Form State
    const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '', variants: [], has3D: false, category: 'General' });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await productAPI.getAll();
            setProducts(response.data);
        } catch (err) {
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddProduct = async () => {
        try {
            const productData = {
                ...newProduct,
                price: Number(newProduct.price),
                stock: Number(newProduct.stock)
            };
            await productAPI.create(productData);
            setIsModalOpen(false);
            setNewProduct({ name: '', price: '', stock: '', variants: [], has3D: false, category: 'General' });
            fetchProducts();
        } catch (err) {
            console.error('Error adding product:', err);
            alert('Error al agregar producto');
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!confirm('¿Estás seguro de eliminar este producto?')) return;
        try {
            await productAPI.delete(id);
            fetchProducts();
        } catch (err) {
            console.error('Error deleting product:', err);
        }
    };

    const toggle3D = () => {
        setGenerating3D(true);
        setTimeout(() => {
            setGenerating3D(false);
            setNewProduct(prev => ({ ...prev, has3D: true }));
        }, 2000); // Simulate processing
    };

    return (
        <div className="page-container">
            <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="page-title">Inventario Avanzado</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Gestión de productos con soporte 3D.</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={18} />
                    Agregar Producto
                </button>
            </header>

            <motion.div
                className="glass-panel"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ overflow: 'hidden' }}
            >
                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando inventario...</div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--glass-border)' }}>
                            <tr>
                                <th style={{ padding: '1.5rem', fontWeight: 600 }}>Producto</th>
                                <th style={{ padding: '1.5rem', fontWeight: 600 }}>Variantes</th>
                                <th style={{ padding: '1.5rem', fontWeight: 600 }}>3D Model</th>
                                <th style={{ padding: '1.5rem', fontWeight: 600 }}>Precio</th>
                                <th style={{ padding: '1.5rem', fontWeight: 600 }}>Stock</th>
                                <th style={{ padding: '1.5rem', textAlign: 'right', fontWeight: 600 }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                    <td style={{ padding: '1.5rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: 40, height: 40, background: 'var(--glass-bg)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {product.has3D ? <Box size={20} color="var(--brand-primary)" /> : <Shirt size={20} />}
                                        </div>
                                        {product.name}
                                    </td>
                                    <td style={{ padding: '1.5rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            {product.variants && product.variants.map(v => (
                                                <span key={v} style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>{v}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.5rem' }}>
                                        {product.has3D ? (
                                            <span style={{ color: 'var(--accent-success)', fontSize: '0.75rem', border: '1px solid var(--accent-success)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>Ready</span>
                                        ) : (
                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>-</span>
                                        )}
                                    </td>
                                    <td style={{ padding: '1.5rem' }}>${product.price.toFixed(2)}</td>
                                    <td style={{ padding: '1.5rem' }}>{product.stock}</td>
                                    <td style={{ padding: '1.5rem', textAlign: 'right' }}>
                                        <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginRight: '0.5rem' }}>
                                            <Edit size={18} />
                                        </button>
                                        <button onClick={() => handleDeleteProduct(product._id)} style={{ background: 'none', border: 'none', color: 'var(--accent-danger)', cursor: 'pointer' }}>
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {products.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No hay productos en el inventario.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </motion.div>

            {/* Simulated Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="glass-panel"
                            style={{ width: '500px', padding: '2rem', borderRadius: 'var(--radius-lg)', background: '#0a0a0a', border: '1px solid var(--glass-border)' }}
                        >
                            <h2 style={{ marginTop: 0 }}>Nuevo Producto</h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                                <input placeholder="Nombre del producto" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <input type="number" placeholder="Precio ($)" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />
                                    <input type="number" placeholder="Stock" value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} />
                                </div>
                                <input placeholder="Variantes (ej: S, M, L)" value={newProduct.variants.join(', ')} onChange={e => setNewProduct({ ...newProduct, variants: e.target.value.split(',').map(v => v.trim()) })} />

                                {/* Image Upload & 3D Gen */}
                                <div style={{ border: '2px dashed var(--glass-border)', borderRadius: '12px', padding: '2rem', textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.2s' }}>
                                    <Upload size={24} style={{ marginBottom: '0.5rem', color: 'var(--text-secondary)' }} />
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Arrastra una imagen aquí</div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Box size={18} color={newProduct.has3D ? 'var(--accent-success)' : 'var(--text-secondary)'} />
                                        <span style={{ fontSize: '0.875rem' }}>Modelo 3D</span>
                                    </div>
                                    <button
                                        onClick={toggle3D}
                                        disabled={generating3D || newProduct.has3D}
                                        style={{
                                            background: newProduct.has3D ? 'var(--accent-success)' : 'var(--glass-border)',
                                            color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem'
                                        }}
                                    >
                                        {generating3D ? 'Generando...' : newProduct.has3D ? 'Generado' : 'Generar AI 3D'}
                                    </button>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                                    <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>Cancelar</button>
                                    <button onClick={handleAddProduct} className="btn-primary">Guardar Producto</button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Products;
