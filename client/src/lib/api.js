import { useAuthStore } from "@/store/useAuthStore";
import { useProjectStore } from "@/store/useProjectStore";
import {
  mockProjects,
  mockActivities,
  mockTemplates,
  mockNotifications,
  mockGitCommits,
  GIT_WORKING_TREE,
  GIT_BRANCHES,
} from "./mockData";
import { normalizeError, QueryError } from "./queryError";

const BASE_URL = import.meta.env.VITE_API_URL || "";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const request = async (method, path, body = null, isRetry = false) => {
  const token = useAuthStore.getState().token;
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  const options = { 
    method, 
    headers,
    credentials: "include",
    signal: controller.signal
  };
  if (body) options.body = JSON.stringify(body);

  try {
    const response = await fetch(`${BASE_URL}${path}`, options);
    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 401 && !isRetry && path !== "/auth/refresh" && path !== "/auth/login") {
        try {
          // Attempt token refresh
          const refreshRes = await request("POST", "/auth/refresh", null, true);
          if (refreshRes && refreshRes.data && refreshRes.data.accessToken) {
            useAuthStore.getState().login(useAuthStore.getState().user, refreshRes.data.accessToken);
            // Retry original request
            return await request(method, path, body, true);
          }
        } catch (refreshErr) {
          useAuthStore.getState().logout();
          window.location.href = "/login";
          throw normalizeError(refreshErr);
        }
      }

      let errorData;
      try {
        errorData = await response.json();
      } catch (_e) {
        errorData = {};
      }
      throw new QueryError(errorData.message || `HTTP ${response.status}`, response.status, errorData.code);
    }
    
    // For 204 No Content or empty responses
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new QueryError("Request timed out", 408);
    }
    throw normalizeError(error);
  } finally {
    clearTimeout(timeoutId);
  }
};

const generateId = () => Math.random().toString(36).substr(2, 9);

