const router = require('express').Router();
const Video = require('../models/video');


router.post('/videos', async (req, res, next) => {

  const { title, description, url } = req.body;
  const newVideo = new Video({ title, description, url })

  newVideo.validateSync();

  if (newVideo.errors) {
    res.status(400).render('error', { newVideo: newVideo })
  } else {
    const videoCreated =  await Video.create(newVideo);
    res.status(302).render('videos/show', { videoCreated: videoCreated });
  }

});

module.exports = router;
