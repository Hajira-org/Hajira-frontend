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

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
  }
`;

/* ========================
   Left Image Panel
======================== */
export const LeftPanel = styled.div`
  flex: 1;
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
      font-size: 0.9rem;
      left: 0.8rem;
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
`;
