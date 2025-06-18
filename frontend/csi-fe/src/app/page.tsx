'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { CheckIcon, ChevronDownIcon, ClockIcon, ShoppingCartIcon, X as CloseIcon } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog'

interface CartItem {
  product: any;
  quantity: number;
}

export default function Example() {
  const router = useRouter()

  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkoutEmail, setCheckoutEmail] = useState('');

  const loginClick = () => {
    router.push('/login')
  }

  const loadProducts = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        page: 1,
        per_page: 100,
        search: ''
      }),
    });

    const result = await response.json();
    setProducts(result.data?.data ?? [])
  }

  const addToCart = (product: any) => {
    setCart(prev => {
      const exists = prev.find(p => p.product.ID === product.ID);
      if (exists) {
        return prev.map(p =>
          p.product.ID === product.ID ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(p => p.product.ID !== productId));
  }

  const updateQuantity = (productId: number, delta: number) => {
    setCart(prev =>
      prev.map(p => {
        if (p.product.ID !== productId) return p;

        const newQuantity = p.quantity + delta;

        return {
          ...p,
          quantity: Math.max(1, Math.min(newQuantity, p.product.Qty)),
        };
      })
    );
  }


  const handleCheckout = async () => {
    if (!checkoutEmail) {
      alert('Email is required for checkout.');
      return;
    }

    alert('Checkout successful! Email notification sent.');
    setCart([]);
    setCheckoutEmail('');
  }

  useEffect(() => {
    loadProducts()
  }, [])

  return (
    <>
      <div className="bg-white">
        <header className="absolute inset-x-0 top-0 z-50">
          <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
            <div className="flex lg:flex-1">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-4">
                <Dialog.Root>
                  <Dialog.Trigger asChild>
                    <button
                      className="relative text-gray-900 hover:text-indigo-600"
                      aria-label="Open cart"
                    >
                      <ShoppingCartIcon className="h-6 w-6" />
                      {cart.length > 0 && (
                        <span className="absolute -top-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                          {cart.reduce((total, item) => total + item.quantity, 0)}
                        </span>
                      )}
                    </button>
                  </Dialog.Trigger>

                  <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/30" />
                    <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto p-6">
                      <div className="flex justify-between items-center mb-6">
                        <Dialog.Title className="text-2xl font-bold text-gray-900">🛒 Your Cart</Dialog.Title>
                        <Dialog.Close asChild>
                          <button className="text-gray-400 hover:text-gray-600">
                            <CloseIcon className="h-6 w-6" />
                          </button>
                        </Dialog.Close>
                      </div>

                      {cart.length === 0 ? (
                        <p className="text-gray-600">Your cart is empty.</p>
                      ) : (
                        <div>
                          <ul role="list" className="divide-y divide-gray-200 border-b border-t border-gray-200">
                            {cart.map((product: any, productIdx) => (
                              <li key={product.ID} className="flex py-6 sm:py-10">
                                <div className="shrink-0">
                                  <img
                                    alt={product.Title}
                                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${product.product.Images?.[0]?.Path ?? 'uploads/default.jpg'}`}
                                    className="size-24 rounded-md object-cover sm:size-48"
                                  />
                                </div>
                                <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                                  <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                                    <div>
                                      <div className="flex justify-between">
                                        <h3 className="text-sm">
                                          <a href="#" className="font-medium text-gray-700 hover:text-gray-800">
                                            {product.product.Title}
                                          </a>
                                        </h3>
                                      </div>
                                      <p className="mt-1 text-sm font-medium text-gray-900">
                                        Rp{product.product?.Price?.toLocaleString()}
                                      </p>
                                    </div>
                                    <div className="mt-4 sm:mt-0 sm:pr-9">
                                      <div className="grid w-full max-w-16 grid-cols-1">
                                        <button onClick={() => updateQuantity(product.product.ID, -1)} className="px-2">-</button>
                                        <span>{product.quantity}</span>
                                        <button onClick={() => updateQuantity(product.product.ID, 1)} className="px-2">+</button>

                                      </div>
                                      <div className="absolute right-0 top-0">
                                        <button onClick={() => removeFromCart(product.product.ID)} type="button" className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500">
                                          <span className="sr-only">Remove</span>
                                          <CloseIcon aria-hidden="true" className="size-5" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>

                                  <p className="mt-4 flex space-x-2 text-sm text-gray-700">
                                    {product.product.Qty > 0 ? (
                                      <CheckIcon aria-hidden="true" className="size-5 shrink-0 text-green-500" />
                                    ) : (
                                      <ClockIcon aria-hidden="true" className="size-5 shrink-0 text-gray-300" />
                                    )}
                                    <span>{product.product.Qty > 0 ? 'In stock' : 'Out of stock'}</span>
                                  </p>
                                </div>
                              </li>
                            ))}
                          </ul>

                          <div className="mt-6 border-t pt-4">
                            <div className="flex items-center justify-between text-sm text-gray-600">
                              <span>Subtotal</span>
                              <span>Rp{products.slice(0, 3).reduce((total, item) => total + item.Price, 0).toLocaleString()}</span>
                            </div>
                            <div className="mt-4">
                              <div className="mt-6">
                                <input
                                  type="email"
                                  placeholder="Enter your email for checkout"
                                  className="border p-2 rounded w-full mb-4"
                                  value={checkoutEmail}
                                  onChange={(e) => setCheckoutEmail(e.target.value)}
                                />
                                <button onClick={handleCheckout} className="w-full rounded-md bg-indigo-600 px-4 py-3 text-white font-medium hover:bg-indigo-700">
                                  Checkout
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                    </Dialog.Content>
                  </Dialog.Portal>
                </Dialog.Root>
              </div>
              <button
                onClick={loginClick}
                type="button"
                className="text-sm font-semibold text-gray-900"
              >
                Log in <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </nav>
        </header>

        <div className="relative isolate pt-14">
          <div className="mx-auto max-w-7xl px-6 lg:flex lg:items-center lg:gap-x-10 lg:px-8">
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Customers also purchased</h2>

              {products.length === 0 ? (
                <button
                  disabled
                  type="button"
                  className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <svg
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                    className="mx-auto size-12 text-gray-400"
                  >
                    <path
                      d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              ) : (
                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                  {products.map((product) => (
                    <div key={product.ID} className="border rounded p-4">
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${product.Images[0]?.Path ?? 'uploads/default.jpg'}`}
                        alt={product.Title}
                        className="w-full h-48 object-cover rounded"
                      />
                      <h3 className="mt-2 font-semibold">{product.Title}</h3>
                      <p className="text-sm text-gray-600">{product.Description}</p>
                      <button
                        onClick={() => addToCart(product)}
                        className="mt-4 w-full bg-gray-800 text-white py-1 rounded hover:bg-gray-700"
                      >
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

