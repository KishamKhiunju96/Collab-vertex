import BrandDetailPage from "@/components/brand/BrandDetailPage";

interface BrandPageProps {
  params: {
    brandId: string;
  };
}

export default async function Page({ params }: BrandPageProps) {
  // If params is a Promise, await it
  const resolvedParams = await params;
  const { brandId } = resolvedParams;

  console.log("Brand ID from server page:", brandId);

  return <BrandDetailPage brandId={brandId} />;
}
