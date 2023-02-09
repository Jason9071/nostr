import { relayInit, generatePrivateKey, getPublicKey, validateEvent, verifySignature, signEvent, getEventHash } from 'nostr-tools'

const App = () => {

  let sk = "633a0a0c573d674d5d23802f2a1ff18add2721e994a9001c88392176209058a4" // `sk` is a hex string
  let pk = getPublicKey(sk) // `pk` is a hex string

  const test = async () => {
    console.log("start")
    let relay = relayInit('wss://nostr-pub.wellorder.net')

    await relay.connect()
    relay.on('connect', () => {
      console.log(`connected to ${relay.url}`)
    })
    relay.on('error', () => {
      console.log(`failed to connect to ${relay.url}`)
    })

    let sub = relay.sub([
      {
        kinds: [1],
        authors: [pk]
      }
    ])

    const event = {
      kind: 1,
      created_at: Math.floor(Date.now() / 1000),
      tags: [],
      content: '你好 jason 小丸on9 ' + String(Math.floor(Date.now() / 1000)),
      pubkey: getPublicKey(sk)
    }
    event.id = getEventHash(event)
    event.sig = signEvent(event, sk)

    sub.on('event', event => {
      console.log('got event:', event)
    })

    event.id = getEventHash(event)
    event.sig = signEvent(event, sk)

    let pub = relay.publish(event)
    pub.on('ok', () => {
      console.log(`${relay.url} has accepted our event`)
    })
    pub.on('seen', () => {
      console.log(`we saw the event on ${relay.url}`)
    })
    pub.on('failed', reason => {
      console.log(`failed to publish to ${relay.url}: ${reason}`)
    })

    //await relay.close()
    console.log("end")
  }

  test()
  return (
    <>
      {sk}
      <br></br>
      {pk}
      <br></br>
    </>
  );
}

export default App;
