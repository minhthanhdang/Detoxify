
import { invoke } from "@forge/bridge"
import { Text, Box, xcss, Strong, User, Inline, Button } from "@forge/react"
import React, { useEffect, useState } from "react"


const commentContainerStyles = xcss({
  backgroundColor: 'color.background.selected',
  padding: 'space.100',
  paddingLeft: 'space.150',
  paddingRight: 'space.150',
  margin: 'space.150',
  borderRadius: 'border.radius'
})

const userStyle = xcss({
  paddingTop: 'space.150',
})


export const CommentReview = ({ commentIndex, accountId, pageId, content, refreshCommentList }) => {

  const [page, setPage] = useState(null);

  useEffect(() => {
    if (!pageId) return;
    invoke('getPage', { pageId })
      .then((res) => {
        setPage(res);
      })
      .catch((err) => {
        console.error('Error while getting page:', err);
      });
  }, [pageId, content])

  return (
    <Box xcss={commentContainerStyles}>
      <Text><Strong>In page {page?.title}</Strong></Text>
      <Inline alignBlock="center">
        <User accountId={accountId} /> 
          commented:
      </Inline>
      <Inline><Text>{content}</Text></Inline>
      <Inline alignInline="end" space="space.100">
        <Button appearance="primary" onClick={() => {
          invoke('approveComment', {
            commentIndex: commentIndex
          });
          refreshCommentList();
        }}>
          Not toxic
        </Button>
        <Button appearance="danger" onClick={() => {
          invoke('warnUser', {
            commentIndex,
            accountId,
            pageId,
            content
          });
          refreshCommentList();
        }}>
          Warn User
        </Button>
      </Inline>
    </Box>  
  )
}