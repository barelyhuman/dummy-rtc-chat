import Peer from 'peerjs';


(function (namespace) {

  const sendButton = document.querySelector('#send-to-connection');
  const textValue = document.querySelector('#for-connection');

  let peer, conn;

  function main() {
    initPeer();

    if (window.location.hash) {
      hashChangeListener();
    }

    namespace.addEventListener('hashchange', hashChangeListener);

  }

  function hashChangeListener() {
    const peerId = namespace.location.hash.replace('#', '');

    conn = peer.connect(peerId);

    conn.on('open', () => {

      sendButton.addEventListener('click', () => {
        sendMessage(conn);
      });

      conn.on('data', (data) => {
        renderDataFromConnection(data);
      });

    });
  }

  function sendMessage(connectionHandler) {
    connectionHandler.send(textValue.value);
    textValue.value = '';
  }

  function renderDataFromConnection(data) {
    const fromConnection = document.querySelector('#from-connection');
    const preElem = document.createElement('pre');
    preElem.innerHTML = "  " + data;
    fromConnection.append(preElem);
  }

  function initPeer() {
    peer = new Peer();

    peer.on('open', (id) => {
      const shareUrl = document.querySelector('#share-url');
      shareUrl.innerHTML = namespace.location.host + '/#' + id;
    });

    peer.on('connection', (connection) => {
      connection.on('open', () => {
        console.log("Peer connected");
      });

      connection.on('data', (data) => {
        renderDataFromConnection(data);
      });

      sendButton.addEventListener('click', () => {
        sendMessage(connection);
      });

    });
  }

  main();

})(window);
