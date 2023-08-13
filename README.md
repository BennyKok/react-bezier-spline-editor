# react-bezier-spline-editor

A modern bezier spline editor for react.

- Double click to add / remove point
- Un-styled, style with your own css
- Display point coordinates
- Animation progress preview
- SVG based, crips rendering

## Installation

```bash
pnpm install react-bezier-spline-editor
```

## Usage

Rendering Editor

```tsx
import { BezierSplineEditor } from 'react-bezier-spline-editor/react';
```

```tsx
function MyComponent() {
  const [showPoints, setShowPoints] = useState(true);

  return <BezierSplineEditor points={points} onPointsChange={setPoints} />;
}
```

Calculating the spline's Y value based on X

```tsx
import { getYForX } from 'react-bezier-spline-editor/core';
```

```tsx
const yAtHalfX = getYForX(points, 0.5);
```
