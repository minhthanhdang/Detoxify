import Resolver from '@forge/resolver';
import { getPage, getPages } from './confluence-api';
import api, { storage, WhereConditions, route } from '@forge/api';

const resolver = new Resolver();

resolver.define('setAppSettings', async ({ payload, context }) => {
  console.log('Setting app settings:', payload.adminId);
  const adminId = payload.adminId

  if (!adminId) {
    throw new Error('Admin ID is required');
  }

  await storage.set('adminId', adminId);
  console.log("success")

  return;
});

export const confluenceGlobalSettingsHandler = resolver.getDefinitions();