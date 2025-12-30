const steps = [
  "Create a profile: Brand or Influencer",
  "Post or apply to Events & Campaigns",
  "Collaborate & deliver results",
  "Get paid & grow your network",
];

export default function HowItWorks() {
  return (
    <section className="py-20 px-6 bg-background-light">
      <h2 className="text-4xl md:text-5xl font-bold text-black text-center mb-16">
        How It Works
      </h2>

      <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto ">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex-1 bg-elevated p-6 rounded-lg shadow-md  flex flex-col items-center text-center transition-transform hover:scale-105"
          >
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-black text-white text-2xl font-bold mb-6">
              {index + 1}
            </div>
            <p className="text-gray-800 text-lg md:text-xl ">{step}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
