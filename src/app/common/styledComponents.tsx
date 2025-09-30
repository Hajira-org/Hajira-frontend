'use client';
import { styled } from 'styled-components';
import { motion } from 'framer-motion';

/* ========================
   Layout Wrapper
======================== */
export const PageWrapper = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background: #0f172a;
  color: #fff;

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
  }
`;

/* ========================
   Left Image Panel
======================== */
export const LeftPanel = styled.div`
  flex: 1; /* takes half screen */
  position: relative;

  img {
    object-fit: cover;
    width: 100%;
    height: 90%;
  }

  @media (max-width: 768px) {
    width: 100%;
    height: 200px;

    img {
      height: 100%;
      object-fit: cover;
    }
  }
`;

/* ========================
   Right Form Panel
======================== */
export const RightPanel = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #052034;
  backdrop-filter: blur(12px);

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

/* ========================
   Form Container
======================== */
export const FormContainer = styled(motion.form)`
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 1rem;
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
  max-width: 420px;
  color: #fff;

  h2 {
    text-align: center;
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: #22c55e;
  }

  @media (max-width: 768px) {
    padding: 2rem 1rem;

    h2 {
      font-size: 1.5rem;
    }
  }
`;

/* ========================
   Input with Icon Group
======================== */
export const InputGroup = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  .icon {
    position: absolute;
    left: 1rem;
    color: #9ca3af;
    font-size: 1rem;
  }

  @media (max-width: 768px) {
    .icon {
      left: 0.8rem;
      font-size: 0.9rem;
    }
  }
`;

/* ========================
   Inputs
======================== */
export const Input = styled.input`
  width: 100%;
  padding: 0.9rem 1rem 0.9rem 2.5rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 0.75rem;
  font-size: 1rem;
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
  outline: none;
  transition: all 0.3s;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    border-color: #22c55e;
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.3);
  }

  @media (max-width: 768px) {
    padding-left: 2rem;
    font-size: 0.95rem;
  }
`;

/* ========================
   Select Dropdown
======================== */
export const Select = styled.select`
  padding: 0.9rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 0.75rem;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  outline: none;

  option {
    background: #0f172a;
    color: #fff;
  }

  &:focus {
    border-color: #22c55e;
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.3);
  }

  @media (max-width: 768px) {
    font-size: 0.95rem;
    padding: 0.8rem 1rem;
  }
`;

/* ========================
   Buttons
======================== */
export const Button = styled.button<{ loading?: boolean }>`
  background: #4f46e5;
  color: white;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #4338ca;
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 0.7rem 1.2rem;
    font-size: 0.95rem;
  }
`;

// Google Button
export const GoogleButton = styled(Button)`
  background: #fff;
  color: #444;
  border: 1px solid #ccc;
  margin-top: 0.75rem;

  svg {
    margin-right: 0.5rem;
  }

  &:hover {
    background: #f3f4f6;
  }

  @media (max-width: 768px) {
    padding: 0.7rem 1.2rem;
    font-size: 0.95rem;
  }
`;

/* ========================
   Page Container / Card Actions
======================== */
export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  padding: 2rem;
  background-color: #f9f9f9;
`;

export const CardActions = styled.div`
  margin-top: 0.8rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

/* ========================
   Dashboard Layout
======================== */
export const DashboardWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  gap: 1rem;
  background: #0f172a;
  color: #fff;

  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

/* Sidebar container */
export const Sidebar = styled.div`
  width: 240px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  border-radius: 12px;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 1024px) {
    width: 100%;
    flex-direction: row;
    overflow-x: auto;
    padding: 1rem;
    border-radius: 0;
  }

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

/* Individual sidebar link */
export const SidebarLink = styled.a<{ $active?: boolean }>`
  all: unset;
  box-sizing: border-box;

  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  font-size: 0.95rem;
  font-weight: 500;
  padding: 0.65rem 1rem;
  border-radius: 8px;
  cursor: pointer;

  color: ${({ $active }) => ($active ? "#111827" : "#9ca3af")};
  background: ${({ $active }) => ($active ? "#f0fdf4" : "transparent")};
  transition: all 0.25s ease;

  &:hover {
    background: #f9fafb;
    color: #111827;
  }

  ${({ $active }) =>
    $active &&
    `
    box-shadow: inset 3px 0 0 #22c55e;
  `}
`;

/* Main content area */
export const MainContent = styled.div`
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (max-width: 1024px) {
    padding: 1rem;
  }
`;

/* Dashboard card */
export const Card = styled.div`
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 25px rgba(0, 0, 0, 0.4);
  }
`;

/* Card title */
export const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #22c55e;
`;

/* Card content */
export const CardContent = styled.p`
  font-size: 1rem;
  color: #e5e7eb;
`;
