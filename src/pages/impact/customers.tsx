import Head from 'next/head';
import React from 'react';
import globalStyles from '@/styles/Global.module.css';
import HeroImpact from '@/components/HeroImpact';
import ImpactCards from '@/components/ImpactCards';
import { ImpactCardType } from '@/types/cards';
import Loading from '@/components/Loading';
import ErrorComponent from '@/components/ErrorComponent';
import { prefix } from '@/utils/prefix';

type Props = {
  data: ImpactCardType[] | null;
  loading: boolean;
  error: string;
};

export const getServerSideProps = async (context: any) => {
  let loading = false;
  let error = '';
  let data: ImpactCardType[] | null = null;
  const url = context.req.url;
  const path = url.split('/').pop().split('.')[0];
  try {
    loading = true;
    const pref = prefix();
    const url = `${pref.url.API_URL}/api/impact/?type=${path}`;
    const response = await fetch(url);
    const payload = await response.json();

    if (payload && payload.data) {
      data = payload.data;
    } else {
      error = 'Error when fetching';
    }
  } catch (e) {
    let err = e as Error;
    error = err.message;
  } finally {
    loading = false;
  }

  return {
    props: {
      data,
      loading,
      error,
    },
  };
};

const customers = ({ data, loading, error }: Props) => {
  if (loading) {
    return <Loading />;
  } else if (!loading && error) {
    return <ErrorComponent error={error} />;
  } else if (!loading && data && data.length) {
    return (
      <section>
        <Head>
          <title>Impact: Customer</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta
            name="description"
            content="mission compassion impact page for customers"
          />
        </Head>
        <main
          className={`${globalStyles.pageStyles} ${globalStyles.impactGradient}`}
        >
          {/* hero section */}
          <HeroImpact page="impact" subtitle="customer" />
          {/* customer impacts */}
          <ImpactCards cards={data} />
        </main>
      </section>
    );
  } else {
    return <ErrorComponent error="not found" />;
  }
};

export default customers;