'use client';

import {motion} from 'framer-motion';
import { useReCaptcha } from 'next-recaptcha-v3';
import { useRouter } from 'next/navigation';
import React from 'react';
import toast from 'react-hot-toast';
import type { StudentTypes } from 'vervalpd-node';

export default function Home() {
  const recaptcha = useReCaptcha();
  const router = useRouter();
  const [nisn, setNisn] = React.useState<string>('');
  const [date, setDate] = React.useState<string>();
  const [_, setStudent] = React.useState<StudentTypes.Student>();

  if (recaptcha.error) {
    console.error('reCapthca fail to load');
  }

  const handleNisnSubmit = React.useCallback<React.FormEventHandler<HTMLFormElement>>(async (event) => {
    event.preventDefault();
    setStudent(undefined);

    const toastLoadingId = toast.loading("Mohon tunggu", {
      className: 'text-md font-sans font-semibold',
    });

    const token = await recaptcha.executeRecaptcha('nisn_check');
    const url = new URL('./api/students/'.concat(encodeURIComponent(nisn ?? '')), location.origin);
    url.searchParams.set('token', token);
    url.searchParams.set('date', date?.toString() ?? '');

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'force-cache',
    });

    const data = await response.json();
    if (data.error) {
      toast.dismiss(toastLoadingId);
      toast.error(data.error, {
        className: 'text-md font-sans font-semibold',
        duration: 5000,
      });
    }

    if (data.data) {
      toast.dismiss(toastLoadingId);
      setStudent(data.data);
      router.push('/lulus/'.concat(data.data.id));
    }
  }, [recaptcha, nisn, date, router]);
  return (
    <motion.div className="text-center h-screen w-full flex flex-col justify-center items-center" animate={{
      x: 0,
    }}>
      <motion.h1 className="text-4xl font-bold">
        Stravisco <span className="text-blue-400">SMAN 3 Palu</span>
      </motion.h1>
      <motion.p className="text-md text-wrap md:w-1/2 mb-5 mt-5">
        Hi Stravisco! Terimakasih telah mendedikasikan 3 tahun lamanya di SMAN 3 Palu untuk mengemban Ilmu dan perilaku, and now we want give you something as an Euphoria after you entering the student number and your birthdate below
      </motion.p>
      <motion.form className="md:w-1/2" action="#" onSubmit={handleNisnSubmit}>
        <div className="form-control">
          <div className="label">
            <span className="label-text">
              NISN dan Tanggal Lahir
            </span>
          </div>
          <div className="join">
            <input type="text" required placeholder='NISN' className="join-item input input-bordered w-full md:w-11/12" value={nisn} onChange={(ev) => setNisn(ev.target.value)} />
            <input type="date" required placeholder='Tanggal Lahir' className="join-item input input-bordered w-full md:w-11/12" value={date} onChange={(ev) => setDate(ev.target.value)} />
            
            <button type="submit" className="join-item btn btn-primary">Submit</button>
          </div>
          <div className="label">
            <span className="label-text-alt">
              Nomor Induk Siswa Nasional dan Tanggal Lahir
            </span>
          </div>
        </div>
      </motion.form>
    </motion.div>
  );
}
