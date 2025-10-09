'use client';
import "leaflet/dist/leaflet.css";
import { useState, useEffect } from 'react';
import {
  DashboardWrapper,
  Sidebar,
  SidebarLink,
  MainContent,
  Card,
  CardTitle,
  CardContent,
  Input,
  Select,
  Button,
  FormContainer,
  InputGroup,
  CardActions,
} from '@/app/common/styledComponents';
import { useLogout } from '@/utils/logout';




const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function PosterDashboardPage() {
  const [activePage, setActivePage] = useState("home");
  const [jobs, setJobs] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [profile, setProfile] = useState({ name: "", bio: "", skills: "", avatar: "" });
  const logout = useLogout();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");


  // ---------------- JOB FORM ----------------
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    requirements: "",
    workModel: "Flexible",
    image: "",
  });
  const [editingJob, setEditingJob] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    requirements: "",
    workModel: "Flexible",
    image: "",
  });

  const [jobImageFile, setJobImageFile] = useState<File | null>(null);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [showApplicantsMap, setShowApplicantsMap] = useState<Record<string, boolean>>({});

  // ---------------- JOB TYPES ----------------
  const [jobTypes, setJobTypes] = useState([
    "Car Washing/Detailing (Mobile service)",
    "Lawn Mowing/Yard Work",
    "House Cleaning/Maid Service",
    "Pet Sitting/Dog Walking",
    "Handyperson/Small Repairs",
    "Errand Running/Personal Shopping",
    "Furniture Assembly",
    "Delivery Driver",
    "Tutoring",
    "Babysitting/Childcare",
    "Painting",
    "Gutter Cleaning",
    "Window Washing",
    "Pressure Washing",
    "Event Setup/Tear Down Helper",
    "Moving Help",
    "Welding",
    "Tire Changing/Basic Car Maintenance",
    "Simple Catering/Food Prep",
    "Gardening/Planting",
    "Snow Shoveling/Ice Removal",
    "Appliance Repair",
    "Notary Public",
    "Tailoring/Simple Clothes Alterations",
    "Hair Braiding/Simple Hairstyling",
    "Digital/Online Microtasks",
    "Online Surveys",
    "Data Entry",
    "Image Tagging/Annotation",
    "Audio Transcription",
    "Search Engine Evaluation",
    "Website/App Testing",
    "Content Moderation",
    "Social Media Engagement",
    "Short Writing Tasks",
    "Proofreading/Editing",
    "Quick Translations",
    "Data Verification",
    "Micro-Coding Tasks",
    "Typing CAPTCHAs/Data Categorization",
    "Virtual Assistant (VA) Quick Tasks",
    "Online Research",
    "Voice Recording/Narration",
    "Blog Commenting/Forum Posting",
    "Creating Simple Logos/Graphics",
    "Short Video Editing",
    "Baking/Selling Homemade Goods",
    "Selling Used Items Online",
    "Creating and Selling Simple Crafts",
    "Mystery Shopping/Store Audits",
    "Selling Digital Downloads"
  ]);

  const [customJob, setCustomJob] = useState("");

  // ---------------- FETCH JOBS ----------------
  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/jobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };
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



  useEffect(() => {
    if (activePage === "home" || activePage === "myJobs") {
      fetchJobs();
      const interval = setInterval(fetchJobs, 5000);
      return () => clearInterval(interval);
    }
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

  const toggleApplicants = (jobId: string) => {
    setShowApplicantsMap(prev => ({
      ...prev,
      [jobId]: !prev[jobId],
    }));
  };

  // ---------------- UPLOAD HELPER ----------------
  const uploadFile = async (file: File): Promise<string | null> => {
    if (!file) return null;
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      return data.url || null;
    } catch (err) {
      console.error("File upload error:", err);
      alert("❌ File upload failed.");
      return null;
    }
  };

  // ---------------- DELETE JOB ----------------
  const handleDeleteJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/jobs/${jobId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setJobs(prev => prev.filter(job => job._id !== jobId));
        alert("🗑️ Job deleted successfully.");
      } else {
        const data = await res.json();
        alert(data.message || "❌ Failed to delete job.");
      }
    } catch (err) {
      console.error("Error deleting job:", err);
      alert("❌ Error deleting job.");
    }
  };

  // ---------------- RENDER PAGES ----------------
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
                </div>
              )}

              <hr style={{ margin: "1.5rem 0" }} />

              <CardTitle>Update Profile</CardTitle>
              <CardContent>
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
                        seeker: {
                          skills: profile.skills.split(",").map((s) => s.trim()),
                        },
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
              </CardContent>
            </CardContent>
          </Card>
        );
      // ---------------- CREATE JOB ----------------
      case "createJob":
        return (
          <Card style={{ background: "#0f172a", color: "#f8fafc", padding: "1.5rem" }}>
            <CardTitle style={{ fontSize: "1.3rem", fontWeight: 600 }}>
              Post a Quick Job
            </CardTitle>
            <CardContent>
              <FormContainer
                onSubmit={async (e) => {
                  e.preventDefault();
                  const token = localStorage.getItem("token");

                  let uploadedImage = form.image;
                  if (jobImageFile) {
                    const url = await uploadFile(jobImageFile);
                    if (url) uploadedImage = url;
                  }

                  const res = await fetch(`${API_URL}/api/jobs`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                      ...form,
                      image: uploadedImage,
                      requirements: form.requirements
                        ? form.requirements.split(",").map(r => r.trim())
                        : [],
                    }),
                  });

                  const data = await res.json();

                  if (res.ok) {
                    alert("✅ Job posted!");
                    setForm({
                      title: "",
                      description: "",
                      location: "",
                      salary: "",
                      requirements: "",
                      workModel: "Flexible",
                      image: "",
                    });
                    setJobImageFile(null);
                    setActivePage("myJobs");
                  } else {
                    alert(data.message || "❌ Failed to post job.");
                  }
                }}
              >
                {/* Job Type */}
                <label>What type of work?</label>
                <Select
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                >
                  <option value="">Select a job type</option>
                  {jobTypes.map((type, idx) => (
                    <option key={idx} value={type}>{type}</option>
                  ))}
                </Select>

                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                  <Input
                    placeholder="Or add your own..."
                    value={customJob}
                    onChange={(e) => setCustomJob(e.target.value)}
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      if (!customJob.trim()) return;
                      if (!jobTypes.includes(customJob.trim())) {
                        setJobTypes([...jobTypes, customJob.trim()]);
                      }
                      setForm({ ...form, title: customJob.trim() });
                      setCustomJob("");
                    }}
                  >
                    ➕ Add
                  </Button>
                </div>

                <Input
                  as="textarea"
                  rows={2}
                  placeholder="Describe briefly what you need done..."
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <Input
                    placeholder="Location (e.g. Westlands)"
                    value={form.location}
                    onChange={e => setForm({ ...form, location: e.target.value })}
                  />
                  <Input
                    placeholder="Offer (e.g. 800 KSh)"
                    value={form.salary}
                    onChange={e => setForm({ ...form, salary: e.target.value })}
                  />
                </div>

                <Select
                  value={form.workModel}
                  onChange={e => setForm({ ...form, workModel: e.target.value })}
                >
                  <option value="Flexible">Flexible</option>
                  <option value="Same Day">Same Day</option>
                  <option value="Scheduled">Scheduled</option>
                </Select>

                {/* Upload Job Photo */}
                <div style={{ marginTop: "1rem" }}>
                  <label>Upload Job Image (optional)</label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) setJobImageFile(e.target.files[0]);
                    }}
                  />
                </div>

                {form.image && (
                  <img
                    src={form.image}
                    alt="Job Image"
                    style={{ width: "100%", borderRadius: "0.5rem", marginTop: "0.5rem" }}
                  />
                )}

                <Button
                  type="submit"
                  style={{
                    marginTop: "1rem",
                    backgroundColor: "#3b82f6",
                    fontWeight: 600,
                    fontSize: "1rem"
                  }}
                >
                  Post Job 🚀
                </Button>
              </FormContainer>
            </CardContent>
          </Card>
        );

      // ---------------- MY JOBS ----------------
      case "home":
      case "myJobs": {
        const filteredJobs = jobs.filter(job =>
          job.title.toLowerCase().includes(search.toLowerCase()) ||
          job.description.toLowerCase().includes(search.toLowerCase()) ||
          job.location.toLowerCase().includes(search.toLowerCase())
        );

        return (
          <>
            {activePage === "home" && (
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



            )}

            {/* Search bar + refresh button */}
            <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder="Search jobs, location..."
                value={search}
                onChange={e => setSearch(e.target.value)}
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

            {/* No jobs found */}
            {filteredJobs.length === 0 && (
              <p style={{ color: '#94a3b8', textAlign: 'center' }}>No jobs found.</p>
            )}

            {/* Job cards */}
            {filteredJobs.map(job => (
              <Card
                key={job._id}
                style={{
                  backgroundColor: "#1e293b",
                  color: "#f1f5f9",
                  borderRadius: "0.75rem",
                  padding: "1rem 1.25rem",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
                  marginBottom: "1rem",
                }}
              >
                <CardTitle style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "0.5rem" }}>
                  {job.title}
                </CardTitle>

                {job.image && (
                  <img
                    src={job.image}
                    alt="Job"
                    style={{
                      width: "100%",
                      borderRadius: "0.5rem",
                      marginBottom: "0.5rem",
                    }}
                  />
                )}

                <CardContent style={{ marginBottom: "1rem" }}>
                  <p style={{ color: "#cbd5e1", marginBottom: "0.5rem" }}>{job.description}</p>
                  <p style={{ fontSize: "0.9rem", color: "#94a3b8" }}>📍 {job.location}</p>
                  {job.salary && (
                    <p style={{ fontSize: "0.9rem", color: "#38bdf8", marginTop: "0.3rem" }}>
                      💰 {job.salary}
                    </p>
                  )}
                </CardContent>

                <CardActions style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Button
                    type="button"
                    onClick={() => toggleApplicants(job._id)}
                    style={{ backgroundColor: "#3b82f6", padding: "0.5rem 0.9rem" }}
                  >
                    👥 {showApplicantsMap[job._id] ? "Hide Applicants" : "View Applicants"}
                  </Button>
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "20px" }}>
                    <Button
                      type="button"
                      style={{ backgroundColor: "#22c55e", padding: "0.5rem 0.9rem" }}
                      onClick={() => {
                        setEditingJob(job);
                        setEditForm({
                          title: job.title || "",
                          description: job.description || "",
                          location: job.location || "",
                          salary: job.salary || "",
                          requirements: job.requirements?.join(", ") || "",
                          workModel: job.workModel || "Flexible",
                          image: job.image || "",
                        });
                      }}
                    >
                      ✏️ Edit
                    </Button>

                    <Button
                      type="button"
                      style={{ backgroundColor: "#ef4444", padding: "0.5rem 0.9rem" }}
                      onClick={() => handleDeleteJob(job._id)}
                    >
                      🗑️ Delete
                    </Button>

                  </div>

                </CardActions>
                {editingJob && editingJob._id === job._id && (
                  <div
                    style={{
                      marginTop: "1rem",
                      background: "#0f172a",
                      padding: "1rem",
                      borderRadius: "0.5rem",
                    }}
                  >
                    <h4 style={{ marginBottom: "1rem" }}>Edit Job</h4>

                    <FormContainer
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const token = localStorage.getItem("token");

                        const res = await fetch(`${API_URL}/api/jobs/${editingJob._id}`, {
                          method: "PUT",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                          },
                          body: JSON.stringify({
                            ...editForm,
                            requirements: editForm.requirements
                              ? editForm.requirements.split(",").map((r) => r.trim())
                              : [],
                          }),
                        });

                        const data = await res.json();
                        if (res.ok) {
                          alert("✅ Job updated successfully!");
                          setEditingJob(null);
                          fetchJobs();
                        } else {
                          alert(`❌ ${data.message || "Failed to update job."}`);
                        }
                      }}
                    >
                      <Input
                        placeholder="Title"
                        value={editForm.title}
                        onChange={(e) =>
                          setEditForm({ ...editForm, title: e.target.value })
                        }
                      />

                      <Input
                        as="textarea"
                        rows={3}
                        placeholder="Description"
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm({ ...editForm, description: e.target.value })
                        }
                      />

                      <Input
                        placeholder="Location"
                        value={editForm.location}
                        onChange={(e) =>
                          setEditForm({ ...editForm, location: e.target.value })
                        }
                      />

                      <Input
                        placeholder="Salary"
                        value={editForm.salary}
                        onChange={(e) =>
                          setEditForm({ ...editForm, salary: e.target.value })
                        }
                      />

                      <Input
                        placeholder="Requirements (comma-separated)"
                        value={editForm.requirements}
                        onChange={(e) =>
                          setEditForm({ ...editForm, requirements: e.target.value })
                        }
                      />

                      <Select
                        value={editForm.workModel}
                        onChange={(e) =>
                          setEditForm({ ...editForm, workModel: e.target.value })
                        }
                      >
                        <option value="Flexible">Flexible</option>
                        <option value="Same Day">Same Day</option>
                        <option value="Scheduled">Scheduled</option>
                      </Select>

                      <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
                        <Button type="submit" style={{ backgroundColor: "#3b82f6" }}>
                          Save Changes
                        </Button>
                        <Button
                          type="button"
                          style={{ backgroundColor: "#64748b" }}
                          onClick={() => setEditingJob(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </FormContainer>
                  </div>
                )}


                {/* Applicants list */}
                {showApplicantsMap[job._id] && (
                  <div
                    style={{
                      marginTop: "1rem",
                      background: "#0f172a",
                      padding: "1rem",
                      borderRadius: "0.5rem",
                    }}
                  >
                    {job.applications?.length > 0 ? (
                      job.applications.map((app: any, index: any) => (
                        <div
                          key={app._id || index}
                          style={{
                            marginBottom: "0.8rem",
                            borderBottom: "1px solid #334155",
                            paddingBottom: "0.5rem",
                          }}
                        >
                          <p>
                            👤 Applicant:{" "}
                            {app.applicant?.name
                              ? `${app.applicant.name} (${app.applicant.email})`
                              : app.applicant?._id || "Unknown"}
                          </p>
                          <p>💰 Bid: {app.bid}</p>
                          <p>🕒 Applied At: {new Date(app.appliedAt).toLocaleString()}</p>
                        </div>
                      ))
                    ) : (
                      <p style={{ color: "#94a3b8" }}>No applications yet.</p>
                    )}
                  </div>
                )}
              </Card>
            ))}
          </>
        );
      }
      // ---------------- SETTINGS ----------------        
      case "settings":
        return (
          <Card>
            <CardTitle>Change Password</CardTitle>
            <CardContent>
              <FormContainer
                onSubmit={async (e) => {
                  e.preventDefault();
                  const token = localStorage.getItem("token");
                  const res = await fetch(`${API_URL}/api/auth/change-password`, {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                      currentPassword,
                      newPassword,
                    }),
                  });
                  const data = await res.json();
                  if (res.ok) {
                    alert("✅ Password updated successfully!");
                    setCurrentPassword("");
                    setNewPassword("");
                  } else {
                    alert(`❌ ${data.message || "Failed to change password"}`);
                  }
                }}
              >
                <InputGroup>
                  <Input
                    type="password"
                    placeholder="Current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </InputGroup>
                <InputGroup>
                  <Input
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </InputGroup>
                <Button type="submit">Update Password</Button>
              </FormContainer>
            </CardContent>
          </Card>
        );


      default:
        return (
          <Card>
            <CardTitle>Welcome Back 👋</CardTitle>
            <CardContent>Use the sidebar to manage your jobs and profile.</CardContent>
          </Card>
        );
    }
  };



  // ---------------- MAIN RETURN ----------------
  return (
    <DashboardWrapper>
      <Sidebar>
        <SidebarLink as="button" $active={activePage === "home"} onClick={() => setActivePage("home")}>Home</SidebarLink>
        <SidebarLink as="button" $active={activePage === "profile"} onClick={() => setActivePage("profile")}>Profile</SidebarLink>
        <SidebarLink as="button" $active={activePage === "createJob"} onClick={() => setActivePage("createJob")}>Create Job</SidebarLink>
        <SidebarLink as="button" $active={activePage === "myJobs"} onClick={() => setActivePage("myJobs")}>My Jobs</SidebarLink>
        <SidebarLink as="button" $active={activePage === "settings"} onClick={() => setActivePage("settings")}>Settings</SidebarLink>
        <Button type="button" onClick={logout} style={{ marginTop: "auto", background: "#ef4444" }}>Logout</Button>
      </Sidebar>

      <MainContent>{renderPage()}</MainContent>
    </DashboardWrapper>
  );
}
