'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Wrapper,
  Inner,
  LogoContainer,
  Nav,
  CallToActions,
  BurgerMenu,
} from './styles';
import raft_logo from '../../../../public/svgs/logo1.png';
import ic_bars from '../../../../public/svgs/ic_bars.svg';
import { GetStartedButton } from '@/components';
import AnimatedLink from '@/components/Common/AnimatedLink';
import { links, menu } from './constants';
import { useDashboardRedirect } from '@/utils/redirectToDashboard';
import { useLogout } from '@/utils/logout';
import { useUser } from '@/utils/useUser';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [avatarPopupOpen, setAvatarPopupOpen] = useState(false);

  const { goToDashboard, isClient } = useDashboardRedirect();
  const logoutFn = useLogout();
  const { user, setUser } = useUser();

  // Logout wrapper to also clear user state immediately
  const logout = () => {
    logoutFn();
    setUser(null);
    setAvatarPopupOpen(false);
  };

  return (
    <Wrapper>
      <Inner>
        {/* Logo & burger menu */}
        <LogoContainer>
          <Image
            src={raft_logo}
            alt="raft_logo"
            priority
            height={70}
            width={80}
          />
          <BurgerMenu onClick={() => setIsOpen(!isOpen)}>
            <motion.div
              variants={menu}
              animate={isOpen ? 'open' : 'closed'}
              initial="closed"
            />
            <Image src={ic_bars} alt="bars" />
          </BurgerMenu>
        </LogoContainer>

        {/* Navigation links */}
        <Nav className={isOpen ? 'active' : ''}>
          {links.map((link, i) =>
            link.linkTo.toLowerCase() === 'dashboard' ? (
              <span
                key={i}
                onClick={isClient ? goToDashboard : undefined}
                style={{ cursor: isClient ? 'pointer' : 'default' }}
              >
                <AnimatedLink
                  title={link.linkTo}
                  href="#" // dummy, won’t be used
                />
              </span>
            ) : (
              <AnimatedLink key={i} title={link.linkTo} href={link.url} />
            )
          )}
        </Nav>

        {/* Call to actions */}
        <CallToActions className={isOpen ? 'active' : ''}>
          {user ? (
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Image
                src={user.avatar || 'https://via.placeholder.com/40?text=👤'}
                alt="User Avatar"
                width={40}
                height={40}
                style={{ borderRadius: '50%', cursor: 'pointer' }}
                onClick={() => setAvatarPopupOpen(!avatarPopupOpen)}
                unoptimized
              />
              <span style={{ color: '#fff', fontWeight: 600 }}>
                {user.name}
              </span>

              {avatarPopupOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '50px',
                    right: 0,
                    background: '#1e293b',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                    zIndex: 50,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                  }}
                >
                  <button
                    onClick={goToDashboard}
                    style={{
                      background: 'transparent',
                      color: '#fff',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 600,
                      textAlign: 'left',
                    }}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={logout}
                    style={{
                      background: 'transparent',
                      color: '#ef4444',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 600,
                      textAlign: 'left',
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <AnimatedLink title="Login" href="/signin" />
              <GetStartedButton padding="0.5rem 0.75rem" />
            </>
          )}
        </CallToActions>
      </Inner>
    </Wrapper>
  );
};

export default Header;
