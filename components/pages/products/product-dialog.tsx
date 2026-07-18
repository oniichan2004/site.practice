"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { productKeys } from "@/api/query-keys";
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
}

export default function ProductDialog({
  open,
  onOpenChange,
  product,
}: ProductDialogProps) {
  const isEdit = !!product;
  const queryClient = useQueryClient();

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

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      toast.success("Product created successfully");
      void queryClient.invalidateQueries({ queryKey: productKeys.all });
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Failed to create product. Please try again.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (vars: { id: string; data: ProductFormValues }) =>
      updateProduct(vars.id, vars.data),
    onSuccess: () => {
      toast.success("Product updated successfully");
      void queryClient.invalidateQueries({ queryKey: productKeys.all });
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Failed to update product. Please try again.");
    },
  });

  const onSubmit = handleSubmit((data) => {
    if (product) {
      updateMutation.mutate({ id: product.id, data });
      return;
    }

    createMutation.mutate(data);
  });

  const isSaving =
    isSubmitting || createMutation.isPending || updateMutation.isPending;

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
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
