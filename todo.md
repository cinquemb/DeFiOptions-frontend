
npm run build; cd dist/; git init; git add -A; git commit -m "deployment to GH Pages"; git push -f git@github.com:cinquemb/DeFiOptions-frontend.git master:gh-pages; cd ..;


LINK/USD-EP-24e18-1643356800
		- issues
			- when hedginign manager set for pool, cannot trade
				- naked sell
				- covered sell
				- buy

		- toggle pools
			- debug to make sure that related pool values are being added
				- make sure pool data is entering the state
				- have to toggle between two pools multiple times before something updates in the ui
				- other pool stats?

		- manage pool

			- show balance of tokens in hedging manager contract (next to settle hedging manager balance)
			- show pool ideal delta and realized delta (next to rebalance hedge)

		- pool governance
			- show what will be executed?
			- other proposal data?


		- protocol governance
			- show what will be executed?
			- other proposal data?


		- select/remove multiple options accross pools to buy/sell/compute collateral requirements for [later]			
		- contract viewers helper
			- Reader		
				- udl feed addrs?
					- pull from government proposals?
					- pull from JSON


https://wiki.polygon.technology/docs/zkEVM/develop/
https://v2-docs.zksync.io/api/hardhat/getting-started.html

//truffle deploy --network mumbai


Mumbai Testnet
Show more details
Pair 	Proxy
BTC / USD 	0x007A22900a3B98143368Bd5906f8E17e9867581b
DAI / USD 	0x0FCAa9c899EC5A91eBc3D5Dd869De833b06fB046
ETH / USD 	0x0715A7794a1dc8e42615F059dD6e406A6594651A
EUR / USD 	0x7d7356bF6Ee5CDeC22B216581E48eCC700D0497A
LINK / MATIC 	0x12162c3E810393dEC01362aBf156D7ecf6159528
MATIC / USD 	0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada
SAND / USD 	0x9dd18534b8f456557d11B9DDB14dA89b2e52e308
USDC / USD 	0x572dDec9087154dC5dfBB1546Bb62713147e0Ab0
USDT / USD 	0x92C09849638959196E976289418e5973CC96d645

https://docs.chain.link/docs/data-feeds/price-feeds/addresses/


Smart contract bugs: https://nitter.lacontrevoie.fr/1nf0s3cpt/status/1583011233363824640