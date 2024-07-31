import Image from 'next/image';
import menu from '@/assets/menu-icon.png';
import back from '@/assets/back-icon.png';
import dots from '@/assets/dots-icon.png';
import avatar from '@/assets/avatar.jpg';
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.container}>
      <Image src={menu} width={24} alt='Toggle menu icon' />
      <Image
        className={styles.avatar}
        src={avatar}
        width={40}
        alt='Profile picture'
      />
    </header>
  );
};

export default Header;
