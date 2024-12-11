import Resolver from '@forge/resolver';
import { getPage, getPages } from './confluence-api';
import api, { storage, WhereConditions, route, FilterConditions } from '@forge/api';
import { isAdmin } from './storage';

const resolver = new Resolver();

////////////////////////////////////////
///////////// Common routes ////////////
////////////////////////////////////////
resolver.define('getPage', async ({payload, context}) => {
  console.log(payload);
  const page = await getPage(payload.pageId);
  return page;
});

resolver.define('getPages', async (req) => {
  console.log("Invoking getPages");
  const pages = await getPages();
  console.log("Fetched:", pages?.results?.length, "pages"); 
  return pages.results;
})

resolver.define('getCurrentUser', async ({payload, context}) => {
  const response = await api.asUser().requestConfluence(route`/wiki/rest/api/user/current`, {
    headers: {
      'Accept': 'application/json'
    }
  });
  if (!response.ok) {
    console.error(`Error while getting user: ${response.status} ${response.statusText}`);
    return;
  }
  const user = await response.json();
  console.log("Current User: ", user)

  return user;
})

////////////////////////////////////////
///////////// Admin routes /////////////
////////////////////////////////////////

resolver.define('getIncludedPages', async ({payload, context}) => {

  const adminId = context.accountId;
  const admin = await isAdmin(adminId);
  if (!admin) {
    return [];
  }
  
  console.log("Invoking getIncludedPages with payload: ", payload);

  const allPages = await getPages();
  const includedPageIds = await storage.get('includedPages');

  console.log("Included page IDs: ", includedPageIds);

  if (!includedPageIds || !allPages) {
    return [];
  }

  const pages = allPages.results.filter((page) => includedPageIds.includes(page.id));
  return pages;
})

resolver.define('addPages', async ({payload, context}) => {
  const adminId = context.accountId;
  const admin = await isAdmin(adminId);
  if (!admin) {
    return [];
  }
  console.log("Invoking addPages with payload: ", payload);
  const includedPages = await storage.get('includedPages');

  let newPages;
  if (!includedPages) {
    newPages = payload.pages;
  } else {
    newPages = [...includedPages, ...payload.pages];
  }
  await storage.set('includedPages', newPages);
  return;
})

resolver.define('removePages', async ({payload, context}) => {
  const adminId = context.accountId;
  const admin = await isAdmin(adminId);
  if (!admin) {
    return [];
  }
  console.log("Invoking removePages with payload: ", payload);
  const includedPages = await storage.get('includedPages');
  const newPages = includedPages.filter((page) => !payload.pages.includes(page));
  await storage.set('includedPages', newPages);
  return;
})

resolver.define('getExcludedPages', async ({payload, context}) => {
  const adminId = context.accountId;
  const admin = await isAdmin(adminId);
  if (!admin) {
    return [];
  }
  const allPages = await getPages();
  const temp = allPages?.results;

  if (!temp) {
    return [];
  }

  const includedPages = await storage.get('includedPages');

  if (!includedPages) {
    return temp;
  }

  const excludedPages = temp.filter((page) => !includedPages.includes(page.id));
  
  return excludedPages;
});


resolver.define('removeAllPages', async ({payload, context}) => {
  const adminId = context.accountId;
  const admin = await isAdmin(adminId);
  if (!admin) {
    return [];
  }
  await storage.set('includedPages', []);
  return;
})

resolver.define('getAllToxicComments', async ({payload, context}) => {
  const adminId = context.accountId;
  const admin = await isAdmin(adminId);
  if (!admin) {
    return [];
  }
  const allComments = await storage.entity('toxic-confluence-comment').query().index('confirmed').where(WhereConditions.equalsTo(false)).getMany();

  const results = allComments?.results;
  console.log("All toxic comments: ", results);

  return allComments.results;
})

resolver.define('approveComment', async ({payload, context}) => {
  const adminId = context.accountId;
  const admin = await isAdmin(adminId);
  if (!admin) {
    return [];
  }
  const commentIndex = payload.commentIndex;

  await storage.entity('toxic-confluence-comment').delete(commentIndex.toString());

  return;
})

resolver.define('warnUser', async ({payload, context}) => {
  const adminId = context.accountId;
  const admin = await isAdmin(adminId);
  if (!admin) {
    return [];
  }

  const commentIndex = payload.commentIndex;

  await storage.entity('toxic-confluence-comment').set(commentIndex.toString(), {
    commentIndex,
    accountId: payload.accountId,
    pageId: payload.pageId,
    content: payload.content,
    confirmed: true
  });

  return;

})


///////////////////////////////////////
///////////// User routes /////////////
///////////////////////////////////////

resolver.define('getUserPendingComments', async ({payload, context}) => {
  const accountId = payload.accountId;

  const allComments = await storage
    .entity('toxic-confluence-comment')
    .query()
    .index('accountId')
    .where(WhereConditions.equalsTo(accountId))
    .andFilter('confirmed', FilterConditions.equalsTo(false))
    .getMany();

  return allComments?.results;
})

resolver.define('getUserConfirmedToxicComments', async ({payload, context}) => {
  const accountId = payload.accountId;

  const allComments = await storage
    .entity('toxic-confluence-comment')
    .query()
    .index('accountId')
    .where(WhereConditions.equalsTo(accountId))
    .andFilter('confirmed', FilterConditions.equalsTo(true))
    .getMany();

  return allComments?.results;
})

resolver.define('isAdmin', async ({payload, context}) => {
  const accountId = context.accountId;

  const adminId = await storage.get('adminId');

  return !!adminId && !!accountId && adminId === accountId;
})

export const handler = resolver.getDefinitions();
