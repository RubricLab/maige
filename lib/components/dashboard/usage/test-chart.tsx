"use client";

import { LineChart } from "@tremor/react";

export default function TestChart({
  data,
  category,
  color,
}: {
  data: any;
  category: string;
  color: string;
}) {
  const customTooltip = ({
    payload,
    active,
  }: {
    payload: any;
    active: any;
  }) => {
    if (!active || !payload) return null;
    return (
      <div className="w-56 rounded-tremor-default text-tremor-default bg-tremor-background p-2 shadow-tremor-dropdown border border-tremor-border">
        {payload.map((category: any, idx: number) => (
          <div key={idx} className="flex flex-1 space-x-2.5">
            <div
              className={`w-1 flex flex-col bg-${category.color}-500 rounded`}
            />
            <div className="space-y-1">
              <p className="text-tremor-content">{category.dataKey}</p>
              <p className="font-medium text-tremor-content-emphasis">
                {category.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const exData = [
    {
      year: 1970,
      tokens: 1,
      cost: 10,
    },
    {
      year: 1971,
      tokens: 1,
      cost: 100,
    },
    {
      year: 1972,
      tokens: 10,
      cost: 20
    },
    {
      year: 1973,
      tokens: 1,
      cost: 30
    },
    {
      year: 1974,
      tokens: 1,
      cost: 40
    },
    //...
  ];

  return (
    <>
   <LineChart
     className="h-72"
     data={exData}
     index="step"
     showAnimation={true}
     autoMinValue={true}
     categories={[category]}
     customTooltip={customTooltip}
     colors={[color]}
     yAxisWidth={40}
    />
    </>
  );
}