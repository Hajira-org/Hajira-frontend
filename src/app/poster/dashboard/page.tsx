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
} from '@/app/common/styledComponents';
import { useLogout } from '@/utils/logout';

export default function PosterDashboardPage() {
  const [activePage, setActivePage] = useState("home");
  const [jobs, setJobs] = useState<any[]>([]);
  const [form, setForm] = useState({ title: "", description: "", location: "", salary: "" });
  const [profile, setProfile] = useState({ company: "", about: "", logo: "" });
  const logout = useLogout();

  // Fetch jobs when opening "My Jobs"
  useEffect(() => {
    if (activePage === "myJobs") {
      fetch("/api/jobs")
        .then(res => res.json())
        .then(data => setJobs(data.jobs || []))
        .catch(err => console.error(err));
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
                  await fetch("/api/profile", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(profile),
                  });
                }}
              >
                <input
                  placeholder="Company"
                  value={profile.company}
                  onChange={e => setProfile({ ...profile, company: e.target.value })}
                />
                <textarea
                  placeholder="About"
                  value={profile.about}
                  onChange={e => setProfile({ ...profile, about: e.target.value })}
                />
                <input
                  placeholder="Logo URL"
                  value={profile.logo}
                  onChange={e => setProfile({ ...profile, logo: e.target.value })}
                />
                <button type="submit">Save Profile</button>
              </form>
            </CardContent>
          </Card>
        );

      case "createJob":
        return (
          <Card>
            <CardTitle>Create Job</CardTitle>
            <CardContent>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const res = await fetch("/api/jobs", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                  });
                  if (res.ok) {
                    setForm({ title: "", description: "", location: "", salary: "" });
                    setActivePage("myJobs"); // redirect to jobs after posting
                  }
                }}
              >
                <input
                  placeholder="Job Title"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                />
                <textarea
                  placeholder="Description"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                />
                <input
                  placeholder="Location"
                  value={form.location}
                  onChange={e => setForm({ ...form, location: e.target.value })}
                />
                <input
                  placeholder="Salary"
                  value={form.salary}
                  onChange={e => setForm({ ...form, salary: e.target.value })}
                />
                <button type="submit">Post Job</button>
              </form>
            </CardContent>
          </Card>
        );

      case "myJobs":
        return (
          <>
            {jobs.length === 0 && (
              <Card>
                <CardTitle>No Jobs Yet</CardTitle>
                <CardContent>Click "Create Job" in the sidebar to post your first job.</CardContent>
              </Card>
            )}
            {jobs.map((job) => (
              <Card key={job._id}>
                <CardTitle>{job.title}</CardTitle>
                <CardContent>
                  {job.description}
                  <div style={{ marginTop: "1rem" }}>
                    <button
                      onClick={async () => {
                        const newTitle = prompt("New title", job.title);
                        if (!newTitle) return;
                        await fetch(`/api/jobs/${job._id}`, {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ title: newTitle }),
                        });
                        setJobs(jobs.map(j => j._id === job._id ? { ...j, title: newTitle } : j));
                      }}
                    >
                      Edit
                    </button>
                    <button
                      style={{ marginLeft: "0.5rem", color: "red" }}
                      onClick={async () => {
                        await fetch(`/api/jobs/${job._id}`, { method: "DELETE" });
                        setJobs(jobs.filter(j => j._id !== job._id));
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        );

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
            <CardContent>Use the sidebar to manage your jobs and profile.</CardContent>
          </Card>
        );
    }
  };

  // ---------------- MAIN RETURN ----------------
  return (
    <DashboardWrapper>
      {/* Sidebar */}
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
