// Import the filesystem module
const fs = require('fs');

// Read IP addresses from ips.txt and split into an array by line
const ips = fs.readFileSync('ips.txt', 'utf-8').split(/\r?\n/);

// Check if an IPv4 address is public
function isPublicIPv4(ip) {
  return !(
    ip.startsWith('10.') || // Private range 10.0.0.0 – 10.255.255.255
    ip.startsWith('192.168.') || // Private range 192.168.0.0 – 192.168.255.255
    ip.startsWith('127.') || // Loopback
    ip.startsWith('169.254.') || // Link-local
    ip.startsWith('0.') || // Software
    ip.startsWith('255.255.255.255') || // Broadcast
    (ip.startsWith('172.') && +ip.split('.')[1] >= 16 && +ip.split('.')[1] <= 31) // Private range 172.16.0.0 – 172.31.255.255
  );
}

// Check if an IPv6 address is public
function isPublicIPv6(ip) {
  // Remove zone index if present (e.g., fe80::1%eth0)
  ip = ip.split('%')[0].trim().toLowerCase();
  if (ip === '' || ip === '::' || ip === '::1') return false; // unspecified or loopback
  if (ip.startsWith('fe80')) return false; // link-local
  if (ip.startsWith('ff')) return false; // multicast
  // Unique local: fc00::/7 (fc00:: - fdff:ffff:ffff:ffff:ffff:ffff:ffff:ffff)
  if (ip.startsWith('fc') || ip.startsWith('fd')) return false;
  return true;
}

// Determine if an IP address (IPv4 or IPv6) is public
function isPublicIP(ip) {
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(ip)) {
    // IPv4
    return isPublicIPv4(ip);
  } else if (ip.includes(':')) {
    // IPv6
    return isPublicIPv6(ip);
  }
  return false;
}

// Remove duplicates and empty lines from the IP list
const uniqueIps = Array.from(new Set(ips.map(ip => ip.trim()).filter(ip => ip !== '')));

// Filter only public IP addresses
const publicIps = uniqueIps.filter(ip => isPublicIP(ip));

// Write public IPs as plain text (one per line)
fs.writeFileSync('public_ips.txt', publicIps.join('\n'));

// Write public IPs as a JSON array
fs.writeFileSync('public_ips_array.json', JSON.stringify(publicIps, null, 2));

