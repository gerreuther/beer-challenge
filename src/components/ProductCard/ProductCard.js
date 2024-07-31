import Image from 'next/image';
import Link from 'next/link';
import addIcon from '@/assets/add-icon.png';

import styles from './ProductCard.module.css';

const ProductCard = ({ product }) => {
  console.log(product);
  return (
    <Link
      href={`/product/${product.id}-${product.brand
        .replaceAll(' ', '-')
        .toLowerCase()}`}
      className={styles.container}
    >
      <h3>{product.brand}</h3>
      <Image src={product.image} height={122} width={122} alt='Product image' />
      <div className={styles.bottom}>
        <span>${product.price / 100}</span>
        <div className={styles.add}>
          <Image src={addIcon} alt='Add icon' width={24} />
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
