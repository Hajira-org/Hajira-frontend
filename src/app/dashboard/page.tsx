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
  Button,
  FormContainer,
  InputGroup,
  Input
} from '@/app/common/styledComponents';
import { useLogout } from '@/utils/logout';

// ---------------- Types ----------------
interface Poster {
  _id: string;
  name: string;
  email?: string;
}

interface Job {
  _id: string;
  title: string;
  description: string;
  poster: Poster;
  location: string;
  requirements?: string[];
  salary?: string;
  workModel?: string;
  status?: string;
  applied?: boolean;
}

export default function SeekerDashboardPage() {
  const [activePage, setActivePage] = useState("home");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState('');
  const [profile, setProfile] = useState({ headline: "", bio: "", skills: "" });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" }); // ✅ added
  const logout = useLogout();

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // ---------------- Fetch jobs from backend ----------------
  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/jobs/available`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  useEffect(() => {
    if (activePage === "home" || activePage === "applied") {
      fetchJobs();
    }
  }, [activePage]);

  // ---------------- Render pages ----------------
  const renderPage = () => {
    switch (activePage) {
      // ---------------- PROFILE ----------------
      case "profile":
        return (
          <Card>
            <CardTitle>Update Profile</CardTitle>
            <CardContent>
              <FormContainer
                onSubmit={async (e) => {
                  e.preventDefault();
                  const token = localStorage.getItem("token");
                  await fetch(`${API_URL}/api/seeker/profile`, {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(profile),
                  });
                  alert("Profile updated ✅");
                }}
              >
                <InputGroup>
                  <Input
                    placeholder="Headline"
                    value={profile.headline}
                    onChange={e => setProfile({ ...profile, headline: e.target.value })}
                  />
                </InputGroup>

                <InputGroup>
                  <Input
                    as="textarea"
                    rows={3}
                    placeholder="Bio"
                    value={profile.bio}
                    onChange={e => setProfile({ ...profile, bio: e.target.value })}
                  />
                </InputGroup>

                <InputGroup>
                  <Input
                    placeholder="Skills (comma-separated)"
                    value={profile.skills}
                    onChange={e => setProfile({ ...profile, skills: e.target.value })}
                  />
                </InputGroup>

                <Button type="submit">Save Profile</Button>
              </FormContainer>
            </CardContent>
          </Card>
        );

      // ---------------- APPLIED ----------------
      case "applied":
        return (
          <Card>
            <CardTitle>Applied Jobs</CardTitle>
            <CardContent>
              {jobs.filter(j => j.applied).length === 0 ? (
                <p>You have not applied for any jobs yet or the jobs have been completed.</p>
              ) : (
                <ul>
                  {jobs.filter(j => j.applied).map(job => (
                    <li key={job._id}>
                      {job.title} at {job.poster?.name || "Unknown"} ({job.location})
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        );

      // ---------------- SETTINGS (Updated with Change Password) ----------------
      case "settings":
        return (
          <Card>
            <CardTitle>Settings</CardTitle>
            <CardContent>
              <p style={{ marginBottom: "1rem" }}>Change your account password below:</p>

              <FormContainer
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    const token = localStorage.getItem("token");
                    const res = await fetch(`${API_URL}/api/auth/change-password`, {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify(passwords),
                    });

                    const data = await res.json();
                    if (!res.ok) throw new Error(data.message || "Error changing password");

                    alert("Password changed successfully ✅");
                    setPasswords({ currentPassword: "", newPassword: "" });
                  } catch (err: any) {
                    alert(err.message || "Failed to change password ❌");
                  }
                }}
              >
                <InputGroup>
                  <Input
                    type="password"
                    placeholder="Current Password"
                    value={passwords.currentPassword}
                    onChange={(e) =>
                      setPasswords({ ...passwords, currentPassword: e.target.value })
                    }
                    required
                  />
                </InputGroup>

                <InputGroup>
                  <Input
                    type="password"
                    placeholder="New Password"
                    value={passwords.newPassword}
                    onChange={(e) =>
                      setPasswords({ ...passwords, newPassword: e.target.value })
                    }
                    required
                  />
                </InputGroup>

                <Button type="submit">Update Password</Button>
              </FormContainer>
            </CardContent>
          </Card>
        );

      // ---------------- HOME / JOB LIST ----------------
      default:
        const filteredJobs = jobs.filter(job =>
          job.title.toLowerCase().includes(search.toLowerCase()) ||
          job.description.toLowerCase().includes(search.toLowerCase()) ||
          (job.poster?.name || "").toLowerCase().includes(search.toLowerCase()) ||
          job.location.toLowerCase().includes(search.toLowerCase())
        );

        return (
          <>
            <div style={{ marginBottom: '1.5rem', display: "flex", gap: "0.5rem" }}>
              <input
                type="text"
                placeholder="Search jobs, tags, or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.8rem 1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #cbd5e1'
                }}
              />
              <button
                onClick={fetchJobs}
                style={{
                  padding: "0.8rem 1rem",
                  borderRadius: "0.5rem",
                  border: "none",
                  backgroundColor: "#3b82f6",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Refresh
              </button>
            </div>

            {filteredJobs.length === 0 && (
              <p style={{ color: '#94a3b8', textAlign: 'center' }}>No jobs found.</p>
            )}

            {filteredJobs.map(job => (
              <Card key={job._id} style={{
                backgroundColor: "#1e293b",
                color: "#f1f5f9",
                borderRadius: "0.75rem",
                padding: "1rem 1.25rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.5)"
              }}>
                <CardTitle style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "0.5rem" }}>
                  {job.title}
                </CardTitle>

                <CardContent style={{ marginBottom: "1rem" }}>
                  <p style={{ color: "#cbd5e1", marginBottom: "0.5rem" }}>{job.description}</p>
                  <p style={{ fontSize: "0.9rem", color: "#94a3b8" }}>
                    👤 {job.poster?.name || "Unknown"} • 📍 {job.location}
                  </p>
                  {job.salary && (
                    <p style={{ fontSize: "0.9rem", color: "#38bdf8", marginTop: "0.3rem" }}>💰 {job.salary}</p>
                  )}
                  {job.workModel && (
                    <span style={{
                      display: "inline-block",
                      backgroundColor: "#334155",
                      color: "#f1f5f9",
                      fontSize: "0.75rem",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "0.4rem",
                      marginTop: "0.5rem"
                    }}>
                      {job.workModel}
                    </span>
                  )}
                </CardContent>

                <CardActions style={{ display: "flex", gap: "0.5rem" }}>
                  <Button
                    style={{
                      backgroundColor: job.applied ? "#475569" : "#3b82f6",
                      color: "#fff",
                      padding: "0.5rem 1rem",
                      borderRadius: "0.5rem",
                      fontWeight: 600,
                      cursor: job.applied ? "not-allowed" : "pointer",
                    }}
                    disabled={job.applied}
                    onClick={async () => {
                      if (job.applied) return;
                      const bid = prompt("Your bid or proposed salary:");
                      if (!bid) return;
                      try {
                        const token = localStorage.getItem("token");
                        const res = await fetch(`${API_URL}/api/jobs/${job._id}/apply`, {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                          },
                          body: JSON.stringify({ bid }),
                        });
                        if (!res.ok) throw new Error("Failed to apply");
                        setJobs(jobs.map(j => j._id === job._id ? { ...j, applied: true } : j));
                        alert("Applied successfully!");
                      } catch (err) {
                        console.error(err);
                        alert("Failed to apply. Try again.");
                      }
                    }}
                  >
                    {job.applied ? "✔️ Applied" : "Apply Now"}
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
      <Sidebar>
        <SidebarLink as="button" $active={activePage === "home"} onClick={() => setActivePage("home")}>Home</SidebarLink>
        <SidebarLink as="button" $active={activePage === "profile"} onClick={() => setActivePage("profile")}>Profile</SidebarLink>
        <SidebarLink as="button" $active={activePage === "applied"} onClick={() => setActivePage("applied")}>Applied Jobs</SidebarLink>
        <SidebarLink as="button" $active={activePage === "settings"} onClick={() => setActivePage("settings")}>Settings</SidebarLink>

        <Button
          type="button"
          onClick={logout}
          style={{ marginTop: "auto", background: "#ef4444" }}
        >
          Logout
        </Button>
      </Sidebar>

      <MainContent>{renderPage()}</MainContent>
    </DashboardWrapper>
  );
}
