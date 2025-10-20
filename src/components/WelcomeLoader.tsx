import React, { useEffect, useState } from 'react';

interface WelcomeLoaderProps {
  onComplete: () => void;
}

const WelcomeLoader: React.FC<WelcomeLoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-emerald-50 via-white to-green-50 z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8 animate-fade-in">
          <div className="relative inline-block">
            <img
              src="/svgviewer-png-output.webp"
              alt="DJIDALI ECOLOGICAL TOURISM"
              className="h-24 w-auto mx-auto mb-6 animate-bounce-slow"
            />
            <div className="absolute inset-0 bg-emerald-400 opacity-20 blur-2xl rounded-full animate-pulse"></div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3 animate-slide-up">
            DJIDALI ECO TOURISM
          </h1>
          <p className="text-lg text-gray-600 animate-slide-up-delay">Ekologik turizm kompaniyasi</p>
        </div>

        <div className="w-80 mx-auto">
          <div className="bg-gray-200 rounded-full h-3 mb-4 overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 h-3 rounded-full transition-all duration-300 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white opacity-30 animate-shimmer"></div>
            </div>
          </div>
          <p className="text-sm text-gray-600 font-medium">Yuklanmoqda... {progress}%</p>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out 0.2s both;
        }

        .animate-slide-up-delay {
          animation: slide-up 0.6s ease-out 0.4s both;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default WelcomeLoader;