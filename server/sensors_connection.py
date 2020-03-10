import socket
import thread
import ssl
from ssl import SSLError


class Singleton(type):
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super(Singleton, cls).__call__(*args, **kwargs)
        return cls._instances[cls]


class SensorConnectionHandler(object):
    __metaclass__ = Singleton

    def __init__(self):
        self.start_listening()

    def new_client(self, sock, addr):
            txt = sock.recv(1024)
            print ('Data received from: ' + str(addr) + ':\t' + txt)
#            process_data(txt)
            sock.send('ACK')
            sock.close()

    def start_listening(self):
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
#        s.settimeout(20)
        port = 5001
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

                print "Connection from: ", addr
                thread.start_new_thread(self.new_client, (c, addr))

        except SSLError:
            print SSLError
            wrapped_socket.close()
            raise

    def send_data_to_sensor(self, data_to_send, addr, port):
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
