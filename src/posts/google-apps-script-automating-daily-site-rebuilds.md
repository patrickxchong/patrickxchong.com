---
title: Google Apps Script - Automating Daily Site Rebuilds
excerpt: An free and flexible way to automate API driven actions
status: published
tags:
  - tech
  - google-apps-script
author: patrick-chong
date: 2021-08-24T02:31:10.530Z
image: /assets/images/uploads/lukas-blazek-UAvYasdkzq8-unsplash.jpg
---

## Steps

1. Create a new project at https://script.google.com/.
2. Paste one of the scripts below into `Code.gs`.
   a. [Simple Daily](#simple-daily)
   b. [Complex Daily](#complex-daily)
   c. [Complex Generic](#complex-generic)
3. Modify as desired with URLs/webhooks from [Vercel](https://vercel.com/)/[Netlify](https://netlify.app/) etc.
4. Test code by running dailyCron function from editor (will be prompted to authenticate on the first time).
5. Go to **Triggers** on the left sidebar (has the clock icon).
6. Select Add Trigger and modify the settings based on the image below:
   <img src="/assets/images/uploads/daily-cron-trigger-settings.png" alt="Daily Cron trigger settings" width="50%" height="100%"  style="min-width: 280px"/>

7. Hit **Save** and you're done!

### Simple Daily

```js
let dailyList = ['<insert url>']

function dailyCron() {
	dailyList.forEach((url) => {
		let options = {
			method: 'get',
		}
		let response = UrlFetchApp.fetch(url, options)
		Logger.log({ url, response }) // log the URL and the response
	})
}
```

### Complex Daily

```js
let dailyList = [
	{
		url: '<insert url>',
		options: {
			method: 'get',
		},
	},
	{
		url: '<insert url>',
		options: {
			method: 'post',
			contentType: 'application/json',
			payload: JSON.stringify({
				message: 'hello world',
			}),
		},
	},
]

function dailyCron() {
	dailyList.forEach((item) => {
		let response = UrlFetchApp.fetch(item.url, item.options)
		Logger.log({ url: item.url, response })
	})
}
```

### Complex Generic

```js
let dailyList = [
	{
		url: '<insert url>',
		options: {
			method: 'get',
		},
	},
	{
		url: '<insert url>',
		options: {
			method: 'post',
			contentType: 'application/json',
			payload: JSON.stringify({
				message: 'hello world',
			}),
		},
	},
]

let monthlyList = [
	/* similar structure to dailyList */
]

function dailyCron() {
	cronHelper(dailyList)
}

function monthlyCron() {
	cronHelper(monthlyList)
}

function cronHelper(list) {
	list.forEach((item) => {
		let response = UrlFetchApp.fetch(item.url, item.options)
		Logger.log({ url: item.url, response })
	})
}
```

## Notes

- Inspired by [Trigger a Netlify Build Every Day with IFTTT](https://www.11ty.dev/docs/quicktips/netlify-ifttt/). Created the code in Google Apps script so that it's more flexible/extensible.

- If the desire is to save the results, then creating the script in connection to Google Sheets would work better.

- Function is named dailyCron/monthlyCron after the Linux [cron](https://en.wikipedia.org/wiki/Cron) utility

## Limitations of Google Apps Script

- Script runtime: 6 min/execution (all accounts)
- URL Fetch calls: 20,000/day (normal Google accounts), 100,000/day (Google Workspace accounts)
- Source: https://developers.google.com/apps-script/guides/services/quotas
