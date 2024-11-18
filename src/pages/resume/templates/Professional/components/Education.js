import React from 'react';
import { dateParser } from '@/helpers/utils';

function Education({ education }) {
  return (
    <div className="flex flex-col gap-5">
      {education.map((item, index) => (
        <div key={index}>
          <div>
            <p className="font-normal text-sm">
              {item.studyType} - {item.area}
            </p>
            <div className="flex justify-between font-normal text-xs">
              <p>{item.institution}</p>
              <p>
                {`${dateParser(item.startDate)} - ${
                  item.isStudyingHere ? 'present' : dateParser(item.endDate)
                }`}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Education;
