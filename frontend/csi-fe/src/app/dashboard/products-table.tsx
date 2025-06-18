'use client';

import {
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  Table
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Product } from './product';

export function ProductsTable({
  products,
  onUploadSuccess
}: {
  products: [];
  onUploadSuccess: () => void;
}) {
  function loadData() {
    onUploadSuccess()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Products</CardTitle>
        <CardDescription>
          Manage your products and view their sales performance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Sku</TableHead>
              <TableHead className="hidden md:table-cell">Description</TableHead>
              <TableHead className="hidden md:table-cell">Price</TableHead>
              <TableHead className="hidden md:table-cell">
                Qty
              </TableHead>
              <TableHead className="hidden md:table-cell">Created at</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              // @ts-expect-error
              <Product key={product?.id} product={product} onUploadSuccess={loadData} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
