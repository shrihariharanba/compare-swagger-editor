const SplashScreenSpinner = () => (
  <div
    className="swagger-editor__splash-screen-spinner"
    role="status"
    aria-live="polite"
    aria-label="Preparing your flight deck"
  >
    <span className="swagger-editor__splash-screen-spinner-orbit" aria-hidden="true">
      <span className="swagger-editor__splash-screen-spinner-ring" />
      <span className="swagger-editor__splash-screen-spinner-core" />
      <span className="swagger-editor__splash-screen-spinner-flight-path">
        <span className="swagger-editor__splash-screen-spinner-plane">
          <svg viewBox="0 0 64 64" focusable="false" aria-hidden="true">
            <path
              d="M56.7 29.5 35.4 21.8 26.7 4.4c-.6-1.3-2.4-1.4-3.2-.3l-3.9 6.1c-.6.9-.7 2.1-.4 3.2l3.4 10.1-11.7-4.2-4.7-6.1c-.7-.9-2.2-.8-2.8.2l-1.1 2c-.5.9-.4 2 .2 2.8l4.7 5.5-4.7 5.5c-.7.8-.8 1.9-.2 2.8l1.1 2c.6 1 2.1 1.1 2.8.2l4.7-6.1 11.7-4.2-3.4 10.1c-.4 1.1-.2 2.2.4 3.2l3.9 6.1c.8 1.2 2.6 1 3.2-.3l8.7-17.4 21.3-7.7c1.7-.6 1.7-3 0-3.6Z"
              fill="currentColor"
            />
          </svg>
        </span>
      </span>
    </span>
    <span className="swagger-editor__splash-screen-spinner-label">Preparing your flight deck</span>
  </div>
);

export default SplashScreenSpinner;
