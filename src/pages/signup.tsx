import Cookies from "js-cookie";
import { type GetServerSidePropsContext } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { type FormEvent, useState, useEffect } from "react";

import { api } from "~/utils/api";

export default function Signup() {
  const router = useRouter();
  const [toast, setToast] = useState<null | 'ERROR' | 'SUCCESS'>(null);
  const [errors, setErrors] = useState({
    fullName: [],
    email: [],
    password: []
  })
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: ''
  });
  const signup = api.user.signup.useMutation({
    onSuccess: (data) => {
      setToast('SUCCESS');
      Cookies.set('token', data.token);
      setTimeout(() => {
        void router.replace('/dashboard');
        setToast(null)
      }, 1500);
    },
    onError: (error) => {
      if (error.message.includes('Unique')) {
        setToast('ERROR');
        setTimeout(() => setToast(null), 1500);
      }
      if (error.data?.zodError) {
        setErrors(error.data.zodError.fieldErrors);
      }
    }
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signup.mutate(form)
  }

  return (
    <>
      <Head>
        <title>Sign Up | IBC</title>
      </Head>
      <form className="grid grid-cols-1 lg:grid-cols-2 justify-items-center items-center gap-5" onSubmit={handleSubmit}>
        <Image
          src="/signup.png"
          alt="Login"
          width={600}
          height={500}
        />
        <div className="flex flex-col gap-5 max-w-lg w-full">
          <h1 className="text-center text-3xl font-bold">
            Welcome to IBC
          </h1>
          <label className="form-control w-full">
            <input type="text" placeholder="Full Name" className={`input input-bordered w-full ${errors.fullName?.length ? 'input-error' : ''}`}
              value={form.fullName}
              onChange={(e) => {
                setForm({ ...form, fullName: e.target.value });
                setErrors({ ...errors, fullName: [] });
              }}
            />
            {
              errors.fullName?.length ? (
                <div className="label">
                  <span className="label-text-alt"></span>
                  <span className="label-text-alt text-error">Full Name must be at least 7 characters</span>
                </div>
              ) : null
            }
          </label>
          <label className="form-control w-full">
            <input type="email" placeholder="Email Address" className={`input input-bordered w-full ${errors.email?.length ? 'input-error' : ''}`}
              value={form.email}
              onChange={(e) => {
                setForm({ ...form, email: e.target.value });
                setErrors({ ...errors, email: [] });
              }} />
            {
              errors.email?.length ? (
                <div className="label">
                  <span className="label-text-alt"></span>
                  <span className="label-text-alt text-error">Entered Email is not Valid</span>
                </div>
              ) : null
            }
          </label>
          <label className="form-control w-full">
            <input type="password" placeholder="Password" className={`input input-bordered w-full ${errors.password?.length ? 'input-error' : ''}`}
              value={form.password}
              onChange={(e) => {
                setForm({ ...form, password: e.target.value });
                setErrors({ ...errors, password: [] });
              }} />
            {
              errors.password?.length ? (
                <div className="label">
                  <span className="label-text-alt"></span>
                  <span className="label-text-alt text-error">Password must be at least 8 characters</span>
                </div>
              ) : null
            }
          </label>
          <Link className="text-sm text-info link link-hover" href={'/login'}>Have an Account?</Link>
          <button className={`btn btn-block mt-2`} type="submit">
            Sign Up
          </button>
        </div>
        {
          toast === 'SUCCESS' ? (
            <div className="toast toast-center w-[95vw] md:w-[400px] md:toast-end">
              <div className="alert alert-success">
                <span>Sign up success</span>
              </div>
            </div>
          ) : toast === 'ERROR' ? (
            <div className="toast toast-center w-[95vw] md:w-[400px] md:toast-end">
              <div className="alert alert-error">
                <span>This Email is already Registered</span>
              </div>
            </div>
          ) : null
        }
      </form>
    </>
  );
}

export const getServerSideProps = (ctx: GetServerSidePropsContext) => {
  const hasToken = !!ctx.req.cookies?.token;
  if (hasToken)
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