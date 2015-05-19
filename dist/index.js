/*
 * THIS FILE IS AUTO GENERATED FROM 'lib/index.kep'
 * DO NOT EDIT
*/
"use strict";
var request = require("request"),
    rp = require("request-promise"),
    extend = require("extend"),
    url = require("url"),
    Blotre, DEFAULT_CONF = ({
        protocol: "https",
        host: "blot.re"
    }),
    getUrl = (function(conf, options) {
        return url.format(extend(conf, options));
    }),
    isExpiredResponse = (function(response) {
        var challenge;
        return ((response.statusCode === 401) && ((challenge = response.headers["www-authenticate"]), (challenge &&
            challenge.match("error=\"invalid_token\""))));
    });
(Blotre = (function(client, creds, conf) {
    var self = this;
    (self.client = (client || ({})));
    (self.creds = (creds || ({})));
    (self.config = (conf || DEFAULT_CONF));
}));
(Blotre.create = (function(client, creds, conf) {
    return new(Blotre)(client, creds, conf);
}));
(Blotre.prototype.getUrl = (function(options) {
    var __o = this,
        config = __o["config"],
        conf = config;
    return url.format(extend(conf, options));
}));
(Blotre.prototype.getAuthorizationUrl = (function() {
    var self = this;
    return url.format(({
        pathname: self.getUrl(({
            pathname: "/v0/oauth2/authorize"
        })),
        query: ({
            response_type: "code",
            client_id: self.client.client_id,
            redirect_uri: self.client.redirect_uri
        })
    }));
}));
(Blotre.prototype.acccessTokenEndpoint = (function(grantType, options) {
    var self = this;
    return rp.post(({
        uri: self.getUrl(({
            pathname: "/v0/oauth2/access_token"
        })),
        qs: extend(({
            grant_type: grantType,
            client_id: self.client.client_id,
            client_secret: self.client.client_secret,
            redirect_uri: self.client.redirect_uri
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
(Blotre.createDisposable = (function(clientInfo, conf) {
    var conf0, options;
    return rp.put(({
        uri: ((conf0 = (conf || DEFAULT_CONF)), (options = ({
            pathname: "/v0/oauth2/disposable"
        })), url.format(extend(conf0, options))),
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
    var self = this;
    return self.makeRequest(({
        method: "GET",
        uri: self.getUrl(({
            pathname: ("/v0/api/" + path)
        })),
        qs: (options || ({})),
        headers: ({
            "accepts": "application/json"
        })
    }));
}));
(Blotre.prototype.post = (function(path, body) {
    var self = this;
    return self.makeRequest(self.setAuthHeader(({
        method: "POST",
        uri: self.getUrl(({
            pathname: ("/v0/api/" + path)
        })),
        headers: ({
            "accepts": "application/json",
            "content-type": "application/json"
        }),
        body: JSON.stringify(body)
    })));
}));
(Blotre.prototype.put = (function(path, body) {
    var self = this;
    return self.makeRequest(self.setAuthHeader(({
        method: "PUT",
        uri: self.getUrl(({
            pathname: ("/v0/api/" + path)
        })),
        headers: ({
            "accepts": "application/json",
            "content-type": "application/json"
        }),
        body: JSON.stringify(body)
    })));
}));
(Blotre.prototype.del = (function(path) {
    var self = this;
    return self.makeRequest(({
        method: "DELETE",
        uri: self.getUrl(({
            pathname: ("/v0/api/" + path)
        })),
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