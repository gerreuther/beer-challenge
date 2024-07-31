import Image from 'next/image';
import menu from '@/assets/menu-icon.png';
import backIcon from '@/assets/back-icon.png';
import dotsIcon from '@/assets/dots-icon.png';
import avatar from '@/assets/avatar.jpg';
import { useRouter } from 'next/router';
import styles from './Header.module.css';

const Header = () => {
  const router = useRouter();
  console.log(router);
  return (
    <>
      {router.pathname === '/product/[slug]' ? (
        <header className={styles.container}>
          <Image
            src={backIcon}
            width={24}
            alt='Link to previous page'
            onClick={() => router.back()}
          />
          Detail
          <Image
            className={styles.avatar}
            src={dotsIcon}
            width={24}
            alt='Options icon'
          />
        </header>
      ) : (
        <header className={styles.container}>
          <Image src={menu} width={24} alt='Toggle menu icon' />
          <Image
            className={styles.avatar}
            src={avatar}
            width={40}
            alt='Profile picture'
            onClick={() => alert('Some profile and account options here')}
          />
        </header>
      )}
    </>
  );
};

export default Header;
