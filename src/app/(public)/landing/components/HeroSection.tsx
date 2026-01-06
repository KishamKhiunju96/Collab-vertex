import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative w-full h-screen overflow-hidden">
        <div className="absolute inset-0 bg-black/10"/>
      <Image
        src="/images/Brand.jpg"  
        alt="CollabVertex Hero Background"
        fill
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6 text-text-tertiary ">
        <h1 className="text-6xl font-extrabold leading-tight">
          Welcome to CollabVertex
        </h1>

        <p className="text-2xl max-w-2xl mb-6 text-text-secondary ">
          Discover the ultimate platform that bridges the gap between brands and influencers.
          Collaborate, create, and amplify your reach like never before.
        </p>

        <div className="flex gap-4">
          <Link
            href="/select-role"
            className="bg-red-400 text-red-950 hover:bg-red-500 px-6 py-3 rounded-lg font-medium"
          >
            Get Started <span className="font-black">↑</span>
          </Link>

          <Link
            href="/login"
            className="bg-button-primary text-red-950 hover:bg-red-500 px-6 py-3 rounded-lg font-medium"
          >
            Login
          </Link>
        </div>
      </div>
    </section>
  );
}
