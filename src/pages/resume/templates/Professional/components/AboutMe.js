import React from 'react';
import HTMLRenderer from '@/helpers/common/components/HTMLRenderer';
import ProfileImage from '@/helpers/common/components/ProfileImage';
import styles from './about.module.css';

function AboutMe({ summary, profileImage }) {
  return (
    <div className="text-[1em]">
      {profileImage.length !== 0 && (
        <ProfileImage
          src={profileImage}
          width={'80px'}
          height={'80px'}
          imageWrapperClassname={`float-left mr-3 mb-1 ${styles.imageWrapShape}`}
        />
      )}
      <HTMLRenderer htmlString={summary} />
    </div>
  );
}

export default AboutMe;
