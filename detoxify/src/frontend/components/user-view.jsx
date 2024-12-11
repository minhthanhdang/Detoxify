import { invoke } from '@forge/bridge';
import React, { useEffect, useState } from 'react';

import { Heading, Text } from '@forge/react';
import { Comment } from './comment';

export const UserView = () => {

  const [accountId, setAccountId] = useState(null);
  const [toxicComments, setToxicComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingComments, setPendingComments] = useState([]);

  useEffect(() => {
    invoke('getCurrentUser')
      .then((res) => {
        console.log('Current user:', res);
        setAccountId(res.accountId);
      })
      .catch((err) => {
        console.error('Error while getting current user:', err);
      });
  }, [])

  useEffect(() => {
    if (!accountId) return;
    invoke('getUserPendingComments', { accountId })
      .then((res) => {
        console.log('User pending comments:', res);
        setPendingComments(res);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error while getting toxic comments:', err);
      });

    invoke('getUserConfirmedToxicComments', { accountId })
      .then((res) => {
        console.log('Confirmed toxic comments:', res);
        setToxicComments(res);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error while getting confirmed toxic comments:', err);
      });
  }, [accountId])



  return (
    <>
      <Heading as='h2'>Your status</Heading>

      {isLoading && <Text>Loading...</Text>}

      {!isLoading && ((toxicComments.length == 0 && pendingComments == 0)
        ? (
          <Text>
            Your comments are professional and positive! Keep up the good work!
          </Text>
        )
        : (
          <>
            <Text>You have {pendingComments.length} comments waiting for review.</Text>
            {!pendingComments == 0 && pendingComments.map((comment) => (
              <Comment pageId={comment.value.pageId} content={comment.value.content} />
            ))}
            <Text>You have made {toxicComments.length} toxic comments. Everyone has a bad day, but don't let it affects the workspace.</Text>
            {!toxicComments == 0 && toxicComments.map((comment) => (
              <Comment pageId={comment.value.pageId} content={comment.value.content} />
            ))}
          </>
        )
      )}
    </>
  )
}