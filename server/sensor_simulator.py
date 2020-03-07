import socket
import ssl
from ssl import SSLError

ip = '127.0.0.1'
port = 5001
data_to_send = 'datadatadata'


def connect_to_server(data_to_send, addr, port):
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(20)

    try:
        #wrapped_socket = ssl.wrap_socket(s, ssl_version=ssl.PROTOCOL_SSLv23, ciphers="ADH-AES256-SHA")
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


connect_to_server(data_to_send, ip, port)
