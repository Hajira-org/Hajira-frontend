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
import "leaflet/dist/leaflet.css";

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
  const [profile, setProfile] = useState({ name: "", bio: "", skills: "", avatar: "" });
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
  // ---------------- Map initialization for Home ----------------
  useEffect(() => {
    if (activePage !== "home") return;

    let map: any;

    const initMap = async () => {
      const L = await import("leaflet");
      const mapContainer = document.getElementById("userMap");

      if (!mapContainer) return;
      if (mapContainer.getAttribute("data-initialized")) return;
      mapContainer.setAttribute("data-initialized", "true");

      map = L.map(mapContainer).setView([-1.286389, 36.817223], 12);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      // 🔁 Force Leaflet to recalc dimensions
      setTimeout(() => map.invalidateSize(), 500);

      const success = (pos: GeolocationPosition) => {
        const { latitude, longitude } = pos.coords;
        console.log("📍 Location found:", latitude, longitude);
        map.flyTo([latitude, longitude], 14);
        L.marker([latitude, longitude]).addTo(map).bindPopup("📍 You are here").openPopup();
      };

      const error = async (err: GeolocationPositionError) => {
        console.warn("❌ Geolocation error:", err.message);
        try {
          const res = await fetch("https://ipapi.co/json/", { cache: "no-store" });
          const loc = await res.json();
          map.setView([loc.latitude, loc.longitude], 13);
          L.marker([loc.latitude, loc.longitude])
            .addTo(map)
            .bindPopup(`📍 Approx. location: ${loc.city}`)
            .openPopup();
        } catch (e) {
          console.warn("❌ IP fallback failed:", e);
        }
      };

      navigator.geolocation.getCurrentPosition(success, error, {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 0,
      });
    };

    initMap();
    return () => {
      if (map) map.remove();
    };
  }, [activePage]);



  //----------------Fetch User to display on the profile page -----------//
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch user");

        const seeker = data.user?.seeker || {};
        const name = data.user.name || "";
        const bio = data.user.bio || "";
        const avatar = data.user.avatar || "";

        setProfile({
          name,
          bio,
          skills: (seeker.skills || []).join(", "),
          avatar,
        });
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, []);




  // ---------------- Render pages ----------------
  const renderPage = () => {
    switch (activePage) {
      // ---------------- PROFILE ----------------
      case "profile":
        return (
          <Card>
            <CardTitle>Your Profile</CardTitle>
            <CardContent>
              {profile && (
                <div style={{ marginBottom: "1.5rem" }}>
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt="User Avatar"
                      style={{
                        width: 150,
                        height: 150,
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginBottom: "1rem",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 150,
                        height: 150,
                        borderRadius: "50%",
                        background: "#ccc",
                        display: "inline-flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: "1rem",
                      }}
                    >
                      No Image
                    </div>
                  )}

                  <p><strong>Name:</strong> {profile.name || "—"}</p>
                  <p><strong>Bio:</strong> {profile.bio || "—"}</p>
                  <p><strong>Skills:</strong> {profile.skills || "—"}</p>

                  <hr style={{ margin: "1.5rem 0" }} />

                  <CardTitle>Update Profile</CardTitle>
                  <FormContainer
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const token = localStorage.getItem("token");
                      await fetch(`${API_URL}/api/auth/profile`, {
                        method: "PUT",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                          name: profile.name,
                          bio: profile.bio,
                          seeker: { skills: profile.skills.split(",").map((s) => s.trim()) },
                        }),
                      });
                      alert("Profile updated ✅");
                    }}
                  >
                    <InputGroup>
                      <Input
                        placeholder="Headline"
                        value={profile.name || ""}
                        onChange={(e) =>
                          setProfile({ ...profile, name: e.target.value })
                        }
                      />
                    </InputGroup>

                    <InputGroup>
                      <Input
                        as="textarea"
                        rows={3}
                        placeholder="Bio"
                        value={profile.bio || ""}
                        onChange={(e) =>
                          setProfile({ ...profile, bio: e.target.value })
                        }
                      />
                    </InputGroup>

                    <InputGroup>
                      <Input
                        placeholder="Skills (comma-separated)"
                        value={profile.skills || ""}
                        onChange={(e) =>
                          setProfile({ ...profile, skills: e.target.value })
                        }
                      />
                    </InputGroup>

                    <Button type="submit">Save Profile</Button>
                  </FormContainer>
                </div>
              )}
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
            {/* 🗺️ Seeker Map */}
            <div
              id="userMap"
              style={{
                width: '100%',
                height: '400px',
                borderRadius: '0.75rem',
                overflow: 'hidden',
                marginBottom: '1.5rem',
                border: '1px solid rgb(51,65,85)',
                zIndex: 1,
                backgroundColor: '#0f172a', // match your dark theme
              }}
            />

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
