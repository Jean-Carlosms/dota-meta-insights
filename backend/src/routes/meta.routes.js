import { Router } from 'express';
import { getCompetitiveMetaSourceInfo } from '../services/dataSources/competitiveMeta.source.js';
import { getGeneralMetaSourceInfo } from '../services/dataSources/generalMeta.source.js';

const router = Router();

router.get('/source-info', (req, res) => {
  res.json({
    activeSource: 'general',
    sources: {
      general: getGeneralMetaSourceInfo(),
      competitive_preview: getCompetitiveMetaSourceInfo()
    }
  });
});

export default router;
