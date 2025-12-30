export default function RolePreviewCards() {
    return (
        <section className="py-20 px-6 bg-background-light">
            <h2 className="text-3xl text-black font-bold text-center mb-12">
                Role Preview Cards
            </h2>
            <div className="grid md:grid-cols -2 gap-8 max-w-screen-xl mx-auto ">
                <div className="bg-white p-8 rounded-xl shadow transform transition-transform duration-800 hover:scale-105">
                    <h3 className="text-2xl text-gray-950 font-semibold mb-4">For Brands</h3>
                    <p className="text-gray-800">Discover Influencers, Manage Events</p>
                </div>
                <div className="bg-white p-8 rounded-xl shadow transform transition-transform duration-800 hover:scale-105">
                    <h3 className="text-2xl text-gray-950 font-semibold mb-4">For Influencers</h3>
                    <p className="text-gray-800">Find Events, Grow Your Network</p>
                </div>
            </div>
        </section>
    )
}
