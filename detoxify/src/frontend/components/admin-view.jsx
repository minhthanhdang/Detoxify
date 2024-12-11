import ForgeReconciler, { Text, Heading, SectionMessage, Box, TextField, Select, Button, List, ListItem, xcss, Inline, ModalTransition } from '@forge/react';
import React, { useEffect, useState } from 'react';
import { AddPageModal } from './add-page-modal';
import { invoke } from '@forge/bridge';
import { CommentReview } from './comment-review';
import { RemovePageModal } from './remove-page-modal';

export const AdminView = () => {

  const [includedPages, setIncludedPages] = useState(null);
  const [excludedPages, setExcludedPages] = useState(null);

  const [toxicComments, setToxicComments] = useState([]);
  const [refresh, setRefresh] = useState(0);

  const refreshComponent = () => setRefresh(refresh + 1);

  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const openEditModal = () => setIsEditOpen(true);
  const closeEditModal = () => setIsEditOpen(false);

  useEffect(() => {
    if (isOpen || isEditOpen) return;
    refreshState();
  }, [isOpen, isEditOpen]);


  const refreshState = () => {
    invoke('getIncludedPages')
      .then((res) => {
        setIncludedPages(res ? res : null);
      });

    invoke('getExcludedPages')
      .then((res) => {
        setExcludedPages(res ? res : null);
      });
  }

  console.log("Excluded pages ", excludedPages);
  console.log("Included pages ", includedPages);

  useEffect(() => {
    invoke('getAllToxicComments')
      .then((res) => {
        console.log('All toxic comments:', res);
        setToxicComments(res);
      })
      .catch((err) => {
        console.error('Error while getting all toxic comments:', err);
      });
  }, [refresh])

  return (
    <>
      <Box padding='space.250'>
        <Heading as='h2'>Protected page list </Heading>
        <List type="unordered">
          {(includedPages && includedPages.length != 0) ? includedPages.map((page) => <ListItem>{page.title}</ListItem>) : <Text>No protected pages</Text>}
        </List>
      </Box>  

      <Inline space="space.100" alignInline="end">
        <Button appearance='primary' onClick={openModal}>
          Add page
        </Button>
        <Button appearance='warning' onClick={openEditModal}>
          Edit
        </Button>
        <Button appearance='danger' onClick={() => {invoke('removeAllPages'); refreshState()}}>
          Remove all
        </Button>
      </Inline> 


      <Box padding='space.250'>
        <Heading as='h2'>Flagged & Pending Comments</Heading>
        {(refresh >=0 && toxicComments && toxicComments.length != 0) 
          ? toxicComments.map((comment) => 
            <CommentReview accountId={comment.value.accountId} pageId={comment.value.pageId} content={comment.value.content} commentIndex={comment.value.commentIndex} refreshCommentList={refreshComponent} />
          ) 
          : <Text>No comments need to be reviewed</Text>
        }
      </Box>  

      <ModalTransition>
        {isOpen && (
          <AddPageModal pages={excludedPages} closeModal={closeModal}/>
        )}
      </ModalTransition>
      <ModalTransition>
        {isEditOpen && (
          <RemovePageModal pages={includedPages} closeModal={closeEditModal}/>
        )}
      </ModalTransition>

    </>
  )
}