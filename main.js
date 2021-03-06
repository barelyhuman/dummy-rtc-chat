import Peer from 'peerjs';
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"


(function (namespace) {

  const sendButton = document.querySelector('#send-to-connection');
  const textValue = document.querySelector('#for-connection');

  let peer, conn;
  const allConnections = [];

  function main() {
    initPeer();

    if (window.location.hash) {
      setTimeout(() => {
        hashChangeListener();
      }, 1500);
    }

    namespace.addEventListener('hashchange', hashChangeListener);

  }

  function hashChangeListener() {
    const peerId = namespace.location.hash.replace('#', '');

    conn = peer.connect(peerId);

    conn.on('open', () => {

      showSuccessToast('Connected');


      conn.on('data', (data) => {
        renderDataFromConnection(data);
      });

    });

    conn.on('error', (err) => {
      showErrorToast(err);
    });

  }

  function renderMessage() {
    const fromConnection = document.querySelector('#from-connection');
    const divElem = document.createElement('div');
    divElem.classList.add('sent-message');
    divElem.innerHTML = textValue.value;
    fromConnection.appendChild(divElem);
  }

  function sendMessage(connectionHandler) {
    connectionHandler.send(textValue.value);
    setTimeout(() => {
      textValue.value = '';
    }, 50);
  }

  function renderDataFromConnection(data) {
    const fromConnection = document.querySelector('#from-connection');
    const preElem = document.createElement('pre');
    preElem.innerHTML = "  " + data;
    fromConnection.append(preElem);
  }

  function initPeer() {
    peer = new Peer();

    const wrapper = document.querySelector('#join-url-wrapper');
    if (window.location.hash) {
      wrapper.hidden = true;
    } else {
      wrapper.hidden = false;
    }

    peer.on('open', (id) => {

      const shareUrl = document.querySelector('#share-url');
      shareUrl.innerHTML = namespace.location.host + '/#' + id;

    });

    peer.on('connection', (connection) => {
      allConnections.push(connection);
      connection.on('open', () => {
        showSuccessToast('Friend Connected');
      });

      connection.on('data', (data) => {
        renderDataFromConnection(data);
      });
    });

    sendButton.addEventListener('click', () => {
      renderMessage();
      if (!allConnections.length && conn) {
        sendMessage(conn);
      } else {
        allConnections.forEach(item => {
          sendMessage(item);
        })
      }
    });


  }

  function showSuccessToast(message) {
    Toastify({
      text: message,
      duration: 3000,
      newWindow: true,
      close: true,
      gravity: "top",
      position: 'right',
      backgroundColor: "#008080",
    }).showToast();
  }

  function showErrorToast(message) {
    Toastify({
      text: "",
      duration: 3000,
      newWindow: true,
      close: true,
      gravity: "top",
      position: 'right',
      backgroundColor: "#B03060",
    }).showToast();
  }

  main();

})(window);
