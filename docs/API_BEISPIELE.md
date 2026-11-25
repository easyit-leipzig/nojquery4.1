# noJquery 4.1 – API-Beispiele je Befehl

173 Einzelbefehle (einschließlich Eigenschaften) aus dem API-Inventar. Kurzbefehle beachten Groß-/Kleinschreibung.

## Core / Wrapper · length

```javascript
const count = nj(".item").length;
```

## Core / Wrapper · e

```javascript
const rawElement = nj("#panel").e;
```

## Core / Wrapper · [Symbol.iterator]

```javascript
for (const element of nj(".item")) console.log(element);
```

## Core / Wrapper · each
`callback`
```javascript
nj(".item").each((el, i) => console.log(i, el));
```
Kurzform: `ea`
```javascript
nj(".item").ea((el, i) => console.log(i, el));
```

## Core / Wrapper · map
`callback`
```javascript
const labels = nj(".item").map(el => el.textContent);
```
Kurzform: `mp`
```javascript
const labels = nj(".item").mp(el => el.textContent);
```

## Core / Wrapper · get
`index = 0`
```javascript
nj.get("/api/items").then(console.log);
```
Kurzform: `g`
```javascript
nj.g("/api/items").then(console.log);
```

## Core / Wrapper · first

```javascript
nj(".item").first().addClass("selected");
```
Kurzform: `f`
```javascript
nj(".item").f().addClass("selected");
```

## Core / Wrapper · last

```javascript
nj(".item").last().addClass("selected");
```
Kurzform: `l`
```javascript
nj(".item").l().addClass("selected");
```

## Core / Wrapper · eq
`index`
```javascript
nj(".item").eq(1).addClass("selected");
```
Kurzform: `eq`
```javascript
nj(".item").eq(1).addClass("selected");
```

## Core / Wrapper · find
`selector`
```javascript
nj("#panel").find("button").addClass("ready");
```
Kurzform: `fd`
```javascript
nj("#panel").fd("button").addClass("ready");
```

## Core / Wrapper · closest
`selector`
```javascript
nj(".button").closest(".card").addClass("active");
```
Kurzform: `cl`
```javascript
nj(".button").cl(".card").addClass("active");
```

## Core / Wrapper · parent

```javascript
nj(".item").parent().addClass("container");
```
Kurzform: `p`
```javascript
nj(".item").p().addClass("container");
```

## Core / Wrapper · children
`selector`
```javascript
nj("#list").children("li").addClass("entry");
```
Kurzform: `ch`
```javascript
nj("#list").ch("li").addClass("entry");
```

## Core / Wrapper · next

```javascript
nj(".active").next().addClass("active");
```
Kurzform: `n`
```javascript
nj(".active").n().addClass("active");
```

## Core / Wrapper · prev

```javascript
nj(".active").prev().addClass("active");
```
Kurzform: `pr`
```javascript
nj(".active").pr().addClass("active");
```

## Core / Wrapper · html
`value`
```javascript
nj("#output").html("<strong>Fertig</strong>");
```
Kurzform: `htm`
```javascript
nj("#output").htm("<strong>Fertig</strong>");
```

## Core / Wrapper · text
`value`
```javascript
nj("#output").text("Sicherer Text");
```
Kurzform: `txt`
```javascript
nj("#output").txt("Sicherer Text");
```

## Core / Wrapper · val
`value`
```javascript
nj("#username").val("Anna");
```
Kurzform: `v`
```javascript
nj("#username").v("Anna");
```

## Core / Wrapper · append
`content`
```javascript
nj("#list").append("<li>Neu</li>");
```
Kurzform: `a`
```javascript
nj("#list").a("<li>Neu</li>");
```

## Core / Wrapper · prepend
`content`
```javascript
nj("#list").prepend("<li>Erster</li>");
```
Kurzform: `pp`
```javascript
nj("#list").pp("<li>Erster</li>");
```

## Core / Wrapper · before
`content`
```javascript
nj("#target").before("<p>Davor</p>");
```
Kurzform: `b`
```javascript
nj("#target").b("<p>Davor</p>");
```

