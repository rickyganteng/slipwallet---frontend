import Image from "next/image";
import { useRouter } from "next/router";
import styles from "styles/404.module.css";

export default function Page404() {
  const router = useRouter();

  const handleHome = () => {
    router.push("/");
  };

  return (
    <div className={styles.container}>
      <div>
        <Image src="/404.gif" width={550} height={500} />
      </div>
      <button className="btn btn-warning" onClick={handleHome}>
        Back to Home
      </button>
    </div>
  );
}
