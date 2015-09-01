# ChangeLog #

## 0.4.0 - September 1, 2015
* Added helpers for tag apis.
** `getTags`, `setTags`, `getTag`, `setTag`, `deleteTag`.
* Added helper for joining stream components together, `joinUri`.

## 0.3.0 - July 12, 2015
* Added `normalizeUri` to convert a uri into its normalized form.
* Added `getWebsocketUrl` to get the url for the websocket apis.
* Added `getRedeemUrl` to get the path where users can redeem onetime codes.

## 0.2.0 - July 4, 2015
* Support for Blot're 0.1.0.

## 0.1.2 - May 23, 2015
* Send auth headers on delete requests.

## 0.1.1 - May 19, 2015
* Use extend for config so only override paramters have to be provided.
* Correctly rethrow and extract exceptions.
* Fix redeem grabbing code from creds instead of client.

## 0.1.0 - May 19, 2015
* Fixed several bugs around disposable client creation.
* Allow passing in custom config options.
** Takes `host` and `protocol` to talk to different server (such as for local development).
** `onCredsChanged` is called when the credentials are updated.

## 0.0.0 - May 18, 2015
* Initial release.