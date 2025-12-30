// pages/services.jsx

import Navbar from "@/components/common/Navbar";

const Services = () => {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Our Services</h1>
        <ul className="list-disc pl-6">
          <li>User Management: Registration, authentication, role division (Brands/Influencers), profile creation and editing.</li>
          <li>Social Media Integrations: Link accounts to fetch analytics.</li>
          <li>Event Management: Create, edit, and list marketing events.</li>
          <li>Collaboration and Communication: Messaging, comments, and feedback.</li>
          <li>Notification Management: Alerts for updates.</li>
          <li>Search and Discovery: Search influencers or events.</li>
          <li>Data and Security: Secure storage and role-based access.</li>
        </ul>
      </div>
    </div>
  );
};

export default Services;
