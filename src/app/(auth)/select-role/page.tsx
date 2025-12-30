import RoleCard from "./components/RoleCard";

export default function SelectRolePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-12">

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
             Collab-vertex
          </h1>
          <p className="text-lg text-gray-600">
            Choose a way to collaborate with the Brands and a Influencer with us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 text-black gap-8">
          <RoleCard
            role="Brand"
            title="Brand"
            description="Creating Events"
            imageUrl="/images/Branding2.jpg"
            buttonText="Register"
            accentColor="red"
          />

          <RoleCard
            role="Influencer"
            title="Influencer"
            description="Searching for Events"
            imageUrl="/images/Influencer1.jpg"
            buttonText="Register"
            accentColor="green"
          />
        </div>
      </div>
    </main>
  );
}
