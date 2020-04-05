import socket
import thread
import ssl
from ssl import SSLError
import request_handler
from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket
import logging

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
file_handler = logging.FileHandler('logfile.log')
formatter = logging.Formatter('%(asctime)s :: %(levelname)s :: %(message)s')
file_handler.setFormatter(formatter)
logger.addHandler(file_handler)

class Singleton(type):
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super(Singleton, cls).__call__(*args, **kwargs)
        return cls._instances[cls]


class ApplicationConnectionHandler(object):
    __metaclass__ = Singleton

    def __init__(self):
        #self.start_listening()
        server = SimpleWebSocketServer('', 5002, WebSocketServer)
        server.serveforever()

    def new_client(self, sock, addr):
        txt = sock.recv(4096)
        print ('Data received from application: ' + str(addr) + ':\t' + txt)
        #            do here what the application want
        rh = request_handler.RequestHandler(txt)
        result = rh.result
        sock.send(result)
        sock.close()

    def start_listening(self):
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        #        s.settimeout(20)
        port = 5002
        host = socket.gethostname()

        try:
            #            wrapped_socket = ssl.wrap_socket(s, ssl_version=ssl.PROTOCOL_SSLv23, ciphers="ADH-AES256-SHA")
            wrapped_socket = ssl.wrap_socket(s,
                                             server_side=True,
                                             certfile="server.crt",
                                             keyfile="server.key")

            wrapped_socket.bind(('', port))
            wrapped_socket.listen(5)

            while True:
                c, addr = wrapped_socket.accept()

                print "Connection from application: ", addr
                thread.start_new_thread(self.new_client, (c, addr))

        except SSLError:
            print SSLError
            wrapped_socket.close()
            raise

    def send_data_to_app(self, data_to_send, addr, port):
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(20)

        try:
            # wrapped_socket = ssl.wrap_socket(s, ssl_version=ssl.PROTOCOL_SSLv23, ciphers="ADH-AES256-SHA")
            wrapped_socket = ssl.wrap_socket(s,
                                             ca_certs="server.crt",
                                             cert_reqs=ssl.CERT_REQUIRED)

            wrapped_socket.connect((addr, port))
            wrapped_socket.send(data_to_send)
            print(wrapped_socket.recv(1024))

            wrapped_socket.close()
        except SSLError:
            print SSLError
            wrapped_socket.close()
            raise


class WebSocketServer(WebSocket):

    def handleMessage(self):
        # echo message back to client
        self.new_client_websocket()

    def handleConnected(self):
        logger.debug(self.address, 'connected')

    def handleClose(self):
        logger.debug(self.address, 'closed')

    def new_client_websocket(self):
        logger.debug('Data received from website: %s' % self.data)

        rh = request_handler.RequestHandler(self.data)
        result = rh.result
        logger.debug("Sent response: {}".format(result))
        self.sendMessage(result)
