type Feature = {
  title: string;
  desc: string;
};

const features: Feature[] = [
  { title: "Smart Matching", desc: "AI-powered brand & influencer matching." },
  { title: "Secure Payments", desc: "Transparent & milestone-based payouts." },
  { title: "Event Tracking", desc: "Track performance in real time." },
  { title: "In-App Chat", desc: "Collaborate without leaving the platform." },
];

export default function FeaturesGrid() {
  return (
    <section className="py-20 px-6 bg-background-light h-screen md:h-[50vh] flex flex-col justify-center">
      <h2 className=" font- text-3xl text-black font-bold text-center mb-12">
        Platform Features
      </h2>

      <div className="grid md:grid-cols-4 gap-8 max-w-screen-xl mx-auto ">
        {features.map((f) => (
          <div
            key={f.title}
            className="bg-elevated p-6 rounded-lg shadow-md  transition-transform duration-800 hover:scale-105"
          >
            <h3 className="font-semibold text-black text-xl mb-2">{f.title}</h3>
            <p className="text-black">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
