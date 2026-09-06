import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  ChevronDown,
  FolderPlus,
  SearchX,
  Layers,
  Star,
  Users,
  Archive,
  ArrowUpDown,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";
import { useSettingsStore } from "@/store/useSettingsStore";

import { PROJECTS } from "@/lib/mockData";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { StatsStrip } from "@/components/dashboard/StatsStrip";
import { EmptyState } from "@/components/shared/EmptyState";
import { RecentProjects } from "@/components/dashboard/RecentProjects";
import { ActivitySidebar } from "@/components/dashboard/ActivitySidebar";
import { CreateProjectModal } from "@/components/features/projects/CreateProjectModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export default function Dashboard({ defaultTab = "all" }) {
  const navigate = useNavigate();
  const profile = useSettingsStore(state => state.profile);
  const [projectsList] = useState(PROJECTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState(null);
  const activeTab = selectedTab ?? defaultTab;
  
  // Reset selectedTab if the route (defaultTab prop) changes
  useEffect(() => {
    setSelectedTab(null);
  }, [defaultTab]);

  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [sortOption, setSortOption] = useState("modified");
  const [viewMode, setViewMode] = useState("grid");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSource, setModalSource] = useState("blank");
  const [showSidebar, setShowSidebar] = useState(true);
  const location = useLocation();
  const showWidgets = location.pathname === "/dashboard" && activeTab === "all";

  // Dynamic greeting based on time of day
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  // Tab counts
  const tabCounts = useMemo(
    () => ({
      all: projectsList.filter((p) => !p.archived).length,
      starred: projectsList.filter((p) => p.starred && !p.archived).length,
      shared: projectsList.filter((p) => p.shared && !p.archived).length,
      archived: projectsList.filter((p) => p.archived).length,
    }),
    [projectsList],
  );

  // All distinct languages in the dataset
  const languages = useMemo(() => {
    const set = new Set();
    projectsList.forEach((p) => set.add(p.language));
    return ["All", ...Array.from(set)];
  }, [projectsList]);

  // Filtered & sorted projects
  const filteredProjects = useMemo(() => {
    return projectsList
      .filter((project) => {
        // Tab filtering
        if (activeTab === "starred" && !project.starred) return false;
        if (activeTab === "shared" && !project.shared) return false;
        if (activeTab === "archived" && !project.archived) return false;
        if (activeTab !== "archived" && project.archived) return false;

        // Language chip filtering
        if (selectedLanguage !== "All" && project.language !== selectedLanguage)
          return false;

        // Search query filtering
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = project.name.toLowerCase().includes(q);
          const matchDesc = project.description.toLowerCase().includes(q);
          const matchLang = project.language.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchLang) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortOption === "name") {
          return a.name.localeCompare(b.name);
        }
        if (sortOption === "created") {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
        // Default: last modified
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      });
  }, [projectsList, activeTab, selectedLanguage, searchQuery, sortOption]);

  // Clear filters helper
  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedLanguage("All");
    setSelectedTab("all");
  };

  const sortLabels = {
    modified: "Last modified",
    name: "Name",
    created: "Created date",
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6 max-w-[1680px] mx-auto min-h-full pb-10">
      {/* ── Main Content Area ───────────────────────────────────── */}
      <div className="flex-1 min-w-0 space-y-7">
        {/* 1. Greeting Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {greeting}, {profile?.displayName?.split(" ")[0] || "User"}
            </h1>
            <p className="text-sm text-foreground-muted mt-1">
              You have 3 active projects and 2 pending invitations
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="icon"
              className="xl:hidden"
              onClick={() => setShowSidebar((s) => !s)}
              title="Toggle Activity Feed"
            >
              {showSidebar ? (
                <PanelRightClose size={16} />
              ) : (
                <PanelRightOpen size={16} />
              )}
            </Button>

            <Button
              variant="primary"
              className="gap-2 shadow-[0_0_20px_rgba(124,92,255,0.3)]"
              onClick={() => {
                setModalSource("blank");
                setModalOpen(true);
              }}
            >
              <Plus size={16} />
              New Project
            </Button>
          </div>
        </div>

        {showWidgets && (
          <>
            {/* 2. Quick Actions Row */}
            <QuickActions
              onNewProject={() => {
                setModalSource("blank");
                setModalOpen(true);
              }}
              onImportGithub={() => {
                setModalSource("github");
                setModalOpen(true);
              }}
              onBrowseTemplates={() => navigate("/templates")}
              onInviteTeammates={() => alert("Invite Teammates dialog")}
            />

            {/* 3. Stats Strip */}
            <StatsStrip
              totalProjects={projectsList.length}
              activeCollaborators={8}
              runsThisWeek={47}
              storageUsedMB={340}
            />

            {/* 4. Recent Projects Row */}
            <RecentProjects projects={projectsList.filter((p) => !p.archived)} />
          </>
        )}

        {/* 5. All Projects Section */}
        <div className="space-y-4 pt-2">
          {/* Section Header & Tabs */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-border pb-3">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {[
                {
                  id: "all",
                  label: "All Projects",
                  count: tabCounts.all,
                  icon: Layers,
                },
                {
                  id: "starred",
                  label: "Starred",
                  count: tabCounts.starred,
                  icon: Star,
                },
                {
                  id: "shared",
                  label: "Shared with me",
                  count: tabCounts.shared,
                  icon: Users,
                },
                {
                  id: "archived",
                  label: "Archived",
                  count: tabCounts.archived,
                  icon: Archive,
                },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                const TabIcon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={cn(
                      "relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap",
                      isActive
                        ? "text-accent bg-accent/10 border border-accent/20 font-semibold"
                        : "text-foreground-muted hover:text-foreground hover:bg-background-hover",
                    )}
                  >
                    <TabIcon
                      size={13}
                      className={
                        isActive ? "text-accent" : "text-foreground-subtle"
                      }
                    />
                    <span>{tab.label}</span>
                    <span
                      className={cn(
                        "text-[10px] px-1.5 py-0.2 rounded-full font-mono",
                        isActive
                          ? "bg-accent/20 text-accent font-bold"
                          : "bg-background-hover text-foreground-subtle",
                      )}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* View Mode Toggle & Total counter */}
            <div className="flex items-center gap-1.5 self-end md:self-auto">
              <span className="text-xs text-foreground-subtle mr-2 hidden sm:inline">
                {filteredProjects.length}{" "}
                {filteredProjects.length === 1 ? "project" : "projects"}
              </span>

              <div className="flex items-center rounded-lg border border-border bg-background-elevated p-0.5">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "p-1.5 rounded-md transition-colors",
                    viewMode === "grid"
                      ? "bg-accent/15 text-accent shadow-sm"
                      : "text-foreground-subtle hover:text-foreground",
                  )}
                  title="Grid View"
                >
                  <LayoutGrid size={14} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "p-1.5 rounded-md transition-colors",
                    viewMode === "list"
                      ? "bg-accent/15 text-accent shadow-sm"
                      : "text-foreground-subtle hover:text-foreground",
                  )}
                  title="List View"
                >
                  <List size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Search, Sort & Language Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-subtle"
              />

              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects by name, description, or tech..."
                className="pl-9 pr-3 h-9 text-xs bg-background-elevated/70"
              />

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-foreground-subtle hover:text-foreground bg-background-hover px-1.5 py-0.5 rounded"
                >
                  ESC
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Sort Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-9 gap-2 text-xs"
                  >
                    <ArrowUpDown size={13} className="text-foreground-subtle" />
                    <span>Sort: {sortLabels[sortOption]}</span>
                    <ChevronDown size={12} className="text-foreground-subtle" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40 text-xs">
                  <DropdownMenuItem
                    onClick={() => setSortOption("modified")}
                    className="cursor-pointer"
                  >
                    Last modified
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSortOption("name")}
                    className="cursor-pointer"
                  >
                    Name (A-Z)
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSortOption("created")}
                    className="cursor-pointer"
                  >
                    Created date
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Language Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            <span className="text-[11px] text-foreground-subtle font-medium uppercase tracking-wider mr-1 shrink-0">
              Tech:
            </span>
            {languages.map((lang) => {
              const isSelected = selectedLanguage === lang;
              return (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={cn(
                    "px-2.5 py-1 rounded-full text-xs transition-all whitespace-nowrap border",
                    isSelected
                      ? "bg-foreground text-background border-foreground font-semibold shadow-sm"
                      : "bg-background-elevated/60 text-foreground-muted border-border hover:border-border-strong hover:text-foreground",
                  )}
                >
                  {lang}
                </button>
              );
            })}
          </div>

          {/* Projects Display: Grid or List */}
          {filteredProjects.length > 0 ? (
            viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
                {filteredProjects.map((project, idx) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={idx}
                    view="grid"
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-background-elevated/40 overflow-hidden divide-y divide-border">
                {filteredProjects.map((project, idx) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={idx}
                    view="list"
                  />
                ))}
              </div>
            )
          ) : (
            /* Empty State when no results found */
            projectsList.length > 0 && (
              <EmptyState 
                icon={<SearchX size={24} />}
                title="No projects found"
                description="No projects match your current search or filters. Try adjusting your query or resetting filters."
                action={
                  <Button variant="secondary" onClick={handleClearFilters}>
                    Clear filters
                  </Button>
                }
              />
            )
          )}

          {/* Full zero projects empty state (if all projects were 0) */}
          {projectsList.length === 0 && (
            <EmptyState 
              icon={<FolderPlus size={28} className="text-accent" />}
              title="No projects yet"
              description="Get started by creating your very first collaborative cloud project with real-time sync."
              action={
                <Button 
                  variant="primary" 
                  onClick={() => setModalOpen(true)}
                  className="gap-2 shadow-[0_0_24px_rgba(124,92,255,0.3)]"
                >
                  <Plus size={16} /> Create your first project
                </Button>
              }
            />
          )}
        </div>
      </div>

      {/* ── Right Sidebar (Activity, Teammates, Pinned Notes) ───── */}
      {showSidebar && (
        <ActivitySidebar className="animate-in fade-in-50 duration-300" />
      )}

      {/* Create Project Modal */}
      <CreateProjectModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        initialSource={modalSource}
      />
    </div>
  );
}
