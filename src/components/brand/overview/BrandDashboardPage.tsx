"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Eye, Pencil, Trash2, Bell } from "lucide-react";

import { brandService, Brand } from "@/api/services/brandService";
import CreateBrandForm from "@/components/brand/CreateBrandForm";
import { useUserData } from "@/api/hooks/useUserData";

import Modal from "@/components/ui/Modal";
import { notify } from "@/utils/notify";
import { ActivityFeed } from "@/components/brand/overview/ActivityFeed";
import { brandActivities } from "@/data/brandactivities";
import { AnalyticsChart } from "@/components/analytics/AnalyticsChart";

import { useNotificationContext } from "@/context/NotificationContext";
import { useNotifications } from "@/api/hooks/useNotifications";

export default function BrandDashboardPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotificationContext();

  // Initialize notifications (SSE only, no polling)
  useNotifications();

  // -----------------------------
  // User & Brand Data
  // -----------------------------
  const { user, loading: userLoading } = useUserData();

  const fetchBrands = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedBrands = await brandService.getBrands();
      setBrands(fetchedBrands);
    } catch (err) {
      console.error(err);
      setError("Failed to load brands.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userLoading) return;

    if (!user) {
      notify.error("Unauthorized");
      return;
    }

    if (user.role !== "brand") {
      notify.error("Access denied");
      return;
    }

    fetchBrands();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLoading, user]); // Removed fetchBrands to prevent infinite loop

  const handleMarkAsRead = async (notifId: string) => {
    markAsRead(notifId);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  // -----------------------------
  // Brand Actions
  // -----------------------------
  const handleCreateSuccess = async () => {
    setIsCreateOpen(false);
    await fetchBrands();
  };

  const handleDelete = async (brandId: string) => {
    const confirmed = confirm("Are you sure you want to delete this brand?");
    if (!confirmed) return;

    try {
      await brandService.deleteBrand(brandId);
      setBrands((prev) => prev.filter((b) => b.id !== brandId));
      notify.success("Brand deleted successfully");
    } catch (err) {
      console.error(err);
      notify.error("Failed to delete brand");
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-red-500">
        Failed to load user data
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 text-black relative">
      {/* Header */}
      <div className="flex justify-between items-center relative">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Hi {user.username}, Welcome to Collab Vertex
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your brands, collaborate with influencers, and track
            performance.
          </p>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            className="relative p-2 rounded-full hover:bg-gray-100 transition"
            onClick={() => setIsNotifOpen((prev) => !prev)}
          >
            <Bell size={24} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-300 rounded shadow-lg z-50 max-h-96 overflow-hidden flex flex-col">
              {/* Header with Mark All as Read */}
              {notifications.length > 0 && (
                <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-between">
                  <span className="font-semibold text-gray-700">
                    Notifications
                  </span>
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Mark all as read
                  </button>
                </div>
              )}

              {/* Scrollable notification list */}
              <div className="overflow-y-auto max-h-80">
                {notifications.length === 0 && (
                  <div className="p-4 text-gray-500 text-center">
                    No notifications
                  </div>
                )}
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`px-4 py-3 border-b cursor-pointer hover:bg-gray-50 transition ${
                      !notif.is_read
                        ? "bg-blue-50 border-l-4 border-l-blue-500"
                        : ""
                    }`}
                    onClick={() => handleMarkAsRead(notif.id)}
                    title="Click to mark as read"
                  >
                    {/* Notification Title */}
                    {notif.title && (
                      <p className="font-semibold text-gray-900 mb-1">
                        {notif.title}
                      </p>
                    )}

                    {/* Notification Message */}
                    <p className="text-gray-700 text-sm">{notif.message}</p>

                    {/* Notification Timestamp */}
                    <small className="text-gray-400 text-xs mt-1 block">
                      {new Date(notif.created_at).toLocaleString()}
                    </small>

                    {/* Unread Indicator */}
                    {!notif.is_read && (
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-xs text-blue-600">New</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Create Brand Button */}
        <button
          onClick={() => setIsCreateOpen(true)}
          className="fixed bottom-6 right-6 bg-green-600 text-white px-5 py-3 rounded-full shadow-lg hover:bg-green-700 transition z-50"
        >
          + Create Brand
        </button>
      </div>

      {/* Empty state */}
      {!loading && brands.length === 0 && (
        <div className="text-gray-500 text-center py-10">
          No brand profile found. Click <b>+ Create Brand</b> to get started.
        </div>
      )}

      {/* Brand Table */}
      {brands.length > 0 && (
        <div className="bg-white rounded border border-gray-300 overflow-hidden">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-2 border-b">Name</th>
                <th className="px-4 py-2 border-b">Location</th>
                <th className="px-4 py-2 border-b">Website</th>
                <th className="px-4 py-2 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((brand) => (
                <tr key={brand.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">
                    <Link
                      href={`/dashboard/brand/${brand.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {brand.name}
                    </Link>
                  </td>
                  <td className="px-4 py-2 border-b">{brand.location}</td>
                  <td className="px-4 py-2 border-b">
                    {brand.websiteUrl ?? "-"}
                  </td>
                  <td className="px-4 py-2 border-b">
                    <div className="flex justify-center gap-3">
                      <Link href={`/dashboard/brand/${brand.id}`} title="View">
                        <Eye size={18} />
                      </Link>
                      <Link
                        href={`/dashboard/brand/${brand.id}/edit`}
                        title="Edit"
                      >
                        <Pencil size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(brand.id)}
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Analytics & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-gray-300 rounded p-4">
          <AnalyticsChart />
        </div>
        <ActivityFeed activities={brandActivities} />
      </div>

      {/* Create Brand Modal */}
      <Modal
        open={isCreateOpen}
        title="Create New Brand"
        size="lg"
        onClose={() => setIsCreateOpen(false)}
      >
        <CreateBrandForm
          onSuccess={handleCreateSuccess}
          onCancel={() => setIsCreateOpen(false)}
        />
      </Modal>
    </div>
  );
}
