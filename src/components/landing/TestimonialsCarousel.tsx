const testimonials = [
    "This platform transformed how brands connect with influencers!",
    "Amazing experience and smooth collaboration.",
    "Highly recommend for the creator community.",
    "The best platform for influencer marketing.",
];

export default function TestimonialsCarousel() {
    return(
        <section className="py-20 px-6 bg-background-light">
            <h2 className="text-3xl font-bold text-black text-center mb-12">What Users Says</h2>
            <div className="max-w-3xl mx-auto text-center">
                {testimonials.map((testimonial, index) => (
                    <p key={index} className="text-gray-800 mb-6">{testimonial}</p>
                ))}
            </div>
        </section>
    );
}
