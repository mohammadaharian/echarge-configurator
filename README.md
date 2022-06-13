# DELTACO E-Charge Configurator
Find the right DELTACO E-Charge cable for your electric vehicle (EV).

![demo](https://storage.googleapis.com/public.victorwesterlund.com/github/Deltaco-AB/echarge-configurator/screenshot.png)
### [Try the configurator live](http://echarge-configurator.github.deltaco.eu/)

## Embed the configurator

### Default configurator

The E-Charge Configurator can be embedded or opened as a top-level window without any parameters.
```html
<iframe src="https://echarge-configurator.github.deltaco.eu/"></iframe>
```
This will initialize the configurator with all default settings. Including the *DELTACO A Nordic Brand* logo, product links to deltaco.se and the default theme colors.

### Filtered configurator

You can also provide your own list of cables. This is useful if you wish to link to your own webshop from the configurator, remove products not in your assortment; or even change cable metadata (such as title and thumbnail).

Each cable is defined as an object, the list of all available cables are fetched by the configurator as a JSON file (see [`cables.json`](https://github.com/Deltaco-AB/echarge-configurator/blob/master/cables.json))

```json
"EV-3207": {
  "length": "7m",
  "image": "https://www.deltaco.se/sites/cdn/PublishingImages/Products/EV-3207.png?width=120",
  "text": "Type 2 - Type 2, 32A",
  "link": "https://www.deltaco.se/produkter/kablar-adaptrar/ev-charge/EV-3207"
}
```
Key|Value
--|--
`length`|Cable length defined in meters
`image`|URL to a scaled thumbnail (120px wide)
`text`|Short text describing the cable
`link`|URL to open when "Read more" is clicked

#### Supply your own [`cables.json`](https://github.com/Deltaco-AB/echarge-configurator/blob/master/cables.json)

Simply pass the URL of your `cables.json` as a search parameter. `?cables=<PATH_TO_JSON>`
```html
<iframe src="https://echarge-configurator.github.deltaco.eu?cables=https://example.com/cables.json"></iframe>
```

### Translations

You can translate the configurator by providing a JSON file (see [`i18n_sv.json`](https://github.com/Deltaco-AB/echarge-configurator/blob/master/i18n_sv.json))

Simply pass it on the url `?translation=<PATH_TO_JSON>`
```html
<iframe src="https://echarge-configurator.github.deltaco.eu?translation=https://example.com/i18n_sv.json"></iframe>
```


## Custom layout

You can change the appearance of the configurator by passing search parameters.

**Available interfaces:**
- [`logo`](#logo) Change the header logo.
- [`color`](#color) Change the theme colors.

### `logo`

You can insert your own image to replace the default *DELTACO A Nordic Brand* logo in the header. Supply a search parameter with a URL to an image.
```html
<iframe src="https://echarge-configurator.github.deltaco.eu?logo=https://example.com/img/myLogo.webp"></iframe>
```

### `color`

Change the default palette of the configurator by passing up to three `color` parameters. They will alter in order of appearace from left to right:

1. Main color (default is green)
2. Hover color (default is green with a lighter shade)
3. Secondary color (default is blue)

This is how it's read: `?color=<FIRST_COLOR>&color=<SECOND_COLOR>&color=<THIRD_COLOR>`

---

```html
<iframe src="https://echarge-configurator.github.deltaco.eu?color=e1a028&color=edd6ac&color=212121"></iframe>
```
The example above will produce this:

![demo_color](https://storage.googleapis.com/public.victorwesterlund.com/github/Deltaco-AB/echarge-configurator/screenshot_color.png)

# License

[The DELTACO E-Charge Configurator source is licensed under the MIT License](https://github.com/Deltaco-AB/echarge-configurator/blob/master/LICENSE)

# Issues & Contribute

Please report bugs, suggest features and submit feedback by creating an [Issue](https://github.com/Deltaco-AB/echarge-configurator/issues)

Pull Requests to this repo are accepted.
