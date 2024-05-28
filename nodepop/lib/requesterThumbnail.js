const { Requester } = require('cote');

const requester = new Requester({ name: 'Thumbnail requester' });

const event = {
  type: 'create-Thumbnail',
  fileName: 'hola'
};

requester.send(event, (result) => {
  console.log(`${result}: recibido`);
});
