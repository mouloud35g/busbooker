
import { Bus } from "lucide-react";

export const Hero = () => {
  return (
    <div className="w-full bg-gradient-to-b from-sage-50/50 to-white/50">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-sage-100/80 to-transparent" />
      </div>
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl py-20 sm:py-32 lg:py-40">
          <div className="text-center animate-fadeIn">
            <div className="flex justify-center mb-8">
              <Bus className="h-16 w-16 text-sage-600" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Voyagez en toute sérénité
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Réservez vos trajets en bus en quelques clics. Simple, rapide et fiable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
