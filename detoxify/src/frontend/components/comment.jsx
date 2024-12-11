
import { invoke } from "@forge/bridge"
import { Text, Box, xcss, Strong } from "@forge/react"
import React, { useEffect, useState } from "react"


const commentContainerStyles = xcss({
  backgroundColor: 'color.background.selected',
  padding: 'space.100',
  paddingLeft: 'space.150',
  paddingRight: 'space.150',
  margin: 'space.150',
  borderRadius: 'border.radius'
})

export const Comment = ({ pageId, content }) => {

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
      <Text>You commented: {content}</Text>
    </Box>  
  )
}