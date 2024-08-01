import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AddToCartButton from '@/components/AddToCartButton/AddToCartButton';
import bagIcon from '@/assets/bag-icon.png';
import styles from './page.module.css';

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
  const [selectedSize, setSelectedSize] = useState(product.skus[0]);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const [latestProduct, setLatestProduct] = useState(product);

  // This checks for stock and prices updates but throws a CORS. Never done this before, not sure is very performant.

  useEffect(() => {
    // We make sure the page isn't loading
    if (!router.isFallback) {
      // Interval to update stock and prices every 5 seconds
      const interval = setInterval(async () => {
        // Get updated values
        const updatedSkus = await Promise.all(
          latestProduct.skus.map(async (sku) => {
            const skuRes = await fetch(
              `http://localhost:3001/api/stock-price/${sku.code}`
            );
            const skuData = await skuRes.json();
            return { ...sku, ...skuData };
          })
        );

        //Update product state with latest data
        setLatestProduct((prevState) => ({
          ...prevState,
          skus: updatedSkus,
        }));
        const updatedSelection = updatedSkus.find(
          (item) => item.code === selectedSize.code
        );
        setSelectedSize(updatedSelection);
      }, 5000);

      //Clearing interval
      return () => clearInterval(interval);
    }
  }, [router.isFallback, latestProduct.skus, selectedSize.code]);

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Image
        src={product.image}
        alt={`${product.brand} product image`}
        width={240}
        height={240}
        style={{ display: 'block', margin: 'auto', objectFit: 'contain' }}
      />
      <div className={styles.title}>
        <h2>{product.brand}</h2>
        <span>
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(selectedSize.price / 100)}
        </span>
      </div>
      <div className={styles.details}>
        Origin: {product.origin} | Stock: {selectedSize.stock}
      </div>
      <h3 className={styles.subtitle}>Description</h3>
      <p
        className={[
          styles.information,
          !showFullDescription && styles.truncate,
        ].join(' ')}
      >
        {product.information}
      </p>
      <span
        className={styles.readMore}
        onClick={() => setShowFullDescription(!showFullDescription)}
      >
        {showFullDescription ? 'Read less' : 'Read more'}
      </span>
      <h3 className={styles.subtitle}>Size</h3>
      <div className={styles.sizes}>
        {product.skus.map((size) => (
          <div
            className={selectedSize.code === size.code ? styles.selected : ''}
            onClick={() => setSelectedSize(size)}
            key={size.code}
          >
            {size.name}
          </div>
        ))}
      </div>
      <div className={styles.actions}>
        <div className={styles.bagButton}>
          <Image
            src={bagIcon}
            width={24}
            height={24}
            alt='Bag icon'
            onClick={() => alert('Should display shopping cart')}
          />
        </div>
        <AddToCartButton item={product} size={selectedSize} />
      </div>
    </>
  );
}
