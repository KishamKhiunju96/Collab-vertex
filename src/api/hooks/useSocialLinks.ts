import { useCallback, useEffect, useState } from "react";
import {
  getSocialLinks,
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
  SocialLink,
} from "../services/influencerService";

export function useSocialLinks() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLinks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSocialLinks();
      setSocialLinks(data);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch social links",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const addLink = async (link: Omit<SocialLink, "id">) => {
    setLoading(true);
    setError(null);
    try {
      await createSocialLink(link);
      await fetchLinks();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to add social link",
      );
    } finally {
      setLoading(false);
    }
  };

  const editLink = async (id: string, link: Omit<SocialLink, "id">) => {
    setLoading(true);
    setError(null);
    try {
      await updateSocialLink(id, link);
      await fetchLinks();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to update social link",
      );
    } finally {
      setLoading(false);
    }
  };

  const removeLink = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteSocialLink(id);
      await fetchLinks();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to delete social link",
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    socialLinks,
    loading,
    error,
    addLink,
    editLink,
    removeLink,
    refetch: fetchLinks,
  };
}
