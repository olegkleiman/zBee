import React from 'react';
import styled from 'styled-components';
import {Icons} from 'kepler.gl/components';

const StyledBanner = styled.div`
  align-items: center;
  background-color: ${props => props.bgColor};
  color: ${props => props.fontColor};
  display: flex;
  height: ${props => props.height}px;
  justify-content: space-between;
  padding: 0 40px;
  position: absolute;
  transition: top 1s;
  width: 100%;
  z-index: 9999;
  svg:hover {
    cursor: pointer;
  }
`;

const Banner = ({bgColor = '#1F7CF4', fontColor = '#FFFFFF', height = 30, children, onClose, show}) => (
  <StyledBanner className="top-banner"
    bgColor={bgColor}
    fontColor={fontColor}
    height={height}
    style={{top: show ? 0 : `-100px`}}>
      <div>
        {children}
      </div>
      <Icons.Delete height="14px" onClick={onClose}/>
  </StyledBanner>
);

export default Banner;
