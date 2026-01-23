/**
 * Maps 2D field coordinates to 3D rotated coordinates
 * Accounts for perspective rotation (rotateX) and perspective distance
 *
 * @param x - X position on field (0 to size)
 * @param y - Y position on field (0 to size)
 * @param size - Size of the field
 * @param rotationDeg - Rotation angle in degrees (default: 45)
 * @param perspective - Perspective distance in pixels (default: 800)
 * @returns Object with transformed x, y, and z values for CSS transform
 */
/**
 * STEP-BY-STEP LOGIC:
 *
 * 1. NORMALIZATION: Convert pixel coords to -0.5 to 0.5 range (center field at origin)
 *    This makes the math easier since we're rotating around the center
 *
 * 2. ROTATION (rotateX 45°):
 *    - X axis: unchanged (rotation is around X-axis)
 *    - Y axis: moves toward camera based on cos(angle)
 *    - Z axis: depth perpendicular to screen based on sin(angle)
 *
 *    Example: Point at Y=0.5 with 45° rotation:
 *    - rotatedY = 0.5 * cos(45°) ≈ 0.5 * 0.707 = 0.354
 *    - rotatedZ = 0.5 * sin(45°) ≈ 0.5 * 0.707 = 0.354
 *    (Point moves closer to camera and back in Z space)
 *
 * 3. PERSPECTIVE SCALING:
 *    Objects further away appear smaller. Formula:
 *    scale = perspective / (perspective + Z)
 *
 *    Example with perspective=800:
 *    - At Z=0 (center): scale = 800/800 = 1.0 (full size)
 *    - At Z=200: scale = 800/1000 = 0.8 (80% size - shrinks 20%)
 *    - At Z=-200: scale = 800/600 = 1.33 (133% size - grows)
 *
 *    Smaller perspective value = more dramatic scaling effect
 *
 * 4. SCALE BACK TO PIXELS: Multiply by field size to get final coordinates
 */
export function mapCoordinates({
  x,
  y,
  size,
  rotationDeg = 45,
  perspective = 800,
}: {
  x: number;
  y: number;
  size: number;
  rotationDeg?: number;
  perspective?: number;
}): { x: number; y: number } {
  // STEP 1: Convert rotation degrees to radians (trig functions use radians)
  const rotationRad = (rotationDeg * Math.PI) / 180;

  // STEP 2: Normalize coordinates from [0, size] to [-0.5, 0.5]
  // This centers the field at (0, 0) for easier rotation math
  const normalizedX = x / size - 0.5;
  const normalizedY = y / size - 0.5;

  // STEP 3: Apply rotation matrix for X-axis rotation (rotateX)
  // When rotating around X-axis:
  // - X stays the same (rotation axis)
  // - Y and Z are affected by the angle
  //
  // Rotation formulas:
  // y' = y * cos(θ) - z * sin(θ)
  // z' = y * sin(θ) + z * cos(θ)
  // Since we start with z=0:
  const rotatedX = normalizedX;
  const rotatedY = normalizedY * Math.cos(rotationRad);
  const rotatedZ = normalizedY * Math.sin(rotationRad);

  // STEP 4: Apply perspective scaling
  // This makes objects further back appear smaller
  // perspectiveScale = perspective / (perspective + Z_depth)
  // - perspective: camera distance (larger = less dramatic effect)
  // - Z_depth: how far back the element is
  const perspectiveScale = perspective / (perspective + rotatedZ * size);

  // STEP 5: Scale back to pixel coordinates with perspective applied
  // We only return x and y since those are what we need for positioning on screen
  // z is calculated internally for perspective but not needed in the final result
  return {
    x: rotatedX * size * perspectiveScale,
    y: rotatedY * size * perspectiveScale,
  };
}

/**
 * Alternative version using matrix transformation (more accurate)
 * Useful if you need precise 3D positioning with perspective
 */
export function mapCoordinates3D(
  x: number,
  y: number,
  z: number = 0,
  size: number,
  rotationDeg: number = 45,
  perspective: number = 800,
): { x: number; y: number } {
  const rotationRad = (rotationDeg * Math.PI) / 180;
  const cos = Math.cos(rotationRad);
  const sin = Math.sin(rotationRad);

  // Normalize
  const nx = x / size - 0.5;
  const ny = y / size - 0.5;
  const nz = z / size;

  // Apply 3D rotation matrix for X-axis rotation
  const transformedX = nx * size;
  const transformedY = (ny * cos - nz * sin) * size;
  const transformedZ = (ny * sin + nz * cos) * size;

  // Apply perspective scaling
  const perspectiveScale = perspective / (perspective + transformedZ);

  return {
    x: transformedX * perspectiveScale,
    y: transformedY * perspectiveScale,
  };
}

/**
 * Generates CSS transform string from coordinates
 */
export function getTransformStyle(coords: { x: number; y: number }): string {
  return `translate(${coords.x}px, ${coords.y}px)`;
}

// Example usage:
// const playerPos = mapCoordinates(250, 300, 500);
// const style = getTransformStyle(playerPos);
// element.style.transform = style;
