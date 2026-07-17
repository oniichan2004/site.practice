"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Pencil, Plus, Trash2 } from "lucide-react";

import { getProducts, deleteProduct } from "@/api/requests";
import ProductDialog from "@/components/pages/products/product-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link } from "@/i18n/navigation";

import type { ProductResponse } from "@/api/types";

export default function ProductsClient() {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ProductResponse | null>(null);

  const [selectedProduct, setSelectedProduct] =
    useState<ProductResponse | null>(null);

  const [editOpen, setEditOpen] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<ProductResponse | null>(null);
  const [deleting, setDeleting] = useState(false);

  function handleEdit(product: ProductResponse) {
    setSelectedProduct(product);
    setEditOpen(true);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteProduct(deleteTarget.id);
      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== deleteTarget.id),
      );
      setDeleteTarget(null);
    } catch (error) {
      console.error("Produsul nu a putut fi șters:", error);
    } finally {
      setDeleting(false);
    }
  }

  const loadProducts = useCallback(() => {
    getProducts()
      .then((result) => {
        setError(false);
        setProducts(result.data);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="sm">
            <Link href="/">
              <ArrowLeft size={16} /> Home
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Products</h1>
        </div>
        <Button onClick={openCreate}>
          <Plus size={16} /> Add product
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading products...</p>
      ) : error ? (
        <p className="text-destructive">Failed to load products.</p>
      ) : products.length === 0 ? (
        <p className="text-muted-foreground">
          No products yet. Add your first one!
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex flex-col gap-1 rounded-xl border border-border bg-card p-4"
            >
              <span className="font-medium">{product.name}</span>
              <span className="text-sm text-muted-foreground">
                {product.category}
              </span>
              <span className="font-semibold">${product.price}</span>

              <div className="mt-2 flex gap-2">
                <Button
                  variant="outline"
                  size="icon-sm"
                  aria-label="Modify product"
                  onClick={() => handleEdit(product)}
                >
                  <Pencil />
                </Button>
                <Button
                  variant="destructive"
                  size="icon-sm"
                  aria-label="Delete product"
                  onClick={() => setDeleteTarget(product)}
                >
                  <Trash2 />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ProductDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={editing}
        onSaved={loadProducts}
      />

      {selectedProduct && (
        <ProductDialog
          product={selectedProduct}
          open={editOpen}
          onOpenChange={setEditOpen}
          onSaved={loadProducts}
        />
      )}

      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="items-center text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
              <Trash2 className="size-6 text-destructive" />
            </div>
            <DialogTitle>Delete product?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium text-foreground">
                {deleteTarget?.name}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
