import keypair from "keypair";
import nodeRSA from "node-rsa";

// Define the public and private keys
const privateKey = `-----BEGIN RSA PRIVATE KEY-----
    MIIBOwIBAAJBAMvK1LJ7bwihkocQQnx4i95eN5Rj1pAyfGhPnDEz2pHx/MFmYEGbGkP5LO3J
    Yjm3ilA8v/6qvbe0a79NS+TSbVkCAwEAAQJAL/5CfQ4IphW29kvj/IA/IE079ZxViXv6RG6L
    MCMwFDJmuRszrk4uXWtOXf8eoqr8SgoLgjC2UYFUz2ctFpV2oQIhAP+1c5wCbLVNU1ljbIoe
    M1F5kIVyVqL0ahPmZQJVdy4lAiEAzAY+Y57bHiUHoBmUzCKns6nAEu9hiAhlikrCVCV1GiUC
    IAGogpRra5sNYlH9FBIdOgX4PNiwsiEiZqG0Z8lJFpnFAiEAw0Uyj1xqcbaVTslNHfgJNC7C
    9ByC55TJwot85NaY9rUCIQCBb0F9E+yEYqftDhUulpJjenUQFmSYKnxDpdf+sJZsoQ==
    -----END RSA PRIVATE KEY-----`;

const pubKey = `-----BEGIN RSA PUBLIC KEY-----
    MEgCQQDLytSye28IoZKHEEJ8eIveXjeUY9aQMnxoT5wxM9qR8fzBZmBBmxpD+SztyWI5t4pQ
    PL/+qr23tGu/TUvk0m1ZAgMBAAE=
    -----END RSA PUBLIC KEY-----`;

// Function to encrypt a message
export function encryptMessage(text) {
    const cipher = new nodeRSA({ b: 512 });
    cipher.importKey(pubKey, "pkcs1-public");
    const encrypted = cipher.encrypt(text, "base64");
    return encrypted;
}

// Function to decrypt a message
export function decryptMessage(encryptedText) {

    const decipher = new nodeRSA(privateKey, "pkcs1");
    const decrypted = decipher.decrypt(encryptedText, "utf8");
    return decrypted;
}

// Example usage
// const text = { email: "djvndfkjsn@mdg/sdfsv", password: 'sfjndkjfndsfn' };
// const encrypted = encryptMessage(text);

// const decrypted = decryptMessage("QaBNK5xNSXwr3jif3R+ZNht3bFUFnIvOQfofn9kCuEjcHH6PyVfYQe+LjCZ2EHuKezN1vOEPlJ85IG031jJGaRmHc7uowa7+hwd6ByNzoY2hebK0Bvhivpqxvg/l2vQDeNZg9RpVCx291dFTfysuk5At48uiGkk/sAEkcZSufXRCI1xejahq3e8tYOfswJDKGiF5yUVXGps3oni33V4oO3feR1Z0FSilbugOtOOWwUEhSeXHlkTaEem+WLliWFjjUGfQf8oS9H2Wu9X459uwcoUbJ3dxEZBlAb7zzl/KrR0TKXO1PPH3hWQSn2Yl4OlEUbifwOqqAJ9c0G8i5uOOnHkI4jDAB8irB3TMNLwy99k3C8uASxRNP9pv3m/nXYzEEz7OyCJDWHiX8+bws+85voDs3aC5viI4dW+b/nccqFM=");
