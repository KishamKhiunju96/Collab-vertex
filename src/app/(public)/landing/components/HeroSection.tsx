import Link from "next/link";

export default function HeroSection() {
    return (
        <section className="w-full h-screen bg-gray-700 text-white text-center py-24 px-6 flex flex-col justify-center items-center">
            <h1 className="text-3xl font-bold">
                Welcome to CollabVertex. Connect Brands and Influencers
            </h1>
            <p className="text-lg text-gray-200 max-w-2xl mx-auto mb-8">
                Discover the ultimate platform that bridges the gap between brands and influencers.
                Collaborate, create, and amplify your reach like never before.
            </p>
            <div className="flex justify-center gap-4">
                <Link href="/Register" className="bg-white text-black text-center rounded-lg font-medium px-6 py-3">Get Started</Link>
                <Link href="/Login" className="bg-white text-black text-center rounded-lg font-medium px-6 py-3">Login</Link>
            </div>
        </section>
    )
}