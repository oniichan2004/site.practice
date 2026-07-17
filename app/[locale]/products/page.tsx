import { setRequestLocale } from "next-intl/server";

import { AuthGuard } from "@/components/common/auth-guard";
import ProductsClient from "@/components/pages/products/products-client";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ProductsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <AuthGuard>
      <ProductsClient />
    </AuthGuard>
  );
}
