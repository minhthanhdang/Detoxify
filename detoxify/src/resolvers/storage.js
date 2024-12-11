import { storage } from '@forge/api';

export async function storeToxicComment ({
  accountId = '',
  pageId = '',
  content = '',
  confirmed = false
}) {

  let index = await storage.get('toxic-confluence-comment-current-index');
  console.log('Current index:', index);
  console.log('Type:', typeof index);

  if (!index) {
    await storage.set('toxic-confluence-comment-current-index', 0);
    index = 0;
  }

  const nextIndex = index + 1;

  await storage.entity('toxic-confluence-comment').set(nextIndex.toString(), {
    commentIndex: nextIndex,
    accountId,
    pageId,
    content,
    confirmed,
  })

  await storage.set('toxic-confluence-comment-current-index', nextIndex);

  console.log('Current index:', nextIndex);

}

export async function isAdmin(accountId) {
  const adminId = await storage.get('adminId');
  return !!adminId && !!accountId && adminId === accountId;
}