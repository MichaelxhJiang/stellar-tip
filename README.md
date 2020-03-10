# stellar-tip

Devpost Link: https://devpost.com/software/stellar-tip#updates

## Inspiration

We were exploring the vast potential of decentralized platforms like Stellar on the fintech industry and we discovered a unique way to support local content creators and open source developers.

## What it does

Stellar Tip is a chrome extension that enables users to tip both **crypto and fiat currency** to content creators and developers on platforms like **Youtube, Twitch, and Github**. Utilizing **Stellar's powerful decentralized platform**, Stellar Tip enables users to **instantly send transactions** to their favorite creators/developers **without being limited to currency or fees**.

On these supported platforms, creators and developers will specify their Stellar public key in their profile. For these people, Stellar Tip generates a custom tip button that fits the design of each respective platform on each of their pages. When a user clicks the tip button, a popup will appear, prompting the user with additional options such as asset selection and a sender alias name. Furthermore, Stellar Tip enables users to view their previous tips on the **Stellar blockchain** with links redirecting to the content that they tipped for.

Creators and developers can also download the Stellar Tip chrome extension to view the tips made to them through the Stellar Tip service.

In the backend of our service, we utilize Stellar's SDK to query previous transactions for a user on the **Stellar blockchain** and generate a URI following the **SEP 7 protocol** to open the user's favorite Stellar wallet with the transaction information preloaded. At the same time, we store additional metadata about the content creator's information on our own servers. This way, users can look back into their transaction history in the chrome extension and see the specific creator/developer's name, the platform, and an embedded link to look back on their content.


## How we built it

To build the chrome extension, we used **Google Chrome Extension SDK, HTML, JS, CSS, and jquery** to build the custom tip buttons, popups, and transaction history window.

To embed our UI/UX and retrieve the creator/developer's public Stellar key in the various platforms, we implemented **web scrapers** for Youtube, Twitch, and Github. We also used **Google Cloud's Youtube API** to easily retrieve the public Stellar key from Youtuber's profiles.

Our backend technologies consisted of **MongoDB, Node.js, Express.js, and Stellar SDK**. We integrated our own **caching mechanism** to reduce load and improve speed of retrieving metadata of the creator/developer that the user was tipping.

We integrated **Stellar's SDK and URI SDK** to generate the transaction operations to be processed in the Stellar network and the corresponding **SEP 7 URI**. Furthermore, we used Stellar's SDK to retrieve a user's previous transactions on the Stellar blockchain. In order to store additional metadata such as the creator/developer's names and URL to their page, we generate a unique ID for each transaction and store them on the blockchain in the memo field. This enables us to retrieve additional information that we store in our MongoDB database to provide a smooth UI/UX for user's looking back on their transaction histories.


## Challenges we ran into

We learned to use blockchain technologies for the first time during this hack. It was challenging to get up to speed quickly and actually develop a fully working end to end solution with Stellar's decentralized blockchain platform.

We found that integrating a **fully working end to end solution** came with challenges of compatibility and stability between all the various components that our team worked on. Hooking up everything at the end and making sure the whole system worked properly in different scenarios and edge cases was difficult.

## Accomplishments that we're proud of

We managed to build a **fully functional end to end solution** with support for three major platforms (Youtube, Github, and Twitch), along with support for both fiat and cryptocurrencies.

## What we learned

We learned a lot from this hack about the amazing potential of blockchain technologies and decentralized networks.

## What's next for Stellar Tip

We would like to improve security in our backend services and expand to more creative and open-source platforms. We would also like to expand our asset support to more currencies to truly connect the global market together and financially empower creators and developers across the world.
