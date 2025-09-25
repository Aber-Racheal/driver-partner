'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Button from '../components/Buttons';

function Gigs() {
  const router = useRouter();

  const handleDriveClick = () => {
    router.push('/fuel-slide');
  };

  const handleReverseClick = () => {
    router.push('/unlock-splash');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-white">
      {/* Image */}
      <Image
        src="https://via.placeholder.com/150"
        alt="gigs-image"
        width={180}
        height={180}
        className="mb-6 object-cover bg-gray-200 rounded-full shadow-md"
      />

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
        Gigs to earn income
      </h1>

      {/* Description */}
      <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-md text-center">
        Own your ride, grow your income
      </p>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto mb-6">
        <Button
          text="Reverse"
          onClick={handleReverseClick}
          variant="secondary"
        />
        <Button
          text="Drive on"
          onClick={handleDriveClick}
          variant="primary"
        />
      </div>

      {/* Skip link */}
      <a href="/dashboard" className="text-[#300D77] text-sm hover:underline">
        Skip this stop
      </a>
    </div>
  );
}

export default Gigs;
