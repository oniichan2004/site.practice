"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createProduct, updateProduct } from "@/api/requests";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  productSchema,
  type ProductFormValues,
} from "@/lib/schemas/products/product";
import { zodFormResolver } from "@/lib/zod-resolver";

import type { ProductResponse } from "@/api/types";

const EMPTY_VALUES: ProductFormValues = { name: "", price: 0, category: "" };

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When provided, the dialog edits this product; otherwise it creates a new one. */
  product?: ProductResponse | null;
  onSaved?: () => void;
}

export default function ProductDialog({
  open,
  onOpenChange,
  product,
  onSaved,
}: ProductDialogProps) {
  const isEdit = !!product;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodFormResolver<ProductFormValues>(productSchema),
    defaultValues: EMPTY_VALUES,
  });

  // Fill the form with the product when opening in edit mode, clear it for create.
  useEffect(() => {
    if (!open) return;
    reset(
      product
        ? {
            name: product.name,
            price: product.price,
            category: product.category,
          }
        : EMPTY_VALUES,
    );
  }, [open, product, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (product) {
        await updateProduct(product.id, data);
        toast.success("Product updated successfully");
      } else {
        await createProduct(data);
        toast.success("Product created successfully");
      }
      onOpenChange(false);
      onSaved?.();
    } catch {
      toast.error(
        isEdit
          ? "Failed to update product. Please try again."
          : "Failed to create product. Please try again.",
      );
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit product" : "Add product"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="product-name" className="text-sm font-medium">
              Name
            </label>
            <Input
              id="product-name"
              aria-invalid={!!errors.name}
              {...register("name")}
            />
            {errors.name ? (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="product-price" className="text-sm font-medium">
              Price
            </label>
            <Input
              id="product-price"
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0"
              className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              aria-invalid={!!errors.price}
              {...register("price")}
            />
            {errors.price ? (
              <p className="text-sm text-destructive">{errors.price.message}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="product-category" className="text-sm font-medium">
              Category
            </label>
            <Input
              id="product-category"
              aria-invalid={!!errors.category}
              {...register("category")}
            />
            {errors.category ? (
              <p className="text-sm text-destructive">
                {errors.category.message}
              </p>
            ) : null}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
