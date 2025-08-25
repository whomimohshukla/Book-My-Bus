import { Fragment, useContext } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { BellIcon } from '@heroicons/react/24/outline';
import dayjs from 'dayjs';
import { NotificationCtx } from '../../contexts/NotificationContext.jsx';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function NotificationBell() {
  const { items, markRead } = useContext(NotificationCtx);
  const unread = items.filter((n) => !n.read).length;

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="relative focus:outline-none">
        <BellIcon className="w-7 h-7 text-gray-600" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
            {unread}
          </span>
        )}
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-3 w-80 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black/5 focus:outline-none z-50">
          {items.length === 0 && (
            <div className="p-4 text-center text-gray-500 text-sm">No notifications</div>
          )}

          {items.map((n) => (
            <Menu.Item key={n._id}>
              {({ active }) => (
                <button
                  onClick={() => markRead(n._id)}
                  className={classNames(
                    'w-full text-left px-4 py-3 text-sm',
                    !n.read ? 'bg-gray-100' : '',
                    active ? 'bg-gray-50' : ''
                  )}
                >
                  <p className="font-medium text-gray-800">{n.title}</p>
                  <p className="text-xs text-gray-500">{dayjs(n.createdAt).fromNow()}</p>
                </button>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
