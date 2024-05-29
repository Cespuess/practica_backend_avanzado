const { Requester } = require('cote');
const { Anuncio } = require('../models');

const requester = new Requester({ name: 'Thumbnail requester' });

function createThumbnail(filename, adId) {
  const event = {
    type: 'create-Thumbnail',
    fileName: filename
  };

  requester.send(event, async (result) => {
    await Anuncio.findByIdAndUpdate(adId, { thumbFoto: result });
  });
}

module.exports = createThumbnail;
