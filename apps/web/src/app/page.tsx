'use client';

import { useState } from 'react';
import { BezierSplineEditor } from 'react-bezier-spline-editor/react';
import { Card, CardBody, Checkbox, Snippet } from '@nextui-org/react';
import { Point } from 'react-bezier-spline-editor/core';

export default function Home() {
  const [showPoints, setShowPoints] = useState(true);

  const [points, setPoints] = useState<Point[]>([
    { x: 0, y: 0 },
    { x: 0.25, y: 0.25 },
    { x: 0.75, y: 0.75 },
    { x: 1, y: 1 },
  ]);

  return (
    <main className="flex min-h-screen flex-col items-center  p-24 gap-8">
      <div className="flex flex-col items-center justify-center space-y-4">
        <h1 className="text-4xl font-bold text-center">
          react-bezier-spline-editor
        </h1>
        <p className="text-xl text-center">
          A React component for editing cubic bezier spline curves
        </p>
        <a
          className="text-blue-500 hover:text-blue-600"
          href=""
          target="_blank"
          rel="noopener noreferrer"
        >
          View on GitHub
        </a>
      </div>

      <div className="flex flex-col items-center lg:items-start lg:flex-row gap-10 h-full">
        <Card className="w-full md:w-[460px] h-full">
          <CardBody>
            <>Double Click to add points</>
            <p className="mt-4">Install</p>
            <Snippet>pnpm install react-bezier-spline-editor</Snippet>
            <p className="mt-4">Properties</p>
            <Checkbox
              isSelected={showPoints}
              onValueChange={(isSelected) => {
                setShowPoints(isSelected);
              }}
            >
              Show Points
            </Checkbox>
          </CardBody>
        </Card>

        <BezierSplineEditor
          points={points}
          onPointsChange={setPoints}
          showPoints={showPoints}
          backgroundLineProps={{
            className: 'stroke-gray-200',
          }}
          indicatorProps={{
            className: 'fill-current text-blue-400 animate-in fade-in',
          }}
          curveProps={{
            className: 'stroke-blue-400 stroke-2 animate-in fade-in',
          }}
          controlPointLineProps={{
            className: 'stroke-gray-400',
          }}
          containerProps={{
            className: 'ring-1 rounded-lg shadow-md',
          }}
          anchorPointProps={{
            r: 8,
            className:
              'fill-current text-blue-500 hover:text-blue-600 hover:stroke-sky-400 hover:stroke-2 transition-colors',
          }}
          controlPointProps={{
            r: 6,
            className:
              'fill-current text-transparent hover:text-blue-300 stroke-sky-400 stroke-2 transition-colors',
          }}
        />
      </div>
    </main>
  );
}
