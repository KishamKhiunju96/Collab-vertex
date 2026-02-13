"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Eye, Pencil, Trash2, Bell, Plus } from "lucide-react";

import { brandService, Brand } from "@/api/services/brandService";
import CreateBrandForm from "@/components/brand/CreateBrandForm";
import { useUserData } from "@/api/hooks/useUserData";

import Modal from "@/components/ui/Modal";
import { notify } from "@/utils/notify";
import { ActivityFeed } from "@/components/brand/overview/ActivityFeed";
import { brandActivities } from "@/data/brandactivities";
import { AnalyticsChart } from "@/components/analytics/AnalyticsChart";

import { useNotificationContext } from "@/context/NotificationContext";

export default function BrandDashboardPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotificationContext();

  // -----------------------------
  // User & Brand Data
  // -----------------------------
  const { user, loading: userLoading } = useUserData();

  const fetchBrands = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedBrands = await brandService.getBrands();
      setBrands(fetchedBrands);
    } catch (err) {
      console.error(err);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLoading, user]);

  const handleMarkAsRead = (notifId: string) => {
    markAsRead(notifId);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleDeleteNotification = async (notifId: string) => {
    await deleteNotification(notifId);
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
        <div className="loading-spinner"></div>
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
    <div className="dashboard-container p-6 space-y-8">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <h1 className="dashboard-title">
              Hi {user.username}, Welcome to Collab Vertex
            </h1>
            <p className="dashboard-subtitle">
              Manage your brands, collaborate with influencers, and track
              performance.
            </p>
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              className="notification-bell"
              onClick={() => setIsNotifOpen((prev) => !prev)}
              aria-label="Notifications"
            >
              <Bell size={24} className="text-gray-700" />
              {unreadCount > 0 && (
                <span className="notification-badge">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {isNotifOpen && (
              <div className="notification-dropdown">
                {notifications.length > 0 && (
                  <div className="notification-header">
                    <span className="notification-title">Notifications</span>
                    <button
                      onClick={handleMarkAllAsRead}
                      className="notification-mark-all"
                    >
                      Mark all as read
                    </button>
                  </div>
                )}

                <div className="notification-list">
                  {notifications.length === 0 && (
                    <div className="notification-empty">
                      <p>No notifications yet</p>
                      <p className="text-xs mt-1">
                        We&apos;ll notify you when something important happens
                      </p>
                    </div>
                  )}

                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`notification-item ${
                        !notif.is_read ? "unread" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div
                          className="flex-1"
                          onClick={() => handleMarkAsRead(notif.id)}
                        >
                          {notif.title && (
                            <p className="notification-item-title">
                              {notif.title}
                            </p>
                          )}

                          <p className="notification-item-message">
                            {notif.message}
                          </p>

                          <span className="notification-item-time">
                            {new Date(notif.created_at).toLocaleString()}
                          </span>

                          {!notif.is_read && (
                            <div className="notification-unread-indicator">
                              <div className="notification-unread-dot"></div>
                              <span className="notification-unread-text">
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
                          className="notification-delete-btn"
                          title="Delete notification"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Empty State */}
      {!loading && brands.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">
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
          <h3 className="empty-state-title">No Brand Profile Found</h3>
          <p className="empty-state-description">
            Click the <strong>Create Brand</strong> button below to get started
            and begin your collaboration journey.
          </p>
        </div>
      )}

      {/* Brand Table */}
      {brands.length > 0 && (
        <div className="brand-table-container">
          <table className="brand-table">
            <thead>
              <tr>
                <th>Brand Name</th>
                <th>Location</th>
                <th>Website</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((brand) => (
                <tr key={brand.id}>
                  <td>
                    <Link
                      href={`/dashboard/brand/${brand.id}`}
                      className="brand-table-link"
                    >
                      {brand.name}
                    </Link>
                  </td>
                  <td>{brand.location || "—"}</td>
                  <td>{brand.websiteUrl || "—"}</td>
                  <td>
                    <div className="brand-table-actions">
                      <Link
                        href={`/dashboard/brand/${brand.id}`}
                        className="brand-table-action-btn"
                        title="View Brand"
                      >
                        <Eye size={18} />
                      </Link>
                      <Link
                        href={`/dashboard/brand/${brand.id}/edit`}
                        className="brand-table-action-btn"
                        title="Edit Brand"
                      >
                        <Pencil size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(brand.id)}
                        className="brand-table-action-btn delete"
                        title="Delete Brand"
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

      {/* Analytics & Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AnalyticsChart />
        </div>
        <div>
          <ActivityFeed activities={brandActivities} />
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsCreateOpen(true)}
        className="fab-button"
        aria-label="Create New Brand"
      >
        <Plus size={20} />
        <span>Create Brand</span>
      </button>

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
