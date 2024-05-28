const { Responder } = require('cote');

const responder = new Responder({ name: 'Thumbnail creator' });

responder.on('create-Thumbnail', (req, done) => {
  console.log(req);
  done('ya está');
});
