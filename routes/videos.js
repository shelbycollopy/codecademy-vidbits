const router = require('express').Router();
const Video = require('../models/video');

router.get('/videos', async (req, res) => {
  const videos = await Video.find({});
  res.render('videos/index', { videos });
});

router.get('/videos/create', (req, res, next) => {
  res.render('videos/create');
});

router.get('/videos/:id', async (req, res, next) => {
  const video = await Video.findById(req.params.id);
  res.render('videos/show', { video });
});

router.get('/videos/:id/edit', async (req, res, next) => {
  const video = await Video.findById(req.params.id);
  res.render('videos/edit', { video });
});

router.post('/videos', async (req, res, next) => {

  const { title, description, url } = req.body;

  const newVideo = new Video({ title, description, url })
  newVideo.validateSync();

  if (newVideo.errors) {
    res.status(400).render('videos/create', { newVideo });
  } else {
    const video = await Video.create(newVideo);
    res.status(302).redirect(`videos/${video._id}`)
  }
});

router.post('/videos/:id/delete', async (req, res, next) => {
  await Video.deleteOne(req.params.id);
  res.redirect('/');
});

router.post('/videos/:id/updates', async (req, res, next) => {

  const { title, description, url } = req.body;

  const newVideo = new Video({ title, description, url })
  newVideo.validateSync();

  if (newVideo.errors) {
    res.status(400).render('videos/edit', { newVideo });
  } else {
    const video = await Video.updateOne(req.params.id, req.body);
    res.status(302).redirect(`videos/${video._id}`)
  }
});

module.exports = router;
