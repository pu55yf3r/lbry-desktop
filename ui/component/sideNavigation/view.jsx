// @flow
import * as PAGES from 'constants/pages';
import * as ICONS from 'constants/icons';
import React from 'react';
import { useHistory } from 'react-router';
import Button from 'component/button';
import Tag from 'component/tag';
import StickyBox from 'react-sticky-box/dist/esnext';
import classnames from 'classnames';
import NotificationBubble from 'component/notificationBubble';

const ESCAPE_KEY_CODE = 27;
const BACKSLASH_KEY_CODE = 220;
const TOP_LEVEL_LINKS = [
  {
    label: __('Home'),
    navigate: `/`,
    icon: ICONS.HOME,
  },
  {
    label: __('Following'),
    navigate: `/$/${PAGES.CHANNELS_FOLLOWING}`,
    icon: ICONS.SUBSCRIBE,
    requiresAuth: !IS_WEB,
  },
  {
    label: __('Notifications'),
    navigate: `/$/${PAGES.NOTIFICATIONS}`,
    icon: ICONS.NOTIFICATION,
    requiresAuth: !IS_WEB,
    extra: <NotificationBubble />,
  },

  {
    label: __('Your Tags'),
    navigate: `/$/${PAGES.TAGS_FOLLOWING}`,
    icon: ICONS.TAG,
    requiresAuth: !IS_WEB,
  },
  {
    label: __('Discover'),
    navigate: `/$/${PAGES.DISCOVER}`,
    icon: ICONS.DISCOVER,
  },
  {
    label: __('Purchased'),
    navigate: `/$/${PAGES.LIBRARY}`,
    icon: ICONS.PURCHASED,
  },
];

type Props = {
  subscriptions: Array<Subscription>,
  followedTags: Array<Tag>,
  email: ?string,
  uploadCount: number,
  sticky: boolean,
  expanded: boolean,
  doSignOut: () => void,
  location: { pathname: string },
  purchaseSuccess: boolean,
  doClearPurchasedUriSuccess: () => void,
};

function SideNavigation(props: Props) {
  const {
    subscriptions,
    followedTags,
    uploadCount,
    doSignOut,
    email,
    sticky = true,
    expanded = false,
    purchaseSuccess,
    doClearPurchasedUriSuccess,
    sidebarOpen,
    isMediumScreen,
    setSidebarOpen,
    isOnFilePage,
    unreadCount,
  } = props;
  const {
    location: { pathname },
  } = useHistory();

  const isAuthenticated = Boolean(email);
  const [pulseLibrary, setPulseLibrary] = React.useState(false);
  const isPersonalized = !IS_WEB || isAuthenticated;
  const isAbsolute = isOnFilePage || isMediumScreen;

  React.useEffect(() => {
    if (purchaseSuccess) {
      setPulseLibrary(true);

      let timeout = setTimeout(() => {
        setPulseLibrary(false);
        doClearPurchasedUriSuccess();
      }, 2500);

      return () => clearTimeout(timeout);
    }
  }, [setPulseLibrary, purchaseSuccess, doClearPurchasedUriSuccess]);

  React.useEffect(() => {
    function handleKeydown(e: SyntheticKeyboardEvent<*>) {
      if (e.keyCode === ESCAPE_KEY_CODE && isAbsolute) {
        setSidebarOpen(false);
      } else if (e.keyCode === BACKSLASH_KEY_CODE) {
        const hasActiveInput = document.querySelector('input:focus');
        if (!hasActiveInput) {
          setSidebarOpen(!sidebarOpen);
        }
      }
    }

    window.addEventListener('keydown', handleKeydown);

    return () => window.removeEventListener('keydown', handleKeydown);
  }, [sidebarOpen, setSidebarOpen, isAbsolute]);

  const Wrapper = ({ children }: any) =>
    sticky && !isOnFilePage && !isMediumScreen ? (
      <StickyBox offsetTop={100} offsetBottom={20}>
        {children}
      </StickyBox>
    ) : (
      children
    );

  return (
    <Wrapper>
      {!isOnFilePage && (
        <nav className={classnames('navigation', { 'navigation--huh': !sidebarOpen || isMediumScreen })}>
          <ul className={classnames('navigation-links--relative', { 'navigation-links--huh': !sidebarOpen })}>
            {TOP_LEVEL_LINKS.map(linkProps => (
              <li key={linkProps.navigate}>
                <Button
                  {...linkProps}
                  icon={pulseLibrary && linkProps.icon === ICONS.LIBRARY ? ICONS.PURCHASED : linkProps.icon}
                  className={classnames('navigation-link', {
                    'navigation-link--pulse': linkProps.icon === ICONS.LIBRARY && pulseLibrary,
                    'navigation-link--extra': linkProps.icon === ICONS.NOTIFICATION && unreadCount > 0,
                  })}
                  activeClass="navigation-link--active"
                />
                {linkProps.extra}
              </li>
            ))}
          </ul>

          {sidebarOpen && isPersonalized && subscriptions && subscriptions.length > 0 && (
            <ul className="navigation__secondary navigation-links--relative navigation-links--small">
              {subscriptions.map(({ uri, channelName }, index) => (
                <li key={uri} className="navigation-link__wrapper">
                  <Button
                    navigate={uri}
                    label={channelName}
                    className="navigation-link"
                    activeClass="navigation-link--active"
                  />
                </li>
              ))}
            </ul>
          )}
        </nav>
      )}

      {(isOnFilePage || isMediumScreen) && sidebarOpen && (
        <>
          <nav className={classnames('navigation--filepage')}>
            <ul className="navigation-links--absolute">
              {TOP_LEVEL_LINKS.map(linkProps => (
                <li key={linkProps.navigate}>
                  <Button
                    {...linkProps}
                    icon={pulseLibrary && linkProps.icon === ICONS.LIBRARY ? ICONS.PURCHASED : linkProps.icon}
                    className={classnames('navigation-link', {
                      'navigation-link--pulse': linkProps.icon === ICONS.LIBRARY && pulseLibrary,
                      'navigation-link--extra': linkProps.icon === ICONS.NOTIFICATION && unreadCount > 0,
                    })}
                    activeClass="navigation-link--active"
                  />
                  {linkProps.extra}
                </li>
              ))}
            </ul>
            {isPersonalized && subscriptions && subscriptions.length > 0 && (
              <ul className="navigation__secondary navigation-links--small">
                {subscriptions.map(({ uri, channelName }, index) => (
                  <li key={uri} className="navigation-link__wrapper">
                    <Button
                      navigate={uri}
                      label={channelName}
                      className="navigation-link"
                      activeClass="navigation-link--active"
                    />
                  </li>
                ))}
              </ul>
            )}
          </nav>
          <div className="navigation__overlay" onClick={() => setSidebarOpen(false)} />
        </>
      )}
    </Wrapper>
  );
}

