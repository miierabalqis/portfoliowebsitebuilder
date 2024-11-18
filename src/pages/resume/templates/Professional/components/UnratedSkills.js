import React from 'react';
import styled from '@emotion/styled';

const Badge = styled.span`
  border: 1px solid ${(props) => props.theme.highlighterColor};
`;

function UnratedSkills({ items }) {
  return (
    <div className="flex gap-3 flex-wrap">
      {items.map((value) => (
        <Badge key={value.name} className="p-1 rounded-md border border-solid">
          {value.name}
        </Badge>
      ))}
    </div>
  );
}

export default UnratedSkills;