## Core / Wrapper · after
`content`
```javascript
nj("#target").after("<p>Danach</p>");
```
Kurzform: `aft`
```javascript
nj("#target").aft("<p>Danach</p>");
```

## Core / Wrapper · appendTo
`target`
```javascript
nj(".message").appendTo("#messages");
```
Kurzform: `aTo`
```javascript
nj(".message").aTo("#messages");
```

## Core / Wrapper · empty

```javascript
nj("#list").empty();
```
Kurzform: `emp`
```javascript
nj("#list").emp();
```

## Core / Wrapper · remove

```javascript
nj(".obsolete").remove();
```
Kurzform: `rm`
```javascript
nj(".obsolete").rm();
```

## Core / Wrapper · attr
`name, value`
```javascript
nj("#link").attr("title", "Info");
```
Kurzform: `atr`
```javascript
nj("#link").atr("title", "Info");
```

## Core / Wrapper · removeAttr
`name`
```javascript
nj("#input").removeAttr("disabled");
```
Kurzform: `rAt`
```javascript
nj("#input").rAt("disabled");
```

## Core / Wrapper · hasAttr
`name`
```javascript
const hasTitle = nj("#link").hasAttr("title");
```
Kurzform: `hAt`
```javascript
const hasTitle = nj("#link").hAt("title");
```

## Core / Wrapper · prop
`name, value`
```javascript
nj("#submit").prop("disabled", true);
```
Kurzform: `pro`
```javascript
nj("#submit").pro("disabled", true);
```

## Core / Wrapper · data
`name, value`
```javascript
nj("#row").data("recordId", 42);
```
Kurzform: `ds`
```javascript
nj("#row").ds("recordId", 42);
```

## Core / Wrapper · removeData
`name`
```javascript
nj("#row").removeData("recordId");
```
Kurzform: `rDs`
```javascript
nj("#row").rDs("recordId");
```

## Core / Wrapper · addClass
`classes`
```javascript
nj("#panel").addClass("active");
```
Kurzform: `aCl`
```javascript
nj("#panel").aCl("active");
```

## Core / Wrapper · removeClass
`classes`
```javascript
nj("#panel").removeClass("active");
```
Kurzform: `rCl`
```javascript
nj("#panel").rCl("active");
```

## Core / Wrapper · toggleClass
`name, force`
```javascript
nj("#panel").toggleClass("active");
```
Kurzform: `tCl`
```javascript
nj("#panel").tCl("active");
```

## Core / Wrapper · hasClass
`name`
```javascript
const active = nj("#panel").hasClass("active");
```
Kurzform: `hCl`
```javascript
const active = nj("#panel").hCl("active");
```

## Core / Wrapper · css
`property, value`
```javascript
nj("#panel").css("color", "red");
```
Kurzform: `sty`
```javascript
nj("#panel").sty("color", "red");
```

## Core / Wrapper · removeCss
`property`
```javascript
nj("#panel").removeCss("color");
```
Kurzform: `rCs`
```javascript
nj("#panel").rCs("color");
```

## Core / Wrapper · show
`display = ''`
```javascript
nj("#panel").show();
```
Kurzform: `sh`
```javascript
nj("#panel").sh();
```

## Core / Wrapper · hide

```javascript
nj("#panel").hide();
```
Kurzform: `hd`
```javascript
nj("#panel").hd();
```

## Core / Wrapper · toggle
`display = 'block'`
```javascript
nj("#panel").toggle();
```
Kurzform: `tog`
```javascript
nj("#panel").tog();
```

## Core / Wrapper · on
`events, selector, handler, options`
```javascript
nj("#save").on("click", () => console.log("Speichern"));
```
Kurzform: `on`
```javascript
nj("#save").on("click", () => console.log("Speichern"));
```

## Core / Wrapper · off
`events, handler`
```javascript
const handle = () => console.log("Klick");
nj("#save").on("click", handle);
nj("#save").off("click", handle);
```
Kurzform: `off`
```javascript
const handle = () => console.log("Klick");
nj("#save").on("click", handle);
nj("#save").off("click", handle);
```

