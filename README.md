<div align="center">
    <a href="https://blot.re">
        <img src="https://github.com/mattbierner/blotre/raw/master/documentation/readme-logo.png" width="280px" alt="Blot're" />
    </a>
</div>

Thin Javascript [Blot're][blotre] REST API wrapper.

**Supports**
* Unauthenticated queries.
* Authorization flows.
 * Exchange authorization code for creds.
 * Disposable client creation and redemption.
* Authorized requests.
 * Automatic exchanges refresh token if available.

## Examples
See the Blot're REST API documentation for more details on paramters

#### Basic Queries
All requests return [Bluebird promises][bluebird].

```
var Blotre = require('blotre');

// Create a basic client without creds or client info.
// Can also use new Blotre();
var client = Blotre.create();

// Get most recent streams
// All APIs return promises.
client.getStreams()
    .then(console.log)
    .catch(console.error);

// Lookup streams with "toaster" in their name.
client.getStreams({ query: "toaster"})
    .then(console.log)
    .catch(console.error);

// Lookup a stream by id.
client.getStream('5550fcc9300496217de54ebf')
    .then(console.log)
    .catch(console.error);
```

#### Using Existing Creds
You can manually supply client info and creds for requests that require authorization.
This client must be [registered on Blot're][blotre-register].

```
var Blotre = require('blotre');

// Create a basic client with our client information and some creds
var client = Blotre.create({
    client_id: YOUR_CLIENT_ID,
    client_secret: YOUR_CLIENT_SECRET,
    redirect_uri: YOUR_CLIENT_REDIRECT_URI
}, {
    access_token: 'MmFlNzY2NjktZTFkOC00YWE3LTg0OTYtOWRmNzFkMzAxNTE0',
    refresh_token: 'ZTk3ZDEwMTQtMGE5Mi00YzhlLTkyYWEtZjc4YjRlOTM2NjYw' // optional
});

// Make a request that requires authorization.
//
// If the access token is expires, this automatically attempts to exchange the
// refresh token for a new access token.
client.setStreamStatus('5550fcc9300496217de54ebf', { color: '#f0000f' })
    .then(console.log)
    .catch(console.error);
```

#### Authorization Codes
The client also provides basic support for [authorization code based authorization on Blotre](https://github.com/mattbierner/blotre/wiki/Authorization-Code).
After a user has authorized your application, this flow exchanges the
authorization code given to your server for new creds.

```
var Blotre = require('blotre');

// Create a basic client with our client info but without creds
var client = Blotre.create({
    client_id: "5558ef1330042320bd1ff8b2",
    client_secret: "Y2JkNzY3ZWMtODVlZS00NjM5LWEyNmUtNzJkOGY2NjdjYTNl",
    redirect_uri: "http://localhost:50000"
});

// Get the link that the user should visit for authorization.
test.getAuthorizationUrl(); // https://blot.rev0/oauth2/authorize?response_type=code&client_id=5558ef1330042320bd1ff8b2&redirect_uri=http%3A%2F%2Flocalhost%3A50000

// The user has visited the link now and our server gets the authorization code.
// Exchange if for a set of creds.
client.redeemAuthorizationCode('ZTdmMWMyYjAtYWNmZS00Y2FlLTg2YzAtMDUxZDc5NWYxYmI0')
    .then(console.log)
    .catch(console.error);

// This only gets the creds, to start using them you must update the client
client.redeemAuthorizationCode('ZTdmMWMyYjAtYWNmZS00Y2FlLTg2YzAtMDUxZDc5NWYxYmI0')
    .then(function(newCreds) {
        client.creds = newCreds;
    })
    .catch(console.error);
```

#### Disposable Clients
For simple applications, you can also create a [disposable][blotre-disposable] client.

```
var Blotre = require('blotre');

// Register a new client application.
// This returns a promise to a new Blot're client 
Blotre.createDisposable({
    "name": "Toa*",
    "blurb": "The Pintrest of toast."})
    .then(function(client) {
        // Now we have a client id and client secret.
        
        // We still don't have creds but we have an code that we can give to the user
        console.log(
            "Please visit https://blot.re/v0/oauth2/redeem/ and enter: ",
            client.client.code)
    });

// Later, after the user has authorized, exchange our client creds and the code
// for a token
client.redeemOnetimeCode('CVOrybcK')
    .then(function(newCreds) {
        client.creds = newCreds;
    })
    .catch(console.error);
```



[blotre]: https://blot.re
[blotre-register]: https://github.com/mattbierner/blotre/wiki/registering-a-client
[blotre-rest]: https://github.com/mattbierner/blotre/wiki/REST
[blotre-disposable]: https://github.com/mattbierner/blotre/wiki/single-use-clients

[bluebird]: https://github.com/petkaantonov/bluebird