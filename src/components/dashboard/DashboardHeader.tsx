export default function DashboardHeader() {
  return (
    <header className="flex justify-between items-center py-4 px-6 bg-white shadow-md rounded-b-2xl">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="search"
          className="px-4 py-2 rounded-lg border-2  focus:outline-none focus:ring-2 focus:ring-green-500"
        ></input>

        <button className="x-4 py-2  text-black rounded-lg transition">
          Profile
        </button>
      </div>
    </header>
  );
}
