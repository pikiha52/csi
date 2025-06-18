'use client'

import { Tabs, TabsContent } from '@/components/ui/tabs';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductsTable } from './products-table';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function DashboardPage() {

    const [products, setProducts] = useState<[]>([]);
    const [meta, setMeta] = useState<{ page: number; per_page: number; total: number; }>({
        page: 0,
        per_page: 0,
        total: 0
    })
    const [page, sePage] = useState(1);
    const [per_page, setPerPage] = useState(100);
    const [search, setSearch] = useState('');

    const getProducts = async () => {
        const token = localStorage.getItem('access_token')
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/list`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                page,
                per_page,
                search
            }),
        });

        const result = await response.json();
        setProducts(result.data?.data ?? [])
        setMeta({
            page: result.data?.meta?.page,
            per_page: result.data?.meta?.per_page,
            total: result.data?.meta?.total
        })
    }

    const [showAddModal, setShowAddModal] = useState(false);
    const [form, setForm] = useState({
        title: '',
        sku: '',
        description: '',
        qty: 0,
        price: 0
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = localStorage.getItem('access_token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(form),
        });

        const result = await res.json();

        if (res.ok) {
            alert('Success created a product!');
            setShowAddModal(false);
            setForm({
                title: '',
                sku: '',
                description: '',
                qty: 0,
                price: 0
            });
            getProducts();
        } else {
            alert('Failed create product: ' + result.message);
        }
    };

    useEffect(() => {
        getProducts()
    }, []);

    return (
        <>
            <Tabs defaultValue="all">
                <div className="flex items-center">
                    <div className="ml-auto flex items-center gap-2">
                        <Button size="sm" className="h-8 gap-1" onClick={() => setShowAddModal(true)}>
                            <PlusCircle className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                Add Product
                            </span>
                        </Button>
                    </div>
                </div>
                <TabsContent value="all">
                    <ProductsTable
                        products={products}
                        onUploadSuccess={getProducts}
                    />
                </TabsContent>
            </Tabs>

            <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add new Product</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Title"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            required
                            className="w-full border p-2 rounded"
                        />
                        <input
                            type="text"
                            placeholder="SKU"
                            value={form.sku}
                            onChange={(e) => setForm({ ...form, sku: e.target.value })}
                            required
                            className="w-full border p-2 rounded"
                        />
                        <textarea
                            placeholder="Description"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            required
                            className="w-full border p-2 rounded"
                        ></textarea>
                        <div className='mb-4'>
                            <label htmlFor="qty" className="block text-sm font-medium text-gray-700 mb-1">
                                Quantity
                            </label>
                            <input
                                type="number"
                                placeholder="Quantity"
                                value={form.qty}
                                onChange={(e) => setForm({ ...form, qty: Number(e.target.value) })}
                                required
                                className="w-full border p-2 rounded"
                            />
                        </div>
                        <div className='mb-4'>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                                Price
                            </label>
                            <input
                                type="number"
                                placeholder="Price"
                                value={form.price}
                                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                                required
                                className="w-full border p-2 rounded"
                            />
                        </div>
                        <Button type="submit">Save</Button>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}