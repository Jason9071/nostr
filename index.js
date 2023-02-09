const { relayInit, generatePrivateKey, getPublicKey, validateEvent, verifySignature, signEvent, getEventHash } = require('nostr-tools')
const WebSocket = require('ws');
const sk = "633a0a0c573d674d5d23802f2a1ff18add2721e994a9001c88392176209058a4"
const pk = getPublicKey(sk) // `pk` is a hex string

console.log(sk)
console.log(pk)

const event = {
    kind: 1,
    created_at: Math.floor(Date.now() / 1000),
    tags: [],
    content: 'hello',
    pubkey: getPublicKey(sk)
}

event.id = getEventHash(event)
event.sig = signEvent(event, sk)

const ok = validateEvent(event)
const veryOk = verifySignature(event)

console.log(ok)

console.log(veryOk)

const main = async () => {
    let relay = relayInit('wss://nostr.developer.li')
    console.log(relay)
    await relay.connect(WebSocket)

    relay.on('connect', () => {
        console.log(`connected to ${relay.url}`)
    })
    relay.on('error', () => {
        console.log(`failed to connect to ${relay.url}`)
    })

    
    
}

main()