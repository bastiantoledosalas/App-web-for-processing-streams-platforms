import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Image
        src="/wss-black.png"
        width={300}
        height={80}
        alt="logo"
        className="pr-2 mb-8"
      />
      <div className="text-center ">
        <p className="text-xl text-gray-600 mb-8 max-w-96">
          Bienvenido a Web Stream Simulations! Explora el mundo de las
          simulaciones en vivo con nuestra plataforma de alto rendimiento.
        </p>
        <Link
          href="/auth/signin"
          className="px-6 py-3 bg-gray-800 text-white font-semibold rounded-md shadow-md hover:bg-gray-700 transition duration-300"
        >
          Acceder
        </Link>
      </div>
    </div>
  );
}
