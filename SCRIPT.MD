This is a draft of the video script

Section 1 (Opening):

* The Functions Marketplace gives any developer the ability to sell their web2 integrations to web3 customers.
* Powered by Chainlink Functions, our product automates all stages of creating a custom, Oracle-based integration that
  makes web2 data available to the blockchain.
* Our streamlined deployment process automates all the web3 complexity, and is so easy to use that even web2 developers
  can sell their data on our marketplace
* Sellers who use our tools to launch their integrations can set a premium fee that will be charged when an external
  caller uses their integration in a contract. Our own Functions Manager contract collects the fees.
  Our web3 back end will collect fees on your behalf when an external user consumes your integration in their contract.
* We've eliminated the need for developers to reinvent the wheel.
* Using our marketplace, web3 developers can discover integrations and can start using web2 data in their smart
  contracts at the click of a button.
* Our contracts gathers profits on the behalf of those who sell their integrations, and requires no user intervention to
  manage the underlying, web3 components.
* In fact, our entire backend is based on web3 technologies, and provides our users with the security and transparency
  guarantees that they expect from a decentralized application.
* Let's dive in

Section 2 (Functions Overview):

1. This is how it works:
2. Functions let you run arbitrary javascript on a decentralized oracle network. It's one of the most accessible and
   flexible integrations available on the market.
3. However, they have two limitations.
4. First, they're a distinctly web3 pro require you to become familiar with Chainlink specific
   Second, since nodes are paid to run functions directly out of a Subscription, only authorized users, or more likely,
   contracts, can run your Function.

That's what the current tooling requires. You create a subscription, deploy a FunctionsConsumer contract, and then
authorize your contract to hit your subscription. And now you have a deployment that only you can access. Opening it up
to the world would let anyone drain your subscription.

But that's a real shame. Most people in the business are going to need integrations that hit popular APIs like
CoinGecko, CoinMarketCap, and the like. However, with the current limitations, every developer is going to have to
engineer and deploy their own Functions and contracts. This is a waste of time and money. We can do better.

Our solution is to automate all of this. Our FunctionsManager contract stores the definitions for multiple Functions and
gives users a common API to invoke them. That's great, but we then take it a step further and let users sell access to
their Functions. Using our FunctionsManager contract, a seller can specify a premium fee that's charged when an external
caller uses their Function to access web2 data in their contract. Like we said earlier, most people need a CoinMarketCap
integration, so why not write it once and let callers pay you to use it?

Let's see what that looks like in the app.

The economic benefit of this is going to depend mostly

and exposes them to external users. It

* Rather than spending time and money building a custom integration, web3 developers can use our marketplace to find and
  integrate the data they need in minutes.
* Our solution makes it so easy to create integrations that even web2 developers can use our application to sell their
  data.

* Our contracts automatically handle all of the overhead involved in using and managing access to a Chainlink Functions
  based integration,
* Our backend is entirely web3 based,
  Our application
* In exchange,
* The functions marketplace is a webapp and contract combo that calls functions on the behalf of someone.
*

* (WIB) Our product is a contract and webapp combo that leverages Chainlink Functions to ...
*
* Using our app, you can get up and running with Chainlink Functions in just a few minutes.
* Our contract setup automates 100% of all the Chainlink specific overhead involved in using Functions, such as managing
  subscriptions and permissions.
* Our webapp makes it so fast and easy to use functions that even Web2 developers can participate and sell their data to
  web3 customers
* Our contract allows
  Overview:

* Chainlink Functions let you run arbitrary javascript on a decentralized oracle network. It's one of the most
  accessible
* and flexible integrations available on the market. This is easy.
  But it's still a lot
*
* However, in its current state where functions require user
* This is still a lot of steps, and if you're not already invested in the Chainlink ecosystem,

* (Show in video) Please refer to the official documentation (link in the description) for
* Compared to external adapters

Disclaimer:
Before we get into the demo, I want to take a quick moment to provide the following disclaimer.

Section 3 (Home page, seller):

* (Short-1) Just a quick note
* (Short-2) Our product is completely separate from Chainlink Functions, but because we've automated all of the
  Chainlink parts, the lines may seem blurry at times.
* (Short-3) We've written a blurb that explains what our contract is doing versus what Chainlink Functions are doing.
  The link to this is in the description
* (1) This application is very tightly integrated with Chainlink Functions. The lines may seem blurred for those who
  aren't deeply familiar with Chainlink Functions, but this is a completely separate product that consumes Chainlink
  Functions.
