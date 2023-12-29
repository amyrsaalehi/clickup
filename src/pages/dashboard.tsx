import { type GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useState } from "react";
import Summary from "~/components/dashboard/Summary";
import Workspaces from "~/components/dashboard/Workspaces";

export default function Dashboard() {
  const [tab, setTab] = useState(0);
  return (
    <>
      <Head>
        <title>Dashboard | ClickUp</title>
      </Head>
      <div className="mt-5">
        <div role="tablist" className="tabs tabs-lifted">
          <input type="radio" name="tab" role="tab" className="tab" aria-label="Summary" checked={tab === 0} onChange={() => setTab(0)} />
          <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box py-6 px-4 lg:px-6 min-h-[50vh]">
            <Summary setTab={setTab} />
          </div>

          <input type="radio" name="tab" role="tab" className="tab" aria-label="Workspaces" checked={tab === 1} onChange={() => setTab(1)} />
          <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box py-6 px-4 lg:px-6 min-h-[50vh]">
            <Workspaces />
          </div>
        </div>
      </div>
    </>
  )
}


export const getServerSideProps = (ctx: GetServerSidePropsContext) => {
  const hasToken = !!ctx.req.cookies?.token;
  if (!hasToken)
    return {
      redirect: {
        permanent: false,
        destination: "/dashboard",
      },
      props: {},
    };
  return {
    props: {}
  }
}