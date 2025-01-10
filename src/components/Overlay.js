export function Overlay({
  isPostProcessingEnabled,
  setIsPostProcessingEnabled,
}) {
  return (
    <div className="overlay">
      <header>
        <h1>
          React Three Fiber <span>WebGPU</span>
        </h1>
        <p>
          This is a demo of React Three Fiber using post processing with threejs
          and WebGPU, featuring Screen Space Reflections.
        </p>
      </header>
      <footer>
        <button
          onClick={() => setIsPostProcessingEnabled(!isPostProcessingEnabled)}
        >
          {isPostProcessingEnabled ? "Disable" : "Enable"} Post Processing
        </button>
        <a href="https://github.com/ektogamat/r3f-webgpu-starter" download className="download-button">
          <SvgIcon />
        </a>
      </footer>
    </div>
  );
}


const SvgIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="white"
  >
    <path
      d="m20.59 12-3.3-3.3a1 1 0 1 1 1.42-1.4l4 4a1 1 0 0 1 0 1.4l-4 4a1 1 0 0 1-1.42-1.4zM3.4 12l3.3 3.3a1 1 0 0 1-1.42 1.4l-4-4a1 1 0 0 1 0-1.4l4-4A1 1 0 0 1 6.7 8.7zm7.56 8.24a1 1 0 0 1-1.94-.48l4-16a1 1 0 1 1 1.94.48z"
      className="heroicon-ui"
    ></path>
  </svg>
);