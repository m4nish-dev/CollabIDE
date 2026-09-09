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

const BASE_URL = import.meta.env.VITE_API_URL || "";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchApi = async (endpoint, options = {}) => {
  const token = useAuthStore.getState().token;
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  const response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "API Error");
  }
  return response.json();
};

const generateId = () => Math.random().toString(36).substr(2, 9);

export const api = {
  auth: {
    login: async ({ email, password }) => {
      if (BASE_URL) return fetchApi("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
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
      if (BASE_URL) return fetchApi("/auth/signup", { method: "POST", body: JSON.stringify({ name, email, password }) });
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
      if (BASE_URL) return fetchApi("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) });
      await delay(800);
      return { success: true };
    },
    resetPassword: async ({ token, password }) => {
      if (BASE_URL) return fetchApi("/auth/reset-password", { method: "POST", body: JSON.stringify({ token, password }) });
      await delay(800);
      return { success: true };
    },
    verifyEmail: async ({ token }) => {
      if (BASE_URL) return fetchApi("/auth/verify-email", { method: "POST", body: JSON.stringify({ token }) });
      await delay(500);
      return { success: true };
    },
    me: async () => {
      if (BASE_URL) return fetchApi("/auth/me");
      await delay(300);
      const user = useAuthStore.getState().user;
      if (!user) throw new Error("Not authenticated");
      return user;
    },
  },
  projects: {
    list: async ({ scope, search, sort } = {}) => {
      if (BASE_URL) {
        const query = new URLSearchParams({ scope, search, sort }).toString();
        return fetchApi(`/projects?${query}`);
      }
      await delay(600);
      let res = [...mockProjects];
      if (search) res = res.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
      return res;
    },
    get: async (id) => {
      if (BASE_URL) return fetchApi(`/projects/${id}`);
      await delay(500);
      const proj = mockProjects.find((p) => p.id === id);
      if (!proj) throw new Error("Not found");
      return proj;
    },
    create: async ({ name, description, visibility, templateId }) => {
      if (BASE_URL) return fetchApi("/projects", { method: "POST", body: JSON.stringify({ name, description, visibility, templateId }) });
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
      if (BASE_URL) return fetchApi(`/projects/${id}`, { method: "PATCH", body: JSON.stringify(patch) });
      await delay(600);
      const proj = mockProjects.find((p) => p.id === id);
      if (!proj) throw new Error("Not found");
      return { ...proj, ...patch };
    },
    delete: async (id) => {
      if (BASE_URL) return fetchApi(`/projects/${id}`, { method: "DELETE" });
      await delay(800);
      return { success: true };
    },
    star: async (id) => {
      if (BASE_URL) return fetchApi(`/projects/${id}/star`, { method: "POST" });
      await delay(400);
      return { success: true };
    },
    unstar: async (id) => {
      if (BASE_URL) return fetchApi(`/projects/${id}/star`, { method: "DELETE" });
      await delay(400);
      return { success: true };
    },
    archive: async (id) => {
      if (BASE_URL) return fetchApi(`/projects/${id}/archive`, { method: "POST" });
      await delay(400);
      return { success: true };
    },
    restore: async (id) => {
      if (BASE_URL) return fetchApi(`/projects/${id}/archive`, { method: "DELETE" });
      await delay(400);
      return { success: true };
    },
  },
  files: {
    tree: async (projectId) => {
      if (BASE_URL) return fetchApi(`/projects/${projectId}/files`);
      await delay(500);
      const seed = useProjectStore.getState().SEED_PROJECT_FILES || [];
      return seed;
    },
    read: async (projectId, filePath) => {
      if (BASE_URL) return fetchApi(`/projects/${projectId}/files/${encodeURIComponent(filePath)}`);
      await delay(300);
      const seed = useProjectStore.getState().SEED_PROJECT_FILES || [];
      const file = seed.find((f) => f.path === filePath);
      return file ? file.content : "";
    },
    write: async (projectId, filePath, content) => {
      if (BASE_URL) return fetchApi(`/projects/${projectId}/files/${encodeURIComponent(filePath)}`, { method: "PUT", body: JSON.stringify({ content }) });
      await delay(400);
      return { success: true };
    },
    create: async (projectId, filePath, isFolder) => {
      if (BASE_URL) return fetchApi(`/projects/${projectId}/files`, { method: "POST", body: JSON.stringify({ filePath, isFolder }) });
      await delay(400);
      return { id: generateId(), path: filePath, name: filePath.split("/").pop(), type: isFolder ? "folder" : "file" };
    },
    delete: async (projectId, filePath) => {
      if (BASE_URL) return fetchApi(`/projects/${projectId}/files/${encodeURIComponent(filePath)}`, { method: "DELETE" });
      await delay(400);
      return { success: true };
    },
    rename: async (projectId, oldPath, newPath) => {
      if (BASE_URL) return fetchApi(`/projects/${projectId}/files/rename`, { method: "POST", body: JSON.stringify({ oldPath, newPath }) });
      await delay(400);
      return { success: true };
    },
  },
  members: {
    list: async (projectId) => {
      if (BASE_URL) return fetchApi(`/projects/${projectId}/members`);
      await delay(400);
      const proj = mockProjects.find((p) => p.id === projectId);
      return proj ? proj.collaborators : [];
    },
    invite: async (projectId, { email, role }) => {
      if (BASE_URL) return fetchApi(`/projects/${projectId}/members`, { method: "POST", body: JSON.stringify({ email, role }) });
      await delay(600);
      return { id: "inv_" + generateId(), email, role, status: "pending" };
    },
    updateRole: async (projectId, memberId, role) => {
      if (BASE_URL) return fetchApi(`/projects/${projectId}/members/${memberId}`, { method: "PATCH", body: JSON.stringify({ role }) });
      await delay(400);
      return { success: true, role };
    },
    remove: async (projectId, memberId) => {
      if (BASE_URL) return fetchApi(`/projects/${projectId}/members/${memberId}`, { method: "DELETE" });
      await delay(500);
      return { success: true };
    },
  },
  notifications: {
    list: async () => {
      if (BASE_URL) return fetchApi("/notifications");
      await delay(300);
      return mockNotifications;
    },
    markRead: async (id) => {
      if (BASE_URL) return fetchApi(`/notifications/${id}/read`, { method: "POST" });
      await delay(200);
      return { success: true };
    },
    markAllRead: async () => {
      if (BASE_URL) return fetchApi("/notifications/read-all", { method: "POST" });
      await delay(400);
      return { success: true };
    },
  },
  activity: {
    list: async ({ scope } = {}) => {
      if (BASE_URL) return fetchApi(`/activity?scope=${scope || ""}`);
      await delay(400);
      return mockActivities;
    },
  },
  templates: {
    list: async () => {
      if (BASE_URL) return fetchApi("/templates");
      await delay(300);
      return mockTemplates;
    },
  },
  git: {
    status: async (projectId) => {
      if (BASE_URL) return fetchApi(`/projects/${projectId}/git/status`);
      await delay(400);
      return GIT_WORKING_TREE;
    },
    branches: async (projectId) => {
      if (BASE_URL) return fetchApi(`/projects/${projectId}/git/branches`);
      await delay(300);
      return GIT_BRANCHES;
    },
    commits: async (projectId) => {
      if (BASE_URL) return fetchApi(`/projects/${projectId}/git/commits`);
      await delay(400);
      return mockGitCommits;
    },
    commit: async (projectId, message) => {
      if (BASE_URL) return fetchApi(`/projects/${projectId}/git/commits`, { method: "POST", body: JSON.stringify({ message }) });
      await delay(800);
      return { success: true, hash: generateId() };
    },
    createBranch: async (projectId, name) => {
      if (BASE_URL) return fetchApi(`/projects/${projectId}/git/branches`, { method: "POST", body: JSON.stringify({ name }) });
      await delay(600);
      return { success: true, name };
    },
    switchBranch: async (projectId, name) => {
      if (BASE_URL) return fetchApi(`/projects/${projectId}/git/branches/switch`, { method: "POST", body: JSON.stringify({ name }) });
      await delay(500);
      return { success: true, name };
    },
  },
};
