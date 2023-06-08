This is a draft of the video script

Intro:

* The Functions Marketplace gives any developer the ability to sell their web2 integrations to web3 customers.
* Powered by Chainlink Functions, our product automates all stages of creating a custom, Oracle-based integration that
  makes web2 data available to the blockchain.
* Our streamlined deployment process automates all the web3 complexity, and is so easy to use that even web2 developers
  can sell their data on our marketplace
* Sellers who use our tools to launch their integrations can set a premium fee that will be charged when an external
  caller uses their integration in a contract. Our own Functions Manager contract collects the fees.
  Our web3 back end will collect fees on your behalf when an external user consumes your integration in their contract.
* We've eliminated the need for developers to reinvent the wheel.* Using our marketplace, web3 developers can find and
  integrate web2 data into their smart contracts at the
  click of a button.
* Our contracts gathers profits on the behalf of those who sell their integrations, and requires no user intervention to
  manage the underlying, web3 components.
* In fact, our entire backend is based on web3 technologies, and provides our users with the security and transparency
  guarantees that they expect from a decentralized application.

Intro transition:

* Simply put. Our products let you sell your web2 data on web3.
* It's simple. Our products let you sell your web2 data on web3.
* It's simple, our product lets you sell your web2 data to web3 customers.
* Simply put. Our products let you sell your web2 data to web3 customers.
* Let's dive in

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

This is easy. But it's still a lot
Let's dive in.
, and is entirely based on web3 technologies, which provides our users with the security and transparency guarantees
that they expect from a decentralized application.

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

* (Intro - 1) Just a quick note.
* (Intro - 2) Everything that we're showing here is real. Contracts are deployed to Mumbai, and you can access the
  webapp at this link (link is also in the description).uy;
* (Intro - Short) Let's take a look at the app.
* (2) When you get to the home page, you'll see a few links, real time metrics for the marketplace, the most recently
  added functions, and a listing of all integrations available for use in your web3 products.
* (3) Let's start by looking at the Seller experience
* (4) As a seller, we're most interested in these "Sell" and "Dashboard" pages which are used to create and manage
  integrations.
* (5) Let's click on "Sell" to create a new integration now
*
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

* On the home page, you'll see live stats for the marketplace that update in real time.
* Down here, you can see a listing of all functions currently available in the marketplace.
* Let's say I want to find a function that will give me the current price of Bitcoin in USD.
* Let's see what's available for the "Price Feed" category.
* (Long) Here we can see that there are 3 functions available for the "Price Feed" category, showing different functions
  that I can use to get the price of BTC. Let's go with CoinGecko for this demo since it has the cheapest fee.
* If I want to get up and running right away, I can click on the copy button over here to the right to get a fully
  functional snippet that I can paste into my contract.
* This all looks great,
* Let's create a new Function. To do this, I'll click on the "Sell" button on the navbar up here.
* If I want to learn more about the function, or if I want to tweak the snippet, I can click on the function name to
  view more details. Let's do that now.

Sell page:

Sell form:

* (1) The sell form lets you deploy your Function code to our FunctionsManager contract.
* (2 - Short) Our FunctionsManager contract lets you specify a name, a description, branding, and a category for display
  in the webapp.
* (2 - Long) Our FunctionsManager contract lets you specify a name, a description, branding, and a category.
* You can specify your premium fee, which is the profit you'll make on each call to your function.
* Down here are the parameters that we need to build a Request to send to the Decentralized Oracle Network that executes
  Functions code
* We'll fill in our source with a simple CoinGecko API call to get the price of Ethereum in USD.
* And finally we'll fill in additional metadata so the webapp can generate snippets and documentation for this function
  automatically.
* We want to make this process so easy that even Web2 developers can sell their data, so we've concealed some of the
  Chainlink specific complexity in the advanced options.
* By default, we'll create a new subscription for use with this function. But if you want to consolidate your functions
  into a single subscription, you can specify an existing subscription here. I'll do that now.
* We can also specify the initial deposit for a new subscription, and we
* (There's more...)
* (Short) I'll click submit and sign a few transactions to get my function deployed to the FunctionsManager contract...
  and we're done.
* When I click the submit button, I'll sign up to three transactions.
* First is to allow my account to transfer LINK to the FunctionsManager contract.
* Second, because I specified an existing subscription, is to authorize the FunctionsManager as a consumer of my
  subscription
* And finally is to deploy my function to the FunctionsManager contract.
* We'll wait a minute, and we're done. Let's look at the Owner Dashboard by clicking the link up here

# Owner Dashboard

* The Dashboard gives sellers gives sellers a quick overview of their functions and subscriptions.
* At the top, I can see recent performance over the past week.
* In the listing, I can see my earnings per function, and can withdraw them on demand.
* At the bottom, I can see my Chainlink Functions subscriptions.
* The FunctionsManager collects funds for your subscription from Function callers on each call, and refills your
  subscription automaticaly when it runs low.
* The function I just created hasn't been used, so I don't have any earnings yet. Let's now switch perspectives to see
  what the app looks like from a caller's perspective.
* Back on the homepage, I can see my function listed in the "Recently Added" section and at the bottom.
*

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

