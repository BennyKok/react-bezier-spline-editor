# react-bezier-spline-editor

A modern bezier spline editor for react.

https://github.com/BennyKok/react-bezier-spline-editor/assets/18395202/ba1f8114-30ec-4738-b7ff-ead81a582f51

- Double click to add / remove point
- Un-styled, style with your own css
- Display point coordinates
- Animation progress preview
- SVG based, crips rendering

View demo here https://react-bezier-spline-editor.vercel.app/

## Installation

```bash
pnpm install react-bezier-spline-editor
```

## Usage

### Rendering Editor

For next js

```tsx
'use client';
```

```tsx
import { BezierSplineEditor } from 'react-bezier-spline-editor/react';
import type { Point } from 'react-bezier-spline-editor/core';
```

```tsx
function MyBezierSplineEditor() {
  const [points, setPoints] = useState<Point[]>([
    { x: 0, y: 0 },
    { x: 0.25, y: 0.25 },
    { x: 0.75, y: 0.75 },
    { x: 1, y: 1 },
  ]);

  return <BezierSplineEditor points={points} onPointsChange={setPoints} />;
}
```

### With Tailwind CSS

Copy the code below for the same styling as the demo

<details>
  <summary>View Code</summary>

```tsx
<BezierSplineEditor
  points={points}
  onPointsChange={setPoints}
  showPoints
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
```

</details>

### Spline Calculation

Calculating the spline's Y value based on X

```tsx
import { getYForX } from 'react-bezier-spline-editor/core';
```

```tsx
const yAtHalfX = getYForX(points, 0.5);
```
