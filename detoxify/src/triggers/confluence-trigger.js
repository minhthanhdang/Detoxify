
import api, { route, storage } from "@forge/api";
import { invokeLambda } from '../resolvers/external-api';
import { storeToxicComment } from "../resolvers/storage";
import { stripHTMLAndEmojis } from "../resolvers/helper";


export async function confluenceTrigger(event, context) {
  const commentId = event.content.id;
  const commentType = event.content.extensions.location == "inline" ? "inline-comments" : "footer-comments";
  const pageId = event.content.container.id;

  const protectedPageIds = await storage.get('includedPages');
  if (!protectedPageIds || !protectedPageIds.includes(pageId)) {
    console.log(`Page ${pageId} is not protected`);
    return;
  }

  console.log(`Comment ID: ${commentId}`);
  console.log(`Comment Type: ${commentType}`);
  const response = await checkComment(commentId, commentType);


  console.log(`Response: ${JSON.stringify(response)}`);
}

async function checkComment(commentId, commentType) {

  const requestUrl = route`/wiki/api/v2/${commentType}/${commentId}?body-format=storage`;

  // Use the Forge Runtime API to fetch data from an HTTP server using your (the app developer) Authorization header
  let response = await api.asApp().requestConfluence(requestUrl, {
    headers: {
      "Accept": "application/json"
    },
  });

  // Error checking: the Confluence comment Rest API returns a 200 if the request is successful
  if (response.status !== 200) {
    console.log(response.status);
    throw `Unable to check comment ${commentId} Status: ${response.status}.`;
  }

  const response_json = await response.json();
  console.log(response_json);
  
  const content = response_json.body.storage.value;
  const strippedContent = stripHTMLAndEmojis(content);

  const validateValue = await invokeLambda({
    content: strippedContent,
  })

  let isHateSpeech = false;

  if (validateValue?.result == "toxic") {

    isHateSpeech = true;
    console.log("Toxic comment detected");
    await storeToxicComment({
      accountId: response_json.version.authorId,
      pageId: response_json.pageId,
      content: strippedContent,
      confirmed: false,
    })
    await deleteComment(commentId, commentType);

  } else if (validateValue?.result == "not toxic") {
    isHateSpeech = false;
    console.log("Not toxic");
  } else {
    console.log("Error in detecting toxic comment");
  }
  
  return isHateSpeech;
}


async function deleteComment(commentId, commentType) {
  const requestUrl = route`/wiki/api/v2/${commentType}/${commentId}`;
  return api
    .asApp()
    .requestConfluence(requestUrl, {
      method: "DELETE",
    })
    .then((response) => {
      if (!response.ok) {
        const err = `Error while deleting comment ${commentId}: ${response.status} ${response.statusText}`;
        console.error(err);
        throw new Error(err);
      }
    });
}