import React, { useEffect, useState } from 'react';
import ForgeReconciler, { Text, Heading, SectionMessage, Box, xcss, Inline } from '@forge/react';

import { UserView } from '../components/user-view';
import { AdminView } from '../components/admin-view';
import { invoke } from '@forge/bridge';

const appContainerStyles = xcss({
  width: '640px'
})


const App = () => {

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    invoke('isAdmin')
      .then((res) => {
        setIsAdmin(res);
        console.log('Is admin:', res);
      })
      .catch((err) => {
        console.error('Error while checking if user is admin:', err);
      });
  }, [])

  return (
    <>
      <Inline alignInline="center">
        <Box xcss={appContainerStyles}>
          <Box padding='space.250'>
            <Heading as='h1'>Detoxify for Confluence</Heading>
          </Box>
          <SectionMessage title='Detoxify eliminates toxicity from the workspace.'>
            Be mindful of what you say. Keep your comments professional and positive.
          </SectionMessage>

          {isAdmin && 
            <AdminView />
          }

          <Box padding='space.250'>
            <UserView />
          </Box>
          
        </Box>
      </Inline>
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