* (2) We sometimes refer to "Chainlink Functions" as "Functions" in shorthand. In general "Functions" (plural) will
  refer to Chainlink's "Functions" product
* (3) The contract at the heart of our app is called the "FunctionsManager". This is our own contract and is completely
  unrelated to Chainlink Functions and the contracts used to run them.
* (4) Chainlink Functions are currently in Beta. Some bits of code have been copied from the the official starter kit (
  MIT).
* (5) We have taken care to put comments in the code when code was copied from an external source, whether or not the
  license strictly requires it.

Home page (Initial):

* (Intro - 1) Just a few notes before we get started.
* (Intro - 2) First, everything that we're showing here is real. Contracts are deployed to Mumbai, and you can access
  the live app at this link (Note in the video that the link is also in the description).
  (Intro - 3) Second, we use a contract backend for all marketplace interactions. The contract is also backend for most
  of the webapp.
  We use subgraphs for parts of the webapp, but even if it goes down,

* (Intro - Short) Let's take a look at the app.
* (2) On the home page, you'll see metrics for the marketplace, the three most recently added integrations, and a full
  list of all integrations being sold on the marketplace.
  Everything on the app is rendered in real time
* (3) Your experience with the app will vary based on whether you're selling or buying an integration.
  We'll start by looking at the Seller experience
* (4) As a seller, we're most interested in these "Sell" and "Dashboard" pages which are used to create and manage
  integrations.
* (5) Let's click on "Sell" to create a new integration now
* (3) If you want to sell your data to web3 customers, you're going to be most interested in the "Sell" and "Owner
  Dashboard" pages, linked here at the top.
* (3-2, Fluff) The "Sell" page lets you deploy a new function to the marketplace, and the
  "Owner Dashboard" lets you view stats and withdraw your earnings.
* (4) Your experience with the webapp will change depending on whether you want to either sell a web2 integration or
  consume it in your contract.
* (4 - Short) Your experience with the webapp will change depending on whether you want to either sell or buy data.
* (4-2) To help identify which experience is being demonstrated, we've added a little indicator here.
* (5) Since Functions are a relatively new offering, let's start by taking a look at the "Sell" page to better visualize
  how they're deployed.

Sell form:

* (1) Our "Sell" page consists of an easy-to-use form that you can use to build and deploy your Chainlink Functions
  based integration to our FunctionsManager contract.
* (2) There are two sections that a seller needs to fill out
* (3) The "Presentation" section lets you specify a name, a description, branding, and a category for display in the
  webapp.
  (3 - Short) The presentation section contains metadata about your integration that's displayed to potential buyers
  when they browse the marketplace.
* (4) The "Execution" section lets you specify how to run your integration, and is used for both execution as well as
  generating contracts
* (5 - Optional) The "Fee" text field represents the premium fee that external users will have to pay to use your
  integration.
* (6 - Option) We'll go into more details about fees when we demo the buyer experience.
* (7) There are additional advanced options that we have hidden by default, let's look at those now.
* (8) All of these options require a deep understanding of the Chainlink Functions ecosystem to modify, so we won't
  elaborate on these here, with one exception.
* (9) By default, the form will create a new subscription for use with your integration.
* (10) "Subscriptions" here are a Chainlink Functions specific concept.
* (11) Its what Chainlink charges you when your integration is executed on a Chainlink Oracle Network
* (12 - Fluff) Since the Function Beta doesn't have pricing tiers by volume, based on our experience, there's little
  reason to consolidate on a single subscription right now.
* (13 - (Can be shown it text)) That said, although we have written the code and tested this feature against mocks,
  we've **explicitly** disabled
  it because it would effectively bypass the limited BETA for Chainlink Functions that's ongoing right now.
* (13 - Short) - We've disabled this feature since it would bypass the limited beta for Chainlink Functions if left in.
* (14) I pre-filled this form, so let's go ahead and deploy this integration to the marketplace.
* (15) And there we go, we're live. Let's look at our dashboard.

# Section 4 (Owner Dashboard)

* The Dashboard provides sellers with detailed information about their integrations and Chainlink Functions
  subscriptions.
* At the top, I can see recent performance over the past week.
* In the listing, I can see my earnings per function, and can withdraw them on demand.
* At the bottom, I can see my Chainlink Functions subscriptions
* The FunctionsManager collects fees to pay Chainlink whenever your integration uses their oracle networks.
* for your subscription from Function callers on each call, and refills your
  subscription automaticaly when it runs low.
