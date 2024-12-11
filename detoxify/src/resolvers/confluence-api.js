import api, { route } from "@forge/api";


export async function getPage(contentId) {
  console.log("ContentID: ", contentId);
  return api
    .asUser()
    .requestConfluence(
      route`/wiki/api/v2/pages/${contentId}?body-format=storage`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    )
    .then((response) => {
      if (!response.ok) {
        const err = `Error while getting page with contentId ${contentId}: ${response.status} ${response.statusText}`;
        console.error(err);
        throw new Error(err);
      }
      return response.json();
    });
}


export async function getPages() {
  return api
    .asUser()
    .requestConfluence(
      route`/wiki/api/v2/pages`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    )
    .then((response) => {
      if (!response.ok) {
        const err = `Error while getting pages: ${response.status} ${response.statusText}`;
        console.error(err);
        throw new Error(err);
      }
      return response.json();
    });
}
