import { useRouter } from 'next/router';

export async function getStaticPaths() {
  const res = await fetch('http://localhost:3001/api/products');
  const products = await res.json();

  const paths = products.map((product) => ({
    params: {
      slug: `${product.id.toString()}-${product.brand
        .replaceAll(' ', '-')
        .toLowerCase()}`,
    },
  }));

  return { paths, fallback: true };
}

export async function getStaticProps({ params }) {
  //Get the product data
  const res = await fetch('http://localhost:3001/api/products');
  const products = await res.json();
  const product = products.find(
    (p) =>
      p.id.toString() === params.slug.substring(0, params.slug.indexOf('-'))
  );

  //Get stock and price for each sku
  const skuDetails = product.skus.map(async (sku) => {
    const skuRes = await fetch(
      `http://localhost:3001/api/stock-price/${sku.code}`
    );
    const skuData = await skuRes.json();
    return { ...sku, ...skuData };
  });

  const skuWithDetails = await Promise.all(skuDetails);

  return {
    props: {
      product: { ...product, skus: skuWithDetails },
    },
  };
}

export default function ProductDetail({ product }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  console.log(product);

  return (
    <h1>
      {product.id}: {product.brand}
    </h1>
  );
}
