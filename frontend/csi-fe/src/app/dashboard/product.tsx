import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export function Product({ product, onUploadSuccess }: { product: any, onUploadSuccess: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [images, setImages] = useState<FileList | null>(null);

  const handleUploadClick = () => {
    setSelectedProduct(product);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setImages(null);
    setSelectedProduct(null);
  };

  const handleDetailClick = () => {
    setShowDetailDialog(true);
  };

  const handleCloseDialogs = () => {
    setShowDetailDialog(false);
    setImages(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!images || !selectedProduct) return;

    const formData = new FormData();
    formData.append('product_id', selectedProduct.ID);

    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/images`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert('Upload berhasil');
        handleClose();
        onUploadSuccess();
      } else {
        alert('Upload gagal: ' + data.message);
      }
    } catch (error) {
      console.error('Upload error:', error);
    }
  };


  return (
    <>
      <TableRow>
        <TableCell className="font-medium">{product.Title}</TableCell>
        <TableCell>
          <Badge variant="outline" className="capitalize">
            {product.Sku}
          </Badge>
        </TableCell>
        <TableCell className="hidden md:table-cell">{product.Description}</TableCell>
        <TableCell className="hidden md:table-cell">{`IDR ${product.Price}`}</TableCell>
        <TableCell className="hidden md:table-cell">{product.Qty}</TableCell>
        <TableCell className="hidden md:table-cell">
          {product.CreatedAt}
        </TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-haspopup="true" size="icon" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={handleUploadClick}>
                Upload Image
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDetailClick}>Detail</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Images</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <input type="hidden" name="product_id" value={selectedProduct?.ID || ''} />
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Choose Images</label>
              <Input
                type="file"
                name="images"
                multiple
                accept="image/*"
                onChange={(e) => setImages(e.target.files)}
              />
            </div>
            <div className="flex justify-end">
              <Button type="button" variant="ghost" onClick={handleClose} className="mr-2">
                Cancel
              </Button>
              <Button type="submit">Upload</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detail Gambar Produk</DialogTitle>
          </DialogHeader>
          {product.Images && product.Images.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {product.Images.map((img: any, index: number) => (
                <img
                  key={index}
                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/` + img.Path}
                  alt={`product-img-${index}`}
                  className="w-full h-auto rounded shadow"
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Tidak ada gambar untuk produk ini.</p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
