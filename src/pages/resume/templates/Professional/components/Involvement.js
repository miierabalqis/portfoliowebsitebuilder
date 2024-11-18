import React from 'react';
import HTMLRenderer from '@/helpers/common/components/HTMLRenderer';

function Involvement({ data }) {
  return (
    <div>
      <HTMLRenderer htmlString={data} />
    </div>
  );
}

export default Involvement;