## Core / Wrapper · once
`events, selector, handler, options = {}`
```javascript
nj("#save").once("click", () => console.log("Einmal"));
```
Kurzform: `onc`
```javascript
nj("#save").onc("click", () => console.log("Einmal"));
```

## Core / Wrapper · trigger
`name, detail`
```javascript
nj("#save").trigger("click");
```
Kurzform: `tri`
```javascript
nj("#save").tri("click");
```

## Core / Wrapper · checked
`value`
```javascript
nj("#terms").checked(true);
```
Kurzform: `chk`
```javascript
nj("#terms").chk(true);
```

## Core / Wrapper · serialize

```javascript
const fields = nj("#contact-form").serialize();
```
Kurzform: `ser`
```javascript
const fields = nj("#contact-form").ser();
```

## Core / Wrapper · rect

```javascript
const bounds = nj("#panel").rect();
```
Kurzform: `gRe`
```javascript
const bounds = nj("#panel").gRe();
```

## Core / Wrapper · scrollIntoView
`options = { behavior: 'smooth', block: 'start' }`
```javascript
nj("#errors").scrollIntoView({ behavior: "smooth" });
```
Kurzform: `sIV`
```javascript
nj("#errors").sIV({ behavior: "smooth" });
```

## Core / Wrapper · animate
`keyframes, options = {}`
```javascript
nj("#box").animate([{opacity:0},{opacity:1}], {duration:300});
```
Kurzform: `ani`
```javascript
nj("#box").ani([{opacity:0},{opacity:1}], {duration:300});
```

## Core / Wrapper · fadeIn
`duration`
```javascript
nj("#panel").fadeIn(200);
```
Kurzform: `fIn`
```javascript
nj("#panel").fIn(200);
```

## Core / Wrapper · fadeOut
`duration`
```javascript
nj("#panel").fadeOut(200);
```
Kurzform: `fOu`
```javascript
nj("#panel").fOu(200);
```

## Core / Wrapper · is
`selector`
```javascript
const button = nj("#save").is("button");
```
Kurzform: `is`
```javascript
const button = nj("#save").is("button");
```

## Core / Wrapper · exists

```javascript
const found = nj("#panel").exists();
```
Kurzform: `isE`
```javascript
const found = nj("#panel").isE();
```

## Globale API · version
`property`
```javascript
console.log(nj.version);
```

## Globale API · NJ
`property`
```javascript
console.log(nj.NJ);
```

## Globale API · ready
`function`
```javascript
nj.ready(() => console.log("DOM bereit"));
```

## Globale API · create
`function`
```javascript
const node = nj.create("div", { class: "card" });
```

## Globale API · extend
`function`
```javascript
const merged = nj.extend({}, {a:1}, {b:2});
```

## Globale API · deepEqual
`function`
```javascript
const equal = nj.deepEqual({a:1}, {a:1});
```

## Globale API · isJSON
`function`
```javascript
const valid = nj.isJSON("{\"ok\":true}");
```

## Globale API · arrayRemove
`function`
```javascript
const items = nj.arrayRemove([1,2,3], 2);
```

## Globale API · filterObjectArray
`function`
```javascript
const matches = nj.filterObjectArray([{id:1},{id:2}], "id", 2);
```

## Globale API · forEach
`function`
```javascript
nj.forEach([1,2,3], value => console.log(value));
```

## Globale API · cssVar
`function`
```javascript
nj.cssVar("--brand-color", "#2457d6");
```

## Globale API · detectBrowser
`function`
```javascript
const browser = nj.detectBrowser();
```

## Globale API · request
`function`
```javascript
nj.request("/api/items").then(console.log);
```

## Globale API · ajax
`alias`
```javascript
nj.ajax("/api/items").then(console.log);
```

## Globale API · upload
`function`
```javascript
nj.upload("/upload", document.querySelector("#file").files[0]);
```

## Globale API · cache
`instance`
```javascript
const cache = nj.cache;
```

## Globale API · CacheManager
`property`
```javascript
const CacheManager = nj.CacheManager;
```

## Globale API · observe
`function`
```javascript
nj.observe(document.querySelector("#panel"), changes => console.log(changes));
```

## Globale API · visible
`function`
```javascript
nj.visible(document.querySelector("#panel"), entry => console.log(entry));
```

