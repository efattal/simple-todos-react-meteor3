import { Avatar, Card, DarkThemeToggle, Dropdown, Flowbite, Navbar, Spinner, Tabs } from "flowbite-react";
import { useTracker } from 'meteor/react-meteor-data';
import React, { useEffect, useState } from 'react';
import { MdLogout } from "react-icons/md";
import { LoginForm } from './LoginForm';
import Repositories from './Repositories';
import Tasks from './Tasks';

const logout = () => Meteor.logout();

export const App = () => {
  const user = useTracker(() => Meteor.user({
    fields: {
      username: 1,
      profile: 1,
      services: 1
    }
  }));


  const [isGithub, setIsGithub] = useState(false)

  useEffect(() => {
    (async () => {
      setIsGithub(await Meteor.callAsync("isGithubUser"))
    })()
  }, [user])


  return <Flowbite>
    <div className="font-body">
      {user ? (
        <>
          <Navbar fluid rounded className="sticky top-0 bg-white shadow-md z-10">
            <Navbar.Brand>
              <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">To Do List</span>
            </Navbar.Brand>
            <div className="flex items-center gap-2">
              <DarkThemeToggle />
              <Dropdown
                label={<Avatar img={user.profile?.picture} rounded size="sm" className="w-8 h-8 rounded-full" />}
                arrowIcon={false}
                inline
              >
                <Dropdown.Header>
                  <span className="block text-sm">{user.profile?.name ?? user.username}</span>
                  {user.profile?.email && <span className="block truncate text-sm font-medium">{user.profile.email}</span>}
                </Dropdown.Header>
                <Dropdown.Item icon={MdLogout} onClick={() => Meteor.logout()}>Sign out</Dropdown.Item>
              </Dropdown>
            </div>
          </Navbar>


          <div className="md:w-1/2 mx-auto mt-4">
            <Card>
              <Tabs aria-label="Default tabs" variant="default">
                <Tabs.Item active title="Tasks">
                  <Tasks />
                </Tabs.Item>
                {isGithub && (
                  <Tabs.Item title="Repositories">
                    <Repositories />
                  </Tabs.Item>
                )}
              </Tabs>
            </Card>
          </div>
        </>
      ) : (
        user === null && !Meteor.loggingIn() ? (
          <LoginForm />
        )
          : (
            <Spinner size="xl" />
          )
      )}
    </div>
  </Flowbite>
}