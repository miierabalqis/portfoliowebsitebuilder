import React from 'react';
import HTMLRenderer from '@/helpers/common/components/HTMLRenderer';

function Achievements({ data }) {
  return (
    <div>
      <HTMLRenderer htmlString={data} />
    </div>
  );
}

export default Achievements;
