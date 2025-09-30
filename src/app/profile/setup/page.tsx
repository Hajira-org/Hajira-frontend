"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styled, { keyframes } from "styled-components";
import axios from "axios";

interface ButtonProps {
  variant?: "primary" | "secondary";
  disabled?: boolean;
}

// ---------------- Layout ----------------
const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a, #1e293b);
  padding: 2rem;
  position: relative;
`;

const Card = styled.div`
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  background: rgba(30, 41, 59, 0.85);
  width: 100%;
  max-width: 600px;
  padding: 2rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);
  color: #f9fafb;
  position: relative;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-align: center;
  background: linear-gradient(90deg, #3b82f6, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Field = styled.div`
  margin-bottom: 1.2rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.4rem;
  font-weight: 600;
  font-size: 0.95rem;
  color: #cbd5e1;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 10px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.05);
  color: #f9fafb;
  outline: none;
  transition: 0.2s;

  &::placeholder {
    color: #94a3b8;
  }

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.35);
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 10px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.05);
  color: #f9fafb;
  resize: vertical;
  min-height: 100px;
  outline: none;
  transition: 0.2s;

  &::placeholder {
    color: #94a3b8;
  }

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.35);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 10px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.05);
  color: #f9fafb;
  outline: none;
  transition: 0.2s;

  option {
    background: #1e293b;
    color: #f9fafb;
  }

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.35);
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
`;

const Button = styled.button<ButtonProps>`
  padding: 0.85rem 1.5rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  border: none;
  transition: all 0.25s ease;

  background: ${({ variant, disabled }) =>
    disabled
      ? "#374151"
      : variant === "secondary"
      ? "rgba(255,255,255,0.1)"
      : "linear-gradient(90deg, #3b82f6, #06b6d4)"};

  color: ${({ variant, disabled }) =>
    disabled ? "#9ca3af" : variant === "secondary" ? "#f9fafb" : "#fff"};

  &:hover {
    opacity: ${({ disabled }) => (disabled ? "1" : "0.9")};
    transform: ${({ disabled }) => (disabled ? "none" : "translateY(-1px)")};
  }
`;

// ---------------- Toast ----------------
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const ToastContainer = styled.div<{ type: "success" | "error" }>`
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: ${({ type }) => (type === "success" ? "#16a34a" : "#dc2626")};
  color: #fff;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
  animation: ${fadeIn} 0.3s ease forwards;
  z-index: 100;
`;

// ---------------- Loading Overlay ----------------
const overlayFade = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  animation: ${overlayFade} 0.3s ease forwards;
  z-index: 50;
`;

