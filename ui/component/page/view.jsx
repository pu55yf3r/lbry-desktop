// @flow
import type { Node } from 'react';
import React, { Fragment } from 'react';
import classnames from 'classnames';
import SideNavigation from 'component/sideNavigation';
import Header from 'component/header';
import Footer from 'web/component/footer';
/* @if TARGET='app' */
import StatusBar from 'component/common/status-bar';
/* @endif */
import usePersistedState from 'effects/use-persisted-state';
import { useHistory } from 'react-router';
import { useIsMediumScreen } from 'effects/use-is-mobile';

export const MAIN_CLASS = 'main';
type Props = {
  children: Node | Array<Node>,
  className: ?string,
  autoUpdateDownloaded: boolean,
  isUpgradeAvailable: boolean,
  authPage: boolean,
  noHeader: boolean,
  noFooter: boolean,
  noSideNavigation: boolean,
  fullWidth: boolean,
  backout: {
    backLabel?: string,
    backNavDefault?: string,
    title: string,
    simpleTitle: string, // Just use the same value as `title` if `title` is already short (~< 10 chars), unless you have a better idea for title overlfow on mobile
  },
};

function Page(props: Props) {
  const {
    children,
    className,
    authPage = false,
    filePage = false,
    noHeader = false,
    noFooter = false,
    noSideNavigation = false,

    backout,
  } = props;
  const {
    location: { pathname },
  } = useHistory();
  const [sidebarOpen, setSidebarOpen] = usePersistedState('sidebar', true);
  const isMediumScreen = useIsMediumScreen();

  React.useEffect(() => {
    // Close the sidebar automatically when navigating to the file page
    const isOnFilePage = pathname !== '/' && !pathname.includes('/$/') && !pathname.startsWith('/@');
    if (isOnFilePage) {
      setSidebarOpen(false);
    }
  }, [pathname, setSidebarOpen]);

  React.useEffect(() => {
    if (isMediumScreen) {
      setSidebarOpen(false);
    }
  }, [isMediumScreen]);

  return (
    <Fragment>
      {!noHeader && (
        <Header authHeader={authPage} backout={backout} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      )}
      <div className={classnames('main-wrapper__inner', {})}>
        {!authPage && !noSideNavigation && <SideNavigation sidebarOpen={sidebarOpen} isMediumScreen={isMediumScreen} />}
        <main
          className={classnames(MAIN_CLASS, className, { 'main--full-width': authPage, 'main--file-page': filePage })}
        >
          {children}
        </main>
        {/* @if TARGET='app' */}
        <StatusBar />
        {/* @endif */}
      </div>
      {/* @if TARGET='web' */}
      {!noFooter && <Footer />}
      {/* @endif */}
    </Fragment>
  );
}

export default Page;
