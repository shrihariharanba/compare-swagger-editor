import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const FADE_OUT_DURATION = 300;
const splashLogo = `${process.env.PUBLIC_URL ?? ''}/static/media/splash-screen/logo.svg`;

const SplashScreen = ({ isOpen = true, version, getComponent }) => {
  const { PACKAGE_VERSION } = buildInfo; // eslint-disable-line no-undef
  const SplashScreenSpinner = getComponent('SplashScreenSpinner');
  const [isHidden, setHidden] = useState(!isOpen);

  useEffect(() => {
    if (isOpen) {
      setHidden(false);
      return undefined;
    }

    const timeoutId = globalThis.setTimeout(() => {
      setHidden(true);
    }, FADE_OUT_DURATION);

    return () => {
      globalThis.clearTimeout(timeoutId);
    };
  }, [isOpen]);

  const handleTransitionEnd = () => {
    if (!isOpen) {
      setHidden(true);
    }
  };

  return (
    <div
      className={classNames('swagger-editor__splash-screen', {
        'swagger-editor__splash-screen--fade-out': !isOpen,
        'swagger-editor__splash-screen--hidden': isHidden,
      })}
      onTransitionEnd={handleTransitionEnd}
    >
      <figure className="swagger-editor__splash-screen-figure">
        <img width="100%" src={splashLogo} alt="Emirates API Studio" />
        <figcaption>{version ?? PACKAGE_VERSION}</figcaption>
        <SplashScreenSpinner />
      </figure>
    </div>
  );
};

SplashScreen.propTypes = {
  isOpen: PropTypes.bool,
  version: PropTypes.string,
  getComponent: PropTypes.func.isRequired,
};

export default SplashScreen;
