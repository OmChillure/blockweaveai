import Bentodemo from './ui/bentogrid';
import { forwardRef } from 'react';

export const Features = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div ref={ref} className="bg-black text-white py-[72px]">
      <div className="container">
        <h2 className="text-center font-bold text-5xl sm:text-6xl tracking-tighter">
          Everything you need
        </h2>
        <div className='max-w-xl mx-auto'>
          <p className="text-center mt-5 text-xl text-white/70">
            AI models, datasets, IPs, decentralized storage. All in one place only at{' '}
            <span className=''>Blockweave AI</span>.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center sm:flex-row gap-4 mt-14">
          <Bentodemo />
        </div>
      </div>
    </div>
  );
});