## Globale API · resize
`function`
```javascript
nj.resize(document.querySelector("#panel"), entry => console.log(entry));
```

## Globale API · escapeHTML
`function`
```javascript
const safe = nj.escapeHTML("<script>");
```

## Globale API · template
`function`
```javascript
const output = nj.template("Hallo {{name}}", {name:"Anna"});
```

## Globale API · render
`function`
```javascript
nj.render("#output", "<p>Hallo</p>");
```

## Globale API · route
`function`
```javascript
nj.route("/home", () => console.log("Start"));
```

## Globale API · navigate
`function`
```javascript
nj.navigate("/home");
```

## Globale API · drag
`function`
```javascript
nj.drag("#item");
```

## Globale API · drop
`function`
```javascript
nj.drop("#target", data => console.log(data));
```

## Globale API · sortable
`function`
```javascript
nj.sortable("#list");
```

## Globale API · uuid
`function`
```javascript
const id = nj.uuid();
```

## Globale API · logger
`function`
```javascript
const logger = nj.logger;
```

## Globale API · log
`function`
```javascript
nj.log("Information");
```

## Globale API · exposeAliases
`function`
```javascript
nj.exposeAliases();
```

## Globale API · releaseAlias
`function`
```javascript
nj.releaseAlias("$");
```

## Globale API · hasAlias
`function`
```javascript
const enabled = nj.hasAlias("$");
```

## Globale API · oEx
`alias`
```javascript
const merged = nj.oEx({}, {a:1});
```

## Globale API · cEq
`alias`
```javascript
const same = nj.cEq([1], [1]);
```

## Globale API · isJ
`alias`
```javascript
const valid = nj.isJ("{}");
```

## Globale API · rAE
`alias`
```javascript
nj.rAE([1,2,3], 2);
```

## Globale API · fOA
`alias`
```javascript
nj.fOA([{id:1}], "id", 1);
```

## Globale API · fEa
`function`
```javascript
nj.fEa([1,2], console.log);
```

## Globale API · ddS
`function`
```javascript
nj.ddS("#item");
```

## Globale API · ddG
`function`
```javascript
nj.ddG("#item");
```

## Globale API · gBr
`alias`
```javascript
console.log(nj.gBr());
```

## Globale API · delete
`dynamic_function`
```javascript
nj.delete("/api/items/1").then(console.log);
```

## Globale API · get
`dynamic_function`
```javascript
nj.get("/api/items").then(console.log);
```

## Globale API · head
`dynamic_function`
```javascript
nj.head("/api/items").then(console.log)
```

## Globale API · patch
`dynamic_function`
```javascript
nj.patch("/api/items/1", {name:"Anna"}).then(console.log);
```

## Globale API · post
`dynamic_function`
```javascript
nj.post("/api/items", {name:"Anna"}).then(console.log);
```

## Globale API · put
`dynamic_function`
```javascript
nj.put("/api/items/1", {name:"Anna"}).then(console.log);
```

## config · debug

```javascript
nj.config.debug = true;
```

## config · warn

```javascript
nj.config.warn = true;
```

## config · exposeUnderscore

```javascript
nj.config.exposeUnderscore = false;
```

## config · exposeDollar

```javascript
nj.config.exposeDollar = false;
```

## config · forceAliasOverwrite

```javascript
nj.config.forceAliasOverwrite = false;
```

## config · ajaxTimeout

```javascript
nj.config.ajaxTimeout = 10000;
```

## config · animation

```javascript
console.log(nj.config.animation);
```

## storage · local

```javascript
nj.storage.local.set("name", "Anna");
```

## storage · session

```javascript
nj.storage.session.set("step", "2");
```

## storage · create

```javascript
const store = nj.storage.create("settings");
```

## storage · available

```javascript
console.log(nj.storage.available());
```

## router · start

```javascript
nj.router.start();
```

## router · navigate

```javascript
nj.router.navigate("/home");
```

## router · replace

```javascript
nj.router.replace("/home");
```

## router · params

```javascript
const params = nj.router.params();
```

## url · parse

```javascript
console.log(nj.url.parse("https://example.org/?page=1"));
```