export const api = {
  auth: {
    logout: async () => {
      if (BASE_URL) return request("POST", "/auth/logout");
      console.warn("Using mock data for POST /auth/logout");
      await delay(400);
      return { success: true };
    },
    login: async ({ email, password }) => {
      if (BASE_URL) return request("POST", "/auth/login", { email, password });
      await delay(800);
      return {
        user: {
          id: "usr_" + Date.now(),
          name: email.split("@")[0],
          email,
          avatar: `https://i.pravatar.cc/150?u=${email}`,
        },
        token: "mock-jwt-" + Date.now(),
      };
    },
    signup: async ({ name, email, password }) => {
      if (BASE_URL) return request("POST", "/auth/signup", { name, email, password });
      await delay(800);
      return {
        user: {
          id: "usr_" + Date.now(),
          name: name || email.split("@")[0],
          email,
          avatar: `https://i.pravatar.cc/150?u=${email}`,
        },
        token: "mock-jwt-" + Date.now(),
      };
    },
    forgotPassword: async ({ email }) => {
      if (BASE_URL) return request("POST", "/auth/forgot-password", { email });
      await delay(800);
      return { success: true };
    },
    resetPassword: async ({ token, password }) => {
      if (BASE_URL) return request("POST", "/auth/reset-password", { token, password });
      await delay(800);
      return { success: true };
    },
    verifyEmail: async ({ token }) => {
      if (BASE_URL) return request("POST", "/auth/verify-email", { token });
      await delay(500);
      return { success: true };
    },
    me: async () => {
      if (BASE_URL) return request("GET", "/auth/me");
      await delay(300);
      const user = useAuthStore.getState().user;
      if (!user) throw new Error("Not authenticated");
      return user;
    },
    sessions: async () => {
      if (BASE_URL) return request("GET", "/auth/sessions");
      await delay(500);
      return [
        { id: 1, device: "MacBook Pro 14\"", browser: "Chrome 120", location: "San Francisco, CA", ip: "192.168.1.1", time: "Active now", current: true },
        { id: 2, device: "iPhone 13 Pro", browser: "Safari Mobile", location: "San Francisco, CA", ip: "10.0.0.45", time: "2 hours ago", current: false },
        { id: 3, device: "Windows PC", browser: "Firefox 118", location: "Seattle, WA", ip: "172.16.0.2", time: "Yesterday", current: false },
        { id: 4, device: "iPad Air", browser: "Safari", location: "Portland, OR", ip: "192.168.1.5", time: "3 days ago", current: false },
      ];
    },
    revokeSession: async (id) => {
      if (BASE_URL) return request("DELETE", `/auth/sessions/${id}`);
      await delay(600);
      return { success: true };
    },
    revokeAllOtherSessions: async () => {
      if (BASE_URL) return request("DELETE", "/auth/sessions/others");
      await delay(800);
      return { success: true };
    },
    loginHistory: async () => {
      if (BASE_URL) return request("GET", "/auth/login-history");
      await delay(400);
      return [
        { id: 1, device: "MacBook Pro 14\"", browser: "Chrome 120", location: "San Francisco, CA", ip: "192.168.1.1", time: "Active now", current: true },
        { id: 2, device: "iPhone 13 Pro", browser: "Safari Mobile", location: "San Francisco, CA", ip: "10.0.0.45", time: "2 hours ago", current: false },
        { id: 3, device: "Windows PC", browser: "Firefox 118", location: "Seattle, WA", ip: "172.16.0.2", time: "Yesterday", current: false },
      ];
    },
    enable2FA: async ({ code }) => {
      if (BASE_URL) return request("POST", "/auth/2fa/enable", { code });
      await delay(800);
      if (code !== "123456" && code.length !== 6) throw new Error("Invalid code");
      return { success: true };
    },
  },
  projects: {
    list: async ({ scope, search, sort } = {}) => {
      if (BASE_URL) {
        const query = new URLSearchParams({ scope, search, sort }).toString();
        return request("GET", `/projects?${query}`);
      }
      await delay(600);
      let res = [...mockProjects];
      if (search) res = res.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
      return res;
    },
    get: async (id) => {
      if (BASE_URL) return request("GET", `/projects/${id}`);
      await delay(500);
      const proj = mockProjects.find((p) => p.id === id);
      if (!proj) throw new Error("Not found");
      return proj;
    },
    create: async ({ name, description, visibility, templateId }) => {
      if (BASE_URL) return request("POST", "/projects", { name, description, visibility, templateId });
      await delay(800);
      const newProj = {
        id: "proj_" + generateId(),
        name,
        description,
        visibility,
        templateId,
        language: "JavaScript",
        framework: "React",
        updatedAt: new Date().toISOString(),
        collaborators: [],
      };
      return newProj;
    },
    update: async (id, patch) => {
      if (BASE_URL) return request("PATCH", `/projects/${id}`, patch);
      await delay(600);
      const proj = mockProjects.find((p) => p.id === id);
      if (!proj) throw new Error("Not found");
      return { ...proj, ...patch };
    },
    delete: async (id) => {
      if (BASE_URL) return request("DELETE", `/projects/${id}`);
      await delay(800);
      return { success: true };
    },
    star: async (id) => {
      if (BASE_URL) return request("POST", `/projects/${id}/star`);
      await delay(400);
      return { success: true };
    },
    unstar: async (id) => {
      if (BASE_URL) return request("DELETE", `/projects/${id}/star`);
      await delay(400);
      return { success: true };
    },
    archive: async (id) => {
      if (BASE_URL) return request("POST", `/projects/${id}/archive`);
      await delay(400);
      return { success: true };
    },
    restore: async (id) => {
      if (BASE_URL) return request("DELETE", `/projects/${id}/archive`);
      await delay(400);
      return { success: true };
    },
  },
  files: {
    tree: async (projectId) => {
      if (BASE_URL) return request("GET", `/projects/${projectId}/files`);
      await delay(500);
      const seed = useProjectStore.getState().SEED_PROJECT_FILES || [];
      return seed;
    },
    read: async (projectId, filePath) => {
      if (BASE_URL) return request("GET", `/projects/${projectId}/files/${encodeURIComponent(filePath)}`);
      await delay(300);
      const seed = useProjectStore.getState().SEED_PROJECT_FILES || [];
      const file = seed.find((f) => f.path === filePath);
      return file ? file.content : "";
    },
    write: async (projectId, filePath, content) => {
      if (BASE_URL) return request("PUT", `/projects/${projectId}/files/${encodeURIComponent(filePath)}`, { content });
      await delay(400);
      return { success: true };
    },
    create: async (projectId, filePath, isFolder) => {
      if (BASE_URL) return request("POST", `/projects/${projectId}/files`, { filePath, isFolder });
      await delay(400);
      return { id: generateId(), path: filePath, name: filePath.split("/").pop(), type: isFolder ? "folder" : "file" };
    },
    delete: async (projectId, filePath) => {
      if (BASE_URL) return request("DELETE", `/projects/${projectId}/files/${encodeURIComponent(filePath)}`);
      await delay(400);
      return { success: true };
    },
    rename: async (projectId, oldPath, newPath) => {
      if (BASE_URL) return request("POST", `/projects/${projectId}/files/rename`, { oldPath, newPath });
      await delay(400);
      return { success: true };
    },
  },
  members: {
    list: async (projectId) => {
      if (BASE_URL) return request("GET", `/projects/${projectId}/members`);
      await delay(400);
      const proj = mockProjects.find((p) => p.id === projectId);
      return proj ? proj.collaborators : [];
    },
    invite: async (projectId, { email, role }) => {
      if (BASE_URL) return request("POST", `/projects/${projectId}/members`, { email, role });
      await delay(600);
      return { id: "inv_" + generateId(), email, role, status: "pending" };
    },
    updateRole: async (projectId, memberId, role) => {
      if (BASE_URL) return request("PATCH", `/projects/${projectId}/members/${memberId}`, { role });
      await delay(400);
      return { success: true, role };
    },
    remove: async (projectId, memberId) => {
      if (BASE_URL) return request("DELETE", `/projects/${projectId}/members/${memberId}`);
      await delay(500);
      return { success: true };
    },
    acceptInvite: async (token) => {
      if (BASE_URL) return request("POST", "/members/accept-invite", { token });
      await delay(800);
      return { success: true, projectId: "proj_" + generateId() };
    },
  },
  notifications: {
    list: async () => {
      if (BASE_URL) return request("GET", "/notifications");
      await delay(300);
      return mockNotifications;
    },
    markRead: async (id) => {
      if (BASE_URL) return request("POST", `/notifications/${id}/read`);
      await delay(200);
      return { success: true };
    },
    markAllRead: async () => {
      if (BASE_URL) return request("POST", "/notifications/read-all");
      await delay(400);
      return { success: true };
    },
  },
  activity: {
    list: async ({ scope } = {}) => {
      if (BASE_URL) return request("GET", `/activity?scope=${scope || ""}`);
      await delay(400);
      return mockActivities;
    },
  },
  templates: {
    list: async () => {
      if (BASE_URL) return request("GET", "/templates");
      await delay(300);
      return mockTemplates;
    },
  },
  git: {
    status: async (projectId) => {
      if (BASE_URL) return request("GET", `/projects/${projectId}/git/status`);
      await delay(400);
      return GIT_WORKING_TREE;
    },
    branches: async (projectId) => {
      if (BASE_URL) return request("GET", `/projects/${projectId}/git/branches`);
      await delay(300);
      return GIT_BRANCHES;
    },
    commits: async (projectId) => {
      if (BASE_URL) return request("GET", `/projects/${projectId}/git/commits`);
      await delay(400);
      return mockGitCommits;
    },
    commit: async (projectId, message) => {
      if (BASE_URL) return request("POST", `/projects/${projectId}/git/commits`, { message });
      await delay(800);
      return { success: true, hash: generateId() };
    },
    createBranch: async (projectId, name) => {
      if (BASE_URL) return request("POST", `/projects/${projectId}/git/branches`, { name });
      await delay(600);
      return { success: true, name };
    },
    switchBranch: async (projectId, name) => {
      if (BASE_URL) return request("POST", `/projects/${projectId}/git/branches/switch`, { name });
      await delay(500);
      return { success: true, name };
    },
  },
};
