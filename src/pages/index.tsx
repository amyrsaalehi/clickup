import Cookies from "js-cookie";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { api } from "~/utils/api";

export default function Home() {

  return (
    <>
      <Head>
        <title>Home | IBC</title>
      </Head>
      <div className="grid grid-cols-1 md:grid-cols-2 justify-items-center items-center gap-5 md:mt-20">
        <Image
          src={'/hero2.png'}
          alt="Clickup Hero"
          width={800}
          height={500}
        />
        <div className="flex flex-col gap-3 lg:gap-8 max-w-lg">
          <h1 className="mx-auto text-center font-bold text-4xl lg:text-6xl max-w-[60vw] leading-tight bg-gradient-to-br from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text">
            One App To Replace Them All
          </h1>
          <p className="mx-auto text-center font-bold text-lg lg:text-2xl max-w-[60vw]">Get everyone working in a single platform</p>
          <p className="mx-auto text-center font-light text-lg lg:text-2xl max-w-[60vw]">designed to manage any type of work.</p>
          <Link href={'/login'} className="btn bg-gradient-to-br from-blue-600 via-green-500 to-indigo-400 max-w-xs mx-auto text-white text-lg lg:text-2xl lg:btn-lg">
            { Cookies.get('token') ? 'Go to Dashboard' : 'Login To Start' }  
          </Link>
        </div>
      </div>
    </>
  );
}
