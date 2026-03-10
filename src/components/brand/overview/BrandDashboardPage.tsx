"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Trash2, Bell, Plus, Loader2, X } from "lucide-react";

import {
  brandService,
  Brand,
  UpdateBrandPayload,
} from "@/api/services/brandService";
import CreateBrandForm from "@/components/brand/CreateBrandForm";
import { useUserData } from "@/api/hooks/useUserData";

import Modal from "@/components/ui/Modal";
import { notify } from "@/utils/notify";

import { useNotificationContext } from "@/context/NotificationContext";
import InfluencerSearchBox from "@/components/brand/InfluencerSearchBox";
import UpdateBrandModal from "@/components/brand/UpdateBrandModal";

export default function BrandDashboardPage() {
  const router = useRouter();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotificationContext();

  const { user, loading: userLoading } = useUserData();

  const fetchBrands = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedBrands = await brandService.getBrands();
      setBrands(fetchedBrands);
    } catch (err) {
      notify.error("Failed to load brands.");
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
  }, [userLoading, user, fetchBrands]);

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleDeleteNotification = async (notifId: string) => {
    await deleteNotification(notifId);
  };

  const handleNotificationClick = async (notif: (typeof notifications)[0]) => {
    if (!notif.is_read) {
      await markAsRead(notif.id);
    }

    if (notif.data?.event_id) {
      setIsNotifOpen(false);
      router.push(`/brand/events/${notif.data.event_id}`);
    }
  };

  const handleCreateSuccess = async () => {
    setIsCreateOpen(false);
    await fetchBrands();
  };

  const handleEdit = (brand: Brand) => {
    setSelectedBrand(brand);
    setIsUpdateOpen(true);
  };

  const handleUpdate = async (payload: UpdateBrandPayload) => {
    if (!selectedBrand) return;

    try {
      await brandService.updateBrand(selectedBrand.id, payload);
      notify.success("Brand updated successfully");
      setIsUpdateOpen(false);
      setSelectedBrand(null);
      await fetchBrands();
    } catch (err) {
      notify.error("Failed to update brand");
      throw err;
    }
  };

  const handleDelete = async (brandId: string) => {
    const confirmed = confirm("Are you sure you want to delete this brand?");
    if (!confirmed) return;

    try {
      await brandService.deleteBrand(brandId);
      setBrands((prev) => prev.filter((b) => b.id !== brandId));
      notify.success("Brand deleted successfully");
    } catch (err) {
      notify.error("Failed to delete brand");
    }
  };

  if (userLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-red-600">
        Failed to load user data
      </div>
    );
  }

  return (
    <>
      <div className=" w-full bg-gray-50">
        <div className="mx-auto max-w-screen-2xl space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Hi {user.username}, Welcome to Collab Vertex
              </h1>
              <p className="mt-1 text-sm text-gray-500 sm:text-base">
                Manage your brands, collaborate with influencers, and track
                performance.
              </p>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen((prev) => !prev)}
                className="relative rounded-lg border border-gray-200 bg-white p-2 text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotifOpen && (
                <>
                  {/* Backdrop for mobile */}
                  <div
                    className="fixed inset-0 z-40 bg-black/20 sm:hidden"
                    onClick={() => setIsNotifOpen(false)}
                  />

                  <div className="fixed inset-x-4 top-20 z-50 max-h-[80vh] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-96">
                    {notifications.length > 0 && (
                      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                        <span className="text-sm font-semibold text-gray-900">
                          Notifications
                        </span>
                        <button
                          onClick={handleMarkAllAsRead}
                          className="text-xs font-medium text-blue-600 transition-colors hover:text-blue-700"
                        >
                          Mark all as read
                        </button>
                      </div>
                    )}

                    <div className="max-h-[400px] overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-12 text-center">
                          <p className="text-sm text-gray-500">
                            No notifications yet
                          </p>
                          <p className="mt-1 text-xs text-gray-400">
                            We'll notify you when something important happens
                          </p>
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`border-b border-gray-50 px-4 py-3 transition-colors last:border-0 ${
                              !notif.is_read ? "bg-blue-50/50" : "bg-white"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className="min-w-0 flex-1 cursor-pointer"
                                onClick={() => handleNotificationClick(notif)}
                              >
                                {notif.title && (
                                  <p className="text-sm font-medium text-gray-900">
                                    {notif.title}
                                  </p>
                                )}
                                <p className="mt-0.5 text-sm text-gray-600">
                                  {notif.message}
                                </p>
                                <p className="mt-1 text-xs text-gray-400">
                                  {new Date(notif.created_at).toLocaleString()}
                                </p>
                                {!notif.is_read && (
                                  <div className="mt-2 inline-flex items-center gap-1">
                                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                    <span className="text-xs font-medium text-blue-600">
                                      New
                                    </span>
                                  </div>
                                )}
                              </div>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteNotification(notif.id);
                                }}
                                className="shrink-0 rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                                title="Delete"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Search */}
          <InfluencerSearchBox />

          {/* Empty State */}
          {!loading && brands.length === 0 && (
            <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center">
              <div className="mx-auto mb-4 h-20 w-20 text-gray-200">
                <svg
                  viewBox="0 0 200 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray="8 8"
                  />
                  <rect
                    x="70"
                    y="80"
                    width="60"
                    height="40"
                    rx="4"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <line
                    x1="100"
                    y1="120"
                    x2="100"
                    y2="140"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <line
                    x1="85"
                    y1="140"
                    x2="115"
                    y2="140"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                No Brand Profile Found
              </h3>
              <p className="mx-auto max-w-sm text-sm leading-relaxed text-gray-500">
                Click the <strong className="font-medium">Create Brand</strong>{" "}
                button below to get started and begin your collaboration
                journey.
              </p>
            </div>
          )}

          {/* Brands Table */}
          {brands.length > 0 && (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-gray-100 bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                        Brand Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                        Location
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                        Website
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {brands.map((brand) => (
                      <tr
                        key={brand.id}
                        className="transition-colors hover:bg-gray-50"
                      >
                        <td className="px-4 py-3">
                          <Link
                            href={`/dashboard/brand/${brand.id}`}
                            className="font-medium text-gray-900 transition-colors hover:text-blue-600"
                          >
                            {brand.name}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {brand.location || "—"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {brand.websiteUrl || "—"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1">
                            <Link
                              href={`/dashboard/brand/${brand.id}`}
                              className="rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                              title="View"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => handleEdit(brand)}
                              className="rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                              title="Edit"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(brand.id)}
                              className="rounded p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modals */}
        <Modal
          open={isCreateOpen}
          size="lg"
          onClose={() => setIsCreateOpen(false)}
        >
          <CreateBrandForm
            onSuccess={handleCreateSuccess}
            onCancel={() => setIsCreateOpen(false)}
          />
        </Modal>

        {selectedBrand && (
          <UpdateBrandModal
            open={isUpdateOpen}
            initial={{
              name: selectedBrand.name,
              description: selectedBrand.description,
              location: selectedBrand.location,
              websiteUrl: selectedBrand.websiteUrl,
            }}
            onClose={() => {
              setIsUpdateOpen(false);
              setSelectedBrand(null);
            }}
            onUpdate={handleUpdate}
          />
        )}

        {/* FAB */}
        <button
          onClick={() => setIsCreateOpen(true)}
          className="fixed bottom-6 right-6 z-30 flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl sm:px-6 sm:py-3"
          aria-label="Create New Brand"
        >
          <Plus className="h-5 w-5" />
          <span className="hidden sm:inline">Create Brand</span>
        </button>
      </div>
    </>
  );
}