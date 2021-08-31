---
title: Create Trello Cards from Google Form Responses (Google Apps Script)
excerpt: Directly send data from Google Form into Trello. Create custom cards
  that no Zapier integration can do!
status: published
tags:
  - tech
  - tutorial
  - google-apps-script
author: patrick-chong
date: 2021-08-31T02:31:10.530Z
updatedAt: ''
image: /assets/images/uploads/google-form-to-trello.png
---

The [Zapier integration between Google Form and Trello](https://zapier.com/apps/google-forms/integrations/trello/11016/create-trello-cards-from-new-google-forms-responses) only allows one to add color labels and custom text labels separately, but the custom text labels added by Trello were not matched with the right color label. To circumvent that, I created a custom google-apps-script that emails the Google Form response as a card to Trello directly (guide to set up Trello Board email [here](https://help.trello.com/article/809-creating-cards-by-email))

The script below is used by a feedback form which supports 3 types of feedback: Feature Request, Bug Report, or Other. `#Other #Yellow` would create a yellow colored Other label.

```js
function onSubmitHandler(e) {
	let itemResponses = e.response.getItemResponses()
	let email = itemResponses[0].getResponse()
	let name = itemResponses[1].getResponse()
	let type = itemResponses[2].getResponse()
	let subject,
		body,
		attachments = []

	if (type === 'Other') {
		let title = itemResponses[3].getResponse()
		let feedback = itemResponses[4].getResponse()
		subject = `[Other] ${title} #Other #Yellow`
		body = `
## Message
${feedback}

${name}
${email}
    `
	} else if (type === 'Bug Report') {
		let title = itemResponses[3].getResponse()
		subject = `[Bug] ${title} #Bug_Report #Red`

		body = `
## Description
${itemResponses[4] ? itemResponses[4].getResponse() : ''}

## Device, Operating System, Browser
${itemResponses[5] ? itemResponses[5].getResponse() : ''}

## Additional Context
${itemResponses[7] ? itemResponses[7].getResponse() : ''}

${name}
${email}
    `
		if (itemResponses[6]) {
			itemResponses[6].getResponse().forEach((fileId) => {
				attachments.push(DriveApp.getFileById(fileId).getBlob())
			})
		}
	} else if (type === 'Feature Request') {
		let title = itemResponses[5].getResponse()
		subject = `[Feat] ${title} #Feature_Request #Blue`

		body = `
## Problem
${itemResponses[3] ? itemResponses[3].getResponse() : ''}

## What feature do you think could help solve that problem?
${itemResponses[4].getResponse()}

## How would you use the feature you have described?
${itemResponses[6] ? itemResponses[6].getResponse() : ''}

${name}
${email}
    `
		if (itemResponses[7]) {
			itemResponses[7].getResponse().forEach((fileId) => {
				attachments.push(DriveApp.getFileById(fileId).getBlob())
			})
		}
	}

	MailApp.sendEmail({
		name: 'GForm to Trello',
		to: '<Insert Trello Board Email>',
		subject,
		body,
		attachments,
	})
}
```

Notes

1. Data returned by Google Form's On Form Submit trigger: https://developers.google.com/apps-script/guides/triggers/events?hl=en#form-submit_1
2. Seems like the data could be easier to manipulate through the use of the `namedValues` field when setup with a [Form Submit trigger on **Google Sheets**](https://developers.google.com/apps-script/guides/triggers/events?hl=en#form-submit) instead, but I've not tried that yet.
3. DriveApp.getFileById(fileId).getBlob() - used to handle File Upload fields on the Google Form, and the files would be attached to the Trello card created by the email. More details [here](https://developers.google.com/apps-script/reference/drive/drive-app#getfilebyidid).
4. MailApp.sendEmail does the final step of emailing the form to Trello.
