
npm run build; cd dist/; git init; git add -A; git commit -m "deployment to GH Pages"; git push -f git@github.com:cinquemb/DeFiOptions-frontend.git master:gh-pages; cd ..;


LINK/USD-EP-24e18-1643356800
		
		- toggle pools
			- debug to make sure that related pool values are being added
				- make sure pool data is entering the state
				- have to toggle between two pools multiple times before something updates in the ui
				- other pool stats?

		- manage pool
			- governance related functions
				- add options
					- debug

				- add ranges
					- debug

			- non governance function executions
				- balanceExposure button
				- create options
					- debug
						- requires working pricefeed of data?
				- remove symbol
					- debug
						- requires working pricefeed of data?
				- create a bulk helper?
					- PoolManagementHelper
						- bulkRemove
						- bulkCreateOption (how much gas would x amount cost?)

			- validation and formatting of proper inputs
			
			- have buttons that properly format the input for as many fields as possible?
				- user friendly display of input values

		- pool governance
			- show what will be executed?
			- other proposal data?


		- protocol governance
			- show what will be executed?
			- other proposal data?

		
		- add incentivized functions
			- debug 

		- withdraw tokens
			- debug
		
		- hedgeExposure and transferTokensToCreditProvider function in pool manangerment
			- debug

		- select/remove multiple options accross pools to buy/sell/compute collateral requirements for [later]

		- list underlying feeds [later]
			- pull from government proposals?

		- contract viewers helper
			- Reader
				- udl feed addrs
				- symbol addrs
				- gov proposals
					- pool filter
					- protocol filter 


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