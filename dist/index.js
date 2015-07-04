/*
 * THIS FILE IS AUTO GENERATED FROM 'lib/index.kep'
 * DO NOT EDIT
*/
"use strict";
var rp = require("request-promise"),
    extend = require("extend"),
    url = require("url"),
    Blotre, __o = JSON,
    stringify = __o["stringify"],
    parse = __o["parse"],
    DEFAULT_CONF = ({
        protocol: "https",
        host: "blot.re"
    });
(Blotre = (function(client, creds, conf) {
    var self = this;
    (self.client = (client || ({})));
    (self.creds = (creds || ({})));
    (self.config = extend(DEFAULT_CONF, (conf || ({}))));
}));
(Blotre.create = (function(client, creds, conf) {
    return new(Blotre)(client, creds, conf);
}));
(Blotre.prototype.getUrl = (function(options) {
    var __o0 = this,
        config = __o0["config"],
        conf = ({
            protocol: config.protocol,
            host: config.host
        });
    return url.format(extend(conf, options));
}));
(Blotre.prototype.setCreds = (function(creds) {
    var self = this;
    (self.creds = creds);
    if (self.config.onCredsChanged) self.config.onCredsChanged(self);
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
        "content-type": "application/x-www-form-urlencoded",
        form: extend(({
            grant_type: grantType,
            client_id: self.client.client_id,
            client_secret: self.client.client_secret,
            redirect_uri: self.client.redirect_uri
        }), (options || ({})))
    }))
        .then(parse)["catch"]((function(e) {
            throw extend(parse(e.response.body), ({
                statusCode: e.statusCode
            }));
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
        refresh_token: (token || self.creds.refresh_token)
    }));
}));
(Blotre.prototype.redeemOnetimeCode = (function(code) {
    var self = this;
    return self.acccessTokenEndpoint("https://oauth2grant.blot.re/onetime_code", ({
        code: (code || self.client.code)
    }));
}));
var JSON_HEADER = ({
    "accepts": "application/json",
    "content-type": "application/json"
});
(Blotre.createDisposable = (function(clientInfo, conf) {
    var conf0, options;
    return rp.put(({
        uri: ((conf0 = extend(DEFAULT_CONF, (conf || ({})))), (options = ({
            pathname: "/v0/oauth2/disposable"
        })), url.format(extend(conf0, options))),
        body: stringify(clientInfo),
        headers: JSON_HEADER
    }))
        .then((function(z) {
            var data = parse(z);
            return new(Blotre)(({
                client_id: data.id,
                client_secret: data.secret,
                code: data.code
            }), null, conf);
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
        .then(parse)["catch"]((function(e) {
            var response, challenge;
            if ((((!noRetry) && ((response = e.response), (((response && response.statusCode) === 401) &&
                ((challenge = response.headers["www-authenticate"]), (challenge &&
                    challenge.match("error=\"invalid_token\"")))))) && self.creds.refresh_token)) {
                return self.redeemRefreshToken()
                    .then((function(newCreds) {
                        self.setCreds(newCreds);
                        return self.makeRequest(self.setAuthHeader(options), true);
                    }));
            } else {
                throw e;
            }
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
        headers: JSON_HEADER
    }));
}));
(Blotre.prototype.post = (function(path, body) {
    var self = this;
    return self.makeRequest(self.setAuthHeader(({
        method: "POST",
        uri: self.getUrl(({
            pathname: ("/v0/api/" + path)
        })),
        headers: JSON_HEADER,
        body: stringify(body)
    })));
}));
(Blotre.prototype.put = (function(path, body) {
    var self = this;
    return self.makeRequest(self.setAuthHeader(({
        method: "PUT",
        uri: self.getUrl(({
            pathname: ("/v0/api/" + path)
        })),
        headers: JSON_HEADER,
        body: stringify(body)
    })));
}));
(Blotre.prototype.del = (function(path) {
    var self = this;
    return self.makeRequest(self.setAuthHeader(({
        method: "DELETE",
        uri: self.getUrl(({
            pathname: ("/v0/api/" + path)
        })),
        headers: JSON_HEADER
    })));
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