// @flow
import * as PAGES from 'constants/pages';
import * as ICONS from 'constants/icons';
import React from 'react';
import Icon from 'component/common/icon';
import Notification from 'component/notification';
import Button from 'component/button';
import { useHistory } from 'react-router';
// import { Menu, MenuList, MenuButton, MenuPopover, MenuItems, MenuItem } from '@reach/menu-button';

type Props = {
  unreadCount: number,
  fetching: boolean,
  notifications: ?Array<Notification>,
  doReadNotifications: () => void,
  user: ?User,
};

export default function NotificationHeaderButton(props: Props) {
  const { unreadCount } = props;

  if (unreadCount === 0) {
    return null;
  }

  return (
    <span className="notification__bubble">
      <span className="notification__count">{unreadCount}</span>
    </span>
  );

  // Below is disabled until scroll style issues are resolved
  //   return (
  //     <Menu>
  //       <MenuButton
  //         onClick={handleMenuClick}
  //         disabled={fetching}
  //         aria-label={__('Notifications')}
  //         title={__('Notifications')}
  //         className="header__navigation-item menu__title header__navigation-item--icon"
  //       >
  //         <Icon size={18} icon={ICONS.NOTIFICATION} aria-hidden />
  //         {unreadCount > 0 && <span className="notification__bubble">{unreadCount}</span>}
  //       </MenuButton>

  //       {notifications && notifications.length > 0 ? (
  //         <MenuList className="menu__list--header">
  //           {notifications.slice(0, 7).map((notification, index) => (
  //             <Notification menuButton key={notification.id} id={notification.id} notification={notification} />
  //           ))}

  //           <MenuItem className="menu__link" onSelect={() => push(`/$/${PAGES.NOTIFICATIONS}`)}>
  //             <Icon aria-hidden icon={ICONS.NOTIFICATION} />
  //             {__('View All')}
  //           </MenuItem>
  //         </MenuList>
  //       ) : (
  //         <MenuPopover>
  //           <div className="menu__list--header notifications__empty">No notifications yet.</div>
  //           {/* Below is needed because MenuPopover isn't meant to be used this way */}
  //           <MenuItems>
  //             <MenuItem disabled onSelect={() => {}} />
  //           </MenuItems>
  //         </MenuPopover>
  //       )}
  //     </Menu>
  //   );
}
