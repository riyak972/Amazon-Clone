import { Router } from 'express';
import * as searchController from './search.controller';
import { cacheMiddleware } from '../../utils/cache';

const router = Router();

// /api/v1/search/suggestions?q=
router.get('/suggestions', cacheMiddleware('search_sugg', 120), searchController.getSearchSuggestions);

// /api/v1/search/?q=
router.get('/', cacheMiddleware('search_full', 300), searchController.getSearchResults);

export default router;
