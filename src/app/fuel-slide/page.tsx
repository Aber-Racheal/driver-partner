'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Button from '../components/Buttons';

function Fuel() {
  const router = useRouter();

  const handleDriveClick = () => {
    router.push('/garage');
  };

  const handleReverseClick = () => {
    router.push('/gigs-slide');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-white text-center">
      {/* Image */}
      <Image
        src="https://via.placeholder.com/150"
        alt="fuel-image"
        width={180}
        height={180}
        className="mb-6 object-cover bg-gray-200 rounded-full shadow-md"
      />

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
        Fuel offers & vouchers
      </h1>

      {/* Description */}
      <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-md">
        Smart fueling to keep you moving
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

      {/* Skip Link */}
      <a href="/dashboard" className="text-[#300D77] text-sm hover:underline">
        Skip this stop
      </a>
    </div>
  );
}

export default Fuel;
