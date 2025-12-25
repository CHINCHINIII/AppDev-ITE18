import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductsApi } from '../api';
import type { Product } from '../types';
import PlaceholderPage from './Placeholder';

const SellerStorePage: React.FC = () => {
  const { sellerId } = useParams();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!sellerId) return;
    fetchProductsApi({ sellerId }).then((res) => setProducts(res.data?.data ?? res.data ?? []));
  }, [sellerId]);

  return (
    <PlaceholderPage title="Seller Store" description={`Products for seller ${sellerId}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.id} className="card p-3 space-y-2">
            <div className="aspect-video bg-gray-100 rounded-lg" />
            <div className="font-semibold">{p.name}</div>
            <div className="text-primary font-bold">₱{p.price?.toLocaleString()}</div>
          </div>
        ))}
        {!products.length && <div className="text-sm text-gray-500">No products yet.</div>}
      </div>
    </PlaceholderPage>
  );
};

export default SellerStorePage;

