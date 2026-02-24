import api from "@/api/axiosInstance";
import { API_PATHS } from "@/api/apiPaths";
import { Event, EventApplication } from "../types/event.types";

// Type for the raw application response from backend
interface RawApplicationResponse {
  id: string;
  event_id: string;
  influencer_id?: string;
  user_id?: string;
  applicant_id?: string;
  status: string;
  applied_at: string;
  // Possible embedded influencer data
  influencer_name?: string;
  name?: string;
  username?: string;
  email?: string;
  niche?: string;
  audience_size?: number;
  engagement_rate?: number;
  bio?: string;
  location?: string;
  // Nested influencer object (if backend returns it this way)
  influencer?: {
    id?: string;
    name?: string;
    username?: string;
    email?: string;
    niche?: string;
    audience_size?: number;
    engagement_rate?: number;
    bio?: string;
    location?: string;
  };
}

export const eventService = {
  async getEventById(eventId: string): Promise<Event> {
    const res = await api.get(API_PATHS.EVENT.GET_BY_ID(eventId));
    return res.data;
  },

  async getEventApplications(eventId: string): Promise<EventApplication[]> {
    try {
      console.log("Fetching applications for event:", eventId);
      const res = await api.get(API_PATHS.EVENT.GET_APPLICATIONS(eventId));
      const applications = res.data;
      console.log("Raw applications response:", applications);
      console.log("Number of applications:", applications?.length);

      // Log each application to debug influencer_id issues
      if (Array.isArray(applications) && applications.length > 0) {
        applications.forEach((app: RawApplicationResponse, index: number) => {
          console.log(`Application ${index + 1} - Full object:`, app);
          console.log(`Application ${index + 1} - Parsed:`, {
            id: app.id,
            event_id: app.event_id,
            influencer_id: app.influencer_id,
            user_id: app.user_id,
            applicant_id: app.applicant_id,
            status: app.status,
            applied_at: app.applied_at,
          });
        });
      }

      // If applications is empty or not an array, return empty array
      if (!Array.isArray(applications) || applications.length === 0) {
        console.log("No applications found or invalid response");
        return [];
      }

      // Fetch event details for title (optional)
      let eventTitle = "Event";
      try {
        const eventRes = await api.get(API_PATHS.EVENT.GET_BY_ID(eventId));
        eventTitle = eventRes.data?.title || "Event";
      } catch {
        console.warn("Failed to fetch event title, using default");
      }

      // Enrich each application with influencer details (optional)
      const enrichedApplications = await Promise.all(
        applications.map(async (app: RawApplicationResponse) => {
          // Check if influencer data is already included in the response
          const hasEmbeddedInfluencer =
            app.influencer_name ||
            app.influencer?.name ||
            app.name ||
            app.username;

          console.log(
            `Application ${app.id} - Checking for embedded influencer data:`,
            {
              influencer_name: app.influencer_name,
              influencer_object: app.influencer,
              name: app.name,
              username: app.username,
              hasEmbeddedInfluencer,
            },
          );

          // If influencer data is already embedded, use it directly
          if (hasEmbeddedInfluencer) {
            const influencerData = app.influencer || app;
            console.log(
              `Using embedded influencer data for application ${app.id}`,
            );

            return {
              id: app.id,
              event_id: app.event_id,
              influencer_id:
                app.influencer_id ||
                app.user_id ||
                app.applicant_id ||
                influencerData.id ||
                "unknown",
              status: app.status as "pending" | "accepted" | "rejected",
              applied_at: app.applied_at,
              event_title: eventTitle,
              influencer_name:
                app.influencer_name ||
                influencerData.username ||
                influencerData.name ||
                influencerData.email ||
                "Applicant",
              niche: influencerData.niche,
              audience_size: influencerData.audience_size,
              engagement_rate: influencerData.engagement_rate,
              bio: influencerData.bio,
              location: influencerData.location,
              email: influencerData.email,
            } as EventApplication;
          }

          // Try to get influencer ID from various possible field names
          const influencerId =
            app.influencer_id || app.user_id || app.applicant_id;

          // Validate that we have a valid influencer ID
          if (
            !influencerId ||
            influencerId === "undefined" ||
            influencerId === "null"
          ) {
            console.warn(
              `Application ${app.id} has invalid or missing influencer_id. Available fields:`,
              {
                influencer_id: app.influencer_id,
                user_id: app.user_id,
                applicant_id: app.applicant_id,
                full_app: app,
              },
            );
            return {
              id: app.id,
              event_id: app.event_id,
              influencer_id: "unknown",
              status: app.status as "pending" | "accepted" | "rejected",
              applied_at: app.applied_at,
              event_title: eventTitle,
              influencer_name: "Unknown Applicant (Missing ID)",
            } as EventApplication;
          }

          // Start with basic application data
          const basicApp: EventApplication = {
            id: app.id,
            event_id: app.event_id,
            influencer_id: influencerId,
            status: app.status as "pending" | "accepted" | "rejected",
            applied_at: app.applied_at,
            event_title: eventTitle,
            influencer_name: "Applicant",
          };

          // Try to fetch influencer profile (non-blocking)
          try {
            console.log(
              `Attempting to fetch influencer profile for ID: ${influencerId}`,
            );
            console.log(
              `Using API endpoint: ${API_PATHS.INFLUENCER.GET_BY_ID(influencerId)}`,
            );

            const influencerRes = await api.get(
              API_PATHS.INFLUENCER.GET_BY_ID(influencerId),
            );
            const influencer = influencerRes.data;

            console.log(
              `Influencer API response for ${influencerId}:`,
              influencer,
            );

            if (influencer) {
              console.log(
                `Successfully fetched influencer data for ${influencerId}`,
              );
              return {
                ...basicApp,
                influencer_name:
                  influencer.username ||
                  influencer.name ||
                  influencer.email ||
                  "Applicant",
                niche: influencer.niche,
                audience_size: influencer.audience_size,
                engagement_rate: influencer.engagement_rate,
                bio: influencer.bio,
                location: influencer.location,
                email: influencer.email,
              };
            }
          } catch (influencerError: unknown) {
            // Log detailed error information
            const error = influencerError as {
              response?: { status?: number; data?: unknown };
              message?: string;
            };
            console.error(`Failed to fetch influencer ${influencerId}:`, {
              status: error?.response?.status,
              message: error?.message,
              data: error?.response?.data,
            });
            console.warn(
              `Could not fetch influencer ${influencerId} (Status: ${error?.response?.status || "unknown"}). Using basic application data.`,
            );
          }

          // Return basic application if influencer fetch failed
          return basicApp;
        }),
      );

      console.log(
        `Successfully enriched ${enrichedApplications.length} applications`,
      );
      return enrichedApplications;
    } catch (error) {
      console.error("Failed to fetch event applications:", error);
      throw error;
    }
  },
};
