import React from 'react';
import HTMLRenderer from '@/helpers/common/components/HTMLRenderer';

function Objective({ objective }) {
  return <HTMLRenderer htmlString={objective} />;
}

export default Objective;
