'use client';
import { useState, useEffect } from 'react';
import {
  DashboardWrapper,
  Sidebar,
  SidebarLink,
  MainContent,
  Card,
  CardTitle,
  CardContent,
  CardActions,
  Button
} from '@/app/common/styledComponents';
import { useLogout } from '@/utils/logout';

interface Job {
  id: string;
  title: string;
  description: string;
  poster: string;
  location: string;
}

export default function SeekerDashboardPage() {
  const [activePage, setActivePage] = useState("home");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState('');
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [profile, setProfile] = useState({ headline: "", bio: "", skills: "" });
  const logout = useLogout();

  // Mock fetching jobs
  useEffect(() => {
    if (activePage === "home") {
      setJobs([
        { id: '1', title: 'Frontend Developer', description: 'Looking for a React dev for a 2-week project.', poster: 'TechCorp', location: 'Nairobi' },
        { id: '2', title: 'Graphic Designer', description: 'Create marketing materials.', poster: 'DesignStudio', location: 'Mombasa' },
        { id: '3', title: 'Content Writer', description: 'Write 10 blog posts about tech topics.', poster: 'BlogHub', location: 'Remote' },
      ]);
    }
  }, [activePage]);

  // ---------------- RENDER PAGES ----------------
  const renderPage = () => {
    switch (activePage) {
      case "profile":
        return (
          <Card>
            <CardTitle>Update Profile</CardTitle>
            <CardContent>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  await fetch("/api/seeker/profile", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(profile),
                  });
                  alert("Profile updated!");
                }}
              >
                <input
                  placeholder="Headline"
                  value={profile.headline}
                  onChange={e => setProfile({ ...profile, headline: e.target.value })}
                  style={{ width: "100%", marginBottom: "0.8rem" }}
                />
                <textarea
                  placeholder="Bio"
                  value={profile.bio}
                  onChange={e => setProfile({ ...profile, bio: e.target.value })}
                  style={{ width: "100%", marginBottom: "0.8rem" }}
                />
                <input
                  placeholder="Skills (comma-separated)"
                  value={profile.skills}
                  onChange={e => setProfile({ ...profile, skills: e.target.value })}
                  style={{ width: "100%", marginBottom: "0.8rem" }}
                />
                <button type="submit">Save Profile</button>
              </form>
            </CardContent>
          </Card>
        );

      case "applied":
        return (
          <Card>
            <CardTitle>Applied Jobs</CardTitle>
            <CardContent>
              {appliedJobs.length === 0 ? (
                <p>You haven’t applied for any jobs yet.</p>
              ) : (
                <ul>
                  {appliedJobs.map((id) => {
                    const job = jobs.find(j => j.id === id);
                    return job ? (
                      <li key={id}>{job.title} at {job.poster} ({job.location})</li>
                    ) : null;
                  })}
                </ul>
              )}
            </CardContent>
          </Card>
        );

      case "settings":
        return (
          <Card>
            <CardTitle>Settings</CardTitle>
            <CardContent>
              <p>Later: notification preferences, account settings, etc.</p>
            </CardContent>
          </Card>
        );

      default:
        const filteredJobs = jobs.filter(job =>
          job.title.toLowerCase().includes(search.toLowerCase()) ||
          job.description.toLowerCase().includes(search.toLowerCase()) ||
          job.poster.toLowerCase().includes(search.toLowerCase()) ||
          job.location.toLowerCase().includes(search.toLowerCase())
        );

        return (
          <>
            <div style={{ marginBottom: '1.5rem' }}>
              <input
                type="text"
                placeholder="Search jobs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #cbd5e1',
                  marginBottom: '1rem'
                }}
              />
            </div>

            {filteredJobs.length === 0 && (
              <p style={{ color: '#94a3b8', textAlign: 'center' }}>No jobs found.</p>
            )}

            {filteredJobs.map((job) => (
              <Card key={job.id}>
                <CardTitle>{job.title}</CardTitle>
                <CardContent>
                  <p>{job.description}</p>
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                    Posted by: {job.poster} | Location: {job.location}
                  </p>
                </CardContent>
                <CardActions>
                  <Button
                    onClick={() => {
                      if (!appliedJobs.includes(job.id)) {
                        setAppliedJobs([...appliedJobs, job.id]);
                        alert("Applied successfully!");
                      }
                    }}
                    disabled={appliedJobs.includes(job.id)}
                  >
                    {appliedJobs.includes(job.id) ? "Applied" : "Apply"}
                  </Button>
                </CardActions>
              </Card>
            ))}
          </>
        );
    }
  };

  // ---------------- MAIN RETURN ----------------
  return (
    <DashboardWrapper>
      {/* Sidebar */}
      <Sidebar>
        <SidebarLink as="button" $active={activePage === "home"} onClick={() => setActivePage("home")}>
          Home
        </SidebarLink>
        <SidebarLink as="button" $active={activePage === "profile"} onClick={() => setActivePage("profile")}>
          Profile
        </SidebarLink>
        <SidebarLink as="button" $active={activePage === "applied"} onClick={() => setActivePage("applied")}>
          Applied Jobs
        </SidebarLink>
        <SidebarLink as="button" $active={activePage === "settings"} onClick={() => setActivePage("settings")}>
          Settings
        </SidebarLink>

        <button
          onClick={logout}
          style={{
            marginTop: 'auto',
            padding: '0.5rem 1rem',
            backgroundColor: '#ef4444',
            color: '#fff',
            border: 'none',
            borderRadius: '0.5rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      </Sidebar>

      {/* Main Content */}
      <MainContent>{renderPage()}</MainContent>
    </DashboardWrapper>
  );
}
