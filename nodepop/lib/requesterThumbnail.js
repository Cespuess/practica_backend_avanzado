const { Requester } = require('cote');

const requester = new Requester({ name: 'Thumbnail requester' });

function createThumbnail(filename) {
  const event = {
    type: 'create-Thumbnail',
    fileName: filename
  };

  requester.send(event, (result) => {
    console.log(`${result}: recibido`);
  });
}

module.exports = createThumbnail;
