export default function RolePreviewCards() {
    return (
        <section className="py-20 px-6 bg-gray-400">
            <h2 className="text-3xl text-gray-950 font-bold text-center mb-12">
                Role Preview Cards
            </h2>
            <div className="grid md:grid-cols -2 gap-8 max-w-3xl mx-auto">
                <div className="bg-white p-8 rounded-xl shadow">
                    <h3 className="text-2xl text-gray-950 font-semibold mb-4">For Brands</h3>
                    <p className="text-gray-800">Discover Influencers, Manage Events</p>
                </div>
                <div className="bg-white p-8 rounded-xl shadow">
                    <h3 className="text-2xl text-gray-950 font-semibold mb-4">For Influencers</h3>
                    <p className="text-gray-800">Find Campaigns, Grow Your Network</p>
                </div>
            </div>
        </section>
    )
}