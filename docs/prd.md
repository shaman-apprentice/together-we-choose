# Product Requirement Document for Together, We Choose

Together, We Choose — A web application that helps couples to make an informed and empathetic decision about their future family name.

This is a living document. Changes are tracked via GitHub version control for minimal overhead.

## 🩼 The problem at hand

In many cultures, there is an implicit expectation that one partner adopts the other's surname at marriage. This leads to decisions defaulting to tradition rather than shared values, occasionally leaving one side's family feelings unseen and resentful.

In our modern, emancipated society we can do better than making a choice only based on tradition.

## 🎯 Goals

| Stakeholder | Value proposition |
|-------------|-------------------|
| Couples getting married | Encourage couples to openly discuss their future family name. Raise empathy for each others feelings and desires. Give structured notes what to take into consideration for the choice of family name. |
| Family relatives | Reassure that they are not alone and that no matter the decision it was not a personal decision against them but an emancipated choice. |
| Contributor / Story Sharer | Platform to share experience and feel helpful. |
| Product owner | Educational project to learn product design and AI usage. |

## 📈 KPIs

- Receive at least 3 positives feedback in first 6 month.
- Receive at least one shared story in first 6 month.
- Nice to have: >= 5min average time on first landing page visit.
- Nice to have: At least one of 10 visitors gives feedback or shares his story.

## 🧭 Core user flows

### Read & reflect

Trigger: User seeks information and arrives at the landing page <br/>
Steps: Lands on landing page -> scrolls down and consumes all information -> Optionally scrolls through carousel of shared stories <br/>
Success: Stays for at least 5mins on the page

### Submit Feedback

Trigger: Users wants to give  feedback or receive further information and goes to feedback page <br/>
Steps: Navigate to feedback page via top navigation bar -> Optionally types in his email -> types in his feedback -> Clicks "Send" button -> Sees a Thank you page <br/>
Success: New Feedback is visible on admin page of product owner

### Share your Story

Trigger: User wants to share his story to help others <br/>
Steps: Navigate to share your story page via top navigation bar -> Optionally types in email -> Types in story -> Optionally uploads an image -> Clicks "Send" button -> Sees a Thank you page <br/>
Success: New Story is visible on admin page of product owner

### Product owner reacts to user input

Prerequisite: There is at least one new feedback and one new story <br/>
Trigger: Product owner finds time to react to user input <br/>
Steps: Open admin route via url -> types in password -> Sees all new stories and feedback -> User can replay manually via email or mark stories to appear on landing page <br/>
Success: All new uncompleted tasks have been completed  

## 📋 Features

- [x] A landing page contains informational content. The design provided [here](https://www.figma.com/proto/Biyqs68POkyUfRYrubfttV/Surname-Project?kind=proto&node-id=9-4&page-id=0%3A1&scaling=min-zoom&starting-point-node-id=9%3A4) contains the main.
- [x] Share Your Story is a page where everyone can share his story through a form. After approval by the product owner, shared stories, will appear in a carousel on the landing page.
- [x] On a Feedback page, everyone can leave feedback for the product owner to read.
- [x] A Legal Notice page contains by German law needed information.
- [x] Users can express their gratitude for the content provided via a [buy me a coffee](https://buymeacoffee.com/)-button.
- [x] User can switch the language from English to German.
- [x] User can switch between light and dark theme.
- [x] Product owner can see submitted shared stories in a password protected admin view and publish or delete them.
- [x] Product owner can see submitted feedback and delete them after reading them.
- [x] ~~To prevent misuse, an IP address can at most send 3 requests per day. A request is a feedback or a shared story.~~ Relay on Hetzner default mechanism for simplicity regarding DSVGO.

## 🛑 Explicit out of scope

- We don't need user accounts.
- We don't need real time feedback for provided feedback.
- Monetization through ad network integration is not planned for now.


## ✨ Design

- The landing page is designed as provided in figma layout [here](https://www.figma.com/proto/Biyqs68POkyUfRYrubfttV/Surname-Project?kind=proto&node-id=9-4&page-id=0%3A1&scaling=min-zoom&starting-point-node-id=9%3A4).
- Utilize Material 3 Design Kit in Rose light and dark theme.
- The logo of the web app is provided in [logo.svg](../assets/logo.svg).
- The web app should be responsive for Desktop, Tablet and Mobile use.
- The tone should be warm, non-judgemental and inclusive.

## Further assumptions

- The donations provided via buy me a coffee will at most cover the hosting costs.
- There will be at most 10 provided feedback and shared stories per month. So manually maintenance by product owner is fine.

## 🔬 Technical details

Implementation stack, deployment, storage choices etc. intentionally deferred until prd is ready refined.