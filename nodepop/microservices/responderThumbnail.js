const { Responder } = require('cote');
const jimp = require('jimp');
const path = require('path');

const responder = new Responder({ name: 'Thumbnail creator' });

responder.on('create-Thumbnail', async (req, done) => {
  const originalFilePath = path.join(
    __dirname,
    '..',
    'public',
    'assets',
    'img',
    'ads',
    req.fileName
  );
  const modifiedFileName = `thumbnail-${req.fileName}`;
  const modifiedFilePath = path.join(
    __dirname,
    '..',
    'public',
    'assets',
    'img',
    'ads',
    modifiedFileName
  );

  const image = await jimp.read(originalFilePath);
  await image.cover(100, 100);
  await image.writeAsync(modifiedFilePath);
  done(null, modifiedFileName);
});
