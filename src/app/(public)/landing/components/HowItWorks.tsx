const steps = [
"Create a profile: Brand or Influencer",
"Post or apply to Events & Campaigns",
"Collaborate & deliver results",
"Get paid & grow your network",
];


export default function HowItWorks() {
return (
<section className="py-20 px-6 bg-gray-700 h-screen md:h-[50vh] flex flex-col justify-center">
    <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
    <div className="flex flex-col md:flex-row text-white  gap-8 max-w-5xl mx-auto">
        {steps.map((step, index) => (
        <div key={index} className="flex-1 text-center">
    <div className="text-4xl font-bold text-white mb-4">{index + 1}</div>
    <p className="text-gray-300">{step}</p>
    </div>
    ))}
    </div>
</section>
);
}