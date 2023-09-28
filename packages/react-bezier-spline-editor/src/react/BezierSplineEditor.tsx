import React, { Fragment, useEffect, useRef, useState } from 'react';
import { getYForX } from '../core/getYForX';
import { Point } from '../core/Point';

interface BezierEditorProps {
  width?: number;
  height?: number;
  showPoints?: boolean;
  displayRelativePoints?: boolean;
  indicatorSpeed?: number;
  points?: Point[];
  onPointsChange?: (points: Point[]) => void;

  containerProps?: React.SVGProps<SVGSVGElement>;
  curveProps?: React.SVGProps<SVGPathElement>;
  controlPointLineProps?: React.SVGProps<SVGLineElement>;
  controlPointProps?: React.SVGProps<SVGCircleElement>;
  anchorPointProps?: React.SVGProps<SVGCircleElement>;
  indicatorProps?: React.SVGProps<SVGCircleElement>;
  backgroundLineProps?: React.SVGProps<SVGLineElement>;
}

export function BezierSplineEditor({
  width = 400,
  height = 400,
  showPoints = false,
  containerProps,
  displayRelativePoints,
  curveProps,
  indicatorProps,
  indicatorSpeed = 5,
  backgroundLineProps,
  points: propsPoints,
  ...props
}: BezierEditorProps) {
  const controlPointRadius = 10;
  const padding = 0;

  const svgRef = useRef<SVGSVGElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);

  const scalePoints = (points: Point[]) =>
    points.map((point) => ({
      x: point.x * width,
      y: (1 - point.y) * height,
    }));

  const unScalePoint = (point: Point) => ({
    x: point.x / width,
    y: point.y / height,
  });

  const [m_points, m_setPoints] = useState<Point[]>([
    { x: 0, y: 0 },
    { x: 0.25, y: 0.25 },
    { x: 0.75, y: 0.75 },
    { x: 1, y: 1 },
  ]);

  const relativePoints = propsPoints != undefined ? propsPoints : m_points;
  const setRelativePoints = props.onPointsChange ?? m_setPoints;
  const scaledPoints = scalePoints(relativePoints);

  const handleDrag = (event: MouseEvent, index: number) => {
    if (!svgRef.current) return;

    event.preventDefault();

    const rect = svgRef.current.getBoundingClientRect();

    const scale = rect.width / width

    let x = (event.clientX - rect.left - padding) / scale;
    let y = (event.clientY - rect.top - padding) / scale;

    // Constrain all points within the bounding box
    x = Math.max(0, Math.min((rect.width - padding * 2) / scale, x));
    y = Math.max(0, Math.min((rect.height - padding * 2) / scale, y));

    const newPoints = [...relativePoints];
    if (index === 0 || index === relativePoints.length - 1) {
      newPoints[index] = { x: scaledPoints[index].x, y: y };
    } else {
      newPoints[index] = { x: x, y: y };
    }

    newPoints[index] = unScalePoint(newPoints[index]);

    // flip the y axis
    newPoints[index].y = 1 - newPoints[index].y;

    setRelativePoints(newPoints);
  };

  const handleAddPoint = (event: React.MouseEvent) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    
    const scale = rect.width / width

    let x = (event.clientX - rect.left - padding) / scale;
    let y = (event.clientY - rect.top - padding) / scale;

    // Find the nearest existing anchor points
    // let nearestIndex = 0;
    let insertIndex = scaledPoints.length - 3; // Default to the second-last anchor point
    for (let i = 0; i < scaledPoints.length - 3; i += 3) {
      // console.log("comparing", x, points[i + 3].x, "at", i);
      if (x < scaledPoints[i + 3].x) {
        insertIndex = i;
        break;
      }
    }

    let newAnchorPoint = { x: x, y: y };
    const controlPoint1 = unScalePoint({
      x: newAnchorPoint.x - 20,
      y: newAnchorPoint.y,
    });
    const controlPoint2 = unScalePoint({
      x: newAnchorPoint.x + 20,
      y: newAnchorPoint.y,
    });
    newAnchorPoint = unScalePoint(newAnchorPoint);

    // flip the y axis
    newAnchorPoint.y = 1 - newAnchorPoint.y;
    controlPoint1.y = 1 - controlPoint1.y;
    controlPoint2.y = 1 - controlPoint2.y;

    const newPoints = [...relativePoints];
    newPoints.splice(
      insertIndex + 2,
      0,
      controlPoint1,
      newAnchorPoint,
      controlPoint2,
    );

    setRelativePoints(newPoints);
  };

  const handleRemovePoint = (event: React.MouseEvent, index: number) => {
    event.stopPropagation(); // Prevent triggering the onClick event on the SVG

    if (index === 0 || index === scaledPoints.length - 1) {
      alert("Can't remove the start or end points");
      return;
    }

    // Ensure index is aligned with an anchor point
    if ((index - 3) % 3 !== 0) return;

    const newPoints = [...relativePoints];
    newPoints.splice(index - 1, 3); // Remove the anchor point and its adjacent control points

    setRelativePoints(newPoints);
  };

  const pathData = `M ${scaledPoints[0].x} ${scaledPoints[0].y} C ${scaledPoints
    .slice(1)
    .map((p) => `${p.x} ${p.y}`)
    .join(', ')}`;

  useEffect(() => {
    let time = performance.now();
    const updateCirclePosition = () => {
      if (!circleRef.current) return;

      const t = (performance.now() / indicatorSpeed) % width; // Time in seconds

      const x = t; //-radius + 2 * radius * t;
      const y = (1 - getYForX(relativePoints, x / width)) * height;

      circleRef.current.setAttribute('cx', x.toString());
      circleRef.current.setAttribute('cy', y.toString());

      requestAnimationFrame(updateCirclePosition);
    };
    updateCirclePosition();
  }, [relativePoints, indicatorSpeed]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      onDoubleClick={handleAddPoint}
      style={{
        overflow: 'visible',
        // border: "2px solid red",
        padding: `${padding}px`,
        // margin: "20px"
      }}
      {...containerProps}
    >
      <path d={pathData} stroke="black" fill="none" {...curveProps} />

      {scaledPoints.map((point, index) => {
        if (index % 3 === 1) {
          return (
            <Fragment key={index}>
              <line
                key={`${index}-1`}
                x1={scaledPoints[index - 1].x}
                y1={scaledPoints[index - 1].y}
                x2={point.x}
                y2={point.y}
                stroke="black"
                strokeDasharray="5,5"
                {...props.controlPointLineProps}
              />
              <line
                key={`${index}-2`}
                x1={scaledPoints[index + 1].x}
                y1={scaledPoints[index + 1].y}
                x2={scaledPoints[index + 2].x}
                y2={scaledPoints[index + 2].y}
                stroke="black"
                strokeDasharray="5,5"
                {...props.controlPointLineProps}
              />
            </Fragment>
          );
        }
        return null;
      })}

      {scaledPoints.map((point, index) => (
        <Fragment key={index}>
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r={controlPointRadius}
            style={{
              cursor: 'move',
            }}
            // fill="red"
            fill={index % 3 === 0 ? 'red' : 'darkgray'}
            onDoubleClick={(event) => handleRemovePoint(event, index)}
            onMouseDown={(e) => {
              const listener = (event: MouseEvent) => handleDrag(event, index);
              document.body.addEventListener('mousemove', listener);
              document.body.addEventListener('mouseup', (event) =>
                document.body.removeEventListener('mousemove', listener),
              );
            }}
            {...(index % 3 === 0
              ? props.anchorPointProps
              : props.controlPointProps)}
          />
          {showPoints && (
            <text x={point.x + 10} y={point.y + 5} fontSize="12px">{`(${(
              point.x / width
            ).toFixed(2)}, ${(point.y / height).toFixed(2)})`}</text>
          )}
        </Fragment>
      ))}

      <line
        x1={0}
        y1={height * 0.5}
        x2={width}
        y2={height * 0.5}
        stroke="grey"
        {...backgroundLineProps}
      />
      <line
        x1={width * 0.5}
        y1={0}
        x2={width * 0.5}
        y2={height}
        stroke="grey"
        {...backgroundLineProps}
      />

      <circle
        ref={circleRef}
        cx="10"
        cy="10"
        r="5"
        fill="darkgray"
        {...indicatorProps}
      />
    </svg>
  );
}
