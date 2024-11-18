import React from 'react';
import styled from '@emotion/styled';

const ProgressBar = styled.div`
  width: ${(props) => props.level}%;
  height: 6px;
  background-color: ${(props) => props.theme.highlighterColor};
`;

function RatedSkills({ items }) {
  return (
    <div className="flex flex-col gap-2">
      {items?.map(({ name, level }) => (
        <div className="flex items-center" key={name}>
          <p className="min-w-[15ch]">{name}</p>
          <div className="w-full bg-gray-100 rounded-md">
            <ProgressBar level={level} className="rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default RatedSkills;
