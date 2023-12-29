import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import Navbar from "~/components/layout/Navbar";

const MyApp: AppType = ({ Component, pageProps }) => {
  return <div className="container mx-auto">
    <Navbar />
    <main className="container mx-auto px-5 pt-16 pb-8">
      <Component {...pageProps} />
    </main>
  </div>;
};

export default api.withTRPC(MyApp);
