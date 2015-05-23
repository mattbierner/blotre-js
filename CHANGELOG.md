# ChangeLog #

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