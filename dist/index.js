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
(Blotre.prototype.setCreds = (function(creds) {
    var __o = this,
        client = __o["client"];
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
    var options0, x, __o = this,
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
        .then(((x = JSON.parse), (function(z) {
            var creds = x(z);
            return new(Blotre)(client, creds);
        })))["catch"]((function(x0) {
            return x0.response.toJSON();
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
(Blotre.prototype.makeRequest = (function(options, noRetry) {
    var self = this;
    return rp(options)
        .then(JSON.parse)["catch"]((function(e) {
            var response, challenge;
            return ((((!noRetry) && ((response = e.response), ((response.statusCode === 401) && ((
                    challenge = response.headers["www-authenticate"]), (challenge &&
                    challenge.match("error=\"invalid_token\"")))))) && self.creds.refresh_token) ? self
                .redeemRefreshToken(self.creds.refresh_token)
                .then(self.makeRequest.bind(null, options, true)) : e);
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
    return self.makeRequest(({
        method: "POST",
        uri: ((options = ({
            pathname: ("/v0/api/" + path)
        })), url.format(extend(CONF, options))),
        headers: ({
            "accepts": "application/json",
            "content-type": "application/json",
            "authorization": (self.creds ? ("Bearer " + self.creds.access_token) : "")
        }),
        body: JSON.stringify(body)
    }));
}));
(Blotre.prototype.put = (function(path, body) {
    var options, self = this;
    return self.makeRequest(({
        method: "PUT",
        uri: ((options = ({
            pathname: ("/v0/api/" + path)
        })), url.format(extend(CONF, options))),
        headers: ({
            "accepts": "application/json",
            "content-type": "application/json",
            "authorization": (self.creds ? ("Bearer " + self.creds.access_token) : "")
        }),
        body: JSON.stringify(body)
    }));
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
(Blotre.createTemp = (function() {
    return null;
}));
var test = Blotre.create(({
    client_id: "5558ef1330042320bd1ff8b2",
    client_secret: "Y2JkNzY3ZWMtODVlZS00NjM5LWEyNmUtNzJkOGY2NjdjYTNl",
    redirect_uri: "http://localhost:50000"
}), ({
    access_token: "ODJhZDg0YjktN2ZiYy00ODMxLWIxNWMtZmYwMGJkODEwMWE1",
    refresh_token: "OGFhZWI4ZTgtZDgxMi00NjA4LTlhZjYtMzI5MWRhMDgyY2Zm"
}));
test.setStreamStatus("5550fcc9300496217de54ebf", ({
    color: "#f0000f"
}))
    .then(console.log)["catch"](console.error);
(module.exports = Blotre);