export default SideNavigation;

/* <ul className="navigation-links">
  {[
	{
	  ...(expanded && !isAuthenticated ? { ...buildLink(PAGES.AUTH, __('Sign Up'), ICONS.SIGN_UP) } : {}),
	},
	{
	  ...(expanded && !isAuthenticated
		? { ...buildLink(PAGES.AUTH_SIGNIN, __('Sign In'), ICONS.SIGN_IN) }
		: {}),
	},
	{
	  ...buildLink('/', __('Home'), ICONS.HOME, null, null, true),
	},
	{
	  ...buildLink(
		PAGES.CHANNELS_FOLLOWING,
		__('Following'),
		ICONS.SUBSCRIBE,
		null,
		requireAuthOnPersonalizedActions
	  ),
	},
	{
	  ...buildLink(PAGES.TAGS_FOLLOWING, __('Your Tags'), ICONS.TAG, null, requireAuthOnPersonalizedActions),
	},
	{
	  ...buildLink(PAGES.DISCOVER, __('All Content'), ICONS.DISCOVER),
	},
	{
	  ...buildLink(PAGES.LIBRARY, IS_WEB ? __('Purchased') : __('Library'), ICONS.LIBRARY),
	},
	// @if TARGET='web'
	{
	  ...(PINNED_URI_1
		? { ...buildLink(`${PINNED_URI_1}`, `${PINNED_LABEL_1}`, ICONS.PINNED, null, null, true) }
		: {}),
	},
	{
	  ...(PINNED_URI_2
		? { ...buildLink(`${PINNED_URI_2}`, `${PINNED_LABEL_2}`, ICONS.PINNED, null, null, true) }
		: {}),
	},
	// @endif
	{
	  ...(expanded ? { ...buildLink(PAGES.SETTINGS, __('Settings'), ICONS.SETTINGS) } : {}),
	},
  ].map(
	linkProps =>
	  linkProps.navigate && (
		<li key={linkProps.navigate}>
		  <Button
			{...linkProps}
			icon={pulseLibrary && linkProps.icon === ICONS.LIBRARY ? ICONS.PURCHASED : linkProps.icon}
			className={classnames('navigation-link', {
			  'navigation-link--pulse': linkProps.icon === ICONS.LIBRARY && pulseLibrary,
			})}
			activeClass="navigation-link--active"
		  />
		</li>
	  )
  )}

  {expanded &&
	isPersonalized &&
	[
	  {
		...buildLink(PAGES.CHANNELS, __('Channels'), ICONS.CHANNEL),
	  },
	  {
		...buildLink(
		  PAGES.UPLOADS,
		  uploadCount ? (
			<span>
			  {__('Uploads')}
			  <Spinner type="small" />
			</span>
		  ) : (
			__('Uploads')
		  ),
		  ICONS.PUBLISH
		),
	  },
	  {
		...buildLink(PAGES.CREATOR_DASHBOARD, __('Creator Analytics'), ICONS.ANALYTICS),
	  },
	  {
		...buildLink(PAGES.WALLET, __('Wallet'), ICONS.WALLET),
	  },
	  {
		...buildLink(PAGES.REWARDS, __('Rewards'), ICONS.REWARDS),
	  },
	  {
		...buildLink(PAGES.INVITE, __('Invites'), ICONS.INVITE),
	  },
	  {
		...buildLink(PAGES.UPLOAD, __('Upload'), ICONS.PUBLISH),
	  },
	  {
		...buildLink(PAGES.HELP, __('Help'), ICONS.HELP),
	  },
	  {
		...(isAuthenticated ? { ...buildLink(PAGES.AUTH, __('Sign Out'), ICONS.SIGN_OUT, doSignOut) } : {}),
	  },
	].map(
	  linkProps =>
		Object.keys(linkProps).length > 0 &&
		linkProps && (
		  <li key={linkProps.navigate}>
			<Button {...linkProps} className="navigation-link" activeClass="navigation-link--active" />
		  </li>
		)
	)}
</ul>

{isPersonalized && subscriptions && subscriptions.length > 0 && (
  <ul className="navigation__secondary navigation-links--small">
	{subscriptions.map(({ uri, channelName }, index) => (
	  <li key={uri} className="navigation-link__wrapper">
		<Button
		  navigate={uri}
		  label={channelName}
		  className="navigation-link"
		  activeClass="navigation-link--active"
		/>
	  </li>
	))}
  </ul>
)}
*/
