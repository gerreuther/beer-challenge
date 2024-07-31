import styles from './AddToCartButton.module.css';

const AddToCartButton = ({ item, size }) => {
  console.log(item);
  console.log(size);

  const addToCartHandler = () => {
    alert(
      `Should add the following product to the cart:\n\nSKU: ${size.code}\nBrand: ${item.brand}\nSize: ${size.name}`
    );
  };

  return (
    <button className={styles.button} onClick={addToCartHandler}>
      Add to cart
    </button>
  );
};

export default AddToCartButton;
