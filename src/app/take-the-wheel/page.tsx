'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Button from '../components/Buttons';

function TakeTheWheel() {
  const router = useRouter();

  const handleTakeTheWheel = () => {
    router.push('/dashboard');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-white text-center">
      {/* Image */}
      <Image
        src="/media/wheel-image.png"
        alt="take-the-wheel-image"
        width={180}
        height={180}
        className="mb-6 object-cover bg-gray-200 rounded-full shadow-md"
      />

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
        You&apos;re all set!
      </h1>

      {/* Description */}
      <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-md">
        Time to hit the road and take full control of your Driver Partner journey.
      </p>

      {/* Button */}
      <div className="w-full sm:w-auto">
        <Button
          text="Take the wheel"
          onClick={handleTakeTheWheel}
          variant="primary"
        />
      </div>
    </div>
  );
}

export default TakeTheWheel;
