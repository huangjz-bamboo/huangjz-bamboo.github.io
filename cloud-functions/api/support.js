import { getStore } from '@edgeone/pages-blob';
import { createSupportHandler } from '../../server/support.mjs';
export const onRequest = createSupportHandler(getStore);
