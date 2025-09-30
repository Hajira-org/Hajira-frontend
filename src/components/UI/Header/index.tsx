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

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { goToDashboard, isClient } = useDashboardRedirect();

  return (
    <Wrapper>
      <Inner>
        {/* Logo & burger menu */}
        <LogoContainer>
          <Image
            src={raft_logo}
            alt="raft_logo"
            priority
            height={60}
            width={75}
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
          <AnimatedLink title="Login" href="/signin" />
          <GetStartedButton padding="0.5rem 0.75rem" />
        </CallToActions>
      </Inner>
    </Wrapper>
  );
};

export default Header;
