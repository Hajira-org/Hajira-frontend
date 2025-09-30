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
  Input,
  Select,
  Button,
  FormContainer,
  InputGroup,
} from '@/app/common/styledComponents';
import { useLogout } from '@/utils/logout';

const API_URL = "http://localhost:4000";

export default function PosterDashboardPage() {
  const [activePage, setActivePage] = useState("home");
  const [jobs, setJobs] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    requirements: "",
    workModel: "Flexible",
  });
  const [profile, setProfile] = useState({ company: "", about: "", logo: "" });
  const [showApplicantsMap, setShowApplicantsMap] = useState<Record<string, boolean>>({});
  const logout = useLogout();

  // ---------------- FETCH JOBS ----------------
  useEffect(() => {
    if (activePage === "home" || activePage === "myJobs") {
      const token = localStorage.getItem("token");

      const fetchJobs = async () => {
        try {
          const res = await fetch(`${API_URL}/api/jobs`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          setJobs(data.jobs || []);
        } catch (err) {
          console.error("Error fetching jobs:", err);
        }
      };

      fetchJobs();

      // Optional: Polling every 5s for new applications
      const interval = setInterval(fetchJobs, 5000);
      return () => clearInterval(interval);
    }
  }, [activePage]);

  const toggleApplicants = (jobId: string) => {
    setShowApplicantsMap(prev => ({
      ...prev,
      [jobId]: !prev[jobId],
    }));
  };

  // ---------------- RENDER PAGES ----------------
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

                  await fetch(`${API_URL}/api/profile`, {
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
                    placeholder="Company"
                    value={profile.company}
                    onChange={e => setProfile({ ...profile, company: e.target.value })}
                  />
                </InputGroup>

                <InputGroup>
                  <Input
                    as="textarea"
                    rows={3}
                    placeholder="About"
                    value={profile.about}
                    onChange={e => setProfile({ ...profile, about: e.target.value })}
                  />
                </InputGroup>

                <InputGroup>
                  <Input
                    placeholder="Logo URL"
                    value={profile.logo}
                    onChange={e => setProfile({ ...profile, logo: e.target.value })}
                  />
                </InputGroup>

                <Button type="submit">Save Profile</Button>
              </FormContainer>
            </CardContent>
          </Card>
        );

      // ---------------- CREATE JOB ----------------
      case "createJob":
        return (
          <Card>
            <CardTitle>Create Job</CardTitle>
            <CardContent>
              <FormContainer
                onSubmit={async (e) => {
                  e.preventDefault();
                  const token = localStorage.getItem("token");

                  const res = await fetch(`${API_URL}/api/jobs`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                      ...form,
                      requirements: form.requirements
                        ? form.requirements.split(",").map(r => r.trim())
                        : [],
                    }),
                  });
                  

                  const data = await res.json();

                  if (res.ok) {
                    alert("Job posted successfully ✅");
                    setForm({
                      title: "",
                      description: "",
                      location: "",
                      salary: "",
                      requirements: "",
                      workModel: "Flexible",
                    });
                    setActivePage("myJobs");
                  } else {
                    alert(data.message || "Failed to post job ❌");
                  }
                }}
              >
                <InputGroup>
                  <Input
                    placeholder="Job Title"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                  />
                </InputGroup>

                <InputGroup>
                  <Input
                    as="textarea"
                    rows={3}
                    placeholder="Description"
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                  />
                </InputGroup>

                <InputGroup>
                  <Input
                    placeholder="Location"
                    value={form.location}
                    onChange={e => setForm({ ...form, location: e.target.value })}
                  />
                </InputGroup>

                <InputGroup>
                  <Input
                    placeholder="Salary"
                    value={form.salary}
                    onChange={e => setForm({ ...form, salary: e.target.value })}
                  />
                </InputGroup>

                <InputGroup>
                  <Input
                    placeholder="Requirements (comma separated)"
                    value={form.requirements}
                    onChange={e => setForm({ ...form, requirements: e.target.value })}
                  />
                </InputGroup>

                <Select
                  value={form.workModel}
                  onChange={e => setForm({ ...form, workModel: e.target.value })}
                >
                  <option value="Flexible">Flexible</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                </Select>

                <Button type="submit">Post Job</Button>
              </FormContainer>
            </CardContent>
          </Card>
        );

      // ---------------- MY JOBS & HOME ----------------
      case "home":
      case "myJobs":
        return (
          <>
            {jobs.length === 0 && (
              <Card>
                <CardTitle>No Jobs Yet</CardTitle>
                <CardContent>
                  Click "Create Job" in the sidebar to post your first job.
                </CardContent>
              </Card>
            )}

            {jobs.map((job) => (
              <Card key={job._id}>
                <CardTitle>
                  {job.title}{" "}
                  {job.applications?.length > 0 && (
                    <span style={{ fontSize: "0.8rem", color: "#555", marginLeft: "0.5rem" }}>
                      ({job.applications.length} applicants)
                    </span>
                  )}
                </CardTitle>
                <CardContent>
                  <p>{job.description}</p>
                  <p><strong>Location:</strong> {job.location}</p>
                  <p><strong>Salary:</strong> {job.salary}</p>
                  <p><strong>Work Model:</strong> {job.workModel}</p>
                  <ul>
                    {job.requirements?.map((req: string, i: number) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>

                  {job.applications?.length > 0 && (
                    <div style={{ marginTop: "1rem" }}>
                      <Button
                        type="button"
                        onClick={() => toggleApplicants(job._id)}
                        style={{ marginBottom: "0.5rem" }}
                      >
                        {showApplicantsMap[job._id] ? "Hide Applicants" : "View Applicants"}
                      </Button>

                      {showApplicantsMap[job._id] && (
                        <ul>
                          {job.applications.map((app: any, i: number) => (
                            <li key={i}>
                              {app.applicant.name} applied with bid: {app.bid}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  {/* Edit/Delete buttons only on myJobs */}
                  {activePage === "myJobs" && (
                    <div style={{ marginTop: "1rem" }}>
                      <Button
                        type="button"
                        onClick={async () => {
                          const newTitle = prompt("New title", job.title);
                          if (!newTitle) return;
                          const token = localStorage.getItem("token");

                          await fetch(`${API_URL}/api/jobs/${job._id}`, {
                            method: "PUT",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({ title: newTitle }),
                          });

                          setJobs(jobs.map(j =>
                            j._id === job._id ? { ...j, title: newTitle } : j
                          ));
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        style={{ marginLeft: "0.5rem", background: "#ef4444" }}
                        onClick={async () => {
                          const token = localStorage.getItem("token");

                          await fetch(`${API_URL}/api/jobs/${job._id}`, {
                            method: "DELETE",
                            headers: { Authorization: `Bearer ${token}` },
                          });

                          setJobs(jobs.filter(j => j._id !== job._id));
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  )}

                </CardContent>
              </Card>
            ))}
          </>
        );

      // ---------------- SETTINGS ----------------
      case "settings":
        return (
          <Card>
            <CardTitle>Settings</CardTitle>
            <CardContent>
              <p>Here you can later add plan upgrades, ATS/HRIS integration, etc.</p>
            </CardContent>
          </Card>
        );

      default:
        return (
          <Card>
            <CardTitle>Welcome Back 👋</CardTitle>
            <CardContent>
              Use the sidebar to manage your jobs and profile.
            </CardContent>
          </Card>
        );
    }
  };

  // ---------------- MAIN RETURN ----------------
  return (
    <DashboardWrapper>
      <Sidebar>
        <SidebarLink
          as="button"
          $active={activePage === "home"}
          onClick={() => setActivePage("home")}
        >
          Home
        </SidebarLink>

        <SidebarLink
          as="button"
          $active={activePage === "profile"}
          onClick={() => setActivePage("profile")}
        >
          Profile
        </SidebarLink>

        <SidebarLink
          as="button"
          $active={activePage === "createJob"}
          onClick={() => setActivePage("createJob")}
        >
          Create Job
        </SidebarLink>

        <SidebarLink
          as="button"
          $active={activePage === "myJobs"}
          onClick={() => setActivePage("myJobs")}
        >
          My Jobs
        </SidebarLink>

        <SidebarLink
          as="button"
          $active={activePage === "settings"}
          onClick={() => setActivePage("settings")}
        >
          Settings
        </SidebarLink>

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