* The function I just created hasn't been used, so I don't have any earnings yet.
* Let's go back to the home page and take a loolk.

Let's now switch perspectives to see
what the app looks like from a caller's perspective.

* Back on the homepage, I can see my function listed in the "Recently Added" section and at the bottom.

# Section 5 (Home page, buyer):

* Back on the home page, I can see my function listed in the "Recently Added" section and at the listing at the bottom.
* Most content on the home page is geared towards buyers.
* Let's say I need to get the ETH-USD price in my contract.
* I can search for the integration here, and there it is.
* From here, I can do a live demo by clicking "Try", more on this later, or I can click the snippet button to get a
  snippet that I can paste directly into my contract if I want to get started.
* If I'm not convinced, I can click on the integration name to see more details in the drilldown
* Let's do that now.

# Section 6 (Buy page):

* The drilldown is designed to give me all the information I need to decide if this integration is a good fit for my
  contract.
* I can see the overall health of the integration at the top.
* I can see the snippet I saw on the home page, except here I can customize it to optimize for gas or to make it more
  ergonomic.
* (Pause for a moment to show snippet controls)
* Here I can see additional details about the function, including the full fee that I'll have to pay per use.
* You'll notice that this is higher than the premium fee we set when, as a seller, we created this integration.
* As a buyer, I'll have to pay all of the costs associated with running this integration.
* This includes a base fee of, as of this demo, 0.2 LINK that is paid to Chainlink and its Oracle Nodes when a Chainlink
  Function is run on their Oracle network.
* (Fluff) We've denoted that base fee here.
* Finally, we have the 10 most recent calls made to this function. I can see the most important details here at a
  glance, but if I click on the details button, I can also see the arguments used and the transaction hash for the call.

# Section 7 (Trial & Demo)

* Let's see this integration in action.
* As mentioned, everything shown in this demo is live and working.
* Let's make a live request to this integration to get the ETH-USD price
* If I want to give the integration I quick try, I can click "Try it now" to open a modal that lets me make a live
  request to the integration.
* I'll fill this out, sign the transaction, and then wait for the request to be fulfilled.
* There it is
* What about the snippet?
* Let's open up Remix and paste that snippet in.
* On the second screen, I have a page that's polls the ETH-USD price from Coingecko, and then from the chain, every 3
  seconds.
* When I run the snippet and give it a moment...
* There it is.
* What you're seeing here is incredible. In less than 5 minutes we've deployed a price feed that makes the ETH-USD price
  available on chain. But that's not all.
* We've also made that price feed accessible to anyone who wants to use it in their contract.
* Make no mistake, this is made possible by the accessibility and flexibility of Chainlink Functions.
* (Alt) This is made possible by the accessibility and flexibility of Chainlink Functions.
* Our product takes that accessibility to the next level by managing all of the Chainlink specific components, like
  subscriptions, automatically behind the things.

* As a seller, I've successfully s
*

# Section 8 (Closing)

* As you saw in the demo, our product lets developers create and deploy Oracle-based integrations in minutes.
* We've done this by abstracting away all of the complexity of Chainlink Functions, and by providing a simple, intuitive
  interface
* for creating and managing integrations.
* Sellers are able to profit off their integrations and data by making their integrations available to the public for a
  premium fee.
* On the other side, buyers who need access to web2 in their contracts no longer have to waste time and effort to build
  the exact same integrations as their peers.
* They just have to access the marketplace, copy the snippet, and paste it into their contract.

Closing slide:
Developers: Amit
Technologies used:
QuickNode, Chainlink, Satsuma

Description:
Everything in this demo is live at this link:
Source code:
DevPost:
FunctionsManager contract:

Developers:

- Amit (github)
- ad0ll (github)

Notes:

- We've programmed in support for Sepolia, but have only tested against Mumbai
- We've focused on "buying" and "selling" data here since data retrieval is easier to visualize in a presentation, but
  Chainlink Functions can be used for much more than that.

Our webform based deployment process re

Homepage (Transition to drilldown)

* Now that I've created my function, I can see it listed both in the "Recently Added" list, and then also at the top of
  the general listing at the bottom of the page.
* Now, lets say
* (Fluff) Let's take a closer look at my function by clicking its entry on the table.

Drilldown:

* When drilling into a function, you'll have immediate access to all information you need to decide if this function is
  a good fit for you.
