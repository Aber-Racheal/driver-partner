'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const UnlockSplash = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/gigs-slide'); // change '/home' to your desired route
    }, 3000); // 3 seconds splash duration

    // Cleanup timeout if component unmounts before timeout
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen px-4 text-center bg-white">
      <Image
        src="/media/ray.png"
        alt="gigs-image"
        width={150}
        height={150}
        className="mb-6 object-cover bg-gray-200 rounded-full sm:w-[150px] sm:h-[150px] w-[100px] h-[100px]"
      />

      <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-gray-800">
        Congratulations Ray!
      </h1>

      <p className="text-base sm:text-lg text-gray-600 max-w-md">
        You have unlocked the <span className="font-semibold">Driver Partner</span> feature!
      </p>
    </div>
  );
};

export default UnlockSplash;
