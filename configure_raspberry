import subprocess
import os

apps_list = ['dnsmasq','hostapd']
dns_abs_path = os.path.join('/etc', 'dnsmasq.conf')
hostap_abs_path = os.path.join('/etc', 'hostapd', 'hostapd.conf')
dhcpcd_abs_path = os.path.join('/etc', 'dhcpcd.conf')

DNSMASQ_CONFIG = """interface=wlan0      # Use the require wireless interface - usually wlan0
                 dhcp-range=192.168.4.2,192.168.4.20,255.255.255.0,24h"""

DHCPCD_CONFIG = """interface wlan0
                 static ip_address=192.168.4.1/24
                 nohook wpa_supplicant"""

HOSTAPD_CONFIG = """interface=wlan0
                    driver=nl80211
                    ssid=NameOfNetwork
                    hw_mode=g
                    channel=7
                    wmm_enabled=0
                    macaddr_acl=0
                    auth_algs=1
                    ignore_broadcast_ssid=0
                    wpa=2
                    wpa_passphrase=AardvarkBadgerHedgehog
                    wpa_key_mgmt=WPA-PSK
                    wpa_pairwise=TKIP
                    rsn_pairwise=CCMP"""

def backup_file(abs_path):
    try:
        proc = subprocess.Popen(['sudo', 'mv', abs_path, "{}.ori".format(abs_path)],
                                    stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        o, e = proc.communicate()
    except:
        print(e.decode('ascii'))

def install_apps(apps_list):
    try:
        for app in apps_list:
            proc = subprocess.Popen(['sudo', 'apt', 'install', app],
                                    stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        o, e = proc.communicate()
    except:
        print(e.decode('ascii'))

def turn_services(state, services_list):
    try:
        for app in services_list:
            proc = subprocess.Popen(['sudo', 'systemctl', state, app],
                                    stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        o, e = proc.communicate()
    except:
        print(e.decode('ascii'))

def append_configuration(abs_path, config):
    if os.path.exists(abs_path):
        print('{} already exists.'.format(abs_path))
    else:
        try:
            with open(abs_path, 'a') as fh:
                fh.write(config)
        except:
            print("Cannot write to a file")

def uncomment_line(line, abs_path):
    if os.path.exists(abs_path):
        print('{} already exists.'.format(abs_path))
    else:
        try:
            with open(abs_path, 'a') as fh:
                fh.write(config)
        except:
            print("Cannot write to a file")

def masquerade_config():
    try:
        proc = subprocess.Popen(['sudo', 'iptables', '-t', 'nat', '-A', 'POSTROUTING', '-o', 'eth0', '-j', 'MASQUERADE'],
                                    stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        o, e = proc.communicate()
        proc = subprocess.Popen(['sudo', 'sh', '-c', 'iptables-save > /etc/iptables.ipv4.nat'],stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        o, e = proc.communicate()
        
    except:
        print(e.decode('ascii'))


def reboot():
    proc = subprocess.Popen(['sudo', 'reboot'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)

install_required_apps(apps_list)
turn_services('stop', apps_list)

append_configuration(dhcpcd_abs_path, DHCPCD_CONFIG)
turn_services('restart', ['dhcpcd'])

backup_file(dns_abs_path)
append_configuration(dns_abs_path, DNSMASQ_CONFIG)
turn_services('start', 'dnsmasq')
        
append_configuration(hostap_abs_path, HOSTAPD_CONFIG)
turn_services('unmask', 'hostapd')
turn_services('enable', 'hostapd')
turn_services('start', 'hostapd')
        
masquerade_config()
reboot()