* At the top, I can see the Function's global metrics to get a feel for how popular this listing is.
* The snippet we saw on the home page is here too, (medium pause) except in the drilldown, you can choose to customize
  the snippet to optimize for gas or to make the snippet more ergonomic.
* I can see all details of the function, also access the same "try it now" function that we saw on the homepage.
* (Variation) If I just want a preview, I can click the "Try it now" button for a one time call in the browser without
  having to
  deploy a contract.

  ergonomic by decoding values
* (Variation) Let's say I want to optimize for the lowest gas price possible. I can click on the "Customize" button and
  adjust the
  parameters for the snippet
* Additionally, we can see finer details about the functions, and can quickly copy and paste key values, such as the
  Function ID, for use in a custom contract.
* (Variation) In the drilldown, I can see the function name, the fee, the description, and other details about the
  function, including the Functionn ID, which I can quickly add to my clipboard for use in a custom contract.
* Finally, I can see a real time feed of the 10 most recent calls made to this function. At a glance, I can see the
  ultimate outcome of the function, but I can also click the "details" button to see the output of the function call
* Let's switch to a different account, and use the "Try it now" feature to call my function.
* (Tentative, not implemented) We also give you the ability to download and deploy a full FunctionsConsumer contract
  that is pre-wired to
  make requests to the FunctionsManager
* What you just saw is magical. In less than 10 minutes, we've registered a new Function, and have made it accessible to
  the
  world. We then used the "Try it now" button to send a request to the Decentralized Oracle Network. The Decentralized
  Oracle Network
  ran my function to get the ETH-USD price from CoinGecko, and then made the result accessible on chain.
* (More emphasis...)
* Now that the function has been run, I can see two things.

Owner dashboard

* Now lets say I want to sell my web2 data on the marketplace. To do that, I'll click on "Sell" to access the new
  function form.
* Here's the new function form. This form has a combination of metadata.
* By default, we use

By the way, everything shown in the demo is real and running against the Chainlink Functions contracts
You can access the marketplace at the link in the description (<- Show link in video)
(Show in video: Source code and READMEs can be found in the documentation as well)

Sell cut:

* In the sell form, I can fill out. Strictly for demo purposes, the live app has "Prefill" button that will load the
  form with metadata from a random demo Function we have.
* The majority of these fields are self explanatory, but there are a few things I want to call out.
    * First, the fee. You can choose to take your premium fee in USDC. When you select this option, two things happen.
    * First, your fees will be converted from LINK to USDC when they're collected
    * Second, your customers will pay a dynamic amount of LINK depending on the current market price of LINK.
    * For instance, if you have a premium fee of 0.10 USDC, and LINK is trading at $10, then your customers will pay
      0.01 LINK.
    * If LINK is trading at $100, then your customers will pay 0.001 LINK.
    * Your base fee of 0.2, which is reserved to pay your subscription, is collected in LINK.
* Second call out.
* In order to make this form easy to use for Web2 developers, we've concealed some of the complexity in the advanced
  options.
* (Variant) We want to make bootstrapping a new function seamless so Web2 vendors can sell their data on the
  marketplace. To accomplish this, we've concealed some of the complexity involved in deploying a Function.
* If I show the advanced options, I can see that, by default, that we'll use the existing Chainlink contracts on Mumbai,
  and that we'll create a new subscription.
* Note, we have all the code written for creating new subscriptions on demand, but we have deliberately disabled it
  since doing so such a function would effectively bypass the Functions beta waitlist.
* I'll load in a subscription I created ahead of time. Note, when specifying your own subscription, you (tx.origin) MUST
  be the owner of the subscription, and the FunctionsManager contract must be an authorized consumer.
* (Show note in video: We have written the code, but we explicitly disabled the ability to create new subscriptions in
  the contract since that would bypass the Chainlink Functions waitlist)
* ...Or we would, but that would bypass the Functions beta waitlist, so, while we've written the code, we've explicitly
  disabled it in the contract.

https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/GNOME_Weather_icon_2018.svg/256px-GNOME_Weather_icon_2018.svg.png?20190428085014
https://upload.wikimedia.org/wikipedia/commons/8/80/GNOME_Weather_icon_2018.svg
https://upload.wikimedia.org/wikipedia/commons/e/e9/OOjs_UI_icon_link-ltr-invert.svg
https://coinmarketcap.com/favicon.ico
https://coinpaprika.com/assets/img/cp-logo-small.svg

