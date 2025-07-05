import React from 'react';

/**
 * This component embeds NASA's "Eyes on the Solar System" interactive
 * visualization using an iframe.
 */
export function SolarSystem3D() {
  return (
    <div className="w-full h-full bg-black">
      <iframe
        src="https://eyes.nasa.gov/apps/orrery/#/home"
        title="NASA's Eyes on the Solar System"
        className="w-full h-full border-0"
        allowFullScreen
      />
    </div>
  );
}