const Spinner = styled.div`
  border: 4px solid rgba(255,255,255,0.2);
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

// ---------------- Skills ----------------
const skillsListDefault = [
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
];

// ---------------- Component ----------------
export default function ProfileSetupPage() {
  const [step, setStep] = useState(1);
  const [skillsList, setSkillsList] = useState(skillsListDefault);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const router = useRouter();

  const [form, setForm] = useState({
    role: "",
    age: "",
    skills: [] as string[],
    skillSearch: "",
    bio: "",
    location: "",
    company: "",
    category: "",
  });

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });
  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddCustomSkill = () => {
    const newSkill = form.skillSearch.trim();
    if (!newSkill) return;

    // avoid duplicates (case-insensitive)
    if (skillsList.some((s) => s.toLowerCase() === newSkill.toLowerCase())) {
      showToast("That skill already exists", "error");
      return;
    }

    setForm({
      ...form,
      skills: [...form.skills, newSkill],
      skillSearch: "",
    });
    setSkillsList([...skillsList, newSkill]);
    showToast(`Added "${newSkill}"`, "success");
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please login again.");

      const payload =
        form.role === "seeker"
          ? {
              role: form.role,
              seeker: {
                age: Number(form.age),
                skills: form.skills,
                bio: form.bio,
                location: form.location,
              },
            }
          : {
              role: form.role,
              poster: {
                company: form.company,
                category: form.category,
                bio: form.bio,
                location: form.location,
              },
            };

      const res = await axios.post(
        "http://localhost:4000/api/auth/setup",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const role = res.data.role || form.role;
      localStorage.setItem("role", role);

      showToast("Profile setup complete!", "success");

      setTimeout(() => {
        if (role === "seeker") router.push("/dashboard");
        else if (role === "poster") router.push("/poster/dashboard");
        else router.push("/signin");
      }, 1500);
    } catch (err: any) {
      console.error(err);
      showToast(
        err.response?.data?.message || err.message || "Error saving profile",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <Card>
        <Title>Profile Setup</Title>

        {/* Step 1 */}
        {step === 1 && (
          <>
            <Field>
              <Label>Role</Label>
              <Select name="role" value={form.role} onChange={handleChange}>
                <option value="">-- Select Role --</option>
                <option value="seeker">Looking for work</option>
                <option value="poster">I want to hire</option>
              </Select>
            </Field>
            <ButtonRow>
              <div />
              <Button onClick={nextStep} disabled={!form.role}>
                Next
              </Button>
            </ButtonRow>
          </>
        )}

        {/* Step 2: Seeker */}
        {step === 2 && form.role === "seeker" && (
          <>
            <Field>
              <Label>Age</Label>
              <Input
                type="number"
                name="age"
                value={form.age}
                onChange={handleChange}
              />
            </Field>

            <Field>
              <Label>Select Your Skills / Microjobs</Label>
              <Input
                type="text"
                placeholder="Search microjobs or add your own..."
                value={form.skillSearch}
                onChange={(e) =>
                  setForm({ ...form, skillSearch: e.target.value })
                }
                style={{ marginBottom: "0.8rem" }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCustomSkill();
                  }
                }}
              />
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  maxHeight: "300px",
                  overflowY: "auto",
                  paddingRight: "4px",
                }}
                className="no-scrollbar"
              >
                {skillsList
                  .filter((s) =>
                    s.toLowerCase().includes(form.skillSearch.toLowerCase())
                  )
                  .map((skill) => (
                    <div
                      key={skill}
                      onClick={() => {
                        if (!form.skills.includes(skill))
                          setForm({ ...form, skills: [...form.skills, skill] });
                        else
                          setForm({
                            ...form,
                            skills: form.skills.filter((sk) => sk !== skill),
                          });
                      }}
                      style={{
                        padding: "0.5rem 1rem",
                        borderRadius: "20px",
                        cursor: "pointer",
                        userSelect: "none",
                        background: form.skills.includes(skill)
                          ? "#3b82f6"
                          : "rgba(255,255,255,0.1)",
                        color: form.skills.includes(skill) ? "#fff" : "#f9fafb",
                        border: form.skills.includes(skill)
                          ? "none"
                          : "1px solid rgba(255,255,255,0.25)",
                        transition: "0.2s",
                      }}
                    >
                      {skill}
                    </div>
                  ))}
              </div>

              <style jsx>{`
                .no-scrollbar {
                  scrollbar-width: none;
                  -ms-overflow-style: none;
                }
                .no-scrollbar::-webkit-scrollbar {
                  display: none;
                }
              `}</style>

              {form.skillSearch &&
                !skillsList
                  .map((s) => s.toLowerCase())
                  .includes(form.skillSearch.toLowerCase()) && (
                  <Button
                    style={{ marginTop: "0.8rem" }}
                    onClick={handleAddCustomSkill}
                  >
                    + Add "{form.skillSearch}"
                  </Button>
                )}
            </Field>

            <ButtonRow>
              <Button variant="secondary" onClick={prevStep}>
                Back
              </Button>
              <Button
                onClick={nextStep}
                disabled={form.skills.length === 0 || !form.age}
              >
                Next
              </Button>
            </ButtonRow>
          </>
        )}

        {/* Step 2: Poster */}
        {step === 2 && form.role === "poster" && (
          <>
            <Field>
              <Label>Company/Brand Name</Label>
              <Input
                name="company"
                value={form.company}
                onChange={handleChange}
              />
            </Field>
            <Field>
              <Label>Job Category</Label>
              <Input
                name="category"
                value={form.category}
                onChange={handleChange}
              />
            </Field>
            <ButtonRow>
              <Button variant="secondary" onClick={prevStep}>
                Back
              </Button>
              <Button
                onClick={nextStep}
                disabled={!form.company || !form.category}
              >
                Next
              </Button>
            </ButtonRow>
          </>
        )}

        {/* Step 3: Bio / Location */}
        {step === 3 && (
          <>
            <Field>
              <Label>Bio / Description</Label>
              <Textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder={
                  form.role === "seeker"
                    ? "Tell us about yourself..."
                    : "Describe your company or what you hire for..."
                }
              />
            </Field>
            <Field>
              <Label>Location</Label>
              <Input
                name="location"
                value={form.location}
                onChange={handleChange}
              />
            </Field>
            <ButtonRow>
              <Button variant="secondary" onClick={prevStep}>
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!form.bio || !form.location || loading}
              >
                {loading ? "Saving..." : "Finish"}
              </Button>
            </ButtonRow>
          </>
        )}

        {loading && (
          <LoadingOverlay>
            <Spinner />
          </LoadingOverlay>
        )}
      </Card>

      {toast && (
        <ToastContainer type={toast.type}>{toast.message}</ToastContainer>
      )}
    </PageWrapper>
  );
}
