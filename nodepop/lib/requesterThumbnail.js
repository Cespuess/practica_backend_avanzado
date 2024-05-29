const { Requester } = require('cote');
const { Anuncio } = require('../models');

const requester = new Requester({ name: 'Thumbnail requester' });

function createThumbnail(filename, adId) {
  const event = {
    type: 'create-Thumbnail',
    fileName: filename
  };

  requester.send(event, async (error, result) => {
    try {
      if (error) {
        console.log('Problema al crear el thumbnail');
      } else {
        await Anuncio.findByIdAndUpdate(adId, { thumbFoto: result });
      }
    } catch (err) {
      console.log(err);
    }
  });
}

module.exports = createThumbnail;
