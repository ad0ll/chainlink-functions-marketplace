This is a draft of the video script

Intro:

* In exchange,
* The functions marketplace is a webapp and contract combo that calls functions on the behalf of someone.
*

Overview:

* Chainlink Functions let you run arbitrary javascript on a decentralized oracle network.
* Compared to external adapters

Home page:

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

Sell form:

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

Homepage (Transition to drilldown)

* Now that I've created my function, I can see it listed both in the "Recently Added" list, and then also at the top of
  the general listing at the bottom of the page.
* (Fluff) Let's take a closer look at my function by clicking its entry on the table.

Drilldown:

* When drilling into a function, you'll have immediate access to all information you need to decide if this function is
  a good fit for you.
* At the top, I can see the Function's global metrics to get a feel for how popular this listing is.
* I can also access the same "try it now" function that we saw on the homepage.
* (Variation) If I just want a preview, I can click the "Try it now" button for a one time call in the browser without
  having to
  deploy a contract.
* The snippet we saw on the home page is here too, (medium pause) except in the drilldown, you can choose to customize
  the snippet to optimize for gas or to make the function call more
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
* What you just saw is magical. In less than 10 minutes, we've registered a new Function, have made it accessible to the
  world, and to to it all off, we just completed an end to end interaction with a real Oracle network.

Owner dashboard:

* Now lets say I want to sell my web2 data on the marketplace. To do that, I'll click on "Sell" to access the new
  function form.
* Here's the new function form. This form has a combination of metadata.
* By default, we use

By the way, everything shown in the demo is real and running against the Chainlink Functions contracts
You can access the marketplace at the link in the description (<- Show link in video)
(Show in video: Source code and READMEs can be found in the documentation as well)
