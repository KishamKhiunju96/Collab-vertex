import Link from "next/link";

export default function CTASection() {
    return(
        <section className="py-20 px-6 bg-background-light text-center">
            <h2 className="text-2xl font-bold test-center text-black mb-12">Ready to Collaborate</h2>
            <p className="text-black mb-8">Join us today and start your journey!</p>
            <Link href="/signup" className="text-black font-semibold underline hover:text-red-400">Join Now</Link>
        </section>
    );
}