## url · get

```javascript
console.log(nj.url.get("page"));
```

## url · set

```javascript
nj.url.set("page", "2");
```

## url · remove

```javascript
nj.url.remove("page");
```

## url · query

```javascript
console.log(nj.url.query());
```

## url · hash

```javascript
console.log(nj.url.hash());
```

## cookie · set

```javascript
nj.cookie.set("theme", "dark");
```

## cookie · get

```javascript
console.log(nj.cookie.get("theme"));
```

## cookie · has

```javascript
console.log(nj.cookie.has("theme"));
```

## cookie · remove

```javascript
nj.cookie.remove("theme");
```

## validate · required

```javascript
nj.validate.required("Hallo");
```

## validate · email

```javascript
nj.validate.email("anna@example.com");
```

## validate · url

```javascript
nj.validate.url("https://example.com");
```

## validate · number

```javascript
nj.validate.number("42");
```

## validate · integer

```javascript
nj.validate.integer("42");
```

## validate · date

```javascript
nj.validate.date("2026-10-29");
```

## validate · phone

```javascript
nj.validate.phone("+4930123456");
```

## validate · iban

```javascript
nj.validate.iban("DE89370400440532013000");
```

## validate · bic

```javascript
nj.validate.bic("COBADEFFXXX");
```

## validate · min

```javascript
nj.validate.min(10, 5);
```

## validate · max

```javascript
nj.validate.max(10, 20);
```

## validate · minLength

```javascript
nj.validate.minLength("Hallo", 3);
```

## validate · maxLength

```javascript
nj.validate.maxLength("Hallo", 10);
```

## validate · test

```javascript
nj.validate.test("abc", /^[a-z]+$/);
```

## format · number

```javascript
nj.format.number(1234.56);
```

## format · money

```javascript
nj.format.money(19.99, "EUR");
```

## format · percent

```javascript
nj.format.percent(0.25);
```

## format · date

```javascript
nj.format.date(new Date());
```

## format · bytes

```javascript
nj.format.bytes(1048576);
```

## clipboard · copy

```javascript
nj.clipboard.copy("Text kopieren");
```

## clipboard · read

```javascript
nj.clipboard.read().then(console.log);
```

## key · on

```javascript
nj.key.on("ctrl+s", () => console.log("Speichern"));
```

## key · enter

```javascript
nj.key.enter(() => console.log("Enter"));
```

## key · escape

```javascript
nj.key.escape(() => console.log("Escape"));
```

## device · touch

```javascript
console.log(nj.device.touch());
```

## device · mobile

```javascript
console.log(nj.device.mobile());
```

## device · tablet

```javascript
console.log(nj.device.tablet());
```

## device · desktop

```javascript
console.log(nj.device.desktop());
```

## device · online

```javascript
console.log(nj.device.online());
```

## color · hexToRgb

```javascript
nj.color.hexToRgb("#ff0000");
```

## color · rgbToHex

```javascript
nj.color.rgbToHex(255, 0, 0);
```

## color · lighten

```javascript
nj.color.lighten("#336699", 10);
```

## color · darken

```javascript
nj.color.darken("#336699", 10);
```

## date · today

```javascript
nj.date.today();
```

## date · addDays

```javascript
nj.date.addDays(new Date(), 7);
```

## date · diff

```javascript
nj.date.diff(new Date("2026-01-01"), new Date("2026-01-02"));
```

## date · format

```javascript
nj.date.format(new Date(), "YYYY-MM-DD");
```

## random · int

```javascript
nj.random.int(1, 10);
```

## random · float

```javascript
nj.random.float(0, 1);
```

## random · string

```javascript
nj.random.string(12);
```

## random · color

```javascript
nj.random.color();
```

## random · uuid

```javascript
nj.random.uuid();
```

## bus · on

```javascript
nj.bus.on("saved", data => console.log(data));
```

## bus · off

```javascript
const handler = data => console.log(data); nj.bus.on("saved", handler); nj.bus.off("saved", handler);
```

## bus · once

```javascript
nj.bus.once("saved", data => console.log(data));
```

## bus · emit

```javascript
nj.bus.emit("saved", {id:1});
```
