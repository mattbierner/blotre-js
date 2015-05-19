/*
 * THIS FILE IS AUTO GENERATED FROM 'lib/index.kep'
 * DO NOT EDIT
*/
"use strict";
var request = require("request"),
    rp = require("request-promise"),
    extend = require("extend"),
    url = require("url"),
    Blotre, CONF = ({
        protocol: "http",
        host: "localhost:9000"
    }),
    getUrl = (function(options) {
        return url.format(extend(CONF, options));
    }),
    isExpiredResponse = (function(response) {
        var challenge;
        return ((response.statusCode === 401) && ((challenge = response.headers["www-authenticate"]), (challenge &&
            challenge.match("error=\"invalid_token\""))));
    });
(Blotre = (function(client, creds) {
    var self = this;
    (self.client = (client || ({})));
    (self.creds = (creds || ({})));
}));
(Blotre.create = (function(client, creds) {
    return new(Blotre)(client, creds);
}));
(Blotre.prototype.getAuthorizationUrl = (function() {
    var options, __o = this,
        client = __o["client"];
    return url.format(({
        pathname: ((options = ({
            pathname: "/v0/oauth2/authorize"
        })), url.format(extend(CONF, options))),
        query: ({
            response_type: "code",
            client_id: client.client_id,
            redirect_uri: client.redirect_uri
        })
    }));
}));
(Blotre.prototype.acccessTokenEndpoint = (function(grantType, options) {
    var options0, __o = this,
        client = __o["client"];
    return rp.post(({
        uri: ((options0 = ({
            pathname: "/v0/oauth2/access_token"
        })), url.format(extend(CONF, options0))),
        qs: extend(({
            grant_type: grantType,
            client_id: client.client_id,
            client_secret: client.client_secret,
            redirect_uri: client.redirect_uri
        }), (options || ({})))
    }))
        .then(JSON.parse)["catch"]((function(x) {
            return x.response.toJSON();
        }));
}));
(Blotre.prototype.redeemAuthorizationCode = (function(code) {
    var self = this;
    return self.acccessTokenEndpoint("authorization_code", ({
        code: code
    }));
}));
(Blotre.prototype.redeemRefreshToken = (function(token) {
    var self = this;
    return self.acccessTokenEndpoint("refresh_token", ({
        refresh_token: token
    }));
}));
(Blotre.prototype.redeemOnetimeCode = (function(code) {
    var self = this;
    return self.acccessTokenEndpoint("https://oauth2grant.blot.re/onetime_code", ({
        code: code
    }));
}));
(Blotre.createDisposable = (function(clientInfo) {
    var options;
    return rp.put(({
        uri: ((options = ({
            pathname: "/v0/oauth2/disposable"
        })), url.format(extend(CONF, options))),
        body: JSON.stringify(clientInfo),
        headers: ({
            "accepts": "application/json",
            "content-type": "application/json"
        })
    }))
        .then((function(y) {
            return new(Blotre)(y);
        }));
}));
(Blotre.prototype.setAuthHeader = (function(options) {
    var self = this;
    return extend(options, ({
        "headers": extend(options.headers, ({
            "authorization": (self.creds ? ("Bearer " + self.creds.access_token) : "")
        }))
    }));
}));
(Blotre.prototype.makeRequest = (function(options, noRetry) {
    var self = this;
    return rp(options)
        .then(JSON.parse)["catch"]((function(e) {
            var response, challenge;
            return ((((!noRetry) && ((response = e.response), ((response.statusCode === 401) && ((
                    challenge = response.headers["www-authenticate"]), (challenge &&
                    challenge.match("error=\"invalid_token\"")))))) && self.creds.refresh_token) ? self
                .redeemRefreshToken(self.creds.refresh_token)
                .then((function(newCreds) {
                    (self.creds = newCreds);
                    return self.makeRequest(self.setAuthHeader(options), true);
                })) : e);
        }));
}));
(Blotre.prototype.get = (function(path, options) {
    var options0, self = this;
    return self.makeRequest(({
        method: "GET",
        uri: ((options0 = ({
            pathname: ("/v0/api/" + path)
        })), url.format(extend(CONF, options0))),
        qs: (options || ({})),
        headers: ({
            "accepts": "application/json"
        })
    }));
}));
(Blotre.prototype.post = (function(path, body) {
    var options, self = this;
    return self.makeRequest(self.setAuthHeader(({
        method: "POST",
        uri: ((options = ({
            pathname: ("/v0/api/" + path)
        })), url.format(extend(CONF, options))),
        headers: ({
            "accepts": "application/json",
            "content-type": "application/json"
        }),
        body: JSON.stringify(body)
    })));
}));
(Blotre.prototype.put = (function(path, body) {
    var options, self = this;
    return self.makeRequest(self.setAuthHeader(({
        method: "PUT",
        uri: ((options = ({
            pathname: ("/v0/api/" + path)
        })), url.format(extend(CONF, options))),
        headers: ({
            "accepts": "application/json",
            "content-type": "application/json"
        }),
        body: JSON.stringify(body)
    })));
}));
(Blotre.prototype.del = (function(path) {
    var options, self = this;
    return self.makeRequest(({
        method: "DELETE",
        uri: ((options = ({
            pathname: ("/v0/api/" + path)
        })), url.format(extend(CONF, options))),
        headers: ({
            "accepts": "application/json"
        })
    }));
}));
(Blotre.prototype.getUser = (function(userId) {
    var self = this;
    return self.get(("user/" + userId));
}));
(Blotre.prototype.getStreams = (function(options) {
    var self = this;
    return self.get("stream", options);
}));
(Blotre.prototype.createStream = (function(body) {
    var self = this;
    return self.put("stream", body);
}));
(Blotre.prototype.getStream = (function(id, options) {
    var self = this;
    return self.get(("stream/" + id), options);
}));
(Blotre.prototype.deleteStream = (function(id) {
    var self = this;
    return self.del("stream", id);
}));
(Blotre.prototype.getStreamStatus = (function(id, options) {
    var self = this;
    return self.get(("stream/" + id), options);
}));
(Blotre.prototype.setStreamStatus = (function(id, body) {
    var self = this;
    return self.post((("stream/" + id) + "/status"), body);
}));
(Blotre.prototype.getStreamChildren = (function(id, options) {
    var self = this;
    return self.get((("stream/" + id) + "/children"), options);
}));
(Blotre.prototype.getChild = (function(streamId, childId, options) {
    var self = this;
    return self.get(((("stream/" + streamId) + "/children/") + childId), options);
}));
(Blotre.prototype.createChild = (function(streamId, childId) {
    var self = this;
    return self.put(((("stream/" + streamId) + "/children/") + childId));
}));
(Blotre.prototype.deleteChild = (function(streamId, childId) {
    var self = this;
    return self.del(((("stream/" + streamId) + "/children/") + childId));
}));
(module.exports = Blotre);