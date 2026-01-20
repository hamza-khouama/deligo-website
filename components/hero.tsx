import Image from "next/image"

export default function Hero() {
  return (
    <section id="home" className="relative min-h-[800px] flex items-center pt-[72px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 -translate-y-[5px]">
        <Image
          src="/hero-background.png"
          alt="Urban delivery scene with trucks"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-white/30"></div>

      <div className="container relative mx-auto px-4 py-20 z-10">
        <div className="max-w-2xl">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">Move Anything, Anytime</h1>
          <p className="text-xl text-gray-700 mb-10">
            Hire trusted transporters to move your furniture or goods instantly. Experience seamless delivery services
            at your fingertips.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#" className="inline-block hover:opacity-90 transition-opacity">
              <Image
                src="/app-store-badge.png"
                alt="Download on the App Store"
                width={135}
                height={45}
                className="h-[45px] w-auto"
              />
            </a>
            <a href="#" className="inline-block hover:opacity-90 transition-opacity">
              <Image
                src="/google-play-badge.png"
                alt="Get it on Google Play"
                width={135}
                height={45}
                className="h-[45px] w-auto"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
