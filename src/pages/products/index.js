import ProductCard from '@/components/ProductCard/ProductCard';
import styles from './page.module.css';

export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch('http://localhost:3001/api/products');
  const products = await res.json();

  // Fetch the price for each product. I chose the first element of the skus array but it can also be, for example, the one with the lowest price.
  const productsWithPrices = await Promise.all(
    products.map(async (product) => {
      const priceRes = await fetch(
        `http://localhost:3001/api/stock-price/${product.skus[0].code}`
      );
      const priceData = await priceRes.json();
      return { ...product, price: priceData.price };
    })
  );

  // Pass the data with prices to the page via props
  return { props: { products: productsWithPrices } };
}

export default function Products({ products }) {
  return (
    <>
      <p className={styles.username}>Hi Mr. Michael,</p>
      <h1>Welcome Back!</h1>
      <h2 className={styles.title}>Our Products</h2>
      <div className={styles.grid}>
        {products.map((item) => (
          <ProductCard product={item} key={item.id} />
        ))}
      </div>
    </>
  );
}
